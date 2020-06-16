

import jmChart from '../../index.js';

export default {
    props: {
        chartData: Array,
        chartOptions: Object,
        chartSeries: Array,
        width: {
            type: Number,
            default: 200
        },
        height: {
            type: Number,
            default: 200
        }
    },
    data: function() {
        return {
            //chartData: this.chartData,
            options: this.chartOptions
        }
    },
    // jmChart实例
    chartInstance: null,

    mounted () {
        this.options = Object.assign({
            enableAnimate: false,
            legendPosition: 'top',
            legendVisible: true, // 不显示图例    
            width: this.width,
            height: this.height        
        }, this.chartOptions);

        this.chartInstance = new jmChart(this.$refs.jmChartCanvas, this.options);

        // 生成图
        if(this.chartSeries.length) {
            for(let s of this.chartSeries) {
                if(!s.type) {
                    console.error('必须指定serie type');
                    continue;
                }
                this.chartInstance.createSeries(s.type, s);
            }
        }
        this.chartInstance.data = this.chartData;
        this.chartInstance.refresh();
    },

    watch: {
        // 数据发生改变，刷新
        chartData: function(newData, oldData) {
            this.chartInstance.data = newData;
            this.chartInstance.refresh();
        },
        width: function(newWidth, oldWidth) {
            this.chartInstance.width = newWidth;
            this.chartInstance.refresh();
        },
        height: function(newHeight, oldHeight) {
            this.chartInstance.height = newHeight;
            this.chartInstance.refresh();
        }
    },

    methods: {
        
    },

    template: `<canvas ref="jmChartCanvas"></canvas>`
}
