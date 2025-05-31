 # Electron 网络请求功能指南

## 网络请求类型

Electron 支持多种网络请求方式：

### 1. HTTP/HTTPS 请求
- GET 请求
- POST 请求
- 文件上传
- 文件下载

### 2. WebSocket 通信
- 实时通信
- 双向数据流
- 心跳检测
- 重连机制

### 3. 自定义协议
- 协议注册
- 请求处理
- 响应生成
- 安全控制

## HTTP/HTTPS 请求

### 1. 基本请求
```javascript
const { net } = require('electron')

// GET 请求
function makeGetRequest(url) {
  const request = net.request(url)
  
  request.on('response', (response) => {
    let data = ''
    response.on('data', (chunk) => {
      data += chunk
    })
    response.on('end', () => {
      console.log('响应数据:', data)
    })
  })
  
  request.on('error', (error) => {
    console.error('请求错误:', error)
  })
  
  request.end()
}

// POST 请求
function makePostRequest(url, data) {
  const request = net.request({
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  request.write(JSON.stringify(data))
  request.end()
}
```

### 2. 文件上传
```javascript
// 上传文件
function uploadFile(url, filePath) {
  const request = net.request({
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  
  const formData = new FormData()
  formData.append('file', fs.createReadStream(filePath))
  
  request.write(formData)
  request.end()
}

// 下载文件
function downloadFile(url, savePath) {
  const request = net.request(url)
  const file = fs.createWriteStream(savePath)
  
  request.on('response', (response) => {
    response.pipe(file)
    
    file.on('finish', () => {
      file.close()
      console.log('文件下载完成')
    })
  })
  
  request.on('error', (error) => {
    console.error('下载错误:', error)
    fs.unlink(savePath)
  })
  
  request.end()
}
```

### 3. 请求配置
```javascript
// 配置请求
function configureRequest() {
  const request = net.request({
    method: 'GET',
    url: 'https://api.example.com',
    headers: {
      'User-Agent': 'Electron App',
      'Authorization': 'Bearer token'
    },
    credentials: 'include',
    useSessionCookies: true,
    proxy: {
      host: 'proxy.example.com',
      port: 8080
    }
  })
  
  return request
}
```

## WebSocket 通信

### 1. 基本连接
```javascript
const WebSocket = require('ws')

// 创建连接
function createWebSocket(url) {
  const ws = new WebSocket(url)
  
  ws.on('open', () => {
    console.log('连接已建立')
  })
  
  ws.on('message', (data) => {
    console.log('收到消息:', data)
  })
  
  ws.on('close', () => {
    console.log('连接已关闭')
  })
  
  ws.on('error', (error) => {
    console.error('连接错误:', error)
  })
  
  return ws
}
```

### 2. 心跳检测
```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url
    this.ws = null
    this.heartbeatInterval = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }
  
  connect() {
    this.ws = new WebSocket(this.url)
    this.setupEventHandlers()
    this.startHeartbeat()
  }
  
  setupEventHandlers() {
    this.ws.on('open', () => {
      console.log('连接已建立')
      this.reconnectAttempts = 0
    })
    
    this.ws.on('close', () => {
      this.handleReconnect()
    })
  }
  
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('ping')
      }
    }, 30000)
  }
  
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log('尝试重连:', this.reconnectAttempts)
        this.connect()
      }, 1000 * Math.pow(2, this.reconnectAttempts))
    }
  }
}
```

### 3. 消息处理
```javascript
class WebSocketHandler {
  constructor(ws) {
    this.ws = ws
    this.messageQueue = []
    this.isProcessing = false
  }
  
  send(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.messageQueue.push(message)
    }
  }
  
  processQueue() {
    if (this.isProcessing || this.messageQueue.length === 0) return
    
    this.isProcessing = true
    const message = this.messageQueue.shift()
    
    this.ws.send(JSON.stringify(message), (error) => {
      if (error) {
        console.error('发送失败:', error)
        this.messageQueue.unshift(message)
      }
      this.isProcessing = false
      this.processQueue()
    })
  }
}
```

## 自定义协议

### 1. 协议注册
```javascript
const { protocol } = require('electron')

// 注册协议
function registerProtocol() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'myapp',
      privileges: {
        secure: true,
        standard: true,
        supportFetchAPI: true
      }
    }
  ])
}

// 处理请求
function handleProtocolRequest() {
  protocol.handle('myapp', (request) => {
    const url = request.url
    const path = url.replace('myapp://', '')
    
    if (path.startsWith('api/')) {
      return handleApiRequest(path)
    } else {
      return handleFileRequest(path)
    }
  })
}
```

### 2. 请求处理
```javascript
// 处理 API 请求
async function handleApiRequest(path) {
  try {
    const response = await processApiRequest(path)
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// 处理文件请求
async function handleFileRequest(path) {
  try {
    const filePath = path.join(__dirname, path)
    const file = await fs.promises.readFile(filePath)
    return new Response(file, {
      headers: { 'Content-Type': getContentType(path) }
    })
  } catch (error) {
    return new Response('File not found', { status: 404 })
  }
}
```

## 最佳实践

### 1. 性能优化
- 使用连接池
- 实现请求缓存
- 压缩传输数据
- 批量处理请求

### 2. 安全考虑
- 使用 HTTPS
- 验证证书
- 加密敏感数据
- 防止 CSRF

### 3. 错误处理
- 超时处理
- 重试机制
- 错误日志
- 降级方案

### 4. 用户体验
- 进度反馈
- 断点续传
- 离线支持
- 自动重连

## 常见问题

### 1. 连接问题
- 连接超时
- 网络中断
- 证书错误
- 代理配置

### 2. 性能问题
- 请求延迟
- 内存占用
- 并发限制
- 带宽限制

### 3. 安全问题
- 数据泄露
- 中间人攻击
- 证书验证
- 权限控制

## 调试技巧

### 1. 网络调试
```javascript
// 监控请求
function monitorRequests() {
  const originalRequest = net.request
  net.request = function(options) {
    console.log('发起请求:', options)
    return originalRequest.apply(this, arguments)
  }
}

// 监控响应
function monitorResponses(request) {
  request.on('response', (response) => {
    console.log('收到响应:', {
      statusCode: response.statusCode,
      headers: response.headers,
      time: new Date().toISOString()
    })
  })
}
```

### 2. 性能调试
```javascript
// 性能监控
function monitorPerformance() {
  const start = Date.now()
  
  // 执行请求
  makeGetRequest('https://api.example.com')
    .then(() => {
      const end = Date.now()
      console.log('请求耗时:', end - start, 'ms')
    })
  
  // 内存使用
  const used = process.memoryUsage()
  console.log('内存使用:', {
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`
  })
}
```

## 相关资源

- [Electron 网络 API](https://www.electronjs.org/docs/api/net)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [HTTP 模块](https://nodejs.org/api/http.html)
- [网络安全最佳实践](https://www.electronjs.org/docs/tutorial/security)