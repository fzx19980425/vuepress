# uni-app 网络请求

## 请求封装

### 基础封装

1. **请求工具类**
   ```js
   // utils/request.js
   const baseURL = 'https://api.example.com'
   const timeout = 10000

   class Request {
     constructor() {
       this.baseURL = baseURL
       this.timeout = timeout
       this.queue = new Map() // 请求队列
     }

     // 请求拦截
     interceptors = {
       request: (config) => {
         // 添加 token
         const token = uni.getStorageSync('token')
         if (token) {
           config.header = {
             ...config.header,
             'Authorization': `Bearer ${token}`
           }
         }
         return config
       },
       response: (response) => {
         // 处理响应
         const { statusCode, data } = response
         if (statusCode >= 200 && statusCode < 300) {
           return data
         }
         return Promise.reject(response)
       }
     }

     // 请求方法
     request(options) {
       options.url = this.baseURL + options.url
       options.timeout = this.timeout
       
       // 应用请求拦截
       options = this.interceptors.request(options)
       
       // 添加到请求队列
       const requestKey = `${options.url}_${options.method}`
       this.queue.set(requestKey, true)
       
       return new Promise((resolve, reject) => {
         uni.request({
           ...options,
           success: (res) => {
             // 从队列中移除
             this.queue.delete(requestKey)
             // 应用响应拦截
             resolve(this.interceptors.response(res))
           },
           fail: (err) => {
             this.queue.delete(requestKey)
             reject(err)
           }
         })
       })
     }

     // 便捷方法
     get(url, params = {}, options = {}) {
       return this.request({
         url,
         method: 'GET',
         data: params,
         ...options
       })
     }

     post(url, data = {}, options = {}) {
       return this.request({
         url,
         method: 'POST',
         data,
         ...options
       })
     }

     put(url, data = {}, options = {}) {
       return this.request({
         url,
         method: 'PUT',
         data,
         ...options
       })
     }

     delete(url, data = {}, options = {}) {
       return this.request({
         url,
         method: 'DELETE',
         data,
         ...options
       })
     }
   }

   export default new Request()
   ```

2. **API 模块**
   ```js
   // api/user.js
   import request from '@/utils/request'

   export const userApi = {
     // 登录
     login(data) {
       return request.post('/api/login', data)
     },

     // 获取用户信息
     getUserInfo() {
       return request.get('/api/user/info')
     },

     // 更新用户信息
     updateUserInfo(data) {
       return request.put('/api/user/info', data)
     },

     // 退出登录
     logout() {
       return request.post('/api/logout')
     }
   }

   // api/order.js
   export const orderApi = {
     // 获取订单列表
     getOrderList(params) {
       return request.get('/api/orders', params)
     },

     // 创建订单
     createOrder(data) {
       return request.post('/api/orders', data)
     },

     // 取消订单
     cancelOrder(orderId) {
       return request.put(`/api/orders/${orderId}/cancel`)
     }
   }
   ```

### 高级封装

1. **请求重试**
   ```js
   // utils/retry.js
   export function retry(fn, retries = 3, delay = 1000) {
     return new Promise((resolve, reject) => {
       function attempt() {
         fn().then(resolve).catch((error) => {
           if (retries === 0) {
             reject(error)
             return
           }
           setTimeout(() => {
             retries--
             attempt()
           }, delay)
         })
       }
       attempt()
     })
   }

   // 使用重试
   const fetchData = () => request.get('/api/data')
   retry(fetchData, 3, 1000)
     .then(data => console.log(data))
     .catch(error => console.error(error))
   ```

2. **请求取消**
   ```js
   // utils/cancelable.js
   export class CancelableRequest {
     constructor() {
       this.controller = null
     }

     request(options) {
       // 取消之前的请求
       if (this.controller) {
         this.controller.abort()
       }
       
       // 创建新的 AbortController
       this.controller = new AbortController()
       
       return new Promise((resolve, reject) => {
         uni.request({
           ...options,
           signal: this.controller.signal,
           success: resolve,
           fail: reject
         })
       })
     }

     cancel() {
       if (this.controller) {
         this.controller.abort()
         this.controller = null
       }
     }
   }
   ```

## 拦截器配置

### 请求拦截

1. **认证拦截**
   ```js
   // 请求拦截器
   const authInterceptor = {
     request: (config) => {
       // 获取 token
       const token = uni.getStorageSync('token')
       
       // 添加认证头
       if (token) {
         config.header = {
           ...config.header,
           'Authorization': `Bearer ${token}`
         }
       }
       
       // 刷新 token
       if (isTokenExpired(token)) {
         return refreshToken().then(newToken => {
           config.header.Authorization = `Bearer ${newToken}`
           return config
         })
       }
       
       return config
     }
   }
   ```

2. **参数处理**
   ```js
   // 参数拦截器
   const paramsInterceptor = {
     request: (config) => {
       // 处理 GET 参数
       if (config.method === 'GET' && config.data) {
         const params = new URLSearchParams()
         Object.keys(config.data).forEach(key => {
           params.append(key, config.data[key])
         })
         config.url += `?${params.toString()}`
         delete config.data
       }
       
       // 处理 POST 数据
       if (config.method === 'POST') {
         config.header = {
           ...config.header,
           'Content-Type': 'application/json'
         }
         config.data = JSON.stringify(config.data)
       }
       
       return config
     }
   }
   ```

### 响应拦截

1. **错误处理**
   ```js
   // 响应拦截器
   const errorInterceptor = {
     response: (response) => {
       const { statusCode, data } = response
       
       // 处理业务错误
       if (data.code !== 0) {
         const error = new Error(data.message)
         error.code = data.code
         error.data = data
         return Promise.reject(error)
       }
       
       // 处理 HTTP 错误
       if (statusCode >= 400) {
         const error = new Error('请求失败')
         error.statusCode = statusCode
         error.data = data
         
         // 处理特定状态码
         switch (statusCode) {
           case 401:
             // 未授权，跳转登录
             uni.redirectTo({ url: '/pages/login/login' })
             break
           case 403:
             // 无权限
             uni.showToast({
               title: '无权限访问',
               icon: 'none'
             })
             break
           case 500:
             // 服务器错误
             uni.showToast({
               title: '服务器错误',
               icon: 'none'
             })
             break
         }
         
         return Promise.reject(error)
       }
       
       return data
     }
   }
   ```

2. **数据转换**
   ```js
   // 数据转换拦截器
   const transformInterceptor = {
     response: (response) => {
       const { data } = response
       
       // 转换日期
       if (data.createTime) {
         data.createTime = new Date(data.createTime)
       }
       
       // 转换金额
       if (data.amount) {
         data.amount = Number(data.amount)
       }
       
       // 转换布尔值
       if (data.isActive !== undefined) {
         data.isActive = Boolean(data.isActive)
       }
       
       return data
     }
   }
   ```

## 错误处理

### 错误类型

1. **业务错误**
   ```js
   // 业务错误类
   class BusinessError extends Error {
     constructor(code, message, data) {
       super(message)
       this.name = 'BusinessError'
       this.code = code
       this.data = data
     }
   }

   // 使用业务错误
   const handleBusinessError = (error) => {
     if (error instanceof BusinessError) {
       switch (error.code) {
         case 1001:
           // 处理特定业务错误
           uni.showToast({
             title: '参数错误',
             icon: 'none'
           })
           break
         case 1002:
           uni.showToast({
             title: '资源不存在',
             icon: 'none'
           })
           break
         default:
           uni.showToast({
             title: error.message,
             icon: 'none'
           })
       }
     }
   }
   ```

2. **网络错误**
   ```js
   // 网络错误类
   class NetworkError extends Error {
     constructor(message, statusCode) {
       super(message)
       this.name = 'NetworkError'
       this.statusCode = statusCode
     }
   }

   // 处理网络错误
   const handleNetworkError = (error) => {
     if (error instanceof NetworkError) {
       // 检查网络状态
       uni.getNetworkType({
         success: (res) => {
           if (res.networkType === 'none') {
             uni.showToast({
               title: '网络连接已断开',
               icon: 'none'
             })
           } else {
             uni.showToast({
               title: '网络请求失败',
               icon: 'none'
             })
           }
         }
       })
     }
   }
   ```

### 错误处理

1. **全局错误处理**
   ```js
   // 全局错误处理
   const globalErrorHandler = (error) => {
     // 处理业务错误
     if (error instanceof BusinessError) {
       handleBusinessError(error)
       return
     }
     
     // 处理网络错误
     if (error instanceof NetworkError) {
       handleNetworkError(error)
       return
     }
     
     // 处理其他错误
     console.error('未处理的错误：', error)
     uni.showToast({
       title: '系统错误',
       icon: 'none'
     })
   }

   // 注册全局错误处理
   uni.onError(globalErrorHandler)
   ```

2. **请求错误处理**
   ```js
   // 请求错误处理
   const handleRequestError = async (error, config) => {
     // 处理业务错误
     if (error.code) {
       // 处理特定业务错误码
       switch (error.code) {
         case 401:
           // 处理未授权
           await handleUnauthorized()
           break
         case 403:
           // 处理无权限
           handleForbidden()
           break
         default:
           // 处理其他业务错误
           handleBusinessError(error)
       }
       return
     }
     
     // 处理网络错误
     if (error.errMsg) {
       handleNetworkError(error)
       return
     }
     
     // 处理其他错误
     console.error('请求错误：', error)
     uni.showToast({
       title: '请求失败',
       icon: 'none'
     })
   }
   ```

## 缓存策略

### 请求缓存

1. **内存缓存**
   ```js
   // 内存缓存
   class RequestCache {
     constructor(ttl = 5 * 60 * 1000) { // 默认 5 分钟
       this.cache = new Map()
       this.ttl = ttl
     }

     // 获取缓存
     get(key) {
       const item = this.cache.get(key)
       if (!item) return null
       
       // 检查是否过期
       if (Date.now() - item.timestamp > this.ttl) {
         this.cache.delete(key)
         return null
       }
       
       return item.data
     }

     // 设置缓存
     set(key, data) {
       this.cache.set(key, {
         data,
         timestamp: Date.now()
       })
     }

     // 清除缓存
     clear() {
       this.cache.clear()
     }
   }

   // 使用缓存
   const cache = new RequestCache()
   const fetchData = async (url) => {
     const cached = cache.get(url)
     if (cached) return cached
     
     const data = await request.get(url)
     cache.set(url, data)
     return data
   }
   ```

2. **持久化缓存**
   ```js
   // 持久化缓存
   class PersistentCache {
     constructor(ttl = 24 * 60 * 60 * 1000) { // 默认 24 小时
       this.ttl = ttl
     }

     // 获取缓存
     async get(key) {
       try {
         const item = uni.getStorageSync(key)
         if (!item) return null
         
         const { data, timestamp } = JSON.parse(item)
         if (Date.now() - timestamp > this.ttl) {
           uni.removeStorageSync(key)
           return null
         }
         
         return data
       } catch (e) {
         console.error('获取缓存失败：', e)
         return null
       }
     }

     // 设置缓存
     set(key, data) {
       try {
         const item = JSON.stringify({
           data,
           timestamp: Date.now()
         })
         uni.setStorageSync(key, item)
       } catch (e) {
         console.error('设置缓存失败：', e)
       }
     }

     // 清除缓存
     clear() {
       try {
         uni.clearStorageSync()
       } catch (e) {
         console.error('清除缓存失败：', e)
       }
     }
   }
   ```

### 缓存策略

1. **缓存优先**
   ```js
   // 缓存优先策略
   const cacheFirst = async (key, fetchData, ttl = 5 * 60 * 1000) => {
     const cache = new RequestCache(ttl)
     
     // 尝试获取缓存
     const cached = cache.get(key)
     if (cached) return cached
     
     try {
       // 获取新数据
       const data = await fetchData()
       cache.set(key, data)
       return data
     } catch (error) {
       // 如果有缓存，即使过期也返回
       if (cached) return cached
       throw error
     }
   }
   ```

2. **网络优先**
   ```js
   // 网络优先策略
   const networkFirst = async (key, fetchData, ttl = 5 * 60 * 1000) => {
     const cache = new RequestCache(ttl)
     
     try {
       // 尝试获取新数据
       const data = await fetchData()
       cache.set(key, data)
       return data
     } catch (error) {
       // 网络失败时使用缓存
       const cached = cache.get(key)
       if (cached) return cached
       throw error
     }
   }
   ```

## 请求优化

### 性能优化

1. **请求合并**
   ```js
   // 请求合并
   class RequestMerger {
     constructor(delay = 100) {
       this.delay = delay
       this.timer = null
       this.requests = new Map()
     }

     // 添加请求
     add(key, request) {
       if (!this.requests.has(key)) {
         this.requests.set(key, [])
       }
       
       return new Promise((resolve, reject) => {
         this.requests.get(key).push({ resolve, reject })
         
         if (!this.timer) {
           this.timer = setTimeout(() => {
             this.execute(key, request)
           }, this.delay)
         }
       })
     }

     // 执行请求
     async execute(key, request) {
       const callbacks = this.requests.get(key)
       this.requests.delete(key)
       this.timer = null
       
       try {
         const result = await request()
         callbacks.forEach(({ resolve }) => resolve(result))
       } catch (error) {
         callbacks.forEach(({ reject }) => reject(error))
       }
     }
   }

   // 使用请求合并
   const merger = new RequestMerger()
   const fetchUserInfo = (userId) => {
     return merger.add(`user_${userId}`, () => {
       return request.get(`/api/users/${userId}`)
     })
   }
   ```

2. **请求节流**
   ```js
   // 请求节流
   const throttle = (fn, delay = 1000) => {
     let lastCall = 0
     return function (...args) {
       const now = Date.now()
       if (now - lastCall >= delay) {
         lastCall = now
         return fn.apply(this, args)
       }
     }
   }

   // 使用节流
   const throttledRequest = throttle((url) => {
     return request.get(url)
   }, 1000)
   ```

### 体验优化

1. **加载状态**
   ```js
   // 加载状态管理
   const loadingManager = {
     count: 0,
     show() {
       if (this.count === 0) {
         uni.showLoading({
           title: '加载中...',
           mask: true
         })
       }
       this.count++
     },
     hide() {
       this.count--
       if (this.count === 0) {
         uni.hideLoading()
       }
     }
   }

   // 使用加载状态
   const requestWithLoading = async (request) => {
     loadingManager.show()
     try {
       const result = await request()
       return result
     } finally {
       loadingManager.hide()
     }
   }
   ```

2. **错误重试**
   ```js
   // 错误重试
   const retryWithBackoff = async (fn, retries = 3, baseDelay = 1000) => {
     let lastError
     
     for (let i = 0; i < retries; i++) {
       try {
         return await fn()
       } catch (error) {
         lastError = error
         
         // 计算延迟时间
         const delay = baseDelay * Math.pow(2, i)
         await new Promise(resolve => setTimeout(resolve, delay))
       }
     }
     
     throw lastError
   }

   // 使用重试
   const fetchWithRetry = (url) => {
     return retryWithBackoff(
       () => request.get(url),
       3,
       1000
     )
   }
   ```

## 最佳实践

### 开发建议

1. **代码组织**
   - 统一请求封装
   - 模块化 API 管理
   - 清晰的错误处理

2. **性能考虑**
   - 合理使用缓存
   - 避免重复请求
   - 优化请求时机

3. **安全考虑**
   - 数据加密传输
   - 防止 XSS 攻击
   - 敏感信息保护

### 注意事项

1. **平台差异**
   - 网络状态检测
   - 请求超时处理
   - 错误码兼容

2. **性能问题**
   - 请求队列管理
   - 内存占用控制
   - 缓存策略优化

3. **兼容问题**
   - 版本兼容性
   - 平台兼容性
   - 降级方案 