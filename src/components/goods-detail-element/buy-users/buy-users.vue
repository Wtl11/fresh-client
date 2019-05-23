<template>
  <section v-if="buyUsers.length" class="buy-users">
    <swiper
      class="carousel"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      circular
      vertical
    >
      <block v-for="(item, index) in buyUsers" :key="index">
        <swiper-item class="content-wrapper">
          <figure class="avatar-wrapper">
            <img v-if="item.head_image_url" :src="item.head_image_url" alt="" class="img">
          </figure>
          <div class="text">买了{{item.goods_name}}</div>
        </swiper-item>
      </block>
    </swiper>
    <div class="place-holder"></div>
  </section>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BUY_USERS'

  export default {
    name: COMPONENT_NAME,
    props: {
      buyUsers: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .buy-users
    width :35vw
    height: 24px
    padding: 0 9.5px 0 3px
    background: rgba(17,17,17,0.6)
    border-radius: 36px
    position :absolute
    top:10px
    left :8px
    z-index :80
    overflow :hidden
    .place-holder
      fill-box(absolute)
      z-index :3
    .carousel
      height :100%
      width :100%
      .content-wrapper
        layout(row)
        align-items: center
        .avatar-wrapper
          width: 20px
          height: 20px
          border-radius: 50%
          overflow: hidden
          margin :0 6px 0 0
          .img
            width: 100%
            height: 100%
        .text
          flex: 1
          font-family: $font-family-regular
          font-size: 12px
          color: #fff
          no-wrap()
</style>
