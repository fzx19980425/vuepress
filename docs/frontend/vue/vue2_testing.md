# Vue 2 单元测试指南

## 1. 测试环境配置

### 1.1 Jest 配置

```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  transformIgnorePatterns: ['/node_modules/'],
  setupFiles: ['<rootDir>/tests/unit/setup.js']
}
```

### 1.2 测试工具配置

```javascript
// tests/unit/setup.js
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(ElementUI)

// 全局模拟
global.requestAnimationFrame = callback => setTimeout(callback, 0)
global.cancelAnimationFrame = id => clearTimeout(id)
```

## 2. 组件测试

### 2.1 基础组件测试

```javascript
// tests/unit/components/Button.spec.js
import { shallowMount } from '@vue/test-utils'
import Button from '@/components/Button.vue'

describe('Button.vue', () => {
  it('renders props.text when passed', () => {
    const text = 'Click me'
    const wrapper = shallowMount(Button, {
      propsData: { text }
    })
    expect(wrapper.text()).toMatch(text)
  })

  it('emits click event when clicked', () => {
    const wrapper = shallowMount(Button)
    wrapper.trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
```

### 2.2 表单组件测试

```javascript
// tests/unit/components/Form.spec.js
import { mount } from '@vue/test-utils'
import Form from '@/components/Form.vue'

describe('Form.vue', () => {
  it('validates required fields', async () => {
    const wrapper = mount(Form)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('必填项')
  })

  it('submits form with valid data', async () => {
    const wrapper = mount(Form)
    await wrapper.setData({
      form: {
        name: 'John',
        email: 'john@example.com'
      }
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted().submit[0][0]).toEqual({
      name: 'John',
      email: 'john@example.com'
    })
  })
})
```

### 2.3 异步组件测试

```javascript
// tests/unit/components/AsyncComponent.spec.js
import { shallowMount } from '@vue/test-utils'
import AsyncComponent from '@/components/AsyncComponent.vue'

describe('AsyncComponent.vue', () => {
  it('shows loading state initially', () => {
    const wrapper = shallowMount(AsyncComponent)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('shows data after loading', async () => {
    const wrapper = shallowMount(AsyncComponent)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.data').exists()).toBe(true)
  })
})
```

## 3. Vuex 测试

### 3.1 Store 测试

```javascript
// tests/unit/store/user.spec.js
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import user from '@/store/modules/user'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('user store', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        user: {
          namespaced: true,
          ...user
        }
      }
    })
  })

  it('updates user info', () => {
    const userInfo = { name: 'John', age: 30 }
    store.commit('user/SET_USER_INFO', userInfo)
    expect(store.state.user.userInfo).toEqual(userInfo)
  })

  it('handles login action', async () => {
    const credentials = { username: 'john', password: '123456' }
    await store.dispatch('user/login', credentials)
    expect(store.state.user.isLoggedIn).toBe(true)
  })
})
```

### 3.2 Action 测试

```javascript
// tests/unit/store/actions.spec.js
import actions from '@/store/actions'
import { fetchUser } from '@/api/user'

jest.mock('@/api/user')

describe('actions', () => {
  let commit

  beforeEach(() => {
    commit = jest.fn()
  })

  it('fetches user data', async () => {
    const userData = { id: 1, name: 'John' }
    fetchUser.mockResolvedValue(userData)

    await actions.fetchUserData({ commit })
    expect(commit).toHaveBeenCalledWith('SET_USER_DATA', userData)
  })
})
```

## 4. 路由测试

### 4.1 路由守卫测试

```javascript
// tests/unit/router/guards.spec.js
import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import { beforeEach } from '@/router/guards'

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('router guards', () => {
  let router
  let store

  beforeEach(() => {
    router = new VueRouter({
      routes: [
        { path: '/', meta: { requiresAuth: true } },
        { path: '/login', meta: { requiresAuth: false } }
      ]
    })
    store = {
      state: { isAuthenticated: false },
      dispatch: jest.fn()
    }
  })

  it('redirects to login when not authenticated', () => {
    const to = { path: '/', meta: { requiresAuth: true } }
    const from = { path: '/login' }
    const next = jest.fn()

    beforeEach(to, from, next, store)
    expect(next).toHaveBeenCalledWith('/login')
  })
})
```

### 4.2 路由组件测试

```javascript
// tests/unit/views/Home.spec.js
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('Home.vue', () => {
  let router
  let wrapper

  beforeEach(() => {
    router = new VueRouter()
    wrapper = shallowMount(Home, {
      localVue,
      router
    })
  })

  it('navigates to about page', async () => {
    await wrapper.find('.about-link').trigger('click')
    expect(wrapper.vm.$route.path).toBe('/about')
  })
})
```

## 5. API 测试

### 5.1 API 请求测试

```javascript
// tests/unit/api/user.spec.js
import axios from 'axios'
import { fetchUser, updateUser } from '@/api/user'

jest.mock('axios')

describe('user api', () => {
  beforeEach(() => {
    axios.get.mockClear()
    axios.post.mockClear()
  })

  it('fetches user data', async () => {
    const userData = { id: 1, name: 'John' }
    axios.get.mockResolvedValue({ data: userData })

    const result = await fetchUser(1)
    expect(result).toEqual(userData)
    expect(axios.get).toHaveBeenCalledWith('/api/users/1')
  })

  it('handles api errors', async () => {
    const error = new Error('API Error')
    axios.get.mockRejectedValue(error)

    await expect(fetchUser(1)).rejects.toThrow('API Error')
  })
})
```

### 5.2 Mock 数据测试

```javascript
// tests/unit/api/mock.spec.js
import { createUser, createOrder } from '@/api/mock'

describe('mock data', () => {
  it('creates user with correct structure', () => {
    const user = createUser()
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
  })

  it('creates order with correct structure', () => {
    const order = createOrder()
    expect(order).toHaveProperty('id')
    expect(order).toHaveProperty('items')
    expect(order).toHaveProperty('total')
  })
})
```

## 6. 快照测试

### 6.1 组件快照

```javascript
// tests/unit/components/Profile.spec.js
import { shallowMount } from '@vue/test-utils'
import Profile from '@/components/Profile.vue'

describe('Profile.vue', () => {
  it('matches snapshot', () => {
    const wrapper = shallowMount(Profile, {
      propsData: {
        user: {
          name: 'John',
          avatar: 'avatar.jpg'
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
```

### 6.2 样式快照

```javascript
// tests/unit/styles/theme.spec.js
import { compile } from 'sass'
import fs from 'fs'

describe('theme styles', () => {
  it('matches theme snapshot', () => {
    const result = compile('src/styles/theme.scss')
    expect(result.css).toMatchSnapshot()
  })
})
```

## 7. 测试覆盖率

### 7.1 覆盖率配置

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### 7.2 覆盖率报告

```bash
# package.json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "test:coverage:report": "jest --coverage --coverageReporters='text-summary'"
  }
}
```

## 8. 相关资源

- [Vue Test Utils 官方文档](https://vue-test-utils.vuejs.org/zh/)
- [Jest 官方文档](https://jestjs.io/zh-Hans/)
- [Vue 测试指南](https://cn.vuejs.org/v2/cookbook/unit-testing-vue-components.html)
- [Vuex 测试指南](https://vuex.vuejs.org/zh/guide/testing.html) 