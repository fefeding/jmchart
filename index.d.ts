// Type definitions for jmchart
// Re-exports jmgraph types and adds chart-specific types
// =========================================================

import type {
  jmGraph,
  jmGraphOptions,
  jmStyle,
  jmControl,
  jmControlParams,
  jmPath,
  jmList,
  jmUtils,
  Point,
  Bounds,
} from 'jmgraph';

// 导出公共常量
export const ANIMATION_DATA_THRESHOLD: 100;
export const DEFAULT_ANIMATION_COUNT: 10;

/**
 * 图表系列类型
 */
export type SeriesType =
  | 'line'
  | 'bar'
  | 'stackBar'
  | 'pie'
  | 'radar'
  | 'stackLine'
  | 'range'
  | 'candlestick'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'gauge'
  | 'area'
  | 'waterfall'
  | 'funnel'
  | 'ringProgress'
  | 'boxPlot'
  | 'wordCloud';

/**
 * 轴配置选项
 */
export interface AxisOptions {
  type?: 'x' | 'y' | 'radar';
  field?: string;
  dataType?: 'number' | 'date' | 'string';
  visible?: boolean;
  format?: (value: any) => string;
  index?: number;
  zeroBase?: boolean;
  style?: jmStyle;
  minXValue?: number;
  maxXValue?: number;
  minYValue?: number;
  maxYValue?: number;
  radarOption?: {
    center: Point;
    radius: number;
    yCount: number;
    rotate: number;
    cos: number;
    sin: number;
    yAxises?: any[];
  };
  [key: string]: any;
}

/**
 * 数据点对象
 */
export interface DataPoint {
  x: number;
  y: number;
  xValue: any;
  xLabel: any;
  yValue: any;
  yLabel?: any;
  height?: number;
  index: number;
  data: any;
  style?: jmStyle;
  points?: Array<{
    x: number;
    y: number;
    height: number;
    yValue: any;
    field: string;
    m?: boolean;
  }>;
  m?: boolean;
  /** 饼图专用：扇形占比 */
  step?: number;
  /** 饼图专用：扇形形状 */
  shape?: any;
  /** 饼图专用：起始角度 */
  startAngle?: number;
  /** 饼图专用：结束角度 */
  endAngle?: number;
  /** 饼图专用：半径 */
  radius?: number;
  /** 饼图专用：最大半径 */
  maxRadius?: number;
  /** 饼图专用：最小半径 */
  minRadius?: number;
  /** 饼图专用：中心点 */
  center?: Point;
  /** 饼图专用：是否逆时针 */
  anticlockwise?: boolean;
  /** 雷达图专用：关联轴对象 */
  axis?: any;
  /** 雷达图专用：数据点半径 */
  radiusValue?: number;
  /** 散点图/气泡图：点大小 */
  size?: number;
  /** 散点图/气泡图：点颜色 */
  color?: string;
  /** 气泡图：透明度 */
  opacity?: number;
  /** 热力图：数值 */
  value?: number;
  /** 瀑布图：原始值 */
  originalValue?: number;
  /** 瀑布图：起始累计值 */
  startValue?: number;
  /** 瀑布图：结束累计值 */
  endValue?: number;
}

/**
 * 图表系列选项
 */
export interface SeriesOptions {
  type?: SeriesType;
  field?: string | string[];
  fields?: string | string[];
  xField?: string;
  yField?: string;
  index?: number;
  style?: jmStyle;
  color?: string | ((point: DataPoint) => string);
  legendLabel?: string;
  enableAnimate?: boolean;
  graph?: jmChart;
  label?: {
    show?: boolean;
    fill?: string | ((point: DataPoint) => string);
    font?: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'inside';
    offset?: number;
    [key: string]: any;
  };
  itemLabelFormat?: (point: DataPoint) => string;
  initItemHandler?: (point: DataPoint) => void;
  initItem?: (point: DataPoint) => void;
  onInit?: (...args: any[]) => void;
  minYValue?: number;
  maxYValue?: number;
  yLabelFormat?: (value: any) => string;
  lockSide?: Bounds;
  /** 饼图专用：起始角度，支持函数 */
  startAngle?: number | ((data: any[]) => number);
  /** 饼图专用：逆时针绘图 */
  anticlockwise?: boolean;
  /** 饼图专用：半径，支持函数 */
  radius?: number | ((point: DataPoint, radius: number, index: number) => number);
  /** 饼图专用：最大半径 */
  maxRadius?: number | ((point: DataPoint, radius: number, index: number) => number);
  /** 饼图专用：最小半径 */
  minRadius?: number | ((point: DataPoint, radius: number, index: number) => number);
  /** 饼图专用：中心点，支持函数 */
  center?: Point | ((point: DataPoint, center: Point, index: number) => Point);
  /** 交互事件 */
  onClick?: (point: DataPoint, event?: any) => void;
  onOver?: (point: DataPoint, event?: any) => void;
  onLeave?: (point: DataPoint, event?: any) => void;
  [key: string]: any;
}

/**
 * 图例附加选项
 */
export interface LegendAppendOptions {
  name?: string;
  data?: any;
}

/**
 * 图表构造选项
 */
export interface jmChartOptions extends jmGraphOptions {
  enableAnimate?: boolean;
  data?: any[];
  xField?: string;
  baseY?: number;
  legendVisible?: boolean;
  legendPosition?: string;
  layout?: 'normal' | 'inside';
  xLabelFormat?: (value: any) => string;
  yLabelFormat?: (value: any) => string;
  xAxisOption?: AxisOptions;
  yAxisOption?: AxisOptions;
  minXValue?: number;
  maxXValue?: number;
  minYValue?: number;
  maxYValue?: number;
  touchGraph?: boolean;
  touchCanvas?: HTMLCanvasElement;
  onClick?: (point: DataPoint) => void;
  [key: string]: any;
}

/**
 * 仪表盘渐变色配置
 */
export interface GaugeGradientColor {
  offset: number;
  color: string;
}

/**
 * 图表默认样式
 */
export interface jmChartStyle extends jmStyle {
  layout?: 'normal' | 'inside';
  margin?: {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
  };
  itemLabel?: jmStyle;
  markLine?: jmStyle & {
    x?: boolean;
    y?: boolean;
    radius?: number;
    longtap?: boolean;
    lock?: {
      x?: number;
      y?: number;
    };
  };
  legend?: jmStyle & {
    margin?: {
      left?: number;
      top?: number;
      right?: number;
      bottom?: number;
    };
    width?: number;
    height?: number;
    item?: {
      shape?: { width?: number; height?: number };
      label?: jmStyle;
      normal?: jmStyle;
      hover?: jmStyle;
    };
  };
  chartArea?: jmStyle;
  axis?: jmStyle & {
    x?: boolean;
    y?: boolean;
    grid?: jmStyle & {
      x?: boolean;
      y?: boolean;
      stroke?: string;
      lineType?: 'dotted' | 'solid';
      dashLength?: number;
    };
    align?: 'normal' | 'center';
    xLabel?: jmStyle & {
      count?: number;
      length?: number;
      margin?: { left?: number; top?: number; right?: number; bottom?: number };
      rotation?: { angle: number; point?: Point };
    };
    yLabel?: jmStyle & {
      count?: number;
      length?: number;
      margin?: { left?: number; top?: number; right?: number; bottom?: number };
      rotation?: { angle: number; point?: Point };
    };
  };
  chartColors?: string[];
  line?: jmStyle & {
    lineWidth?: number;
    radius?: number;
    showItem?: boolean;
    curve?: boolean;
    area?: boolean | jmStyle;
    perWidth?: number;
    aniCount?: number;
    item?: jmStyle;
  };
  stackLine?: jmStyle & {
    lineWidth?: number;
    radius?: number;
    showItem?: boolean;
    curve?: boolean;
    area?: boolean | jmStyle;
    aniCount?: number;
    item?: jmStyle;
  };
  range?: jmStyle & {
    lineWidth?: number;
    radius?: number;
    showItem?: boolean;
    curve?: boolean;
    lineType?: 'dotted' | 'solid';
    area?: jmStyle;
    aniCount?: number;
    item?: jmStyle;
  };
  bar?: jmStyle & {
    lineWidth?: number;
    perWidth?: number;
    barWidth?: number;
    aniCount?: number;
    item?: jmStyle;
  };
  pie?: jmStyle & {
    marginAngle?: number;
    arcWidth?: number;
    isHollow?: boolean;
    margin?: { left?: number; top?: number; right?: number; bottom?: number };
  };
  radar?: jmStyle & {
    margin?: { left?: number; top?: number; right?: number; bottom?: number };
  };
  candlestick?: jmStyle & {
    perWidth?: number;
    barWidth?: number;
    masculineColor?: string;
    negativeColor?: string;
  };
  scatter?: jmStyle & {
    radius?: number;
    item?: jmStyle;
  };
  bubble?: jmStyle & {
    radius?: number;
    radiusScale?: number;
    opacity?: number;
    item?: jmStyle;
  };
  heatmap?: jmStyle & {
    cellWidth?: number;
    cellHeight?: number;
    defaultColor?: string;
    colorGradient?: string[];
    item?: jmStyle;
  };
  gauge?: jmStyle & {
    min?: number;
    max?: number;
    startAngle?: number;
    endAngle?: number;
    radiusScale?: number;
    lineWidth?: number;
    backgroundStroke?: string;
    backgroundFill?: string;
    backgroundLineWidth?: number;
    gradient?: boolean;
    gradientColors?: GaugeGradientColor[];
    tickCount?: number;
    tickColor?: string;
    tickLabelColor?: string;
    pointerColor?: string;
    pointerWidth?: number;
    centerColor?: string;
    centerRadius?: number;
    valueColor?: string;
    valueFont?: string;
    unit?: string;
    unitColor?: string;
    unitFont?: string;
  };
  area?: jmStyle & {
    lineWidth?: number;
    radius?: number;
    showItem?: boolean;
    curve?: boolean;
    area?: jmStyle;
    aniCount?: number;
    item?: jmStyle;
  };
  waterfall?: jmStyle & {
    perWidth?: number;
    increaseColor?: string;
    decreaseColor?: string;
    connectorColor?: string;
    aniCount?: number;
  };
  funnel?: jmStyle & {
    align?: 'center' | 'left' | 'right';
    gap?: number;
    stroke?: string;
    label?: jmStyle;
    colors?: string[];
  };
  ringProgress?: jmStyle & {
    lineWidth?: number;
    startAngle?: number;
    max?: number;
    ringGap?: number;
    backgroundColor?: string;
    showLabel?: boolean;
    labelColor?: string;
    labelFont?: string;
    progressStyle?: jmStyle;
    colors?: string[];
  };
  boxPlot?: jmStyle & {
    boxWidth?: number | null;
    whiskerWidth?: number;
    whiskerLength?: number;
    boxFill?: string;
    label?: jmStyle;
  };
  wordCloud?: jmStyle & {
    minFontSize?: number;
    maxFontSize?: number;
    spiral?: boolean;
    colors?: string[];
  };
}

/**
 * 轴类
 */
export declare class jmAxis extends jmControl {
  constructor(options?: AxisOptions);

  field: string;
  dataType: 'number' | 'date' | 'string';
  labelStart: number;
  radarOption?: any;

  min(m?: any): number;
  max(value?: any): number;
  step(): number;
  clear(): void;
  reset(): void;
  init(options?: AxisOptions): void;
}

/**
 * 图例类
 */
export declare class jmLegend extends jmControl {
  constructor(options?: { style?: jmStyle });

  legendPosition: string;

  append(series: jmSeries, shape: jmControl, options?: LegendAppendOptions): void;
  init(): void;
  reset(): void;
}

/**
 * 标线管理器
 *
 * 管理图表中的 X/Y 标线，支持鼠标/触摸拖拽移动和长按触发。
 * 标线事件通过 jmChart 实例触发。
 */
export declare class jmMarkLineManager {
  constructor(chart: jmChart);

  chart: jmChart;
  xMarkLine?: any;
  yMarkLine?: any;

  /** 初始化标线，绑定 mousedown/touchstart/mousemove/touchmove/mouseup/touchend 事件 */
  init(chart: jmChart): void;
  /** 开始移动标线，markLineType: 'xy' | 'x' | 'y' */
  startMove(args: any, markLineType?: string): void;
  /** 移动标线到当前位置 */
  move(args: any): void;
  /** 终止移动标线 */
  endMove(args: any): void;
}

/**
 * 图表系列基类
 *
 * 所有图表类型的基类，提供通用的数据点生成、坐标轴管理、动画控制和图例生成功能。
 * 子类需要实现 init() 方法来定义具体的图表绘制逻辑。
 *
 * @example
 * class MySeries extends jmSeries {
 *   init() {
 *     const { points } = this.initDataPoint();
 *     // 绘制图形...
 *   }
 * }
 */
export declare class jmSeries extends jmPath {
  constructor(options: SeriesOptions & { graph: jmChart });

  option: SeriesOptions & { graph: jmChart };
  field: string | string[];
  index: number;
  legendLabel: string;
  shapes: jmList<jmControl>;
  keyPoints: any[];
  labels: any[];
  baseYHeight: number;
  baseY: number;
  baseYValue: number;
  xAxis: jmAxis;
  yAxis: jmAxis;
  data: any[];
  enableAnimate: boolean;
  dataPoints: DataPoint[];
  curve?: boolean;
  chartInfo?: { xAxis: jmAxis; yAxis: jmAxis };
  barWidth?: number;
  barTotalWidth?: number;
  barIndex?: number;
  pointsLen?: number;
  lastPoints?: DataPoint[];

  /** 初始化数据点，支持动画效果 */
  initDataPoint(...args: any[]): { points: DataPoint[]; dataChanged: boolean };
  /** 根据 X 轴坐标获取最近的数据点 */
  getDataPointByX(x: number): DataPoint | null;
  /** 根据 X 轴值获取数据点 */
  getDataPointByXValue(xValue: any): DataPoint | null;
  /** 重置系列，清除所有形状，重新初始化轴和图例 */
  reset(): { xAxis: jmAxis; yAxis: jmAxis };
  /** 初始化坐标轴的值范围 */
  initAxisValue(): void;
  /** 根据数据源创建数据点，计算屏幕坐标 */
  createPoints(data?: any[]): DataPoint[];
  /** 获取颜色 */
  getColor(p?: DataPoint): string;
  /** 生成图例 */
  createLegend(): jmControl;
  /** 生成数据项标签 */
  createItemLabel(point: DataPoint, position?: string): void;
  /** 子类可重写的数据项创建方法 */
  createPointItem?(p: DataPoint): jmControl;
  /** 初始化图表绘制，子类必须实现 */
  init?(): void;
  /** 添加形状到图表 */
  addShape(shape: jmControl): jmControl;
}

/**
 * 柱图系列
 *
 * @example
 * chart.createSeries('bar', {
 *   field: 'value',
 *   xField: 'name',
 *   style: { perWidth: 0.5 }
 * });
 */
export declare class jmBarSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  barIndex: number;
  barWidth: number;
  barTotalWidth: number;

  init(): void;
  /** 计算柱子宽度 */
  initWidth(count: number): void;
  addShape(shape: jmControl): jmControl;
}

/**
 * 堆叠柱状图系列
 *
 * 数据格式：field 为数组，如 ['value1', 'value2', 'value3']
 * 支持正负值堆叠，正值向上，负值向下。
 *
 * @example
 * chart.createSeries('stackBar', {
 *   field: ['sales', 'profit'],
 *   xField: 'month',
 *   style: { color: ({index}) => chart.getColor(index) }
 * });
 */
export declare class jmStackBarSeries extends jmBarSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  init(): void;
  /** 计算所有字段的累加值作为轴范围 */
  initAxisValue(): void;
}

/**
 * 线图系列
 *
 * @example
 * chart.createSeries('line', {
 *   field: 'value',
 *   xField: 'name',
 *   style: { curve: true, showItem: true }
 * });
 */
export declare class jmLineSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  curve?: boolean;

  init(): void;
  /** 创建平滑曲线路径点 */
  createCurePoints(shapePoints: Point[], p: DataPoint): Point[];
}

/**
 * 堆叠线图系列（已废弃）
 *
 * @deprecated 请使用 jmRangeSeries（范围图）代替
 */
export declare class jmStackLineSeries extends jmRangeSeries;

/**
 * 面积图系列
 *
 * 继承自折线图，默认启用区域填充。
 *
 * @example
 * chart.createSeries('area', {
 *   field: 'value',
 *   xField: 'name',
 *   style: { curve: true }
 * });
 */
export declare class jmAreaSeries extends jmLineSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  createLegend(): jmControl;
}

/**
 * 饼图系列
 *
 * @example
 * chart.createSeries('pie', {
 *   field: 'value',
 *   xField: 'name',
 *   style: { isHollow: false, marginAngle: 0.1 }
 * });
 */
export declare class jmPieSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  totalValue: number;
  startAngle: number | ((data: any[]) => number);

  init(): void;
  createPoints(center?: Point, radius?: number): DataPoint[];
  createLabel(point: DataPoint): jmControl;
  createLegend(): void;
}

/**
 * 雷达图系列
 *
 * 数据格式：field 为多维字段数组，如 ['语文', '数学', '英语', '物理', '化学']
 *
 * @example
 * chart.createSeries('radar', {
 *   fields: ['语文', '数学', '英语', '物理', '化学'],
 *   style: { lineWidth: 2, fill: 'rgba(0,0,0,0.2)' }
 * });
 */
export declare class jmRadarSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  axises: jmAxis[];
  center: Point;
  radius: number;

  createAxises(center: Point, radius: number): jmAxis[];
  initAxisValue(): void;
  init(): void;
  createPoints(center?: Point, radius?: number): DataPoint[];
  createLabel(point: DataPoint): void;
  createLegend(point?: DataPoint): void;
}

/**
 * 范围图系列
 *
 * 继承自折线图，显示数据的上下限范围。
 * 数据格式：field 为数组，如 ['min', 'max']
 *
 * @example
 * chart.createSeries('range', {
 *   fields: ['min', 'max'],
 *   xField: 'date',
 *   style: { curve: true }
 * });
 */
export declare class jmRangeSeries extends jmLineSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  points?: any[];

  init(): void;
  createLegend(): jmControl;
}

/**
 * K线图（蜡烛图）系列
 *
 * 数据格式：field 为数组，如 ['open', 'close', 'high', 'low']
 *
 * @example
 * chart.createSeries('candlestick', {
 *   field: ['open', 'close', 'high', 'low'],
 *   xField: 'date',
 *   style: { masculineColor: 'red', negativeColor: 'green' }
 * });
 */
export declare class jmCandlestickSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  init(): void;
  /** 计算 K 线宽度 */
  initWidth(count: number): void;
}

/**
 * 散点图系列
 *
 * @example
 * chart.createSeries('scatter', {
 *   field: 'y',
 *   xField: 'x',
 *   style: { radius: 5 }
 * });
 */
export declare class jmScatterSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  init(): void;
  createPointItem(p: DataPoint): jmControl;
  createLegend(): void;
}

/**
 * 气泡图系列
 *
 * @example
 * chart.createSeries('bubble', {
 *   field: 'y',
 *   xField: 'x',
 *   style: { radius: 5, radiusScale: 1, opacity: 0.6 }
 * });
 */
export declare class jmBubbleSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  init(): void;
  createBubbleItem(p: DataPoint): jmControl;
  createLegend(): void;
}

/**
 * 热力图系列
 *
 * @example
 * chart.createSeries('heatmap', {
 *   field: 'value',
 *   xField: 'x',
 *   style: { cellWidth: 20, cellHeight: 20 }
 * });
 */
export declare class jmHeatmapSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  minValue: number;
  maxValue: number;

  init(): void;
  createHeatmapCell(p: DataPoint, minValue: number, maxValue: number): jmControl;
  getHeatmapColor(value: number, minValue: number, maxValue: number): string;
  createLegend(): void;
}

/**
 * 仪表盘系列
 *
 * @example
 * chart.createSeries('gauge', {
 *   field: 'value',
 *   style: { min: 0, max: 100, startAngle: -150, endAngle: 150 }
 * });
 */
export declare class jmGaugeSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  init(): void;
  createGaugeBackground(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number): void;
  createGaugeTicks(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, min: number, max: number): void;
  createGaugePointer(centerX: number, centerY: number, radius: number, angle: number): void;
  createGaugeCenter(centerX: number, centerY: number, radius: number): void;
  createGaugeValueLabel(centerX: number, centerY: number, radius: number, value: number): void;
  createLegend(): void;
}

/**
 * 瀑布图系列
 *
 * @example
 * chart.createSeries('waterfall', {
 *   field: 'value',
 *   xField: 'name',
 *   style: { increaseColor: '#52c41a', decreaseColor: '#f5222d' }
 * });
 */
export declare class jmWaterfallSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  pointsLen?: number;

  init(): void;
  createWaterfallBar(p: DataPoint, startY: number, endY: number, height: number, color: string): void;
  createConnectorLine(currentPoint: DataPoint, nextPoint: DataPoint, chartHeight: number, minY: number, ystep: number): void;
  createLegend(): void;
}

/**
 * 漏斗图系列
 *
 * @example
 * chart.createSeries('funnel', {
 *   field: 'value',
 *   xField: 'name',
 *   style: { align: 'center', gap: 2 }
 * });
 */
export declare class jmFunnelSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  init(): void;
  createFunnelLabel(item: any, leftX: number, rightX: number, y: number, height: number, index: number, field: string, xField: string): void;
  getColor(item: any, index: number): string;
  createLegend(): void;
}

/**
 * 环形进度图系列
 *
 * @example
 * chart.createSeries('ringProgress', {
 *   field: 'value',
 *   style: { lineWidth: 20, max: 100, startAngle: -90 }
 * });
 */
export declare class jmRingProgressSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  placedWords?: Array<{ x: number; y: number; width: number; height: number }>;

  init(): void;
  createRingBackground(centerX: number, centerY: number, radius: number, lineWidth: number, index: number): void;
  createRingProgress(centerX: number, centerY: number, radius: number, lineWidth: number, startAngle: number, ratio: number, index: number): void;
  createRingLabel(centerX: number, centerY: number, radius: number, value: number, maxValue: number, index: number, item: any): void;
  getColor(point: DataPoint | null, index: number): string;
  createLegend(): void;
}

/**
 * 箱线图系列
 *
 * 数据格式：field 为数组，如 ['min', 'q1', 'median', 'q3', 'max']
 *
 * @example
 * chart.createSeries('boxPlot', {
 *   field: ['min', 'q1', 'median', 'q3', 'max'],
 *   xField: 'category'
 * });
 */
export declare class jmBoxPlotSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  init(): void;
  createBox(leftX: number, rightX: number, q1Y: number, q3Y: number, color: string): void;
  createMedianLine(leftX: number, rightX: number, medianY: number, color: string): void;
  createWhisker(centerX: number, minY: number, q1Y: number, maxY: number, q3Y: number, color: string, whiskerWidth: number): void;
  createBoxLabel(item: any, centerX: number, medianY: number, xField: string): void;
  getColor(item: any, index: number): string;
  createLegend(): void;
}

/**
 * 词云图系列
 *
 * 数据格式：field 为权重字段，xField 为词语字段
 *
 * @example
 * chart.createSeries('wordCloud', {
 *   field: 'weight',
 *   xField: 'word',
 *   style: { minFontSize: 12, maxFontSize: 60, spiral: true }
 * });
 */
export declare class jmWordCloudSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });

  placedWords: Array<{ x: number; y: number; width: number; height: number }>;

  init(): void;
  findPosition(centerX: number, centerY: number, text: string, fontSize: number, chartWidth: number, chartHeight: number): { x: number; y: number; width: number; height: number } | null;
  findSpiralPosition(centerX: number, centerY: number, width: number, height: number, chartWidth: number, chartHeight: number): { x: number; y: number; width: number; height: number } | null;
  findGridPosition(centerX: number, centerY: number, width: number, height: number, chartWidth: number, chartHeight: number): { x: number; y: number; width: number; height: number } | null;
  canPlace(x: number, y: number, width: number, height: number, chartWidth: number, chartHeight: number): boolean;
  createWordLabel(text: string, x: number, y: number, fontSize: number, color: string, item: any): void;
  getColor(item: any, index: number): string;
  createLegend(): void;
}

/**
 * Vue 组件选项
 */
export interface VChartOptions {
  chartData?: any[];
  chartOptions?: jmChartOptions;
  chartSeries?: Array<SeriesOptions & { type: SeriesType }>;
  width?: string | number;
  height?: string | number;
}

/**
 * Vue 图表组件
 */
export declare const vChart: {
  props: {
    chartData: ArrayConstructor;
    chartOptions: ObjectConstructor;
    chartSeries: ArrayConstructor;
    width: { type: StringConstructor; default: string };
    height: { type: StringConstructor; default: string };
  };
  data: () => { option: jmChartOptions };
  chartInstance: jmChart | null;
  mounted: () => void;
  updated: () => void;
  destroyed: () => void;
  watch: Record<string, { handler: (...args: any[]) => void; deep?: boolean }>;
  methods: {
    initChart(): void;
    refresh(): void;
  };
  template: string;
};

/**
 * jmChart 图表主类
 *
 * @example
 * import jmChart from 'jmchart';
 *
 * const chart = new jmChart(document.getElementById('container'), {
 *   width: 800,
 *   height: 400,
 *   enableAnimate: true
 * });
 *
 * chart.data = [
 *   { name: '一月', value: 100 },
 *   { name: '二月', value: 200 }
 * ];
 *
 * chart.createSeries('line', { field: 'value', xField: 'name' });
 * chart.refresh();
 */
export declare class jmChart extends jmGraph {
  constructor(container: HTMLElement | string, options?: jmChartOptions);

  data: any[];
  series: jmList<jmSeries>;
  enableAnimate: boolean;
  baseY: number;
  option: jmChartOptions & Record<string, any>;
  xField: string;
  chartArea: jmControl;
  legend: jmLegend;
  xAxis: jmAxis;
  yAxises: Record<number, jmAxis>;
  touchGraph?: jmGraph;
  markLine: jmMarkLineManager;
  style: jmChartStyle;
  barSeriesCount: number;
  serieTypes: Record<string, new (...args: any[]) => jmSeries>;

  /** 初始化图表 */
  init(options: jmChartOptions): void;
  /** 重置图表，清除所有系列和轴 */
  reset(): void;
  /** 获取配色数组中的颜色 */
  getColor(index: number): string;
  /** 绘制图表前的前置处理 */
  beginDraw(): void;
  /** 重置画图区域位置 */
  resetAreaPosition(): void;
  /** 创建轴 */
  createAxis(options: AxisOptions): jmAxis;
  /** 创建 X 轴 */
  createXAxis(options?: AxisOptions): jmAxis;
  /** 创建 Y 轴 */
  createYAxis(options?: AxisOptions): jmAxis;
  /** 创建图表系列 */
  createSeries(type: SeriesType | (new (...args: any[]) => jmSeries), options?: SeriesOptions): jmSeries;
  /** 销毁图表 */
  destroy(): void;
}

export default jmChart;
