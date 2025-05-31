# requestAnimationFrame

## 基础概念

`requestAnimationFrame` 是一个用于执行动画的 Web API，它会在浏览器下一次重绘之前调用指定的回调函数。相比 `setTimeout` 和 `setInterval`，它能够提供更流畅的动画效果，并且能够自动适应设备的刷新率。

### 基本语法

```javascript
// 基本用法
const animationId = requestAnimationFrame(callback);

// 取消动画
cancelAnimationFrame(animationId);
```

## 使用示例

### 1. 基础动画

```javascript
// 简单的移动动画
function animate() {
    const element = document.querySelector('.animated-element');
    let position = 0;
    
    function updatePosition() {
        position += 1;
        element.style.transform = `translateX(${position}px)`;
        
        if (position < 200) {
            requestAnimationFrame(updatePosition);
        }
    }
    
    requestAnimationFrame(updatePosition);
}
```

### 2. 平滑动画

```javascript
// 使用时间戳实现平滑动画
function smoothAnimate() {
    const element = document.querySelector('.smooth-element');
    const startTime = performance.now();
    const duration = 1000; // 动画持续时间（毫秒）
    
    function update(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeProgress = easeInOutQuad(progress);
        element.style.transform = `translateX(${easeProgress * 200}px)`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 缓动函数
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
```

### 3. 性能监控

```javascript
// 监控动画性能
function monitorAnimation() {
    let lastTime = performance.now();
    let frames = 0;
    
    function countFrames(timestamp) {
        frames++;
        
        if (timestamp - lastTime >= 1000) {
            console.log(`FPS: ${frames}`);
            frames = 0;
            lastTime = timestamp;
        }
        
        requestAnimationFrame(countFrames);
    }
    
    requestAnimationFrame(countFrames);
}
```

## 高级用法

### 1. 动画循环

```javascript
class AnimationLoop {
    constructor() {
        this.isRunning = false;
        this.animationId = null;
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }
    
    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        // 执行动画逻辑
        this.update();
        this.render();
        
        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    update() {
        // 更新动画状态
    }
    
    render() {
        // 渲染动画
    }
}
```

### 2. 多动画管理

```javascript
class AnimationManager {
    constructor() {
        this.animations = new Map();
    }
    
    addAnimation(id, animation) {
        this.animations.set(id, {
            animation,
            isRunning: false,
            animationId: null
        });
    }
    
    startAnimation(id) {
        const anim = this.animations.get(id);
        if (anim && !anim.isRunning) {
            anim.isRunning = true;
            this.runAnimation(id);
        }
    }
    
    stopAnimation(id) {
        const anim = this.animations.get(id);
        if (anim && anim.isRunning) {
            anim.isRunning = false;
            cancelAnimationFrame(anim.animationId);
        }
    }
    
    runAnimation(id) {
        const anim = this.animations.get(id);
        if (anim && anim.isRunning) {
            anim.animation();
            anim.animationId = requestAnimationFrame(() => this.runAnimation(id));
        }
    }
}
```

### 3. 动画队列

```javascript
class AnimationQueue {
    constructor() {
        this.queue = [];
        this.isRunning = false;
    }
    
    add(animation) {
        this.queue.push(animation);
        if (!this.isRunning) {
            this.run();
        }
    }
    
    run() {
        if (this.queue.length === 0) {
            this.isRunning = false;
            return;
        }
        
        this.isRunning = true;
        const animation = this.queue[0];
        
        animation(() => {
            this.queue.shift();
            this.run();
        });
    }
}
```

## 性能优化

### 1. 使用 transform

```javascript
// 推荐：使用 transform
function animateWithTransform() {
    const element = document.querySelector('.element');
    let position = 0;
    
    function update() {
        position += 1;
        element.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}

// 不推荐：直接修改位置
function animateWithPosition() {
    const element = document.querySelector('.element');
    let position = 0;
    
    function update() {
        position += 1;
        element.style.left = `${position}px`; // 会触发重排
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}
```

### 2. 批量更新

```javascript
// 批量更新 DOM
function batchUpdate() {
    const updates = [];
    const element = document.querySelector('.element');
    
    function update() {
        // 收集更新
        updates.push(() => {
            element.style.transform = `translateX(${Math.random() * 100}px)`;
            element.style.opacity = Math.random();
        });
        
        // 批量应用更新
        if (updates.length >= 10) {
            requestAnimationFrame(() => {
                updates.forEach(update => update());
                updates.length = 0;
            });
        }
        
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}
```

### 3. 节流和防抖

```javascript
// 节流
function throttle(callback, limit) {
    let waiting = false;
    
    return function() {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            requestAnimationFrame(() => {
                waiting = false;
            });
        }
    };
}

// 防抖
function debounce(callback, delay) {
    let timeoutId;
    
    return function() {
        cancelAnimationFrame(timeoutId);
        timeoutId = requestAnimationFrame(() => {
            callback.apply(this, arguments);
        });
    };
}
```

## 常见问题解决

### 1. 动画卡顿

```javascript
// 使用 transform 和 opacity
function smoothAnimation() {
    const element = document.querySelector('.element');
    let startTime = null;
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        
        // 使用 transform 代替位置属性
        element.style.transform = `translateX(${progress * 0.1}px)`;
        
        if (progress < 1000) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}
```

### 2. 内存泄漏

```javascript
class SafeAnimation {
    constructor() {
        this.isRunning = false;
        this.animationId = null;
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // 动画逻辑
        this.update();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    update() {
        // 更新逻辑
    }
}
```

### 3. 页面可见性

```javascript
// 处理页面可见性
function handleVisibility() {
    let animationId = null;
    
    function animate() {
        // 动画逻辑
        animationId = requestAnimationFrame(animate);
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}
```

## 最佳实践

1. 使用 transform 和 opacity 进行动画
2. 避免在动画中修改布局属性
3. 合理使用节流和防抖
4. 注意内存管理
5. 处理页面可见性
6. 提供降级方案
7. 监控动画性能
8. 考虑移动设备性能

## 相关资源

- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Animation Performance](https://web.dev/animations-guide/)
- [Animation Timing](https://www.w3.org/TR/animation-timing/)
- [Animation Best Practices](https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance) 