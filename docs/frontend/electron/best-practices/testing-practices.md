 # Electron 测试最佳实践

## 测试类型

### 1. 单元测试

```javascript
// 单元测试配置
const { describe, it, expect } = require('jest')

class UnitTesting {
  constructor() {
    this.setupTesting()
  }

  setupTesting() {
    // 配置单元测试
    this.config = {
      // 测试框架
      framework: 'jest',
      
      // 测试配置
      options: {
        testEnvironment: 'node',
        testMatch: ['**/*.test.js'],
        collectCoverage: true,
        coverageDirectory: 'coverage/unit'
      },
      
      // 测试工具
      tools: {
        // 模拟工具
        mocks: {
          electron: require('jest-mock-electron'),
          fs: require('jest-mock-fs'),
          path: require('jest-mock-path')
        },
        
        // 断言工具
        assertions: {
          expect: expect,
          assert: require('assert')
        }
      }
    }
  }

  // 测试主进程
  testMainProcess() {
    describe('Main Process', () => {
      // 测试应用初始化
      it('should initialize app', () => {
        const app = require('../src/main/app')
        expect(app.isReady()).toBe(true)
      })
      
      // 测试窗口创建
      it('should create window', () => {
        const window = require('../src/main/window')
        expect(window.isVisible()).toBe(true)
      })
      
      // 测试 IPC 通信
      it('should handle IPC communication', () => {
        const ipc = require('../src/main/ipc')
        expect(ipc.isListening()).toBe(true)
      })
    })
  }

  // 测试渲染进程
  testRendererProcess() {
    describe('Renderer Process', () => {
      // 测试组件渲染
      it('should render component', () => {
        const component = require('../src/renderer/component')
        expect(component.isRendered()).toBe(true)
      })
      
      // 测试状态管理
      it('should manage state', () => {
        const store = require('../src/renderer/store')
        expect(store.getState()).toBeDefined()
      })
      
      // 测试用户交互
      it('should handle user interaction', () => {
        const interaction = require('../src/renderer/interaction')
        expect(interaction.isHandled()).toBe(true)
      })
    })
  }

  // 测试共享模块
  testSharedModules() {
    describe('Shared Modules', () => {
      // 测试工具函数
      it('should provide utility functions', () => {
        const utils = require('../src/shared/utils')
        expect(utils.formatDate).toBeDefined()
      })
      
      // 测试常量
      it('should define constants', () => {
        const constants = require('../src/shared/constants')
        expect(constants.APP_NAME).toBeDefined()
      })
      
      // 测试类型定义
      it('should define types', () => {
        const types = require('../src/shared/types')
        expect(types.User).toBeDefined()
      })
    })
  }
}
```

### 2. 集成测试

```javascript
// 集成测试配置
const { describe, it, before, after } = require('mocha')
const { Application } = require('spectron')

class IntegrationTesting {
  constructor() {
    this.setupTesting()
  }

  setupTesting() {
    // 配置集成测试
    this.config = {
      // 测试框架
      framework: 'mocha',
      
      // 测试配置
      options: {
        timeout: 10000,
        bail: true,
        reporter: 'spec'
      },
      
      // 测试工具
      tools: {
        // 应用启动器
        app: new Application({
          path: require('electron'),
          args: ['.'],
          env: { NODE_ENV: 'test' }
        }),
        
        // 测试助手
        helpers: {
          // 等待应用启动
          waitForApp: async () => {
            await this.config.tools.app.start()
            await this.config.tools.app.client.waitUntilWindowLoaded()
          },
          
          // 等待元素出现
          waitForElement: async (selector) => {
            await this.config.tools.app.client.waitForVisible(selector)
          },
          
          // 等待元素消失
          waitForElementToDisappear: async (selector) => {
            await this.config.tools.app.client.waitForVisible(selector, true)
          }
        }
      }
    }
  }

  // 测试应用启动
  async testAppStartup() {
    describe('App Startup', () => {
      // 启动应用
      before(async () => {
        await this.config.tools.helpers.waitForApp()
      })
      
      // 关闭应用
      after(async () => {
        await this.config.tools.app.stop()
      })
      
      // 测试窗口创建
      it('should create main window', async () => {
        const windowCount = await this.config.tools.app.client.getWindowCount()
        expect(windowCount).toBe(1)
      })
      
      // 测试窗口标题
      it('should set window title', async () => {
        const title = await this.config.tools.app.client.getTitle()
        expect(title).toBe('Your App')
      })
      
      // 测试窗口大小
      it('should set window size', async () => {
        const { width, height } = await this.config.tools.app.browserWindow.getBounds()
        expect(width).toBe(800)
        expect(height).toBe(600)
      })
    })
  }

  // 测试用户界面
  async testUserInterface() {
    describe('User Interface', () => {
      // 启动应用
      before(async () => {
        await this.config.tools.helpers.waitForApp()
      })
      
      // 关闭应用
      after(async () => {
        await this.config.tools.app.stop()
      })
      
      // 测试菜单
      it('should show menu', async () => {
        await this.config.tools.helpers.waitForElement('#menu')
        const menuVisible = await this.config.tools.app.client.isVisible('#menu')
        expect(menuVisible).toBe(true)
      })
      
      // 测试工具栏
      it('should show toolbar', async () => {
        await this.config.tools.helpers.waitForElement('#toolbar')
        const toolbarVisible = await this.config.tools.app.client.isVisible('#toolbar')
        expect(toolbarVisible).toBe(true)
      })
      
      // 测试状态栏
      it('should show status bar', async () => {
        await this.config.tools.helpers.waitForElement('#status-bar')
        const statusBarVisible = await this.config.tools.app.client.isVisible('#status-bar')
        expect(statusBarVisible).toBe(true)
      })
    })
  }

  // 测试用户交互
  async testUserInteraction() {
    describe('User Interaction', () => {
      // 启动应用
      before(async () => {
        await this.config.tools.helpers.waitForApp()
      })
      
      // 关闭应用
      after(async () => {
        await this.config.tools.app.stop()
      })
      
      // 测试按钮点击
      it('should handle button click', async () => {
        await this.config.tools.helpers.waitForElement('#button')
        await this.config.tools.app.client.click('#button')
        await this.config.tools.helpers.waitForElement('#result')
        const result = await this.config.tools.app.client.getText('#result')
        expect(result).toBe('Button clicked')
      })
      
      // 测试输入框
      it('should handle input', async () => {
        await this.config.tools.helpers.waitForElement('#input')
        await this.config.tools.app.client.setValue('#input', 'test')
        const value = await this.config.tools.app.client.getValue('#input')
        expect(value).toBe('test')
      })
      
      // 测试选择框
      it('should handle select', async () => {
        await this.config.tools.helpers.waitForElement('#select')
        await this.config.tools.app.client.selectByVisibleText('#select', 'option1')
        const value = await this.config.tools.app.client.getValue('#select')
        expect(value).toBe('option1')
      })
    })
  }
}
```

### 3. 端到端测试

```javascript
// 端到端测试配置
const { describe, it, before, after } = require('mocha')
const { Application } = require('spectron')
const path = require('path')

class E2ETesting {
  constructor() {
    this.setupTesting()
  }

  setupTesting() {
    // 配置端到端测试
    this.config = {
      // 测试框架
      framework: 'mocha',
      
      // 测试配置
      options: {
        timeout: 30000,
        bail: true,
        reporter: 'spec'
      },
      
      // 测试工具
      tools: {
        // 应用启动器
        app: new Application({
          path: require('electron'),
          args: [path.join(__dirname, '..')],
          env: { NODE_ENV: 'test' }
        }),
        
        // 测试助手
        helpers: {
          // 等待应用启动
          waitForApp: async () => {
            await this.config.tools.app.start()
            await this.config.tools.app.client.waitUntilWindowLoaded()
          },
          
          // 等待元素出现
          waitForElement: async (selector) => {
            await this.config.tools.app.client.waitForVisible(selector)
          },
          
          // 等待元素消失
          waitForElementToDisappear: async (selector) => {
            await this.config.tools.app.client.waitForVisible(selector, true)
          },
          
          // 等待网络请求
          waitForNetwork: async () => {
            await this.config.tools.app.client.waitUntil(async () => {
              const requests = await this.config.tools.app.client.getNetworkRequests()
              return requests.length > 0
            })
          }
        }
      }
    }
  }

  // 测试应用流程
  async testAppFlow() {
    describe('App Flow', () => {
      // 启动应用
      before(async () => {
        await this.config.tools.helpers.waitForApp()
      })
      
      // 关闭应用
      after(async () => {
        await this.config.tools.app.stop()
      })
      
      // 测试登录流程
      it('should handle login flow', async () => {
        // 等待登录页面
        await this.config.tools.helpers.waitForElement('#login')
        
        // 输入用户名
        await this.config.tools.app.client.setValue('#username', 'test')
        
        // 输入密码
        await this.config.tools.app.client.setValue('#password', 'test')
        
        // 点击登录按钮
        await this.config.tools.app.client.click('#login-button')
        
        // 等待登录成功
        await this.config.tools.helpers.waitForElement('#dashboard')
        
        // 验证登录成功
        const dashboardVisible = await this.config.tools.app.client.isVisible('#dashboard')
        expect(dashboardVisible).toBe(true)
      })
      
      // 测试数据加载
      it('should load data', async () => {
        // 等待数据加载
        await this.config.tools.helpers.waitForNetwork()
        
        // 等待数据表格
        await this.config.tools.helpers.waitForElement('#data-table')
        
        // 验证数据加载
        const rowCount = await this.config.tools.app.client.elements('#data-table tr')
        expect(rowCount.length).toBeGreaterThan(0)
      })
      
      // 测试数据操作
      it('should handle data operations', async () => {
        // 点击添加按钮
        await this.config.tools.app.client.click('#add-button')
        
        // 等待添加对话框
        await this.config.tools.helpers.waitForElement('#add-dialog')
        
        // 输入数据
        await this.config.tools.app.client.setValue('#name', 'test')
        await this.config.tools.app.client.setValue('#description', 'test')
        
        // 点击保存按钮
        await this.config.tools.app.client.click('#save-button')
        
        // 等待对话框关闭
        await this.config.tools.helpers.waitForElementToDisappear('#add-dialog')
        
        // 验证数据添加
        const newRow = await this.config.tools.app.client.element('#data-table tr:last-child')
        const name = await newRow.getText('#name')
        expect(name).toBe('test')
      })
    })
  }

  // 测试应用功能
  async testAppFeatures() {
    describe('App Features', () => {
      // 启动应用
      before(async () => {
        await this.config.tools.helpers.waitForApp()
      })
      
      // 关闭应用
      after(async () => {
        await this.config.tools.app.stop()
      })
      
      // 测试文件操作
      it('should handle file operations', async () => {
        // 点击文件菜单
        await this.config.tools.app.client.click('#file-menu')
        
        // 点击打开按钮
        await this.config.tools.app.client.click('#open-button')
        
        // 等待文件对话框
        await this.config.tools.helpers.waitForElement('#file-dialog')
        
        // 选择文件
        await this.config.tools.app.client.setValue('#file-input', '/path/to/file')
        
        // 点击打开按钮
        await this.config.tools.app.client.click('#open-file-button')
        
        // 等待文件加载
        await this.config.tools.helpers.waitForElement('#file-content')
        
        // 验证文件内容
        const content = await this.config.tools.app.client.getText('#file-content')
        expect(content).toBeDefined()
      })
      
      // 测试设置功能
      it('should handle settings', async () => {
        // 点击设置菜单
        await this.config.tools.app.client.click('#settings-menu')
        
        // 点击设置按钮
        await this.config.tools.app.client.click('#settings-button')
        
        // 等待设置对话框
        await this.config.tools.helpers.waitForElement('#settings-dialog')
        
        // 修改设置
        await this.config.tools.app.client.setValue('#theme', 'dark')
        await this.config.tools.app.client.setValue('#language', 'zh-CN')
        
        // 点击保存按钮
        await this.config.tools.app.client.click('#save-settings-button')
        
        // 等待对话框关闭
        await this.config.tools.helpers.waitForElementToDisappear('#settings-dialog')
        
        // 验证设置保存
        const theme = await this.config.tools.app.client.getAttribute('body', 'data-theme')
        expect(theme).toBe('dark')
      })
    })
  }
}
```

## 测试工具

### 1. 测试框架

```javascript
// 测试框架配置
class TestingFramework {
  constructor() {
    this.setupFramework()
  }

  setupFramework() {
    // 配置测试框架
    this.frameworks = {
      // 单元测试框架
      unit: {
        name: 'jest',
        config: {
          testEnvironment: 'node',
          testMatch: ['**/*.test.js'],
          collectCoverage: true,
          coverageDirectory: 'coverage/unit',
          setupFiles: ['./test/setup/unit.js']
        }
      },
      
      // 集成测试框架
      integration: {
        name: 'mocha',
        config: {
          timeout: 10000,
          bail: true,
          reporter: 'spec',
          require: ['./test/setup/integration.js']
        }
      },
      
      // 端到端测试框架
      e2e: {
        name: 'spectron',
        config: {
          timeout: 30000,
          bail: true,
          reporter: 'spec',
          require: ['./test/setup/e2e.js']
        }
      }
    }
  }

  // 运行测试
  async runTests() {
    // 运行单元测试
    await this.runUnitTests()
    
    // 运行集成测试
    await this.runIntegrationTests()
    
    // 运行端到端测试
    await this.runE2ETests()
  }

  // 运行单元测试
  async runUnitTests() {
    const { spawn } = require('child_process')
    
    return new Promise((resolve, reject) => {
      const test = spawn('jest', [
        '--config', JSON.stringify(this.frameworks.unit.config)
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
        '--config', JSON.stringify(this.frameworks.integration.config)
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
        '--config', JSON.stringify(this.frameworks.e2e.config)
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

### 2. 测试工具

```javascript
// 测试工具配置
class TestingTools {
  constructor() {
    this.setupTools()
  }

  setupTools() {
    // 配置测试工具
    this.tools = {
      // 模拟工具
      mocks: {
        // 模拟 Electron
        electron: require('jest-mock-electron'),
        
        // 模拟文件系统
        fs: require('jest-mock-fs'),
        
        // 模拟路径
        path: require('jest-mock-path'),
        
        // 模拟网络
        network: require('jest-mock-network')
      },
      
      // 断言工具
      assertions: {
        // Jest 断言
        expect: require('expect'),
        
        // Chai 断言
        chai: require('chai'),
        
        // 自定义断言
        custom: require('./custom-assertions')
      },
      
      // 测试助手
      helpers: {
        // 等待工具
        wait: require('./wait-helpers'),
        
        // 模拟工具
        mock: require('./mock-helpers'),
        
        // 验证工具
        verify: require('./verify-helpers')
      }
    }
  }

  // 使用模拟工具
  useMocks() {
    // 模拟 Electron
    this.tools.mocks.electron.mock()
    
    // 模拟文件系统
    this.tools.mocks.fs.mock()
    
    // 模拟路径
    this.tools.mocks.path.mock()
    
    // 模拟网络
    this.tools.mocks.network.mock()
  }

  // 使用断言工具
  useAssertions() {
    // 使用 Jest 断言
    const { expect } = this.tools.assertions.expect
    
    // 使用 Chai 断言
    const { assert, expect: chaiExpect } = this.tools.assertions.chai
    
    // 使用自定义断言
    const { customAssert } = this.tools.assertions.custom
    
    return {
      expect,
      assert,
      chaiExpect,
      customAssert
    }
  }

  // 使用测试助手
  useHelpers() {
    // 使用等待工具
    const { waitForElement, waitForNetwork } = this.tools.helpers.wait
    
    // 使用模拟工具
    const { mockIPC, mockDialog } = this.tools.helpers.mock
    
    // 使用验证工具
    const { verifyState, verifyBehavior } = this.tools.helpers.verify
    
    return {
      waitForElement,
      waitForNetwork,
      mockIPC,
      mockDialog,
      verifyState,
      verifyBehavior
    }
  }
}
```

## 测试策略

### 1. 测试计划

```javascript
// 测试计划配置
class TestingPlan {
  constructor() {
    this.setupPlan()
  }

  setupPlan() {
    // 配置测试计划
    this.plan = {
      // 单元测试计划
      unit: {
        // 主进程测试
        main: {
          app: ['initialization', 'window', 'ipc'],
          window: ['creation', 'events', 'state'],
          ipc: ['communication', 'handlers', 'validation']
        },
        
        // 渲染进程测试
        renderer: {
          components: ['rendering', 'props', 'events'],
          store: ['state', 'actions', 'mutations'],
          utils: ['functions', 'validation', 'formatting']
        },
        
        // 共享模块测试
        shared: {
          constants: ['values', 'types'],
          utils: ['functions', 'validation'],
          types: ['interfaces', 'enums']
        }
      },
      
      // 集成测试计划
      integration: {
        // 应用流程测试
        flow: {
          startup: ['initialization', 'window', 'menu'],
          navigation: ['routing', 'transitions', 'state'],
          interaction: ['events', 'validation', 'feedback']
        },
        
        // 功能测试
        features: {
          file: ['open', 'save', 'export'],
          edit: ['undo', 'redo', 'format'],
          view: ['zoom', 'theme', 'layout']
        },
        
        // 性能测试
        performance: {
          startup: ['time', 'memory', 'cpu'],
          runtime: ['responsiveness', 'memory', 'cpu'],
          rendering: ['fps', 'memory', 'gpu']
        }
      },
      
      // 端到端测试计划
      e2e: {
        // 用户流程测试
        user: {
          login: ['authentication', 'authorization', 'session'],
          workflow: ['creation', 'editing', 'deletion'],
          settings: ['preferences', 'profile', 'security']
        },
        
        // 系统流程测试
        system: {
          update: ['check', 'download', 'install'],
          backup: ['create', 'restore', 'verify'],
          sync: ['upload', 'download', 'conflict']
        },
        
        // 错误处理测试
        error: {
          network: ['offline', 'timeout', 'error'],
          file: ['corrupt', 'missing', 'permission'],
          system: ['crash', 'hang', 'recovery']
        }
      }
    }
  }

  // 执行测试计划
  async executePlan() {
    // 执行单元测试
    await this.executeUnitTests()
    
    // 执行集成测试
    await this.executeIntegrationTests()
    
    // 执行端到端测试
    await this.executeE2ETests()
  }

  // 执行单元测试
  async executeUnitTests() {
    // 执行主进程测试
    await this.executeMainTests()
    
    // 执行渲染进程测试
    await this.executeRendererTests()
    
    // 执行共享模块测试
    await this.executeSharedTests()
  }

  // 执行集成测试
  async executeIntegrationTests() {
    // 执行应用流程测试
    await this.executeFlowTests()
    
    // 执行功能测试
    await this.executeFeatureTests()
    
    // 执行性能测试
    await this.executePerformanceTests()
  }

  // 执行端到端测试
  async executeE2ETests() {
    // 执行用户流程测试
    await this.executeUserTests()
    
    // 执行系统流程测试
    await this.executeSystemTests()
    
    // 执行错误处理测试
    await this.executeErrorTests()
  }
}
```

### 2. 测试报告

```javascript
// 测试报告配置
class TestingReport {
  constructor() {
    this.setupReport()
  }

  setupReport() {
    // 配置测试报告
    this.report = {
      // 报告格式
      format: {
        // 单元测试报告
        unit: {
          type: 'json',
          path: 'reports/unit.json',
          template: './templates/unit-report.html'
        },
        
        // 集成测试报告
        integration: {
          type: 'html',
          path: 'reports/integration.html',
          template: './templates/integration-report.html'
        },
        
        // 端到端测试报告
        e2e: {
          type: 'html',
          path: 'reports/e2e.html',
          template: './templates/e2e-report.html'
        }
      },
      
      // 报告内容
      content: {
        // 测试结果
        results: {
          passed: 0,
          failed: 0,
          skipped: 0,
          total: 0
        },
        
        // 测试覆盖率
        coverage: {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0
        },
        
        // 测试性能
        performance: {
          duration: 0,
          memory: 0,
          cpu: 0
        }
      }
    }
  }

  // 生成报告
  async generateReport() {
    // 生成单元测试报告
    await this.generateUnitReport()
    
    // 生成集成测试报告
    await this.generateIntegrationReport()
    
    // 生成端到端测试报告
    await this.generateE2EReport()
  }

  // 生成单元测试报告
  async generateUnitReport() {
    const fs = require('fs')
    const path = require('path')
    
    // 读取测试结果
    const results = require(path.join(process.cwd(), 'coverage/unit/coverage-summary.json'))
    
    // 更新报告内容
    this.report.content.results = {
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped,
      total: results.total
    }
    
    this.report.content.coverage = {
      statements: results.statements.pct,
      branches: results.branches.pct,
      functions: results.functions.pct,
      lines: results.lines.pct
    }
    
    // 生成报告文件
    const reportPath = path.join(process.cwd(), this.report.format.unit.path)
    fs.writeFileSync(reportPath, JSON.stringify(this.report.content, null, 2))
  }

  // 生成集成测试报告
  async generateIntegrationReport() {
    const fs = require('fs')
    const path = require('path')
    const template = require('handlebars')
    
    // 读取测试结果
    const results = require(path.join(process.cwd(), 'reports/integration.json'))
    
    // 更新报告内容
    this.report.content.results = {
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped,
      total: results.total
    }
    
    this.report.content.performance = {
      duration: results.duration,
      memory: results.memory,
      cpu: results.cpu
    }
    
    // 读取模板
    const templatePath = path.join(process.cwd(), this.report.format.integration.template)
    const templateContent = fs.readFileSync(templatePath, 'utf8')
    
    // 编译模板
    const compiledTemplate = template.compile(templateContent)
    
    // 生成报告文件
    const reportPath = path.join(process.cwd(), this.report.format.integration.path)
    fs.writeFileSync(reportPath, compiledTemplate(this.report.content))
  }

  // 生成端到端测试报告
  async generateE2EReport() {
    const fs = require('fs')
    const path = require('path')
    const template = require('handlebars')
    
    // 读取测试结果
    const results = require(path.join(process.cwd(), 'reports/e2e.json'))
    
    // 更新报告内容
    this.report.content.results = {
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped,
      total: results.total
    }
    
    this.report.content.performance = {
      duration: results.duration,
      memory: results.memory,
      cpu: results.cpu
    }
    
    // 读取模板
    const templatePath = path.join(process.cwd(), this.report.format.e2e.template)
    const templateContent = fs.readFileSync(templatePath, 'utf8')
    
    // 编译模板
    const compiledTemplate = template.compile(templateContent)
    
    // 生成报告文件
    const reportPath = path.join(process.cwd(), this.report.format.e2e.path)
    fs.writeFileSync(reportPath, compiledTemplate(this.report.content))
  }
}
```

## 相关资源

- [Electron 测试指南](https://www.electronjs.org/docs/tutorial/testing)
- [Jest 文档](https://jestjs.io/docs/getting-started)
- [Mocha 文档](https://mochajs.org/)
- [Spectron 文档](https://www.electronjs.org/spectron)