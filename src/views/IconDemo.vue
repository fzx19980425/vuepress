<template>
  <div class="component-section">
    <h2>Icon 图标</h2>

    <!-- 组件介绍 -->
    <div class="component-intro">
      <p>Icon 图标组件用于显示各种矢量图标。</p>
      <p>它支持自定义大小和颜色，并利用 SVG sprite 技术提高性能和维护性。</p>
    </div>

    <!-- 基础用法 -->
    <div class="demo-block">
      <h3>基础用法</h3>
      <div class="demo-content icon-list-demo">
        <div class="icon-item" v-for="iconName in ['search', 'edit', 'delete', 'add', 'close']" :key="iconName">
          <ui-icon :name="iconName" size="24"></ui-icon>
          <span>{{ iconName }}</span>
        </div>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-icon name="search"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="edit"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="delete"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="add"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="close"&gt;&lt;/ui-icon&gt;</code></pre>
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div class="demo-block">
      <h3>不同尺寸</h3>
      <div class="demo-content size-demo">
        <div v-for="size in sizes" :key="size" class="size-item">
          <ui-icon name="search" :size="size"></ui-icon>
          <span>{{ size }}px</span>
        </div>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-icon name="search" size="16"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="search" size="24"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="search" size="32"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="search" size="48"&gt;&lt;/ui-icon&gt;</code></pre>
      </div>
    </div>

    <!-- 不同颜色 -->
    <div class="demo-block">
      <h3>不同颜色</h3>
      <div class="demo-content color-demo">
        <div v-for="color in colors" :key="color.value" class="color-item">
          <ui-icon name="search" :color="color.value" size="24"></ui-icon>
          <span>{{ color.label }}</span>
        </div>
      </div>
      <div class="demo-code">
        <pre><code>&lt;ui-icon name="search" color="#409EFF"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="search" color="#67C23A"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="search" color="#E6A23C"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="search" color="#F56C6C"&gt;&lt;/ui-icon&gt;</code></pre>
      </div>
    </div>

    <!-- 所有图标 -->
    <div class="demo-block">
      <h3>所有图标</h3>
      <div class="demo-content all-icons-demo">
        <div class="icon-item" v-for="icon in allIcons" :key="icon.name">
          <ui-icon :name="icon.name" size="24"></ui-icon>
          <div class="icon-info">
            <div class="icon-name">{{ icon.description }}</div>
            <div class="icon-key">key: {{ icon.name }}</div>
          </div>
        </div>
      </div>
      <div class="demo-code">
        <pre><code>&lt;!-- 部分图标示例 -->
&lt;ui-icon name="success"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="warning"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="info"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="error"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="calendar"&gt;&lt;/ui-icon&gt;
&lt;ui-icon name="time"&gt;&lt;/ui-icon&gt;</code></pre>
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
              <td>name</td>
              <td>图标名称</td>
              <td>string</td>
              <td>已导入的 SVG 文件名（不带 .svg 后缀）</td>
              <td>—</td>
            </tr>
            <tr>
              <td>size</td>
              <td>图标大小</td>
              <td>string | number</td>
              <td>例如 '16px', '1em', 24 (会转换为 '24px')</td>
              <td>继承父元素字体大小</td>
            </tr>
            <tr>
              <td>color</td>
              <td>图标颜色</td>
              <td>string</td>
              <td>任何合法的 CSS 颜色值</td>
              <td>继承父元素文字颜色</td>
            </tr>
            <tr>
              <td>className</td>
              <td>自定义类名</td>
              <td>string</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 事件说明 -->
    <div class="demo-block">
      <h3>事件</h3>
      <div class="demo-content">
        <p>Icon 组件目前没有特定的事件。</p>
      </div>
    </div>

  </div>
</template>

<script>
import UiIcon from '../components/icon/icon.vue'

export default {
  name: 'IconDemo',
  components: {
    UiIcon
  },
  data() {
    return {
      sizes: [16, 24, 32, 48],
      colors: [
        { label: '主要颜色', value: '#409EFF' },
        { label: '成功颜色', value: '#67C23A' },
        { label: '警告颜色', value: '#E6A23C' },
        { label: '危险颜色', value: '#F56C6C' },
        { label: '信息颜色', value: '#909399' }
      ],
      allIcons: [
        { name: 'search', description: '搜索' },
        { name: 'edit', description: '编辑' },
        { name: 'delete', description: '删除' },
        { name: 'add', description: '添加' },
        { name: 'close', description: '关闭' },
        { name: 'success', description: '成功' },
        { name: 'warning', description: '警告' },
        { name: 'info', description: '信息' },
        { name: 'error', description: '错误' },
        { name: 'arrow-up', description: '向上箭头' },
        { name: 'arrow-down', description: '向下箭头' },
        { name: 'arrow-left', description: '向左箭头' },
        { name: 'arrow-right', description: '向右箭头' },
        { name: 'calendar', description: '日历' },
        { name: 'time', description: '时间' },
        { name: 'user', description: '用户' },
        { name: 'setting', description: '设置' },
        { name: 'menu', description: '菜单' },
        { name: 'star', description: '星标' },
        { name: 'heart', description: '爱心' }
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

    &.icon-list-demo,
    &.size-demo,
    &.color-demo,
    &.all-icons-demo {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;

      .icon-item,
      .size-item,
      .color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease-in-out;

        &:hover {
          color: #409eff;
        }

        span {
          margin-top: 8px;
          font-size: 12px;
        }
      }

      .ui-icon {
        fill: currentColor;
        /* Ensure color prop works */
      }
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

  th,
  td {
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

.all-icons-demo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 12px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    transition: all 0.3s;
    cursor: pointer;
    text-align: center;

    &:hover {
      background-color: #f5f7fa;
      border-color: #c6e2ff;
      color: #409eff;
    }

    .icon-info {
      margin-top: 12px;
      width: 100%;

      .icon-name {
        font-size: 14px;
        color: #606266;
        margin-bottom: 4px;
      }

      .icon-key {
        font-size: 12px;
        color: #909399;
        font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
      }
    }
  }
}
</style>