# GSAP 动画库

## 基本概念

GSAP (GreenSock Animation Platform) 是一个强大的 JavaScript 动画库，它提供了高性能、跨浏览器的动画解决方案。GSAP 可以用于创建复杂的动画序列，支持各种动画属性和缓动效果。

## 基础设置

### 1. 安装和引入

```html
<!-- 通过 CDN 引入 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<!-- 或者通过 npm 安装 -->
<!-- npm install gsap -->
```

### 2. 基本使用

```javascript
// 基本动画
gsap.to(".box", {
    duration: 1,
    x: 100,
    y: 100,
    rotation: 360,
    ease: "power2.out"
});

// 设置初始状态
gsap.set(".box", {
    x: 0,
    y: 0,
    rotation: 0
});

// 从当前状态开始动画
gsap.from(".box", {
    duration: 1,
    x: 100,
    y: 100,
    rotation: 360
});

// 从指定状态到指定状态
gsap.fromTo(".box", 
    {
        x: 0,
        y: 0,
        rotation: 0
    },
    {
        duration: 1,
        x: 100,
        y: 100,
        rotation: 360,
        ease: "power2.inOut"
    }
);
```

## 动画效果

### 1. 基础动画效果

```javascript
// 移动动画
gsap.to(".element", {
    duration: 1,
    x: 100,          // 水平移动
    y: 50,           // 垂直移动
    ease: "power2.out"
});

// 缩放动画
gsap.to(".element", {
    duration: 1,
    scale: 1.5,      // 整体缩放
    scaleX: 2,       // 水平缩放
    scaleY: 0.5,     // 垂直缩放
    ease: "elastic.out(1, 0.3)"
});

// 旋转动画
gsap.to(".element", {
    duration: 1,
    rotation: 360,   // 旋转角度
    rotationX: 180,  // X轴旋转
    rotationY: 180,  // Y轴旋转
    ease: "power2.inOut"
});

// 透明度动画
gsap.to(".element", {
    duration: 1,
    opacity: 0,
    ease: "power2.in"
});
```

### 2. 高级动画效果

```javascript
// 路径动画
gsap.to(".element", {
    duration: 2,
    motionPath: {
        path: "#path",
        align: "#path",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    ease: "power1.inOut"
});

// 交错动画
gsap.to(".stagger-element", {
    duration: 1,
    y: 100,
    stagger: 0.1,    // 每个元素延迟 0.1 秒
    ease: "power2.out"
});

// 循环动画
gsap.to(".element", {
    duration: 1,
    x: 100,
    repeat: -1,      // 无限循环
    yoyo: true,      // 往返动画
    ease: "power1.inOut"
});

// 关键帧动画
gsap.to(".element", {
    duration: 2,
    keyframes: {
        "0%": { x: 0, y: 0 },
        "50%": { x: 100, y: 50 },
        "100%": { x: 0, y: 0 }
    },
    ease: "power1.inOut"
});
```

## 时间轴动画

### 1. 基本时间轴

```javascript
// 创建时间轴
const tl = gsap.timeline();

// 添加动画序列
tl.to(".element1", {
    duration: 1,
    x: 100,
    ease: "power2.out"
})
.to(".element2", {
    duration: 1,
    y: 100,
    ease: "power2.in"
})
.to(".element3", {
    duration: 1,
    rotation: 360,
    ease: "power2.inOut"
});

// 控制时间轴
tl.play();    // 播放
tl.pause();   // 暂停
tl.reverse(); // 反向播放
tl.seek(1);   // 跳转到指定时间
```

### 2. 高级时间轴

```javascript
// 创建带标签的时间轴
const tl = gsap.timeline({
    paused: true,
    onComplete: () => console.log("动画完成"),
    onUpdate: () => console.log("动画更新")
});

// 添加带标签的动画
tl.add("start")
  .to(".element1", { duration: 1, x: 100 }, "start")
  .to(".element2", { duration: 1, y: 100 }, "start+=0.2")
  .add("middle")
  .to(".element3", { duration: 1, rotation: 360 }, "middle")
  .add("end");

// 跳转到标签
tl.play("middle");
```

## 滚动触发动画

### 1. ScrollTrigger 插件

```javascript
// 注册插件
gsap.registerPlugin(ScrollTrigger);

// 滚动触发动画
gsap.to(".element", {
    scrollTrigger: {
        trigger: ".element",
        start: "top center",
        end: "bottom center",
        scrub: true,
        markers: true,
        onEnter: () => console.log("进入触发区域"),
        onLeave: () => console.log("离开触发区域"),
        onEnterBack: () => console.log("从下方进入触发区域"),
        onLeaveBack: () => console.log("从上方离开触发区域")
    },
    x: 100,
    rotation: 360
});
```

### 2. 滚动动画示例

```javascript
// 视差滚动
gsap.to(".parallax", {
    scrollTrigger: {
        trigger: ".container",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    },
    y: (i, target) => -target.offsetHeight * 0.5,
    ease: "none"
});

// 滚动进度条
gsap.to(".progress-bar", {
    scrollTrigger: {
        trigger: ".container",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    },
    width: "100%",
    ease: "none"
});

// 滚动显示动画
gsap.from(".fade-in", {
    scrollTrigger: {
        trigger: ".fade-in",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2
});
```

## 性能优化

### 1. 动画优化

```javascript
// 使用 will-change
gsap.set(".element", {
    willChange: "transform"
});

// 使用 force3D
gsap.to(".element", {
    duration: 1,
    x: 100,
    force3D: true
});

// 使用 autoRound
gsap.to(".element", {
    duration: 1,
    x: 100,
    autoRound: false
});

// 使用 batch
gsap.to(".batch-element", {
    duration: 1,
    x: 100,
    batch: 10  // 每批处理 10 个元素
});
```

### 2. 内存管理

```javascript
// 清理动画
const animation = gsap.to(".element", {
    duration: 1,
    x: 100
});

// 停止并清理动画
animation.kill();

// 清理时间轴
const tl = gsap.timeline();
tl.kill();

// 清理 ScrollTrigger
ScrollTrigger.getAll().forEach(trigger => trigger.kill());
```

## 最佳实践

1. 使用适当的缓动函数
2. 合理使用时间轴
3. 优化动画性能
4. 注意内存管理
5. 提供降级方案
6. 考虑移动设备性能
7. 使用适当的动画时长
8. 注意动画的可访问性

## 相关资源

- [GSAP 官方文档](https://greensock.com/docs/)
- [GSAP 示例](https://greensock.com/showcase/)
- [GSAP 性能优化指南](https://greensock.com/docs/v3/GSAP/Performance)
- [GSAP 学习资源](https://greensock.com/learning/) 