# Canvas 动画示例

## 基础动画效果

### 1. 粒子系统

```javascript
class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        this.alpha = 1;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animate = this.animate.bind(this);
    }
    
    createParticles(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const radius = Math.random() * 3 + 1;
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
            this.particles.push(new Particle(x, y, radius, color));
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(particle => {
            particle.update();
            particle.draw(this.ctx);
            return particle.alpha > 0;
        });
    }
    
    start() {
        this.animate();
    }
}

// 使用示例
const canvas = document.getElementById('canvas');
const particleSystem = new ParticleSystem(canvas);
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    particleSystem.createParticles(x, y);
});
particleSystem.start();
```

### 2. 波浪动画

```javascript
class Wave {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.amplitude = 50;
        this.frequency = 0.02;
        this.speed = 0.05;
        this.phase = 0;
        this.init();
    }
    
    init() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const spacing = 5;
        
        for (let x = 0; x < width; x += spacing) {
            this.points.push({
                x: x,
                y: height / 2
            });
        }
    }
    
    update() {
        this.phase += this.speed;
        
        this.points.forEach((point, index) => {
            point.y = this.canvas.height / 2 + 
                     Math.sin(index * this.frequency + this.phase) * this.amplitude;
        });
    }
    
    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
            this.ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        this.draw();
    }
    
    start() {
        this.animate();
    }
}

// 使用示例
const canvas = document.getElementById('canvas');
const wave = new Wave(canvas);
wave.start();
```

### 3. 3D 旋转立方体

```javascript
class Cube {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        this.faces = [
            [0, 1, 2, 3], [4, 5, 6, 7], [0, 4, 7, 3],
            [1, 5, 6, 2], [0, 1, 5, 4], [3, 2, 6, 7]
        ];
        this.angle = 0;
        this.scale = 100;
        this.center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
    }
    
    rotate() {
        this.angle += 0.02;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        
        return this.vertices.map(vertex => {
            const [x, y, z] = vertex;
            return {
                x: x * cos - z * sin,
                y: y,
                z: x * sin + z * cos
            };
        });
    }
    
    project(vertex) {
        return {
            x: vertex.x * this.scale + this.center.x,
            y: vertex.y * this.scale + this.center.y
        };
    }
    
    draw() {
        const projected = this.rotate().map(vertex => this.project(vertex));
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制面
        this.faces.forEach(face => {
            this.ctx.beginPath();
            this.ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
            for (let i = 1; i < face.length; i++) {
                this.ctx.lineTo(projected[face[i]].x, projected[face[i]].y);
            }
            this.ctx.closePath();
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.stroke();
        });
        
        // 绘制顶点
        projected.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fill();
        });
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.draw();
    }
    
    start() {
        this.animate();
    }
}

// 使用示例
const canvas = document.getElementById('canvas');
const cube = new Cube(canvas);
cube.start();
```

## 交互式动画

### 1. 鼠标跟随效果

```javascript
class MouseFollower {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // 创建初始粒子
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0,
                vy: 0
            });
        }
    }
    
    update() {
        this.particles.forEach(particle => {
            // 计算到鼠标的距离
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 根据距离计算速度
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 100;
                particle.vx -= Math.cos(angle) * force * 0.2;
                particle.vy -= Math.sin(angle) * force * 0.2;
            }
            
            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 添加阻尼
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            
            // 边界检查
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fill();
        });
        
        // 绘制连线
        this.ctx.beginPath();
        this.particles.forEach((particle, i) => {
            if (i === 0) {
                this.ctx.moveTo(particle.x, particle.y);
            } else {
                this.ctx.lineTo(particle.x, particle.y);
            }
        });
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        this.ctx.stroke();
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.update();
        this.draw();
    }
    
    start() {
        this.animate();
    }
}

// 使用示例
const canvas = document.getElementById('canvas');
const follower = new MouseFollower(canvas);
follower.start();
```

### 2. 图片视差效果

```javascript
class ParallaxImage {
    constructor(canvas, imageUrl) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imageUrl;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / this.canvas.width;
            this.mouse.y = (e.clientY - rect.top) / this.canvas.height;
        });
        
        this.image.onload = () => {
            this.draw();
        };
    }
    
    draw() {
        const { width, height } = this.canvas;
        const { width: imgWidth, height: imgHeight } = this.image;
        
        // 计算偏移量
        const offsetX = (this.mouse.x - 0.5) * 50;
        const offsetY = (this.mouse.y - 0.5) * 50;
        
        // 清除画布
        this.ctx.clearRect(0, 0, width, height);
        
        // 绘制图片
        this.ctx.save();
        this.ctx.translate(width / 2, height / 2);
        this.ctx.translate(offsetX, offsetY);
        this.ctx.drawImage(
            this.image,
            -imgWidth / 2,
            -imgHeight / 2,
            imgWidth,
            imgHeight
        );
        this.ctx.restore();
        
        // 继续动画
        requestAnimationFrame(this.draw.bind(this));
    }
    
    start() {
        this.draw();
    }
}

// 使用示例
const canvas = document.getElementById('canvas');
const parallax = new ParallaxImage(canvas, 'image.jpg');
parallax.start();
```

## 性能优化

### 1. 使用 requestAnimationFrame 的节流

```javascript
class AnimationThrottle {
    constructor(fps = 60) {
        this.fps = fps;
        this.frameInterval = 1000 / fps;
        this.lastFrameTime = 0;
    }
    
    shouldUpdate(currentTime) {
        if (currentTime - this.lastFrameTime >= this.frameInterval) {
            this.lastFrameTime = currentTime;
            return true;
        }
        return false;
    }
}

// 使用示例
const throttle = new AnimationThrottle(30);
function animate(currentTime) {
    if (throttle.shouldUpdate(currentTime)) {
        // 更新动画
    }
    requestAnimationFrame(animate);
}
```

### 2. 使用离屏渲染

```javascript
class OffscreenRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.offscreen = document.createElement('canvas');
        this.offscreen.width = canvas.width;
        this.offscreen.height = canvas.height;
        this.offCtx = this.offscreen.getContext('2d');
    }
    
    render(drawFn) {
        // 在离屏画布上绘制
        this.offCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
        drawFn(this.offCtx);
        
        // 将离屏内容复制到主画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreen, 0, 0);
    }
}

// 使用示例
const canvas = document.getElementById('canvas');
const renderer = new OffscreenRenderer(canvas);

function animate() {
    renderer.render(ctx => {
        // 在离屏画布上绘制内容
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
    });
    requestAnimationFrame(animate);
}
```

## 最佳实践

1. 使用 requestAnimationFrame 进行动画
2. 合理使用离屏渲染
3. 避免频繁的状态切换
4. 及时清理不需要的动画
5. 注意内存管理
6. 优化绘制性能
7. 考虑设备像素比
8. 提供降级方案

## 相关资源

- [MDN Canvas 动画教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Basic_animations)
- [Canvas 性能优化](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Canvas 动画示例](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Advanced_animations)
- [Canvas 游戏开发](https://developer.mozilla.org/zh-CN/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript) 