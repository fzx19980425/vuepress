# CSS 浏览器兼容性

本文将介绍CSS在不同浏览器中的兼容性情况，以及如何处理兼容性问题。

## 浏览器支持情况

### 1. 主流浏览器
- Chrome
- Firefox
- Safari
- Edge
- Opera

### 2. 移动浏览器
- iOS Safari
- Android Chrome
- Samsung Internet
- UC Browser
- QQ Browser

### 3. 旧版浏览器
- IE 11
- Edge Legacy
- 旧版移动浏览器

## 特性支持

### 1. 布局特性
```css
/* Flexbox支持 */
.flex-container {
  display: flex; /* 现代浏览器 */
  display: -webkit-flex; /* Safari */
  display: -ms-flexbox; /* IE 10 */
}

/* Grid支持 */
.grid-container {
  display: grid; /* 现代浏览器 */
  display: -ms-grid; /* IE 10+ */
}

/* 多列布局 */
.multi-column {
  column-count: 3; /* 现代浏览器 */
  -webkit-column-count: 3; /* Safari */
  -moz-column-count: 3; /* Firefox */
}
```

### 2. 视觉特性
```css
/* 渐变 */
.gradient {
  background: linear-gradient(to right, #ff0000, #00ff00); /* 现代浏览器 */
  background: -webkit-linear-gradient(left, #ff0000, #00ff00); /* Safari */
  background: -moz-linear-gradient(left, #ff0000, #00ff00); /* Firefox */
}

/* 阴影 */
.shadow {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 现代浏览器 */
  -webkit-box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Safari */
  -moz-box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Firefox */
}

/* 圆角 */
.rounded {
  border-radius: 4px; /* 现代浏览器 */
  -webkit-border-radius: 4px; /* Safari */
  -moz-border-radius: 4px; /* Firefox */
}
```

### 3. 动画特性
```css
/* 过渡 */
.transition {
  transition: all 0.3s ease; /* 现代浏览器 */
  -webkit-transition: all 0.3s ease; /* Safari */
  -moz-transition: all 0.3s ease; /* Firefox */
  -o-transition: all 0.3s ease; /* Opera */
}

/* 动画 */
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

@-webkit-keyframes slide {
  from { -webkit-transform: translateX(0); }
  to { -webkit-transform: translateX(100px); }
}

.animation {
  animation: slide 1s ease; /* 现代浏览器 */
  -webkit-animation: slide 1s ease; /* Safari */
  -moz-animation: slide 1s ease; /* Firefox */
}
```

## 兼容性处理

### 1. 特性检测
```javascript
// 检测CSS特性支持
if (window.CSS && window.CSS.supports) {
  // 支持CSS.supports
  if (CSS.supports('display', 'grid')) {
    // 支持Grid
  }
}

// 使用Modernizr
if (Modernizr.flexbox) {
  // 支持Flexbox
}

// 使用@supports
@supports (display: grid) {
  .container {
    display: grid;
  }
}
```

### 2. 降级方案
```css
/* Flexbox降级 */
.flex-container {
  display: block; /* 基础降级 */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* 现代浏览器 */
}

/* Grid降级 */
.grid-container {
  display: block; /* 基础降级 */
  display: -ms-grid; /* IE 10+ */
  display: grid; /* 现代浏览器 */
}

/* 动画降级 */
.animated {
  opacity: 1; /* 基础状态 */
  animation: fade 1s; /* 现代浏览器 */
}

@supports not (animation: fade 1s) {
  .animated {
    /* 降级样式 */
  }
}
```

### 3. Polyfill
```html
<!-- 使用Polyfill -->
<script src="https://polyfill.io/v3/polyfill.min.js"></script>

<!-- 使用特定Polyfill -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/flexibility/2.0.1/flexibility.js"></script>
```

## 最佳实践

### 1. 渐进增强
```css
/* 基础样式 */
.button {
  padding: 10px;
  border: 1px solid #ccc;
}

/* 增强样式 */
@supports (display: flex) {
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

### 2. 优雅降级
```css
/* 现代样式 */
.card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 降级样式 */
@supports not (display: grid) {
  .card {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }
  
  .card > * {
    flex: 0 0 calc(33.333% - 20px);
    margin: 10px;
  }
}
```

### 3. 条件注释
```html
<!--[if IE]>
<link rel="stylesheet" href="ie.css">
<![endif]-->

<!--[if IE 9]>
<link rel="stylesheet" href="ie9.css">
<![endif]-->
```

## 工具和资源

### 1. 兼容性检查工具
- [Can I Use](https://caniuse.com/)
- [Browser Support](https://browsersupport.net/)
- [MDN Browser Compatibility](https://developer.mozilla.org/zh-CN/docs/Web/CSS#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)

### 2. 自动化工具
- Autoprefixer
- PostCSS
- Babel

### 3. 测试工具
- BrowserStack
- LambdaTest
- Sauce Labs

## 常见问题

### 1. IE兼容性
```css
/* IE特定样式 */
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  /* IE 10+ 特定样式 */
}

/* IE 11特定样式 */
@media all and (-ms-high-contrast: none) and (min-width:0\0) {
  /* IE 11 特定样式 */
}
```

### 2. 移动端兼容性
```css
/* 移动端适配 */
@media screen and (max-width: 768px) {
  /* 移动端样式 */
}

/* 高DPI屏幕 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  /* 高清屏样式 */
}
```

### 3. 打印样式
```css
@media print {
  /* 打印样式 */
  .no-print {
    display: none;
  }
  
  body {
    font-size: 12pt;
  }
  
  a[href]:after {
    content: " (" attr(href) ")";
  }
}
```

## 维护建议

### 1. 版本控制
- 使用Browserslist
- 配置目标浏览器
- 定期更新支持范围

### 2. 测试策略
- 自动化测试
- 手动测试
- 用户反馈

### 3. 文档维护
- 记录兼容性问题
- 更新降级方案
- 跟踪浏览器更新 