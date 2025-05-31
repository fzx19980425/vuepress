# 异步编程基础

## 异步编程概述

JavaScript 是单线程的语言，但通过异步编程可以实现非阻塞的操作。异步编程允许程序在等待某些操作（如 I/O、网络请求等）完成时继续执行其他任务。

### 为什么需要异步编程？

```javascript
// 同步操作示例
function syncOperation() {
    console.log('开始同步操作');
    // 模拟耗时操作
    for(let i = 0; i < 1000000000; i++) {}
    console.log('同步操作完成');
}

// 异步操作示例
function asyncOperation() {
    console.log('开始异步操作');
    setTimeout(() => {
        console.log('异步操作完成');
    }, 1000);
    console.log('继续执行其他任务');
}
```

## 异步编程模型

### 1. 回调函数

```javascript
// 基本回调
function fetchData(callback) {
    setTimeout(() => {
        const data = { id: 1, name: '测试数据' };
        callback(data);
    }, 1000);
}

fetchData((data) => {
    console.log('获取到数据：', data);
});

// 回调地狱示例
fetchUserData((user) => {
    fetchUserPosts(user.id, (posts) => {
        fetchPostComments(posts[0].id, (comments) => {
            console.log('评论：', comments);
        });
    });
});
```

### 2. 事件监听

```javascript
// 自定义事件
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

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// 使用示例
const emitter = new EventEmitter();

emitter.on('dataReceived', (data) => {
    console.log('收到数据：', data);
});

setTimeout(() => {
    emitter.emit('dataReceived', { message: 'Hello' });
}, 1000);
```

### 3. 发布/订阅模式

```javascript
class PubSub {
    constructor() {
        this.subscribers = {};
    }

    subscribe(topic, callback) {
        if (!this.subscribers[topic]) {
            this.subscribers[topic] = [];
        }
        this.subscribers[topic].push(callback);
        
        // 返回取消订阅的函数
        return () => {
            this.subscribers[topic] = this.subscribers[topic]
                .filter(cb => cb !== callback);
        };
    }

    publish(topic, data) {
        if (this.subscribers[topic]) {
            this.subscribers[topic].forEach(callback => callback(data));
        }
    }
}

// 使用示例
const pubsub = new PubSub();

// 订阅
const unsubscribe = pubsub.subscribe('news', (data) => {
    console.log('收到新闻：', data);
});

// 发布
pubsub.publish('news', { title: '重要新闻' });

// 取消订阅
unsubscribe();
```

## 异步编程模式

### 1. 串行执行

```javascript
// 使用回调
function serialExecution(tasks, callback) {
    let index = 0;
    
    function next() {
        if (index < tasks.length) {
            tasks[index]((err, result) => {
                if (err) {
                    callback(err);
                } else {
                    index++;
                    next();
                }
            });
        } else {
            callback(null, '所有任务完成');
        }
    }
    
    next();
}

// 使用示例
const tasks = [
    (cb) => setTimeout(() => cb(null, '任务1完成'), 1000),
    (cb) => setTimeout(() => cb(null, '任务2完成'), 1000),
    (cb) => setTimeout(() => cb(null, '任务3完成'), 1000)
];

serialExecution(tasks, (err, result) => {
    console.log(result);
});
```

### 2. 并行执行

```javascript
// 使用回调
function parallelExecution(tasks, callback) {
    let completed = 0;
    const results = [];
    
    tasks.forEach((task, index) => {
        task((err, result) => {
            if (err) {
                callback(err);
            } else {
                results[index] = result;
                completed++;
                
                if (completed === tasks.length) {
                    callback(null, results);
                }
            }
        });
    });
}

// 使用示例
const tasks = [
    (cb) => setTimeout(() => cb(null, '任务1完成'), 1000),
    (cb) => setTimeout(() => cb(null, '任务2完成'), 2000),
    (cb) => setTimeout(() => cb(null, '任务3完成'), 1500)
];

parallelExecution(tasks, (err, results) => {
    console.log('所有任务完成：', results);
});
```

### 3. 竞态处理

```javascript
// 使用标志位
let isProcessing = false;

function raceConditionExample(callback) {
    if (isProcessing) {
        console.log('已有任务在处理中');
        return;
    }
    
    isProcessing = true;
    
    // 模拟异步操作
    setTimeout(() => {
        isProcessing = false;
        callback();
    }, 1000);
}

// 使用示例
raceConditionExample(() => console.log('任务1完成'));
raceConditionExample(() => console.log('任务2完成')); // 不会执行
```

## 异步编程最佳实践

### 1. 错误处理

```javascript
// 回调中的错误处理
function asyncOperation(callback) {
    try {
        // 可能出错的异步操作
        setTimeout(() => {
            try {
                // 可能出错的代码
                throw new Error('操作失败');
            } catch (error) {
                callback(error);
            }
        }, 1000);
    } catch (error) {
        callback(error);
    }
}

// 使用示例
asyncOperation((error) => {
    if (error) {
        console.error('发生错误：', error);
    } else {
        console.log('操作成功');
    }
});
```

### 2. 超时处理

```javascript
function withTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('操作超时')), timeout);
        })
    ]);
}

// 使用示例
const fetchWithTimeout = (url, timeout) => {
    return withTimeout(fetch(url), timeout);
};

fetchWithTimeout('https://api.example.com/data', 5000)
    .then(response => response.json())
    .catch(error => console.error('请求失败：', error));
```

### 3. 取消操作

```javascript
function cancellableOperation() {
    let isCancelled = false;
    
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isCancelled) {
                reject(new Error('操作已取消'));
            } else {
                resolve('操作完成');
            }
        }, 2000);
    });
    
    return {
        promise,
        cancel: () => {
            isCancelled = true;
        }
    };
}

// 使用示例
const { promise, cancel } = cancellableOperation();

promise
    .then(result => console.log(result))
    .catch(error => console.error(error));

// 取消操作
setTimeout(cancel, 1000);
```

## 常见问题

### 1. 回调地狱

```javascript
// 不推荐的方式
fetchUserData((user) => {
    fetchUserPosts(user.id, (posts) => {
        fetchPostComments(posts[0].id, (comments) => {
            fetchCommentReplies(comments[0].id, (replies) => {
                console.log('回复：', replies);
            });
        });
    });
});

// 推荐使用 Promise 或 async/await
async function getCommentReplies() {
    try {
        const user = await fetchUserData();
        const posts = await fetchUserPosts(user.id);
        const comments = await fetchPostComments(posts[0].id);
        const replies = await fetchCommentReplies(comments[0].id);
        console.log('回复：', replies);
    } catch (error) {
        console.error('获取数据失败：', error);
    }
}
```

### 2. 内存泄漏

```javascript
// 可能导致内存泄漏的代码
function addEventListener() {
    const button = document.getElementById('button');
    button.addEventListener('click', () => {
        console.log('按钮被点击');
    });
}

// 正确的处理方式
function addEventListener() {
    const button = document.getElementById('button');
    const handler = () => {
        console.log('按钮被点击');
    };
    
    button.addEventListener('click', handler);
    
    // 在不需要时移除事件监听
    return () => {
        button.removeEventListener('click', handler);
    };
}

// 使用示例
const cleanup = addEventListener();
// 在组件卸载时调用
cleanup();
```

## 相关资源

- [MDN 异步编程](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous)
- [JavaScript 异步编程指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)
- [异步编程模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 