# CSS 过渡动画

> CSS 过渡（Transition）是一种在元素从一种状态转换到另一种状态时，平滑地改变其属性值的方式。本文档将详细介绍 CSS 过渡动画的使用方法和最佳实践。更多示例请参考 [CSS 动画示例](./css3-examples.md)。

## 目录

- [基础概念](#过渡动画基础)
- [过渡属性](#过渡属性)
- [常见效果](#常见过渡效果)
- [高级技巧](#高级过渡技巧)
- [性能优化](#性能优化)
- [常见问题](#常见问题解决)
- [最佳实践](#最佳实践)
- [相关资源](#相关资源)

## 过渡动画基础

过渡动画是 CSS3 中最基础的动画形式，用于在元素状态改变时平滑过渡。它是实现简单动画效果的首选方式。更多基础概念请参考 [CSS 动画基础](./css3.md)。

### 基本语法

```css
.element {
    /* 简写属性 */
    transition: property duration timing-function delay;
    
    /* 或分别设置 */
    transition-property: all;              /* 要过渡的属性 */
    transition-duration: 0.3s;             /* 过渡持续时间 */
    transition-timing-function: ease;      /* 过渡时间函数 */
    transition-delay: 0s;                  /* 过渡延迟时间 */
}
```

## 过渡属性

### 1. transition-property

指定要过渡的 CSS 属性。

```css
/* 指定多个属性 */
.element {
    transition-property: transform, opacity, background-color;
}

/* 使用 all（谨慎使用） */
.element {
    transition-property: all;
}
```

### 2. transition-duration

指定过渡持续时间。

```css
.element {
    /* 不同属性设置不同的持续时间 */
    transition-property: transform, opacity;
    transition-duration: 0.3s, 0.5s;
}
```

### 3. transition-timing-function

定义过渡的速度曲线。更多缓动函数示例请参考 [CSS 动画示例](./css3-examples.md)。

```css
.element {
    /* 使用预定义的时间函数 */
    transition-timing-function: ease-in-out;
    
    /* 使用贝塞尔曲线 */
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4. transition-delay

指定过渡开始前的延迟时间。

```css
.element {
    /* 延迟 0.2 秒后开始过渡 */
    transition-delay: 0.2s;
}
```

## 常见过渡效果

### 1. 悬停效果

```css
.button {
    background-color: #007bff;
    transition: all 0.3s ease;
}

.button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

### 2. 颜色过渡

```css
.color-transition {
    background-color: #ff0000;
    transition: background-color 0.5s ease;
}

.color-transition:hover {
    background-color: #00ff00;
}
```

### 3. 尺寸变化

```css
.size-transition {
    width: 100px;
    height: 100px;
    transition: width 0.3s ease, height 0.3s ease;
}

.size-transition:hover {
    width: 200px;
    height: 200px;
}
```

### 4. 位置移动

```css
.position-transition {
    transform: translateX(0);
    transition: transform 0.3s ease;
}

.position-transition:hover {
    transform: translateX(100px);
}
```

## 高级过渡技巧

### 1. 多阶段过渡

```css
.multi-stage {
    transition: 
        transform 0.3s ease,
        background-color 0.5s ease 0.1s,
        box-shadow 0.3s ease 0.2s;
}

.multi-stage:hover {
    transform: scale(1.1);
    background-color: #ff0000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

### 2. 链式过渡

```css
.chain-transition {
    transition: transform 0.3s ease;
}

.chain-transition:hover {
    transform: translateX(100px);
}

.chain-transition:hover .child {
    transition: transform 0.3s ease 0.3s;
    transform: translateY(20px);
}
```

### 3. 条件过渡

```css
.conditional-transition {
    transition: transform 0.3s ease;
}

/* 只在特定条件下应用过渡 */
@media (hover: hover) {
    .conditional-transition:hover {
        transform: scale(1.1);
    }
}
```

## 性能优化

更多性能优化建议请参考[性能优化指南](./performance.md)。

### 1. 使用 transform 和 opacity

```css
.optimized-transition {
    /* 使用 GPU 加速的属性 */
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.optimized-transition:hover {
    transform: translateX(100px);
    opacity: 0.8;
}
```

### 2. 避免过渡所有属性

```css
/* 不推荐 */
.element {
    transition: all 0.3s ease;
}

/* 推荐 */
.element {
    transition: transform 0.3s ease, opacity 0.3s ease;
}
```

### 3. 使用 will-change

```css
.element {
    will-change: transform;
    transition: transform 0.3s ease;
}
```

## 常见问题解决

### 1. 过渡不生效

```css
/* 确保有初始状态和结束状态 */
.element {
    /* 初始状态 */
    opacity: 1;
    transition: opacity 0.3s ease;
}

.element.hidden {
    /* 结束状态 */
    opacity: 0;
}
```

### 2. 过渡闪烁

```css
.element {
    /* 使用 transform 代替位置属性 */
    transform: translateX(0);
    transition: transform 0.3s ease;
    /* 避免使用 left, top 等属性 */
}
```

### 3. 过渡中断

```javascript
// 使用 JavaScript 处理过渡中断
element.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'transform') {
        // 过渡结束后的处理
    }
});
```

## 最佳实践

1. 保持过渡时间在 0.2s 到 0.5s 之间
2. 使用适当的缓动函数
3. 避免过渡太多属性
4. 考虑使用 transform 和 opacity
5. 注意移动设备性能
6. 提供降级方案
7. 考虑动画的可访问性
8. 测试不同浏览器表现

## 相关资源

- [MDN CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [CSS Transition Timing Functions](https://easings.net/)
- [CSS Triggers](https://csstriggers.com/)
- [Animating with CSS Transitions](https://web.dev/animations-guide/)
- [CSS 动画基础](./css3.md)
- [CSS 动画示例](./css3-examples.md)
- [性能优化指南](./performance.md)
- [动画设计原则](./principles.md) 