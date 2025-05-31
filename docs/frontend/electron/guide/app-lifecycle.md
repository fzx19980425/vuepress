 # Electron 应用生命周期

## 生命周期概述

Electron 应用的生命周期由主进程控制，主要包括以下阶段：

### 1. 启动阶段
- 应用初始化
- 创建主窗口
- 加载预加载脚本
- 准备渲染进程

### 2. 运行阶段
- 窗口管理
- 事件处理
- 进程通信
- 资源管理

### 3. 退出阶段
- 保存数据
- 清理资源
- 关闭窗口
- 退出应用

## 生命周期事件

### 1. 启动事件
```javascript
const { app } = require('electron')

// 应用准备就绪
app.whenReady().then(() => {
  createWindow()
})

// 所有窗口关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 应用激活
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

### 2. 运行事件
```javascript
// 窗口创建
app.on('browser-window-created', (event, window) => {
  console.log('Window created:', window.id)
})

// 窗口聚焦
app.on('browser-window-focus', (event, window) => {
  console.log('Window focused:', window.id)
})

// 窗口失焦
app.on('browser-window-blur', (event, window) => {
  console.log('Window blurred:', window.id)
})
```

### 3. 退出事件
```javascript
// 退出前
app.on('before-quit', (event) => {
  // 可以阻止退出
  // event.preventDefault()
  console.log('Application is about to quit')
})

// 退出时
app.on('quit', (event, exitCode) => {
  console.log('Application quit with code:', exitCode)
})

// 退出后
app.on('will-quit', (event) => {
  console.log('Application will quit')
})
```

## 生命周期管理

### 1. 启动管理
```javascript
// 检查单实例
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 处理第二个实例
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// 初始化应用
app.whenReady().then(() => {
  // 创建主窗口
  createWindow()
  
  // 初始化其他服务
  initializeServices()
  
  // 设置全局快捷键
  setupShortcuts()
})
```

### 2. 运行管理
```javascript
// 窗口状态管理
function manageWindowState() {
  // 保存窗口状态
  window.on('close', () => {
    saveWindowState(window)
  })
  
  // 恢复窗口状态
  window.on('ready-to-show', () => {
    restoreWindowState(window)
  })
}

// 资源管理
function manageResources() {
  // 监控内存使用
  setInterval(() => {
    const memoryUsage = process.memoryUsage()
    console.log('Memory usage:', memoryUsage)
  }, 5000)
  
  // 清理缓存
  session.clearCache()
}
```

### 3. 退出管理
```javascript
// 优雅退出
async function gracefulQuit() {
  // 保存数据
  await saveUserData()
  
  // 清理资源
  cleanupResources()
  
  // 关闭所有窗口
  BrowserWindow.getAllWindows().forEach(window => {
    window.close()
  })
  
  // 退出应用
  app.quit()
}

// 强制退出
function forceQuit() {
  app.exit(0)
}
```

## 最佳实践

### 1. 启动优化
- 使用单实例锁
- 延迟加载非关键资源
- 实现启动画面
- 优化初始化流程

### 2. 运行优化
- 实现窗口状态保存
- 管理内存使用
- 处理异常情况
- 实现自动更新

### 3. 退出优化
- 实现优雅退出
- 保存用户数据
- 清理临时文件
- 处理未完成操作

## 常见问题

### 1. 启动问题
- 启动速度慢
- 多实例问题
- 初始化失败
- 资源加载错误

### 2. 运行问题
- 内存泄漏
- 窗口状态异常
- 进程通信失败
- 性能下降

### 3. 退出问题
- 数据未保存
- 资源未释放
- 进程未完全退出
- 更新失败

## 调试技巧

### 1. 生命周期调试
```javascript
// 添加详细日志
app.on('ready', () => {
  console.log('App is ready')
})

app.on('window-all-closed', () => {
  console.log('All windows closed')
})

app.on('before-quit', () => {
  console.log('App is about to quit')
})
```

### 2. 性能监控
```javascript
// 监控内存使用
setInterval(() => {
  const usage = process.memoryUsage()
  console.log('Memory usage:', {
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(usage.external / 1024 / 1024)}MB`
  })
}, 5000)
```

### 3. 错误处理
```javascript
// 全局错误处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // 可以在这里保存错误日志
})

// 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason)
  // 可以在这里保存错误日志
})
```

## 相关资源

- [Electron 应用生命周期](https://www.electronjs.org/docs/api/app)
- [窗口管理](https://www.electronjs.org/docs/api/browser-window)
- [进程管理](https://www.electronjs.org/docs/api/process)
- [调试指南](https://www.electronjs.org/docs/tutorial/debugging-main-process)