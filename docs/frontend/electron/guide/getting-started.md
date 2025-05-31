 # Electron 入门指南

## 简介

Electron 是一个使用 JavaScript、HTML 和 CSS 构建跨平台桌面应用程序的框架。它通过将 Chromium 和 Node.js 合并到同一个运行时环境中，让开发者可以使用 Web 技术构建原生应用。

### 主要特点

- 跨平台：支持 Windows、macOS 和 Linux
- Web 技术：使用 HTML、CSS 和 JavaScript 开发
- 原生能力：访问操作系统 API 和硬件功能
- 自动更新：内置应用更新机制
- 丰富的生态系统：大量现成的模块和工具

## 环境准备

### 1. 安装 Node.js

首先需要安装 Node.js 环境：

```bash
# 使用 nvm 安装 Node.js（推荐）
nvm install 16
nvm use 16

# 或直接从官网下载安装包
# https://nodejs.org/
```

### 2. 安装开发工具

推荐使用 Visual Studio Code 作为开发工具：

```bash
# 安装 VS Code
# https://code.visualstudio.com/

# 推荐安装的 VS Code 插件
- ESLint
- Prettier
- Debugger for Chrome
- Electron Snippets
```

### 3. 安装 Electron

```bash
# 创建项目目录
mkdir my-electron-app
cd my-electron-app

# 初始化项目
npm init -y

# 安装 Electron
npm install electron --save-dev

# 安装其他常用依赖
npm install electron-builder --save-dev
npm install electron-store --save
npm install electron-updater --save
```

## 创建第一个应用

### 1. 项目结构

```
my-electron-app/
├── package.json
├── main.js
├── preload.js
├── src/
│   ├── index.html
│   ├── styles/
│   │   └── main.css
│   └── scripts/
│       └── renderer.js
└── assets/
    └── icons/
```

### 2. 配置 package.json

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "My First Electron App",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "dev": "electron . --debug",
    "build": "electron-builder",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  }
}
```

### 3. 创建主进程文件 (main.js)

```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

// 保持对窗口对象的全局引用
let mainWindow

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载应用的 index.html
  mainWindow.loadFile('src/index.html')

  // 打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  // 监听窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 当 Electron 完成初始化时创建窗口
app.whenReady().then(createWindow)

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
```

### 4. 创建预加载脚本 (preload.js)

```javascript
const { contextBridge, ipcRenderer } = require('electron')

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到主进程
  send: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  // 从主进程接收消息
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  },
  // 调用主进程方法
  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data)
  }
})
```

### 5. 创建渲染进程文件 (src/index.html)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Electron App</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <h1>Hello Electron!</h1>
  <div id="app">
    <button id="click-me">Click Me</button>
    <p id="counter">Count: 0</p>
  </div>
  <script src="scripts/renderer.js"></script>
</body>
</html>
```

### 6. 创建渲染进程脚本 (src/scripts/renderer.js)

```javascript
// 使用预加载脚本暴露的 API
let count = 0

document.getElementById('click-me').addEventListener('click', () => {
  count++
  document.getElementById('counter').textContent = `Count: ${count}`
  
  // 发送消息到主进程
  window.electronAPI.send('counter-update', count)
})

// 接收来自主进程的消息
window.electronAPI.receive('counter-response', (data) => {
  console.log('Received from main process:', data)
})
```

### 7. 添加样式 (src/styles/main.css)

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

#counter {
  margin-top: 20px;
  font-size: 18px;
  color: #333;
}
```

## 运行应用

### 1. 开发模式

```bash
# 启动应用
npm start

# 调试模式启动
npm run dev
```

### 2. 打包应用

```bash
# 构建应用
npm run build
```

## 开发技巧

### 1. 调试技巧

- 使用 Chrome DevTools 调试渲染进程
- 使用 VS Code 调试主进程
- 使用 `console.log` 进行日志记录
- 使用 `electron-devtools-installer` 安装开发工具

### 2. 开发工具

```bash
# 安装开发工具
npm install electron-devtools-installer --save-dev
```

```javascript
// 在 main.js 中安装开发工具
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

app.whenReady().then(async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await installExtension(REACT_DEVELOPER_TOOLS)
    } catch (e) {
      console.error('开发工具安装失败:', e)
    }
  }
  createWindow()
})
```

### 3. 热重载

```bash
# 安装热重载工具
npm install electron-reloader --save-dev
```

```javascript
// 在 main.js 中启用热重载
if (process.env.NODE_ENV === 'development') {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true
  })
}
```

## 常见问题

### 1. 安装问题

- 确保 Node.js 版本兼容
- 检查网络连接
- 清除 npm 缓存
- 使用管理员权限

### 2. 运行问题

- 检查文件路径
- 确认依赖安装完整
- 查看错误日志
- 检查权限设置

### 3. 打包问题

- 配置正确的构建选项
- 检查资源文件路径
- 确认签名证书
- 处理依赖问题

## 下一步

- 学习 [项目结构](./project-structure.md)
- 了解 [主进程和渲染进程](./main-renderer.md)
- 掌握 [应用生命周期](./app-lifecycle.md)
- 探索 [窗口管理](./window-management.md)
- 学习 [进程间通信](./ipc.md)

## 相关资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Electron API 文档](https://www.electronjs.org/docs/api)
- [Electron 示例应用](https://github.com/electron/electron-quick-start)
- [Electron 社区](https://www.electronjs.org/community)
- [Electron 安全指南](https://www.electronjs.org/docs/tutorial/security)