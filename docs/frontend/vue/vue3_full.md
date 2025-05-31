 # Vue 3 进阶与详细参考

> 本文档为 Vue3 详细版，包含所有基础、进阶、最佳实践、丰富代码示例和实际应用场景


## 1. 基础概念

### 1.1 响应式系统

#### ref 和 reactive 的区别

```vue
<script setup>
import { ref, reactive } from 'vue'
// ref - 用于基本类型的响应式
const count = ref(0)
const increment = () => count.value++
// reactive - 用于对象的响应式
const state = reactive({
  user: { name: '张三', age: 25 },
  todos: []
})
</script>
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>User Name: {{ state.user.name }}</p>
    <button @click="increment">增加</button>
  </div>
</template>
```

#### toRef 和 toRefs 的使用

```vue
<script setup>
import { reactive, toRef, toRefs } from 'vue'
const state = reactive({ name: '张三', age: 25, address: { city: '北京', street: '朝阳区' } })
const nameRef = toRef(state, 'name')
const { age, address } = toRefs(state)
function useUserInfo() {
  const state = reactive({ name: '张三', age: 25 })
  return toRefs(state)
}
</script>
```

### 1.2 计算属性

#### 基础计算属性

```vue
<script setup>
import { ref, computed } from 'vue'
const count = ref(0)
const doubleCount = computed(() => count.value * 2)
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (newValue) => {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})
const expensiveComputation = computed(() => {
  console.log('计算执行')
  return heavyCalculation()
})
</script>
```

#### 计算属性的性能优化

```vue
<script setup>
import { ref, computed } from 'vue'
const list = ref([/* 大量数据 */])
const searchQuery = ref('')
const filteredList = computed(() => list.value.filter(item => item.name.includes(searchQuery.value)))
const optimizedFilteredList = computed(() => {
  if (!searchQuery.value) return list.value
  return list.value.filter(item => item.name.includes(searchQuery.value))
})
</script>
```

### 1.3 监听器

#### watch 的多种用法

```vue
<script setup>
import { ref, watch } from 'vue'
const count = ref(0)
const state = reactive({ name: '张三' })
watch(count, (newValue, oldValue) => { console.log(`count从${oldValue}变为${newValue}`) })
watch([count, () => state.name], ([newCount, newName], [oldCount, oldName]) => { console.log('数据变化:', { newCount, newName, oldCount, oldName }) })
watch(() => state.user, (newValue) => { console.log('user changed:', newValue) }, { deep: true })
watch(count, (newValue) => { console.log('count changed:', newValue) }, { immediate: true })
watch(count, (newValue, oldValue, onCleanup) => {
  const timer = setTimeout(() => { console.log('延迟执行') }, 1000)
  onCleanup(() => { clearTimeout(timer) })
})
</script>
```

#### watchEffect 的自动依赖收集

```vue
<script setup>
import { ref, watchEffect } from 'vue'
const count = ref(0)
const state = reactive({ name: '张三' })
watchEffect(() => { console.log(`count: ${count.value}, name: ${state.name}`) })
watchEffect((onCleanup) => {
  const timer = setInterval(() => { console.log('定时执行') }, 1000)
  onCleanup(() => { clearInterval(timer) })
})
watchEffect(() => { /* ... */ }, { flush: 'post', onTrack(e) {}, onTrigger(e) {} })
</script>
```

## 2. 组合式函数（Composables）

### 2.1 基础组合式函数

#### 计数器示例

```javascript
// useCounter.js
import { ref, computed } from 'vue'
export function useCounter(initialValue = 0, options = {}) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)
  const { min = -Infinity, max = Infinity } = options
  function increment() { if (count.value < max) count.value++ }
  function decrement() { if (count.value > min) count.value-- }
  function reset() { count.value = initialValue }
  return { count, doubleCount, increment, decrement, reset }
}
```

#### 鼠标位置跟踪

```javascript
// useMousePosition.js
import { ref, onMounted, onUnmounted } from 'vue'
export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)
  function updatePosition(event) { x.value = event.clientX; y.value = event.clientY }
  onMounted(() => window.addEventListener('mousemove', updatePosition))
  onUnmounted(() => window.removeEventListener('mousemove', updatePosition))
  return { x, y }
}
```

### 2.2 异步组合式函数

#### 数据获取

```javascript
// useAsync.js
import { ref } from 'vue'
export function useAsync(asyncFunction) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const lastUpdated = ref(null)
  async function execute(...args) {
    loading.value = true
    error.value = null
    try {
      data.value = await asyncFunction(...args)
      lastUpdated.value = new Date()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  return { data, error, loading, lastUpdated, execute }
}
```

#### 防抖和节流

```javascript
// useDebounce.js
import { ref, watch } from 'vue'
export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  let timeout
  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => { debouncedValue.value = newValue }, delay)
  })
  return debouncedValue
}
```

### 2.3 生命周期组合式函数

#### 自动清理

```javascript
// useAutoCleanup.js
import { onUnmounted } from 'vue'
export function useAutoCleanup() {
  const cleanupFunctions = []
  function addCleanup(fn) { cleanupFunctions.push(fn) }
  onUnmounted(() => { cleanupFunctions.forEach(fn => fn()) })
  return { addCleanup }
}
```

#### 组件挂载状态

```javascript
// useMountedState.js
import { ref, onMounted, onUnmounted } from 'vue'
export function useMountedState() {
  const isMounted = ref(false)
  onMounted(() => { isMounted.value = true })
  onUnmounted(() => { isMounted.value = false })
  return isMounted
}
```

## 3. 性能优化

### 3.1 响应式优化

#### shallowRef 和 markRaw

```vue
<script setup>
import { ref, shallowRef, markRaw } from 'vue'
const largeObject = shallowRef({ data: { items: [/* 大量数据 */] } })
const staticConfig = markRaw({ version: '1.0.0', settings: { theme: 'dark', language: 'zh-CN' } })
const nonReactive = { constants: { PI: 3.14159, E: 2.71828 } }
</script>
```

#### 响应式数据的解构

```vue
<script setup>
import { reactive, toRefs } from 'vue'
const state = reactive({ user: { name: '张三', age: 25 }, settings: { theme: 'dark', language: 'zh-CN' } })
const { user, settings } = toRefs(state)
</script>
```

### 3.2 计算属性优化

#### 缓存优化

```vue
<script setup>
import { computed } from 'vue'
const expensiveComputation = computed(() => { console.log('计算执行'); return heavyCalculation() })
const filteredList = computed(() => { if (!searchQuery.value) return list.value; return list.value.filter(item => item.name.includes(searchQuery.value)) })
const sortedList = computed(() => { if (!sortBy.value) return list.value; return [...list.value].sort((a, b) => a[sortBy.value] > b[sortBy.value] ? 1 : -1) })
</script>
```

#### 计算属性的 getter 和 setter

```vue
<script setup>
import { computed } from 'vue'
const fullName = computed({ get: () => `${firstName.value} ${lastName.value}`, set: (newValue) => { const [first, last] = newValue.split(' '); firstName.value = first; lastName.value = last } })
const age = computed({ get: () => state.age, set: (newValue) => { if (newValue >= 0 && newValue <= 120) { state.age = newValue } else { console.warn('Invalid age value') } } })
const price = computed({ get: () => state.price, set: (newValue) => { state.price = Number(newValue) } })
</script>
```

## 4. 实际应用场景

### 4.1 表单处理

#### 表单验证

```vue
<script setup>
import { reactive } from 'vue'
import { useFormValidation } from './composables/useFormValidation'
const form = reactive({ username: '', password: '', email: '', age: '' })
const { validate, errors, reset } = useFormValidation(form, { username: { required: true, minLength: 3, pattern: /^[a-zA-Z0-9_]+$/ }, password: { required: true, minLength: 6, pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/ }, email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, age: { required: true, min: 18, max: 100 } })
async function handleSubmit() { if (await validate()) { /* 提交表单 */ } }
</script>
```

#### 表单状态管理

```vue
<script setup>
import { reactive } from 'vue'
const formState = reactive({ isDirty: false, isSubmitting: false, isSubmitted: false, errors: {} })
function useFormState() {
  function setDirty() { formState.isDirty = true }
  function setSubmitting(isSubmitting) { formState.isSubmitting = isSubmitting }
  function setSubmitted() { formState.isSubmitted = true }
  function setErrors(errors) { formState.errors = errors }
  function reset() { formState.isDirty = false; formState.isSubmitting = false; formState.isSubmitted = false; formState.errors = {} }
  return { formState, setDirty, setSubmitting, setSubmitted, setErrors, reset }
}
</script>
```

### 4.2 数据获取

#### 分页数据获取

```vue
<script setup>
import { ref } from 'vue'
function usePagination(fetchFunction) {
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchFunction({ page: currentPage.value, pageSize: pageSize.value })
      data.value = result.items
      total.value = result.total
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  function changePage(page) { currentPage.value = page; fetchData() }
  function changePageSize(size) { pageSize.value = size; currentPage.value = 1; fetchData() }
  return { data, loading, error, currentPage, pageSize, total, fetchData, changePage, changePageSize }
}
const { data, loading, currentPage, total, changePage } = usePagination(fetchUsers)
</script>
```

#### 无限滚动

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
function useInfiniteScroll(fetchFunction) {
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(true)
  const page = ref(1)
  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    error.value = null
    try {
      const result = await fetchFunction(page.value)
      data.value.push(...result.items)
      hasMore.value = result.hasMore
      page.value++
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (scrollHeight - scrollTop - clientHeight < 100) { loadMore() }
  }
  onMounted(() => { window.addEventListener('scroll', handleScroll); loadMore() })
  onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })
  return { data, loading, error, hasMore, loadMore }
}
const { data, loading, hasMore } = useInfiniteScroll(fetchPosts)
</script>
```

### 4.3 状态管理

#### 简单的状态管理

```vue
<script setup>
import { reactive, readonly } from 'vue'
const state = reactive({ count: 0, user: null, settings: { theme: 'light', language: 'zh-CN' } })
const readonlyState = readonly(state)
function increment() { state.count++ }
function setUser(user) { state.user = user }
function updateSettings(settings) { state.settings = { ...state.settings, ...settings } }
function subscribe(callback) { watch(() => ({ ...state }), (newState) => { callback(newState) }, { deep: true }) }
</script>
```

#### 模块化状态管理

```javascript
// store/user.js
import { reactive } from 'vue'
export const userStore = reactive({
  state: { user: null, token: null },
  actions: {
    setUser(user) { this.state.user = user },
    setToken(token) { this.state.token = token },
    logout() { this.state.user = null; this.state.token = null }
  }
})
// store/settings.js
export const settingsStore = reactive({
  state: { theme: 'light', language: 'zh-CN' },
  actions: {
    setTheme(theme) { this.state.theme = theme },
    setLanguage(language) { this.state.language = language }
  }
})
// 使用示例
import { userStore, settingsStore } from './store'
userStore.actions.setUser({ name: '张三' })
settingsStore.actions.setTheme('dark')
```

## 5. 最佳实践

### 5.1 命名规范

```javascript
function useCounter() {}
function useUserData() {}
function useFormValidation() {}
const userData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
function fetchData() {}
function updateUser() {}
function handleSubmit() {}
```

### 5.2 代码组织

```javascript
function useUser() {
  const user = ref(null)
  const loading = ref(false)
  function fetchUser() {}
  function updateUser() {}
  const isLoggedIn = computed(() => !!user.value)
  return { user, loading, isLoggedIn, fetchUser, updateUser }
}
function useAsync(asyncFunction) {}
function useDebounce(value, delay) {}
function useCounter() {}
function useTimer() {}
```

### 5.3 性能优化

```javascript
const largeList = shallowRef([])
watch(() => state.user, (newValue) => {}, { deep: false })
const filteredList = computed(() => { if (!searchQuery.value) return list.value; return list.value.filter(item => item.name.includes(searchQuery.value)) })
onUnmounted(() => {})
```

### 5.4 错误处理

```javascript
async function fetchData() { try { const result = await api.getData(); return result } catch (error) { console.error('获取数据失败:', error); throw error } }
function useAsync(asyncFunction) { const error = ref(null); async function execute() { try { await asyncFunction() } catch (e) { error.value = e } } return { error, execute } }
function useErrorHandler() { const errors = ref([]); function handleError(error) { errors.value.push({ message: error.message, timestamp: new Date() }) } return { errors, handleError } }
```

## 6. 相关资源

- [Vue 3 官方文档](https://v3.vuejs.org/)
- [Composition API RFC](https://composition-api.vuejs.org/)
- [Vue 3 迁移指南](https://v3-migration.vuejs.org/)
- [Vue 3 性能优化指南](https://v3.vuejs.org/guide/performance.html)
- [Vue 3 组合式 API 风格指南](https://v3.vuejs.org/style-guide/)
- [Vue 3 响应式系统详解](https://v3.vuejs.org/guide/reactivity.html)
- [Vue 3 组合式函数最佳实践](https://v3.vuejs.org/guide/composition-api-introduction.html)
