 # Electron 进程管理

## 进程模型

### 主进程
1. 职责
   - 应用生命周期管理
   - 窗口创建和管理
   - 系统 API 访问
   - 进程间通信协调

2. 特点
   - 只有一个主进程
   - 拥有完整的 Node.js 权限
   - 可以创建多个渲染进程
   - 负责进程间通信

### 渲染进程
1. 职责
   - 界面渲染
   - 用户交互
   - 页面逻辑处理
   - 与主进程通信

2. 特点
   - 可以有多个渲染进程
   - 默认运行在沙箱环境
   - 通过 IPC 与主进程通信
   - 可以访问 Web API

## 进程管理

### 创建进程
1. 主进程创建渲染进程：
```javascript
const { BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

2. 创建子进程：
```javascript
const { fork } = require('child_process');

// 创建子进程
const child = fork('worker.js', ['arg1', 'arg2'], {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

// 监听子进程消息
child.on('message', (message) => {
  console.log('收到子进程消息:', message);
});

// 发送消息给子进程
child.send({ type: 'task', data: 'some data' });
```

### 进程通信
1. 主进程与渲染进程通信：
```javascript
// 主进程
const { ipcMain } = require('electron');

ipcMain.on('renderer-message', (event, arg) => {
  console.log('收到渲染进程消息:', arg);
  event.reply('main-reply', '主进程已收到');
});

// 渲染进程
const { ipcRenderer } = require('electron');

ipcRenderer.send('renderer-message', 'hello from renderer');
ipcRenderer.on('main-reply', (event, arg) => {
  console.log('收到主进程回复:', arg);
});
```

2. 进程间共享数据：
```javascript
// 使用共享内存
const { SharedArrayBuffer, Atomics } = require('worker_threads');

// 创建共享内存
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);

// 写入数据
Atomics.store(sharedArray, 0, 42);

// 读取数据
const value = Atomics.load(sharedArray, 0);
```

### 进程监控
1. 监控进程状态：
```javascript
const { app } = require('electron');

// 监控渲染进程崩溃
app.on('render-process-gone', (event, webContents, details) => {
  console.log('渲染进程崩溃:', details);
});

// 监控子进程退出
child.on('exit', (code, signal) => {
  console.log('子进程退出:', { code, signal });
});

// 监控内存使用
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log('内存使用:', memoryUsage);
}, 5000);
```

2. 进程健康检查：
```javascript
function checkProcessHealth() {
  // 检查主进程
  const mainProcessHealth = {
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    uptime: process.uptime()
  };

  // 检查渲染进程
  const rendererHealth = BrowserWindow.getAllWindows().map(win => ({
    id: win.id,
    memory: win.webContents.getProcessMemoryInfo(),
    isCrashed: win.webContents.isCrashed()
  }));

  return { mainProcessHealth, rendererHealth };
}
```

## 进程优化

### 内存管理
1. 内存泄漏检测：
```javascript
const heapdump = require('heapdump');

// 定期生成堆快照
setInterval(() => {
  heapdump.writeSnapshot(`./heap-${Date.now()}.heapsnapshot`);
}, 300000); // 每5分钟

// 分析内存使用
function analyzeMemory() {
  const used = process.memoryUsage();
  console.log('内存使用详情:', {
    rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(used.external / 1024 / 1024)}MB`
  });
}
```

2. 内存优化策略：
```javascript
// 及时释放资源
function cleanupResources() {
  // 清理不需要的窗口
  BrowserWindow.getAllWindows().forEach(win => {
    if (win.isDestroyed()) {
      win = null;
    }
  });

  // 清理缓存
  session.defaultSession.clearCache();

  // 触发垃圾回收
  if (global.gc) {
    global.gc();
  }
}
```

### 性能优化
1. 进程负载均衡：
```javascript
// 使用工作进程池
const WorkerPool = require('workerpool');

const pool = WorkerPool.pool('./worker.js', {
  minWorkers: 2,
  maxWorkers: 4
});

// 分配任务
async function distributeTask(task) {
  const worker = await pool.proxy();
  return worker.processTask(task);
}
```

2. 进程预热：
```javascript
// 预创建渲染进程
function preloadRenderers() {
  const preloadWindows = [];
  
  // 创建预加载窗口
  for (let i = 0; i < 3; i++) {
    const win = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    preloadWindows.push(win);
  }

  // 存储预加载窗口
  app.preloadWindows = preloadWindows;
}

// 使用预加载窗口
function getPreloadedWindow() {
  const win = app.preloadWindows.pop();
  if (win) {
    win.show();
    return win;
  }
  return createNewWindow();
}
```

## 进程安全

### 进程隔离
1. 沙箱配置：
```javascript
const mainWindow = new BrowserWindow({
  webPreferences: {
    sandbox: true,
    contextIsolation: true,
    nodeIntegration: false
  }
});
```

2. 权限控制：
```javascript
// 限制进程权限
function restrictProcessPermissions() {
  // 禁用危险 API
  app.commandLine.appendSwitch('disable-remote-fonts');
  app.commandLine.appendSwitch('disable-remote-playback-api');
  
  // 限制文件系统访问
  app.commandLine.appendSwitch('disable-file-system');
}
```

### 进程通信安全
1. 消息验证：
```javascript
// 验证 IPC 消息
ipcMain.on('secure-message', (event, message) => {
  // 验证消息来源
  if (!isValidSender(event.sender)) {
    event.reply('error', '无效的消息来源');
    return;
  }

  // 验证消息内容
  if (!isValidMessage(message)) {
    event.reply('error', '无效的消息内容');
    return;
  }

  // 处理消息
  processMessage(message);
});
```

2. 通信加密：
```javascript
const crypto = require('crypto');

// 加密消息
function encryptMessage(message, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(JSON.stringify(message), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 解密消息
function decryptMessage(encrypted, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}
```

## 最佳实践

### 1. 进程设计
- 合理划分进程职责
- 避免进程间过度通信
- 使用进程池管理子进程
- 实现进程自动恢复

### 2. 性能优化
- 及时释放不需要的资源
- 使用进程预热提高响应速度
- 实现进程负载均衡
- 监控进程资源使用

### 3. 安全防护
- 启用进程沙箱
- 实现消息验证
- 加密进程间通信
- 限制进程权限

### 4. 错误处理
- 实现进程崩溃恢复
- 记录进程错误日志
- 设置进程超时处理
- 实现优雅退出

## 相关资源

- [Electron 进程模型文档](https://www.electronjs.org/docs/tutorial/process-model)
- [Node.js 子进程文档](https://nodejs.org/api/child_process.html)
- [进程间通信最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [性能优化指南](https://www.electronjs.org/docs/tutorial/performance)