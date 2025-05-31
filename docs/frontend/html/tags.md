# 常用 HTML 标签

## 文本标签

### 标题标签
```html
<h1>到 <h6> 用于定义标题
```

### 段落和文本格式化
```html
<p>段落</p>
<br>换行
<hr>水平线
<strong>粗体文本</strong>
<em>斜体文本</em>
<mark>标记文本</mark>
<small>小号文本</small>
<del>删除文本</del>
<ins>插入文本</ins>
<sub>下标文本</sub>
<sup>上标文本</sup>
```

## 列表标签

### 无序列表
```html
<ul>
    <li>列表项 1</li>
    <li>列表项 2</li>
</ul>
```

### 有序列表
```html
<ol>
    <li>第一项</li>
    <li>第二项</li>
</ol>
```

### 定义列表
```html
<dl>
    <dt>术语</dt>
    <dd>描述</dd>
</dl>
```

## 链接和图片

### 链接
```html
<a href="url">链接文本</a>
<a href="mailto:email@example.com">发送邮件</a>
<a href="tel:+1234567890">拨打电话</a>
```

### 图片
```html
<img src="image.jpg" alt="替代文本" width="300" height="200">
```

## 表格标签

```html
<table>
    <caption>表格标题</caption>
    <thead>
        <tr>
            <th>表头 1</th>
            <th>表头 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>数据 1</td>
            <td>数据 2</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>页脚 1</td>
            <td>页脚 2</td>
        </tr>
    </tfoot>
</table>
```

## 表单标签

```html
<form action="/submit" method="post">
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username">
    
    <label for="password">密码：</label>
    <input type="password" id="password" name="password">
    
    <input type="submit" value="提交">
</form>
```

### 常用表单元素
```html
<input type="text"> 文本输入
<input type="password"> 密码输入
<input type="radio"> 单选按钮
<input type="checkbox"> 复选框
<input type="file"> 文件上传
<input type="submit"> 提交按钮
<input type="reset"> 重置按钮
<input type="button"> 普通按钮
<select> 下拉列表
<textarea> 文本区域
```

## 语义化标签

```html
<header> 页眉
<nav> 导航
<main> 主要内容
<article> 文章
<section> 区块
<aside> 侧边栏
<footer> 页脚
<figure> 图片容器
<figcaption> 图片说明
<time> 时间
<mark> 标记
```

## 多媒体标签

```html
<audio src="music.mp3" controls>音频</audio>
<video src="video.mp4" controls>视频</video>
<iframe src="url">内嵌框架</iframe>
<canvas>画布</canvas>
<svg>矢量图形</svg>
```

## 元数据标签

```html
<head>
    <meta charset="UTF-8">
    <meta name="description" content="页面描述">
    <meta name="keywords" content="关键词">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <script src="script.js"></script>
</head>
```

## 最佳实践

1. 选择合适的标签
2. 保持标签语义化
3. 正确嵌套标签
4. 使用适当的属性
5. 确保可访问性
6. 保持代码整洁

## 注意事项

1. 避免使用过时的标签
2. 注意标签的兼容性
3. 合理使用嵌套层级
4. 保持代码的可维护性
5. 考虑移动端适配 