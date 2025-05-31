 # Node.js 数据库操作

## 数据库概述

Node.js 支持多种数据库，包括关系型数据库（MySQL、PostgreSQL）和 NoSQL 数据库（MongoDB、Redis）。

## MySQL 数据库

### 1. 连接配置
```javascript
const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 使用 Promise
const promisePool = pool.promise();
```

### 2. 基本操作
```javascript
// 查询数据
async function getUsers() {
  try {
    const [rows] = await promisePool.query('SELECT * FROM users');
    return rows;
  } catch (err) {
    console.error('查询错误:', err);
    throw err;
  }
}

// 插入数据
async function createUser(user) {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [user.name, user.email]
    );
    return result.insertId;
  } catch (err) {
    console.error('插入错误:', err);
    throw err;
  }
}

// 更新数据
async function updateUser(id, user) {
  try {
    const [result] = await promisePool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [user.name, user.email, id]
    );
    return result.affectedRows;
  } catch (err) {
    console.error('更新错误:', err);
    throw err;
  }
}

// 删除数据
async function deleteUser(id) {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  } catch (err) {
    console.error('删除错误:', err);
    throw err;
  }
}
```

### 3. 事务处理
```javascript
async function transferMoney(fromId, toId, amount) {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromId]
    );

    await connection.query(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toId]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
```

## MongoDB 数据库

### 1. 连接配置
```javascript
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 连接事件
mongoose.connection.on('connected', () => {
  console.log('MongoDB 连接成功');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 连接错误:', err);
});
```

### 2. 模型定义
```javascript
// 用户模型
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
```

### 3. 基本操作
```javascript
// 创建文档
async function createUser(userData) {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (err) {
    console.error('创建用户错误:', err);
    throw err;
  }
}

// 查询文档
async function getUsers(query = {}) {
  try {
    const users = await User.find(query);
    return users;
  } catch (err) {
    console.error('查询用户错误:', err);
    throw err;
  }
}

// 更新文档
async function updateUser(id, updateData) {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    return user;
  } catch (err) {
    console.error('更新用户错误:', err);
    throw err;
  }
}

// 删除文档
async function deleteUser(id) {
  try {
    await User.findByIdAndDelete(id);
  } catch (err) {
    console.error('删除用户错误:', err);
    throw err;
  }
}
```

## Redis 数据库

### 1. 连接配置
```javascript
const redis = require('redis');

// 创建客户端
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// 连接事件
client.on('connect', () => {
  console.log('Redis 连接成功');
});

client.on('error', (err) => {
  console.error('Redis 错误:', err);
});
```

### 2. 基本操作
```javascript
// 设置值
async function setValue(key, value) {
  try {
    await client.set(key, value);
  } catch (err) {
    console.error('设置值错误:', err);
    throw err;
  }
}

// 获取值
async function getValue(key) {
  try {
    const value = await client.get(key);
    return value;
  } catch (err) {
    console.error('获取值错误:', err);
    throw err;
  }
}

// 设置过期时间
async function setWithExpiry(key, value, seconds) {
  try {
    await client.set(key, value, 'EX', seconds);
  } catch (err) {
    console.error('设置过期时间错误:', err);
    throw err;
  }
}
```

### 3. 高级操作
```javascript
// 发布订阅
const publisher = redis.createClient();
const subscriber = redis.createClient();

// 订阅频道
subscriber.subscribe('news');

subscriber.on('message', (channel, message) => {
  console.log(`收到消息: ${message} 来自频道: ${channel}`);
});

// 发布消息
publisher.publish('news', 'Hello World');

// 使用哈希表
async function setHash(key, field, value) {
  try {
    await client.hSet(key, field, value);
  } catch (err) {
    console.error('设置哈希表错误:', err);
    throw err;
  }
}

// 获取哈希表
async function getHash(key, field) {
  try {
    const value = await client.hGet(key, field);
    return value;
  } catch (err) {
    console.error('获取哈希表错误:', err);
    throw err;
  }
}
```

## 数据库最佳实践

### 1. 连接管理
- 使用连接池
- 处理连接错误
- 实现重连机制
- 监控连接状态

### 2. 查询优化
- 使用索引
- 优化查询语句
- 实现缓存
- 控制查询数量

### 3. 安全考虑
- 参数化查询
- 访问控制
- 数据加密
- 备份策略

## 常见问题

### 1. 性能问题
- 连接池配置
- 查询优化
- 索引使用
- 缓存策略

### 2. 并发问题
- 事务处理
- 锁机制
- 并发控制
- 数据一致性

### 3. 安全问题
- SQL 注入
- 数据泄露
- 权限控制
- 数据验证

## 工具和资源

### 1. 数据库工具
- MySQL Workbench
- MongoDB Compass
- Redis Desktop Manager
- Database GUI

### 2. 开发工具
- ORM 框架
- 查询构建器
- 数据库迁移工具
- 监控工具

### 3. 学习资源
- 数据库文档
- 性能优化指南
- 安全最佳实践
- 社区资源