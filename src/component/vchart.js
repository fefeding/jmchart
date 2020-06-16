

import jmChart from '../../index.js';

export default {
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
    },
    // DOM更新
    updated() {
        this.initChart();
    },

    watch: {
        // 数据发生改变，刷新
        chartData: function(newData, oldData) {
            if(!this.chartInstance) return;
            this.chartInstance.data = newData;
            this.chartInstance.refresh();
        },
        width: function(newWidth, oldWidth) {
            if(!this.chartInstance) return;            
            this.$nextTick(()=>{
                this.chartInstance.width = this.$refs.jmChartContainer.clientWidth||this.$refs.jmChartContainer.offsetWidth;
                this.chartInstance.refresh();
            });
        },
        height: function(newHeight, oldHeight) {
            if(!this.chartInstance) return;
            this.$nextTick(()=>{
                this.chartInstance.height = this.$refs.jmChartContainer.clientHeight||this.$refs.jmChartContainer.offsetHeight;
                this.chartInstance.refresh();
            });
        }
    },

    methods: {
        // 初始化图表组件
        initChart() {
            if(this.chartInstance) return;
            
            this.chartInstance = new jmChart(this.$refs.jmChartContainer, this.options);
            
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
        }
    },

    template: `<div ref="jmChartContainer" :style="{width: width, height: height}"></div>`
}
