 # 进程通信最佳实践

## 1. 安全的进程通信实现

```typescript
// types/ipc.ts
// 定义 IPC 通信的类型
export interface IpcChannels {
  'app:get-version': {
    request: void
    response: string
  }
  'file:read': {
    request: { path: string }
    response: { content: string; error?: string }
  }
  'window:state': {
    request: void
    response: { isMaximized: boolean; isMinimized: boolean }
  }
}

// preload.ts
import { contextBridge, ipcRenderer } from 'electron'
import type { IpcChannels } from './types/ipc'

// 类型安全的 IPC 通信封装
class IpcBridge {
  // 发送消息并等待响应
  async invoke<T extends keyof IpcChannels>(
    channel: T,
    ...args: IpcChannels[T]['request'] extends void ? [] : [IpcChannels[T]['request']]
  ): Promise<IpcChannels[T]['response']> {
    return ipcRenderer.invoke(channel, ...args)
  }

  // 监听消息
  on<T extends keyof IpcChannels>(
    channel: T,
    listener: (response: IpcChannels[T]['response']) => void
  ): () => void {
    const subscription = (_event: any, ...args: any[]) => listener(args[0])
    ipcRenderer.on(channel, subscription)
    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  }

  // 发送消息（不需要响应）
  send<T extends keyof IpcChannels>(
    channel: T,
    ...args: IpcChannels[T]['request'] extends void ? [] : [IpcChannels[T]['request']]
  ): void {
    ipcRenderer.send(channel, ...args)
  }
}

// 暴露给渲染进程的 API
contextBridge.exposeInMainWorld('ipc', new IpcBridge())

// main.ts
import { ipcMain } from 'electron'
import { app, BrowserWindow } from 'electron'
import * as fs from 'fs/promises'
import type { IpcChannels } from './types/ipc'

// 处理 IPC 通信
class IpcHandler {
  // 注册所有 IPC 处理器
  registerHandlers() {
    // 获取应用版本
    ipcMain.handle('app:get-version', () => {
      return app.getVersion()
    })

    // 读取文件
    ipcMain.handle('file:read', async (_, { path }: IpcChannels['file:read']['request']) => {
      try {
        const content = await fs.readFile(path, 'utf-8')
        return { content }
      } catch (error) {
        return { content: '', error: error.message }
      }
    })

    // 获取窗口状态
    ipcMain.handle('window:state', (event) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) return { isMaximized: false, isMinimized: false }
      
      return {
        isMaximized: win.isMaximized(),
        isMinimized: win.isMinimized()
      }
    })
  }
}

// 使用示例
app.whenReady().then(() => {
  const ipcHandler = new IpcHandler()
  ipcHandler.registerHandlers()
})
```

## 2. 渲染进程中的使用示例

```typescript
// renderer.ts
// 在渲染进程中使用 IPC 通信
class WindowController {
  // 获取应用版本
  async getAppVersion(): Promise<string> {
    return await window.ipc.invoke('app:get-version')
  }

  // 读取文件
  async readFile(filePath: string): Promise<string> {
    const { content, error } = await window.ipc.invoke('file:read', { path: filePath })
    if (error) {
      throw new Error(error)
    }
    return content
  }

  // 获取窗口状态
  async getWindowState() {
    return await window.ipc.invoke('window:state')
  }

  // 监听窗口状态变化
  setupWindowStateListener(callback: (state: { isMaximized: boolean; isMinimized: boolean }) => void) {
    return window.ipc.on('window:state-changed', callback)
  }
}

// 使用示例
const windowController = new WindowController()

// 获取应用版本
async function showAppVersion() {
  try {
    const version = await windowController.getAppVersion()
    console.log('App version:', version)
  } catch (error) {
    console.error('Failed to get app version:', error)
  }
}

// 读取文件
async function loadFile(filePath: string) {
  try {
    const content = await windowController.readFile(filePath)
    console.log('File content:', content)
  } catch (error) {
    console.error('Failed to read file:', error)
  }
}

// 监听窗口状态
const unsubscribe = windowController.setupWindowStateListener((state) => {
  console.log('Window state changed:', state)
})

// 组件卸载时取消订阅
function cleanup() {
  unsubscribe()
}
```

## 3. 进程通信最佳实践

### 类型安全
1. 使用 TypeScript 定义通信接口
2. 为所有 IPC 通道定义请求和响应类型
3. 使用类型守卫确保数据安全
4. 实现类型安全的 IPC 桥接层
5. 避免使用 `any` 类型

### 安全性
1. 使用 `contextIsolation` 隔离上下文
2. 实现通道白名单
3. 验证所有输入数据
4. 限制 IPC 通信范围
5. 使用 `invoke/handle` 替代 `send/on`

### 错误处理
1. 实现统一的错误处理机制
2. 使用 try-catch 包装异步操作
3. 返回结构化的错误信息
4. 实现错误重试机制
5. 添加错误日志记录

### 性能优化
1. 避免频繁的 IPC 通信
2. 使用批量操作减少通信次数
3. 实现数据缓存机制
4. 优化大数据传输
5. 使用流式处理大文件

### 代码组织
1. 集中管理 IPC 通道定义
2. 实现模块化的处理器
3. 使用类封装通信逻辑
4. 提供清晰的 API 文档
5. 实现单元测试

### 调试技巧
1. 使用 Chrome DevTools 调试
2. 添加详细的日志记录
3. 实现通信监控
4. 使用 TypeScript 调试工具
5. 添加性能分析

## 4. 常见问题解决方案

### 1. 内存泄漏
```typescript
// 正确的监听器清理
class SafeIpcListener {
  private listeners: Map<string, Function> = new Map()

  addListener(channel: string, listener: Function) {
    this.listeners.set(channel, listener)
    ipcRenderer.on(channel, listener)
  }

  removeAllListeners() {
    this.listeners.forEach((listener, channel) => {
      ipcRenderer.removeListener(channel, listener)
    })
    this.listeners.clear()
  }
}
```

### 2. 大数据传输
```typescript
// 使用流式处理大文件
async function* streamFile(path: string) {
  const stream = fs.createReadStream(path)
  for await (const chunk of stream) {
    yield chunk
  }
}

// 主进程处理
ipcMain.handle('file:stream', async (_, { path }) => {
  const stream = streamFile(path)
  for await (const chunk of stream) {
    // 分块发送数据
    event.sender.send('file:chunk', chunk)
  }
})
```

### 3. 通信超时处理
```typescript
// 带超时的 IPC 调用
async function invokeWithTimeout<T>(
  channel: string,
  timeout: number,
  ...args: any[]
): Promise<T> {
  return Promise.race([
    ipcRenderer.invoke(channel, ...args),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('IPC timeout')), timeout)
    )
  ])
}
```

### 4. 错误重试机制
```typescript
// 带重试的 IPC 调用
async function invokeWithRetry<T>(
  channel: string,
  maxRetries: number,
  ...args: any[]
): Promise<T> {
  let lastError: Error
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await ipcRenderer.invoke(channel, ...args)
    } catch (error) {
      lastError = error
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
  throw lastError
}
```