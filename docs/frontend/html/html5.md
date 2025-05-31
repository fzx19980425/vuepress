# HTML5 新特性

HTML5 是 HTML 的最新版本，它带来了许多新的特性和改进。本文将介绍 HTML5 的主要新特性。

## 语义化标签

HTML5 引入了一系列新的语义化标签，使网页结构更加清晰：

```html
<header> 定义页面的头部
<nav> 定义导航链接
<main> 定义主要内容
<article> 定义文章
<section> 定义区块
<aside> 定义侧边栏
<footer> 定义页脚
<figure> 定义图片容器
<figcaption> 定义图片说明
<time> 定义时间
<mark> 定义标记文本
```

## 表单增强

HTML5 为表单添加了许多新的输入类型和属性：

### 新的输入类型
```html
<input type="email"> 电子邮件
<input type="url"> URL
<input type="number"> 数字
<input type="range"> 范围
<input type="date"> 日期
<input type="time"> 时间
<input type="datetime-local"> 日期时间
<input type="color"> 颜色
<input type="search"> 搜索
<input type="tel"> 电话
```

### 新的表单属性
```html
<input required> 必填字段
<input placeholder="提示文本"> 占位符
<input pattern="[A-Za-z]{3}"> 正则验证
<input autofocus> 自动聚焦
<input autocomplete="on"> 自动完成
```

## 多媒体支持

HTML5 原生支持音频和视频：

### 音频
```html
<audio controls>
    <source src="music.mp3" type="audio/mpeg">
    <source src="music.ogg" type="audio/ogg">
    您的浏览器不支持音频标签。
</audio>
```

### 视频
```html
<video width="320" height="240" controls>
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.webm" type="video/webm">
    您的浏览器不支持视频标签。
</video>
```

## Canvas 绘图

HTML5 的 `<canvas>` 元素允许使用 JavaScript 进行绘图：

```html
<canvas id="myCanvas" width="200" height="200"></canvas>
<script>
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 150, 75);
</script>
```

## SVG 矢量图形

HTML5 支持内联 SVG：

```html
<svg width="100" height="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
```

## 本地存储

HTML5 提供了两种在客户端存储数据的新方法：

### localStorage
```javascript
// 存储数据
localStorage.setItem("name", "张三");
// 获取数据
var name = localStorage.getItem("name");
// 删除数据
localStorage.removeItem("name");
```

### sessionStorage
```javascript
// 存储数据
sessionStorage.setItem("name", "张三");
// 获取数据
var name = sessionStorage.getItem("name");
// 删除数据
sessionStorage.removeItem("name");
```

## Web Workers

Web Workers 允许在后台运行 JavaScript：

```javascript
// 创建 worker
var worker = new Worker("worker.js");
// 发送消息
worker.postMessage("开始工作");
// 接收消息
worker.onmessage = function(event) {
    console.log("收到消息：" + event.data);
};
```

## 地理位置

HTML5 支持获取用户的地理位置：

```javascript
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
        },
        function(error) {
            console.log("获取位置失败：" + error.message);
        }
    );
}
```

## 拖放 API

HTML5 支持拖放操作：

```html
<div draggable="true" ondragstart="drag(event)">可拖动的元素</div>
<div ondrop="drop(event)" ondragover="allowDrop(event)">放置区域</div>

<script>
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}
</script>
```

## 应用缓存

HTML5 提供了应用缓存机制，使网页可以离线访问：

```html
<!DOCTYPE html>
<html manifest="app.manifest">
<head>
    <title>离线应用</title>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

## 最佳实践

1. 使用语义化标签提高可访问性
2. 合理使用表单验证
3. 优化多媒体内容
4. 注意本地存储的安全性
5. 考虑浏览器兼容性
6. 合理使用新特性

## 注意事项

1. 检查浏览器兼容性
2. 提供适当的降级方案
3. 注意性能影响
4. 考虑移动端适配
5. 注意安全性问题 