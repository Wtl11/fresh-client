<template>
  <form action="" report-submit @submit="$getFormId">
    <div class="share-pop">
      <div class="share-box" v-show="showMain" @touchmove.prevent="" @click.stop="hide"></div>
      <div class="share-main" :class="showMain ? 'show' : ''">
        <p class="tip">拼团已发起，人满后即可成团</p>
        <div class="content">
          <p class="title">
            还差 <span class="color">{{num}}</span>人，赶快邀请 <span class="color">{{name}}</span>社区邻居来参团吧
          </p>
          <button open-type="share" class="share-btn" @click.stop="hide">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/collage/pic-wechat@2x.png'" alt="" class="img">
          </button>
          <p class="text">邀请邻居进度 <span class="color">{{total - num}}/{{total}}</span></p>
        </div>
      </div>
    </div>
  </form>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'SHARE_POP'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        showMain: false,
        num: '',
        name: '',
        total: ''
      }
    },
    methods: {
      hide() {
        this.showMain = false
      },
      show(num, name, total) {
        this.num = num || 0
        this.name = name || ''
        this.total = total || 0
        this.showMain = true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .share-box
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    z-index: 100
    background: rgba(55, 75, 99, 0.8)
  .share-main
    position: fixed
    bottom: -130%
    left: 0
    width: 100%
    z-index: 150
    transition: all .5s
    .tip
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #FFF
      opacity: 0.8
      text-align: center
    .content
      box-sizing: border-box
      margin-top: 12px
      padding: 20px 60px 30px
      width: 100%
      background: #FFF
    .title
      font-family: $font-family-medium
      font-size: $font-size-16
      color: #111
      line-height: 24px
      text-align: center
    .color
      color: #FA7500
    .img
      width: 50px
      height: 50px
      margin: 30px auto 10px
    .text
      text-align: center
      font-size: $font-size-14
      color: #1D2023
      font-family: $font-family-regular
  .show
    bottom: 0
</style>
