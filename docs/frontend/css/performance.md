# CSS 性能优化

CSS性能优化是提高网页加载速度和运行效率的重要环节。本文将介绍CSS性能优化的各个方面。

## 选择器优化

### 选择器性能
```css
/* 不推荐：过度具体的选择器 */
div.container > ul > li > a {
  color: blue;
}

/* 推荐：使用类选择器 */
.nav-link {
  color: blue;
}

/* 不推荐：使用通配符 */
* {
  margin: 0;
  padding: 0;
}

/* 推荐：明确指定元素 */
body, h1, h2, h3, p {
  margin: 0;
  padding: 0;
}
```

### 选择器优先级
```css
/* 不推荐：过度使用ID选择器 */
#header #nav #item {
  color: red;
}

/* 推荐：使用类选择器 */
.nav-item {
  color: red;
}

/* 不推荐：使用!important */
.element {
  color: red !important;
}

/* 推荐：提高选择器特异性 */
.element.special {
  color: red;
}
```

## 渲染性能

### 避免重排和重绘
```css
/* 不推荐：触发重排的属性 */
.element {
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #000;
}

/* 推荐：使用transform和opacity */
.element {
  transform: translateX(100px);
  opacity: 0.5;
}

/* 不推荐：频繁改变布局 */
.animated {
  width: 100px;
  height: 100px;
  transition: all 0.3s;
}

/* 推荐：只动画必要的属性 */
.animated {
  transform: scale(1);
  transition: transform 0.3s;
}
```

### 使用硬件加速
```css
/* 启用硬件加速 */
.element {
  transform: translateZ(0);
  /* 或 */
  transform: translate3d(0, 0, 0);
  /* 或 */
  will-change: transform;
}

/* 注意：不要过度使用will-change */
.element {
  /* 不推荐：过度使用 */
  will-change: all;
  
  /* 推荐：只指定需要变化的属性 */
  will-change: transform, opacity;
}
```

## 加载性能

### 减少文件大小
```css
/* 使用简写属性 */
.element {
  /* 不推荐 */
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
  
  /* 推荐 */
  margin: 10px 20px;
}

/* 合并相同的规则 */
/* 不推荐 */
.button-primary {
  padding: 10px;
  border-radius: 4px;
}

.button-secondary {
  padding: 10px;
  border-radius: 4px;
}

/* 推荐 */
.button {
  padding: 10px;
  border-radius: 4px;
}
```

### 优化加载策略
```html
<!-- 关键CSS内联 -->
<style>
  /* 首屏关键样式 */
  .header { }
  .hero { }
  .nav { }
</style>

<!-- 非关键CSS异步加载 -->
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

## 动画性能

### 优化动画
```css
/* 不推荐：动画所有属性 */
.element {
  transition: all 0.3s;
}

/* 推荐：只动画特定属性 */
.element {
  transition: transform 0.3s, opacity 0.3s;
}

/* 不推荐：使用会触发重排的属性 */
@keyframes slide {
  from { left: 0; }
  to { left: 100px; }
}

/* 推荐：使用transform */
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

### 使用适当的动画属性
```css
/* 性能好的属性 */
.element {
  transform: translateX(100px);
  opacity: 0.5;
  filter: blur(5px);
}

/* 性能差的属性 */
.element {
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #000;
}
```

## 响应式优化

### 媒体查询优化
```css
/* 不推荐：使用多个媒体查询 */
.element {
  width: 100%;
}

@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}

@media (min-width: 1024px) {
  .element {
    width: 33.33%;
  }
}

/* 推荐：使用相对单位 */
.element {
  width: 100%;
}

@media (min-width: 768px) {
  .element {
    width: calc(50% - 20px);
  }
}
```

### 图片优化
```css
/* 使用适当的图片格式 */
.element {
  /* 小图标使用SVG */
  background-image: url('icon.svg');
  
  /* 照片使用WebP */
  background-image: url('photo.webp');
}

/* 使用响应式图片 */
.element {
  background-image: url('small.jpg');
}

@media (min-width: 768px) {
  .element {
    background-image: url('large.jpg');
  }
}
```

## 工具和资源

### 1. 性能分析工具
- Chrome DevTools Performance
- Lighthouse
- WebPageTest
- CSS Stats

### 2. 优化工具
- PurgeCSS
- PostCSS
- CSS Minifier
- Critical CSS

### 3. 监控工具
- Google Analytics
- New Relic
- Datadog
- Sentry

## 最佳实践

### 1. 代码组织
```css
/* 使用CSS预处理器 */
/* 模块化CSS */
/* 使用CSS变量 */
/* 避免重复代码 */

/* 示例：使用CSS变量 */
:root {
  --primary-color: #3498db;
  --spacing-unit: 8px;
}

.element {
  color: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
}
```

### 2. 缓存策略
```html
<!-- 使用适当的缓存头 -->
<!-- 使用版本号 -->
<link rel="stylesheet" href="styles.css?v=1.0.0">

<!-- 使用内容哈希 -->
<link rel="stylesheet" href="styles.a1b2c3d4.css">
```

### 3. 按需加载
```javascript
// 动态加载CSS
function loadCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// 按需加载
if (condition) {
  loadCSS('specific-styles.css');
}
```

## 调试技巧

### 1. 性能分析
```javascript
// 使用Performance API
performance.mark('start');
// 执行操作
performance.mark('end');
performance.measure('操作耗时', 'start', 'end');
```

### 2. 渲染分析
```javascript
// 使用requestAnimationFrame
function measureLayout() {
  requestAnimationFrame(() => {
    const element = document.querySelector('.element');
    const rect = element.getBoundingClientRect();
    console.log('布局信息：', rect);
  });
}
```

### 3. 内存分析
```javascript
// 使用Chrome DevTools Memory面板
// 1. 记录堆快照
// 2. 分析内存使用
// 3. 查找内存泄漏
```

## 浏览器支持

- 使用特性检测
- 提供降级方案
- 考虑浏览器兼容性
- 使用polyfill
- 测试不同浏览器

## 持续优化

1. 定期审查代码
2. 监控性能指标
3. 收集用户反馈
4. 更新优化策略
5. 保持文档更新 