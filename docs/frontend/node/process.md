 # Node.js 进程管理

## 进程模块概述

Node.js 的 `process` 模块提供了与当前 Node.js 进程交互的功能。

## 进程信息

### 1. 基本进程信息
```javascript
// 进程 ID
console.log(process.pid);

// 进程版本
console.log(process.version);

// 进程平台
console.log(process.platform);

// 进程架构
console.log(process.arch);

// 进程标题
console.log(process.title);
```

### 2. 环境变量
```javascript
// 获取环境变量
console.log(process.env.NODE_ENV);
console.log(process.env.PATH);

// 设置环境变量
process.env.NODE_ENV = 'production';
```

### 3. 进程资源
```javascript
// 内存使用
console.log(process.memoryUsage());

// CPU 使用
console.log(process.cpuUsage());

// 工作目录
console.log(process.cwd());

// 更改工作目录
process.chdir('/new/directory');
```

## 进程控制

### 1. 进程退出
```javascript
// 正常退出
process.exit(0);

// 错误退出
process.exit(1);

// 退出前清理
process.on('exit', (code) => {
  console.log(`进程退出，退出码: ${code}`);
});
```

### 2. 信号处理
```javascript
// 处理 SIGTERM 信号
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号');
  // 清理资源
  process.exit(0);
});

// 处理 SIGINT 信号（Ctrl+C）
process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号');
  process.exit(0);
});
```

### 3. 未捕获异常
```javascript
// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  // 记录错误
  process.exit(1);
});

// 处理未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});
```

## 子进程

### 1. 创建子进程
```javascript
const { spawn, exec, execFile, fork } = require('child_process');

// 使用 spawn
const child = spawn('ls', ['-l']);

child.stdout.on('data', (data) => {
  console.log(`输出: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`错误: ${data}`);
});

child.on('close', (code) => {
  console.log(`子进程退出，退出码: ${code}`);
});
```

### 2. 执行命令
```javascript
// 使用 exec
exec('ls -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error}`);
    return;
  }
  console.log(`输出: ${stdout}`);
});

// 使用 execFile
execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error}`);
    return;
  }
  console.log(`Node.js 版本: ${stdout}`);
});
```

### 3. 进程间通信
```javascript
// 使用 fork
const child = fork('child.js');

// 发送消息给子进程
child.send({ message: 'Hello' });

// 接收子进程消息
child.on('message', (message) => {
  console.log('来自子进程的消息:', message);
});
```

## 集群管理

### 1. 创建集群
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程共享 HTTP 服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

### 2. 负载均衡
```javascript
const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster) {
  // 跟踪请求数
  let numReqs = 0;
  setInterval(() => {
    console.log(`请求数: ${numReqs}`);
  }, 1000);

  // 计算请求数
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // 启动工作进程
  const numCPUs = require('os').cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }
} else {
  // 工作进程处理请求
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World\n');
    // 通知主进程
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

## 性能监控

### 1. 性能指标
```javascript
// 内存使用监控
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('内存使用:', {
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`
  });
}, 1000);
```

### 2. CPU 分析
```javascript
const profiler = require('v8-profiler');

// 开始 CPU 分析
profiler.startProfiling('CPU Profile');

// 运行一段时间后停止分析
setTimeout(() => {
  const profile = profiler.stopProfiling('CPU Profile');
  profile.export()
    .pipe(fs.createWriteStream(`cpu-${Date.now()}.cpuprofile`));
}, 5000);
```

## 最佳实践

### 1. 进程管理
- 优雅退出
- 错误处理
- 资源清理
- 日志记录

### 2. 性能优化
- 内存管理
- CPU 使用
- 进程通信
- 负载均衡

### 3. 安全考虑
- 权限控制
- 资源限制
- 进程隔离
- 错误处理

## 常见问题

### 1. 内存问题
- 内存泄漏
- 内存溢出
- 垃圾回收
- 内存监控

### 2. 性能问题
- CPU 使用率高
- 响应时间慢
- 进程阻塞
- 资源竞争

### 3. 稳定性问题
- 进程崩溃
- 死锁
- 资源耗尽
- 并发问题

## 工具和资源

### 1. 监控工具
- PM2
- New Relic
- Datadog
- Node.js 调试器

### 2. 开发工具
- nodemon
- forever
- node-clinic
- 0x

### 3. 学习资源
- Node.js 文档
- 进程管理指南
- 性能优化指南
- 调试技巧