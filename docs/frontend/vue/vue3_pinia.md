 # Vue 3 状态管理（Pinia）

Vue 3 推荐使用 Pinia 作为状态管理库。这里对照 Vue2 的 Vuex，介绍 Pinia 的用法。

## 1. 安装 Pinia

```bash
npm install pinia
```

## 2. 配置 Pinia

```js
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

## 3. 定义 Store

```js
// src/store/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ name: '', isLoggedIn: false }),
  actions: {
    login(name) {
      this.name = name
      this.isLoggedIn = true
    }
  }
})
```

## 4. 组件中使用

```vue
<script setup>
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
userStore.login('张三')
</script>
```

## 5. 相关资源
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)