# Lottie 动画

## 基本概念

Lottie 是一个用于 Web 和移动端的动画库，它可以将 Adobe After Effects 制作的动画导出为 JSON 格式，并在网页中实现相同的动画效果。Lottie 支持复杂的动画效果，包括形状、蒙版、路径动画等。

## 基础设置

### 1. 安装和引入

```html
<!-- 通过 CDN 引入 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

<!-- 或者通过 npm 安装 -->
<!-- npm install lottie-web -->
```

### 2. 基本使用

```javascript
// 基本动画加载
const animation = lottie.loadAnimation({
    container: document.getElementById('lottie-container'), // 动画容器
    renderer: 'svg',                                       // 渲染方式：svg/canvas/html
    loop: true,                                            // 是否循环
    autoplay: true,                                        // 是否自动播放
    path: 'animation.json'                                 // 动画文件路径
});

// 动画控制
animation.play();      // 播放
animation.pause();     // 暂停
animation.stop();      // 停止
animation.goToAndPlay(30); // 跳转到指定帧并播放
animation.goToAndStop(30); // 跳转到指定帧并停止

// 动画事件监听
animation.addEventListener('complete', () => {
    console.log('动画播放完成');
});

animation.addEventListener('loopComplete', () => {
    console.log('动画循环完成');
});

animation.addEventListener('enterFrame', () => {
    console.log('当前帧：', animation.currentFrame);
});
```

## 动画效果

### 1. 基础动画效果

```javascript
// 加载并播放动画
class BasicAnimation {
    constructor(containerId, animationPath) {
        this.container = document.getElementById(containerId);
        this.animation = null;
        this.init(animationPath);
    }
    
    init(path) {
        this.animation = lottie.loadAnimation({
            container: this.container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: path
        });
    }
    
    // 控制动画播放
    play() {
        this.animation.play();
    }
    
    pause() {
        this.animation.pause();
    }
    
    stop() {
        this.animation.stop();
    }
    
    // 设置动画速度
    setSpeed(speed) {
        this.animation.setSpeed(speed);
    }
    
    // 设置动画方向
    setDirection(direction) {
        this.animation.setDirection(direction);
    }
}

// 使用示例
const animation = new BasicAnimation('lottie-container', 'animation.json');
```

### 2. 高级动画效果

```javascript
// 动画控制器
class AnimationController {
    constructor(containerId, animationPath) {
        this.container = document.getElementById(containerId);
        this.animation = null;
        this.segments = [];
        this.init(animationPath);
    }
    
    init(path) {
        this.animation = lottie.loadAnimation({
            container: this.container,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: path
        });
        
        // 监听动画加载完成
        this.animation.addEventListener('DOMLoaded', () => {
            this.setupSegments();
        });
    }
    
    // 设置动画片段
    setupSegments() {
        this.segments = [
            { name: 'intro', start: 0, end: 30 },
            { name: 'main', start: 31, end: 60 },
            { name: 'outro', start: 61, end: 90 }
        ];
    }
    
    // 播放指定片段
    playSegment(segmentName) {
        const segment = this.segments.find(s => s.name === segmentName);
        if (segment) {
            this.animation.playSegments([segment.start, segment.end], true);
        }
    }
    
    // 添加动画事件
    addEventListener(event, callback) {
        this.animation.addEventListener(event, callback);
    }
    
    // 设置动画属性
    setSubframe(useSubframe) {
        this.animation.setSubframe(useSubframe);
    }
    
    // 销毁动画
    destroy() {
        this.animation.destroy();
    }
}

// 使用示例
const controller = new AnimationController('lottie-container', 'animation.json');
controller.playSegment('intro');
```

## 交互控制

### 1. 基本交互

```javascript
class InteractiveAnimation {
    constructor(containerId, animationPath) {
        this.container = document.getElementById(containerId);
        this.animation = null;
        this.init(animationPath);
    }
    
    init(path) {
        this.animation = lottie.loadAnimation({
            container: this.container,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: path
        });
        
        this.setupControls();
    }
    
    setupControls() {
        // 播放控制
        document.getElementById('play').addEventListener('click', () => {
            this.animation.play();
        });
        
        // 暂停控制
        document.getElementById('pause').addEventListener('click', () => {
            this.animation.pause();
        });
        
        // 进度控制
        document.getElementById('progress').addEventListener('input', (e) => {
            const frame = (e.target.value / 100) * this.animation.totalFrames;
            this.animation.goToAndStop(frame, true);
        });
    }
    
    // 更新进度条
    updateProgress() {
        const progress = (this.animation.currentFrame / this.animation.totalFrames) * 100;
        document.getElementById('progress').value = progress;
    }
}
```

### 2. 高级交互

```javascript
class AdvancedInteractiveAnimation {
    constructor(containerId, animationPath) {
        this.container = document.getElementById(containerId);
        this.animation = null;
        this.isDragging = false;
        this.init(animationPath);
    }
    
    init(path) {
        this.animation = lottie.loadAnimation({
            container: this.container,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: path
        });
        
        this.setupDragControls();
        this.setupScrollControls();
    }
    
    // 拖拽控制
    setupDragControls() {
        let startX, startFrame;
        
        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            startX = e.clientX;
            startFrame = this.animation.currentFrame;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - startX;
                const frameDelta = (deltaX / this.container.offsetWidth) * this.animation.totalFrames;
                const newFrame = Math.max(0, Math.min(this.animation.totalFrames, startFrame + frameDelta));
                this.animation.goToAndStop(newFrame, true);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }
    
    // 滚动控制
    setupScrollControls() {
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const frame = scrollPercent * this.animation.totalFrames;
            this.animation.goToAndStop(frame, true);
        });
    }
}
```

## 性能优化

### 1. 动画优化

```javascript
class OptimizedAnimation {
    constructor(containerId, animationPath) {
        this.container = document.getElementById(containerId);
        this.animation = null;
        this.init(animationPath);
    }
    
    init(path) {
        // 使用 canvas 渲染器提高性能
        this.animation = lottie.loadAnimation({
            container: this.container,
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            path: path,
            rendererSettings: {
                progressiveLoad: true,    // 渐进式加载
                preserveAspectRatio: 'xMidYMid slice',
                imagePreserveAspectRatio: 'xMidYMid slice',
                clearCanvas: true,        // 清除画布
                hideOnTransparent: true   // 透明时隐藏
            }
        });
    }
    
    // 优化动画性能
    optimize() {
        // 设置最大帧率
        this.animation.setSpeed(1);
        
        // 使用 requestAnimationFrame
        this.animation.addEventListener('enterFrame', () => {
            requestAnimationFrame(() => {
                // 更新动画状态
            });
        });
        
        // 监听可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.animation.pause();
            } else {
                this.animation.play();
            }
        });
    }
}
```

### 2. 资源管理

```javascript
class ResourceManager {
    constructor() {
        this.animations = new Map();
    }
    
    // 加载动画
    loadAnimation(id, containerId, path) {
        if (this.animations.has(id)) {
            return this.animations.get(id);
        }
        
        const animation = lottie.loadAnimation({
            container: document.getElementById(containerId),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: path
        });
        
        this.animations.set(id, animation);
        return animation;
    }
    
    // 预加载动画
    preloadAnimations(animations) {
        animations.forEach(({ id, path }) => {
            this.loadAnimation(id, null, path);
        });
    }
    
    // 清理动画
    destroyAnimation(id) {
        const animation = this.animations.get(id);
        if (animation) {
            animation.destroy();
            this.animations.delete(id);
        }
    }
    
    // 清理所有动画
    destroyAll() {
        this.animations.forEach(animation => {
            animation.destroy();
        });
        this.animations.clear();
    }
}
```

## 最佳实践

1. 选择合适的渲染器
2. 优化动画文件大小
3. 使用适当的动画控制方法
4. 实现资源预加载
5. 注意内存管理
6. 提供降级方案
7. 考虑移动设备性能
8. 优化动画加载时间

## 相关资源

- [Lottie 官方文档](https://airbnb.design/lottie/)
- [Lottie Web 文档](https://github.com/airbnb/lottie-web)
- [Lottie 动画库](https://lottiefiles.com/)
- [After Effects 动画导出指南](https://airbnb.design/lottie/) 