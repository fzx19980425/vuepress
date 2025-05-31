# ECharts 数据可视化

## ECharts 简介

ECharts 是一个功能强大的开源可视化图表库，支持多种图表类型，可以满足各种数据可视化的需求。

### 主要特性

- 丰富的图表类型
- 支持大数据渲染
- 支持自定义主题
- 支持移动端适配
- 支持服务端渲染
- 支持 WebGL 渲染

## 基础使用

### 1. 安装和引入

```javascript
// npm 安装
npm install echarts

// 引入方式
import * as echarts from 'echarts';
// 或者按需引入
import { init, LineChart } from 'echarts/core';
```

### 2. 初始化图表

```javascript
// 基础初始化
const chartDom = document.getElementById('main');
const myChart = echarts.init(chartDom);

// 配置项
const option = {
    title: {
        text: '基础折线图'
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
    }]
};

// 使用配置项
myChart.setOption(option);
```

## 常用图表类型

### 1. 折线图

```javascript
const option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        areaStyle: {}
    }]
};
```

### 2. 柱状图

```javascript
const option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
        }
    }]
};
```

### 3. 饼图

```javascript
const option = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [{
        type: 'pie',
        radius: '50%',
        data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
        ],
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};
```

### 4. 散点图

```javascript
const option = {
    xAxis: {},
    yAxis: {},
    series: [{
        symbolSize: 20,
        data: [
            [10.0, 8.04],
            [8.0, 6.95],
            [13.0, 7.58],
            [9.0, 8.81],
            [11.0, 8.33],
            [14.0, 7.66],
            [6.0, 7.24],
            [4.0, 4.26],
            [12.0, 10.84],
            [7.0, 4.82],
            [5.0, 5.68]
        ],
        type: 'scatter'
    }]
};
```

## 高级特性

### 1. 主题定制

```javascript
// 注册主题
echarts.registerTheme('myTheme', {
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    backgroundColor: '#ffffff'
});

// 使用主题
const chart = echarts.init(dom, 'myTheme');
```

### 2. 响应式设计

```javascript
// 监听窗口大小变化
window.addEventListener('resize', function() {
    myChart.resize();
});

// 响应式配置
const option = {
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    }
};
```

### 3. 数据更新

```javascript
// 增量更新
myChart.setOption({
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130]
    }]
});

// 动画更新
myChart.setOption({
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut'
});
```

### 4. 事件处理

```javascript
// 点击事件
myChart.on('click', function(params) {
    console.log(params.name, params.value);
});

// 鼠标事件
myChart.on('mouseover', function(params) {
    // 处理鼠标悬停
});

// 图例事件
myChart.on('legendselectchanged', function(params) {
    // 处理图例选择变化
});
```

## 性能优化

### 1. 大数据渲染

```javascript
// 使用 dataset 管理数据
const option = {
    dataset: {
        source: largeData
    },
    series: [{
        type: 'line',
        // 使用 dataset 中的数据
        encode: {
            x: 'date',
            y: 'value'
        }
    }]
};

// 使用 progressive 渲染
const option = {
    series: [{
        type: 'line',
        progressive: 500,
        progressiveThreshold: 3000
    }]
};
```

### 2. 按需加载

```javascript
// 按需引入
import { init, LineChart } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, TooltipComponent } from 'echarts/components';

// 注册必要的组件
echarts.use([
    CanvasRenderer,
    GridComponent,
    TooltipComponent,
    LineChart
]);
```

## 最佳实践

### 1. 图表配置

```javascript
// 推荐的基础配置
const baseOption = {
    // 响应式布局
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    // 主题色
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    // 提示框
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    // 图例
    legend: {
        data: ['图例1', '图例2']
    }
};
```

### 2. 错误处理

```javascript
try {
    myChart.setOption(option);
} catch (error) {
    console.error('图表渲染错误：', error);
    // 显示错误提示
    myChart.showLoading({
        text: '图表加载失败',
        color: '#c23531',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)'
    });
}
```

### 3. 销毁处理

```javascript
// 组件销毁时
function destroyChart() {
    if (myChart) {
        myChart.dispose();
        myChart = null;
    }
    // 移除事件监听
    window.removeEventListener('resize', handleResize);
}
```

## 常见问题

### 1. 图表不显示
- 检查容器尺寸
- 确认数据格式
- 验证配置项
- 检查引入方式

### 2. 性能问题
- 使用按需加载
- 优化数据量
- 使用渐进式渲染
- 合理使用动画

### 3. 移动端适配
- 使用响应式配置
- 处理触摸事件
- 优化交互体验
- 考虑性能影响

## 相关资源

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [ECharts 示例](https://echarts.apache.org/examples/zh/index.html)
- [ECharts 主题编辑器](https://echarts.apache.org/zh/theme-builder.html)
- [ECharts 在线编辑器](https://echarts.apache.org/examples/zh/editor.html) 