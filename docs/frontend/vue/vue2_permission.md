 # Vue 2 权限管理和角色管理

## 1. 权限管理

### 1.1 权限指令

```javascript
// directives/permission.js
import Vue from 'vue'

// 注册权限指令
Vue.directive('permission', {
  inserted(el, binding) {
    const { value } = binding
    const permissions = store.getters.permissions

    if (value && !permissions.includes(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})

// 使用示例
<template>
  <div>
    <button v-permission="'admin'">管理员按钮</button>
    <button v-permission="'user'">用户按钮</button>
  </div>
</template>
```

### 1.2 权限路由

```javascript
// router/permission.js
import router from './index'
import store from '@/store'
import { getToken } from '@/utils/auth'

const whiteList = ['/login', '/register'] // 白名单

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()

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
          
          // 动态添加路由
          router.addRoutes(accessRoutes)
          
          next({ ...to, replace: true })
        } catch (error) {
          // 移除 token 并跳转登录页
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

### 1.3 权限状态管理

```javascript
// store/modules/permission.js
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

// 过滤异步路由
function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 判断是否有权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

## 2. 角色管理

### 2.1 角色组件

```vue
<!-- components/RoleManagement.vue -->
<template>
  <div class="role-management">
    <!-- 角色列表 -->
    <el-table :data="roleList" border>
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template slot-scope="{ row }">
          <el-button 
            size="mini" 
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button 
            size="mini" 
            type="danger" 
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色编辑对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogVisible"
    >
      <el-form 
        ref="form" 
        :model="form" 
        :rules="rules" 
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
          />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="permissionTree"
            :data="permissionList"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="form.permissions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoleManagement',
  data() {
    return {
      roleList: [],
      permissionList: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        name: '',
        description: '',
        permissions: []
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.fetchRoleList()
    this.fetchPermissionList()
  },
  methods: {
    async fetchRoleList() {
      try {
        const { data } = await this.$api.role.getList()
        this.roleList = data
      } catch (error) {
        this.$message.error('获取角色列表失败')
      }
    },
    async fetchPermissionList() {
      try {
        const { data } = await this.$api.permission.getList()
        this.permissionList = data
      } catch (error) {
        this.$message.error('获取权限列表失败')
      }
    },
    handleEdit(row) {
      this.dialogTitle = '编辑角色'
      this.form = { ...row }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该角色?', '提示', {
          type: 'warning'
        })
        await this.$api.role.delete(row.id)
        this.$message.success('删除成功')
        this.fetchRoleList()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.form.validate()
        const permissions = this.$refs.permissionTree.getCheckedKeys()
        const data = {
          ...this.form,
          permissions
        }
        
        if (this.form.id) {
          await this.$api.role.update(data)
        } else {
          await this.$api.role.create(data)
        }
        
        this.$message.success('保存成功')
        this.dialogVisible = false
        this.fetchRoleList()
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>
```

### 2.2 角色状态管理

```javascript
// store/modules/role.js
const state = {
  roleList: [],
  currentRole: null
}

const mutations = {
  SET_ROLE_LIST: (state, roles) => {
    state.roleList = roles
  },
  SET_CURRENT_ROLE: (state, role) => {
    state.currentRole = role
  }
}

const actions = {
  // 获取角色列表
  async getRoleList({ commit }) {
    try {
      const { data } = await api.role.getList()
      commit('SET_ROLE_LIST', data)
      return data
    } catch (error) {
      throw error
    }
  },

  // 创建角色
  async createRole({ commit }, roleData) {
    try {
      const { data } = await api.role.create(roleData)
      return data
    } catch (error) {
      throw error
    }
  },

  // 更新角色
  async updateRole({ commit }, roleData) {
    try {
      const { data } = await api.role.update(roleData)
      return data
    } catch (error) {
      throw error
    }
  },

  // 删除角色
  async deleteRole({ commit }, roleId) {
    try {
      await api.role.delete(roleId)
    } catch (error) {
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

### 2.3 权限检查工具

```javascript
// utils/permission.js
import store from '@/store'

/**
 * 检查是否有权限
 * @param {string|Array} permission 权限标识或权限标识数组
 * @returns {boolean}
 */
export function hasPermission(permission) {
  const permissions = store.getters.permissions
  
  if (Array.isArray(permission)) {
    return permission.some(p => permissions.includes(p))
  }
  
  return permissions.includes(permission)
}

/**
 * 检查是否有角色
 * @param {string|Array} role 角色标识或角色标识数组
 * @returns {boolean}
 */
export function hasRole(role) {
  const roles = store.getters.roles
  
  if (Array.isArray(role)) {
    return role.some(r => roles.includes(r))
  }
  
  return roles.includes(role)
}

/**
 * 检查是否有任意权限
 * @param {Array} permissions 权限标识数组
 * @returns {boolean}
 */
export function hasAnyPermission(permissions) {
  return permissions.some(permission => hasPermission(permission))
}

/**
 * 检查是否有任意角色
 * @param {Array} roles 角色标识数组
 * @returns {boolean}
 */
export function hasAnyRole(roles) {
  return roles.some(role => hasRole(role))
}
```

### 2.4 权限组件

```vue
<!-- components/Permission.vue -->
<template>
  <div v-if="hasPermission">
    <slot></slot>
  </div>
</template>

<script>
import { hasPermission } from '@/utils/permission'

export default {
  name: 'Permission',
  props: {
    permission: {
      type: [String, Array],
      required: true
    }
  },
  computed: {
    hasPermission() {
      return hasPermission(this.permission)
    }
  }
}
</script>

<!-- 使用示例 -->
<template>
  <div>
    <permission permission="admin">
      <button>管理员操作</button>
    </permission>
    
    <permission :permission="['admin', 'editor']">
      <button>编辑操作</button>
    </permission>
  </div>
</template>
```

### 2.5 权限路由配置

```javascript
// router/index.js
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'setting',
      roles: ['admin']
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user'),
        name: 'User',
        meta: { title: '用户管理', roles: ['admin'] }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'Role',
        meta: { title: '角色管理', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', roles: ['admin', 'user'] }
      }
    ]
  }
]
```

## 3. 权限管理最佳实践

### 3.1 权限设计原则

1. **最小权限原则**
   - 只授予必要的权限
   - 定期审查权限分配
   - 及时回收不需要的权限

2. **权限粒度控制**
   - 页面级权限
   - 按钮级权限
   - 数据级权限

3. **权限继承关系**
   - 角色继承
   - 权限继承
   - 避免权限冲突

### 3.2 权限缓存处理

```javascript
// utils/auth.js
import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const PermissionKey = 'User-Permissions'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getPermissions() {
  return JSON.parse(localStorage.getItem(PermissionKey) || '[]')
}

export function setPermissions(permissions) {
  return localStorage.setItem(PermissionKey, JSON.stringify(permissions))
}

export function removePermissions() {
  return localStorage.removeItem(PermissionKey)
}
```

### 3.3 权限更新机制

```javascript
// store/modules/user.js
const actions = {
  // 获取用户信息
  async getInfo({ commit, dispatch }) {
    try {
      const { data } = await api.user.getInfo()
      const { roles, permissions } = data
      
      // 设置角色和权限
      commit('SET_ROLES', roles)
      commit('SET_PERMISSIONS', permissions)
      
      // 生成可访问路由
      const accessRoutes = await dispatch('permission/generateRoutes', roles)
      
      // 动态添加路由
      router.addRoutes(accessRoutes)
      
      return data
    } catch (error) {
      throw error
    }
  },
  
  // 更新权限
  async updatePermissions({ commit, dispatch }) {
    try {
      const { data } = await api.user.getPermissions()
      commit('SET_PERMISSIONS', data)
      
      // 重新生成路由
      const { roles } = this.state.user
      const accessRoutes = await dispatch('permission/generateRoutes', roles)
      
      // 重置路由
      router.matcher = new VueRouter({
        routes: constantRoutes
      }).matcher
      
      // 添加新路由
      router.addRoutes(accessRoutes)
      
      return data
    } catch (error) {
      throw error
    }
  }
}
```

## 4. 相关资源

- [Vue 2 权限管理最佳实践](https://v2.vuejs.org/v2/guide/security.html)
- [Vue Router 权限控制](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)
- [Vuex 状态管理](https://vuex.vuejs.org/zh/)
- [Element UI 权限组件](https://element.eleme.cn/#/zh-CN/component/permission)