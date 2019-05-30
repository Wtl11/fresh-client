<template>
  <div class="buy-record" @click="handleNav">
    <ul class="left">
      <li v-if="index < 5" v-for="(item, index) in userImgList" :key="index" class="avatar-wrapper">
        <img v-if="item.head_image_url" :src="item.head_image_url" mode="aspectFill" class="img">
      </li>
    </ul>
<!--    <div class="right">已有<span class="red">{{userTotal}}</span>人购买</div>-->
    <div class="right">查看购买记录</div>
    <img class="arrow-right" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'">
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BUY_RECORD'

  export default {
    name: COMPONENT_NAME,
    props: {
      userImgList: {
        type: Array,
        default: () => []
      },
      userTotal: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
      }
    },
    methods: {
      handleNav() {
        this.$emit('buyRecordNavTo')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .buy-record
    padding-left: 10px
    padding-right :15px
    background: $color-white
    box-sizing: border-box
    margin: 0 12px 10px
    box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06);
    border-radius: 8px;
    layout(row,block,nowrap)
    align-items :center
    justify-content :space-between
    height :60px
    .left
      flex: 1
      layout(row,block,nowrap)
      .avatar-wrapper
        width :30px
        height :@width
        border-radius :50%
        overflow :hidden
        margin-right :6px
        .img
          width :30px
          height :@width
          display :block
    .right
      font-family: $font-family-regular
      font-size: 14px;
      color: #9B9B9B;
      line-height: 1
      .red
        color: #FF8506
        padding :0 1px
    .arrow-right
      display: block
      width: 7.5px
      height: 12.5px
      padding-left :5px
</style>
