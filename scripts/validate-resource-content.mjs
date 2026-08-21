import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, {
  alias: {
    '#shared': new URL('../shared', import.meta.url).pathname
  }
})

// Loading the source executes its validation before a production build starts.
jiti('../app/data/resource-content.ts')
