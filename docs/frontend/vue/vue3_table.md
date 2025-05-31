 # Vue 3 表格组件

Vue 3 推荐使用 Element Plus、Ant Design Vue 等组件库实现表格功能。这里对照 Vue2，介绍 Vue3 的表格用法。

## 1. 基础表格

```vue
<script setup>
import { ref } from 'vue'
const tableData = ref([
  { name: '张三', age: 20 },
  { name: '李四', age: 22 }
])
</script>

<template>
  <el-table :data="tableData">
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="age" label="年龄" />
  </el-table>
</template>
```

## 2. 动态列、插槽、分页、排序等
- 参考组件库文档

## 3. 相关资源
- [Element Plus 表格文档](https://element-plus.org/zh-CN/component/table.html)
- [Ant Design Vue 表格文档](https://www.antdv.com/components/table-cn/)