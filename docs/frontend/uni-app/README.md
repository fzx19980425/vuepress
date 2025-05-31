# uni-app 文档

欢迎来到 uni-app 文档！这里包含了 uni-app 开发所需的各种知识和最佳实践。

## 文档结构

### 基础部分
- [基础教程](./basic.md)：uni-app 的核心概念和基本用法
- [框架规范](./framework.md)：框架规范、目录结构、开发规范
- [生命周期](./lifecycle.md)：应用生命周期、页面生命周期、组件生命周期

### 进阶部分
- [组件开发](./components.md)：内置组件、自定义组件、组件通信
- [路由管理](./router.md)：页面路由、页面跳转、路由拦截
- [状态管理](./state-management.md)：Vuex/Pinia、数据缓存、全局状态

### 平台特性
- [条件编译](./platform.md)：平台差异、条件编译、平台兼容
- [原生能力](./native.md)：原生插件、原生组件、原生API
- [性能优化](./performance.md)：启动优化、渲染优化、包体积优化

### 工程化
- [项目配置](./config.md)：manifest.json、pages.json、vue.config.js
- [打包发布](./deploy.md)：HBuilderX、CLI、云打包
- [测试调试](./testing.md)：调试工具、真机调试、性能分析

## uni-app 简介

## 什么是 uni-app

uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。

## 框架特点

1. **跨平台**
   - 一套代码，多端运行
   - 支持 iOS、Android、H5、以及各种小程序平台
   - 条件编译，灵活适配不同平台

2. **开发规范**
   - 基于 Vue.js 开发
   - 遵循 Vue 单文件组件规范
   - 支持 Vue 2 和 Vue 3
   - 支持 TypeScript

3. **性能优化**
   - 内置组件和 API 性能优化
   - 支持原生渲染
   - 支持小程序分包
   - 支持按需引入

4. **开发效率**
   - 丰富的组件库
   - 完善的开发工具
   - 丰富的插件生态
   - 详细的开发文档

## 技术架构

### 1. 框架结构
```
├── pages                // 页面文件夹
├── static              // 静态资源
├── components          // 组件文件夹
├── store               // Vuex 状态管理
├── utils               // 工具函数
├── pages.json          // 全局配置
├── manifest.json       // 应用配置
└── App.vue            // 应用入口
```

### 2. 开发模式
- 基于 Vue.js 的开发模式
- 支持 Vue 2 和 Vue 3 语法
- 支持 TypeScript
- 支持 Sass、Less 等预处理器
- 支持 npm 包管理

### 3. 运行机制
- 编译时：将 Vue 文件编译为各平台可运行的代码
- 运行时：在各平台运行编译后的代码
- 条件编译：根据平台特性进行差异化处理

## 开发环境

### 1. 开发工具
- HBuilderX（推荐）
- VS Code + uni-app 插件
- WebStorm + uni-app 插件

### 2. 环境要求
- Node.js 12.0 以上
- HBuilderX 3.0 以上
- 各平台开发者工具

### 3. 开发流程
1. 安装开发工具
2. 创建项目
3. 开发调试
4. 发布部署

## 快速开始

### 1. 安装 HBuilderX
```bash
# 下载 HBuilderX
https://www.dcloud.io/hbuilderx.html
```

### 2. 创建项目
```bash
# 使用 HBuilderX 可视化界面创建
# 或使用命令行创建
vue create -p dcloudio/uni-preset-vue my-project
```

### 3. 运行项目
```bash
# 运行到浏览器
npm run dev:h5

# 运行到小程序
npm run dev:mp-weixin

# 运行到 App
npm run dev:app
```

### 4. 发布项目
```bash
# 发布 H5
npm run build:h5

# 发布小程序
npm run build:mp-weixin

# 发布 App
npm run build:app
```

## 学习路线

1. **基础入门**
   - 环境搭建
   - 项目创建
   - 基础语法
   - 生命周期
   - 组件使用

2. **进阶开发**
   - 组件开发
   - 路由管理
   - 状态管理
   - 网络请求
   - 数据存储

3. **高级特性**
   - 性能优化
   - 原生插件
   - 条件编译
   - 跨端适配
   - 发布部署

## 相关资源

1. [官方文档](https://uniapp.dcloud.io/)
2. [插件市场](https://ext.dcloud.net.cn/)
3. [示例项目](https://github.com/dcloudio/uni-app)
4. [社区论坛](https://ask.dcloud.net.cn/)
5. [视频教程](https://ke.qq.com/course/3169971)

## 注意事项

1. **开发建议**
   - 遵循 Vue 开发规范
   - 合理使用条件编译
   - 注意跨端兼容性
   - 重视性能优化

2. **常见问题**
   - 平台差异处理
   - 组件兼容性
   - 样式适配
   - 性能优化

3. **最佳实践**
   - 项目结构规范
   - 代码风格统一
   - 组件复用
   - 性能监控

## 贡献指南

欢迎对本文档进行补充和完善，您可以通过以下方式参与：

1. 提交 Issue 报告问题
2. 提交 Pull Request 改进文档
3. 分享您的使用经验
4. 提供更好的示例代码 