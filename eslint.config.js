import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  plugins: ['react'],
  extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:react/recommended'],
  rules: {
    // 你的自定义规则
  },
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
  },
});
