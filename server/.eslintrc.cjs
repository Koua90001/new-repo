module.exports = {
  env: { node: true, es2021: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  rules: {
    quotes: ['error', 'single'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'consistent-return': 'error',
    // the server doesn't use import rules; silence if pulled in indirectly
    'import/no-extraneous-dependencies': 'off',
  },
};
