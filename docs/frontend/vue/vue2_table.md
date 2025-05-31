 # Vue 2 表格封装

## 1. 基础表格组件

### 1.1 组件结构

```vue
<template>
  <div class="base-table">
    <!-- 搜索区域 -->
    <div v-if="showSearch" class="filter-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <slot name="search"></slot>
        </el-col>
      </el-row>
    </div>

    <!-- 表格主体 -->
    <el-table
      v-loading="loading"
      ref="table"
      :data="data"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      :row-key="rowKey"
      :tree-props="treeProps"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <!-- 选择列 -->
      <el-table-column v-if="showSelection" type="selection" width="55" align="center" />

      <!-- 序号列 -->
      <el-table-column v-if="showIndex" type="index" label="序号" width="80" align="center" />

      <!-- 动态列 -->
      <template v-for="(column, index) in columns">
        <el-table-column
          :key="column.prop || index"
          v-bind="column"
          :align="column.align || 'center'"
        >
          <template slot-scope="scope">
            <template v-if="column.render">
              <!-- 如果定义了render函数，则调用函数渲染内容 -->
              <render-content
                :render="column.render"
                :row="scope.row"
                :index="scope.$index"
              ></render-content>
            </template>
            <template v-else>
              <!-- 否则渲染默认的属性值 -->
              {{ scope.row[column.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="showOperation"
        :label="$t('common.operation')"
        :width="operationWidth"
        :align="operationAlign"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <slot name="operation" :row="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination-container">
      <el-pagination
        :background="background"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        :layout="paginationLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
```

### 1.2 组件属性

```javascript
export default {
  name: 'BaseTable',
  props: {
    // 数据源
    data: {
      type: Array,
      required: true,
    },
    // 列配置
    columns: {
      type: Array,
      default: () => [],
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: true,
    },
    // 是否显示斑马纹
    stripe: {
      type: Boolean,
      default: true,
    },
    // 表格高度
    height: {
      type: [String, Number],
      default: null,
    },
    // 表格最大高度
    maxHeight: {
      type: [String, Number],
      default: null,
    },
    // 行数据的 Key
    rowKey: {
      type: String,
      default: 'id',
    },
    // 树形数据配置
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        hasChildren: 'hasChildren',
      }),
    },
    // 默认排序
    defaultSort: {
      type: Object,
      default: () => ({}),
    },
    // 是否显示搜索区域
    showSearch: {
      type: Boolean,
      default: true,
    },
    // 是否显示选择列
    showSelection: {
      type: Boolean,
      default: false,
    },
    // 是否显示序号列
    showIndex: {
      type: Boolean,
      default: false,
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true,
    },
    // 分页背景色
    background: {
      type: Boolean,
      default: true,
    },
    // 分页布局
    paginationLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    // 每页显示个数选择器的选项设置
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
    // 总条数
    total: {
      type: Number,
      default: 0,
    },
    // 是否显示操作列
    showOperation: {
      type: Boolean,
      default: true,
    },
    // 操作列宽度
    operationWidth: {
      type: [String, Number],
      default: 230,
    },
    // 操作列对齐方式
    operationAlign: {
      type: String,
      default: 'center',
    },
  }
}
```

### 1.3 组件方法

```javascript
methods: {
  // 排序变化
  handleSortChange(sort) {
    this.$emit('sort-change', sort)
  },
  // 选择变化
  handleSelectionChange(selection) {
    this.selectedRows = selection
    this.$emit('selection-change', selection)
  },
  // 树形表格展开/收起
  toggleRowExpansion(row, expanded) {
    this.$refs.table.toggleRowExpansion(row, expanded)
  },
  // 展开所有行
  expandAll() {
    this.data.forEach(row => {
      this.$refs.table.toggleRowExpansion(row, true)
    })
  },
  // 收起所有行
  collapseAll() {
    this.data.forEach(row => {
      this.$refs.table.toggleRowExpansion(row, false)
    })
  },
  // 每页条数变化
  handleSizeChange(val) {
    this.pageSize = val
    this.$emit('pagination', {
      page: this.currentPage,
      limit: val,
    })
  },
  // 当前页变化
  handleCurrentChange(val) {
    this.currentPage = val
    this.$emit('pagination', {
      page: val,
      limit: this.pageSize,
    })
  },
}
```

## 2. 使用示例

### 2.1 基础表格

```vue
<template>
  <base-table
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :total="total"
    @pagination="handlePagination"
  >
    <!-- 搜索区域 -->
    <template #search>
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作列 -->
    <template #operation="{ row }">
      <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
      <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
    </template>
  </base-table>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      queryParams: {
        name: '',
        page: 1,
        limit: 10
      },
      columns: [
        {
          prop: 'name',
          label: '姓名',
          width: '120'
        },
        {
          prop: 'age',
          label: '年龄',
          width: '80'
        },
        {
          prop: 'address',
          label: '地址'
        },
        {
          prop: 'status',
          label: '状态',
          render: (h, row) => {
            return h('el-tag', {
              props: {
                type: row.status === 1 ? 'success' : 'danger'
              }
            }, row.status === 1 ? '启用' : '禁用')
          }
        }
      ]
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const { data } = await this.$api.getList(this.queryParams)
        this.tableData = data.list
        this.total = data.total
      } catch (error) {
        console.error('获取数据失败：', error)
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.queryParams.page = 1
      this.fetchData()
    },
    handleReset() {
      this.queryParams = {
        name: '',
        page: 1,
        limit: 10
      }
      this.fetchData()
    },
    handlePagination({ page, limit }) {
      this.queryParams.page = page
      this.queryParams.limit = limit
      this.fetchData()
    },
    handleEdit(row) {
      // 处理编辑
    },
    handleDelete(row) {
      // 处理删除
    }
  },
  created() {
    this.fetchData()
  }
}
</script>
```

### 2.2 树形表格

```vue
<template>
  <base-table
    :data="tableData"
    :columns="columns"
    :tree-props="treeProps"
  >
    <template #operation="{ row }">
      <el-button size="mini" @click="handleAdd(row)">添加子节点</el-button>
      <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
      <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
    </template>
  </base-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'name',
          label: '名称',
          width: '200'
        },
        {
          prop: 'type',
          label: '类型',
          width: '120'
        },
        {
          prop: 'description',
          label: '描述'
        }
      ],
      treeProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      }
    }
  }
}
</script>
```

### 2.3 可编辑表格

```vue
<template>
  <base-table
    :data="tableData"
    :columns="columns"
  >
    <template #operation="{ row, index }">
      <el-button size="mini" @click="handleSave(row, index)">保存</el-button>
      <el-button size="mini" @click="handleCancel(row, index)">取消</el-button>
    </template>
  </base-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'name',
          label: '姓名',
          render: (h, row, index) => {
            return h('el-input', {
              props: {
                value: row.name
              },
              on: {
                input: (val) => {
                  row.name = val
                }
              }
            })
          }
        },
        {
          prop: 'age',
          label: '年龄',
          render: (h, row, index) => {
            return h('el-input-number', {
              props: {
                value: row.age,
                min: 0,
                max: 120
              },
              on: {
                input: (val) => {
                  row.age = val
                }
              }
            })
          }
        }
      ]
    }
  }
}
</script>
```

## 3. 高级特性

### 3.1 自定义列渲染

```javascript
// 列配置
const columns = [
  {
    prop: 'status',
    label: '状态',
    render: (h, row) => {
      const statusMap = {
        1: { type: 'success', text: '启用' },
        0: { type: 'danger', text: '禁用' }
      }
      const status = statusMap[row.status]
      return h('el-tag', {
        props: {
          type: status.type
        }
      }, status.text)
    }
  },
  {
    prop: 'image',
    label: '图片',
    render: (h, row) => {
      return h('el-image', {
        props: {
          src: row.image,
          fit: 'cover',
          'preview-src-list': [row.image]
        },
        style: {
          width: '50px',
          height: '50px'
        }
      })
    }
  }
]
```

### 3.2 表格拖拽排序

```vue
<template>
  <base-table
    :data="tableData"
    :columns="columns"
    row-key="id"
  >
    <template #default="{ row, $index }">
      <draggable
        v-model="tableData"
        :animation="150"
        @end="handleDragEnd"
      >
        <tr :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
        </tr>
      </draggable>
    </template>
  </base-table>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  methods: {
    handleDragEnd() {
      // 处理拖拽结束后的逻辑
      this.saveOrder()
    },
    async saveOrder() {
      try {
        await this.$api.saveOrder(this.tableData.map((item, index) => ({
          id: item.id,
          order: index
        })))
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>
```

### 3.3 表格导出

```javascript
// 导出 Excel
import { export_json_to_excel } from '@/vendor/Export2Excel'

export function exportExcel(columns, data, filename) {
  const tHeader = columns.map(col => col.label)
  const filterVal = columns.map(col => col.prop)
  const list = data.map(item => filterVal.map(key => item[key]))
  
  export_json_to_excel({
    header: tHeader,
    data: list,
    filename: filename
  })
}

// 使用示例
handleExport() {
  const columns = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
    { prop: 'address', label: '地址' }
  ]
  exportExcel(columns, this.tableData, '用户列表')
}
```

## 4. 最佳实践

### 4.1 性能优化

1. **虚拟滚动**
   - 使用 `el-table` 的 `height` 属性
   - 设置合适的 `max-height`
   - 避免一次性加载大量数据

2. **按需加载**
   - 使用分页加载数据
   - 实现无限滚动
   - 延迟加载非关键数据

3. **缓存优化**
   - 缓存表格数据
   - 缓存列配置
   - 避免频繁重新渲染

### 4.2 代码组织

1. **目录结构**
```
components/
  table/
    BaseTable.vue
    TableColumn.vue
    TableSearch.vue
    TableOperation.vue
```

2. **模块划分**
```javascript
// 列配置
const columnConfig = {
  // 基础列
  base: [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' }
  ],
  // 扩展列
  extend: [
    { prop: 'status', label: '状态' },
    { prop: 'createTime', label: '创建时间' }
  ]
}

// 搜索配置
const searchConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input' },
    { prop: 'status', label: '状态', type: 'select' }
  ],
  rules: {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ]
  }
}
```

### 4.3 错误处理

```javascript
// 错误处理
async fetchData() {
  this.loading = true
  try {
    const { data } = await this.$api.getList(this.queryParams)
    this.tableData = data.list
    this.total = data.total
  } catch (error) {
    this.$message.error('获取数据失败')
    console.error('获取数据失败：', error)
  } finally {
    this.loading = false
  }
}

// 数据验证
validateData(data) {
  const errors = []
  data.forEach((item, index) => {
    if (!item.name) {
      errors.push(`第 ${index + 1} 行姓名不能为空`)
    }
    if (item.age && (item.age < 0 || item.age > 120)) {
      errors.push(`第 ${index + 1} 行年龄必须在 0-120 之间`)
    }
  })
  return errors
}
```

## 5. 相关资源

- [Element UI Table 组件](https://element.eleme.cn/#/zh-CN/component/table)
- [Vue 2 虚拟滚动](https://github.com/Akryum/vue-virtual-scroller)
- [Vue 2 拖拽排序](https://github.com/SortableJS/Vue.Draggable)