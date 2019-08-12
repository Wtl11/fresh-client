<template>
  <div class="choose-certificate">
    <navigation-bar title="兑换券"></navigation-bar>
    <div class="coupon">
      <div
        v-for="(child, childIdx) in dataArray"
        :key="childIdx"
        :class="[{'coupon-disable': child.status !== 1 }, {unableIndex: childIdx >= useAbleIndex}]"
        class="coupon-item c-mb"
      >
        <section class="top-wrapper" @click.stop="selectCoupon(child, childIdx)">
          <img class="top-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-couponbg_myzk1.png'">
          <div class="top-container">
            <artilce class="left">
              <div class="goods-box" :class="{unable: child.status !== 1 || childIdx >= useAbleIndex}">
                <img v-if="imageUrl && child.other_info" :src="child.other_info.goods_cover_image" class="goods-img" mode="aspectFill">
              </div>
            </artilce>
            <article class="right">
              <div class="title">
                <p class="use-type" :class="{unable: child.status !== 1 || childIdx >= useAbleIndex}">{{child.tag_type === 2? '满赠': '0元支付'}}</p>
                <p class="txt goods-name" :class="{unable: child.status !== 1 || childIdx >= useAbleIndex}">{{child.coupon_name}}</p>
              </div>
              <p class="explain">{{child.condition_str}}</p>
              <p class="condition">有效期至 {{child.end_at}}</p>
              <img class="lab-img" v-if="imageUrl && child.status === 2" :src="imageUrl + '/yx-image/2.3/pic-coupon_ygq.png'">
              <img class="lab-img" v-if="imageUrl && child.status === 0" :src="imageUrl + '/yx-image/2.3/pic-coupon_ysy.png'">
              <figure v-if="childIdx < useAbleIndex" class="tool-wrapper">
                <img class="sel-box"
                     :class="{active: !child.isChecked}"
                     v-if="imageUrl"
                     :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" alt=""/>
                <img class="sel-box"
                     :class="{active: child.isChecked}"
                     v-if="imageUrl"
                     :src="imageUrl+'/yx-image/cart/icon-pick1@2x.png'" alt=""/>
              </figure>
            </article>
          </div>
        </section>
<!--        <div class="select" v-if="child.status === 1">立即兑换</div>-->
        <section class="middle-wrapper">
          <img class="middle-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk2.png'">
          <div class="middle-container">
            <div class="middle-box" @click.stop="handleShowTip(child, childIdx)">
              <aritlce class="title">
                <p>{{childIdx >= useAbleIndex?'不可用原因': '使用说明'}}</p>
                <img class="down-img" :class="{'rotate': child.showTip}" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed_down@2x.png'">
              </aritlce>
            </div>
            <p v-if="child.showTip" class="explain">{{childIdx >= useAbleIndex?child.unusable_reason:child.description}}</p>
          </div>
        </section>
        <section class="bottom-wrapper">
          <img class="bottom-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk3.png'">
        </section>
      </div>
      <is-active-empty v-if="isShowEmpty"></is-active-empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  // import Coupon from '../commodity-certificates/coupon'
  import isActiveEmpty from '@components/is-active-empty/is-active-empty'
  import API from '@api'
  import { orderComputed, orderMethods } from '@state/helpers'

  const PAGE_NAME = 'CHOOSE_CERTIFICATE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      isActiveEmpty
    },
    data() {
      // let arr = Coupon.create({status: 1}, 3)
      // let arr2 = Coupon.create({status: 0}, 10)
      return {
        dataArray: [],
        useAbleIndex: -1,
        isShowEmpty: false
      }
    },
    computed: {
      ...orderComputed
    },
    onLoad() {
      // 1. 请求服务器获取列表
      this._getList()
    },
    methods: {
      ...orderMethods,
      async _getList() {
        let res, arr, data
        res = await API.Coupon.getChooseList({ goods: this.goodsList, is_usable: 1, tag_type: 2 }, true)
        data = res.data || []
        arr = data
        this.useAbleIndex = arr.length
        res = await API.Coupon.getChooseList({ goods: this.goodsList, is_usable: 0, tag_type: 2 }, false)
        data = res.data || []
        arr = arr.concat(data)
        arr = arr.map(item => {
          item.isChecked = item.customer_coupon_id === this.certificate.customer_coupon_id
          item.showTip = false
          return item
        })
        this.isShowEmpty = !arr.length
        this.dataArray = arr
      },
      handleShowTip(child, index) {
        child.showTip = !child.showTip
      },
      selectCoupon(child, index) {
        if (child.status !== 1) return
        const pre = this.dataArray.find(val => val.isChecked)
        if (pre && pre !== child) {
          pre.isChecked = false
        }
        child.isChecked = !child.isChecked
        if (child.isChecked) {
          this['SAVE_CERTIFICATE'](child)
          wx.navigateBack()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../design/certificate.styl"

  .choose-certificate
    min-height: 100vh
    background: #f7f7f7

  .coupon
    padding-top :1.8vw
    box-sizing: border-box
    .coupon-item
      &.c-mb
        margin-bottom: px2vw(19.5)
      &.unableIndex
        margin-bottom : px2vw(30.5)
</style>
