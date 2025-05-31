 # Vue 3 国际化（i18n）

Vue 3 推荐使用 vue-i18n@next 进行国际化。这里对照 Vue2，介绍 Vue3 下的国际化配置与用法。

## 1. 安装 vue-i18n

```bash
npm install vue-i18n@next
```

## 2. 基本配置

```js
// src/i18n.js
import { createI18n } from 'vue-i18n'

const messages = {
  en: { message: { hello: 'hello world' } },
  zh: { message: { hello: '你好，世界' } }
}

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages
})

export default i18n
```

## 3. 在 main.js 中引入

```js
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'

const app = createApp(App)
app.use(i18n)
app.mount('#app')
```

## 4. 组件中使用

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
</script>

<template>
  <div>{{ t('message.hello') }}</div>
  <button @click="locale.value = 'en'">切换英文</button>
  <button @click="locale.value = 'zh'">切换中文</button>
</template>
```

## 5. 相关资源
- [vue-i18n@next 官方文档](https://vue-i18n.intlify.dev/)