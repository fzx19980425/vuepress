# Vue 3 基础与核心概念

Vue 3 带来了全新的 Composition API、setup、更优的性能和 TypeScript 支持。本文档系统梳理 Vue3 的核心用法、进阶技巧、与 Vue2 的对比和迁移建议。


## 1. 概述与对比

### Options API（Vue2/3 兼容）
```js
export default {
  data() { return { count: 0 } },
  methods: { inc() { this.count++ } },
  mounted() { console.log('mounted') }
}
```

### Composition API（Vue3 推荐）
```vue
<script setup>
import { ref, onMounted } from 'vue'
const count = ref(0)
function inc() { count.value++ }
onMounted(() => console.log('mounted'))
</script>
```

**优点：** 逻辑复用更灵活、类型推断更好、代码更易维护。

## 2. 响应式系统

- ref/readonly/reactive/toRefs/toRef
- Proxy 实现，性能更优
- **注意：** reactive 不能解构，ref 需要 .value

```js
import { ref, reactive, toRefs } from 'vue'
const state = reactive({ count: 0 })
const { count } = toRefs(state)
```

## 3. 计算属性与监听

### 计算属性
```js
import { ref, computed } from 'vue'
const count = ref(0)
const doubleCount = computed(() => count.value * 2)
```

### 监听器
```js
import { ref, watch, watchEffect } from 'vue'
const count = ref(0)
watch(count, (newVal, oldVal) => { /* ... */ })
watchEffect(() => { /* ... */ })
```

## 4. 生命周期

| Vue2         | Vue3 (Options API) | Vue3 (Composition API) |-|
| beforeCreate | beforeCreate      | setup()                |
| created      | created           | setup()                |
| beforeMount  | beforeMount       | onBeforeMount          |
| mounted      | mounted           | onMounted              |
| beforeUpdate | beforeUpdate      | onBeforeUpdate         |
| updated      | updated           | onUpdated              |
| beforeDestroy| beforeUnmount     | onBeforeUnmount        |
| destroyed    | unmounted         | onUnmounted            |

## 5. 组合式函数（Composables）

- 逻辑复用推荐 useXxx 命名
- 支持异步、生命周期、表单、数据获取等

```js
// useCounter.js
import { ref } from 'vue'
export function useCounter() {
  const count = ref(0)
  const inc = () => count.value++
  return { count, inc }
}
```

## 6. 组件通信

- defineProps/defineEmits/useSlots/useAttrs
- provide/inject 组合式用法
- 推荐 composables 复用逻辑

## 7. 性能优化

- shallowRef、markRaw、避免不必要的深度监听
- 计算属性缓存、条件计算
- 合理使用 keep-alive、Suspense、Teleport
- 及时清理副作用

## 8. 实际应用场景

- 表单处理（useForm/useFormValidation）
- 数据获取（useAsync/usePagination/useInfiniteScroll）
- 状态管理（Pinia、模块化 store）

## 9. 最佳实践

- 组合式 API + setup + TypeScript
- 逻辑复用用 composables 目录
- 组件 props/emits 明确类型
- 命名规范、代码组织、性能优化、错误处理
- 充分利用 Vite、Pinia、自动导入插件

## 10. 相关资源

- [Vue3 官方文档](https://cn.vuejs.org/)
- [Vue3 风格指南](https://cn.vuejs.org/style-guide/)
- [Vue3 迁移指南](https://v3-migration.vuejs.org/zh/)
- [VueUse 组合式 API 工具库](https://vueuse.org/zh/)
- [Vue 3 响应式系统详解](https://v3.vuejs.org/guide/reactivity.html)
- [Vue 3 组合式函数最佳实践](https://v3.vuejs.org/guide/composition-api-introduction.html)
