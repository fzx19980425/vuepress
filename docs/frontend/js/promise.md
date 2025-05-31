# Promise

## 什么是 Promise

Promise 是 JavaScript 中处理异步操作的一种解决方案，它代表一个异步操作的最终完成（或失败）及其结果值。

## Promise 的基本概念

### 状态

Promise 有三种状态：
- pending（进行中）：初始状态
- fulfilled（已成功）：操作成功完成
- rejected（已失败）：操作失败

### 基本用法

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
    // 异步操作
    setTimeout(() => {
        const random = Math.random();
        if (random > 0.5) {
            resolve('Success!');
        } else {
            reject(new Error('Failed!'));
        }
    }, 1000);
});

// 使用 Promise
promise
    .then(result => {
        console.log('成功：', result);
    })
    .catch(error => {
        console.error('失败：', error);
    })
    .finally(() => {
        console.log('无论成功失败都会执行');
    });
```

## Promise 链式调用

```javascript
// 链式调用示例
fetch('/api/user')
    .then(response => response.json())
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(response => response.json())
    .then(posts => console.log(posts))
    .catch(error => console.error(error));

// 错误处理
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => {
        console.error('Error:', error);
        // 可以返回一个新的 Promise 继续链式调用
        return fetch('/api/fallback');
    })
    .then(response => response.json())
    .then(data => console.log('Fallback data:', data));
```

## Promise 静态方法

### Promise.all

```javascript
// 并行执行多个 Promise
const promise1 = fetch('/api/users');
const promise2 = fetch('/api/posts');
const promise3 = fetch('/api/comments');

Promise.all([promise1, promise2, promise3])
    .then(([users, posts, comments]) => {
        console.log('All data:', { users, posts, comments });
    })
    .catch(error => {
        console.error('One of the promises failed:', error);
    });

// 实际应用示例
async function loadUserData(userId) {
    try {
        const [user, posts, settings] = await Promise.all([
            fetch(`/api/users/${userId}`).then(r => r.json()),
            fetch(`/api/users/${userId}/posts`).then(r => r.json()),
            fetch(`/api/users/${userId}/settings`).then(r => r.json())
        ]);
        return { user, posts, settings };
    } catch (error) {
        console.error('Error loading user data:', error);
        throw error;
    }
}
```

### Promise.race

```javascript
// 竞态：返回最快完成的 Promise
const promise1 = new Promise(resolve => setTimeout(() => resolve('First'), 1000));
const promise2 = new Promise(resolve => setTimeout(() => resolve('Second'), 500));

Promise.race([promise1, promise2])
    .then(result => console.log('Winner:', result)); // 'Second'

// 超时处理
function timeout(ms) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), ms);
    });
}

Promise.race([
    fetch('/api/data'),
    timeout(5000)
])
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        if (error.message === 'Timeout') {
            console.error('Request timed out');
        } else {
            console.error('Other error:', error);
        }
    });
```

### Promise.allSettled

```javascript
// 等待所有 Promise 完成（无论成功失败）
const promises = [
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    Promise.reject(new Error('Failed'))
];

Promise.allSettled(promises)
    .then(results => {
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log('Success:', result.value);
            } else {
                console.error('Error:', result.reason);
            }
        });
    });
```

### Promise.any

```javascript
// 返回第一个成功的 Promise
const promises = [
    Promise.reject('Error 1'),
    Promise.resolve('Success 1'),
    Promise.reject('Error 2'),
    Promise.resolve('Success 2')
];

Promise.any(promises)
    .then(result => console.log('First success:', result)) // 'Success 1'
    .catch(error => console.error('All promises failed:', error));
```

## Promise 错误处理

```javascript
// 1. 使用 catch 捕获错误
promise
    .then(result => {
        // 处理成功
    })
    .catch(error => {
        // 处理错误
    });

// 2. 使用 try-catch 和 async/await
async function handlePromise() {
    try {
        const result = await promise;
        // 处理成功
    } catch (error) {
        // 处理错误
    }
}

// 3. 错误传播
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (!data) {
            throw new Error('No data received');
        }
        return processData(data);
    })
    .catch(error => {
        console.error('Error:', error);
        // 可以返回一个默认值
        return getDefaultData();
    });
```

## Promise 最佳实践

### 1. 避免 Promise 地狱

```javascript
// 不好的做法
fetch('/api/user')
    .then(user => {
        fetch(`/api/posts/${user.id}`)
            .then(posts => {
                fetch(`/api/comments/${posts[0].id}`)
                    .then(comments => {
                        console.log(comments);
                    });
            });
    });

// 好的做法
async function getData() {
    try {
        const user = await fetch('/api/user').then(r => r.json());
        const posts = await fetch(`/api/posts/${user.id}`).then(r => r.json());
        const comments = await fetch(`/api/comments/${posts[0].id}`).then(r => r.json());
        console.log(comments);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### 2. 使用 async/await

```javascript
// 使用 async/await 简化代码
async function fetchUserData(userId) {
    try {
        const user = await fetch(`/api/users/${userId}`).then(r => r.json());
        const posts = await fetch(`/api/users/${userId}/posts`).then(r => r.json());
        return { user, posts };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// 并行请求
async function fetchUserDataParallel(userId) {
    try {
        const [user, posts] = await Promise.all([
            fetch(`/api/users/${userId}`).then(r => r.json()),
            fetch(`/api/users/${userId}/posts`).then(r => r.json())
        ]);
        return { user, posts };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}
```

### 3. 错误处理

```javascript
// 创建通用的错误处理函数
function handleError(error) {
    console.error('Error:', error);
    // 可以添加错误上报逻辑
    reportError(error);
    // 返回默认值或重新抛出错误
    return null;
}

// 使用错误处理函数
async function fetchData() {
    try {
        const data = await fetch('/api/data').then(r => r.json());
        return data;
    } catch (error) {
        return handleError(error);
    }
}
```

### 4. 取消 Promise

```javascript
// 使用 AbortController 取消请求
const controller = new AbortController();
const signal = controller.signal;

fetch('/api/data', { signal })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Error:', error);
        }
    });

// 取消请求
controller.abort();
```

## 常见问题

1. Promise 的执行顺序
2. Promise 的错误传播
3. Promise 的取消
4. Promise 的性能考虑
5. Promise 与回调函数的区别
6. Promise 与 async/await 的关系

## 相关资源

- [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promise 规范](https://promisesaplus.com/)
- [async/await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [Promise 最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises) 