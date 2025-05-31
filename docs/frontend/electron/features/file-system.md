 # Electron 文件系统功能指南

## 文件操作类型

Electron 支持多种文件系统操作：

### 1. 基础操作
- 文件读写
- 目录操作
- 路径处理
- 文件信息

### 2. 高级操作
- 文件监控
- 文件压缩
- 文件加密
- 文件同步

### 3. 系统集成
- 系统对话框
- 文件关联
- 最近文件
- 文件拖放

## 基础文件操作

### 1. 文件读写
```javascript
const fs = require('fs')
const path = require('path')

// 读取文件
function readFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    console.log('文件内容:', content)
  } catch (error) {
    console.error('读取文件失败:', error)
  }
}

// 写入文件
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log('文件写入成功')
  } catch (error) {
    console.error('写入文件失败:', error)
  }
}

// 追加内容
function appendFile(filePath, content) {
  try {
    fs.appendFileSync(filePath, content, 'utf8')
    console.log('内容追加成功')
  } catch (error) {
    console.error('追加内容失败:', error)
  }
}
```

### 2. 目录操作
```javascript
// 创建目录
function createDirectory(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log('目录创建成功')
  } catch (error) {
    console.error('创建目录失败:', error)
  }
}

// 读取目录
function readDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath)
    console.log('目录内容:', files)
  } catch (error) {
    console.error('读取目录失败:', error)
  }
}

// 删除目录
function removeDirectory(dirPath) {
  try {
    fs.rmdirSync(dirPath, { recursive: true })
    console.log('目录删除成功')
  } catch (error) {
    console.error('删除目录失败:', error)
  }
}
```

### 3. 文件信息
```javascript
// 获取文件信息
function getFileInfo(filePath) {
  try {
    const stats = fs.statSync(filePath)
    console.log('文件信息:', {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    })
  } catch (error) {
    console.error('获取文件信息失败:', error)
  }
}

// 检查文件权限
function checkFilePermission(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK)
    console.log('文件可读写')
  } catch (error) {
    console.error('文件权限不足:', error)
  }
}
```

## 高级文件操作

### 1. 文件监控
```javascript
// 监控文件变化
function watchFile(filePath) {
  fs.watch(filePath, (eventType, filename) => {
    console.log('文件变化:', {
      eventType,
      filename,
      time: new Date().toISOString()
    })
  })
}

// 监控目录变化
function watchDirectory(dirPath) {
  fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
    console.log('目录变化:', {
      eventType,
      filename,
      time: new Date().toISOString()
    })
  })
}
```

### 2. 文件压缩
```javascript
const zlib = require('zlib')

// 压缩文件
function compressFile(inputPath, outputPath) {
  const gzip = zlib.createGzip()
  const input = fs.createReadStream(inputPath)
  const output = fs.createWriteStream(outputPath)

  input.pipe(gzip).pipe(output)
}

// 解压文件
function decompressFile(inputPath, outputPath) {
  const gunzip = zlib.createGunzip()
  const input = fs.createReadStream(inputPath)
  const output = fs.createWriteStream(outputPath)

  input.pipe(gunzip).pipe(output)
}
```

### 3. 文件加密
```javascript
const crypto = require('crypto')

// 加密文件
function encryptFile(inputPath, outputPath, password) {
  const cipher = crypto.createCipher('aes-256-cbc', password)
  const input = fs.createReadStream(inputPath)
  const output = fs.createWriteStream(outputPath)

  input.pipe(cipher).pipe(output)
}

// 解密文件
function decryptFile(inputPath, outputPath, password) {
  const decipher = crypto.createDecipher('aes-256-cbc', password)
  const input = fs.createReadStream(inputPath)
  const output = fs.createWriteStream(outputPath)

  input.pipe(decipher).pipe(output)
}
```

## 系统集成

### 1. 系统对话框
```javascript
const { dialog } = require('electron')

// 打开文件对话框
async function openFileDialog() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections']
  })

  if (!canceled) {
    console.log('选择的文件:', filePaths)
  }
}

// 保存文件对话框
async function saveFileDialog() {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: '保存文件',
    defaultPath: app.getPath('documents')
  })

  if (!canceled) {
    console.log('保存路径:', filePath)
  }
}
```

### 2. 文件关联
```javascript
const { app } = require('electron')

// 设置文件关联
function setFileAssociation() {
  if (process.platform === 'win32') {
    app.setAsDefaultProtocolClient('myapp')
  } else if (process.platform === 'darwin') {
    app.setAsDefaultProtocolClient('myapp')
  }
}

// 处理文件打开
app.on('open-file', (event, filePath) => {
  event.preventDefault()
  console.log('打开文件:', filePath)
})
```

### 3. 最近文件
```javascript
// 添加最近文件
function addRecentFile(filePath) {
  app.addRecentDocument(filePath)
}

// 清除最近文件
function clearRecentFiles() {
  app.clearRecentDocuments()
}

// 获取最近文件
function getRecentFiles() {
  return app.getRecentDocuments()
}
```

## 最佳实践

### 1. 性能优化
- 使用流式处理
- 异步操作
- 缓存文件信息
- 批量处理

### 2. 安全考虑
- 验证文件路径
- 检查文件权限
- 限制文件大小
- 处理敏感数据

### 3. 错误处理
- 异常捕获
- 错误日志
- 重试机制
- 回滚操作

### 4. 用户体验
- 进度反馈
- 取消操作
- 文件预览
- 操作确认

## 常见问题

### 1. 操作问题
- 文件访问失败
- 权限不足
- 路径错误
- 编码问题

### 2. 性能问题
- 大文件处理
- 内存占用
- 响应延迟
- 并发操作

### 3. 兼容问题
- 路径分隔符
- 文件系统差异
- 权限模型
- 字符编码

## 调试技巧

### 1. 文件操作调试
```javascript
// 监控文件操作
function debugFileOperation() {
  const originalReadFile = fs.readFile
  fs.readFile = function(...args) {
    console.log('读取文件:', args[0])
    return originalReadFile.apply(this, args)
  }

  const originalWriteFile = fs.writeFile
  fs.writeFile = function(...args) {
    console.log('写入文件:', args[0])
    return originalWriteFile.apply(this, args)
  }
}
```

### 2. 性能调试
```javascript
// 性能监控
function monitorPerformance() {
  const start = Date.now()
  
  // 执行文件操作
  fs.readFileSync('large-file.txt')
  
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

- [Node.js 文件系统](https://nodejs.org/api/fs.html)
- [Electron 对话框 API](https://www.electronjs.org/docs/api/dialog)
- [文件系统最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [平台特定行为](https://www.electronjs.org/docs/api/app#appgetpathname)