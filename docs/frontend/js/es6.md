# ES6+ 特性

## 什么是 ES6+

ES6（ECMAScript 2015）是 JavaScript 的一个重要版本，引入了许多新特性。ES6+ 泛指 ES6 及之后版本的新特性。

## 变量声明

### let 和 const

```javascript
// let 声明块级作用域变量
let x = 1;
if (true) {
    let x = 2; // 不同的变量
    console.log(x); // 2
}
console.log(x); // 1

// const 声明常量
const PI = 3.14159;
// PI = 3.14; // 错误：不能修改常量

// const 对象
const obj = { name: 'John' };
obj.name = 'Jane'; // 可以修改对象属性
// obj = {}; // 错误：不能重新赋值
```

## 箭头函数

```javascript
// 基本语法
const add = (a, b) => a + b;

// 多行函数体
const multiply = (a, b) => {
    const result = a * b;
    return result;
};

// 返回对象
const createUser = (name, age) => ({ name, age });

// 与 this 的关系
class Counter {
    constructor() {
        this.count = 0;
    }
    
    // 错误：箭头函数中的 this 指向外部作用域
    increment = () => {
        this.count++;
    }
}
```

## 解构赋值

### 数组解构

```javascript
// 基本解构
const [a, b] = [1, 2];
console.log(a, b); // 1, 2

// 默认值
const [x = 1, y = 2] = [];
console.log(x, y); // 1, 2

// 剩余元素
const [first, ...rest] = [1, 2, 3, 4];
console.log(first, rest); // 1, [2, 3, 4]

// 交换变量
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
```

### 对象解构

```javascript
// 基本解构
const { name, age } = { name: 'John', age: 30 };
console.log(name, age); // 'John', 30

// 重命名
const { name: userName, age: userAge } = { name: 'John', age: 30 };
console.log(userName, userAge); // 'John', 30

// 默认值
const { title = 'Untitled', author = 'Anonymous' } = {};
console.log(title, author); // 'Untitled', 'Anonymous'

// 嵌套解构
const { user: { name, address: { city } } } = {
    user: { name: 'John', address: { city: 'New York' } }
};
console.log(name, city); // 'John', 'New York'
```

## 模板字符串

```javascript
// 基本用法
const name = 'John';
const greeting = `Hello, ${name}!`;

// 多行字符串
const html = `
    <div>
        <h1>${title}</h1>
        <p>${content}</p>
    </div>
`;

// 标签模板
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] ? `<span>${values[i]}</span>` : '');
    }, '');
}

const name = 'John';
const age = 30;
const result = highlight`Hello, ${name}! You are ${age} years old.`;
```

## 扩展运算符和剩余参数

```javascript
// 数组扩展
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log(arr2); // [1, 2, 3, 4, 5]

// 对象扩展
const obj1 = { foo: 'bar', x: 42 };
const obj2 = { ...obj1, y: 13 };
console.log(obj2); // { foo: 'bar', x: 42, y: 13 }

// 剩余参数
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4)); // 10
```

## 类和继承

```javascript
// 类定义
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(`${this.name} makes a sound.`);
    }
    
    // 静态方法
    static create(name) {
        return new Animal(name);
    }
}

// 继承
class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    speak() {
        console.log(`${this.name} barks!`);
    }
    
    // getter
    get description() {
        return `${this.name} is a ${this.breed}`;
    }
    
    // setter
    set age(value) {
        this._age = value;
    }
}

// 使用
const dog = new Dog('Rex', 'German Shepherd');
dog.speak(); // 'Rex barks!'
console.log(dog.description); // 'Rex is a German Shepherd'
```

## 模块化

### 导出

```javascript
// 命名导出
export const name = 'John';
export function greet() {
    console.log('Hello!');
}

// 默认导出
export default class User {
    constructor(name) {
        this.name = name;
    }
}

// 混合导出
export const version = '1.0.0';
export default class App {}
```

### 导入

```javascript
// 命名导入
import { name, greet } from './module';

// 默认导入
import User from './module';

// 混合导入
import App, { version } from './module';

// 全部导入
import * as module from './module';

// 动态导入
async function loadModule() {
    const module = await import('./module');
    module.greet();
}
```

## Promise 和异步编程

```javascript
// Promise 基本用法
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Success!');
        // 或
        // reject(new Error('Failed!'));
    }, 1000);
});

promise
    .then(result => console.log(result))
    .catch(error => console.error(error));

// Promise.all
Promise.all([
    fetch('/api/users'),
    fetch('/api/posts')
])
    .then(([users, posts]) => {
        console.log(users, posts);
    })
    .catch(error => {
        console.error(error);
    });

// Promise.race
Promise.race([
    fetch('/api/slow'),
    fetch('/api/fast')
])
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

## 迭代器和生成器

### 迭代器

```javascript
// 自定义迭代器
const iterable = {
    [Symbol.iterator]() {
        let step = 0;
        return {
            next() {
                step++;
                if (step <= 3) {
                    return { value: step, done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
};

for (const value of iterable) {
    console.log(value); // 1, 2, 3
}
```

### 生成器

```javascript
// 生成器函数
function* generator() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = generator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3

// 异步生成器
async function* asyncGenerator() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
}

(async () => {
    for await (const value of asyncGenerator()) {
        console.log(value); // 1, 2, 3
    }
})();
```

## 新的数据结构

### Map

```javascript
const map = new Map();
map.set('key', 'value');
map.set(1, 'number');
map.set({}, 'object');

console.log(map.get('key')); // 'value'
console.log(map.has(1)); // true
console.log(map.size); // 3

// 遍历
for (const [key, value] of map) {
    console.log(key, value);
}
```

### Set

```javascript
const set = new Set([1, 2, 3, 3, 4, 4]);
console.log(set.size); // 4

set.add(5);
set.delete(1);
console.log(set.has(2)); // true

// 遍历
for (const value of set) {
    console.log(value);
}
```

### WeakMap 和 WeakSet

```javascript
// WeakMap
const weakMap = new WeakMap();
let obj = {};
weakMap.set(obj, 'value');
console.log(weakMap.get(obj)); // 'value'
obj = null; // 对象可以被垃圾回收

// WeakSet
const weakSet = new WeakSet();
let obj = {};
weakSet.add(obj);
console.log(weakSet.has(obj)); // true
obj = null; // 对象可以被垃圾回收
```

## 其他新特性

### 可选链操作符

```javascript
const user = {
    address: {
        street: 'Main St'
    }
};

// 旧写法
const street = user && user.address && user.address.street;

// 新写法
const street = user?.address?.street;
```

### 空值合并操作符

```javascript
// 旧写法
const value = input !== null && input !== undefined ? input : defaultValue;

// 新写法
const value = input ?? defaultValue;
```

### 对象属性简写

```javascript
const name = 'John';
const age = 30;

// 旧写法
const user = {
    name: name,
    age: age,
    sayHello: function() {
        console.log('Hello!');
    }
};

// 新写法
const user = {
    name,
    age,
    sayHello() {
        console.log('Hello!');
    }
};
```

## 最佳实践

1. 优先使用 `const`，其次使用 `let`，避免使用 `var`
2. 使用箭头函数保持 `this` 的一致性
3. 使用解构赋值简化代码
4. 使用模板字符串提高可读性
5. 使用类进行面向对象编程
6. 使用模块化组织代码
7. 使用 Promise 处理异步操作
8. 使用新的数据结构优化性能

## 浏览器兼容性

- 使用 Babel 转译 ES6+ 代码
- 使用 polyfill 补充缺失的特性
- 使用 `@babel/preset-env` 按需转译
- 使用 `core-js` 提供 polyfill

## 相关资源

- [MDN ES6 特性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)
- [ECMAScript 规范](https://tc39.es/ecma262/)
- [Babel 文档](https://babeljs.io/docs/)
- [ES6 特性兼容性表](https://kangax.github.io/compat-table/es6/) 