 # Electron 调试技巧

## 调试工具概览

### 内置工具
1. Chrome DevTools
   - 渲染进程调试
   - 网络请求分析
   - 性能分析
   - 内存分析

2. Node.js 调试器
   - 主进程调试
   - 断点调试
   - 变量查看
   - 调用栈分析

3. VS Code 调试器
   - 集成调试环境
   - 断点管理
   - 变量监视
   - 调试控制台

## 主进程调试

### 使用 VS Code 调试
1. 配置 launch.json：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."],
      "outputCapture": "std",
      "console": "integratedTerminal"
    }
  ]
}
```

2. 设置断点：
   - 在代码行号左侧点击设置断点
   - 使用 `debugger` 语句
   - 条件断点：右键断点设置条件

3. 调试控制：
   - F5: 继续执行
   - F10: 单步跳过
   - F11: 单步进入
   - Shift+F11: 单步跳出
   - Shift+F5: 停止调试

### 使用命令行调试
1. 启动调试模式：
```bash
# 使用 --inspect 参数
electron . --inspect=5858

# 使用 --inspect-brk 在启动时暂停
electron . --inspect-brk=5858
```

2. 连接调试器：
   - 打开 Chrome 浏览器
   - 访问 `chrome://inspect`
   - 点击 "Open dedicated DevTools for Node"

### 日志调试
1. 使用 console 方法：
```javascript
// 不同级别的日志
console.log('普通信息');
console.info('提示信息');
console.warn('警告信息');
console.error('错误信息');

// 分组日志
console.group('操作组');
console.log('操作1');
console.log('操作2');
console.groupEnd();

// 表格形式
console.table([
  { name: '操作1', status: '成功' },
  { name: '操作2', status: '失败' }
]);
```

2. 使用 electron-log：
```javascript
const log = require('electron-log');

// 配置日志
log.transports.file.level = 'info';
log.transports.file.maxSize = 10 * 1024 * 1024; // 10MB

// 记录日志
log.info('应用启动');
log.error('发生错误', new Error('错误详情'));
```

## 渲染进程调试

### 使用 Chrome DevTools
1. 打开 DevTools：
```javascript
// 在创建窗口时打开
mainWindow.webContents.openDevTools();

// 或通过快捷键
// Windows/Linux: Ctrl + Shift + I
// macOS: Cmd + Option + I
```

2. 常用调试功能：
   - Elements: 检查 DOM 结构
   - Console: 执行 JavaScript
   - Sources: 调试 JavaScript
   - Network: 监控网络请求
   - Performance: 性能分析
   - Memory: 内存分析

### 远程调试
1. 配置远程调试：
```javascript
// 主进程
mainWindow.webContents.setDevToolsWebContents(devToolsWindow.webContents);
mainWindow.webContents.openDevTools({ mode: 'detach' });

// 或使用命令行参数
electron . --remote-debugging-port=9222
```

2. 连接远程调试器：
   - 打开 Chrome
   - 访问 `chrome://inspect`
   - 点击 "Configure" 添加目标地址
   - 在 "Remote Target" 下找到应用

## 性能调试

### 使用 Chrome DevTools
1. Performance 面板：
   - 记录性能分析
   - 分析帧率
   - 查看 CPU 使用
   - 分析内存使用

2. Memory 面板：
   - 堆快照
   - 内存分配时间线
   - 内存泄漏检测

### 使用 electron 内置工具
1. 进程内存使用：
```javascript
const { app } = require('electron');

// 获取内存使用情况
const memoryInfo = process.getProcessMemoryInfo();
console.log('内存使用：', memoryInfo);

// 监控内存使用
setInterval(() => {
  const memoryInfo = process.getProcessMemoryInfo();
  console.log('当前内存使用：', memoryInfo);
}, 5000);
```

2. CPU 使用率：
```javascript
const os = require('os');

// 获取 CPU 使用率
function getCPUUsage() {
  const cpus = os.cpus();
  const totalCPU = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b);
    return acc + total;
  }, 0);
  
  return cpus.map(cpu => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b);
    return (total / totalCPU) * 100;
  });
}
```

## 常见问题调试

### 1. 白屏问题
1. 检查渲染进程日志：
```javascript
mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
  console.error('页面加载失败：', errorCode, errorDescription);
});
```

2. 检查预加载脚本：
```javascript
// 在预加载脚本中添加错误处理
window.addEventListener('error', (event) => {
  console.error('渲染进程错误：', event.error);
});
```

### 2. 进程崩溃
1. 捕获崩溃事件：
```javascript
app.on('render-process-gone', (event, webContents, details) => {
  console.error('渲染进程崩溃：', details);
});

app.on('child-process-gone', (event, details) => {
  console.error('子进程崩溃：', details);
});
```

2. 生成崩溃报告：
```javascript
const { crashReporter } = require('electron');

crashReporter.start({
  productName: 'YourApp',
  companyName: 'YourCompany',
  submitURL: 'https://your-crash-report-server.com',
  uploadToServer: true
});
```

### 3. 内存泄漏
1. 使用 Chrome DevTools Memory 面板：
   - 拍摄堆快照
   - 比较快照
   - 查找泄漏对象

2. 代码检查：
```javascript
// 检查事件监听器
const weakMap = new WeakMap();

function addEventListener(element, event, handler) {
  const wrappedHandler = (...args) => handler(...args);
  weakMap.set(handler, wrappedHandler);
  element.addEventListener(event, wrappedHandler);
}

function removeEventListener(element, event, handler) {
  const wrappedHandler = weakMap.get(handler);
  if (wrappedHandler) {
    element.removeEventListener(event, wrappedHandler);
    weakMap.delete(handler);
  }
}
```

## 调试最佳实践

1. 使用 source maps
   - 配置 webpack 生成 source maps
   - 确保 TypeScript 生成 source maps
   - 在生产环境禁用 source maps

2. 日志管理
   - 使用不同日志级别
   - 实现日志轮转
   - 添加时间戳和上下文信息

3. 错误处理
   - 实现全局错误处理
   - 使用 try-catch 捕获异常
   - 记录详细的错误信息

4. 性能监控
   - 监控关键指标
   - 设置性能基准
   - 定期进行性能分析

## 调试工具推荐

1. 开发工具
   - VS Code
   - Chrome DevTools
   - React Developer Tools
   - Vue DevTools

2. 性能工具
   - Chrome Performance 面板
   - Chrome Memory 面板
   - electron-log
   - node-memwatch

3. 监控工具
   - Sentry
   - New Relic
   - Datadog
   - AppSignal

## 相关资源

- [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools/)
- [Node.js 调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [VS Code 调试文档](https://code.visualstudio.com/docs/editor/debugging)
- [Electron 调试文档](https://www.electronjs.org/docs/latest/tutorial/debugging)