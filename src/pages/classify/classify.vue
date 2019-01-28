<template>
  <div class="classify">
    <navigation-bar title="分类"></navigation-bar>
    <scroll-view class="scroll-view2" :class="statusBarHeight * 1 === 20 ? '' : 'scroll-view-top'" v-if="tabList1.length" id="scrollView" :scroll-into-view="viewToItem" scroll-x>
      <div class="under-line" :style="{left: move + 'px', width: arrWidth[tabIndex] + 'px' }"></div>
      <div v-for="(item, index) in tabList1" :class="tabIndex === index ? 'item-active'  : ''" :key="index" class="item" :id="'item'+index" @click="_changeTab(index, item.id, $event)">
      {{item.name}}
        <div class="item-under-line">
          <div class="line"></div>
        </div>
      </div>
    </scroll-view>
    <div class="goods-list">
      <div class="goods-item-box" v-for="(item, index) in classifyList" :key="index" @click="jumpGoodsDetail(item)">
        <div class="classify-box">
          <div class="classify-box-top">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-label2@2x.png'" alt="" class="top-label" mode="aspectFill">
            <img v-if="item.goods_cover_image" :src="item.goods_cover_image" alt="" class="box-top-img" mode="aspectFill">
          </div>
          <div class="classify-box-bottom">
            <div class="title">{{item.name}}</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number">{{item.shop_price}}</div>
                <div class="price-money">元</div>
                <div class="price-line">{{item.original_price}}元</div>
              </div>
              <form action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
                <button class="price-right" formType="submit">
                  <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-ties" v-if="classifyMore && classifyList.length !== 0">
      <div class="left lines"></div>
      <div class="center">再拉也没有了</div>
      <div class="bot lines"></div>
    </div>
    <div class="noting" v-if="classifyMore && classifyList.length === 0">
      <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
      <div class="txt">空空如也</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'CLASSIFY'

  export default {
    name: PAGE_NAME,
    watch: {
      tabList(news) {
        this.tabList1 = news
        setTimeout(() => {
          this.getWidth('', '', '', false)
        }, 100)
      },
      infoTabIndex(newVal) {
        this.tabIndex = newVal
      }
    },
    data() {
      return {
        tabList: [],
        tabList1: [],
        arrWidth: [],
        width: 0,
        move: 0,
        tabIndex: 0,
        viewToItem: 'item0',
        statusBarHeight: 20,
        classifyId: null,
        classifyList: [],
        classifyPage: 1,
        classifyMore: false
      }
    },
    components: {
      NavigationBar
    },
    onLoad(options) {
      let syncRes = wx.getSystemInfoSync()
      this.statusBarHeight = syncRes.statusBarHeight || 20
      this.classifyId = options.id
      this.getCategoryData()
      this.getCategoryList(this.classifyId)
    },
    onReachBottom() {
      this.getMoreCategoryList(this.classifyId)
    },
    methods: {
      getWidth(index, id, e) {
        this.allWidth = 0
        let query = wx.createSelectorQuery()
        query.selectAll('.item').boundingClientRect()
        query.exec((res) => {
          this.arrWidth = res[0].map((item, index) => {
            this.allWidth += item.width
            return item.width
          })
        })
      },
      async _changeTab(index, id, e) {
        if (this.tabIndex * 1 === index * 1) return
        let number = index * 1 === 0 ? 1 : index
        if (this.tabIndex > index) {
          if (index <= 3) {
            number = 0
          } else {
            number = index
          }
        } else if (this.tabIndex < index) {
          if (index <= 3) {
            number = 0
          } else {
            number = index
          }
        }
        this.viewToItem = `item${number}`
        this.tabIndex = index
        this.move = e.target.offsetLeft
        this.classifyId = id
        this.getCategoryList(this.classifyId)
      },
      getCategoryData() {
        API.Choiceness.getClassifyCategory().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.tabList1 = res.data
          res.data.forEach((item, index) => {
            if (item.id * 1 === this.classifyId * 1) {
              this.tabIndex = index
              if (index > 3) {
                this.viewToItem = `item${index}`
              } else {
                this.viewToItem = `item0`
              }
            }
          })
        })
      },
      getCategoryList(id) {
        this.classifyPage = 1
        this.classifyMore = false
        API.Choiceness.getClassifyList({goods_category_id: id, limit: 10, page: this.classifyPage}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.classifyList = res.data
          this._isUpList(res)
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
        })
      },
      getMoreCategoryList(id) {
        if (this.classifyMore) {
          return
        }
        API.Choiceness.getClassifyList({goods_category_id: id, limit: 10, page: this.classifyPage}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.classifyList = this.classifyList.concat(res.data)
          this._isUpList(res)
        })
      },
      _isUpList(res) {
        this.classifyPage++
        if (this.classifyList.length >= res.meta.total * 1) {
          this.classifyMore = true
        }
      },
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.id}`
        })
      },
      addShoppingCart(item) {
        if (!this.$isLogin()) {
          return
        }
        API.Choiceness.addShopCart({sku_id: item.shop_sku_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
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
  @import "~@design"

  .classify
    width: 100%
    min-height: 100vh
    background: $color-background
  .goods-list
    layout(row)
    align-items: center
    padding-top: 45px
    .goods-item-box
      width: 50%
      box-sizing: border-box
      margin-bottom: 3px
      .classify-box
        background: #fff
        .classify-box-top
          width: 49.73vw
          height: 49.73vw
          position: relative
          .top-label
            position: absolute
            left: 8px
            top: 0
            display: block
            width: 31.2px
            height: 31.4px
          .box-top-img
            display: block
            width: 100%
            height: 100%
        .classify-box-bottom
          padding: 10px 12px 15px 7.5px
          .title
            color: $color-text-main
            font-size: $font-size-14
            font-family: $font-family-regular
            no-wrap()
            margin-bottom: 8.5px
          .classify-price-box
            layout(row)
            align-items: center
            justify-content: space-between
            .price-left
              layout(row)
              align-items: center
              .price-number
                color: $color-money
                font-size: $font-size-18
                font-family: $font-family-medium
                margin-right: 2px
              .price-money
                color: $color-money
                font-size: $font-size-12
                font-family: $font-family-medium
                margin-right: 5px
              .price-line
                color: $color-text-assist
                font-size: $font-size-12
                font-family: $font-family-regular
                text-decoration: line-through
            .price-right
              width: 23px
              height: 23px
              position: relative
              .price-right-img
                width: 23px
                height: 23px
                display: block
    .goods-item-box:nth-of-type(odd)
      padding-right: 2px
    .goods-item-box:nth-of-type(even)
      padding-left: 2px
  .scroll-view2
    display: block
    position: fixed
    z-index: 111
    top: 64px
    left: 0
    height: 40px
    width: 100vw
    background: $color-white
    box-shadow: 0 1px 8px 0 rgba(55, 75, 99, 0.04)
    white-space: nowrap
    box-sizing: border-box
    transform: translateX(0)
    transition: all 0.3s
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      height: 100%
      line-height: 40px
      white-space: nowrap
      padding: 0 12.5px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
      /*transition: all 0.3s*/
      min-width: 66px
      box-sizing: border-box
      transform-origin: 50%
    .item-active
      font-family: $font-family-medium
      font-size: $font-size-16
      .item-under-line
        position: absolute
        width: 100%
        height: 3px
        left: 0
        bottom: 0
        .line
          width: 30px
          height: 3px
          background: $color-main
          margin: 0 auto
          border-radius: 3px

  .under-line
    position: absolute
    bootom: 0
    left: 0
    width: 81px
    background: $color-main
    /*transition: left 0.3s*/
    border-radius: 8px 8px 0px 0px
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

  .price-right
    &:after
      border: none
</style>
