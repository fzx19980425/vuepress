 # 窗口管理最佳实践

## 1. 基础窗口创建

```typescript
// main.ts
import { app, BrowserWindow, screen } from 'electron'
import * as path from 'path'

class WindowManager {
  private mainWindow: BrowserWindow | null = null
  private windowConfig = {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // 先隐藏窗口，等加载完成再显示
    webPreferences: {
      nodeIntegration: false, // 禁用 Node.js 集成
      contextIsolation: true, // 启用上下文隔离
      sandbox: true, // 启用沙箱
      preload: path.join(__dirname, 'preload.js') // 预加载脚本
    }
  }

  // 创建主窗口
  createMainWindow() {
    // 获取主屏幕尺寸
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    
    // 计算窗口位置，使其居中
    const x = Math.floor((width - this.windowConfig.width) / 2)
    const y = Math.floor((height - this.windowConfig.height) / 2)

    this.mainWindow = new BrowserWindow({
      ...this.windowConfig,
      x,
      y
    })

    // 加载页面
    if (process.env.NODE_ENV === 'development') {
      // 开发环境加载本地服务
      this.mainWindow.loadURL('http://localhost:3000')
      // 打开开发者工具
      this.mainWindow.webContents.openDevTools()
    } else {
      // 生产环境加载打包后的文件
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    // 窗口准备好后显示
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
    })

    // 处理窗口关闭
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })

    // 处理窗口状态变化
    this.mainWindow.on('maximize', () => {
      // 处理最大化事件
    })

    this.mainWindow.on('unmaximize', () => {
      // 处理取消最大化事件
    })

    this.mainWindow.on('minimize', () => {
      // 处理最小化事件
    })

    // 处理窗口大小变化
    this.mainWindow.on('resize', () => {
      // 保存窗口大小和位置
      this.saveWindowState()
    })

    // 处理窗口移动
    this.mainWindow.on('move', () => {
      // 保存窗口位置
      this.saveWindowState()
    })
  }

  // 保存窗口状态
  private saveWindowState() {
    if (!this.mainWindow) return

    const bounds = this.mainWindow.getBounds()
    const isMaximized = this.mainWindow.isMaximized()
    const isMinimized = this.mainWindow.isMinimized()

    // 保存到本地存储或配置文件
    const windowState = {
      bounds,
      isMaximized,
      isMinimized
    }
    // 使用 electron-store 或其他存储方案保存状态
  }

  // 恢复窗口状态
  private restoreWindowState() {
    // 从存储中读取窗口状态
    const windowState = {
      bounds: { x: 0, y: 0, width: 1200, height: 800 },
      isMaximized: false,
      isMinimized: false
    }

    if (windowState.isMaximized) {
      this.mainWindow?.maximize()
    } else if (windowState.isMinimized) {
      this.mainWindow?.minimize()
    } else {
      this.mainWindow?.setBounds(windowState.bounds)
    }
  }
}

// 使用示例
app.whenReady().then(() => {
  const windowManager = new WindowManager()
  windowManager.createMainWindow()
})
```

## 2. 多窗口管理

```typescript
// window-manager.ts
import { BrowserWindow, screen } from 'electron'
import * as path from 'path'

export class MultiWindowManager {
  private windows: Map<string, BrowserWindow> = new Map()

  // 创建新窗口
  createWindow(id: string, options: {
    url: string
    title?: string
    width?: number
    height?: number
    parent?: BrowserWindow
    modal?: boolean
  }) {
    const { url, title, width = 800, height = 600, parent, modal = false } = options

    // 获取父窗口位置
    let x = 0
    let y = 0
    if (parent) {
      const bounds = parent.getBounds()
      x = bounds.x + 50
      y = bounds.y + 50
    } else {
      // 居中显示
      const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize
      x = Math.floor((screenWidth - width) / 2)
      y = Math.floor((screenHeight - height) / 2)
    }

    const window = new BrowserWindow({
      width,
      height,
      x,
      y,
      parent: modal ? parent : undefined,
      modal,
      title: title || '新窗口',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        preload: path.join(__dirname, 'preload.js')
      }
    })

    // 加载页面
    window.loadURL(url)

    // 存储窗口引用
    this.windows.set(id, window)

    // 窗口关闭时清理引用
    window.on('closed', () => {
      this.windows.delete(id)
    })

    return window
  }

  // 获取窗口
  getWindow(id: string) {
    return this.windows.get(id)
  }

  // 关闭窗口
  closeWindow(id: string) {
    const window = this.windows.get(id)
    if (window) {
      window.close()
      this.windows.delete(id)
    }
  }

  // 关闭所有窗口
  closeAllWindows() {
    this.windows.forEach(window => window.close())
    this.windows.clear()
  }
}
```

## 3. 窗口通信最佳实践

```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到主进程
  send: (channel: string, data: any) => {
    // 白名单通道
    const validChannels = ['window:minimize', 'window:maximize', 'window:close']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },

  // 从主进程接收消息
  on: (channel: string, callback: Function) => {
    const validChannels = ['window:state-changed']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args))
    }
  },

  // 移除监听器
  removeListener: (channel: string, callback: Function) => {
    const validChannels = ['window:state-changed']
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback)
    }
  }
})

// main.ts
import { ipcMain, BrowserWindow } from 'electron'

// 处理窗口控制消息
ipcMain.on('window:minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.minimize()
})

ipcMain.on('window:maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }
})

ipcMain.on('window:close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.close()
})

// 发送窗口状态变化通知
function notifyWindowStateChange(win: BrowserWindow) {
  win.webContents.send('window:state-changed', {
    isMaximized: win.isMaximized(),
    isMinimized: win.isMinimized(),
    isFullScreen: win.isFullScreen()
  })
}
```

## 4. 最佳实践总结

### 窗口创建
1. 使用类封装窗口管理逻辑
2. 实现窗口状态的保存和恢复
3. 正确处理窗口的生命周期事件
4. 使用 TypeScript 提供类型安全
5. 实现窗口居中显示

### 安全考虑
1. 禁用 `nodeIntegration`
2. 启用 `contextIsolation`
3. 启用 `sandbox`
4. 使用预加载脚本
5. 实现通道白名单

### 性能优化
1. 延迟显示窗口直到内容加载完成
2. 合理管理窗口引用，避免内存泄漏
3. 使用 `Map` 管理多窗口
4. 实现窗口状态的持久化
5. 优化窗口创建和销毁逻辑

### 用户体验
1. 保存和恢复窗口位置和大小
2. 实现窗口动画效果
3. 处理多显示器场景
4. 提供模态窗口支持
5. 实现窗口间通信

### 错误处理
1. 添加窗口创建失败的处理
2. 实现优雅的窗口关闭逻辑
3. 处理窗口通信错误
4. 添加日志记录
5. 实现错误恢复机制