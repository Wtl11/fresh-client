<template>
  <div class="notification-regimental" @click="test">
    <section class="title-wrapper" @click="navHandle">
      <div class="left">
        <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/group/icon-leida@2x.png'"  class="icon">
        <img  v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-leida@2x.png'" class="icon">
        <p class="title">智能雷达</p>
      </div>
      <div class="right">
        <p class="text"><span class="number">{{customerCount}}</span>位顾客浏览了你的店铺</p>
        <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/group/icon-pressed@2x.png'"  class="arrow-right">
      </div>
    </section>
    <section class="msg-wrapper" :animation="msgHeightAnimation">
      <article class="wrapper-ul">
        <!--<div class="wrapper" :animation="firstAnimation">-->
          <!--<img v-if="imageUrl" mode="aspectFill" :src="imageUrl + '/zd-image/test-img/1@1x.png'" alt="" class="avatar">-->
          <!--<p class="text">游客<span :class="textColor">提价了订单</span>,金额为<span :class="textColor">{{11}}</span>元</p>-->
        <!--</div>-->
        <div class="wrapper one" :animation="oneAnimation">
          <img v-if="imageUrl" mode="aspectFill" :src="imageUrl + '/yx-image/group/pic-head@2x.png'" alt="" class="avatar">
          <p class="text">游客<span :class="textColor">提价了订单</span>,金额为<span :class="textColor">{{0}}</span>元</p>
        </div>
        <!--<div class="wrapper two" :animation="twoAnimation">-->
          <!--<img v-if="imageUrl" mode="aspectFill" :src="imageUrl + '/yx-image/group/pic-head@2x.png'" alt="" class="avatar">-->
          <!--<p class="text">游客<span :class="textColor">提价了订单</span>,金额为<span :class="textColor">{{1}}</span>元</p>-->
        <!--</div>-->
        <!--<div class="wrapper three" :animation="threeAnimation">-->
          <!--<img v-if="imageUrl" mode="aspectFill" :src="imageUrl + '/yx-image/group/pic-head@2x.png'" alt="" class="avatar">-->
          <!--<p class="text">游客<span :class="textColor">提价了订单</span>,金额为<span :class="textColor">{{2}}</span>元</p>-->
        <!--</div>-->
        <!--<block v-for="(item,index) in dataArray" :key="index">-->
          <!--<div class="wrapper">-->
            <!--<img v-if="imageUrl" mode="aspectFill" :src="imageUrl + '/zd-image/test-img/1@1x.png'" alt="" class="avatar">-->
            <!--<p class="text">游客<span :class="textColor">提价了订单</span>,金额为<span :class="textColor">{{index}}</span>元</p>-->
          <!--</div>-->
        <!--</block>-->
      </article>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import Notification from '../notification'
  const COMPONENT_NAME = 'NOTIFICATION_REGIMENTAL'

  export default {
    name: COMPONENT_NAME,
    props: {
      customerCount: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dataArray: new Array(1).fill({isAction: true}),
        textColor: ``,
        autoplay: true,
        index: 0,
        msgHeightAnimation: '',
        oneAnimation: '',
        twoAnimation: '',
        threeAnimation: ''
      }
    },
    onLoad() {
      this.textColor = `corp-${this.corpName}-text`
      Notification.getInstance().on(msg => {
        try {
          let data = JSON.parse(msg.data)
          console.info(data)
        } catch (e) {
        }
      })
      if (this.dataArray.length) {
        this._heightUp()
        // this._cardShow()
      }
    },
    methods: {
      navHandle() {
        wx.navigateTo({url: '/pages/radar'})
      },
      test() {
        this._action()
        // let item = {isAction: false}
        // this.dataArray.push(item)
        // this._firstHide()
        // this._cardShow(this.dataArray[this.dataArray.length - 1])
      },
      _action() {
        let one = wx.createAnimation()
        // one.opacity(1).step({
        //   duration: 200,
        //   timingFunction: 'ease-out',
        //   delay: 0
        // })
        one.translate3d(0, 0, 0).step({
          duration: 500,
          timingFunction: 'ease-out',
          delay: 200
        })
        let two = wx.createAnimation()
        // two.opacity(0).step({
        //   duration: 200,
        //   timingFunction: 'ease-out',
        //   delay: 0
        // })
        two.translate3d(0, 45, 0).step({
          duration: 500,
          timingFunction: 'step-end',
          delay: 200
        })
        // let three = wx.createAnimation()
        // // three.opacity(0).step({
        // //   duration: 200,
        // //   timingFunction: 'ease-out',
        // //   delay: 0
        // // })
        // three.translate3d(0, -45, 0).step({
        //   duration: 500,
        //   timingFunction: 'step-end',
        //   delay: 200
        // })
        this.oneAnimation = one.export()
        setTimeout(() => {
          this.oneAnimation = ''
        }, 1000)
        // this.twoAnimation = two.export()
        // this.threeAnimation = three.export()
        // this.oneAnimation = ''
        // this.twoAnimation = ''
        // this.threeAnimation = ''
        // setTimeout(() => {
        //   let flag = this.hideAnimation
        //   this.hideAnimation = this.showAnimation
        //   this.showAnimation = flag
        // }, 1000)
      },
      // _firstHide() {
      //   let firstAnimation = wx.createAnimation({
      //     duration: 500,
      //     timingFunction: 'ease-out',
      //     delay: 0
      //   })
      //   firstAnimation.opacity(0).step()
      //   firstAnimation.translate3d(0, 45, 0).step()
      //   this.firstAnimation = firstAnimation
      // },
      // _cardShow(item) {
      //   // console.log(this.dataArray)
      //   if (item.isAction) return
      //   item.isAction = true
      //   let animation = wx.createAnimation()
      //   animation.opacity(1).step({
      //     duration: 200,
      //     timingFunction: 'ease-out',
      //     delay: 0
      //   })
      //   // this.cardAnimation = animation.export()
      //   animation.translate3d(0, 0, 0).step({
      //     duration: 500,
      //     timingFunction: 'ease-out',
      //     delay: 0
      //   })
      //   this.cardAnimation = animation.export()
      // },
      _heightUp() {
        let msgHeightAnimation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease-out',
          delay: 0
        })
        msgHeightAnimation.height(48).step()
        this.msgHeightAnimation = msgHeightAnimation.export()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .notification-regimental
    box-shadow:0 3px 10px 0 rgba(17,17,17,0.06)
    border-radius:10px;
    width:93.6vw
    box-sizing:border-box;
    background:#fff;
    margin:12px auto;
    padding-bottom :7px
    .msg-wrapper
      position :relative
      height :0
      padding :0 13px
      .wrapper-ul
        border-radius: 8px;
        height :45px
        position :relative
        .wrapper
          fill-box(absolute)
          layout(row,block,nowrap)
          align-items :center
          background: #F7F7F7;
          border-radius: 8px;
          padding :10px
          &.one
            transform: translate3d(0, -45px, 0)
          &.two
            transform: translate3d(0, 0px, 0)
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
      layout(row,block,nowrap)
      padding :20px 13px 13px
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
