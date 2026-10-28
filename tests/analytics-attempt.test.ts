import { describe, it, expect } from 'vitest'
import { createAnalyticsAttempt, type AttemptEvent } from '../app/utils/analytics-attempt'
const storage=()=>{
 const values=new Map<string,string>()
 return {getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v)},removeItem:(k:string)=>{values.delete(k)}}
}
describe('versioned analytics attempts',()=>{
 it('restores one attempt through refresh/back/result rerender and starts a new identity only on Reset',()=>{
  const s=storage(),events:AttemptEvent[]=[]
  const create=()=>createAnalyticsAttempt({storage:s,instrument:'quiz',emit:e=>events.push(e)})
  const first=create();first.restore(false);first.mutate();first.mutate();first.result('solagree-fit');first.result('payment-options-consult');first.cta('solagree-fit')
  const restored=create();restored.restore(true);restored.mutate();restored.result('solagree-fit');restored.cta('solagree-fit')
  expect(events.filter(e=>e.type==='started')).toHaveLength(1);expect(events.filter(e=>e.type==='result')).toHaveLength(1)
  expect(new Set(events.map(e=>e.attemptId)).size).toBe(1)
  restored.reset();restored.mutate();expect(new Set(events.map(e=>e.attemptId)).size).toBe(2)
  expect(JSON.stringify(events)).not.toMatch(/answer|email|href|name|proof/)
 })
 it('a partial legacy snapshot records only its genuinely new explicit result',()=>{
  const events:AttemptEvent[]=[]
  const a=createAnalyticsAttempt({storage:storage(),instrument:'quiz',emit:e=>events.push(e)})
  a.restore(true);a.mutate();a.cta('solagree-fit');expect(events).toEqual([])
  a.result('solagree-fit');expect(events.map(e=>e.type)).toEqual(['result'])
 })
 it('legacy completed history stays excluded through edits, reload and result revisits until Reset',()=>{
  const s=storage(),events:AttemptEvent[]=[]
  const create=()=>createAnalyticsAttempt({storage:s,instrument:'quiz',emit:e=>events.push(e)})
  const legacy=create();legacy.restore(true,true);legacy.result('solagree-fit');legacy.mutate();legacy.result('solagree-fit');legacy.cta('solagree-fit')
  const restored=create();restored.restore(true,true);restored.result('solagree-fit');expect(events).toEqual([])
  restored.reset();restored.mutate();restored.result('solagree-fit');expect(events.map(e=>e.type)).toEqual(['started','result'])
 })
 it('qualifier updates retain latest result events and outcome-at-CTA without claiming questionnaire completion',()=>{
  const events:AttemptEvent[]=[]
  const a=createAnalyticsAttempt({storage:storage(),instrument:'qualifier',emit:e=>events.push(e)})
  a.restore(false);a.mutate();a.result('possible-fit');a.cta('possible-fit');a.result('ideal-fit')
  expect(events.map(e=>e.type)).toEqual(['started','result','cta','result'])
  expect(events[2]?.outcome).toBe('possible-fit')
 })
})
