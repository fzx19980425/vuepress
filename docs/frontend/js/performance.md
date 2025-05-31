# JavaScript 性能优化

性能优化是前端开发中的重要环节。本文将详细介绍 JavaScript 性能优化的各个方面。

## 代码优化

### 变量和数据类型

```javascript
// 使用 const 和 let 替代 var
const PI = 3.14159;
let count = 0;

// 使用基本类型而不是对象
// 不好的做法
const user = {
    name: 'John',
    age: 30
};

// 好的做法
const userName = 'John';
const userAge = 30;

// 使用 TypedArray 处理大量数值
const numbers = new Int32Array(1000);
for (let i = 0; i < numbers.length; i++) {
    numbers[i] = i;
}
```

### 循环优化

```javascript
// 缓存数组长度
const arr = [1, 2, 3, 4, 5];
for (let i = 0, len = arr.length; i < len; i++) {
    // 处理数组元素
}

// 使用 for...of 遍历数组
for (const item of arr) {
    // 处理数组元素
}

// 使用 forEach 处理数组
arr.forEach(item => {
    // 处理数组元素
});

// 避免在循环中修改数组
// 不好的做法
for (let i = 0; i < arr.length; i++) {
    arr.push(arr[i] * 2);
}

// 好的做法
const doubled = arr.map(x => x * 2);
```

### 函数优化

```javascript
// 使用函数声明而不是函数表达式
function calculate(x, y) {
    return x + y;
}

// 避免重复创建函数
// 不好的做法
const elements = document.querySelectorAll('.item');
elements.forEach(element => {
    element.addEventListener('click', () => {
        console.log('clicked');
    });
});

// 好的做法
function handleClick() {
    console.log('clicked');
}
elements.forEach(element => {
    element.addEventListener('click', handleClick);
});

// 使用箭头函数
const multiply = (x, y) => x * y;

// 使用函数缓存
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

const fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});
```

## DOM 操作优化

### 批量更新

```javascript
// 使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);
}
document.body.appendChild(fragment);

// 使用 innerHTML 批量更新
const items = Array.from({length: 1000}, (_, i) => `Item ${i}`);
document.body.innerHTML = items.map(item => `<div>${item}</div>`).join('');

// 使用虚拟 DOM
class VirtualDOM {
    constructor(element) {
        this.element = element;
        this.virtualTree = this.createVirtualTree(element);
    }
    
    createVirtualTree(element) {
        return {
            type: element.tagName.toLowerCase(),
            props: {
                children: Array.from(element.children).map(child => 
                    this.createVirtualTree(child)
                )
            }
        };
    }
    
    update(newTree) {
        const patches = this.diff(this.virtualTree, newTree);
        this.applyPatches(patches);
        this.virtualTree = newTree;
    }
}
```

### 事件优化

```javascript
// 使用事件委托
document.body.addEventListener('click', function(event) {
    if (event.target.matches('.item')) {
        handleItemClick(event.target);
    }
});

// 使用防抖
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

const handleScroll = debounce(function() {
    console.log('scrolled');
}, 200);

// 使用节流
function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            fn.apply(this, args);
            lastCall = now;
        }
    };
}

const handleResize = throttle(function() {
    console.log('resized');
}, 200);
```

## 内存管理

### 垃圾回收

```javascript
// 及时解除引用
let largeObject = { /* 大量数据 */ };
function processData() {
    // 处理数据
    largeObject = null; // 解除引用
}

// 使用 WeakMap 和 WeakSet
const cache = new WeakMap();
function cacheUser(user) {
    cache.set(user, {
        lastAccess: Date.now(),
        data: user.data
    });
}

// 避免闭包陷阱
function createCounter() {
    let count = 0;
    return {
        increment() {
            count++;
            return count;
        }
    };
}

// 使用 requestAnimationFrame
function animate() {
    // 动画逻辑
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### 内存泄漏检测

```javascript
// 使用 Chrome DevTools Memory 面板
// 1. 拍摄堆快照
// 2. 执行操作
// 3. 再次拍摄快照
// 4. 比较快照

// 使用 Performance Monitor
// 1. 打开 Performance 面板
// 2. 启用 Memory 监控
// 3. 观察内存使用情况

// 使用内存泄漏检测工具
class MemoryLeakDetector {
    constructor() {
        this.snapshots = [];
    }
    
    takeSnapshot() {
        this.snapshots.push({
            timestamp: Date.now(),
            memory: performance.memory
        });
    }
    
    analyze() {
        // 分析内存使用趋势
        return this.snapshots.map((snapshot, index) => {
            if (index === 0) return null;
            const prev = this.snapshots[index - 1];
            return {
                time: snapshot.timestamp - prev.timestamp,
                memory: snapshot.memory.usedJSHeapSize - prev.memory.usedJSHeapSize
            };
        }).filter(Boolean);
    }
}
```

## 网络优化

### 资源加载

```javascript
// 使用 async 和 defer
<script async src="app.js"></script>
<script defer src="vendor.js"></script>

// 动态加载
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 预加载关键资源
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="critical.css" as="style">

// 使用 Service Worker 缓存
const CACHE_NAME = 'v1';
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js'
            ]);
        })
    );
});
```

### 数据请求

```javascript
// 使用 fetch 和 AbortController
const controller = new AbortController();
fetch('/api/data', {
    signal: controller.signal
}).then(response => response.json());

// 取消请求
controller.abort();

// 批量请求
async function batchRequests(urls) {
    const promises = urls.map(url => fetch(url).then(r => r.json()));
    return Promise.all(promises);
}

// 请求缓存
const requestCache = new Map();
async function cachedFetch(url) {
    if (requestCache.has(url)) {
        return requestCache.get(url);
    }
    const response = await fetch(url);
    const data = await response.json();
    requestCache.set(url, data);
    return data;
}
```

## 渲染优化

### 重排和重绘

```javascript
// 批量修改样式
// 不好的做法
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// 好的做法
element.style.cssText = 'width: 100px; height: 100px; margin: 10px;';

// 使用 transform 代替位置属性
// 不好的做法
element.style.left = '100px';
element.style.top = '100px';

// 好的做法
element.style.transform = 'translate(100px, 100px)';

// 使用 will-change
element.style.willChange = 'transform';

// 使用 requestAnimationFrame
function animate() {
    element.style.transform = `translateX(${position}px)`;
    position += 1;
    requestAnimationFrame(animate);
}
```

### 虚拟滚动

```javascript
class VirtualScroller {
    constructor(container, itemHeight, totalItems) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.totalItems = totalItems;
        this.visibleItems = Math.ceil(container.clientHeight / itemHeight);
        this.scrollTop = 0;
        
        this.setupContainer();
        this.render();
        this.setupScrollListener();
    }
    
    setupContainer() {
        this.container.style.position = 'relative';
        this.container.style.height = `${this.totalItems * this.itemHeight}px`;
    }
    
    render() {
        const startIndex = Math.floor(this.scrollTop / this.itemHeight);
        const endIndex = Math.min(
            startIndex + this.visibleItems + 1,
            this.totalItems
        );
        
        const items = [];
        for (let i = startIndex; i < endIndex; i++) {
            const item = document.createElement('div');
            item.style.position = 'absolute';
            item.style.top = `${i * this.itemHeight}px`;
            item.style.height = `${this.itemHeight}px`;
            item.textContent = `Item ${i}`;
            items.push(item);
        }
        
        this.container.innerHTML = '';
        items.forEach(item => this.container.appendChild(item));
    }
    
    setupScrollListener() {
        this.container.addEventListener('scroll', () => {
            this.scrollTop = this.container.scrollTop;
            this.render();
        });
    }
}
```

## 最佳实践

1. **代码优化**
   - 使用适当的数据类型
   - 优化循环和函数
   - 避免内存泄漏
   - 使用性能分析工具

2. **DOM 优化**
   - 批量更新 DOM
   - 使用事件委托
   - 避免频繁重排
   - 使用虚拟 DOM

3. **网络优化**
   - 合理加载资源
   - 使用缓存策略
   - 优化数据请求
   - 压缩和合并文件

4. **渲染优化**
   - 减少重排重绘
   - 使用 CSS 动画
   - 实现虚拟滚动
   - 优化图片加载

## 常见问题

1. **性能问题**
   - 内存泄漏
   - 频繁重排
   - 长任务阻塞
   - 资源加载慢

2. **优化问题**
   - 过度优化
   - 代码可读性
   - 维护成本
   - 兼容性

3. **工具使用**
   - 性能分析
   - 内存分析
   - 网络分析
   - 代码分析

## 下一步

在掌握了性能优化之后，您可以：
- 学习前端框架
- 深入了解浏览器原理
- 探索工程化实践
- 学习测试策略
- 开始实践项目 