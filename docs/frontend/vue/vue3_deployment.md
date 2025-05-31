 # Vue 3 项目部署

Vue 3 推荐使用 Vite 作为构建工具，支持更快的开发和构建体验。这里对照 Vue2，介绍 Vue3 的部署流程。

## 1. 构建配置

### 1.1 Vite 配置

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false
  }
})
```

### 1.2 环境变量

```env
# .env.production
VITE_API_BASE_URL=/api
```

## 2. 部署流程

### 2.1 构建命令

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 2.2 Nginx 配置

（同 Vue2，注意静态资源路径）

### 2.3 CI/CD

- 推荐使用 GitHub Actions、GitLab CI、Jenkins 等自动化部署

## 3. 监控与日志
- 推荐 Sentry、阿里云前端监控等

## 4. 回滚策略
- 版本管理、静态资源备份

## 5. 相关资源
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Vue3 部署指南](https://cn.vuejs.org/guide/best-practices/production-deployment.html)