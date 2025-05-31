 # Vue 3 表单处理

Vue 3 推荐使用 setup 结合组件库（如 Element Plus、Ant Design Vue）进行表单处理。这里对照 Vue2，介绍 Vue3 的表单用法。

## 1. 基础表单

```vue
<script setup>
import { ref } from 'vue'
const form = ref({ name: '', email: '' })
function submit() {
  console.log(form.value)
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.name" placeholder="姓名" />
    <input v-model="form.email" placeholder="邮箱" />
    <button type="submit">提交</button>
  </form>
</template>
```

## 2. 组件库表单

以 Element Plus 为例：

```vue
<script setup>
import { ref } from 'vue'
const form = ref({ name: '', email: '' })
const rules = { name: [{ required: true, message: '请输入姓名', trigger: 'blur' }] }
const formRef = ref()
function submit() {
  formRef.value.validate(valid => {
    if (valid) alert('提交成功')
  })
}
</script>

<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
```

## 3. 校验与自定义规则
- 参考组件库文档

## 4. 相关资源
- [Element Plus 表单文档](https://element-plus.org/zh-CN/component/form.html)