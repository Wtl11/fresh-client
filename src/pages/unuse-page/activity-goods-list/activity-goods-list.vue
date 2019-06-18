<template>
  <div class="activity-goods-list">
    <navigation-bar ref="navigationBar" :title="activityData.title" showArrow="true"></navigation-bar>
    <section class="tab-wrapper" v-if="activityData.hasClassify && classifyTabArray.length">
      <classify-tab
        :tabList="classifyTabArray"
        :tabIndex="classifyTabIndex"
        @changeTab="classifyChangeTab"
      ></classify-tab>
    </section>
    <ul v-if="goodsList.length" class="goods-list"
        :class="activityData.hasClassify && classifyTabArray.length ? 'hasClassifyTab' : ''">
      <li class="goods-item-box" v-for="(item, index) in goodsList" :key="index">
        <goods-item :item="item" @goToChildPage="handleGoToChildPage"></goods-item>
      </li>
      <li class="foot-ties" v-if="!hasMore && !isShowEmpty">
        <div class="lines left"></div>
        <div class="lines right"></div>
        <div class="center">再拉也没有了</div>
      </li>
    </ul>
    <section class="noting" v-else-if="isShowEmpty">
      <div class="noting-img">
        <img class="img" v-if="imageUrl" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt="">
      </div>
      <div class="txt">空空如也</div>
    </section>
<!--    <button class="shop-car" formType="submit" @click="goToShoppingCar">-->
<!--      <img class="car-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-shopcart@2x.png'"-->
<!--           alt="">-->
<!--      <p v-if="count" class="red-wrapper">{{count * 1 > 99 ? 99 : count}}</p>-->
<!--    </button>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import GoodsItem from './goods-item/goods-item'
  import ClassifyTab from './classify-tab/classify-tab'
  import {cartComputed} from '@state/helpers'

  const PAGE_NAME = 'ACTIVITY_GOODS_LIST'
  const ACTIVITY_CONFIG = [
    {id: 0, title: '今日爆品'},
    {id: 1, title: '新人特惠'},
    {id: 2, title: '分类', hasClassify: true}
  ]

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      GoodsItem,
      ClassifyTab
    },
    data() {
      return {
        activityData: {},
        goodsList: [],
        hasMore: true, // 是否还有更多商品
        isShowEmpty: false, // 是否一件商品都没有
        page: 1,
        limit: 10,
        goChildPage: false, // 是否跳去了商品详情
        classifyStyles: '',
        classifyTabIndex: 0
      }
    },
    computed: {
      ...cartComputed,
      // 商品分类tab数组
      classifyTabArray() {
        let arr = [
          {
            id: 1,
            name: '时令鲜果',
            parent_id: 0,
            sort: 12,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/05/07/155721623244866.png'
          },
          {
            id: 1249,
            name: '应季时蔬',
            parent_id: 0,
            sort: 11,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/23/155600152568706.png'
          },
          {
            id: 50,
            name: '粤式早点',
            parent_id: 0,
            sort: 10,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/23/155600802513573.png'
          },
          {
            id: 1603,
            name: '肉蛋家禽',
            parent_id: 0,
            sort: 9,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/28/155643323297815.png'
          },
          {
            id: 635,
            name: '海鲜冻品',
            parent_id: 0,
            sort: 9,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/23/155600994332447.png'
          },
          {
            id: 25,
            name: '粮油副食',
            parent_id: 0,
            sort: 8,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/23/155600203152467.png'
          },
          {
            id: 20,
            name: '网红零食',
            parent_id: 0,
            sort: 7,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/23/155600763887232.png'
          },
          {
            id: 42,
            name: '日用百货',
            parent_id: 0,
            sort: 2,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/23/155600786261924.png'
          },
          {
            id: 644,
            name: '酒饮冲调',
            parent_id: 0,
            sort: 1,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/23/155600944596216.png'
          },
          {
            id: 648,
            name: '养颜汤料',
            parent_id: 0,
            sort: 0,
            image_url: 'https://youxian-img.jkweixin.com/1/2019/04/23/155601083888000.png'
          }
        ]
        return arr
      }
    },
    onLoad(e) {
      this.$wechat.showLoading()
      this.activityData = ACTIVITY_CONFIG[e.activityId] || {}
      if (this.activityData.hasClassify) {
        this.classifyTabIndex = parseInt(e.classifyIndex) || 0
      }
    },
    onShow() {
      this._getGoodsList()
    },
    onReachBottom() {
      if (!this.hasMore) return
      this.page++
      this._getGoodsList()
    },
    async onPullDownRefresh() {
      this._resetListParams()
      this._getGoodsList(() => {
        wx.stopPullDownRefresh()
      })
    },
    methods: {
      async _getGoodsList(callback) {
        if (!this.hasMore) return
        let data = {goods_category_id: 1, page: this.page}
        API.FlashSale.getClassifyList(data).then((res) => {
          callback && callback()
          let meta = res.meta
          if (meta) {
            // if (活动已结束) {
            //   wx.redirectTo({url: '/pages/goods-end'})
            // }
            if (meta.current_page === 1) {
              this.goodsList = res.data
              this.isShowEmpty = meta.total === 0
            } else {
              let arr = this.goodsList.concat(res.data)
              this.goodsList = arr
            }
            this.hasMore = meta.current_page < meta.last_page
          }
          this.$wechat.hideLoading()
        }).catch(() => {
          callback && callback()
        })
      },
      _resetListParams() {
        this.page = 1
        this.hasMore = true
        this.isShowEmpty = false
      },
      handleGoToChildPage() {
        this.goChildPage = true
      },
      goToShoppingCar() {
        wx.switchTab({url: `${this.$routes.main.SHOPPING_CART}`})
      },
      // 类目栏的tab切换
      classifyChangeTab(index, id, e) {
        this.classifyTabIndex = index
        this._resetListParams()
        this._getGoodsList()
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  $ac-tab-height = 92px

  .tab-wrapper
    position: fixed
    top: 64px
    left: 0
    z-index: 99
    height: $ac-tab-height
    width: 100%
    background: #ffffff

  .goods-list
    width: 100vw
    layout(row)
    align-items: center
    padding: 0 6px
    box-sizing: border-box

    &.hasClassifyTab
      margin-top: $ac-tab-height+6

    .goods-item-box
      width: 50%
      box-sizing: border-box
      margin-bottom: 3px

      &:nth-of-type(odd)
        padding-right: 1.5px

      &:nth-of-type(even)
        padding-left: 1.5px

    .foot-ties
      width: 100vw
      layout(row, block, nowrap)
      justify-content: center
      align-items: center
      padding-top: 25px
      padding-bottom: 20px
      position: relative

      .lines
        position absolute
        col-center()
        margin-top: 2.5px
        width: 10px
        height: 1px
        background: rgba(124, 132, 156, 0.20)

        &.left
          left: 34%

        &.right
          right: 34%

      .center
        position: relative
        font-family: $font-family-regular
        font-size: $font-size-14
        color: rgba(152, 152, 159, 0.30)

  .noting
    text-align: center
    margin-top: 100px

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

  .shop-car
    position: fixed
    right: 15px
    bottom: 65px
    width: 52px
    height: @width
    background: #FFFFFF;
    box-shadow: 0 4px 15px 0 rgba(17, 17, 17, 0.20);
    border-radius: 50%
    z-index: 101
    display: flex
    align-items: center
    justify-content: center

    .car-img
      position: relative
      top: 2px
      width: 25px
      height: 20.2px

    .red-wrapper
      position: absolute
      top: 9px
      right: 8px
      width: 17px
      height: @width
      box-sizing: border-box
      background: #FE3B39;
      border: 1px solid #FFFFFF;
      border-radius: 50%
      font-family: $font-family-regular
      font-size: 10px;
      color: #FFFFFF;
      text-align: center
      line-height: 14px

</style>
