 # 系统托盘实现最佳实践

## 1. 基础系统托盘实现

```typescript
// tray-manager.ts
import { app, Tray, Menu, BrowserWindow, nativeImage } from 'electron'
import * as path from 'path'

export class TrayManager {
  private tray: Tray | null = null
  private mainWindow: BrowserWindow | null = null
  private isQuitting = false

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.createTray()
    this.setupEventListeners()
  }

  // 创建系统托盘
  private createTray() {
    // 创建托盘图标
    const icon = nativeImage.createFromPath(
      path.join(__dirname, '../assets/tray-icon.png')
    ).resize({ width: 16, height: 16 })

    this.tray = new Tray(icon)
    this.tray.setToolTip('我的应用')

    // 创建托盘菜单
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示主窗口',
        click: () => this.showMainWindow()
      },
      {
        label: '暂停通知',
        type: 'checkbox',
        checked: false,
        click: (menuItem) => this.toggleNotifications(menuItem.checked)
      },
      { type: 'separator' },
      {
        label: '检查更新',
        click: () => this.checkForUpdates()
      },
      {
        label: '设置',
        click: () => this.openSettings()
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => this.quitApp()
      }
    ])

    this.tray.setContextMenu(contextMenu)

    // 点击托盘图标显示主窗口
    this.tray.on('click', () => {
      this.showMainWindow()
    })

    // 右键点击显示菜单
    this.tray.on('right-click', () => {
      this.tray?.popUpContextMenu()
    })
  }

  // 显示主窗口
  private showMainWindow() {
    if (!this.mainWindow) return

    if (this.mainWindow.isVisible()) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore()
      }
      this.mainWindow.focus()
    } else {
      this.mainWindow.show()
    }
  }

  // 切换通知状态
  private toggleNotifications(enabled: boolean) {
    // 实现通知开关逻辑
    console.log('通知状态:', enabled ? '开启' : '关闭')
  }

  // 检查更新
  private checkForUpdates() {
    // 实现更新检查逻辑
    console.log('检查更新...')
  }

  // 打开设置
  private openSettings() {
    // 实现打开设置窗口逻辑
    console.log('打开设置...')
  }

  // 退出应用
  private quitApp() {
    this.isQuitting = true
    app.quit()
  }

  // 设置事件监听
  private setupEventListeners() {
    // 监听窗口关闭事件
    this.mainWindow?.on('close', (event) => {
      if (!this.isQuitting) {
        event.preventDefault()
        this.mainWindow?.hide()
      }
    })

    // 监听应用退出事件
    app.on('before-quit', () => {
      this.isQuitting = true
      this.tray?.destroy()
    })
  }

  // 更新托盘图标
  updateTrayIcon(iconPath: string) {
    const icon = nativeImage.createFromPath(iconPath)
      .resize({ width: 16, height: 16 })
    this.tray?.setImage(icon)
  }

  // 更新托盘提示文本
  updateTooltip(tooltip: string) {
    this.tray?.setToolTip(tooltip)
  }

  // 更新托盘菜单
  updateMenu(menuTemplate: Electron.MenuItemConstructorOptions[]) {
    const menu = Menu.buildFromTemplate(menuTemplate)
    this.tray?.setContextMenu(menu)
  }

  // 销毁托盘
  destroy() {
    this.tray?.destroy()
    this.tray = null
  }
}

// 使用示例
// main.ts
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    // ... 窗口配置
  })

  const trayManager = new TrayManager(mainWindow)

  // 更新托盘状态示例
  function updateTrayStatus(status: string) {
    trayManager.updateTooltip(`应用状态: ${status}`)
  }

  // 更新托盘图标示例
  function updateTrayIcon(status: 'normal' | 'warning' | 'error') {
    const iconPath = path.join(__dirname, `../assets/tray-${status}.png`)
    trayManager.updateTrayIcon(iconPath)
  }
})
```

## 2. 高级托盘功能

### 2.1 动态菜单

```typescript
// dynamic-menu.ts
class DynamicTrayMenu {
  private tray: Tray
  private menuItems: Map<string, Electron.MenuItem> = new Map()

  constructor(tray: Tray) {
    this.tray = tray
  }

  // 添加动态菜单项
  addMenuItem(id: string, options: Electron.MenuItemConstructorOptions) {
    const menuItem = new MenuItem(options)
    this.menuItems.set(id, menuItem)
    this.updateMenu()
  }

  // 更新菜单项
  updateMenuItem(id: string, options: Partial<Electron.MenuItemConstructorOptions>) {
    const menuItem = this.menuItems.get(id)
    if (menuItem) {
      Object.assign(menuItem, options)
      this.updateMenu()
    }
  }

  // 移除菜单项
  removeMenuItem(id: string) {
    this.menuItems.delete(id)
    this.updateMenu()
  }

  // 更新整个菜单
  private updateMenu() {
    const menu = Menu.buildFromTemplate([
      ...Array.from(this.menuItems.values()),
      { type: 'separator' },
      { label: '退出', role: 'quit' }
    ])
    this.tray.setContextMenu(menu)
  }
}
```

### 2.2 托盘通知

```typescript
// tray-notification.ts
class TrayNotification {
  private tray: Tray
  private notificationTimeout: NodeJS.Timeout | null = null

  constructor(tray: Tray) {
    this.tray = tray
  }

  // 显示临时通知
  showNotification(message: string, duration: number = 3000) {
    // 清除之前的通知
    this.clearNotification()

    // 保存原始提示文本
    const originalTooltip = this.tray.getToolTip()

    // 显示新通知
    this.tray.setToolTip(message)

    // 设置定时器恢复原始提示
    this.notificationTimeout = setTimeout(() => {
      this.tray.setToolTip(originalTooltip)
      this.notificationTimeout = null
    }, duration)
  }

  // 清除通知
  clearNotification() {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout)
      this.notificationTimeout = null
    }
  }
}
```

### 2.3 托盘状态管理

```typescript
// tray-state.ts
interface TrayState {
  icon: string
  tooltip: string
  menu: Electron.MenuItemConstructorOptions[]
  isVisible: boolean
}

class TrayStateManager {
  private tray: Tray
  private state: TrayState
  private stateHistory: TrayState[] = []

  constructor(tray: Tray, initialState: TrayState) {
    this.tray = tray
    this.state = initialState
    this.applyState(initialState)
  }

  // 更新托盘状态
  updateState(newState: Partial<TrayState>) {
    // 保存当前状态到历史记录
    this.stateHistory.push({ ...this.state })

    // 更新状态
    this.state = { ...this.state, ...newState }

    // 应用新状态
    this.applyState(this.state)
  }

  // 应用状态
  private applyState(state: TrayState) {
    if (state.icon) {
      const icon = nativeImage.createFromPath(state.icon)
        .resize({ width: 16, height: 16 })
      this.tray.setImage(icon)
    }

    if (state.tooltip) {
      this.tray.setToolTip(state.tooltip)
    }

    if (state.menu) {
      const menu = Menu.buildFromTemplate(state.menu)
      this.tray.setContextMenu(menu)
    }

    if (state.isVisible !== undefined) {
      this.tray.setVisible(state.isVisible)
    }
  }

  // 恢复上一个状态
  restorePreviousState() {
    const previousState = this.stateHistory.pop()
    if (previousState) {
      this.state = previousState
      this.applyState(this.state)
    }
  }
}
```

## 3. 最佳实践总结

### 3.1 性能优化
1. 使用适当大小的图标（16x16 或 32x32）
2. 避免频繁更新托盘状态
3. 使用缓存减少图标加载
4. 优化菜单更新逻辑
5. 及时清理资源

### 3.2 用户体验
1. 提供清晰的图标和提示文本
2. 实现合理的菜单结构
3. 支持快捷键操作
4. 提供状态反馈
5. 保持行为一致性

### 3.3 错误处理
1. 处理图标加载失败
2. 验证菜单项配置
3. 处理窗口状态异常
4. 实现优雅的退出逻辑
5. 添加错误日志

### 3.4 安全性
1. 验证菜单项权限
2. 限制托盘操作范围
3. 保护敏感操作
4. 实现操作确认
5. 防止恶意操作

### 3.5 跨平台兼容
1. 处理不同平台的图标差异
2. 适配不同平台的菜单行为
3. 处理平台特定的快捷键
4. 考虑不同分辨率
5. 测试不同操作系统

## 4. 常见问题解决方案

### 4.1 托盘图标闪烁
```typescript
class TrayBlinkManager {
  private blinkInterval: NodeJS.Timeout | null = null
  private originalIcon: Electron.NativeImage
  private alternateIcon: Electron.NativeImage

  constructor(tray: Tray, alternateIconPath: string) {
    this.originalIcon = tray.getImage()
    this.alternateIcon = nativeImage.createFromPath(alternateIconPath)
      .resize({ width: 16, height: 16 })
  }

  startBlinking(interval: number = 500) {
    this.stopBlinking()
    let isOriginal = true
    this.blinkInterval = setInterval(() => {
      this.tray.setImage(isOriginal ? this.originalIcon : this.alternateIcon)
      isOriginal = !isOriginal
    }, interval)
  }

  stopBlinking() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval)
      this.blinkInterval = null
      this.tray.setImage(this.originalIcon)
    }
  }
}
```

### 4.2 托盘菜单状态同步
```typescript
class TrayMenuSync {
  private menuItems: Map<string, { 
    item: Electron.MenuItem
    state: any 
  }> = new Map()

  updateMenuItemState(id: string, state: any) {
    const menuItem = this.menuItems.get(id)
    if (menuItem) {
      menuItem.state = state
      this.syncMenuItem(menuItem.item, state)
    }
  }

  private syncMenuItem(item: Electron.MenuItem, state: any) {
    if (state.checked !== undefined) {
      item.checked = state.checked
    }
    if (state.enabled !== undefined) {
      item.enabled = state.enabled
    }
    if (state.label !== undefined) {
      item.label = state.label
    }
  }
}
```

### 4.3 托盘通知队列
```typescript
class TrayNotificationQueue {
  private queue: string[] = []
  private isProcessing = false
  private currentTimeout: NodeJS.Timeout | null = null

  constructor(private tray: Tray) {}

  addNotification(message: string) {
    this.queue.push(message)
    if (!this.isProcessing) {
      this.processNext()
    }
  }

  private processNext() {
    if (this.queue.length === 0) {
      this.isProcessing = false
      return
    }

    this.isProcessing = true
    const message = this.queue.shift()!
    this.tray.setToolTip(message)

    this.currentTimeout = setTimeout(() => {
      this.processNext()
    }, 3000)
  }

  clear() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
    }
    this.queue = []
    this.isProcessing = false
  }
}
```