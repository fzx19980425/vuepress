# JavaScript 函数和作用域

函数是 JavaScript 中的一等公民，它们可以像其他数据类型一样被传递和使用。本文将详细介绍 JavaScript 中的函数和作用域概念。

## 函数基础

### 函数声明

```javascript
// 函数声明
function greet(name) {
    return "Hello, " + name;
}

// 函数表达式
const greet2 = function(name) {
    return "Hello, " + name;
};

// 箭头函数（ES6）
const greet3 = (name) => "Hello, " + name;

// 立即执行函数表达式（IIFE）
(function() {
    console.log("立即执行");
})();

// 函数构造函数（不推荐使用）
const greet4 = new Function("name", "return 'Hello, ' + name");
```

### 函数参数

```javascript
// 基本参数
function add(a, b) {
    return a + b;
}

// 默认参数（ES6）
function greet(name = "Guest") {
    return "Hello, " + name;
}

// 剩余参数（ES6）
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

// 解构参数（ES6）
function printUser({name, age}) {
    console.log(`${name} is ${age} years old`);
}

// 参数对象
function logArgs() {
    console.log(arguments);  // 类数组对象
    console.log(Array.from(arguments));  // 转换为数组
}
```

### 函数返回值

```javascript
// 基本返回
function add(a, b) {
    return a + b;
}

// 返回多个值
function getCoordinates() {
    return {
        x: 10,
        y: 20
    };
}

// 返回函数
function createCounter() {
    let count = 0;
    return function() {
        return ++count;
    };
}

// 无返回值
function logMessage(message) {
    console.log(message);
    // 隐式返回 undefined
}
```

## 函数进阶

### 函数属性

```javascript
// 函数名
function greet() {}
console.log(greet.name);  // "greet"

// 函数长度（参数个数）
function add(a, b, c) {}
console.log(add.length);  // 3

// 自定义属性
function counter() {
    return counter.count++;
}
counter.count = 0;
```

### 函数方法

```javascript
// call 方法
function greet(name) {
    console.log(`Hello, ${name}! I'm ${this.title}`);
}

const person = {title: "Mr."};
greet.call(person, "John");

// apply 方法
const numbers = [1, 2, 3];
Math.max.apply(null, numbers);

// bind 方法
const greetPerson = greet.bind(person);
greetPerson("John");

// toString 方法
console.log(greet.toString());  // 返回函数的源代码
```

### 高阶函数

```javascript
// 函数作为参数
function map(array, transform) {
    return array.map(transform);
}

// 函数作为返回值
function multiply(x) {
    return function(y) {
        return x * y;
    };
}

// 实际应用
const numbers = [1, 2, 3, 4, 5];
const doubled = map(numbers, x => x * 2);
const multiplyByTwo = multiply(2);
console.log(multiplyByTwo(4));  // 8
```

## 作用域

### 词法作用域

```javascript
// 全局作用域
const globalVar = "global";

function outer() {
    // 函数作用域
    const outerVar = "outer";
    
    function inner() {
        // 内部函数作用域
        const innerVar = "inner";
        console.log(globalVar);   // 可以访问
        console.log(outerVar);    // 可以访问
        console.log(innerVar);    // 可以访问
    }
    
    inner();
}

// 块级作用域（ES6）
{
    const blockVar = "block";
    console.log(blockVar);  // 可以访问
}
console.log(blockVar);  // 错误：blockVar is not defined
```

### 作用域链

```javascript
const global = "global";

function outer() {
    const outer = "outer";
    
    function inner() {
        const inner = "inner";
        
        function deepest() {
            const deepest = "deepest";
            console.log(deepest);  // 可以访问所有变量
            console.log(inner);
            console.log(outer);
            console.log(global);
        }
        
        deepest();
    }
    
    inner();
}
```

### 变量提升

```javascript
// 变量声明提升
console.log(x);  // undefined
var x = 5;

// 函数声明提升
sayHello();  // "Hello"
function sayHello() {
    console.log("Hello");
}

// let 和 const 的暂时性死区
console.log(y);  // ReferenceError
let y = 5;
```

## 闭包

### 基本概念

```javascript
// 基本闭包
function createCounter() {
    let count = 0;
    return function() {
        return ++count;
    };
}

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2

// 私有变量
function createPerson(name) {
    let _name = name;  // 私有变量
    
    return {
        getName() {
            return _name;
        },
        setName(newName) {
            _name = newName;
        }
    };
}
```

### 闭包应用

```javascript
// 模块模式
const calculator = (function() {
    let result = 0;
    
    return {
        add(x) {
            result += x;
            return this;
        },
        subtract(x) {
            result -= x;
            return this;
        },
        getResult() {
            return result;
        }
    };
})();

// 函数工厂
function createMultiplier(factor) {
    return function(x) {
        return x * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
```

## this 关键字

### this 的指向

```javascript
// 全局上下文
console.log(this);  // Window 对象

// 函数上下文
function test() {
    console.log(this);
}

// 方法调用
const obj = {
    name: "John",
    sayHello() {
        console.log(this.name);
    }
};

// 构造函数
function Person(name) {
    this.name = name;
}

// 箭头函数
const arrow = () => {
    console.log(this);
};
```

### 改变 this 指向

```javascript
// call 方法
function greet() {
    console.log(`Hello, ${this.name}`);
}

const person = {name: "John"};
greet.call(person);

// apply 方法
function sum(a, b) {
    return a + b;
}
sum.apply(null, [1, 2]);

// bind 方法
const greetPerson = greet.bind(person);
greetPerson();
```

## 函数式编程

### 纯函数

```javascript
// 纯函数
function add(a, b) {
    return a + b;
}

// 非纯函数
let total = 0;
function addToTotal(x) {
    total += x;
    return total;
}
```

### 函数组合

```javascript
// 基本组合
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

// 实际应用
const addOne = x => x + 1;
const double = x => x * 2;
const addOneAndDouble = compose(double, addOne);
console.log(addOneAndDouble(3));  // 8
```

### 柯里化

```javascript
// 基本柯里化
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...moreArgs) {
            return curried.apply(this, args.concat(moreArgs));
        };
    };
}

// 实际应用
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3));  // 6
```

## 最佳实践

1. **函数设计**
   - 保持函数单一职责
   - 使用有意义的函数名
   - 控制函数参数数量
   - 避免副作用

2. **作用域使用**
   - 使用 let 和 const
   - 避免全局变量
   - 合理使用闭包
   - 注意变量提升

3. **性能优化**
   - 避免过度使用闭包
   - 合理使用函数缓存
   - 注意内存泄漏
   - 使用适当的函数类型

4. **代码组织**
   - 模块化设计
   - 使用函数式编程
   - 保持代码简洁
   - 适当使用注释

## 常见问题

1. **作用域问题**
   - 变量提升
   - 闭包陷阱
   - this 指向
   - 块级作用域

2. **函数问题**
   - 参数传递
   - 返回值处理
   - 递归优化
   - 异步函数

3. **性能问题**
   - 内存泄漏
   - 函数调用开销
   - 闭包性能
   - 作用域链查找

## 下一步

在掌握了函数和作用域之后，您可以：
- 学习对象和原型
- 深入了解数组和集合
- 探索异步编程
- 学习模块化开发
- 开始实践项目 