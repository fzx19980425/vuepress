# React 高级特性

本文将详细介绍 React 的高级特性和进阶用法。

## Hooks 深入

### 自定义 Hook

```jsx
// 数据获取 Hook
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                setData(json);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}

// 使用示例
function UserProfile({ userId }) {
    const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误：{error.message}</div>;
    if (!user) return null;

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}

// 窗口大小 Hook
function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

// 使用示例
function ResponsiveComponent() {
    const { width, height } = useWindowSize();
    
    return (
        <div>
            <p>窗口宽度：{width}px</p>
            <p>窗口高度：{height}px</p>
        </div>
    );
}
```

### useReducer Hook

```jsx
// 计数器示例
const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return initialState;
        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
        </div>
    );
}

// 表单示例
const formReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                [action.field]: action.value
            };
        case 'RESET':
            return action.initialState;
        default:
            return state;
    }
};

function Form() {
    const initialState = { username: '', email: '' };
    const [state, dispatch] = useReducer(formReducer, initialState);

    const handleChange = (e) => {
        dispatch({
            type: 'CHANGE',
            field: e.target.name,
            value: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(state);
        dispatch({ type: 'RESET', initialState });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="username"
                value={state.username}
                onChange={handleChange}
                placeholder="用户名"
            />
            <input
                name="email"
                value={state.email}
                onChange={handleChange}
                placeholder="邮箱"
            />
            <button type="submit">提交</button>
        </form>
    );
}
```

### useCallback 和 useMemo

```jsx
// 使用 useCallback 优化回调函数
function ParentComponent() {
    const [count, setCount] = useState(0);
    
    // 使用 useCallback 缓存回调函数
    const handleClick = useCallback(() => {
        setCount(c => c + 1);
    }, []); // 空依赖数组，因为 setCount 是稳定的

    return (
        <div>
            <p>Count: {count}</p>
            <ChildComponent onClick={handleClick} />
        </div>
    );
}

// 使用 useMemo 优化计算
function ExpensiveComponent({ data }) {
    // 使用 useMemo 缓存计算结果
    const processedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            processed: item.value * 2
        }));
    }, [data]); // 只在 data 变化时重新计算

    return (
        <ul>
            {processedData.map(item => (
                <li key={item.id}>
                    {item.name}: {item.processed}
                </li>
            ))}
        </ul>
    );
}
```

## Context API

### 创建和使用 Context

```jsx
// 创建 Context
const ThemeContext = React.createContext('light');
const UserContext = React.createContext(null);

// 提供 Context
function App() {
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState(null);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <UserContext.Provider value={{ user, setUser }}>
                <MainContent />
            </UserContext.Provider>
        </ThemeContext.Provider>
    );
}

// 使用 Context
function ThemedButton() {
    const { theme, setTheme } = useContext(ThemeContext);
    
    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
                background: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#333' : '#fff'
            }}
        >
            切换主题
        </button>
    );
}

// 自定义 Context Hook
function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// 使用自定义 Hook
function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            当前主题：{theme}
        </button>
    );
}
```

### Context 性能优化

```jsx
// 拆分 Context
const ThemeContext = React.createContext('light');
const ThemeDispatchContext = React.createContext(null);

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    return (
        <ThemeContext.Provider value={theme}>
            <ThemeDispatchContext.Provider value={setTheme}>
                {children}
            </ThemeDispatchContext.Provider>
        </ThemeContext.Provider>
    );
}

// 使用 memo 优化子组件
const ThemedButton = memo(function ThemedButton() {
    const theme = useContext(ThemeContext);
    const setTheme = useContext(ThemeDispatchContext);

    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`btn-${theme}`}
        >
            切换主题
        </button>
    );
});
```

## 性能优化

### 使用 React.memo

```jsx
// 基本使用
const MemoizedComponent = memo(function MyComponent(props) {
    return <div>{props.value}</div>;
});

// 自定义比较函数
const areEqual = (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
};

const MemoizedComponent = memo(function MyComponent(props) {
    return <div>{props.value}</div>;
}, areEqual);

// 实际应用
const UserList = memo(function UserList({ users, onUserClick }) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id} onClick={() => onUserClick(user)}>
                    {user.name}
                </li>
            ))}
        </ul>
    );
});

function ParentComponent() {
    const [users, setUsers] = useState([]);
    const handleUserClick = useCallback((user) => {
        console.log('User clicked:', user);
    }, []);

    return <UserList users={users} onUserClick={handleUserClick} />;
}
```

### 虚拟列表

```jsx
// 使用 react-window
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            {items[index].name}
        </div>
    );

    return (
        <FixedSizeList
            height={400}
            width={300}
            itemCount={items.length}
            itemSize={50}
        >
            {Row}
        </FixedSizeList>
    );
}

// 自定义虚拟列表
function CustomVirtualList({ items, itemHeight, windowHeight }) {
    const [scrollTop, setScrollTop] = useState(0);
    
    const visibleItems = Math.ceil(windowHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItems + 1, items.length);
    
    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop);
    };
    
    return (
        <div
            style={{ height: windowHeight, overflow: 'auto' }}
            onScroll={handleScroll}
        >
            <div style={{ height: items.length * itemHeight }}>
                {items.slice(startIndex, endIndex).map((item, index) => (
                    <div
                        key={item.id}
                        style={{
                            position: 'absolute',
                            top: (startIndex + index) * itemHeight,
                            height: itemHeight
                        }}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### 代码分割

```jsx
// 使用 React.lazy
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
    return (
        <Suspense fallback={<div>加载中...</div>}>
            <LazyComponent />
        </Suspense>
    );
}

// 路由级别的代码分割
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>加载中...</div>}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}
```

## 错误边界

```jsx
// 错误边界组件
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // 可以在这里记录错误信息
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h1>出错了！</h1>
                    <p>{this.state.error?.message}</p>
                    <button onClick={() => this.setState({ hasError: false })}>
                        重试
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// 使用错误边界
function App() {
    return (
        <ErrorBoundary>
            <ComponentThatMightError />
        </ErrorBoundary>
    );
}

// 错误边界嵌套
function App() {
    return (
        <ErrorBoundary>
            <Header />
            <ErrorBoundary>
                <MainContent />
            </ErrorBoundary>
            <Footer />
        </ErrorBoundary>
    );
}
```

## 最佳实践

1. **Hooks 使用**
   - 遵循 Hooks 规则
   - 合理拆分自定义 Hook
   - 注意依赖项管理
   - 避免过度使用

2. **Context 使用**
   - 合理拆分 Context
   - 避免 Context 嵌套过深
   - 使用 memo 优化性能
   - 考虑使用状态管理库

3. **性能优化**
   - 合理使用 memo
   - 实现虚拟列表
   - 代码分割
   - 避免不必要的渲染

4. **错误处理**
   - 使用错误边界
   - 合理处理异步错误
   - 提供友好的错误提示
   - 实现错误恢复机制

## 常见问题

1. **Hooks 问题**
   - 依赖项管理
   - 闭包陷阱
   - 性能优化
   - 测试困难

2. **Context 问题**
   - 性能影响
   - 状态管理混乱
   - 组件耦合
   - 调试困难

3. **性能问题**
   - 重渲染优化
   - 内存泄漏
   - 大型列表处理
   - 代码分割策略

## 下一步

在掌握了 React 高级特性之后，您可以：
- 学习 React Router 高级用法
- 深入学习状态管理（Redux/MobX）
- 学习服务端渲染（Next.js）
- 学习 React Native
- 开始实践项目 