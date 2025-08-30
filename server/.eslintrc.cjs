module.exports = {
  env: { es2022: true, node: true },
  extends: ['airbnb-base'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-console': 'off',
    'no-plusplus': 'off', // allow ++ for simple counters/ids
    'arrow-parens': ['error', 'as-needed'], // allow single-arg arrow funcs without parens
    'object-curly-newline': 'off', // don’t force line breaks inside { ... }
    'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
  },
  ignorePatterns: ['logs/**'],
};
