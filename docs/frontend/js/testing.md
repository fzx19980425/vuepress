# JavaScript 测试

测试是保证代码质量的重要手段。本文将详细介绍 JavaScript 测试的各个方面。

## 单元测试

### Jest 基础

```javascript
// 基本测试
describe('数学运算', () => {
    test('加法', () => {
        expect(1 + 1).toBe(2);
    });
    
    test('乘法', () => {
        expect(2 * 3).toBe(6);
    });
});

// 异步测试
describe('异步操作', () => {
    test('Promise 测试', async () => {
        const data = await fetchData();
        expect(data).toBeDefined();
    });
    
    test('回调测试', done => {
        fetchDataWithCallback(data => {
            expect(data).toBeDefined();
            done();
        });
    });
});

// 模拟函数
describe('模拟函数', () => {
    const mockFn = jest.fn();
    
    test('函数调用', () => {
        mockFn('test');
        expect(mockFn).toHaveBeenCalledWith('test');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    
    test('模拟返回值', () => {
        mockFn.mockReturnValue('mocked');
        expect(mockFn()).toBe('mocked');
    });
});
```

### 测试工具函数

```javascript
// 工具函数测试
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

describe('calculateTotal', () => {
    test('计算总价', () => {
        const items = [
            { price: 10, quantity: 2 },
            { price: 20, quantity: 1 }
        ];
        expect(calculateTotal(items)).toBe(40);
    });
    
    test('空数组', () => {
        expect(calculateTotal([])).toBe(0);
    });
    
    test('无效输入', () => {
        expect(() => calculateTotal(null)).toThrow();
    });
});

// 异步工具函数测试
async function fetchUserData(userId) {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('用户不存在');
    return response.json();
}

describe('fetchUserData', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    
    test('成功获取用户数据', async () => {
        const mockUser = { id: 1, name: 'John' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockUser)
        });
        
        const user = await fetchUserData(1);
        expect(user).toEqual(mockUser);
    });
    
    test('用户不存在', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false
        });
        
        await expect(fetchUserData(999)).rejects.toThrow('用户不存在');
    });
});
```

## 组件测试

### React 组件测试

```javascript
// 使用 React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('Counter 组件', () => {
    test('初始状态', () => {
        render(<Counter />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });
    
    test('点击增加', () => {
        render(<Counter />);
        fireEvent.click(screen.getByText('+'));
        expect(screen.getByText('1')).toBeInTheDocument();
    });
    
    test('点击减少', () => {
        render(<Counter />);
        fireEvent.click(screen.getByText('-'));
        expect(screen.getByText('-1')).toBeInTheDocument();
    });
});

// 测试异步组件
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile 组件', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    
    test('加载用户数据', async () => {
        const mockUser = { name: 'John', email: 'john@example.com' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockUser)
        });
        
        render(<UserProfile userId={1} />);
        
        expect(screen.getByText('加载中...')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText(mockUser.name)).toBeInTheDocument();
        });
    });
});
```

### Vue 组件测试

```javascript
// 使用 Vue Test Utils
import { mount } from '@vue/test-utils';
import Counter from './Counter.vue';

describe('Counter 组件', () => {
    test('初始状态', () => {
        const wrapper = mount(Counter);
        expect(wrapper.text()).toContain('0');
    });
    
    test('点击增加', async () => {
        const wrapper = mount(Counter);
        await wrapper.find('button.increment').trigger('click');
        expect(wrapper.text()).toContain('1');
    });
    
    test('点击减少', async () => {
        const wrapper = mount(Counter);
        await wrapper.find('button.decrement').trigger('click');
        expect(wrapper.text()).toContain('-1');
    });
});

// 测试异步组件
import { mount } from '@vue/test-utils';
import UserProfile from './UserProfile.vue';

describe('UserProfile 组件', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    
    test('加载用户数据', async () => {
        const mockUser = { name: 'John', email: 'john@example.com' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockUser)
        });
        
        const wrapper = mount(UserProfile, {
            propsData: { userId: 1 }
        });
        
        expect(wrapper.text()).toContain('加载中...');
        
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain(mockUser.name);
    });
});
```

## 集成测试

### API 测试

```javascript
// 使用 Supertest
import request from 'supertest';
import app from './app';

describe('API 测试', () => {
    test('获取用户列表', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200);
            
        expect(response.body).toBeInstanceOf(Array);
    });
    
    test('创建用户', async () => {
        const userData = {
            name: 'John',
            email: 'john@example.com'
        };
        
        const response = await request(app)
            .post('/api/users')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(201);
            
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(userData.name);
    });
});

// 测试错误处理
describe('错误处理', () => {
    test('用户不存在', async () => {
        const response = await request(app)
            .get('/api/users/999')
            .expect('Content-Type', /json/)
            .expect(404);
            
        expect(response.body).toHaveProperty('error');
    });
    
    test('无效输入', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400);
            
        expect(response.body).toHaveProperty('errors');
    });
});
```

### 端到端测试

```javascript
// 使用 Cypress
describe('用户流程', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    
    it('登录流程', () => {
        cy.get('[data-test="login-form"]').within(() => {
            cy.get('input[name="email"]').type('user@example.com');
            cy.get('input[name="password"]').type('password123');
            cy.get('button[type="submit"]').click();
        });
        
        cy.url().should('include', '/dashboard');
        cy.get('[data-test="user-name"]').should('be.visible');
    });
    
    it('创建新任务', () => {
        cy.get('[data-test="new-task-button"]').click();
        cy.get('[data-test="task-form"]').within(() => {
            cy.get('input[name="title"]').type('新任务');
            cy.get('textarea[name="description"]').type('任务描述');
            cy.get('button[type="submit"]').click();
        });
        
        cy.get('[data-test="task-list"]')
            .should('contain', '新任务');
    });
});

// 测试错误场景
describe('错误处理', () => {
    it('显示错误消息', () => {
        cy.get('[data-test="login-form"]').within(() => {
            cy.get('input[name="email"]').type('invalid-email');
            cy.get('button[type="submit"]').click();
        });
        
        cy.get('[data-test="error-message"]')
            .should('be.visible')
            .and('contain', '无效的邮箱地址');
    });
    
    it('网络错误处理', () => {
        cy.intercept('POST', '/api/tasks', {
            statusCode: 500,
            body: { error: '服务器错误' }
        });
        
        cy.get('[data-test="new-task-button"]').click();
        cy.get('[data-test="task-form"]').within(() => {
            cy.get('input[name="title"]').type('新任务');
            cy.get('button[type="submit"]').click();
        });
        
        cy.get('[data-test="error-message"]')
            .should('be.visible')
            .and('contain', '服务器错误');
    });
});
```

## 测试最佳实践

### 测试组织

```javascript
// 测试文件组织
// __tests__/
//   ├── unit/
//   │   ├── utils.test.js
//   │   └── services.test.js
//   ├── integration/
//   │   ├── api.test.js
//   │   └── database.test.js
//   └── e2e/
//       ├── auth.spec.js
//       └── tasks.spec.js

// 测试辅助函数
const testUtils = {
    createMockUser() {
        return {
            id: 1,
            name: 'Test User',
            email: 'test@example.com'
        };
    },
    
    async setupTestDatabase() {
        // 设置测试数据库
    },
    
    async cleanupTestDatabase() {
        // 清理测试数据
    }
};

// 测试配置
jest.config.js
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
```

### 测试策略

```javascript
// 测试金字塔
describe('测试策略', () => {
    // 单元测试（最多）
    test('工具函数', () => {
        // 测试独立函数
    });
    
    // 集成测试（中等）
    test('API 集成', () => {
        // 测试 API 交互
    });
    
    // 端到端测试（最少）
    test('用户流程', () => {
        // 测试完整流程
    });
});

// 测试优先级
describe('测试优先级', () => {
    // 核心功能（必须测试）
    test('用户认证', () => {
        // 测试登录、注册等
    });
    
    // 重要功能（应该测试）
    test('数据操作', () => {
        // 测试 CRUD 操作
    });
    
    // 次要功能（可以测试）
    test('UI 交互', () => {
        // 测试界面交互
    });
});
```

## 常见问题

1. **测试问题**
   - 测试覆盖率不足
   - 测试维护困难
   - 测试执行慢
   - 测试不稳定

2. **工具问题**
   - 工具选择
   - 配置复杂
   - 环境问题
   - 调试困难

3. **实践问题**
   - 测试策略
   - 代码组织
   - 团队协作
   - 持续集成

## 下一步

在掌握了测试之后，您可以：
- 学习前端框架
- 深入了解自动化测试
- 探索持续集成
- 学习性能测试
- 开始实践项目 