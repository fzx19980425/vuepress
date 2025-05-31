# CSS变量与自定义属性

CSS变量（也称为CSS自定义属性）是CSS的一个强大特性，允许我们定义可重用的值，并在整个样式表中使用它们。

## 基础概念

### 1. 变量声明
```css
/* 全局变量 */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
  --spacing-unit: 8px;
}

/* 局部变量 */
.component {
  --component-bg: #f8f9fa;
  --component-padding: var(--spacing-unit) * 2;
}
```

### 2. 变量使用
```css
.button {
  /* 直接使用 */
  color: var(--primary-color);
  
  /* 带默认值 */
  background: var(--component-bg, #fff);
  
  /* 在计算中使用 */
  padding: calc(var(--spacing-unit) * 2);
  
  /* 在媒体查询中使用 */
  @media (max-width: 768px) {
    font-size: calc(var(--font-size-base) * 0.9);
  }
}
```

## 变量特性

### 1. 作用域
```css
/* 全局作用域 */
:root {
  --global-var: value;
}

/* 组件作用域 */
.component {
  --component-var: value;
}

/* 元素作用域 */
.element {
  --element-var: value;
}
```

### 2. 继承
```css
/* 变量可以被继承 */
.parent {
  --inherited-var: value;
}

.child {
  /* 可以访问父元素的变量 */
  color: var(--inherited-var);
}
```

### 3. 动态更新
```css
/* 通过JavaScript更新变量 */
element.style.setProperty('--dynamic-var', 'new-value');

/* 响应式更新 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #333;
    --text-color: #fff;
  }
}
```

## 最佳实践

### 1. 命名规范
```css
/* 推荐：使用有意义的名称 */
:root {
  --color-primary: #007bff;
  --spacing-large: 24px;
  --font-family-base: system-ui;
}

/* 避免：使用无意义的名称 */
:root {
  --c1: #007bff;
  --s1: 24px;
  --f1: system-ui;
}
```

### 2. 组织管理
```css
/* 按功能分组 */
:root {
  /* 颜色系统 */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  
  /* 排版系统 */
  --font-size-base: 16px;
  --line-height-base: 1.5;
  
  /* 间距系统 */
  --spacing-unit: 8px;
  --spacing-large: calc(var(--spacing-unit) * 3);
}
```

### 3. 响应式设计
```css
/* 基础变量 */
:root {
  --container-width: 1200px;
  --font-size-base: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  :root {
    --container-width: 100%;
    --font-size-base: 14px;
  }
}
```

## 常见应用

### 1. 主题切换
```css
/* 亮色主题 */
:root {
  --bg-color: #fff;
  --text-color: #333;
  --border-color: #ddd;
}

/* 暗色主题 */
[data-theme="dark"] {
  --bg-color: #333;
  --text-color: #fff;
  --border-color: #444;
}

/* 使用主题变量 */
body {
  background: var(--bg-color);
  color: var(--text-color);
  border-color: var(--border-color);
}
```

### 2. 组件样式
```css
/* 组件变量 */
.card {
  --card-padding: 20px;
  --card-radius: 4px;
  --card-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 使用组件变量 */
.card {
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}
```

### 3. 动画控制
```css
/* 动画变量 */
:root {
  --transition-duration: 0.3s;
  --transition-timing: ease-in-out;
}

/* 使用动画变量 */
.element {
  transition: all var(--transition-duration) var(--transition-timing);
}
```

## 调试技巧

### 1. 浏览器工具
- 使用Chrome DevTools的Styles面板
- 查看计算样式
- 检查变量继承
- 测试变量值

### 2. 常见问题
```css
/* 1. 变量未定义 */
.element {
  /* 使用默认值 */
  color: var(--undefined-var, #000);
}

/* 2. 作用域问题 */
/* 确保变量在正确的作用域中定义 */

/* 3. 继承问题 */
/* 使用inherit关键字处理继承 */
.element {
  --inherited-var: inherit;
}
```

## 浏览器支持

### 1. 支持情况
- Chrome: 49+
- Firefox: 31+
- Safari: 9.1+
- Edge: 15+

### 2. 降级方案
```css
/* 使用@supports检测支持 */
@supports (--css: variables) {
  .element {
    color: var(--primary-color);
  }
}

/* 降级样式 */
.element {
  color: #007bff; /* 降级值 */
}
```

## 性能考虑

### 1. 使用建议
- 避免过度使用变量
- 合理组织变量作用域
- 注意变量继承链
- 使用有意义的默认值

### 2. 优化技巧
```css
/* 1. 使用简写属性 */
.element {
  /* 推荐 */
  margin: var(--spacing);
  
  /* 避免 */
  margin-top: var(--spacing);
  margin-right: var(--spacing);
  margin-bottom: var(--spacing);
  margin-left: var(--spacing);
}

/* 2. 缓存计算值 */
.element {
  /* 推荐 */
  --computed-value: calc(var(--base) * 2);
  width: var(--computed-value);
  height: var(--computed-value);
}
``` 