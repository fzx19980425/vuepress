# Vue 2 路由管理

## 1. 路由基础配置

### 1.1 基本配置

```javascript
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      keepAlive: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于',
      keepAlive: false
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

### 1.2 动态路由

```javascript
// 动态路由配置
const routes = [
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true // 将路由参数作为组件的 props
  },
  {
    path: '/article/:category/:id',
    name: 'Article',
    component: () => import('@/views/Article.vue'),
    props: route => ({
      category: route.params.category,
      id: route.params.id
    })
  }
]
```

### 1.3 嵌套路由

```javascript
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('@/views/dashboard/Home.vue')
      },
      {
        path: 'profile',
        name: 'DashboardProfile',
        component: () => import('@/views/dashboard/Profile.vue')
      },
      {
        path: 'settings',
        name: 'DashboardSettings',
        component: () => import('@/views/dashboard/Settings.vue')
      }
    ]
  }
]
```

## 2. 路由守卫

### 2.1 全局守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '默认标题'
  
  // 权限验证
  const token = localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
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

// 全局后置守卫
router.afterEach((to, from) => {
  // 路由切换后的操作
  window.scrollTo(0, 0)
})
```

### 2.2 路由独享守卫

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      // 检查用户权限
      if (hasAdminPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

### 2.3 组件内守卫

```javascript
export default {
  name: 'UserProfile',
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this`
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    this.userData = null
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    const answer = window.confirm('确定要离开吗？未保存的数据将会丢失')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}
```

## 3. 路由懒加载

### 3.1 基础懒加载

```javascript
// 使用动态导入
const routes = [
  {
    path: '/about',
    component: () => import('@/views/About.vue')
  }
]
```

### 3.2 分组懒加载

```javascript
// 将多个路由打包到同一个 chunk
const routes = [
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    children: [
      {
        path: 'profile',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Profile.vue')
      },
      {
        path: 'settings',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Settings.vue')
      }
    ]
  }
]
```

## 4. 路由权限控制

### 4.1 基于角色的权限控制

```javascript
// router/permission.js
import router from './index'
import store from '@/store'

const whiteList = ['/login', '/register', '/404', '/403']

router.beforeEach(async (to, from, next) => {
  const hasToken = localStorage.getItem('token')
  
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          const { roles } = await store.dispatch('user/getInfo')
          
          // 根据角色生成可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)
          
          next({ ...to, replace: true })
        } catch (error) {
          // 清除 token 并跳转到登录页
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
```

### 4.2 权限指令

```javascript
// directives/permission.js
import store from '@/store'

export default {
  inserted(el, binding) {
    const { value } = binding
    const roles = store.getters.roles

    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = roles.some(role => value.includes(role))
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
```

## 5. 路由跳转和参数传递

### 5.1 编程式导航

```javascript
// 基础跳转
this.$router.push('/home')

// 带参数跳转
this.$router.push({
  name: 'User',
  params: { id: 123 }
})

// 带查询参数跳转
this.$router.push({
  path: '/user',
  query: { id: 123 }
})

// 替换当前路由
this.$router.replace('/home')

// 返回上一页
this.$router.back()
```

### 5.2 路由参数获取

```javascript
export default {
  // 通过 props 获取参数
  props: ['id'],
  
  // 通过 $route 获取参数
  created() {
    const id = this.$route.params.id
    const query = this.$route.query
  },
  
  // 监听路由参数变化
  watch: {
    '$route'(to, from) {
      // 路由参数变化时的处理
    }
  }
}
```

## 6. 最佳实践

### 6.1 路由配置管理

```javascript
// router/modules/user.js
export default {
  path: '/user',
  component: () => import('@/views/user/index.vue'),
  meta: {
    title: '用户管理',
    icon: 'user'
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/user/list.vue'),
      meta: {
        title: '用户列表',
        keepAlive: true
      }
    },
    {
      path: 'detail/:id',
      name: 'UserDetail',
      component: () => import('@/views/user/detail.vue'),
      meta: {
        title: '用户详情',
        activeMenu: '/user/list'
      }
    }
  ]
}

// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import userRoutes from './modules/user'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  userRoutes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

### 6.2 路由缓存控制

```javascript
// App.vue
<template>
  <div id="app">
    <keep-alive :include="cachedViews">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState({
      cachedViews: state => state.tagsView.cachedViews
    })
  }
}
</script>
```

### 6.3 路由错误处理

```javascript
// router/index.js
const router = new VueRouter({
  routes: [
    // ... 其他路由配置
    {
      path: '/404',
      component: () => import('@/views/error/404.vue')
    },
    {
      path: '/403',
      component: () => import('@/views/error/403.vue')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

// 全局路由错误处理
router.onError((error) => {
  console.error('路由错误：', error)
  router.push('/404')
})
```

## 7. 常见问题解决方案

### 7.1 路由重复导航问题

```javascript
// 解决重复导航问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}
```

### 7.2 路由切换动画

```vue
<template>
  <transition name="fade" mode="out-in">
    <router-view />
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 7.3 路由加载进度条

```javascript
// 使用 nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
```

## 8. 相关资源

- [Vue Router 官方文档](https://router.vuejs.org/zh/)
- [Vue Router 导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)
- [Vue Router 路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html) 