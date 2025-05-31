 # Vue 3 项目标准规范

## 1. 代码规范

### 1.1 ESLint + Prettier 配置

```js
// .eslintrc.js
module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'prettier'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
```

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "none",
  "arrowParens": "avoid",
  "endOfLine": "auto"
}
```

### 1.2 EditorConfig

```ini
# .editorconfig
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
[*.md]
trim_trailing_whitespace = false
```

## 2. 项目结构

```
src/
├── api/
├── assets/
├── components/
├── composables/        # 组合式 API 封装
├── config/
├── directives/
├── i18n/
├── layouts/
├── plugins/
├── router/
├── store/              # 推荐使用 pinia
├── styles/
├── utils/
├── views/
├── App.vue
└── main.js
```

## 3. 命名规范
- 组件：PascalCase
- 变量/方法：camelCase
- 文件夹/文件：kebab-case

## 4. 注释规范
- 文件头注释、函数注释、组件注释，推荐使用 JSDoc 风格

## 5. Git 工作流
- 分支管理、提交规范、版本管理，推荐 conventional commits

## 6. 性能优化
- 代码分割、懒加载、图片优化、keep-alive、异步组件

## 7. 测试规范
- 推荐使用 Vitest 或 Jest + Vue Test Utils

## 8. 相关资源
- [Vue3 风格指南](https://cn.vuejs.org/style-guide/)