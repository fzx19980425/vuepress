# DOM 操作

## 什么是 DOM

DOM（Document Object Model，文档对象模型）是 HTML 和 XML 文档的编程接口。它提供了对文档的结构化的表述，并定义了一种方式可以使从程序中对该结构进行访问，从而改变文档的结构、样式和内容。

## DOM 树

DOM 将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。简言之，它会将网页解析为树形结构。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>DOM 示例</title>
  </head>
  <body>
    <h1>DOM 树结构</h1>
    <p>这是一个段落</p>
  </body>
</html>
```

## 常用 DOM 操作方法

### 1. 获取元素

```javascript
// 通过 ID 获取元素
const element = document.getElementById('myId');

// 通过类名获取元素
const elements = document.getElementsByClassName('myClass');

// 通过标签名获取元素
const divs = document.getElementsByTagName('div');

// 通过选择器获取元素
const element = document.querySelector('.myClass');
const elements = document.querySelectorAll('.myClass');
```

### 2. 创建和添加元素

```javascript
// 创建新元素
const newDiv = document.createElement('div');
const newText = document.createTextNode('Hello World');

// 添加元素
element.appendChild(newDiv);
element.insertBefore(newDiv, referenceNode);

// 添加文本内容
element.textContent = 'Hello World';
element.innerHTML = '<span>Hello World</span>';
```

### 3. 修改元素

```javascript
// 修改属性
element.setAttribute('class', 'newClass');
element.className = 'newClass';
element.id = 'newId';

// 修改样式
element.style.color = 'red';
element.style.backgroundColor = 'blue';

// 修改内容
element.textContent = 'New Text';
element.innerHTML = '<span>New HTML</span>';
```

### 4. 删除元素

```javascript
// 删除子元素
element.removeChild(childElement);

// 删除自身
element.remove();
```

## DOM 遍历

### 1. 父节点

```javascript
// 获取父节点
const parent = element.parentNode;
const parentElement = element.parentElement;
```

### 2. 子节点

```javascript
// 获取所有子节点
const children = element.childNodes;
const childElements = element.children;

// 获取第一个和最后一个子节点
const firstChild = element.firstChild;
const lastChild = element.lastChild;
const firstElementChild = element.firstElementChild;
const lastElementChild = element.lastElementChild;
```

### 3. 兄弟节点

```javascript
// 获取前一个和后一个兄弟节点
const previousSibling = element.previousSibling;
const nextSibling = element.nextSibling;
const previousElementSibling = element.previousElementSibling;
const nextElementSibling = element.nextElementSibling;
```

## DOM 性能优化

1. 缓存 DOM 查询结果
```javascript
// 不好的做法
for (let i = 0; i < 1000; i++) {
    document.getElementById('myId').style.color = 'red';
}

// 好的做法
const element = document.getElementById('myId');
for (let i = 0; i < 1000; i++) {
    element.style.color = 'red';
}
```

2. 批量更新 DOM
```javascript
// 不好的做法
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    document.body.appendChild(div);
}

// 好的做法
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    fragment.appendChild(div);
}
document.body.appendChild(fragment);
```

3. 使用事件委托
```javascript
// 不好的做法
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('click', handleClick);
});

// 好的做法
document.body.addEventListener('click', (event) => {
    if (event.target.matches('button')) {
        handleClick(event);
    }
});
```

## 最佳实践

1. 使用 `querySelector` 和 `querySelectorAll` 进行复杂选择
2. 使用 `classList` 操作类名
3. 使用 `dataset` 操作自定义数据属性
4. 使用 `DocumentFragment` 进行批量 DOM 操作
5. 使用事件委托处理动态元素
6. 避免频繁的 DOM 操作，尽量批量处理
7. 使用 `requestAnimationFrame` 进行视觉更新

## 常见问题

1. DOM 操作是同步的吗？
2. 如何判断元素是否在视口中？
3. 如何处理动态加载的内容？
4. 如何优化大量 DOM 操作的性能？
5. 如何处理 DOM 事件的内存泄漏？

## 相关资源

- [MDN DOM 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- [DOM 操作性能优化](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Performance)
- [DOM 事件](https://developer.mozilla.org/zh-CN/docs/Web/Events) 