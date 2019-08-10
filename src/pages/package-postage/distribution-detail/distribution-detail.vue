<template>
  <div class="distribution-detail">
    <navigation-bar title="物流详情"></navigation-bar>
    <div class="info-box">
      <div class="info-top">{{distributionName}}</div>
      <div class="info-bottom">快递单号：{{distributionNo}}<span class="copy-btn" @click="copyHandle">复制</span>
      </div>
    </div>
    <div class="info-line"></div>
    <div class="info-list">
      <div class="list-item" v-for="(item, index) in distributionList" :key="index">
        <div class="item-title">{{item.remark}}</div>
        <div class="item-time">{{item.acceptTime}}</div>
        <div class="circle" :class="index === 0 ? 'first-circle' : ''"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import GetOptions from '@mixins/get-options'
  import API from '@api'

  const PAGE_NAME = 'DISTRIBUTION_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    mixins: [GetOptions],
    data() {
      return {
        distributionNo: '',
        distributionName: '',
        distributionList: '',
        order_sn: '',
        goods_sku_id: ''
      }
    },
    onShow() {
      this._initPageParams()
      this.getDistributionDetailData()
    },
    methods: {
      _initPageParams() {
        let options = this._$$initOptions()
        this.order_sn = options.orderSn
        this.goods_sku_id = options.id
      },
      copyHandle() {
        this.$wx.setClipboardData({
          data: this.distributionNo,
          success: function(res) {}
        })
      },
      getDistributionDetailData() {
        API.Postage.getDistributionDetail({order_sn: this.order_sn, goods_sku_id: this.goods_sku_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            if (res.data.length !== 0) {
              this.distributionNo = res.data[0].logistics_bill_no
              this.distributionName = res.data[0].logistics_company_name
              this.distributionList = res.data[0].logistics_steps
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .distribution-detail
    width: 100%
  .info-box
    padding: 20px 12px
    .info-top
      font-size: $font-size-16
      font-family: $font-family-regular
      color: #000
      margin-bottom: 10px
    .info-bottom
      font-size: $font-size-14
      font-family: $font-family-regular
      color: #000
      line-height : 1
      .copy-btn
        display inline-block
        width: 54px;
        margin-left: 15px;
        height: 20px;
        position: relative;
        text-align: center;
        line-height: 19px;
        box-sizing: border-box;
        font-family: 'PingFangSC-Regular';
        font-size: 12px;
        color: #111;
        letter-spacing: 0.3px;
        border: 1px solid $color-line
        border-radius : @height
  .info-line
    height: 10px
    width: 100%
    background: $color-background
  .info-list
    padding: 20px 40px
    box-sizing: border-box
    .list-item
      padding-bottom: 38px
      box-sizing: border-box
      position: relative
      &:after
        content: ""
        position: absolute
        top: 10px
        left: -15px
        width: 1px
        height: 100%
        transform: scaleX(.5) translateZ(0)
        border-left: 1px solid #E3E3E3
      .item-title
        font-size: $font-size-14
        font-family: $font-family-regular
        color: #000
        margin-bottom: 10px
      .item-time
        font-size: $font-size-14
        font-family: $font-family-regular
        color: #666
      .circle
        position: absolute
        width: 8px
        height: 8px
        left: -18px
        top: 7px
        background: #b7b7b7
        box-sizing: border-box
        border-radius: 50%
        border: 1px solid #fff
        z-index: 21
      .first-circle
        width: 13px
        height: 13px
        top: 4px
        left: -21px
        background: #FF5400
  .list-item
    &:last-child
      &:after
        display: none
  .distribution-detail
    width: 100%
</style>
