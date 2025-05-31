# React 状态管理

本文将详细介绍 React 应用中的状态管理方案，包括 Redux、MobX 和 Context API。

## Redux

### 基础概念

Redux 是一个可预测的状态容器，它遵循以下原则：
- 单一数据源
- 状态是只读的
- 使用纯函数进行修改

### 基本使用

```jsx
// 安装 Redux
npm install redux react-redux

// 创建 Store
import { createStore } from 'redux';

// 定义 Action Types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

// 创建 Action Creators
const addTodo = (text) => ({
    type: ADD_TODO,
    payload: { text }
});

const toggleTodo = (id) => ({
    type: TOGGLE_TODO,
    payload: { id }
});

// 创建 Reducer
function todosReducer(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [...state, {
                id: Date.now(),
                text: action.payload.text,
                completed: false
            }];
        case TOGGLE_TODO:
            return state.map(todo =>
                todo.id === action.payload.id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            );
        default:
            return state;
    }
}

// 创建 Store
const store = createStore(todosReducer);

// 在组件中使用
import { useSelector, useDispatch } from 'react-redux';

function TodoList() {
    const todos = useSelector(state => state);
    const dispatch = useDispatch();

    return (
        <div>
            <button onClick={() => dispatch(addTodo('新任务'))}>
                添加任务
            </button>
            <ul>
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        onClick={() => dispatch(toggleTodo(todo.id))}
                        style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}
                    >
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// 配置 Provider
function App() {
    return (
        <Provider store={store}>
            <TodoList />
        </Provider>
    );
}
```

### 中间件

```jsx
// 使用 redux-thunk
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// 异步 Action Creator
const fetchTodos = () => async (dispatch) => {
    dispatch({ type: 'FETCH_TODOS_START' });
    try {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: todos });
    } catch (error) {
        dispatch({ type: 'FETCH_TODOS_ERROR', payload: error.message });
    }
};

// 创建 Store
const store = createStore(
    todosReducer,
    applyMiddleware(thunk)
);

// 使用异步 Action
function TodoList() {
    const dispatch = useDispatch();
    const todos = useSelector(state => state.todos);
    const loading = useSelector(state => state.loading);

    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    if (loading) return <div>加载中...</div>;

    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>{todo.text}</li>
            ))}
        </ul>
    );
}
```

### Redux Toolkit

```jsx
// 安装 Redux Toolkit
npm install @reduxjs/toolkit

// 创建 Slice
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        addTodo: (state, action) => {
            state.items.push({
                id: Date.now(),
                text: action.payload,
                completed: false
            });
        },
        toggleTodo: (state, action) => {
            const todo = state.items.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        }
    }
});

// 创建 Store
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        todos: todosSlice.reducer
    }
});

// 使用 Slice
function TodoList() {
    const todos = useSelector(state => state.todos.items);
    const dispatch = useDispatch();

    return (
        <div>
            <button onClick={() => dispatch(todosSlice.actions.addTodo('新任务'))}>
                添加任务
            </button>
            <ul>
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        onClick={() => dispatch(todosSlice.actions.toggleTodo(todo.id))}
                    >
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

## MobX

### 基础概念

MobX 是一个简单、可扩展的状态管理库，它使用响应式编程。

### 基本使用

```jsx
// 安装 MobX
npm install mobx mobx-react-lite

// 创建 Store
import { makeAutoObservable } from 'mobx';

class TodoStore {
    todos = [];
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    addTodo(text) {
        this.todos.push({
            id: Date.now(),
            text,
            completed: false
        });
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
    }

    async fetchTodos() {
        this.loading = true;
        try {
            const response = await fetch('/api/todos');
            this.todos = await response.json();
        } catch (error) {
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    }
}

// 创建 Store 实例
const todoStore = new TodoStore();

// 在组件中使用
import { observer } from 'mobx-react-lite';

const TodoList = observer(() => {
    const { todos, loading, error } = todoStore;

    useEffect(() => {
        todoStore.fetchTodos();
    }, []);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误：{error}</div>;

    return (
        <div>
            <button onClick={() => todoStore.addTodo('新任务')}>
                添加任务
            </button>
            <ul>
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        onClick={() => todoStore.toggleTodo(todo.id)}
                        style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}
                    >
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
});
```

### 使用 Provider

```jsx
// 创建 Context
import { createContext, useContext } from 'react';

const StoreContext = createContext(null);

// 创建 Provider
function StoreProvider({ children }) {
    const store = useMemo(() => new TodoStore(), []);
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}

// 创建 Hook
function useStore() {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within StoreProvider');
    }
    return store;
}

// 使用 Provider
function App() {
    return (
        <StoreProvider>
            <TodoList />
        </StoreProvider>
    );
}

// 在组件中使用
const TodoList = observer(() => {
    const store = useStore();
    // ... 组件逻辑
});
```

## Context API

### 基础使用

```jsx
// 创建 Context
const TodoContext = createContext(null);

// 创建 Provider
function TodoProvider({ children }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addTodo = useCallback((text) => {
        setTodos(prev => [...prev, {
            id: Date.now(),
            text,
            completed: false
        }]);
    }, []);

    const toggleTodo = useCallback((id) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id
                ? { ...todo, completed: !todo.completed }
                : todo
        ));
    }, []);

    const value = useMemo(() => ({
        todos,
        loading,
        error,
        addTodo,
        toggleTodo
    }), [todos, loading, error, addTodo, toggleTodo]);

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
}

// 创建 Hook
function useTodo() {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo must be used within TodoProvider');
    }
    return context;
}

// 使用 Provider
function App() {
    return (
        <TodoProvider>
            <TodoList />
        </TodoProvider>
    );
}

// 在组件中使用
function TodoList() {
    const { todos, addTodo, toggleTodo } = useTodo();

    return (
        <div>
            <button onClick={() => addTodo('新任务')}>
                添加任务
            </button>
            <ul>
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        onClick={() => toggleTodo(todo.id)}
                        style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}
                    >
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

### 性能优化

```jsx
// 拆分 Context
const TodoStateContext = createContext(null);
const TodoDispatchContext = createContext(null);

function TodoProvider({ children }) {
    const [state, dispatch] = useReducer(todoReducer, initialState);

    return (
        <TodoStateContext.Provider value={state}>
            <TodoDispatchContext.Provider value={dispatch}>
                {children}
            </TodoDispatchContext.Provider>
        </TodoStateContext.Provider>
    );
}

// 创建 Hooks
function useTodoState() {
    const context = useContext(TodoStateContext);
    if (!context) {
        throw new Error('useTodoState must be used within TodoProvider');
    }
    return context;
}

function useTodoDispatch() {
    const context = useContext(TodoDispatchContext);
    if (!context) {
        throw new Error('useTodoDispatch must be used within TodoProvider');
    }
    return context;
}

// 使用 memo 优化组件
const TodoItem = memo(function TodoItem({ id, text, completed }) {
    const dispatch = useTodoDispatch();
    
    return (
        <li
            onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: id })}
            style={{
                textDecoration: completed ? 'line-through' : 'none'
            }}
        >
            {text}
        </li>
    );
});
```

## 最佳实践

1. **状态管理选择**
   - 小型应用使用 Context
   - 中型应用使用 MobX
   - 大型应用使用 Redux
   - 考虑团队熟悉度

2. **状态组织**
   - 合理拆分状态
   - 避免状态冗余
   - 使用不可变数据
   - 实现状态持久化

3. **性能优化**
   - 使用 memo
   - 实现状态分片
   - 避免不必要的渲染
   - 优化异步操作

4. **开发体验**
   - 使用 TypeScript
   - 添加开发工具
   - 实现状态调试
   - 编写单元测试

## 常见问题

1. **状态管理问题**
   - 状态更新不及时
   - 状态同步困难
   - 性能问题
   - 调试困难

2. **开发问题**
   - 代码组织混乱
   - 状态逻辑复杂
   - 测试覆盖不足
   - 文档不完善

3. **维护问题**
   - 状态难以追踪
   - 重构成本高
   - 团队协作困难
   - 版本升级复杂

## 下一步

在掌握了状态管理之后，您可以：
- 学习服务端渲染
- 学习状态持久化
- 学习状态迁移
- 开始实践项目 