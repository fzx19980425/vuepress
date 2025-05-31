 # Electron 性能优化指南

## 性能优化类型

Electron 应用性能优化主要包括以下几个方面：

### 1. 启动优化
- 冷启动时间
- 热启动时间
- 资源加载
- 初始化流程

### 2. 运行时优化
- 内存管理
- CPU 使用
- GPU 加速
- 进程通信

### 3. 渲染优化
- 页面加载
- 动画效果
- 滚动性能
- 响应速度

## 启动优化

### 1. 应用启动
```javascript
const { app } = require('electron')

// 优化启动配置
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('disable-gpu-compositing')

// 延迟加载
app.whenReady().then(() => {
  // 使用 setTimeout 延迟非关键初始化
  setTimeout(() => {
    initializeNonCriticalFeatures()
  }, 1000)
  
  // 立即初始化关键功能
  initializeCriticalFeatures()
})

// 优化窗口创建
function createWindow() {
  const win = new BrowserWindow({
    show: false, // 先隐藏窗口
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 等待内容加载完成再显示
  win.once('ready-to-show', () => {
    win.show()
  })
}
```

### 2. 资源加载
```javascript
// 预加载资源
function preloadResources() {
  const resources = [
    'common.js',
    'styles.css',
    'images/logo.png'
  ]

  resources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource
    link.as = getResourceType(resource)
    document.head.appendChild(link)
  })
}

// 懒加载资源
function lazyLoadResources() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadResource(entry.target)
        observer.unobserve(entry.target)
      }
    })
  })

  document.querySelectorAll('[data-lazy]').forEach(el => {
    observer.observe(el)
  })
}
```

## 运行时优化

### 1. 内存管理
```javascript
class MemoryManager {
  constructor() {
    this.memoryLimit = 500 * 1024 * 1024 // 500MB
    this.checkInterval = 30000 // 30秒
    this.startMonitoring()
  }

  // 监控内存使用
  startMonitoring() {
    setInterval(() => {
      const memoryUsage = process.memoryUsage()
      if (memoryUsage.heapUsed > this.memoryLimit) {
        this.cleanup()
      }
    }, this.checkInterval)
  }

  // 清理内存
  cleanup() {
    // 清理缓存
    session.clearCache()
    
    // 清理未使用的内存
    if (global.gc) {
      global.gc()
    }
    
    // 清理大对象
    this.clearLargeObjects()
  }

  // 清理大对象
  clearLargeObjects() {
    // 实现清理逻辑
  }
}
```

### 2. CPU 优化
```javascript
class CPUOptimizer {
  constructor() {
    this.usageThreshold = 80 // 80%
    this.checkInterval = 5000 // 5秒
    this.startMonitoring()
  }

  // 监控 CPU 使用
  startMonitoring() {
    setInterval(() => {
      const usage = this.getCPUUsage()
      if (usage > this.usageThreshold) {
        this.optimize()
      }
    }, this.checkInterval)
  }

  // 获取 CPU 使用率
  getCPUUsage() {
    const startUsage = process.cpuUsage()
    // 等待 100ms
    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage)
      return (endUsage.user + endUsage.system) / 1000000
    }, 100)
  }

  // 优化 CPU 使用
  optimize() {
    // 暂停非关键任务
    this.pauseNonCriticalTasks()
    
    // 降低动画帧率
    this.reduceAnimationFrameRate()
    
    // 优化渲染
    this.optimizeRendering()
  }
}
```

### 3. GPU 加速
```javascript
// 启用 GPU 加速
function enableGPUAcceleration() {
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-zero-copy')
  app.commandLine.appendSwitch('enable-native-gpu-memory-buffers')
}

// 优化渲染
function optimizeRendering() {
  const win = new BrowserWindow({
    webPreferences: {
      enableHardwareAcceleration: true,
      offscreen: true
    }
  })

  // 使用离屏渲染
  win.webContents.setFrameRate(60)
  win.webContents.on('paint', (event, dirty, image) => {
    // 处理渲染结果
  })
}
```

## 渲染优化

### 1. 页面加载
```javascript
// 优化页面加载
function optimizePageLoad() {
  // 使用 HTTP/2
  app.commandLine.appendSwitch('enable-http2')
  
  // 启用压缩
  app.commandLine.appendSwitch('enable-gzip-compression')
  
  // 使用 Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  }
}

// 实现 Service Worker
// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ])
    })
  )
})
```

### 2. 动画优化
```javascript
// 使用 requestAnimationFrame
function optimizeAnimation() {
  let animationFrameId
  
  function animate() {
    // 执行动画
    updateAnimation()
    
    // 使用 requestAnimationFrame
    animationFrameId = requestAnimationFrame(animate)
  }
  
  // 开始动画
  animate()
  
  // 停止动画
  function stopAnimation() {
    cancelAnimationFrame(animationFrameId)
  }
}

// 使用 CSS 动画
const styles = `
.element {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
`
```

### 3. 滚动优化
```javascript
// 优化滚动
function optimizeScrolling() {
  // 使用虚拟滚动
  class VirtualScroller {
    constructor(container, itemHeight, totalItems) {
      this.container = container
      this.itemHeight = itemHeight
      this.totalItems = totalItems
      this.visibleItems = Math.ceil(container.clientHeight / itemHeight)
      this.startIndex = 0
      
      this.setupScrollListener()
    }
    
    setupScrollListener() {
      this.container.addEventListener('scroll', () => {
        this.startIndex = Math.floor(this.container.scrollTop / this.itemHeight)
        this.render()
      })
    }
    
    render() {
      const items = []
      for (let i = 0; i < this.visibleItems; i++) {
        const index = this.startIndex + i
        if (index < this.totalItems) {
          items.push(this.createItem(index))
        }
      }
      this.container.innerHTML = items.join('')
    }
  }
}
```

## 最佳实践

### 1. 代码优化
- 使用异步操作
- 避免内存泄漏
- 优化循环
- 减少 DOM 操作

### 2. 资源优化
- 压缩资源
- 使用缓存
- 按需加载
- 预加载关键资源

### 3. 架构优化
- 使用多进程
- 优化进程通信
- 实现懒加载
- 采用模块化

### 4. 监控优化
- 性能监控
- 错误追踪
- 资源使用
- 用户行为

## 常见问题

### 1. 性能问题
- 启动慢
- 内存占用高
- CPU 使用率高
- 响应延迟

### 2. 优化问题
- 优化效果不明显
- 引入新问题
- 兼容性问题
- 维护成本高

### 3. 监控问题
- 数据不准确
- 监控开销大
- 问题定位难
- 优化方向不明确

## 调试技巧

### 1. 性能调试
```javascript
// 性能监控
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
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
  
  // 分析性能数据
  analyzePerformance() {
    const report = {}
    this.metrics.forEach((values, name) => {
      report[name] = {
        min: Math.min(...values.map(v => v.value)),
        max: Math.max(...values.map(v => v.value)),
        avg: values.reduce((sum, v) => sum + v.value, 0) / values.length
      }
    })
    return report
  }
}
```

### 2. 内存调试
```javascript
// 内存分析
function analyzeMemory() {
  const heapSnapshot = process.memoryUsage()
  console.log('堆内存使用:', {
    total: `${Math.round(heapSnapshot.heapTotal / 1024 / 1024)}MB`,
    used: `${Math.round(heapSnapshot.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(heapSnapshot.external / 1024 / 1024)}MB`
  })
  
  // 使用 Chrome DevTools 分析
  if (process.env.NODE_ENV === 'development') {
    const session = require('electron').session
    session.defaultSession.setDevToolsExtensions([
      path.join(__dirname, 'node_modules/devtron')
    ])
  }
}
```

## 相关资源

- [Electron 性能优化](https://www.electronjs.org/docs/tutorial/performance)
- [Chrome 性能工具](https://developer.chrome.com/docs/devtools/performance)
- [内存管理](https://www.electronjs.org/docs/tutorial/memory-management)
- [调试指南](https://www.electronjs.org/docs/tutorial/debugging-main-process)