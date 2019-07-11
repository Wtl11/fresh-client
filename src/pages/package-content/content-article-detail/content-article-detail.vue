<template>
  <div class="content-article-detail">
    <navigation-bar :translucent="true" :isBackCricle="true"></navigation-bar>
    <video v-if="details.coverVideo" :src="details.coverVideo" :autoplay="true" :poster="details.coverImage" class="cover-photo"></video>
    <img v-else :src="details.coverImage" mode="widthFix" class="cover-photo">
    <div class="auth-wrap">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-high_quality@2x.png'" class="good-article-icon">
      <div class="auth-photo-wrap">
        <img v-if="details.authPhoto" :src="details.authPhoto" class="auth-photo">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-v@2x.png'" class="auth-photo-v">
      </div>
      <div class="auth-info">
        <div class="name">
          <div class="name-text">{{details.authName}}</div>
          <level-icon :num="details.authorLevel"></level-icon>
        </div>
        <div class="auth-introduce">{{details.authSignature}}</div>
      </div>
    </div>
    <div v-if="details.lookCount || details.goodCount" class="browse-wrap">
      <div v-if="details.lookCount" class="browse-title">浏览{{details.lookCount>= 10000 ? details.lookCount/10000 +'万':details.lookCount}}</div>
      <div v-if="details.goodCount" class="like-wrap">
        <div class="like-total" @click="setLikeBtn">
          <img v-if="imageUrl && !details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big1@2x.png'" alt="" class="like-icon">
          <img v-if="imageUrl && details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big2@2x.png'" alt="" class="like-icon">
          <div class="total-count">{{details.goodCount >999 ?'999+' :details.goodCount }}</div>
        </div>
        <!-- todo -->
        <div class="good-list-wrap">
          <img v-for="(item,idx) in details.likes" :key="idx" :src="item.avatar" class="liker-photo">
        </div>
      </div>
    </div>
    <div class="line-middle"></div>
    <div class="article-cont">
      <div class="name">{{details.title }}</div>
      <div class="foods-list">
        {{details.foodList}}
      </div>
      <div class="goods-list">
        <goods-item v-for="(item,idx) in details.goodsList" :key="idx" :goodsData="item" @add="addGoods" @click="goToDetail(item)"></goods-item>
      </div>
      <div v-for="(item,idx) in details.details" :key="idx" class="article-item">
        <text v-if="item.type==='text'" class="article-text">{{item.value}}</text>
        <img v-if="item.type==='image'" :src="item.value.source_url" mode="widthFix" class="article-image"/>
        <video v-if="item.type==='video'" :src="item.value.full_url" :poster="item.value.cover_image_url" class="article-video"></video>
        <goods-item v-if="item.type==='goods'" :goodsData="item.value" @add="addGoods" @click="goToDetail(item.value)"></goods-item>
      </div>
    </div>
    <div>
      <div class="bottom-operate-wrap">
      </div>
      <div v-if="BottomEmptyVisible" class="bottom-emty-20"></div>
      <div class="bottom-operate-fixed">
        <div class="bottom-operate">
          <div class="operate-item" @click="setLikeBtn">
            <div class="icon-wrap">
              <div v-if="details.goodCount" class="count">{{details.goodCount}}</div>
              <img v-if="imageUrl && !details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big1@2x.png'" class="operate-icon">
              <img v-if="imageUrl && details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big2@2x.png'" class="operate-icon">
            </div>
          </div>
          <div v-if="preview===1" class="operate-item icon-wrap">
            <div v-if="details.shareCount" class="count">{{details.shareCount}}</div>
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share@2x.png'" class="operate-icon">
          </div>
          <button v-else open-type="share" class="operate-item">
            <div class="icon-wrap">
              <div v-if="details.shareCount" class="count">{{details.shareCount}}</div>
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share@2x.png'" class="operate-icon">
            </div>
          </button>
          <div class="operate-item" @click="goToBuyCar">
            <div class="icon-wrap">
              <div v-if="count" class="count red">{{count || 0}}</div>
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-shopping_cart@2x.png'" class="operate-icon">
            </div>
          </div>
        </div>
        <div v-if="BottomEmptyVisible" class="bottom-emty-20"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import goodsItem from '../content-article-detail-video/goods-item/goods-item.vue'
  import contentMix from '@mixins/content-detail'
  import levelIcon from '../content-article-detail-video/level-icon/level-icon'

  const PAGE_NAME = 'CONTENT_ARTICLE_DETAIL'
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      goodsItem,
      levelIcon
    },
    mixins: [contentMix],
    data() {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .bottom-emty-20
    height: 20px

  .content-article-detail
    width: 100%

    .cover-photo
      width: 100vw
      display block

    .article-cont
      padding: 13px 15px

    .auth-wrap
      display flex
      align-items center
      margin-bottom: 12px
      padding: 12px 15px
      position relative

      .good-article-icon
        position absolute
        right: 11px
        top: 35px
        width: 48px
        height: @width

      .auth-photo-wrap
        width: 36px
        height: 36px
        position: relative
        border-1px(#e6e6e6, 18px)
        .auth-photo
          width: 36px
          height: 36px
          border-radius 50%

        .auth-photo-v
          position: absolute
          bottom: 2px
          right: 3px
          width: 12px
          height: 12px

      .auth-info
        font-family $font-family-regular
        margin-left: 5px

        .name
          font-size: $font-size-14
          color: #111111
          margin-bottom: 1px
          display flex
          align-items center
          font-weight bold
          .name-text
            margin-right:4px

        .auth-introduce
          color: #808080
          font-size: $font-size-12

    .browse-wrap
      padding-left: 15px

      .browse-title
        font-size $font-size-12
        color: #333
        padding-bottom: 10px
        border-bottom-1px(#E6E6E6)

      .like-wrap
        height: 56px
        display flex
        align-items center

        .like-total
          margin-right: 18px

          .like-icon
            width: 15px
            height: 15px
            display: block

          .total-count
            font-size $font-size-10
            color: #111
            margin-top: 3px

        .good-list-wrap
          flex: 1
          overflow hidden
          white-space: nowrap
          padding-right:15px
        .liker-photo
          width: 26px
          height: 26px
          margin-right: 19px
          flex-shrink 0
          border-radius 50%
          border: 1px solid #E6E6E6

    .line-middle
      border-bottom-1px(#E6E6E6)

    .article-cont
      padding: 25px 15px 10px 15px

      .name
        font-size $font-size-22
        font-family $font-family-medium
        color: #111111
        margin-bottom 20px

      .foods-list
        font-family $font-family-regular
        font-size $font-size-15
        letter-spacing 0.4px
        color: #111111

      .goods-list
        margin-bottom: 10px
        margin-top: 25px

      .article-item
        margin-bottom 15px

      .article-text
        font-family $font-family-regular
        font-size $font-size-15

      .article-image
      .article-video
        display block
        width: 100%
        border-radius 4px


    .bottom-operate-wrap
      height: 50px

    .bottom-operate-fixed
      position fixed
      bottom 0px
      right: 0
      left: 0
      background white
      z-index: 1000
      box-shadow: 0 -4px 20px 0 rgba(29, 32, 35, 0.06)

    .bottom-operate
      display flex
      justify-content space-around
      align-items center

      .operate-item
        padding: 13px

      .icon-wrap
        position relative
        height: 23px

        .operate-icon
          width: 23px
          height: @width

        .count
          position absolute
          top: -5px
          left: 25px
          color: #111
          font-size $font-size-12

          &.red
            left: 16px
            padding: 0px 4px
            background #FE3B39
            color: #fff
            height: 16px
            min-width: @height
            box-sizing: border-box
            text-align: center
            border-radius 8px
            font-size: $font-size-10

</style>
