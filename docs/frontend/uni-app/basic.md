# uni-app 基础教程

## 环境搭建

### 开发工具选择

1. **HBuilderX（推荐）**
   - 下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
   - 内置终端、调试器、打包工具
   - 支持可视化界面配置
   - 内置 uni-app 模板

2. **VS Code**
   - 安装 [uni-app 插件](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-app-snippets)
   - 配置开发环境
   - 使用命令行工具

### 项目创建

1. **使用 HBuilderX 创建**
   ```bash
   # 通过可视化界面创建
   文件 -> 新建 -> 项目 -> uni-app
   ```

2. **使用命令行创建**
   ```bash
   # 全局安装 vue-cli
   npm install -g @vue/cli
   
   # 创建 uni-app 项目
   vue create -p dcloudio/uni-preset-vue my-project
   ```

3. **项目模板选择**
   - 默认模板（Vue2）
   - Vue3 模板
   - TypeScript 模板
   - 其他模板

## 项目结构

```
├── src
│   ├── pages            // 页面文件夹
│   ├── static          // 静态资源
│   ├── components      // 组件文件夹
│   ├── store           // Vuex 状态管理
│   ├── utils           // 工具函数
│   ├── App.vue         // 应用配置
│   ├── main.js         // 入口文件
│   ├── manifest.json   // 配置文件
│   └── pages.json      // 页面配置
├── package.json        // 项目依赖
└── README.md          // 项目说明
```

## 基础语法

### 页面结构

```vue
<template>
  <view class="container">
    <!-- 页面内容 -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 数据
    }
  },
  methods: {
    // 方法
  }
}
</script>

<style>
.container {
  /* 样式 */
}
</style>
```

### 数据绑定

1. **文本绑定**
   ```vue
   <template>
     <view>{{ message }}</view>
   </template>
   
   <script>
   export default {
     data() {
       return {
         message: 'Hello uni-app'
       }
     }
   }
   </script>
   ```

2. **属性绑定**
   ```vue
   <template>
     <image :src="imageUrl"></image>
   </template>
   ```

3. **条件渲染**
   ```vue
   <template>
     <view v-if="show">条件渲染内容</view>
     <view v-else>其他内容</view>
   </template>
   ```

4. **列表渲染**
   ```vue
   <template>
     <view v-for="(item, index) in list" :key="index">
       {{ item.name }}
     </view>
   </template>
   ```

### 事件处理

1. **基础事件**
   ```vue
   <template>
     <button @click="handleClick">点击事件</button>
   </template>
   
   <script>
   export default {
     methods: {
       handleClick() {
         console.log('按钮被点击')
       }
     }
   }
   </script>
   ```

2. **事件传参**
   ```vue
   <template>
     <button @click="handleClick(item)">点击事件</button>
   </template>
   ```

3. **事件修饰符**
   ```vue
   <template>
     <view @click.stop="handleClick">阻止事件冒泡</view>
     <view @click.prevent="handleClick">阻止默认行为</view>
   </template>
   ```

## 组件使用

### 内置组件

1. **视图容器**
   ```vue
   <template>
     <view>视图容器</view>
     <scroll-view>可滚动视图</scroll-view>
     <swiper>轮播图</swiper>
   </template>
   ```

2. **基础内容**
   ```vue
   <template>
     <text>文本</text>
     <rich-text>富文本</rich-text>
     <progress>进度条</progress>
   </template>
   ```

3. **表单组件**
   ```vue
   <template>
     <button>按钮</button>
     <input type="text" v-model="inputValue" />
     <checkbox>复选框</checkbox>
     <radio>单选框</radio>
   </template>
   ```

### 自定义组件

1. **组件创建**
   ```vue
   <!-- components/my-component.vue -->
   <template>
     <view class="my-component">
       <slot></slot>
     </view>
   </template>
   
   <script>
   export default {
     name: 'MyComponent',
     props: {
       title: String
     }
   }
   </script>
   ```

2. **组件使用**
   ```vue
   <template>
     <my-component title="标题">
       组件内容
     </my-component>
   </template>
   
   <script>
   import MyComponent from '@/components/my-component.vue'
   
   export default {
     components: {
       MyComponent
     }
   }
   </script>
   ```

## 页面路由

### 页面配置

```json
// pages.json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  }
}
```

### 页面跳转

1. **声明式导航**
   ```vue
   <template>
     <navigator url="/pages/detail/detail">跳转到详情页</navigator>
   </template>
   ```

2. **编程式导航**
   ```js
   // 页面跳转
   uni.navigateTo({
     url: '/pages/detail/detail'
   })
   
   // 页面返回
   uni.navigateBack()
   
   // 重定向
   uni.redirectTo({
     url: '/pages/detail/detail'
   })
   ```

## 数据存储

### 本地存储

```js
// 存储数据
uni.setStorage({
  key: 'key',
  data: 'value'
})

// 获取数据
uni.getStorage({
  key: 'key',
  success: (res) => {
    console.log(res.data)
  }
})

// 移除数据
uni.removeStorage({
  key: 'key'
})
```

### 全局数据

```js
// main.js
Vue.prototype.$globalData = {
  userInfo: null
}

// 页面中使用
this.$globalData.userInfo = { name: 'test' }
```

## 网络请求

### 基础请求

```js
// 发起请求
uni.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    id: 1
  },
  success: (res) => {
    console.log(res.data)
  },
  fail: (err) => {
    console.error(err)
  }
})
```

### 请求封装

```js
// utils/request.js
const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}

export default request
```

## 生命周期

### 应用生命周期

```js
// App.vue
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
```

### 页面生命周期

```js
export default {
  onLoad: function(options) {
    console.log('页面加载')
  },
  onShow: function() {
    console.log('页面显示')
  },
  onReady: function() {
    console.log('页面就绪')
  },
  onHide: function() {
    console.log('页面隐藏')
  },
  onUnload: function() {
    console.log('页面卸载')
  }
}
```

## 开发技巧

1. **条件编译**
   ```vue
   <template>
     <!-- #ifdef H5 -->
     <view>H5 平台特有内容</view>
     <!-- #endif -->
   </template>
   ```

2. **样式适配**
   ```css
   /* 使用 rpx 单位 */
   .container {
     width: 750rpx;
     padding: 20rpx;
   }
   ```

3. **调试技巧**
   - 使用 `console.log` 输出调试信息
   - 使用 HBuilderX 内置调试器
   - 使用 Vue Devtools 调试

## 注意事项

1. **平台差异**
   - 注意不同平台的 API 差异
   - 使用条件编译处理平台差异
   - 测试不同平台的兼容性

2. **性能优化**
   - 合理使用组件
   - 避免不必要的渲染
   - 优化图片资源

3. **开发规范**
   - 遵循 Vue 规范
   - 使用 ESLint 规范代码
   - 保持代码风格统一 