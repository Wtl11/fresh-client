<template>
  <div class="content-article-detail">
    <navigation-bar ref="navigationBar" :translucent="true" :isBackCricle="true" :title="navTitle"></navigation-bar>
    <video v-if="details.coverVideo" id="videocover" :src="details.coverVideo" :autoplay="true" class="cover-video" @play="playVideo('cover')"></video>
    <div v-else class="cover-box">
      <img :src="details.coverLittleImage" mode="widthFix" class="little-cover">
      <img :src="details.coverImage" mode="widthFix" class="big-cover">
    </div>
    <div v-if="currentType === 'cookbook'" class="cookbook-title">{{details.title }}</div>
    <div :class="['auth-wrap',{cookbook: currentType === 'cookbook' }]">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-high_quality@2x.png'" class="good-article-icon">
      <div class="auth-photo-wrap">
        <img v-if="details.authPhoto" :src="details.authPhoto" mode="aspectFill" class="auth-photo">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-v@2x.png'" class="auth-photo-v">
      </div>
      <div class="auth-info">
        <div class="name">
          <div class="name-text">{{details.authName}}</div>
          <level-icon :num="details.authorLevel"></level-icon>
          <!-- v-if="currentType !== 'cookbook'"-->
        </div>
        <div class="auth-introduce">{{details.authSignature}}</div>
      </div>
    </div>
    <div v-show="details.lookCount || details.goodCount" class="browse-wrap">
      <div class="browse-title"></div>
      <!--v-if="currentType === 'cookbook'" <div v-else v-show="details.lookCount" class="browse-title">-->
      <!--浏览{{details.lookCount}}-->
      <!--</div>-->
      <div class="like-wrap">
        <div class="like-total" @click="setLikeBtn">
          <template v-if="imageUrl">
            <img v-if="details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big2@2x.png'" class="like-icon">
            <img v-else :src="imageUrl + '/yx-image/article/icon-like_big1@2x.png'" class="like-icon">
          </template>
          <div class="total-count">{{details.goodCount }}</div>
        </div>
        <!-- todo -->
        <div class="good-list-wrap">
          <template v-if="details.goodCount">
            <img v-for="(item,idx) in details.likes" :key="idx" :src="item.avatar" class="liker-photo">
          </template>
          <template v-else>快来第一个点赞吧~</template>
        </div>
      </div>
    </div>
    <div class="line-middle"></div>
    <div v-if="currentType !== 'cookbook'" class="title">{{details.title }}</div>
    <template v-else>
      <div class="emoty-grey-bg"></div>
      <div class="foodlist-title">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-ingredients@2x.png'" class="foodlist-icon">食材
      </div>
      <div class="foods-list">
        <text v-if="details.foodList" space="nbsp">{{details.foodList}}</text>
      </div>
      <div :class="['goods-list',{active:showAll}]">
        <div class="goods-item-wrap" v-for="(item,idx) in details.goodsList" :key="idx">
          <goods-item :goodsData="item" @add="addGoods" @click="goToDetail(item)"></goods-item>
        </div>
      </div>
      <div v-if="details.goodsList.length>2" class="more-btn" @click="showAll=!showAll">
        {{showAll? '收起':'加载更多'}}
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-more@2x.png'" :class="['arrow-icon',{up: showAll}]">
      </div>
      <div v-else class="empty-white-bg">
      </div>
      <div class="emoty-grey-bg"></div>
    </template>
    <div class="article-cont">
      <div v-for="(item,idx) in details.details" :key="idx" class="article-item">
        <text v-if="item.type==='text'" class="article-text">{{item.value}}</text>
        <img v-if="item.type==='image'" :src="item.value.source_url" mode="widthFix" lazy-load class="article-image"/>
        <video v-if="item.type==='video'" :src="item.value.full_url" :poster="item.value.cover_image_url" :id="'video'+item.value.id" class="article-video" @play="playVideo(item.value.id)"></video>
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
              <div v-show="details.goodCount" class="count">{{details.goodCount}}</div>
              <template v-if="imageUrl">
                <img v-show="!details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big1@2x.png'" class="operate-icon">
                <img v-show="details.goodStatus" :src="imageUrl + '/yx-image/article/icon-like_big2@2x.png'" class="operate-icon">
              </template>
            </div>
          </div>
          <div v-if="preview===1" class="operate-item icon-wrap">
            <div v-show="details.shareCount" class="count">{{details.shareCount}}</div>
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share@2x.png'" class="operate-icon">
          </div>
          <button v-else open-type="share" class="operate-item">
            <div class="icon-wrap">
              <div v-show="details.shareCount" class="count">{{details.shareCount}}</div>
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-share@2x.png'" class="operate-icon">
            </div>
          </button>
          <div class="operate-item" @click="goToBuyCar">
            <div class="icon-wrap">
              <div v-show="count" class="count red">{{count || 0}}</div>
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
      return {
        showAll: false,
        videos: {},
        lastVideo: ''
      }
    },
    computed: {
    },
    methods: {
      getVideo(id) {
        return wx.createVideoContext('video' + id)
      },
      playVideo(id) {
        if (!this.videos[id]) {
          if (this.details.coverVideo) this.videos.cover = this.getVideo('cover')
          this.details.details.forEach(item => {
            if (item.type === 'video') this.videos[item.id] = this.getVideo(item.id)
          })
        }
        if (this.lastVideo !== id && this.lastVideo) {
          this.videos[this.lastVideo].pause()
        }
        this.lastVideo = id
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .bottom-emty-20
    height: 20px

  .content-article-detail
    width: 100%

    .cover-video
      width: 100vw

    .cover-box
      position: relative

      .little-cover
        width: 100vw

      .big-cover
        width: 100vw
        display block
        position: absolute
        top: 0
        left: 0
        right: 0
        z-index: 10

    .cookbook-title
      font-family: $font-family-medium
      font-size: $font-size-23
      color: #111111;
      text-align: center
      padding: 22px 12px 10px

    .auth-wrap
      display flex
      align-items center
      margin-bottom: 12px
      padding: 12px 15px
      position relative

      &.cookbook
        justify-content: center

        .good-article-icon
          top: 0px

      .good-article-icon
        position absolute
        right: 11px
        top: 10px
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
          bottom: -1px
          right: 3px
          width: 12px
          height: 12px
          z-index: 10

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
            margin-right: 4px

        .auth-introduce
          color: #808080
          font-size: $font-size-12

    .browse-wrap
      .browse-title
        font-size $font-size-12
        color: #333
        border-bottom-1px(#E6E6E6)
        margin-left: 15px

      .like-wrap
        height: 56px
        display flex
        align-items center
        /*padding-right: 15px*/

        .like-total
          padding: 10px 18px 10px 15px

          .like-icon
            width: 15px
            height: 15px
            display: block

          .total-count
            font-size $font-size-10
            color: #111
            margin-top: 2px

        .good-list-wrap
          flex: 1
          overflow hidden
          height: 56px
          line-height: 56px
          display flex
          justify-content space-between
          flex-wrap wrap
          color: #808080
          font-size: $font-size-12

        .liker-photo
          width: 26px
          height: 26px
          margin: 10px 15px 10px 0
          flex-shrink 0
          border-radius 50%
          border: 1px solid #E6E6E6

    .line-middle
      border-bottom-1px(#E6E6E6)

    .emoty-grey-bg
      height: 10px
      background-color #F8F8F8

    .title
      font-size $font-size-23
      font-family $font-family-medium
      color: #111111
      padding: 22px 15px 5px 15px

    .foodlist-title
      margin-left: 15px
      margin-right: 15px
      height: 44px
      line-height: 44px
      font-size: $font-size-15
      border-bottom-1px()
      font-family: $font-family-bold
      color: #111111
      letter-spacing: 0.4px

      .foodlist-icon
        width: 16px
        height: 13px
        margin-right: 3px

    .foods-list
      font-family $font-family-regular
      font-size $font-size-15
      letter-spacing 0.4px
      color: #111111
      margin: 15px

    .goods-list
      padding: 0px 15px 5px
      max-height:200px
      overflow hidden
      transition all 0.5s

      &.active
        transition all 0.5s
        max-height:none
        .goods-item-wrap
          &:last-child
            margin-bottom: 0
      .goods-item-wrap
        margin-bottom 15px
    .empty-white-bg
      height:16px
    .more-btn
      background-color $color-white
      line-height: 44px
      height: 44px
      text-align center
      font-size: $font-size-14
      color: #B7B7B7
      font-family: $font-family-regular

      .arrow-icon
        width: 10px
        height: 10px
        margin: 2px

        &.up
          transform rotate(180deg)
          transform all 0.3s

    .article-cont
      padding: 15px 15px 10px 15px

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
      z-index: 10
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
