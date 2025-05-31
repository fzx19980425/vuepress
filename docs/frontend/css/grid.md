# CSS Grid 布局

CSS Grid 是一种二维布局系统，它能够同时处理行和列，是创建复杂网页布局的强大工具。

## 基本概念

### 网格容器
```css
/* 创建网格容器 */
.container {
  display: grid;
  /* 或 */
  display: inline-grid;
}
```

### 网格线
```css
.container {
  display: grid;
  /* 定义列 */
  grid-template-columns: 100px 1fr 2fr;
  /* 定义行 */
  grid-template-rows: 100px 1fr;
  
  /* 网格线编号从1开始 */
  /* 列线：1 2 3 4 */
  /* 行线：1 2 3 */
}
```

### 网格轨道
```css
.container {
  display: grid;
  /* 列轨道 */
  grid-template-columns: 100px 1fr 2fr;
  /* 行轨道 */
  grid-template-rows: 100px 1fr;
  
  /* 轨道间距 */
  gap: 20px;
  /* 或分别设置 */
  row-gap: 10px;
  column-gap: 20px;
}
```

## 网格容器属性

### 定义网格
```css
.container {
  display: grid;
  
  /* 使用固定值 */
  grid-template-columns: 100px 200px 300px;
  grid-template-rows: 100px 200px;
  
  /* 使用百分比 */
  grid-template-columns: 25% 50% 25%;
  
  /* 使用fr单位 */
  grid-template-columns: 1fr 2fr 1fr;
  
  /* 使用minmax() */
  grid-template-columns: minmax(100px, 1fr) 2fr 1fr;
  
  /* 使用repeat() */
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 100px);
  
  /* 使用auto-fill/auto-fit */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

### 网格区域
```css
.container {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### 自动布局
```css
.container {
  display: grid;
  
  /* 自动行高 */
  grid-auto-rows: minmax(100px, auto);
  
  /* 自动列宽 */
  grid-auto-columns: minmax(100px, auto);
  
  /* 自动流方向 */
  grid-auto-flow: row;  /* 默认值 */
  grid-auto-flow: column;
  grid-auto-flow: dense;  /* 密集填充 */
}
```

### 对齐方式
```css
.container {
  display: grid;
  
  /* 主轴对齐 */
  justify-items: start | end | center | stretch;
  
  /* 交叉轴对齐 */
  align-items: start | end | center | stretch | baseline;
  
  /* 简写 */
  place-items: center;
  
  /* 多行对齐 */
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  
  /* 多列对齐 */
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;
  
  /* 简写 */
  place-content: center;
}
```

## 网格项目属性

### 项目位置
```css
.item {
  /* 列位置 */
  grid-column-start: 1;
  grid-column-end: 3;
  /* 简写 */
  grid-column: 1 / 3;
  /* 或使用span */
  grid-column: 1 / span 2;
  
  /* 行位置 */
  grid-row-start: 1;
  grid-row-end: 3;
  /* 简写 */
  grid-row: 1 / 3;
  /* 或使用span */
  grid-row: 1 / span 2;
  
  /* 简写 */
  grid-area: 1 / 1 / 3 / 3;  /* row-start / column-start / row-end / column-end */
}
```

### 项目对齐
```css
.item {
  /* 主轴对齐 */
  justify-self: start | end | center | stretch;
  
  /* 交叉轴对齐 */
  align-self: start | end | center | stretch | baseline;
  
  /* 简写 */
  place-self: center;
}
```

### 项目顺序
```css
.item {
  /* 使用order属性改变项目顺序 */
  order: 1;  /* 默认值为0 */
}
```

## 常见布局示例

### 12列网格
```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
/* ... 以此类推 */
.col-12 { grid-column: span 12; }
```

### 响应式网格
```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* 或使用媒体查询 */
@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 卡片网格
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
}
```

### 杂志布局
```css
.magazine {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 20px;
}

.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.sidebar {
  grid-row: span 3;
}
```

### 表单布局
```css
.form-grid {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  align-items: center;
}

label {
  justify-self: end;
}

input, select, textarea {
  width: 100%;
}
```

## 最佳实践

### 性能优化
```css
/* 避免过度使用grid-template-areas */
/* 不推荐 */
.container {
  grid-template-areas: 
    "header header header header header header header header header header header header"
    "sidebar main main main main main main main main main main main";
}

/* 推荐 */
.container {
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr;
}

/* 使用minmax()优化响应式布局 */
.responsive {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

### 可访问性
```css
/* 使用逻辑顺序 */
.container {
  display: grid;
  grid-template-columns: 1fr 200px;
}

/* 使用媒体查询调整移动端布局 */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;  /* 将侧边栏移到顶部 */
  }
}
```

### 调试技巧
```css
/* 使用网格线调试 */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  /* 添加网格线颜色 */
  background: linear-gradient(to right, #eee 1px, transparent 1px),
              linear-gradient(to bottom, #eee 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 使用浏览器开发工具 */
/* Chrome DevTools > Elements > Grid */
```

## 工具和资源

1. 网格生成器
   - CSS Grid Generator
   - Griddy
   - Grid Layout Generator

2. 调试工具
   - Firefox Grid Inspector
   - Chrome DevTools Grid
   - Grid Overlay

3. 学习资源
   - CSS Grid Garden
   - Grid by Example
   - MDN Grid Layout

4. 常用库
   - CSS Grid Polyfill
   - Grid System
   - Grid Framework

## 浏览器支持

现代浏览器对 CSS Grid 的支持都很好，但要注意：
- IE11 及更早版本不支持
- 某些旧版本浏览器可能需要添加前缀
- 建议使用现代浏览器开发工具进行调试
