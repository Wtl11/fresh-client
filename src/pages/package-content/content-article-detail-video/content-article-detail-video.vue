<template>
  <div class="content-article-detail-video">
    <navigation-bar :translucent="true" :isBackCricle="true" @click-nav="videoClick"></navigation-bar>
    <video id="myVideo"
           :src="details.videoContent.url"
           :autoplay="playStatus"
           :loop="false"
           :controls="!contentVisible"
           class="full-screen-video"
           @ended="endVideo"
           @click="videoClick"
           @play="playVideo"
           @pause="pauseVideo"
    >
      <div v-if="!playStatus && !endVideoHas" class="puse-btn" @click.stop="videoClick"></div>
    </video>
    <div v-if="contentVisible" class="info-wrap">
      <div class="auth-wrap">
        <div class="auth-photo-wrap">
          <img v-if="details.authPhoto" :src="details.authPhoto" class="auth-photo">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-v@2x.png'" class="auth-photo-v">
        </div>
        <div class="name">{{details.authName}}</div>
        <level-icon :num="details.authorLevel"></level-icon>
      </div>
      <text class="text" space="ensp" :decode="true">{{details.text}}</text>
      <div class="operate-wrap">
        <div class="operate-wrap-box">
          <div class="operate-item" @click="setLikeBtn">
            <div v-if="details.goodCount" class="count">{{details.goodCount}}</div>
            <img v-if="imageUrl && !details.goodStatus" :src="imageUrl + '/yx-image/article/icon-fabulous1@2x.png'" class="operate-icon">
            <img v-if="imageUrl && details.goodStatus" :src="imageUrl + '/yx-image/article/icon-fabulous2@2x.png'" class="operate-icon">
          </div>
          <button v-if="this.preview===1" class="operate-icon">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share_big@2x.png'" class="operate-icon">
          </button>
          <button v-else open-type="share" class="operate-icon">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share_big@2x.png'" class="operate-icon">
          </button>
          <div class="operate-item" @click="goToBuyCar">
            <div class="count">{{count || 0}}</div>
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-shoping_catbig@2x.png'" class="operate-icon" @clcik="goToBuyCar">
          </div>
        </div>
        <div class="goods-btn" @click.stop="showGoodsListBtn">
          商品({{details.goodsList.length || 0}})
        </div>
      </div>
      <div v-if="BottomEmptyVisible" class="bottom-emty-20"></div>
    </div>
    <div :class="['goods-list-wrap',{show:goodsListVisible}]">
      <div v-if="details.goodsList.length" class="title">全部商品<span class="num">/共{{details.goodsList.length || 0}}个商品</span></div>
      <div class="good-list">
        <goods-item v-for="(item,idx) in details.goodsList" :key="idx" :goods-data="item" @add="addGoods" @click="goToDetail(item)"></goods-item>
      </div>
      <div v-if="BottomEmptyVisible" class="bottom-emty-20"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import goodsItem from './goods-item/goods-item.vue'
  import levelIcon from './level-icon/level-icon'
  import contentMix from '@mixins/content-detail'

  const PAGE_NAME = 'CONTENT_ARTICLES'
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      goodsItem,
      levelIcon
    },
    data() {
      return {
        contentVisible: true,
        goodsListVisible: false,
        playStatus: true,
        videoContext: null,
        endVideoHas: false
      }
    },
    mixins: [contentMix],
    onLoad() {
      this.videoContext = wx.createVideoContext('myVideo')
    },
    methods: {
      playVideo() {
        this.endVideoHas = false
        this.playStatus = true
      },
      pauseVideo() {
        this.playStatus = false
      },
      endVideo() {
        this.endVideoHas = true
        this.playStatus = false
      },
      videoClick() {
        if (!this.playStatus) {
          this.videoContext.play()
          this.playStatus = true
        }
        if (!this.goodsListVisible) this.contentVisible = !this.contentVisible
        this.goodsListVisible = false
      },
      showGoodsListBtn() {
        this.videoContext.pause()
        this.goodsListVisible = true
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

        .operate-item
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
