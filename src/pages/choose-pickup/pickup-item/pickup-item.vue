<template>
  <div class="pickup-item">
    <figure class="left">
      <img class="avatar-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/zd-image/test-img/1@1x.png'">
    </figure>
    <section class="middle">
      <h1 class="name">团长：董秀英</h1>
      <p class="position">提货点：广州海珠区TIT创意园 </p>
    </section>
    <img class="right" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'">
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'PICKUP_ITEM'

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

  .pickup-item
    width: 100%
    height :100%
    layout(row,block,nowrap)
    align-items :center
    .left
      box-sizing :border-box
      width :50px
      height :@width
      border-radius :50%
      overflow :hidden
      .avatar-img
        width :100%
        height :100%
        display :block
    .middle
      flex: 1
      height :100%
      padding :0 10px
      overflow:hidden
      .name
        padding-top :24px
        font-family: $font-family-medium
        font-size: 17px;
        color: #1D2023;
        line-height: 1
        no-wrap()
      .position
        padding-top :11px
        font-family: $font-family-regular
        font-size: 15px;
        color: #3F454B;
        line-height: 1.4
        no-wrap()
    .right
      display: block
      width: 7.5px
      height: 12.5px
      padding-right :5px
</style>
