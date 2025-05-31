<template>
  <div class="radio-demo">
    <div class="component-section">
      <h2>Radio 单选框</h2>
      <p class="component-desc">用于在多个互斥的选项中选择一个。</p>

      <!-- 基础用法 -->
      <div class="demo-block">
        <h3>基础用法</h3>
        <p class="demo-desc">使用 v-model 绑定值，label 属性为单选框的值。</p>
        <div class="demo-content">
          <ui-radio v-model="basicRadio" label="1">备选项1</ui-radio>
          <ui-radio v-model="basicRadio" label="2">备选项2</ui-radio>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-radio v-model="radio" label="1"&gt;备选项1&lt;/ui-radio&gt;
&lt;ui-radio v-model="radio" label="2"&gt;备选项2&lt;/ui-radio&gt;</code></pre>
        </div>
        <div class="demo-attributes">
          <h4>Radio 属性</h4>
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
                <td>string / number / boolean</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>label</td>
                <td>单选框的值</td>
                <td>string / number / boolean</td>
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
                <td>name</td>
                <td>原生 name 属性</td>
                <td>string</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>size</td>
                <td>单选框的尺寸</td>
                <td>string</td>
                <td>medium / small / mini</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 禁用状态 -->
      <div class="demo-block">
        <h3>禁用状态</h3>
        <p class="demo-desc">通过 disabled 属性禁用单选框。</p>
        <div class="demo-content">
          <ui-radio disabled v-model="disabledRadio" label="禁用">禁用</ui-radio>
          <ui-radio disabled v-model="disabledRadio" label="选中且禁用">选中且禁用</ui-radio>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-radio disabled v-model="radio" label="禁用"&gt;禁用&lt;/ui-radio&gt;
&lt;ui-radio disabled v-model="radio" label="选中且禁用"&gt;选中且禁用&lt;/ui-radio&gt;</code></pre>
        </div>
      </div>

      <!-- 单选框组 -->
      <div class="demo-block">
        <h3>单选框组</h3>
        <p class="demo-desc">使用 radio-group 组件包裹多个 radio 组件，实现单选组。</p>
        <div class="demo-content">
          <ui-radio-group v-model="groupRadio">
            <ui-radio label="上海">上海</ui-radio>
            <ui-radio label="北京">北京</ui-radio>
            <ui-radio label="广州">广州</ui-radio>
            <ui-radio label="深圳">深圳</ui-radio>
          </ui-radio-group>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-radio-group v-model="radio"&gt;
    &lt;ui-radio label="上海"&gt;上海&lt;/ui-radio&gt;
    &lt;ui-radio label="北京"&gt;北京&lt;/ui-radio&gt;
    &lt;ui-radio label="广州"&gt;广州&lt;/ui-radio&gt;
    &lt;ui-radio label="深圳"&gt;深圳&lt;/ui-radio&gt;
  &lt;/ui-radio-group&gt;</code></pre>
        </div>
        <div class="demo-attributes">
          <h4>Radio-group 属性</h4>
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
                <td>string / number / boolean</td>
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
                <td>text-color</td>
                <td>按钮激活时的文本颜色</td>
                <td>string</td>
                <td>—</td>
                <td>#ffffff</td>
              </tr>
              <tr>
                <td>fill</td>
                <td>按钮激活时的填充色和边框色</td>
                <td>string</td>
                <td>—</td>
                <td>#409EFF</td>
              </tr>
              <tr>
                <td>size</td>
                <td>单选框组尺寸</td>
                <td>string</td>
                <td>medium / small / mini</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 按钮样式 -->
      <div class="demo-block">
        <h3>按钮样式</h3>
        <p class="demo-desc">使用 radio-button 组件实现按钮样式的单选框组，支持 size 属性设置尺寸。</p>
        <div class="demo-content">
          <div>
            <ui-radio-group v-model="buttonRadio1" size="medium">
              <ui-radio-button label="上海">上海</ui-radio-button>
              <ui-radio-button label="北京">北京</ui-radio-button>
              <ui-radio-button label="广州">广州</ui-radio-button>
              <ui-radio-button label="深圳">深圳</ui-radio-button>
            </ui-radio-group>
          </div>
          <div style="margin-top: 20px">
            <ui-radio-group v-model="buttonRadio2" size="small">
              <ui-radio-button label="上海">上海</ui-radio-button>
              <ui-radio-button label="北京">北京</ui-radio-button>
              <ui-radio-button label="广州">广州</ui-radio-button>
              <ui-radio-button label="深圳">深圳</ui-radio-button>
            </ui-radio-group>
          </div>
          <div style="margin-top: 20px">
            <ui-radio-group v-model="buttonRadio3" disabled size="small">
              <ui-radio-button label="上海">上海</ui-radio-button>
              <ui-radio-button label="北京">北京</ui-radio-button>
              <ui-radio-button label="广州">广州</ui-radio-button>
              <ui-radio-button label="深圳">深圳</ui-radio-button>
            </ui-radio-group>
          </div>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-radio-group v-model="radio" size="medium"&gt;
    &lt;ui-radio-button label="上海"&gt;上海&lt;/ui-radio-button&gt;
    &lt;ui-radio-button label="北京"&gt;北京&lt;/ui-radio-button&gt;
    &lt;ui-radio-button label="广州"&gt;广州&lt;/ui-radio-button&gt;
    &lt;ui-radio-button label="深圳"&gt;深圳&lt;/ui-radio-button&gt;
  &lt;/ui-radio-group&gt;</code></pre>
        </div>
      </div>

      <!-- 事件说明 -->
      <div class="demo-block">
        <h3>事件</h3>
        <div class="demo-attributes">
          <h4>Radio 事件</h4>
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
                <td>当绑定值变化时触发的事件</td>
                <td>选中的值</td>
              </tr>
            </tbody>
          </table>

          <h4>Radio-group 事件</h4>
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
                <td>当绑定值变化时触发的事件</td>
                <td>选中的值</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiRadio from '../components/radio/radio.vue'
import UiRadioGroup from '../components/radio/radio-group.vue'
import UiRadioButton from '../components/radio/radio-button.vue'

export default {
  name: 'RadioDemo',
  components: {
    UiRadio,
    UiRadioGroup,
    UiRadioButton
  },
  data() {
    return {
      // 基础用法
      basicRadio: '1',
      // 禁用状态
      disabledRadio: '选中且禁用',
      // 单选框组
      groupRadio: '上海',
      // 按钮样式
      buttonRadio1: '上海',
      buttonRadio2: '上海',
      buttonRadio3: '上海'
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-demo {
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

      .ui-radio {
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
}
</style> 