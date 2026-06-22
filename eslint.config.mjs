import github from 'eslint-plugin-github'
import prettier from 'eslint-config-prettier/flat'

export default [
  {
    ignores: ['dist/']
  },
  github.getFlatConfigs().recommended,
  github.getFlatConfigs().browser,
  ...github.getFlatConfigs().typescript,
  prettier,
  {
    rules: {
      'no-invalid-this': 'off'
    }
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-empty-function': 'off'
    }
  },
  {
    files: ['*.config.ts'],
    rules: {
      'import/no-unresolved': 'off'
    }
  }
]
