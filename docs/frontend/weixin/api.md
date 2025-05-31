# API 使用指南

## 网络请求

### 1. 基础请求
```javascript
// 发起请求
wx.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    id: 1,
    name: 'test'
  },
  header: {
    'content-type': 'application/json',
    'Authorization': 'Bearer token'
  },
  success: function(res) {
    console.log('请求成功：', res.data);
  },
  fail: function(error) {
    console.error('请求失败：', error);
  },
  complete: function() {
    console.log('请求完成');
  }
});
```

### 2. 请求封装
```javascript
// utils/request.js
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject
    });
  });
};

// 使用示例
async function fetchData() {
  try {
    const data = await request({
      url: 'https://api.example.com/data',
      method: 'GET'
    });
    console.log('数据：', data);
  } catch (error) {
    console.error('错误：', error);
  }
}
```

### 3. 上传文件
```javascript
wx.uploadFile({
  url: 'https://api.example.com/upload',
  filePath: tempFilePath,
  name: 'file',
  formData: {
    'user': 'test'
  },
  success: function(res) {
    console.log('上传成功：', res.data);
  }
});
```

### 4. 下载文件
```javascript
wx.downloadFile({
  url: 'https://example.com/file.pdf',
  success: function(res) {
    if (res.statusCode === 200) {
      wx.openDocument({
        filePath: res.tempFilePath,
        success: function() {
          console.log('打开文档成功');
        }
      });
    }
  }
});
```

## 数据缓存

### 1. 同步存储
```javascript
// 存储数据
wx.setStorageSync('key', 'value');

// 获取数据
const value = wx.getStorageSync('key');

// 删除数据
wx.removeStorageSync('key');

// 清空数据
wx.clearStorageSync();
```

### 2. 异步存储
```javascript
// 存储数据
wx.setStorage({
  key: 'key',
  data: 'value',
  success: function() {
    console.log('存储成功');
  }
});

// 获取数据
wx.getStorage({
  key: 'key',
  success: function(res) {
    console.log('获取成功：', res.data);
  }
});
```

### 3. 缓存管理
```javascript
// 获取缓存信息
wx.getStorageInfo({
  success: function(res) {
    console.log('缓存信息：', {
      keys: res.keys,
      currentSize: res.currentSize,
      limitSize: res.limitSize
    });
  }
});
```

## 界面交互

### 1. 提示框
```javascript
// 显示提示
wx.showToast({
  title: '操作成功',
  icon: 'success',
  duration: 2000
});

// 显示加载
wx.showLoading({
  title: '加载中...',
  mask: true
});

// 隐藏加载
wx.hideLoading();

// 显示模态框
wx.showModal({
  title: '提示',
  content: '确认删除？',
  success: function(res) {
    if (res.confirm) {
      console.log('用户点击确定');
    } else if (res.cancel) {
      console.log('用户点击取消');
    }
  }
});
```

### 2. 导航栏
```javascript
// 设置导航栏标题
wx.setNavigationBarTitle({
  title: '新标题'
});

// 设置导航栏颜色
wx.setNavigationBarColor({
  frontColor: '#ffffff',
  backgroundColor: '#000000'
});

// 显示/隐藏导航栏加载动画
wx.showNavigationBarLoading();
wx.hideNavigationBarLoading();
```

### 3. 页面跳转
```javascript
// 页面跳转
wx.navigateTo({
  url: '/pages/detail/detail?id=1'
});

// 重定向
wx.redirectTo({
  url: '/pages/index/index'
});

// 返回
wx.navigateBack({
  delta: 1
});

// 切换 Tab
wx.switchTab({
  url: '/pages/index/index'
});
```

## 设备能力

### 1. 位置服务
```javascript
// 获取当前位置
wx.getLocation({
  type: 'wgs84',
  success: function(res) {
    const { latitude, longitude } = res;
    console.log('当前位置：', { latitude, longitude });
  }
});

// 使用地图选择位置
wx.chooseLocation({
  success: function(res) {
    console.log('选择的位置：', res);
  }
});
```

### 2. 相机和相册
```javascript
// 拍照或从相册选择
wx.chooseImage({
  count: 1,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: function(res) {
    const tempFilePaths = res.tempFilePaths;
    console.log('选择的图片：', tempFilePaths);
  }
});

// 预览图片
wx.previewImage({
  current: '当前图片url',
  urls: ['图片url列表']
});
```

### 3. 扫码
```javascript
wx.scanCode({
  onlyFromCamera: false,
  scanType: ['qrCode', 'barCode'],
  success: function(res) {
    console.log('扫码结果：', res.result);
  }
});
```

## 用户信息

### 1. 登录
```javascript
// 登录
wx.login({
  success: function(res) {
    if (res.code) {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log('登录成功：', res.code);
    }
  }
});

// 检查登录状态
wx.checkSession({
  success: function() {
    // session_key 未过期
    console.log('登录状态有效');
  },
  fail: function() {
    // session_key 已过期
    console.log('登录状态已过期');
  }
});
```

### 2. 用户信息
```javascript
// 获取用户信息
wx.getUserProfile({
  desc: '用于完善用户资料',
  success: function(res) {
    console.log('用户信息：', res.userInfo);
  }
});

// 获取用户设置
wx.getSetting({
  success: function(res) {
    console.log('用户设置：', res.authSetting);
  }
});
```

## 支付功能

### 1. 发起支付
```javascript
wx.requestPayment({
  timeStamp: '',
  nonceStr: '',
  package: '',
  signType: 'MD5',
  paySign: '',
  success: function(res) {
    console.log('支付成功');
  },
  fail: function(res) {
    console.log('支付失败');
  }
});
```

## 分享功能

### 1. 分享到聊天
```javascript
Page({
  onShareAppMessage: function() {
    return {
      title: '分享标题',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    };
  }
});
```

### 2. 分享到朋友圈
```javascript
Page({
  onShareTimeline: function() {
    return {
      title: '分享到朋友圈的标题',
      query: 'id=1',
      imageUrl: '/images/share.png'
    };
  }
});
```

## 性能优化

### 1. 预加载
```javascript
// 预加载数据
Page({
  onLoad: function() {
    this.preloadData();
  },
  
  preloadData: function() {
    // 预加载下一页数据
    wx.request({
      url: 'https://api.example.com/next-page',
      success: (res) => {
        this.setData({
          nextPageData: res.data
        });
      }
    });
  }
});
```

### 2. 图片优化
```javascript
// 图片预加载
const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = wx.createImage();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
};

// 使用示例
async function preloadImages(urls) {
  try {
    await Promise.all(urls.map(url => preloadImage(url)));
    console.log('图片预加载完成');
  } catch (error) {
    console.error('图片预加载失败：', error);
  }
}
```

## 错误处理

### 1. 全局错误处理
```javascript
// app.js
App({
  onError: function(error) {
    console.error('全局错误：', error);
    // 上报错误
    this.reportError(error);
  },
  
  reportError: function(error) {
    wx.request({
      url: 'https://api.example.com/error-report',
      method: 'POST',
      data: {
        error: error.toString(),
        time: new Date().toISOString(),
        page: getCurrentPages().length > 0 
          ? getCurrentPages()[getCurrentPages().length - 1].route 
          : 'unknown'
      }
    });
  }
});
```

### 2. 请求错误处理
```javascript
// 请求错误处理
const handleRequestError = (error) => {
  if (error.statusCode === 401) {
    // 未授权，跳转登录
    wx.navigateTo({
      url: '/pages/login/login'
    });
  } else if (error.statusCode === 403) {
    // 无权限
    wx.showToast({
      title: '无权限访问',
      icon: 'none'
    });
  } else if (error.statusCode === 500) {
    // 服务器错误
    wx.showToast({
      title: '服务器错误',
      icon: 'none'
    });
  } else {
    // 其他错误
    wx.showToast({
      title: '请求失败',
      icon: 'none'
    });
  }
};
```

## 调试技巧

### 1. 日志管理
```javascript
// 日志工具
const logger = {
  info: function(message, ...args) {
    console.log(`[INFO] ${message}`, ...args);
  },
  
  error: function(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  warn: function(message, ...args) {
    console.warn(`[WARN] ${message}`, ...args);
  },
  
  debug: function(message, ...args) {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
};

// 使用示例
logger.info('用户登录成功', { userId: 123 });
logger.error('请求失败', error);
```

### 2. 性能监控
```javascript
// 性能监控
const performance = {
  start: function(name) {
    this.marks = this.marks || {};
    this.marks[name] = Date.now();
  },
  
  end: function(name) {
    if (this.marks[name]) {
      const duration = Date.now() - this.marks[name];
      console.log(`${name} 耗时：${duration}ms`);
      delete this.marks[name];
    }
  }
};

// 使用示例
performance.start('页面加载');
// ... 执行操作
performance.end('页面加载');
```

## 相关资源

1. [官方文档 - API 列表](https://developers.weixin.qq.com/miniprogram/dev/api/)
2. [官方文档 - 网络请求](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)
3. [官方文档 - 数据缓存](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)
4. [官方文档 - 界面交互](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html)
5. [官方文档 - 设备能力](https://developers.weixin.qq.com/miniprogram/dev/api/device/location/wx.getLocation.html)
6. [官方文档 - 用户信息](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html)
7. [官方文档 - 支付功能](https://developers.weixin.qq.com/miniprogram/dev/api/payment/wx.requestPayment.html)
8. [官方文档 - 分享功能](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) 