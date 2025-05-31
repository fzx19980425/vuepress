 # Electron 安全最佳实践

## 安全原则

### 1. 最小权限原则
- 只请求必要的权限
- 限制 API 访问范围
- 使用沙箱环境
- 实施访问控制

### 2. 纵深防御
- 多层安全防护
- 进程隔离
- 数据加密
- 输入验证

### 3. 安全通信
- 使用 HTTPS
- 验证证书
- 加密敏感数据
- 安全的 IPC 通信

### 4. 安全更新
- 自动更新机制
- 更新验证
- 回滚机制
- 漏洞修复

## 进程安全

### 1. 主进程安全

```javascript
// 主进程安全配置
const { app, BrowserWindow } = require('electron')
const path = require('path')

class MainProcessSecurity {
  constructor() {
    this.setupSecurity()
  }

  setupSecurity() {
    // 禁用远程模块
    app.disableHardwareAcceleration()
    app.commandLine.appendSwitch('disable-remote-module')
    
    // 设置安全选项
    app.commandLine.appendSwitch('enable-sandbox')
    app.commandLine.appendSwitch('no-zygote')
    
    // 配置安全策略
    this.setupSecurityPolicy()
  }

  setupSecurityPolicy() {
    // 设置内容安全策略
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

    // 应用到所有窗口
    app.on('web-contents-created', (event, contents) => {
      contents.session.webRequest.onHeadersReceived((details, callback) => {
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
    })
  }

  createSecureWindow() {
    return new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }
}
```

### 2. 渲染进程安全

```javascript
// 渲染进程安全配置
class RendererSecurity {
  constructor() {
    this.setupSecurity()
  }

  setupSecurity() {
    // 禁用危险功能
    this.disableDangerousFeatures()
    
    // 设置安全选项
    this.setupSecurityOptions()
    
    // 配置 CSP
    this.setupCSP()
  }

  disableDangerousFeatures() {
    // 禁用 eval
    window.eval = () => {
      throw new Error('eval is disabled for security reasons')
    }
    
    // 禁用 Function 构造函数
    window.Function = () => {
      throw new Error('Function constructor is disabled for security reasons')
    }
    
    // 禁用 innerHTML
    Element.prototype._innerHTML = Element.prototype.innerHTML
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set(value) {
        // 检查 XSS
        if (this.containsXSS(value)) {
          throw new Error('Potential XSS attack detected')
        }
        this._innerHTML = value
      },
      get() {
        return this._innerHTML
      }
    })
  }

  setupSecurityOptions() {
    // 配置安全选项
    if (window.electronAPI) {
      // 限制 API 访问
      const allowedAPIs = ['safeMethod1', 'safeMethod2']
      const restrictedAPI = new Proxy(window.electronAPI, {
        get(target, prop) {
          if (allowedAPIs.includes(prop)) {
            return target[prop]
          }
          throw new Error(`Access to ${prop} is restricted`)
        }
      })
      
      // 替换原始 API
      window.electronAPI = restrictedAPI
    }
  }

  setupCSP() {
    // 设置 CSP 报告
    if (window.ReportingObserver) {
      const observer = new ReportingObserver((reports) => {
        reports.forEach(report => {
          // 处理 CSP 违规报告
          window.electronAPI.send('csp-violation', report)
        })
      }, { buffered: true })
      
      observer.observe()
    }
  }

  containsXSS(str) {
    // 检查 XSS 攻击
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:/gi
    ]
    
    return xssPatterns.some(pattern => pattern.test(str))
  }
}
```

### 3. 预加载脚本安全

```javascript
// 预加载脚本安全配置
const { contextBridge, ipcRenderer } = require('electron')

class PreloadSecurity {
  constructor() {
    this.setupSecurity()
  }

  setupSecurity() {
    // 验证 API
    this.validateAPI()
    
    // 设置安全通信
    this.setupSecureCommunication()
    
    // 配置上下文隔离
    this.setupContextIsolation()
  }

  validateAPI() {
    // 定义安全的 API
    const safeAPI = {
      // 只读属性
      get appVersion() {
        return process.env.APP_VERSION
      },
      
      // 安全的方法
      safeMethod: (data) => {
        // 验证输入
        if (!this.validateInput(data)) {
          throw new Error('Invalid input')
        }
        return ipcRenderer.invoke('safe-method', data)
      }
    }
    
    // 暴露安全的 API
    contextBridge.exposeInMainWorld('electronAPI', safeAPI)
  }

  setupSecureCommunication() {
    // 设置安全的 IPC 通信
    const originalSend = ipcRenderer.send
    ipcRenderer.send = (channel, data) => {
      // 验证通道
      if (!this.isAllowedChannel(channel)) {
        throw new Error(`Channel ${channel} is not allowed`)
      }
      
      // 验证数据
      if (!this.validateData(data)) {
        throw new Error('Invalid data')
      }
      
      // 发送消息
      originalSend(channel, data)
    }
  }

  setupContextIsolation() {
    // 确保上下文隔离
    if (!process.contextIsolated) {
      throw new Error('Context isolation must be enabled')
    }
  }

  validateInput(data) {
    // 验证输入数据
    if (typeof data !== 'object') {
      return false
    }
    
    // 检查必需字段
    const requiredFields = ['id', 'type']
    if (!requiredFields.every(field => field in data)) {
      return false
    }
    
    // 验证数据类型
    if (typeof data.id !== 'string' || typeof data.type !== 'string') {
      return false
    }
    
    return true
  }

  isAllowedChannel(channel) {
    // 允许的通道列表
    const allowedChannels = [
      'safe-channel-1',
      'safe-channel-2'
    ]
    
    return allowedChannels.includes(channel)
  }

  validateData(data) {
    // 验证数据
    try {
      // 检查数据大小
      if (JSON.stringify(data).length > 1024 * 1024) { // 1MB
        return false
      }
      
      // 检查数据类型
      if (typeof data !== 'object') {
        return false
      }
      
      // 检查数据内容
      return this.validateDataContent(data)
    } catch (error) {
      return false
    }
  }

  validateDataContent(data) {
    // 验证数据内容
    const allowedTypes = ['string', 'number', 'boolean', 'object']
    
    for (const [key, value] of Object.entries(data)) {
      // 检查键名
      if (!/^[a-zA-Z0-9_]+$/.test(key)) {
        return false
      }
      
      // 检查值类型
      if (!allowedTypes.includes(typeof value)) {
        return false
      }
      
      // 递归检查对象
      if (typeof value === 'object' && value !== null) {
        if (!this.validateDataContent(value)) {
          return false
        }
      }
    }
    
    return true
  }
}
```

## 数据安全

### 1. 数据加密

```javascript
// 数据加密工具
const crypto = require('crypto')

class DataEncryption {
  constructor() {
    this.setupEncryption()
  }

  setupEncryption() {
    // 初始化加密
    this.algorithm = 'aes-256-gcm'
    this.key = this.generateKey()
  }

  // 加密数据
  encrypt(data) {
    try {
      // 生成随机 IV
      const iv = crypto.randomBytes(12)
      
      // 创建加密器
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
      
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
      throw new Error('Encryption failed: ' + error.message)
    }
  }

  // 解密数据
  decrypt(encrypted, iv, authTag) {
    try {
      // 创建解密器
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(iv, 'hex')
      )
      
      // 设置认证标签
      decipher.setAuthTag(Buffer.from(authTag, 'hex'))
      
      // 解密数据
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return JSON.parse(decrypted)
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message)
    }
  }

  // 生成密钥
  generateKey() {
    // 使用密码和盐生成密钥
    const password = process.env.ENCRYPTION_PASSWORD
    const salt = process.env.ENCRYPTION_SALT
    
    if (!password || !salt) {
      throw new Error('Encryption password or salt not set')
    }
    
    return crypto.scryptSync(password, salt, 32)
  }

  // 安全存储密钥
  secureStoreKey() {
    // 使用系统密钥环存储密钥
    const keytar = require('keytar')
    
    return {
      async store(key) {
        await keytar.setPassword('my-app', 'encryption-key', key)
      },
      
      async retrieve() {
        return await keytar.getPassword('my-app', 'encryption-key')
      }
    }
  }
}
```

### 2. 安全存储

```javascript
// 安全存储工具
const Store = require('electron-store')
const { DataEncryption } = require('./data-encryption')

class SecureStore {
  constructor() {
    this.encryption = new DataEncryption()
    this.setupStore()
  }

  setupStore() {
    // 配置存储
    this.store = new Store({
      name: 'secure-data',
      encryptionKey: this.encryption.key,
      clearInvalidConfig: true
    })
  }

  // 安全存储数据
  async set(key, value) {
    try {
      // 加密数据
      const encrypted = this.encryption.encrypt(value)
      
      // 存储加密数据
      await this.store.set(key, encrypted)
      
      return true
    } catch (error) {
      console.error('Secure storage failed:', error)
      return false
    }
  }

  // 安全获取数据
  async get(key) {
    try {
      // 获取加密数据
      const encrypted = await this.store.get(key)
      
      if (!encrypted) {
        return null
      }
      
      // 解密数据
      return this.encryption.decrypt(
        encrypted.encrypted,
        encrypted.iv,
        encrypted.authTag
      )
    } catch (error) {
      console.error('Secure retrieval failed:', error)
      return null
    }
  }

  // 安全删除数据
  async delete(key) {
    try {
      await this.store.delete(key)
      return true
    } catch (error) {
      console.error('Secure deletion failed:', error)
      return false
    }
  }

  // 清除所有数据
  async clear() {
    try {
      await this.store.clear()
      return true
    } catch (error) {
      console.error('Secure clear failed:', error)
      return false
    }
  }
}
```

## 通信安全

### 1. IPC 通信安全

```javascript
// IPC 通信安全配置
const { ipcMain, ipcRenderer } = require('electron')

class IPCSecurity {
  constructor() {
    this.setupSecurity()
  }

  setupSecurity() {
    // 验证 IPC 通信
    this.validateIPC()
    
    // 设置安全通道
    this.setupSecureChannels()
    
    // 监控通信
    this.monitorCommunication()
  }

  validateIPC() {
    // 验证主进程 IPC
    if (process.type === 'renderer') {
      const originalSend = ipcRenderer.send
      ipcRenderer.send = (channel, data) => {
        // 验证通道
        if (!this.isAllowedChannel(channel)) {
          throw new Error(`Channel ${channel} is not allowed`)
        }
        
        // 验证数据
        if (!this.validateData(data)) {
          throw new Error('Invalid data')
        }
        
        // 发送消息
        originalSend(channel, data)
      }
    }
    
    // 验证渲染进程 IPC
    if (process.type === 'browser') {
      ipcMain.on('*', (event, channel, ...args) => {
        // 验证发送者
        if (!this.validateSender(event.sender)) {
          event.sender.send('error', 'Unauthorized sender')
          return
        }
        
        // 验证通道
        if (!this.isAllowedChannel(channel)) {
          event.sender.send('error', 'Unauthorized channel')
          return
        }
        
        // 验证数据
        if (!this.validateData(args)) {
          event.sender.send('error', 'Invalid data')
          return
        }
      })
    }
  }

  setupSecureChannels() {
    // 定义安全通道
    this.secureChannels = new Map()
    
    // 注册安全通道
    this.registerSecureChannel('app:getVersion', {
      validate: (data) => !data, // 不需要数据
      handler: () => app.getVersion()
    })
    
    this.registerSecureChannel('app:quit', {
      validate: (data) => !data, // 不需要数据
      handler: () => app.quit()
    })
  }

  monitorCommunication() {
    // 监控 IPC 通信
    const metrics = {
      messages: new Map(),
      errors: new Map()
    }
    
    // 记录消息
    const logMessage = (channel, success) => {
      const count = metrics.messages.get(channel) || 0
      metrics.messages.set(channel, count + 1)
      
      if (!success) {
        const errors = metrics.errors.get(channel) || 0
        metrics.errors.set(channel, errors + 1)
      }
    }
    
    // 定期报告
    setInterval(() => {
      console.log('IPC Metrics:', {
        messages: Object.fromEntries(metrics.messages),
        errors: Object.fromEntries(metrics.errors)
      })
    }, 60000) // 每分钟
  }

  isAllowedChannel(channel) {
    // 允许的通道列表
    const allowedChannels = [
      'app:getVersion',
      'app:quit',
      'window:minimize',
      'window:maximize'
    ]
    
    return allowedChannels.includes(channel)
  }

  validateData(data) {
    // 验证数据
    try {
      // 检查数据大小
      if (JSON.stringify(data).length > 1024 * 1024) { // 1MB
        return false
      }
      
      // 检查数据类型
      if (typeof data !== 'object') {
        return false
      }
      
      // 检查数据内容
      return this.validateDataContent(data)
    } catch (error) {
      return false
    }
  }

  validateSender(sender) {
    // 验证发送者
    const allowedOrigins = [
      'file://',
      'https://your-app.com'
    ]
    
    return allowedOrigins.some(origin => 
      sender.getURL().startsWith(origin)
    )
  }
}
```

### 2. 网络通信安全

```javascript
// 网络通信安全配置
const { net } = require('electron')
const https = require('https')
const tls = require('tls')

class NetworkSecurity {
  constructor() {
    this.setupSecurity()
  }

  setupSecurity() {
    // 配置 TLS
    this.setupTLS()
    
    // 设置证书验证
    this.setupCertificateValidation()
    
    // 配置代理
    this.setupProxy()
  }

  setupTLS() {
    // 配置 TLS 选项
    this.tlsOptions = {
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3',
      ciphers: [
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256'
      ].join(':'),
      honorCipherOrder: true,
      rejectUnauthorized: true
    }
  }

  setupCertificateValidation() {
    // 设置证书验证
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      // 检查证书
      if (this.validateCertificate(certificate)) {
        // 允许证书
        event.preventDefault()
        callback(true)
      } else {
        // 拒绝证书
        callback(false)
      }
    })
  }

  setupProxy() {
    // 配置代理
    session.defaultSession.setProxy({
      mode: 'system',
      proxyRules: process.env.HTTP_PROXY
    })
  }

  // 安全请求
  async secureRequest(options) {
    return new Promise((resolve, reject) => {
      const request = net.request({
        ...options,
        ...this.tlsOptions
      })
      
      // 设置超时
      request.setTimeout(30000) // 30 秒
      
      // 处理响应
      request.on('response', (response) => {
        let data = ''
        
        response.on('data', (chunk) => {
          data += chunk
        })
        
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            data
          })
        })
      })
      
      // 处理错误
      request.on('error', (error) => {
        reject(error)
      })
      
      // 发送请求
      if (options.data) {
        request.write(JSON.stringify(options.data))
      }
      
      request.end()
    })
  }

  validateCertificate(certificate) {
    // 验证证书
    try {
      // 检查证书链
      const chain = certificate.chain
      if (!chain || chain.length === 0) {
        return false
      }
      
      // 检查证书有效期
      const now = Date.now()
      if (now < certificate.validStart || now > certificate.validExpiry) {
        return false
      }
      
      // 检查证书指纹
      const allowedFingerprints = [
        'sha256/...', // 添加允许的证书指纹
      ]
      
      return allowedFingerprints.includes(certificate.fingerprint)
    } catch (error) {
      return false
    }
  }
}
```

## 更新安全

### 1. 自动更新安全

```javascript
// 自动更新安全配置
const { autoUpdater } = require('electron-updater')
const { createHash } = require('crypto')

class UpdateSecurity {
  constructor() {
    this.setupSecurity()
  }

  setupSecurity() {
    // 配置更新
    this.setupUpdater()
    
    // 验证更新
    this.setupVerification()
    
    // 监控更新
    this.monitorUpdates()
  }

  setupUpdater() {
    // 配置自动更新
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true
    
    // 设置更新服务器
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'your-username',
      repo: 'your-repo',
      token: process.env.GITHUB_TOKEN
    })
  }

  setupVerification() {
    // 验证更新包
    autoUpdater.on('update-downloaded', (info) => {
      // 验证更新包
      if (this.verifyUpdate(info)) {
        // 安装更新
        autoUpdater.quitAndInstall()
      } else {
        // 删除更新包
        autoUpdater.removeUpdate()
      }
    })
  }

  monitorUpdates() {
    // 监控更新状态
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...')
    })
    
    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info)
    })
    
    autoUpdater.on('update-not-available', (info) => {
      console.log('No update available:', info)
    })
    
    autoUpdater.on('error', (error) => {
      console.error('Update error:', error)
    })
    
    autoUpdater.on('download-progress', (progress) => {
      console.log('Download progress:', progress)
    })
  }

  verifyUpdate(info) {
    try {
      // 验证更新包
      const filePath = info.path
      const expectedHash = info.sha256
      
      // 计算文件哈希
      const fileHash = this.calculateFileHash(filePath)
      
      // 比较哈希值
      return fileHash === expectedHash
    } catch (error) {
      console.error('Update verification failed:', error)
      return false
    }
  }

  calculateFileHash(filePath) {
    // 计算文件哈希
    const hash = createHash('sha256')
    const fileBuffer = require('fs').readFileSync(filePath)
    
    hash.update(fileBuffer)
    return hash.digest('hex')
  }
}
```

### 2. 更新回滚

```javascript
// 更新回滚配置
class UpdateRollback {
  constructor() {
    this.setupRollback()
  }

  setupRollback() {
    // 配置回滚
    this.rollbackEnabled = true
    this.maxRollbacks = 3
    this.rollbackHistory = []
    
    // 监听更新事件
    autoUpdater.on('update-downloaded', (info) => {
      this.prepareRollback(info)
    })
  }

  prepareRollback(info) {
    // 准备回滚
    const currentVersion = app.getVersion()
    
    // 保存当前版本信息
    this.rollbackHistory.push({
      version: currentVersion,
      timestamp: Date.now(),
      path: app.getPath('exe')
    })
    
    // 限制历史记录大小
    if (this.rollbackHistory.length > this.maxRollbacks) {
      this.rollbackHistory.shift()
    }
  }

  async rollback() {
    try {
      // 检查是否可以回滚
      if (!this.canRollback()) {
        throw new Error('No rollback available')
      }
      
      // 获取上一个版本
      const previousVersion = this.rollbackHistory.pop()
      
      // 执行回滚
      await this.executeRollback(previousVersion)
      
      return true
    } catch (error) {
      console.error('Rollback failed:', error)
      return false
    }
  }

  canRollback() {
    // 检查是否可以回滚
    return this.rollbackEnabled && this.rollbackHistory.length > 0
  }

  async executeRollback(version) {
    // 执行回滚
    const { exec } = require('child_process')
    
    return new Promise((resolve, reject) => {
      // 运行回滚脚本
      exec(`rollback-script ${version.path}`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }
        
        // 重启应用
        app.relaunch()
        app.exit(0)
        
        resolve(true)
      })
    })
  }
}
```

## 安全监控

### 1. 安全日志

```javascript
// 安全日志配置
const log = require('electron-log')
const path = require('path')

class SecurityLogger {
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
      return path.join(app.getPath('userData'), 'logs/security.log')
    }
  }

  // 记录安全事件
  logSecurityEvent(event) {
    // 记录事件
    log.info('Security Event:', {
      type: event.type,
      timestamp: new Date().toISOString(),
      details: event.details
    })
    
    // 发送事件到服务器
    this.sendToServer(event)
  }

  // 记录安全警告
  logSecurityWarning(warning) {
    // 记录警告
    log.warn('Security Warning:', {
      type: warning.type,
      timestamp: new Date().toISOString(),
      details: warning.details
    })
    
    // 发送警告到服务器
    this.sendToServer(warning)
  }

  // 记录安全错误
  logSecurityError(error) {
    // 记录错误
    log.error('Security Error:', {
      type: error.type,
      timestamp: new Date().toISOString(),
      details: error.details,
      stack: error.stack
    })
    
    // 发送错误到服务器
    this.sendToServer(error)
  }

  async sendToServer(event) {
    try {
      // 发送到安全服务器
      const response = await fetch('https://security-server.com/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SECURITY_TOKEN}`
        },
        body: JSON.stringify(event)
      })
      
      if (!response.ok) {
        throw new Error('Failed to send security event')
      }
    } catch (error) {
      console.error('Failed to send security event:', error)
    }
  }
}
```

### 2. 安全监控

```javascript
// 安全监控配置
class SecurityMonitor {
  constructor() {
    this.setupMonitoring()
  }

  setupMonitoring() {
    // 配置监控
    this.metrics = {
      events: new Map(),
      warnings: new Map(),
      errors: new Map()
    }
    
    // 设置监控间隔
    setInterval(() => {
      this.reportMetrics()
    }, 60000) // 每分钟
  }

  // 监控安全事件
  monitorEvent(event) {
    // 记录事件
    const count = this.metrics.events.get(event.type) || 0
    this.metrics.events.set(event.type, count + 1)
    
    // 检查阈值
    if (count > this.getEventThreshold(event.type)) {
      this.handleEventThreshold(event)
    }
  }

  // 监控安全警告
  monitorWarning(warning) {
    // 记录警告
    const count = this.metrics.warnings.get(warning.type) || 0
    this.metrics.warnings.set(warning.type, count + 1)
    
    // 检查阈值
    if (count > this.getWarningThreshold(warning.type)) {
      this.handleWarningThreshold(warning)
    }
  }

  // 监控安全错误
  monitorError(error) {
    // 记录错误
    const count = this.metrics.errors.get(error.type) || 0
    this.metrics.errors.set(error.type, count + 1)
    
    // 检查阈值
    if (count > this.getErrorThreshold(error.type)) {
      this.handleErrorThreshold(error)
    }
  }

  reportMetrics() {
    // 报告指标
    console.log('Security Metrics:', {
      events: Object.fromEntries(this.metrics.events),
      warnings: Object.fromEntries(this.metrics.warnings),
      errors: Object.fromEntries(this.metrics.errors)
    })
    
    // 重置指标
    this.resetMetrics()
  }

  resetMetrics() {
    // 重置指标
    this.metrics.events.clear()
    this.metrics.warnings.clear()
    this.metrics.errors.clear()
  }

  getEventThreshold(type) {
    // 获取事件阈值
    const thresholds = {
      'login': 100,
      'api-call': 1000,
      'file-access': 500
    }
    
    return thresholds[type] || 100
  }

  getWarningThreshold(type) {
    // 获取警告阈值
    const thresholds = {
      'invalid-input': 50,
      'rate-limit': 100,
      'permission-denied': 20
    }
    
    return thresholds[type] || 50
  }

  getErrorThreshold(type) {
    // 获取错误阈值
    const thresholds = {
      'authentication': 10,
      'authorization': 10,
      'validation': 20
    }
    
    return thresholds[type] || 10
  }

  handleEventThreshold(event) {
    // 处理事件阈值
    console.warn(`Event threshold exceeded for ${event.type}`)
    
    // 采取行动
    this.takeAction(event)
  }

  handleWarningThreshold(warning) {
    // 处理警告阈值
    console.warn(`Warning threshold exceeded for ${warning.type}`)
    
    // 采取行动
    this.takeAction(warning)
  }

  handleErrorThreshold(error) {
    // 处理错误阈值
    console.error(`Error threshold exceeded for ${error.type}`)
    
    // 采取行动
    this.takeAction(error)
  }

  takeAction(incident) {
    // 采取行动
    switch (incident.type) {
      case 'authentication':
        // 锁定账户
        this.lockAccount(incident.details.userId)
        break
        
      case 'rate-limit':
        // 限制请求
        this.limitRequests(incident.details.ip)
        break
        
      case 'permission-denied':
        // 撤销权限
        this.revokePermissions(incident.details.userId)
        break
        
      default:
        // 记录事件
        this.logIncident(incident)
    }
  }
}
```

## 相关资源

- [Electron 安全指南](https://www.electronjs.org/docs/tutorial/security)
- [OWASP 安全指南](https://owasp.org/www-project-top-ten)
- [Node.js 安全最佳实践](https://nodejs.org/en/docs/guides/security)
- [Chrome 安全文档](https://www.chromium.org/Home/chromium-security)