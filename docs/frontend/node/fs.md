 # Node.js 文件系统

## 文件系统模块

Node.js 的 `fs` 模块提供了文件系统操作的功能，支持同步和异步操作。

## 基础操作

### 1. 文件读取
```javascript
const fs = require('fs');

// 异步读取
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 同步读取
const data = fs.readFileSync('file.txt', 'utf8');

// Promise 方式
const fsPromises = require('fs').promises;
async function readFile() {
  try {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### 2. 文件写入
```javascript
// 异步写入
fs.writeFile('file.txt', 'Hello World', 'utf8', (err) => {
  if (err) throw err;
  console.log('文件已保存');
});

// 同步写入
fs.writeFileSync('file.txt', 'Hello World', 'utf8');

// 追加写入
fs.appendFile('file.txt', '\nNew content', 'utf8', (err) => {
  if (err) throw err;
  console.log('内容已追加');
});
```

### 3. 文件删除
```javascript
// 异步删除
fs.unlink('file.txt', (err) => {
  if (err) throw err;
  console.log('文件已删除');
});

// 同步删除
fs.unlinkSync('file.txt');
```

## 目录操作

### 1. 创建目录
```javascript
// 异步创建
fs.mkdir('new-directory', (err) => {
  if (err) throw err;
  console.log('目录已创建');
});

// 同步创建
fs.mkdirSync('new-directory');

// 创建多级目录
fs.mkdir('parent/child/grandchild', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('多级目录已创建');
});
```

### 2. 读取目录
```javascript
// 异步读取
fs.readdir('directory', (err, files) => {
  if (err) throw err;
  console.log(files);
});

// 同步读取
const files = fs.readdirSync('directory');

// 读取目录详细信息
fs.readdir('directory', { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    console.log(file.name, file.isDirectory());
  });
});
```

### 3. 删除目录
```javascript
// 异步删除
fs.rmdir('directory', (err) => {
  if (err) throw err;
  console.log('目录已删除');
});

// 同步删除
fs.rmdirSync('directory');

// 递归删除
fs.rm('directory', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('目录已递归删除');
});
```

## 文件信息

### 1. 获取文件状态
```javascript
// 异步获取
fs.stat('file.txt', (err, stats) => {
  if (err) throw err;
  console.log(stats.isFile());
  console.log(stats.isDirectory());
  console.log(stats.size);
  console.log(stats.mtime);
});

// 同步获取
const stats = fs.statSync('file.txt');
```

### 2. 文件权限
```javascript
// 检查文件权限
fs.access('file.txt', fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.error('文件不可访问');
  } else {
    console.log('文件可读写');
  }
});

// 修改文件权限
fs.chmod('file.txt', 0o666, (err) => {
  if (err) throw err;
  console.log('权限已修改');
});
```

## 流操作

### 1. 读取流
```javascript
const readStream = fs.createReadStream('large-file.txt', 'utf8');

readStream.on('data', (chunk) => {
  console.log('读取数据:', chunk);
});

readStream.on('end', () => {
  console.log('读取完成');
});

readStream.on('error', (err) => {
  console.error('读取错误:', err);
});
```

### 2. 写入流
```javascript
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Hello World\n');
writeStream.write('Another line\n');

writeStream.on('finish', () => {
  console.log('写入完成');
});

writeStream.on('error', (err) => {
  console.error('写入错误:', err);
});

writeStream.end();
```

### 3. 管道操作
```javascript
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('管道传输完成');
});
```

## 文件监听

### 1. 监听文件变化
```javascript
fs.watch('file.txt', (eventType, filename) => {
  console.log(`文件 ${filename} 发生变化`);
  console.log(`变化类型: ${eventType}`);
});
```

### 2. 监听目录变化
```javascript
fs.watch('directory', (eventType, filename) => {
  console.log(`目录中的文件 ${filename} 发生变化`);
  console.log(`变化类型: ${eventType}`);
});
```

## 最佳实践

### 1. 错误处理
- 使用 try-catch
- 检查错误类型
- 适当的错误日志
- 优雅的错误恢复

### 2. 性能优化
- 使用流处理大文件
- 避免同步操作
- 合理使用缓存
- 控制并发操作

### 3. 安全考虑
- 验证文件路径
- 检查文件权限
- 限制文件大小
- 防止路径遍历

## 常见问题

### 1. 文件操作问题
- 文件不存在
- 权限不足
- 磁盘空间不足
- 文件被锁定

### 2. 性能问题
- 大文件处理
- 并发操作
- 内存使用
- 磁盘 I/O

### 3. 跨平台问题
- 路径分隔符
- 文件权限
- 字符编码
- 文件系统差异

## 工具和资源

### 1. 相关模块
- path
- stream
- crypto
- zlib

### 2. 开发工具
- nodemon
- chokidar
- glob
- fs-extra

### 3. 学习资源
- Node.js 文档
- 文件系统 API
- 流处理指南
- 最佳实践