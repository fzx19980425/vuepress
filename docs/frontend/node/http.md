 # Node.js HTTP 模块

## HTTP 模块概述

Node.js 的 `http` 模块提供了创建 HTTP 服务器和客户端的功能。

## 创建 HTTP 服务器

### 1. 基本服务器
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000/');
});
```

### 2. 处理不同请求方法
```javascript
const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    case 'POST':
      handlePost(req, res);
      break;
    case 'PUT':
      handlePut(req, res);
      break;
    case 'DELETE':
      handleDelete(req, res);
      break;
    default:
      res.writeHead(405);
      res.end('方法不允许');
  }
});
```

### 3. 处理请求头
```javascript
const server = http.createServer((req, res) => {
  // 获取请求头
  const userAgent = req.headers['user-agent'];
  const contentType = req.headers['content-type'];

  // 设置响应头
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Custom-Header', 'Custom Value');

  res.end(JSON.stringify({ message: 'Hello' }));
});
```

## 处理请求数据

### 1. GET 请求参数
```javascript
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  
  console.log('查询参数:', query);
  res.end('参数已接收');
});
```

### 2. POST 请求数据
```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('接收到的数据:', data);
        res.end('数据已接收');
      } catch (err) {
        res.writeHead(400);
        res.end('无效的 JSON 数据');
      }
    });
  }
});
```

### 3. 文件上传
```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    const chunks = [];
    
    req.on('data', chunk => {
      chunks.push(chunk);
    });
    
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      // 处理文件数据
      res.end('文件上传成功');
    });
  }
});
```

## HTTP 客户端

### 1. 发送 GET 请求
```javascript
const http = require('http');

const options = {
  hostname: 'api.example.com',
  path: '/data',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应数据:', data);
  });
});

req.on('error', (err) => {
  console.error('请求错误:', err);
});

req.end();
```

### 2. 发送 POST 请求
```javascript
const data = JSON.stringify({
  name: 'John',
  age: 30
});

const options = {
  hostname: 'api.example.com',
  path: '/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  // 处理响应
});

req.write(data);
req.end();
```

### 3. 使用 https 模块
```javascript
const https = require('https');

const options = {
  hostname: 'api.example.com',
  path: '/secure-data',
  method: 'GET'
};

const req = https.request(options, (res) => {
  // 处理响应
});

req.end();
```

## 中间件和路由

### 1. 简单的路由系统
```javascript
const routes = {
  '/': (req, res) => {
    res.end('首页');
  },
  '/about': (req, res) => {
    res.end('关于我们');
  },
  '/api/users': (req, res) => {
    res.end(JSON.stringify({ users: [] }));
  }
};

const server = http.createServer((req, res) => {
  const handler = routes[req.url] || ((req, res) => {
    res.writeHead(404);
    res.end('页面未找到');
  });
  
  handler(req, res);
});
```

### 2. 中间件系统
```javascript
const middlewares = [];

function use(middleware) {
  middlewares.push(middleware);
}

function runMiddleware(req, res, index) {
  if (index < middlewares.length) {
    middlewares[index](req, res, () => {
      runMiddleware(req, res, index + 1);
    });
  }
}

const server = http.createServer((req, res) => {
  runMiddleware(req, res, 0);
});
```

## 错误处理

### 1. 服务器错误处理
```javascript
const server = http.createServer((req, res) => {
  try {
    // 处理请求
  } catch (err) {
    res.writeHead(500);
    res.end('服务器错误');
  }
});

server.on('error', (err) => {
  console.error('服务器错误:', err);
});
```

### 2. 客户端错误处理
```javascript
const req = http.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error('请求失败:', res.statusCode);
    return;
  }
  // 处理响应
});

req.on('error', (err) => {
  console.error('请求错误:', err);
});

req.on('timeout', () => {
  req.destroy();
  console.error('请求超时');
});
```

## 性能优化

### 1. 连接池
```javascript
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 10
});

const options = {
  hostname: 'api.example.com',
  agent: agent
};
```

### 2. 压缩
```javascript
const zlib = require('zlib');

const server = http.createServer((req, res) => {
  const acceptEncoding = req.headers['accept-encoding'];
  
  if (acceptEncoding && acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    const gzip = zlib.createGzip();
    res.pipe(gzip).pipe(res);
  } else {
    res.end('未压缩的响应');
  }
});
```

## 最佳实践

### 1. 安全性
- 使用 HTTPS
- 验证输入
- 设置安全头
- 限制请求大小

### 2. 性能
- 使用连接池
- 启用压缩
- 实现缓存
- 负载均衡

### 3. 可维护性
- 模块化代码
- 错误处理
- 日志记录
- 配置管理

## 常见问题

### 1. 连接问题
- 超时处理
- 重试机制
- 错误恢复
- 连接限制

### 2. 性能问题
- 内存泄漏
- 并发处理
- 响应时间
- 资源使用

### 3. 安全问题
- XSS 防护
- CSRF 防护
- 请求验证
- 数据加密

## 工具和资源

### 1. 相关模块
- https
- url
- querystring
- zlib

### 2. 开发工具
- Postman
- curl
- Chrome DevTools
- Node.js 调试器

### 3. 学习资源
- Node.js 文档
- HTTP 协议规范
- Web 安全指南
- 性能优化指南