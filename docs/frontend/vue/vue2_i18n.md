# Vue 2 国际化实现

## 1. Vue I18n 基础配置

### 1.1 安装与配置

```javascript
// main.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

new Vue({
  i18n,
  // ... 其他配置
}).$mount('#app')
```

### 1.2 语言包配置

```javascript
// locales/zh-CN.js
export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
    reset: '重置'
  },
  menu: {
    home: '首页',
    about: '关于',
    user: '用户管理'
  },
  user: {
    username: '用户名',
    password: '密码',
    login: '登录',
    logout: '退出登录'
  }
}

// locales/en-US.js
export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    reset: 'Reset'
  },
  menu: {
    home: 'Home',
    about: 'About',
    user: 'User Management'
  },
  user: {
    username: 'Username',
    password: 'Password',
    login: 'Login',
    logout: 'Logout'
  }
}
```

## 2. 基础使用

### 2.1 模板中使用

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <h1>{{ $t('menu.home') }}</h1>
    
    <!-- 带参数的翻译 -->
    <p>{{ $t('welcome', { name: username }) }}</p>
    
    <!-- 复数形式 -->
    <p>{{ $tc('items', count) }}</p>
    
    <!-- 日期格式化 -->
    <p>{{ $d(new Date(), 'long') }}</p>
    
    <!-- 数字格式化 -->
    <p>{{ $n(1000, 'currency') }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: 'John',
      count: 2
    }
  }
}
</script>
```

### 2.2 JavaScript 中使用

```javascript
// 在组件中使用
export default {
  methods: {
    showMessage() {
      this.$t('message.hello')
    }
  }
}

// 在 JS 文件中使用
import i18n from '@/i18n'

i18n.t('message.hello')
```

## 3. 高级特性

### 3.1 动态切换语言

```javascript
// store/modules/app.js
const state = {
  language: localStorage.getItem('language') || 'zh-CN'
}

const mutations = {
  SET_LANGUAGE(state, language) {
    state.language = language
    localStorage.setItem('language', language)
  }
}

const actions = {
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
    i18n.locale = language
  }
}

// 语言切换组件
<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      {{ currentLanguage }}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="lang in languages"
        :key="lang.value"
        :command="lang.value"
      >
        {{ lang.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      languages: [
        { label: '简体中文', value: 'zh-CN' },
        { label: 'English', value: 'en-US' }
      ]
    }
  },
  computed: {
    currentLanguage() {
      return this.languages.find(lang => lang.value === this.$i18n.locale).label
    }
  },
  methods: {
    handleCommand(lang) {
      this.$store.dispatch('app/setLanguage', lang)
    }
  }
}
</script>
```

### 3.2 语言包懒加载

```javascript
// i18n/index.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': require('./locales/zh-CN').default
  }
})

// 异步加载语言包
export async function loadLanguageAsync(lang) {
  if (i18n.locale === lang) {
    return Promise.resolve()
  }
  
  const messages = await import(`./locales/${lang}.js`)
  i18n.setLocaleMessage(lang, messages.default)
  i18n.locale = lang
  return Promise.resolve()
}

export default i18n
```

### 3.3 日期时间本地化

```javascript
// i18n/index.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': require('./locales/zh-CN').default,
    'en-US': require('./locales/en-US').default
  },
  datetimeFormats: {
    'zh-CN': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
})

// 监听语言变化
i18n.watchLocale = () => {
  dayjs.locale(i18n.locale)
}

export default i18n
```

## 4. 最佳实践

### 4.1 语言包组织

```javascript
// locales/zh-CN/index.js
import common from './common'
import menu from './menu'
import user from './user'
import validation from './validation'

export default {
  common,
  menu,
  user,
  validation
}

// locales/zh-CN/common.js
export default {
  confirm: '确认',
  cancel: '取消',
  save: '保存',
  delete: '删除',
  edit: '编辑',
  search: '搜索',
  reset: '重置'
}
```

### 4.2 组件国际化

```vue
<!-- components/LanguageSwitch.vue -->
<template>
  <div class="language-switch">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ currentLanguage }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="lang in languages"
          :key="lang.value"
          :command="lang.value"
        >
          {{ lang.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitch',
  
  data() {
    return {
      languages: [
        { label: '简体中文', value: 'zh-CN' },
        { label: 'English', value: 'en-US' }
      ]
    }
  },
  
  computed: {
    currentLanguage() {
      return this.languages.find(lang => lang.value === this.$i18n.locale).label
    }
  },
  
  methods: {
    handleCommand(lang) {
      this.$store.dispatch('app/setLanguage', lang)
    }
  }
}
</script>

<style lang="scss" scoped>
.language-switch {
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
}
</style>
```

### 4.3 路由国际化

```javascript
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '@/i18n'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: 'menu.home'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: 'menu.about'
    }
  }
]

const router = new VueRouter({
  routes
})

// 路由标题国际化
router.beforeEach((to, from, next) => {
  document.title = i18n.t(to.meta.title)
  next()
})

export default router
```

## 5. 常见问题解决方案

### 5.1 动态加载语言包

```javascript
// i18n/index.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {}
})

// 动态加载语言包
export async function loadLanguageAsync(lang) {
  if (i18n.locale === lang) {
    return Promise.resolve()
  }
  
  try {
    const messages = await import(`./locales/${lang}.js`)
    i18n.setLocaleMessage(lang, messages.default)
    i18n.locale = lang
    return Promise.resolve()
  } catch (error) {
    console.error('加载语言包失败：', error)
    return Promise.reject(error)
  }
}

export default i18n
```

### 5.2 处理缺失翻译

```javascript
// i18n/index.js
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': require('./locales/zh-CN').default,
    'en-US': require('./locales/en-US').default
  },
  silentTranslationWarn: process.env.NODE_ENV === 'production',
  missing: (locale, key) => {
    console.warn(`Missing translation: ${locale}.${key}`)
    return key
  }
})
```

### 5.3 数字格式化

```javascript
// i18n/index.js
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': require('./locales/zh-CN').default,
    'en-US': require('./locales/en-US').default
  },
  numberFormats: {
    'zh-CN': {
      currency: {
        style: 'currency',
        currency: 'CNY'
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 2
      }
    },
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD'
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 2
      }
    }
  }
})
```

## 6. 相关资源

- [Vue I18n 官方文档](https://kazupon.github.io/vue-i18n/zh/)
- [Vue I18n 风格指南](https://kazupon.github.io/vue-i18n/zh/guide/formatting.html)
- [Vue I18n 最佳实践](https://kazupon.github.io/vue-i18n/zh/guide/fallback.html) 