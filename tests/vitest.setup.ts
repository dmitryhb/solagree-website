import { nextTick, ref } from 'vue'
import { vi } from 'vitest'

// Nuxt consumes page metadata at compile time; bare Vue component tests need the macro stub.
Object.assign(globalThis, { nextTick, ref, definePageMeta: vi.fn() })
