# jmchart

[![Latest NPM release][npm-badge]][npm-badge-url]
[![Build Status](https://travis-ci.org/fefeding/jmchart.svg?branch=master)](https://travis-ci.org/fefeding/jmchart)

## 简介

jmchart 是一个轻量级、高性能的图表组件，支持微信小程序，基于 [jmgraph](https://github.com/fefeding/jmgraph) 构建。它提供了丰富的图表类型和灵活的配置选项，适用于各种数据可视化场景。

## 特性

- **轻量级**：代码体积小，加载速度快
- **高性能**：优化的渲染引擎，支持大数据量
- **多图表类型**：支持折线图、柱状图、饼图、雷达图、K线图、堆叠图等
- **动画效果**：支持流畅的入场动画
- **响应式**：自适应容器大小
- **跨平台**：支持浏览器和微信小程序
- **高度可定制**：丰富的样式配置选项
- **事件支持**：完整的鼠标/触摸事件系统

## 支持的图表类型

- **折线图** (line) - 展示数据趋势
- **柱状图** (bar) - 对比数据大小
- **饼图** (pie) - 展示数据占比
- **雷达图** (radar) - 多维度数据对比
- **K线图** (candlestick) - 金融数据展示
- **堆叠柱状图** (stackBar) - 多系列数据堆叠
- **堆叠折线图** (stackLine) - 多系列数据堆叠

## 在线示例

- [折线图](http://fefeding.github.io/jmchart/example/line.html)
- [柱状图](http://fefeding.github.io/jmchart/example/bar.html)
- [饼图](http://fefeding.github.io/jmchart/example/pie.html)
- [雷达图](http://fefeding.github.io/jmchart/example/radar.html)
- [K线图](http://fefeding.github.io/jmchart/example/candlestick.html)
- [堆叠柱状图](http://fefeding.github.io/jmchart/example/stackBar.html)
- [堆叠折线图](http://fefeding.github.io/jmchart/example/stackLine.html)
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
    
    // 样式配置
    style: {
        margin: { left: 40, top: 20, right: 20, bottom: 40 },
        layout: 'normal'
    }
};
```

### 图表类型配置

#### 折线图 (line)

```javascript
chart.createSeries('line', {
    field: 'value',
    xField: 'name',
    style: {
        lineWidth: 2,
        showItem: true,      // 是否显示数据点
        curve: true,         // 是否平滑曲线
        area: true,          // 是否显示区域填充
        radius: 4            // 数据点半径
    }
});
```

#### 柱状图 (bar)

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

#### 饼图 (pie)

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

#### 雷达图 (radar)

```javascript
chart.createSeries('radar', {
    field: ['value1', 'value2', 'value3'],
    xField: 'name',
    style: {
        lineWidth: 2,
        fill: 'rgba(0,0,0,0.2)'
    }
});
```

#### K线图 (candlestick)

```javascript
chart.createSeries('candlestick', {
    field: ['open', 'close', 'high', 'low'],
    xField: 'date',
    style: {
        masculineColor: 'red',    // 阳线颜色
        negativeColor: 'green',  // 阴线颜色
        perWidth: 0.5
    }
});
```

## API 文档

### jmChart 类

#### 方法

- `createSeries(type, options)` - 创建图表序列
- `createXAxis(options)` - 创建X轴
- `createYAxis(options)` - 创建Y轴
- `reset()` - 重置图表
- `refresh()` - 刷新图表
- `destroy()` - 销毁图表
- `getColor(index)` - 获取颜色

#### 事件

- `touchPointChange` - 数据点变化事件
- `marklinelongtapstart` - 标线长按开始
- `marklinestartmove` - 标线开始移动
- `marklinemove` - 标线移动中
- `marklineendmove` - 标线移动结束

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

### v1.2.10
- 优化代码性能
- 添加缓存机制
- 改进动画控制
- 完善文档

[npm-badge]: https://img.shields.io/npm/v/jmchart.svg
[npm-badge-url]: https://www.npmjs.com/package/jmchart