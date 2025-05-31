# CSS 滤镜效果

> CSS 滤镜（Filter）是一种强大的视觉效果工具，允许我们对元素应用各种图形效果，如模糊、亮度调整、对比度等。本文档将详细介绍 CSS 滤镜的使用方法和最佳实践。更多示例请参考 [CSS 动画示例](./css3-examples.md)。

## 目录

- [基础概念](#基础概念)
- [滤镜类型](#滤镜类型)
- [滤镜组合](#滤镜组合)
- [动画效果](#动画效果)
- [性能优化](#性能优化)
- [常见问题](#常见问题解决)
- [最佳实践](#最佳实践)
- [相关资源](#相关资源)

## 基础概念

CSS 滤镜允许我们通过简单的属性来创建复杂的视觉效果。这些效果可以单独使用，也可以组合使用。更多基础概念请参考 [CSS 动画基础](./css3.md)。

### 基本语法

```css
.element {
    /* 单个滤镜 */
    filter: blur(5px);
    
    /* 多个滤镜 */
    filter: blur(5px) brightness(1.2) contrast(1.5);
    
    /* 使用 url() 引用 SVG 滤镜 */
    filter: url('filters.svg#filter-id');
}
```

## 滤镜类型

### 1. 模糊 (blur)

```css
.element {
    /* 高斯模糊 */
    filter: blur(5px);
    
    /* 轻微模糊 */
    filter: blur(2px);
    
    /* 强烈模糊 */
    filter: blur(10px);
}
```

### 2. 亮度 (brightness)

```css
.element {
    /* 增加亮度 */
    filter: brightness(1.5);
    
    /* 降低亮度 */
    filter: brightness(0.5);
    
    /* 保持原始亮度 */
    filter: brightness(1);
}
```

### 3. 对比度 (contrast)

```css
.element {
    /* 增加对比度 */
    filter: contrast(2);
    
    /* 降低对比度 */
    filter: contrast(0.5);
    
    /* 保持原始对比度 */
    filter: contrast(1);
}
```

### 4. 灰度 (grayscale)

```css
.element {
    /* 完全灰度 */
    filter: grayscale(1);
    
    /* 部分灰度 */
    filter: grayscale(0.5);
    
    /* 无灰度 */
    filter: grayscale(0);
}
```

### 5. 色相旋转 (hue-rotate)

```css
.element {
    /* 旋转 90 度 */
    filter: hue-rotate(90deg);
    
    /* 旋转 180 度 */
    filter: hue-rotate(180deg);
    
    /* 旋转 360 度 */
    filter: hue-rotate(360deg);
}
```

### 6. 反相 (invert)

```css
.element {
    /* 完全反相 */
    filter: invert(1);
    
    /* 部分反相 */
    filter: invert(0.5);
    
    /* 无反相 */
    filter: invert(0);
}
```

### 7. 不透明度 (opacity)

```css
.element {
    /* 半透明 */
    filter: opacity(0.5);
    
    /* 完全透明 */
    filter: opacity(0);
    
    /* 完全不透明 */
    filter: opacity(1);
}
```

### 8. 饱和度 (saturate)

```css
.element {
    /* 增加饱和度 */
    filter: saturate(2);
    
    /* 降低饱和度 */
    filter: saturate(0.5);
    
    /* 保持原始饱和度 */
    filter: saturate(1);
}
```

### 9. 褐色 (sepia)

```css
.element {
    /* 完全褐色 */
    filter: sepia(1);
    
    /* 部分褐色 */
    filter: sepia(0.5);
    
    /* 无褐色 */
    filter: sepia(0);
}
```

## 滤镜组合

### 1. 基础组合

```css
.element {
    filter: 
        blur(2px)
        brightness(1.2)
        contrast(1.5)
        grayscale(0.3)
        hue-rotate(30deg)
        saturate(1.5);
}
```

### 2. 创意效果

```css
.element {
    /* 复古效果 */
    filter: 
        sepia(0.5)
        contrast(1.2)
        brightness(0.9)
        saturate(0.8);
    
    /* 梦幻效果 */
    filter: 
        blur(1px)
        brightness(1.2)
        contrast(1.1)
        saturate(1.3);
    
    /* 冷色调 */
    filter: 
        hue-rotate(180deg)
        saturate(0.8)
        brightness(1.1);
}
```

### 3. 滤镜管理器

```javascript
class FilterManager {
    constructor(element) {
        this.element = element;
        this.filters = new Map();
    }

    addFilter(type, value) {
        this.filters.set(type, value);
        this.updateFilters();
    }

    removeFilter(type) {
        this.filters.delete(type);
        this.updateFilters();
    }

    updateFilters() {
        const filterString = Array.from(this.filters.entries())
            .map(([type, value]) => `${type}(${value})`)
            .join(' ');
        this.element.style.filter = filterString;
    }
}
```

## 动画效果

### 1. 过渡动画

```css
.element {
    transition: filter 0.3s ease;
}

.element:hover {
    filter: brightness(1.2) contrast(1.2);
}
```

### 2. 关键帧动画

```css
@keyframes filterAnimation {
    0% { filter: brightness(1) contrast(1); }
    50% { filter: brightness(1.5) contrast(1.5); }
    100% { filter: brightness(1) contrast(1); }
}

.element {
    animation: filterAnimation 2s infinite;
}
```

### 3. 交互效果

```css
.element {
    transition: filter 0.3s ease;
}

.element:hover {
    filter: blur(2px) brightness(1.2);
}

.element:active {
    filter: brightness(0.8) contrast(1.2);
}
```

## 性能优化

更多性能优化建议请参考[性能优化指南](./performance.md)。

### 1. 避免过度使用滤镜

```css
/* 不推荐 */
.element {
    filter: 
        blur(5px)
        brightness(1.2)
        contrast(1.5)
        grayscale(0.5)
        hue-rotate(45deg)
        invert(0.2)
        opacity(0.8)
        saturate(1.5)
        sepia(0.3);
}

/* 推荐 */
.element {
    filter: brightness(1.2) contrast(1.2);
}
```

### 2. 使用 will-change

```css
.element {
    will-change: filter;
    filter: blur(5px);
}
```

### 3. 考虑降级方案

```css
@supports not (filter: blur(5px)) {
    .element {
        /* 降级效果 */
        opacity: 0.8;
    }
}
```

## 常见问题解决

### 1. 滤镜性能问题

```css
.element {
    /* 使用 transform 强制 GPU 加速 */
    transform: translateZ(0);
    filter: blur(5px);
}
```

### 2. 滤镜叠加问题

```css
/* 不推荐 */
.element {
    filter: blur(5px);
}
.element:hover {
    filter: brightness(1.2); /* 会覆盖之前的 blur */
}

/* 推荐 */
.element {
    filter: blur(5px) brightness(1);
}
.element:hover {
    filter: blur(5px) brightness(1.2);
}
```

### 3. 浏览器兼容性

```css
.element {
    /* 添加前缀 */
    -webkit-filter: blur(5px);
    filter: blur(5px);
    
    /* 提供降级方案 */
    @supports not (filter: blur(5px)) {
        opacity: 0.8;
    }
}
```

## 最佳实践

1. 合理使用滤镜效果
2. 注意滤镜的性能影响
3. 提供降级方案
4. 考虑移动设备性能
5. 避免过度使用滤镜
6. 注意滤镜的可访问性
7. 测试不同浏览器表现
8. 使用适当的滤镜组合
9. 考虑滤镜的动画效果
10. 保持滤镜效果简单明了

## 相关资源

- [MDN CSS Filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- [CSS Filter Effects](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Filter_Effects)
- [CSS Filter Performance](https://web.dev/animations-guide/)
- [CSS Filter Tools](https://css-tricks.com/almanac/properties/f/filter/)
- [CSS 动画基础](./css3.md)
- [CSS 动画示例](./css3-examples.md)
- [性能优化指南](./performance.md)
- [动画设计原则](./principles.md)
- [高级动画示例](./advanced-examples.md) 