# Vue 3 组件库使用

Vue 3 推荐使用 Element Plus、Ant Design Vue、Naive UI 等现代组件库。这里对照 Vue2，介绍 Vue3 下的组件库集成与用法。

## 1. 安装组件库

### 1.1 Element Plus
```bash
npm install element-plus
```

### 1.2 Ant Design Vue
```bash
npm install ant-design-vue
```

## 2. 全局引入

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

## 3. 按需引入

推荐使用 unplugin-vue-components 自动按需引入：

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

```js
// vite.config.js
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
}
```

## 4. 常用组件示例

```vue
<script setup>
import { ref } from 'vue'
const dialogVisible = ref(false)
</script>

<template>
  <el-button @click="dialogVisible = true">打开弹窗</el-button>
  <el-dialog v-model="dialogVisible" title="标题">
    <span>内容</span>
  </el-dialog>
</template>
```

## 5. 其他主流组件库
- [Naive UI](https://www.naiveui.com/zh-CN/os-theme)
- [Vant 4](https://vant-ui.github.io/vant/#/zh-CN/)

## 6. 相关资源
- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [Ant Design Vue 官方文档](https://www.antdv.com/docs/vue/introduce-cn/)