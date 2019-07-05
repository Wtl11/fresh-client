<template>
  <div class="content-article-detail-video">
    <navigation-bar :translucent="true" :isBackCricle="true" @click-nav="videoClick"></navigation-bar>
    <video id="myVideo"
           src="http://1254297111.vod2.myqcloud.com/76b25520vodgzp1254297111/324863175285890791134089946/r9RD7Tr4UrgA.mp4"
           :autoplay="playStatus"
           :loop="true"
           :muted="true"
           :controls="showContorl"
           :show-progress="false"
           :enable-progress-gesture="false"
           :show-fullscreen-btn="false"
           :show-play-btn="false"
           :show-center-play-btn="false"
           :custom-cache="false"
           play-btn-position="center"
           class="full-screen-video"
           @timeupdate="videoPlayTime"
           @ended="endVideo"
           @click="videoClick"
           @touchstart="enterVideo"
           @touchend="leaveVideo"
    >
      <div v-if="!playStatus" class="puse-btn"></div>
    </video>
    <div class="info-wrap">
      <div class="auth-wrap">
        <div class="auth-photo-wrap">
          <img v-if="details.authPhoto" :src="details.authPhoto" class="auth-photo">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-v@2x.png'" class="auth-photo-v">
        </div>
        <div class="name">{{details.authName}}</div>
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-lv8@2x.png'" class="level-icon">
      </div>
      <text class="text" space="ensp" :decode="true">{{details.text}}</text>
      <div class="operate-wrap">
        <div class="operate-wrap-box">
          <div class="like-operate">
            <div class="count">{{details.goodCount}}</div>
            <img v-if="imageUrl && !goodStatus" :src="imageUrl + '/yx-image/article/icon-fabulous1@2x.png'" class="operate-icon">
          </div>
          <img v-if="imageUrl && goodStatus" :src="imageUrl + '/yx-image/article/icon-fabulous2@2x.png'" class="operate-icon">
          <button open-type="share" class="operate-icon">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share_big@2x.png'" class="operate-icon">
          </button>
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-shoping_catbig@2x.png'" class="operate-icon">
        </div>
        <div class="goods-btn" @click.stop="showGoodsListBtn">
          商品({{goodsList.length}})
        </div>
      </div>
      <div v-if="BottomEmptyVisible" class="bottom-emty-20"></div>
    </div>
    <div :class="['goods-list-wrap',{show:goodsListVisible}]">
      <div class="title">全部商品<span class="num">/共{{goodsList.length}}个商品</span></div>
      <div class="good-list">
        <goods-item v-for="(item,idx) in goodsList" :key="idx" :goods-data="item" @add="addGoods"></goods-item>
      </div>
      <div v-if="BottomEmptyVisible" class="bottom-emty-20"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import goodsItem from './goods-item/goods-item.vue'
  import { cartComputed, cartMethods } from '@state/helpers'

  const PAGE_NAME = 'CONTENT_ARTICLES'
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      goodsItem
    },
    data() {
      return {
        showContorl: false,
        BottomEmptyVisible: false,
        details: {
          authName: 'dsofdpsf',
          authPhoto: 'https://img.jkweixin.net/defaults/yx-image/retuan/hdpi/icon-select_press01.png',
          text: '奋斗史如果点f↵的法国恢复↵的非官方的↵啥大富大贵↵梵蒂冈的双方各h',
          goodCount: 132
        },
        goodStatus: false,
        goodsListVisible: false,
        goodsList: [{
          name: '超值特惠 2斤农家新鲜家新鲜',
          details: '绿色外皮下包裹着白嫩嫩的果…',
          price: '10.8',
          photo: ''
        }, {
          name: '超值特惠 2斤农家新鲜家新鲜',
          details: '绿色外皮下包裹着白嫩嫩的果…',
          price: '10.8',
          photo: ''
        }, {
          name: '超值特惠 2斤农家新鲜家新鲜',
          details: '绿色外皮下包裹着白嫩嫩的果…',
          price: '10.8',
          photo: ''
        }, {
          name: '超值特惠 2斤农家新鲜家新鲜',
          details: '绿色外皮下包裹着白嫩嫩的果…',
          price: '10.8',
          photo: ''
        }],
        playStatus: true,
        videoContext: null
      }
    },
    computed: {
      ...cartComputed
    },
    onShareAppMessage() {
      return {
        title: '赞播优鲜',
        path: `${this.$routes.content.CONTENT_ARTICLES_DETAIL_VIDEO}`,
        imageUrl: '',
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    },
    onLoad() {
      this.videoContext = wx.createVideoContext('myVideo')
      let res = this.$wx.getSystemInfoSync()
      this.BottomEmptyVisible = (res.statusBarHeight >= 44) ? 1 : false
      console.log(res)
    },
    methods: {
      ...cartMethods,
      leaveVideo() {
        this.timer = setTimeout(() => {
          this.showContorl = false
        }, 500)
      },
      enterVideo() {
        clearTimeout(this.timer)
        this.showContorl = true
      },
      endVideo() {
        this.videoContext.pause()
        this.playStatus = false
      },
      videoPlayTime(value) {
        // console.log(value)
      },
      videoClick() {
        this.playStatus = !this.playStatus
        console.log(this.playStatus)
        if (!this.videoContext) this.videoContext = wx.createVideoContext('myVideo')
        if (this.playStatus) {
          this.videoContext.play()
        } else {
          this.videoContext.pause()
        }
        this.goodsListVisible = false
      },
      showGoodsListBtn() {
        this.goodsListVisible = true
      },
      getNumObject(item, n) {
        console.log(item.split('.'), item.split('.')[n])
        return item.split('.')[n]
      },
      addGoods(item) {
        API.Choiceness.addShopCart({ goods_sku_id: item.goods_sku_id, activity_id: item.activity_id }).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('加入购物车成功')
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
        console.log(item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .content-article-detail-video
    width: 100vw
    height: 100vh
    overflow hidden

    .bottom-emty-20
      height: 20px

    .full-screen-video
      width: 100vw
      height: 100vh

      .puse-btn
        position: absolute
        top: 50%
        left: 50%
        transform translate(-50%)
        width: 50px
        height: @width
        background-image url("./icon-play_big2@2x.png")
        background-size 100%

    .info-wrap
      position: fixed
      bottom: 20px
      left: 0
      right: 0
      padding: 0px 15px

      .auth-wrap
        display flex
        align-items center
        margin-bottom 12px

        .auth-photo-wrap
          position: relative

          .auth-photo
            width: 36px
            height: 36px
            border-radius 50%

          .auth-photo-v
            position: absolute
            bottom: 2px
            right: 2px
            width: 12px
            height: 12px

        .name
          font-size: $font-size-16
          color: #ffffff
          font-family $font-family-regular
          margin: 0px 3px 0px 5px

        .level-icon
          width: 40px
          height: 13px

      .text
        display block
        color: #ffffff
        font-family $font-family-regular
        font-size: $font-size-15
        line-height 21px

      .operate-wrap
        display flex
        justify-content space-between
        align-items center
        margin-top 25px

        .operate-wrap-box
          display flex

        .operate-icon
          width: 40px
          height: 40px
          margin-right: px-change-vw(25)

        .like-operate
          display inline-block
          position: relative

          .count
            position: absolute
            top: -12px
            left: 18px
            color: #fff;
            font-size $font-size-12
            padding: 0 4px
            height: 15px
            line-height 15px
            background: #FE3B39
            border-radius 7px

        .goods-btn
          flex-shrink 0
          height: 40px
          line-height 40px
          padding: 0px 24px
          border-radius: 20px
          color: #fff
          background #73C200
          font-size $font-size-16
          font-family $font-family-regular


    .goods-list-wrap
      position: fixed
      background #fff
      bottom 0
      left: 0
      right: 0
      transform translateY(100%)
      border-radius 12px 12px 0 0
      transition all 0.3s

      &.show
        transition all 0.3s
        transform translateY(0)

      .title
        height: 50px
        line-height 50px
        padding 0px 15px
        font-family: $font-family-regular
        font-size: $font-size-16
        color: #111111

        .num
          font-family: $font-family-regular
          font-size: $font-size-11
          color: #808080
          margin-left 3px

      .good-list
        padding: 0px 15px 17px 15px
        max-height: 60vh
        overflow auto
</style>
