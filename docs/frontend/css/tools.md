# CSS工具资源

本文档收集了CSS开发中常用的工具和资源，包括开发工具、调试工具、性能优化工具等。

## 开发工具

### 1. 编辑器插件
- **VS Code插件**
  - CSS Peek：快速查看CSS定义
  - CSS Navigation：CSS导航
  - IntelliSense for CSS：CSS智能提示
  - CSS Modules：CSS模块支持
  - PostCSS Language Support：PostCSS支持
  - Color Highlight：颜色高亮
  - CSS-in-JS：CSS-in-JS支持

- **Sublime Text插件**
  - CSS3：CSS3语法支持
  - ColorPicker：颜色选择器
  - CSS Format：CSS格式化
  - CSS Snippets：CSS代码片段

- **WebStorm/PhpStorm**
  - 内置CSS支持
  - 实时预览
  - 代码补全
  - 重构工具

### 2. 构建工具
- **PostCSS插件**
  ```javascript
  // postcss.config.js
  module.exports = {
    plugins: [
      require('autoprefixer'),
      require('postcss-preset-env'),
      require('cssnano'),
      require('postcss-import'),
      require('postcss-nested')
    ]
  }
  ```

- **Webpack配置**
  ```javascript
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        }
      ]
    }
  }
  ```

- **Vite配置**
  ```javascript
  // vite.config.js
  export default {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    }
  }
  ```

### 3. 预处理器工具
- **Sass工具**
  - Sassmeister：在线Sass编辑器
  - node-sass：Node.js Sass编译器
  - sass-loader：Webpack Sass加载器
  - SassDoc：Sass文档生成器

- **Less工具**
  - Less.js：Less编译器
  - less-loader：Webpack Less加载器
  - LessDoc：Less文档生成器

- **Stylus工具**
  - stylus：Stylus编译器
  - stylus-loader：Webpack Stylus加载器

## 调试工具

### 1. 浏览器开发工具

#### Chrome DevTools
```css
/* 1. 检查元素样式 */
/* 右键点击元素 > 检查 或 F12 */

/* 2. 查看计算样式 */
/* Styles面板 > Computed标签 */

/* 3. 实时编辑样式 */
/* 双击样式值进行修改 */

/* 4. 添加新样式 */
/* 点击Styles面板中的+号 */
```

```javascript
// Console面板调试
// 1. 检查元素样式
console.log(getComputedStyle(element));

// 2. 检查特定属性
console.log(getComputedStyle(element).color);

// 3. 检查CSS变量
console.log(getComputedStyle(element).getPropertyValue('--variable-name'));
```

#### Firefox Developer Tools
```css
/* 1. 检查元素 */
/* 右键 > 检查元素 或 F12 */

/* 2. 查看盒模型 */
/* Box Model视图 */

/* 3. 动画检查器 */
/* Animation面板 */
```

### 2. 调试技巧

#### 使用边框调试
```css
/* 为元素添加边框 */
.debug {
  border: 1px solid red;
}

/* 为特定元素添加边框 */
.debug * {
  border: 1px solid blue;
}

/* 使用不同颜色区分 */
.debug-parent {
  border: 2px solid red;
}

.debug-child {
  border: 2px solid blue;
}
```

#### 使用outline调试
```css
/* 使用outline不会影响布局 */
.debug-outline {
  outline: 2px solid red;
}

/* 为所有元素添加outline */
.debug-outline * {
  outline: 1px solid blue;
}
```

#### 使用背景色调试
```css
/* 使用半透明背景色 */
.debug-bg {
  background-color: rgba(255, 0, 0, 0.1);
}

/* 使用不同背景色区分层级 */
.debug-bg * {
  background-color: rgba(0, 0, 255, 0.1);
}
```

### 3. 常见问题调试

#### 布局问题
```css
/* 检查盒模型 */
.debug-box {
  box-sizing: border-box;
  border: 1px solid red;
  padding: 10px;
  margin: 10px;
}

/* 检查浮动 */
.debug-float {
  clear: both;
  border: 1px solid blue;
}

/* 检查定位 */
.debug-position {
  position: relative;
  border: 1px solid green;
}
```

#### 样式覆盖问题
```css
/* 检查选择器优先级 */
.debug-specificity {
  /* 使用浏览器开发工具查看计算样式 */
  color: red !important; /* 临时使用!important调试 */
}

/* 检查继承 */
.debug-inheritance {
  /* 使用浏览器开发工具查看继承链 */
  color: inherit;
}
```

#### 响应式问题
```css
/* 检查媒体查询 */
@media (max-width: 768px) {
  .debug-responsive {
    /* 使用浏览器开发工具的设备模式 */
    border: 2px solid red;
  }
}

/* 检查视口单位 */
.debug-viewport {
  /* 使用浏览器开发工具调整视口大小 */
  width: 100vw;
  height: 100vh;
}
```

### 4. 调试最佳实践

#### 使用CSS变量调试
```css
:root {
  --debug-color: rgba(255, 0, 0, 0.1);
}

.debug {
  background-color: var(--debug-color);
}
```

#### 使用注释标记
```css
/* TODO: 需要修复的样式 */
.problematic {
  /* 问题描述 */
  /* 临时解决方案 */
  /* 计划修复时间 */
}

/* FIXME: 已知问题 */
.known-issue {
  /* 问题描述 */
  /* 影响范围 */
  /* 临时解决方案 */
}
```

#### 使用调试类
```css
/* 调试类 */
.debug-layout {
  /* 布局调试 */
}

.debug-spacing {
  /* 间距调试 */
}

.debug-typography {
  /* 排版调试 */
}
```

### 5. 性能调试

#### 使用Performance面板
```javascript
// 记录性能
performance.mark('start');
// 执行操作
performance.mark('end');
performance.measure('操作耗时', 'start', 'end');
```

#### 使用Coverage面板
```javascript
// 检查未使用的CSS
// Chrome DevTools > Coverage面板
// 查看CSS文件的使用情况
```

#### 使用Network面板
```javascript
// 检查CSS文件加载
// 查看加载时间
// 检查缓存状态
// 分析请求瀑布图
```

## 在线工具

### 1. 代码验证
- CSS Validator
- CSS Lint
- Stylelint

### 2. 可视化工具
- CSS Grid Generator
- Flexbox Playground
- CSS Diner

### 3. 性能分析
- PageSpeed Insights
- WebPageTest
- Lighthouse

## 学习资源

### 1. 文档
- **官方文档**
  - MDN Web Docs
  - CSS规范
  - Can I Use
  - CSS-Tricks

- **教程**
  - CSS-Tricks指南
  - MDN学习区
  - W3Schools
  - freeCodeCamp

### 2. 社区
- **论坛**
  - Stack Overflow
  - Reddit r/css
  - CSS-Tricks论坛
  - Dev.to

- **博客**
  - CSS-Tricks
  - Smashing Magazine
  - A List Apart
  - CSS Weekly

### 3. 视频资源
- **教程视频**
  - YouTube频道
  - Udemy课程
  - Pluralsight
  - Frontend Masters

- **会议演讲**
  - CSS Conf
  - Frontend Conf
  - JS Conf
  - Web Directions

## 实用工具

### 1. 代码生成器
- **布局生成器**
  - CSS Grid Generator
  - Flexbox Generator
  - CSS Clip Path Maker
  - CSS Gradient Generator

- **动画生成器**
  - Animate.css
  - Animista
  - Keyframes.app
  - CSS Animation Generator

### 2. 设计工具
- **颜色工具**
  - Color Picker
  - Color Contrast Checker
  - Color Palette Generator
  - Color Accessibility Tools

- **排版工具**
  - Google Fonts
  - Type Scale
  - Font Face Generator
  - Typography.js

### 3. 测试工具
- **兼容性测试**
  - BrowserStack
  - LambdaTest
  - Sauce Labs
  - CrossBrowserTesting

- **响应式测试**
  - Responsively
  - Am I Responsive
  - Screenfly
  - Responsive Design Checker

## 最佳实践

### 1. 工具选择
- 根据项目需求选择工具
- 考虑团队熟悉度
- 评估维护成本
- 关注工具更新

### 2. 工作流程
- 建立代码规范
- 使用版本控制
- 自动化构建
- 持续集成

### 3. 维护建议
- 定期更新工具
- 清理无用依赖
- 优化构建配置
- 文档化工具使用 