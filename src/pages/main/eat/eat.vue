<template>
  <div class="eat">
    <navigation-bar :showArrow="false" title="吃什么"></navigation-bar>
    <div class="eat-box">
      <!--文章模块-->
      <article-modal :articleList="articleList"></article-modal>
      <scroll-view
        class="scroll-view2"
        v-if="tabList1.length"
        id="scrollView"
        :scroll-into-view="viewToItem"
        scroll-x
        scroll-with-animation="true"
      >
        <div v-for="(item, index) in tabList1" :class="tabIndex === index ? 'item-active'  : ''" :key="index"
             class="item scroll-item" :id="'item'+index" @click="_changeTab(index, item.id, $event)">
          <p class="text">{{item.name}}</p>
        </div>
        <div class="line-con" :style="{'transform':'translateX('+lineTranslateX+'px)',width: lineWidth + 'px'}">
          <div class="line" :class="'corp-' + corpName + '-bg'"></div>
        </div>
      </scroll-view>
      <div class="big-box">
        <div
          class="classify-big-box"
          :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  (tabList1.length * 100) +'vw', transition: boxTransition}"
        >
          <div
            class="goods-list-box"
            :style="{height: tabIndex * 1 === tabInx ? -1 : scrollHeight}"
            v-for="(tabItem, tabInx) in contentList" :key="tabInx"
          >
            <!--瀑布流-->
            <div class='fall-container'>
              <!-- 左边一列 -->
              <div class="fall-box fall-left">
                <div class="fall-item" v-for="(item, index) in tabItem.leftList" :key="item.id">
                  <div class="img-box" :style="{height:item.itemHeight+'px'}">
                    <img v-if="imageUrl" :src="imageUrl + '/yx-image/eat/icon-img_play@2x.png'" class="video-icon">
                    <image
                      class='card-img'
                      mode='aspectFill'
                      :style="{background:item.color}"
                      :src="item.image_url"
                      lazy-load>
                    </image>
                  </div>
                  <div class="fall-title">{{item.text}}</div>
                  <div class="fall-author">
                    <div class="fall-author-left">
                      <img src="" class="fall-author-img">
                      <span class="fall-author-name">厨师达人厨师达人</span>
                    </div>
                    <div class="fall-author-right" @click="giveLike('left', index, item)">
                      <img v-if="imageUrl" :src="imageUrl + '/yx-image/eat/icon-like_big1@2x.png'" class="fall-author-icon">
                      <img v-if="imageUrl && false" :src="imageUrl + '/yx-image/eat/icon-like_big2@2x.png'" class="fall-author-icon">
                      <span class="fall-author-like">30</span>
                    </div>
                  </div>
                  <!--瀑布流内容卡片-->
                </div>
              </div>
              <!--右边一列 -->
              <div id="right" class="fall-box fall-right">
                <div class="fall-item" v-for="item in tabItem.rightList" :key="item.id">
                  <div class="img-box" :style="{height:item.itemHeight+'px'}">
                    <img v-if="imageUrl" :src="imageUrl + '/yx-image/eat/icon-img_play@2x.png'" class="video-icon">
                    <image
                      class='card-img'
                      mode='aspectFill'
                      :style="{background:item.color}"
                      :src="item.image_url"
                      lazy-load>
                    </image>
                  </div>
                  <div class="fall-title">{{item.text}}</div>
                  <div class="fall-author">
                    <div class="fall-author-left">
                      <img src="" class="fall-author-img">
                      <span class="fall-author-name">厨师达人厨师达人</span>
                    </div>
                    <div class="fall-author-right" @click="giveLike('right', index, item)">
                      <img v-if="imageUrl" :src="imageUrl + '/yx-image/eat/icon-like_big1@2x.png'" class="fall-author-icon">
                      <img v-if="imageUrl && false" :src="imageUrl + '/yx-image/eat/icon-like_big2@2x.png'" class="fall-author-icon">
                      <span class="fall-author-like">30</span>
                    </div>
                  </div>
                  <!--瀑布流内容卡片-->
                </div>
              </div>
            </div>
            <is-active-empty v-if="tabItem.isEmpty"></is-active-empty>
            <loading-more v-if="tabItem.classifyMore"></loading-more>
            <div class="foot-ties" v-if="tabItem.page === tabItem.lastPage && !tabItem.isEmpty">
              <div class="center">— 再拉也没有了 —</div>
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

  let leftList = []
  let rightList = []
  let leftHight = 0
  let rightHight = 0
  let itemWidth = 0
  let maxHeight = 0
  const PAGE_NAME = 'EAT'
  const ARR = { arr: [], classifyMore: false, isEmpty: false, lastPage: 1, page: 1, leftList: [], rightList: [] }
  export default {
    name: PAGE_NAME,
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
        classifyId: null,
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
        tabHeight: 0,
        // 瀑布流参数
        leftHight: 0,
        rightHight: 0,
        itemWidth: 0,
        maxHeight: 500,
        leftList: [],
        rightList: [],
        elRight: ''
      }
    },
    computed: {
      scrollHeight() {
        let navHeight = 44 + this.systemInfoSync.statusBarHeight
        let bottomHeight = 60
        let height = `${this.systemInfoSync.screenHeight - this.articleHeight - this.tabHeight - navHeight - bottomHeight}px`
        return height
      }
    },
    onPageScroll(e) {
    },
    onLoad(options) {
      wx.getSystemInfo({
        success: (res) => {
          // 750rpx/屏幕宽度
          let percentage = 750 / res.windowWidth
          // 计算瀑布流间距
          let margin = 20 / percentage
          // 计算 瀑布流展示的宽度
          itemWidth = (res.windowWidth - margin) / 2
          // 计算瀑布流的最大高度，防止长图霸屏
          maxHeight = itemWidth / 0.8
          // console.log('itemWidth', itemWidth, maxHeight)
        }
      })
      this.getCategoryData(true)
      this._getArticleList(true)
    },
    onShow() {
      this.systemInfoSync = this.$wx.getSystemInfoSync()
    },
    onReachBottom() {
      if (this.contentList[this.tabIndex].page >= this.contentList[this.tabIndex].lastPage) {
        return
      }
      this.contentList[this.tabIndex].page++
      this.getContentList()
    },
    methods: {
      giveLike(type, index, item) {
        // 点赞，参数未对接
        type = `${type}List`
        item.isLike = !item.isLike
        item.isLike ? item.like++ : item.like--
        this.contentList[this.tabIndex][type][index] = item
      },
      // 内容列表
      getContentList(id, loading = false) {
        this.contentList[this.tabIndex].classifyMore = true
        // todo
        let list = []
        for (let i = 0; i < 10; i++) {
          let num = Math.random()
          let item = {
            width: 200,
            height: (i + 1) * num * 300,
            color: `rgb(125 ,${Math.ceil(Math.random() * 255)} , ${Math.ceil(Math.random() * 255)})`,
            text: '我是模块' + i,
            image_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562403814&di=9c35111623c9b4948ebebff004d77776&imgtype=jpg&er=1&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201408%2F13%2F20140813104323_4rHCx.jpeg'
          }
          list.push(item)
        }
        let res = { data: this.tabIndex === 1 ? [] : list, meta: { last_page: 2 } }
        this.contentList[this.tabIndex].lastPage = res.meta.last_page
        if (this.contentList[this.tabIndex].page === 1) {
          this.contentList[this.tabIndex].arr = res.data
          this.contentList[this.tabIndex].isEmpty = !res.data.length
        } else {
          this.contentList[this.tabIndex].arr = this.contentList[this.tabIndex].arr.concat(res.data)
        }
        this.fillData(false, this.contentList[this.tabIndex].arr)
        this.contentList[this.tabIndex].classifyMore = false
        this.contentList = JSON.parse(JSON.stringify(this.contentList))
      },
      // 分开左右两个list
      fillData(isPull, listData) {
        if (isPull) {
          // 是否下拉刷新，是的话清除之前的数据
          leftList.length = 0
          rightList.length = 0
          leftHight = 0
          rightHight = 0
          this.leftList = []
          this.rightList = []
        }
        rightList = []
        leftList = []
        for (let i = 0, len = listData.length; i < len; i++) {
          let tmp = listData[i]
          tmp.width = parseInt(tmp.width)
          tmp.height = parseInt(tmp.height)
          tmp.itemWidth = itemWidth
          let per = tmp.width / tmp.itemWidth
          tmp.itemHeight = tmp.height / per
          if (tmp.itemHeight > maxHeight) {
            tmp.itemHeight = maxHeight
          }
          if (leftHight === rightHight) {
            leftList.push(tmp)
            leftHight = leftHight + tmp.itemHeight
          } else if (leftHight < rightHight) {
            leftList.push(tmp)
            leftHight = leftHight + tmp.itemHeight
          } else {
            rightList.push(tmp)
            rightHight = rightHight + tmp.itemHeight
          }
        }
        // console.log(leftHight)
        // console.log(rightList)
        this.contentList[this.tabIndex].leftList = leftList
        this.contentList[this.tabIndex].rightList = rightList
      },
      _getArticleList() {
        let res = this.$wx.getSystemInfoSync()
        this.articleHeight = this.articleList.length ? res.screenWidth * 0.457333 : 0
      },
      _changeTabLine() {
        let left = 0
        setTimeout(() => {
          wx.createSelectorQuery().selectAll('.scroll-item').boundingClientRect().exec(res => {
            if (res && res[0]) {
              let arr = res[0]
              arr.forEach((item, index) => {
                if (index < this.tabIndex) {
                  left += item.width
                }
              })
              this.lineTranslateX = left
            }
          })
        }, 100)
      },
      async _changeTab(index, id, e) {
        if (this.tabIndex === index) return
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        if (this.tabIndex === index + 1 || this.tabIndex === index - 1) {
          this.boxTransition = 'all .3s'
        } else {
          this.boxTransition = ''
        }
        this._setViewToItem(index)
        this.move = e.target.offsetLeft
        this.classifyId = id
        this.contentList[this.tabIndex].page = 1
        this.getContentList(this.classifyId, false)
      },
      _setViewToItem(index = 0) {
        this.tabIndex = index
        let number = index < 3 ? 0 : index - 2
        this.viewToItem = `item${number}`
        wx.createSelectorQuery().selectAll('.scroll-item').boundingClientRect().exec(res => {
          if (res && res[0]) {
            this.lineWidth = res[0][this.tabIndex].width + this.tabList1[this.tabIndex].name.length * 4
            this._changeTabLine()
          }
        })
      },
      getCategoryData(isLoad = false) {
        API.Choiceness.getClassifyCategory().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.tabList1 = res.data
          setTimeout(() => {
            wx.createSelectorQuery().selectAll('.scroll-item').boundingClientRect().exec(res => {
              if (res && res[0]) {
                this.lineWidth = res[0][this.tabIndex].width
              }
            })
          }, 300)
          this.tabHeight = this.tabList1.length ? 47 : 0
          let length = res.data.length
          for (let i = 0; i < length; i++) {
            this.contentList.push(ARR)
          }
          res.data.forEach((item, index) => {
            if (item.id * 1 === this.classifyId * 1) {
              this._setViewToItem(index)
            }
          })
          this.getContentList(this.classifyId, this.tabIndex)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  $scroll-item-width = 81px
  .eat
    background-image: linear-gradient(180deg, #FFFFFF 11%, #F7F7F7 32%)

  .scroll-view2
    height: 36px
    margin-top: 11px
    padding-left: 5.5px
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
      font-size: $font-size-14
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
      padding: 0 12.5px
      height: 36px
      line-height: 36px
      box-sizing: border-box
      transform-origin: 50%
      .text
        width: 100%
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
      .classify-icon
        position: relative
        margin: 0 auto
        padding-top: 8px
        width: 44px
        height: @width
        .img
          width: 100%
          height: @width

    .item-active
      font-family: $font-family-medium
      font-size: $font-size-18

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
    margin-top: 15px
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
        border-top-right-radius: 8px
        border-top-left-radius: 8px
        width: 100%
      .video-icon
        width: 20px
        z-index: 1
        height: 20px
        position: absolute
        top: 11px
        right: 11px
      .fall-item
        margin-bottom: 8px
        overflow: hidden
        box-shadow: 0 3px 8px 0 rgba(17, 17, 17, 0.05)
        background: $color-white
        border-radius: 8px
        .fall-author
          display: flex
          padding: 0 2.667vw 2.667vw
          box-sizing: border-box
          justify-content: space-between
          align-items: center
          .fall-author-left
            display: flex
            align-items: center
            .fall-author-img
              width: 20px
              background: $color-background
              min-width: 20px
              height: 20px
              min-height: 20px
              border-radius: 50%
              margin-right: 5px
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
