<template>
  <div class="good-item" @click="clickThis">
    <div class="goods-photo">
      <img v-if="imageUrl && goodsData.is_online === 0" :src="imageUrl + '/yx-image/article/pic-off_shelf@2x.png'" mode="aspectFill" class="goods-photo fix-pic">
      <img v-else-if="imageUrl && goodsData.usable_stock === 0" :src="imageUrl + '/yx-image/article/pic-out_stock@2x.png'" mode="aspectFill" class="goods-photo fix-pic">
      <img v-if="imageUrl" :src="goodsData.goods_cover_image" mode="aspectFill" class="goods-photo">
    </div>
    <div class="info">
      <div v-if="goodsData && goodsData.name" class="name">{{goodsData.name}}</div>
      <div class="details">{{goodsData.describe}}</div>
      <div class="operate">
        <div>
          <span class="price-now">
            <span class="big">{{goodsData.trade_price}}</span>
            <span class="unit">元</span>
          </span>
          <span class="price">{{goodsData.original_price}}元</span>
        </div>
        <div class="add-btn-wrap" @click.stop="addBtn(goodsData)">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/article/icon-add_to@2x.png'" class="add-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'GOODS_ITEM'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    props: {
      goodsData: {
        require: true,
        type: Object,
        default: function() {
          return {
            name: '',
            details: '',
            price: '',
            photo: ''
          }
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      addBtn(value) {
        this.$emit('add', value)
      },
      clickThis(value) {
        this.$emit('click', value)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .good-item
    display flex
    background: #FFFFFF
    border: 1px solid #EFEFEF
    box-shadow: 0 4px 6px 0 rgba(17, 17, 17, 0.02)
    border-radius: 8px
    margin-bottom 15px
    height:90px
    .goods-photo
      width: 90px
      height: 90px
      flex-shrink: 0
      border-radius 8px 0px 0px 8px
      position:relative
      &.fix-pic
        position:absolute
        top:0
        left:0
        right:0
        bottom 0
        z-index:10
    .info
      padding: 5px 0px 5px 12px
      overflow: hidden
      flex: 1
      display flex
      flex-direction:column
      justify-content space-between
      .name
        font-family $font-family-medium
        font-size: $font-size-16
        color: #111111
        overflow hidden
        text-overflow ellipsis
        white-space: nowrap

      .details
        font-family $font-family-regular
        font-size: $font-size-14
        color: #808080
        margin: 4px 0px 5px
        overflow hidden
        text-overflow ellipsis
        white-space: nowrap

      .operate
        display flex
        justify-content space-between
        align-items center

      .price-now
        color: #FA7500
        font-family $font-family-medium

        .big
          font-size: $font-size-25

        .unit
          font-family $font-family-regular
          font-size: $font-size-12

      .price
        color: #B7B7B7
        font-size: $font-size-12
        font-family $font-family-regular
        text-decoration-line line-through
        margin-left 6px

    .add-btn-wrap
      display flex
      justify-content space-between
      align-items center
      padding:5px 12px
    .add-img
      width: 24px
      height: 24px


</style>
