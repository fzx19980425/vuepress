# uni-app 状态管理

## Vuex 状态管理

### 基础配置

1. **Store 配置**
   ```js
   // store/index.js
   import Vue from 'vue'
   import Vuex from 'vuex'
   import user from './modules/user'
   import app from './modules/app'

   Vue.use(Vuex)

   export default new Vuex.Store({
     modules: {
       user,
       app
     },
     // 严格模式
     strict: process.env.NODE_ENV !== 'production'
   })
   ```

2. **模块配置**
   ```js
   // store/modules/user.js
   const state = {
     token: uni.getStorageSync('token') || '',
     userInfo: null
   }

   const mutations = {
     SET_TOKEN(state, token) {
       state.token = token
       uni.setStorageSync('token', token)
     },
     SET_USER_INFO(state, userInfo) {
       state.userInfo = userInfo
     }
   }

   const actions = {
     // 登录
     async login({ commit }, loginData) {
       try {
         const res = await uni.request({
           url: '/api/login',
           method: 'POST',
           data: loginData
         })
         const { token, userInfo } = res.data
         commit('SET_TOKEN', token)
         commit('SET_USER_INFO', userInfo)
         return res
       } catch (error) {
         throw error
       }
     },

     // 登出
     logout({ commit }) {
       commit('SET_TOKEN', '')
       commit('SET_USER_INFO', null)
       uni.removeStorageSync('token')
     }
   }

   const getters = {
     isLoggedIn: state => !!state.token,
     userInfo: state => state.userInfo
   }

   export default {
     namespaced: true,
     state,
     mutations,
     actions,
     getters
   }
   ```

### 使用方式

1. **组件中使用**
   ```vue
   <template>
     <view class="user-profile">
       <view v-if="isLoggedIn">
         <text>欢迎, {{ userInfo.name }}</text>
         <button @click="handleLogout">退出登录</button>
       </view>
       <view v-else>
         <button @click="handleLogin">登录</button>
       </view>
     </view>
   </template>

   <script>
   import { mapState, mapGetters, mapActions } from 'vuex'

   export default {
     computed: {
       ...mapState('user', ['userInfo']),
       ...mapGetters('user', ['isLoggedIn'])
     },
     methods: {
       ...mapActions('user', ['login', 'logout']),
       async handleLogin() {
         try {
           await this.login({
             username: 'test',
             password: '123456'
           })
           uni.showToast({
             title: '登录成功'
           })
         } catch (error) {
           uni.showToast({
             title: '登录失败',
             icon: 'none'
           })
         }
       },
       async handleLogout() {
         await this.logout()
         uni.showToast({
           title: '已退出登录'
         })
       }
     }
   }
   </script>
   ```

2. **页面中使用**
   ```js
   // pages/index/index.js
   import { mapState, mapActions } from 'vuex'

   export default {
     computed: {
       ...mapState({
         count: state => state.app.count,
         userInfo: state => state.user.userInfo
       })
     },
     methods: {
       ...mapActions('app', ['increment', 'decrement']),
       handleIncrement() {
         this.increment()
       }
     }
   }
   ```

## Pinia 状态管理

### 基础配置

1. **Store 定义**
   ```js
   // stores/user.js
   import { defineStore } from 'pinia'

   export const useUserStore = defineStore('user', {
     state: () => ({
       token: uni.getStorageSync('token') || '',
       userInfo: null
     }),
     
     getters: {
       isLoggedIn: (state) => !!state.token
     },
     
     actions: {
       setToken(token) {
         this.token = token
         uni.setStorageSync('token', token)
       },
       
       setUserInfo(userInfo) {
         this.userInfo = userInfo
       },
       
       async login(loginData) {
         try {
           const res = await uni.request({
             url: '/api/login',
             method: 'POST',
             data: loginData
           })
           const { token, userInfo } = res.data
           this.setToken(token)
           this.setUserInfo(userInfo)
           return res
         } catch (error) {
           throw error
         }
       },
       
       logout() {
         this.token = ''
         this.userInfo = null
         uni.removeStorageSync('token')
       }
     }
   })
   ```

2. **Store 使用**
   ```js
   // main.js
   import { createPinia } from 'pinia'
   import App from './App'

   const app = createApp(App)
   app.use(createPinia())
   ```

### 使用方式

1. **组件中使用**
   ```vue
   <template>
     <view class="user-profile">
       <view v-if="userStore.isLoggedIn">
         <text>欢迎, {{ userStore.userInfo.name }}</text>
         <button @click="handleLogout">退出登录</button>
       </view>
       <view v-else>
         <button @click="handleLogin">登录</button>
       </view>
     </view>
   </template>

   <script setup>
   import { useUserStore } from '@/stores/user'

   const userStore = useUserStore()

   const handleLogin = async () => {
     try {
       await userStore.login({
         username: 'test',
         password: '123456'
       })
       uni.showToast({
         title: '登录成功'
       })
     } catch (error) {
       uni.showToast({
         title: '登录失败',
         icon: 'none'
       })
     }
   }

   const handleLogout = () => {
     userStore.logout()
     uni.showToast({
       title: '已退出登录'
     })
   }
   </script>
   ```

2. **组合式函数**
   ```js
   // composables/useAuth.js
   import { useUserStore } from '@/stores/user'
   import { storeToRefs } from 'pinia'

   export function useAuth() {
     const userStore = useUserStore()
     const { isLoggedIn, userInfo } = storeToRefs(userStore)

     const checkAuth = () => {
       if (!isLoggedIn.value) {
         uni.redirectTo({
           url: '/pages/login/login'
         })
         return false
       }
       return true
     }

     return {
       isLoggedIn,
       userInfo,
       checkAuth,
       login: userStore.login,
       logout: userStore.logout
     }
   }
   ```

## 数据持久化

### 本地存储

1. **存储封装**
   ```js
   // utils/storage.js
   const storage = {
     set(key, data) {
       try {
         uni.setStorageSync(key, data)
       } catch (e) {
         console.error('存储数据失败：', e)
       }
     },

     get(key) {
       try {
         return uni.getStorageSync(key)
       } catch (e) {
         console.error('获取数据失败：', e)
         return null
       }
     },

     remove(key) {
       try {
         uni.removeStorageSync(key)
       } catch (e) {
         console.error('删除数据失败：', e)
       }
     },

     clear() {
       try {
         uni.clearStorageSync()
       } catch (e) {
         console.error('清空数据失败：', e)
       }
     }
   }

   export default storage
   ```

2. **状态持久化**
   ```js
   // store/plugins/persist.js
   const persistPlugin = (store) => {
     // 初始化时从存储中恢复状态
     const savedState = uni.getStorageSync('vuex')
     if (savedState) {
       store.replaceState(JSON.parse(savedState))
     }

     // 状态变化时保存到存储
     store.subscribe((mutation, state) => {
       uni.setStorageSync('vuex', JSON.stringify(state))
     })
   }

   export default persistPlugin
   ```

### 数据同步

1. **状态同步**
   ```js
   // store/modules/sync.js
   const state = {
     lastSyncTime: null,
     syncStatus: 'idle' // idle, syncing, success, error
   }

   const mutations = {
     SET_SYNC_STATUS(state, status) {
       state.syncStatus = status
     },
     SET_LAST_SYNC_TIME(state, time) {
       state.lastSyncTime = time
     }
   }

   const actions = {
     async syncData({ commit, dispatch }) {
       commit('SET_SYNC_STATUS', 'syncing')
       try {
         // 同步数据
         await dispatch('syncUserData')
         await dispatch('syncAppData')
         
         commit('SET_SYNC_STATUS', 'success')
         commit('SET_LAST_SYNC_TIME', new Date().toISOString())
       } catch (error) {
         commit('SET_SYNC_STATUS', 'error')
         throw error
       }
     }
   }
   ```

2. **自动同步**
   ```js
   // utils/autoSync.js
   import store from '@/store'

   const SYNC_INTERVAL = 5 * 60 * 1000 // 5分钟

   export function startAutoSync() {
     // 定期同步
     setInterval(() => {
       store.dispatch('sync/syncData')
     }, SYNC_INTERVAL)

     // 网络恢复时同步
     uni.onNetworkStatusChange((res) => {
       if (res.isConnected) {
         store.dispatch('sync/syncData')
       }
     })
   }
   ```

## 性能优化

### 状态优化

1. **状态分割**
   ```js
   // 按功能模块分割状态
   const modules = {
     user: {
       namespaced: true,
       state: { /* 用户相关状态 */ }
     },
     app: {
       namespaced: true,
       state: { /* 应用相关状态 */ }
     },
     data: {
       namespaced: true,
       state: { /* 数据相关状态 */ }
     }
   }
   ```

2. **按需加载**
   ```js
   // 动态注册模块
   export function registerModule(store, moduleName) {
     if (!store.hasModule(['dynamic', moduleName])) {
       store.registerModule(['dynamic', moduleName], {
         namespaced: true,
         state: { /* 模块状态 */ }
       })
     }
   }
   ```

### 更新优化

1. **批量更新**
   ```js
   // 批量更新状态
   const mutations = {
     BATCH_UPDATE(state, updates) {
       Object.keys(updates).forEach(key => {
         state[key] = updates[key]
       })
     }
   }

   const actions = {
     batchUpdate({ commit }, updates) {
       commit('BATCH_UPDATE', updates)
     }
   }
   ```

2. **防抖更新**
   ```js
   // 防抖更新
   import { debounce } from 'lodash-es'

   const actions = {
     updateUserInfo: debounce(({ commit }, userInfo) => {
       commit('SET_USER_INFO', userInfo)
     }, 300)
   }
   ```

## 最佳实践

### 状态设计

1. **状态规划**
   - 合理划分模块
   - 避免状态冗余
   - 保持状态扁平

2. **状态访问**
   - 使用 getter 访问派生状态
   - 通过 action 修改状态
   - 避免直接修改状态

3. **状态同步**
   - 及时同步数据
   - 处理同步冲突
   - 保证数据一致性

### 开发建议

1. **代码组织**
   - 模块化组织
   - 统一命名规范
   - 清晰的文件结构

2. **类型安全**
   - 使用 TypeScript
   - 定义接口类型
   - 类型检查

3. **测试策略**
   - 单元测试
   - 集成测试
   - 状态快照

### 注意事项

1. **性能考虑**
   - 避免大状态
   - 合理使用计算属性
   - 及时清理无用状态

2. **安全考虑**
   - 敏感数据加密
   - 状态访问控制
   - 数据验证

3. **兼容问题**
   - 平台差异处理
   - 版本兼容性
   - 降级方案 