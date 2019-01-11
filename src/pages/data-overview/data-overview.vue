<template>
  <div class="data-overview">
    <navigation-bar title="数据统计" :exceedHeightFn="false"></navigation-bar>
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
      <div class="data-box-number">{{commission.curr_total}}</div>
      <div class="data-box-time">
        <div class="time-text">较前{{commissionDiff}}日</div>
        <div class="time-number" v-if="commission.curr_percent">{{commission.curr_percent.percent}}</div>
        <div class="time-img" v-if="commission.curr_percent">
          <img src="" alt="" class="icon-img"  v-if="imageUrl && commission.curr_percent.is_up * 1 === -1" :src="imageUrl + '/yx-image/wallet/icon-decline@2x.png'">
          <img src="" alt="" class="icon-img"  v-if="imageUrl && commission.curr_percent.is_up * 1 === 1" :src="imageUrl + '/yx-image/wallet/icon-rise@2x.png'">
        </div>
      </div>
      <div class="data-list-box">
        <ul class="data-list">
          <li class="list-item">
            <div class="title">支付客户(人)</div>
            <div class="number">{{consume.curr_total}}</div>
            <div class="percentage">
              <div class="percentage-text" v-if="consume.curr_percent">{{consume.curr_percent.percent}}</div>
              <div class="percentage-img" v-if="consume.curr_percent">
                <img src="" alt="" class="icon-img"  v-if="imageUrl && consume.curr_percent.is_up * 1 === -1" :src="imageUrl + '/yx-image/wallet/icon-decline@2x.png'">
                <img src="" alt="" class="icon-img"  v-if="imageUrl && consume.curr_percent.is_up * 1 === 1" :src="imageUrl + '/yx-image/wallet/icon-rise@2x.png'">
              </div>
            </div>
          </li>
          <li class="list-item">
            <div class="title">平均下单数</div>
            <div class="number">{{averageOrder.curr_total}}</div>
            <div class="percentage">
              <div class="percentage-text" v-if="averageOrder.curr_percent">{{averageOrder.curr_percent.percent}}</div>
              <div class="percentage-img" v-if="averageOrder.curr_percent">
                <img src="" alt="" class="icon-img"  v-if="imageUrl && averageOrder.curr_percent.is_up * 1 === -1" :src="imageUrl + '/yx-image/wallet/icon-decline@2x.png'">
                <img src="" alt="" class="icon-img"  v-if="imageUrl && averageOrder.curr_percent.is_up * 1 === 1" :src="imageUrl + '/yx-image/wallet/icon-rise@2x.png'">
              </div>
            </div>
          </li>
          <li class="list-item">
            <div class="title">笔单价(元)</div>
            <div class="number">{{orderPrice.curr_total}}</div>
            <div class="percentage">
              <div class="percentage-text" v-if="orderPrice.curr_percent">{{orderPrice.curr_percent.percent}}</div>
              <div class="percentage-img" v-if="orderPrice.curr_percent">
                <img src="" alt="" class="icon-img"  v-if="imageUrl && orderPrice.curr_percent.is_up * 1 === -1" :src="imageUrl + '/yx-image/wallet/icon-decline@2x.png'">
                <img src="" alt="" class="icon-img"  v-if="imageUrl && orderPrice.curr_percent.is_up * 1 === 1" :src="imageUrl + '/yx-image/wallet/icon-rise@2x.png'">
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title" @click="showMsg(0)">
        <div class="text">佣金收益</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
      <div class="ec-box" v-if="showCommissionLine" :class="showOpacity ? 'ec-none' : ''">
        <ec-canvas class="canvas" id="chart-dom-line" canvas-id="chart-line" :ec="commissionLine"></ec-canvas>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title" @click="showMsg(1)">
        <div class="text">访客数</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
      <div class="ec-box" v-if="showLine" :class="showOpacity ? 'ec-none' : ''">
        <ec-canvas class="canvas" id="customer-dom-line" canvas-id="customer-line" :ec="line"></ec-canvas>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title" @click="showMsg(2)">
        <div class="text">支付客户数</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
      <div class="pie-number-box">
        <div class="pie-number">
          <div class="icon"></div>
          <div class="text">复购客户</div>
        </div>
        <div class="pie-number">
          <div class="icon"></div>
          <div class="text">首次消费客户</div>
        </div>
      </div>
      <div class="ec-box" v-if="showPie" :class="showOpacity ? 'ec-none' : ''">
        <ec-canvas class="canvas" id="chart-dom-pie" canvas-id="chart-pie" :ec="pie"></ec-canvas>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title" @click="showMsg(3)">
        <div class="text">每{{orderDiff}}日平均下单数</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
      <div class="ec-box" v-if="showMeanLine" :class="showOpacity ? 'ec-none' : ''">
        <ec-canvas class="canvas" id="order-dom-line" canvas-id="order-line" :ec="meanLine"></ec-canvas>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title" @click="showMsg(4)">
        <div class="text">笔单价</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
      <div class="ec-box" v-if="showOrderLine" :class="showOpacity ? 'ec-none' : ''">
        <ec-canvas class="canvas" id="order-dom-line" canvas-id="order-line" :ec="orderLine"></ec-canvas>
      </div>
    </div>
    <confirm-msg ref="colseModel" useType="close" :msg="msg" title="" @cancel="cancelMsg"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'

  const PAGE_NAME = 'DATA_OVERVIEW'
  const NAVLIST = [{text: '昨日', stats: 'yesterday'}, {text: '近7日', stats: 'week'}, {text: '近30日', stats: 'month'}, {text: '近90日', stats: 'season'}]
  export default {
    name: PAGE_NAME,
    data() {
      return {
        navIndex: 0,
        commissionLine: {
          options: {
            tooltip: {
              trigger: 'axis',
              position: ['40%', '0%'],
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
              bottom: '25',
              top: '25',
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
              minInterval: 1,
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
              lineStyle: {
                normal: {
                  width: 3
                }
              },
              color: '#00EAFF',
              symbolSize: 7,
              itemStyle: {
                normal: {
                  borderWidth: 3,
                  lineStyle: {
                    width: 3
                  }
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
        orderLine: {
          options: {
            tooltip: {
              trigger: 'axis',
              position: ['40%', '0%'],
              formatter: '笔单价{c0}元',
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
              bottom: '25',
              top: '25',
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
              data: []
            },
            yAxis: {
              minInterval: 1,
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
              lineStyle: {
                normal: {
                  width: 3
                }
              },
              color: '#00EAFF',
              symbolSize: 7,
              itemStyle: {
                normal: {
                  borderWidth: 3,
                  lineStyle: {
                    width: 3
                  }
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
        meanLine: {
          options: {
            tooltip: {
              trigger: 'axis',
              position: ['40%', '0%'],
              formatter: '平均下单数{c}',
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
              bottom: '25',
              top: '25',
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
              data: []
            },
            yAxis: {
              minInterval: 1,
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
              data: [],
              type: 'line',
              lineStyle: {
                normal: {
                  width: 3
                }
              },
              color: '#00EAFF',
              symbolSize: 7,
              itemStyle: {
                normal: {
                  borderWidth: 3,
                  lineStyle: {
                    width: 3
                  }
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
              position: ['40%', '0%'],
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
              data: []
            },
            yAxis: {
              minInterval: 1,
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
              data: [],
              name: '访客数',
              type: 'line',
              color: '#00EAFF',
              lineStyle: {
                normal: {
                  width: 3
                }
              },
              symbolSize: 7,
              itemStyle: {
                normal: {
                  borderWidth: 3,
                  lineStyle: {
                    width: 3
                  }
                }
              }
            }, {
              data: [],
              name: '新访客数',
              type: 'line',
              color: '#FF8B77',
              lineStyle: {
                normal: {
                  width: 3
                }
              },
              symbolSize: 7,
              itemStyle: {
                normal: {
                  borderWidth: 3,
                  lineStyle: {
                    width: 3
                  }
                }
              }
            }]
          }
        },
        pie: {
          options: {
            tooltip: {
              trigger: 'item',
              formatter: '{b}{c}人'
            },
            series: [
              {
                name: '支付客户数',
                type: 'pie',
                // radius: ['50%', '65%'],
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
                color: ['#00EAFF', '#FF8B77'],
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
        dataLine: [],
        consume: {},
        orderPrice: {},
        commission: {},
        averageOrder: {},
        commissionDiff: '',
        showCommissionLine: false,
        showLine: false,
        showMeanLine: false,
        showPie: false,
        showOrderLine: false,
        orderDiff: 7,
        msg: '',
        showOpacity: false
      }
    },
    components: {
      NavigationBar,
      ConfirmMsg
    },
    onLoad() {
      this.getCommissionData('yesterday')
      this.getCommissionLine('yesterday')
      this.getCustomerLine('yesterday')
      this.getMeanLine('yesterday')
      this.getCustomerPie('yesterday')
      this.getOrderLine('yesterday')
    },
    methods: {
      clickNav(item, index) {
        if (this.navIndex === index) return
        this.getCommissionData(item.stats)
        this.getCommissionLine(item.stats)
        this.getCustomerLine(item.stats)
        this.getMeanLine(item.stats)
        this.getCustomerPie(item.stats)
        this.getOrderLine(item.stats)
        this.navIndex = index * 1
      },
      showMsg(index) {
        switch (index * 1 + 10) {
          case 0:
            this.msg = '佣金收益=交易金额*佣金比例，包含待入账和已入账的佣金'
            this.$refs.colseModel.show()
            this.showOpacity = true
            break
          case 1:
            this.msg = '访客数即进入商城的客户人数，包含新访客和老访客人数'
            this.$refs.colseModel.show()
            this.showOpacity = true
            break
          case 2:
            this.msg = '消费客户数即购买了商品的客户人数，包含首次消费客户和复购客户人数'
            this.$refs.colseModel.show()
            this.showOpacity = true
            break
          case 3:
            this.msg = '每7日平均下单数即消费客户每周平均购买次数，数据越高说明客户黏性越大'
            this.$refs.colseModel.show()
            this.showOpacity = true
            break
          case 4:
            this.msg = '客单价即消费客户购买一次商品的金额'
            this.$refs.colseModel.show()
            this.showOpacity = true
            break
        }
      },
      getCommissionData(time) {
        API.Data.getExchangeData({time: time, start_time: '', end_time: ''}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.consume = res.data.consume
            this.orderPrice = res.data.order_price
            this.commission = res.data.commission
            this.averageOrder = res.data.average_order
            this.commissionDiff = res.data.diff
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getCommissionLine(time) {
        API.Data.getCommission({time: time, start_time: '', end_time: ''}).then((res) => {
          if (res.error === this.$ERR_OK) {
            let date = this._infoDate(res.data)
            let arr = this._infoData(res.data)
            this.commissionLine.options.series[0].data = arr.value
            this.commissionLine.options.xAxis.data = date
            this.showCommissionLine = false
            setTimeout(() => {
              this.showCommissionLine = true
            }, 100)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getOrderLine(time) {
        API.Data.getOrderPrice({time: time, start_time: '', end_time: ''}).then((res) => {
          if (res.error === this.$ERR_OK) {
            let date = this._infoDate(res.data)
            let arr = this._infoData(res.data)
            this.orderLine.options.series[0].data = arr.value
            this.orderLine.options.xAxis.data = date
            this.showOrderLine = false
            setTimeout(() => {
              this.showOrderLine = true
            }, 100)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getMeanLine(time) {
        API.Data.getMeanCustomer({time: time, start_time: '', end_time: ''}).then((res) => {
          if (res.error === this.$ERR_OK) {
            let date = this._infoDate(res.data)
            let arr = this._infoData(res.data)
            this.meanLine.options.series[0].data = arr.value
            this.meanLine.options.xAxis.data = date
            this.showMeanLine = false
            setTimeout(() => {
              this.showMeanLine = true
            }, 100)
          } else {
            this.showMeanLine.showToast(res.message)
          }
        })
      },
      getCustomerLine(time) {
        API.Data.getCustomer({time: time, start_time: '', end_time: ''}).then((res) => {
          if (res.error === this.$ERR_OK) {
            let date = this._infoDate(res.data)
            let arr = this._infoData(res.data)
            this.line.options.series[0].data = arr.value
            this.line.options.series[1].data = arr.value1
            this.line.options.xAxis.data = date
            this.showLine = false
            setTimeout(() => {
              this.showLine = true
            }, 100)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getCustomerPie(time) {
        API.Data.getPayCustomer({time: time, start_time: '', end_time: ''}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.pie.options.series[0].data[0].value = res.data.second_consume_count
            this.pie.options.series[0].data[1].value = res.data.first_consume_count
            this.showPie = false
            setTimeout(() => {
              this.showPie = true
            }, 100)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _infoDate(data, type = 'at') {
        if (!data.length) {
          return false
        }
        let date = []
        data.forEach((item) => {
          date.push(item[type])
        })
        return date
      },
      _infoData(data) {
        if (!data.length) {
          return
        }
        let arr = {}
        for (let value in data[0]) {
          if (value !== 'at') {
            arr[value] = []
          }
        }
        data.forEach((item) => {
          for (let value in item) {
            if (value !== 'at') {
              arr[value].push(item[value])
            }
          }
        })
        return arr
      },
      cancelMsg() {
        this.showOpacity = false
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
    padding: 0 10px
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
            img
              width: 10px
              height: 10px
              display: block
  .charts-box
    height: 230px
    background: $color-white
    margin-bottom: 10px
    position: relative
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
        display: none
        width: 13px
        height: 13px
        img
          width: 100%
          height: 100%
          display: block
  .pie-number-box
    position: absolute
    top: 70px
    right: 15px
    .pie-number
      layout(row)
      align-items: center
      margin-bottom: 10px
      .icon
        width: 5px
        height: 5px
        border-radius: 50%
        background-image: linear-gradient(-90deg, #00EAFF 0%, #21CDD3 100%)
        margin-right: 5px
      .text
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-main
    .pie-number:nth-of-type(2)
      .icon
        background-image: linear-gradient(-90deg, #FF8B77 0%, #FE6AAC 100%)
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
  .ec-none
    opacity: 0
</style>
