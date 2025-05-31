# Electron 开发指南

Electron 是一个使用 JavaScript、HTML 和 CSS 构建跨平台桌面应用程序的框架。它结合了 Chromium 和 Node.js，让你可以使用 Web 技术开发桌面应用。

## 目录

### 基础入门
- [开发环境配置](./guide/dev-environment.md) - 环境搭建、工具配置和开发流程
- [快速开始](./guide/getting-started.md) - 创建第一个 Electron 应用
- [主进程与渲染进程](./guide/main-renderer.md) - 理解 Electron 的进程模型
- [应用生命周期](./guide/app-lifecycle.md) - 应用启动、运行和退出流程
- [项目结构](./guide/project-structure.md) - 推荐的项目组织方式
- [窗口管理](./guide/window-management.md) - 创建和管理应用窗口
- [进程间通信](./guide/ipc.md) - 主进程和渲染进程通信
- [调试技巧](./guide/debugging.md) - 主进程和渲染进程调试方法
- [安全模型](./guide/security.md) - Electron 安全模型和最佳实践

### 核心功能
- [系统托盘](./features/tray.md) - 创建和管理系统托盘
- [菜单](./features/menu.md) - 创建应用菜单和上下文菜单
- [对话框](./features/dialog.md) - 使用系统对话框
- [通知](./features/notification.md) - 发送系统通知
- [快捷键](./features/shortcut.md) - 注册全局快捷键
- [剪贴板](./features/clipboard.md) - 操作剪贴板
- [文件系统](./features/file-system.md) - 文件读写操作
- [网络请求](./features/network.md) - 处理网络请求

### 进阶主题
- [进程管理](./advanced/process.md) - 多进程管理和通信
- [日志管理](./advanced/logging.md) - 应用日志记录和管理
- [崩溃报告](./advanced/crash-report.md) - 收集和分析崩溃信息
- [性能优化](./advanced/performance.md) - 应用性能调优
- [安全加固](./advanced/security.md) - 应用安全防护
- [应用打包](./advanced/packaging.md) - 打包和分发应用
- [调试技巧](./advanced/debugging.md) - 高级调试方法
- [自动更新](./advanced/auto-update.md) - 实现应用自动更新
- [国际化](./advanced/i18n.md) - 多语言支持
- [数据存储](./advanced/storage.md) - 本地数据存储方案

### 实战案例
- [基础应用开发](./cases/basic-app.md) - 简单的 Electron 应用开发
- [进阶应用开发](./cases/advanced-app.md) - 复杂功能实现
- [企业级应用开发](./cases/enterprise-app.md) - 企业级应用开发实践

### 最佳实践
- [架构设计](./best-practices/architecture.md) - 应用架构设计指南
- [开发规范](./best-practices/development-practices.md) - 开发规范和流程
- [安全实践](./best-practices/security-practices.md) - 安全开发实践
- [测试实践](./best-practices/testing-practices.md) - 测试策略和方法


## 快速开始

### 环境要求
- Node.js 14.0 或更高版本
- npm 或 yarn 包管理器
- 操作系统：Windows、macOS 或 Linux

### 创建项目
1. 创建项目目录并初始化：
```bash
mkdir my-electron-app
cd my-electron-app
npm init -y
```

2. 安装 Electron：
```bash
npm install electron --save-dev
```

3. 在 package.json 中添加启动脚本：
```json
{
  "scripts": {
    "start": "electron ."
  }
}
```

4. 创建主进程文件 main.js：
```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

5. 创建预加载脚本 preload.js：
```javascript
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

6. 创建渲染进程文件 index.html：
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Electron App</title>
</head>
<body>
    <h1>Hello Electron!</h1>
    <script src="renderer.js"></script>
</body>
</html>
```

## 技术选型建议

### 1. 开发框架
- **Vue.js**: 适合快速开发，生态系统丰富
- **React**: 适合大型应用，组件化开发
- **Angular**: 适合企业级应用，完整的开发框架
- **Svelte**: 适合小型应用，性能优秀

### 2. 构建工具
- **Vite**: 开发体验好，构建速度快
- **Webpack**: 功能强大，配置灵活
- **Electron Forge**: 专门为 Electron 优化
- **Electron Builder**: 打包功能强大

### 3. 状态管理
- **Vuex/Pinia**: Vue 生态
- **Redux/MobX**: React 生态
- **RxJS**: 响应式编程
- **Zustand**: 轻量级状态管理

### 4. UI 框架
- **Element Plus**: Vue 生态
- **Ant Design**: React 生态
- **Tailwind CSS**: 原子化 CSS
- **Electron Store**: 本地存储

## 开发工具推荐

### 1. IDE
- Visual Studio Code
- WebStorm
- Atom

### 2. 调试工具
- Chrome DevTools
- Electron DevTools Extension
- React Developer Tools
- Vue DevTools

### 3. 构建工具
- electron-builder
- electron-forge
- electron-updater
- electron-store

### 4. 测试工具
- Jest
- Spectron
- Electron Mocha
- Playwright

## 学习资源

### 1. 官方资源
- [Electron 官方文档](https://www.electronjs.org/docs)
- [Electron API 文档](https://www.electronjs.org/docs/api)
- [Electron 示例应用](https://github.com/electron/electron-quick-start)

### 2. 社区资源
- [Electron 中文文档](https://electron.org.cn/)
- [Electron 应用开发实战](https://www.electronjs.org/apps)
- [Electron 最佳实践](https://www.electronjs.org/docs/tutorial/security)

### 3. 视频教程
- [Electron 入门到实战](https://www.bilibili.com/video/BV1GJ411x7h7)
- [Electron 应用开发](https://www.bilibili.com/video/BV1GJ411x7h7)

### 4. 书籍推荐
- 《Electron 实战》
- 《Electron 应用开发》
- 《跨平台桌面应用开发》

## 常见问题

### 1. 性能优化
- 使用 V8 引擎优化
- 合理使用多进程
- 优化资源加载
- 使用硬件加速
- 实现懒加载

### 2. 安全防护
- 启用上下文隔离
- 禁用 Node.js 集成
- 使用 CSP
- 验证所有输入
- 使用最新版本

### 3. 打包发布
- 配置打包选项
- 处理依赖问题
- 优化包体积
- 实现自动更新
- 处理签名问题

### 4. 调试技巧
- 使用 Chrome DevTools
- 启用远程调试
- 使用 VS Code 调试
- 记录日志
- 性能分析