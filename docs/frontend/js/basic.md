# JavaScript 基础

JavaScript 是一种轻量级的解释型编程语言，本文将介绍 JavaScript 的基础语法和核心概念。

## 在 HTML 中使用 JavaScript

### 内部脚本

```html
<script>
    // JavaScript 代码
    console.log("Hello, World!");
</script>
```

### 外部脚本

```html
<script src="script.js"></script>
```

### 脚本位置

```html
<!-- 推荐放在 body 结束标签前 -->
<body>
    <!-- 页面内容 -->
    <script src="script.js"></script>
</body>
```

## 基本语法

### 语句和分号

```javascript
// 语句以分号结束
console.log("Hello");
console.log("World");

// 也可以省略分号（不推荐）
console.log("Hello")
console.log("World")
```

### 注释

```javascript
// 单行注释

/*
 * 多行注释
 * 可以写多行
 */
```

### 变量声明

```javascript
// 使用 var（不推荐）
var name = "John";

// 使用 let（推荐）
let age = 25;

// 使用 const（推荐用于常量）
const PI = 3.14159;
```

## 数据类型

### 基本类型

```javascript
// 字符串
let name = "John";

// 数字
let age = 25;
let price = 99.99;

// 布尔值
let isStudent = true;

// undefined
let x;
console.log(x); // undefined

// null
let y = null;

// Symbol（ES6）
let sym = Symbol("description");
```

### 引用类型

```javascript
// 对象
let person = {
    name: "John",
    age: 25
};

// 数组
let colors = ["red", "green", "blue"];

// 函数
function greet(name) {
    return "Hello, " + name;
}
```

## 运算符

### 算术运算符

```javascript
let a = 10;
let b = 3;

console.log(a + b);  // 加法：13
console.log(a - b);  // 减法：7
console.log(a * b);  // 乘法：30
console.log(a / b);  // 除法：3.333...
console.log(a % b);  // 取余：1
console.log(a ** b); // 幂运算：1000
```

### 比较运算符

```javascript
let x = 5;
let y = "5";

console.log(x == y);   // 相等：true
console.log(x === y);  // 严格相等：false
console.log(x != y);   // 不相等：false
console.log(x !== y);  // 严格不相等：true
console.log(x > 3);    // 大于：true
console.log(x < 10);   // 小于：true
console.log(x >= 5);   // 大于等于：true
console.log(x <= 5);   // 小于等于：true
```

### 逻辑运算符

```javascript
let a = true;
let b = false;

console.log(a && b);  // 逻辑与：false
console.log(a || b);  // 逻辑或：true
console.log(!a);      // 逻辑非：false
```

## 类型转换

### 显式转换

```javascript
// 转换为字符串
let num = 123;
let str = String(num);
let str2 = num.toString();

// 转换为数字
let str3 = "123";
let num2 = Number(str3);
let num3 = parseInt(str3);
let num4 = parseFloat("123.45");

// 转换为布尔值
let str4 = "true";
let bool = Boolean(str4);
```

### 隐式转换

```javascript
// 字符串连接
console.log("2" + 2);  // "22"

// 数字运算
console.log("2" - 2);  // 0
console.log("2" * 2);  // 4
console.log("2" / 2);  // 1

// 布尔运算
console.log(true + 1);  // 2
console.log(false + 1); // 1
```

## 基本输出

```javascript
// 控制台输出
console.log("Hello, World!");
console.info("信息");
console.warn("警告");
console.error("错误");

// 弹窗输出
alert("Hello, World!");

// 确认框
let result = confirm("确定要删除吗？");

// 输入框
let name = prompt("请输入您的名字：");
```

## 代码块和作用域

```javascript
// 代码块
{
    let x = 1;
    const y = 2;
    var z = 3;
}

// 作用域
let globalVar = "全局变量";

function test() {
    let localVar = "局部变量";
    console.log(globalVar);  // 可以访问
    console.log(localVar);   // 可以访问
}

console.log(globalVar);  // 可以访问
console.log(localVar);   // 错误：localVar is not defined
```

## 最佳实践

1. **变量声明**
   - 使用 `let` 和 `const` 代替 `var`
   - 变量名使用有意义的名称
   - 使用驼峰命名法

2. **代码风格**
   - 保持代码缩进一致
   - 使用分号结束语句
   - 适当添加注释
   - 保持代码简洁

3. **性能优化**
   - 避免全局变量
   - 及时释放不需要的变量
   - 使用严格模式

4. **调试技巧**
   - 使用 `console.log()` 调试
   - 使用浏览器开发者工具
   - 使用断点调试

## 常见错误

1. **语法错误**
   - 缺少分号
   - 括号不匹配
   - 引号不匹配

2. **类型错误**
   - 使用未定义的变量
   - 类型转换错误
   - 访问不存在的属性

3. **逻辑错误**
   - 条件判断错误
   - 循环条件错误
   - 运算符使用错误

## 下一步

在掌握了 JavaScript 基础之后，您可以：
- 学习数据类型和变量
- 深入了解运算符和表达式
- 学习流程控制
- 探索函数和作用域
- 开始实践项目 