<template>
  <div class="link-group">
    <div scroll-y class="link-box" v-show="linkShow" @touchmove.prevent=""  @click.stop="hideLink"></div>
    <div class="link-bottom" :class="linkShow ? 'show' : ''">
      <div v-if="linkType === 1" class="link-tab link-tab-border" @click.stop="clipWechat">复制微信号：{{wechatInfo.wx_account}}</div>
      <div v-if="linkType === 1" class="link-tab" @click.stop="callPhone">呼叫：{{wechatInfo.mobile}}</div>
      <div v-if="linkType === 2" class="link-tab link-tab-border" @click.stop="clipWechat">发送给朋友</div>
      <div v-if="linkType === 2" class="link-tab" @click.stop="callPhone">生成卡片保存分享</div>
      <div class="line"></div>
      <div class="link-tab" @click.stop="hideLink">取消</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'LINK_GROUP'

  export default {
    name: COMPONENT_NAME,
    props: {
      wechatInfo: {
        type: Object,
        default: {}
      },
      linkType: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        linkShow: false
      }
    },
    methods: {
      hideLink() {
        this.linkShow = false
      },
      showLink() {
        this.linkShow = true
      },
      clipWechat() {
        let that = this
        that.$wx.setClipboardData({
          data: this.wechatTxt,
          success: function(res) {
            that.$wx.getClipboardData({
              success: function(res) {}
            })
          }
        })
      },
      callPhone() {
        this.$wx.makePhoneCall({
          phoneNumber: this.phoneTxt
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .link-box
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    z-index: 100
    background: rgba(55, 75, 99, 0.8)
  .link-bottom
    position: fixed
    bottom: -130%
    left: 0
    background: #fff
    width:100%
    z-index: 150
    transition: all .5s
    .link-tab
      width: 100%
      height: 55px
      text-align: center
      line-height: 55px
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
    .link-tab-border
      border-bottom-1px(#E6E6E6)
    .line
      width: 100%
      height: 11px
      background: $color-background
  .show
    bottom: 0
</style>
