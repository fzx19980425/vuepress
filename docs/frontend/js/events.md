# 事件处理

## 什么是事件

事件是用户或浏览器自身执行的某种动作，如点击、加载、鼠标移动等。JavaScript 可以监听这些事件并执行相应的代码。

## 事件类型

### 1. 鼠标事件

```javascript
// 点击事件
element.addEventListener('click', (event) => {
    console.log('元素被点击了');
});

// 双击事件
element.addEventListener('dblclick', (event) => {
    console.log('元素被双击了');
});

// 鼠标按下
element.addEventListener('mousedown', (event) => {
    console.log('鼠标按下');
});

// 鼠标释放
element.addEventListener('mouseup', (event) => {
    console.log('鼠标释放');
});

// 鼠标移动
element.addEventListener('mousemove', (event) => {
    console.log('鼠标移动');
});

// 鼠标进入
element.addEventListener('mouseenter', (event) => {
    console.log('鼠标进入元素');
});

// 鼠标离开
element.addEventListener('mouseleave', (event) => {
    console.log('鼠标离开元素');
});

// 鼠标悬停
element.addEventListener('mouseover', (event) => {
    console.log('鼠标悬停在元素上');
});

// 鼠标移出
element.addEventListener('mouseout', (event) => {
    console.log('鼠标移出元素');
});
```

### 2. 键盘事件

```javascript
// 按键按下
element.addEventListener('keydown', (event) => {
    console.log('按键按下', event.key);
});

// 按键释放
element.addEventListener('keyup', (event) => {
    console.log('按键释放', event.key);
});

// 按键按下并释放
element.addEventListener('keypress', (event) => {
    console.log('按键按下并释放', event.key);
});
```

### 3. 表单事件

```javascript
// 表单提交
form.addEventListener('submit', (event) => {
    event.preventDefault(); // 阻止表单默认提交
    console.log('表单提交');
});

// 输入框值改变
input.addEventListener('change', (event) => {
    console.log('输入值改变', event.target.value);
});

// 输入框输入
input.addEventListener('input', (event) => {
    console.log('正在输入', event.target.value);
});

// 输入框获得焦点
input.addEventListener('focus', (event) => {
    console.log('输入框获得焦点');
});

// 输入框失去焦点
input.addEventListener('blur', (event) => {
    console.log('输入框失去焦点');
});
```

### 4. 文档/窗口事件

```javascript
// 页面加载完成
window.addEventListener('load', (event) => {
    console.log('页面加载完成');
});

// DOM 内容加载完成
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM 内容加载完成');
});

// 页面卸载
window.addEventListener('unload', (event) => {
    console.log('页面卸载');
});

// 页面显示/隐藏
document.addEventListener('visibilitychange', (event) => {
    console.log('页面可见性改变', document.visibilityState);
});

// 窗口大小改变
window.addEventListener('resize', (event) => {
    console.log('窗口大小改变');
});

// 页面滚动
window.addEventListener('scroll', (event) => {
    console.log('页面滚动');
});
```

## 事件对象

事件处理函数会接收一个事件对象作为参数，包含事件相关的信息：

```javascript
element.addEventListener('click', (event) => {
    // 事件类型
    console.log(event.type); // 'click'
    
    // 事件目标元素
    console.log(event.target);
    
    // 当前元素
    console.log(event.currentTarget);
    
    // 鼠标位置
    console.log(event.clientX, event.clientY); // 相对于视口
    console.log(event.pageX, event.pageY); // 相对于文档
    
    // 键盘事件
    console.log(event.key); // 按键
    console.log(event.ctrlKey); // 是否按下 Ctrl
    console.log(event.shiftKey); // 是否按下 Shift
    console.log(event.altKey); // 是否按下 Alt
    
    // 阻止默认行为
    event.preventDefault();
    
    // 阻止事件冒泡
    event.stopPropagation();
});
```

## 事件传播

事件传播分为三个阶段：

1. 捕获阶段（Capturing phase）：事件从 Window 向下传播到目标元素
2. 目标阶段（Target phase）：事件到达目标元素
3. 冒泡阶段（Bubbling phase）：事件从目标元素向上冒泡到 Window

```javascript
// 在捕获阶段处理事件
element.addEventListener('click', (event) => {
    console.log('捕获阶段');
}, true);

// 在冒泡阶段处理事件（默认）
element.addEventListener('click', (event) => {
    console.log('冒泡阶段');
}, false);
```

## 事件委托

事件委托利用事件冒泡，将事件监听器添加到父元素，通过判断事件目标来处理子元素的事件：

```javascript
// 不好的做法
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('click', handleClick);
});

// 好的做法（事件委托）
document.body.addEventListener('click', (event) => {
    if (event.target.matches('button')) {
        handleClick(event);
    }
});
```

## 自定义事件

可以创建和触发自定义事件：

```javascript
// 创建自定义事件
const customEvent = new CustomEvent('myEvent', {
    detail: { message: 'Hello' },
    bubbles: true,
    cancelable: true
});

// 监听自定义事件
element.addEventListener('myEvent', (event) => {
    console.log(event.detail.message);
});

// 触发自定义事件
element.dispatchEvent(customEvent);
```

## 事件处理最佳实践

1. 使用事件委托处理动态元素
2. 及时移除不需要的事件监听器
3. 使用 `passive` 选项优化滚动事件
4. 使用 `once` 选项处理一次性事件
5. 合理使用事件节流和防抖
6. 避免在事件处理函数中执行耗时操作

## 事件节流和防抖

### 节流（Throttle）

限制函数在一定时间内只能执行一次：

```javascript
function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            func.apply(this, args);
            lastCall = now;
        }
    };
}

// 使用节流
const throttledScroll = throttle(() => {
    console.log('滚动事件处理');
}, 200);

window.addEventListener('scroll', throttledScroll);
```

### 防抖（Debounce）

等待一定时间后执行函数，如果期间再次触发则重新计时：

```javascript
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 使用防抖
const debouncedInput = debounce((event) => {
    console.log('输入事件处理', event.target.value);
}, 300);

input.addEventListener('input', debouncedInput);
```

## 常见问题

1. 事件处理函数中的 `this` 指向问题
2. 事件冒泡和捕获的区别
3. 如何阻止事件默认行为
4. 如何阻止事件冒泡
5. 如何处理动态元素的事件
6. 事件监听器的内存泄漏问题

## 相关资源

- [MDN 事件参考](https://developer.mozilla.org/zh-CN/docs/Web/Events)
- [事件处理最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
- [事件委托](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events#%E4%BA%8B%E4%BB%B6%E5%A7%94%E6%B4%BE) 