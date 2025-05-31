 # 自动更新机制最佳实践

## 1. 基础自动更新实现

```typescript
// update-manager.ts
import { autoUpdater, AppUpdater } from 'electron-updater'
import { app, BrowserWindow, dialog } from 'electron'
import * as log from 'electron-log'

export class UpdateManager {
  private updater: AppUpdater
  private mainWindow: BrowserWindow | null = null
  private updateCheckInterval: NodeJS.Timeout | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.updater = autoUpdater
    this.setupUpdater()
  }

  // 配置更新器
  private setupUpdater() {
    // 配置日志
    log.transports.file.level = 'info'
    this.updater.logger = log

    // 配置更新服务器
    this.updater.setFeedURL({
      provider: 'generic',
      url: 'https://your-update-server.com/updates'
    })

    // 配置更新选项
    this.updater.autoDownload = false
    this.updater.autoInstallOnAppQuit = true

    // 设置更新事件处理
    this.setupUpdateEvents()
  }

  // 设置更新事件处理
  private setupUpdateEvents() {
    // 检查更新错误
    this.updater.on('error', (error) => {
      log.error('更新检查失败:', error)
      this.notifyUpdateError(error)
    })

    // 检查更新
    this.updater.on('checking-for-update', () => {
      log.info('正在检查更新...')
      this.notifyCheckingUpdate()
    })

    // 发现新版本
    this.updater.on('update-available', (info) => {
      log.info('发现新版本:', info)
      this.notifyUpdateAvailable(info)
    })

    // 没有新版本
    this.updater.on('update-not-available', (info) => {
      log.info('当前已是最新版本:', info)
      this.notifyUpdateNotAvailable()
    })

    // 更新下载进度
    this.updater.on('download-progress', (progress) => {
      log.info('下载进度:', progress)
      this.notifyDownloadProgress(progress)
    })

    // 更新下载完成
    this.updater.on('update-downloaded', (info) => {
      log.info('更新下载完成:', info)
      this.notifyUpdateDownloaded(info)
    })
  }

  // 开始检查更新
  async checkForUpdates(force = false) {
    try {
      if (force) {
        // 强制检查更新
        await this.updater.checkForUpdates()
      } else {
        // 检查更新配置
        const config = await this.getUpdateConfig()
        if (config.autoCheck) {
          await this.updater.checkForUpdates()
        }
      }
    } catch (error) {
      log.error('检查更新失败:', error)
      this.notifyUpdateError(error)
    }
  }

  // 下载更新
  async downloadUpdate() {
    try {
      await this.updater.downloadUpdate()
    } catch (error) {
      log.error('下载更新失败:', error)
      this.notifyUpdateError(error)
    }
  }

  // 安装更新
  async installUpdate() {
    try {
      await this.updater.quitAndInstall()
    } catch (error) {
      log.error('安装更新失败:', error)
      this.notifyUpdateError(error)
    }
  }

  // 获取更新配置
  private async getUpdateConfig() {
    // 从本地存储或配置文件获取更新配置
    return {
      autoCheck: true,
      checkInterval: 3600000, // 1小时
      allowPrerelease: false
    }
  }

  // 通知更新检查中
  private notifyCheckingUpdate() {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('update:checking')
    }
  }

  // 通知发现新版本
  private notifyUpdateAvailable(info: any) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('update:available', info)
    }

    // 显示更新对话框
    dialog.showMessageBox(this.mainWindow!, {
      type: 'info',
      title: '发现新版本',
      message: `发现新版本 ${info.version}`,
      detail: info.releaseNotes,
      buttons: ['立即更新', '稍后更新'],
      defaultId: 0,
      cancelId: 1
    }).then(({ response }) => {
      if (response === 0) {
        this.downloadUpdate()
      }
    })
  }

  // 通知没有新版本
  private notifyUpdateNotAvailable() {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('update:not-available')
    }
  }

  // 通知下载进度
  private notifyDownloadProgress(progress: any) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('update:download-progress', progress)
    }
  }

  // 通知下载完成
  private notifyUpdateDownloaded(info: any) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('update:downloaded', info)
    }

    // 显示安装对话框
    dialog.showMessageBox(this.mainWindow!, {
      type: 'info',
      title: '更新就绪',
      message: '新版本已下载完成，是否立即安装？',
      buttons: ['立即安装', '稍后安装'],
      defaultId: 0,
      cancelId: 1
    }).then(({ response }) => {
      if (response === 0) {
        this.installUpdate()
      }
    })
  }

  // 通知更新错误
  private notifyUpdateError(error: Error) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('update:error', error.message)
    }

    dialog.showErrorBox('更新错误', error.message)
  }

  // 启动自动检查更新
  startAutoCheck() {
    this.stopAutoCheck()
    const config = this.getUpdateConfig()
    this.updateCheckInterval = setInterval(() => {
      this.checkForUpdates()
    }, config.checkInterval)
  }

  // 停止自动检查更新
  stopAutoCheck() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval)
      this.updateCheckInterval = null
    }
  }
}
```

## 2. 更新服务器配置

### 2.1 使用 GitHub Releases

```typescript
// github-update-manager.ts
import { autoUpdater } from 'electron-updater'

class GitHubUpdateManager extends UpdateManager {
  constructor(mainWindow: BrowserWindow) {
    super(mainWindow)
    this.setupGitHubUpdater()
  }

  private setupGitHubUpdater() {
    this.updater.setFeedURL({
      provider: 'github',
      owner: 'your-username',
      repo: 'your-repo',
      token: process.env.GITHUB_TOKEN // 用于私有仓库
    })
  }
}
```

### 2.2 使用自定义服务器

```typescript
// custom-update-manager.ts
import { autoUpdater } from 'electron-updater'

class CustomUpdateManager extends UpdateManager {
  constructor(mainWindow: BrowserWindow) {
    super(mainWindow)
    this.setupCustomUpdater()
  }

  private setupCustomUpdater() {
    this.updater.setFeedURL({
      provider: 'generic',
      url: 'https://your-update-server.com/updates',
      channel: 'latest',
      useMultipleRangeRequest: false
    })
  }
}
```

## 3. 更新包签名

```typescript
// signed-update-manager.ts
import { autoUpdater } from 'electron-updater'
import * as fs from 'fs'
import * as path from 'path'

class SignedUpdateManager extends UpdateManager {
  constructor(mainWindow: BrowserWindow) {
    super(mainWindow)
    this.setupSignedUpdater()
  }

  private setupSignedUpdater() {
    // 配置签名证书
    this.updater.setFeedURL({
      provider: 'generic',
      url: 'https://your-update-server.com/updates',
      publisherName: 'Your Company Name',
      // Windows 代码签名证书
      certificateFile: path.join(__dirname, '../certificates/certificate.pfx'),
      certificatePassword: process.env.CERTIFICATE_PASSWORD
    })
  }

  // 验证更新包签名
  private async verifyUpdateSignature(updatePath: string) {
    // 实现签名验证逻辑
    return true
  }
}
```

## 4. 增量更新

```typescript
// delta-update-manager.ts
import { autoUpdater } from 'electron-updater'

class DeltaUpdateManager extends UpdateManager {
  constructor(mainWindow: BrowserWindow) {
    super(mainWindow)
    this.setupDeltaUpdater()
  }

  private setupDeltaUpdater() {
    this.updater.setFeedURL({
      provider: 'generic',
      url: 'https://your-update-server.com/updates',
      // 启用增量更新
      isGeneric: true,
      useMultipleRangeRequest: true,
      // 配置增量更新选项
      delta: {
        enabled: true,
        maxSize: 50 * 1024 * 1024 // 50MB
      }
    })
  }

  // 检查是否可以使用增量更新
  private async checkDeltaUpdate(currentVersion: string, targetVersion: string) {
    // 实现增量更新检查逻辑
    return true
  }
}
```

## 5. 最佳实践总结

### 5.1 更新策略
1. 实现自动检查更新
2. 支持手动检查更新
3. 提供更新配置选项
4. 实现增量更新
5. 支持回滚机制

### 5.2 安全性
1. 验证更新包签名
2. 使用 HTTPS 下载
3. 实现更新包完整性检查
4. 保护更新配置
5. 防止中间人攻击

### 5.3 用户体验
1. 提供更新进度反馈
2. 支持后台更新
3. 实现优雅的更新流程
4. 提供更新说明
5. 处理更新失败情况

### 5.4 错误处理
1. 实现重试机制
2. 提供详细的错误信息
3. 记录更新日志
4. 处理网络异常
5. 实现回滚机制

### 5.5 性能优化
1. 使用增量更新
2. 实现断点续传
3. 优化更新包大小
4. 使用 CDN 加速
5. 实现更新缓存

## 6. 常见问题解决方案

### 6.1 更新失败处理
```typescript
class UpdateErrorHandler {
  private retryCount = 0
  private maxRetries = 3

  async handleUpdateError(error: Error, updater: AppUpdater) {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount))
      await updater.checkForUpdates()
    } else {
      this.notifyUpdateFailed(error)
    }
  }

  private notifyUpdateFailed(error: Error) {
    // 实现更新失败通知
  }
}
```

### 6.2 更新进度管理
```typescript
class UpdateProgressManager {
  private progress: number = 0
  private speed: number = 0
  private startTime: number = 0

  updateProgress(progress: any) {
    this.progress = progress.percent
    this.speed = this.calculateSpeed(progress)
    this.notifyProgress()
  }

  private calculateSpeed(progress: any) {
    const currentTime = Date.now()
    const timeElapsed = (currentTime - this.startTime) / 1000
    return progress.transferred / timeElapsed
  }

  private notifyProgress() {
    // 实现进度通知
  }
}
```

### 6.3 更新状态持久化
```typescript
class UpdateStateManager {
  private state: any = {}

  async saveUpdateState(state: any) {
    this.state = state
    await this.persistState()
  }

  async loadUpdateState() {
    await this.loadPersistedState()
    return this.state
  }

  private async persistState() {
    // 实现状态持久化
  }

  private async loadPersistedState() {
    // 实现状态加载
  }
}
```