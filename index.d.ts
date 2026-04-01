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
    fill?: string;
    font?: string;
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
  [key: string]: any;
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
  line?: jmStyle;
  stackLine?: jmStyle;
  range?: jmStyle;
  bar?: jmStyle;
  pie?: jmStyle;
  radar?: jmStyle;
  candlestick?: jmStyle;
  scatter?: jmStyle;
  bubble?: jmStyle;
  heatmap?: jmStyle;
  gauge?: jmStyle;
  area?: jmStyle;
  waterfall?: jmStyle;
  funnel?: jmStyle;
  ringProgress?: jmStyle;
  boxPlot?: jmStyle;
  wordCloud?: jmStyle;
}

/**
 * 轴类
 */
export declare class jmAxis extends jmControl {
  constructor(options?: AxisOptions);

  field: string;
  dataType: 'number' | 'date' | 'string';
  min(): number;
  max(value?: number): number;
  step(): number;
  labelStart: number;
  clear(): void;
  reset(): void;
  init(options?: AxisOptions): void;
}

/**
 * 图例类
 */
export declare class jmLegend extends jmControl {
  constructor(options?: { style?: jmStyle });

  init(): void;
  reset(): void;
  append(series: jmSeries, shape: jmControl): void;
}

/**
 * 标线管理器
 */
export declare class jmMarkLineManager {
  constructor(chart: jmChart);
}

/**
 * 图表系列基类
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

  initDataPoint(...args: any[]): { points: DataPoint[]; dataChanged: boolean };
  getDataPointByX(x: number): DataPoint | null;
  getDataPointByXValue(xValue: any): DataPoint | null;
  reset(): { xAxis: jmAxis; yAxis: jmAxis };
  initAxisValue(): void;
  createPoints(data?: any[]): DataPoint[];
  getColor(p?: DataPoint): string;
  createLegend(): jmControl;
  createItemLabel(point: DataPoint, position?: string): void;
  createPointItem(p: DataPoint): jmControl;
  init?(): void;
  addShape(shape: jmControl): jmControl;
}

/**
 * 柱图系列
 */
export declare class jmBarSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
  barIndex: number;
  barWidth: number;
  barTotalWidth: number;
  init(): void;
  initWidth(len: number): void;
}

/**
 * 堆叠柱图系列
 */
export declare class jmStackBarSeries extends jmBarSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 线图系列
 */
export declare class jmLineSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
  init(): void;
  createCurePoints(shapePoints: Point[], p: DataPoint): Point[];
}

/**
 * 堆叠线图系列
 */
export declare class jmStackLineSeries extends jmLineSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 面积图系列
 */
export declare class jmAreaSeries extends jmLineSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
  createLegend(): void;
}

/**
 * 饼图系列
 */
export declare class jmPieSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
  totalValue: number;
  init(): void;
}

/**
 * 雷达图系列
 */
export declare class jmRadarSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 范围图系列
 */
export declare class jmRangeSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * K线图系列
 */
export declare class jmCandlestickSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 散点图系列
 */
export declare class jmScatterSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 气泡图系列
 */
export declare class jmBubbleSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 热力图系列
 */
export declare class jmHeatmapSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 仪表盘系列
 */
export declare class jmGaugeSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 瀑布图系列
 */
export declare class jmWaterfallSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 漏斗图系列
 */
export declare class jmFunnelSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 环形进度图系列
 */
export declare class jmRingProgressSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 箱线图系列
 */
export declare class jmBoxPlotSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
}

/**
 * 词云图系列
 */
export declare class jmWordCloudSeries extends jmSeries {
  constructor(options: SeriesOptions & { graph: jmChart });
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

  init(options: jmChartOptions): void;
  reset(): void;
  getColor(index: number): string;
  beginDraw(): void;
  resetAreaPosition(): void;
  createAxis(options: AxisOptions): jmAxis;
  createXAxis(options?: AxisOptions): jmAxis;
  createYAxis(options?: AxisOptions): jmAxis;
  createSeries(type: SeriesType | (new (...args: any[]) => jmSeries), options?: SeriesOptions): jmSeries;
  destroy(): void;
}

export default jmChart;
