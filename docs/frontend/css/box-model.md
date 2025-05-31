# CSS 盒模型

盒模型是CSS的基础概念之一，它描述了元素内容、内边距、边框和外边距之间的关系。

## 盒模型组成

### 1. 标准盒模型
```css
.element {
  /* 内容区域 */
  width: 200px;
  height: 100px;
  
  /* 内边距 */
  padding: 20px;
  
  /* 边框 */
  border: 2px solid #000;
  
  /* 外边距 */
  margin: 10px;
}
```

### 2. 盒模型计算
- 总宽度 = width + padding-left + padding-right + border-left + border-right
- 总高度 = height + padding-top + padding-bottom + border-top + border-bottom

### 3. 盒模型类型
```css
/* 标准盒模型 */
.element {
  box-sizing: content-box; /* 默认值 */
}

/* IE盒模型 */
.element {
  box-sizing: border-box;
}
```

## 内边距（Padding）

### 1. 基本用法
```css
.element {
  /* 四个方向相同 */
  padding: 20px;
  
  /* 上下 左右 */
  padding: 20px 10px;
  
  /* 上 左右 下 */
  padding: 20px 10px 30px;
  
  /* 上 右 下 左 */
  padding: 20px 10px 30px 15px;
}
```

### 2. 单方向设置
```css
.element {
  padding-top: 20px;
  padding-right: 10px;
  padding-bottom: 30px;
  padding-left: 15px;
}
```

### 3. 百分比值
```css
.element {
  /* 相对于父元素宽度 */
  padding: 10%;
}
```

## 边框（Border）

### 1. 边框样式
```css
.element {
  /* 简写 */
  border: 2px solid #000;
  
  /* 分开设置 */
  border-width: 2px;
  border-style: solid;
  border-color: #000;
}
```

### 2. 边框样式类型
```css
.element {
  border-style: solid;    /* 实线 */
  border-style: dashed;   /* 虚线 */
  border-style: dotted;   /* 点线 */
  border-style: double;   /* 双线 */
  border-style: groove;   /* 凹槽 */
  border-style: ridge;    /* 凸槽 */
  border-style: inset;    /* 凹边 */
  border-style: outset;   /* 凸边 */
  border-style: none;     /* 无边框 */
  border-style: hidden;   /* 隐藏边框 */
}
```

### 3. 圆角边框
```css
.element {
  /* 四个角相同 */
  border-radius: 10px;
  
  /* 左上 右上 右下 左下 */
  border-radius: 10px 20px 30px 40px;
  
  /* 水平 垂直 */
  border-radius: 10px / 20px;
}
```

## 外边距（Margin）

### 1. 基本用法
```css
.element {
  /* 四个方向相同 */
  margin: 20px;
  
  /* 上下 左右 */
  margin: 20px 10px;
  
  /* 上 左右 下 */
  margin: 20px 10px 30px;
  
  /* 上 右 下 左 */
  margin: 20px 10px 30px 15px;
}
```

### 2. 单方向设置
```css
.element {
  margin-top: 20px;
  margin-right: 10px;
  margin-bottom: 30px;
  margin-left: 15px;
}
```

### 3. 外边距合并
```css
/* 相邻元素的外边距会合并 */
.element1 {
  margin-bottom: 20px;
}

.element2 {
  margin-top: 30px;
  /* 实际间距为30px，而不是50px */
}
```

### 4. 负外边距
```css
.element {
  /* 负外边距可以移动元素 */
  margin-top: -20px;
  margin-left: -10px;
}
```

## 盒模型应用

### 1. 居中布局
```css
/* 水平居中 */
.element {
  width: 200px;
  margin: 0 auto;
}

/* 垂直居中 */
.container {
  display: flex;
  align-items: center;
  height: 100vh;
}
```

### 2. 响应式设计
```css
.element {
  /* 使用百分比 */
  width: 100%;
  padding: 5%;
  
  /* 使用视口单位 */
  margin: 2vw;
  
  /* 使用calc() */
  width: calc(100% - 40px);
}
```

### 3. 图片适配
```css
.image {
  /* 保持宽高比 */
  width: 100%;
  height: auto;
  
  /* 或使用object-fit */
  width: 200px;
  height: 200px;
  object-fit: cover;
}
```

## 最佳实践

### 1. 盒模型选择
```css
/* 推荐使用border-box */
* {
  box-sizing: border-box;
}

/* 特定元素使用content-box */
.image {
  box-sizing: content-box;
}
```

### 2. 间距处理
```css
/* 使用变量管理间距 */
:root {
  --spacing-unit: 8px;
  --spacing-small: calc(var(--spacing-unit) * 1);
  --spacing-medium: calc(var(--spacing-unit) * 2);
  --spacing-large: calc(var(--spacing-unit) * 3);
}

.element {
  padding: var(--spacing-medium);
  margin: var(--spacing-small);
}
```

### 3. 响应式处理
```css
/* 移动优先 */
.element {
  padding: 10px;
}

@media (min-width: 768px) {
  .element {
    padding: 20px;
  }
}

@media (min-width: 1024px) {
  .element {
    padding: 30px;
  }
}
```

## 常见问题

### 1. 盒模型计算
```css
/* 问题：元素实际宽度超出预期 */
.element {
  width: 100%;
  padding: 20px;
  border: 2px solid #000;
  /* 实际宽度 = 100% + 40px + 4px */
}

/* 解决：使用border-box */
.element {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  border: 2px solid #000;
  /* 实际宽度 = 100% */
}
```

### 2. 外边距合并
```css
/* 问题：相邻元素间距不符合预期 */
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

### 3. 响应式问题
```css
/* 问题：移动端内容溢出 */
.element {
  width: 100%;
  padding: 20px;
  border: 2px solid #000;
}

/* 解决：使用box-sizing和max-width */
.element {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 20px;
  border: 2px solid #000;
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
- 查看盒模型可视化
- 检查计算样式 