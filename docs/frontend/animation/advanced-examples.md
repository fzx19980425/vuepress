# 高级动画示例

## 3D 动画效果

### 1. 3D 卡片效果

```javascript
class Card3D {
    constructor(element) {
        this.element = element;
        this.rotationX = 0;
        this.rotationY = 0;
        this.init();
    }
    
    init() {
        // 设置透视效果
        this.element.style.perspective = '1000px';
        this.element.style.transformStyle = 'preserve-3d';
        
        // 添加鼠标移动事件
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 计算旋转角度
            this.rotationY = ((x / rect.width) - 0.5) * 20;
            this.rotationX = ((y / rect.height) - 0.5) * -20;
            
            // 应用变换
            this.updateTransform();
        });
        
        // 添加鼠标离开事件
        this.element.addEventListener('mouseleave', () => {
            this.rotationX = 0;
            this.rotationY = 0;
            this.updateTransform();
        });
    }
    
    updateTransform() {
        this.element.style.transform = `
            rotateX(${this.rotationX}deg)
            rotateY(${this.rotationY}deg)
            scale3d(1.05, 1.05, 1.05)
        `;
    }
}

// 使用示例
const card = new Card3D(document.querySelector('.card'));
```

### 2. 3D 视差滚动

```javascript
class ParallaxScroll {
    constructor() {
        this.layers = document.querySelectorAll('.parallax-layer');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            this.layers.forEach((layer, index) => {
                const speed = layer.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                const zPos = index * -100;
                
                layer.style.transform = `
                    translate3d(0, ${yPos}px, ${zPos}px)
                    scale(${1 + (index * 0.1)})
                `;
            });
        });
    }
}

// HTML 结构示例
/*
<div class="parallax-container">
    <div class="parallax-layer" data-speed="0.2"></div>
    <div class="parallax-layer" data-speed="0.4"></div>
    <div class="parallax-layer" data-speed="0.6"></div>
</div>
*/
```

## 粒子动画效果

### 1. 交互式粒子系统

```javascript
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        // 设置画布大小
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 添加鼠标移动事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // 创建粒子
        this.createParticles();
        
        // 开始动画
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 5 + 1,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5,
                color: `hsl(${Math.random() * 360}, 50%, 50%)`
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // 更新位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 边界检查
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // 鼠标交互
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 100;
                
                particle.x -= Math.cos(angle) * force * 2;
                particle.y -= Math.sin(angle) * force * 2;
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 使用示例
const canvas = document.querySelector('canvas');
const particleSystem = new ParticleSystem(canvas);
```

### 2. 文字粒子效果

```javascript
class TextParticles {
    constructor(canvas, text) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.text = text;
        this.particles = [];
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 创建文字粒子
        this.createTextParticles();
        
        // 开始动画
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createTextParticles() {
        this.ctx.font = 'bold 120px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const textMetrics = this.ctx.measureText(this.text);
        const textWidth = textMetrics.width;
        const textHeight = 120;
        
        const x = this.canvas.width / 2 - textWidth / 2;
        const y = this.canvas.height / 2 - textHeight / 2;
        
        // 获取像素数据
        this.ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2);
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 创建粒子
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] > 128) {
                const x = (i / 4) % this.canvas.width;
                const y = Math.floor((i / 4) / this.canvas.width);
                
                if (x % 5 === 0 && y % 5 === 0) {
                    this.particles.push({
                        x: x,
                        y: y,
                        targetX: x,
                        targetY: y,
                        size: Math.random() * 2 + 1,
                        color: `hsl(${Math.random() * 360}, 50%, 50%)`
                    });
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // 更新位置
            particle.x += (particle.targetX - particle.x) * 0.1;
            particle.y += (particle.targetY - particle.y) * 0.1;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    // 分散粒子
    scatter() {
        this.particles.forEach(particle => {
            particle.targetX = Math.random() * this.canvas.width;
            particle.targetY = Math.random() * this.canvas.height;
        });
    }
    
    // 重组文字
    reassemble() {
        this.createTextParticles();
    }
}

// 使用示例
const canvas = document.querySelector('canvas');
const textParticles = new TextParticles(canvas, 'Hello World');
```

## 高级交互效果

### 1. 磁性按钮效果

```javascript
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.bound = element.getBoundingClientRect();
        this.magneticArea = 100;
        this.init();
    }
    
    init() {
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = this.magneticArea;
            
            if (distance < maxDistance) {
                const power = (maxDistance - distance) / maxDistance;
                const moveX = x * power;
                const moveY = y * power;
                
                this.element.style.transform = `
                    translate(${moveX}px, ${moveY}px)
                    scale(${1 + power * 0.1})
                `;
            } else {
                this.element.style.transform = '';
            }
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = '';
        });
    }
}

// 使用示例
const button = new MagneticButton(document.querySelector('.magnetic-button'));
```

### 2. 视差滚动效果

```javascript
class ParallaxScroller {
    constructor() {
        this.sections = document.querySelectorAll('.parallax-section');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.sections.forEach(section => {
                const speed = section.dataset.speed || 0.5;
                const rect = section.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                
                // 计算视差效果
                const yPos = -(scrolled * speed);
                const opacity = 1 - (rect.top / window.innerHeight);
                const scale = 1 + (rect.top / window.innerHeight) * 0.2;
                
                // 应用变换
                section.style.transform = `
                    translate3d(0, ${yPos}px, 0)
                    scale(${scale})
                `;
                section.style.opacity = opacity;
            });
        });
    }
}

// HTML 结构示例
/*
<div class="parallax-section" data-speed="0.2">
    <h2>Section 1</h2>
</div>
<div class="parallax-section" data-speed="0.4">
    <h2>Section 2</h2>
</div>
<div class="parallax-section" data-speed="0.6">
    <h2>Section 3</h2>
</div>
*/
```

## 性能优化

### 1. 动画性能优化

```javascript
class OptimizedAnimation {
    constructor() {
        this.animations = new Map();
        this.rafId = null;
        this.init();
    }
    
    init() {
        // 使用 Intersection Observer 优化可见性
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const animation = this.animations.get(entry.target);
                    if (animation) {
                        if (entry.isIntersecting) {
                            animation.play();
                        } else {
                            animation.pause();
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );
    }
    
    // 添加动画
    addAnimation(element, animation) {
        this.animations.set(element, animation);
        this.observer.observe(element);
    }
    
    // 移除动画
    removeAnimation(element) {
        this.animations.delete(element);
        this.observer.unobserve(element);
    }
    
    // 批量更新
    batchUpdate() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        this.rafId = requestAnimationFrame(() => {
            this.animations.forEach(animation => {
                if (animation.isPlaying) {
                    animation.update();
                }
            });
            
            this.batchUpdate();
        });
    }
    
    // 清理
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        this.animations.clear();
        this.observer.disconnect();
    }
}
```

### 2. 内存管理

```javascript
class AnimationManager {
    constructor() {
        this.animations = new WeakMap();
        this.cleanupTasks = new Set();
    }
    
    // 创建动画
    createAnimation(element, options) {
        const animation = new Animation(element, options);
        this.animations.set(element, animation);
        
        // 添加清理任务
        const cleanup = () => {
            animation.destroy();
            this.animations.delete(element);
            this.cleanupTasks.delete(cleanup);
        };
        
        this.cleanupTasks.add(cleanup);
        return animation;
    }
    
    // 清理不可见元素
    cleanup() {
        this.cleanupTasks.forEach(cleanup => cleanup());
    }
    
    // 获取动画
    getAnimation(element) {
        return this.animations.get(element);
    }
}

// 使用示例
const manager = new AnimationManager();
const animation = manager.createAnimation(element, {
    duration: 1000,
    easing: 'ease-in-out'
});
```

## 最佳实践

1. 使用 `requestAnimationFrame` 进行动画更新
2. 实现动画的暂停和恢复机制
3. 优化动画性能
4. 注意内存管理
5. 提供降级方案
6. 考虑移动设备性能
7. 使用适当的动画时长
8. 注意动画的可访问性

## 相关资源

- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [CSS Tricks 动画指南](https://css-tricks.com/almanac/properties/a/animation/)
- [Web.dev 动画性能指南](https://web.dev/animations-guide/)
- [Google 动画性能指南](https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance) 