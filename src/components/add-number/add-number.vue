<template>
  <div class="link-group">
    <scroll-view scroll-y class="link-box" v-show="linkShow" @touchmove.prevent="" @click.stop="hideLink"></scroll-view>
    <div class="link-bottom" :class="linkShow ? 'show' : ''">
      <div class="goods-info">
        <div class="goods-info-left"></div>
        <div class="goods-info-right">
          <div class="title">智利J级车厘子250g</div>
          <div class="price-box">
            <div class="price-small">3.8</div>
            <div class="price-icon">元</div>
            <div class="price-line">12元</div>
          </div>
        </div>
      </div>
      <div class="order-num-box ">
        <div class="num-title">数量</div>
        <div class="num-btn-box1">
          <div class="left" @click.stop="subNum">
            <div class="cut" :class="showOrderNum ? 'cut1' : ''"></div>
          </div>
          <div class="count ">{{orderNum}}</div>
          <div class="right" @click.stop="addNum">
            <div class="add1"></div>
            <div class="add2"></div>
          </div>
        </div>
      </div>
      <div class="price-box">
        <div class="price-box-left">价格</div>
        <div class="price-box-right">
          <div class="number">11.9</div>
          <div class="icon">元</div>
        </div>
      </div>
      <button class="subimit-btn">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'ADD_NUMBER'

  export default {
    name: COMPONENT_NAME,
    props: {
      wechatTxt: {
        type: Object,
        default: ''
      },
      phoneTxt: {
        type: Object,
        default: ''
      }
    },
    data() {
      return {
        linkShow: false,
        orderNum: 1
      }
    },
    methods: {
      hideLink() {
        this.linkShow = false
      },
      showLink() {
        this.linkShow = true
      },
      clipWechat() {
        let that = this
        that.$wx.setClipboardData({
          data: this.wechatTxt,
          success: function(res) {
            that.$wx.getClipboardData({
              success: function(res) {}
            })
          }
        })
      },
      callPhone() {
        this.$wx.makePhoneCall({
          phoneNumber: this.phoneTxt
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .link-box
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    z-index: 100
    background: rgba(55, 75, 99, 0.8)
  .link-bottom
    position: fixed
    bottom: -130%
    left: 0
    background: #fff
    width:100%
    z-index: 150
    padding: 0 3.2vw 3.8vw
    transition: all .5s
    box-sizing: border-box
    .goods-info
      layout(row)
      height: 26.7vw
      border-bottom-1px(#e6e6e6)
      .goods-info-left
        width: 26.7vw
        height: 26.7vw
        background: #333
        margin-right: 4vw
        position: relative
        top: -6.9vw
        img
          width: 100%
          height: 100%
          display: block
          border-radius: 2px
      .goods-info-right
        padding-top: 4vw
        .title
          font-size: $font-size-16
          color: $color-text-main
          font-family: $font-family-medium
          line-height: 1
          min-height: $font-size-18
          margin-bottom: 10px
        .price-box
          layout(row)
          align-items: flex-end
          .price-small
            font-size: $font-size-20
            color: #000
            font-family: $font-family-medium
          .price-icon
            font-size: $font-size-12
            color: #000
            font-family: $font-family-medium
            padding-bottom: 2px
            margin-right: 4.5px
          .price-line
            font-size: $font-size-12
            color: $color-text-assist
            font-family: $font-family-medium
            padding-bottom: 2px
            text-decoration: line-through
  .order-num-box
    min-height: 20px
    display: flex
    box-sizing: border-box
    justify-content: space-between
    align-items: center
    padding: 26px 0
    .num-title
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-text-main
      width: 75px
    .num-btn-box1
      width: 120px
      height: 32px
      border-radius: 4px
      border-1px(#EEEEEE, 4px, solid, 2px)
      layout(row)
      .left, .right
        width: 35px
        height: 100%
        color: #919191
        font-size: $font-size-14
        layout(row)
        justify-content: center
        align-items: center
        .cut
          width: 10px
          height: 1.5px
          background: #625E61
        .cut1
          background: #D1D1D1
      .right
        .add1
          width: 11px
          height: 1.5px
          background-color: #625E61
        .add2
          width: 1.5px
          height: 10px
          background-color: #625E61
          transform: translateX(-6px)
      .count
        width: 48px
        height: 32px
        line-height: 34.5px
        text-align: center
        border-left: 1px solid $color-white
        border-right: 1px solid $color-white
        font-family: PingFangSC-Medium
        font-size: $font-size-14
      .left
        border-right: 1px solid #eee
      .right
        border-left: 1px solid #eee
  .price-box
    layout(row)
    align-items: center
    justify-content: space-between
    padding: 10px 0 50px
    .price-box-left
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-text-main
    .price-box-right
      layout(row)
      align-items: flex-end
      .number
        font-family: 'PingFang-SC-Bold'
        font-size: $font-size-20
        color: $color-money
        line-height: 1
      .icon
        font-family: $font-family-medium
        font-size: $font-size-12
        color: $color-money
  .subimit-btn
    width: 100%
    height: 50px
    line-height: 50px
    background: $color-main
    color: #fff
    border-radius: 50px
    &:after
      border: none
  .show
    bottom: 0
</style>
