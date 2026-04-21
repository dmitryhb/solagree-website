import type { RouterConfig } from '@nuxt/schema'

const ANCHOR_SCROLL_OFFSET = 96

const getHashSelector = (hash: string) => {
  try {
    return decodeURIComponent(hash)
  } catch {
    return hash
  }
}

export default <RouterConfig>{
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: getHashSelector(to.hash),
        top: ANCHOR_SCROLL_OFFSET,
        behavior: 'smooth'
      }
    }

    return {
      left: 0,
      top: 0
    }
  }
}
