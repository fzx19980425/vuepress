# Async/Await

## 什么是 Async/Await

Async/Await 是 JavaScript 中处理异步操作的一种语法糖，它基于 Promise，让异步代码的写法更接近同步代码，更容易理解和维护。

## 基本用法

### async 函数

```javascript
// 声明 async 函数
async function fetchData() {
    return 'Data';
}

// 箭头函数
const fetchData = async () => {
    return 'Data';
};

// 类方法
class DataFetcher {
    async fetch() {
        return 'Data';
    }
}

// async 函数总是返回 Promise
const promise = fetchData();
console.log(promise instanceof Promise); // true
```

### await 操作符

```javascript
// 基本用法
async function getData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
}

// 错误处理
async function getData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// 并行请求
async function getMultipleData() {
    const [users, posts] = await Promise.all([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/posts').then(r => r.json())
    ]);
    return { users, posts };
}
```

## 实际应用

### 1. 数据获取

```javascript
// 获取用户数据
async function getUserData(userId) {
    try {
        const user = await fetch(`/api/users/${userId}`).then(r => r.json());
        const posts = await fetch(`/api/users/${userId}/posts`).then(r => r.json());
        const settings = await fetch(`/api/users/${userId}/settings`).then(r => r.json());
        
        return {
            user,
            posts,
            settings
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// 使用
async function displayUserData() {
    try {
        const data = await getUserData(123);
        console.log('User data:', data);
    } catch (error) {
        console.error('Failed to display user data:', error);
    }
}
```

### 2. 文件操作

```javascript
// 读取文件
async function readFile(file) {
    try {
        const text = await file.text();
        return text;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

// 上传文件
async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
```

### 3. 动画和过渡

```javascript
// 等待动画完成
async function animate(element) {
    element.classList.add('animate');
    
    // 等待动画完成
    await new Promise(resolve => {
        element.addEventListener('animationend', resolve, { once: true });
    });
    
    element.classList.remove('animate');
}

// 使用
async function handleClick() {
    const element = document.querySelector('.box');
    await animate(element);
    console.log('Animation completed');
}
```

### 4. 超时处理

```javascript
// 带超时的请求
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

// 使用
async function getData() {
    try {
        const data = await fetchWithTimeout('/api/data', 3000);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

## 最佳实践

### 1. 错误处理

```javascript
// 创建通用的错误处理函数
function handleError(error) {
    console.error('Error:', error);
    // 可以添加错误上报逻辑
    reportError(error);
    // 返回默认值
    return null;
}

// 使用 try-catch
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        return handleError(error);
    }
}

// 使用 Promise.catch
async function fetchData() {
    const response = await fetch('/api/data').catch(handleError);
    if (!response) return null;
    
    const data = await response.json().catch(handleError);
    return data;
}
```

### 2. 并行执行

```javascript
// 并行执行多个异步操作
async function getDashboardData() {
    try {
        const [users, posts, stats] = await Promise.all([
            fetch('/api/users').then(r => r.json()),
            fetch('/api/posts').then(r => r.json()),
            fetch('/api/stats').then(r => r.json())
        ]);
        
        return { users, posts, stats };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}

// 按顺序执行，但保持并行请求
async function getSequentialData() {
    const userId = await fetch('/api/current-user').then(r => r.json());
    const [profile, posts] = await Promise.all([
        fetch(`/api/users/${userId}/profile`).then(r => r.json()),
        fetch(`/api/users/${userId}/posts`).then(r => r.json())
    ]);
    
    return { profile, posts };
}
```

### 3. 循环处理

```javascript
// 串行处理数组
async function processItems(items) {
    const results = [];
    for (const item of items) {
        const result = await processItem(item);
        results.push(result);
    }
    return results;
}

// 并行处理数组
async function processItemsParallel(items) {
    const promises = items.map(item => processItem(item));
    return await Promise.all(promises);
}

// 带并发限制的并行处理
async function processItemsWithLimit(items, limit = 3) {
    const results = [];
    const chunks = [];
    
    // 将数组分成多个块
    for (let i = 0; i < items.length; i += limit) {
        chunks.push(items.slice(i, i + limit));
    }
    
    // 串行处理每个块，块内并行
    for (const chunk of chunks) {
        const chunkResults = await Promise.all(
            chunk.map(item => processItem(item))
        );
        results.push(...chunkResults);
    }
    
    return results;
}
```

### 4. 缓存处理

```javascript
// 带缓存的异步函数
function createCachedAsyncFunction(asyncFn) {
    const cache = new Map();
    
    return async function (...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = await asyncFn(...args);
        cache.set(key, result);
        return result;
    };
}

// 使用
const cachedFetch = createCachedAsyncFunction(async (url) => {
    const response = await fetch(url);
    return response.json();
});

// 调用
async function getData() {
    const data = await cachedFetch('/api/data');
    console.log(data);
}
```

## 常见问题

1. async 函数总是返回 Promise
2. await 只能在 async 函数中使用
3. 错误处理的重要性
4. 并行 vs 串行执行
5. 性能考虑
6. 内存使用

## 相关资源

- [MDN async function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
- [Async/Await 最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function#%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%E5%92%8C%E5%85%8B%E9%9A%86)
- [Promise 与 Async/Await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises#%E4%BD%BF%E7%94%A8_promise_%E4%B8%8E_async_await) 