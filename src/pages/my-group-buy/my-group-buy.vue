<template>
  <div class="my-group-buy">
    <navigation-bar ref="navigationBar" title="我的拼团" showArrow="true"></navigation-bar>
<!--    <div style="width: 200px;height: 100px;background: aqua" @click="_getCouponList"></div>-->
    <ul v-if="groupBuyList.length" class="goods-list">
      <li class="goods-item-box" v-for="(item, index) in groupBuyList" :key="index">
        {{item.social_name}}
        {{item.created_at}}
        <p style="color: deeppink">{{item.at_countdown.hour}}:{{item.at_countdown.minute}}:{{item.at_countdown.second}}</p>
      </li>
      <li class="foot-ties" v-if="!hasMore && !isShowEmpty">
        <div class="lines left"></div>
        <div class="lines right"></div>
        <div class="center">再拉也没有了</div>
      </li>
    </ul>
    <section class="noting" v-else-if="isShowEmpty">
      <div class="noting-img">
        <img class="img" v-if="imageUrl" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt="">
      </div>
      <div class="txt">空空如也</div>
    </section>
    <coupon-modal ref="couponModal"></coupon-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {countDownHandle} from '@utils/common'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponModal from './coupon-modal/coupon-modal'

  const PAGE_NAME = 'MY_GROUP_BUY'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponModal
    },
    data() {
      return {
        groupBuyList: [],
        hasMore: true,
        isShowEmpty: false,
        page: 1,
        limit: 10
      }
    },
    computed: {},
    onLoad() {
      this._getGroupBuyList()
    },
    onUnload() {
      this.groupTimer && clearInterval(this.groupTimer)
    },
    onHide() {
      this.groupTimer && clearInterval(this.groupTimer)
    },
    methods: {
      async _getGroupBuyList() {
        API.Order.getOrderListData('', this.page).then((res) => {
          if (res.error === this.$ERR_OK) {
            for (let v of res.data) {
              v.at_diff = 3333 + parseInt((Math.random() * 1000))
              v.at_countdown = countDownHandle(v.at_diff)
            }
            this.groupBuyList = this.groupBuyList.concat(res.data)
            this._startTimer()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      async _getCouponList() {
        let couponArr = [
          {
            coupon: {
              preferential_type: 1,
              range_type_str: 'bbb',
              coupon_name: 'aaa',
              end_at: '2019-5-30',
              denomination: 100
            }
          },
          {
            coupon: {
              preferential_type: 2,
              range_type_str: 'bbbccc',
              coupon_name: 'aaaddd',
              end_at: '2019-5-31',
              denomination: 10
            }
          }
        ]
        couponArr && this._ref('couponModal', 'show', couponArr)
      },
      _startTimer() {
        this.groupTimer = setInterval(() => {
          let clearT = true
          for (let item of this.groupBuyList) {
            if (item.at_diff && item.at_diff !== 0) {
              item.at_diff--
              item.at_countdown = countDownHandle(item.at_diff)
              clearT = false
            }
          }
          clearT && clearInterval(this.groupTimer)
        }, 1000)
      },
      _clearTimer() {},
      // 工具-->调用子节点的方法
      _ref(key, fn, params) {
        this.$refs[key] && this.$refs[key][fn] && this.$refs[key][fn](params)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

</style>
