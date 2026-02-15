

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
            option: this.chartOptions
        }
    },
    chartInstance: null,

    mounted () {
        this.option = Object.assign({
            enableAnimate: false,
            legendPosition: 'top',
            legendVisible: true,
            width: this.width,
            height: this.height        
        }, this.chartOptions);   
        
        this.initChart();
    },

    updated() {
        this.initChart();
    },

    destroyed() {
        this.chartInstance && this.chartInstance.destroy();
    },

    watch: {
        chartData: function(newData, oldData) {
            this.refresh();
        },
        width: function(newWidth, oldWidth) {
            if(!this.chartInstance) return;            
            this.$nextTick(() => {
                if(!this.chartInstance || !this.$refs.jmChartContainer) return;          
                this.chartInstance.width = this.$refs.jmChartContainer.clientWidth || this.$refs.jmChartContainer.offsetWidth;
            });
        },
        height: function(newHeight, oldHeight) {
            if(!this.chartInstance) return;
            this.$nextTick(() => {
                if(!this.chartInstance || !this.$refs.jmChartContainer) return;          
                this.chartInstance.height = this.$refs.jmChartContainer.clientHeight || this.$refs.jmChartContainer.offsetHeight;
            });
        }
    },

    methods: {
        initChart() {
            if(this.chartInstance) return;
            
            this.chartInstance = new jmChart(this.$refs.jmChartContainer, this.option);
            
            if(this.chartData && this.chartData.length) this.refresh();
            
            this.chartInstance.bind('touchPointChange', (args) => {
                this.$emit('touch-point-change', args);
            });

            this.chartInstance.bind('marklinelongtapstart', (args) => {
                this.$emit('markline-longtap-start', args);
            });
            this.chartInstance.bind('marklinestartmove', (args) => {
                this.$emit('markline-start-move', args);
            });
            this.chartInstance.bind('marklinemove', (args) => {
                this.$emit('markline-move', args);
            });
            this.chartInstance.bind('marklineendmove', (args) => {
                this.$emit('markline-end-move', args);
            });

            this.chartInstance.touchGraph.bind('touchstart mousedown', (args) => {
                this.$emit('touchstart', args);
                this.$emit('mousedown', args);
            });
            this.chartInstance.touchGraph.bind('touchmove mousemove', (args) => {
                this.$emit('touchmove', args);
                this.$emit('mousemove', args);
            });
            this.chartInstance.touchGraph.bind('touchend touchcancel mouseup', (args) => {
                this.$emit('touchend', args);
                this.$emit('mouseup', args);
            });
            this.chartInstance.touchGraph.bind('touchleave', (args) => {
                this.$emit('touchleave', args);
            });
        },

        refresh() {
            this.$nextTick(() => {
                this.initChart();

                this.chartInstance.reset();
    
                if(this.chartSeries && this.chartSeries.length) {
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
            });            
        }
    },

    template: `<div ref="jmChartContainer" :style="{width: width, height: height}"></div>`
}
