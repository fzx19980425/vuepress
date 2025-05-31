# CSS3 动画示例

## 基础动画效果

### 1. 加载动画

#### 旋转加载
```css
.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```

#### 脉冲加载
```css
.pulse-loader {
    width: 40px;
    height: 40px;
    background-color: #3498db;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.5; }
}
```

### 2. 按钮动画

#### 悬停效果
```css
.hover-button {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.hover-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    background-color: #2980b9;
}
```

#### 波纹效果
```css
.ripple-button {
    position: relative;
    overflow: hidden;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
}

.ripple-button::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255,255,255,0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
}

.ripple-button:focus:not(:active)::after {
    animation: ripple 1s ease-out;
}

@keyframes ripple {
    0% {
        transform: scale(0, 0);
        opacity: 0.5;
    }
    100% {
        transform: scale(20, 20);
        opacity: 0;
    }
}
```

### 3. 卡片动画

#### 3D 翻转卡片
```css
.flip-card {
    perspective: 1000px;
    width: 300px;
    height: 200px;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 10px;
}

.flip-card-front {
    background-color: #3498db;
}

.flip-card-back {
    background-color: #2980b9;
    transform: rotateY(180deg);
}
```

#### 悬浮卡片
```css
.hover-card {
    width: 300px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.hover-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
}
```

## 高级动画效果

### 1. 文字动画

#### 打字机效果
```css
.typewriter {
    overflow: hidden;
    border-right: 2px solid #000;
    white-space: nowrap;
    animation: typing 3.5s steps(40, end),
               blink-caret 0.75s step-end infinite;
}

@keyframes typing {
    from { width: 0 }
    to { width: 100% }
}

@keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #000 }
}
```

#### 文字渐入
```css
.fade-in-text {
    opacity: 0;
    animation: fadeIn 1s ease-in forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```

### 2. 背景动画

#### 渐变背景
```css
.gradient-bg {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

#### 动态网格
```css
.grid-bg {
    background-color: #000;
    background-image: 
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
    0% { background-position: 0 0; }
    100% { background-position: 40px 40px; }
}
```

### 3. 菜单动画

#### 汉堡菜单
```css
.hamburger-menu {
    width: 30px;
    height: 20px;
    position: relative;
    cursor: pointer;
}

.hamburger-menu span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: #333;
    transition: all 0.3s ease;
}

.hamburger-menu span:nth-child(1) { top: 0; }
.hamburger-menu span:nth-child(2) { top: 9px; }
.hamburger-menu span:nth-child(3) { top: 18px; }

.hamburger-menu.active span:nth-child(1) {
    transform: rotate(45deg);
    top: 9px;
}

.hamburger-menu.active span:nth-child(2) {
    opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
    transform: rotate(-45deg);
    top: 9px;
}
```

#### 导航菜单
```css
.nav-menu {
    display: flex;
    gap: 20px;
}

.nav-item {
    position: relative;
    padding: 10px;
    color: #333;
    text-decoration: none;
}

.nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #3498db;
    transition: width 0.3s ease;
}

.nav-item:hover::after {
    width: 100%;
}
```

## 性能优化

1. 使用 `transform` 和 `opacity` 进行动画
   ```css
   /* 推荐 */
   .animate {
       transform: translateX(100px);
       opacity: 0;
   }

   /* 避免 */
   .animate {
       left: 100px;
       visibility: hidden;
   }
   ```

2. 使用 `will-change` 提示浏览器
   ```css
   .will-animate {
       will-change: transform, opacity;
   }
   ```

3. 避免动画属性过多
   ```css
   /* 推荐 */
   .animate {
       transform: translateX(100px) scale(1.2);
   }

   /* 避免 */
   .animate {
       left: 100px;
       width: 120%;
       height: 120%;
   }
   ```

## 最佳实践

1. 动画时长
   - 过渡动画：200-300ms
   - 复杂动画：300-500ms
   - 页面切换：500-800ms

2. 缓动函数
   - 自然过渡：`ease-in-out`
   - 强调开始：`ease-out`
   - 强调结束：`ease-in`

3. 动画触发
   - 使用 `:hover`、`:focus` 等伪类
   - 通过 JavaScript 添加类名
   - 使用 Intersection Observer 检测可见性

4. 响应式设计
   ```css
   @media (prefers-reduced-motion: reduce) {
       * {
           animation: none !important;
           transition: none !important;
       }
   }
   ```

## 实际应用场景

1. 页面加载动画
   - 骨架屏加载
   - 进度条动画
   - 内容渐入效果

2. 用户交互反馈
   - 按钮点击效果
   - 表单验证动画
   - 滚动提示

3. 导航和菜单
   - 下拉菜单
   - 侧边栏动画
   - 面包屑导航

4. 数据可视化
   - 进度条动画
   - 图表动画
   - 数字计数动画

## 相关资源

- [CSS 动画性能优化](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution)
- [CSS 动画最佳实践](https://www.smashingmagazine.com/2014/04/understanding-css-timing-functions/)
- [动画缓动函数](https://easings.net/)
- [CSS 动画库](https://animate.style/) 