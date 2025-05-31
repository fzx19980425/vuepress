<template>
  <div class="component-section">
    <h2>Switch 开关</h2>
    <p class="component-desc">用于表示开关状态/两种状态之间的切换。</p>

    <div class="demo-block">
      <h3>基础用法</h3>
      <p class="demo-desc">使用 v-model 绑定值，active-text 和 inactive-text 属性可以设置开关的文字说明。</p>
      <div class="demo-content">
        <ui-switch
          v-model="value1"
          active-text="开启"
          inactive-text="关闭">
        </ui-switch>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-switch
  v-model="value"
  active-text="开启"
  inactive-text="关闭"&gt;
&lt;/ui-switch&gt;</code></pre>
      </div>
      <div class="demo-attributes">
        <h4>Switch 属性</h4>
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
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>是否禁用</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
            <tr>
              <td>active-text</td>
              <td>switch 打开时的文字描述</td>
              <td>string</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>inactive-text</td>
              <td>switch 关闭时的文字描述</td>
              <td>string</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>active-color</td>
              <td>switch 打开时的背景色</td>
              <td>string</td>
              <td>—</td>
              <td>#409EFF</td>
            </tr>
            <tr>
              <td>inactive-color</td>
              <td>switch 关闭时的背景色</td>
              <td>string</td>
              <td>—</td>
              <td>#C0CCDA</td>
            </tr>
            <tr>
              <td>active-icon-class</td>
              <td>switch 打开时显示的图标类名</td>
              <td>string</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>inactive-icon-class</td>
              <td>switch 关闭时显示的图标类名</td>
              <td>string</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>name</td>
              <td>switch 对应的 name 属性</td>
              <td>string</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>size</td>
              <td>switch 的尺寸</td>
              <td>string</td>
              <td>medium / small / mini</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>

        <h4>Switch 事件</h4>
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
              <td>switch 状态发生变化时的回调函数</td>
              <td>新状态的值</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="demo-block">
      <h3>禁用状态</h3>
      <p class="demo-desc">通过 disabled 属性禁用开关。</p>
      <div class="demo-content">
        <ui-switch
          v-model="value2"
          disabled>
        </ui-switch>
        <ui-switch
          v-model="value3"
          disabled>
        </ui-switch>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-switch
  v-model="value"
  disabled&gt;
&lt;/ui-switch&gt;</code></pre>
      </div>
    </div>

    <div class="demo-block">
      <h3>自定义颜色</h3>
      <p class="demo-desc">使用 active-color 和 inactive-color 属性自定义开关的颜色。</p>
      <div class="demo-content">
        <ui-switch
          v-model="value4"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </ui-switch>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-switch
  v-model="value"
  active-color="#13ce66"
  inactive-color="#ff4949"&gt;
&lt;/ui-switch&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import UiSwitch from '../components/switch/switch.vue'

export default {
  name: 'SwitchDemo',
  components: {
    UiSwitch
  },
  data() {
    return {
      value1: true,
      value2: true,
      value3: false,
      value4: true
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

    .ui-switch {
      margin-right: 20px;
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
      font-family: Consolas, Monaco, 'Andale Mono', monospace;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
    }
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