<template>
  <div class="classify">
    <navigation-bar title="分类"></navigation-bar>
    <scroll-view class="scroll-view2" :style="{top: statusBarHeight + 44 + 'px'}" v-if="tabList1 && tabList1.length"
                 id="scrollView" :scroll-into-view="viewToItem" scroll-x scroll-with-animation="true">
      <div v-for="(item, index) in tabList1" :class="tabIndex === index ? 'item-active'  : ''" :key="index"
           class="item" :id="'item'+index" @click="_changeTab(index, item.id, $event)">
        <figure class="classify-icon">
          <img class="img" mode="aspectFill" lazy-load v-if="item.image_url" :src="item.image_url">
        </figure>
        <p class="text">{{item.name}}</p>
      </div>
      <div class="line-con" :style="{'transform':'translateX('+lineTranslateX+'px)'}">
        <div class="line" :class="'corp-' + corpName + '-bg'"></div>
      </div>
    </scroll-view>
    <div class="big-box">
      <div class="classify-big-box"
           :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  (tabList1 && tabList1.length * 100) +'vw', transition: boxTransition}">
        <div class="goods-list-box" v-for="(tabItem, tabInx) in tabList1" :key="tabInx"
             :class="tabIndex * 1 === tabInx ? '' : 'order-item-list-active'">
          <div class="goods-list">
            <div class="goods-item-box" v-for="(item, index) in classifyList[tabInx]" :key="index"
                 @click="jumpGoodsDetail(item)">
              <div class="classify-box">
                <div class="classify-box-top">
                  <!--<img v-if="imageUrl && corpName === 'platform'"-->
                       <!--:src="imageUrl + '/yx-image/choiceness/icon-label2@2x.png'" alt="" class="top-label"-->
                       <!--mode="aspectFill">-->
                  <img v-if="item.goods_cover_image" :src="item.goods_cover_image" alt="" class="box-top-img"
                       mode="aspectFill">
                  <img v-if="imageUrl && item.usable_stock <= 0"
                       :src="imageUrl + '/yx-image/article/pic-out_stock@2x.png'"
                       mode="aspectFill"
                       class="box-top-img fix-pic">
                  <!--<div v-if="item.usable_stock <= 0" class="sold-out">已抢光</div>-->
                </div>
                <div class="classify-box-bottom">
                  <div class="title">{{item.name}}</div>
                  <div class="title-label-box"><span v-if="item.activity_theme" class="label-box-span">{{typeText[item.activity_theme]}}</span><span v-if="item.purchase_cycle * 1 === 1" class="label-box-span">次日达</span></div>
                  <div class="classify-price-box">
                    <div class="price-left">
                      <div class="price-number" :class="'corp-' + corpName + '-money'">{{item.trade_price}}</div>
                      <div class="price-money" :class="'corp-' + corpName + '-money'">元</div>
                      <div class="price-line">{{item.original_price}}元</div>
                    </div>
                    <div v-if="item.activity_theme === 'groupon'" class="go-group">去拼团</div>
                    <form v-else action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
                      <button class="price-right" formType="submit">
                        <img v-if="imageUrl && corpName === 'platform'"
                             :src="imageUrl + '/yx-image/collage/icon-addgoods@2x.png'" alt="" class="price-right-img">
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <loading-more v-if="!classifyMore"></loading-more>
          <div class="foot-ties" v-if="classifyMore && classifyList[tabInx] && classifyList[tabInx].length !== 0">
            <div class="center">— 再拉也没有了 —</div>
          </div>
          <div class="noting" v-if="classifyMore && classifyList[tabInx] && classifyList[tabInx].length === 0">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {cartMethods} from '@state/helpers'
  import { ACTIVE_TYPE_TEXT } from '@utils/contants'
  import ClearWatch from '@mixins/clear-watch'
  import LoadingMore from '@components/loading-more/loading-more'

  const PAGE_NAME = 'CLASSIFY'

  export default {
    name: PAGE_NAME,
    mixins: [ClearWatch],
    components: {
      NavigationBar,
      LoadingMore
    },
    data() {
      return {
        tabList: [],
        tabList1: [],
        width: 0,
        move: 0,
        tabIndex: 0,
        viewToItem: 'item0',
        statusBarHeight: 20,
        classifyId: null,
        classifyList: [],
        classifyPage: 1,
        classifyMore: false,
        boxTransition: '',
        lineTranslateX: 0,
        typeText: ACTIVE_TYPE_TEXT
        // currentList: []
      }
    },
    onLoad(options = {}) {
      let res = this.$wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.classifyId = options.id || 0
      this.getCategoryData(true)
    },
    onReachBottom() {
      this.getMoreCategoryList(this.classifyId, this.tabIndex)
    },
    methods: {
      ...cartMethods,
      async _changeTab(index, id, e) {
        if (this.tabIndex === index) return
        this.classifyList[this.tabIndex] = []
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        if (this.tabIndex === index + 1 || this.tabIndex === index - 1) {
          this.boxTransition = 'all .3s'
        } else {
          this.boxTransition = ''
        }
        this._setViewToItem(index)
        this.move = e.target.offsetLeft
        this.classifyId = id
        this.getCategoryList(this.classifyId, index)
      },
      _setViewToItem(index = 0) {
        this.tabIndex = index
        let number = index < 3 ? 0 : index - 2
        this.viewToItem = `item${number}`
        this._changeTabLine()
      },
      _changeTabLine() {
        this.lineTranslateX = 82 * this.tabIndex
      },
      getCategoryData(isLoad = false) {
        API.Choiceness.getClassifyCategory().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.tabList1 = res.data || []
          let length = res.data.length
          for (let i = 0; i < length; i++) {
            this.classifyList.push([])
          }
          res.data.forEach((item, index) => {
            if (item.id * 1 === this.classifyId * 1) {
              this._setViewToItem(index)
            }
          })
          this.getCategoryList(this.classifyId, this.tabIndex)
        })
      },
      getCategoryList(id, index) {
        this.classifyPage = 1
        this.classifyMore = false
        API.Choiceness.getClassifyList({goods_category_id: id, limit: 10, page: this.classifyPage}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.classifyList[index] = res.data
          this._isUpList(res)
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
          // console.log(this.classifyList[this.tabIndex])
          // this.currentList = res.data
        })
      },
      getMoreCategoryList(id) {
        if (this.classifyMore) {
          return
        }
        API.Choiceness.getClassifyList({
          goods_category_id: id,
          limit: 10,
          page: this.classifyPage
        }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.classifyList[this.tabIndex] = this.classifyList[this.tabIndex].concat(res.data)
          // this.currentList = this.currentList.concat(res.data)
          this._isUpList(res)
        })
      },
      _isUpList(res) {
        this.classifyPage++
        if (this.classifyList[this.tabIndex] && (this.classifyList[this.tabIndex].length >= res.meta.total * 1)) {
          this.classifyMore = true
        }
        // if (this.currentList && (this.currentList.length >= res.meta.total * 1)) {
        //   this.classifyMore = true
        // }
      },
      jumpGoodsDetail(item) {
        if (item.activity_theme) {
          wx.navigateTo({
            url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}&activityId=${item.activity_id}&activityType=${item.activity_theme}`
          })
          return
        }
        wx.navigateTo({
          url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
      async addShoppingCart(item) {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        API.Choiceness.addShopCart({goods_sku_id: item.goods_sku_id, activity_id: item.activity_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$sendMsg({
              event_no: 1007,
              goods_id: item.goods_id,
              title: item.name
            })
            this.$wechat.showToast('加入购物车成功', 1000, false)
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  $scroll-item-width = 82px

  .classify
    width: 100%
    min-height: 100vh
    background: $color-background

  .big-box
    width: 100vw
    overflow: hidden

    .classify-big-box
      width: 100vw
      display: flex
      transform: translateX(0)

  .goods-list-box
    width: 100vw

  .goods-list
    width: 100vw
    layout(row)
    align-items: center
    padding: 99px 6px 0 6px
    box-sizing: border-box

    .goods-item-box
      width: 50%
      box-sizing: border-box
      margin-bottom: 3px

      .classify-box
        background: #fff
        overflow: hidden
        padding: 10px 10px 12px
        box-sizing: border-box
        width: 100%
        border-radius: 4px
        box-shadow: 0 6px 20px 0 rgba(17, 17, 17, 0.06)

        .classify-box-top
          padding-bottom: 100%
          height: 0
          width: 100%
          overflow: hidden
          position: relative

          .top-label
            position: absolute
            left: 0
            top: 0
            display: block
            width: 29px
            height: 31px
            z-index: 11

          .box-top-img
            position: absolute
            left: 0
            top: 0
            z-index: 2
            display: block
            width: 100%
            height: 100%
            &.fix-pic
              position:absolute
              width:60px
              height:60px
              top:50%
              left:50%
              transform translate(-50%,-50%)
              z-index:10

        .classify-box-bottom
          padding-top: 7px
          .title-label-box
            height: 14px
            display :flex
            width: 100%
            margin-bottom: 8px
            .label-box-span
              font-family: $font-family-regular
              font-size: $font-size-10
              color: #FA7500
              height: 14px
              line-height: 15px
              display: inline-block
              background: rgba(250,117,0,0.1)
              padding: 0 5px
              border-radius: 14px
              border-1px(#FA7500, 14px)
              margin-right: 5px
          .title
            color: $color-text-main
            font-size: $font-size-14
            font-family: $font-family-regular
            min-height: $font-size-16
            no-wrap()
            margin-bottom: 8px

          .classify-price-box
            layout(row)
            align-items: center
            justify-content: space-between

            .price-left
              layout(row)
              align-items: center

              .price-number
                font-size: $font-size-18
                font-family: $font-family-medium
                margin-right: 2px

              .price-money
                font-size: $font-size-12
                font-family: $font-family-medium
                margin-right: 5px
                position: relative
                top: 2px

              .price-line
                color: $color-text-assist
                font-size: $font-size-12
                font-family: $font-family-regular
                text-decoration: line-through
                position: relative
                top: 2px
            .go-group
              width: 52px
              height: 23px
              line-height: 23px
              background: #FF8506
              font-size: $font-size-12
              color: $color-white
              font-family: $font-family-regular
              text-align: center
              border-radius: 11.5px
            .price-right
              width: 23px
              height: 23px
              position: relative

              .price-right-img
                width: 23px
                height: 23px
                display: block

    .goods-item-box:nth-of-type(odd)
      padding-right: 1.5px

    .goods-item-box:nth-of-type(even)
      padding-left: 1.5px

  .scroll-view2
    position: fixed
    top: 64px
    left: 0
    height: 93px
    width: 100vw
    z-index: 99
    display: block
    white-space: nowrap
    box-sizing: border-box
    transition: all 0.3s
    transform: translate3d(0, 0, 0)
    background: $color-white
    &:after
      content: ""
      position: absolute
      bottom: 0
      right: 0
      width: 100%
      background: $color-background
      transform: scaleY(.5) translateZ(0)
      border-bottom: 1px solid $color-line
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent

    .item
      white-space: nowrap
      font-family: $font-family-regular
      font-size: $font-size-13
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
      width: $scroll-item-width
      height: 93px
      box-sizing: border-box
      transform-origin: 50%
      .text
        width: 100%
        margin-top: 6px
        text-overflow:ellipsis
        overflow:hidden
        white-space:nowrap
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
      font-size: $font-size-15

    .line-con
      box-sizing: border-box
      position: absolute
      top: 89px
      left: 0
      z-index: 99
      width: $scroll-item-width
      height: 3px
      padding: 0 25px
      border-radius: 3px
      transition: all 0.45s

      .line
        height: 3px

  .scroll-view-top
    top: 84px

  .foot-ties
    layout(row)
    justify-content: center
    align-items: center
    height: 60px
    box-sizing: border-box
    padding-top: 25px
    padding-bottom: 20px

    .lines
      width: 10px
      height: 1px
      background: rgba(124, 132, 156, 0.20)
      margin: 0 5px

    .center
      font-family: $font-family-regular
      font-size: $font-size-14
      color: rgba(152, 152, 159, 0.30)
      text-align: justify
      line-height: 1

  .noting
    text-align: center
    margin-top: 50px

    .notingimg
      width: 116px
      height: 110px
      margin: 0 auto 15px

      .img
        display: block
        width: 100%
        height: 100%

    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub

  .txt
    height: 100px

  .order-item-list-active
    height: 70vh

  .price-right
    &:after
      border: none

  .sold-out
    opacity: 0.75
    background: rgba(0, 0, 0, 0.6)
    position: absolute
    left: 0
    top: 0
    bottom: 0
    right: 0
    z-index: 9
    width: 70%
    height: @width
    margin: auto
    color: #fff
    font-family: $font-family-medium
    font-size: $font-size-16
    text-align: center
    border-radius: 100%
    layout()
    align-items: center
    justify-content: center
</style>
