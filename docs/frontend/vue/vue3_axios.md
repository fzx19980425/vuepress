# Vue 3 网络请求

Vue 3 推荐继续使用 axios 进行网络请求。这里对照 Vue2，展示在 setup 下的用法和最佳实践。

## 1. 安装 axios

```bash
npm install axios
```

## 2. 基本用法

```vue
<script setup>
import axios from 'axios'
import { ref } from 'vue'

const data = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchData() {
  loading.value = true
  try {
    const res = await axios.get('/api/data')
    data.value = res.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button @click="fetchData">获取数据</button>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error }}</div>
    <div v-else>{{ data }}</div>
  </div>
</template>
```

## 3. 全局配置与拦截器

```js
// src/utils/request.js
import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 可添加 token
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, error => Promise.reject(error))

// 响应拦截器
service.interceptors.response.use(
  response => response.data,
  error => {
    // 统一错误处理
    if (error.response) {
      if (error.response.status === 401) {
        // 处理未授权
      }
    }
    return Promise.reject(error)
  }
)

export default service
```

## 4. 在组件中使用

```vue
<script setup>
import request from '@/utils/request'
import { ref } from 'vue'

const user = ref(null)
async function getUser() {
  user.value = await request.get('/user')
}
</script>
```

## 5. 错误处理与最佳实践
- 统一封装请求，便于维护
- 错误提示可结合全局消息组件（如 Element Plus ElMessage）
- 推荐使用 async/await 语法

## 6. 相关资源
- [axios 官方文档](https://axios-http.com/)
- [Vue3 + axios 实践](https://cn.vuejs.org/guide/scaling-up/tooling.html#http-%E5%BA%93)