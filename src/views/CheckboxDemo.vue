<template>
  <div class="checkbox-demo">
    <div class="component-section">
      <h2>Checkbox 多选框</h2>
      <p class="component-desc">用于在多个选项中选择一个或多个。</p>

      <!-- 基础用法 -->
      <div class="demo-block">
        <h3>基础用法</h3>
        <p class="demo-desc">使用 v-model 绑定值，label 属性为多选框的值。</p>
        <div class="demo-content">
          <ui-checkbox v-model="basicCheckbox1" label="备选项1">备选项1</ui-checkbox>
          <ui-checkbox v-model="basicCheckbox2" label="备选项2">备选项2</ui-checkbox>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-checkbox v-model="checkbox1" label="备选项1"&gt;备选项1&lt;/ui-checkbox&gt;
&lt;ui-checkbox v-model="checkbox2" label="备选项2"&gt;备选项2&lt;/ui-checkbox&gt;</code></pre>
        </div>
        <div class="demo-attributes">
          <h4>Checkbox 属性</h4>
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
                <td>多选框的值</td>
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
                <td>indeterminate</td>
                <td>设置中间状态</td>
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
                <td>多选框的尺寸</td>
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
        <p class="demo-desc">通过 disabled 属性禁用多选框。</p>
        <div class="demo-content">
          <ui-checkbox v-model="disabledCheckbox1" disabled label="禁用">禁用</ui-checkbox>
          <ui-checkbox v-model="disabledCheckbox2" disabled label="选中且禁用">选中且禁用</ui-checkbox>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-checkbox v-model="checkbox1" disabled label="禁用"&gt;禁用&lt;/ui-checkbox&gt;
&lt;ui-checkbox v-model="checkbox2" disabled label="选中且禁用"&gt;选中且禁用&lt;/ui-checkbox&gt;</code></pre>
        </div>
      </div>

      <!-- 多选框组 -->
      <div class="demo-block">
        <h3>多选框组</h3>
        <p class="demo-desc">使用 checkbox-group 组件包裹多个 checkbox 组件，实现多选组。</p>
        <div class="demo-content">
          <ui-checkbox-group v-model="groupCheckbox">
            <ui-checkbox label="上海">上海</ui-checkbox>
            <ui-checkbox label="北京">北京</ui-checkbox>
            <ui-checkbox label="广州">广州</ui-checkbox>
            <ui-checkbox label="深圳">深圳</ui-checkbox>
          </ui-checkbox-group>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-checkbox-group v-model="checkboxList"&gt;
  &lt;ui-checkbox label="上海"&gt;上海&lt;/ui-checkbox&gt;
  &lt;ui-checkbox label="北京"&gt;北京&lt;/ui-checkbox&gt;
  &lt;ui-checkbox label="广州"&gt;广州&lt;/ui-checkbox&gt;
  &lt;ui-checkbox label="深圳"&gt;深圳&lt;/ui-checkbox&gt;
&lt;/ui-checkbox-group&gt;</code></pre>
        </div>
        <div class="demo-attributes">
          <h4>Checkbox-group 属性</h4>
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
                <td>min</td>
                <td>可被勾选的最小数量</td>
                <td>number</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>max</td>
                <td>可被勾选的最大数量</td>
                <td>number</td>
                <td>—</td>
                <td>—</td>
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
                <td>多选框组尺寸</td>
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
        <p class="demo-desc">使用 checkbox-button 组件实现按钮样式的多选框组，支持 size 属性设置尺寸。</p>
        <div class="demo-content">
          <div>
            <ui-checkbox-group v-model="buttonCheckbox1" size="medium">
              <ui-checkbox-button label="上海">上海</ui-checkbox-button>
              <ui-checkbox-button label="北京">北京</ui-checkbox-button>
              <ui-checkbox-button label="广州">广州</ui-checkbox-button>
              <ui-checkbox-button label="深圳">深圳</ui-checkbox-button>
            </ui-checkbox-group>
          </div>
          <div style="margin-top: 20px">
            <ui-checkbox-group v-model="buttonCheckbox2" size="small">
              <ui-checkbox-button label="上海">上海</ui-checkbox-button>
              <ui-checkbox-button label="北京">北京</ui-checkbox-button>
              <ui-checkbox-button label="广州">广州</ui-checkbox-button>
              <ui-checkbox-button label="深圳">深圳</ui-checkbox-button>
            </ui-checkbox-group>
          </div>
          <div style="margin-top: 20px">
            <ui-checkbox-group v-model="buttonCheckbox3" disabled size="small">
              <ui-checkbox-button label="上海">上海</ui-checkbox-button>
              <ui-checkbox-button label="北京">北京</ui-checkbox-button>
              <ui-checkbox-button label="广州">广州</ui-checkbox-button>
              <ui-checkbox-button label="深圳">深圳</ui-checkbox-button>
            </ui-checkbox-group>
          </div>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-checkbox-group v-model="checkboxList" size="medium"&gt;
  &lt;ui-checkbox-button label="上海"&gt;上海&lt;/ui-checkbox-button&gt;
  &lt;ui-checkbox-button label="北京"&gt;北京&lt;/ui-checkbox-button&gt;
  &lt;ui-checkbox-button label="广州"&gt;广州&lt;/ui-checkbox-button&gt;
  &lt;ui-checkbox-button label="深圳"&gt;深圳&lt;/ui-checkbox-button&gt;
&lt;/ui-checkbox-group&gt;</code></pre>
        </div>
      </div>

      <!-- 中间状态 -->
      <div class="demo-block">
        <h3>中间状态</h3>
        <p class="demo-desc">通过 indeterminate 属性设置多选框的中间状态，常用于实现全选功能。</p>
        <div class="demo-content">
          <ui-checkbox
            v-model="indeterminateCheckbox"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</ui-checkbox
          >
          <div style="margin: 15px 0"></div>
          <ui-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <ui-checkbox label="上海">上海</ui-checkbox>
            <ui-checkbox label="北京">北京</ui-checkbox>
            <ui-checkbox label="广州">广州</ui-checkbox>
            <ui-checkbox label="深圳">深圳</ui-checkbox>
          </ui-checkbox-group>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-checkbox 
    v-model="checkAll" 
    :indeterminate="isIndeterminate" 
    @change="handleCheckAllChange"&gt;全选&lt;/ui-checkbox&gt;
&lt;div style="margin: 15px 0;"&gt;&lt;/div&gt;
&lt;ui-checkbox-group 
    v-model="checkedCities" 
    @change="handleCheckedCitiesChange"&gt;
  &lt;ui-checkbox label="上海"&gt;上海&lt;/ui-checkbox&gt;
  &lt;ui-checkbox label="北京"&gt;北京&lt;/ui-checkbox&gt;
  &lt;ui-checkbox label="广州"&gt;广州&lt;/ui-checkbox&gt;
  &lt;ui-checkbox label="深圳"&gt;深圳&lt;/ui-checkbox&gt;
&lt;/ui-checkbox-group&gt;</code></pre>
        </div>
        <div class="demo-attributes">
          <h4>Checkbox 事件</h4>
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

          <h4>Checkbox-group 事件</h4>
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
import UiCheckbox from "../components/checkbox/checkbox.vue";
import UiCheckboxGroup from "../components/checkbox/checkbox-group.vue";
import UiCheckboxButton from "../components/checkbox/checkbox-button.vue";

export default {
  name: "CheckboxDemo",
  components: {
    UiCheckbox,
    UiCheckboxGroup,
    UiCheckboxButton,
  },
  data() {
    return {
      // 基础用法
      basicCheckbox1: false,
      basicCheckbox2: false,
      // 禁用状态
      disabledCheckbox1: false,
      disabledCheckbox2: true,
      // 多选框组
      groupCheckbox: [],
      // 按钮样式
      buttonCheckbox1: [],
      buttonCheckbox2: [],
      buttonCheckbox3: [],
      // 中间状态
      indeterminateCheckbox: false,
      isIndeterminate: false,
      checkedCities: [],
      cityOptions: ["上海", "北京", "广州", "深圳"]
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? [...this.cityOptions] : [];
      this.isIndeterminate = false;
      this.indeterminateCheckbox = val;
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      const totalCount = this.cityOptions.length;
      
      // 更新全选状态
      this.indeterminateCheckbox = checkedCount === totalCount;
      // 更新中间状态
      this.isIndeterminate = checkedCount > 0 && checkedCount < totalCount;
    }
  },
};
</script>

<style lang="scss" scoped>
.checkbox-demo {
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

      .ui-checkbox {
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
