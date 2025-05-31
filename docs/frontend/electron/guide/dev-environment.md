 # Electron 开发环境配置

## 环境要求

### 系统要求
- Windows 7 及以上版本
- macOS 10.11 及以上版本
- Linux (Ubuntu 18.04 及以上版本)

### 必需软件
- Node.js (推荐 v16.x 或更高版本)
- npm (v7.x 或更高版本) 或 yarn (v1.22.x 或更高版本)
- Git
- 代码编辑器 (推荐 VS Code)

## 开发工具配置

### VS Code 配置
1. 推荐安装的扩展：
   - ESLint
   - Prettier
   - Debugger for Chrome
   - Electron Builder
   - GitLens

2. 推荐的 VS Code 设置：
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### 开发工具链
1. 包管理工具
   - 推荐使用 pnpm 或 yarn
   - 配置镜像源加速下载：
     ```bash
     # 使用淘宝镜像
     npm config set registry https://registry.npmmirror.com
     # 或使用 yarn
     yarn config set registry https://registry.npmmirror.com
     ```

2. 构建工具
   - 推荐使用 electron-builder 或 electron-forge
   - 配置示例：
     ```json
     {
       "build": {
         "appId": "com.your-app.id",
         "productName": "Your App Name",
         "directories": {
           "output": "dist"
         },
         "win": {
           "target": ["nsis"]
         },
         "mac": {
           "target": ["dmg"]
         },
         "linux": {
           "target": ["AppImage"]
         }
       }
     }
     ```

## 项目初始化

### 创建新项目
1. 使用官方模板：
   ```bash
   # 使用 electron-forge
   npx create-electron-app my-app
   
   # 或使用 electron-quick-start
   git clone https://github.com/electron/electron-quick-start my-app
   cd my-app
   npm install
   ```

2. 手动创建项目：
   ```bash
   mkdir my-electron-app
   cd my-electron-app
   npm init -y
   npm install electron --save-dev
   ```

### 项目结构
推荐的项目结构：
```
my-electron-app/
├── src/
│   ├── main/           # 主进程代码
│   │   ├── index.ts    # 主进程入口
│   │   └── ipc/        # IPC 通信模块
│   ├── renderer/       # 渲染进程代码
│   │   ├── index.html  # 主窗口 HTML
│   │   └── app/        # 渲染进程应用代码
│   └── preload/        # 预加载脚本
├── scripts/            # 构建脚本
├── config/             # 配置文件
├── assets/            # 静态资源
├── package.json
└── tsconfig.json
```

## 开发流程

### 本地开发
1. 启动开发服务器：
   ```bash
   # 启动主进程和渲染进程
   npm run dev
   
   # 或分别启动
   npm run dev:main    # 启动主进程
   npm run dev:renderer # 启动渲染进程
   ```

2. 热重载配置：
   ```javascript
   // main/index.ts
   if (process.env.NODE_ENV === 'development') {
     require('electron-reload')(__dirname, {
       electron: path.join(__dirname, '../node_modules/.bin/electron'),
       hardResetMethod: 'exit'
     });
   }
   ```

### 调试配置
1. 主进程调试：
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
         "outputCapture": "std"
       }
     ]
   }
   ```

2. 渲染进程调试：
   - 使用 Chrome DevTools
   - 配置 source map
   - 使用 Vue DevTools 或 React Developer Tools

## 环境变量配置

### 开发环境变量
创建 `.env.development` 文件：
```env
NODE_ENV=development
ELECTRON_START_URL=http://localhost:3000
API_BASE_URL=http://localhost:8080
```

### 生产环境变量
创建 `.env.production` 文件：
```env
NODE_ENV=production
ELECTRON_START_URL=file://${__dirname}/index.html
API_BASE_URL=https://api.your-app.com
```

## 常见问题

### 1. 依赖安装问题
- 问题：electron 下载慢
- 解决：使用淘宝镜像或设置 ELECTRON_MIRROR 环境变量
  ```bash
  export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
  ```

### 2. 编译问题
- 问题：node-gyp 编译失败
- 解决：
  1. 安装编译工具
     ```bash
     # Windows
     npm install --global windows-build-tools
     
     # macOS
     xcode-select --install
     
     # Linux
     sudo apt-get install build-essential
     ```
  2. 清除缓存重新安装
     ```bash
     npm cache clean --force
     rm -rf node_modules
     npm install
     ```

### 3. 开发工具问题
- 问题：VS Code 调试配置不生效
- 解决：
  1. 确保 launch.json 配置正确
  2. 检查端口是否被占用
  3. 重启 VS Code 和调试会话

## 最佳实践

1. 使用 TypeScript
   - 提供更好的类型检查
   - 改善代码可维护性
   - 提供更好的 IDE 支持

2. 使用 ESLint 和 Prettier
   - 统一代码风格
   - 自动格式化代码
   - 提前发现潜在问题

3. 使用 Git 工作流
   - 遵循 Git Flow 或 GitHub Flow
   - 使用语义化版本号
   - 编写清晰的提交信息

4. 文档管理
   - 使用 README.md 记录项目信息
   - 使用 JSDoc 注释代码
   - 维护更新日志

## 相关资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [VS Code 文档](https://code.visualstudio.com/docs)
- [Node.js 文档](https://nodejs.org/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)