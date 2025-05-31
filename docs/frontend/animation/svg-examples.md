# SVG 动画示例

## 基础动画效果

### 1. 加载动画

```html
<!-- 圆形加载动画 -->
<svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="none" stroke="#3498db" stroke-width="8">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="1s"
            repeatCount="indefinite"
        />
        <animate
            attributeName="stroke-dasharray"
            from="0 251.2"
            to="251.2 0"
            dur="1s"
            repeatCount="indefinite"
        />
    </circle>
</svg>

<!-- 脉冲加载动画 -->
<svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="#e74c3c">
        <animate
            attributeName="r"
            values="40;45;40"
            dur="1s"
            repeatCount="indefinite"
        />
        <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="1s"
            repeatCount="indefinite"
        />
    </circle>
</svg>
```

### 2. 按钮动画

```html
<!-- 悬停按钮效果 -->
<svg width="200" height="60" viewBox="0 0 200 60">
    <rect x="10" y="10" width="180" height="40" rx="20" fill="#3498db">
        <animate
            attributeName="fill"
            values="#3498db;#2980b9;#3498db"
            dur="0.3s"
            begin="mouseover"
            end="mouseout"
        />
        <animate
            attributeName="width"
            values="180;190;180"
            dur="0.3s"
            begin="mouseover"
            end="mouseout"
        />
    </rect>
    <text x="100" y="35" text-anchor="middle" fill="white" font-size="16">
        点击按钮
        <animate
            attributeName="opacity"
            values="1;0.8;1"
            dur="0.3s"
            begin="mouseover"
            end="mouseout"
        />
    </text>
</svg>

<!-- 波纹按钮效果 -->
<svg width="200" height="60" viewBox="0 0 200 60">
    <defs>
        <circle id="ripple" r="0" fill="rgba(255,255,255,0.3)">
            <animate
                attributeName="r"
                from="0"
                to="100"
                dur="0.6s"
                begin="click"
                fill="freeze"
            />
            <animate
                attributeName="opacity"
                from="0.6"
                to="0"
                dur="0.6s"
                begin="click"
                fill="freeze"
            />
        </circle>
    </defs>
    <rect x="10" y="10" width="180" height="40" rx="20" fill="#2ecc71"/>
    <text x="100" y="35" text-anchor="middle" fill="white" font-size="16">点击按钮</text>
    <use href="#ripple" x="100" y="30"/>
</svg>
```

### 3. 图标动画

```html
<!-- 菜单图标动画 -->
<svg width="40" height="40" viewBox="0 0 40 40">
    <g transform="translate(5,5)">
        <rect x="0" y="0" width="30" height="4" rx="2" fill="#333">
            <animate
                attributeName="y"
                values="0;13;13"
                dur="0.3s"
                begin="click"
                fill="freeze"
            />
            <animate
                attributeName="transform"
                values="rotate(0 15 2);rotate(45 15 2);rotate(45 15 2)"
                dur="0.3s"
                begin="click"
                fill="freeze"
            />
        </rect>
        <rect x="0" y="13" width="30" height="4" rx="2" fill="#333">
            <animate
                attributeName="opacity"
                values="1;0;0"
                dur="0.3s"
                begin="click"
                fill="freeze"
            />
        </rect>
        <rect x="0" y="26" width="30" height="4" rx="2" fill="#333">
            <animate
                attributeName="y"
                values="26;13;13"
                dur="0.3s"
                begin="click"
                fill="freeze"
            />
            <animate
                attributeName="transform"
                values="rotate(0 15 28);rotate(-45 15 28);rotate(-45 15 28)"
                dur="0.3s"
                begin="click"
                fill="freeze"
            />
        </rect>
    </g>
</svg>

<!-- 播放/暂停图标动画 -->
<svg width="40" height="40" viewBox="0 0 40 40">
    <g transform="translate(5,5)">
        <path d="M0,0 L30,15 L0,30 Z" fill="#333">
            <animate
                attributeName="d"
                values="
                    M0,0 L30,15 L0,30 Z;
                    M0,0 L10,0 L10,30 L0,30 Z;
                    M20,0 L30,0 L30,30 L20,30 Z;
                    M0,0 L30,15 L0,30 Z
                "
                dur="0.3s"
                begin="click"
                fill="freeze"
            />
        </path>
    </g>
</svg>
```

## 高级动画效果

### 1. 路径动画

```html
<!-- 描边动画 -->
<svg width="400" height="200" viewBox="0 0 400 200">
    <path
        d="M50,100 C100,20 300,20 350,100"
        fill="none"
        stroke="#3498db"
        stroke-width="4"
        stroke-dasharray="1000"
        stroke-dashoffset="1000"
    >
        <animate
            attributeName="stroke-dashoffset"
            from="1000"
            to="0"
            dur="2s"
            repeatCount="indefinite"
        />
    </path>
</svg>

<!-- 路径跟随动画 -->
<svg width="400" height="200" viewBox="0 0 400 200">
    <path
        id="motionPath"
        d="M50,100 C100,20 300,20 350,100"
        fill="none"
        stroke="#e74c3c"
        stroke-width="2"
    />
    <circle r="10" fill="#2ecc71">
        <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M50,100 C100,20 300,20 350,100"
        >
            <mpath href="#motionPath"/>
        </animateMotion>
    </circle>
</svg>
```

### 2. 3D 效果

```html
<!-- 3D 卡片效果 -->
<svg width="300" height="200" viewBox="0 0 300 200">
    <defs>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3498db"/>
            <stop offset="100%" style="stop-color:#2980b9"/>
        </linearGradient>
    </defs>
    <g transform="perspective(500)">
        <rect
            x="50"
            y="50"
            width="200"
            height="100"
            rx="10"
            fill="url(#cardGradient)"
        >
            <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 150 100;10 150 100;0 150 100"
                dur="3s"
                repeatCount="indefinite"
            />
        </rect>
    </g>
</svg>

<!-- 3D 旋转立方体 -->
<svg width="200" height="200" viewBox="0 0 200 200">
    <g transform="perspective(500)">
        <path
            d="M50,50 L150,50 L150,150 L50,150 Z"
            fill="#e74c3c"
            transform="rotateX(45) rotateY(45)"
        >
            <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 100 100;360 100 100"
                dur="3s"
                repeatCount="indefinite"
            />
        </path>
    </g>
</svg>
```

### 3. 交互式动画

```html
<!-- 鼠标跟随效果 -->
<svg width="400" height="400" viewBox="0 0 400 400">
    <defs>
        <filter id="blur">
            <feGaussianBlur stdDeviation="5"/>
        </filter>
    </defs>
    <circle cx="200" cy="200" r="100" fill="#3498db" filter="url(#blur)">
        <animate
            attributeName="cx"
            values="200;300;200;100;200"
            dur="3s"
            repeatCount="indefinite"
        />
        <animate
            attributeName="cy"
            values="200;300;200;100;200"
            dur="3s"
            repeatCount="indefinite"
        />
    </circle>
</svg>

<!-- 交互式图表 -->
<svg width="400" height="300" viewBox="0 0 400 300">
    <g transform="translate(50,250)">
        <line x1="0" y1="0" x2="300" y2="0" stroke="#333" stroke-width="2"/>
        <line x1="0" y1="0" x2="0" y2="-200" stroke="#333" stroke-width="2"/>
        
        <path
            d="M0,0 L50,-50 L100,-80 L150,-120 L200,-100 L250,-150 L300,-180"
            fill="none"
            stroke="#e74c3c"
            stroke-width="3"
        >
            <animate
                attributeName="d"
                values="
                    M0,0 L50,-50 L100,-80 L150,-120 L200,-100 L250,-150 L300,-180;
                    M0,0 L50,-100 L100,-60 L150,-140 L200,-80 L250,-130 L300,-160;
                    M0,0 L50,-50 L100,-80 L150,-120 L200,-100 L250,-150 L300,-180
                "
                dur="3s"
                repeatCount="indefinite"
            />
        </path>
        
        <circle cx="50" cy="-50" r="5" fill="#3498db">
            <animate
                attributeName="cy"
                values="-50;-100;-50"
                dur="3s"
                repeatCount="indefinite"
            />
        </circle>
    </g>
</svg>
```

## 性能优化

### 1. 使用 CSS 动画

```html
<!-- 使用 CSS 动画优化性能 -->
<svg width="100" height="100" viewBox="0 0 100 100">
    <style>
        .optimized {
            animation: rotate 2s linear infinite;
            transform-origin: center;
            will-change: transform;
        }
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
    <circle class="optimized" cx="50" cy="50" r="40" fill="none" stroke="#3498db" stroke-width="8"/>
</svg>
```

### 2. 使用 transform 代替位置属性

```html
<!-- 使用 transform 优化动画性能 -->
<svg width="200" height="200" viewBox="0 0 200 200">
    <style>
        .transform-optimized {
            transform: translateZ(0);
            will-change: transform;
        }
    </style>
    <rect
        class="transform-optimized"
        x="50"
        y="50"
        width="100"
        height="100"
        fill="#e74c3c"
    >
        <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;50,0;0,0"
            dur="2s"
            repeatCount="indefinite"
        />
    </rect>
</svg>
```

## 最佳实践

1. 使用适当的动画类型
2. 优化动画性能
3. 提供降级方案
4. 考虑可访问性
5. 控制动画复杂度
6. 使用 CSS 动画优化性能
7. 注意浏览器兼容性
8. 合理使用 transform

## 相关资源

- [MDN SVG 动画教程](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/SVG_animation)
- [SVG 动画示例](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/animate)
- [SVG 动画工具](https://svgjs.com/docs/3.0/animating/)
- [SVG 动画性能优化](https://www.smashingmagazine.com/2014/11/styling-and-animating-svgs-with-css/) 