 # Electron 应用架构最佳实践

## 架构设计原则

### 1. 关注点分离
- 主进程和渲染进程职责明确
- 业务逻辑和 UI 层分离
- 数据流清晰可控
- 模块化设计

### 2. 安全性
- 进程隔离
- 上下文隔离
- 沙箱化渲染进程
- 安全的 IPC 通信

### 3. 性能优化
- 按需加载
- 资源管理
- 内存优化
- 启动优化

### 4. 可维护性
- 代码组织
- 错误处理
- 日志管理
- 测试策略

## 目录结构

```
my-electron-app/
├── src/
│   ├── main/                 # 主进程代码
│   │   ├── index.js         # 主进程入口
│   │   ├── ipc/             # IPC 通信处理
│   │   ├── services/        # 主进程服务
│   │   └── utils/           # 主进程工具
│   │
│   ├── renderer/            # 渲染进程代码
│   │   ├── index.html       # 主页面
│   │   ├── pages/          # 页面组件
│   │   ├── components/     # 通用组件
│   │   ├── store/         # 状态管理
│   │   ├── services/      # 渲染进程服务
│   │   └── utils/         # 渲染进程工具
│   │
│   ├── shared/             # 共享代码
│   │   ├── constants/     # 常量定义
│   │   ├── types/        # 类型定义
│   │   └── utils/        # 通用工具
│   │
│   └── preload/           # 预加载脚本
│       ├── index.js       # 预加载入口
│       └── api/          # 预加载 API
│
├── assets/                # 静态资源
│   ├── icons/           # 应用图标
│   ├── images/         # 图片资源
│   └── styles/         # 样式文件
│
├── scripts/             # 构建脚本
│   ├── build.js       # 构建配置
│   └── dev.js        # 开发配置
│
├── tests/              # 测试文件
│   ├── main/         # 主进程测试
│   └── renderer/     # 渲染进程测试
│
├── package.json
├── electron-builder.json
└── README.md
```

## 代码组织

### 1. 主进程代码组织

```javascript
// src/main/index.js
const { app, BrowserWindow } = require('electron')
const { setupIPC } = require('./ipc')
const { setupServices } = require('./services')
const { createWindow } = require('./window')

class MainProcess {
  constructor() {
    this.windows = new Map()
    this.services = new Map()
  }

  async init() {
    // 初始化服务
    await this.setupServices()
    
    // 设置 IPC 通信
    this.setupIPC()
    
    // 创建主窗口
    this.createMainWindow()
    
    // 注册应用事件
    this.registerAppEvents()
  }

  async setupServices() {
    // 初始化各个服务
    const services = await setupServices()
    services.forEach((service, name) => {
      this.services.set(name, service)
    })
  }

  setupIPC() {
    // 设置 IPC 通信
    setupIPC(this)
  }

  createMainWindow() {
    const mainWindow = createWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/index.js')
      }
    })
    
    this.windows.set('main', mainWindow)
  }

  registerAppEvents() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (this.windows.get('main') === null) {
        this.createMainWindow()
      }
    })
  }
}

// 启动应用
const mainProcess = new MainProcess()
app.whenReady().then(() => mainProcess.init())
```

### 2. 渲染进程代码组织

```javascript
// src/renderer/index.js
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { setupIPC } from './services/ipc'

// 创建应用实例
const app = createApp(App)

// 配置应用
function setupApp() {
  // 使用插件
  app.use(store)
  app.use(router)
  
  // 设置 IPC 通信
  setupIPC(app)
  
  // 注册全局组件
  registerGlobalComponents(app)
  
  // 注册全局属性
  registerGlobalProperties(app)
}

// 启动应用
setupApp()
app.mount('#app')
```

### 3. 预加载脚本组织

```javascript
// src/preload/index.js
const { contextBridge, ipcRenderer } = require('electron')
const { setupAPI } = require('./api')

// 创建安全的 API
const api = setupAPI(ipcRenderer)

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', api)
```

## 进程通信

### 1. IPC 通信设计

```javascript
// src/main/ipc/index.js
const { ipcMain } = require('electron')

class IPCManager {
  constructor(mainProcess) {
    this.mainProcess = mainProcess
    this.handlers = new Map()
  }

  setup() {
    // 注册 IPC 处理器
    this.registerHandlers()
    
    // 设置错误处理
    this.setupErrorHandling()
  }

  registerHandlers() {
    // 注册各个模块的 IPC 处理器
    this.registerWindowHandlers()
    this.registerAppHandlers()
    this.registerServiceHandlers()
  }

  registerWindowHandlers() {
    ipcMain.handle('window:minimize', (event, windowId) => {
      const window = this.mainProcess.windows.get(windowId)
      if (window) {
        window.minimize()
      }
    })
    
    // 注册其他窗口相关处理器...
  }

  registerAppHandlers() {
    ipcMain.handle('app:getVersion', () => {
      return app.getVersion()
    })
    
    // 注册其他应用相关处理器...
  }

  registerServiceHandlers() {
    // 注册服务相关处理器
    this.mainProcess.services.forEach((service, name) => {
      if (service.setupIPC) {
        service.setupIPC(ipcMain, this.mainProcess)
      }
    })
  }

  setupErrorHandling() {
    ipcMain.on('error', (event, error) => {
      console.error('IPC Error:', error)
      // 处理错误...
    })
  }
}

module.exports = { IPCManager }
```

### 2. 渲染进程通信

```javascript
// src/renderer/services/ipc.js
export function setupIPC(app) {
  // 创建 IPC 服务
  const ipcService = {
    // 发送消息
    send(channel, ...args) {
      return window.electronAPI.send(channel, ...args)
    },
    
    // 调用方法
    invoke(channel, ...args) {
      return window.electronAPI.invoke(channel, ...args)
    },
    
    // 监听消息
    on(channel, callback) {
      return window.electronAPI.receive(channel, callback)
    }
  }
  
  // 注册为全局属性
  app.config.globalProperties.$ipc = ipcService
}
```

## 状态管理

### 1. 主进程状态

```javascript
// src/main/store/index.js
class MainStore {
  constructor() {
    this.state = new Map()
    this.subscribers = new Map()
  }

  // 设置状态
  setState(key, value) {
    this.state.set(key, value)
    this.notifySubscribers(key)
  }

  // 获取状态
  getState(key) {
    return this.state.get(key)
  }

  // 订阅状态变化
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key).add(callback)
  }

  // 通知订阅者
  notifySubscribers(key) {
    const value = this.state.get(key)
    const subscribers = this.subscribers.get(key)
    if (subscribers) {
      subscribers.forEach(callback => callback(value))
    }
  }
}

module.exports = new MainStore()
```

### 2. 渲染进程状态

```javascript
// src/renderer/store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    // 应用状态
    app: {
      version: '',
      isReady: false
    },
    // 用户状态
    user: {
      isLoggedIn: false,
      profile: null
    },
    // 窗口状态
    window: {
      isMaximized: false,
      isFullscreen: false
    }
  },
  
  mutations: {
    // 更新应用状态
    updateApp(state, payload) {
      state.app = { ...state.app, ...payload }
    },
    
    // 更新用户状态
    updateUser(state, payload) {
      state.user = { ...state.user, ...payload }
    },
    
    // 更新窗口状态
    updateWindow(state, payload) {
      state.window = { ...state.window, ...payload }
    }
  },
  
  actions: {
    // 异步操作
    async initializeApp({ commit }) {
      try {
        const version = await window.electronAPI.invoke('app:getVersion')
        commit('updateApp', { version, isReady: true })
      } catch (error) {
        console.error('初始化应用失败:', error)
      }
    }
  }
})
```

## 错误处理

### 1. 主进程错误处理

```javascript
// src/main/utils/error-handler.js
const { dialog } = require('electron')
const log = require('electron-log')

class ErrorHandler {
  constructor(mainProcess) {
    this.mainProcess = mainProcess
    this.setupErrorHandling()
  }

  setupErrorHandling() {
    // 处理未捕获的异常
    process.on('uncaughtException', (error) => {
      this.handleError(error)
    })

    // 处理未处理的 Promise 拒绝
    process.on('unhandledRejection', (reason) => {
      this.handleError(reason)
    })

    // 处理渲染进程崩溃
    this.mainProcess.windows.forEach((window) => {
      window.webContents.on('crashed', (event, killed) => {
        this.handleRendererCrash(window, killed)
      })
    })
  }

  handleError(error) {
    // 记录错误
    log.error('应用错误:', error)

    // 显示错误对话框
    dialog.showErrorBox(
      '应用错误',
      '发生了一个错误，应用可能需要重启。\n\n' +
      '错误信息: ' + error.message
    )

    // 保存错误报告
    this.saveErrorReport(error)
  }

  handleRendererCrash(window, killed) {
    log.error('渲染进程崩溃:', { killed })

    // 显示崩溃对话框
    dialog.showMessageBox(window, {
      type: 'error',
      title: '渲染进程崩溃',
      message: '渲染进程已崩溃，是否重新加载？',
      buttons: ['重新加载', '关闭'],
      defaultId: 0
    }).then(({ response }) => {
      if (response === 0) {
        window.reload()
      } else {
        window.close()
      }
    })
  }

  saveErrorReport(error) {
    const report = {
      type: 'error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      version: app.getVersion()
    }

    // 保存错误报告
    // ...
  }
}

module.exports = ErrorHandler
```

### 2. 渲染进程错误处理

```javascript
// src/renderer/utils/error-handler.js
export class ErrorHandler {
  constructor(app) {
    this.app = app
    this.setupErrorHandling()
  }

  setupErrorHandling() {
    // 全局错误处理
    window.addEventListener('error', (event) => {
      this.handleError(event.error)
    })

    // Promise 错误处理
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason)
    })

    // Vue 错误处理
    this.app.config.errorHandler = (error, instance, info) => {
      this.handleVueError(error, instance, info)
    }
  }

  handleError(error) {
    // 记录错误
    console.error('渲染进程错误:', error)

    // 发送错误到主进程
    window.electronAPI.send('error', {
      type: 'renderer',
      message: error.message,
      stack: error.stack
    })

    // 显示错误提示
    this.showErrorNotification(error)
  }

  handleVueError(error, instance, info) {
    // 记录 Vue 错误
    console.error('Vue 错误:', {
      error,
      component: instance?.$options?.name,
      info
    })

    // 发送错误到主进程
    window.electronAPI.send('error', {
      type: 'vue',
      message: error.message,
      stack: error.stack,
      component: instance?.$options?.name,
      info
    })
  }

  showErrorNotification(error) {
    // 使用通知组件显示错误
    // ...
  }
}
```

## 日志管理

### 1. 主进程日志

```javascript
// src/main/utils/logger.js
const log = require('electron-log')
const path = require('path')

class Logger {
  constructor() {
    this.setupLogger()
  }

  setupLogger() {
    // 配置日志
    log.transports.file.level = 'debug'
    log.transports.file.maxSize = 10 * 1024 * 1024 // 10MB
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
    
    // 配置日志文件路径
    log.transports.file.resolvePath = () => {
      return path.join(app.getPath('userData'), 'logs/main.log')
    }
    
    // 配置控制台输出
    log.transports.console.level = 'info'
    log.transports.console.format = '[{level}] {text}'
  }

  // 记录不同级别的日志
  debug(message, ...args) {
    log.debug(message, ...args)
  }

  info(message, ...args) {
    log.info(message, ...args)
  }

  warn(message, ...args) {
    log.warn(message, ...args)
  }

  error(message, ...args) {
    log.error(message, ...args)
  }

  // 记录性能日志
  performance(action, duration) {
    log.info(`Performance [${action}]: ${duration}ms`)
  }

  // 记录用户操作
  userAction(action, details) {
    log.info(`User Action [${action}]:`, details)
  }
}

module.exports = new Logger()
```

### 2. 渲染进程日志

```javascript
// src/renderer/utils/logger.js
export class Logger {
  constructor() {
    this.setupLogger()
  }

  setupLogger() {
    // 重写控制台方法
    this.originalConsole = { ...console }
    this.setupConsoleOverride()
  }

  setupConsoleOverride() {
    const levels = ['debug', 'info', 'warn', 'error']
    
    levels.forEach(level => {
      console[level] = (...args) => {
        // 调用原始方法
        this.originalConsole[level](...args)
        
        // 发送日志到主进程
        window.electronAPI.send('log', {
          level,
          message: args,
          timestamp: new Date().toISOString()
        })
      }
    })
  }

  // 记录性能日志
  performance(action, duration) {
    console.info(`Performance [${action}]: ${duration}ms`)
  }

  // 记录用户操作
  userAction(action, details) {
    console.info(`User Action [${action}]:`, details)
  }
}

export const logger = new Logger()
```

## 测试策略

### 1. 单元测试

```javascript
// tests/main/services/app.test.js
const { expect } = require('chai')
const AppService = require('../../../src/main/services/app')

describe('AppService', () => {
  let appService

  beforeEach(() => {
    appService = new AppService()
  })

  it('should get app version', () => {
    const version = appService.getVersion()
    expect(version).to.be.a('string')
  })

  it('should check for updates', async () => {
    const update = await appService.checkForUpdates()
    expect(update).to.be.an('object')
  })
})
```

### 2. 集成测试

```javascript
// tests/integration/ipc.test.js
const { expect } = require('chai')
const { app } = require('electron')
const { setupIPC } = require('../../src/main/ipc')

describe('IPC Communication', () => {
  before(async () => {
    await app.whenReady()
    setupIPC()
  })

  it('should handle window operations', async () => {
    const result = await window.electronAPI.invoke('window:minimize')
    expect(result).to.be.true
  })

  it('should handle app operations', async () => {
    const version = await window.electronAPI.invoke('app:getVersion')
    expect(version).to.be.a('string')
  })
})
```

### 3. E2E 测试

```javascript
// tests/e2e/app.test.js
const { expect } = require('chai')
const { Application } = require('spectron')

describe('Application', () => {
  let app

  beforeEach(async () => {
    app = new Application({
      path: require('electron'),
      args: ['.']
    })
    await app.start()
  })

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  it('should launch the app', async () => {
    const isVisible = await app.browserWindow.isVisible()
    expect(isVisible).to.be.true
  })

  it('should show the main window', async () => {
    const title = await app.client.getTitle()
    expect(title).to.equal('My Electron App')
  })
})
```

## 构建和部署

### 1. 构建配置

```javascript
// electron-builder.json
{
  "appId": "com.your.app",
  "productName": "Your App",
  "directories": {
    "output": "dist"
  },
  "files": [
    "dist/**/*",
    "package.json"
  ],
  "win": {
    "target": [
      "nsis",
      "portable"
    ],
    "icon": "assets/icons/icon.ico"
  },
  "mac": {
    "target": [
      "dmg",
      "zip"
    ],
    "icon": "assets/icons/icon.icns"
  },
  "linux": {
    "target": [
      "AppImage",
      "deb"
    ],
    "icon": "assets/icons/icon.png"
  },
  "publish": {
    "provider": "github",
    "owner": "your-username",
    "repo": "your-repo"
  }
}
```

### 2. 开发脚本

```json
// package.json
{
  "scripts": {
    "start": "electron .",
    "dev": "concurrently \"npm run dev:vite\" \"npm run dev:electron\"",
    "dev:vite": "vite",
    "dev:electron": "electron .",
    "build": "npm run build:vite && npm run build:electron",
    "build:vite": "vite build",
    "build:electron": "electron-builder",
    "test": "mocha tests/**/*.test.js",
    "test:e2e": "mocha tests/e2e/**/*.test.js"
  }
}
```

## 性能优化

### 1. 启动优化

```javascript
// src/main/utils/startup-optimizer.js
class StartupOptimizer {
  constructor(mainProcess) {
    this.mainProcess = mainProcess
  }

  async optimize() {
    // 延迟加载非关键模块
    await this.lazyLoadModules()
    
    // 优化窗口创建
    this.optimizeWindowCreation()
    
    // 预加载资源
    this.preloadResources()
  }

  async lazyLoadModules() {
    // 使用动态导入
    const modules = {
      'auto-updater': () => import('./auto-updater'),
      'crash-reporter': () => import('./crash-reporter')
    }

    // 按需加载模块
    for (const [name, loader] of Object.entries(modules)) {
      if (this.shouldLoadModule(name)) {
        const module = await loader()
        this.mainProcess.services.set(name, module.default)
      }
    }
  }

  optimizeWindowCreation() {
    // 使用窗口池
    this.windowPool = new Map()
    
    // 预创建窗口
    this.precreateWindows()
  }

  preloadResources() {
    // 预加载常用资源
    const resources = [
      'assets/icons/app.png',
      'assets/styles/main.css'
    ]

    resources.forEach(resource => {
      this.preloadResource(resource)
    })
  }
}
```

### 2. 运行时优化

```javascript
// src/main/utils/runtime-optimizer.js
class RuntimeOptimizer {
  constructor(mainProcess) {
    this.mainProcess = mainProcess
    this.setupOptimization()
  }

  setupOptimization() {
    // 监控内存使用
    this.monitorMemory()
    
    // 优化 IPC 通信
    this.optimizeIPC()
    
    // 管理窗口资源
    this.manageWindowResources()
  }

  monitorMemory() {
    setInterval(() => {
      const memory = process.memoryUsage()
      
      // 检查内存使用
      if (memory.heapUsed > 500 * 1024 * 1024) { // 500MB
        this.cleanupMemory()
      }
    }, 30000) // 每 30 秒
  }

  optimizeIPC() {
    // 使用消息批处理
    this.messageQueue = new Map()
    this.batchTimeout = 100 // 100ms
    
    // 设置批处理定时器
    setInterval(() => {
      this.processMessageBatch()
    }, this.batchTimeout)
  }

  manageWindowResources() {
    // 监控窗口资源
    this.mainProcess.windows.forEach((window) => {
      window.webContents.on('did-finish-load', () => {
        this.optimizeWindowResources(window)
      })
    })
  }
}
```

## 安全实践

### 1. 进程安全

```javascript
// src/main/utils/security.js
class SecurityManager {
  constructor(mainProcess) {
    this.mainProcess = mainProcess
    this.setupSecurity()
  }

  setupSecurity() {
    // 设置 CSP
    this.setupCSP()
    
    // 配置沙箱
    this.setupSandbox()
    
    // 设置权限控制
    this.setupPermissions()
  }

  setupCSP() {
    // 设置内容安全策略
    const csp = `
      default-src 'self';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      connect-src 'self' https:;
    `

    // 应用到所有窗口
    this.mainProcess.windows.forEach((window) => {
      window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [csp]
          }
        })
      })
    })
  }

  setupSandbox() {
    // 配置渲染进程沙箱
    this.mainProcess.windows.forEach((window) => {
      window.webContents.setWebPreferences({
        sandbox: true,
        contextIsolation: true,
        nodeIntegration: false
      })
    })
  }

  setupPermissions() {
    // 设置权限控制
    this.permissions = new Map()
    
    // 注册权限检查
    ipcMain.handle('check-permission', (event, permission) => {
      return this.checkPermission(permission)
    })
  }
}
```

### 2. 数据安全

```javascript
// src/main/utils/data-security.js
class DataSecurity {
  constructor() {
    this.setupEncryption()
  }

  setupEncryption() {
    // 初始化加密
    this.crypto = require('crypto')
    this.algorithm = 'aes-256-gcm'
    this.key = this.generateKey()
  }

  // 加密数据
  encrypt(data) {
    const iv = this.crypto.randomBytes(12)
    const cipher = this.crypto.createCipheriv(this.algorithm, this.key, iv)
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    }
  }

  // 解密数据
  decrypt(encrypted, iv, authTag) {
    const decipher = this.crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    )
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'))
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return JSON.parse(decrypted)
  }

  // 生成密钥
  generateKey() {
    return this.crypto.scryptSync('your-password', 'salt', 32)
  }
}
```

## 相关资源

- [Electron 安全指南](https://www.electronjs.org/docs/tutorial/security)
- [Electron 性能优化](https://www.electronjs.org/docs/tutorial/performance)
- [Electron 应用架构](https://www.electronjs.org/docs/tutorial/application-architecture)
- [Electron 最佳实践](https://www.electronjs.org/docs/tutorial/best-practices)