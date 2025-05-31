 # Express 框架

## Express 简介

Express 是一个基于 Node.js 的 Web 应用框架，提供了一系列强大的特性，帮助创建各种 Web 应用。

## 基础使用

### 1. 安装和配置
```bash
# 安装 Express
npm install express

# 创建应用
const express = require('express');
const app = express();
const port = 3000;

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
```

### 2. 基本路由
```javascript
// GET 请求
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// POST 请求
app.post('/users', (req, res) => {
  res.send('创建用户');
});

// 带参数的路由
app.get('/users/:id', (req, res) => {
  res.send(`用户 ID: ${req.params.id}`);
});

// 多个处理函数
app.get('/example', 
  (req, res, next) => {
    console.log('第一个处理函数');
    next();
  },
  (req, res) => {
    res.send('第二个处理函数');
  }
);
```

### 3. 中间件
```javascript
// 应用级中间件
app.use((req, res, next) => {
  console.log('请求时间:', Date.now());
  next();
});

// 路由级中间件
app.use('/user/:id', (req, res, next) => {
  console.log('请求类型:', req.method);
  next();
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器错误!');
});
```

## 请求处理

### 1. 请求参数
```javascript
// 查询字符串
app.get('/search', (req, res) => {
  const query = req.query;
  res.json(query);
});

// URL 参数
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`用户 ID: ${userId}`);
});

// 请求体
app.use(express.json());
app.post('/users', (req, res) => {
  const userData = req.body;
  res.json(userData);
});
```

### 2. 文件上传
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 单文件上传
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('文件上传成功');
});

// 多文件上传
app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
  res.send('多个文件上传成功');
});
```

### 3. 静态文件
```javascript
// 提供静态文件
app.use(express.static('public'));

// 虚拟路径
app.use('/static', express.static('public'));

// 多个静态目录
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
```

## 响应处理

### 1. 发送响应
```javascript
// 发送文本
app.get('/text', (req, res) => {
  res.send('Hello World');
});

// 发送 JSON
app.get('/json', (req, res) => {
  res.json({ message: 'Hello World' });
});

// 发送文件
app.get('/file', (req, res) => {
  res.sendFile('/path/to/file.pdf');
});

// 设置状态码
app.get('/status', (req, res) => {
  res.status(404).send('页面未找到');
});
```

### 2. 响应头
```javascript
app.get('/headers', (req, res) => {
  res.set({
    'Content-Type': 'text/plain',
    'Content-Length': '123',
    'ETag': '12345'
  });
  res.send('Hello World');
});
```

### 3. Cookie 处理
```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// 设置 Cookie
app.get('/set-cookie', (req, res) => {
  res.cookie('name', 'value', {
    maxAge: 900000,
    httpOnly: true
  });
  res.send('Cookie 已设置');
});

// 读取 Cookie
app.get('/get-cookie', (req, res) => {
  const name = req.cookies.name;
  res.send(`Cookie 值: ${name}`);
});
```

## 路由管理

### 1. 路由模块化
```javascript
// routes/users.js
const router = express.Router();

router.get('/', (req, res) => {
  res.send('用户列表');
});

router.post('/', (req, res) => {
  res.send('创建用户');
});

module.exports = router;

// app.js
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

### 2. 路由参数
```javascript
// 路由参数验证
app.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).send('无效的 ID');
  }
  next();
});

app.get('/users/:id', (req, res) => {
  res.send(`用户 ID: ${req.params.id}`);
});
```

### 3. 路由中间件
```javascript
// 验证中间件
const auth = (req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send('需要认证');
  }
};

// 使用中间件
app.get('/protected', auth, (req, res) => {
  res.send('受保护的路由');
});
```

## 模板引擎

### 1. 设置模板引擎
```javascript
// 设置 EJS 模板引擎
app.set('view engine', 'ejs');
app.set('views', './views');

// 渲染模板
app.get('/template', (req, res) => {
  res.render('index', {
    title: 'Express 应用',
    message: 'Hello World'
  });
});
```

### 2. 模板语法
```ejs
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1><%= message %></h1>
  <% if (user) { %>
    <p>欢迎, <%= user.name %></p>
  <% } %>
</body>
</html>
```

## 错误处理

### 1. 错误中间件
```javascript
// 404 处理
app.use((req, res, next) => {
  res.status(404).send('页面未找到');
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器错误');
});
```

### 2. 异步错误处理
```javascript
// 使用 async/await
app.get('/async', async (req, res, next) => {
  try {
    const data = await someAsyncOperation();
    res.json(data);
  } catch (err) {
    next(err);
  }
});
```

## 安全实践

### 1. 基本安全
```javascript
const helmet = require('helmet');
app.use(helmet());

// CORS 设置
const cors = require('cors');
app.use(cors({
  origin: 'http://example.com'
}));

// 速率限制
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

### 2. 认证和授权
```javascript
const jwt = require('jsonwebtoken');

// JWT 中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('需要认证');
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('无效的令牌');
  }
};

app.use('/api', authenticate);
```

## 最佳实践

### 1. 项目结构
```
project/
  ├── bin/
  │   └── www
  ├── config/
  │   └── database.js
  ├── controllers/
  │   └── userController.js
  ├── models/
  │   └── user.js
  ├── routes/
  │   └── users.js
  ├── views/
  │   └── index.ejs
  ├── public/
  │   ├── css/
  │   └── js/
  ├── app.js
  └── package.json
```

### 2. 开发规范
- 使用环境变量
- 实现日志记录
- 使用 TypeScript
- 编写单元测试

### 3. 性能优化
- 使用压缩
- 实现缓存
- 优化数据库查询
- 使用集群模式

## 常见问题

### 1. 性能问题
- 内存泄漏
- 响应时间慢
- 并发处理
- 数据库连接

### 2. 安全问题
- XSS 攻击
- CSRF 攻击
- SQL 注入
- 文件上传

### 3. 部署问题
- 进程管理
- 负载均衡
- 日志管理
- 监控告警

## 工具和资源

### 1. 常用中间件
- body-parser
- cookie-parser
- cors
- helmet
- morgan

### 2. 开发工具
- nodemon
- Postman
- VS Code
- Chrome DevTools

### 3. 学习资源
- Express 官方文档
- Express 最佳实践
- Express 安全指南
- Express 性能优化