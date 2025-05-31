 # Electron 开发最佳实践

## 开发环境

### 1. 开发工具

```javascript
// 开发工具配置
const path = require('path')
const webpack = require('webpack')
const electronReload = require('electron-reload')

class DevelopmentTools {
  constructor() {
    this.setupTools()
  }

  setupTools() {
    // 配置热重载
    this.setupHotReload()
    
    // 配置调试工具
    this.setupDebugTools()
    
    // 配置构建工具
    this.setupBuildTools()
  }

  setupHotReload() {
    // 配置热重载
    electronReload(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit',
      forceHardReset: true
    })
  }

  setupDebugTools() {
    // 配置调试工具
    if (process.env.NODE_ENV === 'development') {
      // 启用 DevTools
      app.on('ready', () => {
        session.defaultSession.setDevToolsExtensions([
          path.join(__dirname, 'node_modules', 'devtron')
        ])
      })
      
      // 配置日志
      require('electron-log').transports.file.level = 'debug'
    }
  }

  setupBuildTools() {
    // 配置构建工具
    this.webpackConfig = {
      mode: process.env.NODE_ENV,
      entry: {
        main: './src/main.js',
        renderer: './src/renderer.js'
      },
      output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
      },
      target: {
        main: 'electron-main',
        renderer: 'electron-renderer'
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
      ]
    }
  }
}
```

### 2. 开发配置

```javascript
// 开发配置
class DevelopmentConfig {
  constructor() {
    this.setupConfig()
  }

  setupConfig() {
    // 配置开发环境
    this.setupEnvironment()
    
    // 配置开发选项
    this.setupOptions()
    
    // 配置开发工具
    this.setupDevTools()
  }

  setupEnvironment() {
    // 设置环境变量
    process.env.NODE_ENV = 'development'
    process.env.ELECTRON_ENABLE_LOGGING = true
    process.env.ELECTRON_ENABLE_STACK_DUMPING = true
    
    // 配置开发服务器
    process.env.DEV_SERVER_URL = 'http://localhost:3000'
  }

  setupOptions() {
    // 配置开发选项
    app.commandLine.appendSwitch('enable-logging')
    app.commandLine.appendSwitch('v', '1')
    app.commandLine.appendSwitch('remote-debugging-port', '9222')
    
    // 禁用硬件加速
    app.disableHardwareAcceleration()
  }

  setupDevTools() {
    // 配置开发工具
    app.on('ready', () => {
      // 打开 DevTools
      mainWindow.webContents.openDevTools()
      
      // 配置 DevTools 扩展
      session.defaultSession.setDevToolsExtensions([
        path.join(__dirname, 'node_modules', 'devtron'),
        path.join(__dirname, 'node_modules', 'vue-devtools')
      ])
    })
  }
}
```

## 代码组织

### 1. 项目结构

```javascript
// 项目结构配置
class ProjectStructure {
  constructor() {
    this.setupStructure()
  }

  setupStructure() {
    // 配置目录结构
    this.directories = {
      src: {
        main: 'src/main',
        renderer: 'src/renderer',
        shared: 'src/shared',
        assets: 'src/assets'
      },
      dist: {
        main: 'dist/main',
        renderer: 'dist/renderer',
        assets: 'dist/assets'
      },
      test: {
        unit: 'test/unit',
        integration: 'test/integration',
        e2e: 'test/e2e'
      }
    }
    
    // 配置文件结构
    this.files = {
      main: {
        index: 'src/main/index.js',
        ipc: 'src/main/ipc.js',
        window: 'src/main/window.js'
      },
      renderer: {
        index: 'src/renderer/index.js',
        components: 'src/renderer/components',
        store: 'src/renderer/store'
      },
      shared: {
        constants: 'src/shared/constants.js',
        utils: 'src/shared/utils.js'
      }
    }
  }

  // 创建目录结构
  createStructure() {
    const fs = require('fs')
    const path = require('path')
    
    // 创建目录
    Object.values(this.directories).forEach(dir => {
      Object.values(dir).forEach(path => {
        fs.mkdirSync(path, { recursive: true })
      })
    })
    
    // 创建文件
    Object.values(this.files).forEach(file => {
      Object.values(file).forEach(path => {
        if (typeof path === 'string') {
          fs.writeFileSync(path, '')
        }
      })
    })
  }
}
```

### 2. 模块组织

```javascript
// 模块组织配置
class ModuleOrganization {
  constructor() {
    this.setupModules()
  }

  setupModules() {
    // 配置主进程模块
    this.mainModules = {
      app: {
        name: 'app',
        path: 'src/main/app.js',
        dependencies: ['window', 'ipc']
      },
      window: {
        name: 'window',
        path: 'src/main/window.js',
        dependencies: ['ipc']
      },
      ipc: {
        name: 'ipc',
        path: 'src/main/ipc.js',
        dependencies: []
      }
    }
    
    // 配置渲染进程模块
    this.rendererModules = {
      app: {
        name: 'app',
        path: 'src/renderer/app.js',
        dependencies: ['store', 'router']
      },
      store: {
        name: 'store',
        path: 'src/renderer/store.js',
        dependencies: []
      },
      router: {
        name: 'router',
        path: 'src/renderer/router.js',
        dependencies: []
      }
    }
    
    // 配置共享模块
    this.sharedModules = {
      constants: {
        name: 'constants',
        path: 'src/shared/constants.js',
        dependencies: []
      },
      utils: {
        name: 'utils',
        path: 'src/shared/utils.js',
        dependencies: []
      }
    }
  }

  // 加载模块
  loadModules() {
    // 加载主进程模块
    Object.values(this.mainModules).forEach(module => {
      require(module.path)
    })
    
    // 加载渲染进程模块
    Object.values(this.rendererModules).forEach(module => {
      require(module.path)
    })
    
    // 加载共享模块
    Object.values(this.sharedModules).forEach(module => {
      require(module.path)
    })
  }
}
```

## 开发流程

### 1. 开发工作流

```javascript
// 开发工作流配置
class DevelopmentWorkflow {
  constructor() {
    this.setupWorkflow()
  }

  setupWorkflow() {
    // 配置开发流程
    this.workflow = {
      // 开发阶段
      development: {
        start: this.startDevelopment,
        build: this.buildDevelopment,
        test: this.testDevelopment
      },
      
      // 测试阶段
      testing: {
        start: this.startTesting,
        build: this.buildTesting,
        test: this.testTesting
      },
      
      // 生产阶段
      production: {
        start: this.startProduction,
        build: this.buildProduction,
        test: this.testProduction
      }
    }
  }

  // 开发阶段
  async startDevelopment() {
    // 启动开发服务器
    const { spawn } = require('child_process')
    
    // 启动主进程
    const main = spawn('electron', ['.'], {
      env: { ...process.env, NODE_ENV: 'development' }
    })
    
    // 启动渲染进程
    const renderer = spawn('npm', ['run', 'dev:renderer'], {
      env: { ...process.env, NODE_ENV: 'development' }
    })
    
    // 监听输出
    main.stdout.on('data', (data) => {
      console.log(`Main: ${data}`)
    })
    
    renderer.stdout.on('data', (data) => {
      console.log(`Renderer: ${data}`)
    })
  }

  async buildDevelopment() {
    // 构建开发版本
    const webpack = require('webpack')
    const config = require('./webpack.config')
    
    return new Promise((resolve, reject) => {
      webpack(config).run((err, stats) => {
        if (err) {
          reject(err)
          return
        }
        
        console.log(stats.toString())
        resolve()
      })
    })
  }

  async testDevelopment() {
    // 运行开发测试
    const { spawn } = require('child_process')
    
    return new Promise((resolve, reject) => {
      const test = spawn('npm', ['run', 'test:dev'], {
        env: { ...process.env, NODE_ENV: 'development' }
      })
      
      test.stdout.on('data', (data) => {
        console.log(`Test: ${data}`)
      })
      
      test.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Test failed with code ${code}`))
        }
      })
    })
  }

  // 测试阶段
  async startTesting() {
    // 启动测试环境
    const { spawn } = require('child_process')
    
    // 启动主进程
    const main = spawn('electron', ['.'], {
      env: { ...process.env, NODE_ENV: 'testing' }
    })
    
    // 启动渲染进程
    const renderer = spawn('npm', ['run', 'dev:renderer'], {
      env: { ...process.env, NODE_ENV: 'testing' }
    })
    
    // 监听输出
    main.stdout.on('data', (data) => {
      console.log(`Main: ${data}`)
    })
    
    renderer.stdout.on('data', (data) => {
      console.log(`Renderer: ${data}`)
    })
  }

  async buildTesting() {
    // 构建测试版本
    const webpack = require('webpack')
    const config = require('./webpack.config')
    
    return new Promise((resolve, reject) => {
      webpack(config).run((err, stats) => {
        if (err) {
          reject(err)
          return
        }
        
        console.log(stats.toString())
        resolve()
      })
    })
  }

  async testTesting() {
    // 运行测试
    const { spawn } = require('child_process')
    
    return new Promise((resolve, reject) => {
      const test = spawn('npm', ['run', 'test'], {
        env: { ...process.env, NODE_ENV: 'testing' }
      })
      
      test.stdout.on('data', (data) => {
        console.log(`Test: ${data}`)
      })
      
      test.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Test failed with code ${code}`))
        }
      })
    })
  }

  // 生产阶段
  async startProduction() {
    // 启动生产环境
    const { spawn } = require('child_process')
    
    // 启动主进程
    const main = spawn('electron', ['.'], {
      env: { ...process.env, NODE_ENV: 'production' }
    })
    
    // 监听输出
    main.stdout.on('data', (data) => {
      console.log(`Main: ${data}`)
    })
  }

  async buildProduction() {
    // 构建生产版本
    const webpack = require('webpack')
    const config = require('./webpack.config')
    
    return new Promise((resolve, reject) => {
      webpack(config).run((err, stats) => {
        if (err) {
          reject(err)
          return
        }
        
        console.log(stats.toString())
        resolve()
      })
    })
  }

  async testProduction() {
    // 运行生产测试
    const { spawn } = require('child_process')
    
    return new Promise((resolve, reject) => {
      const test = spawn('npm', ['run', 'test:prod'], {
        env: { ...process.env, NODE_ENV: 'production' }
      })
      
      test.stdout.on('data', (data) => {
        console.log(`Test: ${data}`)
      })
      
      test.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Test failed with code ${code}`))
        }
      })
    })
  }
}
```

### 2. 测试策略

```javascript
// 测试策略配置
class TestingStrategy {
  constructor() {
    this.setupStrategy()
  }

  setupStrategy() {
    // 配置测试策略
    this.strategy = {
      // 单元测试
      unit: {
        framework: 'jest',
        config: 'jest.config.js',
        pattern: '**/*.test.js'
      },
      
      // 集成测试
      integration: {
        framework: 'mocha',
        config: 'mocha.config.js',
        pattern: '**/*.spec.js'
      },
      
      // 端到端测试
      e2e: {
        framework: 'spectron',
        config: 'spectron.config.js',
        pattern: '**/*.e2e.js'
      }
    }
  }

  // 运行单元测试
  async runUnitTests() {
    const { spawn } = require('child_process')
    
    return new Promise((resolve, reject) => {
      const test = spawn('jest', [
        '--config', this.strategy.unit.config,
        '--testMatch', this.strategy.unit.pattern
      ])
      
      test.stdout.on('data', (data) => {
        console.log(`Unit Test: ${data}`)
      })
      
      test.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Unit tests failed with code ${code}`))
        }
      })
    })
  }

  // 运行集成测试
  async runIntegrationTests() {
    const { spawn } = require('child_process')
    
    return new Promise((resolve, reject) => {
      const test = spawn('mocha', [
        '--config', this.strategy.integration.config,
        '--pattern', this.strategy.integration.pattern
      ])
      
      test.stdout.on('data', (data) => {
        console.log(`Integration Test: ${data}`)
      })
      
      test.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Integration tests failed with code ${code}`))
        }
      })
    })
  }

  // 运行端到端测试
  async runE2ETests() {
    const { spawn } = require('child_process')
    
    return new Promise((resolve, reject) => {
      const test = spawn('spectron', [
        '--config', this.strategy.e2e.config,
        '--pattern', this.strategy.e2e.pattern
      ])
      
      test.stdout.on('data', (data) => {
        console.log(`E2E Test: ${data}`)
      })
      
      test.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`E2E tests failed with code ${code}`))
        }
      })
    })
  }
}
```

## 调试技巧

### 1. 调试工具

```javascript
// 调试工具配置
class DebuggingTools {
  constructor() {
    this.setupTools()
  }

  setupTools() {
    // 配置调试工具
    this.tools = {
      // 主进程调试
      main: {
        port: 9222,
        host: 'localhost',
        protocol: 'ws'
      },
      
      // 渲染进程调试
      renderer: {
        port: 9223,
        host: 'localhost',
        protocol: 'ws'
      },
      
      // GPU 进程调试
      gpu: {
        port: 9224,
        host: 'localhost',
        protocol: 'ws'
      }
    }
  }

  // 启动调试
  startDebugging() {
    // 启动主进程调试
    app.commandLine.appendSwitch('remote-debugging-port', this.tools.main.port)
    
    // 启动渲染进程调试
    app.commandLine.appendSwitch('remote-debugging-port', this.tools.renderer.port)
    
    // 启动 GPU 进程调试
    app.commandLine.appendSwitch('remote-debugging-port', this.tools.gpu.port)
  }

  // 连接调试器
  connectDebugger() {
    // 连接主进程调试器
    const mainDebugger = new WebSocket(
      `${this.tools.main.protocol}://${this.tools.main.host}:${this.tools.main.port}`
    )
    
    // 连接渲染进程调试器
    const rendererDebugger = new WebSocket(
      `${this.tools.renderer.protocol}://${this.tools.renderer.host}:${this.tools.renderer.port}`
    )
    
    // 连接 GPU 进程调试器
    const gpuDebugger = new WebSocket(
      `${this.tools.gpu.protocol}://${this.tools.gpu.host}:${this.tools.gpu.port}`
    )
    
    // 监听调试事件
    mainDebugger.on('message', (data) => {
      console.log('Main Debugger:', data)
    })
    
    rendererDebugger.on('message', (data) => {
      console.log('Renderer Debugger:', data)
    })
    
    gpuDebugger.on('message', (data) => {
      console.log('GPU Debugger:', data)
    })
  }
}
```

### 2. 调试技巧

```javascript
// 调试技巧配置
class DebuggingTips {
  constructor() {
    this.setupTips()
  }

  setupTips() {
    // 配置调试技巧
    this.tips = {
      // 主进程调试
      main: {
        // 启用详细日志
        enableVerboseLogging: () => {
          process.env.ELECTRON_ENABLE_LOGGING = true
          process.env.ELECTRON_ENABLE_STACK_DUMPING = true
        },
        
        // 启用崩溃报告
        enableCrashReports: () => {
          crashReporter.start({
            productName: 'YourApp',
            companyName: 'YourCompany',
            submitURL: 'https://your-crash-server.com/submit'
          })
        },
        
        // 启用性能监控
        enablePerformanceMonitoring: () => {
          const { performance } = require('perf_hooks')
          
          // 监控 CPU 使用率
          setInterval(() => {
            const usage = process.cpuUsage()
            console.log('CPU Usage:', usage)
          }, 1000)
          
          // 监控内存使用
          setInterval(() => {
            const memory = process.memoryUsage()
            console.log('Memory Usage:', memory)
          }, 1000)
        }
      },
      
      // 渲染进程调试
      renderer: {
        // 启用 DevTools
        enableDevTools: () => {
          mainWindow.webContents.openDevTools()
        },
        
        // 启用控制台日志
        enableConsoleLogging: () => {
          mainWindow.webContents.on('console-message', (event, level, message) => {
            console.log(`Renderer Console [${level}]:`, message)
          })
        },
        
        // 启用网络监控
        enableNetworkMonitoring: () => {
          mainWindow.webContents.session.webRequest.onCompleted((details) => {
            console.log('Network Request:', details)
          })
        }
      },
      
      // GPU 进程调试
      gpu: {
        // 启用 GPU 日志
        enableGPULogging: () => {
          app.commandLine.appendSwitch('enable-gpu-logging')
        },
        
        // 启用 GPU 崩溃报告
        enableGPUCrashReports: () => {
          app.commandLine.appendSwitch('enable-gpu-crash-dumps')
        },
        
        // 启用 GPU 性能监控
        enableGPUPerformanceMonitoring: () => {
          app.commandLine.appendSwitch('enable-gpu-benchmarking')
        }
      }
    }
  }

  // 应用调试技巧
  applyTips() {
    // 应用主进程调试技巧
    Object.values(this.tips.main).forEach(tip => tip())
    
    // 应用渲染进程调试技巧
    Object.values(this.tips.renderer).forEach(tip => tip())
    
    // 应用 GPU 进程调试技巧
    Object.values(this.tips.gpu).forEach(tip => tip())
  }
}
```

## 相关资源

- [Electron 开发指南](https://www.electronjs.org/docs/tutorial/development)
- [Electron 调试指南](https://www.electronjs.org/docs/tutorial/debugging)
- [Electron 测试指南](https://www.electronjs.org/docs/tutorial/testing)
- [Electron 构建指南](https://www.electronjs.org/docs/tutorial/build)