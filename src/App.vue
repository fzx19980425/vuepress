<template>
  <div class="app-container">
    <!-- 左侧导航菜单 -->
    <div class="sidebar">
      <div class="logo">UI Components</div>
      <ul class="menu">
        <li v-for="item in menuItems" :key="item.path" :class="{ active: currentPath === item.path }"
          @click="currentPath = item.path">
          {{ item.name }}
        </li>
      </ul>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <div class="component-container">
        <component :is="currentDemo"></component>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonDemo from './views/ButtonDemo.vue'
import InputDemo from './views/InputDemo.vue'
import SelectDemo from './views/SelectDemo.vue'
import TableDemo from './views/TableDemo.vue'
import DialogDemo from './views/DialogDemo.vue'
import RadioDemo from './views/RadioDemo.vue'
import CheckboxDemo from './views/CheckboxDemo.vue'
import SwitchDemo from './views/SwitchDemo.vue'
import DatePickerDemo from './views/DatePickerDemo.vue'
import IconDemo from './views/IconDemo.vue'

export default {
  name: 'App',
  components: {
    ButtonDemo,
    InputDemo,
    SelectDemo,
    TableDemo,
    DialogDemo,
    RadioDemo,
    CheckboxDemo,
    SwitchDemo,
    DatePickerDemo,
    IconDemo
  },
  data() {
    return {
      currentPath: localStorage.getItem('currentPath') || '/icon',
      menuItems: [
        { name: 'Icon 图标', path: '/icon' },
        { name: 'Button 按钮', path: '/button' },
        { name: 'Input 输入框', path: '/input' },
        { name: 'Select 选择器', path: '/select' },
        { name: 'Radio 单选框', path: '/radio' },
        { name: 'Checkbox 多选框', path: '/checkbox' },
        { name: 'Switch 开关', path: '/switch' },
        { name: 'DatePicker 日期选择器', path: '/datepicker' },
        { name: 'Table 表格', path: '/table' },
        { name: 'Dialog 对话框', path: '/dialog' },
      ],
    }
  },
  computed: {
    currentDemo() {
      switch (this.currentPath) {
        case '/icon':
          return IconDemo
        case '/button':
          return ButtonDemo
        case '/input':
          return InputDemo
        case '/select':
          return SelectDemo
        case '/table':
          return TableDemo
        case '/dialog':
          return DialogDemo
        case '/radio':
          return RadioDemo
        case '/checkbox':
          return CheckboxDemo
        case '/switch':
          return SwitchDemo
        case '/datepicker':
          return DatePickerDemo
        default:
          return IconDemo
      }
    },
  },
  watch: {
    currentPath(newPath) {
      localStorage.setItem('currentPath', newPath)
      this.$nextTick(() => {
        this.resetScroll()
      })
    }
  },
  methods: {
    resetScroll() {
      const container = document.querySelector('.component-container')
      if (container) {
        container.scrollTop = 0
      }
    }
  },
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.app-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;

  .sidebar {
    width: 240px;
    background-color: #fff;
    border-right: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .logo {
      padding: 0 20px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      font-weight: bold;
      color: #409EFF;
      border-bottom: 1px solid #e6e6e6;
      flex-shrink: 0;
    }

    .menu {
      list-style: none;
      padding: 0;
      margin: 0;
      overflow-y: auto;
      flex: 1;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #c0c4cc;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      li {
        padding: 12px 20px;
        cursor: pointer;
        color: #333;
        transition: all 0.3s;

        &:hover {
          background-color: #f5f7fa;
          color: #409EFF;
        }

        &.active {
          background-color: #ecf5ff;
          color: #409EFF;
          border-right: 3px solid #409EFF;
        }
      }
    }
  }

  .main-content {
    flex: 1;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .component-container {
      flex: 1;
      padding: 20px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #c0c4cc;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      .component-section {
        background-color: #fff;
        border-radius: 4px;
        padding: 24px;

        h2 {
          margin: 0 0 20px;
          font-size: 28px;
          font-weight: 500;
          color: #1f2f3d;
        }
      }
    }
  }
}
</style>