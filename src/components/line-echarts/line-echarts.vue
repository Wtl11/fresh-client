<template>
  <div class="line-echarts">
    <div class="ec-box">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="echartsId" id="echartsId"/>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as echarts from '@/static/ec-canvas/echarts'
  import mpvueEcharts from 'mpvue-echarts'
  const COMPONENT_NAME = 'LINE_ECHARTS'

  export default {
    name: COMPONENT_NAME,
    props: {
      dataLine: {
        type: Object,
        default: [1, 2, 3, 4, 5, 6]
      }
    },
    data() {
      return {
        echarts,
        onInit: this.initChart
      }
    },
    components: {
      mpvueEcharts
    },
    methods: {
      initChart(canvas, width, height) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        })
        canvas.setChart(chart)
        var option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.dataLine,
            type: 'line'
          }]
        }
        chart.setOption(option)
        return chart
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
