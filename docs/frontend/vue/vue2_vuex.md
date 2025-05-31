# Vue 2 Vuex 状态管理

## 1. Vuex 基础

### 1.1 基本配置

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
  getters: {
    doubleCount: state => state.count * 2,
    isLoggedIn: state => !!state.user
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
    async login({ commit }, credentials) {
      const user = await api.login(credentials)
      commit('SET_USER', user)
    }
  }
})
```

### 1.2 核心概念

#### State
```javascript
// 在组件中访问 state
export default {
  computed: {
    count() {
      return this.$store.state.count
    },
    user() {
      return this.$store.state.user
    }
  }
}
```

#### Getters
```javascript
// store/getters.js
export default {
  // 基础 getter
  doubleCount: state => state.count * 2,
  
  // 带参数的 getter
  getTodoById: state => id => {
    return state.todos.find(todo => todo.id === id)
  },
  
  // 使用其他 getter
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

#### Mutations
```javascript
// store/mutations.js
export default {
  // 基础 mutation
  INCREMENT(state) {
    state.count++
  },
  
  // 带参数的 mutation
  SET_USER(state, user) {
    state.user = user
  },
  
  // 对象风格的 mutation
  UPDATE_USER(state, { id, ...user }) {
    state.users = state.users.map(u => 
      u.id === id ? { ...u, ...user } : u
    )
  }
}
```

#### Actions
```javascript
// store/actions.js
export default {
  // 基础 action
  increment({ commit }) {
    commit('INCREMENT')
  },
  
  // 异步 action
  async fetchUser({ commit }, userId) {
    try {
      const user = await api.getUser(userId)
      commit('SET_USER', user)
    } catch (error) {
      commit('SET_ERROR', error.message)
    }
  },
  
  // 组合 action
  async loginAndFetchUser({ dispatch }, credentials) {
    await dispatch('login', credentials)
    await dispatch('fetchUser', credentials.userId)
  }
}
```

## 2. 模块化管理

### 2.1 模块结构

```javascript
// store/modules/user.js
const state = {
  user: null,
  token: null
}

const getters = {
  isLoggedIn: state => !!state.token
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  }
}

const actions = {
  async login({ commit }, credentials) {
    const { user, token } = await api.login(credentials)
    commit('SET_USER', user)
    commit('SET_TOKEN', token)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

### 2.2 模块注册

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import product from './modules/product'

export default new Vuex.Store({
  modules: {
    user,
    cart,
    product
  }
})
```

### 2.3 命名空间访问

```javascript
// 在组件中使用命名空间
export default {
  computed: {
    // 使用 mapState
    ...mapState('user', {
      user: state => state.user,
      token: state => state.token
    }),
    
    // 使用 mapGetters
    ...mapGetters('user', [
      'isLoggedIn'
    ])
  },
  
  methods: {
    // 使用 mapActions
    ...mapActions('user', [
      'login',
      'logout'
    ]),
    
    // 使用 mapMutations
    ...mapMutations('user', [
      'SET_USER'
    ])
  }
}
```

## 3. 持久化存储

### 3.1 vuex-persistedstate

```javascript
// store/index.js
import createPersistedState from 'vuex-persistedstate'

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      // 存储的 key
      key: 'vuex',
      
      // 存储的位置
      storage: window.localStorage,
      
      // 需要持久化的数据
      paths: [
        'user.token',
        'cart.items'
      ]
    })
  ]
})
```

### 3.2 自定义持久化

```javascript
// store/plugins/persist.js
export default store => {
  // 初始化时从 localStorage 恢复状态
  const savedState = localStorage.getItem('vuex')
  if (savedState) {
    store.replaceState(JSON.parse(savedState))
  }
  
  // 订阅 store 的变化
  store.subscribe((mutation, state) => {
    localStorage.setItem('vuex', JSON.stringify(state))
  })
}
```

## 4. 与组件的高效结合

### 4.1 辅助函数

```javascript
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    // 对象展开运算符
    ...mapState({
      // 箭头函数可使代码更简练
      count: state => state.count,
      
      // 传字符串参数 'count' 等同于 `state => state.count`
      countAlias: 'count',
      
      // 为了能够使用 `this` 获取局部状态，必须使用常规函数
      countPlusLocalState(state) {
        return state.count + this.localCount
      }
    }),
    
    ...mapGetters([
      'doubleCount',
      'isLoggedIn'
    ])
  },
  
  methods: {
    ...mapActions([
      'increment',
      'login'
    ]),
    
    ...mapMutations([
      'INCREMENT',
      'SET_USER'
    ])
  }
}
```

### 4.2 模块化辅助函数

```javascript
export default {
  computed: {
    ...mapState('user', {
      user: state => state.user
    }),
    
    ...mapGetters('cart', [
      'totalAmount',
      'itemCount'
    ])
  },
  
  methods: {
    ...mapActions('user', {
      login: 'login',
      logout: 'logout'
    }),
    
    ...mapMutations('cart', {
      addItem: 'ADD_ITEM',
      removeItem: 'REMOVE_ITEM'
    })
  }
}
```

## 5. 最佳实践

### 5.1 状态设计

```javascript
// 扁平化状态结构
const state = {
  users: {
    byId: {
      1: { id: 1, name: 'John' },
      2: { id: 2, name: 'Jane' }
    },
    allIds: [1, 2]
  },
  
  posts: {
    byId: {
      1: { id: 1, title: 'Post 1', authorId: 1 },
      2: { id: 2, title: 'Post 2', authorId: 2 }
    },
    allIds: [1, 2]
  }
}
```

### 5.2 异步操作处理

```javascript
// store/modules/user.js
const state = {
  user: null,
  loading: false,
  error: null
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchUser({ commit }, userId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const user = await api.getUser(userId)
      commit('SET_USER', user)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}
```

### 5.3 模块间通信

```javascript
// store/modules/cart.js
const actions = {
  async checkout({ commit, dispatch, rootState }) {
    // 访问其他模块的状态
    const { user } = rootState.user
    
    // 调用其他模块的 action
    await dispatch('order/createOrder', {
      items: state.items,
      userId: user.id
    }, { root: true })
  }
}
```

## 6. 常见问题解决方案

### 6.1 状态追踪

```javascript
// store/plugins/logger.js
export default store => {
  store.subscribe((mutation, state) => {
    console.log('mutation', mutation.type)
    console.log('payload', mutation.payload)
    console.log('state', state)
  })
}
```

### 6.2 热重载

```javascript
// store/index.js
export default new Vuex.Store({
  // ... 其他配置
  modules: {
    user,
    cart
  }
})

// 热重载
if (module.hot) {
  module.hot.accept([
    './modules/user',
    './modules/cart'
  ], () => {
    const newUser = require('./modules/user').default
    const newCart = require('./modules/cart').default
    
    store.hotUpdate({
      modules: {
        user: newUser,
        cart: newCart
      }
    })
  })
}
```

### 6.3 严格模式

```javascript
// store/index.js
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  // ... 其他配置
})
```

## 7. 相关资源

- [Vuex 官方文档](https://vuex.vuejs.org/zh/)
- [Vuex 风格指南](https://vuex.vuejs.org/zh/style-guide.html)
- [Vuex 模块化](https://vuex.vuejs.org/zh/guide/modules.html) 