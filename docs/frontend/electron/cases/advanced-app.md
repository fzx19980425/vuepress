 # Electron 高级应用案例

## 应用概述

这是一个高级的 Electron 应用示例，展示了如何构建一个功能丰富的桌面应用。该应用包含以下高级特性：

- 多窗口管理
- 进程间通信
- 本地数据库
- 自动更新
- 系统集成
- 性能优化
- 安全特性
- 国际化支持

## 项目结构

```
advanced-app/
├── src/
│   ├── main/
│   │   ├── index.js              # 主进程入口
│   │   ├── windows/              # 窗口管理
│   │   │   ├── main.js           # 主窗口
│   │   │   ├── settings.js       # 设置窗口
│   │   │   └── about.js          # 关于窗口
│   │   ├── services/             # 服务
│   │   │   ├── database.js       # 数据库服务
│   │   │   ├── updater.js        # 更新服务
│   │   │   └── security.js       # 安全服务
│   │   ├── ipc/                  # IPC 通信
│   │   │   ├── handlers/         # 处理器
│   │   │   └── events/           # 事件
│   │   └── utils/                # 工具函数
│   ├── renderer/
│   │   ├── windows/              # 窗口页面
│   │   │   ├── main/            # 主窗口
│   │   │   ├── settings/        # 设置窗口
│   │   │   └── about/           # 关于窗口
│   │   ├── components/          # 组件
│   │   │   ├── common/          # 通用组件
│   │   │   └── specific/        # 特定组件
│   │   ├── store/               # 状态管理
│   │   │   ├── index.js         # 状态入口
│   │   │   ├── modules/         # 状态模块
│   │   │   └── plugins/         # 状态插件
│   │   ├── i18n/                # 国际化
│   │   │   ├── locales/         # 语言文件
│   │   │   └── index.js         # 国际化配置
│   │   └── styles/              # 样式
│   │       ├── themes/          # 主题
│   │       └── components/      # 组件样式
│   └── shared/                  # 共享代码
│       ├── constants/           # 常量
│       ├── types/               # 类型定义
│       └── utils/               # 工具函数
├── scripts/                     # 脚本
│   ├── build.js                 # 构建脚本
│   ├── dev.js                   # 开发脚本
│   └── test.js                  # 测试脚本
├── config/                      # 配置
│   ├── webpack/                 # Webpack 配置
│   ├── electron-builder/        # 打包配置
│   └── jest/                    # 测试配置
├── package.json                 # 项目配置
└── README.md                    # 项目说明
```

## 核心功能

### 1. 多窗口管理

```javascript
// src/main/windows/manager.js
const { BrowserWindow, screen } = require('electron')
const path = require('path')

class WindowManager {
  constructor() {
    this.windows = new Map()
    this.setupWindowEvents()
  }

  // 创建主窗口
  createMainWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    const mainWindow = new BrowserWindow({
      width: Math.min(1200, width * 0.8),
      height: Math.min(800, height * 0.8),
      minWidth: 800,
      minHeight: 600,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js')
      }
    })

    // 加载主页面
    mainWindow.loadFile(path.join(__dirname, '../../renderer/windows/main/index.html'))

    // 窗口准备就绪后显示
    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
      mainWindow.focus()
    })

    // 存储窗口引用
    this.windows.set('main', mainWindow)
    return mainWindow
  }

  // 创建设置窗口
  createSettingsWindow() {
    const settingsWindow = new BrowserWindow({
      width: 600,
      height: 400,
      parent: this.windows.get('main'),
      modal: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js')
      }
    })

    // 加载设置页面
    settingsWindow.loadFile(path.join(__dirname, '../../renderer/windows/settings/index.html'))

    // 存储窗口引用
    this.windows.set('settings', settingsWindow)
    return settingsWindow
  }

  // 创建关于窗口
  createAboutWindow() {
    const aboutWindow = new BrowserWindow({
      width: 400,
      height: 300,
      parent: this.windows.get('main'),
      modal: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js')
      }
    })

    // 加载关于页面
    aboutWindow.loadFile(path.join(__dirname, '../../renderer/windows/about/index.html'))

    // 存储窗口引用
    this.windows.set('about', aboutWindow)
    return aboutWindow
  }

  // 设置窗口事件
  setupWindowEvents() {
    // 监听窗口关闭
    BrowserWindow.getAllWindows().forEach(window => {
      window.on('closed', () => {
        // 从 Map 中移除窗口引用
        for (const [key, value] of this.windows.entries()) {
          if (value === window) {
            this.windows.delete(key)
            break
          }
        }
      })
    })
  }

  // 获取窗口
  getWindow(name) {
    return this.windows.get(name)
  }

  // 关闭窗口
  closeWindow(name) {
    const window = this.windows.get(name)
    if (window) {
      window.close()
    }
  }

  // 关闭所有窗口
  closeAllWindows() {
    BrowserWindow.getAllWindows().forEach(window => {
      window.close()
    })
  }
}

module.exports = new WindowManager()
```

### 2. 数据库服务

```javascript
// src/main/services/database.js
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path')
const fs = require('fs')

class DatabaseService {
  constructor() {
    this.db = null
    this.setupDatabase()
  }

  // 设置数据库
  async setupDatabase() {
    // 确保数据目录存在
    const dataDir = path.join(app.getPath('userData'), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // 打开数据库连接
    this.db = await open({
      filename: path.join(dataDir, 'app.db'),
      driver: sqlite3.Database
    })

    // 创建表
    await this.createTables()
  }

  // 创建表
  async createTables() {
    // 用户表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 设置表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 数据表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)
  }

  // 用户操作
  async createUser(username, email) {
    return await this.db.run(
      'INSERT INTO users (username, email) VALUES (?, ?)',
      [username, email]
    )
  }

  async getUser(id) {
    return await this.db.get('SELECT * FROM users WHERE id = ?', [id])
  }

  async updateUser(id, data) {
    const fields = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]

    return await this.db.run(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    )
  }

  async deleteUser(id) {
    return await this.db.run('DELETE FROM users WHERE id = ?', [id])
  }

  // 设置操作
  async getSetting(key) {
    return await this.db.get('SELECT value FROM settings WHERE key = ?', [key])
  }

  async setSetting(key, value) {
    return await this.db.run(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    )
  }

  // 数据操作
  async createData(title, content, userId) {
    return await this.db.run(
      'INSERT INTO data (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, userId]
    )
  }

  async getData(id) {
    return await this.db.get('SELECT * FROM data WHERE id = ?', [id])
  }

  async updateData(id, data) {
    const fields = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]

    return await this.db.run(
      `UPDATE data SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    )
  }

  async deleteData(id) {
    return await this.db.run('DELETE FROM data WHERE id = ?', [id])
  }

  // 查询操作
  async searchData(query) {
    return await this.db.all(
      'SELECT * FROM data WHERE title LIKE ? OR content LIKE ?',
      [`%${query}%`, `%${query}%`]
    )
  }

  // 事务操作
  async transaction(callback) {
    return await this.db.transaction(callback)
  }

  // 关闭数据库
  async close() {
    if (this.db) {
      await this.db.close()
      this.db = null
    }
  }
}

module.exports = new DatabaseService()
```

### 3. 更新服务

```javascript
// src/main/services/updater.js
const { autoUpdater } = require('electron-updater')
const { dialog } = require('electron')
const log = require('electron-log')

class UpdateService {
  constructor() {
    this.setupUpdater()
  }

  // 设置更新器
  setupUpdater() {
    // 配置日志
    autoUpdater.logger = log
    autoUpdater.logger.transports.file.level = 'info'

    // 配置更新选项
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true

    // 设置更新服务器
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'your-username',
      repo: 'your-repo',
      token: process.env.GITHUB_TOKEN
    })

    // 监听更新事件
    this.setupUpdateEvents()
  }

  // 设置更新事件
  setupUpdateEvents() {
    // 检查更新错误
    autoUpdater.on('error', (error) => {
      dialog.showErrorBox('更新错误', error.message)
    })

    // 检查更新
    autoUpdater.on('checking-for-update', () => {
      log.info('正在检查更新...')
    })

    // 有可用更新
    autoUpdater.on('update-available', (info) => {
      log.info('发现新版本:', info)
      dialog.showMessageBox({
        type: 'info',
        title: '发现新版本',
        message: `发现新版本 ${info.version}，是否现在更新？`,
        buttons: ['是', '否']
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
    })

    // 没有可用更新
    autoUpdater.on('update-not-available', (info) => {
      log.info('当前已是最新版本:', info)
    })

    // 更新下载进度
    autoUpdater.on('download-progress', (progress) => {
      log.info('下载进度:', progress)
    })

    // 更新下载完成
    autoUpdater.on('update-downloaded', (info) => {
      log.info('更新下载完成:', info)
      dialog.showMessageBox({
        type: 'info',
        title: '更新就绪',
        message: '新版本已下载完成，是否立即安装？',
        buttons: ['是', '否']
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
    })
  }

  // 检查更新
  async checkForUpdates() {
    try {
      await autoUpdater.checkForUpdates()
    } catch (error) {
      log.error('检查更新失败:', error)
      throw error
    }
  }

  // 下载更新
  async downloadUpdate() {
    try {
      await autoUpdater.downloadUpdate()
    } catch (error) {
      log.error('下载更新失败:', error)
      throw error
    }
  }

  // 安装更新
  async installUpdate() {
    try {
      await autoUpdater.quitAndInstall()
    } catch (error) {
      log.error('安装更新失败:', error)
      throw error
    }
  }
}

module.exports = new UpdateService()
```

### 4. 安全服务

```javascript
// src/main/services/security.js
const crypto = require('crypto')
const { session } = require('electron')
const Store = require('electron-store')

class SecurityService {
  constructor() {
    this.setupSecurity()
  }

  // 设置安全选项
  setupSecurity() {
    // 配置安全存储
    this.store = new Store({
      name: 'secure-data',
      encryptionKey: this.generateEncryptionKey()
    })

    // 配置会话安全
    this.setupSessionSecurity()

    // 配置 CSP
    this.setupCSP()
  }

  // 生成加密密钥
  generateEncryptionKey() {
    return crypto.scryptSync(
      process.env.ENCRYPTION_PASSWORD || 'default-password',
      process.env.ENCRYPTION_SALT || 'default-salt',
      32
    )
  }

  // 设置会话安全
  setupSessionSecurity() {
    // 配置会话选项
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      // 允许的权限列表
      const allowedPermissions = [
        'notifications',
        'media'
      ]

      // 检查权限
      if (allowedPermissions.includes(permission)) {
        callback(true)
      } else {
        callback(false)
      }
    })

    // 配置 Web 安全
    session.defaultSession.setSpellCheckerDictionaryDownloadEnabled(false)
    session.defaultSession.setPreloads([])
  }

  // 设置 CSP
  setupCSP() {
    // 配置内容安全策略
    const csp = `
      default-src 'self';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      connect-src 'self' https:;
      font-src 'self';
      object-src 'none';
      media-src 'self';
      frame-src 'none';
    `

    // 应用 CSP
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [csp],
          'X-Content-Type-Options': ['nosniff'],
          'X-Frame-Options': ['DENY'],
          'X-XSS-Protection': ['1; mode=block']
        }
      })
    })
  }

  // 加密数据
  encrypt(data) {
    try {
      // 生成随机 IV
      const iv = crypto.randomBytes(12)
      
      // 创建加密器
      const cipher = crypto.createCipheriv('aes-256-gcm', this.generateEncryptionKey(), iv)
      
      // 加密数据
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      // 获取认证标签
      const authTag = cipher.getAuthTag()
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      }
    } catch (error) {
      throw new Error('加密失败: ' + error.message)
    }
  }

  // 解密数据
  decrypt(encrypted, iv, authTag) {
    try {
      // 创建解密器
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        this.generateEncryptionKey(),
        Buffer.from(iv, 'hex')
      )
      
      // 设置认证标签
      decipher.setAuthTag(Buffer.from(authTag, 'hex'))
      
      // 解密数据
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return JSON.parse(decrypted)
    } catch (error) {
      throw new Error('解密失败: ' + error.message)
    }
  }

  // 安全存储数据
  async secureStore(key, value) {
    try {
      // 加密数据
      const encrypted = this.encrypt(value)
      
      // 存储加密数据
      await this.store.set(key, encrypted)
      
      return true
    } catch (error) {
      console.error('安全存储失败:', error)
      return false
    }
  }

  // 安全获取数据
  async secureRetrieve(key) {
    try {
      // 获取加密数据
      const encrypted = await this.store.get(key)
      
      if (!encrypted) {
        return null
      }
      
      // 解密数据
      return this.decrypt(
        encrypted.encrypted,
        encrypted.iv,
        encrypted.authTag
      )
    } catch (error) {
      console.error('安全获取失败:', error)
      return null
    }
  }

  // 安全删除数据
  async secureDelete(key) {
    try {
      await this.store.delete(key)
      return true
    } catch (error) {
      console.error('安全删除失败:', error)
      return false
    }
  }

  // 清除所有数据
  async secureClear() {
    try {
      await this.store.clear()
      return true
    } catch (error) {
      console.error('安全清除失败:', error)
      return false
    }
  }
}

module.exports = new SecurityService()
```

### 5. 国际化支持

```javascript
// src/renderer/i18n/index.js
const i18n = require('i18next')
const { initReactI18next } = require('react-i18next')
const Backend = require('i18next-fs-backend')
const path = require('path')

class I18nService {
  constructor() {
    this.setupI18n()
  }

  // 设置国际化
  async setupI18n() {
    // 初始化 i18next
    await i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        // 默认语言
        lng: 'zh-CN',
        
        // 回退语言
        fallbackLng: 'en',
        
        // 命名空间
        ns: ['common', 'app'],
        defaultNS: 'common',
        
        // 后端配置
        backend: {
          loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json')
        },
        
        // 调试模式
        debug: process.env.NODE_ENV === 'development',
        
        // 插值配置
        interpolation: {
          escapeValue: false
        }
      })
  }

  // 切换语言
  async changeLanguage(lng) {
    try {
      await i18n.changeLanguage(lng)
      return true
    } catch (error) {
      console.error('切换语言失败:', error)
      return false
    }
  }

  // 获取当前语言
  getCurrentLanguage() {
    return i18n.language
  }

  // 获取可用语言
  getAvailableLanguages() {
    return i18n.languages
  }

  // 添加语言
  async addLanguage(lng, resources) {
    try {
      await i18n.addResourceBundle(lng, 'common', resources)
      return true
    } catch (error) {
      console.error('添加语言失败:', error)
      return false
    }
  }
}

module.exports = new I18nService()
```

## 性能优化

### 1. 启动优化

```javascript
// src/main/index.js
const { app } = require('electron')
const path = require('path')

class AppOptimizer {
  constructor() {
    this.setupOptimization()
  }

  // 设置优化选项
  setupOptimization() {
    // 禁用硬件加速
    app.disableHardwareAcceleration()
    
    // 设置进程优先级
    process.setPriority('normal')
    
    // 配置内存限制
    app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')
    
    // 配置缓存
    this.setupCache()
  }

  // 设置缓存
  setupCache() {
    // 配置会话缓存
    session.defaultSession.clearCache()
    session.defaultSession.clearStorageData({
      storages: ['cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage']
    })
    
    // 设置缓存限制
    session.defaultSession.setCacheSize(100 * 1024 * 1024) // 100MB
  }

  // 优化启动
  async optimizeStartup() {
    // 延迟加载
    await this.delayLoad()
    
    // 预加载资源
    await this.preloadResources()
    
    // 优化渲染
    await this.optimizeRendering()
  }

  // 延迟加载
  async delayLoad() {
    // 延迟加载非关键模块
    const modules = [
      './services/database',
      './services/updater',
      './services/security'
    ]
    
    for (const module of modules) {
      await new Promise(resolve => setTimeout(resolve, 100))
      require(module)
    }
  }

  // 预加载资源
  async preloadResources() {
    // 预加载常用资源
    const resources = [
      'images/logo.png',
      'styles/main.css',
      'scripts/vendor.js'
    ]
    
    for (const resource of resources) {
      await new Promise(resolve => {
        const img = new Image()
        img.onload = resolve
        img.src = path.join(__dirname, resource)
      })
    }
  }

  // 优化渲染
  async optimizeRendering() {
    // 设置渲染选项
    app.commandLine.appendSwitch('disable-gpu')
    app.commandLine.appendSwitch('disable-software-rasterizer')
    app.commandLine.appendSwitch('disable-gpu-compositing')
    
    // 设置窗口选项
    BrowserWindow.getAllWindows().forEach(window => {
      window.setBackgroundColor('#ffffff')
      window.setHasShadow(false)
    })
  }
}

module.exports = new AppOptimizer()
```

### 2. 运行时优化

```javascript
// src/main/services/performance.js
const { performance } = require('perf_hooks')
const { app, BrowserWindow } = require('electron')

class PerformanceService {
  constructor() {
    this.setupMonitoring()
  }

  // 设置监控
  setupMonitoring() {
    // 监控 CPU 使用率
    this.monitorCPU()
    
    // 监控内存使用
    this.monitorMemory()
    
    // 监控 GPU 使用
    this.monitorGPU()
    
    // 监控网络请求
    this.monitorNetwork()
  }

  // 监控 CPU
  monitorCPU() {
    setInterval(() => {
      const usage = process.cpuUsage()
      console.log('CPU Usage:', usage)
      
      // 检查 CPU 使用率
      if (usage.user + usage.system > 80) {
        this.handleHighCPUUsage()
      }
    }, 1000)
  }

  // 监控内存
  monitorMemory() {
    setInterval(() => {
      const memory = process.memoryUsage()
      console.log('Memory Usage:', memory)
      
      // 检查内存使用
      if (memory.heapUsed > 500 * 1024 * 1024) { // 500MB
        this.handleHighMemoryUsage()
      }
    }, 1000)
  }

  // 监控 GPU
  monitorGPU() {
    app.on('gpu-process-crashed', (event, killed) => {
      console.log('GPU Process Crashed:', killed)
      this.handleGPUCrash()
    })
  }

  // 监控网络
  monitorNetwork() {
    session.defaultSession.webRequest.onCompleted((details) => {
      console.log('Network Request:', details)
      
      // 检查请求时间
      if (details.timeStamp > 1000) { // 1秒
        this.handleSlowRequest(details)
      }
    })
  }

  // 处理高 CPU 使用
  handleHighCPUUsage() {
    // 降低进程优先级
    process.setPriority('below-normal')
    
    // 清理内存
    global.gc()
    
    // 通知用户
    this.notifyUser('high-cpu')
  }

  // 处理高内存使用
  handleHighMemoryUsage() {
    // 清理内存
    global.gc()
    
    // 清理缓存
    session.defaultSession.clearCache()
    
    // 通知用户
    this.notifyUser('high-memory')
  }

  // 处理 GPU 崩溃
  handleGPUCrash() {
    // 重启 GPU 进程
    app.relaunch()
    app.exit(0)
  }

  // 处理慢请求
  handleSlowRequest(details) {
    // 记录慢请求
    console.log('Slow Request:', details)
    
    // 通知用户
    this.notifyUser('slow-request')
  }

  // 通知用户
  notifyUser(type) {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      window.webContents.send('performance:warning', { type })
    }
  }

  // 性能分析
  async profilePerformance() {
    // 开始分析
    const start = performance.now()
    
    // 收集性能数据
    const cpu = process.cpuUsage()
    const memory = process.memoryUsage()
    const uptime = process.uptime()
    
    // 结束分析
    const end = performance.now()
    
    return {
      duration: end - start,
      cpu,
      memory,
      uptime
    }
  }
}

module.exports = new PerformanceService()
```

## 相关资源

- [Electron 文档](https://www.electronjs.org/docs)
- [Electron 安全指南](https://www.electronjs.org/docs/tutorial/security)
- [Electron 性能指南](https://www.electronjs.org/docs/tutorial/performance)
- [Electron 打包指南](https://www.electronjs.org/docs/tutorial/application-distribution)
- [SQLite 文档](https://www.sqlite.org/docs.html)
- [i18next 文档](https://www.i18next.com/)
- [Electron Store 文档](https://github.com/sindresorhus/electron-store)
- [Electron Updater 文档](https://www.electron.build/auto-update)