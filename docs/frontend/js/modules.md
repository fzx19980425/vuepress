# JavaScript 模块化开发

模块化开发是现代 JavaScript 应用开发的重要实践。本文将详细介绍 JavaScript 中的模块化系统和各种模块化方案。

## 模块化基础

### ES 模块

```javascript
// 导出模块 (math.js)
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export class Calculator {
    multiply(a, b) {
        return a * b;
    }
}

// 默认导出
export default class MathUtils {
    static square(x) {
        return x * x;
    }
}

// 导入模块 (app.js)
import MathUtils, { PI, add, Calculator } from './math.js';

console.log(PI);  // 3.14159
console.log(add(2, 3));  // 5

const calc = new Calculator();
console.log(calc.multiply(4, 5));  // 20

console.log(MathUtils.square(4));  // 16
```

### 动态导入

```javascript
// 基本动态导入
async function loadModule() {
    try {
        const module = await import('./module.js');
        module.doSomething();
    } catch (error) {
        console.error('模块加载失败:', error);
    }
}

// 条件导入
async function loadFeature(featureName) {
    if (featureName === 'advanced') {
        const { AdvancedFeature } = await import('./advanced.js');
        return new AdvancedFeature();
    } else {
        const { BasicFeature } = await import('./basic.js');
        return new BasicFeature();
    }
}

// 并行导入
async function loadMultipleModules() {
    const [moduleA, moduleB] = await Promise.all([
        import('./moduleA.js'),
        import('./moduleB.js')
    ]);
    
    return {
        featureA: moduleA.default,
        featureB: moduleB.default
    };
}
```

## 模块模式

### CommonJS

```javascript
// 导出模块 (utils.js)
const PI = 3.14159;

function add(a, b) {
    return a + b;
}

class Calculator {
    multiply(a, b) {
        return a * b;
    }
}

module.exports = {
    PI,
    add,
    Calculator
};

// 导入模块 (app.js)
const { PI, add, Calculator } = require('./utils.js');

console.log(PI);
console.log(add(2, 3));

const calc = new Calculator();
console.log(calc.multiply(4, 5));
```

### AMD (Asynchronous Module Definition)

```javascript
// 定义模块 (math.js)
define(['dependency'], function(dependency) {
    const PI = 3.14159;
    
    function add(a, b) {
        return a + b;
    }
    
    return {
        PI,
        add
    };
});

// 使用模块 (app.js)
require(['math'], function(math) {
    console.log(math.PI);
    console.log(math.add(2, 3));
});
```

### UMD (Universal Module Definition)

```javascript
// 通用模块定义
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['dependency'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('dependency'));
    } else {
        // 浏览器全局变量
        root.myModule = factory(root.dependency);
    }
}(typeof self !== 'undefined' ? self : this, function(dependency) {
    // 模块代码
    return {
        // 导出的内容
    };
}));
```

## 模块化实践

### 模块组织

```javascript
// 目录结构
src/
  ├── modules/
  │   ├── user/
  │   │   ├── index.js
  │   │   ├── api.js
  │   │   └── utils.js
  │   ├── product/
  │   │   ├── index.js
  │   │   ├── api.js
  │   │   └── utils.js
  │   └── common/
  │       ├── constants.js
  │       └── helpers.js
  ├── services/
  │   ├── api.js
  │   └── storage.js
  └── app.js

// 模块导出 (user/index.js)
export { default as UserAPI } from './api';
export { default as UserUtils } from './utils';

// 模块导入 (app.js)
import { UserAPI, UserUtils } from './modules/user';
import { ProductAPI } from './modules/product';
import { API_BASE_URL } from './modules/common/constants';
```

### 模块依赖

```javascript
// 依赖注入
class UserService {
    constructor(api, storage) {
        this.api = api;
        this.storage = storage;
    }
    
    async getUser(id) {
        const cached = this.storage.get(`user_${id}`);
        if (cached) return cached;
        
        const user = await this.api.getUser(id);
        this.storage.set(`user_${id}`, user);
        return user;
    }
}

// 使用依赖注入
import { API } from './services/api';
import { Storage } from './services/storage';

const userService = new UserService(new API(), new Storage());

// 模块配置
const config = {
    api: {
        baseUrl: 'https://api.example.com',
        timeout: 5000
    },
    storage: {
        prefix: 'app_',
        expiration: 3600
    }
};

export function createServices(config) {
    return {
        api: new API(config.api),
        storage: new Storage(config.storage)
    };
}
```

### 模块测试

```javascript
// 模块测试 (user.test.js)
import { UserAPI, UserUtils } from './user';
import { mockAPI } from '../test/mocks';

describe('User Module', () => {
    let userAPI;
    
    beforeEach(() => {
        userAPI = new UserAPI(mockAPI);
    });
    
    test('should fetch user data', async () => {
        const user = await userAPI.getUser(1);
        expect(user).toHaveProperty('id', 1);
    });
    
    test('should validate user data', () => {
        const user = { id: 1, name: 'John' };
        expect(UserUtils.validateUser(user)).toBe(true);
    });
});

// 模拟依赖
export const mockAPI = {
    getUser: jest.fn().mockResolvedValue({
        id: 1,
        name: 'John'
    })
};
```

## 构建工具

### Webpack 配置

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
};
```

### Babel 配置

```javascript
// babel.config.js
module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                browsers: ['last 2 versions']
            },
            modules: false
        }]
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties'
    ]
};
```

### 模块打包

```javascript
// 代码分割
const path = require('path');

module.exports = {
    // ...
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: -20
                }
            }
        }
    }
};

// 动态导入
async function loadFeature() {
    const { default: Feature } = await import(
        /* webpackChunkName: "feature" */
        './feature.js'
    );
    return new Feature();
}
```

## 最佳实践

1. **模块设计**
   - 单一职责原则
   - 高内聚低耦合
   - 清晰的接口设计
   - 适当的模块大小

2. **依赖管理**
   - 最小化依赖
   - 版本控制
   - 依赖注入
   - 循环依赖处理

3. **代码组织**
   - 清晰的目录结构
   - 模块命名规范
   - 导出接口设计
   - 文档和注释

4. **构建优化**
   - 代码分割
   - 懒加载
   - 缓存策略
   - 打包优化

## 常见问题

1. **模块问题**
   - 循环依赖
   - 命名冲突
   - 作用域污染
   - 模块加载顺序

2. **构建问题**
   - 打包体积
   - 加载性能
   - 兼容性
   - 开发体验

3. **维护问题**
   - 版本管理
   - 依赖更新
   - 测试覆盖
   - 文档维护

## 下一步

在掌握了模块化开发之后，您可以：
- 学习前端框架
- 深入了解设计模式
- 探索工程化实践
- 学习性能优化
- 开始实践项目 