# CSS架构与模块化

CSS架构和模块化是大型项目中管理样式的重要方法。本文将介绍主流的CSS架构方法论和模块化实践。

## 架构方法论

### 1. BEM (Block Element Modifier)
```css
/* Block */
.block { }

/* Element */
.block__element { }

/* Modifier */
.block--modifier { }
.block__element--modifier { }

/* 示例 */
.card { }
.card__title { }
.card__content { }
.card--featured { }
.card__title--large { }
```

### 2. SMACSS (Scalable and Modular Architecture for CSS)
```css
/* Base */
body { }
h1 { }
a { }

/* Layout */
.l-header { }
.l-sidebar { }
.l-grid { }

/* Module */
.button { }
.card { }
.media { }

/* State */
.is-hidden { }
.is-active { }
.is-disabled { }

/* Theme */
.t-light { }
.t-dark { }
```

### 3. OOCSS (Object Oriented CSS)
```css
/* 结构对象 */
.media { }
.media__image { }
.media__content { }

/* 皮肤对象 */
.button { }
.button--primary { }
.button--large { }

/* 分离容器和内容 */
.container { }
.content { }
```

## 模块化实践

### 1. 文件组织
```
styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/
│   ├── button.css
│   ├── card.css
│   └── form.css
├── layouts/
│   ├── grid.css
│   ├── header.css
│   └── footer.css
├── utils/
│   ├── helpers.css
│   └── animations.css
└── main.css
```

### 2. 模块化原则
```css
/* 1. 单一职责 */
.button { }
.button--primary { }
.button--secondary { }

/* 2. 可组合性 */
.media { }
.media--reverse { }
.media--stacked { }

/* 3. 可扩展性 */
.card { }
.card--featured { }
.card--compact { }
```

### 3. 命名空间
```css
/* 组件命名空间 */
.c-button { }
.c-card { }
.c-form { }

/* 布局命名空间 */
.l-grid { }
.l-header { }
.l-footer { }

/* 工具类命名空间 */
.u-hidden { }
.u-clearfix { }
.u-text-center { }
```

## 最佳实践

### 1. 组件设计
```css
/* 1. 组件基础样式 */
.component {
  /* 布局属性 */
  display: block;
  position: relative;
  
  /* 盒模型 */
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  
  /* 其他属性 */
  font-family: inherit;
  line-height: inherit;
}

/* 2. 组件变体 */
.component--variant {
  /* 变体特定样式 */
}

/* 3. 组件状态 */
.component.is-state {
  /* 状态特定样式 */
}
```

### 2. 样式组织
```css
/* 1. 按功能分组 */
.component {
  /* 定位 */
  position: relative;
  z-index: 1;
  
  /* 盒模型 */
  display: block;
  width: 100%;
  padding: 1rem;
  
  /* 排版 */
  font-size: 1rem;
  line-height: 1.5;
  
  /* 视觉 */
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 2. 使用注释标记 */
/* ==========================================================================
   组件名称
   ========================================================================== */
```

### 3. 响应式设计
```css
/* 1. 移动优先 */
.component {
  /* 基础样式 */
}

@media (min-width: 768px) {
  .component {
    /* 平板样式 */
  }
}

@media (min-width: 1024px) {
  .component {
    /* 桌面样式 */
  }
}

/* 2. 组件特定断点 */
.component {
  --component-breakpoint: 768px;
}

@media (min-width: var(--component-breakpoint)) {
  .component {
    /* 响应式样式 */
  }
}
```

## 工具和自动化

### 1. 构建工具
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('cssnano')
  ]
}

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

### 2. 代码规范
```css
/* 1. 使用lint工具 */
/* stylelint.config.js */
module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
    'max-nesting-depth': 3,
    'no-important': true
  }
}

/* 2. 命名规范 */
/* 使用有意义的名称 */
.button { }
.card { }
.form { }

/* 避免无意义的名称 */
.box1 { }
.div2 { }
.span3 { }
```

## 性能优化

### 1. 选择器优化
```css
/* 1. 避免过度嵌套 */
/* 不推荐 */
.header .nav .item .link { }

/* 推荐 */
.nav-link { }

/* 2. 避免过度具体 */
/* 不推荐 */
div.container ul li a { }

/* 推荐 */
.nav-link { }
```

### 2. 代码优化
```css
/* 1. 使用简写属性 */
.element {
  /* 推荐 */
  margin: 1rem;
  
  /* 避免 */
  margin-top: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
}

/* 2. 避免重复声明 */
/* 使用CSS变量或混合器 */
:root {
  --spacing: 1rem;
}

.element {
  margin: var(--spacing);
  padding: var(--spacing);
}
```

## 维护和扩展

### 1. 文档化
```css
/**
 * 组件名称
 * 描述：组件的用途和功能
 * 
 * 示例：
 * <div class="component">
 *   <div class="component__element">
 *     Content
 *   </div>
 * </div>
 */

.component { }
.component__element { }
```

### 2. 版本控制
```css
/* 1. 使用语义化版本 */
/* package.json */
{
  "name": "component-library",
  "version": "1.0.0"
}

/* 2. 变更日志 */
/* CHANGELOG.md */
# 1.0.0
- 初始版本
- 添加基础组件
- 实现响应式布局
```

### 3. 测试策略
```css
/* 1. 视觉回归测试 */
/* 使用工具如Percy或Chromatic */

/* 2. 单元测试 */
/* 测试样式计算和继承 */

/* 3. 浏览器测试 */
/* 跨浏览器兼容性测试 */
```

## 常见问题

### 1. 样式冲突
```css
/* 1. 使用命名空间 */
.namespace-component { }

/* 2. 使用CSS Modules */
.component { }
/* 编译后 */
.component_a1b2c3 { }

/* 3. 使用Shadow DOM */
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }
}
```

### 2. 维护性
```css
/* 1. 使用CSS变量 */
:root {
  --component-spacing: 1rem;
  --component-color: #333;
}

/* 2. 模块化组织 */
/* 按功能拆分文件 */

/* 3. 使用预处理器 */
/* 利用混合器和函数 */
```

### 3. 性能
```css
/* 1. 避免过度使用选择器 */
/* 2. 合理使用继承 */
/* 3. 优化关键渲染路径 */
/* 4. 使用CSS containment */
.component {
  contain: content;
}
``` 