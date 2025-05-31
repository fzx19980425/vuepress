# 生命周期

## 应用生命周期

应用生命周期是指小程序从启动到销毁的整个过程，主要包括以下阶段：

### 1. 启动阶段
```javascript
// app.js
App({
  onLaunch: function(options) {
    // 小程序启动时执行
    // options 包含启动参数
    console.log('小程序启动', options);
  },
  
  onShow: function(options) {
    // 小程序显示时执行
    // 包括启动和从后台进入前台
    console.log('小程序显示', options);
  },
  
  onHide: function() {
    // 小程序隐藏时执行
    // 包括切到后台或关闭小程序
    console.log('小程序隐藏');
  },
  
  onError: function(error) {
    // 小程序发生错误时执行
    console.error('小程序错误', error);
  },
  
  onPageNotFound: function(options) {
    // 页面不存在时执行
    console.log('页面不存在', options);
  },
  
  onUnhandledRejection: function(options) {
    // 未处理的 Promise 拒绝时执行
    console.log('未处理的 Promise 拒绝', options);
  },
  
  onThemeChange: function(options) {
    // 系统主题变化时执行
    console.log('主题变化', options);
  }
});
```

### 2. 启动参数说明
```javascript
{
  path: '打开小程序的路径',
  query: '打开小程序的query参数',
  scene: '打开小程序的场景值',
  shareTicket: 'shareTicket，详见获取更多转发信息',
  referrerInfo: {
    appId: '来源小程序的appId',
    extraData: '来源小程序传过来的数据'
  }
}
```

## 页面生命周期

页面生命周期是指小程序页面从创建到销毁的整个过程：

### 1. 基本生命周期
```javascript
// pages/index/index.js
Page({
  data: {
    // 页面的初始数据
  },
  
  onLoad: function(options) {
    // 页面加载时执行
    // options 为页面跳转所带来的参数
    console.log('页面加载', options);
  },
  
  onReady: function() {
    // 页面初次渲染完成时执行
    console.log('页面就绪');
  },
  
  onShow: function() {
    // 页面显示/切入前台时执行
    console.log('页面显示');
  },
  
  onHide: function() {
    // 页面隐藏/切入后台时执行
    console.log('页面隐藏');
  },
  
  onUnload: function() {
    // 页面卸载时执行
    console.log('页面卸载');
  }
});
```

### 2. 页面事件处理
```javascript
Page({
  // 下拉刷新
  onPullDownRefresh: function() {
    // 处理下拉刷新
    console.log('下拉刷新');
    // 完成后停止下拉刷新
    wx.stopPullDownRefresh();
  },
  
  // 上拉触底
  onReachBottom: function() {
    // 处理上拉触底
    console.log('上拉触底');
  },
  
  // 页面滚动
  onPageScroll: function(options) {
    // 处理页面滚动
    console.log('页面滚动', options);
  },
  
  // 分享
  onShareAppMessage: function(options) {
    // 处理分享
    return {
      title: '分享标题',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    };
  },
  
  // 分享到朋友圈
  onShareTimeline: function() {
    return {
      title: '分享到朋友圈的标题',
      query: '分享参数',
      imageUrl: '/images/share.png'
    };
  },
  
  // 添加到收藏
  onAddToFavorites: function(options) {
    return {
      title: '收藏标题',
      query: '收藏参数',
      imageUrl: '/images/favorite.png'
    };
  }
});
```

## 组件生命周期

自定义组件也有自己的生命周期：

### 1. 基本生命周期
```javascript
// components/my-component/my-component.js
Component({
  data: {
    // 组件的内部数据
  },
  
  lifetimes: {
    created: function() {
      // 组件实例刚刚被创建时执行
      console.log('组件创建');
    },
    
    attached: function() {
      // 组件实例进入页面节点树时执行
      console.log('组件附加');
    },
    
    ready: function() {
      // 组件在视图层布局完成后执行
      console.log('组件就绪');
    },
    
    moved: function() {
      // 组件实例被移动到节点树另一个位置时执行
      console.log('组件移动');
    },
    
    detached: function() {
      // 组件实例被从页面节点树移除时执行
      console.log('组件分离');
    },
    
    error: function(error) {
      // 组件方法抛出错误时执行
      console.error('组件错误', error);
    }
  },
  
  pageLifetimes: {
    show: function() {
      // 页面被展示时执行
      console.log('页面显示');
    },
    
    hide: function() {
      // 页面被隐藏时执行
      console.log('页面隐藏');
    },
    
    resize: function(size) {
      // 页面尺寸变化时执行
      console.log('页面尺寸变化', size);
    }
  }
});
```

## 生命周期执行顺序

### 1. 小程序启动
1. App.onLaunch
2. App.onShow
3. Page.onLoad
4. Page.onShow
5. Page.onReady

### 2. 页面跳转
1. 当前页面 onHide
2. 目标页面 onLoad
3. 目标页面 onShow
4. 目标页面 onReady

### 3. 小程序切后台
1. Page.onHide
2. App.onHide

### 4. 小程序切前台
1. App.onShow
2. Page.onShow

## 生命周期最佳实践

### 1. 数据初始化
```javascript
Page({
  onLoad: function(options) {
    // 1. 初始化页面数据
    this.initData();
    
    // 2. 获取页面参数
    this.handleParams(options);
    
    // 3. 请求初始数据
    this.fetchInitialData();
  },
  
  initData: function() {
    this.setData({
      loading: true,
      error: null,
      data: null
    });
  },
  
  handleParams: function(options) {
    // 处理页面参数
    if (options.id) {
      this.setData({ id: options.id });
    }
  },
  
  fetchInitialData: function() {
    // 请求数据
    wx.request({
      url: 'api/data',
      success: (res) => {
        this.setData({
          data: res.data,
          loading: false
        });
      },
      fail: (error) => {
        this.setData({
          error: error,
          loading: false
        });
      }
    });
  }
});
```

### 2. 资源管理
```javascript
Page({
  data: {
    timer: null,
    audioContext: null
  },
  
  onLoad: function() {
    // 创建资源
    this.data.timer = setInterval(() => {
      // 定时任务
    }, 1000);
    
    this.data.audioContext = wx.createAudioContext('myAudio');
  },
  
  onUnload: function() {
    // 清理资源
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    
    if (this.data.audioContext) {
      this.data.audioContext.destroy();
    }
  }
});
```

### 3. 状态管理
```javascript
Page({
  onShow: function() {
    // 页面显示时更新状态
    this.updateUserInfo();
    this.checkLoginStatus();
  },
  
  updateUserInfo: function() {
    // 更新用户信息
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        });
      }
    });
  },
  
  checkLoginStatus: function() {
    // 检查登录状态
    wx.checkSession({
      success: () => {
        // session 有效
        this.setData({ isLoggedIn: true });
      },
      fail: () => {
        // session 失效
        this.setData({ isLoggedIn: false });
        this.handleLogin();
      }
    });
  }
});
```

## 常见问题

### 1. 生命周期执行顺序问题
- 确保在正确的生命周期中初始化数据
- 注意页面跳转时的生命周期顺序
- 处理好异步操作的生命周期影响

### 2. 内存泄漏问题
- 及时清理定时器
- 释放音频、视频等资源
- 解绑事件监听器

### 3. 状态同步问题
- 使用全局状态管理
- 注意页面间数据传递
- 处理好异步操作的状态更新

## 调试技巧

### 1. 生命周期调试
```javascript
// 添加日志
const logLifecycle = (name) => {
  console.log(`[Lifecycle] ${name}`, {
    timestamp: new Date().toISOString(),
    page: getCurrentPages().length,
    route: getCurrentPages()[getCurrentPages().length - 1]?.route
  });
};

// 在生命周期中使用
Page({
  onLoad: function() {
    logLifecycle('onLoad');
  },
  onShow: function() {
    logLifecycle('onShow');
  }
});
```

### 2. 性能监控
```javascript
// 监控页面加载时间
const pageLoadTime = {
  start: 0,
  end: 0
};

Page({
  onLoad: function() {
    pageLoadTime.start = Date.now();
  },
  
  onReady: function() {
    pageLoadTime.end = Date.now();
    console.log('页面加载时间：', pageLoadTime.end - pageLoadTime.start);
  }
});
```

## 相关资源

1. [官方文档 - 生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html)
2. [官方文档 - 组件生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html)
3. [小程序性能优化指南](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html) 