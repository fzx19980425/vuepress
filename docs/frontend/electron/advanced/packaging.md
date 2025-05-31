 # Electron 打包与发布指南

## 打包类型

Electron 应用打包主要包括以下几种方式：

### 1. 基础打包
- 应用打包
- 资源打包
- 依赖打包
- 配置打包

### 2. 平台打包
- Windows 打包
- macOS 打包
- Linux 打包
- 跨平台打包

### 3. 发布打包
- 自动更新
- 代码签名
- 安装程序
- 分发渠道

## 基础打包

### 1. 使用 electron-builder
```javascript
// package.json
{
  "name": "your-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.your.app",
    "productName": "Your App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
      "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
      "!**/node_modules/*.d.ts",
      "!**/node_modules/.bin",
      "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
      "!.editorconfig",
      "!**/._*",
      "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
      "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
      "!**/{appveyor.yml,.travis.yml,circle.yml}",
      "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}"
    ],
    "win": {
      "target": [
        "nsis",
        "portable"
      ],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": [
        "dmg",
        "zip"
      ],
      "icon": "build/icon.icns"
    },
    "linux": {
      "target": [
        "AppImage",
        "deb"
      ],
      "icon": "build/icon.png"
    }
  }
}
```

### 2. 使用 electron-forge
```javascript
// package.json
{
  "name": "your-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make"
  },
  "config": {
    "forge": {
      "packagerConfig": {
        "icon": "build/icon",
        "asar": true
      },
      "makers": [
        {
          "name": "@electron-forge/maker-squirrel",
          "config": {
            "name": "your_app"
          }
        },
        {
          "name": "@electron-forge/maker-zip",
          "platforms": [
            "darwin"
          ]
        },
        {
          "name": "@electron-forge/maker-deb",
          "config": {}
        },
        {
          "name": "@electron-forge/maker-rpm",
          "config": {}
        }
      ]
    }
  }
}
```

## 平台打包

### 1. Windows 打包
```javascript
// electron-builder 配置
{
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": [
          "x64"
        ]
      },
      {
        "target": "portable",
        "arch": [
          "x64"
        ]
      }
    ],
    "icon": "build/icon.ico",
    "requestedExecutionLevel": "asInvoker",
    "artifactName": "${productName}-Setup-${version}.${ext}",
    "publisherName": "Your Company",
    "verifyUpdateCodeSignature": false
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "Your App",
    "uninstallDisplayName": "Your App",
    "installerIcon": "build/installer.ico",
    "uninstallerIcon": "build/uninstaller.ico",
    "installerHeaderIcon": "build/installer.ico",
    "menuCategory": true,
    "deleteAppDataOnUninstall": false
  }
}
```

### 2. macOS 打包
```javascript
// electron-builder 配置
{
  "mac": {
    "target": [
      "dmg",
      "zip"
    ],
    "icon": "build/icon.icns",
    "category": "public.app-category.utilities",
    "darkModeSupport": true,
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist",
    "extendInfo": {
      "NSMicrophoneUsageDescription": "需要访问麦克风",
      "NSCameraUsageDescription": "需要访问摄像头",
      "NSPhotoLibraryUsageDescription": "需要访问照片库"
    }
  },
  "dmg": {
    "contents": [
      {
        "x": 130,
        "y": 220
      },
      {
        "x": 410,
        "y": 220,
        "type": "link",
        "path": "/Applications"
      }
    ],
    "window": {
      "width": 540,
      "height": 380
    },
    "icon": "build/icon.icns",
    "iconSize": 128,
    "backgroundColor": "#ffffff"
  }
}
```

### 3. Linux 打包
```javascript
// electron-builder 配置
{
  "linux": {
    "target": [
      "AppImage",
      "deb",
      "rpm"
    ],
    "icon": "build/icon.png",
    "category": "Utility",
    "maintainer": "Your Name",
    "vendor": "Your Company",
    "synopsis": "Your App Description",
    "description": "Detailed description of your app",
    "mimeTypes": [
      "application/x-your-app"
    ],
    "desktop": {
      "Name": "Your App",
      "Comment": "Your App Description",
      "Type": "Application",
      "Categories": "Utility;",
      "StartupWMClass": "Your App"
    }
  },
  "deb": {
    "depends": [
      "gconf2",
      "gconf-service",
      "libnotify4",
      "libxtst6",
      "libnss3"
    ],
    "packageCategory": "utils",
    "priority": "optional"
  },
  "AppImage": {
    "artifactName": "${productName}-${version}.${ext}",
    "category": "Utility"
  }
}
```

## 发布打包

### 1. 自动更新
```javascript
// 主进程
const { autoUpdater } = require('electron-updater')

// 配置自动更新
function setupAutoUpdater() {
  // 检查更新
  autoUpdater.checkForUpdatesAndNotify()
  
  // 更新事件
  autoUpdater.on('checking-for-update', () => {
    console.log('检查更新...')
  })
  
  autoUpdater.on('update-available', (info) => {
    console.log('发现新版本:', info)
  })
  
  autoUpdater.on('update-not-available', (info) => {
    console.log('当前已是最新版本:', info)
  })
  
  autoUpdater.on('error', (err) => {
    console.error('更新错误:', err)
  })
  
  autoUpdater.on('download-progress', (progressObj) => {
    console.log('下载进度:', progressObj)
  })
  
  autoUpdater.on('update-downloaded', (info) => {
    console.log('更新已下载:', info)
    // 安装更新
    autoUpdater.quitAndInstall()
  })
}

// package.json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "your-repo",
      "private": true,
      "releaseType": "release"
    }
  }
}
```

### 2. 代码签名
```javascript
// Windows 签名
{
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "password",
    "signAndEditExecutable": true,
    "verifyUpdateCodeSignature": true
  }
}

// macOS 签名
{
  "mac": {
    "identity": "Developer ID Application: Your Name (Team ID)",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
}

// 签名脚本
const { exec } = require('child_process')

// Windows 签名
function signWindows() {
  exec('signtool sign /f certificate.pfx /p password /tr http://timestamp.digicert.com /td sha256 /fd sha256 "path/to/app.exe"')
}

// macOS 签名
function signMacOS() {
  exec('codesign --force --deep --sign "Developer ID Application: Your Name (Team ID)" "path/to/app.app"')
}
```

### 3. 安装程序
```javascript
// NSIS 安装程序
{
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "Your App",
    "uninstallDisplayName": "Your App",
    "installerIcon": "build/installer.ico",
    "uninstallerIcon": "build/uninstaller.ico",
    "installerHeaderIcon": "build/installer.ico",
    "menuCategory": true,
    "deleteAppDataOnUninstall": false,
    "include": "build/installer.nsh",
    "script": "build/installer.nsi"
  }
}

// DMG 安装程序
{
  "dmg": {
    "contents": [
      {
        "x": 130,
        "y": 220,
        "type": "file"
      },
      {
        "x": 410,
        "y": 220,
        "type": "link",
        "path": "/Applications"
      }
    ],
    "window": {
      "width": 540,
      "height": 380
    },
    "icon": "build/icon.icns",
    "iconSize": 128,
    "backgroundColor": "#ffffff",
    "title": "Your App Installer"
  }
}
```

## 最佳实践

### 1. 打包优化
- 压缩资源
- 移除开发依赖
- 优化启动时间
- 控制包体积

### 2. 发布流程
- 版本管理
- 更新策略
- 回滚机制
- 分发渠道

### 3. 安装体验
- 安装向导
- 卸载清理
- 快捷方式
- 权限处理

### 4. 安全发布
- 代码签名
- 完整性检查
- 更新验证
- 漏洞修复

## 常见问题

### 1. 打包问题
- 依赖缺失
- 资源丢失
- 路径错误
- 配置冲突

### 2. 发布问题
- 签名失败
- 更新失败
- 安装错误
- 兼容性问题

### 3. 更新问题
- 更新检测
- 下载失败
- 安装失败
- 版本冲突

## 调试技巧

### 1. 打包调试
```javascript
// 打包日志
function enablePackagingLogs() {
  process.env.DEBUG = 'electron-builder'
  process.env.ELECTRON_BUILDER_LOG = 'debug'
}

// 检查打包配置
function validatePackagingConfig() {
  const config = require('./electron-builder.json')
  
  // 验证必要字段
  const requiredFields = ['appId', 'productName', 'directories', 'files']
  requiredFields.forEach(field => {
    if (!config[field]) {
      console.error(`缺少必要配置: ${field}`)
    }
  })
  
  // 验证平台配置
  const platforms = ['win', 'mac', 'linux']
  platforms.forEach(platform => {
    if (config[platform]) {
      console.log(`${platform} 配置:`, config[platform])
    }
  })
}
```

### 2. 发布调试
```javascript
// 更新调试
function debugAutoUpdate() {
  autoUpdater.logger = require('electron-log')
  autoUpdater.logger.transports.file.level = 'debug'
  
  // 模拟更新
  autoUpdater.emit('update-available', {
    version: '1.0.1',
    releaseDate: new Date(),
    releaseNotes: 'Test update'
  })
  
  // 检查更新服务器
  const { net } = require('electron')
  const request = net.request({
    method: 'GET',
    url: 'https://your-update-server.com/latest'
  })
  
  request.on('response', (response) => {
    console.log('更新服务器响应:', response.statusCode)
  })
  
  request.end()
}
```

## 相关资源

- [electron-builder 文档](https://www.electron.build)
- [electron-forge 文档](https://www.electronforge.io)
- [自动更新指南](https://www.electronjs.org/docs/tutorial/updates)
- [代码签名指南](https://www.electronjs.org/docs/tutorial/code-signing)