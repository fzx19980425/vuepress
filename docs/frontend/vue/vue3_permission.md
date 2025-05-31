 # Vue 3 权限管理

Vue 3 权限管理推荐结合路由守卫、按钮权限、后端校验实现。这里对照 Vue2，介绍 Vue3 的权限管理方案。

## 1. 路由权限

```js
// src/router/permission.js
import router from './index'
import { useUserStore } from '@/store/user'

const whiteList = ['/login', '/register', '/404']

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const hasToken = userStore.token
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
```

## 2. 按钮权限

```vue
<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const hasPermission = computed(() => userStore.permissions.includes('edit'))
</script>

<template>
  <el-button v-if="hasPermission">编辑</el-button>
</template>
```

## 3. 后端校验
- 所有敏感操作需后端二次校验

## 4. 相关资源
- [Vue3 权限管理实践](https://juejin.cn/post/6983905960328069128)