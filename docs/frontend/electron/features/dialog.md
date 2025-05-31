 # Electron 对话框功能指南

## 对话框类型

Electron 提供了多种类型的对话框：

### 1. 文件对话框
- 打开文件
- 保存文件
- 选择目录
- 多文件选择

### 2. 消息对话框
- 提示框
- 确认框
- 错误框
- 警告框

### 3. 自定义对话框
- 模态对话框
- 非模态对话框
- 自定义样式
- 自定义行为

## 文件对话框

### 1. 打开文件对话框
```javascript
const { dialog } = require('electron')

async function openFile() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: '选择文件',
    defaultPath: app.getPath('documents'),
    buttonLabel: '选择',
    filters: [
      { name: '图片', extensions: ['jpg', 'png', 'gif'] },
      { name: '文档', extensions: ['doc', 'docx', 'pdf'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    properties: [
      'openFile',
      'multiSelections'
    ]
  })

  if (!canceled) {
    console.log('选择的文件:', filePaths)
  }
}
```

### 2. 保存文件对话框
```javascript
async function saveFile() {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: '保存文件',
    defaultPath: app.getPath('documents'),
    buttonLabel: '保存',
    filters: [
      { name: '文本文件', extensions: ['txt'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  })

  if (!canceled) {
    console.log('保存路径:', filePath)
    // 保存文件逻辑
  }
}
```

### 3. 选择目录对话框
```javascript
async function selectDirectory() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: '选择目录',
    defaultPath: app.getPath('documents'),
    buttonLabel: '选择目录',
    properties: ['openDirectory']
  })

  if (!canceled) {
    console.log('选择的目录:', filePaths[0])
  }
}
```

## 消息对话框

### 1. 提示框
```javascript
async function showMessage() {
  const { response } = await dialog.showMessageBox({
    type: 'info',
    title: '提示',
    message: '操作成功',
    detail: '文件已保存',
    buttons: ['确定'],
    defaultId: 0
  })
}
```

### 2. 确认框
```javascript
async function showConfirm() {
  const { response } = await dialog.showMessageBox({
    type: 'question',
    title: '确认',
    message: '是否删除文件？',
    detail: '此操作不可撤销',
    buttons: ['取消', '删除'],
    defaultId: 0,
    cancelId: 0
  })

  if (response === 1) {
    // 执行删除操作
  }
}
```

### 3. 错误框
```javascript
function showError() {
  dialog.showErrorBox(
    '错误',
    '操作失败：文件不存在'
  )
}
```

## 自定义对话框

### 1. 模态对话框
```javascript
function createModalDialog() {
  const modalWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  modalWindow.loadFile('modal.html')
}
```

### 2. 非模态对话框
```javascript
function createNonModalDialog() {
  const dialogWindow = new BrowserWindow({
    parent: mainWindow,
    modal: false,
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  dialogWindow.loadFile('dialog.html')
}
```

## 对话框样式

### 1. 自定义样式
```html
<!-- dialog.html -->
<style>
.dialog-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.dialog-content {
  margin-bottom: 20px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.dialog-button-primary {
  background: #1890ff;
  color: white;
}

.dialog-button-default {
  background: #f0f0f0;
  color: #333;
}
</style>
```

### 2. 动画效果
```css
.dialog-enter {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s ease-out;
}

.dialog-enter-active {
  opacity: 1;
  transform: scale(1);
}

.dialog-exit {
  opacity: 1;
  transform: scale(1);
  transition: all 0.3s ease-in;
}

.dialog-exit-active {
  opacity: 0;
  transform: scale(0.9);
}
```

## 最佳实践

### 1. 用户体验
- 提供清晰的标题和说明
- 使用合适的图标
- 保持按钮文字简洁
- 支持键盘操作

### 2. 性能优化
- 延迟加载对话框
- 及时释放资源
- 避免频繁创建
- 缓存对话框实例

### 3. 错误处理
- 验证用户输入
- 处理取消操作
- 提供错误提示
- 记录错误日志

### 4. 安全性
- 验证文件路径
- 限制文件类型
- 检查文件大小
- 防止路径遍历

## 常见问题

### 1. 显示问题
- 对话框位置错误
- 样式显示异常
- 动画效果卡顿
- 层级显示问题

### 2. 交互问题
- 按钮无响应
- 键盘快捷键失效
- 拖拽功能异常
- 焦点管理问题

### 3. 文件操作
- 文件路径无效
- 权限不足
- 文件被占用
- 编码问题

## 调试技巧

### 1. 对话框调试
```javascript
// 打印对话框选项
console.log('Dialog options:', {
  title,
  defaultPath,
  filters,
  properties
})

// 监听对话框事件
dialog.on('did-show', () => {
  console.log('对话框已显示')
})

dialog.on('did-close', () => {
  console.log('对话框已关闭')
})
```

### 2. 文件操作调试
```javascript
// 检查文件权限
const fs = require('fs')
try {
  fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK)
  console.log('文件可读写')
} catch (err) {
  console.error('文件权限错误:', err)
}

// 检查文件信息
const stats = fs.statSync(filePath)
console.log('文件信息:', {
  size: stats.size,
  created: stats.birthtime,
  modified: stats.mtime
})
```

## 相关资源

- [Electron 对话框 API](https://www.electronjs.org/docs/api/dialog)
- [文件系统 API](https://www.electronjs.org/docs/api/file-system)
- [窗口管理](https://www.electronjs.org/docs/api/browser-window)
- [对话框最佳实践](https://www.electronjs.org/docs/tutorial/security)