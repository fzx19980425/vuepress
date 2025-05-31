# CSS 布局基础

CSS布局是网页设计的基础，本文将介绍CSS布局的基本概念和常用技术。

## 文档流

### 1. 正常文档流
```css
/* 块级元素 */
.block {
  display: block;
  width: 100%;
  margin: 10px 0;
}

/* 行内元素 */
.inline {
  display: inline;
  margin: 0 5px;
}

/* 行内块元素 */
.inline-block {
  display: inline-block;
  width: 100px;
  margin: 0 5px;
}
```

### 2. 元素类型
```css
/* 块级元素 */
div, p, h1-h6, ul, ol, li {
  display: block;
}

/* 行内元素 */
span, a, em, strong {
  display: inline;
}

/* 行内块元素 */
img, input, button {
  display: inline-block;
}
```

## 定位

### 1. 定位类型
```css
.element {
  /* 静态定位（默认） */
  position: static;
  
  /* 相对定位 */
  position: relative;
  top: 10px;
  left: 20px;
  
  /* 绝对定位 */
  position: absolute;
  top: 0;
  right: 0;
  
  /* 固定定位 */
  position: fixed;
  bottom: 20px;
  right: 20px;
  
  /* 粘性定位 */
  position: sticky;
  top: 0;
}
```

### 2. 定位应用
```css
/* 居中定位 */
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 固定导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

/* 粘性页脚 */
.footer {
  position: sticky;
  bottom: 0;
  width: 100%;
}
```

### 3. z-index
```css
/* 层叠顺序 */
.element1 {
  position: relative;
  z-index: 1;
}

.element2 {
  position: relative;
  z-index: 2;
}

.element3 {
  position: relative;
  z-index: 3;
}
```

## 浮动

### 1. 基本用法
```css
.float-left {
  float: left;
  width: 200px;
  margin-right: 20px;
}

.float-right {
  float: right;
  width: 200px;
  margin-left: 20px;
}
```

### 2. 清除浮动
```css
/* 方法1：使用clear属性 */
.clear {
  clear: both;
}

/* 方法2：使用伪元素 */
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

/* 方法3：使用overflow */
.container {
  overflow: hidden;
}
```

### 3. 浮动布局
```css
/* 两列布局 */
.column {
  float: left;
  width: 50%;
  padding: 20px;
  box-sizing: border-box;
}

/* 三列布局 */
.column {
  float: left;
  width: 33.33%;
  padding: 20px;
  box-sizing: border-box;
}
```

## 显示属性

### 1. display属性
```css
.element {
  /* 块级显示 */
  display: block;
  
  /* 行内显示 */
  display: inline;
  
  /* 行内块显示 */
  display: inline-block;
  
  /* 弹性布局 */
  display: flex;
  
  /* 网格布局 */
  display: grid;
  
  /* 表格显示 */
  display: table;
  
  /* 隐藏元素 */
  display: none;
}
```

### 2. visibility属性
```css
.element {
  /* 可见 */
  visibility: visible;
  
  /* 隐藏但保留空间 */
  visibility: hidden;
  
  /* 折叠（用于表格） */
  visibility: collapse;
}
```

### 3. opacity属性
```css
.element {
  /* 完全不透明 */
  opacity: 1;
  
  /* 半透明 */
  opacity: 0.5;
  
  /* 完全透明 */
  opacity: 0;
}
```

## 布局技术

### 1. Grid布局
```css
/* 基本网格布局 */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 定义网格区域 */
.container {
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

/* 网格项目定位 */
.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  grid-area: header;
}

/* 网格对齐 */
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}

.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}

/* 常见网格布局 */
/* 12列网格 */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

/* 响应式网格 */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
```

### 2. 多列布局
```css
/* 基本多列 */
.container {
  column-count: 3;
  column-gap: 20px;
  column-rule: 1px solid #ccc;
}

/* 指定列宽 */
.container {
  column-width: 200px;
  column-gap: 20px;
}

/* 跨列 */
.item {
  column-span: all;
}
```

### 3. 等高布局
```css
/* Flexbox实现 */
.equal-height {
  display: flex;
}

.equal-height > * {
  flex: 1;
}

/* Grid实现 */
.equal-height {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

## 布局技巧

### 1. 居中布局
```css
/* 水平居中 */
.center-h {
  margin: 0 auto;
  width: fit-content;
}

/* 垂直居中 */
.center-v {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

/* 完全居中 */
.center-all {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 2. 响应式布局
```css
/* 使用媒体查询 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}

/* 使用Grid自动适应 */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

## 布局最佳实践

### 1. 布局技术选择
```css
/* Flexbox适合一维布局 */
.one-dimension {
  display: flex;
  justify-content: space-between;
}

/* Grid适合二维布局 */
.two-dimension {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* 多列布局适合文本内容 */
.text-content {
  column-count: 3;
  column-gap: 20px;
}

/* 定位布局适合特殊效果 */
.special-effect {
  position: relative;
  transform: translateZ(0);
}
```

### 2. 浏览器兼容性
```css
/* 使用特性检测 */
@supports (display: grid) {
  .container {
    display: grid;
  }
}

/* 提供降级方案 */
.container {
  display: flex; /* 降级方案 */
}

@supports (display: grid) {
  .container {
    display: grid;
  }
}
```

### 3. 性能优化
```css
/* 避免过度嵌套 */
.container > .item { } /* 推荐 */
.container .wrapper .item { } /* 不推荐 */

/* 合理使用定位 */
.element {
  transform: translateY(10px); /* 推荐 */
  /* position: relative; */ /* 不推荐 */
  /* top: 10px; */
}

/* 注意重排重绘 */
.element {
  will-change: transform; /* 提示浏览器优化 */
}
```

## 工具和资源

### 1. 布局生成器
- Flexbox Froggy
- Grid Garden
- CSS Grid Generator

### 2. 调试工具
- Chrome DevTools
- Firefox Grid Inspector
- Flexbox Inspector

### 3. 学习资源
- MDN Web Docs
- CSS-Tricks
- A Complete Guide to Flexbox
- A Complete Guide to Grid

## 常见问题

### 1. 高度塌陷
```css
/* 问题：父元素高度塌陷 */
.parent {
  border: 1px solid #000;
}

.child {
  float: left;
}

/* 解决：使用clearfix */
.parent::after {
  content: '';
  display: table;
  clear: both;
}
```

### 2. 边距重叠
```css
/* 问题：相邻元素边距重叠 */
.element1 {
  margin-bottom: 20px;
}

.element2 {
  margin-top: 30px;
}

/* 解决：使用padding或border */
.element1 {
  padding-bottom: 20px;
}

.element2 {
  margin-top: 30px;
}
```

### 3. 定位问题
```css
/* 问题：绝对定位元素溢出 */
.parent {
  position: relative;
  overflow: hidden;
}

.child {
  position: absolute;
  width: 200%;
  left: -50%;
}

/* 解决：使用overflow或调整定位 */
.parent {
  position: relative;
  overflow: hidden;
}

.child {
  position: absolute;
  width: 100%;
  left: 0;
}
```

## 最佳实践

### 1. 布局选择
```css
/* 简单布局使用float */
.simple-layout {
  float: left;
  width: 50%;
}

/* 复杂布局使用flex或grid */
.complex-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### 2. 响应式处理
```css
/* 移动优先 */
.element {
  width: 100%;
  padding: 10px;
}

@media (min-width: 768px) {
  .element {
    width: 50%;
    padding: 20px;
  }
}

@media (min-width: 1024px) {
  .element {
    width: 33.33%;
    padding: 30px;
  }
}
```

### 3. 性能优化
```css
/* 避免过度使用定位 */
.element {
  /* 优先使用文档流 */
  margin: 20px;
  
  /* 必要时使用定位 */
  position: relative;
  top: 10px;
}

/* 使用transform代替定位 */
.element {
  transform: translateY(10px);
  /* 而不是 */
  /* position: relative; */
  /* top: 10px; */
}
```

## 调试技巧

### 1. 使用边框调试
```css
.debug {
  border: 1px solid red;
}

.debug * {
  border: 1px solid blue;
}
```

### 2. 使用outline调试
```css
.debug {
  outline: 1px solid red;
}

.debug * {
  outline: 1px solid blue;
}
```

### 3. 使用浏览器工具
- 使用Chrome DevTools的Elements面板
- 检查盒模型
- 查看计算样式
- 调试布局问题 