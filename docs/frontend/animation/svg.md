# SVG 动画基础

## 基本概念

SVG（Scalable Vector Graphics）是一种基于 XML 的矢量图形格式，它支持多种动画效果，包括路径动画、变形动画、颜色动画等。

### 基本语法

```html
<!-- 创建 SVG 元素 -->
<svg width="400" height="400" viewBox="0 0 400 400">
    <!-- SVG 内容 -->
</svg>
```

## 动画类型

### 1. 基础动画属性

```html
<!-- 使用 animate 元素 -->
<svg width="400" height="400">
    <circle cx="50" cy="50" r="20" fill="red">
        <animate
            attributeName="cx"
            from="50"
            to="350"
            dur="2s"
            repeatCount="indefinite"
        />
    </circle>
</svg>

<!-- 使用 animateTransform 元素 -->
<svg width="400" height="400">
    <rect x="50" y="50" width="100" height="100" fill="blue">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="3s"
            repeatCount="indefinite"
        />
    </rect>
</svg>

<!-- 使用 animateMotion 元素 -->
<svg width="400" height="400">
    <path id="path" d="M50,50 C100,100 300,100 350,50" fill="none" stroke="black"/>
    <circle r="10" fill="red">
        <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M50,50 C100,100 300,100 350,50"
        />
    </circle>
</svg>
```

### 2. 关键帧动画

```html
<!-- 使用 set 元素 -->
<svg width="400" height="400">
    <circle cx="200" cy="200" r="50" fill="green">
        <set
            attributeName="fill"
            to="red"
            begin="1s"
            dur="2s"
        />
    </circle>
</svg>

<!-- 使用 keyTimes 和 keySplines -->
<svg width="400" height="400">
    <circle cx="50" cy="200" r="20" fill="blue">
        <animate
            attributeName="cx"
            values="50;350;50"
            keyTimes="0;0.5;1"
            keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
            dur="3s"
            repeatCount="indefinite"
        />
    </circle>
</svg>
```

### 3. 路径动画

```html
<!-- 路径描边动画 -->
<svg width="400" height="400">
    <path
        d="M50,50 C100,100 300,100 350,50"
        fill="none"
        stroke="black"
        stroke-width="2"
    >
        <animate
            attributeName="stroke-dashoffset"
            from="1000"
            to="0"
            dur="3s"
            repeatCount="indefinite"
        />
    </path>
</svg>

<!-- 路径变形动画 -->
<svg width="400" height="400">
    <path d="M50,50 L350,50 L200,350 Z" fill="purple">
        <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
                M50,50 L350,50 L200,350 Z;
                M50,50 L350,350 L50,350 Z;
                M50,50 L350,50 L200,350 Z
            "
        />
    </path>
</svg>
```

## 动画属性

### 1. 时间控制

```html
<!-- 基本时间属性 -->
<animate
    attributeName="cx"
    from="50"
    to="350"
    dur="2s"           <!-- 持续时间 -->
    begin="1s"         <!-- 开始时间 -->
    end="5s"           <!-- 结束时间 -->
    repeatCount="3"    <!-- 重复次数 -->
    repeatDur="10s"    <!-- 重复持续时间 -->
    min="0s"           <!-- 最小持续时间 -->
    max="5s"           <!-- 最大持续时间 -->
    restart="always"   <!-- 重启行为 -->
/>

<!-- 事件触发 -->
<animate
    attributeName="opacity"
    from="1"
    to="0"
    dur="1s"
    begin="click"      <!-- 点击时开始 -->
    fill="freeze"      <!-- 动画结束后保持状态 -->
/>
```

### 2. 动画同步

```html
<!-- 使用 begin 和 end 同步动画 -->
<svg width="400" height="400">
    <circle id="circle1" cx="50" cy="200" r="20" fill="red">
        <animate
            id="anim1"
            attributeName="cx"
            from="50"
            to="350"
            dur="2s"
            begin="0s"
        />
    </circle>
    <circle id="circle2" cx="50" cy="250" r="20" fill="blue">
        <animate
            attributeName="cx"
            from="50"
            to="350"
            dur="2s"
            begin="anim1.end"  <!-- 在 anim1 结束后开始 -->
        />
    </circle>
</svg>
```

### 3. 动画组合

```html
<!-- 组合多个动画 -->
<svg width="400" height="400">
    <rect x="50" y="50" width="100" height="100" fill="green">
        <!-- 移动动画 -->
        <animate
            attributeName="x"
            from="50"
            to="250"
            dur="2s"
            repeatCount="indefinite"
        />
        <!-- 旋转动画 -->
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="3s"
            repeatCount="indefinite"
        />
        <!-- 颜色动画 -->
        <animate
            attributeName="fill"
            values="green;blue;red;green"
            dur="4s"
            repeatCount="indefinite"
        />
    </rect>
</svg>
```

## 交互式动画

### 1. 鼠标交互

```html
<!-- 鼠标悬停效果 -->
<svg width="400" height="400">
    <circle cx="200" cy="200" r="50" fill="blue">
        <animate
            attributeName="r"
            from="50"
            to="70"
            dur="0.3s"
            begin="mouseover"
            end="mouseout"
            fill="freeze"
        />
    </circle>
</svg>

<!-- 点击效果 -->
<svg width="400" height="400">
    <rect x="150" y="150" width="100" height="100" fill="red">
        <animate
            attributeName="fill"
            values="red;yellow;red"
            dur="0.5s"
            begin="click"
        />
    </rect>
</svg>
```

### 2. 动画控制

```html
<!-- 使用 JavaScript 控制动画 -->
<svg width="400" height="400">
    <circle id="circle" cx="200" cy="200" r="50" fill="purple">
        <animate
            id="anim"
            attributeName="cx"
            from="50"
            to="350"
            dur="2s"
            begin="indefinite"
        />
    </circle>
    <script>
        const circle = document.getElementById('circle');
        const anim = document.getElementById('anim');
        
        // 开始动画
        function startAnimation() {
            anim.beginElement();
        }
        
        // 暂停动画
        function pauseAnimation() {
            anim.pauseAnimations();
        }
        
        // 继续动画
        function resumeAnimation() {
            anim.unpauseAnimations();
        }
        
        // 停止动画
        function stopAnimation() {
            anim.endElement();
        }
    </script>
</svg>
```

## 性能优化

### 1. 使用 CSS 动画

```html
<!-- 使用 CSS 动画替代 SVG 动画 -->
<svg width="400" height="400">
    <style>
        .animated {
            animation: move 2s infinite;
        }
        @keyframes move {
            from { transform: translateX(0); }
            to { transform: translateX(300px); }
        }
    </style>
    <circle class="animated" cx="50" cy="200" r="20" fill="red"/>
</svg>
```

### 2. 优化动画性能

```html
<!-- 使用 will-change 提示 -->
<svg width="400" height="400">
    <style>
        .optimized {
            will-change: transform;
        }
    </style>
    <rect class="optimized" x="50" y="50" width="100" height="100" fill="blue">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="3s"
            repeatCount="indefinite"
        />
    </rect>
</svg>
```

## 最佳实践

1. 使用适当的动画类型
2. 合理控制动画时间
3. 优化动画性能
4. 提供降级方案
5. 考虑可访问性
6. 使用 CSS 动画优化性能
7. 注意浏览器兼容性
8. 控制动画复杂度

## 相关资源

- [MDN SVG 动画教程](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/SVG_animation)
- [SVG 动画规范](https://www.w3.org/TR/SVG/animate.html)
- [SVG 动画示例](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/animate)
- [SVG 动画工具](https://svgjs.com/docs/3.0/animating/) 