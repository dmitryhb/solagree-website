import 'vue-router'

export type AppShell = 'home' | 'internal' | 'bare'

declare module 'vue-router' {
  interface RouteMeta {
    /** Controls the shared application chrome for a page route. */
    appShell?: AppShell
  }
}
