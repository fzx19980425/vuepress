 # Electron 项目结构指南

## 标准项目结构

```
my-electron-app/
├── src/                    # 源代码目录
│   ├── main/              # 主进程代码
│   │   ├── index.js       # 主进程入口文件
│   │   ├── ipc/           # IPC 通信相关
│   │   ├── services/      # 主进程服务
│   │   └── utils/         # 工具函数
│   ├── renderer/          # 渲染进程代码
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 通用组件
│   │   ├── assets/        # 静态资源
│   │   ├── styles/        # 样式文件
│   │   └── utils/         # 工具函数
│   └── preload/           # 预加载脚本
│       └── index.js       # 预加载入口文件
├── config/                # 配置文件
│   ├── webpack.config.js  # Webpack 配置
│   └── electron-builder.js # 打包配置
├── scripts/               # 构建脚本
├── tests/                 # 测试文件
├── dist/                  # 构建输出目录
├── package.json           # 项目配置
├── .gitignore            # Git 忽略文件
└── README.md             # 项目说明
```

## 目录说明

### 1. src 目录

#### 1.1 main 目录
- **index.js**: 主进程入口文件，负责创建窗口和管理应用生命周期
- **ipc/**: 存放 IPC 通信相关的处理函数
- **services/**: 主进程服务，如系统托盘、菜单等
- **utils/**: 主进程工具函数

#### 1.2 renderer 目录
- **pages/**: 页面级组件
- **components/**: 可复用的组件
- **assets/**: 图片、字体等静态资源
- **styles/**: CSS/SCSS 样式文件
- **utils/**: 渲染进程工具函数

#### 1.3 preload 目录
- **index.js**: 预加载脚本，用于安全地暴露主进程功能给渲染进程

### 2. config 目录
- **webpack.config.js**: Webpack 构建配置
- **electron-builder.js**: Electron 打包配置

### 3. scripts 目录
存放各种构建、开发脚本

### 4. tests 目录
单元测试和集成测试文件

### 5. dist 目录
构建后的文件输出目录

## 文件命名规范

### 1. 主进程文件
- 使用小写字母
- 多个单词用连字符（-）连接
- 例如：`window-manager.js`, `ipc-handler.js`

### 2. 渲染进程文件
- 组件文件使用 PascalCase
- 工具函数使用 camelCase
- 例如：`MainWindow.vue`, `utils.js`

### 3. 配置文件
- 使用小写字母
- 多个单词用点（.）连接
- 例如：`webpack.config.js`, `babel.config.js`

## 代码组织最佳实践

### 1. 模块化
- 使用 ES 模块系统
- 每个文件只负责一个功能
- 避免循环依赖

### 2. 依赖管理
- 使用 package.json 管理依赖
- 区分开发依赖和生产依赖
- 定期更新依赖版本

### 3. 资源管理
- 静态资源放在 assets 目录
- 使用相对路径引用资源
- 考虑资源压缩和优化

### 4. 配置管理
- 环境变量使用 .env 文件
- 敏感信息使用环境变量
- 区分开发和生产配置

## 项目模板推荐

### 1. 基础模板
- [electron-quick-start](https://github.com/electron/electron-quick-start)
- [electron-vue](https://github.com/SimulatedGREG/electron-vue)

### 2. 完整模板
- [electron-forge](https://www.electronforge.io/)
- [electron-builder](https://www.electron.build/)

## 注意事项

### 1. 安全性
- 使用 contextIsolation
- 禁用 nodeIntegration
- 使用 CSP 策略

### 2. 性能
- 合理组织代码结构
- 避免不必要的依赖
- 优化资源加载

### 3. 可维护性
- 保持目录结构清晰
- 遵循命名规范
- 添加必要的注释

## 相关资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Electron 最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [项目结构示例](https://github.com/electron/electron-quick-start)