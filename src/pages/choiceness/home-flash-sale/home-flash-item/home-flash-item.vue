<template>
  <div class="home-flash-item" @click="navHandle">
    <figure class="goods-wrapper">
      <img
        class="img"
        mode="aspectFill"
        v-if="imageUrl"
        src="http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/26/155357176784195.png">
    </figure>
    <article class="bottom-wrapper">
      <p class="title">超值特新鲜柠…</p>
      <div class="price-wrapper">
        <p class="number">10.8</p>
        <p class="unit">元</p>
        <button class="button" @click.stop="submitHandle">
          <figure class="button-img">
            <img
              class="img"
              mode="aspectFill"
              v-if="imageUrl"
              :src="imageUrl + '/yx-image/2.1/icon-shopcart copy 2@2x.png'"
            >
          </figure>
        </button>
      </div>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_FLASH_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      dataInfo: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {

      }
    },
    methods: {
      submitHandle() {
        console.log(123)
      },
      navHandle() {
        console.log(666)
        wx.navigateTo({url: '/pages/flash-sale-list'})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    display :block

  .home-flash-item
    width :26.666666666666668vw
    height :100%
    .goods-wrapper
      width :26.666666666666668vw
      height :26.666666666666668vw
    .bottom-wrapper
      overflow :hidden
      .title
        padding-top :10px
        font-family: $font-family-regular
        font-size: 13px;
        color: #111111;
        no-wrap()
      .button-group-wrapper
        overflow :hidden
       .price-wrapper
          padding-top: 10.4px
          display :flex
          color: #FF8300;
          font-family: $font-family-medium
          position :relative
          .number
            font-size: 17px
          .unit
            position :relative
            top:5px
            margin-left :1px
            font-size :10px
          .button
            position :absolute
            bottom :0
            right :0
            width :40px
            height :@width
            .button-img
              position :absolute
              bottom :0
              right :0
              width :23px
              height :@width
</style>
