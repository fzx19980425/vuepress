# Vue 2 常用功能点

## 1. 模板语法

### 1.1 条件渲染

```vue
<template>
  <div>
    <!-- v-if 条件渲染 -->
    <div v-if="isShow">显示内容</div>
    <div v-else-if="type === 'A'">A类型</div>
    <div v-else>其他内容</div>

    <!-- v-show 条件显示 -->
    <div v-show="isShow">显示内容</div>

    <!-- 多条件判断 -->
    <div v-if="status === 'success'">成功</div>
    <div v-else-if="status === 'error'">错误</div>
    <div v-else>加载中</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      type: 'A',
      status: 'success'
    }
  }
}
</script>
```

### 1.2 列表渲染

```vue
<template>
  <div>
    <!-- 基础列表渲染 -->
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        {{ item.name }} - {{ index }}
      </li>
    </ul>

    <!-- 对象属性遍历 -->
    <div v-for="(value, key) in object" :key="key">
      {{ key }}: {{ value }}
    </div>

    <!-- 带过滤的列表 -->
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>

    <!-- 带排序的列表 -->
    <ul>
      <li v-for="item in sortedItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: '项目1' },
        { id: 2, name: '项目2' }
      ],
      object: {
        name: '张三',
        age: 25
      }
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item.name.includes('项目'))
    },
    sortedItems() {
      return [...this.items].sort((a, b) => a.name.localeCompare(b.name))
    }
  }
}
</script>
```

### 1.3 事件处理

```vue
<template>
  <div>
    <!-- 基础事件绑定 -->
    <button @click="handleClick">点击</button>

    <!-- 事件修饰符 -->
    <button @click.stop="handleClick">阻止冒泡</button>
    <button @click.prevent="handleClick">阻止默认行为</button>
    <button @click.once="handleClick">只触发一次</button>
    <button @click.self="handleClick">只在自身触发</button>

    <!-- 按键修饰符 -->
    <input @keyup.enter="handleEnter">
    <input @keyup.esc="handleEsc">
    <input @keyup.space="handleSpace">

    <!-- 系统修饰符 -->
    <button @click.ctrl="handleClick">Ctrl + 点击</button>
    <button @click.shift="handleClick">Shift + 点击</button>
    <button @click.alt="handleClick">Alt + 点击</button>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(event) {
      console.log('点击事件', event)
    },
    handleEnter() {
      console.log('回车键')
    },
    handleEsc() {
      console.log('ESC键')
    },
    handleSpace() {
      console.log('空格键')
    }
  }
}
</script>
```

## 2. 表单处理

### 2.1 基础表单

```vue
<template>
  <div>
    <!-- 文本输入 -->
    <input v-model="message" placeholder="请输入">
    <p>输入内容: {{ message }}</p>

    <!-- 多行文本 -->
    <textarea v-model="message" placeholder="请输入多行文本"></textarea>

    <!-- 复选框 -->
    <input type="checkbox" v-model="checked">
    <p>选中状态: {{ checked }}</p>

    <!-- 多个复选框 -->
    <div>
      <input type="checkbox" value="A" v-model="checkedNames">
      <input type="checkbox" value="B" v-model="checkedNames">
      <input type="checkbox" value="C" v-model="checkedNames">
      <p>选中的值: {{ checkedNames }}</p>
    </div>

    <!-- 单选按钮 -->
    <div>
      <input type="radio" value="A" v-model="picked">
      <input type="radio" value="B" v-model="picked">
      <p>选中的值: {{ picked }}</p>
    </div>

    <!-- 下拉选择 -->
    <select v-model="selected">
      <option value="">请选择</option>
      <option value="A">选项A</option>
      <option value="B">选项B</option>
    </select>
    <p>选中的值: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      checkedNames: [],
      picked: '',
      selected: ''
    }
  }
}
</script>
```

### 2.2 表单验证

```vue
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <!-- 用户名 -->
      <div>
        <input 
          v-model="form.username"
          :class="{ error: errors.username }"
          @blur="validateField('username')"
        >
        <span class="error-message">{{ errors.username }}</span>
      </div>

      <!-- 密码 -->
      <div>
        <input 
          type="password"
          v-model="form.password"
          :class="{ error: errors.password }"
          @blur="validateField('password')"
        >
        <span class="error-message">{{ errors.password }}</span>
      </div>

      <!-- 提交按钮 -->
      <button type="submit" :disabled="!isValid">提交</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      errors: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    isValid() {
      return !this.errors.username && !this.errors.password
    }
  },
  methods: {
    validateField(field) {
      this.errors[field] = ''
      
      switch (field) {
        case 'username':
          if (!this.form.username) {
            this.errors.username = '用户名不能为空'
          } else if (this.form.username.length < 3) {
            this.errors.username = '用户名至少3个字符'
          }
          break
        case 'password':
          if (!this.form.password) {
            this.errors.password = '密码不能为空'
          } else if (this.form.password.length < 6) {
            this.errors.password = '密码至少6个字符'
          }
          break
      }
    },
    handleSubmit() {
      // 验证所有字段
      Object.keys(this.form).forEach(field => {
        this.validateField(field)
      })

      if (this.isValid) {
        // 提交表单
        console.log('表单提交', this.form)
      }
    }
  }
}
</script>

<style>
.error {
  border-color: red;
}
.error-message {
  color: red;
  font-size: 12px;
}
</style>
```

## 3. 组件通信

### 3.1 父子组件通信

```vue
<!-- 父组件 -->
<template>
  <div>
    <child-component
      :message="parentMessage"
      :user="user"
      @update="handleUpdate"
      @delete="handleDelete"
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
      parentMessage: 'Hello from parent',
      user: {
        name: '张三',
        age: 25
      }
    }
  },
  methods: {
    handleUpdate(newValue) {
      console.log('Received update:', newValue)
    },
    handleDelete(id) {
      console.log('Delete item:', id)
    }
  }
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ user.name }} - {{ user.age }}</p>
    <button @click="updateParent">更新父组件</button>
    <button @click="deleteItem">删除项目</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      required: true,
      validator(value) {
        return value.name && value.age
      }
    }
  },
  methods: {
    updateParent() {
      this.$emit('update', 'New value from child')
    },
    deleteItem() {
      this.$emit('delete', 1)
    }
  }
}
</script>
```

### 3.2 兄弟组件通信

```javascript
// eventBus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 组件A
export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message', 'Hello from A')
    }
  }
}

// 组件B
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

### 3.3 跨级组件通信

```vue
<!-- 父组件 -->
<template>
  <div>
    <parent-component>
      <child-component>
        <grand-child-component></grand-child-component>
      </child-component>
    </parent-component>
  </div>
</template>

<script>
// 使用 provide/inject
export default {
  provide() {
    return {
      theme: this.theme,
      updateTheme: this.updateTheme
    }
  },
  data() {
    return {
      theme: 'light'
    }
  },
  methods: {
    updateTheme(theme) {
      this.theme = theme
    }
  }
}
</script>

<!-- 孙组件 -->
<script>
export default {
  inject: ['theme', 'updateTheme'],
  methods: {
    changeTheme() {
      this.updateTheme('dark')
    }
  }
}
</script>
```

## 4. 路由管理

### 4.1 基础路由

```javascript
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

### 4.2 路由导航

```vue
<template>
  <div>
    <!-- 声明式导航 -->
    <router-link to="/">首页</router-link>
    <router-link :to="{ name: 'User', params: { id: 1 }}">用户</router-link>

    <!-- 编程式导航 -->
    <button @click="goToHome">去首页</button>
    <button @click="goToUser">去用户页</button>
    <button @click="goBack">返回</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$router.push('/')
    },
    goToUser() {
      this.$router.push({
        name: 'User',
        params: { id: 1 }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
```

### 4.3 路由守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 组件内守卫
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被验证前调用
    next()
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    next()
  }
}
```

## 5. 状态管理

### 5.1 Vuex 基础

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

### 5.2 模块化管理

```javascript
// store/modules/user.js
export default {
  namespaced: true,
  state: {
    user: null,
    token: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const { user, token } = await api.login(credentials)
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
    },
    logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    }
  },
  getters: {
    isLoggedIn: state => !!state.token
  }
}

// store/index.js
import user from './modules/user'

export default new Vuex.Store({
  modules: {
    user
  }
})
```

### 5.3 在组件中使用

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
    <button @click="fetchUser">获取用户</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount'])
  },
  methods: {
    ...mapActions(['increment', 'fetchUser'])
  }
}
</script>
```

## 6. 常用工具函数

### 6.1 防抖和节流

```javascript
// utils/debounce.js
export function debounce(func, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

// utils/throttle.js
export function throttle(func, wait) {
  let lastCall = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastCall >= wait) {
      func.apply(this, args)
      lastCall = now
    }
  }
}

// 使用示例
import { debounce, throttle } from '@/utils'

export default {
  created() {
    this.debouncedSearch = debounce(this.search, 300)
    this.throttledScroll = throttle(this.handleScroll, 200)
  },
  methods: {
    search(query) {
      // 搜索逻辑
    },
    handleScroll() {
      // 滚动处理逻辑
    }
  }
}
```

### 6.2 日期格式化

```javascript
// utils/date.js
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 使用示例
import { formatDate } from '@/utils/date'

export default {
  methods: {
    formatDateTime(date) {
      return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
    }
  }
}
```

### 6.3 数据验证

```javascript
// utils/validator.js
export const validator = {
  isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },
  isPhone(value) {
    return /^1[3-9]\d{9}$/.test(value)
  },
  isURL(value) {
    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)
  },
  isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value)
  }
}

// 使用示例
import { validator } from '@/utils/validator'

export default {
  methods: {
    validateForm() {
      if (!validator.isEmail(this.email)) {
        this.errors.email = '邮箱格式不正确'
      }
      if (!validator.isPhone(this.phone)) {
        this.errors.phone = '手机号格式不正确'
      }
    }
  }
}
```

## 7. 相关资源

- [Vue 2 官方文档](https://v2.vuejs.org/)
- [Vue 2 风格指南](https://v2.vuejs.org/v2/style-guide/)
- [Vue 2 性能优化指南](https://v2.vuejs.org/v2/guide/performance.html)
- [Vue 2 迁移到 Vue 3 指南](https://v3-migration.vuejs.org/)
- [Vue 2 最佳实践](https://v2.vuejs.org/v2/guide/best-practices.html)