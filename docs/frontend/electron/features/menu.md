 # Electron 菜单栏功能指南

## 菜单类型

Electron 支持多种类型的菜单：

### 1. 应用菜单 (Application Menu)
- 在 macOS 上显示在屏幕顶部
- 在 Windows/Linux 上显示在窗口顶部
- 包含应用级别的操作

### 2. 上下文菜单 (Context Menu)
- 右键点击时显示
- 根据上下文提供相关操作
- 可以动态生成

### 3. 托盘菜单 (Tray Menu)
- 系统托盘图标右键菜单
- 提供快捷操作
- 常驻后台功能

## 创建应用菜单

### 1. 基本菜单
```javascript
const { app, Menu } = require('electron')

const template = [
  {
    label: '文件',
    submenu: [
      {
        label: '新建',
        accelerator: 'CmdOrCtrl+N',
        click: () => { console.log('新建文件') }
      },
      {
        label: '打开',
        accelerator: 'CmdOrCtrl+O',
        click: () => { console.log('打开文件') }
      },
      { type: 'separator' },
      {
        label: '退出',
        accelerator: 'CmdOrCtrl+Q',
        click: () => { app.quit() }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { role: 'undo', label: '撤销' },
      { role: 'redo', label: '重做' },
      { type: 'separator' },
      { role: 'cut', label: '剪切' },
      { role: 'copy', label: '复制' },
      { role: 'paste', label: '粘贴' }
    ]
  },
  {
    label: '视图',
    submenu: [
      { role: 'reload', label: '重新加载' },
      { role: 'forceReload', label: '强制重新加载' },
      { role: 'toggleDevTools', label: '开发者工具' },
      { type: 'separator' },
      { role: 'resetZoom', label: '重置缩放' },
      { role: 'zoomIn', label: '放大' },
      { role: 'zoomOut', label: '缩小' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: '全屏' }
    ]
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '关于',
        click: () => { showAboutDialog() }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
```

### 2. 平台特定菜单
```javascript
const isMac = process.platform === 'darwin'

const template = [
  // macOS 特定菜单
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // 其他菜单项...
]
```

## 创建上下文菜单

### 1. 基本上下文菜单
```javascript
const { Menu } = require('electron')

// 在渲染进程中
window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  const menu = Menu.buildFromTemplate([
    { label: '复制', role: 'copy' },
    { label: '粘贴', role: 'paste' },
    { type: 'separator' },
    { label: '检查元素', role: 'inspect' }
  ])
  menu.popup()
})
```

### 2. 动态上下文菜单
```javascript
function createContextMenu(target) {
  const template = [
    {
      label: '基本操作',
      submenu: [
        { label: '复制', role: 'copy' },
        { label: '粘贴', role: 'paste' }
      ]
    }
  ]

  // 根据目标元素添加特定菜单项
  if (target.classList.contains('image')) {
    template.push({
      label: '图片操作',
      submenu: [
        { label: '保存图片', click: () => saveImage(target) },
        { label: '复制图片', click: () => copyImage(target) }
      ]
    })
  }

  return Menu.buildFromTemplate(template)
}
```

## 菜单项类型

### 1. 普通菜单项
```javascript
{
  label: '菜单项',
  click: () => { /* 处理点击事件 */ }
}
```

### 2. 子菜单
```javascript
{
  label: '子菜单',
  submenu: [
    { label: '子项 1', click: () => {} },
    { label: '子项 2', click: () => {} }
  ]
}
```

### 3. 分隔符
```javascript
{ type: 'separator' }
```

### 4. 复选框菜单项
```javascript
{
  label: '复选框',
  type: 'checkbox',
  checked: true,
  click: (menuItem) => {
    console.log('复选框状态:', menuItem.checked)
  }
}
```

### 5. 单选菜单项
```javascript
{
  label: '单选组',
  submenu: [
    {
      label: '选项 1',
      type: 'radio',
      checked: true
    },
    {
      label: '选项 2',
      type: 'radio'
    }
  ]
}
```

## 菜单事件处理

### 1. 点击事件
```javascript
{
  label: '点击事件',
  click: (menuItem, browserWindow, event) => {
    console.log('菜单项被点击')
    console.log('菜单项:', menuItem)
    console.log('浏览器窗口:', browserWindow)
    console.log('事件对象:', event)
  }
}
```

### 2. 快捷键
```javascript
{
  label: '快捷键',
  accelerator: 'CmdOrCtrl+Shift+I',
  click: () => {
    console.log('快捷键被触发')
  }
}
```

## 最佳实践

### 1. 菜单组织
- 按功能分组
- 使用分隔符
- 保持层级简单
- 遵循平台规范

### 2. 快捷键设计
- 使用标准快捷键
- 避免快捷键冲突
- 考虑平台差异
- 提供快捷键提示

### 3. 性能优化
- 延迟创建菜单
- 缓存菜单模板
- 避免频繁更新
- 及时释放资源

### 4. 用户体验
- 提供清晰的标签
- 使用图标增强可识别性
- 保持菜单结构一致
- 支持键盘导航

## 常见问题

### 1. 菜单显示问题
- 菜单项不显示
- 快捷键不生效
- 图标显示异常
- 层级显示错误

### 2. 事件处理问题
- 点击事件不触发
- 快捷键冲突
- 状态更新延迟
- 内存泄漏

### 3. 平台兼容性
- macOS 菜单差异
- Windows 快捷键
- Linux 显示问题
- 跨平台行为不一致

## 调试技巧

### 1. 菜单调试
```javascript
// 打印菜单结构
console.log('Menu template:', JSON.stringify(template, null, 2))

// 监听菜单事件
menu.on('menu-will-show', () => {
  console.log('菜单即将显示')
})

menu.on('menu-will-close', () => {
  console.log('菜单即将关闭')
})
```

### 2. 快捷键调试
```javascript
// 检查快捷键冲突
const accelerator = 'CmdOrCtrl+S'
const conflicts = Menu.getApplicationMenu()
  .getMenuItemById('save')
  .accelerator

console.log('快捷键冲突:', conflicts)
```

## 相关资源

- [Electron 菜单 API](https://www.electronjs.org/docs/api/menu)
- [菜单项 API](https://www.electronjs.org/docs/api/menu-item)
- [快捷键 API](https://www.electronjs.org/docs/api/accelerator)
- [平台特定行为](https://www.electronjs.org/docs/api/menu#notes-on-macos-application-menu)