<template>
  <div class="new-guidelines">
    <section
      v-if="top && isShowGuidelines"
      class="top-tip"
      :style="{top: top + 'px'}"
      @click="show"
    >
      添加「我的小程序」团购更方便<p class="triangle"></p>
    </section>
    <article class="mask-wrapper" v-if="isShow" :animation="maskAnimation">
      <div class="pic-wrapper" :style="{top: top + 'px'}">
        <img class="pic-img" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-xszy.png'">
        <div class="button" @click="cancel"></div>
      </div>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import AnimationModal from '@mixins/animation-modal'

  const COMPONENT_NAME = 'NEW_GUIDELINES'

  export default {
    name: COMPONENT_NAME,
    mixins: [AnimationModal],
    props: {
      navigationBar: {
        type: Number,
        default: 0
      },
      titleColor: {
        type: String,
        default: '#000000'
      }
    },
    data() {
      return {
        top: 0,
        isShow: false,
        isShowGuidelines: true
      }
    },
    watch: {
      navigationBar(val) {
        // if (!this.isShowGuidelines) return
        if (val) {
          this.top = val + 3
          setTimeout(() => {
            this.isShowGuidelines = false
            // wx.setStorageSync('showNewGuidelines', 'showNewGuidelines')
          }, 2000)
        }
      }
    },
    onLoad() {
      // const isShowGuidelines = wx.getStorageSync('showNewGuidelines')
      // if (!isShowGuidelines) {
      //   this.isShowGuidelines = !isShowGuidelines
      // }
    },
    methods: {
      show () {
        // this.isShowGuidelines = false
        // wx.setStorageSync('showNewGuidelines', 'showNewGuidelines')
        // if (this.isShow) {
        //   return
        // }
        // wx.setNavigationBarColor({
        //   frontColor: '#000000',
        //   backgroundColor: '#ffffff',
        //   animation: {
        //     duration: 0,
        //     timingFunc: 'easeIn'
        //   }
        // })
        // this.isShow = true
        // this.showAnimation()
      },
      close () {
        this.isShow = false
      },
      confirm () {
        this.cancel()
      },
      cancel () {
        wx.setNavigationBarColor({
          frontColor: this.titleColor,
          backgroundColor: '#ffffff',
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
        this.hideAnimation(() => {
          this.isShow = false
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .new-guidelines
    position: fixed
    z-index: 999

  .mask-wrapper
    background-color: rgba(17, 17, 17, 0.7)
    fill-box(fixed)
    z-index: 999
    .pic-wrapper
      width :309px
      position :absolute
      right :35px
      display :block
      .pic-img
        width :100%
        display :block
      .button
        row-center()
        width :200px
        height :50px
        top: 387px


  .top-tip
    position :fixed
    width :210px
    height :29px
    right :7px
    background: #FFFFFF;
    border-radius: 30px
    z-index :555
    font-family: $font-family-regular
    font-size: 13px;
    color: #3F454B;
    line-height :@height
    text-align: center;
    .triangle
      position :absolute
      width: 0
      height: 0
      border: 5px solid #Fff
      border-left: 5px solid transparent
      border-top: 5px solid transparent
      border-right: 5px solid transparent
      top:-10px
      left :140px
      z-index :3
</style>
