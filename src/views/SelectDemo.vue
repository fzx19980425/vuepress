<template>
  <div class="component-section">
    <h2>Select 选择器</h2>

    <!-- 组件介绍 -->
    <div class="component-intro">
      <p>Select 选择器用于从备选项中选中一个或多个。</p>
    </div>

    <!-- 基础用法 -->
    <div class="demo-block">
      <h3>基础用法</h3>
      <div class="demo-content">
        <ui-select v-model="basicValue" :options="options"></ui-select>
      </div>
      <div class="demo-code">
        <pre><code>&lt;template&gt;
  &lt;ui-select v-model="basicValue" :options="options"&gt;&lt;/ui-select&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  data() {
    return {
      basicValue: '',
      options: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' },
        { value: '3', label: '选项3' },
        { value: '4', label: '选项4' },
        { value: '5', label: '选项5' }
      ]
    }
  }
}
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <!-- 可清空 -->
    <div class="demo-block">
      <h3>可清空</h3>
      <div class="demo-content">
        <ui-select v-model="clearableValue" :options="options" clearable></ui-select>
      </div>
      <div class="demo-code">
        <pre><code>&lt;template&gt;
  &lt;ui-select v-model="clearableValue" :options="options" clearable&gt;&lt;/ui-select&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  data() {
    return {
      clearableValue: '',
      options: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' },
        { value: '3', label: '选项3' },
        { value: '4', label: '选项4' },
        { value: '5', label: '选项5' }
      ]
    }
  }
}
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <!-- 禁用状态 -->
    <div class="demo-block">
      <h3>禁用状态</h3>
      <div class="demo-content">
        <ui-select v-model="disabledValue" :options="options" disabled></ui-select>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-select v-model="disabledValue" :options="options" disabled&gt;&lt;/ui-select&gt;</code></pre>
      </div>
    </div>

    <!-- 多选 -->
    <div class="demo-block">
      <h3>多选</h3>
      <div class="demo-content">
        <ui-select v-model="multipleValue" :options="options" multiple></ui-select>
      </div>
      <div class="demo-code">
        <pre><code>&lt;template&gt;
  &lt;ui-select v-model="multipleValue" :options="options" multiple&gt;&lt;/ui-select&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  data() {
    return {
      multipleValue: [],
      options: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' },
        { value: '3', label: '选项3' },
        { value: '4', label: '选项4' },
        { value: '5', label: '选项5' }
      ]
    }
  }
}
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div class="demo-block">
      <h3>不同尺寸</h3>
      <div class="demo-content">
        <ui-select v-model="largeValue" :options="options" size="large"></ui-select>
        <ui-select v-model="defaultValue" :options="options"></ui-select>
        <ui-select v-model="smallValue" :options="options" size="small"></ui-select>
        <ui-select v-model="miniValue" :options="options" size="mini"></ui-select>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-select size="large" v-model="largeValue" :options="options"&gt;&lt;/ui-select&gt;
&lt;ui-select v-model="defaultValue" :options="options"&gt;&lt;/ui-select&gt;
&lt;ui-select size="small" v-model="smallValue" :options="options"&gt;&lt;/ui-select&gt;
&lt;ui-select size="mini" v-model="miniValue" :options="options"&gt;&lt;/ui-select&gt;</code></pre>
      </div>
    </div>

    <!-- 禁用选项 -->
    <div class="demo-block">
      <h3>禁用选项</h3>
      <div class="demo-content">
        <ui-select v-model="disabledOptionValue" :options="disabledOptions"></ui-select>
      </div>
      <div class="demo-code">
        <pre><code>&lt;template&gt;
  &lt;ui-select v-model="disabledOptionValue" :options="disabledOptions"&gt;&lt;/ui-select&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  data() {
    return {
      disabledOptionValue: '',
      disabledOptions: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2', disabled: true },
        { value: '3', label: '选项3' },
        { value: '4', label: '选项4', disabled: true },
        { value: '5', label: '选项5' }
      ]
    }
  }
}
&lt;/script&gt;</code></pre>
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
              <td>value / v-model</td>
              <td>绑定值</td>
              <td>string / number / array</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>options</td>
              <td>选项数据</td>
              <td>array</td>
              <td>—</td>
              <td>[]</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>是否禁用</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
            <tr>
              <td>multiple</td>
              <td>是否多选</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td>占位文本</td>
              <td>string</td>
              <td>—</td>
              <td>请选择</td>
            </tr>
            <tr>
              <td>size</td>
              <td>尺寸</td>
              <td>string</td>
              <td>large / default / small / mini</td>
              <td>default</td>
            </tr>
             <tr>
              <td>clearable</td>
              <td>是否可以清空选项</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
             <tr>
              <td>filterable</td>
              <td>是否可搜索</td>
              <td>boolean</td>
              <td>—</td>
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
              <td>绑定值变化时触发</td>
              <td>(value: string | number | array)</td>
            </tr>
            <tr>
              <td>change</td>
              <td>选中值变化时触发</td>
              <td>(value: string | number | array)</td>
            </tr>
            <tr>
              <td>focus</td>
              <td>获得焦点时触发</td>
              <td>(event: Event)</td>
            </tr>
            <tr>
              <td>blur</td>
              <td>失去焦点时触发</td>
              <td>(event: Event)</td>
            </tr>
             <tr>
              <td>visible-change</td>
              <td>下拉框出现/隐藏时触发</td>
              <td>(visible: boolean)</td>
            </tr>
             <tr>
              <td>remove-tag</td>
              <td>多选模式下，移除tag时触发</td>
              <td>(tag: string)</td>
            </tr>
             <tr>
              <td>clear</td>
              <td>可清空模式下，点击清空图标时触发</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import UiSelect from '../components/select/select.vue'

export default {
  name: 'SelectDemo',
  components: {
    UiSelect
  },
  data() {
    return {
      basicValue: '',
      clearableValue: '',
      disabledValue: '',
      multipleValue: [],
      largeValue: '',
      defaultValue: '',
      smallValue: '',
      miniValue: '',
      disabledOptionValue: '',
      options: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' },
        { value: '3', label: '选项3' },
        { value: '4', label: '选项4' },
        { value: '5', label: '选项5' }
      ],
      disabledOptions: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2', disabled: true },
        { value: '3', label: '选项3' },
        { value: '4', label: '选项4', disabled: true },
        { value: '5', label: '选项5' }
      ]
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

    .ui-select {
      margin-right: 10px;
      margin-bottom: 10px;
      display: inline-flex; /* Adjust for inline display */
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