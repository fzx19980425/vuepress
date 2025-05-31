# JavaScript 数组和集合

数组是 JavaScript 中最常用的数据结构之一，而集合则提供了更多高级的数据结构。本文将详细介绍 JavaScript 中的数组和集合类型。

## 数组基础

### 创建数组

```javascript
// 数组字面量
const arr1 = [1, 2, 3, 4, 5];

// Array 构造函数
const arr2 = new Array(5);        // 创建长度为5的空数组
const arr3 = new Array(1, 2, 3);  // 创建包含元素的数组

// Array.of() 方法（ES6）
const arr4 = Array.of(1, 2, 3);

// Array.from() 方法（ES6）
const arr5 = Array.from("Hello");  // ['H', 'e', 'l', 'l', 'o']
const arr6 = Array.from({length: 5}, (_, i) => i);  // [0, 1, 2, 3, 4]
```

### 数组操作

```javascript
// 访问元素
const arr = [1, 2, 3, 4, 5];
console.log(arr[0]);     // 1
console.log(arr.at(-1)); // 5（ES2022）

// 修改元素
arr[0] = 10;
arr.push(6);    // 末尾添加
arr.unshift(0); // 开头添加
arr.pop();      // 末尾删除
arr.shift();    // 开头删除

// 数组长度
console.log(arr.length);
arr.length = 3;  // 截断数组
```

### 数组方法

```javascript
// 遍历方法
const arr = [1, 2, 3, 4, 5];

// forEach
arr.forEach((item, index) => {
    console.log(item, index);
});

// map
const doubled = arr.map(x => x * 2);

// filter
const even = arr.filter(x => x % 2 === 0);

// reduce
const sum = arr.reduce((acc, cur) => acc + cur, 0);

// find 和 findIndex
const firstEven = arr.find(x => x % 2 === 0);
const firstEvenIndex = arr.findIndex(x => x % 2 === 0);

// some 和 every
const hasEven = arr.some(x => x % 2 === 0);
const allPositive = arr.every(x => x > 0);
```

## 数组操作

### 数组转换

```javascript
// 转换为字符串
const arr = [1, 2, 3];
console.log(arr.toString());  // "1,2,3"
console.log(arr.join("-"));   // "1-2-3"

// 转换为对象
const obj = Object.fromEntries(arr.map((x, i) => [i, x]));

// 展开运算符
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
```

### 数组排序

```javascript
// 基本排序
const arr = [3, 1, 4, 1, 5, 9];
arr.sort();  // [1, 1, 3, 4, 5, 9]

// 自定义排序
arr.sort((a, b) => b - a);  // 降序
arr.sort((a, b) => a - b);  // 升序

// 对象数组排序
const users = [
    {name: "John", age: 30},
    {name: "Alice", age: 25}
];
users.sort((a, b) => a.age - b.age);
```

### 数组搜索

```javascript
// 基本搜索
const arr = [1, 2, 3, 4, 5];
console.log(arr.indexOf(3));     // 2
console.log(arr.lastIndexOf(3)); // 2
console.log(arr.includes(3));    // true

// 二分搜索（已排序数组）
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

## 数组高级操作

### 数组解构

```javascript
// 基本解构
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// 默认值
const [a = 1, b = 2] = [3];

// 交换变量
let x = 1, y = 2;
[x, y] = [y, x];

// 嵌套解构
const [a, [b, c]] = [1, [2, 3]];
```

### 数组方法链式调用

```javascript
const numbers = [1, 2, 3, 4, 5];

// 链式操作
const result = numbers
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .reduce((acc, cur) => acc + cur, 0);

// 实际应用
const users = [
    {name: "John", age: 30},
    {name: "Alice", age: 25},
    {name: "Bob", age: 35}
];

const averageAge = users
    .filter(user => user.age > 25)
    .map(user => user.age)
    .reduce((acc, age, _, arr) => acc + age / arr.length, 0);
```

### 数组性能优化

```javascript
// 预分配数组大小
const arr = new Array(1000);

// 使用 TypedArray
const int32Array = new Int32Array(1000);

// 避免频繁修改数组
const arr = [];
for (let i = 0; i < 1000; i++) {
    arr[i] = i;  // 直接赋值而不是 push
}

// 使用适当的数组方法
// 不好的做法
const result = [];
for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
        result.push(arr[i] * 2);
    }
}

// 好的做法
const result = arr
    .filter(x => x % 2 === 0)
    .map(x => x * 2);
```

## 集合类型

### Set

```javascript
// 创建 Set
const set = new Set([1, 2, 3, 3, 4]);  // {1, 2, 3, 4}

// 基本操作
set.add(5);
set.delete(1);
set.has(2);
set.clear();
set.size;

// 遍历
set.forEach(value => console.log(value));
for (const value of set) {
    console.log(value);
}

// 集合运算
const set1 = new Set([1, 2, 3]);
const set2 = new Set([2, 3, 4]);

// 并集
const union = new Set([...set1, ...set2]);

// 交集
const intersection = new Set(
    [...set1].filter(x => set2.has(x))
);

// 差集
const difference = new Set(
    [...set1].filter(x => !set2.has(x))
);
```

### Map

```javascript
// 创建 Map
const map = new Map([
    ["name", "John"],
    ["age", 30]
]);

// 基本操作
map.set("city", "New York");
map.get("name");
map.has("age");
map.delete("age");
map.clear();
map.size;

// 遍历
map.forEach((value, key) => {
    console.log(key, value);
});

for (const [key, value] of map) {
    console.log(key, value);
}

// 实际应用
const userMap = new Map();
userMap.set(1, {name: "John", age: 30});
userMap.set(2, {name: "Alice", age: 25});

// 缓存
const cache = new Map();
function memoize(fn) {
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}
```

### WeakSet 和 WeakMap

```javascript
// WeakSet
const weakSet = new WeakSet();
let obj = {name: "John"};
weakSet.add(obj);
weakSet.has(obj);
weakSet.delete(obj);

// WeakMap
const weakMap = new WeakMap();
weakMap.set(obj, "some value");
weakMap.get(obj);
weakMap.has(obj);
weakMap.delete(obj);

// 实际应用：私有属性
const privateData = new WeakMap();

class Person {
    constructor(name) {
        privateData.set(this, {name});
    }
    
    getName() {
        return privateData.get(this).name;
    }
}
```

## 最佳实践

1. **数组使用**
   - 选择合适的数组方法
   - 避免修改数组长度
   - 使用解构和展开运算符
   - 注意数组方法的性能

2. **集合使用**
   - 使用 Set 去重
   - 使用 Map 存储键值对
   - 合理使用 WeakSet 和 WeakMap
   - 注意内存管理

3. **性能优化**
   - 预分配数组大小
   - 使用 TypedArray
   - 避免频繁修改数组
   - 使用适当的集合类型

4. **代码组织**
   - 使用函数式编程
   - 保持代码简洁
   - 适当使用注释
   - 遵循代码规范

## 常见问题

1. **数组问题**
   - 数组方法的使用
   - 数组性能优化
   - 数组去重
   - 数组排序

2. **集合问题**
   - 集合类型选择
   - 内存管理
   - 遍历方法
   - 集合运算

3. **性能问题**
   - 大数组处理
   - 频繁操作优化
   - 内存泄漏
   - 垃圾回收

## 下一步

在掌握了数组和集合之后，您可以：
- 学习异步编程
- 深入了解模块化开发
- 探索函数式编程
- 学习设计模式
- 开始实践项目 