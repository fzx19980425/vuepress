 # TypeScript 高级特性

## 类型编程

### 1. 条件类型
```typescript
// 基本条件类型
type TypeName<T> = T extends string ? 'string'
  : T extends number ? 'number'
  : T extends boolean ? 'boolean'
  : T extends undefined ? 'undefined'
  : T extends Function ? 'function'
  : 'object'

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never
type StrArrOrNumArr = ToArray<string | number> // string[] | number[]

// 条件类型中的推断
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any
type Unpacked<T> = T extends (infer U)[] ? U
  : T extends (...args: any[]) => infer U ? U
  : T extends Promise<infer U> ? U
  : T

// 条件类型与映射类型结合
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]
```

### 2. 工具类型
```typescript
// 内置工具类型
type Partial<T> = { [P in keyof T]?: T[P] }
type Required<T> = { [P in keyof T]-?: T[P] }
type Readonly<T> = { readonly [P in keyof T]: T[P] }
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Record<K extends keyof any, T> = { [P in K]: T }
type Exclude<T, U> = T extends U ? never : T
type Extract<T, U> = T extends U ? T : never
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
type NonNullable<T> = T extends null | undefined ? never : T

// 自定义工具类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// 递归类型
type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }
```

### 3. 模板字面量类型
```typescript
// 基本模板字面量
type World = 'world'
type Greeting = `hello ${World}`

// 联合类型模板字面量
type VerticalAlignment = 'top' | 'middle' | 'bottom'
type HorizontalAlignment = 'left' | 'center' | 'right'
type Alignment = `${VerticalAlignment}-${HorizontalAlignment}`

// 模板字面量类型操作
type EventName<T extends string> = `${T}Changed`
type Concat<S1 extends string, S2 extends string> = `${S1}${S2}`
type ToString<T extends string | number | boolean> = `${T}`

// 模板字面量类型推断
type GetterName<T extends string> = `get${Capitalize<T>}`
type SetterName<T extends string> = `set${Capitalize<T>}`
```

## 高级类型操作

### 1. 类型递归
```typescript
// 递归类型定义
type RecursiveType = {
  value: string
  children?: RecursiveType[]
}

// 递归工具类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 递归条件类型
type RecursiveConditional<T> = T extends object
  ? { [K in keyof T]: RecursiveConditional<T[K]> }
  : T

// 递归类型限制
type RecursiveArray<T> = T | RecursiveArray<T>[]
```

### 2. 类型谓词
```typescript
// 类型谓词函数
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

// 类型守卫
function processValue(value: unknown) {
  if (isString(value)) {
    // value 被推断为 string 类型
    console.log(value.toUpperCase())
  } else if (isNumber(value)) {
    // value 被推断为 number 类型
    console.log(value.toFixed(2))
  }
}

// 自定义类型守卫
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}
```

### 3. 类型映射
```typescript
// 基本类型映射
type MappedType<T> = {
  [K in keyof T]: T[K]
}

// 条件映射
type ConditionalMappedType<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}

// 重映射
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

// 过滤映射
type FilteredKeys<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}
```

## 高级泛型

### 1. 泛型约束
```typescript
// 基本约束
function identity<T extends object>(arg: T): T {
  return arg
}

// 多重约束
interface Lengthwise {
  length: number
}

interface Colorful {
  color: string
}

function process<T extends Lengthwise & Colorful>(arg: T): T {
  console.log(arg.length, arg.color)
  return arg
}

// 泛型参数约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// 条件泛型
type ConditionalType<T> = T extends string ? string[] : number[]
```

### 2. 泛型工具类型
```typescript
// 泛型类型操作
type Nullable<T> = T | null
type NonNullable<T> = T extends null | undefined ? never : T
type Readonly<T> = { readonly [P in keyof T]: T[P] }
type Partial<T> = { [P in keyof T]?: T[P] }

// 泛型条件类型
type TypeName<T> = T extends string ? 'string'
  : T extends number ? 'number'
  : T extends boolean ? 'boolean'
  : T extends undefined ? 'undefined'
  : T extends Function ? 'function'
  : 'object'

// 泛型映射类型
type MappedType<T> = {
  [P in keyof T]: T[P] extends object ? MappedType<T[P]> : T[P]
}
```

### 3. 泛型函数
```typescript
// 泛型函数重载
function process<T extends string | number>(arg: T): T extends string ? string[] : number[]
function process(arg: string | number): string[] | number[] {
  if (typeof arg === 'string') {
    return arg.split('')
  } else {
    return [arg]
  }
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
  constructor(zeroValue: T, add: (x: T, y: T) => T) {
    this.zeroValue = zeroValue
    this.add = add
  }
}

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T
}
```

## 类型系统高级特性

### 1. 类型推断
```typescript
// 上下文类型推断
window.onmousedown = function(mouseEvent) {
  console.log(mouseEvent.button) // 正确，mouseEvent 被推断为 MouseEvent
}

// 类型参数推断
function map<T, U>(arr: T[], fn: (x: T) => U): U[] {
  return arr.map(fn)
}

// 最佳通用类型推断
let x = [0, 1, null] // 推断为 (number | null)[]

// 类型断言
let someValue: unknown = 'this is a string'
let strLength: number = (someValue as string).length
```

### 2. 类型兼容性
```typescript
// 结构类型
interface Named {
  name: string
}

class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

let p: Named = new Person('John') // 正确，因为结构兼容

// 函数类型兼容
let x = (a: number) => 0
let y = (b: number, s: string) => 0
y = x // 正确
x = y // 错误

// 枚举类型兼容
enum Status { Ready, Waiting }
enum Color { Red, Blue, Green }
let status = Status.Ready
status = Color.Red // 错误
```

### 3. 类型操作符
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

// 条件类型操作符
type TypeName<T> = T extends string ? 'string' : 'other'
```

## 最佳实践

### 1. 类型安全
- 使用类型守卫
- 避免类型断言
- 利用类型推断
- 使用字面量类型
- 合理使用泛型

### 2. 性能优化
- 避免过度使用类型
- 使用类型缓存
- 合理使用泛型
- 避免循环依赖

### 3. 代码组织
- 使用模块化
- 类型声明文件分离
- 使用类型导入导出
- 合理使用命名空间

## 工具和资源

### 1. 开发工具
- TypeScript Playground
- TypeDoc
- ts-node
- ts-loader

### 2. 实用库
- type-fest
- ts-toolbelt
- utility-types
- zod

### 3. 学习资源
- TypeScript 官方文档
- TypeScript 深入理解
- TypeScript 设计模式
- 社区最佳实践