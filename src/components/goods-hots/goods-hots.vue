<template>
  <block v-if="dataArray.length">
    <div class="goods-hots">
      <p class="title">今日爆款</p>
      <div class="scroll-wrapper">
        <ul class="goods-wrapper no-scroll-bar ios-scroll-smooth">
          <block v-for="(item, index) in dataArray" :key="index" >
            <li v-if="index<10" class="goods goods-default" @click="navHandle(item)">
              <block v-if="item.goods_cover_image">
                <img mode="aspectFill" :src="item.goods_cover_image" alt="" class="goods-cover">
              </block>
              <p class="name">{{item.name}}</p>
              <p class="money"><span class="price">{{item.trade_price}}</span><span class="unit">元</span><span class="origin-price">{{item.original_price}}元</span></p>
            </li>
          </block>
        </ul>
      </div>
    </div>

  </block>
</template>

<script type="text/ecmascript-6">
  import { ACTIVE_TYPE } from '@utils/contants'

  const COMPONENT_NAME = 'GOODS_HOTS'

  export default {
    name: COMPONENT_NAME,
    props: {
      dataArray: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
      }
    },
    methods: {
      navHandle(item) {
        wx.navigateTo({
          url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}&activityId=${item.activity_id}&activityType=${ACTIVE_TYPE.GOODS_HOT_TAG}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  /*惯性滚动*/
  .ios-scroll-smooth
    -webkit-overflow-scrolling: touch

    /*隐藏scroll*/
  .no-scroll-bar
    ::-webkit-scrollbar
      width: 0
      height: 0
      background-color: transparent
      display: none
    ::-webkit-scrollbar-button
      background-color: rgba(0, 0, 0, 0)

    ::-webkit-scrollbar-track
      background-color: rgba(0, 0, 0, 0)

    ::-webkit-scrollbar-track-piece
      background-color: rgba(0, 0, 0, 0)

    ::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, 0)

    ::-webkit-scrollbar-corner
      background-color: rgba(0, 0, 0, 0)

    ::-webkit-scrollbar-resizer
      background-color: rgba(0, 0, 0, 0)

    .-o-scrollbar
      -moz-appearance: none !important
      background: rgba(0, 255, 0, 0) !important

    ::-o-scrollbar-button
      background-color: rgba(0, 0, 0, 0)

    ::-o-scrollbar-track
      background-color: rgba(0, 0, 0, 0)

    ::-o-scrollbar-track-piece
      background-color: rgba(0, 0, 0, 0)

    ::-o-scrollbar-thumb
      background-color: rgba(0, 0, 0, 0)

    ::-o-scrollbar-corner
      background-color: rgba(0, 0, 0, 0)

    ::-o-scrollbar-resizer
      background-color: rgba(0, 0, 0, 0)

  /*商品卡片*/
  .goods-default
    width :90px
    font-family: $font-family-regular
    color: #111111
    line-height: 1
    .goods-cover
      width: 90px
      height: @width
      background: #F8F8F8;
      border-radius: 3px
      font-size: 0
    .name
      padding-top :7px
      font-size: 13px;
      no-wrap()
    .money
      padding-top :8px
      font-family : $font-family-medium
      color: #B7B7B7;
      no-wrap()
      .price
        font-size: 20px
        line-height :16px
        color: #FA7500;
        letter-spacing: -1px
      .unit
        padding-left :1px
        color: #FA7500;
        font-size: 11px
        line-height : 10px
      .origin-price
        padding-left :5.5px
        font-family: $font-family-regular
        font-size: 11px;
        text-decoration: line-through


  /*main主函数*/
  .goods-hots
    margin : 0 12px
    box-sizing :border-box
    background: #FFFFFF;
    box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06);
    border-radius: 8px
    height :193px
    line-height :1
    display :flex
    flex-direction :column
    flex-wrap: nowrap
    .title
      padding 15px 10px
      font-family: $font-family-medium
      font-size: 14px;
      color: #1F1F1F;
    .scroll-wrapper
      flex: 1
      width :100%
      overflow hidden
      .goods-wrapper
        layout(row,block,nowrap)
        padding :0 10px
        height :100%
        overflow-x: scroll
        .goods
          margin-right :10px
          &:last-child
            margin-right :0
            padding-right: 10px

</style>
