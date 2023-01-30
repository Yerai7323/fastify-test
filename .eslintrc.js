module.exports = {
  parserOptions: {
    project: './tsconfig.json'
  },
  extends: [
    './node_modules/ts-standard/eslintrc.json'
  ],
  plugins: [
    'no-loops'
  ],
  rules: {
    'no-loops/no-loops': 2
  }
}
