module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'eslint-config-prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs','*.md','*.config.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh','simple-import-sort'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  },
}
