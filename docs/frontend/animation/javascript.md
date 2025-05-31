# JavaScript 动画

> 本文档介绍 JavaScript 动画的实现方法。如果您想了解其他类型的动画，请参考：
> - [CSS3 动画](./css3.md) - CSS3 动画基础
> - [Canvas 动画](./canvas-animation.md) - Canvas 动画实现
> - [SVG 动画](./svg.md) - SVG 动画效果
> - [动画库](./animation-libraries.md) - 常用动画库介绍

JavaScript 动画提供了最大的灵活性和控制力，可以实现复杂的动画效果。本章节将介绍使用原生 JavaScript 和动画库实现动画效果的方法。

## 1. 原生 JavaScript 动画

### 1.1 动画基础类

```javascript
class Animation {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            duration: 1000,
            easing: 'linear',
            ...options
        };
        this.startTime = null;
        this.isAnimating = false;
    }

    animate(properties) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.startTime = performance.now();
        this.initialProperties = this.getInitialProperties(properties);
        this.targetProperties = properties;
        
        requestAnimationFrame(this.update.bind(this));
    }

    getInitialProperties(properties) {
        const computedStyle = window.getComputedStyle(this.element);
        return Object.keys(properties).reduce((acc, key) => {
            acc[key] = parseFloat(computedStyle[key]) || 0;
            return acc;
        }, {});
    }

    update(currentTime) {
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.options.duration, 1);
        
        if (progress < 1) {
            this.updateProperties(progress);
            requestAnimationFrame(this.update.bind(this));
        } else {
            this.updateProperties(1);
            this.isAnimating = false;
            this.options.onComplete?.();
        }
    }

    updateProperties(progress) {
        const easedProgress = this.ease(progress);
        
        Object.keys(this.targetProperties).forEach(property => {
            const start = this.initialProperties[property];
            const end = this.targetProperties[property];
            const current = start + (end - start) * easedProgress;
            
            this.element.style[property] = `${current}px`;
        });
    }

    ease(progress) {
        const easings = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };
        
        return easings[this.options.easing]?.(progress) || progress;
    }
}

// 使用示例
const element = document.querySelector('.animated-element');
const animation = new Animation(element, {
    duration: 1000,
    easing: 'easeInOutQuad',
    onComplete: () => console.log('动画完成')
});

animation.animate({
    transform: 'translateX(200px)',
    opacity: 0.5
});
```

### 1.2 基础动画效果

#### 滚动动画

```javascript
// 滚动到顶部
function scrollToTop() {
    const duration = 1000;
    const start = window.pageYOffset;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeProgress = easeInOutQuad(progress);
        window.scrollTo(0, start * (1 - easeProgress));
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// 滚动到元素
function scrollToElement(element) {
    const duration = 1000;
    const start = window.pageYOffset;
    const target = element.getBoundingClientRect().top + start;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = easeInOutQuad(progress);
        window.scrollTo(0, start + (target - start) * easeProgress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}
```

#### 元素动画

```javascript
// 淡入淡出动画
class FadeAnimation {
    constructor(element) {
        this.element = element;
        this.duration = 500;
    }
    
    fadeIn() {
        this.element.style.display = 'block';
        this.element.style.opacity = 0;
        
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            this.element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    fadeOut() {
        const startTime = performance.now();
        const startOpacity = parseFloat(getComputedStyle(this.element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            this.element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// 移动动画
class MoveAnimation {
    constructor(element) {
        this.element = element;
        this.duration = 1000;
    }
    
    moveTo(x, y) {
        const startX = parseFloat(getComputedStyle(this.element).transform.split(',')[4]) || 0;
        const startY = parseFloat(getComputedStyle(this.element).transform.split(',')[5]) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            const easeProgress = easeInOutQuad(progress);
            const currentX = startX + (x - startX) * easeProgress;
            const currentY = startY + (y - startY) * easeProgress;
            
            this.element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}
```

### 1.3 交互式动画

#### 拖拽动画

```javascript
class Draggable {
    constructor(element) {
        this.element = element;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.elementX = 0;
        this.elementY = 0;
        
        this.init();
    }
    
    // ... existing code ...
}

// 使用示例
const element = document.querySelector('.draggable');
new Draggable(element);
```

#### 缩放动画

```javascript
class Zoomable {
    constructor(element) {
        this.element = element;
        this.scale = 1;
        this.init();
    }
    
    // ... existing code ...
}

// 使用示例
const element = document.querySelector('.zoomable');
new Zoomable(element);
```

### 1.4 高级动画效果

#### 视差滚动

```javascript
class ParallaxScroll {
    constructor(elements) {
        this.elements = elements;
        this.scrollY = window.pageYOffset;
        this.init();
    }
    
    // ... existing code ...
}

// 使用示例
const elements = document.querySelectorAll('.parallax');
new ParallaxScroll(elements);
```

#### 3D 卡片效果

```javascript
class Card3D {
    constructor(element) {
        this.element = element;
        this.init();
    }
    
    // ... existing code ...
}

// 使用示例
const cards = document.querySelectorAll('.card-3d');
cards.forEach(card => new Card3D(card));
```

## 2. 动画库使用

### 2.1 GSAP

> 更多 GSAP 相关内容，请参考 [GSAP 动画库](./gsap.md)

```javascript
// 基础动画
gsap.to(".element", {
    duration: 1,
    x: 100,
    y: 100,
    rotation: 360,
    ease: "power2.out"
});

// 时间轴动画
const tl = gsap.timeline();
tl.to(".element1", { duration: 1, x: 100 })
  .to(".element2", { duration: 1, y: 100 })
  .to(".element3", { duration: 1, rotation: 360 });
```

### 2.2 Anime.js

```javascript
// 创建动画管理器
class AnimeManager {
    constructor() {
        this.animations = new Map();
    }
    
    // ... existing code ...
}

// 使用示例
const animeManager = new AnimeManager();
```

## 3. 性能优化

### 3.1 动画优化

1. **使用 requestAnimationFrame**
   - 避免使用 setInterval 或 setTimeout
   - 确保动画在浏览器重绘前执行
   - 使用 `performance.now()` 计算精确时间

2. **避免频繁操作 DOM**
   ```javascript
   // 批量更新 DOM
   function batchUpdate(elements, updates) {
       requestAnimationFrame(() => {
           elements.forEach((element, index) => {
               const update = updates[index];
               Object.assign(element.style, update);
           });
       });
   }
   ```

3. **使用 transform 和 opacity**
   ```javascript
   // 推荐：使用 transform
   function animateWithTransform(element) {
       element.style.transform = `translateX(${x}px) translateY(${y}px)`;
   }

   // 不推荐：直接修改位置
   function animateWithPosition(element) {
       element.style.left = `${x}px`;
       element.style.top = `${y}px`;
   }
   ```

4. **使用 will-change**
   ```javascript
   // 提示浏览器优化
   function prepareForAnimation(element) {
       element.style.willChange = 'transform, opacity';
       
       // 动画结束后移除
       element.addEventListener('transitionend', () => {
           element.style.willChange = 'auto';
       }, { once: true });
   }
   ```

### 3.2 内存管理

1. 及时清理动画实例
2. 使用对象池管理频繁创建的对象
3. 避免闭包导致的内存泄漏
4. 使用 WeakMap 存储动画引用

## 4. 最佳实践

1. 使用 requestAnimationFrame
2. 避免频繁 DOM 操作
3. 使用 transform 和 opacity
4. 注意内存管理
5. 提供降级方案
6. 考虑移动设备
7. 优化性能
8. 测试不同设备

## 5. 实际应用场景

### 5.1 页面过渡动画
- 页面切换效果
- 内容加载动画
- 滚动提示动画

### 5.2 用户交互反馈
- 按钮点击效果
- 表单验证动画
- 拖拽排序效果

### 5.3 数据可视化
- 图表动画
- 进度指示器
- 数字计数动画

### 5.4 游戏动画
- 角色动画
- 粒子效果
- 物理动画

## 相关资源

- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Animation Performance](https://web.dev/animations-guide/)
- [JavaScript Animation Libraries](https://github.com/animate-css/animate.css)
- [动画性能优化](./performance.md) - 详细的性能优化指南
- [动画最佳实践](./best-practices.md) - 动画开发最佳实践
- [动画示例](./examples.md) - 更多动画示例
- [动画工具与资源](./tools.md) - 动画开发工具和资源 