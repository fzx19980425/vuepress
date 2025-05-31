 # Node.js 模块系统

## 模块系统概述

Node.js 使用模块系统来组织代码，主要有两种模块系统：
- CommonJS 模块系统（默认）
- ES Modules（ECMAScript 模块）

## CommonJS 模块

### 1. 模块定义
```javascript
// math.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

// 导出模块
module.exports = {
  add,
  subtract
};

// 或者使用 exports
exports.add = add;
exports.subtract = subtract;
```

### 2. 模块导入
```javascript
// 导入整个模块
const math = require('./math');

// 使用模块方法
console.log(math.add(1, 2));
console.log(math.subtract(5, 3));

// 解构导入
const { add, subtract } = require('./math');
```

### 3. 模块缓存
- 模块首次加载时会被缓存
- 后续的 require() 调用会返回缓存的模块
- 可以通过 require.cache 查看缓存

## ES Modules

### 1. 模块定义
```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 默认导出
export default {
  add,
  subtract
};
```

### 2. 模块导入
```javascript
// 命名导入
import { add, subtract } from './math.js';

// 默认导入
import math from './math.js';

// 混合导入
import math, { add, subtract } from './math.js';
```

### 3. 使用 ES Modules
```json
// package.json
{
  "type": "module"
}
```

## 模块加载机制

### 1. 模块查找顺序
1. 核心模块
2. 文件模块
3. node_modules 目录
4. 父目录的 node_modules
5. 全局安装的模块

### 2. 文件扩展名
- .js
- .json
- .node
- .mjs（ES Modules）
- .cjs（CommonJS）

### 3. 目录模块
- package.json 的 main 字段
- index.js
- index.json
- index.node

## 核心模块

### 1. 内置模块
```javascript
const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');
const crypto = require('crypto');
```

### 2. 模块路径
```javascript
// 相对路径
const localModule = require('./local');

// 绝对路径
const absoluteModule = require('/absolute/path');

// 模块名称
const npmModule = require('express');
```

## 模块开发最佳实践

### 1. 模块设计原则
- 单一职责
- 高内聚低耦合
- 接口清晰
- 文档完善

### 2. 错误处理
```javascript
// 模块内部错误处理
try {
  // 模块代码
} catch (error) {
  // 错误处理
  module.exports = {
    error: error.message
  };
}
```

### 3. 性能优化
- 合理使用缓存
- 避免循环依赖
- 按需加载
- 控制模块大小

## 常见问题

### 1. 循环依赖
- 避免循环依赖
- 使用依赖注入
- 重构模块结构
- 使用事件机制

### 2. 模块兼容性
- 处理不同模块系统
- 使用条件导出
- 提供兼容层
- 版本管理

### 3. 调试技巧
- 使用 require.resolve
- 查看模块缓存
- 分析依赖树
- 使用调试工具

## 工具和资源

### 1. 开发工具
- npm
- yarn
- pnpm
- npx

### 2. 调试工具
- node --inspect
- VS Code 调试器
- Chrome DevTools
- Node.js 调试器

### 3. 学习资源
- Node.js 官方文档
- npm 文档
- Node.js 最佳实践
- 社区资源