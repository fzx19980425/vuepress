# 调试技巧

## 常见问题调试

### 1. 控制台调试

```javascript
// 基本日志
console.log('普通日志');
console.info('信息日志');
console.warn('警告日志');
console.error('错误日志');

// 格式化输出
console.log('用户信息：%o', user);
console.log('计数：%d', count);
console.log('字符串：%s', message);

// 表格输出
console.table([
    { name: '张三', age: 25, role: '开发' },
    { name: '李四', age: 30, role: '测试' }
]);

// 分组输出
console.group('用户组');
console.log('用户1');
console.log('用户2');
console.groupEnd();

// 计时
console.time('操作耗时');
// ... 要测量的代码
console.timeEnd('操作耗时');

// 断言
console.assert(condition, '条件不满足时的错误信息');
```

### 2. 断点调试

```javascript
// 代码断点
function processData(data) {
    debugger; // 代码会在这里暂停
    const result = data.map(item => {
        // 条件断点：item.value > 100
        return transform(item);
    });
    return result;
}

// 条件断点示例
function filterUsers(users) {
    return users.filter(user => {
        // 在 Chrome DevTools 中设置条件断点：
        // user.age > 18 && user.isActive
        return user.age > 18 && user.isActive;
    });
}
```

### 3. 错误处理

```javascript
// try-catch 错误捕获
try {
    // 可能出错的代码
    const result = JSON.parse(invalidJson);
} catch (error) {
    console.error('解析错误：', error);
    // 错误处理
} finally {
    // 清理代码
}

// 异步错误处理
async function fetchData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('请求错误：', error);
        // 错误处理
    }
}

// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
    console.error('全局错误：', {
        message,
        source,
        lineno,
        colno,
        error
    });
    return true; // 阻止默认错误处理
};

// Promise 错误处理
window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的 Promise 错误：', event.reason);
});
```

## 性能优化调试

### 1. 性能分析

```javascript
// Performance API
function measurePerformance() {
    // 开始标记
    performance.mark('start');
    
    // 要测量的代码
    const result = expensiveOperation();
    
    // 结束标记
    performance.mark('end');
    
    // 测量
    performance.measure('操作耗时', 'start', 'end');
    
    // 获取测量结果
    const measures = performance.getEntriesByType('measure');
    console.log('性能测量结果：', measures);
}

// 使用 Performance Observer
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(`${entry.name}: ${entry.duration}ms`);
    }
});

observer.observe({ entryTypes: ['measure'] });
```

### 2. 内存分析

```javascript
// 内存泄漏检测
class MemoryLeak {
    constructor() {
        this.data = new Array(1000000).fill('leak');
        // 错误：没有清理引用
        window.leakReference = this;
    }
    
    // 正确：清理引用
    destroy() {
        window.leakReference = null;
        this.data = null;
    }
}

// 使用 Chrome DevTools Memory 面板
// 1. 拍摄堆快照
// 2. 记录内存分配
// 3. 分析内存泄漏

// 内存使用监控
function monitorMemory() {
    if (performance.memory) {
        console.log('内存使用情况：', {
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        });
    }
}
```

### 3. 网络性能

```javascript
// 资源加载性能
window.addEventListener('load', () => {
    const timing = performance.getEntriesByType('resource');
    timing.forEach(resource => {
        console.log(`${resource.name}:`, {
            duration: resource.duration,
            transferSize: resource.transferSize,
            initiatorType: resource.initiatorType
        });
    });
});

// 使用 Resource Timing API
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.initiatorType === 'fetch') {
            console.log('Fetch 请求：', {
                url: entry.name,
                duration: entry.duration,
                startTime: entry.startTime
            });
        }
    }
});

observer.observe({ entryTypes: ['resource'] });
```

## 调试工具使用

### 1. Chrome DevTools

#### 网络面板
- 使用 Network 面板监控请求
- 分析请求瀑布图
- 检查请求头和响应
- 模拟网络条件

#### 性能面板
- 使用 Performance 面板记录性能
- 分析帧率
- 检查 CPU 使用情况
- 识别性能瓶颈

#### 内存面板
- 使用 Memory 面板分析内存
- 拍摄堆快照
- 比较快照
- 查找内存泄漏

### 2. VS Code 调试

#### 调试配置
```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "调试前端",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}/src",
            "sourceMapPathOverrides": {
                "webpack:///src/*": "${webRoot}/*"
            }
        },
        {
            "type": "node",
            "request": "launch",
            "name": "调试后端",
            "program": "${workspaceFolder}/server/index.js",
            "skipFiles": ["<node_internals>/**"]
        }
    ]
}
```

#### 调试技巧
- 使用条件断点
- 使用日志点
- 使用表达式求值
- 使用调用堆栈
- 使用变量监视

## 常见问题解决方案

### 1. 异步问题

```javascript
// Promise 链调试
fetch('/api/data')
    .then(response => {
        console.log('响应状态：', response.status);
        return response.json();
    })
    .then(data => {
        console.log('数据：', data);
    })
    .catch(error => {
        console.error('错误：', error);
    });

// async/await 调试
async function fetchData() {
    try {
        console.log('开始请求');
        const response = await fetch('/api/data');
        console.log('收到响应');
        const data = await response.json();
        console.log('解析数据');
        return data;
    } catch (error) {
        console.error('请求失败：', error);
    }
}
```

### 2. 作用域问题

```javascript
// this 绑定问题
class Component {
    constructor() {
        this.value = 42;
        // 错误：this 丢失
        this.button.addEventListener('click', this.handleClick);
        // 正确：绑定 this
        this.button.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleClick() {
        console.log(this.value);
    }
}

// 闭包问题
function createCounter() {
    let count = 0;
    return {
        increment() {
            count++;
            console.log('当前计数：', count);
        },
        getCount() {
            return count;
        }
    };
}
```

### 3. 类型问题

```javascript
// 类型检查
function processData(data) {
    // 类型断言
    console.assert(Array.isArray(data), 'data 必须是数组');
    
    // 类型检查
    if (typeof data !== 'object') {
        throw new TypeError('data 必须是对象');
    }
    
    // 属性检查
    if (!('id' in data)) {
        throw new Error('data 必须包含 id 属性');
    }
}

// 使用 TypeScript
interface User {
    id: number;
    name: string;
    age?: number;
}

function validateUser(user: User): boolean {
    return typeof user.id === 'number' &&
           typeof user.name === 'string' &&
           (user.age === undefined || typeof user.age === 'number');
}
```

## 最佳实践

1. 使用适当的日志级别
2. 合理使用断点
3. 保持错误处理的一致性
4. 定期进行性能分析
5. 监控内存使用
6. 使用调试工具提高效率

## 相关资源

- [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools/)
- [MDN 调试指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors)
- [JavaScript 调试技巧](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/console)
- [性能优化指南](https://developer.mozilla.org/zh-CN/docs/Web/Performance) 