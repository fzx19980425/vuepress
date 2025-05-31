 # Vue 3 错误处理

Vue 3 支持全局错误处理、组件错误边界、Sentry 集成等。这里对照 Vue2，介绍 Vue3 的错误处理方案。

## 1. 全局错误处理

```js
// main.js
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue3 Error:', err)
  // 可集成 Sentry 等上报
}
```

## 2. 组件错误边界

```vue
<script setup>
import { onErrorCaptured, ref } from 'vue'
const error = ref(null)
onErrorCaptured((err, instance, info) => {
  error.value = err
  return false // 阻止继续向上传播
})
</script>

<template>
  <div v-if="error">出错了: {{ error.message }}</div>
  <slot v-else></slot>
</template>
```

## 3. API 错误处理

同 Vue2，推荐 axios 拦截器统一处理。

## 4. 表单错误处理

同 Vue2，推荐使用组件库的表单校验。

## 5. 错误日志

推荐集成 Sentry、阿里云前端监控等。

## 6. 相关资源
- [Vue3 错误处理官方文档](https://cn.vuejs.org/guide/best-practices/error-handling.html)
- [Sentry 官方文档](https://docs.sentry.io/platforms/javascript/guides/vue/)