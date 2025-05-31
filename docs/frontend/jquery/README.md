# jQuery 使用指南

## 基础入门

### 1. 引入 jQuery
```html
<!-- 通过 CDN 引入 -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- 本地引入 -->
<script src="js/jquery.min.js"></script>
```

### 2. 文档就绪
```javascript
// 方式一：推荐
$(document).ready(function() {
  // 代码
});

// 方式二：简写
$(function() {
  // 代码
});

// 方式三：箭头函数
$(() => {
  // 代码
});
```

### 3. jQuery 对象
```javascript
// 创建 jQuery 对象
const $div = $('div');

// jQuery 对象转 DOM 对象
const div = $div[0];
const div2 = $div.get(0);

// DOM 对象转 jQuery 对象
const $div3 = $(div);
```

## 选择器

### 1. 基础选择器
```javascript
// ID 选择器
$('#myId');

// 类选择器
$('.myClass');

// 元素选择器
$('div');

// 组合选择器
$('div.myClass');

// 群组选择器
$('div, p, span');

// 通配符选择器
$('*');
```

### 2. 层级选择器
```javascript
// 子元素选择器
$('parent > child');

// 后代选择器
$('ancestor descendant');

// 相邻兄弟选择器
$('prev + next');

// 通用兄弟选择器
$('prev ~ siblings');
```

### 3. 属性选择器
```javascript
// 属性存在选择器
$('[attr]');

// 属性值选择器
$('[attr="value"]');

// 属性值包含选择器
$('[attr*="value"]');

// 属性值开头选择器
$('[attr^="value"]');

// 属性值结尾选择器
$('[attr$="value"]');

// 属性值包含单词选择器
$('[attr~="value"]');

// 属性值前缀选择器
$('[attr|="value"]');
```

### 4. 表单选择器
```javascript
// 表单元素选择器
$(':input');

// 文本输入框选择器
$(':text');

// 密码输入框选择器
$(':password');

// 单选按钮选择器
$(':radio');

// 复选框选择器
$(':checkbox');

// 提交按钮选择器
$(':submit');

// 重置按钮选择器
$(':reset');

// 按钮选择器
$(':button');

// 图片选择器
$(':image');

// 文件选择器
$(':file');

// 隐藏域选择器
$(':hidden');
```

### 5. 过滤选择器
```javascript
// 首元素选择器
$('li:first');

// 尾元素选择器
$('li:last');

// 非元素选择器
$('li:not(.active)');

// 偶数选择器
$('li:even');

// 奇数选择器
$('li:odd');

// 等于索引选择器
$('li:eq(2)');

// 大于索引选择器
$('li:gt(2)');

// 小于索引选择器
$('li:lt(2)');

// 标题选择器
$(':header');

// 动画选择器
$(':animated');

// 焦点选择器
$(':focus');
```

## DOM 操作

### 1. 内容操作
```javascript
// 获取/设置 HTML 内容
$('div').html();
$('div').html('<p>新内容</p>');

// 获取/设置文本内容
$('div').text();
$('div').text('新文本');

// 获取/设置表单值
$('input').val();
$('input').val('新值');
```

### 2. 属性操作
```javascript
// 获取/设置属性
$('img').attr('src');
$('img').attr('src', 'new.jpg');

// 删除属性
$('img').removeAttr('src');

// 获取/设置 data 属性
$('div').data('key');
$('div').data('key', 'value');

// 删除 data 属性
$('div').removeData('key');
```

### 3. 样式操作
```javascript
// 获取/设置 CSS 属性
$('div').css('color');
$('div').css('color', 'red');
$('div').css({
  'color': 'red',
  'background': 'blue'
});

// 添加/删除类
$('div').addClass('active');
$('div').removeClass('active');
$('div').toggleClass('active');

// 判断类是否存在
$('div').hasClass('active');
```

### 4. 节点操作
```javascript
// 创建节点
$('<div>新节点</div>');

// 插入节点
$('div').append('<p>末尾插入</p>');
$('div').prepend('<p>开头插入</p>');
$('div').after('<p>之后插入</p>');
$('div').before('<p>之前插入</p>');

// 包裹节点
$('p').wrap('<div></div>');
$('p').wrapAll('<div></div>');
$('p').wrapInner('<span></span>');

// 替换节点
$('p').replaceWith('<div>新节点</div>');
$('<div>新节点</div>').replaceAll('p');

// 删除节点
$('p').remove();
$('p').detach();
$('p').empty();
```

## 事件处理

### 1. 事件绑定
```javascript
// 绑定事件
$('div').on('click', function() {
  console.log('点击事件');
});

// 绑定多个事件
$('div').on({
  'click': function() {
    console.log('点击事件');
  },
  'mouseenter': function() {
    console.log('鼠标进入');
  }
});

// 事件委托
$('ul').on('click', 'li', function() {
  console.log('点击列表项');
});

// 解绑事件
$('div').off('click');
$('div').off();

// 一次性事件
$('div').one('click', function() {
  console.log('只触发一次');
});
```

### 2. 常用事件
```javascript
// 鼠标事件
$('div').click(function() {});
$('div').dblclick(function() {});
$('div').mouseenter(function() {});
$('div').mouseleave(function() {});
$('div').mousemove(function() {});

// 键盘事件
$('input').keydown(function() {});
$('input').keyup(function() {});
$('input').keypress(function() {});

// 表单事件
$('form').submit(function() {});
$('input').change(function() {});
$('input').focus(function() {});
$('input').blur(function() {});

// 文档事件
$(document).ready(function() {});
$(window).load(function() {});
$(window).resize(function() {});
$(window).scroll(function() {});
```

### 3. 事件对象
```javascript
$('div').on('click', function(event) {
  // 事件类型
  console.log(event.type);
  
  // 事件目标
  console.log(event.target);
  
  // 当前元素
  console.log(event.currentTarget);
  
  // 鼠标位置
  console.log(event.pageX, event.pageY);
  
  // 键盘按键
  console.log(event.keyCode);
  
  // 阻止默认行为
  event.preventDefault();
  
  // 阻止冒泡
  event.stopPropagation();
  
  // 阻止事件传播
  event.stopImmediatePropagation();
});
```

## 动画效果

### 1. 基础动画
```javascript
// 显示/隐藏
$('div').show();
$('div').hide();
$('div').toggle();

// 淡入/淡出
$('div').fadeIn();
$('div').fadeOut();
$('div').fadeToggle();

// 滑动
$('div').slideDown();
$('div').slideUp();
$('div').slideToggle();
```

### 2. 自定义动画
```javascript
// 基础动画
$('div').animate({
  'width': '200px',
  'height': '200px',
  'opacity': 0.5
}, 1000, 'swing', function() {
  console.log('动画完成');
});

// 队列动画
$('div').animate({ 'width': '200px' })
       .animate({ 'height': '200px' })
       .animate({ 'opacity': 0.5 });

// 停止动画
$('div').stop();
$('div').stop(true);
$('div').stop(true, true);
```

### 3. 动画设置
```javascript
// 设置动画时长
$('div').show(1000);
$('div').fadeIn('slow');
$('div').slideDown('fast');

// 设置动画缓动
$('div').animate({
  'left': '200px'
}, 1000, 'easeInOutQuad');

// 延迟动画
$('div').delay(1000).fadeIn();

// 清除动画队列
$('div').clearQueue();
```

## AJAX 请求

### 1. 基础请求
```javascript
// GET 请求
$.get('api/data', function(data) {
  console.log('请求成功：', data);
});

// POST 请求
$.post('api/data', {
  name: 'test',
  age: 18
}, function(data) {
  console.log('请求成功：', data);
});

// 通用请求
$.ajax({
  url: 'api/data',
  type: 'GET',
  data: {
    name: 'test'
  },
  success: function(data) {
    console.log('请求成功：', data);
  },
  error: function(error) {
    console.error('请求失败：', error);
  }
});
```

### 2. 请求设置
```javascript
// 设置全局默认值
$.ajaxSetup({
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer token'
  }
});

// 请求拦截器
$(document).ajaxSend(function(event, xhr, settings) {
  // 发送请求前
});

$(document).ajaxComplete(function(event, xhr, settings) {
  // 请求完成后
});

// 错误处理
$(document).ajaxError(function(event, xhr, settings, error) {
  // 请求错误
});
```

### 3. JSONP 请求
```javascript
$.ajax({
  url: 'api/data',
  dataType: 'jsonp',
  jsonp: 'callback',
  success: function(data) {
    console.log('请求成功：', data);
  }
});
```

## 工具方法

### 1. 数组操作
```javascript
// 遍历数组
$.each([1, 2, 3], function(index, value) {
  console.log(index, value);
});

// 过滤数组
const filtered = $.grep([1, 2, 3], function(value) {
  return value > 1;
});

// 转换数组
const mapped = $.map([1, 2, 3], function(value) {
  return value * 2;
});

// 合并数组
const merged = $.merge([1, 2], [3, 4]);

// 去重数组
const unique = $.unique([1, 2, 2, 3]);
```

### 2. 对象操作
```javascript
// 遍历对象
$.each({ name: 'test', age: 18 }, function(key, value) {
  console.log(key, value);
});

// 扩展对象
const obj = $.extend({}, { name: 'test' }, { age: 18 });

// 判断类型
$.isArray([]);
$.isFunction(function() {});
$.isPlainObject({});
$.isEmptyObject({});
```

### 3. 字符串操作
```javascript
// 去除空格
$.trim('  test  ');

// 解析 JSON
$.parseJSON('{"name":"test"}');

// 解析 XML
$.parseXML('<root><item>test</item></root>');
```

## 插件开发

### 1. 基础插件
```javascript
// 方法插件
$.fn.myPlugin = function(options) {
  // 默认配置
  const settings = $.extend({
    color: 'red',
    size: '12px'
  }, options);
  
  // 遍历元素
  return this.each(function() {
    $(this).css({
      'color': settings.color,
      'font-size': settings.size
    });
  });
};

// 使用插件
$('div').myPlugin({
  color: 'blue',
  size: '14px'
});
```

### 2. 高级插件
```javascript
// 命名空间插件
(function($) {
  // 私有方法
  const privateMethod = function() {
    // 私有逻辑
  };
  
  // 插件方法
  const methods = {
    init: function(options) {
      // 初始化逻辑
    },
    destroy: function() {
      // 销毁逻辑
    }
  };
  
  // 插件定义
  $.fn.myPlugin = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('方法 ' + method + ' 不存在');
    }
  };
})(jQuery);

// 使用插件
$('div').myPlugin('init', { option: 'value' });
$('div').myPlugin('destroy');
```

## 性能优化

### 1. 选择器优化
```javascript
// 缓存选择器
const $div = $('div');
$div.addClass('active');
$div.css('color', 'red');

// 使用 ID 选择器
$('#myId'); // 快
$('.myClass'); // 慢

// 缩小选择范围
$('div').find('.active'); // 快
$('.active'); // 慢

// 避免过度具体
$('div.active'); // 快
$('div.container .active'); // 慢
```

### 2. 事件优化
```javascript
// 使用事件委托
$('ul').on('click', 'li', function() {}); // 好
$('li').on('click', function() {}); // 差

// 解绑不需要的事件
$('div').off('click');

// 使用一次性事件
$('div').one('click', function() {});
```

### 3. DOM 操作优化
```javascript
// 批量修改
$('div').css({
  'color': 'red',
  'background': 'blue'
}); // 好

$('div').css('color', 'red')
       .css('background', 'blue'); // 差

// 使用文档片段
const $fragment = $('<div></div>');
for (let i = 0; i < 1000; i++) {
  $fragment.append('<p>item</p>');
}
$('body').append($fragment); // 好

for (let i = 0; i < 1000; i++) {
  $('body').append('<p>item</p>');
} // 差
```

## 常见问题

### 1. 版本兼容
```javascript
// 检查 jQuery 版本
console.log($.fn.jquery);

// 检查功能支持
if ($.fn.jquery >= '3.0.0') {
  // 使用新特性
} else {
  // 使用兼容方案
}

// 使用 noConflict
const jq = $.noConflict();
jq('div').addClass('active');
```

### 2. 常见错误
```javascript
// 选择器错误
$('#myId').length; // 检查元素是否存在

// 事件绑定错误
$('div').on('click', function() {
  console.log(this); // 注意 this 指向
});

// AJAX 错误
$.ajax({
  url: 'api/data',
  error: function(xhr, status, error) {
    console.error('请求失败：', status, error);
  }
});
```

### 3. 调试技巧
```javascript
// 检查 jQuery 对象
console.log($('div'));

// 检查事件绑定
console.log($._data($('div')[0], 'events'));

// 检查 AJAX 请求
$(document).ajaxSend(function(event, xhr, settings) {
  console.log('发送请求：', settings);
});
```

## 相关资源

1. [jQuery 官方文档](https://api.jquery.com/)
2. [jQuery 中文文档](https://www.jquery123.com/)
3. [jQuery 插件库](https://plugins.jquery.com/)
4. [jQuery UI](https://jqueryui.com/)
5. [jQuery Mobile](https://jquerymobile.com/) 