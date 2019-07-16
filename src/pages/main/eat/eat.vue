<template>
  <div class="eat">
    <navigation-bar :showArrow="false" title="吃什么"></navigation-bar>
    <div v-for="(module, moduleIndex) in moduleData" :key="moduleIndex" class="eat-box">
      <!--文章模块-->
      <article-modal v-if="module.module_name === 'article_recommend' && articleList.length" :articleList="articleList"></article-modal>
      <div v-if="module.module_name === 'article_recommend'">
        <div class="scroll-box">
          <scroll-view
            class="scroll-view2"
            :class="{'scroll-view2-active': isTop}"
            :style="activeTabStyles"
            v-if="tabList1.length"
            id="scrollView"
            :scroll-into-view="viewToItem"
            scroll-x
            scroll-with-animation="true"
          >
            <div v-for="(item, index) in tabList1" :class="tabIndex === index ? 'item-active'  : ''" :key="index"
                 class="item scroll-item" :id="'item'+index" @click="_changeTab(index, item.other_id, $event)">
              <p class="text">{{item.name}}</p>
              <p class="class-title" v-if="item.title">{{item.title}}</p>
            </div>
          </scroll-view>
        </div>
        <!---->
        <div class="big-box">
          <div
            class="classify-big-box"
            :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  (tabList1.length * 100) +'vw', transition: boxTransition}"
          >
            <!---->
            <div
              :style="{height: tabIndex * 1 === tabInx ? -1 : scrollHeight}"
              class="goods-list-box"
              v-for="(tabItem, tabInx) in contentList" :key="tabInx"
            >
              <!--瀑布流-->
              <div class='fall-container'>
                <!-- 左边一列 -->
                <div class="fall-box fall-left">
                  <div class="fall-item" v-for="(item, index) in tabItem.leftList" :key="item.id" @click="goDetail(item)">
                    <div class="img-box" :style="{height:item.itemHeight+'px'}">
                      <img v-if="imageUrl && item.type === 'video'" :src="imageUrl + '/yx-image/eat/icon-img_play@2x.png'" class="video-icon">
                      <image
                        v-if="item.cover_image"
                        class='card-img'
                        mode='widthFix'
                        :src="item.cover_image.source_url"
                        lazy-load>
                      </image>
                    </div>
                    <div class="fall-title">{{item.title}}</div>
                    <div class="fall-author">
                      <div class="fall-author-left" v-if="item.author">
                        <div class="fall-author-img-box">
                          <image mode='aspectFill' :src="item.author.head_image_url" class="fall-author-img"></image>
                        </div>
                        <span class="fall-author-name">{{item.author.nickname}}</span>
                      </div>
                      <div class="fall-author-right" @click.stop="giveLike('left', index, item)">
                        <img v-if="imageUrl && !item.is_fabulou" :src="imageUrl + '/yx-image/eat/icon-like_big1@2x.png'" class="fall-author-icon">
                        <img v-if="imageUrl && item.is_fabulou" :src="imageUrl + '/yx-image/eat/icon-like_big2@2x.png'" class="fall-author-icon">
                        <span class="fall-author-like">{{item.fabulous_num >= 1000 ? '999+' : item.fabulous_num}}</span>
                      </div>
                    </div>
                    <!--瀑布流内容卡片-->
                  </div>
                </div>
                <!--右边一列 -->
                <div id="right" class="fall-box fall-right">
                  <div class="fall-item" v-for="item in tabItem.rightList" :key="item.id" @click="goDetail(item)">
                    <div class="img-box" :style="{height:item.itemHeight+'px'}">
                      <img v-if="imageUrl && item.type === 'video'" :src="imageUrl + '/yx-image/eat/icon-img_play@2x.png'" class="video-icon">
                      <image
                        v-if="item.cover_image"
                        class='card-img'
                        mode='widthFix'
                        :src="item.cover_image.source_url"
                        lazy-load>
                      </image>
                    </div>
                    <div class="fall-title">{{item.title}}</div>
                    <div class="fall-author">
                      <div class="fall-author-left" v-if="item.author">
                        <div class="fall-author-img-box">
                          <image mode='aspectFill' :src="item.author.head_image_url" class="fall-author-img"></image>
                        </div>
                        <span class="fall-author-name">{{item.author.nickname}}</span>
                      </div>
                      <div class="fall-author-right" @click.stop="giveLike('right', index, item)">
                        <img v-if="imageUrl && !item.is_fabulou" :src="imageUrl + '/yx-image/eat/icon-like_big1@2x.png'" class="fall-author-icon">
                        <img v-if="imageUrl && item.is_fabulou" :src="imageUrl + '/yx-image/eat/icon-like_big2@2x.png'" class="fall-author-icon">
                        <span class="fall-author-like">{{item.fabulous_num >= 1000 ? '999+' : item.fabulous_num}}</span>
                      </div>
                    </div>
                    <!--瀑布流内容卡片-->
                  </div>
                </div>
              </div>
              <div class="empty">
                <is-active-empty v-if="tabItem.isEmpty"></is-active-empty>
              </div>
              <loading-more v-if="tabItem.classifyMore"></loading-more>
              <div class="foot-ties" v-if="tabItem.page === tabItem.lastPage && !tabItem.isEmpty">
                <div class="center">— 再拉也没有了 —</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    自定义tab-->
    <custom-tab-bar currentType="eat"></custom-tab-bar>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  import ArticleModal from './article-modal/article-modal'
  import API from '@api'
  import Article from './article-modal/article'
  import LoadingMore from '@components/loading-more/loading-more'
  import isActiveEmpty from '@components/is-active-empty/is-active-empty'
  import ShareTrick from '@mixins/share-trick'
  import clearWatch from '@mixins/clear-watch'
  import ShareHandler, { EVENT_CODE } from '@mixins/share-handler'
  import GetOptions from '@mixins/get-options'

  let leftList = []
  let rightList = []
  let leftHeight = 0
  let rightHeight = 0
  let itemWidth = 0
  let maxHeight = 0
  const PAGE_NAME = 'EAT'
  const ARR = { arr: [], classifyMore: false, isEmpty: false, lastPage: 2, page: 1, leftList: [], rightList: [] }
  export default {
    name: PAGE_NAME,
    mixins: [
      ShareHandler,
      ShareTrick,
      clearWatch,
      GetOptions
    ],
    components: {
      NavigationBar,
      CustomTabBar,
      'article-modal': ArticleModal,
      LoadingMore,
      isActiveEmpty
    },
    data() {
      return {
        statusBarHeight: 20,
        lineTranslateX: 0,
        classifyId: '',
        contentList: [],
        tabList1: [],
        tabIndex: 0,
        width: 0,
        move: 0,
        viewToItem: 'item0',
        boxTransition: '',
        lineWidth: 97,
        systemInfoSync: {},
        articleList: new Article(),
        articleHeight: 0,
        // 瀑布流参数
        leftHeight: 0,
        rightHeight: 0,
        itemWidth: 0,
        maxHeight: 500,
        leftList: [],
        rightList: [],
        elRight: '',
        moduleData: [],
        elDom: [],
        shopId: null,
        tabHeight: 0,
        isTop: false,
        activeTabStyles: '',
        bannerTop: 0
      }
    },
    computed: {
      scrollHeight() {
        let navHeight = 44 + this.systemInfoSync.statusBarHeight
        let bottomHeight = 60
        let heightNotTop = `${this.systemInfoSync.screenHeight - this.articleHeight - this.tabHeight - navHeight - bottomHeight}px`
        let heightTop = `${this.systemInfoSync.screenHeight - this.tabHeight - navHeight - bottomHeight}px`
        let height = this.isTop ? heightTop : heightNotTop
        return height
      }
    },
    onLoad(options) {
      wx.getSystemInfo({
        success: (res) => {
          // 750rpx/屏幕宽度
          let percentage = 750 / res.windowWidth
          // 计算瀑布流间距
          let margin = 16 / percentage
          let padding = res.windowWidth * 0.032 * 2
          // 计算 瀑布流展示的宽度
          itemWidth = (res.windowWidth - margin - padding) / 2
          // 计算瀑布流的最大高度，防止长图霸屏
          maxHeight = itemWidth / 0.8
        }
      })
      let res = this.$wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.statusBarHeight += 44
      this.bannerTop = res.screenWidth * 0.48532
      this._getArticleList(true)
    },
    onShow() {
      let id = wx.getStorageSync('shopId')
      let query = this._$$initOptions()
      if (!id) {
        this.shopId = query.shopId
        wx.setStorageSync('shopId', this.shopId)
      }
      if (this.shopId !== id) {
        this._getArticleList(false)
      }
      this.shopId = id
      this.systemInfoSync = this.$wx.getSystemInfoSync()
      this.$$shareHandler({ event: EVENT_CODE.EAT })
    },
    onReachBottom() {
      this._addMonitor()
      if (this.contentList[this.tabIndex].page >= this.contentList[this.tabIndex].lastPage) {
        return
      }
      this.contentList[this.tabIndex].page++
      this.getContentList()
    },
    onPullDownRefresh() {
      if (this.contentList.length) {
        this.contentList[this.tabIndex].page = 1
      }
      this._getArticleList(false)
      wx.stopPullDownRefresh()
    },
    onShareAppMessage(res) {
      return {
        title: '赞播优鲜：生鲜+社区团购',
        path: `${this.$routes.main.EAT}?shopId=${this.shopId}`,
        imageUrl: ''
      }
    },
    methods: {
      _addMonitor() {
        if (!this.tabList1.length) return
        let el = wx.createIntersectionObserver()
        el.relativeToViewport({ top: -(this.statusBarHeight + 70 - 4) })
        el.observe('.scroll-box', res => {
          this.isTop = res.boundingClientRect.top <= this.statusBarHeight && res.intersectionRect.top <= 0
          this.activeTabStyles = this.isTop ? `
                position:fixed;
                top:${this.statusBarHeight}px;
                left:0;
                right:0;
                background: #fff;
              ` : ''
        })
      },
      goDetail(item) {
        let url = item.type === 'video' ? `${this.$routes.content.CONTENT_ARTICLES_DETAIL_VIDEO}?articleId=${item.id}` : `${this.$routes.content.CONTENT_ARTICLES_DETAIL}?articleId=${item.id}`
        wx.navigateTo({ url })
      },
      // 点赞
      giveLike(type, index, item) {
        // 点赞，参数未对接
        type = `${type}List`
        API.Content.articleOperation({ article_id: item.id, handle: 'fabulou' })
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            item.is_fabulou = !item.is_fabulou
            item.is_fabulou ? item.fabulous_num++ : item.fabulous_num--
            this.contentList[this.tabIndex][type][index] = item
          })
      },
      // 内容列表
      getContentList(id, loading = false) {
        if (this.classifyId === '') {
          this.contentList[this.tabIndex].isEmpty = !this.articleList.length
          this.contentList[this.tabIndex].arr = []
          this.contentList = JSON.parse(JSON.stringify(this.contentList))
          this.fillData(false, this.contentList[this.tabIndex].arr)
          return
        }
        this.contentList[this.tabIndex].classifyMore = true
        API.Content.getWorkList({ type: '', status: 1, is_cate_show: 0, category_id: this.classifyId, page: this.contentList[this.tabIndex].page })
          .then((res) => {
            this.contentList[this.tabIndex].lastPage = res.meta.last_page
            if (this.contentList[this.tabIndex].page === 1) {
              this.contentList[this.tabIndex].arr = res.data
              this.contentList[this.tabIndex].isEmpty = !res.data.length
            } else {
              this.contentList[this.tabIndex].arr = this.contentList[this.tabIndex].arr.concat(res.data)
            }
            this.contentList[this.tabIndex].classifyMore = false
            this.contentList = JSON.parse(JSON.stringify(this.contentList))
            this.fillData(false, this.contentList[this.tabIndex].arr)
          })
      },
      // 分开左右两个list
      fillData(isPull, listData) {
        if (isPull) {
          // 是否下拉刷新，是的话清除之前的数据
        }
        leftList.length = 0
        rightList.length = 0
        leftHeight = 0
        rightHeight = 0
        // this.leftList = []
        // this.rightList = []
        rightList = []
        leftList = []
        for (let i = 0, len = listData.length; i < len; i++) {
          let tmp = listData[i]
          tmp.width = parseInt(tmp.cover_image.width)
          tmp.height = parseInt(tmp.cover_image.height)
          tmp.itemWidth = itemWidth
          let per = tmp.width / tmp.itemWidth
          tmp.itemHeight = tmp.height / per
          if (tmp.itemHeight > maxHeight) {
            tmp.itemHeight = maxHeight
          }
          if (leftHeight === rightHeight) {
            leftList.push(tmp)
            leftHeight = leftHeight + tmp.itemHeight
          } else if (leftHeight < rightHeight) {
            leftList.push(tmp)
            leftHeight = leftHeight + tmp.itemHeight
          } else {
            rightList.push(tmp)
            rightHeight = rightHeight + tmp.itemHeight
          }
        }
        this.contentList[this.tabIndex].leftList = JSON.parse(JSON.stringify(leftList))
        this.contentList[this.tabIndex].rightList = JSON.parse(JSON.stringify(rightList))
      },
      _getArticleList() {
        let res = this.$wx.getSystemInfoSync()
        this.articleHeight = this.articleList.length ? res.screenWidth * 0.48532 : 0
        API.FlashSale.getModuleInfo({ page_name: 'food' })
          .then((json) => {
            this.moduleData = json.data.modules
            this.moduleData.forEach((item) => {
              switch (item.module_name) {
                case 'article_category':
                  let arr = []
                  item.list.map((item) => {
                    if (item.is_close) {
                      arr.push(item)
                    }
                  })
                  this.tabList1 = arr
                  if (this.tabIndex + 1 > this.tabList1.length || !this.tabList1.length) {
                    this.tabIndex = 0
                  }
                  this.classifyId = this.tabList1.length ? this.classifyId : ''
                  setTimeout(() => {
                    this._addMonitor()
                  }, 300)
                  this.getCategoryData()
                  this.getContentList()
                  break
                case 'article_recommend':
                  let arrRe = []
                  item.list.map((item) => {
                    if (item.is_close) {
                      arrRe.push(item)
                    }
                  })
                  this.articleList = arrRe
                  break
                default:
                  break
              }
            })
          })
      },
      async _changeTab(index, id, e) {
        if (this.tabIndex === index) return
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        this.boxTransition = 'all .3s'
        this._setViewToItem(index)
        this.move = e.target.offsetLeft
        this.classifyId = id
        this.contentList[this.tabIndex].page = 1
        this.getContentList(this.classifyId, false)
        this.contentList[index].arr = this.contentList[index].arr.slice(0, 10)
      },
      _setViewToItem(index = 0) {
        this.tabIndex = index
        let number = index < 3 ? 0 : index - 2
        this.viewToItem = `item${number}`
        // wx.createSelectorQuery().selectAll('.scroll-item').boundingClientRect().exec(res => {
        //   if (res && res[0]) {
        //     this.lineWidth = res[0][this.tabIndex].width + this.tabList1[this.tabIndex].name.length * 4
        //   }
        // })
      },
      getCategoryData(isLoad = false) {
        if (!this.tabList1.length) {
          this.contentList = [JSON.parse(JSON.stringify(ARR))]
          return
        }
        this.tabHeight = this.tabList1.length ? 47 : 0
        this.classifyId = this.tabList1.length ? this.tabList1[this.tabIndex].other_id : ''
        let length = this.tabList1.length
        for (let i = 0; i < length; i++) {
          this.contentList.push(ARR)
        }
        this.tabList1.forEach((item, index) => {
          if (item.id * 1 === this.classifyId * 1) {
            this._setViewToItem(index)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  $scroll-item-width = 84px
  .eat
    min-height: 100vh
    background-image: linear-gradient(180deg, #FFFFFF 11%, #F7F7F7 32%)

  .scroll-box
    height: 70px

  .scroll-view2
    padding: 20px 0 10px 2px
    width: 100vw
    z-index: 99
    display: block
    white-space: nowrap
    box-sizing: border-box
    transition: all 0.3s
    transform: translate3d(0, 0, 0)
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      white-space: nowrap
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
      width: $scroll-item-width
      height: 39px
      box-sizing: border-box
      transform-origin: 50%
      line-height: 1
      transition: all 0.2s
      border-right-1px($color-line)
      &:last-child
        border-none()
      .class-title
        margin-top: 5px
        display: inline-block
        font-size: $font-size-12
        border-radius: 9px
        padding: 3px 6px
        line-height: 1
        color: #808080
    .item-active
      font-family: $font-family-medium
      font-size: $font-size-16
      color: #73C200
      position: relative
      transition: font-size 0.2s
      transform-origin: 50%
      .class-title
        color: $color-white
        background: #73C200

    .line-con
      box-sizing: border-box
      position: absolute
      top: 33px
      left: 0
      z-index: 99
      width: $scroll-item-width
      height: 3px
      padding: 0 25px
      border-radius: 3px
      transition: all 0.45s
      .line
        all-center()
        width: 30px
        border-radius: 3px
        height: 3px

  .scroll-view-top
    top: 84px

  .big-box
    width: 100vw
    overflow: hidden

    .classify-big-box
      width: 100vw
      display: flex
      transform: translateX(0)

  .goods-list-box
    display: block
    width: 100vw

  .fall-container
    width: 100%
    padding: 0 3.2vw
    box-sizing: border-box
    display: flex
    /*display: flex;*/
    .fall-box
      width: 45.73vw
      &.fall-left
        margin-right: 2.13vw
        box-sizing border-box
      &.fall-right
        box-sizing border-box
      .img-box
        max-height: 250px
        overflow: hidden
        position: relative
      .card-img
        display: block
        border-top-right-radius: 4px
        border-top-left-radius: 4px
        width: 100%
      .video-icon
        width: 20px
        z-index: 1
        height: 20px
        position: absolute
        top: 11px
        right: 11px
      .fall-item
        margin-bottom: 2.13vw
        overflow: hidden
        box-shadow: 0 3px 8px 0 rgba(17, 17, 17, 0.05)
        background: $color-white
        border-radius: 4px
        .fall-author
          display: flex
          padding: 0 2.667vw 2.667vw
          box-sizing: border-box
          justify-content: space-between
          align-items: center
          .fall-author-left
            display: flex
            align-items: center
            .fall-author-img-box
              overflow: hidden
              width: 20px
              min-width: 20px
              height: 20px
              border-radius: 50%
              margin-right: 5px
            .fall-author-img
              width: 20px
              min-width: 20px
              height: 20px
              border-radius: 50%
            .fall-author-name
              line-height: 1.2
              color: #808080
              width: 65px
              no-wrap()
              font-size: $font-size-13
              font-family: $font-family-regular
          .fall-author-right
            display: flex
            align-items: center
            .fall-author-icon
              width: 14px
              height: 14px
              margin-right: 4.25px
            .fall-author-like
              font-size: $font-size-12
              color: #111111
              font-family: $font-family-regular
        .fall-title
          font-size: 4vw
          font-family: $font-family-medium
          no-wrap()
          margin: 2.667vw 0 4vw
          line-height: 1.2
          padding: 0 10px
          box-sizing: border-box

  .foot-ties
    layout(row)
    justify-content: center
    align-items: center
    height: 60px
    box-sizing: border-box
    padding-top: 25px
    padding-bottom: 20px
    .center
      font-family: $font-family-regular
      font-size: $font-size-14
      color: rgba(152, 152, 159, 0.30)
      text-align: justify
      line-height: 1
</style>
