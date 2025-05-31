# JavaScript 运算符和表达式

运算符是用于执行特定操作的符号，表达式是由变量、运算符和值组成的代码片段。本文将详细介绍 JavaScript 中的各种运算符和表达式。

## 算术运算符

### 基本算术运算符

```javascript
let a = 10;
let b = 3;

console.log(a + b);   // 加法：13
console.log(a - b);   // 减法：7
console.log(a * b);   // 乘法：30
console.log(a / b);   // 除法：3.333...
console.log(a % b);   // 取余：1
console.log(a ** b);  // 幂运算：1000
```

### 递增和递减运算符

```javascript
let x = 5;

// 后置递增
console.log(x++);  // 5，然后 x 变为 6
console.log(x);    // 6

// 前置递增
console.log(++x);  // 7

// 后置递减
console.log(x--);  // 7，然后 x 变为 6
console.log(x);    // 6

// 前置递减
console.log(--x);  // 5
```

### 一元运算符

```javascript
let x = 5;
console.log(+x);   // 正号：5
console.log(-x);   // 负号：-5

// 数字转换
console.log(+"123");    // 123
console.log(+"abc");    // NaN
console.log(-"123");    // -123
```

## 赋值运算符

### 基本赋值运算符

```javascript
let x = 10;  // 基本赋值

// 复合赋值运算符
x += 5;      // 等价于 x = x + 5
x -= 3;      // 等价于 x = x - 3
x *= 2;      // 等价于 x = x * 2
x /= 4;      // 等价于 x = x / 4
x %= 3;      // 等价于 x = x % 3
x **= 2;     // 等价于 x = x ** 2
```

### 解构赋值（ES6）

```javascript
// 数组解构
let [a, b, c] = [1, 2, 3];
console.log(a, b, c);  // 1 2 3

// 对象解构
let {name, age} = {name: "John", age: 30};
console.log(name, age);  // John 30

// 默认值
let [x = 1, y = 2] = [3];
console.log(x, y);  // 3 2

// 剩余运算符
let [first, ...rest] = [1, 2, 3, 4];
console.log(first, rest);  // 1 [2, 3, 4]
```

## 比较运算符

### 相等运算符

```javascript
// 相等（==）和严格相等（===）
console.log(5 == "5");    // true（类型转换后比较）
console.log(5 === "5");   // false（类型和值都要相等）

// 不相等（!=）和严格不相等（!==）
console.log(5 != "5");    // false
console.log(5 !== "5");   // true

// 比较运算符
console.log(5 > 3);   // 大于：true
console.log(5 < 3);   // 小于：false
console.log(5 >= 5);  // 大于等于：true
console.log(5 <= 5);  // 小于等于：true
```

### 特殊比较

```javascript
// NaN 的比较
console.log(NaN == NaN);   // false
console.log(NaN === NaN);  // false
console.log(isNaN(NaN));   // true

// null 和 undefined 的比较
console.log(null == undefined);   // true
console.log(null === undefined);  // false

// 对象比较
let obj1 = {x: 1};
let obj2 = {x: 1};
console.log(obj1 == obj2);   // false
console.log(obj1 === obj2);  // false
```

## 逻辑运算符

### 基本逻辑运算符

```javascript
// 逻辑与（&&）
console.log(true && true);    // true
console.log(true && false);   // false
console.log(false && true);   // false
console.log(false && false);  // false

// 逻辑或（||）
console.log(true || true);    // true
console.log(true || false);   // true
console.log(false || true);   // true
console.log(false || false);  // false

// 逻辑非（!）
console.log(!true);   // false
console.log(!false);  // true
```

### 短路求值

```javascript
// 逻辑与短路
let x = 0;
let y = 1;
console.log(x && y);  // 0（x 为假，直接返回 x）

// 逻辑或短路
console.log(x || y);  // 1（x 为假，返回 y）

// 实际应用
function greet(name) {
    name = name || "Guest";  // 默认值
    return "Hello, " + name;
}
```

## 位运算符

### 基本位运算符

```javascript
let a = 5;  // 二进制：0101
let b = 3;  // 二进制：0011

console.log(a & b);   // 按位与：1（0001）
console.log(a | b);   // 按位或：7（0111）
console.log(a ^ b);   // 按位异或：6（0110）
console.log(~a);      // 按位非：-6
console.log(a << 1);  // 左移：10（1010）
console.log(a >> 1);  // 右移：2（0010）
console.log(a >>> 1); // 无符号右移：2
```

### 位运算应用

```javascript
// 判断奇偶
function isEven(n) {
    return (n & 1) === 0;
}

// 交换两个数
let x = 5, y = 3;
x = x ^ y;
y = x ^ y;
x = x ^ y;
```

## 条件（三元）运算符

```javascript
// 基本用法
let age = 20;
let status = age >= 18 ? "成年" : "未成年";

// 嵌套使用
let score = 85;
let grade = score >= 90 ? "A" :
            score >= 80 ? "B" :
            score >= 70 ? "C" :
            score >= 60 ? "D" : "F";
```

## 其他运算符

### 逗号运算符

```javascript
let x = (1, 2, 3);  // x 的值为 3
for(let i = 0, j = 10; i < j; i++, j--) {
    console.log(i, j);
}
```

### 可选链运算符（?.）

```javascript
let user = {
    name: "John",
    address: {
        street: "Main St"
    }
};

console.log(user?.address?.street);  // "Main St"
console.log(user?.contact?.phone);   // undefined
```

### 空值合并运算符（??）

```javascript
let x = null;
let y = undefined;
let z = 0;

console.log(x ?? "default");  // "default"
console.log(y ?? "default");  // "default"
console.log(z ?? "default");  // 0
```

## 运算符优先级

```javascript
// 优先级从高到低
// 1. 分组 ()
// 2. 成员访问 . []
// 3. 函数调用 ()
// 4. 后置递增/递减 ++ --
// 5. 前置递增/递减 ++ --
// 6. 逻辑非 !
// 7. 乘法 * / %
// 8. 加法 + -
// 9. 比较 < <= > >=
// 10. 相等 == != === !==
// 11. 逻辑与 &&
// 12. 逻辑或 ||
// 13. 条件 ?:
// 14. 赋值 = += -= *= /= %=

// 示例
let result = 2 + 3 * 4;  // 14，不是 20
let value = (2 + 3) * 4; // 20
```

## 表达式

### 基本表达式

```javascript
// 字面量表达式
let num = 42;
let str = "Hello";
let arr = [1, 2, 3];
let obj = {x: 1, y: 2};

// 标识符表达式
let x = 10;
let y = x;

// 函数表达式
let add = function(a, b) {
    return a + b;
};

// 箭头函数表达式
let multiply = (a, b) => a * b;
```

### 复杂表达式

```javascript
// 链式表达式
let result = [1, 2, 3]
    .map(x => x * 2)
    .filter(x => x > 4)
    .reduce((a, b) => a + b);

// 条件表达式
let max = a > b ? a : b;

// 模板字符串表达式
let name = "John";
let greeting = `Hello, ${name.toUpperCase()}!`;
```

## 最佳实践

1. **运算符使用**
   - 使用严格相等（===）进行比较
   - 避免复杂的链式运算符
   - 适当使用括号提高可读性
   - 注意运算符优先级

2. **表达式编写**
   - 保持表达式简单清晰
   - 避免过长的链式调用
   - 适当拆分复杂表达式
   - 使用有意义的变量名

3. **性能优化**
   - 避免重复计算
   - 合理使用短路求值
   - 注意位运算的性能优势
   - 避免不必要的类型转换

## 常见问题

1. **类型转换问题**
   - 相等运算符的类型转换
   - 字符串和数字的运算
   - 布尔值的隐式转换

2. **运算符优先级**
   - 复杂的链式运算
   - 条件运算符的嵌套
   - 赋值运算符的组合

3. **特殊值处理**
   - NaN 的比较
   - null 和 undefined
   - 零值的处理

## 下一步

在掌握了运算符和表达式之后，您可以：
- 学习流程控制
- 深入了解函数和作用域
- 探索对象和原型
- 学习数组和集合
- 开始实践项目 