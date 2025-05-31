# uni-app 平台适配

## 平台差异

### 平台特性

1. **平台类型**
   ```js
   // 获取平台信息
   const platform = {
     // 运行平台
     get platform() {
       // #ifdef APP-PLUS
       return 'app'
       // #endif
       
       // #ifdef H5
       return 'h5'
       // #endif
       
       // #ifdef MP-WEIXIN
       return 'mp-weixin'
       // #endif
       
       // #ifdef MP-ALIPAY
       return 'mp-alipay'
       // #endif
       
       // #ifdef MP-BAIDU
       return 'mp-baidu'
       // #endif
       
       // #ifdef MP-TOUTIAO
       return 'mp-toutiao'
       // #endif
       
       // #ifdef MP-QQ
       return 'mp-qq'
       // #endif
       
       // #ifdef MP-360
       return 'mp-360'
       // #endif
       
       // #ifdef QUICKAPP-WEBVIEW
       return 'quickapp'
       // #endif
       
       return 'unknown'
     },
     
     // 系统类型
     get system() {
       // #ifdef APP-PLUS
       return uni.getSystemInfoSync().platform
       // #endif
       
       // #ifdef H5
       const ua = navigator.userAgent.toLowerCase()
       if (ua.indexOf('android') > -1) return 'android'
       if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) return 'ios'
       return 'other'
       // #endif
       
       // #ifdef MP
       return uni.getSystemInfoSync().platform
       // #endif
       
       return 'unknown'
     },
     
     // 环境信息
     get env() {
       return {
         platform: this.platform,
         system: this.system,
         version: uni.getSystemInfoSync().version,
         SDKVersion: uni.getSystemInfoSync().SDKVersion,
         language: uni.getSystemInfoSync().language,
         screenWidth: uni.getSystemInfoSync().screenWidth,
         screenHeight: uni.getSystemInfoSync().screenHeight,
         windowWidth: uni.getSystemInfoSync().windowWidth,
         windowHeight: uni.getSystemInfoSync().windowHeight,
         pixelRatio: uni.getSystemInfoSync().pixelRatio
       }
     }
   }
   ```

2. **平台判断**
   ```js
   // 平台判断工具
   const platformUtils = {
     // 是否 App
     isApp() {
       // #ifdef APP-PLUS
       return true
       // #endif
       return false
     },
     
     // 是否 H5
     isH5() {
       // #ifdef H5
       return true
       // #endif
       return false
     },
     
     // 是否小程序
     isMP() {
       // #ifdef MP
       return true
       // #endif
       return false
     },
     
     // 是否微信小程序
     isWeixin() {
       // #ifdef MP-WEIXIN
       return true
       // #endif
       return false
     },
     
     // 是否支付宝小程序
     isAlipay() {
       // #ifdef MP-ALIPAY
       return true
       // #endif
       return false
     },
     
     // 是否 iOS
     isIOS() {
       return platform.system === 'ios'
     },
     
     // 是否 Android
     isAndroid() {
       return platform.system === 'android'
     }
   }
   ```

### 平台差异处理

1. **API 差异**
   ```js
   // API 适配器
   const apiAdapter = {
     // 获取位置信息
     getLocation() {
       // #ifdef APP-PLUS
       return new Promise((resolve, reject) => {
         uni.getLocation({
           type: 'gcj02',
           success: resolve,
           fail: reject
         })
       })
       // #endif
       
       // #ifdef H5
       return new Promise((resolve, reject) => {
         if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(
             position => resolve({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude
             }),
             error => reject(error)
           )
         } else {
           reject(new Error('浏览器不支持地理定位'))
         }
       })
       // #endif
       
       // #ifdef MP
       return new Promise((resolve, reject) => {
         uni.getLocation({
           type: 'gcj02',
           success: resolve,
           fail: reject
         })
       })
       // #endif
     },
     
     // 选择图片
     chooseImage(options = {}) {
       const defaultOptions = {
         count: 9,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera']
       }
       
       return new Promise((resolve, reject) => {
         uni.chooseImage({
           ...defaultOptions,
           ...options,
           success: resolve,
           fail: reject
         })
       })
     }
   }
   ```

2. **组件差异**
   ```vue
   <!-- 平台适配组件 -->
   <template>
     <view class="platform-component">
       <!-- 导航栏 -->
       <view class="nav-bar">
         <!-- #ifdef APP-PLUS -->
         <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
         <!-- #endif -->
         
         <view class="nav-content" :style="{ height: navBarHeight + 'px' }">
           <text class="title">{{ title }}</text>
         </view>
       </view>
       
       <!-- 内容区域 -->
       <view class="content" :style="contentStyle">
         <slot></slot>
       </view>
       
       <!-- 底部安全区 -->
       <!-- #ifdef APP-PLUS -->
       <view class="safe-area" :style="{ height: safeAreaBottom + 'px' }"></view>
       <!-- #endif -->
     </view>
   </template>

   <script>
   export default {
     props: {
       title: {
         type: String,
         default: ''
       }
     },
     
     data() {
       return {
         statusBarHeight: 0,
         navBarHeight: 44,
         safeAreaBottom: 0
       }
     },
     
     computed: {
       contentStyle() {
         // #ifdef APP-PLUS
         return {
           paddingTop: this.statusBarHeight + this.navBarHeight + 'px',
           paddingBottom: this.safeAreaBottom + 'px'
         }
         // #endif
         
         // #ifdef H5
         return {
           paddingTop: this.navBarHeight + 'px'
         }
         // #endif
         
         // #ifdef MP
         return {
           paddingTop: this.navBarHeight + 'px'
         }
         // #endif
       }
     },
     
     created() {
       // #ifdef APP-PLUS
       const systemInfo = uni.getSystemInfoSync()
       this.statusBarHeight = systemInfo.statusBarHeight
       this.safeAreaBottom = systemInfo.safeAreaInsets?.bottom || 0
       // #endif
     }
   }
   </script>

   <style>
   .platform-component {
     position: relative;
     width: 100%;
     height: 100%;
   }
   
   .nav-bar {
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     background-color: #ffffff;
     z-index: 100;
   }
   
   .nav-content {
     display: flex;
     align-items: center;
     justify-content: center;
   }
   
   .title {
     font-size: 16px;
     font-weight: 500;
   }
   
   .content {
     width: 100%;
     height: 100%;
     box-sizing: border-box;
   }
   
   .safe-area {
     position: fixed;
     bottom: 0;
     left: 0;
     width: 100%;
     background-color: #ffffff;
   }
   </style>
   ```

## 条件编译

### 编译指令

1. **基础指令**
   ```vue
   <!-- 条件编译示例 -->
   <template>
     <view class="container">
       <!-- 平台条件编译 -->
       <!-- #ifdef APP-PLUS -->
       <view class="app-only">App 平台特有内容</view>
       <!-- #endif -->
       
       <!-- #ifdef H5 -->
       <view class="h5-only">H5 平台特有内容</view>
       <!-- #endif -->
       
       <!-- #ifdef MP-WEIXIN -->
       <view class="weixin-only">微信小程序特有内容</view>
       <!-- #endif -->
       
       <!-- 系统条件编译 -->
       <!-- #ifdef APP-PLUS -->
       <!-- #ifdef APP-PLUS-IOS -->
       <view class="ios-only">iOS 平台特有内容</view>
       <!-- #endif -->
       
       <!-- #ifdef APP-PLUS-ANDROID -->
       <view class="android-only">Android 平台特有内容</view>
       <!-- #endif -->
       <!-- #endif -->
       
       <!-- 版本条件编译 -->
       <!-- #ifdef APP-PLUS -->
       <!-- #ifdef APP-PLUS-NVUE -->
       <view class="nvue-only">nvue 页面特有内容</view>
       <!-- #endif -->
       <!-- #endif -->
     </view>
   </template>

   <script>
   export default {
     data() {
       return {
         // 条件编译变量
         platform: {
           // #ifdef APP-PLUS
           isApp: true,
           // #endif
           
           // #ifdef H5
           isH5: true,
           // #endif
           
           // #ifdef MP-WEIXIN
           isWeixin: true,
           // #endif
         }
       }
     },
     
     methods: {
       // 条件编译方法
       handleAction() {
         // #ifdef APP-PLUS
         this.appAction()
         // #endif
         
         // #ifdef H5
         this.h5Action()
         // #endif
         
         // #ifdef MP-WEIXIN
         this.weixinAction()
         // #endif
       }
     }
   }
   </script>

   <style>
   /* 条件编译样式 */
   .container {
     /* #ifdef APP-PLUS */
     padding-top: var(--status-bar-height);
     /* #endif */
     
     /* #ifdef H5 */
     padding-top: 0;
     /* #endif */
   }
   
   /* #ifdef APP-PLUS */
   .app-only {
     color: #007AFF;
   }
   /* #endif */
   
   /* #ifdef H5 */
   .h5-only {
     color: #4CAF50;
   }
   /* #endif */
   
   /* #ifdef MP-WEIXIN */
   .weixin-only {
     color: #07C160;
   }
   /* #endif */
   </style>
   ```

2. **高级用法**
   ```js
   // 条件编译工具
   const compileUtils = {
     // 平台特定配置
     getPlatformConfig() {
       const config = {
         // 基础配置
         base: {
           apiBaseUrl: 'https://api.example.com',
           uploadUrl: 'https://upload.example.com'
         }
       }
       
       // #ifdef APP-PLUS
       config.app = {
         // App 特有配置
         splashScreen: {
           duration: 2000,
           image: '/static/splash.png'
         },
         permissions: {
           camera: true,
           location: true
         }
       }
       // #endif
       
       // #ifdef H5
       config.h5 = {
         // H5 特有配置
         router: {
           mode: 'history',
           base: '/'
         },
         storage: {
           type: 'localStorage'
         }
       }
       // #endif
       
       // #ifdef MP-WEIXIN
       config.weixin = {
         // 微信小程序特有配置
         appId: 'wx123456789',
         requiredBackgroundModes: ['audio'],
         permission: {
           'scope.userLocation': {
             desc: '你的位置信息将用于小程序位置接口的效果展示'
           }
         }
       }
       // #endif
       
       return config
     },
     
     // 平台特定方法
     getPlatformMethod() {
       const methods = {
         // 基础方法
         base: {
           showToast(title) {
             uni.showToast({ title })
           }
         }
       }
       
       // #ifdef APP-PLUS
       methods.app = {
         // App 特有方法
         checkPermission(permission) {
           return new Promise((resolve, reject) => {
             plus.android.requestPermissions(
               [permission],
               function(resultObj) {
                 resolve(resultObj.granted)
               },
               function(error) {
                 reject(error)
               }
             )
           })
         }
       }
       // #endif
       
       // #ifdef H5
       methods.h5 = {
         // H5 特有方法
         copyText(text) {
           const input = document.createElement('input')
           input.value = text
           document.body.appendChild(input)
           input.select()
           document.execCommand('copy')
           document.body.removeChild(input)
         }
       }
       // #endif
       
       // #ifdef MP-WEIXIN
       methods.weixin = {
         // 微信小程序特有方法
         login() {
           return new Promise((resolve, reject) => {
             uni.login({
               success: resolve,
               fail: reject
             })
           })
         }
       }
       // #endif
       
       return methods
     }
   }
   ```

## 样式适配

### 样式单位

1. **rpx 适配**
   ```scss
   // rpx 转换工具
   @function rpx($px) {
     @return $px * 1rpx;
   }
   
   // 使用示例
   .container {
     width: rpx(750); // 满屏宽度
     height: rpx(100);
     margin: rpx(20);
     padding: rpx(30);
     font-size: rpx(28);
   }
   
   // 响应式布局
   .responsive {
     // 基础样式
     width: rpx(750);
     height: rpx(200);
     
     // 大屏适配
     @media screen and (min-width: 768px) {
       width: rpx(600);
       height: rpx(300);
     }
     
     // 横屏适配
     @media screen and (orientation: landscape) {
       width: rpx(1000);
       height: rpx(400);
     }
   }
   ```

2. **安全区域**
   ```scss
   // 安全区域适配
   .safe-area {
     // 顶部安全区域
     padding-top: constant(safe-area-inset-top);
     padding-top: env(safe-area-inset-top);
     
     // 底部安全区域
     padding-bottom: constant(safe-area-inset-bottom);
     padding-bottom: env(safe-area-inset-bottom);
     
     // 左侧安全区域
     padding-left: constant(safe-area-inset-left);
     padding-left: env(safe-area-inset-left);
     
     // 右侧安全区域
     padding-right: constant(safe-area-inset-right);
     padding-right: env(safe-area-inset-right);
   }
   
   // 使用示例
   .page-container {
     @extend .safe-area;
     
     // 自定义安全区域样式
     &.has-tabbar {
       padding-bottom: calc(env(safe-area-inset-bottom) + 50px);
     }
     
     &.has-navbar {
       padding-top: calc(env(safe-area-inset-top) + 44px);
     }
   }
   ```

### 样式兼容

1. **平台样式**
   ```scss
   // 平台样式适配
   .platform-style {
     // 基础样式
     display: flex;
     align-items: center;
     justify-content: center;
     
     // App 平台样式
     /* #ifdef APP-PLUS */
     background-color: #f8f8f8;
     /* #endif */
     
     // H5 平台样式
     /* #ifdef H5 */
     background-color: #ffffff;
     /* #endif */
     
     // 小程序平台样式
     /* #ifdef MP */
     background-color: #f6f6f6;
     /* #endif */
     
     // iOS 平台样式
     /* #ifdef APP-PLUS-IOS */
     -webkit-overflow-scrolling: touch;
     /* #endif */
     
     // Android 平台样式
     /* #ifdef APP-PLUS-ANDROID */
     overflow: auto;
     /* #endif */
   }
   ```

2. **样式降级**
   ```scss
   // 样式降级处理
   .fallback-style {
     // 现代浏览器
     display: grid;
     grid-template-columns: repeat(3, 1fr);
     gap: 20px;
     
     // 降级方案
     @supports not (display: grid) {
       display: flex;
       flex-wrap: wrap;
       
       > * {
         flex: 0 0 calc(33.33% - 20px);
         margin: 10px;
       }
     }
     
     // 更老的浏览器
     @supports not (display: flex) {
       display: block;
       
       > * {
         display: inline-block;
         width: calc(33.33% - 20px);
         margin: 10px;
         vertical-align: top;
       }
     }
   }
   ```

## 组件适配

### 基础组件

1. **按钮组件**
   ```vue
   <!-- 适配按钮组件 -->
   <template>
     <button
       class="custom-button"
       :class="[
         `button-${type}`,
         `button-${size}`,
         { 'button-disabled': disabled }
       ]"
       :disabled="disabled"
       @click="handleClick"
     >
       <slot></slot>
     </button>
   </template>

   <script>
   export default {
     props: {
       type: {
         type: String,
         default: 'default',
         validator: value => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
       },
       size: {
         type: String,
         default: 'normal',
         validator: value => ['small', 'normal', 'large'].includes(value)
       },
       disabled: {
         type: Boolean,
         default: false
       }
     },
     
     methods: {
       handleClick(event) {
         if (this.disabled) return
         this.$emit('click', event)
       }
     }
   }
   </script>

   <style lang="scss">
   .custom-button {
     // 基础样式
     display: inline-flex;
     align-items: center;
     justify-content: center;
     padding: 0 30rpx;
     font-size: 28rpx;
     border-radius: 8rpx;
     transition: all 0.3s;
     
     // 平台适配
     /* #ifdef APP-PLUS */
     border: none;
     /* #endif */
     
     /* #ifdef H5 */
     border: 1px solid transparent;
     /* #endif */
     
     /* #ifdef MP */
     border: none;
     &::after {
       border: none;
     }
     /* #endif */
     
     // 类型样式
     &.button-default {
       background-color: #f2f2f2;
       color: #333333;
       
       /* #ifdef H5 */
       border-color: #d9d9d9;
       /* #endif */
     }
     
     &.button-primary {
       background-color: #007AFF;
       color: #ffffff;
     }
     
     &.button-success {
       background-color: #4CD964;
       color: #ffffff;
     }
     
     &.button-warning {
       background-color: #FF9500;
       color: #ffffff;
     }
     
     &.button-danger {
       background-color: #FF3B30;
       color: #ffffff;
     }
     
     // 尺寸样式
     &.button-small {
       height: 60rpx;
       font-size: 24rpx;
     }
     
     &.button-normal {
       height: 80rpx;
       font-size: 28rpx;
     }
     
     &.button-large {
       height: 100rpx;
       font-size: 32rpx;
     }
     
     // 禁用样式
     &.button-disabled {
       opacity: 0.5;
       cursor: not-allowed;
     }
   }
   </style>
   ```

2. **输入框组件**
   ```vue
   <!-- 适配输入框组件 -->
   <template>
     <view class="custom-input">
       <input
         class="input"
         :class="[
           `input-${size}`,
           { 'input-disabled': disabled }
         ]"
         :type="type"
         :value="value"
         :placeholder="placeholder"
         :disabled="disabled"
         :maxlength="maxlength"
         @input="handleInput"
         @focus="handleFocus"
         @blur="handleBlur"
       />
     </view>
   </template>

   <script>
   export default {
     props: {
       type: {
         type: String,
         default: 'text'
       },
       value: {
         type: [String, Number],
         default: ''
       },
       placeholder: {
         type: String,
         default: ''
       },
       size: {
         type: String,
         default: 'normal',
         validator: value => ['small', 'normal', 'large'].includes(value)
       },
       disabled: {
         type: Boolean,
         default: false
       },
       maxlength: {
         type: Number,
         default: -1
       }
     },
     
     methods: {
       handleInput(event) {
         this.$emit('input', event.detail.value)
       },
       
       handleFocus(event) {
         this.$emit('focus', event)
       },
       
       handleBlur(event) {
         this.$emit('blur', event)
       }
     }
   }
   </script>

   <style lang="scss">
   .custom-input {
     // 基础样式
     width: 100%;
     
     .input {
       width: 100%;
       box-sizing: border-box;
       background-color: #ffffff;
       transition: all 0.3s;
       
       // 平台适配
       /* #ifdef APP-PLUS */
       border: none;
       border-bottom: 1px solid #e5e5e5;
       /* #endif */
       
       /* #ifdef H5 */
       border: 1px solid #d9d9d9;
       border-radius: 4rpx;
       /* #endif */
       
       /* #ifdef MP */
       border: none;
       border-bottom: 1px solid #e5e5e5;
       /* #endif */
       
       // 尺寸样式
       &.input-small {
         height: 60rpx;
         font-size: 24rpx;
         padding: 0 20rpx;
       }
       
       &.input-normal {
         height: 80rpx;
         font-size: 28rpx;
         padding: 0 30rpx;
       }
       
       &.input-large {
         height: 100rpx;
         font-size: 32rpx;
         padding: 0 40rpx;
       }
       
       // 禁用样式
       &.input-disabled {
         background-color: #f5f5f5;
         color: #999999;
         cursor: not-allowed;
       }
       
       // 占位符样式
       &::placeholder {
         color: #999999;
       }
       
       // 聚焦样式
       &:focus {
         /* #ifdef H5 */
         border-color: #007AFF;
         /* #endif */
         
         /* #ifdef APP-PLUS || MP */
         border-bottom-color: #007AFF;
         /* #endif */
       }
     }
   }
   </style>
   ```

### 业务组件

1. **导航栏组件**
   ```vue
   <!-- 适配导航栏组件 -->
   <template>
     <view class="custom-navbar" :style="navbarStyle">
       <!-- 状态栏 -->
       <!-- #ifdef APP-PLUS -->
       <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
       <!-- #endif -->
       
       <!-- 导航栏内容 -->
       <view class="navbar-content" :style="{ height: contentHeight + 'px' }">
         <!-- 左侧按钮 -->
         <view class="navbar-left" v-if="showBack" @click="handleBack">
           <slot name="left">
             <text class="iconfont icon-back"></text>
           </slot>
         </view>
         
         <!-- 标题 -->
         <view class="navbar-title">
           <slot>{{ title }}</slot>
         </view>
         
         <!-- 右侧按钮 -->
         <view class="navbar-right">
           <slot name="right"></slot>
         </view>
       </view>
     </view>
   </template>

   <script>
   export default {
     props: {
       title: {
         type: String,
         default: ''
       },
       showBack: {
         type: Boolean,
         default: true
       },
       fixed: {
         type: Boolean,
         default: true
       },
       background: {
         type: String,
         default: '#ffffff'
       },
       color: {
         type: String,
         default: '#333333'
       }
     },
     
     data() {
       return {
         statusBarHeight: 0,
         contentHeight: 44
       }
     },
     
     computed: {
       navbarStyle() {
         const style = {
           background: this.background,
           color: this.color
         }
         
         if (this.fixed) {
           style.position = 'fixed'
           style.top = '0'
           style.left = '0'
           style.right = '0'
           style.zIndex = '100'
         }
         
         return style
       }
     },
     
     created() {
       // #ifdef APP-PLUS
       const systemInfo = uni.getSystemInfoSync()
       this.statusBarHeight = systemInfo.statusBarHeight
       // #endif
     },
     
     methods: {
       handleBack() {
         if (this.showBack) {
           uni.navigateBack({
             delta: 1,
             fail: () => {
               uni.switchTab({
                 url: '/pages/index/index'
               })
             }
           })
         }
       }
     }
   }
   </script>

   <style lang="scss">
   .custom-navbar {
     width: 100%;
     
     .status-bar {
       width: 100%;
       background-color: inherit;
     }
     
     .navbar-content {
       display: flex;
       align-items: center;
       justify-content: space-between;
       padding: 0 30rpx;
       background-color: inherit;
       
       .navbar-left {
         display: flex;
         align-items: center;
         height: 100%;
         padding-right: 30rpx;
         
         .icon-back {
           font-size: 36rpx;
         }
       }
       
       .navbar-title {
         flex: 1;
         text-align: center;
         font-size: 32rpx;
         font-weight: 500;
         overflow: hidden;
         text-overflow: ellipsis;
         white-space: nowrap;
       }
       
       .navbar-right {
         display: flex;
         align-items: center;
         height: 100%;
         padding-left: 30rpx;
       }
     }
   }
   </style>
   ```

2. **列表组件**
   ```vue
   <!-- 适配列表组件 -->
   <template>
     <view class="custom-list">
       <!-- 列表头部 -->
       <view class="list-header" v-if="$slots.header">
         <slot name="header"></slot>
       </view>
       
       <!-- 列表内容 -->
       <scroll-view
         class="list-content"
         :scroll-y="true"
         :refresher-enabled="refresherEnabled"
         :refresher-triggered="refresherTriggered"
         @refresherrefresh="handleRefresh"
         @scrolltolower="handleLoadMore"
       >
         <view class="list-item" v-for="(item, index) in list" :key="index">
           <slot name="item" :item="item" :index="index"></slot>
         </view>
         
         <!-- 加载状态 -->
         <view class="list-loading" v-if="loading">
           <slot name="loading">
             <text>加载中...</text>
           </slot>
         </view>
         
         <!-- 空状态 -->
         <view class="list-empty" v-if="!loading && list.length === 0">
           <slot name="empty">
             <text>暂无数据</text>
           </slot>
         </view>
         
         <!-- 加载完成 -->
         <view class="list-finished" v-if="!loading && finished && list.length > 0">
           <slot name="finished">
             <text>没有更多了</text>
           </slot>
         </view>
       </scroll-view>
     </view>
   </template>

   <script>
   export default {
     props: {
       list: {
         type: Array,
         default: () => []
       },
       loading: {
         type: Boolean,
         default: false
       },
       finished: {
         type: Boolean,
         default: false
       },
       refresherEnabled: {
         type: Boolean,
         default: true
       }
     },
     
     data() {
       return {
         refresherTriggered: false
       }
     },
     
     methods: {
       handleRefresh() {
         this.refresherTriggered = true
         this.$emit('refresh')
       },
       
       handleLoadMore() {
         if (!this.loading && !this.finished) {
           this.$emit('load-more')
         }
       },
       
       // 完成刷新
       finishRefresh() {
         this.refresherTriggered = false
       }
     }
   }
   </script>

   <style lang="scss">
   .custom-list {
     width: 100%;
     height: 100%;
     
     .list-header {
       width: 100%;
       background-color: #ffffff;
     }
     
     .list-content {
       width: 100%;
       height: 100%;
       
       // 平台适配
       /* #ifdef APP-PLUS */
       flex: 1;
       /* #endif */
       
       /* #ifdef H5 */
       overflow-y: auto;
       -webkit-overflow-scrolling: touch;
       /* #endif */
       
       /* #ifdef MP */
       flex: 1;
       /* #endif */
     }
     
     .list-item {
       width: 100%;
       background-color: #ffffff;
       
       // 平台适配
       /* #ifdef APP-PLUS */
       border-bottom: 1px solid #f5f5f5;
       /* #endif */
       
       /* #ifdef H5 */
       border-bottom: 1px solid #f5f5f5;
       /* #endif */
       
       /* #ifdef MP */
       border-bottom: 1px solid #f5f5f5;
       /* #endif */
     }
     
     .list-loading,
     .list-empty,
     .list-finished {
       width: 100%;
       padding: 30rpx 0;
       text-align: center;
       color: #999999;
       font-size: 28rpx;
     }
   }
   </style>
   ```

## API 适配

### 基础 API

1. **存储适配**
   ```js
   // 存储适配器
   const storageAdapter = {
     // 设置存储
     set(key, data) {
       // #ifdef APP-PLUS
       plus.storage.setItem(key, JSON.stringify(data))
       // #endif
       
       // #ifdef H5
       localStorage.setItem(key, JSON.stringify(data))
       // #endif
       
       // #ifdef MP
       uni.setStorageSync(key, data)
       // #endif
     },
     
     // 获取存储
     get(key) {
       // #ifdef APP-PLUS
       const value = plus.storage.getItem(key)
       return value ? JSON.parse(value) : null
       // #endif
       
       // #ifdef H5
       const value = localStorage.getItem(key)
       return value ? JSON.parse(value) : null
       // #endif
       
       // #ifdef MP
       return uni.getStorageSync(key)
       // #endif
     },
     
     // 移除存储
     remove(key) {
       // #ifdef APP-PLUS
       plus.storage.removeItem(key)
       // #endif
       
       // #ifdef H5
       localStorage.removeItem(key)
       // #endif
       
       // #ifdef MP
       uni.removeStorageSync(key)
       // #endif
     },
     
     // 清空存储
     clear() {
       // #ifdef APP-PLUS
       plus.storage.clear()
       // #endif
       
       // #ifdef H5
       localStorage.clear()
       // #endif
       
       // #ifdef MP
       uni.clearStorageSync()
       // #endif
     }
   }
   ```

2. **网络适配**
   ```js
   // 网络适配器
   const networkAdapter = {
     // 获取网络类型
     getNetworkType() {
       return new Promise((resolve, reject) => {
         // #ifdef APP-PLUS
         const networkInfo = plus.networkinfo
         networkInfo.getCurrentProxyInfo((info) => {
           resolve({
             networkType: info.type,
             isConnected: info.type !== 'none'
           })
         }, (error) => {
           reject(error)
         })
         // #endif
         
         // #ifdef H5
         if (navigator.onLine) {
           resolve({
             networkType: 'wifi',
             isConnected: true
           })
         } else {
           resolve({
             networkType: 'none',
             isConnected: false
           })
         }
         // #endif
         
         // #ifdef MP
         uni.getNetworkType({
           success: (res) => {
             resolve({
               networkType: res.networkType,
               isConnected: res.networkType !== 'none'
             })
           },
           fail: reject
         })
         // #endif
       })
     },
     
     // 监听网络状态
     onNetworkStatusChange(callback) {
       // #ifdef APP-PLUS
       const networkInfo = plus.networkinfo
       networkInfo.addEventListener('change', (info) => {
         callback({
           networkType: info.type,
           isConnected: info.type !== 'none'
         })
       })
       // #endif
       
       // #ifdef H5
       window.addEventListener('online', () => {
         callback({
           networkType: 'wifi',
           isConnected: true
         })
       })
       window.addEventListener('offline', () => {
         callback({
           networkType: 'none',
           isConnected: false
         })
       })
       // #endif
       
       // #ifdef MP
       uni.onNetworkStatusChange(callback)
       // #endif
     }
   }
   ```

### 业务 API

1. **支付适配**
   ```js
   // 支付适配器
   const paymentAdapter = {
     // 发起支付
     requestPayment(options) {
       return new Promise((resolve, reject) => {
         // #ifdef APP-PLUS
         // App 支付
         const payment = plus.payment
         const provider = options.provider || 'alipay'
         
         payment.request(provider, {
           orderInfo: options.orderInfo
         }, (result) => {
           resolve(result)
         }, (error) => {
           reject(error)
         })
         // #endif
         
         // #ifdef H5
         // H5 支付
         if (options.provider === 'alipay') {
           // 支付宝 H5 支付
           const div = document.createElement('div')
           div.innerHTML = options.orderInfo
           document.body.appendChild(div)
           document.forms[0].submit()
         } else if (options.provider === 'weixin') {
           // 微信 H5 支付
           if (typeof WeixinJSBridge === 'undefined') {
             reject(new Error('请在微信中打开'))
             return
           }
           WeixinJSBridge.invoke('getBrandWCPayRequest', options.payParams, (res) => {
             if (res.err_msg === 'get_brand_wcpay_request:ok') {
               resolve(res)
             } else {
               reject(new Error(res.err_msg))
             }
           })
         }
         // #endif
         
         // #ifdef MP-WEIXIN
         // 微信小程序支付
         uni.requestPayment({
           ...options.payParams,
           success: resolve,
           fail: reject
         })
         // #endif
         
         // #ifdef MP-ALIPAY
         // 支付宝小程序支付
         uni.requestPayment({
           ...options.payParams,
           success: resolve,
           fail: reject
         })
         // #endif
       })
     }
   }
   ```

2. **分享适配**
   ```js
   // 分享适配器
   const shareAdapter = {
     // 设置分享信息
     setShareInfo(options) {
       // #ifdef APP-PLUS
       // App 分享
       const share = plus.share
       const services = share.getServices((services) => {
         const service = services.find(s => s.id === options.provider)
         if (service) {
           service.send({
             type: options.type,
             title: options.title,
             content: options.content,
             href: options.url,
             images: options.image
           }, (result) => {
             options.success && options.success(result)
           }, (error) => {
             options.fail && options.fail(error)
           })
         }
       })
       // #endif
       
       // #ifdef H5
       // H5 分享
       if (options.provider === 'weixin') {
         // 微信分享
         wx.ready(() => {
           wx.updateAppMessageShareData({
             title: options.title,
             desc: options.content,
             link: options.url,
             imgUrl: options.image,
             success: options.success,
             fail: options.fail
           })
         })
       }
       // #endif
       
       // #ifdef MP
       // 小程序分享
       const shareOptions = {
         title: options.title,
         path: options.url,
         imageUrl: options.image,
         success: options.success,
         fail: options.fail
       }
       
       // #ifdef MP-WEIXIN
       shareOptions.desc = options.content
       // #endif
       
       return shareOptions
       // #endif
     }
   }
   ```

## 最佳实践

### 开发建议

1. **代码组织**
   - 统一平台适配
   - 模块化处理
   - 清晰的注释

2. **性能考虑**
   - 按需加载
   - 条件编译
   - 资源优化

3. **兼容考虑**
   - 降级方案
   - 兜底处理
   - 版本兼容

### 注意事项

1. **平台差异**
   - API 差异
   - 组件差异
   - 样式差异

2. **性能问题**
   - 编译优化
   - 运行性能
   - 包体积控制

3. **兼容问题**
   - 版本兼容
   - 平台兼容
   - 设备兼容 