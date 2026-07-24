import antfu from '@antfu/eslint-config'
import router from '@tanstack/eslint-plugin-router'
import reactCompiler from 'eslint-plugin-react-compiler'

export default antfu(
  {
    ignores: ['src/routeTree.gen.ts'],
    react: true,
    formatters: true,
  },
  ...router.configs['flat/recommended'],
  reactCompiler.configs.recommended,
  {
    name: 'githupdate/routes',
    files: ['src/routes/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
)
