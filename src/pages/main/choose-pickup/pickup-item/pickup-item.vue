<template>
  <div class="pickup-item">
    <figure class="left">
      <img class="avatar-img" mode="aspectFill" v-if="dataInfo.shop_image_url" :src="dataInfo.shop_image_url">
      <img class="avatar-img" mode="aspectFill" v-else-if="imageUrl" :src="imageUrl + '/yx-image/2.1/default_avatar@2x.png'">
    </figure>
    <section class="middle">
      <h1 class="name">
        <span class="leader">团长：{{dataInfo.name}}</span>
        <span v-if="dataInfo.distance" class="distance">距离{{dataInfo.distance}}m</span>
      </h1>
      <p class="position">提货点：{{dataInfo.social_name}} </p>
    </section>
    <img class="right" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'">
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'PICKUP_ITEM'

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
        height: 38px
        font-family: $font-family-medium
        font-size: 15px;
        color: #1D2023;
        no-wrap()
        layout(row)
        justify-content: space-between
        align-items: flex-end
        .leader
          flex: 1
          no-wrap()
        .distance
          color : #3f454b
          font-size: $font-size-13
          font-family: $font-family-regular
      .position
        padding-top :8px
        font-family: $font-family-regular
        font-size: 15px;
        color: #3F454B;
        line-height: 1.3
        no-wrap-plus()
    .right
      display: block
      width: 7.5px
      height: 12.5px
      padding-right :5px
      position :relative
      top: 10px
</style>
