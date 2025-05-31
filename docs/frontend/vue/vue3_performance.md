 # Vue 3 性能优化

Vue 3 在性能上有诸多提升，支持 Suspense、Teleport、异步组件、Vite 构建优化等。这里对照 Vue2，介绍 Vue3 的性能优化方案。

## 1. 代码分割与懒加载

```js
// 路由懒加载
const routes = [
  {
    path: '/user',
    component: () => import('@/views/user/index.vue')
  }
]
```

## 2. 异步组件

```vue
<script setup>
import { defineAsyncComponent } from 'vue'
const AsyncComp = defineAsyncComponent(() => import('./MyComponent.vue'))
</script>

<template>
  <Suspense>
    <AsyncComp />
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

## 3. Teleport 传送门

```vue
<template>
  <teleport to="body">
    <div class="modal">弹窗内容</div>
  </teleport>
</template>
```

## 4. Vite 构建优化

- 使用 Vite 作为构建工具，支持更快的热更新和打包速度。
- 利用 Vite 插件实现自动按需加载、图片压缩等。

## 5. 图片与资源优化
- 图片懒加载、webp 格式、SVG 优先

## 6. keep-alive 缓存

```vue
<template>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>
```

## 7. 性能分析
- 使用 Chrome DevTools、Vue Devtools、Vite 插件等工具分析性能瓶颈

## 8. 相关资源
- [Vue3 性能优化官方文档](https://cn.vuejs.org/guide/best-practices/performance.html)
- [Vite 官方文档](https://cn.vitejs.dev/)