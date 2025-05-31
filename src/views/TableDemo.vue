<template>
  <div class="table-demo">
    <div class="component-section">
      <h2>Table 表格</h2>
      <p class="component-desc">用于展示大量结构化数据。</p>

      <div class="demo-block">
        <h3>基础用法</h3>
        <p class="demo-desc">基础的表格展示。</p>
        <div class="demo-content">
          <ui-table :data="tableData" :columns="columns"></ui-table>
        </div>
        <div class="demo-attributes">
          <h4>Table 属性</h4>
          <table>
            <thead>
              <tr>
                <th>参数</th>
                <th>说明</th>
                <th>类型</th>
                <th>可选值</th>
                <th>默认值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>data</td>
                <td>显示的数据</td>
                <td>array</td>
                <td>—</td>
                <td>[]</td>
              </tr>
              <tr>
                <td>columns</td>
                <td>表格列的配置</td>
                <td>array</td>
                <td>—</td>
                <td>[]</td>
              </tr>
              <tr>
                <td>border</td>
                <td>是否带有纵向边框</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
               <tr>
                <td>selection</td>
                <td>是否支持多选</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
              <tr>
                <td>showHeader</td>
                <td>是否显示表头</td>
                <td>boolean</td>
                <td>—</td>
                <td>true</td>
              </tr>
              <tr>
                <td>emptyText</td>
                <td>空数据时显示的文本</td>
                <td>string</td>
                <td>—</td>
                <td>暂无数据</td>
              </tr>
            </tbody>
          </table>

           <h4>Column 属性</h4>
          <table>
            <thead>
              <tr>
                <th>参数</th>
                <th>说明</th>
                <th>类型</th>
                <th>可选值</th>
                <th>默认值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>prop</td>
                <td>对应列内容的字段名</td>
                <td>string</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>label</td>
                <td>显示标题</td>
                <td>string</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>width</td>
                <td>对应列的宽度</td>
                <td>string, number</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>sortable</td>
                <td>是否可排序</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
              <tr>
                <td>template</td>
                <td>是否使用自定义列模板</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
            </tbody>
          </table>

           <h4>Table 事件</h4>
          <table>
            <thead>
              <tr>
                <th>事件名称</th>
                <th>说明</th>
                <th>回调参数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>selection-change</td>
                <td>当选择项发生变化时会触发该事件</td>
                <td>selection: 已选择的数据</td>
              </tr>
               <tr>
                <td>sort-change</td>
                <td>当表格的排序条件发生变化时会触发该事件</td>
                <td>{ column, prop, order }</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

      <div class="demo-block">
        <h3>带边框表格</h3>
         <p class="demo-desc">设置 border 属性可以为表格添加纵向边框。</p>
        <div class="demo-content">
          <ui-table :data="tableData" :columns="columns" border></ui-table>
        </div>
      </div>

      <div class="demo-block">
        <h3>多选表格</h3>
         <p class="demo-desc">设置 selection 属性可以为表格添加多选功能。</p>
        <div class="demo-content">
          <ui-table 
            :data="tableData" 
            :columns="columns" 
            selection
            @selection-change="handleSelectionChange">
          </ui-table>
          <div class="selected-info" v-if="selectedRows.length">
            已选择 {{ selectedRows.length }} 项
          </div>
        </div>
      </div>

      <div class="demo-block">
        <h3>排序表格</h3>
        <p class="demo-desc">在 column 中设置 sortable 属性可以开启该列的排序。</p>
        <div class="demo-content">
          <ui-table 
            :data="tableData" 
            :columns="sortColumns"
            @sort-change="handleSortChange">
          </ui-table>
        </div>
      </div>

      <div class="demo-block">
        <h3>自定义列模板</h3>
        <p class="demo-desc">通过 template 属性和具名 slot 可以自定义列的显示内容。</p>
        <div class="demo-content">
          <ui-table 
            :data="tableData" 
            :columns="templateColumns"
            border>
            <template v-slot:status="scope">
              <span :class="['status-tag', scope.row.status === '成功' ? 'success' : 'error']">
                {{ scope.row.status }}
              </span>
            </template>
            <template v-slot:operation="scope">
              <ui-button size="mini" @click="handleEdit(scope.row)">编辑</ui-button>
              <ui-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</ui-button>
            </template>
          </ui-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiTable from '../components/table/table.vue'
import UiButton from '../components/button/button.vue'

export default {
  name: 'TableDemo',
  components: {
    UiTable,
    UiButton
  },
  data() {
    return {
      selectedRows: [],
      tableData: [
        {
          id: 1,
          name: '张三',
          age: 18,
          address: '北京市朝阳区',
          status: '成功'
        },
        {
          id: 2,
          name: '李四',
          age: 24,
          address: '上海市浦东新区',
          status: '失败'
        },
        {
          id: 3,
          name: '王五',
          age: 30,
          address: '广州市天河区',
          status: '成功'
        }
      ],
      columns: [
        { prop: 'name', label: '姓名', width: '120' },
        { prop: 'age', label: '年龄', width: '80' },
        { prop: 'address', label: '地址' }
      ],
      sortColumns: [
        { prop: 'name', label: '姓名', width: '120', sortable: true },
        { prop: 'age', label: '年龄', width: '120', sortable: true },
        { prop: 'address', label: '地址' }
      ],
      templateColumns: [
        { prop: 'name', label: '姓名', width: '120' },
        { prop: 'age', label: '年龄', width: '80' },
        { prop: 'address', label: '地址' },
        { prop: 'status', label: '状态', width: '100', template: true },
        { prop: 'operation', label: '操作', width: '150', template: true }
      ]
    }
  },
  methods: {
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },
    handleSortChange({ prop, order }) {
      console.log('排序变化：', prop, order)
    },
    handleEdit(row) {
      console.log('编辑行：', row)
    },
    handleDelete(row) {
      console.log('删除行：', row)
    }
  }
}
</script>

<style scoped>
.table-demo {
  padding: 20px;
  background-color: #fff;

  .component-section {
    h2 {
      margin: 0 0 20px;
      font-size: 24px;
      font-weight: 500;
      color: #1f2f3d;
    }

    .component-desc {
      margin: 14px 0;
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.6;
    }
  }
}

.demo-block {
  margin-bottom: 30px;

  h3 {
    margin-bottom: 15px;
    font-size: 16px;
    color: #333;
  }

  .demo-desc {
      margin: 14px 0;
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.6;
    }

  .demo-content {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 20px;
  }

  .demo-attributes {
    margin-top: 16px;

    h4 {
      margin: 16px 0;
      font-size: 16px;
      font-weight: 500;
      color: #1f2f3d;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5;

      th, td {
        padding: 12px 8px;
        border: 1px solid #ebeef5;
        text-align: left;
      }

      th {
        background-color: #f5f7fa;
        font-weight: 500;
        color: #1f2f3d;
      }

      td {
        code {
          background-color: #f5f7fa;
          padding: 2px 4px;
          border-radius: 3px;
          color: #409eff;
          font-family: Consolas, Monaco, "Andale Mono", monospace;
        }
      }
    }
  }
}

.selected-info {
  margin-top: 15px;
  color: #666;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status-tag.error {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style> 