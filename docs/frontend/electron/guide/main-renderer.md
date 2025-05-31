 # Electron 主进程与渲染进程

## 进程模型

Electron 应用采用多进程架构，主要包含以下进程：

### 1. 主进程 (Main Process)
- 每个 Electron 应用只有一个主进程
- 负责创建和管理应用窗口
- 控制应用生命周期
- 访问系统 API
- 管理渲染进程

### 2. 渲染进程 (Renderer Process)
- 每个窗口对应一个渲染进程
- 负责渲染页面内容
- 运行 Web 页面代码
- 通过 IPC 与主进程通信

### 3. 预加载脚本 (Preload Script)
- 在渲染进程加载之前运行
- 提供安全的上下文隔离
- 暴露有限的 API 给渲染进程

## 主进程详解

### 1. 主要职责
```javascript
const { app, BrowserWindow } = require('electron')

// 创建窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
}

// 应用生命周期管理
app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

### 2. 常用功能
- 窗口管理
- 菜单创建
- 系统托盘
- 对话框
- 快捷键
- 系统通知

### 3. 安全考虑
- 禁用 nodeIntegration
- 启用 contextIsolation
- 使用 preload 脚本
- 验证 IPC 消息

## 渲染进程详解

### 1. 主要职责
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Renderer Process</title>
</head>
<body>
    <div id="app"></div>
    <script>
        // 通过预加载脚本暴露的 API 与主进程通信
        window.electronAPI.send('toMain', 'Hello from renderer')
        window.electronAPI.receive('fromMain', (data) => {
            console.log('Received from main:', data)
        })
    </script>
</body>
</html>
```

### 2. 常用功能
- 页面渲染
- 用户交互
- 数据展示
- 样式处理
- 动画效果

### 3. 安全考虑
- 不直接访问 Node.js API
- 通过预加载脚本通信
- 使用 CSP 策略
- 验证输入数据

## 进程间通信 (IPC)

### 1. 主进程发送消息
```javascript
// 主进程
const { ipcMain } = require('electron')

// 发送消息到渲染进程
mainWindow.webContents.send('fromMain', 'Hello from main process')

// 接收渲染进程消息
ipcMain.on('toMain', (event, arg) => {
  console.log('Received from renderer:', arg)
})
```

### 2. 渲染进程发送消息
```javascript
// 渲染进程
// 通过预加载脚本暴露的 API
window.electronAPI.send('toMain', 'Hello from renderer')
window.electronAPI.receive('fromMain', (data) => {
  console.log('Received from main:', data)
})
```

### 3. 预加载脚本
```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})
```

## 最佳实践

### 1. 进程职责划分
- 主进程：系统级操作、窗口管理
- 渲染进程：UI 渲染、用户交互
- 预加载脚本：API 桥接、安全检查

### 2. 性能优化
- 合理使用多进程
- 避免进程间频繁通信
- 使用共享内存
- 优化资源加载

### 3. 安全防护
- 启用上下文隔离
- 使用预加载脚本
- 验证 IPC 消息
- 实施 CSP 策略

### 4. 调试技巧
- 使用 Chrome DevTools
- 主进程调试
- 渲染进程调试
- 日志记录

## 常见问题

### 1. 进程通信问题
- 消息未收到
- 数据序列化错误
- 通道名称不匹配
- 权限问题

### 2. 性能问题
- 进程启动慢
- 通信延迟
- 内存占用高
- 资源加载慢

### 3. 安全问题
- 上下文隔离失效
- IPC 消息注入
- 资源访问越权
- 数据泄露

## 相关资源

- [Electron 进程模型](https://www.electronjs.org/docs/tutorial/process-model)
- [IPC 通信](https://www.electronjs.org/docs/api/ipc-main)
- [上下文隔离](https://www.electronjs.org/docs/tutorial/context-isolation)
- [安全最佳实践](https://www.electronjs.org/docs/tutorial/security)