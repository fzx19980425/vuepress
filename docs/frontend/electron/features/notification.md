 # Electron 系统通知功能指南

## 通知类型

Electron 支持多种类型的系统通知：

### 1. 基础通知
- 简单文本通知
- 带标题的通知
- 带图标的通知
- 带按钮的通知

### 2. 交互通知
- 点击响应
- 按钮操作
- 回复功能
- 操作反馈

### 3. 自定义通知
- 自定义样式
- 自定义行为
- 自定义声音
- 自定义优先级

## 基础通知

### 1. 简单通知
```javascript
const { Notification } = require('electron')

function showSimpleNotification() {
  new Notification({
    title: '通知标题',
    body: '通知内容'
  }).show()
}
```

### 2. 带图标通知
```javascript
function showNotificationWithIcon() {
  new Notification({
    title: '通知标题',
    body: '通知内容',
    icon: path.join(__dirname, 'icon.png')
  }).show()
}
```

### 3. 带按钮通知
```javascript
function showNotificationWithButtons() {
  new Notification({
    title: '通知标题',
    body: '通知内容',
    buttons: [
      { text: '确定' },
      { text: '取消' }
    ]
  }).show()
}
```

## 交互通知

### 1. 点击事件
```javascript
function showClickableNotification() {
  const notification = new Notification({
    title: '可点击通知',
    body: '点击查看详情',
    silent: false
  })

  notification.on('click', () => {
    console.log('通知被点击')
    // 执行点击操作
  })

  notification.show()
}
```

### 2. 按钮事件
```javascript
function showNotificationWithActions() {
  const notification = new Notification({
    title: '操作通知',
    body: '请选择操作',
    buttons: [
      { text: '同意' },
      { text: '拒绝' }
    ]
  })

  notification.on('action', (event, index) => {
    switch (index) {
      case 0:
        console.log('用户点击了同意')
        break
      case 1:
        console.log('用户点击了拒绝')
        break
    }
  })

  notification.show()
}
```

### 3. 回复功能
```javascript
function showReplyNotification() {
  const notification = new Notification({
    title: '消息通知',
    body: '点击回复消息',
    replyPlaceholder: '输入回复内容',
    hasReply: true
  })

  notification.on('reply', (event, reply) => {
    console.log('用户回复:', reply)
    // 处理回复内容
  })

  notification.show()
}
```

## 自定义通知

### 1. 自定义样式
```javascript
function showCustomNotification() {
  new Notification({
    title: '自定义通知',
    body: '通知内容',
    icon: path.join(__dirname, 'custom-icon.png'),
    silent: true,
    urgency: 'high',
    timeoutType: 'never'
  }).show()
}
```

### 2. 自定义声音
```javascript
function showNotificationWithSound() {
  new Notification({
    title: '带声音通知',
    body: '通知内容',
    silent: false,
    sound: path.join(__dirname, 'notification.wav')
  }).show()
}
```

### 3. 自定义优先级
```javascript
function showPriorityNotification() {
  new Notification({
    title: '重要通知',
    body: '通知内容',
    urgency: 'high',
    priority: 'high'
  }).show()
}
```

## 通知管理

### 1. 通知队列
```javascript
class NotificationQueue {
  constructor() {
    this.queue = []
    this.isProcessing = false
  }

  add(notification) {
    this.queue.push(notification)
    this.process()
  }

  async process() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true
    const notification = this.queue.shift()

    notification.on('close', () => {
      this.isProcessing = false
      this.process()
    })

    notification.show()
  }
}

const queue = new NotificationQueue()
```

### 2. 通知分组
```javascript
function showGroupedNotifications() {
  const group = 'message-group'
  
  new Notification({
    title: '新消息',
    body: '消息1',
    tag: group
  }).show()

  new Notification({
    title: '新消息',
    body: '消息2',
    tag: group
  }).show()
}
```

### 3. 通知持久化
```javascript
function showPersistentNotification() {
  const notification = new Notification({
    title: '持久通知',
    body: '通知内容',
    timeoutType: 'never'
  })

  notification.on('close', () => {
    // 保存通知状态
    saveNotificationState(notification)
  })

  notification.show()
}
```

## 最佳实践

### 1. 用户体验
- 使用清晰的标题
- 提供简洁的内容
- 设置合适的图标
- 控制通知频率

### 2. 性能优化
- 管理通知队列
- 避免通知堆积
- 及时清理资源
- 控制通知数量

### 3. 错误处理
- 处理通知失败
- 验证通知内容
- 检查系统权限
- 记录错误日志

### 4. 平台兼容
- 适配不同系统
- 处理权限差异
- 考虑系统限制
- 提供降级方案

## 常见问题

### 1. 显示问题
- 通知不显示
- 图标显示异常
- 样式不一致
- 位置错误

### 2. 交互问题
- 点击无响应
- 按钮不工作
- 声音不播放
- 回复功能失效

### 3. 系统问题
- 权限不足
- 系统限制
- 通知被屏蔽
- 声音被禁用

## 调试技巧

### 1. 通知调试
```javascript
// 检查通知权限
const { systemPreferences } = require('electron')
const isAllowed = systemPreferences.isNotificationEnabled()
console.log('通知权限:', isAllowed)

// 监听通知事件
notification.on('show', () => {
  console.log('通知已显示')
})

notification.on('close', () => {
  console.log('通知已关闭')
})

notification.on('click', () => {
  console.log('通知被点击')
})

notification.on('action', (event, index) => {
  console.log('按钮被点击:', index)
})
```

### 2. 系统调试
```javascript
// 检查系统状态
const { app } = require('electron')
console.log('系统信息:', {
  platform: process.platform,
  version: process.getSystemVersion(),
  locale: app.getLocale()
})

// 检查通知设置
const { systemPreferences } = require('electron')
console.log('通知设置:', {
  enabled: systemPreferences.isNotificationEnabled(),
  doNotDisturb: systemPreferences.getDoNotDisturb()
})
```

## 相关资源

- [Electron 通知 API](https://www.electronjs.org/docs/api/notification)
- [系统偏好设置](https://www.electronjs.org/docs/api/system-preferences)
- [通知最佳实践](https://www.electronjs.org/docs/tutorial/notifications)
- [平台特定行为](https://www.electronjs.org/docs/api/notification#platform-specific-behavior)