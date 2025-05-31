 # Electron 安全最佳实践指南

## 安全防护类型

Electron 应用安全防护主要包括以下几个方面：

### 1. 进程安全
- 主进程安全
- 渲染进程安全
- 进程间通信
- 上下文隔离

### 2. 内容安全
- CSP 策略
- 资源加载
- 脚本执行
- 数据验证

### 3. 系统安全
- 权限控制
- 文件系统
- 网络通信
- 系统集成

## 进程安全

### 1. 主进程安全
```javascript
const { app, BrowserWindow } = require('electron')

// 禁用远程模块
app.disableRemoteModule()

// 设置安全选项
function createSecureWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      // 禁用 Node.js 集成
      nodeIntegration: false,
      
      // 启用上下文隔离
      contextIsolation: true,
      
      // 使用预加载脚本
      preload: path.join(__dirname, 'preload.js'),
      
      // 禁用 webview
      webviewTag: false,
      
      // 禁用远程模块
      enableRemoteModule: false,
      
      // 禁用开发者工具
      devTools: process.env.NODE_ENV === 'development'
    }
  })
}
```

### 2. 渲染进程安全
```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

// 安全地暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 定义安全的通道
  send: (channel, data) => {
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  
  // 定义安全的接收器
  receive: (channel, func) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})

// 移除全局对象
delete window.require
delete window.process
```

### 3. 进程间通信
```javascript
// 主进程
const { ipcMain } = require('electron')

// 验证 IPC 消息
ipcMain.on('toMain', (event, data) => {
  // 验证发送者
  if (!event.sender.isDestroyed()) {
    // 验证数据
    if (validateData(data)) {
      // 处理消息
      handleMessage(data)
    } else {
      event.reply('error', 'Invalid data')
    }
  }
})

// 验证数据
function validateData(data) {
  // 实现数据验证逻辑
  return typeof data === 'object' && data !== null
}
```

## 内容安全

### 1. CSP 策略
```html
<!-- 设置 CSP -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
">
```

### 2. 资源加载
```javascript
// 安全地加载资源
function loadSecureResource(url) {
  // 验证 URL
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL')
  }
  
  // 检查协议
  if (!url.startsWith('https://')) {
    throw new Error('Only HTTPS is allowed')
  }
  
  // 检查域名
  if (!isAllowedDomain(url)) {
    throw new Error('Domain not allowed')
  }
  
  return fetch(url)
}

// 验证 URL
function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 检查域名
function isAllowedDomain(url) {
  const allowedDomains = [
    'example.com',
    'api.example.com'
  ]
  const domain = new URL(url).hostname
  return allowedDomains.includes(domain)
}
```

### 3. 数据验证
```javascript
// 数据验证工具
class DataValidator {
  // 验证用户输入
  static validateUserInput(input) {
    // 检查类型
    if (typeof input !== 'string') {
      throw new Error('Input must be a string')
    }
    
    // 检查长度
    if (input.length > 1000) {
      throw new Error('Input too long')
    }
    
    // 检查内容
    if (/<script>|javascript:|data:/i.test(input)) {
      throw new Error('Invalid input content')
    }
    
    return input
  }
  
  // 验证 API 响应
  static validateApiResponse(response) {
    // 检查状态
    if (!response.ok) {
      throw new Error('API request failed')
    }
    
    // 检查内容类型
    const contentType = response.headers.get('content-type')
    if (!contentType.includes('application/json')) {
      throw new Error('Invalid content type')
    }
    
    return response.json()
  }
}
```

## 系统安全

### 1. 权限控制
```javascript
// 权限管理器
class PermissionManager {
  constructor() {
    this.permissions = new Map()
  }
  
  // 检查权限
  checkPermission(permission, user) {
    if (!this.permissions.has(permission)) {
      return false
    }
    
    const requiredRole = this.permissions.get(permission)
    return user.roles.includes(requiredRole)
  }
  
  // 请求权限
  async requestPermission(permission) {
    const { response } = await dialog.showMessageBox({
      type: 'question',
      title: '权限请求',
      message: `是否允许 ${permission} 权限？`,
      buttons: ['允许', '拒绝']
    })
    
    return response === 0
  }
}
```

### 2. 文件系统安全
```javascript
// 安全的文件操作
class SecureFileSystem {
  // 安全的文件读取
  static async readFile(filePath) {
    // 验证路径
    if (!this.isValidPath(filePath)) {
      throw new Error('Invalid file path')
    }
    
    // 检查权限
    if (!await this.checkFilePermission(filePath)) {
      throw new Error('Permission denied')
    }
    
    // 读取文件
    return fs.promises.readFile(filePath, 'utf8')
  }
  
  // 安全的文件写入
  static async writeFile(filePath, content) {
    // 验证路径
    if (!this.isValidPath(filePath)) {
      throw new Error('Invalid file path')
    }
    
    // 检查权限
    if (!await this.checkFilePermission(filePath, 'write')) {
      throw new Error('Permission denied')
    }
    
    // 写入文件
    return fs.promises.writeFile(filePath, content, 'utf8')
  }
  
  // 验证路径
  static isValidPath(filePath) {
    // 检查路径注入
    if (filePath.includes('..')) {
      return false
    }
    
    // 检查允许的目录
    const allowedDirs = [
      app.getPath('userData'),
      app.getPath('downloads')
    ]
    
    return allowedDirs.some(dir => filePath.startsWith(dir))
  }
}
```

### 3. 网络通信安全
```javascript
// 安全的网络请求
class SecureNetwork {
  // 安全的 HTTP 请求
  static async request(url, options = {}) {
    // 验证 URL
    if (!this.isValidUrl(url)) {
      throw new Error('Invalid URL')
    }
    
    // 添加安全头
    const secureOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Security-Policy': "default-src 'self'",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    }
    
    // 发送请求
    const response = await fetch(url, secureOptions)
    
    // 验证响应
    if (!response.ok) {
      throw new Error('Request failed')
    }
    
    return response
  }
  
  // 验证 URL
  static isValidUrl(url) {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'https:'
    } catch {
      return false
    }
  }
}
```

## 最佳实践

### 1. 代码安全
- 使用最新版本
- 定期更新依赖
- 代码审查
- 安全测试

### 2. 数据安全
- 加密敏感数据
- 安全存储
- 数据备份
- 访问控制

### 3. 运行安全
- 沙箱环境
- 权限最小化
- 错误处理
- 日志记录

### 4. 发布安全
- 代码签名
- 完整性检查
- 自动更新
- 漏洞修复

## 常见问题

### 1. 安全问题
- 远程代码执行
- 数据泄露
- 权限提升
- 注入攻击

### 2. 防护问题
- 防护过度
- 性能影响
- 兼容性问题
- 用户体验

### 3. 更新问题
- 更新失败
- 版本冲突
- 回滚问题
- 数据迁移

## 调试技巧

### 1. 安全调试
```javascript
// 安全日志
class SecurityLogger {
  constructor() {
    this.logs = []
  }
  
  // 记录安全事件
  logSecurityEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      context: {
        platform: process.platform,
        version: app.getVersion(),
        user: this.getCurrentUser()
      }
    }
    
    this.logs.push(logEntry)
    this.saveLogs()
  }
  
  // 保存日志
  async saveLogs() {
    const logPath = path.join(app.getPath('userData'), 'security.log')
    await fs.promises.appendFile(
      logPath,
      JSON.stringify(this.logs[this.logs.length - 1]) + '\n'
    )
  }
}
```

### 2. 漏洞扫描
```javascript
// 安全扫描器
class SecurityScanner {
  // 扫描依赖
  static async scanDependencies() {
    const { exec } = require('child_process')
    
    return new Promise((resolve, reject) => {
      exec('npm audit', (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }
        
        const vulnerabilities = this.parseAuditOutput(stdout)
        resolve(vulnerabilities)
      })
    })
  }
  
  // 解析审计输出
  static parseAuditOutput(output) {
    // 实现解析逻辑
    return {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  }
}
```

## 相关资源

- [Electron 安全文档](https://www.electronjs.org/docs/tutorial/security)
- [CSP 规范](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [安全最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [漏洞数据库](https://www.electronjs.org/docs/tutorial/security#checking-for-security-issues)