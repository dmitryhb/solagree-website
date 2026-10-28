/** Safe browser storage, with page-lifetime memory fallback after access, quota or removal failure. */
export interface BrowserStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}
/** Lazy access is inside the guard: even reading window.localStorage can throw SecurityError. */
export const createSafeBrowserStorage = (resolve: () => BrowserStorage): BrowserStorage => {
  const memory=new Map<string,string>()
  let failed=false
  return {
    getItem: key => {
      if(!failed)try { const value=resolve().getItem(key);if(value!==null)memory.set(key,value);return value }catch{failed=true}
      return memory.get(key)??null
    },
    setItem: (key,value) => { memory.set(key,value);if(!failed)try{resolve().setItem(key,value)}catch{failed=true} },
    removeItem: key => { memory.delete(key);if(!failed)try{resolve().removeItem(key)}catch{failed=true} }
  }
}
