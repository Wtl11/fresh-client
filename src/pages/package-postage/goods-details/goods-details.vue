<template>
  <form action="" report-submit @submit="$getFormId">
    <div class="active-detail">
      <navigation-bar ref="navigationBar" :title="msgTitle" :translucent="true" :arrowUrl="arrowUrl"></navigation-bar>
      <section class="banner-box">
        <section v-if="buyUsers.length" class="buy-users" :style="{top: statusBarHeight + 44 + 'px'}">
          <swiper
            class="carousel"
            :autoplay="true"
            :interval="3000"
            :duration="500"
            circular
            vertical
          >
            <block v-for="(item, index) in buyUsers" :key="index">
              <swiper-item class="content-wrapper">
                <figure class="avatar-wrapper">
                  <img v-if="item.avatar" :src="item.avatar" alt="" class="img">
                </figure>
                <div class="text">{{item.text}}</div>
              </swiper-item>
            </block>
          </swiper>
          <div class="place-holder"></div>
        </section>
        <div class="header-swiper">
          <swiper v-if="goodsBanner && goodsBanner.length" :current="swiperIdx" class="banner" @change="bannerChange" interval="5000">
            <block v-for="(item, index) in goodsBanner" :key="index">
              <swiper-item class="banner-item">
                <!--<img :src="item.image_url + '?' + goodsMsg.image_view" class="item-img item-img-one" mode="aspectFill">-->
                <img :src="item.image_url" class="item-img item-img-two" mode="aspectFill">
              </swiper-item>
            </block>
          </swiper>
          <article class="banner-number" v-if="goodsBannerLength !== 0">
            <div></div>
            <div :style="{opacity: currentNum!==0?'1':'0'}" class="banner-number-box">{{currentNum}}/{{goodsBannerLength}}</div>
          </article>
          <article class="header-title-wrapper">
            <section class="header-title">
              <div class="banner-title-main">
                <div class="banner-main-box">
                  <div class="banner-main-left">
                    <div class="left-price">{{goodsMsg.trade_price || '2'}}</div>
                    <div class="left-price-text">元</div>
                    <div class="left-price-line">
                      <div class="line-price-top">
                        <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-qgj@2x.png'" class="text-img" mode="aspectFill">
                        <div class="text">包邮价</div>
                      </div>
                      <div class="line-price-box">{{goodsMsg.original_price || '2'}}元</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </section>
      <div class="header-detail">
        <div class="share-wrapper" formType="submit" :open-type="share" @click="handleShowShare">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-sharexq@2x.png'" mode="aspectFill" class="share-img">
          <p class="share-text">分享</p>
        </div>
        <div class="info-box">
          <article class="title-wrapper">
            <div class="title" :class="goodsMsg.name ? 'has-title' : ''"><span class="title-label">全国包邮</span>{{goodsMsg.name || '全国包邮'}}</div>
            <div class="has-sub-title" v-if="goodsMsg.describe">{{goodsMsg.describe}}</div>
          </article>
          <div class="info-sub">
            <div class="sub-text">全国包邮，下单后预计48小时内发出</div>
          </div>
          <div class="info-stock">已售<span :class="'corp-' + corpName + '-money'">{{goodsMsg.sale_count}}</span>{{goodsMsg.goods_units}}</div>
        </div>
      </div>
      <buy-record
        v-if="userImgList.length > 0"
        :userImgList="userImgList"
        :userTotal="userTotal"
        @buyRecordNavTo="buyRecordNavTo"
      ></buy-record>
      <detail-image :goodsMsg="goodsMsg"></detail-image>
      <div class="service-description">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/postage/pic-zbyx@2x.png'" mode="widthFix" class="send-box-img">
        <div class="text-wrap">
          <div class="send-title">服务说明</div>
          <div class="send-item-list">
            <span class="list-title">• 发货须知：</span><span class="list-sub">下单后预计48小时内发货。</span>
          </div>
          <div class="send-item-list">
            <span class="list-title">• 划线价格：</span><span class="list-sub">指商品的厂商指导价、价签价格或该商品的曾经展示过的价格，</span><span class="list-line">并非原价</span><span class="list-sub">，仅供参考。</span>
          </div>
          <div class="send-item-list">
            <span class="list-title">• 未划线价格：</span><span class="list-sub">指商品的实时价格，不因表述的差异改变性质。具体成交价根据商品参加活动发生变化，</span><span class="list-line">最终以订单结算页价格为准</span>。
          </div>
        </div>
      </div>
      <button-group
        :buttonInfo="buttonInfo"
        :activityType="activityType"
        @instantlyBuy="instantlyBuy"
        @buttonGroupNav="buttonGroupNav"
        @addShoppingCart="addShoppingCart"
      ></button-group>
      <article class="share-panel-wrapper">
        <div v-if="showSharePanel" class="share-mask" @click="handleHideSharePanel">
        </div>
        <section class="share-panel" :class="{show: showSharePanel}">
          <div class="header">
            <p>分享</p>
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/icon-del@2x.png'" class="close-icon" @click="handleHideSharePanel">
          </div>
          <div class="container">
            <share-button v-if="product" type="3" :product="product" class="container-item-wrapper" @click="handleHideSharePanel">
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/icon-tjhwq@2x.png'" class="item-icon">
              <p class="text">推荐到好物圈</p>
              <div class="tip-wrapper">
                <p>好物推荐，和大家一起分享你发现的好物</p>
                <div class="triangle"></div>
              </div>
            </share-button>
            <button open-type="share" class="container-item-wrapper" @click="handleHideSharePanel">
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/pic-wechat@2x.png'" class="item-icon">
              <p class="text button">分享给好友</p>
              <div v-if="product" class="line"></div>
            </button>
            <nav class="container-item-wrapper" @click="_actionDrawPoster">
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/icon-wechatq@2x.png'" class="item-icon">
              <p class="text">生成分享海报</p>
              <div class="line"></div>
            </nav>
          </div>
        </section>
      </article>
    </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import BuyRecord from '@components/goods-detail-element/buy-record/buy-record'
  import DetailImage from '@components/goods-detail-element/detail-image/detail-image'
  import ButtonGroup from '@components/goods-detail-element/button-group/button-group'

  const PAGE_NAME = 'GOODS_DETAILS'
  const ARROW_URL = ['/yx-image/2.3/icon-return_white@2x.png', '/zd-image/1.2/icon-title_back@2x.png']

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      BuyRecord,
      DetailImage,
      ButtonGroup
    },
    data() {
      return {
        msgTitle: '',
        buyUsers: [],
        goodsMsg: {
          goods_banner_images: [
            {
              image_url: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F06%2F15%2F1560569308530-%E6%9F%9A%E5%AD%90.jpg?imageView2/3/w/400/h/400/q/90'
            },
            {
              image_url: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F06%2F15%2F1560569308530-%E6%9F%9A%E5%AD%90.jpg?imageView2/3/w/400/h/400/q/90'
            }
          ]
        },
        swiperIdx: 0,
        activityType: '',
        currentNum: 1,
        showSharePanel: false,
        userImgList: []
      }
    },
    computed: {
      goodsBannerLength() {
        return this.goodsBanner.length || 0
      },
      goodsBanner() {
        return this.goodsMsg.goods_banner_images || []
      },
      // buttonInfo信息
      buttonInfo() {
        return {
          activeStatus: this.activeStatus || 0,
          btnText: this.btnText || '',
          isShowTwoButton: this.isShowTwoButton || false,
          tradePrice: this.goodsMsg.trade_price || 0,
          salePrice: this.goodsMsg.goods_sale_price || 0,
          base_usable_stock: this.goodsMsg.base_usable_stock || 0, // 非活动库存
          usable_stock: this.goodsMsg.usable_stock || 0, // 库存
          tipTop: this.tipTop || '',
          isShowOldCustomerButton: this.isShowOldCustomerButton
        }
      }
    },
    onShareAppMessage() {},
    methods: {
      bannerChange(e) {
        if (e.mp.detail.source !== 'touch') return
        let curNum = e.target.current * 1 + !this.hasVideo
        this.changeCurrentNum(curNum)
      },
      changeCurrentNum(curNum) {
        this.autoplayTimer && clearTimeout(this.autoplayTimer)
        if (curNum !== this.currentNum) {
          this.currentNum = curNum
          if (this.hasVideo && this.videoContext) {
            this.swiperIdx = curNum
            if (curNum === 0) {
              if (!this.playBefore) {
                this.arrowUrl = ARROW_URL[0]
              }
            } else {
              this.arrowUrl = ARROW_URL[1]
              this.videoContext.pause()
              this.videoPlaying = false
            }
          }
        }
      },
      // 显示分享控件
      handleShowShare() {
        // if (this.activityType !== ACTIVE_TYPE.DEFAULT) {
        //   return
        // }
        // this.$refs.shareList && this.$refs.shareList.showLink()
        this.showSharePanel = true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .active-detail
    min-height: 100vh
    background: $color-background
    padding-bottom: 55px
    box-sizing: border-box
    overflow-x: hidden
    .banner-box
      position :relative
      .header-title-wrapper
        position: absolute
        left: 12px
        right :@left
        bottom: 0
        transition: opacity 0.3s
  .title-label
    font-size: $font-size-12
    font-family: $font-family-regular
    color: #101010
    display: inline-block
    border-radius: 9.5px
    width: 58px
    height: 19px
    text-align: center
    line-height: 19px
    background: #ffe500
    margin-right: 5px
  // 购买记录
  .buy-users
    width :35vw
    height: 24px
    padding: 0 9.5px 0 3px
    background: rgba(17,17,17,0.6)
    border-radius: 36px
    position :absolute
    left :8px
    z-index :80
    overflow :hidden
    .place-holder
      fill-box(absolute)
      z-index :3
    .carousel
      height :100%
      width :100%
      .content-wrapper
        layout(row)
        align-items: center
        .avatar-wrapper
          width: 20px
          height: 20px
          border-radius: 50%
          overflow: hidden
          margin :0 6px 0 0
          .img
            width: 100%
            height: 100%
        .text
          flex: 1
          font-family: $font-family-regular
          font-size: 12px
          color: #fff
          no-wrap()
  // header-detail
  .header-detail
    padding: 0 12px
    box-sizing: border-box
    position: relative
    margin-bottom :10px

    .share-wrapper
      position: absolute
      right: 30px
      top: 21px
      z-index: 99

      .share-img
        width: 36px
        height: @width
        display: block

      .share-text
        padding-top: 6px
        text-align: center
        font-family: $font-family-regular
        font-size: 11px;
        color: #342903;

    .info-box
      background: $color-white
      width: 100%
      padding: 10px 10px 15px
      box-sizing: border-box
      border-radius : 0 0 8px 8px

      .title-wrapper
        position: relative

        .share-wrapper
          col-center()
          right: 18px

          .share-img
            width: 36px
            height: @width
            display: block

          .share-text
            padding-top: 6px
            text-align: center
            font-family: $font-family-regular
            font-size: 11px;
            color: #342903;

        .title
          width: 71vw
          font-size: $font-size-17
          color: #1F1F1F
          min-height: 20px
          line-height: $font-size-20
          font-family: $font-family-medium
          no-wrap-plus()

        .has-title
          width: 71vw
          no-wrap-plus()

        .has-sub-title
          width: 71vw
          margin-top: 7px
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #808080
          letter-spacing: 0.3px
          word-break: break-word

      .info-sub
        layout(row)
        align-items: center
        margin: 10px 0 10px

        .info-sub-img
          width: 14.5px
          height: 15.5px
          display: block
          margin-right: 5px

        .sub-text
          color: #9B9B9B
          font-size: $font-size-14
          font-family: $font-family-regular

    .info-stock
      font-size: $font-size-14
      color: #9e9e9e
      font-family: $font-family-regular

  // banner图
  .header-swiper
    width: 100vw
    height: 100vw
    position: relative
    .banner
      width: 100vw
      height: 100vw
      .banner-item
        width: 100%
        height: 100%
        position: relative
        .item-img
          width: 100%
          height: 100%
          position: absolute
          left: 0
          top: 0
        .video-img
          transition: all 0.3s
          &.hide
            opacity: 0
            z-index: -1
        .play-btn
          width: 100%
          height: 70%
          position: absolute
          left: 0
          top: 15%
          z-index: 9
          layout()
          justify-content: center
          align-items: center
          .play-btn-icon
            width: 50px
            height: @width
        .item-img-one
          z-index: 1
        .item-img-two
          z-index: 2
        .play
          all-center()
          height: 63px
          width: 63px
    .banner-number
      box-sizing: border-box
      width: 100%
      padding: 0 12px
      position: absolute
      bottom: px-change-vw(60.5)
      left: 0
      layout(row)
      align-items: center
      justify-content: space-between
      .banner-number-box
        display: inline-block
        font-size: $font-size-11
        background: rgba(17,17,17,0.2)
        color: $color-white
        box-sizing: border-box
        padding: 2px 8px
        border-radius: 20px
        opacity: .75
        transition: all 0.3s
        &.banner-btn
          min-width: 48px
          padding: 3px 8px
          margin: 0 5px
          background: $color-white
          font-size: $font-size-10
          color: $color-text-main
          font-family: $font-family-regular
          text-align: center
          opacity: .75
          &.active
            background: linear-gradient(90deg, #FD4C46 0%, #FB6C21 73%)
            color: $color-white
            opacity: 1
          .banner-btn-icon
            width: 7px
            height: 7.5px

  // 普通商品
  .header-title-default
    height: 13vw
    background: #ff6d0d
    width: 100%
    border-top-left-radius: 8px
    border-top-right-radius: 8px
    layout(row)
    align-items: center
    padding-left: 10px
    box-sizing: border-box
    .left-price
      font-size: 30px
      font-family: $font-family-medium
      color:rgba(255,255,255,1)
    .left-price-text
      layout(row)
      align-items: flex-end
      .price-text
        font-size: 22px
        font-family: $font-family-medium
        margin-right: 5px
        color:rgba(255,255,255,1)
      .line-price-text
        font-size: $font-size-12
        font-family: $font-family-regular
        text-decoration: line-through
        line-height: 1
        color:rgba(255,255,255,0.8)
        position :relative
        bottom :4px
  // 限时抢购-title
  .header-title
    position relative
    background: #ff6d0d
    border-top-left-radius: 8px
    border-top-right-radius: 8px
    .icon-wrapper
      col-center()
      right:15px
      width :61px
      height :19px
      border :0.5px solid $color-white
      layout(row,block,nowrap)
      border-radius :2px
      overflow :hidden
      .right
        padding-left :4px
        font-family: $font-family-medium
        font-size: 13px;
        color: #FFFFFF;
      .left
        width :19px
        height :@width
        background :$color-white
        display :flex
        justify-content :center
        align-items :center
        .left-icon
          display :block
          width :11px
          height :10.5px
    &.active-common
      height: 13vw
      width: 100%
      border-top-left-radius: 8px
      border-top-right-radius: 8px
      overflow :hidden
    &.group
      position :relative
    .banner-title-main
      padding-bottom: 13vw
      width: 100%
      position: relative
      .group-icon-wrapper
        width :53px
        height :20px
        border :1px solid $color-white
        layout(row,block,nowrap)
        border-radius :2px
        overflow :hidden
        margin-right :7px
        position relative
        top :2px
        font-family: $font-family-medium
        font-size: 13px;
        color: #FFFFFF
        .right
          padding-left :4px
        .left
          width :20px
          height :@width
          background :$color-white
          display :flex
          justify-content :center
          align-items :center
          color:#FD4E44
          font-size :15px
      .banner-title-bg
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 100%
        border-top-left-radius: 8px
        border-top-right-radius: 8px
      .banner-main-box
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 100%
        padding: 0 19px 0 10px
        box-sizing: border-box
        layout(row)
        align-items: center
        justify-content: space-between
        .banner-main-left
          flex: 1
          layout(row)
          align-items: center
          .left-price
            font-size: 30px
            font-family: $font-family-medium
            color: $color-white
          .left-price-text
            font-size: 22px
            font-family: $font-family-medium
            color: $color-white
            margin-right: 6px
            position :relative
            top:1px
          .line-price-top
            height: 11px
            width: 36.5px
            position: relative
            .text-img
              width: 100%
              height: 100%
              display: block
              position: absolute
              left: 0
              bottom: 0
            .text
              height: 11px
              font-size: 9px
              color: $color-money
              line-height: 11px
              font-family: $font-family-regular
              text-align: center
              position: relative
              z-index: 11
              &.group
                color: #FF4343
          .line-price-box
            font-size: $font-size-12
            font-family: $font-family-regular
            text-decoration: line-through
            line-height: 1
            color: #fff
            margin-top: 2px
            &.group
              position :relative
              top:-1px
              opacity :0.8
        .banner-main-right
          text-align: center
          position :relative
          left :5px
          .time-text
            font-size: $font-size-13
            color: $color-text-main
            font-family: $font-family-regular
            line-height:15px
          .time-all-box
            padding-top :1px
            font-size: $font-size-14
            color: $color-text-main
            font-family: $font-family-medium
            line-height:15px
            width :65px
  // 服务说明
  .service-description
    background: $color-white
    border-radius: 8px
    box-sizing: border-box
    margin: 10px 12px 10px
    box-shadow: 0 2px 15px 0 rgba(17, 17, 17, 0.06)
    .send-box-img
      width: 100%
      display: block
      margin: 0 auto 10px
    .send-box-img-retuan
      width: 50px
      height: 50px
      display: block
      margin: 0 auto 20px
    .text-wrap
      padding: 20px 20px 28px 18px
      .send-title
        font-family: $font-family-medium
        color: $color-text-main
        font-size: $font-size-14
        margin-bottom: 15px
      .send-item-list
        text-align: justify
        margin-bottom: 19px
        line-height: 19px
        .list-title
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-13
        .list-sub
          font-family: $font-family-regular
          color: $color-text-sub
          font-size: $font-size-13
        .list-line
          font-family: $font-family-regular
          color: #000
          text-decoration: underline
          font-size: $font-size-13

      .send-item-list:last-child
        margin-bottom: 0
  // 分享模块
  .share-panel-wrapper
    .share-mask
      position: fixed
      left: 0
      top: 0
      bottom: 0
      right: 0
      z-index: 999
      background: rgba(17, 17, 17, 0.7)
    .share-panel
      position: fixed
      bottom: -130%
      left: 0
      background: #fff
      width: 100%
      z-index:9999
      transition: all .5s
      &.show
        bottom :0
      .header
        padding :0 12px
        height :45px
        background: #F7F7F7
        font-family: $font-family-regular
        font-size: 15px;
        color: #1D2023;
        letter-spacing: 1.36px
        display :flex
        justify-content :space-between
        align-items :center
        .close-icon
          width :13px
          height :@width
      .container
        background :$color-white
        display :flex
        padding :29px 0 70px
        .container-item-wrapper
          flex: 1
          position :relative
          .tip-wrapper
            position absolute
            top:83px
            left: 50%
            transform :translateX(-20%)
            width :234.5px
            height :24px
            opacity: 0.7;
            font-size: 12px
            color: $color-text-sub
            text-align: center
            line-height: @height
            background: #F5F5F5;
            border-radius: @height
            .triangle
              position :absolute
              top:-13px
              left:40px
              width :0
              height :0
              border:7px solid #F5F5F5;
              border-top-color: transparent
              border-left-color :transparent
              border-right-color: transparent
          .line
            position :absolute
            width :1px
            height :40px
            left :0
            top:4px
            transform :scaleX(0.5)
            background: #E6E6E6
          .item-icon
            width :40px
            height :@width
            display :block
            margin :0 auto 10px
          .text
            font-family: $font-family-regular
            font-size: 14px
            color: $color-text-sub
            text-align: center
            &.button
              position :relative
              top:3px
</style>
