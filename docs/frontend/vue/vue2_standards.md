# Vue 2 项目标准规范

## 1. 代码规范

### 1.1 ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  rules: {
    // Vue 相关规则
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always'
      }
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    
    // JavaScript 相关规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }]
  }
}
```

### 1.2 Prettier 配置

```javascript
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

### 1.3 EditorConfig 配置

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
├── api/                # API 接口
│   ├── modules/       # 按模块划分的接口
│   └── index.js       # 接口统一导出
├── assets/            # 静态资源
│   ├── images/       # 图片资源
│   ├── styles/       # 样式文件
│   └── icons/        # 图标文件
├── components/        # 公共组件
│   ├── base/         # 基础组件
│   └── business/     # 业务组件
├── config/           # 配置文件
├── directives/       # 自定义指令
├── filters/          # 全局过滤器
├── layouts/          # 布局组件
├── locales/          # 国际化文件
├── mixins/           # 混入
├── plugins/          # 插件
├── router/           # 路由配置
├── store/            # Vuex 状态管理
│   ├── modules/      # 状态模块
│   └── index.js      # 状态入口
├── utils/            # 工具函数
├── views/            # 页面组件
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 3. 命名规范

### 3.1 文件命名

- 组件文件：使用 PascalCase（大驼峰）
  ```
  UserProfile.vue
  BaseButton.vue
  ```

- 工具类文件：使用 camelCase（小驼峰）
  ```
  request.js
  utils.js
  ```

- 样式文件：使用 kebab-case（短横线）
  ```
  main-style.scss
  variables.scss
  ```

### 3.2 变量命名

```javascript
// 常量使用大写字母和下划线
const API_BASE_URL = 'https://api.example.com'
const MAX_COUNT = 100

// 变量使用小驼峰
let userName = 'John'
let isLoading = false

// 私有变量以下划线开头
let _privateVar = 'private'
```

### 3.3 组件命名

```vue
<!-- 基础组件 -->
<template>
  <div class="base-button">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseButton'
}
</script>

<!-- 业务组件 -->
<template>
  <div class="user-profile">
    <!-- 组件内容 -->
  </div>
</template>

<script>
export default {
  name: 'UserProfile'
}
</script>
```

## 4. 注释规范

### 4.1 文件注释

```javascript
/**
 * @file 文件描述
 * @author 作者
 * @date 创建日期
 * @description 详细描述
 */
```

### 4.2 函数注释

```javascript
/**
 * 函数描述
 * @param {string} param1 - 参数1描述
 * @param {number} param2 - 参数2描述
 * @returns {boolean} 返回值描述
 * @example
 * functionExample('param1', 2)
 */
```

### 4.3 组件注释

```vue
<!--
 * @component 组件名称
 * @description 组件描述
 * @author 作者
 * @version 版本号
 * 
 * @example
 * <component-name
 *   :prop1="value1"
 *   :prop2="value2"
 *   @event1="handleEvent1"
 * />
 * 
 * @property {string} prop1 - 属性1描述
 * @property {number} prop2 - 属性2描述
 * @event {Function} event1 - 事件1描述
 -->
```

## 5. Git 工作流

### 5.1 分支管理

```bash
# 主分支
master        # 生产环境分支
develop       # 开发环境分支

# 功能分支
feature/xxx   # 新功能分支
bugfix/xxx    # 修复分支
hotfix/xxx    # 紧急修复分支
```

### 5.2 提交规范

```bash
# 提交格式
<type>(<scope>): <subject>

# 类型说明
feat:     新功能
fix:      修复
docs:     文档
style:    格式
refactor: 重构
test:     测试
chore:    构建过程或辅助工具的变动

# 示例
feat(user): 添加用户登录功能
fix(auth): 修复权限验证问题
docs(readme): 更新项目说明文档
```

### 5.3 版本管理

```json
// package.json
{
  "version": "1.0.0",
  "scripts": {
    "release:patch": "npm version patch",
    "release:minor": "npm version minor",
    "release:major": "npm version major"
  }
}
```

## 6. 性能优化

### 6.1 代码分割

```javascript
// router/index.js
const routes = [
  {
    path: '/user',
    component: () => import('@/views/user/index.vue')
  }
]
```

### 6.2 组件优化

```vue
<!-- 使用 v-show 替代 v-if -->
<template>
  <div>
    <div v-show="isVisible">内容</div>
  </div>
</template>

<!-- 使用 keep-alive 缓存组件 -->
<template>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>
```

### 6.3 图片优化

```javascript
// 使用 webp 格式
<img src="image.webp" alt="image">

// 使用懒加载
<img v-lazy="imageUrl" alt="image">
```

## 7. 测试规范

### 7.1 单元测试

```javascript
// tests/unit/example.spec.js
import { shallowMount } from '@vue/test-utils'
import Component from '@/components/Component.vue'

describe('Component.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(Component, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
```

### 7.2 E2E 测试

```javascript
// tests/e2e/specs/test.js
describe('Example Test', () => {
  it('should visit the app', () => {
    cy.visit('/')
    cy.contains('Welcome')
  })
})
```

## 8. 相关资源

- [Vue 风格指南](https://cn.vuejs.org/v2/style-guide/)
- [ESLint 配置](https://eslint.org/docs/user-guide/configuring)
- [Prettier 配置](https://prettier.io/docs/en/configuration.html)
- [Git 提交规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 