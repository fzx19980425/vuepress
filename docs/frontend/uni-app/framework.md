# uni-app 框架规范

## 目录结构规范

### 标准目录结构

```
├── src
│   ├── pages                // 页面文件夹
│   │   ├── index           // 首页
│   │   └── user            // 用户相关页面
│   ├── components          // 组件文件夹
│   │   ├── common         // 公共组件
│   │   └── business       // 业务组件
│   ├── static             // 静态资源
│   │   ├── images        // 图片资源
│   │   └── styles        // 样式资源
│   ├── store              // 状态管理
│   │   ├── modules       // 状态模块
│   │   └── index.js      // 状态入口
│   ├── utils              // 工具函数
│   │   ├── request.js    // 请求封装
│   │   └── common.js     // 通用工具
│   ├── api                // 接口管理
│   │   ├── user.js       // 用户接口
│   │   └── common.js     // 公共接口
│   ├── styles             // 全局样式
│   │   ├── variables.scss // 样式变量
│   │   └── common.scss   // 公共样式
│   ├── App.vue            // 应用配置
│   ├── main.js            // 入口文件
│   ├── manifest.json      // 配置文件
│   └── pages.json         // 页面配置
├── package.json           // 项目依赖
└── README.md             // 项目说明
```

### 目录说明

1. **pages 目录**
   - 按功能模块划分目录
   - 每个页面一个目录
   - 包含页面相关资源

2. **components 目录**
   - common：可复用的公共组件
   - business：业务相关组件
   - 按功能模块划分子目录

3. **static 目录**
   - images：图片资源
   - styles：样式资源
   - 其他静态资源

4. **store 目录**
   - modules：按模块划分状态
   - index.js：状态管理入口

5. **utils 目录**
   - 通用工具函数
   - 请求封装
   - 业务工具函数

6. **api 目录**
   - 按模块划分接口
   - 统一接口管理
   - 接口文档注释

## 开发规范

### 命名规范

1. **文件命名**
   - 页面文件：小写字母，中划线分隔
   - 组件文件：大驼峰命名
   - 工具文件：小驼峰命名
   ```
   pages/user/user-profile.vue
   components/UserAvatar.vue
   utils/formatDate.js
   ```

2. **变量命名**
   - 普通变量：小驼峰命名
   - 常量：大写字母，下划线分隔
   - 组件名：大驼峰命名
   ```js
   const userName = 'John'
   const MAX_COUNT = 100
   const UserList = {}
   ```

3. **样式命名**
   - 类名：小写字母，中划线分隔
   - BEM 命名规范
   ```css
   .user-card {}
   .user-card__title {}
   .user-card--active {}
   ```

### 代码规范

1. **Vue 组件规范**
   ```vue
   <template>
     <!-- 模板结构清晰，适当缩进 -->
     <view class="component-name">
       <slot></slot>
     </view>
   </template>

   <script>
   // 组件选项顺序
   export default {
     name: 'ComponentName',
     components: {},
     props: {},
     data() {
       return {}
     },
     computed: {},
     watch: {},
     created() {},
     mounted() {},
     methods: {}
   }
   </script>

   <style lang="scss" scoped>
   // 样式使用 scoped
   .component-name {
     // 样式规则
   }
   </style>
   ```

2. **JavaScript 规范**
   ```js
   // 使用 const/let 声明变量
   const name = 'John'
   let age = 18

   // 使用箭头函数
   const getData = async () => {
     try {
       const res = await request()
       return res.data
     } catch (error) {
       console.error(error)
     }
   }

   // 使用解构赋值
   const { name, age } = user
   ```

3. **CSS 规范**
   ```scss
   // 使用 SCSS 变量
   $primary-color: #007AFF;
   $font-size-base: 28rpx;

   // 使用嵌套语法
   .container {
     padding: 20rpx;
     
     &__header {
       font-size: $font-size-base;
     }
     
     &--active {
       background-color: $primary-color;
     }
   }
   ```

### 注释规范

1. **文件注释**
   ```js
   /**
    * @description 用户相关接口
    * @author 作者
    * @date 2024-01-01
    */
   ```

2. **函数注释**
   ```js
   /**
    * 获取用户信息
    * @param {string} userId - 用户ID
    * @returns {Promise} 用户信息
    */
   const getUserInfo = async (userId) => {
     // 函数实现
   }
   ```

3. **组件注释**
   ```vue
   <!--
    * @description 用户头像组件
    * @props {string} avatar - 头像地址
    * @props {string} size - 头像大小
    -->
   ```

## 开发流程

### 开发准备

1. **环境配置**
   - 安装开发工具
   - 配置编辑器
   - 安装必要插件

2. **项目初始化**
   - 创建项目
   - 安装依赖
   - 配置开发环境

3. **规范配置**
   - ESLint 配置
   - Prettier 配置
   - Git 配置

### 开发流程

1. **功能开发**
   - 创建功能分支
   - 编写代码
   - 本地测试

2. **代码审查**
   - 代码规范检查
   - 功能测试
   - 性能检查

3. **提交规范**
   ```
   feat: 添加新功能
   fix: 修复问题
   docs: 修改文档
   style: 修改格式
   refactor: 代码重构
   test: 添加测试
   chore: 修改构建过程
   ```

### 发布流程

1. **版本管理**
   - 遵循语义化版本
   - 维护更新日志
   - 版本号规范

2. **打包发布**
   - 环境配置
   - 打包测试
   - 发布部署

3. **文档更新**
   - 更新接口文档
   - 更新使用说明
   - 更新版本日志

## 最佳实践

### 性能优化

1. **代码优化**
   - 合理使用组件
   - 避免不必要的渲染
   - 优化数据结构

2. **资源优化**
   - 图片压缩
   - 代码分割
   - 按需加载

3. **缓存优化**
   - 合理使用缓存
   - 数据预加载
   - 状态管理优化

### 安全规范

1. **数据安全**
   - 敏感数据加密
   - 数据脱敏
   - 权限控制

2. **请求安全**
   - 请求加密
   - 参数验证
   - 防重放攻击

3. **存储安全**
   - 本地存储加密
   - 定期清理
   - 安全存储

### 兼容性处理

1. **平台兼容**
   - 条件编译
   - 平台差异处理
   - 降级方案

2. **版本兼容**
   - 版本检测
   - 兼容性处理
   - 提示更新

3. **设备兼容**
   - 屏幕适配
   - 系统适配
   - 性能适配

## 工具推荐

### 开发工具

1. **编辑器**
   - HBuilderX
   - VS Code
   - WebStorm

2. **调试工具**
   - Vue Devtools
   - 微信开发者工具
   - 浏览器调试工具

3. **构建工具**
   - webpack
   - vite
   - rollup

### 插件推荐

1. **编辑器插件**
   - uni-app-snippets
   - ESLint
   - Prettier

2. **开发插件**
   - uView UI
   - uni-ui
   - uni-app-plus

3. **调试插件**
   - vconsole
   - eruda
   - spy-debugger

## 常见问题

### 开发问题

1. **环境问题**
   - 开发环境配置
   - 依赖安装问题
   - 编译错误处理

2. **兼容问题**
   - 平台差异处理
   - 版本兼容问题
   - 设备适配问题

3. **性能问题**
   - 页面加载优化
   - 渲染性能优化
   - 内存泄漏处理

### 解决方案

1. **问题排查**
   - 日志分析
   - 性能分析
   - 代码审查

2. **优化方案**
   - 代码重构
   - 架构优化
   - 性能调优

3. **预防措施**
   - 规范制定
   - 代码审查
   - 自动化测试 