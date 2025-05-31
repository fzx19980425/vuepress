# React 基础教程

React 是一个用于构建用户界面的 JavaScript 库。本文将详细介绍 React 的基础知识和核心概念。

## React 简介

React 是由 Facebook 开发的开源 JavaScript 库，用于构建用户界面。它的主要特点是：

- 组件化开发
- 虚拟 DOM
- 单向数据流
- JSX 语法
- 丰富的生态系统

## 开发环境搭建

### 创建项目

```bash
# 使用 Create React App
npx create-react-app my-app
cd my-app
npm start

# 使用 Vite
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

### 项目结构

```
my-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

## JSX 基础

### 基本语法

```jsx
// 基本 JSX
const element = <h1>Hello, React!</h1>;

// 使用表达式
const name = 'React';
const element = <h1>Hello, {name}!</h1>;

// 使用属性
const element = <img src={user.avatarUrl} alt={user.name} />;

// 使用样式
const element = (
    <div style={{ color: 'red', fontSize: '20px' }}>
        Hello, React!
    </div>
);

// 使用类名
const element = <div className="container">Hello, React!</div>;
```

### 条件渲染

```jsx
// 使用三元运算符
function Greeting({ isLoggedIn }) {
    return (
        <div>
            {isLoggedIn ? (
                <h1>欢迎回来！</h1>
            ) : (
                <h1>请登录。</h1>
            )}
        </div>
    );
}

// 使用 && 运算符
function Notification({ message }) {
    return (
        <div>
            {message && <div className="alert">{message}</div>}
        </div>
    );
}

// 使用 if 语句
function UserProfile({ user }) {
    if (!user) {
        return <div>加载中...</div>;
    }
    
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}
```

### 列表渲染

```jsx
// 使用 map 渲染列表
function TodoList({ items }) {
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.text}</li>
            ))}
        </ul>
    );
}

// 使用 filter 过滤列表
function CompletedTodos({ todos }) {
    return (
        <ul>
            {todos
                .filter(todo => todo.completed)
                .map(todo => (
                    <li key={todo.id}>{todo.text}</li>
                ))}
        </ul>
    );
}
```

## 组件基础

### 函数组件

```jsx
// 基本函数组件
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

// 使用解构
function Welcome({ name, age }) {
    return (
        <div>
            <h1>Hello, {name}</h1>
            <p>Age: {age}</p>
        </div>
    );
}

// 使用默认属性
function Button({ text = 'Click me', onClick }) {
    return (
        <button onClick={onClick}>
            {text}
        </button>
    );
}
```

### 类组件

```jsx
// 基本类组件
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

// 使用构造函数
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }
    
    render() {
        return (
            <div>
                <p>Count: {this.state.count}</p>
                <button onClick={() => this.setState({ count: this.state.count + 1 })}>
                    Increment
                </button>
            </div>
        );
    }
}
```

### 组件组合

```jsx
// 组件嵌套
function App() {
    return (
        <div>
            <Header />
            <Main>
                <Sidebar />
                <Content />
            </Main>
            <Footer />
        </div>
    );
}

// 使用 props.children
function Card({ title, children }) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div className="card-content">
                {children}
            </div>
        </div>
    );
}

// 使用
function App() {
    return (
        <Card title="Welcome">
            <p>This is the card content.</p>
            <button>Click me</button>
        </Card>
    );
}
```

## 状态管理

### useState Hook

```jsx
// 基本使用
function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}

// 使用多个状态
function UserForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### useEffect Hook

```jsx
// 基本使用
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // 组件挂载时获取用户数据
        fetchUser(userId).then(setUser);
        
        // 组件卸载时清理
        return () => {
            // 清理工作
        };
    }, [userId]); // 依赖项
    
    if (!user) return <div>Loading...</div>;
    
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}

// 使用多个 effect
function DataFetcher({ url }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    // 获取数据
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(setData)
            .catch(setError);
    }, [url]);
    
    // 更新文档标题
    useEffect(() => {
        document.title = data ? `Data: ${data.title}` : 'Loading...';
    }, [data]);
    
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>Loading...</div>;
    
    return <div>{/* 渲染数据 */}</div>;
}
```

## 事件处理

### 基本事件

```jsx
// 点击事件
function Button() {
    const handleClick = (e) => {
        console.log('Button clicked!', e);
    };
    
    return <button onClick={handleClick}>Click me</button>;
}

// 表单事件
function Form() {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted!');
    };
    
    const handleChange = (e) => {
        console.log('Input changed:', e.target.value);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### 事件优化

```jsx
// 使用 useCallback
function SearchBox({ onSearch }) {
    const handleSearch = useCallback((e) => {
        onSearch(e.target.value);
    }, [onSearch]);
    
    return <input onChange={handleSearch} />;
}

// 使用防抖
function SearchInput() {
    const [value, setValue] = useState('');
    
    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            console.log('Searching for:', searchTerm);
        }, 500),
        []
    );
    
    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedSearch(newValue);
    };
    
    return <input value={value} onChange={handleChange} />;
}
```

## 表单处理

### 受控组件

```jsx
// 基本表单
function LoginForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
            />
            <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <button type="submit">Login</button>
        </form>
    );
}
```

### 表单验证

```jsx
// 使用自定义 Hook
function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length === 0) {
            console.log('Form is valid:', values);
        }
    };
    
    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit
    };
}

// 使用表单 Hook
function RegistrationForm() {
    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = '邮箱是必填的';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = '邮箱格式不正确';
        }
        if (!values.password) {
            errors.password = '密码是必填的';
        } else if (values.password.length < 6) {
            errors.password = '密码至少需要6个字符';
        }
        return errors;
    };
    
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit
    } = useForm({
        email: '',
        password: ''
    }, validate);
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Email"
                />
                {touched.email && errors.email && (
                    <div className="error">{errors.email}</div>
                )}
            </div>
            <div>
                <input
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                />
                {touched.password && errors.password && (
                    <div className="error">{errors.password}</div>
                )}
            </div>
            <button type="submit">Register</button>
        </form>
    );
}
```

## 最佳实践

1. **组件设计**
   - 保持组件小而专注
   - 使用函数组件和 Hooks
   - 合理拆分组件
   - 使用 PropTypes 或 TypeScript

2. **性能优化**
   - 使用 React.memo
   - 使用 useMemo 和 useCallback
   - 避免不必要的渲染
   - 使用虚拟列表

3. **状态管理**
   - 合理使用本地状态
   - 使用 Context 共享状态
   - 考虑使用状态管理库
   - 避免状态冗余

4. **代码组织**
   - 使用目录结构
   - 遵循命名规范
   - 编写可复用组件
   - 添加适当注释

## 常见问题

1. **性能问题**
   - 不必要的重渲染
   - 大型列表性能
   - 内存泄漏
   - 状态管理混乱

2. **开发问题**
   - 组件通信
   - 状态同步
   - 异步操作
   - 路由管理

3. **调试问题**
   - 使用 React DevTools
   - 使用 Chrome DevTools
   - 错误边界
   - 日志记录

## 下一步

在掌握了 React 基础之后，您可以：
- 学习 React Router
- 学习状态管理（Redux/MobX）
- 学习 React Hooks 高级用法
- 学习服务端渲染
- 开始实践项目 