# React 测试

本文将详细介绍 React 应用的测试策略和最佳实践。

## 单元测试

### Jest 基础

```jsx
// 安装依赖
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

// 配置 Jest
// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    }
};

// 测试工具函数
function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

// 测试异步函数
async function fetchData() {
    const response = await fetch('/api/data');
    return response.json();
}

test('fetchData returns data', async () => {
    const data = await fetchData();
    expect(data).toHaveProperty('id');
});
```

### 组件测试

```jsx
// 测试简单组件
import { render, screen } from '@testing-library/react';

function Greeting({ name }) {
    return <h1>你好, {name}!</h1>;
}

test('renders greeting with name', () => {
    render(<Greeting name="张三" />);
    expect(screen.getByText('你好, 张三!')).toBeInTheDocument();
});

// 测试事件处理
function Counter() {
    const [count, setCount] = useState(0);
    return (
        <button onClick={() => setCount(count + 1)}>
            点击次数: {count}
        </button>
    );
}

test('increments counter on click', () => {
    render(<Counter />);
    const button = screen.getByText(/点击次数: 0/i);
    fireEvent.click(button);
    expect(screen.getByText(/点击次数: 1/i)).toBeInTheDocument();
});

// 测试异步组件
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser(userId).then(data => {
            setUser(data);
            setLoading(false);
        });
    }, [userId]);

    if (loading) return <div>加载中...</div>;
    return <div>{user.name}</div>;
}

test('renders user profile', async () => {
    const mockUser = { name: '张三' };
    global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockUser)
    });

    render(<UserProfile userId="1" />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
    
    const userName = await screen.findByText('张三');
    expect(userName).toBeInTheDocument();
});
```

### Mock 函数

```jsx
// 测试回调函数
function Form({ onSubmit }) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="输入内容"
            />
            <button type="submit">提交</button>
        </form>
    );
}

test('calls onSubmit with input value', () => {
    const handleSubmit = jest.fn();
    render(<Form onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText('输入内容');
    const button = screen.getByText('提交');
    
    fireEvent.change(input, { target: { value: '测试内容' } });
    fireEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledWith('测试内容');
});

// 测试 API 调用
function TodoList() {
    const [todos, setTodos] = useState([]);
    
    useEffect(() => {
        fetchTodos().then(setTodos);
    }, []);

    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>{todo.text}</li>
            ))}
        </ul>
    );
}

test('renders todos from API', async () => {
    const mockTodos = [
        { id: 1, text: '学习 React' },
        { id: 2, text: '学习测试' }
    ];
    
    global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockTodos)
    });

    render(<TodoList />);
    
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('学习 React');
});
```

## 集成测试

### 组件集成

```jsx
// 测试表单提交
function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="用户名"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="密码"
            />
            <button type="submit">登录</button>
        </form>
    );
}

test('handles login flow', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ token: '123' });
    render(<LoginForm login={mockLogin} />);
    
    const usernameInput = screen.getByPlaceholderText('用户名');
    const passwordInput = screen.getByPlaceholderText('密码');
    const submitButton = screen.getByText('登录');
    
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);
    
    expect(mockLogin).toHaveBeenCalledWith('test', 'password');
});

// 测试路由集成
import { MemoryRouter, Route } from 'react-router-dom';

function App() {
    return (
        <MemoryRouter>
            <Route path="/user/:id" component={UserProfile} />
        </MemoryRouter>
    );
}

test('renders user profile page', () => {
    render(
        <MemoryRouter initialEntries={['/user/123']}>
            <App />
        </MemoryRouter>
    );
    
    expect(screen.getByText(/用户资料/i)).toBeInTheDocument();
});
```

### 状态管理测试

```jsx
// 测试 Redux 集成
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

function TodoApp() {
    const todos = useSelector(state => state.todos);
    const dispatch = useDispatch();

    return (
        <div>
            <button onClick={() => dispatch({ type: 'ADD_TODO', text: '新任务' })}>
                添加任务
            </button>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>{todo.text}</li>
                ))}
            </ul>
        </div>
    );
}

test('dispatches add todo action', () => {
    const store = mockStore({ todos: [] });
    
    render(
        <Provider store={store}>
            <TodoApp />
        </Provider>
    );
    
    fireEvent.click(screen.getByText('添加任务'));
    
    const actions = store.getActions();
    expect(actions).toContainEqual({
        type: 'ADD_TODO',
        text: '新任务'
    });
});

// 测试 Context 集成
const ThemeContext = React.createContext('light');

function ThemedButton() {
    const theme = useContext(ThemeContext);
    return <button className={theme}>主题按钮</button>;
}

test('renders with theme context', () => {
    render(
        <ThemeContext.Provider value="dark">
            <ThemedButton />
        </ThemeContext.Provider>
    );
    
    const button = screen.getByText('主题按钮');
    expect(button).toHaveClass('dark');
});
```

## 端到端测试

### Cypress 基础

```jsx
// 安装 Cypress
npm install --save-dev cypress

// 配置 Cypress
// cypress.json
{
    "baseUrl": "http://localhost:3000",
    "viewportWidth": 1280,
    "viewportHeight": 720
}

// 测试登录流程
describe('登录流程', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('成功登录', () => {
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
        cy.get('.welcome-message').should('contain', '欢迎回来');
    });

    it('显示错误信息', () => {
        cy.get('input[name="username"]').type('wronguser');
        cy.get('input[name="password"]').type('wrongpass');
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('be.visible');
    });
});

// 测试用户交互
describe('待办事项', () => {
    beforeEach(() => {
        cy.visit('/todos');
    });

    it('添加新任务', () => {
        cy.get('input[placeholder="新任务"]').type('学习 Cypress');
        cy.get('button').contains('添加').click();
        cy.get('.todo-list').should('contain', '学习 Cypress');
    });

    it('完成任务', () => {
        cy.get('.todo-item').first().find('.checkbox').click();
        cy.get('.todo-item').first().should('have.class', 'completed');
    });
});
```

### 测试工具函数

```jsx
// 自定义命令
// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
    cy.visit('/login');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

// 使用自定义命令
describe('受保护的页面', () => {
    it('需要登录才能访问', () => {
        cy.login('testuser', 'password123');
        cy.visit('/protected');
        cy.get('.protected-content').should('be.visible');
    });
});

// 测试 API 请求
describe('API 集成', () => {
    it('获取用户数据', () => {
        cy.intercept('GET', '/api/user', {
            statusCode: 200,
            body: {
                name: '张三',
                email: 'zhangsan@example.com'
            }
        }).as('getUser');

        cy.visit('/profile');
        cy.wait('@getUser');
        cy.get('.user-name').should('contain', '张三');
    });

    it('处理错误响应', () => {
        cy.intercept('GET', '/api/user', {
            statusCode: 404,
            body: { message: '用户不存在' }
        }).as('getUserError');

        cy.visit('/profile');
        cy.wait('@getUserError');
        cy.get('.error-message').should('contain', '用户不存在');
    });
});
```

## 最佳实践

1. **测试策略**
   - 编写单元测试
   - 实现集成测试
   - 添加端到端测试
   - 保持测试覆盖率

2. **测试组织**
   - 按功能组织测试
   - 使用测试工具函数
   - 实现测试数据工厂
   - 管理测试配置

3. **测试质量**
   - 测试关键功能
   - 模拟外部依赖
   - 处理异步操作
   - 验证边界条件

4. **开发体验**
   - 使用测试驱动开发
   - 实现测试自动化
   - 优化测试性能
   - 提供测试文档

## 常见问题

1. **测试问题**
   - 测试不稳定
   - 异步测试困难
   - 模拟复杂依赖
   - 测试维护成本

2. **工具问题**
   - 配置复杂
   - 性能问题
   - 调试困难
   - 环境差异

3. **实践问题**
   - 测试覆盖不足
   - 测试质量不高
   - 测试效率低
   - 团队协作困难

## 下一步

在掌握了测试之后，您可以：
- 学习测试驱动开发
- 学习性能测试
- 学习安全测试
- 开始实践项目 