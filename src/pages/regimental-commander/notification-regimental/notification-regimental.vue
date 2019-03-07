<template>
  <div class="notification-regimental" @click="test">
    <section class="title-wrapper">
      <div class="left">
        <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/group/icon-leida@2x.png'"  class="icon">
        <img  v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-leida@2x.png'" class="icon">
        <p class="title">智能雷达</p>
      </div>
      <div class="right">
        <p class="text"><span class="number">18</span>位顾客浏览了你的店铺</p>
        <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/group/icon-pressed@2x.png'"  class="arrow-right">
      </div>
    </section>
    <section v-if="true" class="msg-wrapper">
      <swiper class="wrapper-ul"
              :duration="500"
              :interval="1000"
              :autoplay="autoplay"
              vertical
              :circular="true"
              @change="changeHandle"
      >
        <block v-for="(item,index) in dataArray" :key="index">
          <swiper-item>
            <div class="wrapper">
              <img v-if="imageUrl" mode="aspectFill" :src="imageUrl + '/zd-image/test-img/1@1x.png'" alt="" class="avatar">
              <p class="text">游客<span :class="textColor">提价了订单</span>,金额为<span :class="textColor">{{index}}</span>元</p>
            </div>
          </swiper-item>
        </block>
      </swiper>
      <div class="un-touch-wrapper"></div>
    </section>
    <section v-else class="empty"></section>
  </div>
</template>

<script type="text/ecmascript-6">
  import Notification from '../notification'
  const COMPONENT_NAME = 'NOTIFICATION_REGIMENTAL'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        dataArray: new Array(1).fill(1),
        textColor: ``,
        autoplay: true
      }
    },
    onLoad() {
      this.textColor = `corp-${this.corpName}-text`
      console.log('papap')
      Notification.getInstance().on(msg => {
        console.log(msg)
      })
    },
    methods: {
      test() {
        console.log(12313)
        this.dataArray.push(1)
        this.autoplay = true
      },
      changeHandle(e) {
        // todo
        let index = e.mp.detail.current
        let maxIndex = this.dataArray.length - 1
        console.log(index)
        if (index >= maxIndex) {
          this.autoplay = false
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .empty
    height :13px
  .un-touch-wrapper
    fill-box(absolute)
  .notification-regimental
    box-shadow:0 3px 10px 0 rgba(17,17,17,0.06)
    border-radius:10px;
    width:93.6vw
    box-sizing:border-box;
    background:#fff;
    margin:12px auto;
    .msg-wrapper
      position :relative
      padding : 10px
      .wrapper-ul
        background: #F7F7F7;
        border-radius: 8px;
        height :45px
        overflow :hidden
        .wrapper
          layout(row,block,nowrap)
          align-items :center
          background: #F7F7F7;
          border-radius: 8px;
          padding :10px
          .avatar
            width :25px
            height @width
            border-radius :100%
          .text
            padding :0 5px
            flex: 1
            no-wrap()
            font-family: $font-family-regular
            font-size: 13px;
            color: $color-text-main
    .title-wrapper
      padding : 20px 13px 7px
      layout(row,block,nowrap)
      .left
        flex: 1
        overflow :hidden
        layout(row,block,nowrap)
        align-items :center
        .icon
          width :22px
          height :@width
        .title
          margin-left :5px
          font-family: $font-family-medium
          font-size: $font-size-16
          color:$color-text-main
      .right
        layout(row,block,nowrap)
        align-items :center
        .text
          font-family: $font-family-regular
          font-size: 14px;
          color: $color-text-sub
          .number
            color: $color-text-main
        .arrow-right
          margin-left :7.4px
          width : 7.5px
          height :12.5px
</style>
