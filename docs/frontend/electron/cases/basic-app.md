 # Electron 基础应用案例

## 应用概述

这是一个基础的 Electron 应用示例，展示了如何构建一个简单的桌面应用。该应用包含以下功能：

- 基本的窗口管理
- 简单的菜单系统
- 本地文件操作
- 基本的用户界面
- 简单的数据存储

## 项目结构

```
basic-app/
├── src/
│   ├── main/
│   │   ├── index.js          # 主进程入口
│   │   ├── window.js         # 窗口管理
│   │   ├── menu.js           # 菜单配置
│   │   └── ipc.js            # IPC 通信
│   ├── renderer/
│   │   ├── index.html        # 主页面
│   │   ├── index.js          # 渲染进程入口
│   │   ├── styles/
│   │   │   └── main.css      # 样式文件
│   │   └── components/
│   │       ├── Header.js     # 头部组件
│   │       ├── Sidebar.js    # 侧边栏组件
│   │       └── Content.js    # 内容组件
│   └── shared/
│       ├── constants.js      # 常量定义
│       └── utils.js          # 工具函数
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## 核心代码

### 1. 主进程入口

```javascript
// src/main/index.js
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { createWindow } = require('./window')
const { createMenu } = require('./menu')
const { setupIPC } = require('./ipc')

class MainProcess {
  constructor() {
    this.setupApp()
  }

  setupApp() {
    // 应用准备就绪
    app.whenReady().then(() => {
      // 创建主窗口
      this.mainWindow = createWindow()
      
      // 创建菜单
      createMenu(this.mainWindow)
      
      // 设置 IPC 通信
      setupIPC(this.mainWindow)
      
      // 处理窗口激活
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.mainWindow = createWindow()
        }
      })
    })
    
    // 处理所有窗口关闭
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }
}

// 启动应用
new MainProcess()
```

### 2. 窗口管理

```javascript
// src/main/window.js
const { BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  // 加载主页面
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  
  // 开发环境下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
  
  return mainWindow
}

module.exports = {
  createWindow
}
```

### 3. 菜单配置

```javascript
// src/main/menu.js
const { Menu } = require('electron')

function createMenu(mainWindow) {
  // 创建菜单模板
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu:new')
          }
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu:open')
          }
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu:save')
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            mainWindow.webContents.send('menu:about')
          }
        }
      ]
    }
  ]
  
  // 创建菜单
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = {
  createMenu
}
```

### 4. IPC 通信

```javascript
// src/main/ipc.js
const { ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')

function setupIPC(mainWindow) {
  // 处理文件打开
  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: '文本文件', extensions: ['txt'] },
        { name: '所有文件', extensions: ['*'] }
      ]
    })
    
    if (!canceled) {
      const content = fs.readFileSync(filePaths[0], 'utf-8')
      return { path: filePaths[0], content }
    }
    
    return null
  })
  
  // 处理文件保存
  ipcMain.handle('dialog:saveFile', async (event, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      filters: [
        { name: '文本文件', extensions: ['txt'] },
        { name: '所有文件', extensions: ['*'] }
      ]
    })
    
    if (!canceled) {
      fs.writeFileSync(filePath, content, 'utf-8')
      return filePath
    }
    
    return null
  })
  
  // 处理新建文件
  ipcMain.on('file:new', () => {
    mainWindow.webContents.send('file:new')
  })
  
  // 处理文件内容更新
  ipcMain.on('file:update', (event, content) => {
    // 更新文件内容
    mainWindow.webContents.send('file:updated', content)
  })
}

module.exports = {
  setupIPC
}
```

### 5. 渲染进程

```html
<!-- src/renderer/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>基础应用</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <div id="app">
    <header class="header">
      <h1>基础应用</h1>
    </header>
    
    <div class="container">
      <aside class="sidebar">
        <nav>
          <ul>
            <li><button id="newFile">新建文件</button></li>
            <li><button id="openFile">打开文件</button></li>
            <li><button id="saveFile">保存文件</button></li>
          </ul>
        </nav>
      </aside>
      
      <main class="content">
        <textarea id="editor" placeholder="在此输入内容..."></textarea>
      </main>
    </div>
  </div>
  
  <script src="index.js"></script>
</body>
</html>
```

```javascript
// src/renderer/index.js
const { ipcRenderer } = require('electron')

class RendererProcess {
  constructor() {
    this.setupUI()
    this.setupEvents()
  }
  
  setupUI() {
    // 获取 DOM 元素
    this.editor = document.getElementById('editor')
    this.newButton = document.getElementById('newFile')
    this.openButton = document.getElementById('openFile')
    this.saveButton = document.getElementById('saveFile')
  }
  
  setupEvents() {
    // 新建文件
    this.newButton.addEventListener('click', () => {
      this.editor.value = ''
      this.editor.focus()
    })
    
    // 打开文件
    this.openButton.addEventListener('click', async () => {
      const result = await ipcRenderer.invoke('dialog:openFile')
      if (result) {
        this.editor.value = result.content
      }
    })
    
    // 保存文件
    this.saveButton.addEventListener('click', async () => {
      const content = this.editor.value
      await ipcRenderer.invoke('dialog:saveFile', content)
    })
    
    // 监听菜单事件
    ipcRenderer.on('menu:new', () => {
      this.editor.value = ''
      this.editor.focus()
    })
    
    ipcRenderer.on('menu:open', async () => {
      const result = await ipcRenderer.invoke('dialog:openFile')
      if (result) {
        this.editor.value = result.content
      }
    })
    
    ipcRenderer.on('menu:save', async () => {
      const content = this.editor.value
      await ipcRenderer.invoke('dialog:saveFile', content)
    })
  }
}

// 启动渲染进程
new RendererProcess()
```

```css
/* src/renderer/styles/main.css */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 1rem;
  border-right: 1px solid #ddd;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar nav li {
  margin-bottom: 0.5rem;
}

.sidebar button {
  width: 100%;
  padding: 0.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.sidebar button:hover {
  background-color: #2980b9;
}

.content {
  flex: 1;
  padding: 1rem;
}

#editor {
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}

#editor:focus {
  outline: none;
  border-color: #3498db;
}
```

## 功能说明

### 1. 窗口管理
- 创建主窗口
- 设置窗口大小和位置
- 处理窗口事件（关闭、最小化等）
- 开发环境下的开发者工具

### 2. 菜单系统
- 文件菜单（新建、打开、保存、退出）
- 编辑菜单（撤销、重做、剪切、复制、粘贴）
- 视图菜单（刷新、缩放、全屏）
- 帮助菜单（关于）

### 3. 文件操作
- 新建文件
- 打开文件（支持文本文件）
- 保存文件
- 文件内容编辑

### 4. 用户界面
- 响应式布局
- 侧边栏导航
- 文本编辑器
- 基本样式和主题

### 5. 数据存储
- 本地文件存储
- 文件内容管理
- 简单的状态管理

## 开发说明

### 1. 环境要求
- Node.js 14.0.0 或更高版本
- npm 6.0.0 或更高版本
- Electron 12.0.0 或更高版本

### 2. 安装依赖
```bash
npm install
```

### 3. 开发模式
```bash
npm run dev
```

### 4. 构建应用
```bash
npm run build
```

### 5. 运行应用
```bash
npm start
```

## 注意事项

1. 安全性
   - 使用 `contextIsolation` 和 `preload` 脚本
   - 禁用 `nodeIntegration`
   - 限制文件访问权限

2. 性能
   - 使用异步操作处理文件
   - 优化窗口创建和销毁
   - 合理使用内存

3. 用户体验
   - 提供清晰的错误提示
   - 添加快捷键支持
   - 保持界面响应性

## 扩展建议

1. 功能扩展
   - 添加文件历史记录
   - 支持更多文件格式
   - 添加搜索和替换功能
   - 实现自动保存

2. 界面优化
   - 添加主题支持
   - 实现自定义布局
   - 添加快捷工具栏
   - 优化移动设备支持

3. 性能优化
   - 实现文件缓存
   - 优化大文件处理
   - 添加性能监控
   - 实现增量保存

## 相关资源

- [Electron 文档](https://www.electronjs.org/docs)
- [Electron 安全指南](https://www.electronjs.org/docs/tutorial/security)
- [Electron 性能指南](https://www.electronjs.org/docs/tutorial/performance)
- [Electron 打包指南](https://www.electronjs.org/docs/tutorial/application-distribution)