# 事件系统

## 事件类型

### 1. 基础事件
```html
<!-- 点击事件 -->
<view bindtap="handleTap">点击</view>

<!-- 长按事件 -->
<view bindlongpress="handleLongPress">长按</view>

<!-- 触摸事件 -->
<view bindtouchstart="handleTouchStart"
      bindtouchmove="handleTouchMove"
      bindtouchend="handleTouchEnd"
      bindtouchcancel="handleTouchCancel">
  触摸区域
</view>
```

### 2. 表单事件
```html
<!-- 输入事件 -->
<input bindinput="handleInput" />

<!-- 聚焦事件 -->
<input bindfocus="handleFocus" />

<!-- 失焦事件 -->
<input bindblur="handleBlur" />

<!-- 确认事件 -->
<input bindconfirm="handleConfirm" />

<!-- 选择事件 -->
<picker bindchange="handlePickerChange">
  <view>选择器</view>
</picker>

<!-- 滑动事件 -->
<slider bindchange="handleSliderChange" />
```

### 3. 组件事件
```html
<!-- 滚动事件 -->
<scroll-view bindscroll="handleScroll">
  滚动内容
</scroll-view>

<!-- 滚动到底部事件 -->
<scroll-view bindscrolltolower="handleScrollToLower">
  滚动到底部
</scroll-view>

<!-- 滚动到顶部事件 -->
<scroll-view bindscrolltoupper="handleScrollToUpper">
  滚动到顶部
</scroll-view>

<!-- 切换事件 -->
<swiper bindchange="handleSwiperChange">
  <swiper-item>1</swiper-item>
  <swiper-item>2</swiper-item>
</swiper>
```

## 事件绑定

### 1. 绑定方式
```html
<!-- 普通绑定 -->
<view bindtap="handleTap">普通绑定</view>

<!-- 事件冒泡 -->
<view catchtap="handleTap">阻止冒泡</view>

<!-- 互斥事件 -->
<view mut-bindtap="handleTap">互斥事件</view>

<!-- 捕获阶段 -->
<view capture-bindtap="handleTap">捕获阶段</view>
<view capture-catchtap="handleTap">捕获阶段阻止冒泡</view>
```

### 2. 事件对象
```javascript
Page({
  handleTap: function(event) {
    // 事件类型
    console.log('事件类型：', event.type);
    
    // 时间戳
    console.log('时间戳：', event.timeStamp);
    
    // 目标节点
    console.log('目标节点：', event.target);
    
    // 当前节点
    console.log('当前节点：', event.currentTarget);
    
    // 触摸点信息
    console.log('触摸点：', event.touches);
    console.log('当前触摸点：', event.changedTouches);
    
    // 自定义数据
    console.log('自定义数据：', event.currentTarget.dataset);
  }
});
```

### 3. 事件传参
```html
<!-- 通过 data-* 传参 -->
<view bindtap="handleTap" data-id="1" data-name="test">
  点击传参
</view>

<!-- 通过 mark 传参 -->
<view bindtap="handleTap" mark:id="1" mark:name="test">
  点击传参
</view>
```

```javascript
Page({
  handleTap: function(event) {
    // 获取 data-* 参数
    const { id, name } = event.currentTarget.dataset;
    
    // 获取 mark 参数
    const { id, name } = event.mark;
  }
});
```

## 事件处理

### 1. 基础处理
```javascript
Page({
  data: {
    count: 0
  },
  
  // 点击处理
  handleTap: function(event) {
    this.setData({
      count: this.data.count + 1
    });
  },
  
  // 输入处理
  handleInput: function(event) {
    const value = event.detail.value;
    this.setData({
      inputValue: value
    });
  },
  
  // 表单提交
  handleSubmit: function(event) {
    const formData = event.detail.value;
    console.log('表单数据：', formData);
  }
});
```

### 2. 事件防抖
```javascript
Page({
  data: {
    timer: null
  },
  
  // 防抖处理
  handleDebounce: function(event) {
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
    
    this.data.timer = setTimeout(() => {
      // 处理事件
      console.log('防抖处理');
    }, 300);
  }
});
```

### 3. 事件节流
```javascript
Page({
  data: {
    lastTime: 0
  },
  
  // 节流处理
  handleThrottle: function(event) {
    const now = Date.now();
    if (now - this.data.lastTime >= 300) {
      // 处理事件
      console.log('节流处理');
      this.setData({
        lastTime: now
      });
    }
  }
});
```

## 自定义事件

### 1. 组件事件
```javascript
// 组件定义
Component({
  methods: {
    // 触发自定义事件
    triggerCustomEvent: function() {
      this.triggerEvent('customevent', {
        detail: {
          // 事件参数
          value: 'custom value'
        }
      });
    }
  }
});
```

```html
<!-- 组件使用 -->
<custom-component bindcustomevent="handleCustomEvent" />
```

```javascript
// 页面处理
Page({
  handleCustomEvent: function(event) {
    const { value } = event.detail;
    console.log('自定义事件：', value);
  }
});
```

### 2. 事件总线
```javascript
// utils/eventBus.js
const eventBus = {
  events: {},
  
  // 监听事件
  on: function(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  },
  
  // 触发事件
  emit: function(eventName, data) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  },
  
  // 移除事件
  off: function(eventName, callback) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      if (callback) {
        this.events[eventName] = callbacks.filter(cb => cb !== callback);
      } else {
        delete this.events[eventName];
      }
    }
  }
};

export default eventBus;
```

```javascript
// 使用示例
import eventBus from '../../utils/eventBus';

// 监听事件
eventBus.on('customEvent', (data) => {
  console.log('收到事件：', data);
});

// 触发事件
eventBus.emit('customEvent', { value: 'test' });

// 移除事件
eventBus.off('customEvent');
```

## 事件最佳实践

### 1. 事件命名
```javascript
// 推荐的事件命名方式
Page({
  // 点击事件
  handleTap: function() {},
  
  // 输入事件
  handleInput: function() {},
  
  // 提交事件
  handleSubmit: function() {},
  
  // 选择事件
  handleSelect: function() {},
  
  // 状态变化事件
  handleStateChange: function() {}
});
```

### 2. 事件处理优化
```javascript
Page({
  // 使用箭头函数保持 this 指向
  handleTap: () => {
    // 处理逻辑
  },
  
  // 使用 async/await 处理异步
  async handleAsync: async function() {
    try {
      const result = await this.fetchData();
      this.setData({ data: result });
    } catch (error) {
      console.error('处理失败：', error);
    }
  },
  
  // 使用防抖处理频繁事件
  handleFrequent: function() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      // 处理逻辑
    }, 300);
  }
});
```

### 3. 事件解绑
```javascript
Page({
  onLoad: function() {
    // 绑定事件
    this.handleCustomEvent = this.handleCustomEvent.bind(this);
    eventBus.on('customEvent', this.handleCustomEvent);
  },
  
  onUnload: function() {
    // 解绑事件
    eventBus.off('customEvent', this.handleCustomEvent);
  }
});
```

## 常见问题

### 1. 事件冒泡
- 使用 `catch` 代替 `bind` 阻止事件冒泡
- 注意事件传播顺序：捕获 -> 目标 -> 冒泡
- 合理使用 `mut-bind` 处理互斥事件

### 2. 事件性能
- 避免频繁触发的事件处理
- 使用防抖和节流优化
- 及时解绑不需要的事件监听

### 3. 事件调试
```javascript
// 事件调试工具
const eventDebug = {
  log: function(event) {
    console.log('事件信息：', {
      type: event.type,
      target: event.target,
      currentTarget: event.currentTarget,
      detail: event.detail,
      timeStamp: event.timeStamp
    });
  }
};

// 使用示例
Page({
  handleTap: function(event) {
    eventDebug.log(event);
    // 处理逻辑
  }
});
```

## 相关资源

1. [官方文档 - 事件系统](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)
2. [官方文档 - 事件对象](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html#%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1)
3. [官方文档 - 事件绑定](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html#%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)
4. [官方文档 - 自定义组件事件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) 