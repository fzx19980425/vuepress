# Vue 2 核心概念

Vue 2 是一个流行的前端框架，提供了响应式数据绑定和组件化开发的能力。本章节将介绍 Vue 2 的核心概念和基础用法。

## 1. 基础概念

### 1.1 响应式系统

#### 数据响应式

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

#### 计算属性

```vue
<template>
  <div>
    <p>Full Name: {{ fullName }}</p>
    <input v-model="firstName" placeholder="First Name">
    <input v-model="lastName" placeholder="Last Name">
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: ''
    }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    }
  }
}
</script>
```

#### 监听器

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newValue, oldValue) {
      console.log(`count从${oldValue}变为${newValue}`)
    }
  }
}
</script>
```

### 1.2 生命周期钩子

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello'
    }
  },
  created() {
    console.log('实例创建完成')
  },
  mounted() {
    console.log('挂载完成')
  },
  beforeDestroy() {
    console.log('销毁之前')
  }
}
</script>
```

### 1.3 组件通信

#### Props 和 Events

```vue
<!-- 父组件 -->
<template>
  <div>
    <child-component :message="parentMessage" @update="handleUpdate" />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue'
export default {
  components: { ChildComponent },
  data() {
    return { parentMessage: 'Hello from parent' }
  },
  methods: {
    handleUpdate(newValue) {
      console.log('Received update:', newValue)
    }
  }
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="updateParent">Update Parent</button>
  </div>
</template>

<script>
export default {
  props: { message: { type: String, required: true } },
  methods: {
    updateParent() {
      this.$emit('update', 'New value from child')
    }
  }
}
</script>
```

## 2. 高级特性

### 2.1 自定义指令

```javascript
// 全局指令
Vue.directive('focus', { inserted(el) { el.focus() } })
// 使用
// <input v-focus>
```

### 2.2 过滤器

```javascript
// 全局过滤器
Vue.filter('currency', function(value) { return '$' + value.toFixed(2) })
// 使用
// <p>{{ price | currency }}</p>
```

## 3. 性能优化

### 3.1 计算属性缓存

```vue
<script>
export default {
  data() {
    return { list: [/* 大量数据 */], searchQuery: '' }
  },
  computed: {
    filteredList() {
      if (!this.searchQuery) return this.list
      return this.list.filter(item => item.name.includes(this.searchQuery))
    }
  }
}
</script>
```

### 3.2 异步组件

```javascript
const routes = [ { path: '/about', component: () => import('./About.vue') } ]
```

## 4. Vue 2 vs Vue 3 对比

### 4.1 响应式系统

```javascript
// Vue 2
export default { data() { return { count: 0 } } }
// Vue 3
import { ref } from 'vue'
const count = ref(0)
```

### 4.2 生命周期钩子

```javascript
// Vue 2
export default { created() {}, mounted() {}, beforeDestroy() {} }
// Vue 3
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {})
onUnmounted(() => {})
```

## 5. 最佳实践

### 5.1 组件设计

```vue
<template>
  <button class="base-button" :class="[type, size]" :disabled="disabled" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: { type: { type: String, default: 'default' }, size: { type: String, default: 'medium' }, disabled: { type: Boolean, default: false } },
  methods: { handleClick(event) { this.$emit('click', event) } }
}
</script>
```

### 5.2 状态管理

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: { count: 0, user: null },
  mutations: { INCREMENT(state) { state.count++ }, SET_USER(state, user) { state.user = user } },
  actions: { increment({ commit }) { commit('INCREMENT') }, async fetchUser({ commit }) { const user = await api.getUser(); commit('SET_USER', user) } },
  getters: { doubleCount: state => state.count * 2, isLoggedIn: state => !!state.user }
})
```

## 6. 相关资源

- [Vue 2 官方文档](https://v2.vuejs.org/)
- [Vue 2 风格指南](https://v2.vuejs.org/v2/style-guide/)
- [Vue 2 性能优化指南](https://v2.vuejs.org/v2/guide/performance.html)
- [Vue 2 迁移到 Vue 3 指南](https://v3-migration.vuejs.org/)
- [Vue 2 最佳实践](https://v2.vuejs.org/v2/guide/best-practices.html)
