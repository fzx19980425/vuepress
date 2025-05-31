# CSS 前缀

CSS前缀（Vendor Prefix）是浏览器厂商为了支持新的CSS特性而添加的特殊前缀。本文将介绍CSS前缀的使用方法和最佳实践。

## 浏览器前缀

### 1. 常用前缀
```css
/* -webkit- (Chrome, Safari, 新版Opera) */
-webkit-transform: translateX(100px);

/* -moz- (Firefox) */
-moz-transform: translateX(100px);

/* -ms- (IE, Edge) */
-ms-transform: translateX(100px);

/* -o- (旧版Opera) */
-o-transform: translateX(100px);
```

### 2. 标准写法
```css
/* 带前缀的属性 */
.element {
  -webkit-transform: translateX(100px);
  -moz-transform: translateX(100px);
  -ms-transform: translateX(100px);
  -o-transform: translateX(100px);
  transform: translateX(100px); /* 标准写法放在最后 */
}
```

## 常用属性前缀

### 1. 变换属性
```css
.element {
  /* transform */
  -webkit-transform: translateX(100px);
  -moz-transform: translateX(100px);
  -ms-transform: translateX(100px);
  -o-transform: translateX(100px);
  transform: translateX(100px);

  /* transform-origin */
  -webkit-transform-origin: center;
  -moz-transform-origin: center;
  -ms-transform-origin: center;
  -o-transform-origin: center;
  transform-origin: center;

  /* transform-style */
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  -o-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
```

### 2. 过渡属性
```css
.element {
  /* transition */
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;

  /* transition-property */
  -webkit-transition-property: transform;
  -moz-transition-property: transform;
  -ms-transition-property: transform;
  -o-transition-property: transform;
  transition-property: transform;

  /* transition-duration */
  -webkit-transition-duration: 0.3s;
  -moz-transition-duration: 0.3s;
  -ms-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
}
```

### 3. 动画属性
```css
/* @keyframes */
@-webkit-keyframes slide {
  from { -webkit-transform: translateX(0); }
  to { -webkit-transform: translateX(100px); }
}

@-moz-keyframes slide {
  from { -moz-transform: translateX(0); }
  to { -moz-transform: translateX(100px); }
}

@-ms-keyframes slide {
  from { -ms-transform: translateX(0); }
  to { -ms-transform: translateX(100px); }
}

@-o-keyframes slide {
  from { -o-transform: translateX(0); }
  to { -o-transform: translateX(100px); }
}

@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

/* animation */
.element {
  -webkit-animation: slide 1s ease;
  -moz-animation: slide 1s ease;
  -ms-animation: slide 1s ease;
  -o-animation: slide 1s ease;
  animation: slide 1s ease;
}
```

### 4. 弹性布局
```css
.container {
  /* display */
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;

  /* flex-direction */
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;

  /* justify-content */
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;

  /* align-items */
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
```

### 5. 网格布局
```css
.container {
  /* display */
  display: -ms-grid;
  display: grid;

  /* grid-template-columns */
  -ms-grid-columns: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;

  /* grid-template-rows */
  -ms-grid-rows: auto;
  grid-template-rows: auto;

  /* grid-gap */
  grid-gap: 20px;
  gap: 20px;
}
```

## 自动化处理

### 1. Autoprefixer
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: [
        'last 2 versions',
        '> 1%',
        'IE 10'
      ]
    })
  ]
}
```

### 2. PostCSS
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 3
    })
  ]
}
```

### 3. 构建工具配置
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  }
}
```

## 最佳实践

### 1. 使用工具
```css
/* 不推荐手动添加前缀 */
.element {
  -webkit-transform: translateX(100px);
  -moz-transform: translateX(100px);
  -ms-transform: translateX(100px);
  -o-transform: translateX(100px);
  transform: translateX(100px);
}

/* 推荐使用工具自动添加 */
.element {
  transform: translateX(100px);
}
```

### 2. 浏览器支持
```json
// .browserslistrc
{
  "browsers": [
    "last 2 versions",
    "> 1%",
    "IE 10"
  ]
}
```

### 3. 渐进增强
```css
/* 基础样式 */
.button {
  padding: 10px;
  border: 1px solid #ccc;
}

/* 增强样式 */
@supports (display: flex) {
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

## 常见问题

### 1. 前缀顺序
```css
/* 正确的顺序 */
.element {
  -webkit-transform: translateX(100px);
  -moz-transform: translateX(100px);
  -ms-transform: translateX(100px);
  -o-transform: translateX(100px);
  transform: translateX(100px); /* 标准写法放在最后 */
}
```

### 2. 前缀兼容性
```css
/* 检查浏览器支持 */
@supports (transform: translateX(100px)) {
  .element {
    transform: translateX(100px);
  }
}

/* 降级方案 */
@supports not (transform: translateX(100px)) {
  .element {
    /* 降级样式 */
  }
}
```

### 3. 性能考虑
```css
/* 避免过度使用前缀 */
.element {
  /* 只添加必要的前缀 */
  -webkit-transform: translateX(100px);
  transform: translateX(100px);
}
```

## 工具和资源

### 1. 在线工具
- [Autoprefixer CSS Online](https://autoprefixer.github.io/)
- [Prefix Free](https://leaverou.github.io/prefixfree/)
- [Can I Use](https://caniuse.com/)

### 2. 开发工具
- VS Code插件
- Chrome DevTools
- Firefox Developer Tools

### 3. 构建工具
- Webpack
- Gulp
- Grunt

## 维护建议

### 1. 版本控制
- 使用Browserslist
- 定期更新支持范围
- 跟踪浏览器更新

### 2. 代码规范
- 使用自动化工具
- 保持代码整洁
- 添加必要注释

### 3. 测试策略
- 跨浏览器测试
- 自动化测试
- 性能测试 