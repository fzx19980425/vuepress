 # Electron 剪贴板功能指南

## 剪贴板操作类型

Electron 支持多种剪贴板操作：

### 1. 文本操作
- 复制文本
- 粘贴文本
- 读取文本
- 清空文本

### 2. 图片操作
- 复制图片
- 粘贴图片
- 读取图片
- 保存图片

### 3. 富文本操作
- 复制 HTML
- 粘贴 HTML
- 读取 HTML
- 格式化 HTML

## 文本操作

### 1. 基本文本操作
```javascript
const { clipboard } = require('electron')

// 复制文本
function copyText(text) {
  clipboard.writeText(text)
}

// 粘贴文本
function pasteText() {
  const text = clipboard.readText()
  console.log('剪贴板内容:', text)
}

// 清空剪贴板
function clearClipboard() {
  clipboard.clear()
}
```

### 2. 格式化文本
```javascript
// 复制格式化文本
function copyFormattedText() {
  const text = 'Hello\nWorld'
  clipboard.writeText(text, 'selection')
}

// 读取特定格式
function readFormattedText() {
  const text = clipboard.readText('selection')
  console.log('选中的文本:', text)
}
```

## 图片操作

### 1. 基本图片操作
```javascript
const { clipboard, nativeImage } = require('electron')

// 复制图片
function copyImage(imagePath) {
  const image = nativeImage.createFromPath(imagePath)
  clipboard.writeImage(image)
}

// 粘贴图片
function pasteImage() {
  const image = clipboard.readImage()
  if (!image.isEmpty()) {
    // 保存图片
    const buffer = image.toPNG()
    fs.writeFileSync('pasted.png', buffer)
  }
}

// 检查剪贴板内容
function checkClipboardContent() {
  const formats = clipboard.availableFormats()
  console.log('可用格式:', formats)
}
```

### 2. 图片转换
```javascript
// 图片格式转换
function convertImageFormat() {
  const image = clipboard.readImage()
  if (!image.isEmpty()) {
    // 转换为不同格式
    const pngBuffer = image.toPNG()
    const jpegBuffer = image.toJPEG(90)
    const bitmapBuffer = image.toBitmap()
    
    // 保存不同格式
    fs.writeFileSync('image.png', pngBuffer)
    fs.writeFileSync('image.jpg', jpegBuffer)
    fs.writeFileSync('image.bmp', bitmapBuffer)
  }
}
```

## 富文本操作

### 1. HTML 操作
```javascript
// 复制 HTML
function copyHTML(html) {
  clipboard.writeHTML(html)
}

// 粘贴 HTML
function pasteHTML() {
  const html = clipboard.readHTML()
  console.log('HTML 内容:', html)
}

// 复制富文本
function copyRichText(html, text) {
  clipboard.write({
    html: html,
    text: text
  })
}
```

### 2. RTF 操作
```javascript
// 复制 RTF
function copyRTF(rtf) {
  clipboard.writeRTF(rtf)
}

// 粘贴 RTF
function pasteRTF() {
  const rtf = clipboard.readRTF()
  console.log('RTF 内容:', rtf)
}
```

## 高级功能

### 1. 剪贴板监听
```javascript
// 监听剪贴板变化
function watchClipboard() {
  let lastText = clipboard.readText()
  
  setInterval(() => {
    const currentText = clipboard.readText()
    if (currentText !== lastText) {
      console.log('剪贴板内容已更新')
      lastText = currentText
    }
  }, 1000)
}
```

### 2. 剪贴板历史
```javascript
class ClipboardHistory {
  constructor(maxSize = 10) {
    this.history = []
    this.maxSize = maxSize
  }

  add(item) {
    this.history.unshift(item)
    if (this.history.length > this.maxSize) {
      this.history.pop()
    }
  }

  get() {
    return this.history
  }

  clear() {
    this.history = []
  }
}

const history = new ClipboardHistory()
```

### 3. 自定义格式
```javascript
// 复制自定义格式
function copyCustomFormat(data) {
  const buffer = Buffer.from(JSON.stringify(data))
  clipboard.writeBuffer('application/json', buffer)
}

// 读取自定义格式
function readCustomFormat() {
  const buffer = clipboard.readBuffer('application/json')
  const data = JSON.parse(buffer.toString())
  console.log('自定义数据:', data)
}
```

## 最佳实践

### 1. 性能优化
- 避免频繁操作
- 使用异步操作
- 及时清理资源
- 控制内存使用

### 2. 安全考虑
- 验证数据格式
- 限制数据大小
- 清理敏感信息
- 检查权限

### 3. 用户体验
- 提供操作反馈
- 支持撤销操作
- 保持格式一致
- 处理异常情况

### 4. 跨平台兼容
- 处理格式差异
- 适配系统特性
- 提供降级方案
- 测试不同平台

## 常见问题

### 1. 操作问题
- 复制失败
- 粘贴异常
- 格式丢失
- 编码问题

### 2. 性能问题
- 内存占用高
- 操作延迟
- 资源泄漏
- 响应缓慢

### 3. 兼容问题
- 格式不兼容
- 系统差异
- 权限限制
- 版本问题

## 调试技巧

### 1. 剪贴板调试
```javascript
// 检查剪贴板状态
function debugClipboard() {
  console.log('剪贴板格式:', clipboard.availableFormats())
  console.log('文本内容:', clipboard.readText())
  console.log('HTML 内容:', clipboard.readHTML())
  console.log('RTF 内容:', clipboard.readRTF())
  
  const image = clipboard.readImage()
  console.log('图片状态:', {
    isEmpty: image.isEmpty(),
    size: image.getSize(),
    scale: image.getScaleFactor()
  })
}
```

### 2. 性能调试
```javascript
// 性能监控
function monitorPerformance() {
  const start = Date.now()
  
  // 执行剪贴板操作
  clipboard.writeText('test')
  
  const end = Date.now()
  console.log('操作耗时:', end - start, 'ms')
  
  // 内存使用
  const used = process.memoryUsage()
  console.log('内存使用:', {
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`
  })
}
```

## 相关资源

- [Electron 剪贴板 API](https://www.electronjs.org/docs/api/clipboard)
- [原生图片 API](https://www.electronjs.org/docs/api/native-image)
- [剪贴板最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [平台特定行为](https://www.electronjs.org/docs/api/clipboard#platform-specific-behavior)