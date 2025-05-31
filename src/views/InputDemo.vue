<template>
  <div class="component-section">
    <h2>Input 输入框</h2>
    
    <!-- 组件介绍 -->
    <div class="component-intro">
      <p>输入框是最基础的表单组件，用于接收用户输入的内容。</p>
    </div>

    <!-- 基础用法 -->
    <div class="demo-block">
      <h3>基础用法</h3>
      <div class="demo-content">
        <ui-input v-model="basicValue" placeholder="请输入内容"></ui-input>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-input v-model="input" placeholder="请输入内容"&gt;&lt;/ui-input&gt;</code></pre>
      </div>
    </div>

    <!-- 输入框类型 -->
    <div class="demo-block">
      <h3>输入框类型</h3>
      <div class="demo-content">
        <ui-input v-model="passwordValue" type="password" placeholder="请输入密码"></ui-input>
        <ui-input v-model="numberValue" type="number" placeholder="请输入数字"></ui-input>
        <ui-input v-model="searchValue" type="search" placeholder="请输入搜索内容"></ui-input>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-input type="password" placeholder="请输入密码"&gt;&lt;/ui-input&gt;
&lt;ui-input type="number" placeholder="请输入数字"&gt;&lt;/ui-input&gt;
&lt;ui-input type="search" placeholder="请输入搜索内容"&gt;&lt;/ui-input&gt;</code></pre>
      </div>
    </div>

    <!-- 禁用状态 -->
    <div class="demo-block">
      <h3>禁用状态</h3>
      <div class="demo-content">
        <ui-input v-model="disabledValue" disabled placeholder="禁用状态"></ui-input>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-input disabled placeholder="禁用状态"&gt;&lt;/ui-input&gt;</code></pre>
      </div>
    </div>

    <!-- 可清空 -->
    <div class="demo-block">
      <h3>可清空</h3>
      <div class="demo-content">
        <ui-input v-model="clearableValue" clearable placeholder="可清空"></ui-input>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-input v-model="input" clearable placeholder="可清空"&gt;&lt;/ui-input&gt;</code></pre>
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div class="demo-block">
      <h3>不同尺寸</h3>
      <div class="demo-content">
        <ui-input v-model="largeValue" size="large" placeholder="大型输入框"></ui-input>
        <ui-input v-model="defaultValue" placeholder="默认输入框"></ui-input>
        <ui-input v-model="smallValue" size="small" placeholder="小型输入框"></ui-input>
        <ui-input v-model="miniValue" size="mini" placeholder="超小输入框"></ui-input>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-input size="large" placeholder="大型输入框"&gt;&lt;/ui-input&gt;
&lt;ui-input placeholder="默认输入框"&gt;&lt;/ui-input&gt;
&lt;ui-input size="small" placeholder="小型输入框"&gt;&lt;/ui-input&gt;
&lt;ui-input size="mini" placeholder="超小输入框"&gt;&lt;/ui-input&gt;</code></pre>
      </div>
    </div>

    <!-- 带图标的输入框 -->
    <div class="demo-block">
      <h3>带图标的输入框</h3>
      <div class="demo-content">
        <ui-input v-model="prefixIconValue" prefixIcon="search" placeholder="带图标的输入框"></ui-input>
        <ui-input v-model="suffixIconValue" suffixIcon="calendar" placeholder="带图标的输入框"></ui-input>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-input prefixIcon="search" placeholder="带图标的输入框"&gt;&lt;/ui-input&gt;
&lt;ui-input suffixIcon="calendar" placeholder="带图标的输入框"&gt;&lt;/ui-input&gt;</code></pre>
      </div>
    </div>

    <!-- 属性说明 -->
    <div class="demo-block">
      <h3>属性说明</h3>
      <div class="demo-content">
        <table class="api-table">
          <thead>
            <tr>
              <th>属性名</th>
              <th>说明</th>
              <th>类型</th>
              <th>可选值</th>
              <th>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>type</td>
              <td>输入框类型</td>
              <td>string</td>
              <td>text / password / number / email / tel / url / search / textarea</td>
              <td>text</td>
            </tr>
            <tr>
              <td>value / v-model</td>
              <td>绑定值</td>
              <td>string / number</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td>输入框占位文本</td>
              <td>string</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>是否禁用</td>
              <td>boolean</td>
              <td>-</td>
              <td>false</td>
            </tr>
            <tr>
              <td>clearable</td>
              <td>是否可清空</td>
              <td>boolean</td>
              <td>-</td>
              <td>false</td>
            </tr>
            <tr>
              <td>prefixIcon</td>
              <td>输入框头部图标</td>
              <td>string</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>suffixIcon</td>
              <td>输入框尾部图标</td>
              <td>string</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>size</td>
              <td>输入框尺寸</td>
              <td>string</td>
              <td>large / default / small / mini</td>
              <td>default</td>
            </tr>
            <tr>
              <td>maxlength</td>
              <td>最大输入长度</td>
              <td>number</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>readonly</td>
              <td>是否只读</td>
              <td>boolean</td>
              <td>-</td>
              <td>false</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 事件说明 -->
    <div class="demo-block">
      <h3>事件</h3>
      <div class="demo-content">
        <table class="api-table">
          <thead>
            <tr>
              <th>事件名</th>
              <th>说明</th>
              <th>参数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>input</td>
              <td>在输入值改变时触发</td>
              <td>(value: string | number)</td>
            </tr>
            <tr>
              <td>change</td>
              <td>在值改变时触发</td>
              <td>(value: string | number)</td>
            </tr>
            <tr>
              <td>focus</td>
              <td>在输入框获得焦点时触发</td>
              <td>(event: Event)</td>
            </tr>
            <tr>
              <td>blur</td>
              <td>在输入框失去焦点时触发</td>
              <td>(event: Event)</td>
            </tr>
            <tr>
              <td>clear</td>
              <td>在点击清空按钮时触发</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import UiInput from '../components/input/input.vue'

export default {
  name: 'InputDemo',
  components: {
    UiInput
  },
  data() {
    return {
      basicValue: '',
      passwordValue: '',
      numberValue: '',
      searchValue: '',
      disabledValue: '禁用状态的值',
      clearableValue: '可清空的值',
      largeValue: '大型输入框的值',
      defaultValue: '默认输入框的值',
      smallValue: '小型输入框的值',
      miniValue: '超小输入框的值',
      prefixIconValue: '带前缀图标的输入框',
      suffixIconValue: '带后缀图标的输入框'
    }
  }
}
</script>

<style lang="scss" scoped>
.component-section {
  h2 {
    font-size: 28px;
    font-weight: 500;
    color: #1f2f3d;
    margin: 0 0 20px;
  }
}

.component-intro {
  margin-bottom: 24px;
  p {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5;
  }
}

.demo-block {
  margin-bottom: 24px;

  h3 {
    margin: 0 0 16px;
    font-size: 22px;
    font-weight: 500;
    color: #1f2f3d;
  }

  .demo-content {
    padding: 24px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #fff;

    .ui-input {
      width: 300px;
      margin-bottom: 10px;
    }
  }

  .demo-code {
    margin-top: 16px;
    padding: 16px;
    background-color: #fafafa;
    border-radius: 4px;

    pre {
      margin: 0;
      padding: 0;
      font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;

  th, td {
    padding: 12px 8px;
    border: 1px solid #ebeef5;
    text-align: left;
  }

  th {
    background-color: #fafafa;
    color: #1f2f3d;
    font-weight: 500;
  }

  td {
    color: #5e6d82;
  }
}
</style> 