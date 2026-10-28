import type { BrowserStorage } from './browser-storage'
/** Versioned browser behavior only. No answers, names, email, URL or inferred person identity. */
export interface AttemptEvent {
  eventId:string
  attemptId:string
  instrument:'quiz'|'qualifier'
  schemaVersion:1
  type:'started'|'result'|'cta'
  occurredAt:string
  outcome:string|null
  action:'solagree-consult'|null
}
interface AttemptState { id:string, started:boolean, result:boolean, legacy:boolean }
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
/** Stable metadata is separate from the existing answer snapshot/TTL. Only explicit Reset starts a new attempt. */
export const createAnalyticsAttempt=(input:{storage:BrowserStorage,instrument:'quiz'|'qualifier',emit:(event:AttemptEvent)=>void,now?:()=>Date,id?:()=>string})=>{
  const key=`solagree.analytics.attempt.v1:${input.instrument}`
  const id=input.id??(()=>crypto.randomUUID()),now=input.now??(()=>new Date())
  let state:AttemptState|null=null
  try{const v=JSON.parse(input.storage.getItem(key)??'null') as AttemptState|null
    if(v&&uuid.test(v.id)&&typeof v.started==='boolean'&&typeof v.result==='boolean'&&typeof v.legacy==='boolean')state=v
  }catch{/* Damaged metadata cannot create trusted historical milestones. */}
  const save=()=>{if(state)input.storage.setItem(key,JSON.stringify(state))}
  const init=(legacy:boolean)=>{if(!state){state={id:id(),started:false,result:false,legacy};save()}}
  const send=(type:AttemptEvent['type'],outcome:string|null,action:'solagree-consult'|null=null)=>{
    if(!state)init(false)
    input.emit({eventId:id(),attemptId:state!.id,instrument:input.instrument,schemaVersion:1,type,occurredAt:now().toISOString(),outcome,action})
  }
  return {
    restore:(legacy:boolean)=>init(legacy),
    mutate:()=>{init(false);if(!state!.started&&!state!.legacy){state!.started=true;save();send('started',null)}},
    result:(outcome:string)=>{init(false);if(input.instrument==='qualifier'||!state!.result){state!.result=true;save();send('result',outcome)}},
    cta:(outcome:string)=>{if(state?.result)send('cta',outcome,'solagree-consult')},
    reset:()=>{state={id:id(),started:false,result:false,legacy:false};save()}
  }
}
