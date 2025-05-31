 # Vue 3 路由管理

Vue 3 使用 vue-router@4，支持更强大的路由功能。这里对照 Vue2，介绍 Vue3 的路由配置与用法。

## 1. 安装 vue-router@4

```bash
npm install vue-router@4
```

## 2. 基本配置

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: () => import('@/views/About.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

## 3. 路由守卫

```js
router.beforeEach((to, from, next) => {
  // 权限校验等
  next()
})
```

## 4. 动态路由

```js
router.addRoute({ path: '/admin', component: Admin })
```

## 5. 嵌套路由、懒加载、路由元信息等同 Vue2

## 6. 相关资源
- [vue-router@4 官方文档](https://router.vuejs.org/zh/)