# React 性能优化

本文将详细介绍 React 应用性能优化的方法和最佳实践。

## 渲染优化

### 避免不必要的渲染

```jsx
// 使用 React.memo
const MemoizedComponent = memo(function MyComponent({ value }) {
    return <div>{value}</div>;
});

// 自定义比较函数
const areEqual = (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
};

const MemoizedComponent = memo(function MyComponent({ value }) {
    return <div>{value}</div>;
}, areEqual);

// 使用 useMemo
function ExpensiveComponent({ data }) {
    const processedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            processed: item.value * 2
        }));
    }, [data]);

    return (
        <ul>
            {processedData.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

// 使用 useCallback
function ParentComponent() {
    const [count, setCount] = useState(0);
    
    const handleClick = useCallback(() => {
        setCount(c => c + 1);
    }, []);

    return (
        <div>
            <p>Count: {count}</p>
            <ChildComponent onClick={handleClick} />
        </div>
    );
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

### 懒加载组件

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

## 数据优化

### 数据缓存

```jsx
// 使用 React Query
import { useQuery, useMutation, useQueryClient } from 'react-query';

function TodoList() {
    const queryClient = useQueryClient();
    
    const { data: todos, isLoading } = useQuery('todos', fetchTodos);
    
    const mutation = useMutation(addTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries('todos');
        }
    });

    if (isLoading) return <div>加载中...</div>;

    return (
        <div>
            <button onClick={() => mutation.mutate('新任务')}>
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

// 使用 SWR
import useSWR from 'swr';

function Profile() {
    const { data, error } = useSWR('/api/user', fetcher);

    if (error) return <div>加载失败</div>;
    if (!data) return <div>加载中...</div>;

    return <div>你好, {data.name}!</div>;
}
```

### 状态管理优化

```jsx
// 使用 Context 拆分
const StateContext = createContext(null);
const DispatchContext = createContext(null);

function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

// 使用 Redux 优化
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        // 使用 immer 优化状态更新
        addTodo: (state, action) => {
            state.items.push({
                id: Date.now(),
                text: action.payload,
                completed: false
            });
        }
    }
});
```

## 资源优化

### 图片优化

```jsx
// 使用图片懒加载
import { LazyLoadImage } from 'react-lazy-load-image-component';

function ImageGallery({ images }) {
    return (
        <div>
            {images.map(image => (
                <LazyLoadImage
                    key={image.id}
                    src={image.url}
                    alt={image.alt}
                    effect="blur"
                    placeholderSrc={image.placeholder}
                />
            ))}
        </div>
    );
}

// 使用响应式图片
function ResponsiveImage({ src, alt }) {
    return (
        <picture>
            <source
                media="(min-width: 800px)"
                srcSet={`${src}-large.jpg`}
            />
            <source
                media="(min-width: 400px)"
                srcSet={`${src}-medium.jpg`}
            />
            <img
                src={`${src}-small.jpg`}
                alt={alt}
                loading="lazy"
            />
        </picture>
    );
}
```

### 资源预加载

```jsx
// 预加载关键资源
function PreloadResources() {
    useEffect(() => {
        // 预加载图片
        const preloadImage = (src) => {
            const img = new Image();
            img.src = src;
        };

        // 预加载字体
        const preloadFont = (url) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.href = url;
            document.head.appendChild(link);
        };

        // 预加载数据
        const preloadData = async () => {
            const data = await fetch('/api/critical-data');
            // 存储数据
        };

        // 执行预加载
        preloadImage('/images/hero.jpg');
        preloadFont('/fonts/main.woff2');
        preloadData();
    }, []);

    return null;
}
```

## 构建优化

### 代码分割

```jsx
// 动态导入
const MyComponent = React.lazy(() => import('./MyComponent'));

// 预加载组件
function PreloadComponent() {
    const preloadComponent = () => {
        const Component = React.lazy(() => import('./HeavyComponent'));
        // 预加载但不渲染
    };

    return (
        <button onClick={preloadComponent}>
            预加载组件
        </button>
    );
}

// 路由级别的代码分割
const routes = [
    {
        path: '/',
        component: React.lazy(() => import('./pages/Home'))
    },
    {
        path: '/about',
        component: React.lazy(() => import('./pages/About'))
    }
];
```

### 构建配置

```js
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};
```

## 监控和分析

### 性能监控

```jsx
// 使用 Performance API
function measurePerformance() {
    // 测量组件渲染时间
    const measure = (name) => {
        performance.mark(`${name}-start`);
        return () => {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
        };
    };

    // 使用示例
    function ExpensiveComponent() {
        const endMeasure = measure('ExpensiveComponent');
        
        useEffect(() => {
            return endMeasure;
        });

        return <div>复杂组件</div>;
    }
}

// 使用 React Profiler
function ProfilerExample() {
    const handleRender = (
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
    ) => {
        console.log({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime
        });
    };

    return (
        <Profiler id="App" onRender={handleRender}>
            <App />
        </Profiler>
    );
}
```

### 错误监控

```jsx
// 错误边界
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // 上报错误
        logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>出错了！</h1>;
        }

        return this.props.children;
    }
}

// 全局错误处理
window.addEventListener('error', (event) => {
    // 上报错误
    logErrorToService(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    // 上报未处理的 Promise 错误
    logErrorToService(event.reason);
});
```

## 最佳实践

1. **渲染优化**
   - 使用 memo
   - 实现虚拟列表
   - 懒加载组件
   - 避免不必要的渲染

2. **数据优化**
   - 实现数据缓存
   - 优化状态管理
   - 使用数据预取
   - 实现数据分页

3. **资源优化**
   - 优化图片加载
   - 实现资源预加载
   - 使用 CDN
   - 压缩静态资源

4. **构建优化**
   - 代码分割
   - 压缩代码
   - 优化依赖
   - 使用缓存

## 常见问题

1. **性能问题**
   - 首次加载慢
   - 渲染卡顿
   - 内存泄漏
   - 资源加载慢

2. **优化问题**
   - 过度优化
   - 缓存策略
   - 代码分割
   - 监控覆盖

3. **维护问题**
   - 性能监控
   - 错误追踪
   - 性能回归
   - 优化文档

## 下一步

在掌握了性能优化之后，您可以：
- 学习性能监控
- 学习性能测试
- 学习性能调优
- 开始实践项目 