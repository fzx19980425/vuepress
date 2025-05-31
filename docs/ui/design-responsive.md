# 响应式设计实现指南

## 1. 基础配置

### 1.1 视口设置

```html
<!-- 在 HTML 头部添加视口设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 1.2 媒体查询断点

```scss
// 断点变量定义
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1600px
);

// 媒体查询混入
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media screen and (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// 使用示例
.container {
  width: 100%;
  padding: 0 16px;
  
  @include respond-to('sm') {
    max-width: 540px;
    margin: 0 auto;
  }
  
  @include respond-to('md') {
    max-width: 720px;
  }
  
  @include respond-to('lg') {
    max-width: 960px;
  }
  
  @include respond-to('xl') {
    max-width: 1140px;
  }
}
```

## 2. 布局实现

### 2.1 弹性布局

```vue
<template>
  <div class="flex-container">
    <div class="flex-item">内容1</div>
    <div class="flex-item">内容2</div>
    <div class="flex-item">内容3</div>
  </div>
</template>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  
  .flex-item {
    flex: 1 1 300px; // 基础宽度300px，可伸缩，可换行
    
    @include respond-to('sm') {
      flex: 1 1 250px;
    }
    
    @include respond-to('md') {
      flex: 1 1 200px;
    }
  }
}
</style>
```

### 2.2 网格布局

```vue
<template>
  <div class="grid-container">
    <div class="grid-item" v-for="i in 6" :key="i">
      内容{{ i }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, 1fr); // 移动端单列
  
  @include respond-to('sm') {
    grid-template-columns: repeat(2, 1fr); // 平板双列
  }
  
  @include respond-to('md') {
    grid-template-columns: repeat(3, 1fr); // 桌面三列
  }
  
  @include respond-to('lg') {
    grid-template-columns: repeat(4, 1fr); // 大屏四列
  }
  
  .grid-item {
    min-height: 200px;
    background: #f5f5f5;
    padding: 16px;
  }
}
</style>
```

### 2.3 响应式表格

```vue
<template>
  <div class="responsive-table">
    <table>
      <thead>
        <tr>
          <th>用户名</th>
          <th>邮箱</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td data-label="用户名">{{ item.username }}</td>
          <td data-label="邮箱">{{ item.email }}</td>
          <td data-label="状态">{{ item.status }}</td>
          <td data-label="操作">
            <Button link>编辑</Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.responsive-table {
  width: 100%;
  overflow-x: auto;
  
  @include respond-to('md') {
    overflow-x: visible;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    @include respond-to('md') {
      display: table;
    }
    
    @media screen and (max-width: 767px) {
      display: block;
      
      thead {
        display: none;
      }
      
      tbody {
        display: block;
        
        tr {
          display: block;
          margin-bottom: 16px;
          border: 1px solid #e8e8e8;
          
          td {
            display: block;
            text-align: right;
            padding: 12px;
            border-bottom: 1px solid #e8e8e8;
            
            &::before {
              content: attr(data-label);
              float: left;
              font-weight: bold;
            }
            
            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }
  }
}
</style>
```

## 3. 组件适配

### 3.1 响应式导航

```vue
<template>
  <nav class="responsive-nav">
    <div class="nav-brand">Logo</div>
    
    <!-- 移动端菜单按钮 -->
    <button class="menu-toggle" @click="toggleMenu">
      <Icon :type="isMenuOpen ? 'close' : 'menu'" />
    </button>
    
    <!-- 导航菜单 -->
    <div class="nav-menu" :class="{ 'is-open': isMenuOpen }">
      <a href="#" class="nav-item">首页</a>
      <a href="#" class="nav-item">产品</a>
      <a href="#" class="nav-item">服务</a>
      <a href="#" class="nav-item">关于</a>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style lang="scss" scoped>
.responsive-nav {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  .nav-brand {
    font-size: 20px;
    font-weight: bold;
  }
  
  .menu-toggle {
    display: block;
    margin-left: auto;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
    
    @include respond-to('md') {
      display: none;
    }
  }
  
  .nav-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    
    &.is-open {
      display: block;
    }
    
    @include respond-to('md') {
      display: flex;
      position: static;
      box-shadow: none;
      padding: 0;
      margin-left: auto;
    }
    
    .nav-item {
      display: block;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      
      @include respond-to('md') {
        display: inline-block;
      }
      
      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
```

### 3.2 响应式表单

```vue
<template>
  <form class="responsive-form">
    <div class="form-group">
      <label>用户名</label>
      <input type="text" v-model="form.username" />
    </div>
    
    <div class="form-group">
      <label>邮箱</label>
      <input type="email" v-model="form.email" />
    </div>
    
    <div class="form-group">
      <label>手机号</label>
      <input type="tel" v-model="form.phone" />
    </div>
    
    <div class="form-actions">
      <Button type="primary">提交</Button>
      <Button>重置</Button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.responsive-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  
  .form-group {
    margin-bottom: 24px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      
      &:focus {
        border-color: #1890ff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }
  
  .form-actions {
    display: flex;
    gap: 16px;
    
    @media screen and (max-width: 575px) {
      flex-direction: column;
      
      button {
        width: 100%;
      }
    }
  }
}
</style>
```

## 4. 图片处理

### 4.1 响应式图片

```vue
<template>
  <div class="responsive-image">
    <!-- 使用 picture 元素 -->
    <picture>
      <!-- 移动端图片 -->
      <source
        media="(max-width: 575px)"
        srcset="/images/small.jpg"
      />
      <!-- 平板端图片 -->
      <source
        media="(max-width: 991px)"
        srcset="/images/medium.jpg"
      />
      <!-- 默认图片 -->
      <img
        src="/images/large.jpg"
        alt="响应式图片"
        loading="lazy"
      />
    </picture>
  </div>
</template>

<style lang="scss" scoped>
.responsive-image {
  width: 100%;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>
```

### 4.2 图片懒加载

```vue
<template>
  <div class="lazy-image">
    <img
      v-for="image in images"
      :key="image.id"
      :data-src="image.url"
      :alt="image.alt"
      class="lazy"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const images = ref([
  { id: 1, url: '/images/1.jpg', alt: '图片1' },
  { id: 2, url: '/images/2.jpg', alt: '图片2' },
  // ...
])

let observer = null

onMounted(() => {
  // 创建 Intersection Observer
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove('lazy')
        observer.unobserve(img)
      }
    })
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  })
  
  // 观察所有懒加载图片
  document.querySelectorAll('img.lazy').forEach(img => {
    observer.observe(img)
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss" scoped>
.lazy-image {
  img.lazy {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  img {
    opacity: 1;
    width: 100%;
    height: auto;
  }
}
</style>
```

## 5. 性能优化

### 5.1 条件加载组件

```vue
<template>
  <div>
    <!-- 基础内容始终加载 -->
    <div class="basic-content">
      <!-- 基础内容 -->
    </div>
    
    <!-- 根据屏幕尺寸条件加载 -->
    <component
      :is="currentComponent"
      v-if="shouldLoadComponent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HeavyComponent from './HeavyComponent.vue'

const windowWidth = ref(window.innerWidth)
const breakpoint = 768

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 根据屏幕宽度决定是否加载组件
const shouldLoadComponent = computed(() => {
  return windowWidth.value >= breakpoint
})

// 动态组件
const currentComponent = computed(() => {
  return windowWidth.value >= breakpoint ? HeavyComponent : null
})
</script>
```

### 5.2 响应式资源加载

```vue
<template>
  <div class="responsive-resources">
    <!-- 使用 v-if 条件加载资源 -->
    <div v-if="isMobile" class="mobile-resources">
      <!-- 移动端资源 -->
    </div>
    
    <div v-else class="desktop-resources">
      <!-- 桌面端资源 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)

const checkDevice = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
})
</script>
```

## 6. 最佳实践

1. **移动优先设计**
   - 从移动端开始设计
   - 逐步增强桌面端体验
   - 使用相对单位（rem、em、%）
   - 避免固定宽度

2. **性能考虑**
   - 使用适当的图片尺寸
   - 实现懒加载
   - 条件加载组件
   - 优化资源加载

3. **用户体验**
   - 保持触摸目标足够大（至少44x44px）
   - 避免悬停状态依赖
   - 提供合适的字体大小
   - 确保足够的点击间距

4. **测试验证**
   - 在不同设备上测试
   - 检查断点过渡
   - 验证交互体验
   - 测试性能表现

5. **维护建议**
   - 使用变量管理断点
   - 保持样式模块化
   - 编写清晰的注释
   - 建立组件文档