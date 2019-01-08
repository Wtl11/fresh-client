<template>
  <div class="data-overview">
    <navigation-bar title="数据统计"></navigation-bar>
    <div class="income-nav">
      <div class="income-nav-box">
        <div class="item-nav" v-for="(item, index) in navList" v-bind:key="index" @click="clickNav(item, index)" :class="{'item-nav-active': navIndex === index}">{{item.text}}</div>
        <div class="nav-line-box">
          <div class="nav-line" :style="{'transform': ' translateX('+ (navIndex * 100) +'%)'}">
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-box">
      <div class="data-box-title">佣金收益(元)</div>
      <div class="data-box-number">820.00</div>
      <div class="data-box-time">
        <div class="time-text">较前7日</div>
        <div class="time-number">20%</div>
        <div class="time-img">
          <!--<img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-decline@2x.png'">-->
        </div>
      </div>
      <div class="data-list-box">
        <ul class="data-list">
          <li class="list-item">
            <div class="title">支付客户(人)</div>
            <div class="number">506</div>
            <div class="percentage">
              <div class="percentage-text">20%</div>
              <div class="percentage-img">
                <!--<img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-decline@2x.png'">-->
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title">
        <div class="text">佣金收益</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
      <div class="ec-box" v-if="showLine">
        <ec-canvas class="canvas" id="chart-dom-line" canvas-id="chart-line" :ec="ec"></ec-canvas>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title">
        <div class="text">访客数</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
      <div class="ec-box" v-if="showLine">
        <ec-canvas class="canvas" id="customer-dom-line" canvas-id="customer-line" :ec="line"></ec-canvas>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title">
        <div class="text">支付客户数</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
      <div class="ec-box" v-if="showLine">
        <ec-canvas class="canvas" id="chart-dom-pie" canvas-id="chart-pie" :ec="pie"></ec-canvas>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import LineEcharts from '@components/line-echarts/line-echarts'

  const PAGE_NAME = 'DATA_OVERVIEW'
  const NAVLIST = [{text: '昨日', stats: 0}, {text: '近7日', stats: 1}, {text: '近30日', stats: 2}, {text: '近90日', stats: 3}]
  export default {
    name: PAGE_NAME,
    data() {
      return {
        navIndex: 0,
        ec: {
          options: {
            tooltip: {
              trigger: 'axis',
              position: ['50%', '50%'],
              formatter: '佣金收益{c0}元',
              axisPointer: {
                lineStyle: {
                  color: '#ccc',
                  width: 0.5
                }
              },
              padding: [10, 10, 10, 10]
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
              data: [1, 2, 3, 4, 5, 6, 6],
              type: 'line',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0, color: '#00EAFF'
                  },
                  {
                    offset: 1, color: '#21CDD3'
                  }
                ]
              },
              itemStyle: {
                normal: {
                  shadowBlur: 30,
                  shadowColor: 'rgba(255,255,255,1)',
                  shadowOffsetX: -5,
                  shadowOffsetY: 5

                }
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(26,212,221, 0.5)'
                  }, {
                    offset: 1, color: 'rgba(255,255,255, 0)'
                  }],
                  globalCoord: false
                }
              }
            }]
          }
        },
        line: {
          options: {
            tooltip: {
              trigger: 'axis',
              position: ['50%', '50%'],
              formatter: '佣金收益{c0}元',
              axisPointer: {
                lineStyle: {
                  color: '#ccc',
                  width: 0.5
                }
              },
              padding: [10, 10, 10, 10]
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
              data: [1, 2, 3, 4, 5, 6, 6],
              type: 'line',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0, color: '#00EAFF'
                  },
                  {
                    offset: 1, color: '#21CDD3'
                  }
                ]
              },
              itemStyle: {
                normal: {
                  shadowBlur: 30,
                  shadowColor: 'rgba(255,255,255,1)',
                  shadowOffsetX: -5,
                  shadowOffsetY: 5

                }
              }
            }, {
              data: [22, 33, 31, 14, 5, 6, 16],
              type: 'line',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0, color: '#FF8B77'
                  },
                  {
                    offset: 1, color: '#FE6AAC'
                  }
                ]
              },
              itemStyle: {
                normal: {
                  shadowBlur: 30,
                  shadowColor: 'rgba(255,255,255,1)',
                  shadowOffsetX: -5,
                  shadowOffsetY: 5

                }
              }
            }]
          }
        },
        pie: {
          options: {
            tooltip: {
              trigger: 'item',
              formatter: '{b}'
            },
            series: [
              {
                name: '支付客户数',
                type: 'pie',
                radius: ['50%', '80%'],
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: 135, name: '复购客户'},
                  {value: 300, name: '首次消费客户'}
                ],
                color: [
                  {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0, color: '#00EAFF'
                      },
                      {
                        offset: 1, color: '#21CDD3'
                      }
                    ]
                  },
                  {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0, color: '#FF8B77'
                      },
                      {
                        offset: 1, color: '#FE6AAC'
                      }
                    ]
                  }
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }
            ]
          }
        },
        navList: NAVLIST,
        dataLine: [1, 2, 3, 4, 5, 6, 6],
        showLine: true
      }
    },
    components: {
      NavigationBar,
      LineEcharts
    },
    methods: {
      clickNav(item, index) {
        if (this.navIndex === index) return
        if (index * 1 === 0) {
          this.dataLine = [2, 3, 5, 2, 5, 10, 10]
        } else if (index * 1 === 1) {
          this.dataLine = [7, 6, 9, 2, 5, 6, 6]
        } else if (index * 1 === 2) {
          this.dataLine = [2, 3, 9, 2, 5, 6, 6]
        } else if (index * 1 === 3) {
          this.dataLine = [11, 22, 9, 2, 5, 3, 3]
        }
        this.ec.options.series[0].data = this.dataLine
        this.showLine = false
        setTimeout(() => {
          this.showLine = true
        }, 100)
        this.navIndex = index * 1
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .data-overview
    width: 100%
    min-height: 100vh
    background: $color-background
    padding-bottom: 20px
  .income-nav
    height: 40px
    padding: 0 20px
    margin-bottom: 10px
    background: $color-white
    .income-nav-box
      layout(row)
      position: relative
      align-items: center
      width: 100%
      height: 40px
      .item-nav
        width: 25%
        height: 100%
        font-size: $font-size-15
        font-family: $font-family-regular
        color: $color-text-sub
        text-align: center
        line-height: 40px
      .item-nav-active
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        transition: all 0.3s
      .nav-line-box
        position: absolute
        bottom: 1px
        left: 0
        height: 3px
        width: 100%
        .nav-line
          width: 25%
          height: 100%
          transition: all 0.3s
          .line
            width: 30px
            height: 100%
            background: $color-main
            border-radius: 1.5px
            margin: auto
  .data-box
    background: $color-white
    padding: 25px 0
    margin-bottom: 10px
  .data-box-title
    font-size: $font-size-12
    font-family: $font-family-regular
    color: $color-text-sub
    text-align: center
    margin-bottom: 9px
  .data-box-number
    font-size: 34px
    font-family: $font-family-regular
    color: $color-text-main
    text-align: center
    min-height: 34px
    margin-bottom: 9px
  .data-box-time
    layout(row)
    align-items: center
    justify-content: center
    margin-bottom: 40px
    .time-text
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-sub
      margin-right: 10px
    .time-number
      font-size: $font-size-12
      font-family: $font-family-regular
      color: #171F24
      margin-right: 4px
    .time-img
      width: 10px
      height: 10px
      img
        width: 100%
        height: 100%
        display: block
  .data-list-box
    padding: 0 15px
    box-sizing: border-box
    .data-list
      width: 100%
      layout(row)
      .list-item
        width: 33.33%
        .title
          text-align: center
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-text-sub
          margin-bottom: 10px
        .number
          text-align: center
          font-size: $font-size-20
          font-family: $font-family-regular
          color: $color-text-main
          margin-bottom: 10px
        .percentage
          layout(row)
          justify-content: center
          align-items: center
          .percentage-text
            font-size: $font-size-12
            font-family: $font-family-regular
            color: #171F24
            margin-right: 4px
          .percentage-img
            width: 10px
            height: 10px
            img
              width: 100%
              height: 100%
              display: block
  .charts-box
    height: 230px
    background: $color-white
    margin-bottom: 10px
    .charts-title
      layout(row)
      align-items: center
      padding: 17px 0 0 15px
      .text
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        margin-right: 5px
      .icon
        width: 13px
        height: 13px
        img
          width: 100%
          height: 100%
          display: block
  .ec-box
    height: 200px
    .ec-null
      line-height: 200px
      text-align: center
      font-family: $font-family-light
      font-size: $font-size-small
      color: #959DBD
    ec-canvas
      width: 100%
      height: 100%
</style>
