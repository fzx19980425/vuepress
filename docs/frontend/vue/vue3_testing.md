 # Vue 3 单元测试

Vue 3 推荐使用 Vitest、Vue Test Utils、Jest 进行单元测试。这里对照 Vue2，介绍 Vue3 的测试环境与用法。

## 1. 测试环境配置

### 1.1 安装依赖

```bash
npm install -D vitest @vue/test-utils
```

### 1.2 配置 Vitest

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
```

## 2. 组件测试

```vue
<script setup>
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from '@/components/Button.vue'

describe('Button.vue', () => {
  it('renders props.text when passed', () => {
    const wrapper = mount(Button, { props: { text: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })
})
</script>
```

## 3. 状态管理测试（Pinia）

```js
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/user'

setActivePinia(createPinia())
const store = useUserStore()
store.login('test')
expect(store.isLoggedIn).toBe(true)
```

## 4. 路由测试

```js
import { createRouter, createWebHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Home }]
})

const wrapper = mount(Home, {
  global: { plugins: [router] }
})
```

## 5. API 测试

```js
import axios from 'axios'
import { vi } from 'vitest'
vi.mock('axios')

axios.get.mockResolvedValue({ data: { name: 'John' } })
// ...
```

## 6. 覆盖率

```json
// package.json
{
  "scripts": {
    "test:coverage": "vitest run --coverage"
  }
}
```

## 7. 相关资源
- [Vitest 官方文档](https://cn.vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Jest 官方文档](https://jestjs.io/zh-Hans/)