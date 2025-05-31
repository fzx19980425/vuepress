 # Vue 2 进阶与详细参考

> 本文档为 Vue2 详细版，包含所有基础、进阶、最佳实践、丰富代码示例和实际应用场景

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
      count: 0,
      user: {
        name: '张三',
        age: 25
      }
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

#### 响应式原理

```javascript
// Vue 2 的响应式原理
const data = {
  message: 'Hello'
}

// 1. 遍历对象的所有属性
Object.keys(data).forEach(key => {
  let value = data[key]
  
  // 2. 为每个属性创建 getter 和 setter
  Object.defineProperty(data, key, {
    get() {
      console.log('获取属性:', key)
      return value
    },
    set(newValue) {
      console.log('设置属性:', key, newValue)
      value = newValue
      // 3. 触发更新
      updateView()
    }
  })
})

// 4. 数组方法重写
const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
arrayMethods.forEach(method => {
  const original = Array.prototype[method]
  Array.prototype[method] = function(...args) {
    const result = original.apply(this, args)
    // 触发更新
    updateView()
    return result
  }
})
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
    },
    // 带 getter 和 setter 的计算属性
    fullNameWithSetter: {
      get() {
        return `${this.firstName} ${this.lastName}`
      },
      set(newValue) {
        const [first, last] = newValue.split(' ')
        this.firstName = first
        this.lastName = last
      }
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
      count: 0,
      user: {
        name: '张三',
        age: 25
      }
    }
  },
  watch: {
    // 简单监听
    count(newValue, oldValue) {
      console.log(`count从${oldValue}变为${newValue}`)
    },
    // 深度监听
    user: {
      handler(newValue) {
        console.log('user changed:', newValue)
      },
      deep: true
    },
    // 立即执行
    count: {
      handler(newValue) {
        console.log('count changed:', newValue)
      },
      immediate: true
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
  beforeCreate() {
    // 实例创建之前
    console.log('beforeCreate')
  },
  created() {
    // 实例创建完成
    console.log('created')
  },
  beforeMount() {
    // 挂载之前
    console.log('beforeMount')
  },
  mounted() {
    // 挂载完成
    console.log('mounted')
  },
  beforeUpdate() {
    // 更新之前
    console.log('beforeUpdate')
  },
  updated() {
    // 更新完成
    console.log('updated')
  },
  beforeDestroy() {
    // 销毁之前
    console.log('beforeDestroy')
  },
  destroyed() {
    // 销毁完成
    console.log('destroyed')
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
    <child-component
      :message="parentMessage"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  },
  data() {
    return {
      parentMessage: 'Hello from parent'
    }
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
  props: {
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    updateParent() {
      this.$emit('update', 'New value from child')
    }
  }
}
</script>
```

#### Event Bus

```javascript
// eventBus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 组件 A
export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message', 'Hello from A')
    }
  }
}

// 组件 B
export default {
  created() {
    EventBus.$on('message', (message) => {
      console.log('Received:', message)
    })
  },
  beforeDestroy() {
    EventBus.$off('message')
  }
}
```

#### 混入 (Mixins)

```javascript
// mixin.js
export const userMixin = {
  data() {
    return {
      user: null
    }
  },
  methods: {
    fetchUser() {
      // 获取用户数据
    }
  }
}

// 组件
import { userMixin } from './mixin'

export default {
  mixins: [userMixin],
  created() {
    this.fetchUser()
  }
}
```

## 2. 高级特性

### 2.1 自定义指令

```javascript
// 全局指令
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

// 局部指令
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  }
}

// 使用
<input v-focus>
```

### 2.2 过滤器

```javascript
// 全局过滤器
Vue.filter('currency', function(value) {
  return '$' + value.toFixed(2)
})

// 局部过滤器
export default {
  filters: {
    currency(value) {
      return '$' + value.toFixed(2)
    }
  }
}

// 使用
<p>{{ price | currency }}</p>
```

### 2.3 插件

```javascript
// 插件
const MyPlugin = {
  install(Vue, options) {
    // 添加全局方法
    Vue.myGlobalMethod = function() {
      // 逻辑
    }

    // 添加全局指令
    Vue.directive('my-directive', {
      bind(el, binding, vnode, oldVnode) {
        // 逻辑
      }
    })

    // 添加实例方法
    Vue.prototype.$myMethod = function() {
      // 逻辑
    }
  }
}

// 使用插件
Vue.use(MyPlugin)
```

## 3. 性能优化

### 3.1 计算属性缓存

```vue
<script>
export default {
  data() {
    return {
      list: [/* 大量数据 */],
      searchQuery: ''
    }
  },
  computed: {
    filteredList() {
      // 结果会被缓存
      if (!this.searchQuery) return this.list
      return this.list.filter(item => 
        item.name.includes(this.searchQuery)
      )
    }
  }
}
</script>
```

### 3.2 异步组件

```javascript
// 路由配置
const routes = [
  {
    path: '/about',
    component: () => import('./About.vue')
  }
]

// 组件定义
export default {
  components: {
    AsyncComponent: () => import('./AsyncComponent.vue')
  }
}
```

### 3.3 函数式组件

```vue
<template functional>
  <div>
    <p>{{ props.message }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  }
}
</script>
```

## 4. Vue 2 vs Vue 3 对比

### 4.1 响应式系统

```javascript
// Vue 2
export default {
  data() {
    return {
      count: 0
    }
  }
}

// Vue 3
import { ref } from 'vue'
const count = ref(0)
```

### 4.2 生命周期钩子

```javascript
// Vue 2
export default {
  created() {},
  mounted() {},
  beforeDestroy() {}
}

// Vue 3
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {})
onUnmounted(() => {})
```

### 4.3 组件通信

```javascript
// Vue 2
export default {
  props: ['message'],
  methods: {
    update() {
      this.$emit('update')
    }
  }
}

// Vue 3
const props = defineProps(['message'])
const emit = defineEmits(['update'])
function update() {
  emit('update')
}
```

### 4.4 组合式 API vs 选项式 API

```javascript
// Vue 2 选项式 API
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}

// Vue 3 组合式 API
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)
function increment() {
  count.value++
}
```

## 5. 最佳实践

### 5.1 组件设计

```vue
<!-- 基础组件 -->
<template>
  <button
    class="base-button"
    :class="[type, size]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'medium'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>
```

### 5.2 状态管理

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    user: null
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT')
    },
    async fetchUser({ commit }) {
      const user = await api.getUser()
      commit('SET_USER', user)
    }
  },
  getters: {
    doubleCount: state => state.count * 2,
    isLoggedIn: state => !!state.user
  }
})
```

### 5.3 错误处理

```javascript
// 全局错误处理
Vue.config.errorHandler = function(err, vm, info) {
  console.error('Vue Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
}

// 组件错误处理
export default {
  errorCaptured(err, vm, info) {
    console.error('Component Error:', err)
    return false // 阻止错误继续传播
  }
}
```

## 6. 相关资源
- [Vue 2 官方文档](https://v2.vuejs.org/)
- [Vue 2 风格指南](https://v2.vuejs.org/v2/style-guide/)
- [Vue 2 性能优化指南](https://v2.vuejs.org/v2/guide/performance.html)
- [Vue 2 迁移到 Vue 3 指南](https://v3-migration.vuejs.org/)
- [Vue 2 最佳实践](https://v2.vuejs.org/v2/guide/best-practices.html)