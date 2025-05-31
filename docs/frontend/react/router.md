# React Router 教程

React Router 是 React 应用中最流行的路由库。本文将详细介绍 React Router 的使用方法和最佳实践。

## 基础路由

### 安装和配置

```bash
# 安装 React Router
npm install react-router-dom
```

### 基本使用

```jsx
// 基本路由配置
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">首页</Link>
                <Link to="/about">关于</Link>
                <Link to="/users">用户</Link>
            </nav>

            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/users" component={Users} />
                <Route path="*" component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
}

// 页面组件
function Home() {
    return <h1>首页</h1>;
}

function About() {
    return <h1>关于我们</h1>;
}

function Users() {
    return <h1>用户列表</h1>;
}

function NotFound() {
    return <h1>404 - 页面未找到</h1>;
}
```

### 路由导航

```jsx
// 使用 Link 组件
function Navigation() {
    return (
        <nav>
            <Link to="/">首页</Link>
            <Link to="/about">关于</Link>
            <Link to="/users">用户</Link>
        </nav>
    );
}

// 使用 useHistory Hook
function LoginButton() {
    const history = useHistory();

    const handleLogin = () => {
        // 登录逻辑
        history.push('/dashboard');
    };

    return <button onClick={handleLogin}>登录</button>;
}

// 使用 useLocation Hook
function CurrentPath() {
    const location = useLocation();
    return <div>当前路径：{location.pathname}</div>;
}
```

## 动态路由

### 路由参数

```jsx
// 使用 URL 参数
function UserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    if (!user) return <div>加载中...</div>;

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}

// 路由配置
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/users/:userId" component={UserProfile} />
            </Switch>
        </BrowserRouter>
    );
}

// 使用查询参数
function SearchResults() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const searchTerm = query.get('q');

    return <div>搜索结果：{searchTerm}</div>;
}

// 带查询参数的链接
function SearchLink() {
    return <Link to="/search?q=react">搜索 React</Link>;
}
```

### 编程式导航

```jsx
// 使用 useHistory
function NavigationExample() {
    const history = useHistory();

    const handleClick = () => {
        // 基本导航
        history.push('/about');

        // 带状态导航
        history.push({
            pathname: '/about',
            state: { from: 'home' }
        });

        // 替换当前历史记录
        history.replace('/about');

        // 返回上一页
        history.goBack();

        // 前进一页
        history.goForward();
    };

    return <button onClick={handleClick}>导航</button>;
}

// 带确认的导航
function ConfirmNavigation() {
    const history = useHistory();
    const [isEditing, setIsEditing] = useState(false);

    const handleNavigation = (path) => {
        if (isEditing) {
            if (window.confirm('有未保存的更改，确定要离开吗？')) {
                history.push(path);
            }
        } else {
            history.push(path);
        }
    };

    return (
        <div>
            <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? '完成编辑' : '开始编辑'}
            </button>
            <button onClick={() => handleNavigation('/about')}>
                前往关于页面
            </button>
        </div>
    );
}
```

## 嵌套路由

### 基本嵌套

```jsx
// 嵌套路由配置
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/users">
                    <Users />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

function Users() {
    return (
        <div>
            <h1>用户</h1>
            <nav>
                <Link to="/users">用户列表</Link>
                <Link to="/users/new">新建用户</Link>
            </nav>

            <Switch>
                <Route exact path="/users" component={UserList} />
                <Route path="/users/new" component={NewUser} />
                <Route path="/users/:userId" component={UserProfile} />
            </Switch>
        </div>
    );
}
```

### 共享布局

```jsx
// 使用布局组件
function DashboardLayout({ children }) {
    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <Link to="/dashboard">概览</Link>
                <Link to="/dashboard/profile">个人资料</Link>
                <Link to="/dashboard/settings">设置</Link>
            </nav>
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}

// 使用布局的路由
function Dashboard() {
    return (
        <Route path="/dashboard">
            <DashboardLayout>
                <Switch>
                    <Route exact path="/dashboard" component={DashboardHome} />
                    <Route path="/dashboard/profile" component={Profile} />
                    <Route path="/dashboard/settings" component={Settings} />
                </Switch>
            </DashboardLayout>
        </Route>
    );
}
```

## 路由守卫

### 基本守卫

```jsx
// 认证守卫
function PrivateRoute({ children, ...rest }) {
    const auth = useAuth();
    
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

// 使用守卫
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <PrivateRoute path="/dashboard">
                    <Dashboard />
                </PrivateRoute>
            </Switch>
        </BrowserRouter>
    );
}
```

### 角色守卫

```jsx
// 角色守卫
function RoleRoute({ roles, children, ...rest }) {
    const auth = useAuth();
    
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.isAuthenticated && roles.includes(auth.user.role) ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/unauthorized",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

// 使用角色守卫
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <RoleRoute roles={['admin']} path="/admin">
                    <AdminDashboard />
                </RoleRoute>
                <RoleRoute roles={['user', 'admin']} path="/dashboard">
                    <UserDashboard />
                </RoleRoute>
            </Switch>
        </BrowserRouter>
    );
}
```

## 路由动画

### 基本动画

```jsx
// 使用 react-transition-group
import { TransitionGroup, CSSTransition } from 'react-transition-group';

function AnimatedSwitch() {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                timeout={300}
                classNames="page"
            >
                <Switch location={location}>
                    <Route path="/" component={Home} />
                    <Route path="/about" component={About} />
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    );
}

// CSS 样式
.page-enter {
    opacity: 0;
    transform: translateX(100%);
}

.page-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
}

.page-exit {
    opacity: 1;
    transform: translateX(0);
}

.page-exit-active {
    opacity: 0;
    transform: translateX(-100%);
    transition: opacity 300ms, transform 300ms;
}
```

## 最佳实践

1. **路由组织**
   - 合理规划路由结构
   - 使用嵌套路由
   - 实现路由守卫
   - 添加路由动画

2. **性能优化**
   - 使用代码分割
   - 实现路由懒加载
   - 优化路由切换
   - 缓存路由状态

3. **用户体验**
   - 添加加载状态
   - 实现平滑过渡
   - 处理错误情况
   - 提供导航反馈

4. **代码组织**
   - 集中管理路由配置
   - 分离路由组件
   - 实现路由复用
   - 添加类型检查

## 常见问题

1. **路由问题**
   - 路由匹配失败
   - 参数传递错误
   - 导航状态丢失
   - 路由守卫冲突

2. **性能问题**
   - 路由切换卡顿
   - 组件重复渲染
   - 内存泄漏
   - 加载时间过长

3. **开发问题**
   - 路由配置复杂
   - 状态管理混乱
   - 测试困难
   - 调试不便

## 下一步

在掌握了 React Router 之后，您可以：
- 学习状态管理（Redux/MobX）
- 学习服务端渲染（Next.js）
- 学习 React Native 路由
- 开始实践项目 