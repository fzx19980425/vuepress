<template>
  <div class="component-section">
    <h2>DatePicker 日期选择器</h2>
    <p class="component-desc">用于选择日期和时间。</p>

    <div class="demo-block">
      <h3>基础用法</h3>
      <p class="demo-desc">使用 v-model 绑定值，通过 type 属性设置选择器类型。</p>
      <div class="demo-content">
        <ui-date-picker
          v-model="value1"
          type="date"
          placeholder="选择日期"
          :readonly="true">
        </ui-date-picker>
      </div>
      <div class="demo-attributes">
        <h4>DatePicker 属性</h4>
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
              <td>value / v-model</td>
              <td>绑定值</td>
              <td>Date / string / number</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>type</td>
              <td>选择器类型</td>
              <td>string</td>
              <td>year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange</td>
              <td>date</td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td>占位文本</td>
              <td>string</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>是否禁用</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
            <tr>
              <td>readonly</td>
              <td>是否只读</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
             <tr>
              <td>clearable</td>
              <td>是否显示清除按钮</td>
              <td>boolean</td>
              <td>—</td>
              <td>true</td>
            </tr>
             <tr>
              <td>size</td>
              <td>输入框尺寸</td>
              <td>string</td>
              <td>medium / small / mini</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>

        <h4>DatePicker 事件</h4>
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
              <td>change</td>
              <td>用户确认选定的值时触发</td>
              <td>确认的值</td>
            </tr>
            <tr>
              <td>focus</td>
              <td>输入框获得焦点时触发</td>
              <td>—</td>
            </tr>
             <tr>
              <td>blur</td>
              <td>输入框失去焦点时触发</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="demo-block">
      <h3>禁用状态</h3>
      <p class="demo-desc">通过 disabled 属性禁用日期选择器。</p>
      <div class="demo-content">
        <ui-date-picker
          v-model="value2"
          disabled
          type="date"
          placeholder="选择日期"
          :readonly="true">
        </ui-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
import UiDatePicker from '../components/date-picker/date-picker.vue'

export default {
  name: 'DatePickerDemo',
  components: {
    UiDatePicker
  },
  data() {
    return {
      value1: '',
      value2: '',
      value3: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.component-section {
  padding: 20px;

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

.demo-block {
  margin-bottom: 24px;

  h3 {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 500;
    color: #1f2f3d;
  }

  .demo-desc {
    margin: 14px 0;
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.6;
  }

  .demo-content {
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #fff;
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
</style> 