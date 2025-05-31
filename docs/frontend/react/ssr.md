# React 服务端渲染

本文将详细介绍 React 服务端渲染（SSR）的实现方法和最佳实践。

## Next.js

### 基础概念

Next.js 是一个基于 React 的全栈框架，它提供了：
- 服务端渲染
- 静态站点生成
- 文件系统路由
- API 路由
- 内置优化

### 项目创建

```bash
# 创建项目
npx create-next-app@latest my-app
cd my-app
npm run dev

# 项目结构
my-app/
├── pages/
│   ├── index.js
│   ├── about.js
│   ├── api/
│   └── _app.js
├── public/
├── styles/
├── components/
└── next.config.js
```

### 页面路由

```jsx
// pages/index.js
export default function Home() {
    return <h1>首页</h1>;
}

// pages/about.js
export default function About() {
    return <h1>关于我们</h1>;
}

// pages/posts/[id].js
export default function Post({ post }) {
    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </div>
    );
}

// 动态路由参数
export async function getStaticPaths() {
    const posts = await fetchPosts();
    const paths = posts.map(post => ({
        params: { id: post.id.toString() }
    }));

    return {
        paths,
        fallback: false
    };
}

// 获取页面数据
export async function getStaticProps({ params }) {
    const post = await fetchPost(params.id);
    return {
        props: { post }
    };
}
```

### 数据获取

```jsx
// 服务端渲染（SSR）
export async function getServerSideProps() {
    const data = await fetchData();
    return {
        props: { data }
    };
}

// 静态生成（SSG）
export async function getStaticProps() {
    const data = await fetchData();
    return {
        props: { data },
        revalidate: 60 // 每60秒重新生成
    };
}

// 增量静态再生成（ISR）
export async function getStaticPaths() {
    return {
        paths: [
            { params: { id: '1' } },
            { params: { id: '2' } }
        ],
        fallback: 'blocking'
    };
}

// 客户端数据获取
function Profile() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData().then(data => {
            setData(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>加载中...</div>;
    return <div>{data.name}</div>;
}
```

### API 路由

```jsx
// pages/api/hello.js
export default function handler(req, res) {
    res.status(200).json({ name: 'John Doe' });
}

// pages/api/posts.js
export default async function handler(req, res) {
    if (req.method === 'GET') {
        const posts = await fetchPosts();
        res.status(200).json(posts);
    } else if (req.method === 'POST') {
        const post = await createPost(req.body);
        res.status(201).json(post);
    } else {
        res.status(405).json({ message: '方法不允许' });
    }
}

// 使用 API 路由
function Posts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(setPosts);
    }, []);

    return (
        <ul>
            {posts.map(post => (
                <li key={post.id}>{post.title}</li>
            ))}
        </ul>
    );
}
```

### 中间件

```jsx
// middleware.js
export function middleware(request) {
    // 获取 token
    const token = request.cookies.get('token');

    // 重定向到登录页
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 修改请求头
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', token);

    // 返回修改后的请求
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

// 配置中间件匹配路径
export const config = {
    matcher: '/dashboard/:path*',
};
```

## 自定义 SSR 实现

### 基础实现

```jsx
// server.js
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';

const app = express();

app.get('*', (req, res) => {
    const html = ReactDOMServer.renderToString(<App />);
    
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>SSR App</title>
            </head>
            <body>
                <div id="root">${html}</div>
                <script src="/client.js"></script>
            </body>
        </html>
    `);
});

app.listen(3000);
```

### 数据预取

```jsx
// 创建数据获取函数
async function fetchData() {
    const res = await fetch('https://api.example.com/data');
    return res.json();
}

// 服务端组件
async function ServerComponent() {
    const data = await fetchData();
    return <div>{data.title}</div>;
}

// 服务端渲染
app.get('*', async (req, res) => {
    const data = await fetchData();
    const html = ReactDOMServer.renderToString(
        <App initialData={data} />
    );
    
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>SSR App</title>
                <script>
                    window.__INITIAL_DATA__ = ${JSON.stringify(data)};
                </script>
            </head>
            <body>
                <div id="root">${html}</div>
                <script src="/client.js"></script>
            </body>
        </html>
    `);
});

// 客户端组件
function ClientComponent() {
    const [data, setData] = useState(window.__INITIAL_DATA__);

    useEffect(() => {
        // 客户端数据获取
        fetchData().then(setData);
    }, []);

    return <div>{data.title}</div>;
}
```

### 路由处理

```jsx
// 创建路由配置
const routes = [
    {
        path: '/',
        component: Home,
        getData: () => fetchHomeData()
    },
    {
        path: '/about',
        component: About,
        getData: () => fetchAboutData()
    }
];

// 服务端路由处理
app.get('*', async (req, res) => {
    const route = routes.find(r => r.path === req.path);
    
    if (!route) {
        res.status(404).send('Not Found');
        return;
    }

    const data = await route.getData();
    const html = ReactDOMServer.renderToString(
        <route.component data={data} />
    );

    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>SSR App</title>
                <script>
                    window.__INITIAL_DATA__ = ${JSON.stringify(data)};
                </script>
            </head>
            <body>
                <div id="root">${html}</div>
                <script src="/client.js"></script>
            </body>
        </html>
    `);
});
```

### 状态管理

```jsx
// 创建 Store
import { createStore } from 'redux';

function createServerStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}

// 服务端渲染
app.get('*', async (req, res) => {
    const store = createServerStore();
    
    // 预加载数据
    await store.dispatch(fetchInitialData());
    
    const html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    );

    const state = store.getState();
    
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>SSR App</title>
                <script>
                    window.__INITIAL_STATE__ = ${JSON.stringify(state)};
                </script>
            </head>
            <body>
                <div id="root">${html}</div>
                <script src="/client.js"></script>
            </body>
        </html>
    `);
});

// 客户端初始化
function createClientStore() {
    return createStore(
        rootReducer,
        window.__INITIAL_STATE__,
        applyMiddleware(thunk)
    );
}

// 客户端入口
const store = createClientStore();
hydrate(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
```

## 最佳实践

1. **性能优化**
   - 使用缓存
   - 实现流式渲染
   - 优化资源加载
   - 实现代码分割

2. **SEO 优化**
   - 添加元标签
   - 实现结构化数据
   - 优化页面标题
   - 处理动态内容

3. **开发体验**
   - 使用 TypeScript
   - 添加开发工具
   - 实现热重载
   - 编写测试

4. **部署策略**
   - 使用 CDN
   - 实现缓存策略
   - 配置负载均衡
   - 监控性能

## 常见问题

1. **渲染问题**
   - 水合不匹配
   - 状态同步
   - 样式闪烁
   - 性能问题

2. **数据问题**
   - 数据预取
   - 缓存策略
   - 状态管理
   - 错误处理

3. **部署问题**
   - 构建优化
   - 环境配置
   - 扩展性
   - 监控告警

## 下一步

在掌握了服务端渲染之后，您可以：
- 学习静态站点生成
- 学习边缘计算
- 学习性能优化
- 开始实践项目 