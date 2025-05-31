# CSS 基础

CSS（Cascading Style Sheets，层叠样式表）是用于描述HTML文档样式的样式表语言。本文将详细介绍CSS的基础知识。

## CSS基础概念

### 1. CSS语法
```css
/* 基本语法 */
选择器 {
  属性: 值;
  属性: 值;
}

/* 示例 */
.button {
  color: #fff;
  background: #007bff;
  padding: 10px 20px;
  border-radius: 4px;
}
```

### 2. CSS引入方式
```html
<!-- 1. 内联样式 -->
<div style="color: red; font-size: 16px;">内联样式</div>

<!-- 2. 内部样式表 -->
<style>
  .internal {
    color: blue;
    font-size: 18px;
  }
</style>

<!-- 3. 外部样式表 -->
<link rel="stylesheet" href="styles.css">

<!-- 4. 导入样式 -->
<style>
  @import url('styles.css');
</style>
```

### 3. CSS注释
```css
/* 单行注释 */
/* 多行
   注释 */

/* 注释最佳实践 */
/* 组件样式 */
.button { }

/* 状态样式 */
.button--active { }

/* 响应式样式 */
@media (max-width: 768px) { }
```

## CSS选择器详解

### 1. 基本选择器
```css
/* 通用选择器 */
* {
  margin: 0;
  padding: 0;
}

/* 元素选择器 */
p {
  color: #333;
}

/* 类选择器 */
.highlight {
  background-color: yellow;
}

/* ID选择器 */
#header {
  height: 60px;
}

/* 属性选择器 */
[disabled] {
  opacity: 0.5;
}

[type="text"] {
  border: 1px solid #ccc;
}

[class*="btn"] {
  padding: 8px 16px;
}

[href^="https"] {
  color: green;
}

[src$=".png"] {
  border: 1px solid #eee;
}

[class~="card"] {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### 2. 组合选择器
```css
/* 后代选择器 */
div p {
  margin-bottom: 1em;
}

/* 子元素选择器 */
ul > li {
  list-style-type: none;
}

/* 相邻兄弟选择器 */
h2 + p {
  margin-top: 0.5em;
}

/* 通用兄弟选择器 */
h2 ~ p {
  color: #666;
}
```

### 3. 伪类选择器
```css
/* 链接状态 */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { text-decoration: underline; }
a:active { color: red; }

/* 表单状态 */
input:focus { border-color: blue; }
input:disabled { background-color: #f5f5f5; }
input:checked { border-color: green; }
input:required { border-color: red; }
input:valid { border-color: green; }
input:invalid { border-color: red; }

/* 结构伪类 */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
li:nth-child(odd) { background-color: #f5f5f5; }
li:nth-child(even) { background-color: #fff; }
p:first-of-type { font-size: 1.2em; }
p:last-of-type { margin-bottom: 0; }
p:only-child { color: blue; }
p:only-of-type { font-style: italic; }

/* 其他伪类 */
div:empty { display: none; }
:not(.highlight) { color: #333; }
:target { scroll-margin-top: 20px; }
:lang(zh) { font-family: "Microsoft YaHei", sans-serif; }
```

### 4. 伪元素选择器
```css
/* 基本伪元素 */
p::first-line { font-variant: small-caps; }
p::first-letter { font-size: 2em; float: left; }
h2::before { content: "§"; color: #999; }
a::after { content: " ↗"; }
::selection { background-color: yellow; color: black; }

/* 内容生成 */
.element::before { content: "注意："; }
a::after { content: attr(href); }

/* 计数器 */
ol { counter-reset: item; }
li::before {
  counter-increment: item;
  content: counter(item) ". ";
}
```

### 5. 选择器优先级
```css
/* 优先级计算规则 */
/* 1. 内联样式 (1000分) */
/* 2. ID选择器 (100分) */
/* 3. 类选择器、属性选择器、伪类 (10分) */
/* 4. 元素选择器、伪元素 (1分) */

/* 优先级示例 */
p { color: black; }                    /* 1分 */
.highlight { color: yellow; }          /* 10分 */
#header { color: blue; }               /* 100分 */
p.highlight { color: green; }          /* 11分 */
.highlight.important { color: red; }   /* 20分 */
#header .highlight { color: purple; }  /* 110分 */

/* 优先级提升 */
p { color: red !important; }           /* 最高优先级 */
:where(p) { color: blue; }            /* 降低优先级 */
:is(p) { color: green; }              /* 保持优先级 */
```

### 6. 选择器最佳实践
```css
/* 1. 选择器命名 */
/* 使用有意义的类名 */
.button { }
/* 遵循BEM命名规范 */
.block__element--modifier { }
/* 避免过度具体的选择器 */
.header .nav .item .link { }  /* 不推荐 */
.nav-link { }                 /* 推荐 */

/* 2. 性能优化 */
/* 避免过度嵌套 */
/* 减少选择器长度 */
/* 避免使用通用选择器 */
/* 合理使用ID选择器 */

/* 3. 可维护性 */
/* 使用类选择器而不是ID */
/* 避免使用!important */
/* 保持选择器简单 */
/* 使用CSS预处理器 */
```

## CSS单位

### 1. 绝对单位
```css
.element {
  /* 像素 */
  width: 100px;
  
  /* 厘米 */
  width: 10cm;
  
  /* 毫米 */
  width: 100mm;
  
  /* 英寸 */
  width: 4in;
  
  /* 点 */
  width: 72pt;
}
```

### 2. 相对单位
```css
.element {
  /* 相对于父元素字体大小 */
  font-size: 1.5em;
  
  /* 相对于根元素字体大小 */
  font-size: 1.5rem;
  
  /* 相对于视口宽度 */
  width: 50vw;
  
  /* 相对于视口高度 */
  height: 50vh;
  
  /* 相对于视口较小边 */
  width: 50vmin;
  
  /* 相对于视口较大边 */
  width: 50vmax;
}
```

### 3. 百分比
```css
.element {
  /* 相对于父元素宽度 */
  width: 50%;
  
  /* 相对于父元素高度 */
  height: 50%;
  
  /* 相对于父元素字体大小 */
  font-size: 150%;
}
```

## CSS颜色

### 1. 颜色表示方法
```css
.element {
  /* 关键字 */
  color: red;
  
  /* 十六进制 */
  color: #ff0000;
  color: #f00;
  
  /* RGB */
  color: rgb(255, 0, 0);
  
  /* RGBA */
  color: rgba(255, 0, 0, 0.5);
  
  /* HSL */
  color: hsl(0, 100%, 50%);
  
  /* HSLA */
  color: hsla(0, 100%, 50%, 0.5);
}
```

### 2. 颜色函数
```css
.element {
  /* 透明度 */
  opacity: 0.5;
  
  /* 亮度 */
  filter: brightness(150%);
  
  /* 对比度 */
  filter: contrast(200%);
  
  /* 灰度 */
  filter: grayscale(50%);
}
```

## CSS文本

### 1. 字体属性
```css
.text {
  /* 字体族 */
  font-family: Arial, sans-serif;
  
  /* 字体大小 */
  font-size: 16px;
  
  /* 字体粗细 */
  font-weight: bold;
  
  /* 字体样式 */
  font-style: italic;
  
  /* 字体变体 */
  font-variant: small-caps;
}
```

### 2. 文本属性
```css
.text {
  /* 文本颜色 */
  color: #333;
  
  /* 文本对齐 */
  text-align: center;
  
  /* 文本装饰 */
  text-decoration: underline;
  
  /* 文本转换 */
  text-transform: uppercase;
  
  /* 文本缩进 */
  text-indent: 2em;
  
  /* 行高 */
  line-height: 1.5;
  
  /* 字间距 */
  letter-spacing: 1px;
  
  /* 词间距 */
  word-spacing: 2px;
}
```

## CSS优先级

### 1. 优先级规则
```css
/* 内联样式 > ID选择器 > 类选择器 > 元素选择器 */
/* 示例优先级从高到低 */
style="color: red;"                    /* 内联样式 */
#id { color: blue; }                   /* ID选择器 */
.class { color: green; }               /* 类选择器 */
div { color: yellow; }                 /* 元素选择器 */
* { color: black; }                    /* 通配符选择器 */
```

### 2. 优先级计算
```css
/* 优先级计算规则 */
/* 内联样式: 1000分 */
/* ID选择器: 100分 */
/* 类选择器: 10分 */
/* 元素选择器: 1分 */

/* 示例 */
#nav .item p { }  /* 100 + 10 + 1 = 111分 */
#nav p { }        /* 100 + 1 = 101分 */
.item p { }       /* 10 + 1 = 11分 */
```

### 3. !important
```css
/* 使用!important提高优先级 */
.element {
  color: red !important;
}

/* 最佳实践：避免使用!important */
/* 推荐使用更具体的选择器 */
.parent .element { }
```

## CSS继承

### 1. 可继承属性
```css
/* 文本相关属性 */
font-family
font-size
font-weight
font-style
color
text-align
line-height
letter-spacing
word-spacing
text-indent
text-transform
```

### 2. 不可继承属性
```css
/* 盒模型属性 */
width
height
margin
padding
border

/* 定位属性 */
position
top
right
bottom
left
z-index

/* 显示属性 */
display
visibility
```

### 3. 继承控制
```css
/* 强制继承 */
.element {
  color: inherit;
  font-size: inherit;
}

/* 阻止继承 */
.element {
  color: initial;
  font-size: initial;
}
```

## 最佳实践

### 1. 选择器使用
```css
/* 推荐：使用类选择器 */
.button { }

/* 避免：过度使用ID选择器 */
#button { }

/* 避免：过度嵌套 */
.header .nav .item .link { }
```

### 2. 单位使用
```css
/* 推荐：使用相对单位 */
.element {
  font-size: 1rem;
  padding: 1em;
  width: 100%;
}

/* 特定场景使用固定单位 */
.border {
  border-width: 1px;
}
```

### 3. 颜色管理
```css
/* 使用变量管理颜色 */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
}

.element {
  color: var(--primary-color);
}
```

## 调试技巧

### 1. 使用浏览器工具
- 使用Chrome DevTools的Elements面板
- 检查计算样式
- 调试选择器
- 测试样式规则

### 2. 常见问题
```css
/* 1. 选择器优先级问题 */
/* 使用更具体的选择器而不是!important */

/* 2. 继承问题 */
/* 使用inherit或initial控制继承 */

/* 3. 单位问题 */
/* 根据场景选择合适的单位 */
```

### 3. 代码组织
```css
/* 1. 使用注释组织代码 */
/* 2. 按功能模块分组 */
/* 3. 保持命名一致性 */
/* 4. 使用CSS预处理器 */
```
