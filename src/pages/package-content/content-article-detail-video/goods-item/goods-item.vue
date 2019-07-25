<template>
  <div class="good-item" @click="clickThis">
    <div class="goods-photo-wrap">
      <img v-if="imageUrl && goodsData.is_online === 0" :src="imageUrl + '/yx-image/article/pic-off_shelf@2x.png'" mode="aspectFill" class="goods-photo fix-pic">
      <img v-else-if="imageUrl && goodsData.usable_stock === 0" :src="imageUrl + '/yx-image/article/pic-out_stock@2x.png'" mode="aspectFill" class="goods-photo fix-pic">
      <img :src="goodsData.goods_cover_image" mode="aspectFill" class="goods-photo">
    </div>
    <div class="info">
      <div v-if="goodsData && goodsData.name" class="name">{{goodsData.name}}</div>
      <div class="details">{{goodsData.describe}}</div>
      <div>
          <span class="price-now">
            <span class="big">{{goodsData.trade_price}}</span>
            <span class="unit">元</span>
          </span>
          <span class="price">{{goodsData.original_price}}元</span>
      </div>
    </div>
    <div class="add-btn-wrap" @click.stop="addBtn(goodsData)">
      <tempalte v-if="imageUrl">
        <img v-if="goodsData.is_online === 0 || goodsData.usable_stock === 0" :src="imageUrl + '/yx-image/article/icon-add_hui@2x.png'" class="add-img">
        <img v-else :src="imageUrl + '/yx-image/article/icon-add_to@2x.png'" class="add-img">
      </tempalte>
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
    background: #F7F7F7
    border-1px(#EFEFEF, 4px)
    box-shadow: 0 4px 6px 0 rgba(17, 17, 17, 0.02)
    height:90px
    .goods-photo-wrap
      width:90px
      position:relative
      border-radius 4px 0px 0px 4px
      flex-shrink: 0
    .goods-photo
      width:100%
      height:100%
      border-radius 4px 0px 0px 4px
      &.fix-pic
        position:absolute
        width:60px
        height:60px
        top:50%
        left:50%
        transform translate(-50%,-50%)
        z-index:10
    .info
      padding: 5px 0px 5px 12px
      overflow: hidden
      flex: 1
      display flex
      flex-direction:column
      justify-content: space-around
      .name
        font-family $font-family-medium
        font-size: $font-size-16
        color: #111111
        overflow hidden
        text-overflow ellipsis
        white-space: nowrap
        padding-right 12px

      .details
        font-family $font-family-regular
        font-size: $font-size-14
        color: #808080
        margin-bottom 5px
        overflow hidden
        text-overflow ellipsis
        white-space: nowrap
        padding-right:12px

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
      padding:0px 15px 0px 12px
    .add-img
      width: 24px
      height: 24px


</style>
