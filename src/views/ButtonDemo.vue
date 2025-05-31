<template>
  <div class="component-section">
    <h2>Button 按钮</h2>

    <!-- 组件介绍 -->
    <div class="component-intro">
      <p>Button 按钮用于开始一个即时操作。</p>
    </div>

    <!-- 基础用法 -->
    <div class="demo-block">
      <h3>基础用法</h3>
      <div class="demo-content">
        <ui-button>默认按钮</ui-button>
        <ui-button type="primary">主要按钮</ui-button>
        <ui-button type="success">成功按钮</ui-button>
        <ui-button type="warning">警告按钮</ui-button>
        <ui-button type="danger">危险按钮</ui-button>
        <ui-button type="info">信息按钮</ui-button>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-button&gt;默认按钮&lt;/ui-button&gt;
&lt;ui-button type="primary"&gt;主要按钮&lt;/ui-button&gt;
&lt;ui-button type="success"&gt;成功按钮&lt;/ui-button&gt;
&lt;ui-button type="warning"&gt;警告按钮&lt;/ui-button&gt;
&lt;ui-button type="danger"&gt;危险按钮&lt;/ui-button&gt;
&lt;ui-button type="info"&gt;信息按钮&lt;/ui-button&gt;</code></pre>
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div class="demo-block">
      <h3>不同尺寸</h3>
      <div class="demo-content">
        <ui-button size="large">大型按钮</ui-button>
        <ui-button>默认按钮</ui-button>
        <ui-button size="small">小型按钮</ui-button>
        <ui-button size="mini">超小按钮</ui-button>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-button size="large"&gt;大型按钮&lt;/ui-button&gt;
&lt;ui-button&gt;默认按钮&lt;/ui-button&gt;
&lt;ui-button size="small"&gt;小型按钮&lt;/ui-button&gt;
&lt;ui-button size="mini"&gt;超小按钮&lt;/ui-button&gt;</code></pre>
      </div>
    </div>

    <!-- 禁用状态 -->
    <div class="demo-block">
      <h3>禁用状态</h3>
      <div class="demo-content">
        <ui-button disabled>禁用按钮</ui-button>
        <ui-button type="primary" disabled>禁用按钮</ui-button>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-button disabled&gt;禁用按钮&lt;/ui-button&gt;
&lt;ui-button type="primary" disabled&gt;禁用按钮&lt;/ui-button&gt;</code></pre>
      </div>
    </div>

    <!-- 圆角按钮 -->
    <div class="demo-block">
      <h3>圆角按钮</h3>
      <div class="demo-content">
        <ui-button round>默认按钮</ui-button>
        <ui-button type="primary" round>主要按钮</ui-button>
        <ui-button type="success" round>成功按钮</ui-button>
        <ui-button type="warning" round>警告按钮</ui-button>
        <ui-button type="danger" round>危险按钮</ui-button>
        <ui-button type="info" round>信息按钮</ui-button>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-button round&gt;默认按钮&lt;/ui-button&gt;
&lt;ui-button type="primary" round&gt;主要按钮&lt;/ui-button&gt;
&lt;ui-button type="success" round&gt;成功按钮&lt;/ui-button&gt;
&lt;ui-button type="warning" round&gt;警告按钮&lt;/ui-button&gt;
&lt;ui-button type="danger" round&gt;危险按钮&lt;/ui-button&gt;
&lt;ui-button type="info" round&gt;信息按钮&lt;/ui-button&gt;</code></pre>
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
              <td>按钮类型</td>
              <td>string</td>
              <td>primary / success / warning / danger / info / text</td>
              <td>—</td>
            </tr>
            <tr>
              <td>size</td>
              <td>按钮尺寸</td>
              <td>string</td>
              <td>large / default / small / mini</td>
              <td>default</td>
            </tr>
            <tr>
              <td>icon</td>
              <td>图标类名</td>
              <td>string</td>
              <td>—</td>
              <td>—</td>
            </tr>
             <tr>
              <td>loading</td>
              <td>是否加载中状态</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>是否禁用状态</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
            <tr>
              <td>round</td>
              <td>是否圆角按钮</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
             <tr>
              <td>circle</td>
              <td>是否圆形按钮</td>
              <td>boolean</td>
              <td>—</td>
              <td>false</td>
            </tr>
             <tr>
              <td>plain</td>
              <td>是否朴素按钮</td>
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
              <td>click</td>
              <td>按钮点击事件</td>
              <td>(event: Event)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '../components/button/button.vue'

export default {
  name: 'ButtonDemo',
  components: {
    UiButton
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

    .ui-button {
      margin-right: 10px;
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