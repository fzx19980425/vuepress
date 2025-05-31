<template>
  <div class="dialog-demo">
    <div class="component-section">
      <h2>Dialog 对话框</h2>
      <p class="component-desc">在保留当前页面状态的情况下，告知用户并承载相关操作。</p>

      <div class="demo-block">
        <h3>基础用法</h3>
        <p class="demo-desc">Dialog 弹出一个对话框，适合需要定制性更大的场景。</p>
        <div class="demo-content">
          <ui-button @click="dialogVisible = true">点击打开 Dialog</ui-button>
          <ui-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>这是一段内容</span>
            <template #footer>
              <span class="dialog-footer">
                <ui-button @click="dialogVisible = false">取 消</ui-button>
                <ui-button type="primary" @click="dialogVisible = false">确 定</ui-button>
              </span>
            </template>
          </ui-dialog>
        </div>
        <div class="demo-code">
          <pre><code>&lt;ui-button @click="dialogVisible = true"&gt;点击打开 Dialog&lt;/ui-button&gt;
&lt;ui-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"&gt;
  &lt;span&gt;这是一段内容&lt;/span&gt;
  &lt;template #footer&gt;
    &lt;span class="dialog-footer"&gt;
      &lt;ui-button @click="dialogVisible = false"&gt;取 消&lt;/ui-button&gt;
      &lt;ui-button type="primary" @click="dialogVisible = false"&gt;确 定&lt;/ui-button&gt;
    &lt;/span&gt;
  &lt;/template&gt;
&lt;/ui-dialog&gt;</code></pre>
        </div>
         <div class="demo-attributes">
          <h4>Dialog 属性</h4>
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
                <td>visible</td>
                <td>是否显示 Dialog</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
              <tr>
                <td>title</td>
                <td>Dialog 的标题</td>
                <td>string</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>width</td>
                <td>Dialog 的宽度</td>
                <td>string</td>
                <td>—</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>size</td>
                <td>Dialog 的大小</td>
                <td>string</td>
                <td>large / default / small / mini</td>
                <td>default</td>
              </tr>
              <tr>
                <td>fullscreen</td>
                <td>是否为全屏 Dialog</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
              <tr>
                <td>top</td>
                <td>Dialog CSS 中的 margin-top 值</td>
                <td>string</td>
                <td>—</td>
                <td>15vh</td>
              </tr>
              <tr>
                <td>modal</td>
                <td>是否需要遮罩层</td>
                <td>boolean</td>
                <td>—</td>
                <td>true</td>
              </tr>
              <tr>
                <td>modal-append-to-body</td>
                <td>遮罩层是否插入至 body 元素上</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
              <tr>
                <td>append-to-body</td>
                <td>Dialog 自身是否插入至 body 元素上</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
              <tr>
                <td>lock-scroll</td>
                <td>是否在 Dialog 出现时将 body 滚动锁定</td>
                <td>boolean</td>
                <td>—</td>
                <td>true</td>
              </tr>
              <tr>
                <td>custom-class</td>
                <td>Dialog 的自定义类名</td>
                <td>string</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>center</td>
                <td>是否对头部和底部采用居中布局</td>
                <td>boolean</td>
                <td>—</td>
                <td>false</td>
              </tr>
              <tr>
                <td>showClose</td>
                <td>是否显示关闭按钮</td>
                <td>boolean</td>
                <td>—</td>
                <td>true</td>
              </tr>
              <tr>
                <td>closeOnClickModal</td>
                <td>是否可以通过点击 modal 关闭 Dialog</td>
                <td>boolean</td>
                <td>—</td>
                <td>true</td>
              </tr>
              <tr>
                <td>beforeClose</td>
                <td>关闭前的回调，会暂停 Dialog 的关闭</td>
                <td>function(done)，done 用于关闭 Dialog</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>

          <h4>Dialog 事件</h4>
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
                <td>open</td>
                <td>Dialog 打开的回调</td>
                <td>—</td>
              </tr>
              <tr>
                <td>opened</td>
                <td>Dialog 打开动画结束时的回调</td>
                <td>—</td>
              </tr>
               <tr>
                <td>close</td>
                <td>Dialog 关闭的回调</td>
                <td>—</td>
              </tr>
               <tr>
                <td>closed</td>
                <td>Dialog 关闭动画结束时的回调</td>
                <td>—</td>
              </tr>
              <tr>
                <td>update:visible</td>
                <td>当 Dialog 的显示状态发生变化时触发</td>
                <td>visible: 是否显示</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="demo-block">
        <h3>居中布局</h3>
        <p class="demo-desc">通过 center 属性可以让标题和底部居中显示。</p>
        <div class="demo-content">
          <ui-button @click="centerDialogVisible = true">点击打开居中布局的 Dialog</ui-button>
          <ui-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <span>居中布局的对话框</span>
            <template #footer>
              <span class="dialog-footer">
                <ui-button @click="centerDialogVisible = false">取 消</ui-button>
                <ui-button type="primary" @click="centerDialogVisible = false">确 定</ui-button>
              </span>
            </template>
          </ui-dialog>
        </div>
         <div class="demo-code">
          <pre><code>&lt;ui-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="30%"
  center&gt;
  &lt;span&gt;居中布局的对话框&lt;/span&gt;
  &lt;template #footer&gt;
    &lt;span class="dialog-footer"&gt;
      &lt;ui-button @click="centerDialogVisible = false"&gt;取 消&lt;/ui-button&gt;
      &lt;ui-button type="primary" @click="centerDialogVisible = false"&gt;确 定&lt;/ui-button&gt;
    &lt;/span&gt;
  &lt;/template&gt;
&lt;/ui-dialog&gt;</code></pre>
        </div>
      </div>

      <div class="demo-block">
        <h3>关闭前确认</h3>
        <p class="demo-desc">通过 before-close 属性可以设置关闭前的回调函数，用于确认是否关闭对话框。</p>
        <div class="demo-content">
          <ui-button @click="confirmDialogVisible = true">点击打开关闭前确认的 Dialog</ui-button>
          <ui-dialog
            title="提示"
            :visible.sync="confirmDialogVisible"
            width="30%"
            :before-close="handleClose"
            ref="confirmDialog">
            <span>关闭前确认</span>
            <template #footer>
              <span class="dialog-footer">
                <ui-button @click="handleConfirmClose">取 消</ui-button>
                <ui-button type="primary" @click="handleConfirmClose">确 定</ui-button>
              </span>
            </template>
          </ui-dialog>
        </div>
         <div class="demo-code">
          <pre><code>&lt;ui-dialog
  title="提示"
  :visible.sync="confirmDialogVisible"
  width="30%"
  :before-close="handleClose"&gt;
  &lt;span&gt;关闭前确认&lt;/span&gt;
  &lt;template #footer&gt;
    &lt;span class="dialog-footer"&gt;
      &lt;ui-button @click="handleConfirmClose"&gt;取 消&lt;/ui-button&gt;
      &lt;ui-button type="primary" @click="handleConfirmClose"&gt;确 定&lt;/ui-button&gt;
    &lt;/span&gt;
  &lt;/template&gt;
&lt;/ui-dialog&gt;

methods: {
  handleClose(done) {
    const confirmed = confirm(\'确认关闭？\');
    if (confirmed) {
      done();
    }
  }
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiDialog from '../components/dialog/dialog.vue'
import UiButton from '../components/button/button.vue'

export default {
  name: 'DialogDemo',
  components: {
    UiDialog,
    UiButton
  },
  data() {
    return {
      dialogVisible: false,
      customDialogVisible: false,
      centerDialogVisible: false,
      confirmDialogVisible: false,
      sizeDialogVisible: false,
      currentSize: 'default',
      form: {
        name: '',
        region: ''
      },
      options: [
        { value: 'beijing', label: '北京' },
        { value: 'shanghai', label: '上海' },
        { value: 'guangzhou', label: '广州' },
        { value: 'shenzhen', label: '深圳' }
      ]
    }
  },
  methods: {
    handleClose(done) {
      const confirmed = confirm('确认关闭？');
      if (confirmed) {
        done();
      } else {
        console.log('关闭已取消');
      }
    },
    handleConfirmClose() {
      this.$refs.confirmDialog.handleClose();
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-demo {
  padding: 20px;
  background-color: #fff;

  .component-section {
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
    margin-bottom: 30px;

    h3 {
      margin-bottom: 15px;
      font-size: 16px;
      color: #333;
    }

    .demo-desc {
      margin: 14px 0;
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.6;
    }

    .demo-content {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      padding: 20px;
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