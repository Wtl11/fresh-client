<template>
  <div class="goods-record">
    <navigation-bar title="购买记录"></navigation-bar>
    <section class="container">
      <article class="goods-wrapper">
        <figure class="left">
          <img v-if="goodsMsg.goods_cover_image" :src="goodsMsg.goods_cover_image" mode="aspectFill" class="goods-img">
        </figure>
        <div class="right">
          <h1 class="title">{{goodsMsg.name}}</h1>
          <h3 class="title-sub">{{goodsMsg.describe}}</h3>
          <p class="money"><span class="number">{{goodsMsg.trade_price}}</span><span class="unit">元</span></p>
        </div>
        <button class="share-button" open-type="share">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-sharexq@2x.png'" mode="aspectFill" class="share-img">
        </button>
      </article>
      <ul class="list-wrapper panel">
        <li v-for="(item, index) in listArray" :key="index" class="item-wrapper">
          <figure class="left">
            <img v-if="item.head_image_url" :src="item.head_image_url" mode="aspectFill" class="avatar">
          </figure>
          <p class="right">
            <span class="common">{{item.userName + ' 购买了 '}}</span>
            <span class="number">{{item.goods_num}}</span>
            <span class="common">{{' 份'}}</span>
            <span class="date">{{item.pay_at}}</span>
          </p>
        </li>
      </ul>
      <is-end v-if="!hasMore"></is-end>
      <loading-more v-else></loading-more>
      <div style="height: 75px"></div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {resolveQueryScene} from '@utils/common'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import IsEnd from '@components/is-end/is-end'
  import LoadingMore from '@components/loading-more/loading-more'

  const PAGE_NAME = 'GOODS_RECORD'

  export default {
    name: PAGE_NAME,
    mixins: [ShareHandler],
    components: {
      NavigationBar,
      IsEnd,
      LoadingMore
    },
    data() {
      return {
        thumb_image: '',
        isFirstLoad: true,
        goodsMsg: {},
        shopId: 0,
        activity_id: 0,
        goodsId: 0,
        listArray: [],
        hasMore: true,
        isLoading: false,
        page: 1
      }
    },
    onLoad(options) {
      console.warn(options, '<-----参数---->')
      if (options.scene) {
        let {shopId, activityId, goodsId} = resolveQueryScene(options.scene)
        this.goodsId = goodsId
        this.activityId = activityId
        this.shopId = shopId
      } else {
        this.goodsId = +options.goodsId || 0
        this.activityId = +options.activityId || 0
        this.shopId = +options.shopId || 0
      }
      console.log(+options.shopId)
      if (this.shopId) {
        wx.setStorageSync('shopId', this.shopId)
      }
      // !!this.shopId && wx.setStorageSync('shopId', this.shopId)
    },
    onShow() {
      this._getGoodsDetailData()
      this._getList()
      this.$$shareHandler({
        event: EVENT_CODE.GOODS_DETAIL,
        activityId: this.activityId,
        goodsId: this.goodsId
      })
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('shopId')
      const flag = Date.now()
      return {
        title: this.goodsMsg.name,
        path: `/pages/goods-record?id=${this.goodsId}&shopId=${shopId}&activityId=${this.activityId}&flag=${flag}`, // 商品详情
        imageUrl: this.thumb_image || this.goodsMsg.goods_cover_image,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    onReachBottom() {
      if (this.isLoading) return
      this.page++
      this._getList(false)
    },
    methods: {
      _getList(loading) {
        this.isLoading = true
        API.GoodsRecord.getList({page: this.page}, loading).then((res) => {
          res.data.forEach(item => {
            this.listArray.push({
              ...item,
              userName: this._formatName(item.nickname)
            })
          })
          this.hasMore = res.data.length
          this.isLoading = false
        }).catch(e => {
          console.warn(e)
          this.isLoading = false
        })
      },
      _formatName(name) {
        const dot = '***'
        if (name.length > 1) {
          name = name.substring(0, 1) + dot + name.substring(name.length - 2, name.length - 1)
        } else {
          name += dot
        }
        return name
      },
      _getGoodsDetailData() {
        API.Choiceness.getGoodsDetail(this.goodsId, {activity_id: this.activityId}, this.isFirstLoad).then((res) => {
          this.$wechat.hideLoading()
          this.isFirstLoad = false
          if (res.error === this.$ERR_OK) {
            let goodDetail = res.data
            console.log(res.data)
            this.goodsMsg = goodDetail
            this.thumb_image = goodDetail.thumb_image
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

  .panel
    background: #FFFFFF;
    box-shadow: 0 6px 30px 0 rgba(17,17,17,0.08);
    border-radius: 8px

  .goods-record
    width: 100%
    .container
      padding :0 12px
      .list-wrapper
        margin-top :10px
        padding : 0 15px
        .item-wrapper
          layout(row,block,nowrap)
          padding-bottom :25px
          &:first-child
            padding-top :25px
          .left
            width :36px
            height :@width
            border-radius :50%
            background :#ccc
            margin-right :9px
            overflow :hidden
            .avatar
              width :36px
              height :@width
              display :block
          .right
            font-family: $font-family-regular
            font-size: 14px;
            color: $color-text-main
            letter-spacing: 0.3px
            white-space: nowrap
            overflow :hidden
            line-height :36px
            .number
              padding :0 2px
              color: #FA7500;
            .date
              display :inline-block
              padding-left :13px
              font-size: 13px;
              color: $color-text-sub
              text-overflow: ellipsis

      .goods-wrapper
        margin-top :10px
        background: #FFFFFF;
        box-shadow: 0 6px 30px 0 rgba(17,17,17,0.08);
        border-radius: 8px
        padding :10px
        layout(row,block,nowrap)
        position :relative
        .share-button
          position :absolute
          width :40px
          height :@width
          right :13px
          bottom :-4px
          border-radius :50%
          background :#fff
          display: flex
          align-items :center
          justify-content :center
          z-index :50
          .share-img
            width :30px
            height :@width
            display :block
        .left
          background: #F7F5F5;
          border-radius: 2px;
          width :95px
          height :@width
          margin-right :10px
          overflow :hidden
          .goods-img
            width :95px
            height :@width
            display :block
        .right
          flex: 1
          overflow :hidden
          font-family: $font-family-regular
          .title
            font-family: $font-family-medium
            font-size: 14px;
            color: $color-text-main
            letter-spacing: 0.6px;
            line-height: 1
            no-wrap()
          .title-sub
            padding-top :6px
            font-size: 13px;
            color: $color-text-sub
            line-height:1.24
            no-wrap-plus()
          .money
            padding-top :21px
            display :flex
            font-family: $font-family-medium
            color: #FA7500;
            align-items :flex-end
            .number
              font-size: 20px;
              line-height: 16px;
            .unit
              position :relative
              top:2px
              left :1px
              font-size :12px

</style>
