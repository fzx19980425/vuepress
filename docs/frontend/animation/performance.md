# 动画性能优化

## 性能优化的关键指标

在讨论动画性能优化之前，我们需要了解几个关键的性能指标：

1. **FPS (Frames Per Second)**
   - 理想值：60 FPS
   - 最低可接受值：30 FPS
   - 测量方法：使用 Chrome DevTools 的 Performance 面板

2. **帧时间 (Frame Time)**
   - 理想值：16.7ms (60 FPS)
   - 超过 16.7ms 会导致卡顿

3. **重排 (Reflow) 和重绘 (Repaint)**
   - 重排：布局计算
   - 重绘：像素绘制
   - 目标：最小化重排和重绘

## 性能优化策略

### 1. 使用 GPU 加速

```css
/* 触发 GPU 加速的属性 */
.element {
    transform: translateZ(0);
    /* 或 */
    will-change: transform;
    /* 或 */
    backface-visibility: hidden;
}
```

### 2. 优化动画属性

```css
/* 推荐使用的属性 */
.element {
    transform: translateX(100px);  /* 好 */
    opacity: 0.5;                  /* 好 */
}

/* 避免使用的属性 */
.element {
    width: 100px;                  /* 差 */
    margin-left: 100px;            /* 差 */
    padding: 20px;                 /* 差 */
}
```

### 3. 使用 requestAnimationFrame

```javascript
// 好的做法
function animate() {
    element.style.transform = `translateX(${position}px)`;
    position += 1;
    requestAnimationFrame(animate);
}

// 避免使用
setInterval(() => {
    element.style.transform = `translateX(${position}px)`;
    position += 1;
}, 16);
```

### 4. 批量 DOM 操作

```javascript
// 好的做法
function updateElements() {
    requestAnimationFrame(() => {
        // 批量读取
        const heights = elements.map(el => el.offsetHeight);
        
        // 批量写入
        elements.forEach((el, i) => {
            el.style.height = heights[i] + 10 + 'px';
        });
    });
}

// 避免的做法
elements.forEach(el => {
    const height = el.offsetHeight;  // 读取
    el.style.height = height + 10 + 'px';  // 写入
});
```

### 5. 使用 CSS 动画代替 JavaScript 动画

```css
/* 推荐使用 CSS 动画 */
@keyframes slide {
    from { transform: translateX(0); }
    to { transform: translateX(100px); }
}

.element {
    animation: slide 1s ease-in-out;
}

/* 避免使用 JavaScript 动画 */
function animate() {
    element.style.left = (parseFloat(element.style.left) || 0) + 1 + 'px';
    requestAnimationFrame(animate);
}
```

### 6. 优化动画帧数

```javascript
// 使用节流控制动画帧率
function throttle(callback, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            callback.apply(this, args);
        }
    };
}

const throttledAnimate = throttle(() => {
    // 动画逻辑
}, 16);  // 约60fps
```

## 性能检测工具

1. **Chrome DevTools**
   - Performance 面板
   - FPS 计数器
   - 渲染性能分析

2. **Lighthouse**
   - 性能评分
   - 优化建议

3. **Performance API**
```javascript
// 使用 Performance API 测量动画性能
const start = performance.now();
// 执行动画
const end = performance.now();
console.log(`动画执行时间: ${end - start}ms`);
```

## 常见性能问题及解决方案

### 1. 动画卡顿

**问题**：动画不流畅，FPS 低

**解决方案**：
- 使用 transform 代替位置属性
- 减少动画元素数量
- 使用 CSS 动画
- 考虑使用 Canvas/WebGL

### 2. 内存泄漏

**问题**：动画持续运行导致内存占用增加

**解决方案**：
```javascript
class Animation {
    constructor() {
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    animate() {
        if (!this.isRunning) return;
        
        // 动画逻辑
        requestAnimationFrame(() => this.animate());
    }
}
```

### 3. 移动设备性能

**问题**：在移动设备上性能较差

**解决方案**：
- 使用 `@media (prefers-reduced-motion)` 提供替代方案
- 降低动画复杂度
- 提供性能模式选项

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

## 性能优化检查清单

- [ ] 使用 transform 和 opacity 进行动画
- [ ] 避免频繁触发重排
- [ ] 使用 requestAnimationFrame
- [ ] 批量处理 DOM 操作
- [ ] 适当使用 will-change
- [ ] 考虑使用 CSS 动画
- [ ] 实现动画节流
- [ ] 提供性能模式选项
- [ ] 考虑可访问性
- [ ] 测试不同设备性能

## 相关资源

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [Animation Performance](https://web.dev/animations-guide/)
- [CSS Triggers](https://csstriggers.com/) 