# Vue 2 项目部署指南

## 1. 构建配置

### 1.1 基础构建配置

```javascript
// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/your-project/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}
```

### 1.2 环境变量配置

```bash
# .env.production
NODE_ENV=production
VUE_APP_BASE_API=/api
VUE_APP_UPLOAD_URL=/upload
```

## 2. 部署流程

### 2.1 构建命令

```json
{
  "scripts": {
    "build:prod": "vue-cli-service build --mode production",
    "build:stage": "vue-cli-service build --mode staging",
    "build:report": "vue-cli-service build --report"
  }
}
```

### 2.2 Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/your/dist;
    index index.html;

    # gzip 配置
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 9;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    # 缓存配置
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 7d;
    }

    # 路由配置
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://your-backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 3. CI/CD 配置

### 3.1 GitLab CI 配置

```yaml
# .gitlab-ci.yml
stages:
  - install
  - build
  - deploy

install:
  stage: install
  script:
    - npm install
  cache:
    paths:
      - node_modules/

build:
  stage: build
  script:
    - npm run build:prod
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - rsync -avz --delete dist/ user@server:/path/to/deploy/
  only:
    - master
```

### 3.2 Jenkins 配置

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build:prod'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'rsync -avz --delete dist/ user@server:/path/to/deploy/'
            }
        }
    }
}
```

## 4. 监控与日志

### 4.1 性能监控

```javascript
// 性能监控配置
export const performance = {
  init() {
    // 页面加载性能
    window.addEventListener('load', () => {
      const timing = performance.timing
      const metrics = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseEnd - timing.requestStart,
        dom: timing.domComplete - timing.domInteractive,
        load: timing.loadEventEnd - timing.navigationStart
      }
      // 上报性能数据
      this.report(metrics)
    })
  },

  report(data) {
    // 上报逻辑
  }
}
```

### 4.2 错误监控

```javascript
// 错误监控配置
export const errorMonitor = {
  init() {
    // 全局错误
    window.onerror = (message, source, lineno, colno, error) => {
      this.report({
        type: 'error',
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
  },

  report(data) {
    // 上报逻辑
  }
}
```

## 5. 回滚策略

### 5.1 版本管理

```bash
# 版本回滚脚本
#!/bin/bash
VERSION=$1
BACKUP_DIR="/path/to/backups"
DEPLOY_DIR="/path/to/deploy"

# 备份当前版本
cp -r $DEPLOY_DIR $BACKUP_DIR/$(date +%Y%m%d_%H%M%S)

# 回滚到指定版本
cp -r $BACKUP_DIR/$VERSION/* $DEPLOY_DIR/
```

### 5.2 数据库回滚

```sql
-- 数据库回滚脚本
BEGIN TRANSACTION;

-- 回滚数据
UPDATE table_name SET column = old_value WHERE condition;

-- 确认无误后提交
COMMIT;
```

## 6. 相关资源

- [Vue CLI 部署指南](https://cli.vuejs.org/zh/guide/deployment.html)
- [Nginx 配置指南](https://nginx.org/en/docs/)
- [Jenkins 文档](https://www.jenkins.io/doc/)
- [GitLab CI/CD 文档](https://docs.gitlab.com/ee/ci/) 