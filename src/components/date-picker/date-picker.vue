<template>
  <div class="ui-date-editor ui-date-editor--date" :class="[
    size ? 'ui-date-editor--' + size : '',
    { 'is-disabled': disabled }
  ]" @click.stop>
    <ui-input
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :value="displayValue"
      :size="size"
      prefixIcon="calendar"
      :suffixIcon="value ? 'close' : ''"
      :clearable="!!value"
      @click.native="handleFocus"
      @keydown.native="handleKeydown"
      @clear="handleClear"
      ref="input">
    </ui-input>
    <div class="ui-date-picker__popper" v-show="visible" ref="popper" :style="popperStyle">
      <div class="ui-date-picker__header">
        <button type="button" class="ui-date-picker__header-btn" @click="prevYear">
          <ui-icon name="d-arrow-left"></ui-icon>
        </button>
        <button type="button" class="ui-date-picker__header-btn" @click="prevMonth">
          <ui-icon name="arrow-left"></ui-icon>
        </button>
        <span class="ui-date-picker__header-label">{{ currentYear }}年 {{ currentMonth + 1 }}月</span>
        <button type="button" class="ui-date-picker__header-btn" @click="nextMonth">
          <ui-icon name="arrow-right"></ui-icon>
        </button>
        <button type="button" class="ui-date-picker__header-btn" @click="nextYear">
          <ui-icon name="d-arrow-right"></ui-icon>
        </button>
      </div>
      <div class="ui-date-picker__body">
        <table class="ui-date-table">
          <thead>
            <tr>
              <th v-for="(week, index) in weeks" :key="index">{{ week }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in dateRows" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                  :class="getCellClass(cell)"
                  @click="handleDateClick(cell)">
                <span>{{ cell.text }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getDay, getDate, getMonth, getYear } from 'date-fns'
import UiInput from '../input/input.vue'
import UiIcon from '../icon/icon.vue'

export default {
  name: 'UiDatePicker',
  components: {
    UiInput,
    UiIcon
  },
  props: {
    value: {
      type: [Date, String],
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    disabled: Boolean,
    readonly: Boolean,
    size: String,
    disabledDate: {
      type: Function,
      default: () => false
    }
  },
  data() {
    return {
      visible: false,
      currentDate: new Date(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      dateRows: [],
      popperStyle: {
        position: 'absolute',
        top: '100%',
        left: '0',
        zIndex: '2000'
      }
    }
  },
  computed: {
    displayValue() {
      if (!this.value) return ''
      const date = typeof this.value === 'string' ? new Date(this.value) : this.value
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          const date = typeof val === 'string' ? new Date(val) : val
          this.currentDate = date
          this.currentYear = getYear(date)
          this.currentMonth = getMonth(date)
        }
      }
    },
    currentYear() {
      this.updateDateRows()
    },
    currentMonth() {
      this.updateDateRows()
    },
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.updatePopperPlacement()
        })
      }
    }
  },
  mounted() {
    this.updateDateRows()
    document.addEventListener('click', this.handleDocumentClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleDocumentClick)
  },
  methods: {
    updateDateRows() {
      const date = new Date(this.currentYear, this.currentMonth, 1)
      const firstDay = getDay(date)
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      const rows = []
      let row = []
      let day = 1

      // 填充第一行前面的空白
      for (let i = 0; i < firstDay; i++) {
        const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate()
        const prevDate = new Date(this.currentYear, this.currentMonth - 1, prevMonthDays - firstDay + i + 1)
        row.push({
          text: prevDate.getDate(),
          date: prevDate,
          type: 'prev-month'
        })
      }

      // 填充当前月的日期
      while (day <= daysInMonth) {
        if (row.length === 7) {
          rows.push(row)
          row = []
        }
        const currentDate = new Date(this.currentYear, this.currentMonth, day)
        row.push({
          text: day,
          date: currentDate,
          type: 'current-month'
        })
        day++
      }

      // 填充最后一行后面的空白
      const remainingDays = 7 - row.length
      for (let i = 0; i < remainingDays; i++) {
        const nextDate = new Date(this.currentYear, this.currentMonth + 1, i + 1)
        row.push({
          text: nextDate.getDate(),
          date: nextDate,
          type: 'next-month'
        })
      }
      rows.push(row)

      this.dateRows = rows
    },
    getCellClass(cell) {
      const classes = ['ui-date-table__cell']
      if (cell.type !== 'current-month') {
        classes.push('ui-date-table__cell--' + cell.type)
      }
      if (this.disabledDate(cell.date)) {
        classes.push('is-disabled')
      }
      if (this.value && this.isSameDay(cell.date, new Date(this.value))) {
        classes.push('is-selected')
      }
      if (this.isToday(cell.date)) {
        classes.push('is-today')
      }
      return classes
    },
    isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    },
    isToday(date) {
      return this.isSameDay(date, new Date())
    },
    handleDateClick(cell) {
      if (cell.type !== 'current-month' || this.disabledDate(cell.date)) return
      
      const date = new Date(cell.date.getTime())
      date.setHours(0, 0, 0, 0)
      
      this.$emit('input', date)
      this.$emit('change', date)
      this.visible = false
    },
    handleFocus() {
      if (this.disabled) return
      this.visible = true
    },
    handleClear(event) {
      if (event) {
        event.stopPropagation()
      }
      this.$emit('input', null)
      this.$emit('change', null)
      this.visible = false
    },
    handleKeydown(e) {
      // 处理键盘事件
    },
    handleDocumentClick(e) {
      if (!this.$el.contains(e.target)) {
        this.visible = false
      }
    },
    updatePopperPlacement() {
      if (!this.$refs.popper || !this.$refs.input) return
      
      const inputEl = this.$refs.input.$el
      if (!inputEl) return

      const inputRect = inputEl.getBoundingClientRect()
      const popperHeight = this.$refs.popper.offsetHeight
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - inputRect.bottom
      const spaceAbove = inputRect.top

      if (spaceBelow < popperHeight && spaceAbove > spaceBelow) {
        this.popperStyle = {
          position: 'absolute',
          top: `-${popperHeight + 5}px`,
          left: '0',
          zIndex: '2000'
        }
      } else {
        this.popperStyle = {
          position: 'absolute',
          top: '100%',
          left: '0',
          marginTop: '5px',
          zIndex: '2000'
        }
      }
    },
    prevYear() {
      this.currentYear--
      this.updateDateRows()
    },
    nextYear() {
      this.currentYear++
      this.updateDateRows()
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentYear--
        this.currentMonth = 11
      } else {
        this.currentMonth--
      }
      this.updateDateRows()
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentYear++
        this.currentMonth = 0
      } else {
        this.currentMonth++
      }
      this.updateDateRows()
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-date-editor {
  position: relative;
  display: inline-block;
  width: 220px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--small {
    width: 180px;
  }

  &--mini {
    width: 160px;
  }
}

.ui-date-picker__popper {
  position: absolute;
  z-index: 2000;
  background: #FFFFFF;
  border: 1px solid #E4E7ED;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 320px;
  margin-top: 5px;
  transform-origin: center top;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ui-date-picker__header {
  margin: 12px;
  text-align: center;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-btn {
    line-height: 1;
    padding: 6px;
    border: none;
    background: transparent;
    outline: none;
    cursor: pointer;
    color: #606266;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      color: #409EFF;
      background-color: #F2F6FC;
    }

    &:active {
      background-color: #E6F1FC;
    }
  }

  &-label {
    font-size: 16px;
    font-weight: 500;
    padding: 0 12px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    color: #303133;
    transition: all 0.3s;

    &:hover {
      color: #409EFF;
    }
  }
}

.ui-date-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  padding: 0 12px;

  th {
    padding: 8px 0;
    text-align: center;
    font-weight: 500;
    color: #909399;
    font-size: 12px;
  }

  td {
    padding: 4px 0;
    text-align: center;
    cursor: pointer;
    font-size: 14px;

    &.ui-date-table__cell {
      &--prev-month,
      &--next-month {
        color: #C0C4CC;
      }

      &.is-disabled {
        color: #C0C4CC;
        cursor: not-allowed;
        background-color: #F5F7FA;

        &:hover {
          background-color: #F5F7FA;
        }
      }

      &.is-selected {
        color: #FFFFFF;
        background-color: #409EFF;

        span {
          background-color: #409EFF;
          color: #FFFFFF;
          border-radius: 4px;
        }
      }

      &.is-today {
        color: #409EFF;
        font-weight: 500;
      }

      span {
        display: block;
        margin: 0 auto;
        width: 28px;
        height: 28px;
        line-height: 28px;
        border-radius: 4px;
        transition: all 0.3s;
      }

      &:hover span {
        background-color: #F2F6FC;
      }
    }
  }
}

.ui-input {
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #909399;
    transition: color 0.2s;
    
    &:hover {
      color: #409EFF;
    }
  }
}
</style> 