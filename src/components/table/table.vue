<template>
  <div class="ui-table" :class="{ 'is-border': border }">
    <!-- 表格头部 -->
    <div class="ui-table__header-wrapper" v-if="showHeader">
      <table class="ui-table__header" :style="tableStyle">
        <colgroup>
          <col v-if="selection" width="50">
          <col v-for="column in columns" 
               :key="column.prop"
               :width="column.width">
        </colgroup>
        <thead>
          <tr>
            <!-- 多选列 -->
            <th v-if="selection" class="ui-table__selection">
              <ui-checkbox
                v-if="selection"
                :value="isAllSelected"
                @input="handleSelectAll"
              ></ui-checkbox>
            </th>
            <!-- 数据列 -->
            <th v-for="column in columns"
                :key="column.prop"
                :class="[
                  column.className,
                  { 'is-sortable': column.sortable }
                ]"
                @click="handleSort(column)">
              {{ column.label }}
              <span v-if="column.sortable" class="ui-table__sort">
                <ui-icon name="arrow-up" 
                   :class="{ 'is-active': sortOrder === 'asc' && sortBy === column.prop }">
                </ui-icon>
                <ui-icon name="arrow-down"
                   :class="{ 'is-active': sortOrder === 'desc' && sortBy === column.prop }">
                </ui-icon>
              </span>
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- 表格主体 -->
    <div class="ui-table__body-wrapper">
      <table class="ui-table__body" :style="tableStyle">
        <colgroup>
          <col v-if="selection" width="50">
          <col v-for="column in columns" 
               :key="column.prop"
               :width="column.width">
        </colgroup>
        <tbody>
          <tr v-for="(row, index) in sortedData" 
              :key="index"
              :class="{ 'is-selected': isSelected(row) }">
            <!-- 多选列 -->
            <td v-if="selection" class="ui-table__selection">
              <ui-checkbox
                :value="isSelected(row)"
                @input="(val) => handleSelect(row, val)"
              ></ui-checkbox>
            </td>
            <!-- 数据列 -->
            <td v-for="column in columns"
                :key="column.prop"
                :class="column.className">
              <template v-if="column.template">
                <slot :name="column.prop" :row="row" :index="index">
                  {{ row[column.prop] }}
                </slot>
              </template>
              <template v-else>
                {{ row[column.prop] }}
              </template>
            </td>
          </tr>
          <!-- 空数据 -->
          <tr v-if="!data.length">
            <td :colspan="columns.length + (selection ? 1 : 0)" class="ui-table__empty">
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '../checkbox/checkbox.vue'
import UiIcon from '../icon/icon.vue'

export default {
  name: 'UiTable',
  components: {
    UiCheckbox,
    UiIcon
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    selection: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    }
  },
  data() {
    return {
      selectedRows: [],
      sortBy: '',
      sortOrder: ''
    }
  },
  computed: {
    tableStyle() {
      return {
        width: '100%',
        tableLayout: 'fixed'
      }
    },
    isAllSelected() {
      return this.data.length > 0 && this.selectedRows.length === this.data.length
    },
    sortedData() {
      if (!this.sortBy || !this.sortOrder) {
        return this.data
      }

      return [...this.data].sort((a, b) => {
        const aValue = a[this.sortBy]
        const bValue = b[this.sortBy]

        if (this.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }
  },
  methods: {
    handleSelectAll(val) {
      this.selectedRows = val ? [...this.data] : []
      this.$emit('selection-change', this.selectedRows)
    },
    handleSelect(row, val) {
      if (val) {
        this.selectedRows.push(row)
      } else {
        const index = this.selectedRows.indexOf(row)
        if (index > -1) {
          this.selectedRows.splice(index, 1)
        }
      }
      this.$emit('selection-change', this.selectedRows)
    },
    isSelected(row) {
      return this.selectedRows.includes(row)
    },
    handleSort(column) {
      if (!column.sortable) return

      if (this.sortBy === column.prop) {
        if (this.sortOrder === 'asc') {
          this.sortOrder = 'desc'
        } else if (this.sortOrder === 'desc') {
          this.sortBy = ''
          this.sortOrder = ''
        } else {
          this.sortOrder = 'asc'
        }
      } else {
        this.sortBy = column.prop
        this.sortOrder = 'asc'
      }

      this.$emit('sort-change', {
        prop: this.sortBy,
        order: this.sortOrder
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-table {
  position: relative;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 14px;
  color: #606266;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &.is-border {
    border: 1px solid #E4E7ED;
    border-right: none;
    border-bottom: none;

    .ui-table__header,
    .ui-table__body {
      th, td {
        border-right: 1px solid #E4E7ED;
      }
    }

    .ui-table__body {
      tr:last-child td {
        border-bottom: none;
      }
    }
  }

  &__header-wrapper,
  &__body-wrapper {
    overflow: hidden;
  }

  &__header,
  &__body {
    border-collapse: collapse;
    table-layout: fixed;
  }

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #E4E7ED;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  th {
    background-color: #F5F7FA;
    color: #909399;
    font-weight: 500;
    text-align: left;
    user-select: none;

    &.is-sortable {
      cursor: pointer;

      &:hover {
        background-color: #EBEEF5;
      }
    }
  }

  td {
    padding: 12px 16px;
  }

  tr {
    &:hover td {
      background-color: #F5F7FA;
    }

    &.is-selected td {
      background-color: #E6F7FF;
    }
  }

  &__selection {
    padding: 0 16px;
    width: 60px;
    text-align: center;
  }

  &__sort {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
    margin-left: 4px;

    .svg-icon {
      width: 12px;
      height: 12px;
      margin: 2px 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: #C0C4CC;

      &.is-active {
        color: #409EFF;
        transform: scale(1.2);
      }

      &:hover {
        color: #909399;
      }
    }
  }

  &__empty {
    text-align: center;
    color: #909399;
    padding: 30px 0;
  }
}
</style> 