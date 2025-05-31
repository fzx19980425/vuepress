# uni-app 组件开发

## 组件开发规范

### 组件分类

1. **基础组件**
   - 纯展示型组件
   - 无业务逻辑
   - 高度可复用
   ```vue
   <!-- components/common/BaseButton.vue -->
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
   ```

2. **业务组件**
   - 包含业务逻辑
   - 特定场景使用
   - 可配置性强
   ```vue
   <!-- components/business/UserCard.vue -->
   <template>
     <view class="user-card">
       <image :src="userInfo.avatar" />
       <text>{{ userInfo.name }}</text>
       <slot name="action"></slot>
     </view>
   </template>
   ```

3. **页面组件**
   - 完整页面功能
   - 包含多个子组件
   - 独立路由
   ```vue
   <!-- components/pages/UserProfile.vue -->
   <template>
     <view class="user-profile">
       <user-info />
       <user-stats />
       <user-actions />
     </view>
   </template>
   ```

### 组件设计原则

1. **单一职责**
   - 一个组件只做一件事
   - 功能内聚
   - 接口简单

2. **可复用性**
   - 通用性强
   - 配置灵活
   - 扩展性好

3. **可维护性**
   - 代码清晰
   - 注释完整
   - 易于测试

## 组件通信

### Props 传递

1. **基础用法**
   ```vue
   <!-- 父组件 -->
   <template>
     <child-component 
       :title="title"
       :user="userInfo"
       @update="handleUpdate"
     />
   </template>

   <!-- 子组件 -->
   <script>
   export default {
     props: {
       title: {
         type: String,
         required: true
       },
       user: {
         type: Object,
         default: () => ({})
       }
     }
   }
   </script>
   ```

2. **Props 验证**
   ```js
   props: {
     // 基础类型检查
     propA: Number,
     
     // 多个可能的类型
     propB: [String, Number],
     
     // 必填的字符串
     propC: {
       type: String,
       required: true
     },
     
     // 带有默认值的数字
     propD: {
       type: Number,
       default: 100
     },
     
     // 带有默认值的对象
     propE: {
       type: Object,
       default: () => ({})
     },
     
     // 自定义验证函数
     propF: {
       validator: function(value) {
         return ['success', 'warning', 'danger'].indexOf(value) !== -1
       }
     }
   }
   ```

### 事件通信

1. **事件触发**
   ```vue
   <!-- 子组件 -->
   <template>
     <button @click="handleClick">点击</button>
   </template>

   <script>
   export default {
     methods: {
       handleClick() {
         this.$emit('update', { value: 'new value' })
       }
     }
   }
   </script>
   ```

2. **事件监听**
   ```vue
   <!-- 父组件 -->
   <template>
     <child-component @update="handleUpdate" />
   </template>

   <script>
   export default {
     methods: {
       handleUpdate(data) {
         console.log('收到更新：', data)
       }
     }
   }
   </script>
   ```

### 组件引用

1. **ref 引用**
   ```vue
   <!-- 父组件 -->
   <template>
     <child-component ref="child" />
   </template>

   <script>
   export default {
     methods: {
       callChildMethod() {
         this.$refs.child.someMethod()
       }
     }
   }
   </script>
   ```

2. **provide/inject**
   ```js
   // 父组件
   export default {
     provide: {
       theme: 'dark',
       updateTheme: (theme) => {
         this.theme = theme
       }
     }
   }

   // 子组件
   export default {
     inject: ['theme', 'updateTheme']
   }
   ```

## 组件封装

### 基础组件封装

1. **按钮组件**
   ```vue
   <!-- components/common/BaseButton.vue -->
   <template>
     <button 
       class="base-button"
       :class="[type, size, { disabled }]"
       :disabled="disabled"
       @click="handleClick"
     >
       <slot name="icon"></slot>
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
       handleClick(e) {
         if (!this.disabled) {
           this.$emit('click', e)
         }
       }
     }
   }
   </script>

   <style lang="scss" scoped>
   .base-button {
     // 基础样式
     &--primary {
       // 主要按钮样式
     }
     &--small {
       // 小尺寸样式
     }
     &.disabled {
       // 禁用样式
     }
   }
   </style>
   ```

2. **列表组件**
   ```vue
   <!-- components/common/BaseList.vue -->
   <template>
     <view class="base-list">
       <view 
         v-for="(item, index) in list"
         :key="index"
         class="list-item"
         @click="handleItemClick(item)"
       >
         <slot name="item" :item="item"></slot>
       </view>
       <view v-if="loading" class="loading">
         <slot name="loading">加载中...</slot>
       </view>
       <view v-if="finished" class="finished">
         <slot name="finished">没有更多了</slot>
       </view>
     </view>
   </template>
   ```

### 业务组件封装

1. **用户信息卡片**
   ```vue
   <!-- components/business/UserCard.vue -->
   <template>
     <view class="user-card">
       <view class="user-info">
         <image :src="user.avatar" class="avatar" />
         <view class="info">
           <text class="name">{{ user.name }}</text>
           <text class="desc">{{ user.description }}</text>
         </view>
       </view>
       <view class="actions">
         <slot name="actions"></slot>
       </view>
     </view>
   </template>

   <script>
   export default {
     name: 'UserCard',
     props: {
       user: {
         type: Object,
         required: true
       }
     }
   }
   </script>
   ```

2. **表单组件**
   ```vue
   <!-- components/business/FormItem.vue -->
   <template>
     <view class="form-item">
       <text class="label">{{ label }}</text>
       <view class="content">
         <slot></slot>
       </view>
       <text v-if="error" class="error">{{ error }}</text>
     </view>
   </template>

   <script>
   export default {
     name: 'FormItem',
     props: {
       label: String,
       error: String
     }
   }
   </script>
   ```

### 组件扩展

1. **混入（Mixin）**
   ```js
   // mixins/loading.js
   export default {
     data() {
       return {
         loading: false
       }
     },
     methods: {
       async withLoading(fn) {
         this.loading = true
         try {
           await fn()
         } finally {
           this.loading = false
         }
       }
     }
   }

   // 使用混入
   import loadingMixin from '@/mixins/loading'
   export default {
     mixins: [loadingMixin]
   }
   ```

2. **指令**
   ```js
   // directives/permission.js
   export default {
     inserted(el, binding) {
       const { value } = binding
       const hasPermission = checkPermission(value)
       if (!hasPermission) {
         el.parentNode?.removeChild(el)
       }
     }
   }

   // 使用指令
   <button v-permission="'admin'">管理员按钮</button>
   ```

## 组件优化

### 性能优化

1. **避免不必要的渲染**
   ```vue
   <template>
     <view>
       <child-component 
         v-if="shouldRender"
         :data="data"
       />
     </view>
   </template>

   <script>
   export default {
     computed: {
       shouldRender() {
         return this.data && this.data.length > 0
       }
     }
   }
   </script>
   ```

2. **使用计算属性**
   ```js
   export default {
     computed: {
       filteredList() {
         return this.list.filter(item => item.active)
       }
     }
   }
   ```

3. **合理使用缓存**
   ```vue
   <template>
     <view>
       <keep-alive>
         <component :is="currentComponent" />
       </keep-alive>
     </view>
   </template>
   ```

### 代码优化

1. **组件拆分**
   - 按功能拆分
   - 按复杂度拆分
   - 按复用性拆分

2. **代码复用**
   - 使用混入
   - 使用组合式函数
   - 使用工具函数

3. **类型检查**
   ```js
   props: {
     user: {
       type: Object,
       required: true,
       validator: (value) => {
         return value.name && value.age
       }
     }
   }
   ```

## 组件测试

### 单元测试

1. **组件测试**
   ```js
   import { mount } from '@vue/test-utils'
   import MyComponent from './MyComponent.vue'

   describe('MyComponent', () => {
     test('renders correctly', () => {
       const wrapper = mount(MyComponent, {
         propsData: {
           title: 'Test'
         }
       })
       expect(wrapper.text()).toContain('Test')
     })
   })
   ```

2. **事件测试**
   ```js
   test('emits click event', async () => {
     const wrapper = mount(MyComponent)
     await wrapper.trigger('click')
     expect(wrapper.emitted().click).toBeTruthy()
   })
   ```

### 集成测试

1. **组件交互测试**
   ```js
   test('parent-child interaction', async () => {
     const wrapper = mount(ParentComponent)
     const child = wrapper.findComponent(ChildComponent)
     await child.vm.$emit('update', { value: 'new' })
     expect(wrapper.vm.value).toBe('new')
   })
   ```

2. **状态测试**
   ```js
   test('state management', async () => {
     const wrapper = mount(MyComponent)
     await wrapper.setData({ loading: true })
     expect(wrapper.find('.loading').exists()).toBe(true)
   })
   ```

## 最佳实践

### 组件设计

1. **接口设计**
   - 保持简单
   - 语义化命名
   - 类型安全

2. **样式设计**
   - 使用 BEM 命名
   - 样式隔离
   - 主题定制

3. **文档设计**
   - 使用说明
   - 示例代码
   - 注意事项

### 开发流程

1. **组件规划**
   - 需求分析
   - 接口设计
   - 实现方案

2. **开发规范**
   - 代码规范
   - 注释规范
   - 提交规范

3. **测试规范**
   - 单元测试
   - 集成测试
   - 性能测试

### 维护更新

1. **版本管理**
   - 语义化版本
   - 更新日志
   - 兼容性处理

2. **问题处理**
   - 问题收集
   - 问题分析
   - 解决方案

3. **性能优化**
   - 性能监控
   - 性能分析
   - 优化方案 