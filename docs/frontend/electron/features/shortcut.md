 # 快捷键管理最佳实践

## 1. 基础快捷键实现

```typescript
// shortcut-manager.ts
import { globalShortcut, BrowserWindow, Menu, MenuItem } from 'electron'
import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs/promises'

interface ShortcutConfig {
  key: string
  command: string
  description: string
  category: string
  enabled: boolean
  global?: boolean
}

export class ShortcutManager {
  private shortcuts: Map<string, ShortcutConfig> = new Map()
  private configPath: string
  private mainWindow: BrowserWindow | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.configPath = path.join(app.getPath('userData'), 'shortcuts.json')
    this.initShortcuts()
  }

  // 初始化快捷键
  private async initShortcuts() {
    try {
      // 加载默认快捷键配置
      await this.loadDefaultShortcuts()
      // 加载用户自定义配置
      await this.loadUserShortcuts()
      // 注册快捷键
      this.registerShortcuts()
    } catch (error) {
      console.error('初始化快捷键失败:', error)
    }
  }

  // 加载默认快捷键配置
  private async loadDefaultShortcuts() {
    const defaultShortcuts: ShortcutConfig[] = [
      {
        key: 'CommandOrControl+N',
        command: 'new-window',
        description: '新建窗口',
        category: 'file',
        enabled: true
      },
      {
        key: 'CommandOrControl+O',
        command: 'open-file',
        description: '打开文件',
        category: 'file',
        enabled: true
      },
      {
        key: 'CommandOrControl+S',
        command: 'save',
        description: '保存',
        category: 'file',
        enabled: true
      },
      {
        key: 'CommandOrControl+Z',
        command: 'undo',
        description: '撤销',
        category: 'edit',
        enabled: true
      },
      {
        key: 'CommandOrControl+Y',
        command: 'redo',
        description: '重做',
        category: 'edit',
        enabled: true
      },
      {
        key: 'CommandOrControl+F',
        command: 'search',
        description: '搜索',
        category: 'edit',
        enabled: true
      },
      {
        key: 'CommandOrControl+Shift+I',
        command: 'toggle-devtools',
        description: '切换开发者工具',
        category: 'view',
        enabled: true,
        global: true
      }
    ]

    for (const shortcut of defaultShortcuts) {
      this.shortcuts.set(shortcut.command, shortcut)
    }
  }

  // 加载用户自定义配置
  private async loadUserShortcuts() {
    try {
      const content = await fs.readFile(this.configPath, 'utf-8')
      const userShortcuts: ShortcutConfig[] = JSON.parse(content)
      
      for (const shortcut of userShortcuts) {
        this.shortcuts.set(shortcut.command, shortcut)
      }
    } catch (error) {
      // 配置文件不存在，使用默认配置
    }
  }

  // 注册快捷键
  private registerShortcuts() {
    // 注销所有快捷键
    globalShortcut.unregisterAll()

    // 注册启用的快捷键
    for (const [command, shortcut] of this.shortcuts.entries()) {
      if (shortcut.enabled) {
        if (shortcut.global) {
          // 注册全局快捷键
          globalShortcut.register(shortcut.key, () => {
            this.executeCommand(command)
          })
        } else {
          // 注册应用内快捷键
          this.registerAppShortcut(shortcut)
        }
      }
    }
  }

  // 注册应用内快捷键
  private registerAppShortcut(shortcut: ShortcutConfig) {
    if (!this.mainWindow) return

    const menu = Menu.getApplicationMenu()
    if (!menu) return

    // 查找或创建对应的菜单项
    const category = this.findOrCreateCategory(menu, shortcut.category)
    if (category) {
      category.submenu?.append(
        new MenuItem({
          label: shortcut.description,
          accelerator: shortcut.key,
          click: () => this.executeCommand(shortcut.command)
        })
      )
    }
  }

  // 查找或创建菜单类别
  private findOrCreateCategory(menu: Menu, category: string): MenuItem | null {
    const existingCategory = menu.items.find(item => item.label === category)
    if (existingCategory) {
      return existingCategory
    }

    // 创建新的菜单类别
    const newCategory = new MenuItem({
      label: category,
      submenu: []
    })
    menu.append(newCategory)
    return newCategory
  }

  // 执行命令
  private executeCommand(command: string) {
    if (!this.mainWindow) return

    switch (command) {
      case 'new-window':
        this.createNewWindow()
        break
      case 'open-file':
        this.openFile()
        break
      case 'save':
        this.saveFile()
        break
      case 'undo':
        this.undo()
        break
      case 'redo':
        this.redo()
        break
      case 'search':
        this.search()
        break
      case 'toggle-devtools':
        this.toggleDevTools()
        break
      default:
        console.warn('未知命令:', command)
    }
  }

  // 创建新窗口
  private createNewWindow() {
    // 实现创建新窗口逻辑
  }

  // 打开文件
  private openFile() {
    // 实现打开文件逻辑
  }

  // 保存文件
  private saveFile() {
    // 实现保存文件逻辑
  }

  // 撤销
  private undo() {
    // 实现撤销逻辑
  }

  // 重做
  private redo() {
    // 实现重做逻辑
  }

  // 搜索
  private search() {
    // 实现搜索逻辑
  }

  // 切换开发者工具
  private toggleDevTools() {
    this.mainWindow?.webContents.toggleDevTools()
  }

  // 添加快捷键
  async addShortcut(shortcut: ShortcutConfig): Promise<void> {
    this.shortcuts.set(shortcut.command, shortcut)
    await this.saveShortcuts()
    this.registerShortcuts()
  }

  // 更新快捷键
  async updateShortcut(command: string, updates: Partial<ShortcutConfig>): Promise<void> {
    const shortcut = this.shortcuts.get(command)
    if (shortcut) {
      this.shortcuts.set(command, { ...shortcut, ...updates })
      await this.saveShortcuts()
      this.registerShortcuts()
    }
  }

  // 删除快捷键
  async removeShortcut(command: string): Promise<void> {
    this.shortcuts.delete(command)
    await this.saveShortcuts()
    this.registerShortcuts()
  }

  // 保存快捷键配置
  private async saveShortcuts(): Promise<void> {
    const shortcuts = Array.from(this.shortcuts.values())
    await fs.writeFile(this.configPath, JSON.stringify(shortcuts, null, 2))
  }

  // 获取所有快捷键
  getAllShortcuts(): ShortcutConfig[] {
    return Array.from(this.shortcuts.values())
  }

  // 获取分类快捷键
  getShortcutsByCategory(category: string): ShortcutConfig[] {
    return Array.from(this.shortcuts.values())
      .filter(shortcut => shortcut.category === category)
  }

  // 检查快捷键冲突
  checkShortcutConflict(key: string): boolean {
    return globalShortcut.isRegistered(key)
  }
}
```

## 2. 快捷键编辑器

```typescript
// shortcut-editor.ts
import { dialog, BrowserWindow } from 'electron'

export class ShortcutEditor {
  private mainWindow: BrowserWindow
  private shortcutManager: ShortcutManager

  constructor(mainWindow: BrowserWindow, shortcutManager: ShortcutManager) {
    this.mainWindow = mainWindow
    this.shortcutManager = shortcutManager
  }

  // 显示快捷键编辑器
  showEditor(): void {
    const editorWindow = new BrowserWindow({
      width: 800,
      height: 600,
      parent: this.mainWindow,
      modal: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    editorWindow.loadFile('shortcut-editor.html')
  }

  // 开始录制快捷键
  startRecording(callback: (key: string) => void): void {
    // 实现快捷键录制逻辑
  }

  // 验证快捷键
  validateShortcut(key: string): boolean {
    // 实现快捷键验证逻辑
    return true
  }

  // 格式化快捷键
  formatShortcut(key: string): string {
    // 实现快捷键格式化逻辑
    return key
  }

  // 显示快捷键冲突对话框
  async showConflictDialog(key: string): Promise<boolean> {
    const { response } = await dialog.showMessageBox(this.mainWindow, {
      type: 'warning',
      title: '快捷键冲突',
      message: `快捷键 ${key} 已被占用`,
      buttons: ['覆盖', '取消'],
      defaultId: 1
    })

    return response === 0
  }
}
```

## 3. 快捷键配置界面

```typescript
// shortcut-settings.ts
import { BrowserWindow, ipcMain } from 'electron'

export class ShortcutSettings {
  private mainWindow: BrowserWindow
  private shortcutManager: ShortcutManager
  private editor: ShortcutEditor

  constructor(mainWindow: BrowserWindow, shortcutManager: ShortcutManager) {
    this.mainWindow = mainWindow
    this.shortcutManager = shortcutManager
    this.editor = new ShortcutEditor(mainWindow, shortcutManager)
    this.setupIpcHandlers()
  }

  // 设置 IPC 处理器
  private setupIpcHandlers() {
    // 获取所有快捷键
    ipcMain.handle('shortcuts:get-all', () => {
      return this.shortcutManager.getAllShortcuts()
    })

    // 获取分类快捷键
    ipcMain.handle('shortcuts:get-by-category', (_, category: string) => {
      return this.shortcutManager.getShortcutsByCategory(category)
    })

    // 更新快捷键
    ipcMain.handle('shortcuts:update', async (_, command: string, updates: any) => {
      await this.shortcutManager.updateShortcut(command, updates)
    })

    // 删除快捷键
    ipcMain.handle('shortcuts:remove', async (_, command: string) => {
      await this.shortcutManager.removeShortcut(command)
    })

    // 检查快捷键冲突
    ipcMain.handle('shortcuts:check-conflict', (_, key: string) => {
      return this.shortcutManager.checkShortcutConflict(key)
    })

    // 重置快捷键
    ipcMain.handle('shortcuts:reset', async () => {
      await this.resetShortcuts()
    })
  }

  // 重置快捷键
  private async resetShortcuts() {
    // 实现重置快捷键逻辑
  }

  // 导出快捷键配置
  async exportShortcuts(filePath: string): Promise<void> {
    const shortcuts = this.shortcutManager.getAllShortcuts()
    // 实现导出逻辑
  }

  // 导入快捷键配置
  async importShortcuts(filePath: string): Promise<void> {
    // 实现导入逻辑
  }
}
```

## 4. 最佳实践总结

### 4.1 快捷键设计
1. 遵循平台约定
2. 避免快捷键冲突
3. 提供合理的默认值
4. 支持自定义配置
5. 考虑可访问性

### 4.2 用户体验
1. 提供快捷键提示
2. 支持快捷键搜索
3. 实现快捷键编辑器
4. 提供重置选项
5. 支持导入导出

### 4.3 性能优化
1. 使用快捷键缓存
2. 优化注册逻辑
3. 减少事件监听
4. 实现懒加载
5. 优化冲突检测

### 4.4 安全性
1. 验证快捷键格式
2. 防止快捷键劫持
3. 保护系统快捷键
4. 限制全局快捷键
5. 实现权限控制

### 4.5 可维护性
1. 集中管理配置
2. 提供类型定义
3. 实现日志记录
4. 支持配置迁移
5. 提供开发工具

## 5. 常见问题解决方案

### 5.1 快捷键冲突处理
```typescript
class ShortcutConflictResolver {
  private conflictMap: Map<string, string[]> = new Map()

  async resolveConflict(key: string, command: string): Promise<boolean> {
    const conflicts = this.findConflicts(key)
    if (conflicts.length === 0) {
      return true
    }

    // 显示冲突对话框
    const shouldOverride = await this.showConflictDialog(conflicts)
    if (shouldOverride) {
      // 移除冲突的快捷键
      for (const conflict of conflicts) {
        await this.removeShortcut(conflict)
      }
      return true
    }

    return false
  }

  private findConflicts(key: string): string[] {
    return this.conflictMap.get(key) || []
  }

  private async showConflictDialog(conflicts: string[]): Promise<boolean> {
    // 实现冲突对话框
    return true
  }
}
```

### 5.2 快捷键录制
```typescript
class ShortcutRecorder {
  private isRecording: boolean = false
  private keySequence: string[] = []

  startRecording(): void {
    this.isRecording = true
    this.keySequence = []
    this.setupKeyListeners()
  }

  stopRecording(): string {
    this.isRecording = false
    this.removeKeyListeners()
    return this.formatKeySequence()
  }

  private setupKeyListeners(): void {
    // 实现按键监听
  }

  private formatKeySequence(): string {
    return this.keySequence.join('+')
  }
}
```

### 5.3 快捷键验证
```typescript
class ShortcutValidator {
  validateShortcut(key: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    // 检查格式
    if (!this.isValidFormat(key)) {
      errors.push('无效的快捷键格式')
    }

    // 检查系统保留
    if (this.isSystemReserved(key)) {
      errors.push('系统保留的快捷键')
    }

    // 检查冲突
    if (this.hasConflict(key)) {
      errors.push('快捷键冲突')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private isValidFormat(key: string): boolean {
    // 实现格式验证
    return true
  }

  private isSystemReserved(key: string): boolean {
    // 实现系统保留检查
    return false
  }

  private hasConflict(key: string): boolean {
    // 实现冲突检查
    return false
  }
}
```