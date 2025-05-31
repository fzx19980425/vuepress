# 面向对象编程（OOP）

## 什么是面向对象编程

面向对象编程（Object-Oriented Programming，OOP）是一种编程范式，它使用"对象"来组织代码和数据。在 JavaScript 中，OOP 主要通过原型继承和类（ES6+）来实现。

## 基本概念

### 1. 对象

```javascript
// 对象字面量
const person = {
    name: 'John',
    age: 30,
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

// 使用 Object.create
const personProto = {
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

const person = Object.create(personProto, {
    name: { value: 'John' },
    age: { value: 30 }
});
```

### 2. 构造函数

```javascript
// 构造函数
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 在原型上添加方法
Person.prototype.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
};

// 创建实例
const person = new Person('John', 30);
```

### 3. 类（ES6+）

```javascript
// 类定义
class Person {
    // 构造函数
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // 实例方法
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
    
    // 静态方法
    static create(name, age) {
        return new Person(name, age);
    }
    
    // getter
    get description() {
        return `${this.name} is ${this.age} years old`;
    }
    
    // setter
    set age(value) {
        if (value < 0) {
            throw new Error('Age cannot be negative');
        }
        this._age = value;
    }
}

// 创建实例
const person = new Person('John', 30);
```

## 继承

### 1. 原型继承

```javascript
// 父类
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound.`);
};

// 子类
function Dog(name, breed) {
    // 调用父类构造函数
    Animal.call(this, name);
    this.breed = breed;
}

// 设置原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// 添加子类方法
Dog.prototype.speak = function() {
    console.log(`${this.name} barks!`);
};

// 创建实例
const dog = new Dog('Rex', 'German Shepherd');
```

### 2. 类继承（ES6+）

```javascript
// 父类
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

// 子类
class Dog extends Animal {
    constructor(name, breed) {
        super(name); // 调用父类构造函数
        this.breed = breed;
    }
    
    // 重写父类方法
    speak() {
        console.log(`${this.name} barks!`);
    }
    
    // 添加子类特有方法
    fetch() {
        console.log(`${this.name} fetches the ball.`);
    }
    
    // 静态方法继承
    static create(name, breed) {
        return new Dog(name, breed);
    }
}

// 创建实例
const dog = new Dog('Rex', 'German Shepherd');
```

## 封装

### 1. 私有字段（ES2022+）

```javascript
class BankAccount {
    // 私有字段
    #balance = 0;
    #accountNumber;
    
    constructor(accountNumber, initialBalance = 0) {
        this.#accountNumber = accountNumber;
        this.#balance = initialBalance;
    }
    
    // 公共方法
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            return true;
        }
        return false;
    }
    
    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            return true;
        }
        return false;
    }
    
    getBalance() {
        return this.#balance;
    }
}
```

### 2. 使用闭包实现私有性

```javascript
function createBankAccount(accountNumber, initialBalance = 0) {
    // 私有变量
    let balance = initialBalance;
    
    return {
        // 公共方法
        deposit(amount) {
            if (amount > 0) {
                balance += amount;
                return true;
            }
            return false;
        },
        
        withdraw(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                return true;
            }
            return false;
        },
        
        getBalance() {
            return balance;
        }
    };
}
```

## 多态

```javascript
// 抽象类
class Shape {
    constructor() {
        if (this.constructor === Shape) {
            throw new Error('Cannot instantiate abstract class');
        }
    }
    
    // 抽象方法
    calculateArea() {
        throw new Error('Method not implemented');
    }
}

// 具体类
class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    
    calculateArea() {
        return Math.PI * this.radius ** 2;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    calculateArea() {
        return this.width * this.height;
    }
}

// 使用多态
function printArea(shape) {
    console.log(`Area: ${shape.calculateArea()}`);
}

const circle = new Circle(5);
const rectangle = new Rectangle(4, 6);

printArea(circle);    // Area: 78.53981633974483
printArea(rectangle); // Area: 24
```

## 设计模式

### 1. 单例模式

```javascript
class Singleton {
    static instance;
    
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }
    
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}

// 使用
const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

### 2. 工厂模式

```javascript
class AnimalFactory {
    static createAnimal(type, name) {
        switch (type) {
            case 'dog':
                return new Dog(name);
            case 'cat':
                return new Cat(name);
            default:
                throw new Error('Unknown animal type');
        }
    }
}

// 使用
const dog = AnimalFactory.createAnimal('dog', 'Rex');
const cat = AnimalFactory.createAnimal('cat', 'Whiskers');
```

### 3. 观察者模式

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event]
                .filter(cb => cb !== callback);
        }
    }
}

// 使用
const emitter = new EventEmitter();

emitter.on('data', (data) => {
    console.log('Received data:', data);
});

emitter.emit('data', { message: 'Hello' });
```

## 最佳实践

1. 使用类而不是构造函数
2. 优先使用组合而不是继承
3. 保持类的职责单一
4. 使用私有字段保护数据
5. 使用 getter/setter 控制属性访问
6. 使用静态方法处理工具函数
7. 使用设计模式解决常见问题

## 常见问题

1. 原型链和继承
2. this 的指向问题
3. 私有属性的实现
4. 类的静态成员
5. 多继承的实现
6. 性能考虑

## 相关资源

- [MDN 类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
- [MDN 原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [JavaScript 设计模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes#%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)
- [面向对象编程最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects) 