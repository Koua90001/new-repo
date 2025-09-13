cat > eslintrc.cjs <<'EOF'
module.exports = {
  env: { es2022: true, node: true },
  extends: ['airbnb-base'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-console': 'off',
  },
  ignorePatterns: ['logs/**'],
};
EOF

