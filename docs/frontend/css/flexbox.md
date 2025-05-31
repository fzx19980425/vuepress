# Flexbox 布局

Flexbox（弹性盒子）是CSS3引入的一种强大的布局方式，它能够更简单、更灵活地实现各种布局需求。

## Flexbox基础

### 1. 基本概念
```css
/* 容器 */
.container {
  display: flex; /* 或 inline-flex */
}

/* 项目 */
.item {
  /* 项目属性 */
}
```

### 2. 主轴和交叉轴
```css
.container {
  /* 主轴方向 */
  flex-direction: row; /* 默认值：水平方向 */
  
  /* 交叉轴方向 */
  /* 当flex-direction为row时，交叉轴为垂直方向 */
  /* 当flex-direction为column时，交叉轴为水平方向 */
}
```

## 容器属性

### 1. flex-direction
```css
.container {
  /* 水平方向（默认） */
  flex-direction: row;
  
  /* 水平方向（反向） */
  flex-direction: row-reverse;
  
  /* 垂直方向 */
  flex-direction: column;
  
  /* 垂直方向（反向） */
  flex-direction: column-reverse;
}
```

### 2. flex-wrap
```css
.container {
  /* 不换行（默认） */
  flex-wrap: nowrap;
  
  /* 换行 */
  flex-wrap: wrap;
  
  /* 反向换行 */
  flex-wrap: wrap-reverse;
}
```

### 3. justify-content
```css
.container {
  /* 主轴对齐方式 */
  
  /* 起点对齐（默认） */
  justify-content: flex-start;
  
  /* 终点对齐 */
  justify-content: flex-end;
  
  /* 居中对齐 */
  justify-content: center;
  
  /* 两端对齐 */
  justify-content: space-between;
  
  /* 均匀分布 */
  justify-content: space-around;
  
  /* 均匀分布（包括两端） */
  justify-content: space-evenly;
}
```

### 4. align-items
```css
.container {
  /* 交叉轴对齐方式 */
  
  /* 起点对齐 */
  align-items: flex-start;
  
  /* 终点对齐 */
  align-items: flex-end;
  
  /* 居中对齐（默认） */
  align-items: center;
  
  /* 基线对齐 */
  align-items: baseline;
  
  /* 拉伸填充（默认） */
  align-items: stretch;
}
```

### 5. align-content
```css
.container {
  /* 多行对齐方式 */
  
  /* 起点对齐 */
  align-content: flex-start;
  
  /* 终点对齐 */
  align-content: flex-end;
  
  /* 居中对齐 */
  align-content: center;
  
  /* 两端对齐 */
  align-content: space-between;
  
  /* 均匀分布 */
  align-content: space-around;
  
  /* 拉伸填充（默认） */
  align-content: stretch;
}
```

## 项目属性

### 1. order
```css
.item {
  /* 排序 */
  order: 0; /* 默认值 */
  order: 1; /* 后移 */
  order: -1; /* 前移 */
}
```

### 2. flex-grow
```css
.item {
  /* 放大比例 */
  flex-grow: 0; /* 默认值：不放大 */
  flex-grow: 1; /* 放大 */
  flex-grow: 2; /* 放大两倍 */
}
```

### 3. flex-shrink
```css
.item {
  /* 缩小比例 */
  flex-shrink: 1; /* 默认值：等比例缩小 */
  flex-shrink: 0; /* 不缩小 */
  flex-shrink: 2; /* 缩小两倍 */
}
```

### 4. flex-basis
```css
.item {
  /* 初始大小 */
  flex-basis: auto; /* 默认值 */
  flex-basis: 0; /* 根据内容 */
  flex-basis: 100px; /* 固定值 */
  flex-basis: 50%; /* 百分比 */
}
```

### 5. flex
```css
.item {
  /* 简写属性 */
  flex: none; /* 0 0 auto */
  flex: auto; /* 1 1 auto */
  flex: 1; /* 1 1 0% */
  flex: 2; /* 2 1 0% */
  flex: 0 0 100px; /* flex-grow flex-shrink flex-basis */
}
```

### 6. align-self
```css
.item {
  /* 单个项目对齐方式 */
  align-self: auto; /* 默认值 */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: baseline;
  align-self: stretch;
}
```

## 常见布局

### 1. 水平居中
```css
.container {
  display: flex;
  justify-content: center;
}

.item {
  /* 项目样式 */
}
```

### 2. 垂直居中
```css
.container {
  display: flex;
  align-items: center;
  height: 100vh;
}

.item {
  /* 项目样式 */
}
```

### 3. 水平垂直居中
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.item {
  /* 项目样式 */
}
```

### 4. 等分布局
```css
.container {
  display: flex;
}

.item {
  flex: 1;
}
```

### 5. 固定宽度+自适应
```css
.container {
  display: flex;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
}

.content {
  flex: 1;
}
```

### 6. 响应式导航
```css
.nav {
  display: flex;
  flex-wrap: wrap;
}

.nav-item {
  flex: 1 1 200px;
}

@media (max-width: 768px) {
  .nav-item {
    flex: 1 1 100%;
  }
}
```

## 最佳实践

### 1. 容器设置
```css
/* 推荐：使用flex布局 */
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 项目间距 */
}

/* 避免：过度使用嵌套 */
.container .wrapper .item { }
```

### 2. 项目设置
```css
/* 推荐：使用flex简写 */
.item {
  flex: 1 1 200px;
}

/* 避免：单独设置flex-grow等 */
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 200px;
}
```

### 3. 响应式处理
```css
/* 移动优先 */
.container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}
```

## 常见问题

### 1. 高度问题
```css
/* 问题：容器高度塌陷 */
.container {
  display: flex;
}

/* 解决：设置容器高度 */
.container {
  display: flex;
  min-height: 100vh;
}
```

### 2. 换行问题
```css
/* 问题：项目不换行导致溢出 */
.container {
  display: flex;
}

/* 解决：允许换行 */
.container {
  display: flex;
  flex-wrap: wrap;
}
```

### 3. 对齐问题
```css
/* 问题：项目对齐不一致 */
.container {
  display: flex;
  align-items: center;
}

/* 解决：使用align-self */
.item {
  align-self: flex-start;
}
```

## 调试技巧

### 1. 使用边框调试
```css
.container {
  border: 1px solid red;
}

.item {
  border: 1px solid blue;
}
```

### 2. 使用浏览器工具
- 使用Chrome DevTools的Elements面板
- 查看Flexbox可视化
- 检查计算样式
- 调试布局问题

### 3. 常见错误
```css
/* 1. 忘记设置display: flex */
/* 2. 混淆主轴和交叉轴 */
/* 3. 错误使用flex属性 */
/* 4. 忽略flex-wrap */
/* 5. 过度使用嵌套 */
```
