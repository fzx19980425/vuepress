# 安全最佳实践

## 常见安全威胁

### 1. XSS（跨站脚本攻击）

```javascript
// 不安全的代码
function displayUserInput(input) {
    // 错误：直接插入用户输入
    document.getElementById('output').innerHTML = input;
}

// 安全的代码
function displayUserInput(input) {
    // 正确：使用 textContent 或转义
    const output = document.getElementById('output');
    output.textContent = input;
    
    // 或者使用 HTML 转义
    output.innerHTML = escapeHtml(input);
}

// HTML 转义函数
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```

### 2. CSRF（跨站请求伪造）

```javascript
// 不安全的代码
fetch('/api/transfer', {
    method: 'POST',
    body: JSON.stringify({
        amount: 1000,
        to: 'attacker'
    })
});

// 安全的代码
// 1. 使用 CSRF Token
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch('/api/transfer', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({
        amount: 1000,
        to: 'recipient'
    })
});

// 2. 使用 SameSite Cookie
// 在服务器端设置
// Set-Cookie: sessionId=abc123; SameSite=Strict
```

### 3. 点击劫持

```html
<!-- 不安全的代码 -->
<!-- 允许在 iframe 中嵌入 -->
<meta name="X-Frame-Options" content="ALLOW-FROM *">

<!-- 安全的代码 -->
<!-- 禁止在 iframe 中嵌入 -->
<meta name="X-Frame-Options" content="DENY">
<!-- 或者使用 CSP -->
<meta http-equiv="Content-Security-Policy" content="frame-ancestors 'none'">
```

## 数据安全

### 1. 敏感数据处理

```javascript
// 不安全的代码
// 在 URL 中传递敏感数据
window.location.href = `/user/profile?token=${userToken}`;

// 安全的代码
// 使用 POST 请求和 HTTPS
async function fetchUserProfile() {
    const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        credentials: 'same-origin'
    });
    return response.json();
}

// 密码处理
async function hashPassword(password) {
    // 使用 Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
```

### 2. 本地存储安全

```javascript
// 不安全的代码
// 在 localStorage 中存储敏感数据
localStorage.setItem('userToken', token);

// 安全的代码
// 使用 sessionStorage（会话结束时清除）
sessionStorage.setItem('userToken', token);

// 或者使用 HttpOnly Cookie
// 在服务器端设置
// Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict

// 加密存储
async function secureStorage(key, value) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        data
    );
    localStorage.setItem(key, JSON.stringify({
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encrypted))
    }));
}
```

## 安全编码实践

### 1. 输入验证

```javascript
// 不安全的代码
function processUserInput(input) {
    // 直接使用用户输入
    eval(input);
}

// 安全的代码
function validateInput(input, schema) {
    // 使用验证库（如 Joi、Yup）
    const { error, value } = schema.validate(input);
    if (error) {
        throw new Error('输入验证失败');
    }
    return value;
}

// 示例：使用 Joi
const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(0).max(150)
});

function validateUser(userData) {
    return userSchema.validate(userData);
}
```

### 2. 输出编码

```javascript
// 不安全的代码
function displayUserData(user) {
    document.getElementById('userInfo').innerHTML = `
        <div>用户名：${user.name}</div>
        <div>邮箱：${user.email}</div>
    `;
}

// 安全的代码
function displayUserData(user) {
    const userInfo = document.getElementById('userInfo');
    const nameDiv = document.createElement('div');
    const emailDiv = document.createElement('div');
    
    nameDiv.textContent = `用户名：${user.name}`;
    emailDiv.textContent = `邮箱：${user.email}`;
    
    userInfo.appendChild(nameDiv);
    userInfo.appendChild(emailDiv);
}

// 使用模板引擎（如 Handlebars）
const template = Handlebars.compile(`
    <div>用户名：{{name}}</div>
    <div>邮箱：{{email}}</div>
`);

function displayUserData(user) {
    document.getElementById('userInfo').innerHTML = template({
        name: Handlebars.escapeExpression(user.name),
        email: Handlebars.escapeExpression(user.email)
    });
}
```

### 3. 安全配置

```javascript
// 不安全的代码
// 暴露敏感配置
const config = {
    apiKey: 'secret-key',
    database: {
        host: 'localhost',
        password: 'db-password'
    }
};

// 安全的代码
// 使用环境变量
const config = {
    apiKey: process.env.API_KEY,
    database: {
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD
    }
};

// 使用配置文件
// config.js
module.exports = {
    development: {
        apiUrl: 'http://localhost:3000',
        debug: true
    },
    production: {
        apiUrl: 'https://api.example.com',
        debug: false
    }
}[process.env.NODE_ENV || 'development'];
```

## 安全最佳实践

### 1. 内容安全策略（CSP）

```html
<!-- 配置 CSP -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted-cdn.com;
    style-src 'self' 'unsafe-inline' https://trusted-cdn.com;
    img-src 'self' data: https://trusted-cdn.com;
    connect-src 'self' https://api.example.com;
    font-src 'self' https://trusted-cdn.com;
    object-src 'none';
    media-src 'self';
    frame-src 'none';
">
```

### 2. 安全头部

```javascript
// 在服务器端设置安全头部
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.example.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

### 3. 安全依赖管理

```json
// package.json
{
    "scripts": {
        "audit": "npm audit",
        "audit:fix": "npm audit fix",
        "outdated": "npm outdated"
    },
    "dependencies": {
        "express": "^4.17.1",
        "helmet": "^4.6.0"
    },
    "devDependencies": {
        "snyk": "^1.0.0"
    }
}
```

## 安全测试

### 1. 自动化安全测试

```javascript
// 使用 OWASP ZAP 进行安全测试
// zap-cli quick-scan --self-contained --start-options "-config api.disablekey=true" http://localhost:3000

// 使用 Snyk 进行依赖检查
// snyk test

// 使用 ESLint 安全插件
// .eslintrc.js
module.exports = {
    plugins: [
        'security'
    ],
    extends: [
        'plugin:security/recommended'
    ],
    rules: {
        'security/detect-object-injection': 'error',
        'security/detect-non-literal-regexp': 'error',
        'security/detect-unsafe-regex': 'error'
    }
};
```

### 2. 手动安全测试

```javascript
// XSS 测试
const xssTests = [
    '<script>alert(1)</script>',
    '"><script>alert(1)</script>',
    '"><img src=x onerror=alert(1)>',
    'javascript:alert(1)'
];

// CSRF 测试
// 1. 检查是否使用 CSRF Token
// 2. 验证 Token 是否正确
// 3. 测试 Token 过期处理

// 点击劫持测试
// 1. 检查 X-Frame-Options 头部
// 2. 验证 CSP frame-ancestors 指令
```

## 安全监控和响应

### 1. 错误监控

```javascript
// 使用 Sentry 进行错误监控
Sentry.init({
    dsn: "https://example@sentry.io/123",
    environment: process.env.NODE_ENV,
    release: process.env.VERSION,
    beforeSend(event) {
        // 过滤敏感信息
        if (event.user) {
            delete event.user.email;
        }
        return event;
    }
});

// 自定义错误处理
window.onerror = function(message, source, lineno, colno, error) {
    // 记录错误
    Sentry.captureException(error);
    // 阻止默认错误处理
    return true;
};
```

### 2. 安全日志

```javascript
// 记录安全事件
function logSecurityEvent(event) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event: event.type,
        user: event.user,
        ip: event.ip,
        userAgent: event.userAgent,
        details: event.details
    };
    
    // 发送到日志服务器
    fetch('/api/logs/security', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
    });
}

// 使用示例
logSecurityEvent({
    type: 'login_failure',
    user: 'username',
    ip: '192.168.1.1',
    userAgent: navigator.userAgent,
    details: 'Invalid password'
});
```

## 最佳实践总结

1. 始终验证和清理用户输入
2. 使用 HTTPS 传输数据
3. 实施适当的内容安全策略
4. 保护敏感数据
5. 定期更新依赖
6. 进行安全测试
7. 监控安全事件
8. 保持安全日志

## 相关资源

- [OWASP 安全指南](https://owasp.org/www-project-top-ten/)
- [MDN 安全指南](https://developer.mozilla.org/zh-CN/docs/Web/Security)
- [Content Security Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
- [Web 安全最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/Security/Securing_your_site) 