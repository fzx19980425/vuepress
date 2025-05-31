 # TypeScript 简介

TypeScript 是 JavaScript 的超集，它添加了可选的静态类型和基于类的面向对象编程等特性。TypeScript 由微软开发和维护，它扩展了 JavaScript 的语法，所以任何现有的 JavaScript 程序可以不加改变的在 TypeScript 下工作。

## 为什么选择 TypeScript？

1. **类型系统**
   - 静态类型检查
   - 更好的代码提示
   - 更容易重构
   - 减少运行时错误

2. **面向对象特性**
   - 类
   - 接口
   - 泛型
   - 装饰器

3. **工具支持**
   - 更好的 IDE 支持
   - 更强大的代码补全
   - 更准确的代码导航
   - 更好的重构工具

4. **生态系统**
   - 与 JavaScript 完全兼容
   - 可以使用所有 JavaScript 库
   - 活跃的社区支持
   - 完善的类型定义文件

## 快速开始

### 安装 TypeScript

```bash
# 全局安装
npm install -g typescript

# 在项目中安装
npm install typescript --save-dev
```

### 创建第一个 TypeScript 文件

```typescript
// hello.ts
function greet(name: string): string {
    return `Hello, ${name}!`;
}

console.log(greet("TypeScript"));
```

### 编译 TypeScript

```bash
# 编译单个文件
tsc hello.ts

# 使用配置文件编译
tsc --init  # 创建 tsconfig.json
tsc         # 使用配置文件编译
```

## 目录结构

本教程包含以下内容：

1. [基础概念](./basic.md)
   - 类型系统
   - 变量声明
   - 函数
   - 类
   - 接口

2. [高级特性](./advanced.md)
   - 泛型
   - 装饰器
   - 高级类型
   - 模块系统

3. [实战案例](./practice.md)
   - 项目配置
   - 与框架集成
   - 最佳实践
   - 常见问题

## 学习资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript 中文手册](https://typescript.bootcss.com/)
- [TypeScript 入门教程](https://ts.xcatliu.com/)

## 下一步

继续阅读 [基础概念](./basic.md) 开始 TypeScript 的学习之旅。