<template>
  <div class="classify">
    <navigation-bar title="分类"></navigation-bar>
    <scroll-view class="scroll-view2" :class="statusBarHeight * 1 === 20 ? '' : 'scroll-view-top'" v-if="tabList1.length" id="scrollView" :scroll-into-view="viewToItem" scroll-x scroll-with-animation>
      <div class="under-line" :style="{left: move + 'px', width: arrWidth[tabIndex] + 'px' }"></div>
      <div v-for="(item, index) in tabList1" :class="tabIndex === index ? 'item-active'  : ''" :key="index" class="item" :id="'item'+index" @click="_changeTab(index, item.id, $event)">
      {{item.name}}
        <div class="item-under-line">
          <div class="line"></div>
        </div>
      </div>
    </scroll-view>
    <div class="goods-list">
      <div class="goods-item-box" @click="setTab">
        <div class="classify-box">
          <div class="classify-box-top">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-label2@2x.png'" alt="" class="top-label">
          </div>
          <div class="classify-box-bottom">
            <div class="title">超值特惠 4斤新鲜柠檬4斤新鲜柠檬</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number">10.8</div>
                <div class="price-money">元</div>
                <div class="price-line">12元</div>
              </div>
              <div class="price-right">
                <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-item-box" @click="setTab">
        <div class="classify-box">
          <div class="classify-box-top">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-label2@2x.png'" alt="" class="top-label">
          </div>
          <div class="classify-box-bottom">
            <div class="title">超值特惠 4斤新鲜柠檬4斤新鲜柠檬</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number">10.8</div>
                <div class="price-money">元</div>
                <div class="price-line">12元</div>
              </div>
              <div class="price-right">
                <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-item-box" @click="setTab">
        <div class="classify-box">
          <div class="classify-box-top">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-label2@2x.png'" alt="" class="top-label">
          </div>
          <div class="classify-box-bottom">
            <div class="title">超值特惠 4斤新鲜柠檬4斤新鲜柠檬</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number">10.8</div>
                <div class="price-money">元</div>
                <div class="price-line">12元</div>
              </div>
              <div class="price-right">
                <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-item-box" @click="setTab">
        <div class="classify-box">
          <div class="classify-box-top">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-label2@2x.png'" alt="" class="top-label">
          </div>
          <div class="classify-box-bottom">
            <div class="title">超值特惠 4斤新鲜柠檬4斤新鲜柠檬</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number">10.8</div>
                <div class="price-money">元</div>
                <div class="price-line">12元</div>
              </div>
              <div class="price-right">
                <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-item-box" @click="setTab">
        <div class="classify-box">
          <div class="classify-box-top">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-label2@2x.png'" alt="" class="top-label">
          </div>
          <div class="classify-box-bottom">
            <div class="title">超值特惠 4斤新鲜柠檬4斤新鲜柠檬</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number">10.8</div>
                <div class="price-money">元</div>
                <div class="price-line">12元</div>
              </div>
              <div class="price-right">
                <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-item-box" @click="setTab">
        <div class="classify-box">
          <div class="classify-box-top">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-label2@2x.png'" alt="" class="top-label">
          </div>
          <div class="classify-box-bottom">
            <div class="title">超值特惠 4斤新鲜柠檬4斤新鲜柠檬</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number">10.8</div>
                <div class="price-money">元</div>
                <div class="price-line">12元</div>
              </div>
              <div class="price-right">
                <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-item-box" @click="setTab">
        <div class="classify-box">
          <div class="classify-box-top">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-label2@2x.png'" alt="" class="top-label">
          </div>
          <div class="classify-box-bottom">
            <div class="title">超值特惠 4斤新鲜柠檬4斤新鲜柠檬</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number">10.8</div>
                <div class="price-money">元</div>
                <div class="price-line">12元</div>
              </div>
              <div class="price-right">
                <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

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
        tabList1: [{name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}],
        arrWidth: [],
        width: 0,
        move: 0,
        tabIndex: 0,
        viewToItem: 'item0',
        statusBarHeight: 20
      }
    },
    components: {
      NavigationBar
    },
    onLoad() {
      let syncRes = wx.getSystemInfoSync()
      this.statusBarHeight = syncRes.statusBarHeight || 20
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
      setTab() {
        this.tabList = [{name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}, {name: '日常用品'}]
      },
      async _changeTab(index, id, e) {
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
        this.sheTag_id = id
        this.getGoodsList()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .classify
    width: 100%
    height: 100vh
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
          background: #333
          position: relative
          .top-label
            position: absolute
            left: 8px
            top: 0
            display: block
            width: 31.2px
            height: 31.4px
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
      min-width: 76px
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
</style>
