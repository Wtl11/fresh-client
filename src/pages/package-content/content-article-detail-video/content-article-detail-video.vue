<template>
  <div class="content-article-detail-video" >
    <navigation-bar :translucent="true" :isBackCricle="true" @click-nav="videoClick"></navigation-bar>
    <video src="" class="full-screen-video" @click="videoClick">
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
      <text class="text">
        {{details.text}}
      </text>
      <div class="operate-wrap">
        <div>
          <div class="like-operate">
            <div class="count">{{details.goodCount}}</div>
            <img v-if="imageUrl && !goodStatus" :src="imageUrl + '/yx-image/article/icon-fabulous1@2x.png'" class="operate-icon">
          </div>
          <img v-if="imageUrl && goodStatus" :src="imageUrl + '/yx-image/article/icon-fabulous2@2x.png'" class="operate-icon">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share_big@2x.png'" class="operate-icon">
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
        <goods-item v-for="(item,idx) in goodsList" :key="idx" :goods-data="item"></goods-item>
      </div>
      <div v-if="BottomEmptyVisible" class="bottom-emty-20"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import goodsItem from './goods-item/goods-item.vue'

  const PAGE_NAME = 'CONTENT_ARTICLES'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      goodsItem
    },
    data() {
      return {
        BottomEmptyVisible: false,
        details: {
          authName: 'dsofdpsf',
          authPhoto: 'https://img.jkweixin.net/defaults/yx-image/retuan/hdpi/icon-select_press01.png',
          text: '迅速的翻炒，我用筷子直接搅拌了几下，蛋液只要都凝固了，就可以改小火盛起来，我这个炒锅有点粘锅，看起来不是很好。',
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
        }]
      }
    },
    onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.BottomEmptyVisible = (res.statusBarHeight >= 44) ? 1 : false
      console.log(res)
      this.initBottomStyle()
    },
    methods: {
      initBottomStyle() {

      },
      videoClick() {
        this.goodsListVisible = false
      },
      showGoodsListBtn() {
        this.goodsListVisible = true
      },
      getNumObject(item, n) {
        console.log(item.split('.'), item.split('.')[n])
        return item.split('.')[n]
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

    .info-wrap
      position: fixed
      bottom: 20px
      left: 0
      right: 0
      padding: 0px 15px

      .auth-wrap
        display flex
        align-items center

        .auth-photo-wrap
          position: relative

          .auth-photo
            width: 36px
            height: 36px

          .auth-photo-v
            position: absolute
            bottom: 0
            right: 0
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
        color: #ffffff
        font-family $font-family-regular
        font-size: $font-size-15
        line-height 21px
        margin: 12px 0px 25px

      .operate-wrap
        display flex
        justify-content space-between
        align-items center

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
        max-height:60vh
        overflow auto
</style>
