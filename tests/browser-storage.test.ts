import { describe,it,expect } from 'vitest'
import { createSafeBrowserStorage } from '../app/utils/browser-storage'
describe('safe browser storage',()=>{
  it('survives a SecurityError when resolving storage and keeps edits/reset in memory',()=>{
    const s=createSafeBrowserStorage(()=>{throw new DOMException('denied','SecurityError')})
    expect(s.getItem('quiz')).toBeNull();s.setItem('quiz','answer');expect(s.getItem('quiz')).toBe('answer')
    s.removeItem('quiz');expect(s.getItem('quiz')).toBeNull()
  })
  for(const failure of ['getItem','setItem','removeItem'])it(`continues after ${failure} failure`,()=>{
    const values=new Map([['quiz','old snapshot']])
    const s=createSafeBrowserStorage(()=>({getItem:k=>{if(failure==='getItem')throw new Error('denied');return values.get(k)??null},
      setItem:(k,v)=>{if(failure==='setItem')throw new DOMException('full','QuotaExceededError');values.set(k,v)},
      removeItem:k=>{if(failure==='removeItem')throw new Error('denied');values.delete(k)}}))
    s.getItem('quiz');s.setItem('quiz','current');expect(s.getItem('quiz')).toBe('current');s.removeItem('quiz');expect(s.getItem('quiz')).toBeNull()
  })
})
