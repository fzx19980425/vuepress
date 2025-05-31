 # Electron 安全模型

## 安全模型概述

### 进程模型
1. 主进程
   - 系统级权限
   - 访问 Node.js API
   - 管理应用生命周期
   - 控制窗口创建

2. 渲染进程
   - 受限的 Node.js 访问
   - 通过 IPC 与主进程通信
   - 运行 Web 内容
   - 沙箱环境

### 安全边界
1. 进程间通信 (IPC)
   - 主进程和渲染进程的通信桥梁
   - 需要显式定义通信接口
   - 可以限制通信范围

2. 上下文隔离
   - 预加载脚本作为桥梁
   - 防止直接访问 Node.js API
   - 保护全局对象

## 安全最佳实践

### 1. 启用上下文隔离
```javascript
// main.js
const mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### 2. 使用预加载脚本
```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 只暴露必要的方法
  sendMessage: (message) => ipcRenderer.send('message', message),
  onResponse: (callback) => ipcRenderer.on('response', callback),
  // 添加参数验证
  saveFile: async (data) => {
    if (typeof data !== 'string') {
      throw new Error('Invalid data type');
    }
    return ipcRenderer.invoke('save-file', data);
  }
});
```

### 3. 实现 CSP
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
">
```

### 4. 禁用远程内容
```javascript
// main.js
const mainWindow = new BrowserWindow({
  webPreferences: {
    webSecurity: true,
    allowRunningInsecureContent: false
  }
});

// 限制导航
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  // 只允许特定域名
  if (url.startsWith('https://example.com')) {
    return { action: 'allow' };
  }
  return { action: 'deny' };
});
```

## 常见安全问题

### 1. XSS 防护
1. 输入验证：
```javascript
// 验证用户输入
function sanitizeInput(input) {
  return input.replace(/[<>'"]/g, '');
}

// 使用安全的模板引擎
const template = Handlebars.compile(templateString);
const safeHtml = template(sanitizedData);
```

2. 输出编码：
```javascript
// HTML 编码
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

### 2. 远程代码执行防护
1. 禁用 eval：
```javascript
// 在 webPreferences 中禁用
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false
  }
});
```

2. 限制模块加载：
```javascript
// 白名单方式加载模块
const allowedModules = new Set(['fs', 'path']);

function requireModule(moduleName) {
  if (!allowedModules.has(moduleName)) {
    throw new Error(`Module ${moduleName} is not allowed`);
  }
  return require(moduleName);
}
```

### 3. 文件系统安全
1. 限制文件访问：
```javascript
// 使用 dialog 选择文件
const { dialog } = require('electron');

async function selectFile() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Images', extensions: ['jpg', 'png'] }
    ]
  });
  
  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
}
```

2. 路径验证：
```javascript
const path = require('path');

function isPathSafe(filePath) {
  // 检查路径是否在应用目录内
  const appPath = app.getAppPath();
  const normalizedPath = path.normalize(filePath);
  return normalizedPath.startsWith(appPath);
}
```

### 4. 网络安全
1. 限制网络请求：
```javascript
// 使用 session 过滤请求
session.defaultSession.webRequest.onBeforeRequest({
  urls: ['*://*/*']
}, (details, callback) => {
  // 只允许特定域名
  if (details.url.startsWith('https://api.example.com')) {
    callback({ cancel: false });
  } else {
    callback({ cancel: true });
  }
});
```

2. 证书验证：
```javascript
// 自定义证书验证
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // 只信任特定证书
  if (certificate.fingerprint === 'expected-fingerprint') {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});
```

## 安全配置检查

### 1. 开发环境检查
```javascript
// 检查安全配置
function checkSecurityConfig() {
  const win = BrowserWindow.getFocusedWindow();
  const webPreferences = win.webContents.getWebPreferences();
  
  const securityChecks = {
    contextIsolation: webPreferences.contextIsolation,
    nodeIntegration: !webPreferences.nodeIntegration,
    webSecurity: webPreferences.webSecurity,
    allowRunningInsecureContent: !webPreferences.allowRunningInsecureContent
  };
  
  console.log('安全配置检查：', securityChecks);
  return Object.values(securityChecks).every(Boolean);
}
```

### 2. 生产环境检查
```javascript
// 检查生产环境配置
function checkProductionConfig() {
  if (process.env.NODE_ENV === 'production') {
    // 禁用开发者工具
    app.on('browser-window-created', (_, window) => {
      window.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'r') {
          event.preventDefault();
        }
      });
    });
    
    // 禁用远程调试
    app.commandLine.appendSwitch('disable-remote-fonts');
    app.commandLine.appendSwitch('disable-remote-playback-api');
  }
}
```

## 安全更新

### 1. 自动更新
```javascript
const { autoUpdater } = require('electron-updater');

// 配置自动更新
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'your-username',
  repo: 'your-repo'
});

// 检查更新
autoUpdater.checkForUpdatesAndNotify();

// 处理更新事件
autoUpdater.on('update-available', () => {
  // 通知用户
});

autoUpdater.on('update-downloaded', () => {
  // 提示安装
});
```

### 2. 更新验证
```javascript
// 验证更新包
const crypto = require('crypto');

function verifyUpdate(filePath, expectedHash) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', data => hash.update(data));
    stream.on('end', () => {
      const fileHash = hash.digest('hex');
      resolve(fileHash === expectedHash);
    });
    stream.on('error', reject);
  });
}
```

## 安全审计

### 1. 依赖检查
```bash
# 使用 npm audit 检查依赖
npm audit

# 使用 Snyk 检查
npx snyk test

# 使用 OWASP Dependency Check
npm install -g dependency-check
dependency-check ./package.json
```

### 2. 代码扫描
```bash
# 使用 ESLint 安全规则
npm install eslint-plugin-security --save-dev

# 配置 .eslintrc
{
  "plugins": ["security"],
  "extends": ["plugin:security/recommended"]
}
```

## 相关资源

- [Electron 安全文档](https://www.electronjs.org/docs/latest/tutorial/security)
- [OWASP 安全指南](https://owasp.org/www-project-top-ten/)
- [Node.js 安全最佳实践](https://nodejs.org/en/docs/guides/security/)
- [CSP 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)