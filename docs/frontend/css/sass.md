# Sass 预处理器

Sass 是一个强大的 CSS 预处理器，它提供了变量、嵌套、混合（mixins）、函数等高级特性，使 CSS 更易于维护和扩展。

## 安装和使用

### 安装
```bash
npm install sass -g
```

### 编译
```bash
sass input.scss output.css
```

## 基础语法

### 变量
```scss
// 定义变量
$primary-color: #3498db;
$font-size-base: 16px;
$border-radius: 4px;

// 使用变量
.button {
  background-color: $primary-color;
  font-size: $font-size-base;
  border-radius: $border-radius;
}

// 变量插值
$selector: button;
$property: color;
$value: #fff;

.#{$selector} {
  #{$property}: $value;
}

// 变量作用域
$global-variable: global;

.element {
  $local-variable: local;
  content: $global-variable;
  // content: $local-variable; // 错误：局部变量
}
```

### 混合（Mixins）
```scss
// 基本混合
@mixin border-radius($radius) {
  border-radius: $radius;
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
}

.button {
  @include border-radius(4px);
}

// 带默认值的混合
@mixin box-shadow($x: 0, $y: 0, $blur: 1px, $color: #000) {
  box-shadow: $x $y $blur $color;
}

.card {
  @include box-shadow(2px, 2px, 5px, rgba(0,0,0,0.2));
}

// 多参数混合
@mixin transition($property: all, $duration: 0.3s, $timing: ease) {
  transition: $property $duration $timing;
}

.element {
  @include transition(transform, 0.5s, ease-in-out);
}

// 内容块混合
@mixin media-query($device) {
  @if $device == mobile {
    @media (max-width: 767px) { @content; }
  } @else if $device == tablet {
    @media (min-width: 768px) and (max-width: 1024px) { @content; }
  } @else if $device == desktop {
    @media (min-width: 1025px) { @content; }
  }
}

.element {
  @include media-query(mobile) {
    font-size: 14px;
  }
}
```

### 嵌套规则
```scss
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

// 属性嵌套
.element {
  border: {
    style: solid;
    width: 1px;
    color: #ccc;
  }
  
  font: {
    family: Arial;
    size: 16px;
    weight: bold;
  }
}
```

### 运算
```scss
// 基本运算
$width: 100px;
$height: $width * 2;
$margin: $width / 2;

.element {
  width: $width;
  height: $height;
  margin: $margin;
}

// 颜色运算
$base-color: #f00;
$light-color: lighten($base-color, 10%);
$dark-color: darken($base-color, 10%);

// 单位运算
$padding: 10px;
.element {
  padding: $padding * 2;
  margin: $padding / 2;
}
```

## 高级特性

### 函数
```scss
// 内置函数
.element {
  color: lighten(#000, 10%);
  background: darken(#fff, 10%);
  border-color: rgba(#000, 0.5);
}

// 自定义函数
@function calculate-width($n) {
  @return $n * 100%;
}

.element {
  width: calculate-width(0.5);
}

// 函数参数
@function sum($numbers...) {
  $sum: 0;
  @each $number in $numbers {
    $sum: $sum + $number;
  }
  @return $sum;
}

.element {
  width: sum(10px, 20px, 30px);
}
```

### 条件语句
```scss
// if 语句
@mixin theme($theme) {
  @if $theme == dark {
    background: #000;
    color: #fff;
  } @else if $theme == light {
    background: #fff;
    color: #000;
  } @else {
    background: #eee;
    color: #333;
  }
}

// 使用条件
.element {
  @include theme(dark);
}
```

### 循环
```scss
// @for 循环
@for $i from 1 through 12 {
  .col-#{$i} {
    width: percentage($i / 12);
  }
}

// @each 循环
$sizes: (small: 12px, medium: 16px, large: 20px);

@each $name, $size in $sizes {
  .text-#{$name} {
    font-size: $size;
  }
}

// @while 循环
$i: 1;
@while $i <= 5 {
  .item-#{$i} {
    width: 20px * $i;
  }
  $i: $i + 1;
}
```

### 导入
```scss
// 导入其他Sass文件
@import "variables";
@import "mixins";
@import "components";

// 导入选项
@import "styles.css";
@import "partials/*";
```

## 最佳实践

### 文件组织
```scss
// _variables.scss
$primary-color: #3498db;
$secondary-color: #2ecc71;
$font-size-base: 16px;

// _mixins.scss
@mixin border-radius($radius) {
  border-radius: $radius;
}

// _components.scss
@import "variables";
@import "mixins";

.button {
  @include border-radius(4px);
  background: $primary-color;
}
```

### 命名规范
```scss
// 变量命名
$color-primary: #3498db;
$font-size-base: 16px;
$spacing-unit: 8px;

// 混合命名
@mixin box-shadow {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

// 类命名
.button {
  &-primary {
    background: $color-primary;
  }
  
  &-secondary {
    background: $color-secondary;
  }
}
```

### 性能优化
```scss
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
@mixin button-base {
  padding: 10px;
  border-radius: 4px;
}

.button-primary {
  @include button-base;
  background: blue;
}

.button-secondary {
  @include button-base;
  background: gray;
}
```

### 调试技巧
```scss
// 使用 @debug
@debug "变量值: #{$variable}";

// 使用 @warn
@warn "这是一个警告信息";

// 使用 @error
@error "这是一个错误信息";

// 使用 sourcemap
// 在编译时启用 sourcemap
// sass --sourcemap style.scss style.css
```

## 工具和资源

1. 开发工具
   - Sass.js
   - Webpack + sass-loader
   - Gulp + gulp-sass
   - VS Code Sass 插件

2. 在线工具
   - Sassmeister
   - CodePen
   - JSFiddle

3. 学习资源
   - Sass 官方文档
   - Sass 中文文档
   - Sass 示例库

4. 常用库
   - Compass
   - Bourbon
   - Susy
   - Breakpoint

## 与 Less 的区别

1. 语法差异
   - Sass 使用 $ 定义变量，Less 使用 @
   - Sass 使用 @mixin 和 @include，Less 使用 .mixin() 和 .mixin()
   - Sass 支持更复杂的条件语句和循环

2. 功能差异
   - Sass 支持更强大的函数
   - Sass 支持更复杂的混合
   - Sass 支持更灵活的模块系统

3. 编译方式
   - Sass 有 .scss 和 .sass 两种语法
   - Less 只有一种语法
   - Sass 编译速度通常更快

4. 社区支持
   - Sass 有更丰富的工具和库
   - Sass 有更活跃的社区
   - Sass 有更多的学习资源
