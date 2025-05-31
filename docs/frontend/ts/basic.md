 # TypeScript 基础概念

## 类型系统

### 1. 基本类型
```typescript
// 基本类型声明
let str: string = 'hello'
let num: number = 42
let bool: boolean = true
let n: null = null
let u: undefined = undefined
let sym: symbol = Symbol('key')
let big: bigint = 100n

// 字面量类型
let direction: 'up' | 'down' | 'left' | 'right' = 'up'
let status: 200 | 404 | 500 = 200
let binary: 0b1010 = 0b1010
let octal: 0o744 = 0o744
let hex: 0xf00d = 0xf00d

// 模板字面量类型
type EmailLocaleIDs = "welcome_email" | "email_heading"
type FooterLocaleIDs = "footer_title" | "footer_sendoff"
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`
```

### 2. 数组和元组
```typescript
// 数组类型
let arr1: number[] = [1, 2, 3]
let arr2: Array<string> = ['a', 'b', 'c']
let arr3: (string | number)[] = [1, 'a', 2, 'b']

// 只读数组
let readonlyArr: ReadonlyArray<number> = [1, 2, 3]
// readonlyArr.push(4) // 错误：只读数组不能修改

// 元组类型
let tuple: [string, number, boolean] = ['hello', 42, true]
let readonlyTuple: readonly [string, number] = ['hello', 42]

// 可选元组元素
type OptionalTuple = [string, number?]
let optTuple: OptionalTuple = ['hello'] // 第二个元素可选
```

### 3. 对象类型
```typescript
// 对象类型声明
interface User {
  name: string
  age: number
  email?: string // 可选属性
  readonly id: number // 只读属性
}

// 索引签名
interface StringArray {
  [index: number]: string
}

interface NumberDictionary {
  [key: string]: number
  length: number // 必须的，因为它是索引签名的返回类型
}

// 映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T
```

## 函数类型

### 1. 函数声明
```typescript
// 函数类型声明
function add(x: number, y: number): number {
  return x + y
}

// 可选参数和默认参数
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`
}

// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0)
}

// 函数类型表达式
type BinaryFn = (x: number, y: number) => number
const multiply: BinaryFn = (x, y) => x * y

// 函数重载
function reverse(x: string): string
function reverse(x: number): number
function reverse(x: string | number): string | number {
  if (typeof x === 'string') {
    return x.split('').reverse().join('')
  }
  return -x
}
```

### 2. 泛型函数
```typescript
// 基本泛型函数
function identity<T>(arg: T): T {
  return arg
}

// 泛型约束
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}

// 泛型默认类型
interface A<T = string> {
  name: T
}
```

## 高级类型

### 1. 联合类型和交叉类型
```typescript
// 联合类型
type StringOrNumber = string | number
type Status = 'success' | 'error' | 'pending'

// 交叉类型
interface A {
  name: string
}
interface B {
  age: number
}
type C = A & B

// 类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// 可辨识联合
interface Square {
  kind: 'square'
  size: number
}
interface Circle {
  kind: 'circle'
  radius: number
}
type Shape = Square | Circle

function area(s: Shape): number {
  switch (s.kind) {
    case 'square': return s.size * s.size
    case 'circle': return Math.PI * s.radius * s.radius
  }
}
```

### 2. 类型操作
```typescript
// keyof 操作符
type Point = { x: number; y: number }
type P = keyof Point // 'x' | 'y'

// typeof 操作符
const str = 'hello'
type Str = typeof str // string

// 索引访问类型
type Person = { name: string; age: number }
type Age = Person['age'] // number

// 条件类型
type TypeName<T> = T extends string ? 'string'
  : T extends number ? 'number'
  : T extends boolean ? 'boolean'
  : T extends undefined ? 'undefined'
  : T extends Function ? 'function'
  : 'object'

// 映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

## 模块系统

### 1. 模块声明
```typescript
// 导出声明
export interface User {
  name: string
  age: number
}

export class UserService {
  getUser(id: number): User {
    // ...
  }
}

// 默认导出
export default class Database {
  // ...
}

// 重新导出
export { User } from './user'
export * from './utils'

// 命名空间
export namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean
  }
}
```

### 2. 类型声明文件
```typescript
// 声明文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 全局声明
declare global {
  interface Window {
    myGlobal: string
  }
}

// 模块声明
declare module 'my-module' {
  export function doSomething(): void
  export const value: string
}
```

## 最佳实践

### 1. 类型安全
- 避免使用 `any`
- 使用类型守卫
- 利用类型推断
- 使用字面量类型
- 优先使用接口而不是类型别名

### 2. 代码组织
- 使用模块化
- 合理使用命名空间
- 类型声明文件分离
- 使用类型导入导出

### 3. 性能考虑
- 避免过度使用类型
- 使用类型缓存
- 合理使用泛型
- 避免循环依赖

## 工具和资源

### 1. 开发工具
- VS Code + TypeScript 插件
- tslint / eslint
- TypeScript Playground
- TypeDoc

### 2. 学习资源
- TypeScript 官方文档
- TypeScript 深入理解
- TypeScript 设计模式
- 社区最佳实践

### 3. 实用库
- type-fest
- ts-toolbelt
- utility-types
- zod