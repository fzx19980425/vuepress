 # npm 包管理器

## npm 简介

npm (Node Package Manager) 是 Node.js 的包管理工具，用于安装、共享和管理项目依赖。

## 基础命令

### 1. 初始化项目
```bash
# 创建 package.json
npm init

# 使用默认配置快速创建
npm init -y
```

### 2. 安装依赖
```bash
# 安装生产依赖
npm install package-name
npm i package-name

# 安装开发依赖
npm install package-name --save-dev
npm i package-name -D

# 安装全局包
npm install package-name -g
npm i package-name -g

# 安装特定版本
npm install package-name@version
```

### 3. 更新依赖
```bash
# 更新所有依赖
npm update

# 更新特定包
npm update package-name

# 更新到最新版本
npm install package-name@latest
```

### 4. 删除依赖
```bash
# 删除依赖
npm uninstall package-name
npm rm package-name

# 删除全局包
npm uninstall -g package-name
```

## package.json

### 1. 基本配置
```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "项目描述",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 2. 依赖管理
```json
{
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^6.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.12",
    "jest": "^27.0.6"
  }
}
```

### 3. 版本控制
- ^: 兼容补丁和小版本更新
- ~: 只兼容补丁更新
- *: 接受任何版本
- 1.2.3: 固定版本

## npm 脚本

### 1. 常用脚本
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "webpack",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### 2. 脚本运行
```bash
# 运行脚本
npm run script-name

# 运行 start 脚本
npm start

# 运行 test 脚本
npm test
```

### 3. 脚本钩子
```json
{
  "scripts": {
    "prestart": "echo '准备启动'",
    "start": "node index.js",
    "poststart": "echo '启动完成'"
  }
}
```

## 包发布

### 1. 发布准备
```bash
# 登录 npm
npm login

# 检查包名是否可用
npm view package-name

# 更新版本号
npm version patch/minor/major
```

### 2. 发布包
```bash
# 发布包
npm publish

# 发布特定版本
npm publish --tag beta

# 取消发布
npm unpublish package-name
```

### 3. 私有包
```json
{
  "name": "@scope/package-name",
  "private": true,
  "publishConfig": {
    "access": "restricted"
  }
}
```

## 依赖管理

### 1. 依赖检查
```bash
# 检查过期依赖
npm outdated

# 检查安全漏洞
npm audit

# 修复安全漏洞
npm audit fix
```

### 2. 依赖锁定
```bash
# 生成 package-lock.json
npm install

# 使用 package-lock.json
npm ci
```

### 3. 依赖清理
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules

# 重新安装依赖
npm install
```

## 最佳实践

### 1. 依赖管理
- 使用 package-lock.json
- 定期更新依赖
- 检查安全漏洞
- 使用语义化版本

### 2. 脚本管理
- 使用有意义的脚本名
- 添加脚本说明
- 使用脚本钩子
- 保持脚本简洁

### 3. 发布管理
- 遵循语义化版本
- 编写清晰的文档
- 添加测试用例
- 使用 .npmignore

## 常见问题

### 1. 安装问题
- 网络问题
- 权限问题
- 版本冲突
- 依赖缺失

### 2. 发布问题
- 包名冲突
- 版本冲突
- 权限问题
- 发布失败

### 3. 依赖问题
- 循环依赖
- 版本不兼容
- 安全漏洞
- 性能问题

## 工具和资源

### 1. 替代工具
- yarn
- pnpm
- cnpm
- npm-cli

### 2. 开发工具
- npx
- npm-check
- npm-audit
- npm-run-all

### 3. 学习资源
- npm 官方文档
- npm 博客
- npm 社区
- GitHub 仓库