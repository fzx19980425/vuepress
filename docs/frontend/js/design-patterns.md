# JavaScript 设计模式

设计模式是软件开发中常见问题的可重用解决方案。本文将详细介绍 JavaScript 中常用的设计模式及其实现。

## 创建型模式

### 工厂模式

```javascript
// 简单工厂
class UserFactory {
    createUser(type) {
        switch (type) {
            case 'admin':
                return new AdminUser();
            case 'customer':
                return new CustomerUser();
            default:
                throw new Error('未知的用户类型');
        }
    }
}

// 工厂方法
class User {
    constructor(name) {
        this.name = name;
    }
}

class AdminUser extends User {
    getPermissions() {
        return ['read', 'write', 'delete'];
    }
}

class CustomerUser extends User {
    getPermissions() {
        return ['read'];
    }
}

class UserCreator {
    createUser(name) {
        throw new Error('必须实现 createUser 方法');
    }
}

class AdminUserCreator extends UserCreator {
    createUser(name) {
        return new AdminUser(name);
    }
}

class CustomerUserCreator extends UserCreator {
    createUser(name) {
        return new CustomerUser(name);
    }
}

// 抽象工厂
class DatabaseFactory {
    createConnection() {
        throw new Error('必须实现 createConnection 方法');
    }
    
    createQuery() {
        throw new Error('必须实现 createQuery 方法');
    }
}

class MySQLFactory extends DatabaseFactory {
    createConnection() {
        return new MySQLConnection();
    }
    
    createQuery() {
        return new MySQLQuery();
    }
}

class PostgreSQLFactory extends DatabaseFactory {
    createConnection() {
        return new PostgreSQLConnection();
    }
    
    createQuery() {
        return new PostgreSQLQuery();
    }
}
```

### 单例模式

```javascript
// 基本单例
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

// 模块单例
const Database = (function() {
    let instance;
    
    function createInstance() {
        return {
            connect() {
                console.log('数据库连接已建立');
            },
            query(sql) {
                console.log('执行查询:', sql);
            }
        };
    }
    
    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// 代理单例
class ProxySingleton {
    static getInstance(className) {
        if (!this.instance) {
            this.instance = new className();
        }
        return this.instance;
    }
}
```

### 建造者模式

```javascript
// 基本建造者
class UserBuilder {
    constructor() {
        this.user = {};
    }
    
    setName(name) {
        this.user.name = name;
        return this;
    }
    
    setAge(age) {
        this.user.age = age;
        return this;
    }
    
    setEmail(email) {
        this.user.email = email;
        return this;
    }
    
    build() {
        return this.user;
    }
}

// 使用建造者
const user = new UserBuilder()
    .setName('John')
    .setAge(30)
    .setEmail('john@example.com')
    .build();

// 复杂对象建造者
class CarBuilder {
    constructor() {
        this.car = new Car();
    }
    
    addEngine(engine) {
        this.car.engine = engine;
        return this;
    }
    
    addWheels(wheels) {
        this.car.wheels = wheels;
        return this;
    }
    
    addColor(color) {
        this.car.color = color;
        return this;
    }
    
    build() {
        return this.car;
    }
}
```

### 原型模式

```javascript
// 基本原型
class Prototype {
    clone() {
        return Object.create(this);
    }
}

// 实际应用
class Shape extends Prototype {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
    
    clone() {
        const clone = super.clone();
        clone.x = this.x;
        clone.y = this.y;
        return clone;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    
    clone() {
        const clone = super.clone();
        clone.radius = this.radius;
        return clone;
    }
}

// 原型注册表
class PrototypeRegistry {
    constructor() {
        this.prototypes = {};
    }
    
    register(name, prototype) {
        this.prototypes[name] = prototype;
    }
    
    create(name) {
        const prototype = this.prototypes[name];
        if (!prototype) {
            throw new Error('未知的原型');
        }
        return prototype.clone();
    }
}
```

## 结构型模式

### 适配器模式

```javascript
// 类适配器
class OldAPI {
    getData() {
        return 'old data format';
    }
}

class NewAPI {
    fetchData() {
        return 'new data format';
    }
}

class APIAdapter extends NewAPI {
    constructor(oldAPI) {
        super();
        this.oldAPI = oldAPI;
    }
    
    fetchData() {
        const oldData = this.oldAPI.getData();
        return this.convertToNewFormat(oldData);
    }
    
    convertToNewFormat(oldData) {
        return `converted: ${oldData}`;
    }
}

// 对象适配器
class Adapter {
    constructor(oldAPI) {
        this.oldAPI = oldAPI;
    }
    
    fetchData() {
        const oldData = this.oldAPI.getData();
        return this.convertToNewFormat(oldData);
    }
    
    convertToNewFormat(oldData) {
        return `converted: ${oldData}`;
    }
}
```

### 装饰器模式

```javascript
// 基本装饰器
class Component {
    operation() {
        return '基本操作';
    }
}

class Decorator extends Component {
    constructor(component) {
        super();
        this.component = component;
    }
    
    operation() {
        return `装饰器(${this.component.operation()})`;
    }
}

// 实际应用
class Coffee {
    cost() {
        return 5;
    }
    
    description() {
        return '咖啡';
    }
}

class MilkDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }
    
    cost() {
        return this.coffee.cost() + 2;
    }
    
    description() {
        return `${this.coffee.description()} + 牛奶`;
    }
}

class SugarDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }
    
    cost() {
        return this.coffee.cost() + 1;
    }
    
    description() {
        return `${this.coffee.description()} + 糖`;
    }
}
```

### 代理模式

```javascript
// 基本代理
class Subject {
    request() {
        throw new Error('必须实现 request 方法');
    }
}

class RealSubject extends Subject {
    request() {
        return '真实主题的请求';
    }
}

class Proxy extends Subject {
    constructor(realSubject) {
        super();
        this.realSubject = realSubject;
    }
    
    request() {
        if (this.checkAccess()) {
            return this.realSubject.request();
        }
        return '访问被拒绝';
    }
    
    checkAccess() {
        return true;
    }
}

// 虚拟代理
class ImageProxy {
    constructor(url) {
        this.url = url;
        this.image = null;
    }
    
    display() {
        if (!this.image) {
            this.image = new Image(this.url);
        }
        this.image.display();
    }
}

// 保护代理
class UserProxy {
    constructor(user) {
        this.user = user;
    }
    
    getPermissions() {
        if (this.checkAccess()) {
            return this.user.getPermissions();
        }
        return [];
    }
    
    checkAccess() {
        return this.user.isAuthenticated();
    }
}
```

### 外观模式

```javascript
// 基本外观
class Facade {
    constructor(subsystem1, subsystem2) {
        this.subsystem1 = subsystem1;
        this.subsystem2 = subsystem2;
    }
    
    operation() {
        const result1 = this.subsystem1.operation1();
        const result2 = this.subsystem2.operation2();
        return `${result1} + ${result2}`;
    }
}

// 实际应用
class OrderFacade {
    constructor() {
        this.inventory = new Inventory();
        this.payment = new Payment();
        this.shipping = new Shipping();
    }
    
    placeOrder(order) {
        if (this.inventory.checkStock(order.items)) {
            if (this.payment.processPayment(order.payment)) {
                return this.shipping.shipOrder(order);
            }
        }
        throw new Error('订单处理失败');
    }
}
```

## 行为型模式

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
        console.log('收到更新:', data);
    }
}

// 实际应用
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
    
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
}
```

### 策略模式

```javascript
// 基本策略
class Strategy {
    execute() {
        throw new Error('必须实现 execute 方法');
    }
}

class ConcreteStrategyA extends Strategy {
    execute() {
        return '策略A的执行结果';
    }
}

class ConcreteStrategyB extends Strategy {
    execute() {
        return '策略B的执行结果';
    }
}

class Context {
    constructor(strategy) {
        this.strategy = strategy;
    }
    
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    executeStrategy() {
        return this.strategy.execute();
    }
}

// 实际应用
class PaymentStrategy {
    pay(amount) {
        throw new Error('必须实现 pay 方法');
    }
}

class CreditCardStrategy extends PaymentStrategy {
    pay(amount) {
        return `使用信用卡支付 ${amount}`;
    }
}

class PayPalStrategy extends PaymentStrategy {
    pay(amount) {
        return `使用PayPal支付 ${amount}`;
    }
}

class PaymentContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    processPayment(amount) {
        return this.strategy.pay(amount);
    }
}
```

### 命令模式

```javascript
// 基本命令
class Command {
    execute() {
        throw new Error('必须实现 execute 方法');
    }
    
    undo() {
        throw new Error('必须实现 undo 方法');
    }
}

class ConcreteCommand extends Command {
    constructor(receiver) {
        super();
        this.receiver = receiver;
    }
    
    execute() {
        this.receiver.action();
    }
    
    undo() {
        this.receiver.undoAction();
    }
}

// 实际应用
class Editor {
    constructor() {
        this.content = '';
        this.history = [];
    }
    
    write(text) {
        this.content += text;
    }
    
    delete() {
        this.content = this.content.slice(0, -1);
    }
    
    getContent() {
        return this.content;
    }
}

class WriteCommand extends Command {
    constructor(editor, text) {
        super();
        this.editor = editor;
        this.text = text;
    }
    
    execute() {
        this.editor.write(this.text);
    }
    
    undo() {
        this.editor.delete();
    }
}

class CommandManager {
    constructor() {
        this.commands = [];
        this.current = -1;
    }
    
    execute(command) {
        command.execute();
        this.commands = this.commands.slice(0, this.current + 1);
        this.commands.push(command);
        this.current++;
    }
    
    undo() {
        if (this.current >= 0) {
            this.commands[this.current].undo();
            this.current--;
        }
    }
    
    redo() {
        if (this.current < this.commands.length - 1) {
            this.current++;
            this.commands[this.current].execute();
        }
    }
}
```

### 状态模式

```javascript
// 基本状态
class State {
    handle() {
        throw new Error('必须实现 handle 方法');
    }
}

class ConcreteStateA extends State {
    handle() {
        return '状态A的处理结果';
    }
}

class ConcreteStateB extends State {
    handle() {
        return '状态B的处理结果';
    }
}

class Context {
    constructor(state) {
        this.state = state;
    }
    
    setState(state) {
        this.state = state;
    }
    
    request() {
        return this.state.handle();
    }
}

// 实际应用
class TrafficLight {
    constructor() {
        this.states = {
            red: new RedState(this),
            yellow: new YellowState(this),
            green: new GreenState(this)
        };
        this.currentState = this.states.red;
    }
    
    changeState(state) {
        this.currentState = this.states[state];
    }
    
    request() {
        return this.currentState.handle();
    }
}

class LightState {
    constructor(light) {
        this.light = light;
    }
    
    handle() {
        throw new Error('必须实现 handle 方法');
    }
}

class RedState extends LightState {
    handle() {
        this.light.changeState('green');
        return '红灯变绿灯';
    }
}

class GreenState extends LightState {
    handle() {
        this.light.changeState('yellow');
        return '绿灯变黄灯';
    }
}

class YellowState extends LightState {
    handle() {
        this.light.changeState('red');
        return '黄灯变红灯';
    }
}
```

## 最佳实践

1. **模式选择**
   - 根据问题选择适当的模式
   - 避免过度设计
   - 考虑代码可维护性
   - 注意性能影响

2. **实现原则**
   - 遵循单一职责原则
   - 保持代码简洁
   - 使用组合优于继承
   - 适当使用接口

3. **代码组织**
   - 清晰的类结构
   - 合理的命名
   - 适当的注释
   - 模块化设计

4. **测试策略**
   - 单元测试
   - 集成测试
   - 模拟对象
   - 测试覆盖率

## 常见问题

1. **设计问题**
   - 模式选择不当
   - 过度使用模式
   - 违反设计原则
   - 代码复杂度

2. **实现问题**
   - 性能开销
   - 内存使用
   - 代码可读性
   - 维护成本

3. **测试问题**
   - 测试难度
   - 模拟复杂性
   - 测试覆盖
   - 重构影响

## 下一步

在掌握了设计模式之后，您可以：
- 学习前端框架
- 深入了解架构设计
- 探索性能优化
- 学习测试策略
- 开始实践项目 