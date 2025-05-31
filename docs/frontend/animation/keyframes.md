# CSS 关键帧动画

> CSS 关键帧动画（@keyframes）允许我们创建更复杂的动画序列，通过定义动画过程中的关键状态来实现平滑的动画效果。本文档将详细介绍关键帧动画的使用方法和最佳实践。更多示例请参考 [CSS 动画示例](./css3-examples.md)。

## 目录

- [基础概念](#基础概念)
- [动画属性](#动画属性)
- [常见动画](#常见动画效果)
- [高级技巧](#高级动画技巧)
- [性能优化](#性能优化)
- [常见问题](#常见问题解决)
- [最佳实践](#最佳实践)
- [相关资源](#相关资源)

## 基础概念

关键帧动画是 CSS3 中用于创建复杂动画的强大工具。它通过定义动画序列中的关键点（关键帧）来控制动画的中间状态。更多基础概念请参考 [CSS 动画基础](./css3.md)。

### 基本语法

```css
@keyframes animationName {
    /* 使用百分比定义关键帧 */
    0% {
        /* 初始状态 */
        transform: translateX(0);
    }
    50% {
        /* 中间状态 */
        transform: translateX(100px);
    }
    100% {
        /* 结束状态 */
        transform: translateX(0);
    }
}

.element {
    animation: animationName 2s ease-in-out infinite;
}
```

## 动画属性

### 1. animation-name

指定要使用的关键帧动画名称。

```css
.element {
    animation-name: slide;
}

@keyframes slide {
    from { transform: translateX(0); }
    to { transform: translateX(100px); }
}
```

### 2. animation-duration

指定动画完成一个周期所需的时间。

```css
.element {
    animation-name: bounce;
    animation-duration: 1s;
}
```

### 3. animation-timing-function

定义动画的速度曲线。更多缓动函数示例请参考 [CSS 动画示例](./css3-examples.md)。

```css
.element {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4. animation-delay

指定动画开始前的延迟时间。

```css
.element {
    animation-delay: 0.5s;
}
```

### 5. animation-iteration-count

指定动画的重复次数。

```css
.element {
    /* 无限循环 */
    animation-iteration-count: infinite;
    
    /* 重复 3 次 */
    animation-iteration-count: 3;
}
```

### 6. animation-direction

指定动画是否反向播放。

```css
.element {
    /* 交替反向播放 */
    animation-direction: alternate;
}
```

### 7. animation-fill-mode

指定动画在播放前和播放后的状态。

```css
.element {
    /* 保持最后一帧的状态 */
    animation-fill-mode: forwards;
}
```

### 8. animation-play-state

控制动画的播放状态。

```css
.element {
    /* 暂停动画 */
    animation-play-state: paused;
}
```

## 常见动画效果

### 1. 淡入淡出

```css
@keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
}

.fade-element {
    animation: fade 1s ease-in-out;
}
```

### 2. 弹跳效果

```css
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
}

.bounce-element {
    animation: bounce 1s ease-in-out infinite;
}
```

### 3. 旋转效果

```css
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.rotate-element {
    animation: rotate 2s linear infinite;
}
```

### 4. 缩放效果

```css
@keyframes scale {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.scale-element {
    animation: scale 1s ease-in-out infinite;
}
```

## 高级动画技巧

### 1. 多关键帧动画

```css
@keyframes complex {
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(100px, 0) rotate(90deg); }
    50% { transform: translate(100px, 100px) rotate(180deg); }
    75% { transform: translate(0, 100px) rotate(270deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
}
```

### 2. 动画组合

```css
.element {
    animation: 
        fade 1s ease-in-out,
        slide 2s ease-in-out 1s,
        scale 1s ease-in-out 2s;
}
```

### 3. 动画暂停和恢复

```javascript
// 使用 JavaScript 控制动画
element.style.animationPlayState = 'paused';
element.style.animationPlayState = 'running';
```

## 性能优化

更多性能优化建议请参考[性能优化指南](./performance.md)。

### 1. 使用 transform 和 opacity

```css
@keyframes optimized {
    from { 
        transform: translateX(0);
        opacity: 0;
    }
    to { 
        transform: translateX(100px);
        opacity: 1;
    }
}
```

### 2. 避免动画过多属性

```css
/* 不推荐 */
@keyframes heavy {
    0% { 
        transform: translateX(0);
        width: 100px;
        height: 100px;
        background: red;
        border-radius: 0;
    }
    100% { 
        transform: translateX(100px);
        width: 200px;
        height: 200px;
        background: blue;
        border-radius: 50%;
    }
}

/* 推荐 */
@keyframes light {
    0% { transform: translateX(0); }
    100% { transform: translateX(100px); }
}
```

### 3. 使用 will-change

```css
.element {
    will-change: transform;
    animation: slide 1s ease-in-out;
}
```

## 常见问题解决

### 1. 动画不流畅

```css
.element {
    /* 使用 transform 代替位置属性 */
    animation: slide 1s ease-in-out;
    /* 避免使用 left, top 等属性 */
}
```

### 2. 动画闪烁

```css
.element {
    /* 使用 transform3d 强制 GPU 加速 */
    transform: translate3d(0, 0, 0);
    animation: slide 1s ease-in-out;
}
```

### 3. 动画性能问题

```css
@media (prefers-reduced-motion: reduce) {
    .element {
        /* 为偏好减少动画的用户提供替代方案 */
        animation: none;
    }
}
```

## 最佳实践

1. 保持动画时间在 0.2s 到 1s 之间
2. 使用适当的缓动函数
3. 避免同时运行太多动画
4. 考虑使用 transform 和 opacity
5. 注意移动设备性能
6. 提供降级方案
7. 考虑动画的可访问性
8. 测试不同浏览器表现
9. 使用 prefers-reduced-motion 媒体查询
10. 避免动画过于复杂

## 相关资源

- [MDN CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [CSS Animation Timing Functions](https://easings.net/)
- [CSS Animation Performance](https://web.dev/animations-guide/)
- [CSS Animation Tools](https://cubic-bezier.com/)
- [CSS 动画基础](./css3.md)
- [CSS 动画示例](./css3-examples.md)
- [性能优化指南](./performance.md)
- [动画设计原则](./principles.md)
- [高级动画示例](./advanced-examples.md) 