# Canvas 动画实现

> 本文档介绍 Canvas 动画的实现方法。如果您需要了解 Canvas 的基础知识，请先阅读 [Canvas 基础](./canvas.md)。

## 基础动画效果

### 1. 简单动画

```javascript
class SimpleAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = 0;
        this.y = 0;
        this.speed = 2;
        this.init();
    }

    init() {
        // 设置画布大小
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 开始动画
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新位置
        this.x += this.speed;
        if (this.x > this.canvas.width) {
            this.x = 0;
        }
        
        // 绘制
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 继续动画
        requestAnimationFrame(() => this.animate());
    }
}
```

### 2. 缓动动画

```javascript
class EasingAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = 0;
        this.targetX = 0;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => {
            this.targetX = e.clientX;
        });
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // 缓动函数
    easeOutQuad(t) {
        return t * (2 - t);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 计算缓动
        const dx = this.targetX - this.x;
        this.x += dx * 0.1;
        
        // 绘制
        this.ctx.fillStyle = 'blue';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.canvas.height / 2, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        requestAnimationFrame(() => this.animate());
    }
}
```

## 高级动画效果

### 1. 粒子系统

```javascript
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
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
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}
```

### 2. 物理动画

```javascript
class PhysicsAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.balls = [];
        this.gravity = 0.5;
        this.friction = 0.99;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createBalls();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createBalls() {
        for (let i = 0; i < 10; i++) {
            this.balls.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height / 2,
                radius: Math.random() * 20 + 10,
                speedX: Math.random() * 4 - 2,
                speedY: 0,
                color: `hsl(${Math.random() * 360}, 50%, 50%)`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.balls.forEach(ball => {
            // 应用重力
            ball.speedY += this.gravity;
            
            // 更新位置
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            
            // 应用摩擦力
            ball.speedX *= this.friction;
            ball.speedY *= this.friction;
            
            // 碰撞检测
            if (ball.x + ball.radius > this.canvas.width) {
                ball.x = this.canvas.width - ball.radius;
                ball.speedX *= -0.8;
            }
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.speedX *= -0.8;
            }
            if (ball.y + ball.radius > this.canvas.height) {
                ball.y = this.canvas.height - ball.radius;
                ball.speedY *= -0.8;
            }
            if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.speedY *= -0.8;
            }
            
            // 绘制球
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = ball.color;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}
```

## 交互式动画

### 1. 鼠标跟随

```javascript
class MouseFollow {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 5 + 2,
                speedX: 0,
                speedY: 0,
                color: `hsl(${Math.random() * 360}, 50%, 50%)`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // 计算到鼠标的距离
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 根据距离计算速度
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 100;
                
                particle.speedX -= Math.cos(angle) * force * 0.2;
                particle.speedY -= Math.sin(angle) * force * 0.2;
            }
            
            // 更新位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 应用摩擦力
            particle.speedX *= 0.95;
            particle.speedY *= 0.95;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}
```

## 性能优化

### 1. 对象池

```javascript
class ObjectPool {
    constructor(createFn, resetFn, initialSize = 100) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = new Set();
        
        // 初始化对象池
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    // 获取对象
    get() {
        let obj = this.pool.pop();
        if (!obj) {
            obj = this.createFn();
        }
        this.active.add(obj);
        return obj;
    }

    // 释放对象
    release(obj) {
        if (this.active.has(obj)) {
            this.resetFn(obj);
            this.active.delete(obj);
            this.pool.push(obj);
        }
    }

    // 释放所有对象
    releaseAll() {
        this.active.forEach(obj => {
            this.resetFn(obj);
            this.pool.push(obj);
        });
        this.active.clear();
    }
}

// 使用示例
const particlePool = new ObjectPool(
    () => ({
        x: 0,
        y: 0,
        speedX: 0,
        speedY: 0,
        size: 0,
        color: ''
    }),
    (particle) => {
        particle.x = 0;
        particle.y = 0;
        particle.speedX = 0;
        particle.speedY = 0;
        particle.size = 0;
        particle.color = '';
    }
);
```

### 2. 离屏渲染

```javascript
class OffscreenRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.offscreen = document.createElement('canvas');
        this.offscreenCtx = this.offscreen.getContext('2d');
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.offscreen.width = this.canvas.width;
        this.offscreen.height = this.canvas.height;
    }

    // 在离屏画布上绘制
    drawOffscreen() {
        this.offscreenCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
        // 在离屏画布上进行绘制操作
    }

    // 将离屏画布内容复制到主画布
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreen, 0, 0);
    }
}
```

### 3. 动画帧率控制

```javascript
class FrameRateController {
    constructor(targetFPS = 60) {
        this.targetFPS = targetFPS;
        this.frameInterval = 1000 / targetFPS;
        this.lastFrameTime = 0;
    }

    shouldRender(currentTime) {
        if (currentTime - this.lastFrameTime >= this.frameInterval) {
            this.lastFrameTime = currentTime;
            return true;
        }
        return false;
    }
}

// 使用示例
const fpsController = new FrameRateController(60);

function animate(currentTime) {
    if (fpsController.shouldRender(currentTime)) {
        // 执行动画更新和绘制
        update();
        draw();
    }
    requestAnimationFrame(animate);
}
```

### 4. 批量渲染

```javascript
class BatchRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.elements = [];
    }

    add(element) {
        this.elements.push(element);
    }

    render() {
        // 批量设置状态
        this.ctx.save();
        this.ctx.fillStyle = 'red';
        
        // 批量绘制
        this.elements.forEach(element => {
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.restore();
    }
}
```

## 最佳实践

1. 动画生命周期管理
   ```javascript
   class Animation {
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
           if (!this.isRunning) return;
           
           // 动画逻辑
           this.update();
           this.draw();
           
           this.animationId = requestAnimationFrame(() => this.animate());
       }
   }
   ```

2. 内存管理
   - 及时清理不需要的动画对象
   - 使用对象池管理频繁创建的对象
   - 避免闭包导致的内存泄漏

3. 性能监控
   ```javascript
   class PerformanceMonitor {
       constructor() {
           this.frames = 0;
           this.lastTime = performance.now();
           this.fps = 0;
       }

       update() {
           this.frames++;
           const currentTime = performance.now();
          
           if (currentTime - this.lastTime >= 1000) {
               this.fps = this.frames;
               this.frames = 0;
               this.lastTime = currentTime;
               console.log(`FPS: ${this.fps}`);
           }
       }
   }
   ```

## 实际应用场景

### 1. 游戏动画
- 角色动画
- 粒子效果
- 物理动画
- 碰撞检测

### 2. 数据可视化
- 实时数据更新
- 图表动画
- 进度指示器
- 动态仪表盘

### 3. 交互效果
- 鼠标跟随
- 拖拽效果
- 手势动画
- 滚动动画

### 4. 特效展示
- 粒子系统
- 流体模拟
- 火焰效果
- 烟雾效果

## 调试技巧

1. 使用 Canvas 调试工具
   ```javascript
   class CanvasDebugger {
       constructor(canvas) {
           this.canvas = canvas;
           this.ctx = canvas.getContext('2d');
           this.debug = false;
       }

       toggleDebug() {
           this.debug = !this.debug;
       }

       drawDebugInfo(fps, objects) {
           if (!this.debug) return;
           
           this.ctx.save();
           this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
           this.ctx.fillRect(10, 10, 200, 100);
           
           this.ctx.fillStyle = 'white';
           this.ctx.font = '14px monospace';
           this.ctx.fillText(`FPS: ${fps}`, 20, 30);
           this.ctx.fillText(`Objects: ${objects}`, 20, 50);
           
           this.ctx.restore();
       }
   }
   ```

2. 性能分析
   - 使用 Chrome DevTools 的 Performance 面板
   - 监控内存使用情况
   - 分析动画帧率
   - 检查绘制性能

## 相关资源

- [Canvas 基础](./canvas.md) - Canvas 基础知识
- [Canvas 游戏开发](./canvas-games.md) - 游戏动画开发指南
- [MDN Canvas 动画教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Basic_animations)
- [Canvas 性能优化指南](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [动画性能优化](https://www.html5rocks.com/en/tutorials/canvas/performance/) 