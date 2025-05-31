# Vue 服务端渲染

本文将详细介绍 Vue 服务端渲染（SSR）的实现方法和最佳实践。

## Nuxt.js

### 基础概念

Nuxt.js 是一个基于 Vue.js 的全栈框架，它提供了：
- 服务端渲染
- 静态站点生成
- 自动路由
- 中间件支持
- 内置优化

### 项目创建

```bash
# 创建项目
npx nuxi init my-app
cd my-app
npm install
npm run dev

# 项目结构
my-app/
├── pages/
│   ├── index.vue
│   ├── about.vue
│   └── users/
│       └── [id].vue
├── components/
├── layouts/
├── middleware/
├── plugins/
├── public/
├── server/
└── nuxt.config.ts
```

### 页面路由

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <h1>首页</h1>
    <NuxtLink to="/about">关于我们</NuxtLink>
  </div>
</template>

<script setup>
// 页面数据获取
const { data: posts } = await useFetch('/api/posts')
</script>

<!-- pages/users/[id].vue -->
<template>
  <div>
    <h1>用户资料</h1>
    <div v-if="user">
      <p>姓名：{{ user.name }}</p>
      <p>邮箱：{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
// 获取路由参数
const route = useRoute()
const { data: user } = await useFetch(`/api/users/${route.params.id}`)
</script>
```

### 数据获取

```vue
<!-- 服务端数据获取 -->
<script setup>
// 使用 useAsyncData
const { data, pending, error } = await useAsyncData('users', () => 
  $fetch('/api/users')
)

// 使用 useFetch
const { data: posts } = await useFetch('/api/posts', {
  // 配置选项
  key: 'posts',
  transform: (posts) => posts.map(post => ({
    ...post,
    title: post.title.toUpperCase()
  })),
  watch: [page] // 监听数据变化
})

// 错误处理
const { data, error } = await useFetch('/api/data', {
  onError: (err) => {
    console.error('获取数据失败:', err)
  }
})
</script>

<!-- 客户端数据获取 -->
<script setup>
// 使用 ref 和 onMounted
const users = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('/api/users')
    users.value = await response.json()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
```

### 中间件

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')
  
  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})

// 使用中间件
<script setup>
definePageMeta({
  middleware: ['auth']
})
</script>

// 全局中间件
// nuxt.config.ts
export default defineNuxtConfig({
  router: {
    middleware: ['auth']
  }
})
```

### 状态管理

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const user = useState('user', () => null)
  const token = useCookie('token')

  const login = async (credentials) => {
    const { data } = await useFetch('/api/login', {
      method: 'POST',
      body: credentials
    })
    user.value = data.value
    token.value = data.value.token
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  return {
    user,
    login,
    logout
  }
}

// 使用状态
<script setup>
const { user, login, logout } = useAuth()

const handleLogin = async () => {
  await login({
    username: 'test',
    password: '123456'
  })
}
</script>
```

## 自定义 SSR 实现

### 基础实现

```javascript
// server.js
import { createApp } from './app'
import { renderToString } from '@vue/server-renderer'
import express from 'express'

const app = express()

app.get('*', async (req, res) => {
  const { app, router } = await createApp()

  // 设置路由
  await router.push(req.url)
  await router.isReady()

  // 渲染应用
  const html = await renderToString(app)
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR App</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script src="/client.js"></script>
      </body>
    </html>
  `)
})

app.listen(3000)
```

### 数据预取

```javascript
// app.js
import { createApp } from 'vue'
import { createRouter } from './router'
import { createStore } from './store'
import App from './App.vue'

export async function createApp() {
  const app = createApp(App)
  const router = createRouter()
  const store = createStore()

  app.use(router)
  app.use(store)

  // 数据预取
  router.beforeEach(async (to, from, next) => {
    const matched = router.getRoutes().filter(route => 
      to.matched.some(record => record.path === route.path)
    )

    // 获取组件的数据获取函数
    const asyncData = matched
      .map(route => route.component.asyncData)
      .filter(Boolean)

    try {
      // 执行数据获取
      await Promise.all(asyncData.map(fn => fn({ store, route: to })))
      next()
    } catch (err) {
      next(err)
    }
  })

  return { app, router, store }
}

// 组件数据获取
export default {
  async asyncData({ store, route }) {
    const { id } = route.params
    await store.dispatch('fetchUser', id)
  }
}
```

### 客户端激活

```javascript
// entry-client.js
import { createApp } from './app'

const { app, router, store } = await createApp()

// 等待路由就绪
await router.isReady()

// 挂载应用
app.mount('#app')

// 客户端激活
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
```

### 构建配置

```javascript
// webpack.config.js
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

// 服务端配置
const serverConfig = {
  target: 'node',
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}

// 客户端配置
const clientConfig = {
  entry: './src/entry-client.js',
  output: {
    filename: 'client-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}

module.exports = [
  merge(baseConfig, serverConfig),
  merge(baseConfig, clientConfig)
]
```

## 最佳实践

1. **性能优化**
   - 使用缓存
   - 实现流式渲染
   - 优化资源加载
   - 实现代码分割

2. **SEO 优化**
   - 添加元标签
   - 实现结构化数据
   - 优化页面标题
   - 处理动态内容

3. **开发体验**
   - 使用 TypeScript
   - 添加开发工具
   - 实现热重载
   - 编写测试

4. **部署策略**
   - 使用 CDN
   - 实现缓存策略
   - 配置负载均衡
   - 监控性能

## 常见问题

1. **渲染问题**
   - 水合不匹配
   - 状态同步
   - 样式闪烁
   - 性能问题

2. **数据问题**
   - 数据预取
   - 缓存策略
   - 状态管理
   - 错误处理

3. **部署问题**
   - 构建优化
   - 环境配置
   - 扩展性
   - 监控告警

## 下一步

在掌握了服务端渲染之后，您可以：
- 学习静态站点生成
- 学习边缘计算
- 学习性能优化
- 开始实践项目 