# Vue 2 性能优化指南

## 1. 首屏加载优化

### 1.1 路由懒加载

```javascript
// router/index.js
const routes = [
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/index.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import(/* webpackChunkName: "order" */ '@/views/order/index.vue')
  }
]
```

### 1.2 组件按需加载

```javascript
// 全局组件按需注册
import { Button, Select, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Select)
Vue.prototype.$message = Message

// 局部组件按需引入
export default {
  components: {
    BaseButton: () => import('@/components/base/BaseButton.vue'),
    BaseTable: () => import('@/components/base/BaseTable.vue')
  }
}
```

### 1.3 预加载关键资源

```html
<!-- index.html -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="logo.png" as="image">
```

## 2. 路由优化

### 2.1 路由懒加载分组

```javascript
// router/index.js
const routes = [
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/index.vue'),
    children: [
      {
        path: 'profile',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/profile.vue')
      },
      {
        path: 'settings',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/settings.vue')
      }
    ]
  }
]
```

### 2.2 路由缓存

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <keep-alive :include="cachedViews">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>
```

## 3. 组件优化

### 3.1 组件缓存

```vue
<!-- 使用 keep-alive 缓存组件 -->
<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: 'ComponentA'
    }
  }
}
</script>
```

### 3.2 异步组件

```javascript
// 异步组件工厂函数
const AsyncComponent = () => ({
  component: import('./MyComponent.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000
})

export default {
  components: {
    AsyncComponent
  }
}
```

### 3.3 组件复用

```vue
<!-- 使用 mixin 复用组件逻辑 -->
<script>
const myMixin = {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        // 获取数据
      } finally {
        this.loading = false
      }
    }
  }
}

export default {
  mixins: [myMixin]
}
</script>
```

## 4. 图片资源优化

### 4.1 图片懒加载

```vue
<!-- 使用 v-lazy 指令 -->
<template>
  <div>
    <img v-lazy="imageUrl" alt="image">
  </div>
</template>

<script>
export default {
  directives: {
    lazy: {
      inserted: el => {
        function loadImage() {
          const imageElement = Array.from(el.children).find(
            el => el.nodeName === 'IMG'
          )
          if (imageElement) {
            imageElement.addEventListener('load', () => {
              setTimeout(() => el.classList.add('loaded'), 100)
            })
            imageElement.addEventListener('error', () => console.log('error'))
            imageElement.src = imageElement.dataset.url
          }
        }
        function handleIntersect(entries, observer) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadImage()
              observer.unobserve(el)
            }
          })
        }
        function createObserver() {
          const options = {
            root: null,
            threshold: 0
          }
          const observer = new IntersectionObserver(handleIntersect, options)
          observer.observe(el)
        }
        if (window['IntersectionObserver']) {
          createObserver()
        } else {
          loadImage()
        }
      }
    }
  }
}
</script>
```

### 4.2 图片压缩

```javascript
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  }
}
```

### 4.3 图片格式优化

```html
<!-- 使用 webp 格式 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="image">
</picture>
```

## 5. 缓存策略

### 5.1 浏览器缓存

```javascript
// 设置缓存头
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}))
```

### 5.2 数据缓存

```javascript
// 使用 localStorage 缓存数据
const cache = {
  set(key, value, expire) {
    const data = {
      value,
      expire: expire ? Date.now() + expire : null
    }
    localStorage.setItem(key, JSON.stringify(data))
  },
  get(key) {
    const data = JSON.parse(localStorage.getItem(key))
    if (data) {
      if (data.expire && data.expire < Date.now()) {
        localStorage.removeItem(key)
        return null
      }
      return data.value
    }
    return null
  }
}
```

### 5.3 API 缓存

```javascript
// 使用 axios 拦截器实现 API 缓存
import axios from 'axios'

const cache = new Map()

axios.interceptors.request.use(config => {
  if (config.method === 'get') {
    const key = `${config.url}${JSON.stringify(config.params)}`
    if (cache.has(key)) {
      return Promise.reject({
        __CACHE__: true,
        data: cache.get(key)
      })
    }
  }
  return config
})

axios.interceptors.response.use(
  response => {
    if (response.config.method === 'get') {
      const key = `${response.config.url}${JSON.stringify(response.config.params)}`
      cache.set(key, response.data)
    }
    return response
  },
  error => {
    if (error.__CACHE__) {
      return Promise.resolve(error)
    }
    return Promise.reject(error)
  }
)
```

## 6. 构建优化

### 6.1 代码分割

```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}
```

### 6.2 压缩优化

```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }
}
```

### 6.3 资源优化

```javascript
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // 图片压缩
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
    
    // CSS 提取
    config.plugin('extract-css').tap(() => [{
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css'
    }])
  }
}
```

## 7. 监控与分析

### 7.1 性能监控

```javascript
// 使用 Performance API 监控性能
const performance = {
  getTiming() {
    const timing = performance.timing
    return {
      // DNS 解析时间
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      // TCP 连接时间
      tcp: timing.connectEnd - timing.connectStart,
      // 请求时间
      request: timing.responseEnd - timing.requestStart,
      // DOM 解析时间
      dom: timing.domComplete - timing.domInteractive,
      // 页面加载时间
      load: timing.loadEventEnd - timing.navigationStart
    }
  }
}
```

### 7.2 错误监控

```javascript
// 全局错误监控
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', {
    message,
    source,
    lineno,
    colno,
    error
  })
}

// Vue 错误监控
Vue.config.errorHandler = function(err, vm, info) {
  console.error('Vue error:', {
    error: err,
    component: vm,
    info
  })
}
```

## 8. 相关资源

- [Vue 性能优化指南](https://cn.vuejs.org/v2/guide/performance.html)
- [Webpack 性能优化](https://webpack.js.org/guides/build-performance/)
- [Chrome DevTools 性能分析](https://developers.google.com/web/tools/chrome-devtools/performance)
- [Lighthouse 性能评分](https://developers.google.com/web/tools/lighthouse) 