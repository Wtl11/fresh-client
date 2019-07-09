<template>
  <div class="content-article-detail">
    <navigation-bar :translucent="true" :isBackCricle="true"></navigation-bar>
    <video v-if="details.coverVideo" :src="details.coverVideo" class="cover-photo"></video>
    <img v-else :src="details.coverImage" mode="widthFix" class="cover-photo">
    <div class="auth-wrap">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-high_quality@2x.png'" class="good-article-icon">
      <div class="auth-photo-wrap">
        <img v-if="details.authPhoto" :src="details.authPhoto" class="auth-photo">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-v@2x.png'" class="auth-photo-v">
      </div>
      <div class="auth-info">
        <div class="name">
          {{details.authName}}
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-lv8@2x.png'" class="level-icon">
        </div>
        <div class="auth-introduce">{{details.authSignature}}</div>
      </div>
    </div>
    <div class="browse-wrap">
      <div class="browse-title">浏览{{details.lookCount>= 10000 ? details.lookCount/10000 +'万':details.lookCount}}</div>
      <div class="like-wrap">
        <div class="like-total">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-like_big1@2x.png'" alt="" class="like-icon">
          <div class="total-count">{{details.goodCount >999 ?'999+' :details.goodCount }}</div>
        </div>
        <!-- todo -->
        <img v-for="(item,idx) in details.likes" :key="idx" :src="item.photo" class="liker-photo">
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
        <img v-if="item.type==='image'" :src="item.value" mode="widthFix" class="article-image"/>
        <video v-if="item.type==='video'" :src="item.value" class="article-video"></video>
        <goods-item v-if="item.type==='goods'" :goodsData="item.value" @add="addGoods" @click="goToDetail(item)"></goods-item>
      </div>
    </div>
    <div class="bottom-operate-wrap">
      <div class="bottom-operate">
        <div class="operate-item" @click="setLikeBtn">
          <div class="icon-wrap">
            <div v-if="details.goodCount"  class="count">{{details.goodCount}}</div>
            <img v-if="imageUrl && !details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big1@2x.png'" class="operate-icon">
            <img v-if="imageUrl && details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big2@2x.png'" class="operate-icon">
          </div>
        </div>
        <div>
          <div v-if="this.preview===1" class="icon-wrap">
            <div v-if="details.shareCount" class="count">{{details.shareCount}}</div>
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share@2x.png'" class="operate-icon">
          </div>
          <button v-else open-type="share" class="operate-item">
            <div class="icon-wrap">
              <div v-if="details.shareCount" class="count">{{details.shareCount}}</div>
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share@2x.png'" class="operate-icon">
            </div>
          </button>
        </div>
        <div class="operate-item" @click="goToBuyCar">
          <div class="icon-wrap">
            <div v-if="count" class="count red">{{count || 0}}</div>
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-shopping_cart@2x.png'" class="operate-icon">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import goodsItem from '../content-article-detail-video/goods-item/goods-item.vue'
  import contentMix from '@mixins/content-detail'

  const PAGE_NAME = 'CONTENT_ARTICLE_DETAIL'
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      goodsItem
    },
    mixins: [contentMix],
    data() {
      return {
      }
    },
    computed: {},
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .content-article-detail
    width: 100%

    .cover-photo
      width: 100vw

    .article-cont
      padding: 13px 15px

    .auth-wrap
      display flex
      align-items center
      margin-bottom: 12px
      padding: 13px 15px
      position relative

      .good-article-icon
        position absolute
        right: 11px
        top: 35px
        width: 48px
        height: @width

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

      .auth-info
        font-family $font-family-regular
        margin-left: 5px

        .name
          font-size: $font-size-14
          color: #111111
          margin-bottom: 6px

          .level-icon
            width: 40px
            height: 13px

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
        flex-wrap wrap
        overflow hidden

        .like-total
          margin-right: 10px

          .like-icon
            width: 15px
            height: 15px

          .total-count
            font-size $font-size-10
            color: #111
            margin-top: 3px

        .liker-photo
          margin 15px 20px 15px 0px
          width: 26px
          height: 26px
          flex-shrink 0

    .line-middle
      border-bottom-1px(#E6E6E6)

    .article-cont
      padding: 25px 15px 10px 15px

      .name
        font-size $font-size-22
        font-family $font-family-medium
        color: #111111
        margin-bottom 25px

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
        width: 100%


    .bottom-operate-wrap
      height: 50px

    .bottom-operate
      position fixed
      bottom 0px
      right: 0
      left: 0
      background white
      box-shadow: 0 -4px 20px 0 rgba(29, 32, 35, 0.06)
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
            left: 23px
            color: #111
            font-size $font-size-12

            &.red
              left: 16px
              padding: 0px 4px
              background #FE3B39
              color: #fff
              height: 16px
              border-radius 8px
              font-size: $font-size-10

</style>
