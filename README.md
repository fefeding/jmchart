# jmchart

[![Latest NPM release][npm-badge]][npm-badge-url]
[![Build Status](https://travis-ci.org/fefeding/jmchart.svg?branch=master)](https://travis-ci.org/fefeding/jmchart)

## 简介

jmchart 是一个轻量级、高性能的图表组件，支持微信小程序，基于 [jmgraph](https://github.com/fefeding/jmgraph) 构建。它提供了丰富的图表类型和灵活的配置选项，适用于各种数据可视化场景。

## 特性

- **轻量级**：代码体积小，加载速度快
- **高性能**：优化的渲染引擎，支持大数据量
- **多图表类型**：支持 17+ 种图表类型
- **动画效果**：支持流畅的入场动画
- **响应式**：自适应容器大小
- **跨平台**：支持浏览器和微信小程序
- **高度可定制**：丰富的样式配置选项
- **事件支持**：完整的鼠标/触摸事件系统

## 支持的图表类型

### 基础图表
| 图表类型 | 类型名 | 说明 |
|---------|-------|------|
| 折线图 | `line` | 展示数据趋势变化 |
| 柱状图 | `bar` | 对比数据大小 |
| 饼图 | `pie` | 展示数据占比 |
| 面积图 | `area` | 展示数据趋势和累积值 |

### 高级图表
| 图表类型 | 类型名 | 说明 |
|---------|-------|------|
| 散点图 | `scatter` | 展示两个变量之间的关系 |
| 气泡图 | `bubble` | 展示三个变量之间的关系 |
| 热力图 | `heatmap` | 展示数据密度和强度 |
| 雷达图 | `radar` | 多维度数据对比 |
| K线图 | `candlestick` | 金融数据展示 |
| 箱线图 | `boxPlot` | 展示数据分布情况 |

### 专业图表
| 图表类型 | 类型名 | 说明 |
|---------|-------|------|
| 仪表盘 | `gauge` | 展示单一指标的状态 |
| 瀑布图 | `waterfall` | 展示数据的增减变化 |
| 漏斗图 | `funnel` | 展示转化率分析 |
| 环形进度图 | `ringProgress` | 展示进度完成情况 |
| 词云图 | `wordCloud` | 展示文本词频分布 |
| 旭日图 | `sunburst` | 展示层级数据占比 |
| 范围图 | `range` | 展示数据的上下限范围 |
| 堆叠柱状图 | `stackBar` | 多系列数据堆叠 |

## 在线示例

### 综合示例
- [所有图表类型](http://fefeding.github.io/jmchart/example/all-charts.html) - 包含所有图表类型的完整示例

### 单独示例
- [折线图](http://fefeding.github.io/jmchart/example/line.html)
- [柱状图](http://fefeding.github.io/jmchart/example/bar.html)
- [饼图](http://fefeding.github.io/jmchart/example/pie.html)
- [雷达图](http://fefeding.github.io/jmchart/example/radar.html)
- [K线图](http://fefeding.github.io/jmchart/example/candlestick.html)
- [堆叠柱状图](http://fefeding.github.io/jmchart/example/stackBar.html)
- [范围图](http://fefeding.github.io/jmchart/example/range.html)
- [Vue 示例](http://fefeding.github.io/jmchart/example/vue.html)
- [微信小程序](https://github.com/fefeding/mini-jmchart)

## 安装

```bash
npm install jmchart
```

## 快速开始

### 基础用法

```javascript
import jmChart from 'jmchart';

// 创建图表容器
const container = document.getElementById('chart-container');

// 初始化图表
const chart = new jmChart(container, {
    width: 800,
    height: 400,
    enableAnimate: true
});

// 设置数据
chart.data = [
    { name: '一月', value: 100 },
    { name: '二月', value: 200 },
    { name: '三月', value: 150 },
    { name: '四月', value: 300 }
];

// 创建折线图
const lineSeries = chart.createSeries('line', {
    field: 'value',
    xField: 'name'
});

// 刷新图表
chart.refresh();
```

### Vue 组件使用

```vue
<template>
  <v-chart 
    :chart-data="data" 
    :chart-series="series"
    :chart-options="options"
    @touch-point-change="handlePointChange"
  />
</template>

<script>
import VChart from 'jmchart/component/vchart';

export default {
  components: { VChart },
  data() {
    return {
      data: [
        { name: '一月', value: 100 },
        { name: '二月', value: 200 },
        { name: '三月', value: 150 }
      ],
      series: [{
        type: 'line',
        field: 'value'
      }],
      options: {
        width: 600,
        height: 400,
        enableAnimate: true
      }
    }
  },
  methods: {
    handlePointChange(args) {
      console.log('数据点变化:', args);
    }
  }
}
</script>
```

## 配置选项

### 图表配置

```javascript
const options = {
    // 图表尺寸
    width: 800,
    height: 400,
    
    // 是否启用动画
    enableAnimate: true,
    
    // 是否自动刷新
    autoRefresh: true,
    
    // X轴字段名
    xField: 'name',
    
    // 图例位置: 'top' | 'bottom' | 'left' | 'right'
    legendPosition: 'top',
    
    // 是否显示图例
    legendVisible: true,
    
    // Y轴基线值
    baseY: 0,
    
    // X轴最小/最大值
    minXValue: 0,
    maxXValue: 100,
    
    // Y轴最小/最大值
    minYValue: 0,
    maxYValue: 100,
    
    // 悬停提示
    tooltip: {
        show: true,
        formatter: function(point) {
            return point.xLabel + ': ' + point.yLabel;
        }
    },
    
    // 点击事件
    onClick: function(point) {
        console.log('点击了数据点:', point);
    },
    
    // 样式配置
    style: {
        margin: { left: 40, top: 20, right: 20, bottom: 40 },
        layout: 'normal',
        // 坐标轴显示控制
        axis: {
            x: true,
            y: true
        }
    }
};
```

### 图表类型配置

#### 折线图

```javascript
chart.createSeries('line', {
    field: 'value',
    xField: 'name',
    style: {
        lineWidth: 2,
        showItem: true,      // 是否显示数据点
        curve: true,         // 是否平滑曲线
        area: true,          // 是否显示区域填充
        radius: 4,           // 数据点半径
        label: {
            show: true,      // 是否显示数据标签
            position: 'top', // 标签位置: 'top' | 'bottom' | 'left' | 'right' | 'inside'
            offset: 5,       // 标签偏移量
            fill: '#333',    // 标签颜色
            font: '12px Arial' // 标签字体
        }
    }
});
```

#### 柱状图

```javascript
chart.createSeries('bar', {
    field: 'value',
    xField: 'name',
    style: {
        perWidth: 0.5,       // 柱子宽度占比
        barWidth: 30         // 柱子固定宽度
    }
});
```

#### 饼图

```javascript
chart.createSeries('pie', {
    field: 'value',
    xField: 'name',
    style: {
        isHollow: false,     // 是否空心圆
        marginAngle: 0.1,    // 扇形间隔角度
        arcWidth: 0.2        // 空心圆环宽度
    }
});
```

#### 雷达图

```javascript
chart.createSeries('radar', {
    fields: ['语文', '数学', '英语', '物理', '化学'],
    style: {
        lineWidth: 2,
        fill: 'rgba(0,0,0,0.2)'
    }
});
// 数据格式
chart.data = [
    { x: '学生A', 语文: 80, 数学: 90, 英语: 75, 物理: 85, 化学: 70 },
    { x: '学生B', 语文: 90, 数学: 85, 英语: 80, 物理: 70, 化学: 95 }
];
```

#### 散点图

```javascript
chart.createSeries('scatter', {
    field: 'y',
    xField: 'x',
    style: {
        radius: 5,          // 点的半径
        showItem: true      // 是否显示点
    }
});
// 数据格式
chart.data = [
    { x: 10, y: 20 },
    { x: 20, y: 30 },
    { x: 30, y: 10 }
];
```

#### 气泡图

```javascript
chart.createSeries('bubble', {
    field: 'y',
    xField: 'x',
    style: {
        radius: 5,          // 基础半径
        radiusScale: 1,     // 半径缩放比例
        opacity: 0.6        // 透明度
    }
});
// 数据格式
chart.data = [
    { x: 10, y: 20, size: 30, color: '#ff0000' },
    { x: 20, y: 30, size: 50, color: '#00ff00' },
    { x: 30, y: 10, size: 20, color: '#0000ff' }
];
```

#### 热力图

```javascript
chart.createSeries('heatmap', {
    field: 'value',
    xField: 'x',
    style: {
        cellWidth: 20,      // 单元格宽度
        cellHeight: 20,     // 单元格高度
        colorGradient: [     // 颜色梯度
            '#313695', '#4575b4', '#74add1', '#abd9e9',
            '#e0f3f8', '#ffffbf', '#fee090', '#fdae61',
            '#f46d43', '#d73027', '#a50026'
        ]
    }
});
// 数据格式
chart.data = [
    { x: 1, y: 1, value: 10 },
    { x: 2, y: 1, value: 20 },
    { x: 1, y: 2, value: 15 },
    { x: 2, y: 2, value: 25 }
];
```

#### 仪表盘

```javascript
chart.createSeries('gauge', {
    field: 'value',
    style: {
        min: 0,             // 最小值
        max: 100,           // 最大值
        startAngle: -150,   // 起始角度
        endAngle: 150,      // 结束角度
        radiusScale: 0.8,   // 半径缩放
        unit: '%'           // 单位
    }
});
// 数据格式
chart.data = [{ value: 75 }];
```

#### 面积图

```javascript
chart.createSeries('area', {
    field: 'value',
    xField: 'name',
    style: {
        lineWidth: 2,       // 线宽
        showItem: true,     // 是否显示数据点
        curve: true,        // 是否平滑曲线
        area: {
            fill: 'rgba(0,128,255,0.3)' // 填充颜色
        }
    }
});
```

#### 瀑布图

```javascript
chart.createSeries('waterfall', {
    field: 'value',
    xField: 'name',
    style: {
        perWidth: 0.5,           // 柱子宽度占比
        increaseColor: '#52c41a', // 增长颜色
        decreaseColor: '#f5222d', // 减少颜色
        connectorColor: '#999'    // 连接线颜色
    }
});
// 数据格式
chart.data = [
    { name: '初始值', value: 100 },
    { name: '增加', value: 50 },
    { name: '减少', value: -30 },
    { name: '增加', value: 20 },
    { name: '最终值', value: 0 }
];
```

#### 范围图

```javascript
chart.createSeries('range', {
    fields: ['min', 'max'],  // 下限和上限字段
    xField: 'date',
    style: {
        color: '#F7BB98',    // 线条和填充颜色
        showItem: false,     // 是否显示数据点
        curve: true,         // 是否平滑曲线
        area: {
            fill: '#F7BB98', // 填充颜色
            opacity: 0.3     // 填充透明度
        }
    }
});
// 数据格式（例如：温度范围）
chart.data = [
    { date: '1月1日', min: 10, max: 20 },
    { date: '1月2日', min: 12, max: 22 },
    { date: '1月3日', min: 8, max: 18 }
];
```

#### 漏斗图

```javascript
chart.createSeries('funnel', {
    field: 'value',
    xField: 'name',
    style: {
        align: 'center',     // 对齐方式: 'center' | 'left' | 'right'
        gap: 2,              // 层之间的间隔
        stroke: '#fff',      // 边框颜色
        label: {
            show: true,      // 是否显示标签
            fill: '#fff',    // 标签颜色
            font: '12px Arial'
        }
    }
});
// 数据格式
chart.data = [
    { name: '访问量', value: 10000 },
    { name: '咨询量', value: 5000 },
    { name: '意向客户', value: 2000 },
    { name: '成交客户', value: 500 }
];
```

#### 环形进度图

```javascript
chart.createSeries('ringProgress', {
    field: 'value',
    style: {
        lineWidth: 20,       // 环形宽度
        max: 100,            // 最大值
        startAngle: -90,     // 起始角度（12点钟方向）
        ringGap: 10,         // 多环之间的间隔
        backgroundColor: '#e0e0e0', // 背景色
        showLabel: true      // 是否显示标签
    }
});
// 数据格式
chart.data = [
    { name: '完成度', value: 75 },
    { name: '目标', value: 60 }
];
```

#### 箱线图

```javascript
chart.createSeries('boxPlot', {
    field: ['min', 'q1', 'median', 'q3', 'max'], // 五个数值字段
    xField: 'category',
    style: {
        boxWidth: null,          // 箱体宽度，null 自动计算
        whiskerWidth: 1,         // 须线宽度
        whiskerLength: 20,       // 须线帽长度
        boxFill: 'transparent',  // 箱体填充
        label: {
            show: true,
            fill: '#333',
            font: '12px Arial'
        }
    }
});
// 数据格式
chart.data = [
    { category: '产品A', min: 10, q1: 20, median: 35, q3: 50, max: 70 },
    { category: '产品B', min: 15, q1: 30, median: 45, q3: 60, max: 80 },
    { category: '产品C', min: 5, q1: 15, median: 25, q3: 40, max: 55 }
];
```

#### 词云图

```javascript
chart.createSeries('wordCloud', {
    field: 'weight',
    xField: 'word',
    style: {
        minFontSize: 12,     // 最小字体
        maxFontSize: 60,     // 最大字体
        spiral: true,        // 使用螺旋布局
        colors: ['#249FDA', '#EA3B7C', '#8EBC00'] // 自定义颜色
    }
});
// 数据格式
chart.data = [
    { word: '数据分析', weight: 100 },
    { word: '可视化', weight: 80 },
    { word: '图表', weight: 90 },
    { word: 'JavaScript', weight: 95 }
];
```

#### 旭日图

```javascript
chart.createSeries('sunburst', {
    data: sunburstData,      // 树形结构数据
    style: {
        innerRadius: 30,     // 内圆半径
        showLabels: true,    // 是否显示标签
        stroke: '#fff',      // 边框颜色
        labelColor: '#fff'   // 标签颜色
    }
});
// 数据格式（树形结构）
const sunburstData = [{
    name: '根节点',
    children: [
        {
            name: '分类A',
            children: [
                { name: 'A1', value: 30 },
                { name: 'A2', value: 20 }
            ]
        },
        {
            name: '分类B',
            children: [
                { name: 'B1', value: 25 },
                { name: 'B2', value: 35 }
            ]
        }
    ]
}];
```

## API 文档

### jmChart 类

#### 方法

| 方法 | 说明 | 参数 |
|-----|------|-----|
| `createSeries(type, options)` | 创建图表序列 | type: 图表类型, options: 配置选项 |
| `createXAxis(options)` | 创建X轴 | options: 轴配置 |
| `createYAxis(options)` | 创建Y轴 | options: 轴配置 |
| `reset()` | 重置图表 | - |
| `refresh()` | 刷新图表 | - |
| `destroy()` | 销毁图表 | - |
| `getColor(index)` | 获取颜色 | index: 颜色索引 |

#### 事件

| 事件 | 说明 |
|-----|------|
| `touchPointChange` | 数据点变化事件 |
| `marklinelongtapstart` | 标线长按开始 |
| `marklinestartmove` | 标线开始移动 |
| `marklinemove` | 标线移动中 |
| `marklineendmove` | 标线移动结束 |

## 性能优化

本项目进行了以下性能优化：

1. **动画阈值控制**：数据量超过100时自动禁用动画
2. **缓存机制**：颜色计算等使用Map缓存
3. **空值检查**：减少不必要的渲染和计算
4. **代码优化**：移除冗余代码，优化循环和条件判断
5. **常量提取**：提取魔法数字为命名常量
6. **事件优化**：减少事件监听器的创建

## 开发

### 构建项目

```bash
npm install
npm run build
```

### 运行开发服务器

```bash
npm run dev
```

### 发布到NPM

```bash
npm run push
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- 微信小程序

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.3.0
- 新增图表类型：漏斗图、环形进度图、箱线图、词云图、旭日图
- 新增综合示例页面 (all-charts.html)
- 优化图表数据处理逻辑，支持无坐标轴图表
- 完善文档和代码注释

### v1.2.0
- 新增图表类型：散点图、气泡图、热力图、仪表盘、面积图、瀑布图
- 增强数据标签功能，支持top、bottom、left、right、inside等位置选项
- 添加图表点击事件支持
- 优化热力图颜色映射算法
- 完善文档和代码注释

### v1.1.0
- 优化代码性能
- 添加缓存机制
- 改进动画控制
- 完善文档

[npm-badge]: https://img.shields.io/npm/v/jmchart.svg
[npm-badge-url]: https://www.npmjs.com/package/jmchart
