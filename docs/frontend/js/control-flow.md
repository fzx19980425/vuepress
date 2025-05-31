# JavaScript 流程控制

流程控制是编程语言中用于控制代码执行顺序的机制。本文将详细介绍 JavaScript 中的各种流程控制语句。

## 条件语句

### if 语句

```javascript
// 基本 if 语句
if (condition) {
    // 条件为真时执行的代码
}

// if-else 语句
if (condition) {
    // 条件为真时执行的代码
} else {
    // 条件为假时执行的代码
}

// if-else if-else 语句
if (condition1) {
    // 条件1为真时执行的代码
} else if (condition2) {
    // 条件2为真时执行的代码
} else {
    // 所有条件都为假时执行的代码
}

// 实际示例
let age = 20;
if (age >= 18) {
    console.log("成年人");
} else if (age >= 12) {
    console.log("青少年");
} else {
    console.log("儿童");
}
```

### switch 语句

```javascript
// 基本 switch 语句
switch (expression) {
    case value1:
        // 当 expression 等于 value1 时执行的代码
        break;
    case value2:
        // 当 expression 等于 value2 时执行的代码
        break;
    default:
        // 当 expression 不等于任何 case 值时执行的代码
}

// 实际示例
let day = "Monday";
switch (day) {
    case "Monday":
        console.log("星期一");
        break;
    case "Tuesday":
        console.log("星期二");
        break;
    case "Wednesday":
        console.log("星期三");
        break;
    default:
        console.log("其他日期");
}

// 多个 case 共享代码
let month = 2;
switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        console.log("31天");
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        console.log("30天");
        break;
    case 2:
        console.log("28或29天");
        break;
    default:
        console.log("无效月份");
}
```

## 循环语句

### for 循环

```javascript
// 基本 for 循环
for (initialization; condition; increment) {
    // 循环体
}

// 实际示例
for (let i = 0; i < 5; i++) {
    console.log(i);  // 输出 0, 1, 2, 3, 4
}

// 遍历数组
let arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// for...of 循环（ES6）
for (let item of arr) {
    console.log(item);
}

// for...in 循环
let obj = {a: 1, b: 2, c: 3};
for (let key in obj) {
    console.log(key, obj[key]);
}
```

### while 循环

```javascript
// 基本 while 循环
while (condition) {
    // 循环体
}

// 实际示例
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}

// do-while 循环
let j = 0;
do {
    console.log(j);
    j++;
} while (j < 5);
```

### 循环控制语句

```javascript
// break 语句
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break;  // 当 i 等于 5 时退出循环
    }
    console.log(i);
}

// continue 语句
for (let i = 0; i < 5; i++) {
    if (i === 2) {
        continue;  // 跳过 i 等于 2 的迭代
    }
    console.log(i);
}

// 标签语句
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break outer;  // 跳出外层循环
        }
        console.log(i, j);
    }
}
```

## 异常处理

### try-catch 语句

```javascript
// 基本 try-catch
try {
    // 可能抛出异常的代码
    throw new Error("发生错误");
} catch (error) {
    // 处理异常
    console.error(error.message);
} finally {
    // 无论是否发生异常都会执行的代码
    console.log("清理工作");
}

// 实际示例
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("除数不能为零");
        }
        return a / b;
    } catch (error) {
        console.error("计算错误:", error.message);
        return null;
    }
}

// 多个 catch 块
try {
    // 可能抛出不同类型的异常
    throw new TypeError("类型错误");
} catch (error) {
    if (error instanceof TypeError) {
        console.error("类型错误:", error.message);
    } else if (error instanceof ReferenceError) {
        console.error("引用错误:", error.message);
    } else {
        console.error("其他错误:", error.message);
    }
}
```

## 其他流程控制

### return 语句

```javascript
// 基本返回
function add(a, b) {
    return a + b;
}

// 提前返回
function validateAge(age) {
    if (age < 0) {
        return false;  // 提前返回
    }
    if (age > 150) {
        return false;  // 提前返回
    }
    return true;
}

// 返回多个值
function getCoordinates() {
    return {
        x: 10,
        y: 20
    };
}
```

### 标签语句

```javascript
// 基本标签
label: statement

// 实际示例
start: for (let i = 0; i < 5; i++) {
    if (i === 3) {
        continue start;  // 跳转到标签处
    }
    console.log(i);
}
```

## 最佳实践

1. **条件语句**
   - 使用严格相等（===）进行比较
   - 避免过深的嵌套
   - 使用适当的条件组合
   - 考虑使用 switch 替代多个 if-else

2. **循环语句**
   - 选择合适的循环类型
   - 避免无限循环
   - 注意循环性能
   - 使用 break 和 continue 优化循环

3. **异常处理**
   - 只捕获预期的异常
   - 提供有意义的错误信息
   - 适当使用 finally 块
   - 避免过度使用异常处理

4. **代码组织**
   - 保持代码结构清晰
   - 适当使用注释
   - 遵循代码风格指南
   - 考虑代码可维护性

## 常见问题

1. **条件判断**
   - 类型转换问题
   - 空值处理
   - 边界条件
   - 逻辑运算符优先级

2. **循环问题**
   - 无限循环
   - 性能问题
   - 作用域问题
   - 异步循环

3. **异常处理**
   - 异常类型选择
   - 错误信息处理
   - 异常传播
   - 资源清理

## 性能优化

1. **循环优化**
   - 缓存循环长度
   - 减少循环中的计算
   - 使用适当的循环类型
   - 避免在循环中修改循环变量

2. **条件优化**
   - 使用短路求值
   - 优化条件顺序
   - 减少条件嵌套
   - 使用查找表替代 switch

3. **异常处理优化**
   - 避免使用异常控制流程
   - 合理使用 try-catch
   - 及时释放资源
   - 避免异常嵌套

## 下一步

在掌握了流程控制之后，您可以：
- 学习函数和作用域
- 深入了解对象和原型
- 探索数组和集合
- 学习异步编程
- 开始实践项目 