<template>
  <div class="line-echarts">
    <div class="ec-box">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" :canvasId="typeId" :id="typeId" ref="echartsId"/>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as echarts from '@/static/ec-canvas/echarts'
  const COMPONENT_NAME = 'LINE_ECHARTS'

  export default {
    name: COMPONENT_NAME,
    props: {
      dataLine: {
        type: Object,
        default: [1, 2, 3, 4, 5, 6, 7]
      },
      typeId: {
        type: Object,
        default: 'echartsId'
      }
    },
    data() {
      return {
        echarts,
        onInit: this.initChart
      }
    },
    components: {
    },
    methods: {
      initChart(canvas, width, height) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        })
        canvas.setChart(chart)
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '15',
            right: '0',
            bottom: '15',
            top: '27',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              color: '#B7B7B7',
              fontSize: 9,
              align: 'center'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(108,123,138,0.08)',
                width: 0.5
              }
            },
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#B7B7B7',
              fontSize: 9,
              align: 'center'
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(108,123,138,0.08)',
                width: 0.5
              }
            },
            type: 'value'
          },
          series: [{
            data: this.dataLine,
            type: 'line',
            color: '#2D4692',
            areaStyle: {}
          }]
        }
        chart.setOption(option)
        return chart
      },
      initBtn() {
        this.$refs.echartsId.init()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .line-echarts
    width: 100%
  .ec-box
    height: 200px
    ec-canvas
      width: 100%
      height: 200px
</style>
