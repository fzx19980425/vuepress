# uni-app 路由管理

## 路由配置

### 页面配置

1. **基础配置**
   ```json
   // pages.json
   {
     "pages": [
       {
         "path": "pages/index/index",
         "style": {
           "navigationBarTitleText": "首页",
           "enablePullDownRefresh": true
         }
       },
       {
         "path": "pages/user/profile",
         "style": {
           "navigationBarTitleText": "个人中心",
           "navigationStyle": "custom"
         }
       }
     ],
     "globalStyle": {
       "navigationBarTextStyle": "black",
       "navigationBarTitleText": "uni-app",
       "navigationBarBackgroundColor": "#F8F8F8",
       "backgroundColor": "#F8F8F8"
     }
   }
   ```

2. **页面样式配置**
   ```json
   {
     "style": {
       // 导航栏标题
       "navigationBarTitleText": "页面标题",
       
       // 导航栏样式
       "navigationBarTextStyle": "white",
       "navigationBarBackgroundColor": "#000000",
       
       // 导航栏显示
       "navigationStyle": "default",
       
       // 下拉刷新
       "enablePullDownRefresh": true,
       "backgroundTextStyle": "dark",
       
       // 上拉加载
       "onReachBottomDistance": 50,
       
       // 页面背景
       "backgroundColor": "#F8F8F8",
       
       // 页面动画
       "animationType": "slide-in-right",
       "animationDuration": 300
     }
   }
   ```

3. **分包配置**
   ```json
   {
     "subPackages": [
       {
         "root": "packageA",
         "pages": [
           {
             "path": "pages/cat",
             "style": {
               "navigationBarTitleText": "cat"
             }
           }
         ]
       },
       {
         "root": "packageB",
         "pages": [
           {
             "path": "pages/dog",
             "style": {
               "navigationBarTitleText": "dog"
             }
           }
         ]
       }
     ]
   }
   ```

### 路由模式

1. **页面栈模式**
   ```js
   // 页面栈管理
   const pages = getCurrentPages()
   const currentPage = pages[pages.length - 1]
   const prevPage = pages[pages.length - 2]
   ```

2. **TabBar 模式**
   ```json
   {
     "tabBar": {
       "color": "#7A7E83",
       "selectedColor": "#3cc51f",
       "borderStyle": "black",
       "backgroundColor": "#ffffff",
       "list": [
         {
           "pagePath": "pages/index/index",
           "iconPath": "static/image/icon_component.png",
           "selectedIconPath": "static/image/icon_component_HL.png",
           "text": "首页"
         },
         {
           "pagePath": "pages/user/profile",
           "iconPath": "static/image/icon_API.png",
           "selectedIconPath": "static/image/icon_API_HL.png",
           "text": "我的"
         }
       ]
     }
   }
   ```

## 路由守卫

### 全局守卫

1. **页面跳转拦截**
   ```js
   // main.js
   const whiteList = ['/pages/index/index', '/pages/login/login']
   
   // 页面跳转拦截
   uni.addInterceptor('navigateTo', {
     invoke(e) {
       // 获取 token
       const token = uni.getStorageSync('token')
       if (!token && !whiteList.includes(e.url)) {
         uni.redirectTo({
           url: '/pages/login/login'
         })
         return false
       }
       return true
     }
   })
   ```

2. **请求拦截**
   ```js
   // 请求拦截
   uni.addInterceptor('request', {
     invoke(args) {
       // 添加 token
       const token = uni.getStorageSync('token')
       if (token) {
         args.header = {
           ...args.header,
           'Authorization': `Bearer ${token}`
         }
       }
     },
     success(args) {
       // 处理响应
       if (args.statusCode === 401) {
         uni.redirectTo({
           url: '/pages/login/login'
         })
       }
     }
   })
   ```

### 页面守卫

1. **页面进入守卫**
   ```js
   export default {
     onLoad(options) {
       // 页面加载时执行
       this.checkPermission()
     },
     onShow() {
       // 页面显示时执行
       this.refreshData()
     },
     onReady() {
       // 页面就绪时执行
       this.initPage()
     }
   }
   ```

2. **页面离开守卫**
   ```js
   export default {
     onUnload() {
       // 页面卸载时执行
       this.clearTimer()
     },
     onHide() {
       // 页面隐藏时执行
       this.savePageState()
     },
     onBackPress() {
       // 返回按钮点击时执行
       if (this.hasUnsavedChanges) {
         uni.showModal({
           title: '提示',
           content: '有未保存的更改，确定要离开吗？',
           success: (res) => {
             if (res.confirm) {
               return false
             }
           }
         })
         return true
       }
     }
   }
   ```

## 页面跳转

### 基础跳转

1. **页面导航**
   ```js
   // 保留当前页面，跳转到应用内的某个页面
   uni.navigateTo({
     url: '/pages/detail/detail?id=1',
     success: function(res) {
       // 成功回调
     },
     fail: function(err) {
       // 失败回调
     }
   })

   // 关闭当前页面，跳转到应用内的某个页面
   uni.redirectTo({
     url: '/pages/detail/detail?id=1'
   })

   // 关闭所有页面，打开到应用内的某个页面
   uni.reLaunch({
     url: '/pages/index/index'
   })

   // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   uni.switchTab({
     url: '/pages/index/index'
   })

   // 返回上一页面或多级页面
   uni.navigateBack({
     delta: 1
   })
   ```

2. **页面传参**
   ```js
   // 页面跳转传参
   uni.navigateTo({
     url: '/pages/detail/detail?id=1&type=2'
   })

   // 页面接收参数
   export default {
     onLoad(options) {
       const { id, type } = options
       this.id = id
       this.type = type
     }
   }
   ```

### 高级跳转

1. **页面跳转封装**
   ```js
   // utils/router.js
   const router = {
     // 基础跳转方法
     push(url, params = {}) {
       const query = Object.keys(params)
         .map(key => `${key}=${params[key]}`)
         .join('&')
       const fullUrl = query ? `${url}?${query}` : url
       return new Promise((resolve, reject) => {
         uni.navigateTo({
           url: fullUrl,
           success: resolve,
           fail: reject
         })
       })
     },

     // 替换当前页面
     replace(url, params = {}) {
       const query = Object.keys(params)
         .map(key => `${key}=${params[key]}`)
         .join('&')
       const fullUrl = query ? `${url}?${query}` : url
       return new Promise((resolve, reject) => {
         uni.redirectTo({
           url: fullUrl,
           success: resolve,
           fail: reject
         })
       })
     },

     // 返回上一页
     back(delta = 1) {
       return new Promise((resolve, reject) => {
         uni.navigateBack({
           delta,
           success: resolve,
           fail: reject
         })
       })
     }
   }

   export default router
   ```

2. **页面跳转拦截**
   ```js
   // 页面跳转拦截器
   const interceptors = {
     // 跳转前拦截
     beforeJump(options) {
       // 检查登录状态
       const token = uni.getStorageSync('token')
       if (!token && !isWhiteList(options.url)) {
         uni.redirectTo({
           url: '/pages/login/login'
         })
         return false
       }
       return true
     },

     // 跳转后拦截
     afterJump(options) {
       // 记录页面访问
       this.recordPageAccess(options)
     }
   }

   // 使用拦截器
   const router = {
     push(url, params) {
       if (interceptors.beforeJump({ url, params })) {
         // 执行跳转
         interceptors.afterJump({ url, params })
       }
     }
   }
   ```

## 路由参数

### 参数传递

1. **URL 参数**
   ```js
   // 传递参数
   uni.navigateTo({
     url: '/pages/detail/detail?id=1&type=2'
   })

   // 接收参数
   export default {
     onLoad(options) {
       const { id, type } = options
       this.id = id
       this.type = type
     }
   }
   ```

2. **事件通信**
   ```js
   // 页面间通信
   const eventChannel = this.getOpenerEventChannel()
   eventChannel.emit('acceptDataFromOpener', { data: 'test' })

   // 接收数据
   const eventChannel = this.getOpenerEventChannel()
   eventChannel.on('acceptDataFromOpener', function(data) {
     console.log(data)
   })
   ```

### 参数处理

1. **参数验证**
   ```js
   // 参数验证工具
   const validateParams = (params, rules) => {
     const errors = []
     Object.keys(rules).forEach(key => {
       const rule = rules[key]
       const value = params[key]
       
       if (rule.required && !value) {
         errors.push(`${key} 是必填项`)
       }
       
       if (rule.type && typeof value !== rule.type) {
         errors.push(`${key} 类型错误`)
       }
       
       if (rule.validator && !rule.validator(value)) {
         errors.push(`${key} 验证失败`)
       }
     })
     return errors
   }

   // 使用验证
   const params = {
     id: 1,
     type: 'test'
   }
   const rules = {
     id: { required: true, type: 'number' },
     type: { required: true, type: 'string' }
   }
   const errors = validateParams(params, rules)
   ```

2. **参数转换**
   ```js
   // 参数转换工具
   const transformParams = (params, transformers) => {
     const result = {}
     Object.keys(params).forEach(key => {
       const transformer = transformers[key]
       result[key] = transformer ? transformer(params[key]) : params[key]
     })
     return result
   }

   // 使用转换
   const params = {
     id: '1',
     date: '2024-01-01'
   }
   const transformers = {
     id: value => parseInt(value),
     date: value => new Date(value)
   }
   const transformed = transformParams(params, transformers)
   ```

## 路由优化

### 性能优化

1. **预加载页面**
   ```js
   // 预加载配置
   {
     "preloadRule": {
       "pages/index/index": {
         "network": "all",
         "packages": ["packageA"]
       }
     }
   }
   ```

2. **页面缓存**
   ```js
   // 页面缓存配置
   {
     "pages": [
       {
         "path": "pages/index/index",
         "style": {
           "enablePullDownRefresh": true,
           "disableScroll": false,
           "app-plus": {
             "bounce": "none",
             "titleNView": {
               "buttons": [
                 {
                   "text": "刷新",
                   "float": "right"
                 }
               ]
             }
           }
         }
       }
     ]
   }
   ```

### 体验优化

1. **页面切换动画**
   ```json
   {
     "pages": [
       {
         "path": "pages/index/index",
         "style": {
           "animationType": "slide-in-right",
           "animationDuration": 300
         }
       }
     ]
   }
   ```

2. **加载状态**
   ```js
   // 页面加载状态
   export default {
     data() {
       return {
         loading: false
       }
     },
     methods: {
       async loadData() {
         this.loading = true
         try {
           await this.fetchData()
         } finally {
           this.loading = false
         }
       }
     }
   }
   ```

## 最佳实践

### 路由设计

1. **路由规划**
   - 合理的目录结构
   - 清晰的路由命名
   - 适当的页面分组

2. **权限控制**
   - 登录状态检查
   - 角色权限控制
   - 页面访问限制

3. **参数管理**
   - 参数验证
   - 参数转换
   - 参数安全

### 开发建议

1. **代码组织**
   - 路由配置集中管理
   - 路由方法统一封装
   - 路由守卫统一处理

2. **性能考虑**
   - 合理使用预加载
   - 适当使用页面缓存
   - 优化页面切换

3. **安全考虑**
   - 参数验证
   - 权限控制
   - 数据安全

### 注意事项

1. **平台差异**
   - 不同平台的路由差异
   - 页面栈管理差异
   - 参数传递差异

2. **性能问题**
   - 页面加载性能
   - 页面切换性能
   - 内存占用问题

3. **兼容问题**
   - 版本兼容
   - 平台兼容
   - 设备兼容 