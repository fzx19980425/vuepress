# SVG 变形动画

## 基本概念

SVG 变形动画（Morphing）是一种将一个形状平滑过渡到另一个形状的动画效果。通过改变路径的 `d` 属性，可以实现复杂的形状变换。

## 实现方法

### 1. 基础路径变形

```html
<!-- 使用 animate 元素实现路径变形 -->
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

<!-- 使用 keyTimes 控制变形过程 -->
<svg width="400" height="400">
    <path d="M50,50 L350,50 L200,350 Z" fill="blue">
        <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
                M50,50 L350,50 L200,350 Z;
                M50,50 L350,350 L50,350 Z;
                M50,50 L350,50 L200,350 Z
            "
            keyTimes="0;0.5;1"
            keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
        />
    </path>
</svg>
```

### 2. 复杂形状变形

```html
<!-- 圆形到矩形的变形 -->
<svg width="400" height="400">
    <path d="M200,100 a100,100 0 1,1 0,200 a100,100 0 1,1 0,-200" fill="red">
        <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
                M200,100 a100,100 0 1,1 0,200 a100,100 0 1,1 0,-200;
                M100,100 L300,100 L300,300 L100,300 Z;
                M200,100 a100,100 0 1,1 0,200 a100,100 0 1,1 0,-200
            "
        />
    </path>
</svg>

<!-- 星形到圆形的变形 -->
<svg width="400" height="400">
    <path d="M200,50 L240,180 L380,180 L260,260 L300,380 L200,300 L100,380 L140,260 L20,180 L160,180 Z" fill="orange">
        <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
                M200,50 L240,180 L380,180 L260,260 L300,380 L200,300 L100,380 L140,260 L20,180 L160,180 Z;
                M200,100 a100,100 0 1,1 0,200 a100,100 0 1,1 0,-200;
                M200,50 L240,180 L380,180 L260,260 L300,380 L200,300 L100,380 L140,260 L20,180 L160,180 Z
            "
        />
    </path>
</svg>
```

### 3. 文字变形

```html
<!-- 文字路径变形 -->
<svg width="400" height="400">
    <path id="textPath" d="M50,200 C100,100 300,100 350,200" fill="none" stroke="none"/>
    <text>
        <textPath href="#textPath" fill="green" font-size="24">
            Hello World
            <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="
                    M50,200 C100,100 300,100 350,200;
                    M50,200 C100,300 300,300 350,200;
                    M50,200 C100,100 300,100 350,200
                "
            />
        </textPath>
    </text>
</svg>
```

## 高级变形效果

### 1. 使用 JavaScript 控制变形

```html
<!-- 使用 JavaScript 实现复杂变形 -->
<svg width="400" height="400">
    <path id="morphPath" d="M50,50 L350,50 L200,350 Z" fill="purple"/>
    <script>
        class MorphAnimation {
            constructor(path, shapes) {
                this.path = path;
                this.shapes = shapes;
                this.currentShape = 0;
                this.isAnimating = false;
            }
            
            start() {
                if (!this.isAnimating) {
                    this.isAnimating = true;
                    this.animate();
                }
            }
            
            animate() {
                if (!this.isAnimating) return;
                
                const nextShape = (this.currentShape + 1) % this.shapes.length;
                const currentPath = this.shapes[this.currentShape];
                const targetPath = this.shapes[nextShape];
                
                // 使用 GSAP 或其他动画库实现平滑过渡
                gsap.to(this.path, {
                    attr: { d: targetPath },
                    duration: 2,
                    ease: "power2.inOut",
                    onComplete: () => {
                        this.currentShape = nextShape;
                        this.animate();
                    }
                });
            }
            
            stop() {
                this.isAnimating = false;
            }
        }
        
        // 使用示例
        const path = document.getElementById('morphPath');
        const shapes = [
            'M50,50 L350,50 L200,350 Z',
            'M50,50 L350,350 L50,350 Z',
            'M200,50 L350,200 L200,350 L50,200 Z'
        ];
        
        const morph = new MorphAnimation(path, shapes);
        morph.start();
    </script>
</svg>
```

### 2. 使用 SVG 路径插值

```html
<!-- 使用路径插值实现平滑变形 -->
<svg width="400" height="400">
    <script>
        class PathInterpolator {
            constructor(path1, path2, steps = 60) {
                this.path1 = path1;
                this.path2 = path2;
                this.steps = steps;
                this.points1 = this.getPathPoints(path1);
                this.points2 = this.getPathPoints(path2);
            }
            
            getPathPoints(path) {
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', path);
                const length = pathElement.getTotalLength();
                const points = [];
                
                for (let i = 0; i <= this.steps; i++) {
                    const point = pathElement.getPointAtLength(length * i / this.steps);
                    points.push([point.x, point.y]);
                }
                
                return points;
            }
            
            interpolate(progress) {
                const points = [];
                for (let i = 0; i <= this.steps; i++) {
                    const x = this.points1[i][0] + (this.points2[i][0] - this.points1[i][0]) * progress;
                    const y = this.points1[i][1] + (this.points2[i][1] - this.points1[i][1]) * progress;
                    points.push([x, y]);
                }
                return this.pointsToPath(points);
            }
            
            pointsToPath(points) {
                return 'M' + points.map(p => p.join(',')).join(' L');
            }
        }
        
        // 使用示例
        const path1 = 'M50,50 L350,50 L200,350 Z';
        const path2 = 'M50,50 L350,350 L50,350 Z';
        const interpolator = new PathInterpolator(path1, path2);
        
        const path = document.getElementById('morphPath');
        let progress = 0;
        
        function animate() {
            progress = (progress + 0.01) % 1;
            path.setAttribute('d', interpolator.interpolate(progress));
            requestAnimationFrame(animate);
        }
        
        animate();
    </script>
</svg>
```

## 性能优化

### 1. 路径优化

```html
<!-- 优化路径点数 -->
<svg width="400" height="400">
    <script>
        function optimizePath(path, tolerance = 0.5) {
            const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('d', path);
            const length = pathElement.getTotalLength();
            const points = [];
            let lastPoint = null;
            
            for (let i = 0; i <= length; i += tolerance) {
                const point = pathElement.getPointAtLength(i);
                if (!lastPoint || 
                    Math.abs(point.x - lastPoint.x) > tolerance || 
                    Math.abs(point.y - lastPoint.y) > tolerance) {
                    points.push([point.x, point.y]);
                    lastPoint = point;
                }
            }
            
            return 'M' + points.map(p => p.join(',')).join(' L');
        }
        
        // 使用优化后的路径
        const originalPath = 'M50,50 L350,50 L200,350 Z';
        const optimizedPath = optimizePath(originalPath);
    </script>
</svg>
```

### 2. 动画性能优化

```html
<!-- 使用 will-change 和 transform -->
<svg width="400" height="400">
    <style>
        .morphing-path {
            will-change: d;
            transform: translateZ(0);
        }
    </style>
    <path class="morphing-path" d="M50,50 L350,50 L200,350 Z" fill="purple">
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

## 最佳实践

1. 保持路径点数一致
2. 使用适当的缓动函数
3. 优化路径数据
4. 控制动画复杂度
5. 使用 CSS 硬件加速
6. 考虑浏览器兼容性
7. 提供降级方案
8. 注意性能影响

## 相关资源

- [MDN SVG 路径变形](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/d)
- [SVG 路径插值算法](https://www.w3.org/TR/SVG/paths.html)
- [SVG 变形动画工具](https://svgator.com/)
- [SVG 动画性能优化](https://www.smashingmagazine.com/2014/11/styling-and-animating-svgs-with-css/) 