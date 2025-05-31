# CSS3 动画

> CSS3 提供了强大的动画功能，可以实现各种视觉效果。本文档将介绍 CSS3 动画的基本概念和高级应用。更多示例请参考 [CSS 动画示例](./css3-examples.md)。

## 目录

- [过渡动画](#1-过渡动画-transitions)
- [关键帧动画](#2-关键帧动画-keyframes)
- [变换动画](#3-变换-transforms)
- [性能优化](#5-性能优化建议)
- [浏览器兼容性](#6-浏览器兼容性)
- [相关资源](#7-相关资源)

## 1. 过渡动画 (Transitions)

过渡动画是 CSS3 中最基础的动画形式，用于在元素状态改变时平滑过渡。详细内容请参考[过渡动画详解](./transitions.md)。

### 1.1 基础过渡

```css
.transition-element {
  transition: all 0.3s ease-in-out;
}

.transition-element:hover {
  transform: scale(1.1);
  background-color: #f0f0f0;
}
```

### 1.2 多属性过渡

```css
.multi-transition {
  transition: 
    transform 0.3s ease-out,
    background-color 0.5s ease-in,
    box-shadow 0.4s ease-in-out;
}

.multi-transition:hover {
  transform: translateY(-10px);
  background-color: #e0e0e0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
```

### 1.3 过渡管理器

```javascript
class TransitionManager {
  constructor(element) {
    this.element = element;
    this.transitions = new Map();
  }

  addTransition(property, duration, timing = 'ease', delay = 0) {
    const transition = `${property} ${duration}s ${timing} ${delay}s`;
    this.transitions.set(property, transition);
    this.updateTransitions();
  }

  removeTransition(property) {
    this.transitions.delete(property);
    this.updateTransitions();
  }

  updateTransitions() {
    this.element.style.transition = Array.from(this.transitions.values()).join(', ');
  }
}
```

## 2. 关键帧动画 (Keyframes)

关键帧动画允许我们创建更复杂的动画序列。详细内容请参考[关键帧动画详解](./keyframes.md)。

### 2.1 基础关键帧

```css
@keyframes slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-element {
  animation: slide 1s ease-out;
}
```

### 2.2 多步骤关键帧

```css
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
  75% {
    transform: translateY(25px);
  }
  100% {
    transform: translateY(0);
  }
}

.bounce-element {
  animation: bounce 1s ease-in-out infinite;
}
```

### 2.3 动画管理器

```javascript
class AnimationManager {
  constructor(element) {
    this.element = element;
    this.animations = new Map();
  }

  addAnimation(name, keyframes, options = {}) {
    const animation = this.element.animate(keyframes, {
      duration: options.duration || 1000,
      easing: options.easing || 'ease',
      iterations: options.iterations || 1,
      delay: options.delay || 0,
      fill: options.fill || 'forwards'
    });

    this.animations.set(name, animation);
    return animation;
  }

  stopAnimation(name) {
    const animation = this.animations.get(name);
    if (animation) {
      animation.cancel();
      this.animations.delete(name);
    }
  }

  pauseAnimation(name) {
    const animation = this.animations.get(name);
    if (animation) {
      animation.pause();
    }
  }

  resumeAnimation(name) {
    const animation = this.animations.get(name);
    if (animation) {
      animation.play();
    }
  }
}
```

## 3. 变换 (Transforms)

变换是 CSS3 中用于改变元素形状、大小和位置的功能。详细内容请参考[变换动画详解](./transform.md)。

### 3.1 2D 变换

```css
.transform-2d {
  transform: 
    translate(100px, 100px)
    rotate(45deg)
    scale(1.5)
    skew(10deg, 10deg);
}
```

### 3.2 3D 变换

```css
.transform-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: 
    rotateX(45deg)
    rotateY(45deg)
    translateZ(100px);
}
```

### 3.3 变换管理器

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

## 4. 滤镜效果 (Filters)

CSS3 滤镜可以创建各种视觉效果。详细内容请参考[滤镜效果详解](./filters.md)。

```css
.filter-element {
  filter: 
    blur(5px)
    brightness(1.2)
    contrast(1.5)
    grayscale(0.5)
    hue-rotate(90deg)
    invert(0.2)
    opacity(0.8)
    saturate(1.5)
    sepia(0.3);
}
```

## 5. 性能优化建议

更多性能优化建议请参考[性能优化指南](./performance.md)。

1. **使用 transform 和 opacity**
   - 优先使用 transform 代替位置属性
   - 使用 opacity 代替 visibility
   - 避免使用 left/top 等属性

2. **使用 will-change**
   - 提前告知浏览器动画属性
   - 合理使用，避免过度使用
   - 动画结束后移除

3. **使用 GPU 加速**
   - 使用 transform3d 强制 GPU 加速
   - 使用 backface-visibility: hidden
   - 使用 perspective 属性

4. **优化动画性能**
   - 避免同时运行太多动画
   - 使用简短的动画持续时间
   - 使用适当的缓动函数

5. **减少重排重绘**
   - 使用 transform 代替位置属性
   - 使用 opacity 代替 visibility
   - 避免频繁修改布局属性

## 6. 浏览器兼容性

1. **前缀处理**
   - 使用 Autoprefixer 自动添加前缀
   - 考虑使用 PostCSS 处理兼容性
   - 测试不同浏览器表现

2. **降级方案**
   - 提供 JavaScript 降级方案
   - 使用 Modernizr 检测特性支持
   - 考虑使用 polyfill

## 7. 相关资源

- [MDN CSS 动画](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)
- [CSS 动画性能优化](https://www.html5rocks.com/zh/tutorials/speed/high-performance-animations/)
- [CSS 动画库](https://animate.style/)
- [CSS 动画工具](https://cubic-bezier.com/)
- [CSS 动画最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations)
- [动画设计原则](./principles.md)
- [动画示例](./examples.md)
- [高级动画示例](./advanced-examples.md) 