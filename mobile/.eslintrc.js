// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:@tanstack/query/recommended'],
  ignorePatterns: ['/dist/*'],
  plugins: ["@tanstack/query"],
  rules: {
    "@tanstack/query/exhaustive-deps": "error"
  }
};
