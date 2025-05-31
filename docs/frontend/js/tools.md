# 开发工具

## 代码质量工具

### ESLint

ESLint 是一个用于识别和报告 JavaScript 代码中模式的工具，可以帮助保持代码质量和一致性。

#### 1. 安装和配置

```bash
# 安装 ESLint
npm install eslint --save-dev

# 初始化配置文件
npx eslint --init
```

#### 2. 基本配置

```javascript
// .eslintrc.js
module.exports = {
    // 环境配置
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    
    // 继承配置
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    
    // 解析器配置
    parser: '@typescript-eslint/parser',
    
    // 插件配置
    plugins: [
        'react',
        '@typescript-eslint'
    ],
    
    // 规则配置
    rules: {
        'no-console': 'warn',
        'no-unused-vars': 'error',
        'semi': ['error', 'always']
    },
    
    // 全局变量
    globals: {
        React: 'readonly'
    }
};
```

#### 3. 常用规则

```javascript
// .eslintrc.js
module.exports = {
    rules: {
        // 代码风格
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        
        // 最佳实践
        'no-console': 'warn',
        'no-debugger': 'warn',
        'no-unused-vars': 'error',
        'no-duplicate-imports': 'error',
        
        // React 相关
        'react/prop-types': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        
        // TypeScript 相关
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-explicit-any': 'error'
    }
};
```

#### 4. 与编辑器集成

```json
// .vscode/settings.json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ]
}
```

### Prettier

Prettier 是一个代码格式化工具，可以自动格式化代码。

#### 1. 安装和配置

```bash
# 安装 Prettier
npm install prettier --save-dev

# 安装 ESLint 集成
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

#### 2. 配置文件

```javascript
// .prettierrc.js
module.exports = {
    // 基本配置
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'avoid',
    
    // 特殊配置
    endOfLine: 'lf',
    embeddedLanguageFormatting: 'auto'
};
```

#### 3. 与 ESLint 集成

```javascript
// .eslintrc.js
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended'
    ],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error'
    }
};
```

## 构建工具

### Webpack

Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。

#### 1. 基本配置

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口文件
    entry: './src/index.js',
    
    // 输出配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    
    // 模块配置
    module: {
        rules: [
            // JavaScript
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            
            // CSS
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            
            // 图片
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    
    // 插件配置
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    
    // 开发服务器
    devServer: {
        static: './dist',
        hot: true,
        port: 3000
    },
    
    // 优化配置
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};
```

#### 2. 常用插件

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    plugins: [
        // CSS 提取
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        
        // 环境变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    
    optimization: {
        minimizer: [
            // JavaScript 压缩
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            }),
            
            // CSS 压缩
            new CssMinimizerPlugin()
        ]
    }
};
```

### Babel

Babel 是一个 JavaScript 编译器，可以将新版本的 JavaScript 代码转换为向后兼容的版本。

#### 1. 基本配置

```javascript
// babel.config.js
module.exports = {
    presets: [
        // 环境预设
        ['@babel/preset-env', {
            targets: {
                browsers: ['> 1%', 'last 2 versions']
            },
            useBuiltIns: 'usage',
            corejs: 3
        }],
        
        // React 预设
        '@babel/preset-react',
        
        // TypeScript 预设
        '@babel/preset-typescript'
    ],
    
    plugins: [
        // 装饰器支持
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        
        // 类属性支持
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        
        // 运行时支持
        '@babel/plugin-transform-runtime'
    ]
};
```

#### 2. 常用预设和插件

```bash
# 安装预设
npm install --save-dev @babel/preset-env @babel/preset-react @babel/preset-typescript

# 安装插件
npm install --save-dev @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime
```

## 调试工具

### Chrome DevTools

#### 1. 断点调试

```javascript
// 使用 debugger 语句
function complexFunction() {
    debugger; // 代码会在这里暂停
    // ... 复杂逻辑
}

// 条件断点
// 在 Chrome DevTools 中右键点击行号，选择"Add conditional breakpoint"
// 输入条件：x > 100
```

#### 2. 性能分析

```javascript
// 使用 Performance API
performance.mark('start');
// ... 要测量的代码
performance.mark('end');
performance.measure('operation', 'start', 'end');

// 使用 console.time
console.time('operation');
// ... 要测量的代码
console.timeEnd('operation');
```

#### 3. 内存分析

```javascript
// 使用 Memory 面板
// 1. 拍摄堆快照
// 2. 记录内存分配
// 3. 分析内存泄漏

// 使用 Performance Monitor
// 监控 JS 堆大小、DOM 节点数等
```

### VS Code 调试

#### 1. 配置

```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}/src"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Node",
            "program": "${workspaceFolder}/src/index.js"
        }
    ]
}
```

#### 2. 调试技巧

- 使用条件断点
- 使用日志点
- 使用表达式求值
- 使用调用堆栈
- 使用变量监视

## 版本控制

### Git

#### 1. 常用命令

```bash
# 初始化仓库
git init

# 添加文件
git add .

# 提交更改
git commit -m "feat: add new feature"

# 分支操作
git branch feature/new-feature
git checkout feature/new-feature
git merge main

# 远程仓库
git remote add origin <repository-url>
git push origin main
git pull origin main
```

#### 2. Git 钩子

```bash
# 安装 husky
npm install husky --save-dev

# 配置 package.json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged",
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
    }
}
```

## 包管理

### npm

#### 1. 常用命令

```bash
# 初始化项目
npm init

# 安装依赖
npm install package-name
npm install package-name --save-dev

# 更新依赖
npm update
npm audit fix

# 运行脚本
npm run script-name
```

#### 2. 配置文件

```json
// package.json
{
    "name": "project-name",
    "version": "1.0.0",
    "scripts": {
        "start": "webpack serve",
        "build": "webpack --mode production",
        "test": "jest",
        "lint": "eslint src",
        "format": "prettier --write src"
    },
    "dependencies": {
        "react": "^17.0.2",
        "react-dom": "^17.0.2"
    },
    "devDependencies": {
        "webpack": "^5.0.0",
        "eslint": "^8.0.0",
        "prettier": "^2.0.0"
    }
}
```

## 最佳实践

1. 使用 ESLint 和 Prettier 保持代码质量
2. 配置适当的构建工具和优化
3. 使用版本控制管理代码
4. 使用调试工具提高开发效率
5. 保持依赖更新和安全
6. 使用自动化工具提高效率

## 相关资源

- [ESLint 文档](https://eslint.org/docs/user-guide/)
- [Webpack 文档](https://webpack.js.org/concepts/)
- [Babel 文档](https://babeljs.io/docs/en/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Git 文档](https://git-scm.com/doc)
- [npm 文档](https://docs.npmjs.com/) 