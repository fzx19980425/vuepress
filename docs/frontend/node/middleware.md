 # Express 中间件开发

## 中间件概述

中间件是 Express 应用中处理请求和响应的函数，可以访问请求对象（req）、响应对象（res）和下一个中间件函数（next）。

## 中间件类型

### 1. 应用级中间件
```javascript
const express = require('express');
const app = express();

// 无路径的中间件
app.use((req, res, next) => {
  console.log('时间:', Date.now());
  next();
});

// 带路径的中间件
app.use('/user/:id', (req, res, next) => {
  console.log('请求类型:', req.method);
  next();
});

// 多个中间件
app.use('/user/:id',
  (req, res, next) => {
    console.log('第一个中间件');
    next();
  },
  (req, res, next) => {
    console.log('第二个中间件');
    next();
  }
);
```

### 2. 路由级中间件
```javascript
const router = express.Router();

// 路由中间件
router.use((req, res, next) => {
  console.log('路由中间件');
  next();
});

// 特定路由的中间件
router.get('/user/:id', (req, res, next) => {
  console.log('用户路由中间件');
  next();
});

app.use('/api', router);
```

### 3. 错误处理中间件
```javascript
// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器错误!');
});

// 异步错误处理
app.use(async (err, req, res, next) => {
  try {
    await someAsyncOperation();
    next();
  } catch (err) {
    next(err);
  }
});
```

## 常用中间件

### 1. 日志中间件
```javascript
// 自定义日志中间件
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

// 使用 morgan
const morgan = require('morgan');
app.use(morgan('combined'));

// 自定义日志格式
morgan.token('custom', (req, res) => {
  return `${req.method} ${req.url}`;
});
app.use(morgan(':custom :response-time ms'));
```

### 2. 认证中间件
```javascript
// JWT 认证中间件
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: '需要认证' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: '无效的令牌' });
  }
};

// 角色验证中间件
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '权限不足' });
    }
    next();
  };
};
```

### 3. 请求处理中间件
```javascript
// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 文件上传
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// CORS 中间件
const cors = require('cors');
app.use(cors({
  origin: 'http://example.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 自定义中间件

### 1. 请求验证中间件
```javascript
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

// 使用示例
const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required()
});

app.post('/users', validateRequest(userSchema), (req, res) => {
  // 处理请求
});
```

### 2. 响应处理中间件
```javascript
// 响应格式化中间件
const responseFormatter = (req, res, next) => {
  res.success = (data) => {
    res.json({
      success: true,
      data
    });
  };

  res.error = (message, code = 400) => {
    res.status(code).json({
      success: false,
      message
    });
  };

  next();
};

// 使用示例
app.use(responseFormatter);
app.get('/api/users', (req, res) => {
  res.success({ users: [] });
});
```

### 3. 缓存中间件
```javascript
const cache = {};

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    
    if (cache[key]) {
      return res.json(cache[key]);
    }

    res.sendResponse = res.json;
    res.json = (body) => {
      cache[key] = body;
      setTimeout(() => {
        delete cache[key];
      }, duration * 1000);
      res.sendResponse(body);
    };
    
    next();
  };
};

// 使用示例
app.get('/api/data', cacheMiddleware(60), (req, res) => {
  // 处理请求
});
```

## 中间件链

### 1. 中间件组合
```javascript
// 组合多个中间件
const combineMiddleware = (...middlewares) => {
  return (req, res, next) => {
    const runMiddleware = (index) => {
      if (index === middlewares.length) {
        return next();
      }
      middlewares[index](req, res, (err) => {
        if (err) {
          return next(err);
        }
        runMiddleware(index + 1);
      });
    };
    runMiddleware(0);
  };
};

// 使用示例
app.use(combineMiddleware(
  logger,
  authMiddleware,
  cors()
));
```

### 2. 条件中间件
```javascript
// 条件执行中间件
const conditionalMiddleware = (condition, middleware) => {
  return (req, res, next) => {
    if (condition(req)) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
};

// 使用示例
app.use(conditionalMiddleware(
  (req) => req.path.startsWith('/api'),
  authMiddleware
));
```

## 最佳实践

### 1. 中间件设计原则
- 单一职责
- 可重用性
- 可配置性
- 错误处理

### 2. 性能优化
- 避免阻塞操作
- 使用异步操作
- 实现缓存
- 控制中间件数量

### 3. 安全考虑
- 输入验证
- 错误处理
- 权限控制
- 资源限制

## 常见问题

### 1. 中间件顺序
- 中间件执行顺序
- 中间件依赖关系
- 中间件冲突
- 中间件性能

### 2. 错误处理
- 异步错误
- 错误传播
- 错误恢复
- 错误日志

### 3. 调试问题
- 中间件调试
- 性能分析
- 内存泄漏
- 并发问题

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
- Express 文档
- 中间件开发指南
- 最佳实践
- 安全指南