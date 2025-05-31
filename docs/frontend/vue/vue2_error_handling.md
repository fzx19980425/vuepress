# Vue 2 错误处理指南

## 1. 全局错误处理

### 1.1 Vue 错误处理

```javascript
// main.js
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Error Info:', info)
  // 错误上报
  errorHandler.report({
    type: 'vue',
    error: err,
    info,
    component: vm.$options.name
  })
}
```

### 1.2 全局错误捕获

```javascript
// utils/errorHandler.js
export const errorHandler = {
  init() {
    // 全局错误
    window.onerror = (message, source, lineno, colno, error) => {
      this.report({
        type: 'global',
        message,
        source,
        lineno,
        colno,
        error: error?.stack
      })
    }

    // Promise 错误
    window.addEventListener('unhandledrejection', event => {
      this.report({
        type: 'promise',
        message: event.reason
      })
    })

    // 资源加载错误
    window.addEventListener('error', event => {
      if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT')) {
        this.report({
          type: 'resource',
          element: event.target.tagName,
          url: event.target.src || event.target.href
        })
      }
    }, true)
  },

  report(data) {
    // 错误上报逻辑
  }
}
```

## 2. 组件错误处理

### 2.1 错误边界组件

```vue
<!-- components/ErrorBoundary.vue -->
<template>
  <div>
    <slot v-if="!error"></slot>
    <div v-else class="error-boundary">
      <h3>出错了</h3>
      <p>{{ error.message }}</p>
      <button @click="handleRetry">重试</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      error: null
    }
  },
  errorCaptured(err, vm, info) {
    this.error = err
    return false // 阻止错误继续传播
  },
  methods: {
    handleRetry() {
      this.error = null
      this.$emit('retry')
    }
  }
}
</script>
```

### 2.2 异步组件错误处理

```javascript
// 异步组件工厂函数
const AsyncComponent = () => ({
  component: import('./MyComponent.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000,
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      retry()
    } else {
      fail()
    }
  }
})
```

## 3. API 错误处理

### 3.1 Axios 拦截器

```javascript
// utils/request.js
import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 请求处理
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    console.error('Response Error:', error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
```

### 3.2 错误重试机制

```javascript
// utils/retry.js
export const retryRequest = (fn, retries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    const attempt = async (retriesLeft) => {
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        if (retriesLeft === 0) {
          reject(error)
          return
        }
        setTimeout(() => {
          attempt(retriesLeft - 1)
        }, delay)
      }
    }
    attempt(retries)
  })
}
```

## 4. 表单错误处理

### 4.1 表单验证错误

```vue
<!-- components/BaseForm.vue -->
<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleSubmit"
  >
    <el-form-item
      v-for="(item, index) in formItems"
      :key="index"
      :prop="item.prop"
      :label="item.label"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="form[item.prop]"
        :placeholder="item.placeholder"
      />
      <el-select
        v-else-if="item.type === 'select'"
        v-model="form[item.prop]"
        :placeholder="item.placeholder"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BaseForm',
  props: {
    formItems: {
      type: Array,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {}
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          this.$message.error('请检查表单填写是否正确')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
```

### 4.2 自定义验证规则

```javascript
// utils/validate.js
export const validateRules = {
  // 手机号验证
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号'
  },
  // 邮箱验证
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '请输入正确的邮箱地址'
  },
  // 身份证验证
  idCard: {
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message: '请输入正确的身份证号'
  }
}

// 自定义验证器
export const customValidator = (rule, value, callback) => {
  if (!value) {
    callback(new Error('必填项'))
  } else if (value.length < 6) {
    callback(new Error('长度不能小于6位'))
  } else {
    callback()
  }
}
```

## 5. 错误日志

### 5.1 日志收集

```javascript
// utils/logger.js
export const logger = {
  info(message, data) {
    console.info(`[INFO] ${message}`, data)
    this.save('info', message, data)
  },
  error(message, error) {
    console.error(`[ERROR] ${message}`, error)
    this.save('error', message, error)
  },
  warn(message, data) {
    console.warn(`[WARN] ${message}`, data)
    this.save('warn', message, data)
  },
  save(level, message, data) {
    const log = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }
    // 保存日志
    this.sendToServer(log)
  },
  sendToServer(log) {
    // 发送日志到服务器
  }
}
```

### 5.2 日志分析

```javascript
// utils/logAnalyzer.js
export const logAnalyzer = {
  analyze(logs) {
    const analysis = {
      total: logs.length,
      errors: logs.filter(log => log.level === 'error').length,
      warnings: logs.filter(log => log.level === 'warn').length,
      byType: this.groupByType(logs),
      byTime: this.groupByTime(logs)
    }
    return analysis
  },
  groupByType(logs) {
    return logs.reduce((acc, log) => {
      const type = log.message.split(':')[0]
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})
  },
  groupByTime(logs) {
    return logs.reduce((acc, log) => {
      const hour = new Date(log.timestamp).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {})
  }
}
```

## 6. 相关资源

- [Vue 错误处理指南](https://cn.vuejs.org/v2/api/#errorHandler)
- [Axios 错误处理](https://axios-http.com/docs/handling_errors)
- [Element UI 表单验证](https://element.eleme.cn/#/zh-CN/component/form)
- [前端错误监控](https://www.sentry.io/) 