# Canvas 基础

> 本文档介绍 Canvas 的基础知识和基本用法。如果您想了解 Canvas 动画的实现，请参考 [Canvas 动画实现](./canvas-animation.md)。

## 基本概念

Canvas 是 HTML5 提供的一个用于绘制图形的元素，它提供了一个 2D 绘图上下文，可以用来绘制各种图形、动画和游戏。

### 基本语法

```html
<!-- 创建 Canvas 元素 -->
<canvas id="myCanvas" width="800" height="600"></canvas>

<!-- 获取绘图上下文 -->
<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
</script>
```

## 绘图基础

### 1. 基本图形

#### 矩形

```javascript
// 绘制矩形
ctx.fillStyle = 'red';  // 填充颜色
ctx.fillRect(10, 10, 100, 100);  // 填充矩形

ctx.strokeStyle = 'blue';  // 描边颜色
ctx.lineWidth = 2;  // 线宽
ctx.strokeRect(120, 10, 100, 100);  // 描边矩形

// 清除矩形区域
ctx.clearRect(50, 50, 50, 50);
```

#### 路径

```javascript
// 绘制路径
ctx.beginPath();  // 开始路径
ctx.moveTo(10, 10);  // 移动到起点
ctx.lineTo(100, 100);  // 画线到点
ctx.lineTo(200, 10);  // 继续画线
ctx.closePath();  // 闭合路径

// 描边路径
ctx.strokeStyle = 'black';
ctx.stroke();

// 填充路径
ctx.fillStyle = 'green';
ctx.fill();
```

#### 圆形

```javascript
// 绘制圆形
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);  // 圆心(x,y), 半径, 起始角, 结束角
ctx.fillStyle = 'blue';
ctx.fill();

// 绘制圆弧
ctx.beginPath();
ctx.arc(200, 100, 50, 0, Math.PI);  // 半圆
ctx.strokeStyle = 'red';
ctx.stroke();
```

### 2. 样式设置

#### 颜色和渐变

```javascript
// 纯色
ctx.fillStyle = 'red';
ctx.strokeStyle = '#00ff00';

// 线性渐变
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, 'red');
gradient.addColorStop(0.5, 'yellow');
gradient.addColorStop(1, 'green');
ctx.fillStyle = gradient;
ctx.fillRect(10, 10, 200, 100);

// 径向渐变
const radialGradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 50);
radialGradient.addColorStop(0, 'white');
radialGradient.addColorStop(1, 'black');
ctx.fillStyle = radialGradient;
ctx.fillRect(50, 50, 100, 100);
```

#### 线条样式

```javascript
// 线宽
ctx.lineWidth = 5;

// 线条端点
ctx.lineCap = 'round';  // butt, round, square

// 线条连接
ctx.lineJoin = 'round';  // bevel, round, miter

// 虚线
ctx.setLineDash([5, 10]);  // 5px 实线，10px 空白
ctx.strokeStyle = 'black';
ctx.strokeRect(10, 10, 100, 100);
```

### 3. 文本绘制

```javascript
// 设置文本样式
ctx.font = '30px Arial';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// 绘制文本
ctx.fillText('Hello Canvas', 100, 100);

// 描边文本
ctx.strokeStyle = 'red';
ctx.strokeText('Stroke Text', 100, 150);

// 测量文本
const text = 'Measure Text';
const metrics = ctx.measureText(text);
console.log(metrics.width);  // 文本宽度
```

### 4. 图像操作

```javascript
// 加载图像
const img = new Image();
img.src = 'image.png';

img.onload = () => {
    // 绘制图像
    ctx.drawImage(img, 10, 10);  // 基本绘制
    
    // 缩放绘制
    ctx.drawImage(img, 10, 10, 100, 100);  // 指定宽高
    
    // 裁剪绘制
    ctx.drawImage(img, 
        50, 50, 100, 100,  // 源图像裁剪区域
        200, 200, 150, 150  // 目标区域
    );
};
```

### 5. 变换操作

```javascript
// 保存和恢复状态
ctx.save();  // 保存当前状态
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);
ctx.restore();  // 恢复之前的状态

// 平移
ctx.translate(100, 100);
ctx.fillRect(0, 0, 50, 50);  // 在(100,100)位置绘制

// 旋转
ctx.rotate(Math.PI / 4);  // 旋转45度
ctx.fillRect(0, 0, 50, 50);

// 缩放
ctx.scale(2, 2);  // 放大两倍
ctx.fillRect(0, 0, 50, 50);

// 变换矩阵
ctx.transform(1, 0, 0, 1, 100, 100);  // 平移
ctx.setTransform(1, 0, 0, 1, 0, 0);  // 重置变换
```

## 动画基础

> 本节仅介绍基础的动画循环概念。更多动画实现细节，请参考 [Canvas 动画实现](./canvas-animation.md)。

### 1. 基本动画循环

```javascript
function animate() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制内容
    draw();
    
    // 继续动画循环
    requestAnimationFrame(animate);
}

// 开始动画
animate();
```

### 2. 动画性能优化

> 更多性能优化建议，请参考 [Canvas 动画实现](./canvas-animation.md) 中的性能优化部分。

1. 使用 `requestAnimationFrame` 进行动画更新
2. 合理使用 `clearRect` 清除画布
3. 避免频繁的状态改变
4. 使用 `transform` 进行坐标变换

## 实际应用

### 1. 图形绘制
- 绘制基本图形
- 创建自定义形状
- 实现渐变效果
- 添加文本和图像

### 2. 图像处理
- 图像缩放和裁剪
- 图像滤镜效果
- 图像合成
- 图像数据操作

### 3. 数据可视化
- 绘制图表
- 创建进度条
- 实现仪表盘
- 展示数据趋势

## 最佳实践

1. 设置合适的画布尺寸
   ```javascript
   // 设置画布尺寸为设备像素比
   function resizeCanvas() {
       const dpr = window.devicePixelRatio || 1;
       canvas.width = canvas.clientWidth * dpr;
       canvas.height = canvas.clientHeight * dpr;
       ctx.scale(dpr, dpr);
   }
   ```

2. 优化绘制性能
   - 使用 `save()` 和 `restore()` 管理状态
   - 批量绘制操作
   - 避免频繁的样式改变

3. 错误处理
   ```javascript
   try {
       ctx.drawImage(img, 0, 0);
   } catch (e) {
       console.error('图像绘制失败:', e);
   }
   ```

## 相关资源

- [MDN Canvas 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)
- [Canvas 性能优化指南](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Canvas 动画实现](./canvas-animation.md) - 详细的动画实现指南
- [Canvas 游戏开发](./canvas-games.md) - Canvas 游戏开发指南 