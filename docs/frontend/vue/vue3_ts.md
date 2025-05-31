# TypeScript 与 Vue 3 集成指南

## TypeScript 基础配置

### 1. 项目初始化
```bash
# 创建 Vue 3 + TypeScript 项目
npm create vue@latest my-vue-app

# 选择以下选项：
# ✔ Add TypeScript? Yes
# ✔ Add JSX Support? Yes
# ✔ Add Vue Router? Yes
# ✔ Add Pinia? Yes
# ✔ Add Vitest? Yes
# ✔ Add ESLint? Yes
# ✔ Add Prettier? Yes
```

### 2. TypeScript 配置
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Vue 3 组件开发

### 1. 组件类型定义
```typescript
// 使用 `<script setup lang="ts">` 语法
<script setup lang="ts">
import { ref, computed } from 'vue'

// Props 类型定义
interface Props {
  title: string
  count?: number
}

// 定义 props
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Emits 类型定义
interface Emits {
  (e: 'update', value: number): void
  (e: 'delete'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const count = ref<number>(0)
const doubleCount = computed<number>(() => count.value * 2)

// 方法定义
const increment = (): void => {
  count.value++
  emit('update', count.value)
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### 2. 组合式函数（Composables）
```typescript
// useCounter.ts
import { ref, computed } from 'vue'

interface UseCounterOptions {
  initialValue?: number
  step?: number
}

interface UseCounterReturn {
  count: Ref<number>
  doubleCount: ComputedRef<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const { initialValue = 0, step = 1 } = options
  const count = ref<number>(initialValue)
  
  const doubleCount = computed<number>(() => count.value * 2)
  
  const increment = (): void => {
    count.value += step
  }
  
  const decrement = (): void => {
    count.value -= step
  }
  
  const reset = (): void => {
    count.value = initialValue
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}
```

### 3. 路由类型定义
```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫类型
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
```

### 4. Pinia 状态管理
```typescript
// stores/counter.ts
import { defineStore } from 'pinia'

interface CounterState {
  count: number
  lastUpdated: Date | null
}

export const useCounterStore = defineStore('counter', {
  state: (): CounterState => ({
    count: 0,
    lastUpdated: null
  }),
  
  getters: {
    doubleCount: (state): number => state.count * 2,
    formattedDate: (state): string => 
      state.lastUpdated?.toLocaleDateString() ?? 'Never'
  },
  
  actions: {
    increment(): void {
      this.count++
      this.lastUpdated = new Date()
    },
    
    async fetchCount(): Promise<void> {
      try {
        const response = await fetch('/api/count')
        const data = await response.json()
        this.count = data.count
        this.lastUpdated = new Date()
      } catch (error) {
        console.error('Failed to fetch count:', error)
      }
    }
  }
})
```

## API 集成

### 1. API 类型定义
```typescript
// types/api.ts
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// api/user.ts
import type { User, ApiResponse } from '@/types/api'

export async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

export async function updateUser(
  id: number, 
  user: Partial<User>
): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  return response.json()
}
```

### 2. Axios 集成
```typescript
// utils/axios.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api
```

## 工具和类型增强

### 1. 环境变量类型
```typescript
// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 2. 组件类型声明
```typescript
// components.d.ts
declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
    // 全局组件声明...
  }
}

export {}
```

### 3. 第三方库类型扩展
```typescript
// types/third-party.d.ts
declare module 'vue-awesome-swiper' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

## 最佳实践

### 1. 类型安全
- 使用 `strict` 模式
- 避免使用 `any`
- 使用类型断言时确保类型安全
- 优先使用接口而不是类型别名
- 使用类型守卫进行类型收窄

### 2. 性能优化
- 使用 `defineAsyncComponent` 进行组件懒加载
- 合理使用 `computed` 和 `watch`
- 避免不必要的类型转换
- 使用 `v-memo` 优化列表渲染

### 3. 代码组织
- 使用模块化组织代码
- 分离业务逻辑和UI组件
- 使用组合式函数复用逻辑
- 保持类型定义文件整洁

## 常见问题

### 1. 类型错误
- Props 类型定义问题
- 事件处理函数类型
- 组件引用类型
- 异步操作类型

### 2. 构建问题
- 类型声明文件缺失
- 模块解析错误
- 环境变量类型
- 第三方库类型

### 3. 运行时问题
- 类型断言安全
- 空值处理
- 异步操作类型
- 响应式类型

## 工具和资源

### 1. 开发工具
- Volar (Vue Language Features)
- TypeScript Vue Plugin
- ESLint + TypeScript
- Prettier

### 2. 学习资源
- Vue 3 官方文档
- TypeScript 官方文档
- Vue 3 + TypeScript 示例
- 社区最佳实践

### 3. 实用库
- `vue-tsc` - Vue 3 TypeScript 类型检查
- `unplugin-vue-components` - 组件自动导入
- `@vueuse/core` - Vue 组合式 API 工具集
- `pinia-plugin-persistedstate` - Pinia 持久化