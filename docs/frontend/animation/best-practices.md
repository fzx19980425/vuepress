# 动画最佳实践

## 设计原则

### 1. 保持简洁

动画应该服务于用户体验，而不是分散注意力：

```css
/* 好的做法：简单明确的动画 */
.button {
    transition: transform 0.2s ease;
}

.button:hover {
    transform: scale(1.05);
}

/* 避免：过度复杂的动画 */
.button {
    animation: complexAnimation 2s infinite;
}

@keyframes complexAnimation {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.1) rotate(5deg); }
    50% { transform: scale(1) rotate(0deg); }
    75% { transform: scale(0.9) rotate(-5deg); }
    100% { transform: scale(1) rotate(0deg); }
}
```

### 2. 考虑用户体验

```css
/* 提供动画控制选项 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}

/* 使用适当的动画时长 */
.quick-feedback {
    transition: all 0.2s ease;  /* 快速反馈 */
}

.page-transition {
    transition: all 0.5s ease;  /* 页面过渡 */
}
```

### 3. 动画时序

```css
/* 使用合适的缓动函数 */
.element {
    /* 自然的感觉 */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* 弹性效果 */
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    /* 快速进入，慢速退出 */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 开发规范

### 1. 命名规范

```css
/* 使用语义化的命名 */
.animate-fade-in { }
.animate-slide-up { }
.animate-bounce { }

/* 避免使用无意义的命名 */
.animation1 { }
.animation2 { }
.animation3 { }
```

### 2. 代码组织

```scss
// 使用 SCSS 组织动画代码
// _animations.scss

// 基础动画
@mixin fade-in {
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    animation: fadeIn 0.3s ease;
}

// 使用动画
.element {
    @include fade-in;
}
```

### 3. 动画类管理

```javascript
// 动画类管理工具
class AnimationManager {
    static add(element, className) {
        element.classList.add(className);
        return new Promise(resolve => {
            element.addEventListener('animationend', () => {
                element.classList.remove(className);
                resolve();
            }, { once: true });
        });
    }
}

// 使用示例
async function showElement(element) {
    await AnimationManager.add(element, 'animate-fade-in');
    // 动画结束后的操作
}
```

## 实现技巧

### 1. 链式动画

```javascript
// 使用 Promise 管理动画序列
async function animateSequence(element) {
    await AnimationManager.add(element, 'animate-fade-in');
    await AnimationManager.add(element, 'animate-slide-up');
    await AnimationManager.add(element, 'animate-bounce');
}
```

### 2. 动画状态管理

```javascript
// 使用状态管理控制动画
class AnimationState {
    constructor() {
        this.isAnimating = false;
        this.currentAnimation = null;
    }

    start(animation) {
        if (this.isAnimating) {
            this.stop();
        }
        this.isAnimating = true;
        this.currentAnimation = animation;
    }

    stop() {
        this.isAnimating = false;
        this.currentAnimation = null;
    }
}
```

### 3. 响应式动画

```javascript
// 根据设备性能调整动画
class ResponsiveAnimation {
    static async init() {
        const fps = await this.measureFPS();
        if (fps < 30) {
            this.enableLowPerformanceMode();
        }
    }

    static async measureFPS() {
        // 测量设备性能
        return new Promise(resolve => {
            let frames = 0;
            let lastTime = performance.now();
            
            function countFrame() {
                frames++;
                const currentTime = performance.now();
                if (currentTime - lastTime >= 1000) {
                    resolve(frames);
                    return;
                }
                requestAnimationFrame(countFrame);
            }
            
            requestAnimationFrame(countFrame);
        });
    }

    static enableLowPerformanceMode() {
        document.documentElement.classList.add('low-performance');
    }
}
```

## 可访问性考虑

### 1. 减少动画

```css
/* 为偏好减少动画的用户提供选项 */
@media (prefers-reduced-motion: reduce) {
    .animated-element {
        animation: none !important;
        transition: none !important;
    }
}
```

### 2. 动画控制

```html
<!-- 提供动画控制选项 -->
<div class="animation-controls">
    <button onclick="toggleAnimations()">暂停动画</button>
    <button onclick="reduceMotion()">减少动画</button>
</div>

<script>
function toggleAnimations() {
    document.body.classList.toggle('animations-paused');
}

function reduceMotion() {
    document.body.classList.add('reduced-motion');
}
</script>
```

### 3. 焦点管理

```css
/* 确保动画不影响焦点状态 */
.animated-element:focus {
    animation: none;
    outline: 2px solid #007bff;
}
```

## 测试与调试

### 1. 动画测试

```javascript
// 动画测试工具
class AnimationTester {
    static async testAnimation(element, className) {
        const start = performance.now();
        await AnimationManager.add(element, className);
        const duration = performance.now() - start;
        
        console.log(`动画执行时间: ${duration}ms`);
        return duration < 100; // 性能检查
    }
}
```

### 2. 调试工具

```javascript
// 动画调试工具
class AnimationDebugger {
    static log(element) {
        const computedStyle = window.getComputedStyle(element);
        console.log({
            transform: computedStyle.transform,
            transition: computedStyle.transition,
            animation: computedStyle.animation
        });
    }
}
```

## 检查清单

- [ ] 动画是否简洁明了
- [ ] 是否考虑了性能影响
- [ ] 是否提供了动画控制选项
- [ ] 是否支持可访问性
- [ ] 是否使用了合适的动画时长
- [ ] 是否考虑了不同设备的性能
- [ ] 是否遵循了命名规范
- [ ] 是否实现了适当的错误处理
- [ ] 是否提供了降级方案
- [ ] 是否进行了充分的测试

## 相关资源

- [Web Animation Guidelines](https://www.w3.org/TR/web-animations-1/)
- [Material Design Motion](https://material.io/design/motion)
- [A11Y Project Animation](https://www.a11yproject.com/posts/2013-12-11-never-remove-css-outlines/)
- [Animation Performance](https://web.dev/animations-guide/) 