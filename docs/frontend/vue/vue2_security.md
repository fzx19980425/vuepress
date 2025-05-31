# Vue 2 安全最佳实践指南

## 1. XSS 防护

### 1.1 输入过滤

```javascript
// utils/security.js
export const security = {
  // HTML 转义
  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  },

  // 富文本过滤
  sanitizeHtml(html) {
    const allowedTags = ['p', 'br', 'strong', 'em', 'a']
    const allowedAttrs = ['href', 'target']
    
    return html.replace(/<[^>]*>/g, tag => {
      const tagName = tag.match(/<\/?([a-z]+)/i)?.[1]
      if (!allowedTags.includes(tagName)) {
        return ''
      }
      
      const attrs = tag.match(/([a-z-]+)="([^"]*)"/gi) || []
      const filteredAttrs = attrs
        .filter(attr => {
          const [name] = attr.split('=')
          return allowedAttrs.includes(name)
        })
        .join(' ')
      
      return `<${tagName} ${filteredAttrs}>`
    })
  }
}
```

### 1.2 输出编码

```vue
<!-- components/SafeContent.vue -->
<template>
  <div v-html="sanitizedContent"></div>
</template>

<script>
import { security } from '@/utils/security'

export default {
  name: 'SafeContent',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    sanitizedContent() {
      return security.sanitizeHtml(this.content)
    }
  }
}
</script>
```

## 2. CSRF 防护

### 2.1 Token 验证

```javascript
// utils/request.js
import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加 CSRF Token
    const token = document.querySelector('meta[name="csrf-token"]')?.content
    if (token) {
      config.headers['X-CSRF-Token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
```

### 2.2 同源验证

```javascript
// utils/security.js
export const security = {
  // 验证请求来源
  validateOrigin(origin) {
    const allowedOrigins = [
      'https://your-domain.com',
      'https://api.your-domain.com'
    ]
    return allowedOrigins.includes(origin)
  },

  // 设置安全响应头
  setSecurityHeaders(res) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Content-Security-Policy', "default-src 'self'")
  }
}
```

## 3. 数据加密

### 3.1 敏感数据加密

```javascript
// utils/crypto.js
import CryptoJS from 'crypto-js'

export const crypto = {
  // 加密密钥
  key: process.env.VUE_APP_CRYPTO_KEY,

  // 加密数据
  encrypt(data) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.key
    ).toString()
  },

  // 解密数据
  decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.key)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  },

  // 哈希密码
  hashPassword(password) {
    return CryptoJS.SHA256(password).toString()
  }
}
```

### 3.2 本地存储加密

```javascript
// utils/storage.js
import { crypto } from '@/utils/crypto'

export const storage = {
  // 加密存储
  set(key, value) {
    const encrypted = crypto.encrypt(value)
    localStorage.setItem(key, encrypted)
  },

  // 解密获取
  get(key) {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null
    return crypto.decrypt(encrypted)
  },

  // 删除数据
  remove(key) {
    localStorage.removeItem(key)
  }
}
```

## 4. 权限控制

### 4.1 路由权限

```javascript
// router/permission.js
import router from './index'
import store from '@/store'

const whiteList = ['/login', '/register', '/404']

router.beforeEach(async (to, from, next) => {
  const hasToken = store.getters.token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
```

### 4.2 按钮权限

```vue
<!-- components/PermissionButton.vue -->
<template>
  <el-button
    v-if="hasPermission"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'PermissionButton',
  props: {
    permission: {
      type: String,
      required: true
    }
  },
  computed: {
    hasPermission() {
      const permissions = this.$store.getters.permissions
      return permissions.includes(this.permission)
    }
  }
}
</script>
```

## 5. 安全配置

### 5.1 CSP 配置

```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://*.your-domain.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.your-domain.com;
">
```

### 5.2 安全响应头

```javascript
// server/middleware/security.js
export const securityMiddleware = (req, res, next) => {
  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  
  // 防止 MIME 类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // XSS 保护
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // 内容安全策略
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  
  // 引用策略
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // 权限策略
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()')
  
  next()
}
```

## 6. 安全审计

### 6.1 依赖检查

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "check-deps": "npx depcheck"
  }
}
```

### 6.2 代码扫描

```json
{
  "scripts": {
    "lint": "eslint --ext .js,.vue src",
    "lint:fix": "eslint --ext .js,.vue src --fix",
    "security-scan": "npx snyk test"
  }
}
```

## 7. 相关资源

- [Vue 安全指南](https://vuejs.org/guide/best-practices/security.html)
- [OWASP 安全指南](https://owasp.org/www-project-top-ten/)
- [CSP 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [安全响应头](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security) 