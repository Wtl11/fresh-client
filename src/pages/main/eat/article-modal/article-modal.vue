<template>
  <div class="article-modal">
    <!--一篇文章样式-->
    <!--两篇文章样式-->
    <div class="article" :class="'article' + articleList.length" v-if="articleList.length <3 ">
      <div v-for="(item, index) in articleList" :key="index" class="article-item" @click="goDetail(item)">
        <div class="shade"></div>
        <img mode="aspectFill" :src="item.image_url" class="article-modal-img">
        <div class="article-modal-title">{{item.title}}~</div>
      </div>
    </div>
    <!--三篇文章样式-->
    <div class="article article3" v-if="articleList.length === 3">
      <div class="article-item" @click="goDetail(articleList[0])">
        <div class="shade"></div>
        <img mode="aspectFill" :src="articleList[0].image_url" class="article-modal-img">
        <div class="article-modal-title">{{articleList[0].title}}</div>
      </div>
      <div class="article-left">
        <div class="article-item" @click="goDetail(articleList[1])">
          <div class="shade"></div>
          <img mode="aspectFill" :src="articleList[1].image_url" class="article-modal-img">
          <div class="article-modal-title">{{articleList[1].title}}</div>
        </div>
        <div class="article-item" @click="goDetail(articleList[2])">
          <div class="shade"></div>
          <img mode="aspectFill" :src="articleList[2].image_url" class="article-modal-img">
          <div class="article-modal-title">{{articleList[2].title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const PAGE_NAME = 'ARTICLE'

  export default {
    name: PAGE_NAME,
    props: {
      articleList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    methods: {
      goDetail(item) {
        let url = item.type === 'video' ? `${this.$routes.content.CONTENT_ARTICLES_DETAIL_VIDEO}?articleId=${item.other_id}` : `${this.$routes.content.CONTENT_ARTICLES_DETAIL}?articleId=${item.other_id}`
        wx.navigateTo({ url })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .article
    margin: 2.8vw 3.2vw 0
    height: 45.7333vw
    overflow: hidden

  .article-item
    height: 100%
    width: 100%
    overflow: hidden
    position: relative
    padding: 20px 0 0 12px
    box-sizing: border-box
    .shade
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, .15)
    .article-modal-img
      position: absolute
      top: 0
      left: 0
      width: 100%
    .article-modal-title
      position: relative
      font-family: FZLTTHJW--GB1-0
      color: $color-white
      font-size: $font-size-18
      z-index: 1

  .article1
    border-radius: 4px

  .article2
    display: flex
    justify-content: space-between
    .article-item
      border-radius: 4px
      padding: 12px 0 0 12px
      width: 45.73333vw
      .article-modal-title
        line-height: 20px
        width: 100px

  .article3
    display: flex
    justify-content: space-between
    .article-left
      flex-direction: column
      display: flex
      width: 45.73333vw
      justify-content: space-between
      .article-item
        height: 21.7333vw
    .article-item
      border-radius: 4px
      padding: 12px 0 0 12px
      width: 45.73333vw
      .article-modal-title
        line-height: 20px
        width: 100px
</style>
