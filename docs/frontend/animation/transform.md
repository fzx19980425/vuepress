# CSS 变换动画

> CSS 变换（Transform）是一种强大的 CSS 属性，允许我们对元素进行旋转、缩放、倾斜和平移等变换操作。本文档将详细介绍 CSS 变换的使用方法和最佳实践。更多示例请参考 [CSS 动画示例](./css3-examples.md)。

## 目录

- [基础概念](#基础概念)
- [2D 变换](#2d-变换)
- [3D 变换](#3d-变换)
- [变换组合](#变换组合)
- [性能优化](#性能优化)
- [常见问题](#常见问题解决)
- [最佳实践](#最佳实践)
- [相关资源](#相关资源)

## 基础概念

CSS 变换允许我们改变元素的形状、大小和位置，而不会影响文档流。它是实现动画效果的重要工具。更多基础概念请参考 [CSS 动画基础](./css3.md)。

### 基本语法

```css
.element {
    /* 单个变换 */
    transform: translateX(100px);
    
    /* 多个变换 */
    transform: translate(100px, 100px) rotate(45deg) scale(1.5);
    
    /* 3D 变换 */
    transform: translate3d(100px, 100px, 100px) rotateX(45deg);
}
```

## 2D 变换

### 1. 平移 (translate)

```css
.element {
    /* 水平平移 */
    transform: translateX(100px);
    
    /* 垂直平移 */
    transform: translateY(100px);
    
    /* 同时水平和垂直平移 */
    transform: translate(100px, 100px);
}
```

### 2. 旋转 (rotate)

```css
.element {
    /* 顺时针旋转 45 度 */
    transform: rotate(45deg);
    
    /* 逆时针旋转 45 度 */
    transform: rotate(-45deg);
}
```

### 3. 缩放 (scale)

```css
.element {
    /* 水平缩放 */
    transform: scaleX(1.5);
    
    /* 垂直缩放 */
    transform: scaleY(1.5);
    
    /* 同时水平和垂直缩放 */
    transform: scale(1.5);
    
    /* 分别设置水平和垂直缩放 */
    transform: scale(1.5, 0.8);
}
```

### 4. 倾斜 (skew)

```css
.element {
    /* 水平倾斜 */
    transform: skewX(30deg);
    
    /* 垂直倾斜 */
    transform: skewY(30deg);
    
    /* 同时水平和垂直倾斜 */
    transform: skew(30deg, 20deg);
}
```

## 3D 变换

### 1. 3D 平移

```css
.element {
    /* 3D 平移 */
    transform: translate3d(100px, 100px, 100px);
    
    /* 分别设置 Z 轴平移 */
    transform: translateZ(100px);
}
```

### 2. 3D 旋转

```css
.element {
    /* 绕 X 轴旋转 */
    transform: rotateX(45deg);
    
    /* 绕 Y 轴旋转 */
    transform: rotateY(45deg);
    
    /* 绕 Z 轴旋转 */
    transform: rotateZ(45deg);
    
    /* 3D 旋转 */
    transform: rotate3d(1, 1, 1, 45deg);
}
```

### 3. 3D 缩放

```css
.element {
    /* Z 轴缩放 */
    transform: scaleZ(1.5);
    
    /* 3D 缩放 */
    transform: scale3d(1.5, 1.5, 1.5);
}
```

### 4. 3D 变换属性

```css
.container {
    /* 设置 3D 空间 */
    perspective: 1000px;
    
    /* 保持 3D 效果 */
    transform-style: preserve-3d;
    
    /* 设置观察点位置 */
    perspective-origin: 50% 50%;
    
    /* 设置背面可见性 */
    backface-visibility: hidden;
}
```

## 变换组合

### 1. 2D 变换组合

```css
.element {
    transform: 
        translate(100px, 100px)
        rotate(45deg)
        scale(1.5)
        skew(10deg, 10deg);
}
```

### 2. 3D 变换组合

```css
.element {
    transform: 
        translate3d(100px, 100px, 100px)
        rotateX(45deg)
        rotateY(45deg)
        scale3d(1.5, 1.5, 1.5);
}
```

### 3. 变换管理器

```javascript
class TransformManager {
    constructor(element) {
        this.element = element;
        this.transforms = new Map();
    }

    addTransform(type, value) {
        this.transforms.set(type, value);
        this.updateTransforms();
    }

    removeTransform(type) {
        this.transforms.delete(type);
        this.updateTransforms();
    }

    updateTransforms() {
        const transformString = Array.from(this.transforms.entries())
            .map(([type, value]) => `${type}(${value})`)
            .join(' ');
        this.element.style.transform = transformString;
    }
}
```

## 性能优化

更多性能优化建议请参考[性能优化指南](./performance.md)。

### 1. 使用 transform 代替位置属性

```css
/* 不推荐 */
.element {
    left: 100px;
    top: 100px;
}

/* 推荐 */
.element {
    transform: translate(100px, 100px);
}
```

### 2. 使用 GPU 加速

```css
.element {
    /* 强制 GPU 加速 */
    transform: translate3d(0, 0, 0);
    /* 或 */
    transform: translateZ(0);
}
```

### 3. 使用 will-change

```css
.element {
    will-change: transform;
    transform: translateX(100px);
}
```

## 常见问题解决

### 1. 变换原点问题

```css
.element {
    /* 设置变换原点 */
    transform-origin: center center;
    /* 或使用具体值 */
    transform-origin: 50% 50%;
}
```

### 2. 3D 变换失效

```css
.container {
    /* 确保父元素设置 3D 空间 */
    perspective: 1000px;
    transform-style: preserve-3d;
}

.element {
    transform: rotateX(45deg);
}
```

### 3. 变换闪烁

```css
.element {
    /* 使用 transform3d 强制 GPU 加速 */
    transform: translate3d(0, 0, 0);
    /* 避免使用 left, top 等属性 */
}
```

## 最佳实践

1. 优先使用 transform 代替位置属性
2. 合理使用 3D 变换
3. 注意变换的性能影响
4. 使用适当的变换原点
5. 考虑移动设备性能
6. 提供降级方案
7. 注意变换的可访问性
8. 测试不同浏览器表现
9. 避免过度使用变换
10. 保持变换简单明了

## 相关资源

- [MDN CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [CSS 3D Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transforms/Using_CSS_transforms)
- [CSS Transform Performance](https://web.dev/animations-guide/)
- [CSS Transform Tools](https://css-tricks.com/almanac/properties/t/transform/)
- [CSS 动画基础](./css3.md)
- [CSS 动画示例](./css3-examples.md)
- [性能优化指南](./performance.md)
- [动画设计原则](./principles.md)
- [高级动画示例](./advanced-examples.md) 