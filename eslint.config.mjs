import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    '.nuxt/**',
    '.output/**',
    'dist/**',
    'node_modules/**'
  ],
  rules: {
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-control-regex': 'off',
    'vue/attributes-order': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off'
  }
})
