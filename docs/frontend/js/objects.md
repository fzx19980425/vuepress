# JavaScript 对象和原型

对象是 JavaScript 中最基本的数据类型之一，而原型是 JavaScript 实现继承的机制。本文将详细介绍 JavaScript 中的对象和原型系统。

## 对象基础

### 创建对象

```javascript
// 对象字面量
const person = {
    name: "John",
    age: 30,
    sayHello() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

// 构造函数
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.sayHello = function() {
        console.log(`Hello, I'm ${this.name}`);
    };
}

// Object.create()
const personProto = {
    sayHello() {
        console.log(`Hello, I'm ${this.name}`);
    }
};
const person2 = Object.create(personProto, {
    name: {value: "John"},
    age: {value: 30}
});

// 类（ES6）
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    sayHello() {
        console.log(`Hello, I'm ${this.name}`);
    }
}
```

### 对象属性

```javascript
// 属性访问
const person = {
    name: "John",
    age: 30
};

console.log(person.name);     // 点语法
console.log(person["age"]);   // 方括号语法

// 属性描述符
Object.defineProperty(person, "gender", {
    value: "male",
    writable: false,      // 不可修改
    enumerable: true,     // 可枚举
    configurable: false   // 不可配置
});

// 计算属性名（ES6）
const prop = "name";
const obj = {
    [prop]: "John",
    [`${prop}Length`]: prop.length
};

// 对象方法简写（ES6）
const obj2 = {
    name: "John",
    sayHello() {
        console.log("Hello");
    }
};
```

### 对象方法

```javascript
// 属性操作
const person = {
    name: "John",
    age: 30
};

// 获取属性描述符
console.log(Object.getOwnPropertyDescriptor(person, "name"));

// 获取所有属性名
console.log(Object.keys(person));
console.log(Object.getOwnPropertyNames(person));

// 获取所有属性值
console.log(Object.values(person));

// 获取所有键值对
console.log(Object.entries(person));

// 合并对象
const obj1 = {a: 1};
const obj2 = {b: 2};
const merged = Object.assign({}, obj1, obj2);
const spread = {...obj1, ...obj2};

// 冻结对象
Object.freeze(person);  // 完全冻结
Object.seal(person);    // 密封对象
```

## 原型系统

### 原型基础

```javascript
// 原型属性
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function() {
    console.log(`Hello, I'm ${this.name}`);
};

const person = new Person("John");
console.log(person.__proto__ === Person.prototype);  // true
console.log(Person.prototype.constructor === Person);  // true

// 原型链
console.log(person.__proto__.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__);  // null
```

### 原型继承

```javascript
// 构造函数继承
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound.`);
};

function Dog(name) {
    Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
    console.log(`${this.name} barks.`);
};

// 类继承（ES6）
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(`${this.name} makes a sound.`);
    }
}

class Dog extends Animal {
    speak() {
        console.log(`${this.name} barks.`);
    }
}
```

### 原型方法

```javascript
// 检查原型关系
const dog = new Dog("Rex");
console.log(dog instanceof Dog);      // true
console.log(dog instanceof Animal);   // true
console.log(dog instanceof Object);   // true

// 获取原型
console.log(Object.getPrototypeOf(dog));
console.log(Reflect.getPrototypeOf(dog));

// 设置原型
const obj = {};
Object.setPrototypeOf(obj, Array.prototype);
Reflect.setPrototypeOf(obj, Array.prototype);

// 检查属性
console.log(dog.hasOwnProperty("name"));  // true
console.log(dog.hasOwnProperty("speak")); // false
```

## 对象操作

### 属性遍历

```javascript
const person = {
    name: "John",
    age: 30,
    [Symbol("id")]: 123
};

// for...in 循环
for (let key in person) {
    console.log(key, person[key]);
}

// Object.keys()
console.log(Object.keys(person));

// Object.getOwnPropertyNames()
console.log(Object.getOwnPropertyNames(person));

// Object.getOwnPropertySymbols()
console.log(Object.getOwnPropertySymbols(person));

// Reflect.ownKeys()
console.log(Reflect.ownKeys(person));
```

### 对象转换

```javascript
// 转换为字符串
const person = {
    name: "John",
    age: 30,
    toJSON() {
        return {
            name: this.name,
            age: this.age
        };
    }
};

console.log(JSON.stringify(person));

// 转换为原始值
const obj = {
    valueOf() {
        return 1;
    },
    toString() {
        return "object";
    }
};

console.log(+obj);      // 1
console.log(`${obj}`);  // "object"
```

### 对象代理

```javascript
// 基本代理
const handler = {
    get(target, prop) {
        console.log(`Getting ${prop}`);
        return target[prop];
    },
    set(target, prop, value) {
        console.log(`Setting ${prop} to ${value}`);
        target[prop] = value;
        return true;
    }
};

const person = {name: "John"};
const proxy = new Proxy(person, handler);

// 代理应用
const validator = {
    set(target, prop, value) {
        if (prop === "age" && value < 0) {
            throw new Error("Age cannot be negative");
        }
        target[prop] = value;
        return true;
    }
};

const person2 = new Proxy({}, validator);
```

## 设计模式

### 工厂模式

```javascript
// 简单工厂
function createPerson(name, age) {
    return {
        name,
        age,
        sayHello() {
            console.log(`Hello, I'm ${this.name}`);
        }
    };
}

// 工厂方法
class PersonFactory {
    createPerson(type) {
        switch (type) {
            case "student":
                return new Student();
            case "teacher":
                return new Teacher();
            default:
                throw new Error("Unknown person type");
        }
    }
}
```

### 单例模式

```javascript
// 基本单例
const singleton = (function() {
    let instance;
    
    return {
        getInstance() {
            if (!instance) {
                instance = {
                    name: "Singleton",
                    sayHello() {
                        console.log("Hello from singleton");
                    }
                };
            }
            return instance;
        }
    };
})();

// 类单例
class Singleton {
    static instance;
    
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }
}
```

### 观察者模式

```javascript
// 基本观察者
class Subject {
    constructor() {
        this.observers = [];
    }
    
    attach(observer) {
        this.observers.push(observer);
    }
    
    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class Observer {
    update(data) {
        console.log("Received update:", data);
    }
}
```

## 最佳实践

1. **对象设计**
   - 使用对象字面量创建简单对象
   - 使用构造函数创建复杂对象
   - 使用类进行面向对象编程
   - 遵循单一职责原则

2. **原型使用**
   - 合理使用原型继承
   - 避免修改内置原型
   - 使用 Object.create() 创建对象
   - 注意原型链的性能影响

3. **属性管理**
   - 使用属性描述符控制属性
   - 合理使用访问器属性
   - 注意属性的可枚举性
   - 使用 Symbol 作为属性键

4. **代码组织**
   - 使用模块化设计
   - 遵循设计模式
   - 保持代码简洁
   - 适当使用注释

## 常见问题

1. **原型问题**
   - 原型链污染
   - 构造函数调用
   - 原型方法覆盖
   - 多重继承

2. **对象问题**
   - 属性访问性能
   - 对象克隆
   - 循环引用
   - 内存泄漏

3. **继承问题**
   - 原型继承的局限性
   - 多重继承的实现
   - 构造函数继承
   - 类继承的注意事项

## 性能优化

1. **对象创建**
   - 使用对象字面量
   - 避免频繁创建对象
   - 使用对象池
   - 合理使用原型

2. **属性访问**
   - 缓存属性访问
   - 使用属性描述符
   - 避免属性查找
   - 使用 Map 代替对象

3. **继承优化**
   - 减少原型链长度
   - 使用组合代替继承
   - 避免原型链查找
   - 使用类代替构造函数

## 下一步

在掌握了对象和原型之后，您可以：
- 学习数组和集合
- 深入了解异步编程
- 探索模块化开发
- 学习设计模式
- 开始实践项目 