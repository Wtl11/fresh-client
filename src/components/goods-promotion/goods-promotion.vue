<template>
  <block v-if="dataArray.length">
    <div class="goods-promotion" @click="show">
      <p class="left">
        促销
      </p>
      <ul class="middle">
        <block v-for="(item, index) in dataArray" :key="index">
          <li v-if="index < 2" class="middle-item item-default">
            <div class="icon-ticket">{{item.icon_str}}</div>
            <p class="text">{{item.tips}}</p>
          </li>
        </block>
      </ul>
      <img class="right" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'">
      <article v-show="isShow" class="modal" @click.stop="hide">
      </article>
      <article class="modal-panel" :class="{active: isShow}" @click.stop="">
        <p class="title">促销</p>
        <div class="scroll-wrapper">
          <ul class="ticket-wrapper ios-scroll-smooth">
            <li v-for="(item, index) in dataArray" :key="index" class="ticket item-default" @click.stop="navHandle(item.tag_type)">
              <div class="icon-ticket">{{item.icon_str}}</div>
              <p class="text">{{item.tips}}</p>
              <block v-if="imageUrl && item.tag_type === 2">
                <img class="arrow" mode="aspectFill" :src="imageUrl + '/yx-image/certificate/icon-promotion_enter@2x.png'">
              </block>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </block>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'GOODS_PROMOTION'

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
        isShow: false
      }
    },
    onUnload() {
      this.hide()
    },
    methods: {
      show() {
        this.isShow = true
      },
      hide() {
        this.isShow = false
      },
      navHandle(type) {
        if (type !== 2) return
        this.hide()
        wx.navigateTo({url: this.$routes.activity.COMMODITY_CERTIFICATES})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .ios-scroll-smooth
    -webkit-overflow-scrolling: touch

  /*券icon*/
  .icon-ticket
    font-family: $font-family-regular
    height: 14px
    line-height @height
    padding 0 2px
    background: rgba(255,104,3,0.18)
    border-radius: 2px;
    font-size: 11px;
    color: #FF6803;
  /*券-列表*/
  .item-default
    font-family: $font-family-regular
    font-size: 13px;
    color: #1F1F1F;
    layout(row,block,nowrap)
    align-items :center
    .arrow
      margin-right: 7px
      width: 7.5px
      height: 12.5px
    .text
      flex: 1
      no-wrap()
      padding-left :12px

    /*促销弹窗*/
  .modal
    position: fixed
    left :0
    right: 0
    top: 0
    bottom:0
    background-color : $color-background-modal
    z-index :300
  .modal-panel
    position: fixed
    z-index :350
    left: 0
    bottom: -130%
    right: 0
    height: px2vw(363)
    background: #FFFFFF;
    border-radius: 11px 11px 0 0
    transition: bottom 0.5s
    line-height : 1
    &.active
      bottom : 0
    .title
      font-family: $font-family-medium
      font-size: 16px;
      color: #1F1F1F;
      padding 20px 0 25px
      text-align :center
    .scroll-wrapper
      height : 75%
      overflow :hidden
      .ticket-wrapper
        padding: 0 20px 50px
        width: 100%
        height: 100%
        box-sizing :border-box
        overflow-y :scroll
        .ticket
          margin-bottom :21px
          &:last-child
            margin-bottom: 0

  /* 促销信息*/
  .goods-promotion
    box-sizing border-box
    margin :0 12px 10px
    background: #FFFFFF;
    box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06);
    border-radius: 8px;
    display :flex
    padding : 15px 15px 15px 10px
    line-height: 1
    .left
      font-family: $font-family-medium
      font-size: 14px
      color: #1F1F1F;
      letter-spacing: 0.52px;
      padding-right :22px
    .middle
      flex: 1
      overflow : hidden
      .middle-item
        padding-bottom :13px
        &:last-child
          padding-bottom: 0
    .right
      align-self :center
      margin-left :7px
      height: 12.5px
      width: 7.5px
      padding-left :7.5px
</style>
