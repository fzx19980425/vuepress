# Less 预处理器

Less 是一种 CSS 预处理器，它扩展了 CSS 语言，添加了变量、混合、函数等特性，使 CSS 更易于维护和扩展。

## 安装和使用

### 安装
```bash
npm install less -g
```

### 编译
```bash
lessc styles.less styles.css
```

## 基础语法

### 变量
```less
// 定义变量
@primary-color: #3498db;
@font-size-base: 16px;
@border-radius: 4px;

// 使用变量
.button {
  background-color: @primary-color;
  font-size: @font-size-base;
  border-radius: @border-radius;
}

// 变量插值
@selector: button;
@property: color;
@value: #fff;

.@{selector} {
  @{property}: @value;
}
```

### 混合（Mixins）
```less
// 基本混合
.border-radius(@radius) {
  border-radius: @radius;
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
}

.button {
  .border-radius(4px);
}

// 带默认值的混合
.box-shadow(@x: 0, @y: 0, @blur: 1px, @color: #000) {
  box-shadow: @x @y @blur @color;
}

.card {
  .box-shadow(2px, 2px, 5px, rgba(0,0,0,0.2));
}

// 多参数混合
.transition(@property: all, @duration: 0.3s, @timing: ease) {
  transition: @property @duration @timing;
}

.element {
  .transition(transform, 0.5s, ease-in-out);
}
```

### 嵌套规则
```less
// 基本嵌套
.nav {
  background: #fff;
  
  ul {
    list-style: none;
    
    li {
      display: inline-block;
      
      a {
        color: #333;
        text-decoration: none;
        
        &:hover {
          color: #666;
        }
      }
    }
  }
}

// 父选择器引用
.button {
  &-primary {
    background: blue;
  }
  
  &-secondary {
    background: gray;
  }
  
  &:hover {
    opacity: 0.8;
  }
  
  &::before {
    content: "";
  }
}
```

### 运算
```less
// 基本运算
@width: 100px;
@height: @width * 2;
@margin: @width / 2;

.element {
  width: @width;
  height: @height;
  margin: @margin;
}

// 颜色运算
@base-color: #f00;
@light-color: @base-color + #111;
@dark-color: @base-color - #111;

// 单位运算
@padding: 10px;
.element {
  padding: @padding * 2;
  margin: @padding / 2;
}
```

## 高级特性

### 函数
```less
// 内置函数
.element {
  color: lighten(#000, 10%);
  background: darken(#fff, 10%);
  border-color: fade(#000, 50%);
}

// 自定义函数
.average(@x, @y) {
  @result: (@x + @y) / 2;
}

.element {
  width: average(100px, 200px);
}
```

### 条件语句
```less
// 混合条件
.mixin(@color) when (lightness(@color) > 50%) {
  background-color: black;
  color: white;
}

.mixin(@color) when (lightness(@color) <= 50%) {
  background-color: white;
  color: black;
}

// 使用条件
.element {
  .mixin(#ddd);
}
```

### 循环
```less
// 使用递归实现循环
.generate-columns(@n, @i: 1) when (@i <= @n) {
  .col-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}

// 生成12列网格
.generate-columns(12);
```

### 导入
```less
// 导入其他Less文件
@import "variables.less";
@import "mixins.less";
@import "components.less";

// 导入选项
@import (less) "styles.css";
@import (once) "styles.less";
@import (multiple) "styles.less";
```

## 最佳实践

### 文件组织
```less
// variables.less
@primary-color: #3498db;
@secondary-color: #2ecc71;
@font-size-base: 16px;

// mixins.less
.border-radius(@radius) {
  border-radius: @radius;
}

// components.less
@import "variables.less";
@import "mixins.less";

.button {
  .border-radius(4px);
  background: @primary-color;
}
```

### 命名规范
```less
// 变量命名
@color-primary: #3498db;
@font-size-base: 16px;
@spacing-unit: 8px;

// 混合命名
.mixin-box-shadow() {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

// 类命名
.button {
  &-primary {
    background: @color-primary;
  }
  
  &-secondary {
    background: @color-secondary;
  }
}
```

### 性能优化
```less
// 避免过度嵌套
// 不推荐
.nav {
  ul {
    li {
      a {
        span {
          color: red;
        }
      }
    }
  }
}

// 推荐
.nav-link {
  color: red;
}

// 使用混合减少代码重复
// 不推荐
.button-primary {
  padding: 10px;
  border-radius: 4px;
  background: blue;
}

.button-secondary {
  padding: 10px;
  border-radius: 4px;
  background: gray;
}

// 推荐
.button-base() {
  padding: 10px;
  border-radius: 4px;
}

.button-primary {
  .button-base();
  background: blue;
}

.button-secondary {
  .button-base();
  background: gray;
}
```

### 调试技巧
```less
// 使用注释调试
.debug(@value) {
  /* 调试值: @{value} */
}

// 使用变量调试
@debug: true;
.debug-mixin() when (@debug = true) {
  border: 1px solid red;
}

.element {
  .debug-mixin();
}
```

## 工具和资源

1. 开发工具
   - Less.js
   - Webpack + less-loader
   - Gulp + gulp-less
   - VS Code Less 插件

2. 在线工具
   - Less2CSS
   - CodePen
   - JSFiddle

3. 学习资源
   - Less 官方文档
   - Less 中文文档
   - Less 示例库

4. 常用库
   - Lesshat
   - Preboot
   - Less Elements

## 与 Sass 的区别

1. Less 使用 JavaScript 编译，Sass 使用 Ruby
2. Less 的语法更接近 CSS
3. Less 的变量使用 @ 符号，Sass 使用 $ 符号
4. Less 的混合更简单，Sass 的混合更强大

## 调试技巧

1. 使用 source maps
2. 使用浏览器开发工具
3. 合理使用注释
4. 使用 Less 的调试函数
