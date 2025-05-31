 # TypeScript 实战案例

## 项目类型设计

### 1. API 响应类型设计
```typescript
// 基础响应类型
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  timestamp: number
}

// 分页响应类型
interface PaginatedResponse<T> extends ApiResponse {
  data: {
    list: T[]
    total: number
    page: number
    pageSize: number
  }
}

// 错误响应类型
interface ErrorResponse extends ApiResponse {
  code: number
  data: null
  message: string
  errors?: Record<string, string[]>
}

// 使用示例
async function fetchUserList(params: UserListParams): Promise<PaginatedResponse<User>> {
  try {
    const response = await api.get('/users', { params })
    return response.data
  } catch (error) {
    if (isErrorResponse(error)) {
      // 处理错误响应
      handleError(error)
    }
    throw error
  }
}
```

### 2. 状态管理类型设计
```typescript
// 用户状态类型
interface UserState {
  currentUser: User | null
  permissions: string[]
  settings: UserSettings
  loading: boolean
  error: Error | null
}

// Action 类型
type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }

// Reducer 类型
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    // ...其他 case
  }
}

// 自定义 Hook 类型
function useUser(): {
  user: User | null
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  loading: boolean
  error: Error | null
} {
  // 实现...
}
```

### 3. 表单类型设计
```typescript
// 表单字段类型
type FormField<T> = {
  value: T
  error?: string
  touched: boolean
  required: boolean
  validate?: (value: T) => string | undefined
}

// 表单状态类型
type FormState<T extends Record<string, any>> = {
  [K in keyof T]: FormField<T[K]>
}

// 表单 Hook 类型
function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
): {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  handleChange: (field: keyof T) => (value: T[keyof T]) => void
  handleSubmit: (onSubmit: (values: T) => void) => (e: React.FormEvent) => void
  resetForm: () => void
} {
  // 实现...
}

// 使用示例
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

const LoginComponent = () => {
  const form = useForm<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleSubmit = (values: LoginForm) => {
    // 处理表单提交
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* 表单字段 */}
    </form>
  )
}
```

## 类型工具实战

### 1. 类型工具函数
```typescript
// 深度部分类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 深度只读类型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 类型安全的对象路径
type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${'' | `.${Paths<T[K]> & string}`}`
    }[keyof T]
  : never

// 类型安全的对象获取
type Get<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? Get<T[K], R>
    : never
  : never

// 使用示例
const obj = {
  user: {
    profile: {
      name: string
      age: number
    }
  }
}

type UserProfilePath = Paths<typeof obj>
// "user" | "user.profile" | "user.profile.name" | "user.profile.age"

const name: Get<typeof obj, 'user.profile.name'> = 'John'
```

### 2. 类型守卫工具
```typescript
// 类型守卫工具函数
const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null
}

const isArray = Array.isArray

const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function'
}

// 类型收窄工具
const assertNever = (value: never): never => {
  throw new Error(`Unhandled value: ${value}`)
}

// 类型检查工具
const hasProperty = <T extends object, K extends string>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> => {
  return prop in obj
}

// 使用示例
function processValue(value: unknown) {
  if (isObject(value)) {
    if (hasProperty(value, 'name')) {
      // value 被推断为 { name: unknown }
      console.log(value.name)
    }
  }
}
```

## 性能优化实践

### 1. 类型缓存
```typescript
// 类型缓存工具
type Cache<T> = {
  [K in keyof T]: T[K]
}

// 使用类型缓存
interface User {
  id: number
  name: string
  email: string
  profile: {
    avatar: string
    bio: string
  }
}

// 缓存常用类型
type CachedUser = Cache<User>
type CachedUserProfile = Cache<User['profile']>

// 避免重复计算
type UserKeys = keyof User
type UserProfileKeys = keyof User['profile']
```

### 2. 类型优化
```typescript
// 使用字面量类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type StatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500

// 使用联合类型
type ApiError = 
  | { code: 400; message: 'Bad Request' }
  | { code: 401; message: 'Unauthorized' }
  | { code: 403; message: 'Forbidden' }
  | { code: 404; message: 'Not Found' }
  | { code: 500; message: 'Internal Server Error' }

// 使用类型映射
type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: ApiError
}
```

## 实际项目案例

### 1. 权限系统类型设计
```typescript
// 权限类型定义
type Permission = 'read' | 'write' | 'delete' | 'admin'

// 角色类型
interface Role {
  id: string
  name: string
  permissions: Permission[]
}

// 用户权限类型
interface UserPermissions {
  roles: Role[]
  permissions: Permission[]
  isAdmin: boolean
}

// 权限检查工具
const hasPermission = (
  userPermissions: UserPermissions,
  requiredPermission: Permission
): boolean => {
  return (
    userPermissions.isAdmin ||
    userPermissions.permissions.includes(requiredPermission) ||
    userPermissions.roles.some(role =>
      role.permissions.includes(requiredPermission)
    )
  )
}

// 权限装饰器
function RequirePermission(permission: Permission) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
      const userPermissions = getCurrentUserPermissions()
      if (!hasPermission(userPermissions, permission)) {
        throw new Error('Permission denied')
      }
      return original.apply(this, args)
    }
    return descriptor
  }
}
```

### 2. 国际化类型设计
```typescript
// 语言类型
type Language = 'en' | 'zh' | 'ja' | 'ko'

// 翻译键类型
type TranslationKey = 
  | 'common.submit'
  | 'common.cancel'
  | 'auth.login'
  | 'auth.register'
  | 'error.notFound'
  | 'error.serverError'

// 翻译类型
type Translations = {
  [K in TranslationKey]: string
}

// 语言包类型
type LanguagePack = {
  [L in Language]: Translations
}

// 翻译 Hook 类型
function useTranslation(language: Language) {
  return {
    t: (key: TranslationKey, params?: Record<string, string>) => string
    setLanguage: (lang: Language) => void
    currentLanguage: Language
  }
}
```

### 3. 主题系统类型设计
```typescript
// 主题类型
type Theme = 'light' | 'dark' | 'system'

// 颜色类型
interface Colors {
  primary: string
  secondary: string
  background: string
  text: string
  // ...其他颜色
}

// 主题配置类型
interface ThemeConfig {
  colors: Colors
  spacing: {
    small: string
    medium: string
    large: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      small: string
      medium: string
      large: string
    }
  }
}

// 主题 Hook 类型
function useTheme() {
  return {
    theme: Theme
    setTheme: (theme: Theme) => void
    colors: Colors
    isDark: boolean
  }
}
```

## 常见问题解决方案

### 1. 类型错误处理
```typescript
// 类型安全的错误处理
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// 类型守卫
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

// 错误处理工具
async function withErrorHandling<T>(
  fn: () => Promise<T>
): Promise<[T | null, AppError | null]> {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    if (isAppError(error)) {
      return [null, error]
    }
    return [null, new AppError('UNKNOWN_ERROR', 'An unknown error occurred')]
  }
}
```

### 2. 类型兼容性处理
```typescript
// 类型兼容性检查
type IsAssignable<T, U> = T extends U ? true : false

// 类型转换工具
type Convert<T, U> = T extends U ? T : never

// 类型合并工具
type Merge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never
}

// 使用示例
type A = { a: string; b: number }
type B = { b: string; c: boolean }
type C = Merge<A, B>
// { a: string; b: string; c: boolean }
```

## 最佳实践总结

### 1. 类型设计原则
- 使用接口定义对象结构
- 使用类型别名定义联合类型
- 使用字面量类型限制值范围
- 使用泛型提高代码复用性
- 使用类型守卫确保类型安全

### 2. 代码组织原则
- 将类型定义放在单独的文件中
- 使用模块化组织类型定义
- 使用命名空间组织相关类型
- 使用类型导入导出
- 保持类型定义文件整洁

### 3. 性能优化原则
- 使用类型缓存
- 避免过度使用类型
- 合理使用泛型
- 避免循环依赖
- 使用类型推断

### 4. 维护性原则
- 编写清晰的类型注释
- 使用有意义的类型名称
- 保持类型定义的一致性
- 定期重构类型定义
- 使用类型测试确保类型安全