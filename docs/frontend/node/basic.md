 # Node.js 基础概念

## 什么是 Node.js？

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境。它使用事件驱动、非阻塞 I/O 模型，使其轻量级且高效。

## 核心特性

### 1. 异步非阻塞 I/O
- 事件驱动
- 非阻塞操作
- 回调函数
- Promise 和 async/await

### 2. 事件循环
- 事件循环机制
- 事件队列
- 微任务和宏任务
- 事件循环阶段

### 3. 模块系统
- CommonJS 模块
- ES Modules
- 模块加载机制
- 模块缓存

### 4. 全局对象
- global
- process
- Buffer
- __dirname
- __filename

## 基础语法

### 1. 变量声明
```javascript
// var（不推荐）
var name = 'Node.js';

// let（推荐）
let version = '18.0.0';

// const（推荐）
const PI = 3.14159;
```

### 2. 数据类型
```javascript
// 基本类型
let str = 'Hello';
let num = 42;
let bool = true;
let n = null;
let u = undefined;
let sym = Symbol('foo');

// 引用类型
let obj = { name: 'Node.js' };
let arr = [1, 2, 3];
let func = () => {};
```

### 3. 函数
```javascript
// 函数声明
function greet(name) {
  return `Hello, ${name}!`;
}

// 箭头函数
const greet = (name) => `Hello, ${name}!`;

// 异步函数
async function fetchData() {
  const data = await someAsyncOperation();
  return data;
}
```

## 异步编程

### 1. 回调函数
```javascript
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### 2. Promise
```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### 3. Async/Await
```javascript
async function getData() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error(error);
  }
}
```

## 错误处理

### 1. try-catch
```javascript
try {
  // 可能抛出错误的代码
  throw new Error('Something went wrong');
} catch (error) {
  console.error(error.message);
}
```

### 2. 错误事件
```javascript
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});
```

## 调试技巧

### 1. console 方法
```javascript
console.log('普通日志');
console.info('信息日志');
console.warn('警告日志');
console.error('错误日志');
console.debug('调试日志');
```

### 2. 调试器
```javascript
// 使用 debugger 语句
debugger;
```

### 3. Node.js 调试
```bash
# 使用 --inspect 启动调试
node --inspect app.js

# 使用 --inspect-brk 在代码第一行暂停
node --inspect-brk app.js
```

## 最佳实践

### 1. 代码风格
- 使用 ESLint 进行代码检查
- 遵循项目代码规范
- 使用 Prettier 格式化代码

### 2. 性能优化
- 避免同步操作
- 合理使用缓存
- 控制内存使用
- 优化循环和递归

### 3. 安全实践
- 验证用户输入
- 使用安全的依赖包
- 及时更新依赖
- 保护敏感信息

## 常见问题

### 1. 内存泄漏
- 避免全局变量
- 及时清理定时器
- 注意闭包使用
- 使用内存分析工具

### 2. 性能问题
- 使用性能分析工具
- 优化数据库查询
- 实现缓存机制
- 使用集群模式

### 3. 调试问题
- 使用日志记录
- 合理使用断点
- 分析错误堆栈
- 监控应用状态