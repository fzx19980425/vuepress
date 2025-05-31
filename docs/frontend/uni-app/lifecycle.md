# uni-app 生命周期

## 应用生命周期

应用生命周期是指应用程序从启动到关闭的整个过程。

### 生命周期函数

```js
// App.vue
export default {
  // 应用初始化时触发，全局只触发一次
  onLaunch: function(options) {
    console.log('App Launch', options)
    // options 包含启动参数
    // #ifdef MP-WEIXIN
    console.log('启动参数：', options.query)
    // #endif
  },

  // 应用从后台进入前台显示时触发
  onShow: function(options) {
    console.log('App Show', options)
    // options 包含启动参数
  },

  // 应用从前台进入后台时触发
  onHide: function() {
    console.log('App Hide')
  },

  // 应用报错时触发
  onError: function(error) {
    console.error('App Error:', error)
  },

  // 应用未处理的 Promise 拒绝事件
  onUnhandledRejection: function(options) {
    console.error('Unhandled Promise Rejection:', options)
  },

  // 应用分享时触发
  onShareAppMessage: function(options) {
    return {
      title: '分享标题',
      path: '/pages/index/index',
      imageUrl: '/static/share.png'
    }
  }
}
```

### 生命周期执行顺序

1. **应用启动**
   ```
   onLaunch -> onShow
   ```

2. **应用切换**
   ```
   前台 -> 后台：onHide
   后台 -> 前台：onShow
   ```

3. **应用关闭**
   ```
   直接关闭：无回调
   切到后台后关闭：onHide
   ```

## 页面生命周期

页面生命周期是指页面从创建到销毁的整个过程。

### 生命周期函数

```js
export default {
  // 页面加载时触发，参数为打开页面时传递的数据
  onLoad: function(options) {
    console.log('页面加载', options)
    // options 包含页面参数
  },

  // 页面显示时触发
  onShow: function() {
    console.log('页面显示')
  },

  // 页面初次渲染完成时触发
  onReady: function() {
    console.log('页面就绪')
  },

  // 页面隐藏时触发
  onHide: function() {
    console.log('页面隐藏')
  },

  // 页面卸载时触发
  onUnload: function() {
    console.log('页面卸载')
  },

  // 页面下拉刷新时触发
  onPullDownRefresh: function() {
    console.log('下拉刷新')
    // 处理下拉刷新
    uni.stopPullDownRefresh()
  },

  // 页面触底时触发
  onReachBottom: function() {
    console.log('触底加载')
    // 处理触底加载
  },

  // 页面分享时触发
  onShareAppMessage: function(options) {
    return {
      title: '分享标题',
      path: '/pages/index/index',
      imageUrl: '/static/share.png'
    }
  },

  // 页面滚动时触发
  onPageScroll: function(options) {
    console.log('页面滚动', options.scrollTop)
  },

  // 页面尺寸变化时触发
  onResize: function(options) {
    console.log('页面尺寸变化', options)
  },

  // 页面返回时触发
  onBackPress: function(options) {
    console.log('返回按钮点击')
    // 返回 true 则阻止默认返回行为
    return true
  }
}
```

### 生命周期执行顺序

1. **页面打开**
   ```
   onLoad -> onShow -> onReady
   ```

2. **页面切换**
   ```
   页面 A -> 页面 B：
   A.onHide -> B.onLoad -> B.onShow -> B.onReady
   ```

3. **页面返回**
   ```
   页面 B -> 页面 A：
   B.onUnload -> A.onShow
   ```

4. **页面关闭**
   ```
   onUnload
   ```

## 组件生命周期

组件生命周期是指组件从创建到销毁的整个过程。

### 生命周期函数

```vue
<template>
  <view class="component">
    <!-- 组件内容 -->
  </view>
</template>

<script>
export default {
  // 组件实例创建时触发
  beforeCreate() {
    console.log('组件创建前')
  },

  // 组件实例创建完成时触发
  created() {
    console.log('组件创建完成')
  },

  // 组件挂载前触发
  beforeMount() {
    console.log('组件挂载前')
  },

  // 组件挂载完成时触发
  mounted() {
    console.log('组件挂载完成')
  },

  // 组件更新前触发
  beforeUpdate() {
    console.log('组件更新前')
  },

  // 组件更新完成时触发
  updated() {
    console.log('组件更新完成')
  },

  // 组件销毁前触发
  beforeDestroy() {
    console.log('组件销毁前')
  },

  // 组件销毁完成时触发
  destroyed() {
    console.log('组件销毁完成')
  }
}
</script>
```

### 生命周期执行顺序

1. **组件创建**
   ```
   beforeCreate -> created -> beforeMount -> mounted
   ```

2. **组件更新**
   ```
   beforeUpdate -> updated
   ```

3. **组件销毁**
   ```
   beforeDestroy -> destroyed
   ```

## 生命周期使用场景

### 应用生命周期

1. **onLaunch**
   - 初始化应用配置
   - 检查更新
   - 获取系统信息
   ```js
   onLaunch: function() {
     // 检查更新
     uni.getUpdateManager().onCheckForUpdate((res) => {
       if (res.hasUpdate) {
         // 有更新
       }
     })
     
     // 获取系统信息
     const systemInfo = uni.getSystemInfoSync()
     this.globalData.systemInfo = systemInfo
   }
   ```

2. **onShow**
   - 恢复应用状态
   - 刷新数据
   - 检查登录状态
   ```js
   onShow: function() {
     // 检查登录状态
     this.checkLoginStatus()
     
     // 刷新数据
     this.refreshData()
   }
   ```

3. **onHide**
   - 保存应用状态
   - 清理资源
   - 暂停任务
   ```js
   onHide: function() {
     // 保存状态
     this.saveAppState()
     
     // 暂停任务
     this.pauseTasks()
   }
   ```

### 页面生命周期

1. **onLoad**
   - 获取页面参数
   - 初始化页面数据
   - 请求接口数据
   ```js
   onLoad: function(options) {
     // 获取参数
     this.id = options.id
     
     // 请求数据
     this.fetchData()
   }
   ```

2. **onShow**
   - 刷新页面数据
   - 恢复页面状态
   - 检查页面权限
   ```js
   onShow: function() {
     // 刷新数据
     this.refreshPageData()
     
     // 检查权限
     this.checkPermission()
   }
   ```

3. **onReady**
   - 操作页面 DOM
   - 初始化第三方组件
   - 执行页面动画
   ```js
   onReady: function() {
     // 初始化组件
     this.initThirdPartyComponent()
     
     // 执行动画
     this.startPageAnimation()
   }
   ```

### 组件生命周期

1. **created**
   - 初始化组件数据
   - 设置组件状态
   - 注册事件监听
   ```js
   created() {
     // 初始化数据
     this.initData()
     
     // 注册事件
     this.registerEvents()
   }
   ```

2. **mounted**
   - 操作组件 DOM
   - 初始化子组件
   - 执行组件动画
   ```js
   mounted() {
     // 操作 DOM
     this.initDOM()
     
     // 初始化子组件
     this.initChildComponents()
   }
   ```

3. **beforeDestroy**
   - 清理事件监听
   - 销毁定时器
   - 释放资源
   ```js
   beforeDestroy() {
     // 清理事件
     this.removeEventListeners()
     
     // 销毁定时器
     this.clearTimers()
   }
   ```

## 注意事项

### 应用生命周期

1. **启动参数处理**
   - 不同平台启动参数格式不同
   - 需要做好兼容处理
   - 注意参数安全性

2. **全局状态管理**
   - 合理使用全局数据
   - 避免数据污染
   - 注意数据同步

3. **错误处理**
   - 全局错误捕获
   - 错误日志记录
   - 错误提示处理

### 页面生命周期

1. **数据加载**
   - 避免重复加载
   - 处理加载状态
   - 错误重试机制

2. **页面切换**
   - 保存页面状态
   - 处理页面栈
   - 优化切换性能

3. **资源释放**
   - 及时清理资源
   - 避免内存泄漏
   - 优化页面性能

### 组件生命周期

1. **组件通信**
   - 合理使用 props
   - 避免过度通信
   - 注意数据流向

2. **性能优化**
   - 避免不必要的更新
   - 合理使用缓存
   - 优化渲染性能

3. **资源管理**
   - 及时销毁资源
   - 避免内存泄漏
   - 优化组件性能 