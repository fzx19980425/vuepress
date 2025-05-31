# JavaScript 数据类型和变量

JavaScript 是一种动态类型语言，这意味着变量可以持有任何类型的数据。本文将详细介绍 JavaScript 中的数据类型和变量使用。

## 数据类型概述

JavaScript 中的数据类型可以分为两大类：
1. 基本类型（Primitive Types）
2. 引用类型（Reference Types）

## 基本类型

### 1. 字符串（String）

```javascript
// 字符串声明
let str1 = 'Hello';  // 单引号
let str2 = "World";  // 双引号
let str3 = `Hello ${str2}`;  // 模板字符串

// 字符串方法
let str = "JavaScript";
console.log(str.length);        // 长度：10
console.log(str.toUpperCase()); // 转大写：JAVASCRIPT
console.log(str.toLowerCase()); // 转小写：javascript
console.log(str.indexOf("a"));  // 查找位置：1
console.log(str.slice(0, 4));   // 截取：Java
console.log(str.split(""));     // 分割：['J','a','v','a','S','c','r','i','p','t']
```

### 2. 数字（Number）

```javascript
// 整数和浮点数
let num1 = 42;      // 整数
let num2 = 3.14;    // 浮点数
let num3 = 1e6;     // 科学计数法：1000000
let num4 = 0xFF;    // 十六进制：255

// 特殊数值
let inf = Infinity;     // 无穷大
let negInf = -Infinity; // 负无穷大
let nan = NaN;          // 非数字

// 数字方法
let num = 123.456;
console.log(num.toFixed(2));    // 保留小数：123.46
console.log(num.toString(16));  // 转十六进制：7b.74bc6a7ef9db2
console.log(Number.isInteger(num)); // 判断整数：false
```

### 3. 布尔值（Boolean）

```javascript
let isTrue = true;
let isFalse = false;

// 布尔运算
console.log(true && false);  // 与运算：false
console.log(true || false);  // 或运算：true
console.log(!true);          // 非运算：false

// 转换为布尔值
console.log(Boolean(1));     // true
console.log(Boolean(0));     // false
console.log(Boolean(""));    // false
console.log(Boolean("0"));   // true
```

### 4. Undefined

```javascript
let x;
console.log(x);  // undefined
console.log(typeof x);  // "undefined"

// 未声明的变量
console.log(y);  // ReferenceError: y is not defined
```

### 5. Null

```javascript
let x = null;
console.log(x);  // null
console.log(typeof x);  // "object"（这是 JavaScript 的一个历史遗留 bug）
```

### 6. Symbol（ES6）

```javascript
// 创建 Symbol
let sym1 = Symbol("description");
let sym2 = Symbol("description");

console.log(sym1 === sym2);  // false，每个 Symbol 都是唯一的

// 全局 Symbol
let sym3 = Symbol.for("global");
let sym4 = Symbol.for("global");
console.log(sym3 === sym4);  // true
```

## 引用类型

### 1. 对象（Object）

```javascript
// 对象字面量
let person = {
    name: "John",
    age: 30,
    sayHello: function() {
        console.log("Hello!");
    }
};

// 访问属性
console.log(person.name);     // 点语法
console.log(person["age"]);   // 方括号语法

// 修改属性
person.name = "Jane";
person["age"] = 25;

// 添加新属性
person.job = "Developer";

// 删除属性
delete person.age;
```

### 2. 数组（Array）

```javascript
// 数组声明
let arr1 = [1, 2, 3];
let arr2 = new Array(1, 2, 3);

// 数组方法
let arr = [1, 2, 3, 4, 5];

// 添加/删除元素
arr.push(6);        // 末尾添加
arr.pop();          // 末尾删除
arr.unshift(0);     // 开头添加
arr.shift();        // 开头删除

// 数组操作
arr.splice(1, 2);   // 从索引1开始删除2个元素
arr.slice(1, 3);    // 截取索引1到3的元素
arr.concat([6, 7]); // 连接数组
arr.reverse();      // 反转数组
arr.sort();         // 排序

// 数组遍历
arr.forEach(item => console.log(item));
let doubled = arr.map(item => item * 2);
let filtered = arr.filter(item => item > 3);
```

### 3. 函数（Function）

```javascript
// 函数声明
function greet(name) {
    return "Hello, " + name;
}

// 函数表达式
let greet2 = function(name) {
    return "Hello, " + name;
};

// 箭头函数
let greet3 = (name) => "Hello, " + name;

// 函数作为对象
function Person(name) {
    this.name = name;
}
Person.prototype.sayHello = function() {
    console.log("Hello, " + this.name);
};
```

## 类型检测

### typeof 运算符

```javascript
console.log(typeof "Hello");    // "string"
console.log(typeof 42);         // "number"
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"
console.log(typeof null);       // "object"
console.log(typeof {});         // "object"
console.log(typeof []);         // "object"
console.log(typeof function(){}); // "function"
```

### instanceof 运算符

```javascript
let arr = [];
console.log(arr instanceof Array);    // true
console.log(arr instanceof Object);   // true

let date = new Date();
console.log(date instanceof Date);    // true
console.log(date instanceof Object);  // true
```

### Object.prototype.toString

```javascript
console.log(Object.prototype.toString.call(""));     // "[object String]"
console.log(Object.prototype.toString.call(42));     // "[object Number]"
console.log(Object.prototype.toString.call(true));   // "[object Boolean]"
console.log(Object.prototype.toString.call([]));     // "[object Array]"
console.log(Object.prototype.toString.call({}));     // "[object Object]"
console.log(Object.prototype.toString.call(null));   // "[object Null]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
```

## 变量声明和作用域

### var、let 和 const

```javascript
// var（不推荐使用）
var x = 1;
var x = 2;  // 允许重复声明

// let（推荐使用）
let y = 1;
let y = 2;  // 错误：Identifier 'y' has already been declared

// const（推荐用于常量）
const z = 1;
z = 2;  // 错误：Assignment to constant variable
```

### 作用域

```javascript
// 全局作用域
let globalVar = "global";

function test() {
    // 函数作用域
    let functionVar = "function";
    
    {
        // 块级作用域
        let blockVar = "block";
        console.log(blockVar);    // 可以访问
    }
    
    console.log(functionVar);     // 可以访问
    console.log(blockVar);        // 错误：blockVar is not defined
}

console.log(globalVar);           // 可以访问
console.log(functionVar);         // 错误：functionVar is not defined
```

## 类型转换

### 显式转换

```javascript
// 转换为字符串
String(123);      // "123"
(123).toString(); // "123"

// 转换为数字
Number("123");    // 123
parseInt("123");  // 123
parseFloat("123.45"); // 123.45

// 转换为布尔值
Boolean(1);       // true
Boolean(0);       // false
Boolean("");      // false
Boolean("0");     // true
```

### 隐式转换

```javascript
// 字符串连接
"2" + 2;         // "22"

// 数字运算
"2" - 2;         // 0
"2" * 2;         // 4
"2" / 2;         // 1

// 布尔运算
true + 1;        // 2
false + 1;       // 1

// 比较运算
"2" == 2;        // true
"2" === 2;       // false
```

## 最佳实践

1. **变量声明**
   - 优先使用 `const`，其次使用 `let`
   - 避免使用 `var`
   - 变量名要有意义
   - 使用驼峰命名法

2. **类型使用**
   - 使用严格相等（===）进行比较
   - 注意类型转换的副作用
   - 合理使用类型检测方法

3. **性能优化**
   - 避免频繁的类型转换
   - 合理使用基本类型和引用类型
   - 注意内存管理

## 常见问题

1. **类型转换陷阱**
   - 字符串和数字的隐式转换
   - 布尔值的真值判断
   - null 和 undefined 的区别

2. **作用域问题**
   - 变量提升
   - 闭包
   - this 指向

3. **引用类型陷阱**
   - 浅拷贝和深拷贝
   - 原型链
   - 内存泄漏

## 下一步

在掌握了数据类型和变量之后，您可以：
- 学习运算符和表达式
- 深入了解流程控制
- 探索函数和作用域
- 学习对象和原型
- 开始实践项目 