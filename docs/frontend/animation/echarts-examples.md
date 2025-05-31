# ECharts 示例

## 数据大屏

### 1. 实时监控大屏

```javascript
// 实时数据监控大屏配置
const option = {
    backgroundColor: '#000',
    title: {
        text: '系统实时监控',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ['CPU使用率', '内存使用率', '网络流量', '磁盘IO'],
        textStyle: {
            color: '#fff'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        axisLabel: {
            color: '#fff'
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            color: '#fff'
        }
    },
    series: [
        {
            name: 'CPU使用率',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [30, 40, 35, 50, 49, 60, 70, 91]
        },
        {
            name: '内存使用率',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [20, 32, 31, 34, 90, 30, 20, 30]
        },
        {
            name: '网络流量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [50, 32, 21, 54, 90, 30, 20, 30]
        },
        {
            name: '磁盘IO',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [30, 32, 31, 34, 90, 30, 20, 30]
        }
    ]
};
```

### 2. 销售数据大屏

```javascript
// 销售数据大屏配置
const option = {
    backgroundColor: '#fff',
    title: {
        text: '销售数据分析',
        subtext: '2023年度数据',
        left: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['销售额', '利润', '订单量'],
        top: '10%'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: [
        {
            type: 'value',
            name: '金额',
            axisLabel: {
                formatter: '{value} 万'
            }
        },
        {
            type: 'value',
            name: '订单量',
            axisLabel: {
                formatter: '{value} 单'
            }
        }
    ],
    series: [
        {
            name: '销售额',
            type: 'bar',
            data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330]
        },
        {
            name: '利润',
            type: 'bar',
            data: [20, 32, 21, 34, 20, 30, 40, 32, 31, 34, 40, 50]
        },
        {
            name: '订单量',
            type: 'line',
            yAxisIndex: 1,
            data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330]
        }
    ]
};
```

## 业务图表

### 1. 用户画像分析

```javascript
// 用户画像雷达图
const option = {
    title: {
        text: '用户画像分析'
    },
    tooltip: {},
    legend: {
        data: ['实际用户', '目标用户']
    },
    radar: {
        indicator: [
            { name: '消费能力', max: 100 },
            { name: '活跃度', max: 100 },
            { name: '忠诚度', max: 100 },
            { name: '社交影响力', max: 100 },
            { name: '品牌认知度', max: 100 }
        ]
    },
    series: [{
        name: '用户画像',
        type: 'radar',
        data: [
            {
                value: [80, 70, 60, 50, 40],
                name: '实际用户'
            },
            {
                value: [90, 80, 70, 60, 50],
                name: '目标用户'
            }
        ]
    }]
};
```

### 2. 销售漏斗图

```javascript
// 销售漏斗图
const option = {
    title: {
        text: '销售转化漏斗',
        subtext: '2023年Q1'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
        {
            name: '转化率',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
                show: true,
                position: 'inside'
            },
            labelLine: {
                length: 10,
                lineStyle: {
                    width: 1,
                    type: 'solid'
                }
            },
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
            },
            emphasis: {
                label: {
                    fontSize: 20
                }
            },
            data: [
                { value: 100, name: '访问量' },
                { value: 80, name: '注册' },
                { value: 60, name: '下载' },
                { value: 40, name: '购买' },
                { value: 20, name: '复购' }
            ]
        }
    ]
};
```

## 地图可视化

### 1. 中国地图数据

```javascript
// 中国地图数据可视化
const option = {
    title: {
        text: '全国销售分布',
        subtext: '数据来源：销售系统',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    visualMap: {
        min: 0,
        max: 1000,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true
    },
    series: [
        {
            name: '销售额',
            type: 'map',
            map: 'china',
            roam: true,
            emphasis: {
                label: {
                    show: true
                }
            },
            data: [
                { name: '北京', value: 800 },
                { name: '上海', value: 900 },
                { name: '广东', value: 700 },
                { name: '四川', value: 500 },
                { name: '湖北', value: 400 }
            ]
        }
    ]
};
```

### 2. 热力图

```javascript
// 热力图示例
const option = {
    title: {
        text: '用户活跃度热力图',
        subtext: '最近7天数据'
    },
    tooltip: {
        position: 'top'
    },
    grid: {
        height: '50%',
        top: '10%'
    },
    xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        splitArea: {
            show: true
        }
    },
    yAxis: {
        type: 'category',
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        splitArea: {
            show: true
        }
    },
    visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
    },
    series: [{
        name: '活跃度',
        type: 'heatmap',
        data: [
            // 生成随机数据
            ...Array.from({ length: 8 }, (_, i) => 
                Array.from({ length: 7 }, (_, j) => [
                    j,
                    i,
                    Math.round(Math.random() * 100)
                ])
            ).flat()
        ],
        label: {
            show: true
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};
```

## 动态图表

### 1. 动态折线图

```javascript
// 动态数据更新示例
let data = [];
let now = new Date(2023, 0, 1);
let oneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;

for (let i = 0; i < 100; i++) {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    data.push({
        name: now.toString(),
        value: [
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
        ].join('/'),
        value: Math.round(value)
    });
}

const option = {
    title: {
        text: '动态数据'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            params = params[0];
            return params.name + ' : ' + params.value;
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
            show: true
        }
    },
    series: [{
        name: '模拟数据',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: data
    }]
};

// 定时更新数据
setInterval(function () {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    data.shift();
    data.push({
        name: now.toString(),
        value: [
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
        ].join('/'),
        value: Math.round(value)
    });

    myChart.setOption({
        series: [{
            data: data
        }]
    });
}, 1000);
```

### 2. 动态仪表盘

```javascript
// 动态仪表盘示例
const option = {
    series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
            lineStyle: {
                width: 6,
                color: [
                    [0.3, '#67e0e3'],
                    [0.7, '#37a2da'],
                    [1, '#fd666d']
                ]
            }
        },
        pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
                color: 'auto'
            }
        },
        axisTick: {
            length: 12,
            lineStyle: {
                color: 'auto',
                width: 2
            }
        },
        splitLine: {
            length: 20,
            lineStyle: {
                color: 'auto',
                width: 5
            }
        },
        axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            formatter: function(value) {
                if (value === 0.5) {
                    return '50%';
                } else if (value === 1) {
                    return '100%';
                }
                return '';
            }
        },
        title: {
            offsetCenter: [0, '-20%'],
            fontSize: 20
        },
        detail: {
            fontSize: 30,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: function(value) {
                return Math.round(value) + '%';
            },
            color: 'auto'
        },
        data: [{
            value: 70,
            name: '完成率'
        }]
    }]
};

// 动态更新数据
let currentValue = 70;
setInterval(function() {
    currentValue = (currentValue + Math.random() * 20 - 10).toFixed(1);
    currentValue = Math.max(Math.min(currentValue, 100), 0);
    myChart.setOption({
        series: [{
            data: [{
                value: currentValue,
                name: '完成率'
            }]
        }]
    });
}, 2000);
```

## 交互式图表

### 1. 联动图表

```javascript
// 多图表联动示例
const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    legend: {
        data: ['蒸发量', '降水量', '温度']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '水量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value} ml'
            }
        },
        {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
                formatter: '{value} °C'
            }
        }
    ],
    series: [
        {
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
            name: '温度',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
    ]
};

// 图表联动
myChart.on('click', function(params) {
    // 处理点击事件
    console.log(params.name, params.value);
    // 可以在这里更新其他图表
});
```

### 2. 可缩放图表

```javascript
// 可缩放图表示例
const option = {
    title: {
        text: '数据缩放示例'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100
        },
        {
            start: 0,
            end: 100
        }
    ],
    series: [
        {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            label: {
                show: true,
                position: 'top'
            },
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
};
```

## 相关资源

- [ECharts 官方示例](https://echarts.apache.org/examples/zh/index.html)
- [ECharts 配置项手册](https://echarts.apache.org/zh/option.html)
- [ECharts 主题编辑器](https://echarts.apache.org/zh/theme-builder.html)
- [ECharts 在线编辑器](https://echarts.apache.org/examples/zh/editor.html) 