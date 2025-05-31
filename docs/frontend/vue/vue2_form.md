 # Vue 2 表单封装

## 1. 基础表单组件

### 1.1 组件结构

```vue
<template>
  <div class="base-form">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :inline="inline"
      :size="size"
      :disabled="disabled"
    >
      <template v-for="(item, index) in formItems">
        <el-form-item :key="index" :label="item.label" :prop="item.prop" :rules="item.rules">
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="formData[item.prop]"
            v-bind="item.props || {}"
            :placeholder="item.placeholder"
          />

          <!-- 选择器 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="formData[item.prop]"
            v-bind="item.props || {}"
            :placeholder="item.placeholder"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>

          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="formData[item.prop]"
            v-bind="item.props || {}"
            :placeholder="item.placeholder"
          />

          <!-- 时间选择器 -->
          <el-time-picker
            v-else-if="item.type === 'time'"
            v-model="formData[item.prop]"
            v-bind="item.props || {}"
            :placeholder="item.placeholder"
          />

          <!-- 日期时间选择器 -->
          <el-date-picker
            v-else-if="item.type === 'datetime'"
            v-model="formData[item.prop]"
            v-bind="item.props || {}"
            type="datetime"
            :placeholder="item.placeholder"
          />

          <!-- 开关 -->
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="formData[item.prop]"
            v-bind="item.props || {}"
          />

          <!-- 单选框组 -->
          <el-radio-group
            v-else-if="item.type === 'radio'"
            v-model="formData[item.prop]"
            v-bind="item.props || {}"
          >
            <el-radio v-for="option in item.options" :key="option.value" :label="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>

          <!-- 复选框组 -->
          <el-checkbox-group
            v-else-if="item.type === 'checkbox'"
            v-model="formData[item.prop]"
            v-bind="item.props || {}"
          >
            <el-checkbox v-for="option in item.options" :key="option.value" :label="option.value">
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- 文本域 -->
          <el-input
            v-else-if="item.type === 'textarea'"
            v-model="formData[item.prop]"
            type="textarea"
            v-bind="item.props || {}"
            :placeholder="item.placeholder"
          />

          <!-- 自定义插槽 -->
          <slot
            v-else-if="item.type === 'slot'"
            :name="item.slotName"
            :form-data="formData"
            :item="item"
          ></slot>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
```

### 1.2 组件属性

```javascript
export default {
  name: 'BaseForm',
  props: {
    // 表单数据对象
    formData: {
      type: Object,
      required: true,
    },
    // 表单项配置
    formItems: {
      type: Array,
      default: () => [],
    },
    // 表单验证规则
    rules: {
      type: Object,
      default: () => ({}),
    },
    // 表单标签宽度
    labelWidth: {
      type: String,
      default: '100px',
    },
    // 表单标签位置
    labelPosition: {
      type: String,
      default: 'right',
      validator: value => ['left', 'right', 'top'].includes(value),
    },
    // 是否行内表单
    inline: {
      type: Boolean,
      default: false,
    },
    // 表单尺寸
    size: {
      type: String,
      default: 'medium',
      validator: value => ['large', 'medium', 'small', 'mini'].includes(value),
    },
    // 是否禁用表单
    disabled: {
      type: Boolean,
      default: false,
    },
  }
}
```

### 1.3 组件方法

```javascript
methods: {
  // 表单验证
  validate() {
    return new Promise((resolve, reject) => {
      this.$refs.form.validate((valid, error) => {
        if (valid) {
          resolve(this.formData)
        } else {
          reject(error)
        }
      })
    })
  },
  // 重置表单
  resetForm() {
    this.$refs.form.resetFields()
  },
  // 清除验证
  clearValidate(props) {
    this.$refs.form.clearValidate(props)
  },
}
```

## 2. 使用示例

### 2.1 基础表单

```vue
<template>
  <base-form
    ref="form"
    :form-data="formData"
    :form-items="formItems"
    :rules="rules"
  />
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        age: '',
        gender: '',
        hobbies: [],
        birthday: '',
        description: ''
      },
      formItems: [
        {
          type: 'input',
          label: '姓名',
          prop: 'name',
          placeholder: '请输入姓名'
        },
        {
          type: 'select',
          label: '性别',
          prop: 'gender',
          placeholder: '请选择性别',
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ]
        },
        {
          type: 'checkbox',
          label: '爱好',
          prop: 'hobbies',
          options: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '音乐', value: 'music' }
          ]
        },
        {
          type: 'date',
          label: '生日',
          prop: 'birthday',
          placeholder: '请选择生日'
        },
        {
          type: 'textarea',
          label: '描述',
          prop: 'description',
          placeholder: '请输入描述'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        birthday: [
          { required: true, message: '请选择生日', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        const formData = await this.$refs.form.validate()
        console.log('表单数据：', formData)
        // 处理表单提交
      } catch (error) {
        console.error('表单验证失败：', error)
      }
    }
  }
}
</script>
```

### 2.2 动态表单

```vue
<template>
  <base-form
    ref="form"
    :form-data="formData"
    :form-items="dynamicFormItems"
    :rules="rules"
  />
</template>

<script>
export default {
  data() {
    return {
      formData: {
        type: '',
        fields: []
      },
      formTypeOptions: [
        { label: '文本', value: 'text' },
        { label: '数字', value: 'number' },
        { label: '日期', value: 'date' }
      ]
    }
  },
  computed: {
    dynamicFormItems() {
      const items = [
        {
          type: 'select',
          label: '表单类型',
          prop: 'type',
          placeholder: '请选择表单类型',
          options: this.formTypeOptions
        }
      ]

      // 根据表单类型动态添加字段
      if (this.formData.type) {
        items.push({
          type: 'input',
          label: '字段名称',
          prop: 'fields[0].name',
          placeholder: '请输入字段名称'
        })

        if (this.formData.type === 'number') {
          items.push({
            type: 'input',
            label: '最小值',
            prop: 'fields[0].min',
            placeholder: '请输入最小值'
          })
          items.push({
            type: 'input',
            label: '最大值',
            prop: 'fields[0].max',
            placeholder: '请输入最大值'
          })
        }
      }

      return items
    }
  }
}
</script>
```

### 2.3 自定义表单项

```vue
<template>
  <base-form
    ref="form"
    :form-data="formData"
    :form-items="formItems"
  >
    <!-- 自定义上传组件 -->
    <template #upload="{ formData, item }">
      <el-upload
        :action="item.uploadUrl"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </template>
  </base-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        avatar: ''
      },
      formItems: [
        {
          type: 'input',
          label: '姓名',
          prop: 'name',
          placeholder: '请输入姓名'
        },
        {
          type: 'slot',
          label: '头像',
          prop: 'avatar',
          slotName: 'upload',
          uploadUrl: '/api/upload'
        }
      ]
    }
  },
  methods: {
    handleUploadSuccess(response, file) {
      this.formData.avatar = response.url
    },
    handleUploadError() {
      this.$message.error('上传失败')
    }
  }
}
</script>
```

## 3. 高级表单示例

### 3.1 动态表单

```vue
<template>
  <base-form
    ref="form"
    :form-data="formData"
    :form-items="dynamicFormItems"
    :rules="rules"
  >
    <template #custom-field="{ formData, item }">
      <div class="dynamic-field">
        <el-button @click="addField(item.prop)">添加字段</el-button>
        <div v-for="(field, index) in formData[item.prop]" :key="index">
          <el-input v-model="field.value" placeholder="请输入值" />
          <el-button @click="removeField(item.prop, index)">删除</el-button>
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        dynamicFields: []
      },
      dynamicFormItems: [
        {
          type: 'slot',
          label: '动态字段',
          prop: 'dynamicFields',
          slotName: 'custom-field'
        }
      ],
      rules: {
        dynamicFields: [
          { required: true, message: '请至少添加一个字段', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addField(prop) {
      this.formData[prop].push({ value: '' })
    },
    removeField(prop, index) {
      this.formData[prop].splice(index, 1)
    }
  }
}
</script>
```

### 3.2 表单联动示例

```vue
<template>
  <base-form
    ref="form"
    :form-data="formData"
    :form-items="formItems"
    :rules="rules"
  />
</template>

<script>
export default {
  data() {
    return {
      formData: {
        country: '',
        province: '',
        city: ''
      },
      formItems: [
        {
          type: 'select',
          label: '国家',
          prop: 'country',
          options: [
            { label: '中国', value: 'china' },
            { label: '美国', value: 'usa' }
          ]
        },
        {
          type: 'select',
          label: '省份',
          prop: 'province',
          options: [],
          disabled: true
        },
        {
          type: 'select',
          label: '城市',
          prop: 'city',
          options: [],
          disabled: true
        }
      ],
      rules: {
        country: [{ required: true, message: '请选择国家', trigger: 'change' }],
        province: [{ required: true, message: '请选择省份', trigger: 'change' }],
        city: [{ required: true, message: '请选择城市', trigger: 'change' }]
      }
    }
  },
  watch: {
    'formData.country': {
      handler(val) {
        this.formData.province = ''
        this.formData.city = ''
        this.updateProvinceOptions(val)
      }
    },
    'formData.province': {
      handler(val) {
        this.formData.city = ''
        this.updateCityOptions(val)
      }
    }
  },
  methods: {
    updateProvinceOptions(country) {
      const provinceMap = {
        china: [
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' }
        ],
        usa: [
          { label: 'California', value: 'california' },
          { label: 'New York', value: 'newyork' }
        ]
      }
      this.formItems[1].options = provinceMap[country] || []
      this.formItems[1].disabled = !country
    },
    updateCityOptions(province) {
      const cityMap = {
        beijing: [
          { label: '朝阳区', value: 'chaoyang' },
          { label: '海淀区', value: 'haidian' }
        ],
        shanghai: [
          { label: '浦东新区', value: 'pudong' },
          { label: '黄浦区', value: 'huangpu' }
        ]
      }
      this.formItems[2].options = cityMap[province] || []
      this.formItems[2].disabled = !province
    }
  }
}
</script>
```

### 3.3 表单验证最佳实践

```javascript
// 通用验证规则
const commonRules = {
  // 必填验证
  required: (message = '此项为必填项') => ({
    required: true,
    message,
    trigger: 'blur'
  }),
  
  // 手机号验证
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号',
    trigger: 'blur'
  },
  
  // 邮箱验证
  email: {
    type: 'email',
    message: '请输入正确的邮箱地址',
    trigger: 'blur'
  },
  
  // 身份证验证
  idCard: {
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message: '请输入正确的身份证号',
    trigger: 'blur'
  },
  
  // 数字范围验证
  numberRange: (min, max) => ({
    type: 'number',
    min,
    max,
    message: `请输入${min}到${max}之间的数字`,
    trigger: 'blur'
  }),
  
  // 自定义正则验证
  pattern: (pattern, message) => ({
    pattern,
    message,
    trigger: 'blur'
  })
}

// 使用示例
export default {
  data() {
    return {
      rules: {
        name: [
          commonRules.required('请输入姓名'),
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          commonRules.required('请输入手机号'),
          commonRules.phone
        ],
        email: [
          commonRules.required('请输入邮箱'),
          commonRules.email
        ],
        age: [
          commonRules.required('请输入年龄'),
          commonRules.numberRange(0, 150)
        ]
      }
    }
  }
}
```

### 3.4 表单提交最佳实践

```javascript
export default {
  methods: {
    async handleSubmit() {
      try {
        // 表单验证
        await this.$refs.form.validate()
        
        // 提交前数据处理
        const submitData = this.processFormData(this.formData)
        
        // 显示加载状态
        this.loading = true
        
        // 提交数据
        const response = await this.$api.submitForm(submitData)
        
        // 处理响应
        if (response.success) {
          this.$message.success('提交成功')
          this.resetForm()
        } else {
          this.$message.error(response.message || '提交失败')
        }
      } catch (error) {
        // 处理验证错误
        if (error instanceof Error) {
          this.$message.error('表单验证失败，请检查输入')
        } else {
          this.$message.error('提交失败，请稍后重试')
        }
      } finally {
        this.loading = false
      }
    },
    
    // 表单数据处理
    processFormData(data) {
      // 深拷贝避免修改原始数据
      const processedData = JSON.parse(JSON.stringify(data))
      
      // 数据转换
      Object.keys(processedData).forEach(key => {
        // 处理日期格式
        if (processedData[key] instanceof Date) {
          processedData[key] = this.formatDate(processedData[key])
        }
        
        // 处理空值
        if (processedData[key] === '') {
          processedData[key] = null
        }
      })
      
      return processedData
    },
    
    // 日期格式化
    formatDate(date) {
      return date.toISOString().split('T')[0]
    }
  }
}
```

## 4. 性能优化建议

1. **合理使用计算属性**
   - 对于需要复杂计算的表单数据，使用计算属性缓存结果
   - 避免在模板中进行复杂计算

2. **防抖处理**
   - 对输入框的验证和搜索等操作进行防抖处理
   - 避免频繁触发验证和请求

3. **按需加载**
   - 对于复杂的表单组件，使用异步组件
   - 减少首屏加载时间

4. **数据监听优化**
   - 使用 `watch` 时设置 `deep` 和 `immediate` 选项
   - 避免不必要的深度监听

5. **表单验证优化**
   - 合理设置验证触发时机
   - 避免同时触发多个验证规则

## 5. 常见问题解决方案

1. **表单重置问题**
   ```javascript
   // 正确的重置方式
   this.$nextTick(() => {
     this.$refs.form.resetFields()
   })
   ```

2. **动态表单项验证**
   ```javascript
   // 动态添加验证规则
   this.$set(this.rules, 'newField', [
     { required: true, message: '必填项', trigger: 'blur' }
   ])
   ```

3. **表单数据初始化**
   ```javascript
   // 使用 Vue.set 确保响应式
   this.$set(this.formData, 'newField', '')
   ```

4. **自定义验证规则**
   ```javascript
   // 异步验证示例
   const asyncValidator = (rule, value, callback) => {
     setTimeout(() => {
       if (value === 'test') {
         callback(new Error('不能使用测试值'))
       } else {
         callback()
       }
     }, 1000)
   }
   ```

5. **表单数据持久化**
   ```javascript
   // 保存表单数据到 localStorage
   saveFormData() {
     localStorage.setItem('formData', JSON.stringify(this.formData))
   }
   
   // 恢复表单数据
   restoreFormData() {
     const savedData = localStorage.getItem('formData')
     if (savedData) {
       this.formData = JSON.parse(savedData)
     }
   }
   ```

## 6. 最佳实践

### 6.1 组件设计原则

1. **单一职责**
   - 每个表单项组件只负责一种类型的输入
   - 将复杂的表单逻辑拆分为多个小组件

2. **可配置性**
   - 提供丰富的配置选项
   - 支持自定义验证规则
   - 支持自定义样式

3. **可扩展性**
   - 支持自定义表单项
   - 提供插槽机制
   - 支持表单联动

### 6.2 代码组织

1. **目录结构**
```
components/
  form/
    BaseForm.vue
    FormItem.vue
    validators/
      index.js
      rules.js
    utils/
      formatter.js
      validator.js
```

2. **模块划分**
```javascript
// validators/index.js
export * from './rules'

// validators/rules.js
export const rules = {
  required: (message) => ({
    required: true,
    message
  }),
  email: {
    type: 'email',
    message: '请输入正确的邮箱地址'
  }
}

// utils/formatter.js
export const formatters = {
  date: (val) => dayjs(val).format('YYYY-MM-DD'),
  number: (val) => Number(val).toFixed(2)
}
```

## 7. 相关资源

- [Element UI Form 组件](https://element.eleme.cn/#/zh-CN/component/form)
- [Vue 2 表单验证](https://v2.vuejs.org/v2/guide/forms.html)
- [Vue 2 自定义指令](https://v2.vuejs.org/v2/guide/custom-directive.html)