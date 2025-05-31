 # Electron 崩溃报告功能指南

## 崩溃报告类型

Electron 支持多种崩溃报告方式：

### 1. 系统崩溃报告
- 进程崩溃
- 渲染进程崩溃
- GPU 进程崩溃
- 插件崩溃

### 2. 自定义崩溃报告
- 错误日志
- 性能数据
- 用户行为
- 系统信息

### 3. 远程崩溃报告
- 自动上传
- 手动提交
- 统计分析
- 问题追踪

## 系统崩溃报告

### 1. 基本配置
```javascript
const { crashReporter } = require('electron')

// 启动崩溃报告
function startCrashReporter() {
  crashReporter.start({
    productName: 'YourApp',
    companyName: 'YourCompany',
    submitURL: 'https://your-crash-report-server.com/submit',
    uploadToServer: true,
    extra: {
      // 自定义信息
      'app-version': app.getVersion(),
      'platform': process.platform,
      'locale': app.getLocale()
    }
  })
}

// 添加自定义信息
function addCustomInfo() {
  crashReporter.addExtraParameter('user-id', '12345')
  crashReporter.addExtraParameter('session-id', 'abcde')
}
```

### 2. 崩溃处理
```javascript
// 处理主进程崩溃
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
  crashReporter.addExtraParameter('error-message', error.message)
  crashReporter.addExtraParameter('error-stack', error.stack)
})

// 处理渲染进程崩溃
app.on('render-process-gone', (event, webContents, details) => {
  console.error('渲染进程崩溃:', details)
  crashReporter.addExtraParameter('crash-reason', details.reason)
  crashReporter.addExtraParameter('crash-exit-code', details.exitCode)
})

// 处理 GPU 进程崩溃
app.on('gpu-process-crashed', (event, killed) => {
  console.error('GPU 进程崩溃:', killed)
  crashReporter.addExtraParameter('gpu-crashed', killed)
})
```

## 自定义崩溃报告

### 1. 错误日志
```javascript
class ErrorLogger {
  constructor() {
    this.logs = []
    this.maxLogs = 1000
  }

  // 记录错误
  logError(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      systemInfo: this.getSystemInfo()
    }

    this.logs.push(logEntry)
    this.trimLogs()
    this.saveLogs()
  }

  // 获取系统信息
  getSystemInfo() {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      memory: process.memoryUsage(),
      appVersion: app.getVersion(),
      locale: app.getLocale()
    }
  }

  // 保存日志
  async saveLogs() {
    try {
      const logPath = path.join(app.getPath('userData'), 'error-logs.json')
      await fs.promises.writeFile(logPath, JSON.stringify(this.logs, null, 2))
    } catch (error) {
      console.error('保存日志失败:', error)
    }
  }

  // 清理旧日志
  trimLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }
}
```

### 2. 性能监控
```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.startTime = Date.now()
  }

  // 记录性能指标
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name).push({
      timestamp: Date.now(),
      value
    })
  }

  // 监控内存使用
  monitorMemory() {
    setInterval(() => {
      const memoryUsage = process.memoryUsage()
      this.recordMetric('memory', memoryUsage)
    }, 5000)
  }

  // 监控 CPU 使用
  monitorCPU() {
    const startUsage = process.cpuUsage()
    setInterval(() => {
      const endUsage = process.cpuUsage(startUsage)
      this.recordMetric('cpu', endUsage)
    }, 5000)
  }

  // 获取性能报告
  getPerformanceReport() {
    return {
      uptime: Date.now() - this.startTime,
      metrics: Object.fromEntries(this.metrics)
    }
  }
}
```

## 远程崩溃报告

### 1. 自动上传
```javascript
class CrashReporter {
  constructor(config) {
    this.config = config
    this.queue = []
    this.isUploading = false
  }

  // 添加崩溃报告
  async addReport(report) {
    this.queue.push(report)
    await this.processQueue()
  }

  // 处理上传队列
  async processQueue() {
    if (this.isUploading || this.queue.length === 0) return

    this.isUploading = true
    try {
      const report = this.queue.shift()
      await this.uploadReport(report)
    } catch (error) {
      console.error('上传失败:', error)
      // 重新加入队列
      this.queue.unshift(report)
    } finally {
      this.isUploading = false
      this.processQueue()
    }
  }

  // 上传报告
  async uploadReport(report) {
    const response = await fetch(this.config.submitURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(report)
    })

    if (!response.ok) {
      throw new Error(`上传失败: ${response.status}`)
    }
  }
}
```

### 2. 手动提交
```javascript
class ManualCrashReporter {
  constructor() {
    this.reports = []
  }

  // 收集崩溃信息
  collectCrashInfo(error) {
    const report = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      systemInfo: this.getSystemInfo(),
      userInfo: this.getUserInfo()
    }

    this.reports.push(report)
    return report
  }

  // 获取用户信息
  getUserInfo() {
    return {
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail')
    }
  }

  // 导出报告
  exportReport() {
    const report = this.reports[this.reports.length - 1]
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `crash-report-${Date.now()}.json`
    a.click()
    
    URL.revokeObjectURL(url)
  }
}
```

## 最佳实践

### 1. 数据收集
- 收集必要信息
- 保护用户隐私
- 控制数据大小
- 定期清理数据

### 2. 错误处理
- 分类处理错误
- 设置错误级别
- 过滤重复错误
- 保留错误上下文

### 3. 性能优化
- 异步处理
- 批量上传
- 压缩数据
- 限制频率

### 4. 用户体验
- 提供反馈
- 自动重试
- 手动提交
- 问题追踪

## 常见问题

### 1. 收集问题
- 信息不完整
- 数据量过大
- 隐私泄露
- 重复报告

### 2. 上传问题
- 网络失败
- 服务器拒绝
- 格式错误
- 超时处理

### 3. 分析问题
- 数据解析
- 问题分类
- 优先级排序
- 解决方案

## 调试技巧

### 1. 崩溃调试
```javascript
// 模拟崩溃
function simulateCrash() {
  process.crash()
}

// 监控崩溃报告
function monitorCrashReports() {
  crashReporter.on('crash-report-uploaded', (report) => {
    console.log('崩溃报告已上传:', report)
  })

  crashReporter.on('crash-report-upload-failed', (report, error) => {
    console.error('崩溃报告上传失败:', error)
  })
}
```

### 2. 性能调试
```javascript
// 性能监控
function monitorPerformance() {
  const monitor = new PerformanceMonitor()
  
  // 监控内存
  monitor.monitorMemory()
  
  // 监控 CPU
  monitor.monitorCPU()
  
  // 定期导出报告
  setInterval(() => {
    const report = monitor.getPerformanceReport()
    console.log('性能报告:', report)
  }, 60000)
}
```

## 相关资源

- [Electron 崩溃报告 API](https://www.electronjs.org/docs/api/crash-reporter)
- [错误处理最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [性能监控指南](https://www.electronjs.org/docs/tutorial/performance)
- [调试技巧](https://www.electronjs.org/docs/tutorial/debugging-main-process)