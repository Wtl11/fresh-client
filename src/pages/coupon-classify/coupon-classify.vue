<template>
  <div class="coupon-classify">
    <navigation-bar title="商品"></navigation-bar>
    <div class="line"></div>
    <ul v-if="goodsList.length" class="goods-list">
      <li class="goods-item-box" v-for="(item, index) in goodsList" :key="index">
        <classify-item :item="item"></classify-item>
      </li>
      <li class="foot-ties" v-if="!hasMore">
        <div class="left lines"></div>
        <div class="center">再拉也没有了</div>
        <div class="bot lines"></div>
      </li>
    </ul>
    <section class="noting" v-else-if="isShowEmpty">
      <div class="noting-img">
        <img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt="">
      </div>
      <div class="txt">空空如也</div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ClassifyItem from './classify-item/classify-item'
  import API from '@api'

  const PAGE_NAME = 'COUPON_CLASSIFY'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ClassifyItem
    },
    data() {
      return {
        goodsList: [],
        hasMore: true,
        isShowEmpty: false,
        isFirstLoad: true,
        page: 1,
        limit: 10
      }
    },
    onLoad() {
      this._getList()
    },
    onReachBottom() {
      this.page++
      this._getList()
    },
    onPullDownRefresh() {
      this.page = 1
      this.hasMore = true
      this._getList(() => {
        wx.stopPullDownRefresh()
      })
    },
    methods: {
      _getList(callback) {
        if (!this.hasMore) return
        let data = {customer_coupon_id: this.$mp.query.id, limit: this.limit, page: this.page}
        API.Coupon.getGoodsList(data, this.isFirstLoad).then((res) => {
          callback && callback()
          this.$wechat.hideLoading()
          let meta = res.meta
          if (meta.current_page === 1) {
            this.goodsList = res.data
            this.isShowEmpty = meta.total === 0
            this.isFirstLoad = false
          } else {
            let arr = this.goodsList.concat(res.data)
            this.goodsList = arr
          }
          this.hasMore = meta.current_page < meta.last_page
        }).catch(() => {
          callback && callback()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .coupon-classify
    min-height :100vh
    background: $color-background
  .line
    height :5px
  .goods-list
    width: 100vw
    layout(row)
    align-items: center
    padding: 0 6px
    box-sizing: border-box
    .goods-item-box
      width: 50%
      box-sizing: border-box
      margin-bottom: 3px
      &:nth-of-type(odd)
        padding-right: 1.5px
      &:nth-of-type(even)
        padding-left: 1.5px
    .foot-ties
      width :100vw
      box-sizing :border-box
      layout(row)
      justify-content: center
      align-items: center
      height: 60px
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
    .noting-img
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
</style>
