# Vue 2 网络请求与数据管理

## 1. Axios 封装

### 1.1 基础配置

```javascript
// utils/request.js
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = store.getters.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据自定义错误码判断请求是否成功
    if (res.code !== 200) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      
      // 处理特定错误码
      if (res.code === 401) {
        // token 过期或未登录
        store.dispatch('user/resetToken')
        router.push('/login')
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误：', error)
    Message({
      message: error.message || '请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
```

### 1.2 请求方法封装

```javascript
// api/request.js
import request from '@/utils/request'

// GET 请求
export function get(url, params) {
  return request({
    url,
    method: 'get',
    params
  })
}

// POST 请求
export function post(url, data) {
  return request({
    url,
    method: 'post',
    data
  })
}

// PUT 请求
export function put(url, data) {
  return request({
    url,
    method: 'put',
    data
  })
}

// DELETE 请求
export function del(url, params) {
  return request({
    url,
    method: 'delete',
    params
  })
}

// 上传文件
export function upload(url, file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
```

### 1.3 错误处理

```javascript
// utils/error-handler.js
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 错误码映射
const errorMap = {
  400: '请求错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

// 统一错误处理
export function handleError(error) {
  if (error.response) {
    const { status } = error.response
    const message = errorMap[status] || '未知错误'
    
    // 处理特定状态码
    switch (status) {
      case 401:
        // 清除 token 并跳转到登录页
        store.dispatch('user/resetToken')
        router.push('/login')
        break
      case 403:
        router.push('/403')
        break
      case 404:
        router.push('/404')
        break
      default:
        Message.error(message)
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    Message.error('网络错误，请检查您的网络连接')
  } else {
    // 请求配置出错
    Message.error(error.message)
  }
  
  return Promise.reject(error)
}
```

## 2. 接口统一管理

### 2.1 接口模块化

```javascript
// api/user.js
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// api/order.js
import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

export function createOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}
```

### 2.2 接口类型定义

```typescript
// types/api.d.ts
// 用户相关接口
interface LoginParams {
  username: string
  password: string
}

interface UserInfo {
  id: number
  username: string
  avatar: string
  roles: string[]
}

// 订单相关接口
interface OrderListParams {
  page: number
  pageSize: number
  status?: string
}

interface Order {
  id: number
  orderNo: string
  amount: number
  status: string
  createTime: string
}

// API 响应格式
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}
```

## 3. 请求状态管理

### 3.1 Loading 状态

```javascript
// store/modules/app.js
const state = {
  loading: false,
  loadingCount: 0
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },
  INCREMENT_LOADING(state) {
    state.loadingCount++
    state.loading = true
  },
  DECREMENT_LOADING(state) {
    state.loadingCount--
    if (state.loadingCount === 0) {
      state.loading = false
    }
  }
}

// 在请求拦截器中使用
service.interceptors.request.use(
  config => {
    store.commit('app/INCREMENT_LOADING')
    return config
  },
  error => {
    store.commit('app/DECREMENT_LOADING')
    return Promise.reject(error)
  }
)

// 在响应拦截器中使用
service.interceptors.response.use(
  response => {
    store.commit('app/DECREMENT_LOADING')
    return response
  },
  error => {
    store.commit('app/DECREMENT_LOADING')
    return Promise.reject(error)
  }
)
```

### 3.2 错误重试

```javascript
// utils/retry.js
import axios from 'axios'

// 创建重试实例
const retryInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000
})

// 重试配置
const retryConfig = {
  retries: 3,
  retryDelay: 1000,
  retryableStatus: [408, 500, 502, 503, 504]
}

// 重试拦截器
retryInstance.interceptors.response.use(null, async error => {
  const { config } = error
  
  // 如果没有配置重试，直接返回错误
  if (!config || !config.retry) {
    return Promise.reject(error)
  }
  
  // 设置重试次数
  config.__retryCount = config.__retryCount || 0
  
  // 检查是否超过重试次数
  if (config.__retryCount >= retryConfig.retries) {
    return Promise.reject(error)
  }
  
  // 增加重试次数
  config.__retryCount++
  
  // 延迟重试
  const delay = new Promise(resolve => {
    setTimeout(resolve, retryConfig.retryDelay)
  })
  
  await delay
  
  // 重新发起请求
  return retryInstance(config)
})
```

## 4. 前端 Mock 数据

### 4.1 Mock.js 配置

```javascript
// mock/index.js
import Mock from 'mockjs'
import user from './modules/user'
import order from './modules/order'

// 设置延迟时间
Mock.setup({
  timeout: '200-600'
})

// 注册 mock 接口
Object.keys(user).forEach(key => {
  Mock.mock(new RegExp(key), user[key])
})

Object.keys(order).forEach(key => {
  Mock.mock(new RegExp(key), order[key])
})

export default Mock
```

### 4.2 Mock 数据模块

```javascript
// mock/modules/user.js
export default {
  '/user/login': (options) => {
    const { username, password } = JSON.parse(options.body)
    if (username === 'admin' && password === '123456') {
      return {
        code: 200,
        data: {
          token: 'mock-token',
          userInfo: {
            id: 1,
            username: 'admin',
            roles: ['admin']
          }
        },
        message: '登录成功'
      }
    } else {
      return {
        code: 401,
        message: '用户名或密码错误'
      }
    }
  },
  
  '/user/info': {
    code: 200,
    data: {
      id: 1,
      username: 'admin',
      avatar: 'https://example.com/avatar.jpg',
      roles: ['admin']
    },
    message: '获取成功'
  }
}
```

## 5. 最佳实践

### 5.1 请求取消

```javascript
// utils/request.js
import axios from 'axios'

// 创建取消令牌
const CancelToken = axios.CancelToken
const pendingRequests = new Map()

// 生成请求的唯一键
const generateRequestKey = config => {
  const { url, method, params, data } = config
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 添加请求取消功能
service.interceptors.request.use(
  config => {
    const requestKey = generateRequestKey(config)
    
    // 如果存在相同的请求，则取消之前的请求
    if (pendingRequests.has(requestKey)) {
      const cancel = pendingRequests.get(requestKey)
      cancel('重复请求被取消')
      pendingRequests.delete(requestKey)
    }
    
    // 创建新的取消令牌
    config.cancelToken = new CancelToken(cancel => {
      pendingRequests.set(requestKey, cancel)
    })
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 请求完成后删除取消令牌
service.interceptors.response.use(
  response => {
    const requestKey = generateRequestKey(response.config)
    pendingRequests.delete(requestKey)
    return response
  },
  error => {
    if (axios.isCancel(error)) {
      console.log('请求被取消：', error.message)
    }
    return Promise.reject(error)
  }
)
```

### 5.2 请求缓存

```javascript
// utils/cache.js
const cache = new Map()

export function cacheRequest(config) {
  const { url, method, params, data } = config
  const key = [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
  
  // 检查缓存
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key)
    // 检查缓存是否过期（5分钟）
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return Promise.resolve(data)
    }
    cache.delete(key)
  }
  
  // 发起请求
  return service(config).then(response => {
    cache.set(key, {
      data: response,
      timestamp: Date.now()
    })
    return response
  })
}
```

### 5.3 请求队列

```javascript
// utils/queue.js
class RequestQueue {
  constructor() {
    this.queue = []
    this.processing = false
  }
  
  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject
      })
      this.process()
    })
  }
  
  async process() {
    if (this.processing || this.queue.length === 0) {
      return
    }
    
    this.processing = true
    const { request, resolve, reject } = this.queue.shift()
    
    try {
      const response = await request()
      resolve(response)
    } catch (error) {
      reject(error)
    } finally {
      this.processing = false
      this.process()
    }
  }
}

export const requestQueue = new RequestQueue()
```

## 6. 相关资源

- [Axios 官方文档](https://axios-http.com/zh/)
- [Mock.js 官方文档](http://mockjs.com/)
- [Vue 项目中的 Axios 封装](https://juejin.cn/post/6844904033786978311) 