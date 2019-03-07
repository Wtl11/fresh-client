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
        <block v-for="(item, index) in dataArray" :key="index">
          <div class="wrapper" :animation="!index ? oneAnimation: twoAnimation">
            <img v-if="imageUrl" mode="aspectFill" :src="imageUrl + '/yx-image/group/pic-head@2x.png'" alt="" class="avatar">
            <p class="text"><span>{{item.text}}</span><span :class="textColor">提价了订单</span>,金额为<span :class="textColor">{{index}}</span>元</p>
          </div>
        </block>
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
        dataArray: new Array(2).fill({}),
        textColor: ``,
        index: 0,
        msgHeightAnimation: '',
        oneAnimation: '',
        oneIsOver: false,
        twoAnimation: '',
        twoIsOver: true,
        duration: 300
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
    },
    methods: {
      navHandle() {
        wx.navigateTo({url: '/pages/radar'})
      },
      test() {
        setTimeout(() => {
          this.dataArray[this.index % 2] = {text: ~~(Math.random() * 100) + '游客'}
        }, this.duration)
        this.index++
        this._action()
      },
      _action() {
        this._msgHeightAnimation()
        this._cardAnimation('oneAnimation', 'oneIsOver')
        this._cardAnimation('twoAnimation', 'twoIsOver')
      },
      _cardAnimation(key, flag) {
        const duration = this.duration
        const animation = wx.createAnimation()
        if (this[flag]) {
          animation.translate3d(0, -45, 0).step({
            duration,
            timingFunction: 'linear',
            delay: 0
          })
        } else {
          animation.translate3d(0, 0, 0).step({
            duration,
            timingFunction: 'linear',
            delay: 0
          })
        }
        setTimeout(() => {
          this[flag] = !this[flag]
        }, duration)
        this[key] = animation.export()
      },
      _msgHeightAnimation() {
        if (this.msgHeightAnimation) return
        const duration = this.duration
        let msgHeightAnimation = wx.createAnimation({
          duration,
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
        overflow :hidden
        .wrapper
          fill-box(absolute)
          layout(row,block,nowrap)
          align-items :center
          background: #F7F7F7;
          border-radius: 8px;
          padding :10px
          transform: translate3d(0, -45px, 0)
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
