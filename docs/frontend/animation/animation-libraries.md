# 动画库使用指南

## 常用动画库

### 1. Animate.css

Animate.css 是一个流行的 CSS 动画库，提供了大量预设的动画效果。

#### 安装

```bash
# npm
npm install animate.css

# yarn
yarn add animate.css

# CDN
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
```

#### 基本使用

```html
<!-- 基础用法 -->
<div class="animate__animated animate__bounce">弹跳动画</div>

<!-- 自定义持续时间 -->
<div class="animate__animated animate__bounce animate__faster">快速弹跳</div>
<div class="animate__animated animate__bounce animate__slower">慢速弹跳</div>

<!-- 延迟动画 -->
<div class="animate__animated animate__bounce animate__delay-2s">延迟 2 秒</div>

<!-- 重复动画 -->
<div class="animate__animated animate__bounce animate__repeat-2">重复 2 次</div>
<div class="animate__animated animate__bounce animate__infinite">无限重复</div>
```

#### JavaScript 控制

```javascript
// 添加动画类
element.classList.add('animate__animated', 'animate__bounce');

// 监听动画结束
element.addEventListener('animationend', () => {
    element.classList.remove('animate__animated', 'animate__bounce');
});

// 使用 animate.css 的 JavaScript 工具
import { animate } from 'animate.css';

animate(element, 'bounce', {
    duration: 1000,
    delay: 500,
    iterations: 2
});
```

### 2. GSAP (GreenSock Animation Platform)

GSAP 是一个强大的 JavaScript 动画库，提供了丰富的动画功能和优秀的性能。

#### 安装

```bash
# npm
npm install gsap

# yarn
yarn add gsap

# CDN
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
```

#### 基本使用

```javascript
// 基础动画
gsap.to('.element', {
    duration: 1,
    x: 100,
    y: 100,
    rotation: 360,
    ease: 'power2.out'
});

// 时间轴动画
const tl = gsap.timeline();

tl.to('.element1', {
    duration: 1,
    x: 100
})
.to('.element2', {
    duration: 1,
    y: 100
})
.to('.element3', {
    duration: 1,
    rotation: 360
});

// 交错动画
gsap.to('.stagger-element', {
    duration: 1,
    y: 100,
    stagger: 0.2,
    ease: 'power2.out'
});
```

#### 高级特性

```javascript
// 滚动触发动画
gsap.from('.scroll-element', {
    scrollTrigger: {
        trigger: '.scroll-element',
        start: 'top center',
        end: 'bottom center',
        scrub: true
    },
    y: 100,
    opacity: 0
});

// 路径动画
gsap.to('.path-element', {
    duration: 2,
    motionPath: {
        path: '#path',
        align: '#path',
        autoRotate: true
    },
    ease: 'power1.inOut'
});

// 3D 动画
gsap.to('.cube', {
    duration: 2,
    rotationY: 360,
    rotationX: 180,
    transformPerspective: 1000,
    ease: 'power2.inOut'
});
```

### 3. Motion One

Motion One 是一个轻量级的动画库，专注于性能和易用性。

#### 安装

```bash
# npm
npm install motion

# yarn
yarn add motion

# CDN
<script src="https://cdn.jsdelivr.net/npm/motion@10.16.2/dist/motion.min.js"></script>
```

#### 基本使用

```javascript
import { animate, stagger, spring } from 'motion';

// 基础动画
animate('.element', {
    x: 100,
    y: 100,
    rotate: 360
}, {
    duration: 1,
    easing: 'ease-out'
});

// 弹性动画
animate('.spring-element', {
    y: 100
}, {
    type: 'spring',
    stiffness: 200,
    damping: 20
});

// 交错动画
stagger('.stagger-element', {
    y: 100
}, {
    delay: stagger(0.1),
    duration: 0.5
});
```

### 4. Lottie

Lottie 是一个用于渲染 After Effects 动画的库，支持 JSON 格式的动画文件。

#### 安装

```bash
# npm
npm install lottie-web

# yarn
yarn add lottie-web

# CDN
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
```

#### 基本使用

```javascript
// 加载动画
const animation = lottie.loadAnimation({
    container: document.querySelector('.lottie-container'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'animation.json'
});

// 控制动画
animation.play();
animation.pause();
animation.stop();

// 监听事件
animation.addEventListener('complete', () => {
    console.log('动画完成');
});

// 动态更新
animation.setSpeed(0.5);
animation.setDirection(-1);
```

### 5. Three.js

Three.js 是一个 3D 图形库，可以创建复杂的 3D 动画效果。

#### 安装

```bash
# npm
npm install three

# yarn
yarn add three

# CDN
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

#### 基本使用

```javascript
// 创建场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建动画对象
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}

animate();
```

## 性能优化

### 1. 选择合适的动画库

- 简单动画：使用 CSS 动画或 Animate.css
- 复杂动画：使用 GSAP 或 Motion One
- 3D 动画：使用 Three.js
- 设计动画：使用 Lottie

### 2. 动画性能优化

```javascript
// 使用 transform 和 opacity
gsap.to('.element', {
    x: 100,  // 使用 transform: translateX
    y: 100,  // 使用 transform: translateY
    opacity: 0.5,
    duration: 1
});

// 避免频繁更新
const animation = gsap.to('.element', {
    x: 100,
    duration: 1,
    paused: true
});

// 批量更新
function batchUpdate() {
    requestAnimationFrame(() => {
        // 执行所有更新
        elements.forEach(element => {
            // 更新元素
        });
    });
}
```

### 3. 资源管理

```javascript
// 清理动画
function cleanup() {
    // 停止所有动画
    gsap.killTweensOf('.element');
    
    // 移除事件监听
    animation.removeEventListener('complete', onComplete);
    
    // 销毁 Three.js 场景
    scene.dispose();
    renderer.dispose();
}

// 按需加载
async function loadAnimation() {
    if (needsAnimation) {
        const { animate } = await import('motion');
        // 使用动画
    }
}
```

## 最佳实践

1. 选择合适的动画库
2. 注意性能影响
3. 提供降级方案
4. 考虑移动设备
5. 优化资源加载
6. 管理动画生命周期
7. 注意可访问性
8. 测试不同设备

## 相关资源

- [Animate.css 文档](https://animate.style/)
- [GSAP 文档](https://greensock.com/docs/)
- [Motion One 文档](https://motion.dev/)
- [Lottie 文档](https://airbnb.design/lottie/)
- [Three.js 文档](https://threejs.org/docs/)
- [动画性能指南](https://web.dev/animations-guide/)
- [动画库比较](https://www.npmtrends.com/animate.css-vs-gsap-vs-motion-vs-lottie-web) 