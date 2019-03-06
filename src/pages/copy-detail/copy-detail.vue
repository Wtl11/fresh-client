<template>
  <div class="copy-detail">
    <navigation-bar title="商品详情"></navigation-bar>
    <div class="copy-top">
      <div class="copy-text">{{goodsMsg.name}}</div>
      <div class="copy-text">市场价：{{goodsMsg.original_price}}元/{{goodsMsg.goods_units}}</div>
      <div class="copy-text">团购价：{{goodsMsg.trade_price}}元/{{goodsMsg.goods_units}}</div>
      <div class="copy-text">限量{{goodsMsg.total_stock}}{{goodsMsg.goods_units}}，限购{{buyGoodsInfo.person_day_buy_limit}}{{goodsMsg.goods_units}}/人</div>
    </div>
    <div class="copy-sub">强烈推荐：{{goodsMsg.describe}}</div>
    <img v-for="(item, index) in goodsImgList" v-if="item.image_url" :src="item.image_url" class="detail-img"  mode="widthFix" :key="index">
    <div class="fixed-box">
      <div class="fixed-btn-box " @click="clipOrderId">
        <div class="fixed-btn-small-box fixed-btn-small-box-bg">
          <div class="icon">
            <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/retuan/icon-copy@2x.png'">
          </div>
          <div class="text">一键复制</div>
        </div>
      </div>
      <button open-type="share" class="fixed-btn-box fixed-btn-share">
        <span class="fixed-btn-small-box"  :class="'corp-' + corpName + '-bg'">
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/retuan/icon-share_goods@2x.png'">
        </div>
        <div class="text">分享到群</div>
        </span>
      </button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'COPY_DETAIL'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        goodsId: null,
        activityId: null,
        goodsMsg: {},
        goodsImgList: [],
        thumb_image: '',
        buyGoodsInfo: {}
      }
    },
    onLoad(options) {
      this.goodsId = options.id
      this.activityId = options.activityId
      this.getGoodsDetail()
      this.getGoodsOtherInfo()
      this.getGoodsDetailDataThumb()
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('shopId')
      return {
        title: this.goodsMsg.name,
        path: `/pages/goods-detail?id=${this.goodsId}&shopId=${shopId}&activityId=${this.activityId}`, // 商品详情
        imageUrl: this.thumb_image || this.goodsMsg.goods_cover_image,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    methods: {
      clipOrderId() {
        let that = this
        that.$wx.setClipboardData({
          data: `${this.goodsMsg.name}
市场价：${this.goodsMsg.original_price}元/${this.goodsMsg.goods_units}
团购价：${this.goodsMsg.trade_price}元/${this.goodsMsg.goods_units}
限量${this.goodsMsg.total_stock}${this.goodsMsg.goods_units}，限购${this.buyGoodsInfo.person_day_buy_limit}${this.goodsMsg.goods_units}/人
强烈推荐：${this.goodsMsg.describe}`,
          success: function(res) {
            that.$wx.getClipboardData({
              success: function(res) {}
            })
          }
        })
        this.goodsImgList.map((item) => {
          let that = this
          this.$wx.downloadFile({
            url: item.image_url, // 仅为示例，并非真实的资源
            success(res) {
              if (res.statusCode === 200) {
                that.$wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: () => {
                  },
                  fail: () => {
                    // 拒绝授权重新调起授权
                    this.active = 1
                    this.$wx.openSetting()
                  }
                })
              }
            }
          })
        })
      },
      getGoodsDetail() {
        API.Choiceness.copyGoodsDetail(this.goodsId, {is_presell_goods: 1, activity_id: this.activityId}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.goodsMsg = res.data
            let data = {
              image_url: this.goodsMsg.goods_cover_image
            }
            this.goodsImgList.push(data)
            this.goodsImgList = this.goodsImgList.concat(res.data.goods_detail_images)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getGoodsOtherInfo() {
        API.Choiceness.getGoodsBuyInfo(this.goodsId, {activity_id: this.activityId}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.buyGoodsInfo = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getGoodsDetailDataThumb() {
        API.Choiceness.getGoodsDetailsThumb({goods_id: this.goodsId, activity_id: this.activityId}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.thumb_image = res.data.thumb_image
          } else {
          }
        })
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .copy-top
    padding: 15px 12px
    box-sizing: border-box
  .copy-text
    font-family: $font-family-regular
    font-size: $font-size-14
    color: #616161
    margin-bottom: 10px
  .copy-sub
    padding: 0 12px 15px
    box-sizing: border-box
    font-family: $font-family-regular
    font-size: $font-size-14
    line-height: 1.2
    color: #616161
  .fixed-box
    position: fixed
    width: 100%
    layout(row)
    left: 0
    bottom: 0
    background: $color-white
    height: 60px
    .fixed-btn-box
      width: 50%
      height: 100%
      layout(row)
      align-items: center
      justify-content: center
      .fixed-btn-small-box
        width: 90%
        height: 40px
        layout(row)
        align-items: center
        justify-content: center
        border-radius: 40px
      .fixed-btn-small-box-bg
        background: #FFC712
      .text
        margin-left: 6.5px
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #fff
      .icon
        width: 18px
        height: 18px
        img
          display: block
          width: 100%
          height: 100%
    .fixed-btn-line
      border-right-1px(#E6E6E6)
    .fixed-btn-share
      border-none()
  .copy-detail
    width: 100%
    padding-bottom: 55px
  .detail-img
    display: block
    width: 100%
    height: auto
</style>
