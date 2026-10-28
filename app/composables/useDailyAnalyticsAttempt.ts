import { createAnalyticsAttempt, type AttemptEvent } from '~/utils/analytics-attempt'
import { createSafeBrowserStorage } from '~/utils/browser-storage'
import { parseBrowserMarketingCapture } from '~/services/marketing-origin'
import { normalizePortalApiBaseUrl } from '~/services/portal-api'
interface Pending { event:AttemptEvent, context:{journeyId:string,proof:string}|null }
/** Default-off capture also respects the existing host analytics setting. Failed delivery retains bounded PII-free retries. */
export const useDailyAnalyticsAttempt=(instrument:'quiz'|'qualifier',enabled:()=>boolean)=>{
  const config=useRuntimeConfig()
  const storage=createSafeBrowserStorage(()=>window.localStorage)
  const queueKey=`solagree.analytics.pending.v1:${instrument}`
  let sending=false
  const isEnabled=()=>import.meta.client&&config.public.analyticsCaptureEnabled===true&&enabled()
  const read=():Pending[]=>{
    try{const v=JSON.parse(storage.getItem(queueKey)??'[]') as unknown
      if(!Array.isArray(v))return []
      return v.filter((p):p is Pending=>Boolean(p&&typeof p==='object'&&'event' in p&&p.event&&typeof p.event==='object'&&'instrument' in p.event&&p.event.instrument===instrument)).slice(-100)
    }catch{return []}
  }
  const flush=async()=>{
    if(!isEnabled()||sending)return
    sending=true
    try{
      while(isEnabled()){
        const first=read()[0];if(!first)break
        await $fetch(`${normalizePortalApiBaseUrl(config.public.portalApiBaseUrl)}/api/analytics/capture`,{method:'POST',body:first,keepalive:true})
        storage.setItem(queueKey,JSON.stringify(read().filter(p=>p.event.eventId!==first.event.eventId)))
      }
    }catch{/* Retain exact event/context for the next interaction or reload. */}finally{sending=false}
  }
  const emit=(event:AttemptEvent)=>{
    if(!isEnabled())return
    const context=parseBrowserMarketingCapture(storage.getItem('solagree-marketing-origin-v1'))?.context??null
    storage.setItem(queueKey,JSON.stringify([...read(),{event,context}].slice(-100)))
    void flush()
  }
  const attempt=createAnalyticsAttempt({storage,instrument,emit})
  onMounted(()=>{void flush()})
  return {
    restore:(legacy:boolean,completed=false)=>{if(isEnabled())attempt.restore(legacy,completed)},
    mutate:()=>{if(isEnabled())attempt.mutate()},
    result:(outcome:string)=>{if(isEnabled())attempt.result(outcome)},
    cta:(outcome:string)=>{if(isEnabled())attempt.cta(outcome)},
    reset:()=>{if(isEnabled())attempt.reset()}
  }
}
