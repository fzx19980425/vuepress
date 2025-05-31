# Vue 2 组件库使用与二次封装

## 1. Element UI 基础使用

### 1.1 按需引入

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}

// main.js
import Vue from 'vue'
import { Button, Select, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Select)
Vue.prototype.$message = Message
```

### 1.2 主题定制

```scss
// variables.scss
$--color-primary: #409EFF;
$--color-success: #67C23A;
$--color-warning: #E6A23C;
$--color-danger: #F56C6C;
$--color-info: #909399;

// 覆盖 Element UI 变量
@import "element-ui/packages/theme-chalk/src/index.scss";
```

## 2. 组件二次封装

### 2.1 表单组件封装

```vue
<!-- components/BaseForm.vue -->
<template>
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
      <!-- 输入框 -->
      <el-form-item
        v-if="item.type === 'input'"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <el-input
          v-model="formData[item.prop]"
          v-bind="item.props"
          v-on="item.events"
        />
      </el-form-item>
      
      <!-- 选择器 -->
      <el-form-item
        v-else-if="item.type === 'select'"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <el-select
          v-model="formData[item.prop]"
          v-bind="item.props"
          v-on="item.events"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <!-- 日期选择器 -->
      <el-form-item
        v-else-if="item.type === 'date'"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <el-date-picker
          v-model="formData[item.prop]"
          v-bind="item.props"
          v-on="item.events"
        />
      </el-form-item>
    </template>
    
    <!-- 表单按钮 -->
    <el-form-item v-if="showButtons">
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ submitText }}
      </el-button>
      <el-button @click="handleReset">
        {{ resetText }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BaseForm',
  
  props: {
    formData: {
      type: Object,
      required: true
    },
    formItems: {
      type: Array,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    inline: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showButtons: {
      type: Boolean,
      default: true
    },
    submitText: {
      type: String,
      default: '提交'
    },
    resetText: {
      type: String,
      default: '重置'
    }
  },
  
  data() {
    return {
      loading: false
    }
  },
  
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
    reset() {
      this.$refs.form.resetFields()
    },
    
    // 提交表单
    async handleSubmit() {
      try {
        this.loading = true
        const valid = await this.validate()
        this.$emit('submit', valid)
      } catch (error) {
        this.$emit('error', error)
      } finally {
        this.loading = false
      }
    },
    
    // 重置表单
    handleReset() {
      this.reset()
      this.$emit('reset')
    }
  }
}
</script>
```

### 2.2 表格组件封装

```vue
<!-- components/BaseTable.vue -->
<template>
  <div class="base-table">
    <!-- 表格工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <slot name="toolbar">
        <el-button
          v-if="showAdd"
          type="primary"
          @click="$emit('add')"
        >
          新增
        </el-button>
        <el-button
          v-if="showDelete"
          type="danger"
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </slot>
    </div>
    
    <!-- 表格主体 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :border="border"
      :stripe="stripe"
      :size="size"
      :height="height"
      :max-height="maxHeight"
      :row-key="rowKey"
      :selection="selection"
      @selection-change="handleSelectionChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
        align="center"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="80"
        align="center"
      />
      
      <!-- 数据列 -->
      <template v-for="(column, index) in columns">
        <el-table-column
          :key="index"
          v-bind="column"
        >
          <template v-slot="scope">
            <slot
              :name="column.prop"
              :row="scope.row"
              :index="scope.$index"
            >
              {{ scope.row[column.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="showOperation"
        label="操作"
        :width="operationWidth"
        align="center"
      >
        <template v-slot="scope">
          <slot name="operation" :row="scope.row" :index="scope.$index">
            <el-button
              v-if="showEdit"
              type="text"
              size="small"
              @click="$emit('edit', scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="showDelete"
              type="text"
              size="small"
              class="delete-btn"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div v-if="showPagination" class="table-pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  
  props: {
    // 表格数据
    data: {
      type: Array,
      required: true
    },
    // 列配置
    columns: {
      type: Array,
      required: true
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: true
    },
    // 是否显示斑马纹
    stripe: {
      type: Boolean,
      default: true
    },
    // 表格大小
    size: {
      type: String,
      default: 'medium'
    },
    // 表格高度
    height: {
      type: [String, Number],
      default: null
    },
    // 表格最大高度
    maxHeight: {
      type: [String, Number],
      default: null
    },
    // 行数据的 Key
    rowKey: {
      type: String,
      default: 'id'
    },
    // 是否显示多选
    selection: {
      type: Boolean,
      default: false
    },
    // 是否显示序号
    showIndex: {
      type: Boolean,
      default: true
    },
    // 是否显示工具栏
    showToolbar: {
      type: Boolean,
      default: true
    },
    // 是否显示新增按钮
    showAdd: {
      type: Boolean,
      default: true
    },
    // 是否显示删除按钮
    showDelete: {
      type: Boolean,
      default: true
    },
    // 是否显示操作列
    showOperation: {
      type: Boolean,
      default: true
    },
    // 是否显示编辑按钮
    showEdit: {
      type: Boolean,
      default: true
    },
    // 操作列宽度
    operationWidth: {
      type: [String, Number],
      default: 150
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true
    },
    // 每页显示个数选择器的选项设置
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    // 总条目数
    total: {
      type: Number,
      default: 0
    }
  },
  
  data() {
    return {
      loading: false,
      selectedRows: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  
  methods: {
    // 选择项变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
      this.$emit('selection-change', selection)
    },
    
    // 删除行
    handleDelete(row) {
      this.$confirm('确认删除该记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$emit('delete', row)
      }).catch(() => {})
    },
    
    // 批量删除
    handleBatchDelete() {
      if (!this.selectedRows.length) {
        this.$message.warning('请选择要删除的记录')
        return
      }
      
      this.$confirm(`确认删除选中的 ${this.selectedRows.length} 条记录吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.$emit('batch-delete', this.selectedRows)
      }).catch(() => {})
    },
    
    // 每页条数变化
    handleSizeChange(val) {
      this.pageSize = val
      this.$emit('size-change', val)
    },
    
    // 当前页变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('current-change', val)
    },
    
    // 刷新表格
    refresh() {
      this.$emit('refresh')
    },
    
    // 清空选择
    clearSelection() {
      this.$refs.table.clearSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
.base-table {
  .table-toolbar {
    margin-bottom: 16px;
  }
  
  .table-pagination {
    margin-top: 16px;
    text-align: right;
  }
  
  .delete-btn {
    color: #F56C6C;
  }
}
</style>
```

### 2.3 搜索组件封装

```vue
<!-- components/BaseSearch.vue -->
<template>
  <el-form
    ref="form"
    :model="formData"
    :inline="true"
    :size="size"
    class="base-search"
  >
    <template v-for="(item, index) in searchItems">
      <!-- 输入框 -->
      <el-form-item
        v-if="item.type === 'input'"
        :key="index"
        :label="item.label"
      >
        <el-input
          v-model="formData[item.prop]"
          v-bind="item.props"
          v-on="item.events"
          :placeholder="item.placeholder || `请输入${item.label}`"
        />
      </el-form-item>
      
      <!-- 选择器 -->
      <el-form-item
        v-else-if="item.type === 'select'"
        :key="index"
        :label="item.label"
      >
        <el-select
          v-model="formData[item.prop]"
          v-bind="item.props"
          v-on="item.events"
          :placeholder="item.placeholder || `请选择${item.label}`"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <!-- 日期选择器 -->
      <el-form-item
        v-else-if="item.type === 'date'"
        :key="index"
        :label="item.label"
      >
        <el-date-picker
          v-model="formData[item.prop]"
          v-bind="item.props"
          v-on="item.events"
          :placeholder="item.placeholder || `请选择${item.label}`"
        />
      </el-form-item>
    </template>
    
    <!-- 搜索按钮 -->
    <el-form-item>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSearch"
      >
        搜索
      </el-button>
      <el-button @click="handleReset">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BaseSearch',
  
  props: {
    // 表单数据
    formData: {
      type: Object,
      required: true
    },
    // 表单项配置
    searchItems: {
      type: Array,
      required: true
    },
    // 表单大小
    size: {
      type: String,
      default: 'medium'
    }
  },
  
  data() {
    return {
      loading: false
    }
  },
  
  methods: {
    // 搜索
    handleSearch() {
      this.loading = true
      this.$emit('search', this.formData)
      this.loading = false
    },
    
    // 重置
    handleReset() {
      this.$refs.form.resetFields()
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.base-search {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
}
</style>
```

## 3. 组件通信

### 3.1 事件总线

```javascript
// utils/event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 组件 A
EventBus.$emit('event-name', data)

// 组件 B
EventBus.$on('event-name', data => {
  // 处理数据
})
```

### 3.2 组件插槽

```vue
<!-- 父组件 -->
<template>
  <child-component>
    <!-- 默认插槽 -->
    <div>默认内容</div>
    
    <!-- 具名插槽 -->
    <template #header>
      <div>头部内容</div>
    </template>
    
    <!-- 作用域插槽 -->
    <template #default="slotProps">
      <div>{{ slotProps.item }}</div>
    </template>
  </child-component>
</template>

<!-- 子组件 -->
<template>
  <div>
    <!-- 默认插槽 -->
    <slot></slot>
    
    <!-- 具名插槽 -->
    <slot name="header"></slot>
    
    <!-- 作用域插槽 -->
    <slot
      v-for="item in items"
      :item="item"
    ></slot>
  </div>
</template>
```

## 4. 最佳实践

### 4.1 组件设计原则

1. **单一职责**：每个组件只负责一个功能
2. **可复用性**：组件应该是可复用的
3. **可维护性**：组件应该易于维护和扩展
4. **可测试性**：组件应该易于测试
5. **性能优化**：组件应该考虑性能问题

### 4.2 组件文档

```javascript
// 组件文档示例
/**
 * @component BaseForm
 * @description 基础表单组件
 * @author Your Name
 * @version 1.0.0
 * 
 * @example
 * <base-form
 *   :form-data="formData"
 *   :form-items="formItems"
 *   :rules="rules"
 *   @submit="handleSubmit"
 * />
 * 
 * @property {Object} formData - 表单数据对象
 * @property {Array} formItems - 表单项配置数组
 * @property {Object} rules - 表单验证规则
 * @property {String} labelWidth - 标签宽度
 * @property {String} labelPosition - 标签位置
 * @property {Boolean} inline - 是否行内表单
 * @property {String} size - 表单大小
 * @property {Boolean} disabled - 是否禁用
 * @property {Boolean} showButtons - 是否显示按钮
 * @property {String} submitText - 提交按钮文本
 * @property {String} resetText - 重置按钮文本
 * 
 * @event {Function} submit - 表单提交事件
 * @event {Function} reset - 表单重置事件
 * @event {Function} error - 表单验证失败事件
 */
```

## 5. 相关资源

- [Element UI 官方文档](https://element.eleme.cn/#/zh-CN)
- [Vue 组件设计原则](https://cn.vuejs.org/v2/style-guide/)
- [Vue 组件通信方式](https://juejin.cn/post/6844903887162310669) 