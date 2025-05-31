# CSS 动画与过渡

CSS提供了强大的动画和过渡功能，让我们能够创建流畅的用户界面交互效果。

## 过渡（Transitions）

过渡是元素从一种状态到另一种状态的平滑变化过程。

### 基本语法
```css
.element {
  /* 简写属性 */
  transition: property duration timing-function delay;
  
  /* 或分别设置 */
  transition-property: all;  /* 或具体属性名 */
  transition-duration: 0.3s;
  transition-timing-function: ease;
  transition-delay: 0s;
}
```

### 过渡属性
```css
.element {
  /* 可以过渡的属性 */
  transition-property: 
    width,          /* 宽度 */
    height,         /* 高度 */
    background,     /* 背景 */
    color,          /* 颜色 */
    transform,      /* 变换 */
    opacity,        /* 透明度 */
    box-shadow;     /* 阴影 */
}
```

### 时间函数
```css
.element {
  /* 预定义的时间函数 */
  transition-timing-function: 
    ease,           /* 默认值，慢-快-慢 */
    linear,         /* 匀速 */
    ease-in,        /* 慢-快 */
    ease-out,       /* 快-慢 */
    ease-in-out,    /* 慢-快-慢 */
    cubic-bezier(0.4, 0, 0.2, 1);  /* 自定义贝塞尔曲线 */
}
```

### 常见过渡效果
```css
/* 悬停效果 */
.button {
  background: #3498db;
  transition: background 0.3s ease;
}

.button:hover {
  background: #2980b9;
}

/* 展开/收起效果 */
.expandable {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.expandable.expanded {
  max-height: 500px;
}

/* 淡入淡出 */
.fade {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fade.visible {
  opacity: 1;
}
```

## 动画（Animations）

动画通过关键帧定义更复杂的动画效果。

### 基本语法
```css
.element {
  /* 简写属性 */
  animation: name duration timing-function delay iteration-count direction fill-mode play-state;
  
  /* 或分别设置 */
  animation-name: slide;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
}
```

### 关键帧定义
```css
@keyframes slide {
  /* 使用百分比 */
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
  100% {
    transform: translateX(0);
  }
  
  /* 或使用 from/to */
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### 动画属性详解
```css
.element {
  /* 动画名称 */
  animation-name: bounce;
  
  /* 持续时间 */
  animation-duration: 1s;
  
  /* 时间函数 */
  animation-timing-function: ease;
  
  /* 延迟时间 */
  animation-delay: 0.5s;
  
  /* 重复次数 */
  animation-iteration-count: infinite;  /* 或具体数字 */
  
  /* 动画方向 */
  animation-direction: 
    normal,         /* 正向播放 */
    reverse,        /* 反向播放 */
    alternate,      /* 正向交替 */
    alternate-reverse;  /* 反向交替 */
  
  /* 填充模式 */
  animation-fill-mode: 
    none,           /* 默认值 */
    forwards,       /* 保持最后一帧 */
    backwards,      /* 应用第一帧 */
    both;           /* 同时应用forwards和backwards */
  
  /* 播放状态 */
  animation-play-state: 
    running,        /* 播放 */
    paused;         /* 暂停 */
}
```

### 常见动画效果
```css
/* 弹跳效果 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 旋转效果 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 脉冲效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 闪烁效果 */
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
```

## 性能优化

### 使用 transform 和 opacity
```css
/* 推荐：使用 transform 和 opacity 进行动画 */
.element {
  transform: translateX(100px);
  opacity: 0.5;
}

/* 避免：使用会触发重排的属性 */
.element {
  width: 100px;  /* 会触发重排 */
  margin-left: 100px;  /* 会触发重排 */
}
```

### 使用 will-change
```css
.element {
  will-change: transform, opacity;
}
```

### 使用硬件加速
```css
.element {
  transform: translateZ(0);
  /* 或 */
  transform: translate3d(0, 0, 0);
}
```

## 动画库和工具

1. 动画库
   - Animate.css
   - GSAP
   - Motion One
   - Lottie

2. 动画工具
   - Keyframes.app
   - Animista
   - Cubic-bezier.com

3. 调试工具
   - Chrome DevTools Animation Inspector
   - Firefox Animation Inspector

## 最佳实践

1. 动画设计原则
   - 保持简洁
   - 符合用户预期
   - 提供适当的反馈
   - 考虑可访问性

2. 性能考虑
   - 使用 transform 和 opacity
   - 避免过度动画
   - 注意动画时长
   - 提供降级方案

3. 可访问性
   - 提供暂停选项
   - 考虑减少动画
   - 遵循 prefers-reduced-motion
   - 提供替代方案

4. 响应式设计
   - 适配不同设备
   - 考虑性能影响
   - 提供合适的动画时长
   - 注意触摸设备

## 动画示例

### 淡入淡出
```css
@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fade 0.3s ease-in;
}
```

### 滑动效果
```css
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-up {
  animation: slide-up 0.5s ease-out;
}
```

### 旋转效果
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}
```

## 浏览器支持

现代浏览器对 CSS 动画和过渡的支持都很好，但要注意：
- 某些旧版本浏览器可能需要添加前缀
- 某些复杂的动画效果可能需要降级处理
- 建议使用现代浏览器开发工具进行调试 