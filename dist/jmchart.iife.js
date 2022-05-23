(function (exports, jmgraph) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
   * 基础样式
   *
   * @class jmChartStyle
   * @module jmChart
   * @static
   */
  var defaultStyle = {
    layout: 'normal',
    // inside 二边不对齐Y轴，内缩一个刻度 | normal
    margin: {
      left: 40,
      top: 20,
      right: 20,
      bottom: 40
    },
    itemLabel: {
      textAlign: 'left',
      textBaseline: 'middle',
      font: '12px Arial',
      fill: '#000'
    },
    // 跟随标线
    markLine: {
      x: true,
      // 显示X标线
      y: true,
      // 显示Y标线
      stroke: '#EB792A',
      fill: '#CCC',
      lineWidth: 1,
      radius: 5,
      // 中间小圆圈大小
      zIndex: 20
    },
    legend: {
      stroke: 'transparent',
      lineWidth: 0,
      margin: {
        left: 10,
        top: 10,
        right: 20,
        bottom: 10
      },
      width: 200,
      height: 0,
      item: {
        shape: {
          width: 20,
          height: 15
        },
        label: {
          textAlign: 'left',
          textBaseline: 'middle',
          font: '12px Arial',
          fill: '#000'
        },
        normal: {
          fill: 'transparent',
          cursor: 'default'
        },
        hover: {
          fill: '#ccc',
          cursor: 'pointer'
        }
      }
    },
    chartArea: {
      stroke: 'rgb(229,229,229)',
      zIndex: 5
    },
    axis: {
      stroke: '#05468E',
      lineWidth: 1,
      zIndex: 1,
      // 显示网格
      grid: {
        x: true,
        // 是否显示网格
        y: false,
        stroke: 'rgb(229,229,229)',
        lineType: 'dotted',
        // 虚线，不填为实线
        dashLength: 6,
        //虚线条间隔，默认5
        lineWidth: 1,
        zIndex: 0
      },
      // 如果标签居中 center，则把二头的标签左边的左对齐，右边的右对齐
      align: 'normal',
      xLabel: {
        count: 5,
        length: 5,
        fill: '#000',
        stroke: '#000',
        margin: {
          left: 0,
          top: 10,
          right: 6,
          bottom: 0
        },
        textAlign: 'center',
        textBaseline: 'top',
        font: '12px Arial',
        zIndex: 20,
        // 旋转角度
        rotation: {
          angle: 0,
          point: {
            x: 0,
            y: 0
          }
        }
      },
      yLabel: {
        count: 5,
        length: 1,
        fill: '#000',
        margin: {
          left: 2,
          top: 6,
          right: 8,
          bottom: 0
        },
        textAlign: 'right',
        textBaseline: 'middle',
        font: '12px Arial',
        zIndex: 20,
        // 旋转角度
        rotation: {
          angle: 0,
          point: {
            x: 0,
            y: 0
          }
        }
      }
    },
    // 图形样式集
    chartColors: ['#249FDA', '#EA3B7C', '#8EBC00', '#309B46', '#4B507E', '#D8E404', '#EB792A', '#A00DA0'],

    /*tooltip: {
    	'background-color': 'rgb(255,255,255)',
    	'padding':'4px',
    	'opacity':'0.8',
    	'border':'1px solid #000',
    	'box-shadow': '0 0 3px #000',
    	'border-radius': '6px'
    },*/
    line: {
      normal: {
        lineWidth: 1,
        zIndex: 18,
        cursor: 'default'
      },
      hover: {
        lineWidth: 4,
        //zIndex: 100,
        cursor: 'pointer'
      },
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default',
      radius: 3,
      fill: null,
      showItem: false,
      // 是否展示圆点
      item: {
        fill: '#fff',
        zIndex: 19
      },
      // 默认不填充，需要填满请配置{fill:'',stroke:''}
      area: false
    },
    stackLine: {
      normal: {
        lineWidth: 1,
        zIndex: 18,
        cursor: 'default'
      },
      hover: {
        lineWidth: 4,
        //zIndex: 100,
        cursor: 'pointer'
      },
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default',
      radius: 3,
      fill: null,
      showItem: true,
      // 是否展示圆点
      item: {
        fill: '#fff',
        zIndex: 19
      },
      // 默认不填充，需要填满请配置{fill:'',stroke:''}
      area: false
    },
    bar: {
      normal: {
        lineWidth: 1,
        zIndex: 17,
        cursor: 'default',
        opacity: 0.8
      },
      hover: {
        lineWidth: 4,
        //zIndex: 100,
        opacity: 1,
        cursor: 'pointer'
      },
      lineWidth: 1,
      // 柱子宽占比，决定了柱子相对于总宽度
      perWidth: 0.5,
      zIndex: 17,
      cursor: 'default',
      close: true,
      opacity: 0.8,
      shadow: {
        x: 1,
        y: 1,
        blur: 2,
        color: '#000'
      }
    },
    pie: {
      normal: {
        zIndex: 11,
        cursor: 'default',
        opacity: 0.8
      },
      hover: {
        //zIndex: 100,
        opacity: 1,
        cursor: 'pointer'
      },
      margin: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10
      },
      lineWidth: 1,
      zIndex: 11,
      cursor: 'default',
      close: true,
      opacity: 0.8,
      shadow: {
        x: 1,
        y: 1,
        blur: 2,
        color: '#ccc'
      }
    },
    candlestick: {
      normal: {
        lineWidth: 1,
        zIndex: 18,
        cursor: 'default'
      },
      hover: {
        //zIndex: 100,
        cursor: 'pointer'
      },
      perWidth: 0.5,
      // 阴线颜色
      negativeColor: 'green',
      // 阳线颜色
      masculineColor: 'red',
      lineWidth: 1
    }
  };

  /**
   * 轴
   *
   * @class jmAxis
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {string} [type] 轴类型(x/y/radar),默认为x
   * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
   * @param {object} [style] 样式
   */

  class jmAxis extends jmgraph.jmArrowLine {
    constructor(options) {
      super(options); //初始化不显示箭头

      _defineProperty(this, "type", 'x');

      _defineProperty(this, "field", '');

      _defineProperty(this, "labelStart", 0);

      _defineProperty(this, "zeroBase", false);

      _defineProperty(this, "labelCount", 1);

      _defineProperty(this, "scalePoints", []);

      this.arrowVisible = !!options.arrowVisible;
      this.zeroBase = options.zeroBase || false;
      this.labelCount = options.labelCount || 5;
      this.type = options.type || 'x'; // 为横轴x或纵轴y

      if (this.type == 'x') {
        this.dataType = options.dataType || 'string';
      } else {
        this.dataType = options.dataType || 'number';
      }

      this.field = options.field || '';
      this.index = options.index || 0;
      this.init(options);
    } // 初始化一些参数
    // 这个函数可能会重入。


    init(options) {
      options = options || {}; // 深度组件默认样式

      if (options.style) this.graph.utils.clone(options.style, this.style, true);

      if (this.type == 'x') {
        if (typeof options.maxXValue !== 'undefined') this.maxValue = options.maxXValue; // 最大的值，如果指定了，则如果有数值比它大才会修改上限，否则以它为上限

        if (typeof options.minXValue !== 'undefined') this.minValue = options.minXValue; // 最小值，如果指定了，则轴的最小值为它或更小的值
      } else {
        if (typeof options.maxYValue !== 'undefined' && (options.maxYValue > this.maxValue || typeof this.maxValue === 'undefined')) this.maxValue = options.maxYValue; // 最大的值，如果指定了，则如果有数值比它大才会修改上限，否则以它为上限

        if (typeof options.minYValue !== 'undefined' && (options.minYValue < this.minValue || typeof this.minValue === 'undefined')) this.minValue = options.minYValue; // 最小值，如果指定了，则轴的最小值为它或更小的值
      }
    }
    /**
     * 轴类型(x/y/radar),默认为x
     *
     * @property type
     * @type string
     */


    /**
     * 关联访问的是chart的数据源
     */
    get data() {
      return this.graph.data;
    }

    set data(d) {
      this.graph.data = d;
    }
    /**
     * 计算当前轴的位置
     * 
     * @method reset
     */


    reset() {
      const bounds = this.graph.chartArea.getBounds(); // 获取画图区域

      switch (this.type) {
        case 'x':
          {
            //初始化显示标签个数
            this.labelCount = this.style.xLabel.count || 5;
            this.start.x = bounds.left;
            this.start.y = bounds.bottom;
            this.end.x = bounds.right;
            this.end.y = bounds.bottom; // zeroBase 时才需要移到0位置，否则依然为沉底

            if (this.graph.baseY === 0) {
              const yAxis = this.graph.yAxises[1];
              if (!yAxis) return;
              this.value = 0;
              const y = this.start.y + yAxis.min() * yAxis.step();
              this.start.y = this.end.y = y;
            }

            break;
          }

        case 'y':
          {
            const index = this.index || 1;
            let xoffset = bounds.left; //初始化显示标签个数

            this.labelCount = this.style.yLabel.count || 5; //多Y轴时，第二个为右边第一轴，其它的依此递推

            if (index == 2) {
              xoffset = bounds.right;
            } else if (index > 2) {
              xoffset = this.graph.yAxises[index - 1].start.x + this.graph.yAxises[index - 1].width + 10;
            }

            this.start.x = xoffset;
            this.start.y = bounds.bottom;
            this.end.x = this.start.x;
            this.end.y = bounds.top;
            break;
          }
      }

      this.createLabel();
    } // 绘制完成后，生成label标签


    draw() {
      this.points.push(...this.scalePoints); // 把刻度也画出来

      super.draw();
    }
    /**
     * 生成轴标签
     *
     * @method createLabel
     */


    createLabel() {
      //移除原有的标签 
      this.children.each(function (i, c) {
        c.remove();
      }, true);
      this.labels = []; //如果是？X轴则执行X轴标签生成

      if (this.type == 'x') {
        this.createXLabel();
      } else if (this.type == 'y') {
        this.createYLabel();
      }
    }
    /**
     * 生成X轴标签
     *
     * @method createXLabel
     * @private
     */


    createXLabel() {
      //var max = this.max();
      //var min = this.min();
      const step = this.step();
      this.scalePoints = []; // 刻度点集合
      //最多显示标签个数
      //var count = this.style.xLabel.count || this.data.length;	
      //字符串轴。则显示每个标签	

      const format = this.option.format || this.format;
      const top = (this.style.xLabel.margin.top || 0) * this.graph.devicePixelRatio;

      for (let i = 0; i < this.data.length; i++) {
        const d = this.data[i];
        const v = d[this.field]; // 不显示就不生成label。这里性能影响很大

        const text = format.call(this, v, d, i); // 格式化label

        if (!text) continue; /// 只有一条数据，就取这条数据就可以了	

        const w = i * step;
        const label = this.graph.createShape('label', {
          style: this.style.xLabel
        });
        label.data = d; // 当前点的数据结构值

        label.text = text;
        this.labels.push(label);
        this.children.add(label);
        label.width = label.testSize().width + 2;
        label.height = 15;
        const pos = {
          x: this.labelStart + w,
          y: top
        }; // 指定要显示网格

        if (this.style.grid && this.style.grid.y) {
          // 它的坐标是相对于轴的，所以Y轴会用负的区域高度
          const line = this.graph.createShape('line', {
            start: {
              x: pos.x,
              y: 0
            },
            end: {
              x: pos.x,
              y: -this.graph.chartArea.height
            },
            style: this.style.grid
          });
          this.children.add(line);
        } //在轴上画小标记m表示移至当前点开画


        this.scalePoints.push({
          x: pos.x + this.start.x,
          y: this.start.y,
          m: true
        });
        this.scalePoints.push({
          x: pos.x + this.start.x,
          y: this.start.y + (this.style.length || 5)
        }); //如果进行了旋转，则处理位移

        const rotation = label.style.rotation;

        if (rotation && rotation.angle) {
          //设定旋转原点为label左上角					
          rotation.point = pos; //当旋转后，其原点位移至左上角，所有当前控件必须反向移位其父容器位置

          label.position = {
            x: -this.graph.chartArea.position.x,
            y: -this.graph.chartArea.position.y
          };
        } else {
          // 如果标签居中，则把二头的标签左边的左对齐，右边的右对齐
          if (this.style.align === 'center' && this.data.length > 1 && (i === 0 || i === this.data.length - 1)) {
            if (i === this.data.length - 1) {
              pos.x -= label.width;
            }
          } else {
            pos.x -= label.width / 2; //向左偏移半个label宽度
          }

          label.position = pos;
        }
      }
    }
    /**
     * 生成Y轴标签
     *
     * @method createYLabel
     * @private
     */


    createYLabel() {
      const max = this.max();
      const min = this.min();
      const step = this.step();
      const index = this.index || 1;
      this.scalePoints = []; // 刻度点集合

      let count = this.labelCount;
      const mm = max - min;
      /*if(mm <= 10) {
      	count = mm;
      }*/
      // mm 放大10000倍，这里结果也需要除于10000

      let pervalue = mm / count || 1; //if(pervalue > 1 || pervalue < -1) pervalue = Math.floor(pervalue);		

      const format = this.option.format || this.format;
      const marginLeft = this.style.yLabel.margin.left * this.graph.devicePixelRatio || 0;
      const marginRight = this.style.yLabel.margin.right * this.graph.devicePixelRatio || 0;
      let p = 0;

      for (let i = 0; i < count + 1; i++) {
        p = min + pervalue * i;
        if (p > max || i === count) p = max;
        const h = (p - min) * step; // 当前点的偏移高度

        const label = this.graph.graph.createShape('label', {
          style: this.style.yLabel
        });
        label.text = format.call(this, p, label); // 格式化label

        this.labels.push(label);
        this.children.add(label);
        const w = label.testSize().width;
        const offy = this.height - h; // 刻度的偏移量
        // label的位置

        const pos = {
          x: 0,
          y: 0
        }; //轴的宽度

        const axiswidth = marginLeft + marginRight + w;
        this.width = Math.max(axiswidth, this.width); //计算标签位置

        if (index <= 1) {
          pos.x = -w - marginRight;
          pos.y = offy - label.height / 2; //在轴上画小标记m表示移至当前点开画

          this.scalePoints.push({
            x: this.start.x,
            y: offy + this.end.y,
            m: true
          });
          this.scalePoints.push({
            x: this.start.x,
            y: offy + this.end.y
          }); // 指定要显示网格

          if (this.style.grid && this.style.grid.x) {
            // 它的坐标是相对于轴的，所以Y轴会用负的区域高度
            const line = this.graph.createShape('line', {
              start: {
                x: 0,
                y: offy
              },
              end: {
                x: this.graph.chartArea.width,
                y: offy
              },
              style: this.style.grid
            });
            this.children.add(line);
          }
        } else {
          pos.x = marginLeft;
          pos.y = offy - label.height / 2; //在轴上画小标记m表示移至当前点开画

          this.scalePoints.push({
            x: this.start.x,
            y: offy + this.end.y,
            m: true
          });
          this.scalePoints.push({
            x: this.start.x,
            y: offy + this.end.y
          });
        } // label对齐方式


        switch (this.style.yLabel.textAlign) {
          case 'center':
            {
              pos.x = pos.x / 2 - w / 2;
              break;
            }

          case 'right':
            {
              if (index <= 1) pos.x = -axiswidth;else {
                // 轴在最右边时，轴宽减去label宽就是右对齐
                pos.x = axiswidth - w;
              }
              break;
            }
        } //如果进行了旋转，则处理位移


        const rotation = label.style.rotation;

        if (rotation && rotation.angle) {
          label.translate = pos; //先位移再旋转

          label.position = {
            x: -w / 2,
            y: 0
          };
        } else {
          label.position = pos;
        }
      }
    }
    /**
    * 获取当前轴所占宽
    *
    * @method width
    */


    get width() {
      if (this._width) {
        return this._width;
      }

      return Math.abs(this.end.x - this.start.x);
    }

    set width(w) {
      this._width = w;
    }
    /**
    * 获取当前轴所占高
    *
    * @method height
    */


    get height() {
      return Math.abs(this.end.y - this.start.y);
    } // 这里设置高度没意义


    set height(h) {}
    /**
    * 获取或设置当前轴最大值
    *
    * @method max
    * @param {number/date/string} 当前轴的最大值
    * @return 当前轴的最大值
    */


    max(m) {
      if (typeof m !== 'undefined') {
        //如果为0为基线，则最小值不能大于0
        if (this.dataType == 'number' && m < 0 && this.zeroBase) {
          m = 0;
        }

        this._max = this._max != null && typeof this._max != 'undefined' ? Math.max(m, this._max) : m; // 如果有指定默认最大值，则不超过它就采用它

        if (typeof this.maxValue != 'undefined') this._max = Math.max(this.maxValue, this._max);
      } //如果为字符串，则返回分类个数


      if (this.dataType == 'string' && this.data) {
        return this.data.length;
      } //如果是数字类型，则在最大值基础上加一定的值


      if (this.dataType == 'number') {
        m = this._max; // 如果有指定默认最大值，则不超过它就采用它

        if (typeof this.maxValue != 'undefined' && m <= this.maxValue) {
          return this.maxValue;
        }

        if (m <= 0) {
          if (m >= -10) m = 0;else m = -10;
        } else if (m > 500) {
          m = Math.ceil(m / 100);
          m = m * 100 + 100;
        } else if (m > 100) {
          m = Math.ceil(m / 50);
          m = m * 50 + 50;
        } else if (m > 10) {
          m = Math.ceil(m / 10);
          m = m * 10 + 10;
        } else {
          m = Math.ceil(m);
        }

        return m;
      }

      return this._max;
    }
    /**
    * 获取或设置当前轴最小值
    *
    * @method max
    * @param {number/date/string} 当前轴的最小值
    * @return 当前轴的最小值
    */


    min(m) {
      if (typeof m !== 'undefined') {
        //如果为0为基线，则最小值不能大于0
        if (this.dataType == 'number' && m > 0 && this.zeroBase) {
          m = 0;
        }

        this._min = this._min != null && typeof this._min != 'undefined' ? Math.min(m, this._min) : m; // 如果有指定默认最小值，则不小于它就采用它

        if (typeof this.minValue != 'undefined') this._min = Math.min(this.minValue, this._min);
      } //如果是数字类型，则在最小值基础上减去一定的值


      if (this.dataType == 'number') {
        m = this._min; // 如果有指定默认最小值，则不小于它就采用它

        if (typeof this.minValue != 'undefined') {
          return typeof m !== 'undefined' ? Math.min(this.minValue, m) : this.minValue;
        }

        if (m >= 0) {
          if (m <= 10) m = 0;else {
            m = Math.floor(m / 10) * 10 - 10;
          }
        } else if (m < -500) {
          m = Math.floor(m / 100);
          m = m * 100 - 100;
        } else if (m < -100) {
          m = Math.floor(m / 50);
          m = m * 50 - 50;
        } else if (m < -10) {
          m = Math.floor(m / 10);
          m = m * 10 - 10;
        } else {
          m = Math.floor(m);
        }

        return m;
      } //如果为字符串则返回0


      return this.dataType == 'string' ? 0 : this._min;
    }
    /**
     * 清除一些属性
     *
     * @method clear
     */


    clear() {
      this._min = null;
      this._max = null;
    }
    /**
     * 计算当前轴的单位偏移量
     *
     * @method step
     * @return {number} 单位偏移量
     */


    step() {
      if (this.type == 'x') {
        const w = this.width; //如果排版为内联，则单位占宽减少一个单位,
        //也就是起始位从一个单位开始

        if (this.graph.style.layout == 'inside') {
          const sp = w / this.max();
          this.labelStart = sp / 2;
          return sp;
        } else {
          this.labelStart = 0;
        }

        let tmp = this.max() - 1;
        if (tmp === 0) tmp = 2; // 只有一个数据的情况，就直接居中

        return w / tmp;
      } else if (this.type == 'y') {
        const h = this.height;

        switch (this.dataType) {
          case 'string':
            {
              return h / this.max();
            }

          case 'date':
          case 'number':
          default:
            {
              let tmp = Math.abs(this.max() - this.min());
              tmp = tmp || 1;
              return h / tmp;
            }
        }
      }
    } // 格式化标签值


    format(v, item) {
      return v + '';
    }

  }

  /**
   * 图例的容器
   *
   * @class jmLegend
   * @module jmChart
   * @param {jmChart} chart 当前图表
   */

  class jmLegend extends jmgraph.jmRect {
    constructor(options) {
      //当前图例位置偏移量
      options.position = options.position || {
        x: 0,
        y: 0
      };
      super(options);

      _defineProperty(this, "legendPosition", '');
    }
    /**
     * 图例放置位置
     */


  }
  /**
   * 添加图例
   *
   * @method append
   * @param {jmSeries} series 当前图序列
   * @param {jmControl} shape 当前图例的图形对象
   */

  jmLegend.prototype.append = function (series, shape, options = {}) {
    // 如果不显示图例，就不处理
    if (this.visible === false) return;
    const panel = this.graph.createShape('rect', {
      style: this.graph.utils.clone(this.style.item),
      position: {
        x: 0,
        y: 0
      }
    });
    this.children.add(panel);
    panel.children.add(shape);
    shape.width = panel.style.shape.width;
    shape.height = panel.style.shape.height;
    let name = options.name || series.legendLabel;
    name = series.option.legendFormat ? series.option.legendFormat.call(series, options) : name;

    if (name) {
      //生成图例名称
      const label = this.graph.createShape('label', {
        style: panel.style.label,
        text: name || ''
      });
      label.height = shape.height;
      label.position = {
        x: shape.width + 4,
        y: 0
      };
      panel.children.add(label);
      panel.width = shape.width + label.testSize().width;
    } else {
      panel.width = shape.width;
    }

    panel.height = shape.height; //执行进入事件
    //触动图例后加粗显示图

    /*const hover = options.hover || function() {	
    	//应用图的动态样式		
    	//Object.assign(series.style, series.style.hover);
    
    	//Object.assign(this.style, this.style.hover || {});
    
    	//series.graph.refresh();
    };
    panel.bind('mouseover', hover);
    //执行离开
    const leave = options.leave || function() {	
    	//应用图的普通样式		
    	//Object.assign(series.style, series.style.normal);
    
    	//Object.assign(this.style, this.style.normal || {});
    	//jmUtils.apply(this.series.style.normal,this.series.style);
    	//series.graph.refresh();
    };
    panel.bind('mouseleave', leave);*/

    const legendPosition = this.legendPosition || this.style.legendPosition || 'right';

    if (legendPosition == 'top' || legendPosition == 'bottom') {
      //顶部和底部图例横排，每次右移位一个单位图例
      panel.position.x = this.width + 15 * this.graph.devicePixelRatio;
      this.width = panel.position.x + panel.width; // 把容器宽指定为所有图例宽和

      this.height = Math.max(panel.height, this.height);
    } else {
      //右边和左边图例竖排
      panel.position.y += this.height + 5 * this.graph.devicePixelRatio;
      this.height = panel.position.y + panel.height;
      this.width = Math.max(panel.width, this.width);
    }

    this.needUpdate = true;
  };
  /**
   * 初始化图例
   *
   * @method init
   */


  jmLegend.prototype.init = function () {
    this.position.x = 0;
    this.position.y = 0;
    this.width = 0;
    this.height = 0;
    this.style.lineWidth = 0;
    this.children.clear();
  };
  /**
   * 重置图例属性,根据图例内容计算期大小并更新画图区域大小
   *
   * @method reset
   */


  jmLegend.prototype.reset = function () {
    if (this.visible !== false) {
      this.position.x = this.graph.chartArea.position.x;
      this.position.y = this.graph.chartArea.position.y;
      var legendPosition = this.legendPosition || this.style.legendPosition;

      switch (legendPosition) {
        case 'left':
          {
            this.graph.chartArea.width = this.graph.chartArea.width - this.width; //画图区域向右偏移

            this.graph.chartArea.position.x = this.position.x + this.width + this.style.margin.right * this.graph.devicePixelRatio;
            break;
          }

        case 'top':
          {
            this.graph.chartArea.height = this.graph.chartArea.height - this.height;
            this.graph.chartArea.position.y = this.position.y + this.height + this.style.margin.bottom * this.graph.devicePixelRatio;
            break;
          }

        case 'bottom':
          {
            this.graph.chartArea.height = this.graph.chartArea.height - this.height;
            this.position.y = this.graph.chartArea.position.y + this.graph.chartArea.height + this.style.margin.top * this.graph.devicePixelRatio;
            break;
          }

        case 'right':
        default:
          {
            this.graph.chartArea.width = this.graph.chartArea.width - this.width;
            this.position.x = this.graph.chartArea.position.x + this.graph.chartArea.width + this.style.margin.left * this.graph.devicePixelRatio;
            break;
          }
      }
    }
  };

  var utils = {
    /**
     * 对比二个数组数据是否改变
     * @param {Array} source 被对比的数、组
     * @param {Array} target 对比数组
     * @param {Function} compare 比较函数
     */
    arrayIsChange(source, target, compare) {
      if (!source || !target) return true;
      if (source.length !== target.length) return true;

      if (typeof compare === 'function') {
        for (let i = 0; i < source.length; i++) {
          if (!compare(source[i], target[i])) return true;
        }

        return false;
      } else return source == target;
    }

  };

  /**
   * 图形基类
   *
   * @class jmSeries
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {array} mappings 图形字段映射
   * @param {style} style 样式
   */
  //构造线图

  class jmSeries extends jmgraph.jmPath {
    constructor(options) {
      super(options);

      _defineProperty(this, "legendLabel", '');

      _defineProperty(this, "shapes", new jmgraph.jmList());

      _defineProperty(this, "keyPoints", []);

      _defineProperty(this, "labels", []);

      _defineProperty(this, "field", '');

      _defineProperty(this, "baseYHeight", 0);

      _defineProperty(this, "baseY", 0);

      _defineProperty(this, "baseYValue", 0);

      this.option = options;
      this.field = options.field || options.fields || '';
      this.index = options.index || 1;
      this.legendLabel = options.legendLabel || '';
      this.___animateCounter = 0; // 动画计数		

      this.xAxis = this.graph.createXAxis(); // 生成X轴
      // 生成当前Y轴

      this.yAxis = this.yAxis || this.graph.createYAxis({
        index: this.index,
        format: options.yLabelFormat || this.graph.option.yLabelFormat
      }); // 初始化一些参数， 因为这里有多个Y轴的可能，所以每次都需要重调一次init

      this.yAxis.init({
        field: this.field,
        minYValue: options.minYValue,
        maxYValue: options.maxYValue
      });
    }
    /**
     * 关联访问的是chart的数据源
     */


    get data() {
      return this.graph.data;
    }

    set data(d) {
      this.graph.data = d;
    } //是否启用动画效果


    get enableAnimate() {
      if (typeof this.option.enableAnimate !== 'undefined') return !!this.option.enableAnimate;else {
        return this.graph.enableAnimate;
      }
    }

    set enableAnimate(v) {
      this.option.enableAnimate = v;
    }
    /**
     * 图例名称
     *
     * @property legendLabel
     * @type string
     */


    // 做一些基础初始化工作
    initDataPoint(...args) {
      //生成描点位
      // 如果有动画，则需要判断是否改变，不然不需要重新动画
      let dataChanged = false;

      if (this.enableAnimate) {
        // 拷贝一份上次的点集合，用于判断数据是否改变
        this.lastPoints = this.graph.utils.clone(this.dataPoints, null, true, obj => {
          if (obj instanceof jmgraph.jmControl) return obj;
        }); // 重新生成描点

        this.dataPoints = this.createPoints(...args);
        dataChanged = utils.arrayIsChange(this.lastPoints, this.dataPoints, (s, t) => {
          return s.x === t.x && s.y === t.y;
        });
        if (dataChanged) this.___animateCounter = 0; // 数据改变。动画重新开始
      } else {
        this.dataPoints = this.createPoints(...args);
      }

      return {
        dataChanged,
        points: this.dataPoints
      };
    }
    /**
     * 根据X轴坐标，获取它最近的数据描点
     * 离点最近的一个描点
     * @param {number} x  X轴坐标
     */


    getDataPointByX(x) {
      if (!this.dataPoints) return null; // 获取最近的那个

      let prePoint = undefined;
   // 跟上一个点和下一个点的距离，哪个近用哪个

      for (let i = 0; i < this.dataPoints.length; i++) {
        const p = this.dataPoints[i];
        if (p.x == x) return p; // 上一个点

        if (p.x < x) {
          if (i === this.dataPoints.length - 1) return p;
          prePoint = p;
        } // 下一个点


        if (p.x > x) {
          // 没有上一个，只能返回这个了
          if (prePoint && x - prePoint.x < p.x - x) return prePoint;else return p;
        }
      }

      return null;
    }
    /**
     * 根据X轴值获取数据点
     * @param {number} xValue  X轴值
     */


    getDataPointByXValue(xValue) {
      if (!this.dataPoints) return null;

      for (let i = 0; i < this.dataPoints.length; i++) {
        const p = this.dataPoints[i];
        if (p.xValue == xValue) return p;
      }

      return null;
    }
    /**
     * 重置属性
     * 根据数据源计算轴的属性
     *
     * @method reset
     */


    reset() {
      // 重置所有图形
      var shape;

      while (shape = this.shapes.shift()) {
        shape && shape.remove();
      } //生成图例  这里要放到shape清理后面


      this.createLegend();
      this.initAxisValue(); // 处理最大值最小值

      return this.chartInfo = {
        xAxis: this.xAxis,
        yAxis: this.yAxis
      };
    } // 计算最大值和最小值，一般图形直接采用最大最小值即可，有些需要多值叠加


    initAxisValue() {
      // 计算最大最小值
      // 当前需要先更新axis的边界值，轴好画图
      for (var i = 0; i < this.data.length; i++) {
        if (Array.isArray(this.field)) {
          this.field.forEach(f => {
            const v = this.data[i][f];
            this.yAxis.max(v);
            this.yAxis.min(v);
          });
        } else {
          const v = this.data[i][this.field];
          this.yAxis.max(v);
          this.yAxis.min(v);
        }

        const xv = this.data[i][this.xAxis.field];
        this.xAxis.max(xv);
        this.xAxis.min(xv);
      }
    }
    /**
     * 生成序列图描点
     *
     * @method createPoints
     */


    createPoints(data) {
      data = data || this.data;
      if (!data) return;
      const xstep = this.xAxis.step();
      const minY = this.yAxis.min();
      const ystep = this.yAxis.step();
      this.baseYValue = typeof this.graph.baseY === 'undefined' ? minY : this.graph.baseY || 0;
      this.baseYHeight = (this.baseYValue - minY) * ystep; // 基线的高度		

      this.baseY = this.graph.chartArea.height - this.baseYHeight; // Y轴基线的Y坐标
      // 有些图形是有多属性值的

      const fields = Array.isArray(this.field) ? this.field : [this.field];
      this.dataPoints = [];

      for (let i = 0; i < data.length; i++) {
        const s = data[i];
        const xv = s[this.xAxis.field];
        const p = {
          data: s,
          index: i,
          xValue: xv,
          xLabel: xv,
          points: [],
          style: this.graph.utils.clone(this.style)
        }; // 这里的点应相对于chartArea

        p.x = xstep * i + this.xAxis.labelStart;

        for (const f of fields) {
          const yv = s[f];
          p.yLabel = p.yValue = yv; // 高度

          p.height = (yv - this.baseYValue) * ystep;
          const point = {
            x: p.x,
            // 高度
            height: p.height,
            yValue: yv,
            field: f
          }; //如果Y值不存在。则此点无效，不画图

          if (yv == null || typeof yv == 'undefined') {
            point.m = p.m = true;
          } else {
            if (this.yAxis.dataType != 'number') {
              yv = i;
            }

            point.y = p.y = this.baseY - point.height;
          }

          p.points.push(point);
        } // 初始化项


        if (typeof this.option.initItemHandler === 'function') {
          this.option.initItem.call(this, p);
        }

        this.dataPoints.push(p);
      }

      return this.dataPoints;
    } // 生成颜色


    getColor(p) {
      if (typeof this.style.color === 'function') {
        return this.style.color.call(this, p);
      } else {
        return this.style.color;
      }
    }
    /**
     * 生成图例
     *
     * @method createLegend
     */


    createLegend() {
      //生成图例前的图标
      const style = this.graph.utils.clone(this.style);
      style.fill = this.getColor(); //delete style.stroke;

      const shape = this.graph.createShape('rect', {
        style
      });
      this.graph.legend.append(this, shape);
    } // 生成柱图的标注


    createItemLabel(point, position) {
      if (!this.style.label || this.style.label.show !== true) return;
      const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, point) : point.yValue;
      if (!text) return; // v如果指定了为控件，则直接加入

      if (text instanceof jmgraph.jmControl) {
        this.addShape(text);
        return text;
      }

      const style = this.graph.utils.clone(this.graph.style.itemLabel, {
        zIndex: 21,
        ...this.style.label
      });

      if (typeof style.fill === 'function') {
        style.fill = style.fill.call(this, point);
      }

      const barWidth = (this.barTotalWidth || 0) / 2 - (this.barWidth || 0) * (this.barIndex || 0) - (this.barWidth || 0) / 2;
      const baseOffset = point.y - this.baseY;
      const label = this.graph.createShape('label', {
        style,
        text: text,
        data: point,
        position: function () {
          const offh = style.offset || 5;
          const size = this.testSize();
          return {
            x: point.x - size.width / 2 - barWidth,
            y: baseOffset > 0 ? point.y + offh : point.y - size.height - offh
          };
        }
      });
      this.addShape(label);
    }
    /**
     * 在图上加下定制图形
     * @param {jmShape} shape  图形
     */


    addShape(shape) {
      this.graph.chartArea.children.add(shape);
      this.shapes.add(shape);
      return shape;
    }
    /**
     * 获取指定事件的集合
     * 比如mousedown,mouseup等
     *
     * @method getEvent
     * @param {string} name 事件名称
     * @return {list} 事件委托的集合
     */


    getEvent(name) {
      const event = this.option ? this.option[name] : null;

      if (!event) {
        return super.getEvent(name);
      } else {
        const events = new jmgraph.jmList();
        events.add(event);
        const oldevents = super.getEvent(name);

        if (oldevents) {
          events.concat(oldevents);
        }

        return events;
      }
    }

  }

  /**
   * 柱图
   *
   * @class jmBarSeries
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {array} mappings 图形字段映射
   * @param {style} style 样式
   */
  //构造函数

  class jmBarSeries extends jmSeries {
    constructor(options) {
      super(options);
    }
    /**
     * 绘制当前图形
     *
     * @method beginDraw
     * @for jmBarSeries
     */


    init() {
      //生成描点位
      const {
        points,
        dataChanged
      } = this.initDataPoint();
      const len = points.length;
      this.initWidth(len); // 是否正在动画中
      // 如果数据点多于100 个，暂时不启用动画，太慢了

      const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < 100;
      let aniIsEnd = true; // 当次是否结束动画

      const aniCount = this.style.aniCount || 10;

      for (let i = 0; i < len; i++) {
        //const label = this.xAxis.labels[i];
        const point = points[i]; //如果当前点无效，则跳致下一点

        if (typeof point.y === 'undefined' || point.y === null) {
          continue;
        }

        point.style.fill = this.getColor(point);
        const sp = this.addShape(this.graph.createPath(null, point.style)); //绑定提示框
        //this.bindTooltip(sp, point);
        //首先确定p1和p4,因为他们是底脚。会固定

        const p1 = {
          x: point.x - this.barTotalWidth / 2 + this.barWidth * this.barIndex,
          y: this.baseY
        };
        const p4 = {
          x: p1.x + this.barWidth,
          y: p1.y
        };
        const p2 = {
          x: p1.x,
          y: p1.y
        };
        const p3 = {
          x: p4.x,
          y: p1.y
        }; // 如果要动画。则动态改变高度

        if (isRunningAni) {
          const step = point.height / aniCount;
          const offHeight = step * this.___animateCounter; // 动态计算当前高度

          p2.y = p1.y - offHeight; // 计算高度
          // 当次动画完成

          if (step >= 0 && p2.y <= point.y || step < 0 && p2.y >= point.y) {
            p2.y = point.y;
          } else {
            aniIsEnd = false; // 只要有一个没完成，就还没有完成动画
          }

          p3.y = p2.y;
        } else {
          p2.y = point.y;
          p3.y = point.y;
        }

        sp.points.push(p1);
        sp.points.push(p2);
        sp.points.push(p3);
        sp.points.push(p4);
        this.createItemLabel(point); // 生成标点的回调

        this.emit('onPointCreated', point);
      }

      if (aniIsEnd) {
        this.___animateCounter = 0;
      } else {
        this.___animateCounter++; // next tick 再次刷新

        setTimeout(() => {
          this.needUpdate = true; //需要刷新
        });
      }
    } // 计算柱子宽度


    initWidth(count) {
      //计算每个柱子占宽
      //每项柱子占宽除以柱子个数,默认最大宽度为30
      const maxWidth = this.xAxis.width / count / this.graph.barSeriesCount;

      if (this.style.barWidth > 0) {
        this.barWidth = Number(this.style.barWidth);
        this.barTotalWidth = this.barWidth * this.graph.barSeriesCount;
      } else {
        this.barTotalWidth = this.xAxis.width / count * (this.style.perWidth || 0.4);
        this.barWidth = this.barTotalWidth / this.graph.barSeriesCount;
      }

      if (this.barWidth > maxWidth) {
        this.barWidth = maxWidth;
        this.barTotalWidth = maxWidth * this.graph.barSeriesCount;
      }
    }
    /**
     * 在图上加下定制图形
     * @param {jmShape} shape  图形
     */


    addShape(shape) {
      this.children.add(shape);
      this.shapes.add(shape);
      return shape;
    }

  }

  /**
   * 柱图
   *
   * @class jmBarSeries
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {array} mappings 图形字段映射
   * @param {style} style 样式
   */
  //构造函数

  class jmStackBarSeries extends jmBarSeries {
    constructor(options) {
      super(options);
    }
    /**
     * 绘制当前图形
     *
     * @method beginDraw
     * @for jmBarSeries
     */


    init() {
      //生成描点位
      const {
        points,
        dataChanged
      } = this.initDataPoint();
      const len = points.length;
      this.initWidth(len); // 是否正在动画中
      // 如果数据点多于100 个，暂时不启用动画，太慢了

      const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < 100;
      let aniIsEnd = true; // 当次是否结束动画

      const aniCount = this.style.aniCount || 10;

      for (let i = 0; i < len; i++) {
        const point = points[i];
        let topStartY = this.baseY;
        let bottomStartY = this.baseY;

        for (let index = 0; index < point.points.length; index++) {
          const style = this.graph.utils.clone(this.style);

          if (style.color && typeof style.color === 'function') {
            style.fill = style.color.call(this, this, index);
          } else {
            style.fill = this.graph.getColor(index);
          }

          const sp = this.addShape(this.graph.createPath(null, style));
          const p = point.points[index];
          let startY = topStartY;
          if (p.yValue < this.baseYValue) startY = bottomStartY; //首先确定p1和p4,因为他们是底脚。会固定

          const p1 = {
            x: p.x - this.barTotalWidth / 2,
            y: startY
          };
          const p4 = {
            x: p1.x + this.barWidth,
            y: p1.y
          };
          const p2 = {
            x: p1.x,
            y: p1.y
          };
          const p3 = {
            x: p4.x,
            y: p1.y
          }; // 如果要动画。则动态改变高度

          if (isRunningAni) {
            const step = p.height / aniCount;
            const offHeight = step * this.___animateCounter; // 动态计算当前高度

            p2.y = startY - offHeight; // 计算高度
            // 当次动画完成

            if (step >= 0 && offHeight >= p.height || step < 0 && offHeight <= p.height) {
              p2.y = startY - p.height;
            } else {
              aniIsEnd = false; // 只要有一个没完成，就还没有完成动画
            }

            p.y = p3.y = p2.y;
          } else {
            p2.y = startY - p.height;
            p.y = p3.y = p2.y;
          }

          if (p.yValue < this.baseYValue) bottomStartY = p2.y; // 下一个又从它顶部开始画
          else topStartY = p2.y;
          sp.points.push(p1);
          sp.points.push(p2);
          sp.points.push(p3);
          sp.points.push(p4);
        } // 生成标点的回调


        this.emit('onPointCreated', point);
      }

      if (aniIsEnd) {
        this.___animateCounter = 0;
      } else {
        this.___animateCounter++; // next tick 再次刷新

        setTimeout(() => {
          this.needUpdate = true; //需要刷新
        });
      }
    } // 计算最大值和最小值，一般图形直接采用最大最小值即可，有些需要多值叠加


    initAxisValue() {
      // 计算最大最小值
      // 当前需要先更新axis的边界值，轴好画图
      const fields = Array.isArray(this.field) ? this.field : [this.field];

      for (const row of this.data) {
        let max, min;

        for (const f of fields) {
          const v = Number(row[f]);
          if (typeof max === 'undefined') max = v;else {
            if (v < 0 || max < 0) max = Math.max(max, v);else {
              max += v;
            }
          }
          if (typeof min === 'undefined') min = v;else {
            if (v >= 0 || min >= 0) min = Math.min(min, v);else {
              min += v;
            }
          }
        }

        this.yAxis.max(max);
        this.yAxis.min(min);
        const xv = row[this.xAxis.field];
        this.xAxis.max(xv);
        this.xAxis.min(xv);
      }
    }

  }

  /**
   * 饼图
   *
   * @class jmPieSeries
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {array} mappings 图形字段映射
   * @param {style} style 样式
   */
  //构造函数

  class jmPieSeries extends jmSeries {
    constructor(options) {
      super(options);
      this.xAxis.visible = false;
      this.yAxis.visible = false;
    } // 重新初始化图形


    init() {
      //总和
      this.totalValue = 0; //计算最大值和最小值

      if (this.data) {
        for (const i in this.data) {
          const s = this.data[i];
          const vy = s[this.field];

          if (vy) {
            this.totalValue += Math.abs(vy);
          }
        }
      }

      const center = {
        x: this.graph.chartArea.width / 2,
        y: this.graph.chartArea.height / 2
      };
      const radius = Math.min(center.x - this.style.margin.left - this.style.margin.right * this.graph.devicePixelRatio, center.y - this.style.margin.top * this.graph.devicePixelRatio - this.style.margin.bottom * this.graph.devicePixelRatio); //生成描点位
      // super.init会把参数透传给 createPoints

      const {
        points,
        dataChanged
      } = this.initDataPoint(center, radius); // 是否正在动画中

      const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0); // 在动画中，则一直刷新

      if (isRunningAni) {
        const aniCount = this.style.aniCount || 20;
        let aniIsEnd = true; // 当次是否结束动画

        const len = points.length;

        for (let i = 0; i < len; i++) {
          const p = points[i];
          const step = (p.y - p.shape.startAngle) / aniCount;
          p.shape.endAngle = p.shape.startAngle + this.___animateCounter * step;

          if (p.shape.endAngle >= p.y) {
            p.shape.endAngle = p.y;
          } else {
            aniIsEnd = false;
          } // p.shape.points = arc.initPoints();
          // p.shape.points.push(center);			
          //绑定提示框
          //this.bindTooltip(p.shape, p);

        } // 所有动画都完成，则清空计数器


        if (aniIsEnd) {
          this.___animateCounter = 0;
        } else {
          this.___animateCounter++; // next tick 再次刷新

          setTimeout(() => {
            this.needUpdate = true; //需要刷新
          });
        }
      }
    } // 当前总起画角度


    get startAngle() {
      return this.option.startAngle || 0;
    }

    set startAngle(v) {
      this.option.startAngle = v;
    }
    /**
     * 生成序列图描点
     *
     * @method createPoints
     */


    createPoints(center, radius) {
      if (!this.data) return [];
      const points = [];
      let index = 0;
      let startAni = this.startAngle; // 总起始角度

      if (typeof startAni === 'function') {
        startAni = startAni.call(this, this.data);
      }

      let cm = Math.PI * 2; //规定应该逆时针还是顺时针绘图 false  顺时针，true 逆时针

      const anticlockwise = this.option.anticlockwise || false; // 每项之间的间隔角度  顺时钟为正，否则为负

      const marginAngle = Number(this.style.marginAngle) || 0;

      for (var i = 0; i < this.data.length; i++) {
        const s = this.data[i];
        const yv = s[this.field]; //如果Y值不存在。则此点无效，不画图

        if (yv == null || typeof yv == 'undefined') {
          continue;
        } else {
          const p = {
            data: s,
            x: i,
            yValue: yv,
            yLabel: yv,
            step: Math.abs(yv / this.totalValue),
            // 每个数值点比
            style: this.graph.utils.clone(this.style),
            anticlockwise
          }; //p.style.color = this.graph.getColor(index);

          if (p.style.color && typeof p.style.color === 'function') {
            p.style.fill = p.style.color.call(this, p);
          } else {
            p.style.fill = this.graph.getColor(index);
          }

          const start = startAni; // 上一个扇形的结束角度为当前的起始角度
          // 计算当前结束角度, 同时也是下一个的起始角度

          p.y = startAni + p.step * cm;
          startAni = p.y;
          p.startAngle = start + marginAngle;
          p.endAngle = p.y;

          if (center && radius) {
            const arcWidth = this.style.arcWidth || radius * 0.2;
            p.radius = radius; // 如果有指定动态半径，则调用

            if (typeof this.option.radius === 'function') {
              p.radius = this.option.radius.call(this, p, radius, i);
            }

            p.maxRadius = p.radius; // 如果有指定动态半径，则调用

            if (typeof this.option.maxRadius === 'function') {
              p.maxRadius = this.option.maxRadius.call(this, p, p.maxRadius, i);
            }

            p.minRadius = p.radius - arcWidth; // 如果有指定动态半径，则调用

            if (typeof this.option.minRadius === 'function') {
              p.minRadius = this.option.minRadius.call(this, p, p.minRadius, i);
            }

            p.center = center; // 如果有指定动态半径，则调用

            if (typeof this.option.center === 'function') {
              p.center = this.option.center.call(this, p, p.center, i);
            }

            p.shape = this.graph.createShape(this.style.isHollow ? 'harc' : 'arc', {
              style: p.style,
              startAngle: p.startAngle,
              endAngle: p.endAngle,
              anticlockwise: anticlockwise,
              isFan: true,
              // 表示画扇形
              center: p.center,
              radius: p.radius,
              maxRadius: p.maxRadius,
              minRadius: p.minRadius
            });
            /**
             * 因为jmgraph是按图形形状来计算所占区域和大小的， 这里我们把扇形占区域改为整个图圆。这样计算大小和渐变时才好闭合。
             */

            p.shape.getLocation = function () {
              const local = this.location = {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                center: this.center,
                radius: p.radius
              };
              local.left = this.center.x - p.radius;
              local.top = this.center.y - p.radius;
              local.width = local.height = p.radius * 2;
              return local;
            };

            p.shape.getBounds = function () {
              return this.getLocation();
            };

            this.addShape(p.shape); // 如果有点击事件

            if (this.option.onClick) {
              p.shape.on('click', e => {
                this.option.onClick.call(this, p, e);
              });
            }

            if (this.option.onOver) {
              p.shape.on('mouseover touchover', e => {
                this.option.onOver.call(this, p, e);
              });
            }

            if (this.option.onLeave) {
              p.shape.on('mouseleave touchleave', e => {
                this.option.onLeave.call(this, p, e);
              });
            }

            this.createLabel(p); // 生成标签
          }

          points.push(p);
          index++; // 生成标点的回调

          this.emit('onPointCreated', p);
        }
      }

      return points;
    } // 生成柱图的标注


    createLabel(point) {
      if (this.style.label && this.style.label.show === false) return;
      const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, point) : point.step;
      if (!text) return; // v如果指定了为控件，则直接加入

      if (text instanceof jmgraph.jmControl) {
        point.shape.children.add(text);
        return text;
      }

      const self = this;
      const label = this.graph.createShape('label', {
        style: this.style.label,
        text: text,
        position: function () {
          if (!this.parent || !this.parent.points || !this.parent.points.length) return {
            x: 0,
            y: 0
          }; // 动态计算位置

          const parentRect = this.parent.getBounds(); //const rect = this.getBounds.call(this.parent);
          // 圆弧的中间位，离圆心最近和最完的二个点

          let centerMaxPoint = this.parent.points[Math.floor(this.parent.points.length / 2)];
          let centerMinPoint = this.parent.center; // 如果是空心圆，则要计算 1/4 和 3/4位的点。顺时针和逆时针二个点大小不一样，这里只取，大小计算时处理

          if (self.style.isHollow) {
            centerMaxPoint = this.parent.points[Math.floor(this.parent.points.length * 0.25)];
            centerMinPoint = this.parent.points[Math.floor(this.parent.points.length * 0.75)];
          }

          const centerMinX = Math.min(centerMaxPoint.x, centerMinPoint.x);
          const centerMaxX = Math.max(centerMaxPoint.x, centerMinPoint.x);
          const centerMinY = Math.min(centerMaxPoint.y, centerMinPoint.y);
          const centerMaxY = Math.max(centerMaxPoint.y, centerMinPoint.y); // 中心点

          const center = {
            x: (centerMaxX - centerMinX) / 2 + centerMinX,
            y: (centerMaxY - centerMinY) / 2 + centerMinY
          };
          const size = this.testSize(); // 取图形中间的二个点
          // rect是相对于图形坐标点形图的图形的左上角，而parentRect是图形重新指定的整圆区域。减去整圆区域左上角就是相对于整圆区域坐标

          return {
            x: center.x - parentRect.left - size.width / 2,
            y: center.y - parentRect.top - size.height / 2
          };
        }
      });
      point.shape.children.add(label);
    }

  }
  /**
   * 生成图例
   *
   * @method createLegend	 
   */

  jmPieSeries.prototype.createLegend = function () {
    const points = this.createPoints();
    if (!points || !points.length) return;

    for (let k in points) {
      const p = points[k];
      if (!p) continue; //生成图例前的图标

      const style = this.graph.utils.clone(p.style);
      style.fill = style.fill; //delete style.stroke;

      const shape = this.graph.createShape('rect', {
        style: style,
        position: {
          x: 0,
          y: 0
        }
      }); //shape.targetShape = p.shape;
      //此处重写图例事件

      this.graph.legend.append(this, shape, {
        name: this.legendLabel,
        hover: function () {
          //var sp = this.children.get(0);
          //应用图的动态样式
          Object.assign(this.targetShape.style, this.targetShape.style.hover);
          Object.assign(this.style, this.style.hover);
        },
        leave: function () {
          //var sp = this.children.get(0);
          //应用图的普通样式
          Object.assign(this.targetShape.style, this.targetShape.style.normal);
          Object.assign(this.style, this.style.normal);
        },
        data: this.data[k]
      });
    }
  };

  /**
   * 图形基类
   *
   * @class jmLineSeries
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {array} mappings 图形字段映射
   * @param {style} style 样式
   */
  //构造函数

  class jmLineSeries extends jmSeries {
    constructor(options) {
      options.style = options.style || options.graph.style.line;
      super(options); //this.on('beginDraw', this[PreDrawKey]);
    }
    /**
     * 绘制图形前 初始化线条
     *
     * @method preDraw
     * @for jmLineSeries
     */


    init() {
      //生成描点位
      const {
        points,
        dataChanged
      } = this.initDataPoint(); //去除多余的线条
      //当数据源线条数比现有的少时，删除多余的线条

      const len = points.length; //设定其填充颜色
      //if(!this.style.fill) this.style.fill = jmUtils.toColor(this.style.stroke,null,null,20);	

      this.style.stroke = this.style.color; //是否启用动画效果
      //var ani = typeof this.enableAnimate === 'undefined'? this.graph.enableAnimate: this.enableAnimate;

      this.style.item.stroke = this.style.color; // 是否正在动画中
      // 如果数据点多于100 个，暂时不启用动画，太慢了

      const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0);
      let shapePoints = []; // 计算出来的曲线点集合	

      const aniCount = this.style.aniCount || 10;
      const aniStep = Math.floor(len / aniCount) || 1; // 每次动画播放点个数

      for (let i = 0; i < len; i++) {
        const p = points[i]; //如果当前点无效，则跳致下一点

        if (typeof p.y === 'undefined' || p.y === null) {
          //prePoint = null;						
          continue;
        }

        if (isRunningAni) {
          if (i > this.___animateCounter) {
            break;
          }
        } // 是否显示数值点圆


        if (this.style.showItem) {
          this.createPointItem(p);
        } // 平滑曲线


        if (this.style.curve) {
          shapePoints = this.createCurePoints(shapePoints, p);
        } // 如果是虚线
        else if (this.style.lineType === 'dotted') {
          shapePoints = this.createDotLine(shapePoints, p);
        }

        shapePoints.push(p);
        this.createItemLabel(p); // 生成关健值标注

        this.emit('onPointCreated', p);
      } // 如果所有都已经结束，则重置成初始化状态


      if (this.___animateCounter >= len - 1) {
        this.___animateCounter = 0;
      } else if (isRunningAni) {
        this.___animateCounter += aniStep; // next tick 再次刷新

        setTimeout(() => {
          this.needUpdate = true; //需要刷新
        });
      }

      this.points = shapePoints;
      this.createArea(shapePoints); // 仓建区域效果
    } // 生成点的小圆圈


    createPointItem(p) {
      const pointShape = this.graph.createShape('circle', {
        style: this.style.item,
        center: p,
        radius: this.style.radius || 3
      });
      pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;
      return this.addShape(pointShape);
    } // 根据上下点生成平滑曲线


    createCurePoints(shapePoints, p) {
      const startPoint = shapePoints[shapePoints.length - 1];

      if (startPoint && startPoint.y != undefined && startPoint.y != null) {
        //如果需要画曲线，则计算贝塞尔曲线坐标				
        const p1 = {
          x: startPoint.x + (p.x - startPoint.x) / 5,
          y: startPoint.y
        };
        const p2 = {
          x: startPoint.x + (p.x - startPoint.x) / 2,
          y: p.y - (p.y - startPoint.y) / 2
        };
        const p3 = {
          x: p.x - (p.x - startPoint.x) / 5,
          y: p.y
        }; //圆滑线条使用的贝塞尔对象

        this.__bezier = this.__bezier || this.graph.createShape('bezier');
        this.__bezier.cpoints = [startPoint, p1, p2, p3, p]; //设置控制点

        const bzpoints = this.__bezier.initPoints();

        shapePoints = shapePoints.concat(bzpoints);
      }

      return shapePoints;
    } // 生成虚线


    createDotLine(shapePoints, p) {
      const startPoint = shapePoints[shapePoints.length - 1];

      if (startPoint && startPoint.y != undefined && startPoint.y != null) {
        //使用线条来画虚线效果
        this.__line = this.__line || this.graph.createShape('line', {
          style: this.style
        });
        this.__line.start = startPoint;
        this.__line.end = p;

        const dots = this.__line.initPoints();

        shapePoints = shapePoints.concat(dots);
      }

      return shapePoints;
    }
    /**
     * 生成图例
     *
     * @method createLegend	 
     */


    createLegend() {
      //生成图例前的图标
      var style = this.graph.utils.clone(this.style);
      style.stroke = style.color;
      var shape = this.graph.createShape('path', {
        style: style
      });

      if (this.curve || this.style.curve) {
        var p1 = {
          x: 0,
          y: this.graph.style.legend.item.shape.height
        };
        var p2 = {
          x: this.graph.style.legend.item.shape.width / 3,
          y: this.graph.style.legend.item.shape.height / 3
        };
        var p3 = {
          x: this.graph.style.legend.item.shape.width / 3 * 2,
          y: this.graph.style.legend.item.shape.height / 3 * 2
        };
        var p4 = {
          x: this.graph.style.legend.item.shape.width,
          y: 0
        };
        this.__bezier = this.__bezier || this.graph.createShape('bezier');
        this.__bezier.cpoints = [p1, p2, p3, p4]; //设置控制点		

        shape.points = this.__bezier.initPoints();
      } else {
        shape.points = [{
          x: 0,
          y: this.graph.style.legend.item.shape.height / 2
        }, {
          x: this.graph.style.legend.item.shape.width,
          y: this.graph.style.legend.item.shape.height / 2
        }];
      }

      this.graph.legend.append(this, shape);
    } // 生成布效果


    createArea(points, needClosePoint = true) {
      // 有指定绘制区域效果才展示
      if (!this.style.area || points.length < 2) return;
      const start = points[0];
      const end = points[points.length - 1];
      const style = this.graph.utils.clone(this.style.area, {}, true); // 连框颜色如果没指定，就透明

      style.stroke = style.stroke || 'transparent';

      if (!style.fill) {
        const color = this.graph.utils.hexToRGBA(this.style.stroke);
        style.fill = `linear-gradient(50% 0 50% 100%, 
				rgba(${color.r},${color.g},${color.b}, 0) 1,
				rgba(${color.r},${color.g},${color.b}, 0.1) 0.7, 
				rgba(${color.r},${color.g},${color.b}, 0.3) 0)`;
      } else if (typeof style.fill === 'function') {
        style.fill = style.fill.call(this, style);
      }

      const area = this.graph.createShape('path', {
        points: this.graph.utils.clone(points, true),
        style,
        width: this.graph.chartArea.width,
        height: this.graph.chartArea.height
      }); // 在点集合前后加上落地到X轴的点就可以组成一个封闭的图形area

      if (needClosePoint) {
        area.points.unshift({
          x: start.x,
          y: this.baseY
        });
        area.points.push({
          x: end.x,
          y: this.baseY
        });
      }

      this.addShape(area);
    }

  }

  /**
   * 二条线组成的区域图表
   *
   * @class jmStackLineSeries
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {array} mappings 图形字段映射
   * @param {style} style 样式
   */
  //构造函数

  class jmStackLineSeries extends jmLineSeries {
    constructor(options) {
      options.style = options.style || options.graph.style.stackLine;
      super(options);
    }
    /**
     * 绘制图形前 初始化线条
     *
     * @method preDraw
     * @for jmLineSeries
     */


    init() {
      //生成描点位
      const {
        points,
        dataChanged
      } = this.initDataPoint(); //去除多余的线条
      //当数据源线条数比现有的少时，删除多余的线条

      const len = points.length; //设定其填充颜色
      //if(!this.style.fill) this.style.fill = jmUtils.toColor(this.style.stroke,null,null,20);	

      this.style.stroke = this.style.color; //是否启用动画效果
      //var ani = typeof this.enableAnimate === 'undefined'? this.graph.enableAnimate: this.enableAnimate;

      this.style.item.stroke = this.style.color; // 是否正在动画中
      // 如果数据点多于100 个，暂时不启用动画，太慢了

      const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0);
      let startShapePoints = []; // 计算出来的曲线点集合	

      let endShapePoints = []; // 计算出来的曲线点集合

      const aniCount = this.style.aniCount || 10;
      const aniStep = Math.floor(len / aniCount) || 1; // 每次动画播放点个数

      for (let i = 0; i < len; i++) {
        const p = points[i];

        if (isRunningAni) {
          if (i > this.___animateCounter) {
            break;
          }
        } // 是否显示数值点圆


        if (this.style.showItem) {
          this.createPointItem(p.points[0]);
          this.createPointItem(p.points[1]);
        } // 平滑曲线


        if (this.style.curve) {
          startShapePoints = this.createCurePoints(startShapePoints, p.points[0]);
          endShapePoints = this.createCurePoints(endShapePoints, p.points[1]);
        } // 如果是虚线
        else if (this.style.lineType === 'dotted') {
          startShapePoints = this.createDotLine(startShapePoints, p.points[0]);
          endShapePoints = this.createDotLine(endShapePoints, p.points[1]);
        }

        startShapePoints.push(p.points[0]);
        endShapePoints.push(p.points[1]); // 生成标点的回调

        this.emit('onPointCreated', p);
      } // 如果所有都已经结束，则重置成初始化状态


      if (this.___animateCounter >= len - 1) {
        this.___animateCounter = 0;
      } else if (isRunningAni) {
        this.___animateCounter += aniStep; // next tick 再次刷新

        setTimeout(() => {
          this.needUpdate = true; //需要刷新
        });
      }

      if (endShapePoints.length) endShapePoints[0].m = true; // 第二条线重新开始画

      this.points = startShapePoints.concat(endShapePoints); // 仓建区域效果  这里的endShapePoints要倒过来画，才能形成一个封闭区域

      const areaPoints = startShapePoints.concat(endShapePoints.reverse());
      const areaEnd = areaPoints[areaPoints.length - 1] = this.graph.utils.clone(areaPoints[areaPoints.length - 1]);
      areaEnd.m = false;
      this.createArea(areaPoints, false);
    }
    /**
     * 生成图例
     *
     * @method createLegend	 
     */


    createLegend() {
      //生成图例前的图标
      var style = this.graph.utils.clone(this.style);
      style.stroke = style.color;
      var shape = this.graph.createShape('path', {
        style: style
      });

      if (this.curve || this.style.curve) {
        var p1 = {
          x: 0,
          y: this.graph.style.legend.item.shape.height
        };
        var p2 = {
          x: this.graph.style.legend.item.shape.width / 3,
          y: this.graph.style.legend.item.shape.height / 3
        };
        var p3 = {
          x: this.graph.style.legend.item.shape.width / 3 * 2,
          y: this.graph.style.legend.item.shape.height / 3 * 2
        };
        var p4 = {
          x: this.graph.style.legend.item.shape.width,
          y: 0
        };
        this.__bezier = this.__bezier || this.graph.createShape('bezier');
        this.__bezier.cpoints = [p1, p2, p3, p4]; //设置控制点		

        shape.points = this.__bezier.initPoints();
      } else {
        shape.points = [{
          x: 0,
          y: this.graph.style.legend.item.shape.height / 2
        }, {
          x: this.graph.style.legend.item.shape.width,
          y: this.graph.style.legend.item.shape.height / 2
        }];
      }

      this.graph.legend.append(this, shape);
    }

  }

  /**
   * K线图
   *
   * @class jmCandlestickSeries
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {array} mappings 图形字段映射
   * @param {style} style 样式
   */
  //构造函数

  class jmCandlestickSeries extends jmSeries {
    constructor(options) {
      options.style = options.style || options.graph.style.line;
      super(options); //this.on('beginDraw', this[PreDrawKey]);
    }
    /**
     * 绘制图形前 初始化线条
     *
     * @method preDraw
     * @for jmLineSeries
     */


    init() {
      //生成描点位
      const {
        points
      } = this.initDataPoint(); //去除多余的线条
      //当数据源线条数比现有的少时，删除多余的线条

      const len = points.length;
      this.initWidth(len);
      const w = this.barWidth / 2; //实心处宽度的一半

      for (let i = 0; i < len; i++) {
        const p = points[i]; //如果当前点无效，则跳致下一点

        if (typeof p.y === 'undefined' || p.y === null) {
          //prePoint = null;						
          continue;
        }

        const sp = this.addShape(this.graph.createPath([], p.style));
        const bl = {
          x: p.x - w,
          y: p.points[0].y
        };
        const br = {
          x: p.x + w,
          y: p.points[0].y
        };
        const tl = {
          x: p.x - w,
          y: p.points[1].y
        };
        const tr = {
          x: p.x + w,
          y: p.points[1].y
        }; // 默认认为是阳线

        let tm = p.points[1];
        let bm = p.points[0];
        p.style.stroke = p.style.fill = p.style.masculineColor || 'red'; // 开盘大于收盘，则阴线

        if (p.points[0].yValue > p.points[1].yValue) {
          p.style.stroke = p.style.fill = p.style.negativeColor || 'green';
          bl.y = br.y = p.points[1].y;
          tl.y = tr.y = p.points[0].y;
          tm = p.points[0];
          bm = p.points[1];
        }

        sp.points.push(p.points[2], tm, tl, bl, bm, p.points[3], bm, br, tr, tm, p.points[2]); // 生成关健值标注

        this.emit('onPointCreated', p);
      }
    } // 计算实心体宽度


    initWidth(count) {
      //计算每个柱子占宽
      //每项柱子占宽除以柱子个数,默认最大宽度为30
      const maxWidth = this.xAxis.width / count;

      if (this.style.barWidth > 0) {
        this.barWidth = Number(this.style.barWidth);
      } else {
        this.barWidth = maxWidth * (this.style.perWidth || 0.4);
      }

      if (this.barWidth > maxWidth) {
        this.barWidth = maxWidth;
        this.barTotalWidth = maxWidth * count;
      }
    }

  }

  /**
   * 轴
   *
   * @class jmAxis
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {string} [type] 轴类型(x/y/radar),默认为x
   * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
   * @param {object} [style] 样式
   */

  class jmMarkLine extends jmgraph.jmLine {
    constructor(options) {
      super(options);
      this.visible = false;
      this.markLineType = options.type || 'x'; // 为横轴x或纵轴y  

      /**
      * 当前图形下的所有子图
      */

      this.shapes = new jmgraph.jmList();
    } // 初始化轴


    init() {
      if (!this.visible) return; // 纵标线，中间标小圆圈

      if (this.markLineType === 'y') {
        // 重置所有图形
        let shape;

        while (shape = this.shapes.shift()) {
          shape && shape.remove();
        }

        this.changeTouchPoint();
      }
    } // 滑动点改变事件


    changeTouchPoint() {
      // 纵标线，中间标小圆圈
      if (this.markLineType === 'y') {
        const touchPoints = []; // 命中的数据点

        let touchChange = false; // chartGraph 表示图表层，有可能当前graph为操作层

        const graph = this.graph.chartGraph || this.graph;
        const isTocuhGraph = graph !== this.graph; // 不在图表图层，在操作图层的情况

        try {
          // 查找最近的X坐标
          const findX = isTocuhGraph ? this.start.x - graph.chartArea.position.x : this.start.x; // 根据线条数生成标点个数

          for (const serie of graph.series) {
            // 得有数据描点的才展示圆
            if (!serie.getDataPointByX) continue;
            const point = serie.getDataPointByX(findX); // 找到最近的数据点

            if (!point) continue; // 锁定在有数据点的X轴上
            // 如果在操作图层上， 点的X轴需要加上图表图层区域偏移量

            this.start.x = this.end.x = isTocuhGraph ? point.x + graph.chartArea.position.x : point.x;

            for (const p of point.points) {
              this.markArc = graph.createShape('circle', {
                style: this.style,
                radius: (this.style.radius || 5) * this.graph.devicePixelRatio
              });
              this.markArc.center.y = p.y;
              this.children.add(this.markArc);
              this.shapes.add(this.markArc);
            } // x轴改变，表示变换了位置


            if (!touchChange && (!serie.lastMarkPoint || serie.lastMarkPoint.x != point.x)) touchChange = true;
            touchPoints.push(point);
            serie.lastMarkPoint = point; // 记下最后一次改变的点
            // 同时改变下X轴标线的位置，它的Y坐标跟随最后一个命中的线点

            if (graph && graph.markLine && graph.markLine.xMarkLine) {
              graph.markLine.xMarkLine.start.y = graph.markLine.xMarkLine.end.y = isTocuhGraph ? point.y + graph.chartArea.position.y : point.y;
            }
          }
        } catch (e) {
          console.error(e);
        } // 触发touch数据点改变事件


        touchChange && setTimeout(() => {
          graph.emit('touchPointChange', {
            points: touchPoints
          });
        }, 10);
      }
    }
    /**
    * 移动标线
    * @param { object } args 移动事件参数
    */


    move(args) {
      // 事件是挂在graph下的，，但此轴是放在chartArea中的。所以事件判断用graph坐标，但是当前位置要相对于chartArea
      if (this.visible && this.markLineType === 'x') {
        // 有操作层的情况下，相对于左上角，否则是chartarea
        if (this.graph.chartGraph) {
          if (args.position.y <= this.graph.chartGraph.chartArea.position.y) {
            this.start.y = this.end.y = this.graph.chartGraph.chartArea.position.y;
          } else if (args.position.y > this.graph.chartGraph.chartArea.height + this.graph.chartGraph.chartArea.position.y) {
            this.start.y = this.end.y = this.graph.chartGraph.chartArea.height + this.graph.chartGraph.chartArea.position.y;
          } else {
            this.start.y = this.end.y = args.position.y;
          }

          this.start.x = this.graph.chartGraph.chartArea.position.x;
          this.end.x = this.start.x + this.graph.chartGraph.chartArea.width;
        } else {
          if (args.position.y <= this.graph.chartArea.position.y) {
            this.start.y = this.end.y = 0;
          } else if (args.position.y > this.graph.chartArea.height + this.graph.chartArea.position.y) {
            this.start.y = this.end.y = this.graph.chartArea.height;
          } else {
            this.start.y = this.end.y = args.position.y - this.graph.chartArea.position.y;
          }

          this.start.x = 0;
          this.end.x = this.graph.chartArea.width;
        }

        this.needUpdate = true;
      }

      if (this.visible && this.markLineType === 'y') {
        // 有操作层的情况下，相对于左上角，否则是chartarea
        if (this.graph.chartGraph) {
          if (args.position.x < this.graph.chartGraph.chartArea.position.x) {
            this.start.x = this.end.x = this.graph.chartGraph.chartArea.position.x;
          } else if (args.position.x > this.graph.chartGraph.chartArea.width + this.graph.chartGraph.chartArea.position.x) {
            this.start.x = this.end.x = this.graph.chartGraph.chartArea.width + this.graph.chartGraph.chartArea.position.x;
          } else {
            this.start.x = this.end.x = args.position.x;
          }

          this.start.y = this.graph.chartGraph.chartArea.position.y;
          this.end.y = this.start.y + this.graph.chartGraph.chartArea.height;
        } else {
          if (args.position.x < this.graph.chartArea.position.x) {
            this.start.x = this.end.x = 0;
          } else if (args.position.x > this.graph.chartArea.width + this.graph.chartArea.position.x) {
            this.start.x = this.end.x = this.graph.chartArea.width;
          } else {
            this.start.x = this.end.x = args.position.x - this.graph.chartArea.position.x;
          }

          this.start.y = 0;
          this.end.y = this.graph.chartArea.height;
        }

        this.needUpdate = true;
      }
    }
    /**
     * 中止
     */


    cancel() {
      this.visible = false;
      this.needUpdate = true;
    }

  }

  /**
   * 轴
   *
   * @class jmMarkLineManager
   * @module jmChart
   * @param {jmChart} chart 当前图表
   * @param {string} [type] 轴类型(x/y/radar),默认为x
   * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
   * @param {object} [style] 样式
   */

  class jmMarkLineManager {
    constructor(chart) {
      this.chart = chart;
      this.init(chart);
    } // 初始化


    init(chart) {
      const graph = chart.touchGraph || chart;
      graph.on('beginDraw', () => {
        // 重置标线，会处理小圆圈问题
        this.xMarkLine && this.xMarkLine.init();
        this.yMarkLine && this.yMarkLine.init();
      });

      if (chart.style.markLine) {
        // 生成标线，可以跟随鼠标或手指滑动
        if (chart.style.markLine && chart.style.markLine.x) {
          this.xMarkLine = graph.createShape(jmMarkLine, {
            type: 'x',
            style: chart.style.markLine
          });
          const area = graph.chartArea || graph;
          area.children.add(this.xMarkLine);
        }

        if (chart.style.markLine && chart.style.markLine.y) {
          this.yMarkLine = graph.createShape(jmMarkLine, {
            type: 'y',
            style: chart.style.markLine
          });
          const area = graph.chartArea || graph;
          area.children.add(this.yMarkLine);
        }

        let longtap = 0; // 是否有长按, 0 未开始，1已按下，2识别为长按

        let longtapHandler = 0;
        let touchStartPos = {
          x: 0,
          y: 0
        };
        graph.on('mousedown touchstart', args => {
          // 如果长按才启用
          if (chart.style.markLine.longtap) {
            longtap = 1;
            longtapHandler && graph.utils.cancelAnimationFrame(longtapHandler);
            let tapStartTime = Date.now();

            const reqFun = () => {
              const elapsed = Date.now() - tapStartTime;

              if (longtap === 1 || longtap === 2) {
                // 如果还未过一定时间，则继续等待
                if (elapsed < 500) {
                  longtapHandler = graph.utils.requestAnimationFrame(reqFun);
                  return;
                }

                longtap = 2;
                this.startMove(args);
                chart.emit('marklinelongtapstart', args);
              }
            }; // 如果一定时间后还没有取消，则表示长按了


            longtapHandler = graph.utils.requestAnimationFrame(reqFun); //args.event.stopPropagation();

            args.event.preventDefault(); // 阻止默认行为	
          } else {
            this.startMove(args);
          }

          args.longtap = longtap;
          touchStartPos = args.position;
        }); // 移动标线

        graph.on('mousemove touchmove', args => {
          const ox = args.position.x - touchStartPos.x;
          const oy = args.position.y - touchStartPos.y;
          const offpos = Math.sqrt(ox * ox + oy * oy);
          if (longtap === 1 && offpos > 15) longtap = 0; // 如果移动了，则取消长按

          args.longtap = longtap;
          this.move(args);
        }); // 取消移动

        graph.on('mouseup touchend touchcancel touchleave', args => {
          longtap = 0;
          this.endMove(args);
        });
      }
    } // 开始移动标线


    startMove(args, markLineType = 'xy') {
      if (this.xMarkLine && markLineType.includes('x')) {
        this.xMarkLine.visible = true;
        this.xMarkLine.move(args);
      }

      if (this.yMarkLine && markLineType.includes('y')) {
        this.yMarkLine.visible = true;
        this.yMarkLine.move(args);
      }

      if (!args.cancel) this.chart.emit('marklinestartmove', args);
    } // 移动标线


    move(args) {
      let moved = false;

      if (this.xMarkLine && this.xMarkLine.visible) {
        this.xMarkLine.move(args);
        moved = true;
      }

      if (this.yMarkLine && this.yMarkLine.visible) {
        this.yMarkLine.move(args);
        moved = true;
      }

      if (moved) {
        args.event.stopPropagation();
        args.event.preventDefault(); // 阻止默认行为	

        if (!args.cancel) this.chart.emit('marklinemove', args);
      }
    } // 终止动移


    endMove(args) {
      if (this.xMarkLine && this.xMarkLine.visible) {
        this.xMarkLine.cancel(args);
      }

      if (this.yMarkLine && this.yMarkLine.visible) {
        this.yMarkLine.cancel(args);
      }

      if (!args.cancel) this.chart.emit('marklineendmove', args);
    }

  }

  /**
   * jm图表组件
   * option参数:graph=jmgraph
   *
   * @class jmChart
   * @module jmChart
   * @param {element} container 图表容器
   */

  class jmChart extends jmgraph.jmGraph {
    constructor(container, options) {
      options = options || {};
      const enableAnimate = !!options.enableAnimate;
      options.autoRefresh = typeof options.autoRefresh === 'undefined' ? enableAnimate : options.autoRefresh;

      if (enableAnimate && !options.autoRefresh) {
        console.warn('开启了动画，却没有开户自动刷新');
      } // 深度复制默认样式，以免被改


      options.style = jmgraph.jmUtils.clone(defaultStyle, options.style, true);
      super(container, options);

      _defineProperty(this, "data", []);

      _defineProperty(this, "series", new jmgraph.jmList());

      this.enableAnimate = enableAnimate;
      this.data = options.data || []; // x轴绑定的字段名

      this.xField = options.xField || '';
      this.init(options); // 创建操作图层

      this.createTouchGraph(this.container, options);
    }
    /**
     * 绑定的数据源
     */


    /**
     * 是否启用动画
     */
    get enableAnimate() {
      if (typeof this.option.enableAnimate !== 'undefined') return !!this.option.enableAnimate;else {
        return false;
      }
    }

    set enableAnimate(v) {
      this.option.enableAnimate = v;
    }
    /**
     * Y轴的基线 默认是0
     */


    get baseY() {
      return this.option.baseY;
    }

    set baseY(v) {
      this.option.baseY = v;
    } // 初始化图表


    init(options) {
      /**
       * 绘图区域
       *
       * @property chartArea
       * @type jmControl
       */
      if (!this.chartArea) {
        this.chartArea = this.createShape('rect', {
          style: this.style.chartArea,
          position: {
            x: 0,
            y: 0
          }
        });
        this.children.add(this.chartArea);
      }
      /**
       * 图例
       *
       * @property legend
       * @type jmLegend
       */


      this.legend = this.legend || this.createShape(jmLegend, {
        style: this.style.legend
      });
      this.children.add(this.legend); // 不显示图例

      if (options.legendVisible === false) {
        this.legend.visible = false;
      }
      /**
       * 图表提示控件
       *
       * @property tooltip
       * @type jmTooltip
       */
      //this.tooltip = this.graph.createShape('tooltip',{style:this.style.tooltip});
      //this.chartArea.children.add(this.tooltip);


      this.createXAxis(); // 生成X轴
    } // 创建一个操作层，以免每次刷新


    createTouchGraph(container, options) {
      if (container && container.tagName === 'CANVAS') {
        container = container.parentElement;
      }

      container && (container.style.position = 'relative');
      options = this.utils.clone(options, {
        autoRefresh: true
      }, true); // 生成图层, 当图刷新慢时，需要用一个操作图层来进行滑动等操作重绘
      // isWXMiniApp 非微信小程序下才能创建

      if (!this.isWXMiniApp && container && options.touchGraph) {
        let cn = document.createElement('canvas');
        cn.width = container.offsetWidth || container.clientWidth;
        cn.height = container.offsetHeight || container.clientHeight;
        cn.style.position = 'absolute';
        cn.style.top = 0;
        cn.style.left = 0;
        this.touchGraph = new jmgraph.jmGraph(cn, options);
        container.appendChild(cn);
        this.touchGraph.chartGraph = this;
        this.on('propertyChange', (name, args) => {
          if (['width', 'height'].includes(name)) {
            this.touchGraph[name] = args.newValue / this.devicePixelRatio;
          }
        }); // 把上层canvse事件传递给绘图层对象

        this.touchGraph.on('mousedown touchstart mousemove touchmove mouseup touchend touchcancel touchleave', args => {
          const eventName = args.event.eventName || args.event.type;

          if (eventName) {
            this.emit(eventName, args);
          }
        });
      } // 初始化标线


      this.markLine = new jmMarkLineManager(this);
    } // 重置整个图表


    reset() {
      // 清空当前图形，重新生成
      let serie;

      while (serie = this.series.shift()) {
        // 重置所有图形
        let shape;

        while (shape = serie.shapes.shift()) {
          shape && shape.remove();
        }

        serie.remove();
      } // 轴删除


      if (this.xAxis) {
        this.xAxis.remove();
        delete this.xAxis;
      }

      if (this.yAxises) {
        for (let i in this.yAxises) {
          this.yAxises[i].remove();
        }

        delete this.yAxises;
      }
    }
    /**
     * 获取颜色
     *
     * @method getColor 
     * @param {int} index 颜色索引
     */


    getColor(index) {
      //如果颜色超过最大个数，则重新获取	
      if (index >= this.style.chartColors.length) {
        index = Math.floor((index - 1) / this.style.chartColors.length);
      }

      return this.style.chartColors[index];
    }
    /**
     * 绘制当前图表
     * 先绘制轴等基础信息
     *
     * @method beginDraw 
     */


    beginDraw() {
      //const startTime = Date.now();
      //重置图例
      this.legend && this.legend.init(); //先定位图例等信息，确定画图区域

      this.resetAreaPosition();

      if (this.xAxis) {
        this.xAxis.clear();
      } //计算Y轴位置


      if (this.yAxises) {
        for (let i in this.yAxises) {
          this.yAxises[i].clear();
        }
      } //console.log('beginDraw1', Date.now() - startTime);
      //计算柱形图个数


      this.barSeriesCount = 0; //初始化图序列，并初始化轴值,生成图例项

      this.series.each(function (i, serie) {
        //设定边框颜色和数据项图示颜 色
        if (!serie.style.color) serie.style.color = serie.graph.getColor(i); //如果排版指定非内缩的方式，但出现了柱图，还是会采用内缩一个刻度的方式

        if (serie.graph.style.layout != 'inside') {
          if (serie instanceof jmBarSeries) {
            serie.graph.style.layout = 'inside';
          }
        } //对柱图计算,并标记为第几个柱图，用为排列


        if (serie instanceof jmBarSeries) {
          serie.barIndex = serie.graph.barSeriesCount;
          serie.graph.barSeriesCount++;
        }

        serie.reset();
      }); //console.log('beginDraw2', Date.now() - startTime);
      //重置图例

      this.legend && this.legend.reset(); //计算Y轴位置

      if (this.yAxises) {
        for (var i in this.yAxises) {
          this.yAxises[i].reset();
        }
      } // y 处理完才能处理x


      if (this.xAxis) {
        this.xAxis.reset();
      } //console.log('beginDraw3', Date.now() - startTime);
      //最后再来初始化图形，这个必须在轴初始化完后才能执行


      this.series.each(function (i, serie) {
        serie.init && serie.init();
      }); //console.log('beginDraw4', Date.now() - startTime);
    }
    /**
     * 重新定位区域的位置
     *
     * @method resetAreaPosition
     */


    resetAreaPosition() {
      this.chartArea.position.x = (this.style.margin.left || 0) * this.graph.devicePixelRatio;
      this.chartArea.position.y = (this.style.margin.top || 0) * this.graph.devicePixelRatio;
      const w = this.width - this.style.margin.right * this.graph.devicePixelRatio - this.chartArea.position.x;
      const h = this.height - this.style.margin.bottom * this.graph.devicePixelRatio - this.chartArea.position.y;
      this.chartArea.width = w;
      this.chartArea.height = h;
    }
    /**
     * 创建轴
     *
     * @method createAxis
     * @for jmChart
     * @param {string} [type] 轴类型(x/y/radar),默认为x
     * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
     * @param {object} [style] 样式
     * @return {axis} 轴
     */


    createAxis(options) {
      // 深度组件默认样式
      options.style = options.style ? this.utils.clone(this.style.axis, options.style, true) : this.style.axis;
      const axis = this.createShape(jmAxis, options);
      if (typeof options.visible !== 'undefined') axis.visible = options.visible;
      this.children.add(axis);
      return axis;
    }
    /**
     * 生成X轴
     *
     * @method createXAxis
     * @param {string} x轴的数据类型(string/number/date)
     * @param {bool} 是否从0开始
     */


    createXAxis(options) {
      if (!this.xAxis) {
        options = Object.assign({
          field: this.xField,
          type: 'x',
          visible: this.style.axis.x === false ? false : true,
          format: this.option.xLabelFormat,
          ...this.option.yAxisOption
        }, options || {});

        if (typeof this.option.minXValue !== 'undefined') {
          options.minXValue = typeof options.minXValue === 'undefined' ? this.option.minXValue : Math.min(this.option.minXValue, options.minXValue);
        }

        if (typeof this.option.maxXValue !== 'undefined') {
          options.maxXValue = typeof options.maxXValue === 'undefined' ? this.option.maxXValue : Math.max(this.option.maxXValue, options.maxXValue);
        }

        this.xAxis = this.createAxis(options);
      }

      return this.xAxis;
    }
    /**
     * 生成Y轴
     *
     * @method createYAxis
     * @param {int} Y轴索引，可以创建多个Y轴
     * @param {string} y轴的数据类型(string/number/date)
     * @param {bool} 是否从0开始
     */


    createYAxis(options) {
      if (!this.yAxises) {
        this.yAxises = {};
      }

      options = Object.assign({
        index: 1,
        type: 'y',
        visible: this.style.axis.y === false ? false : true,
        format: this.option.yLabelFormat,
        zeroBase: this.baseY === 0,
        ...this.option.xAxisOption
      }, options || {});

      if (typeof this.option.minYValue !== 'undefined') {
        options.minYValue = typeof options.minYValue === 'undefined' ? this.option.minYValue : Math.min(this.option.minYValue, options.minYValue);
      }

      if (typeof this.option.maxYValue !== 'undefined') {
        options.maxYValue = typeof options.maxYValue === 'undefined' ? this.option.maxYValue : Math.max(this.option.maxYValue, options.maxYValue);
      }

      var yaxis = this.yAxises[options.index] || (this.yAxises[options.index] = this.createAxis(options));
      return yaxis;
    }
    /**
     * 创建图形
     *
     * @method createSeries
     * @for jmChart
     * @param {string} [type] 图类型，（line/bar/pie/radar）
     * @param {object} [options] 生成图表选项 {xField, yField, index}
     * @return {series} 图形
     */


    createSeries(type, options = {}) {
      if (!this.serieTypes) {
        this.serieTypes = {
          'line': jmLineSeries,
          'bar': jmBarSeries,
          'stackBar': jmStackBarSeries,
          'pie': jmPieSeries,
          'stackLine': jmStackLineSeries,
          'candlestick': jmCandlestickSeries
        };
      } //默认样式为类型对应的样式


      const style = this.style[type] || this.style['line']; // 深度组件默认样式

      options.style = this.utils.clone(style, options.style, true);
      if (typeof type == 'string') type = this.serieTypes[type];
      const serie = this.createShape(type, options);

      if (serie) {
        this.series.add(serie);
        this.chartArea.children.add(serie);
      }

      return serie;
    }

  }

  var vchart = {
    props: {
      chartData: Array,
      chartOptions: Object,
      chartSeries: Array,
      width: {
        type: String,
        default: 200
      },
      height: {
        type: String,
        default: 200
      }
    },
    data: function () {
      return {
        //chartData: this.chartData,
        option: this.chartOptions
      };
    },
    // jmChart实例
    chartInstance: null,

    mounted() {
      this.option = Object.assign({
        enableAnimate: false,
        legendPosition: 'top',
        legendVisible: true,
        // 不显示图例    
        width: this.width,
        height: this.height
      }, this.chartOptions);
      this.initChart();
    },

    // DOM更新
    updated() {
      this.initChart();
    },

    // 销毁
    destroyed() {
      this.chartInstance && this.chartInstance.destory();
      this.chartInstance && this.chartInstance.touchGraph && this.chartInstance.touchGraph.destory();
    },

    watch: {
      // 数据发生改变，刷新
      chartData: function (newData, oldData) {
        this.refresh();
      },
      width: function (newWidth, oldWidth) {
        if (!this.chartInstance) return;
        this.$nextTick(() => {
          if (!this.chartInstance || !this.$refs.jmChartContainer) return;
          this.chartInstance.width = this.$refs.jmChartContainer.clientWidth || this.$refs.jmChartContainer.offsetWidth; //this.chartInstance.refresh();
        });
      },
      height: function (newHeight, oldHeight) {
        if (!this.chartInstance) return;
        this.$nextTick(() => {
          if (!this.chartInstance || !this.$refs.jmChartContainer) return;
          this.chartInstance.height = this.$refs.jmChartContainer.clientHeight || this.$refs.jmChartContainer.offsetHeight; //this.chartInstance.refresh();
        });
      }
    },
    methods: {
      // 初始化图表组件
      initChart() {
        if (this.chartInstance) return;
        this.chartInstance = new jmChart(this.$refs.jmChartContainer, this.option);
        if (this.chartData && this.chartData.length) this.refresh(); // 这里有死循环的问题，但上面 chartInstance不为空就返回了，就没有这个问题了
        // touch改变数据点事件

        this.chartInstance.bind('touchPointChange', args => {
          this.$emit('touch-point-change', args);
        }); // touch事件

        this.chartInstance.touchGraph.bind('touchstart mousedown', args => {
          this.$emit('touchstart', args);
          this.$emit('mousedown', args);
        });
        this.chartInstance.touchGraph.bind('touchmove mousemove', args => {
          this.$emit('touchmove', args);
          this.$emit('mousemove', args);
        });
        this.chartInstance.touchGraph.bind('touchend touchcancel mouseup', args => {
          this.$emit('touchend', args);
          this.$emit('mouseup', args);
        });
        this.chartInstance.touchGraph.bind('touchleave', args => {
          this.$emit('touchleave', args);
        });
      },

      // 刷新图表
      refresh() {
        this.$nextTick(() => {
          this.initChart(); // 清空当前图形，重新生成

          this.chartInstance.reset(); // 生成图

          if (this.chartSeries.length) {
            for (let s of this.chartSeries) {
              if (!s.type) {
                console.error('必须指定serie type');
                continue;
              }

              this.chartInstance.createSeries(s.type, s);
            }
          }

          this.chartInstance.data = this.chartData;
          this.chartInstance.refresh();
        });
      }

    },
    template: `<div ref="jmChartContainer" :style="{width: width, height: height}"></div>`
  };

  exports['default'] = jmChart;
  exports.jmChart = jmChart;
  exports.vChart = vchart;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, jmgraph));
