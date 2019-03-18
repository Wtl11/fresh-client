<template>
  <div class="user-item">
    <div class="wrapper">
      <figure class="avatar-wrapper">
        <img class="img" mode="aspectFit" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-lqcoupon@2x.png'">
      </figure>
      <section class="info-wrapper">
        <p class="name">康卉彬</p>
        <p class="status">已领取</p>
      </section>
      <section class="date-wrapper">03.15 12:30:55</section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'USER_ITEM'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    line-height :0
    font-size :0

  .user-item
    width: 100%
    height :0
    padding-top :17.3015873015873%
    position :relative
    .wrapper
      fill-box(absolute)
      layout(row,block,nowrap)
      font-family: $font-family-regular
      color: $color-text-main
      line-height: 1.2
      align-items :center
      .avatar-wrapper
        width :9.333333333333334vw
        height :@width
        border-radius :100%
        overflow :hidden
      .info-wrapper
        font-size: 3.733333333333334vw
        flex:1
        padding :0 2.666666666666667vw
        overflow :hidden
        layout(column,block,nowrap)
        justify-content :center
        .name
          no-wrap()
        .status
          padding-top :1.6vw
          font-size :3.4666666666666663vw
          opacity :0.6
      .date-wrapper
        font-size :4vw
</style>
