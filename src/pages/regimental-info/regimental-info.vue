<template>
  <div class="regimental-info">
    <navigation-bar title="团长信息"></navigation-bar>
    <div class="regimental-header-box">
      <p class="regimental-name">头像</p>
      <img :src="leaderDetail.head_image_url" class="regimental-header">
      <!--<img :src="imageUrl + '/yx-image/group/icon-pressed@2x.png'" v-if="imageUrl" class="way">-->
    </div>
    <div class="line"></div>
    <div class="chang-box">
      <div class="regimental-item">
        <div class="regimental-name">团长名称</div>
        <div class="regimental-input text-color">{{leaderDetail.nickname}}</div>
      </div>
      <div class="regimental-text-box">
        <div class="regimental-name">公告</div>
        <textarea type="text" :class="{'regimental-text-ios': isIos}" maxlength="28" class="regimental-text" placeholder="请添加注意事项" placeholder-class="text-color" v-model="leaderDetail.notice"></textarea>
      </div>
    </div>
    <div :class="{'btn-disable': !leaderDetail.notice}" class="btn" @click="_saveLeader">保存</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'REGIMENTAL_INFO'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        isIos: false,
        isSave: false,
        leaderDetail: {}
      }
    },
    async onLoad() {
      this.$wx.getSystemInfo({
        success: (res) => {
          this.isIos = res.system.includes('iOS')
        }
      })
      await this._getLeaderDetail()
    },
    methods: {
      async _getLeaderDetail() {
        let res = await API.Leader.leaderDetail()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.leaderDetail = res.data
      },
      async _saveLeader() {
        let res = await API.Leader.saveLeader({name: this.leaderDetail.name, notice: this.leaderDetail.notice})
        this.$wechat.showToast(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .regimental-info
    min-height: 100vh
    box-sizing: border-box
    background: $color-white

  .line
    height: 10px
    background: $color-background

  .regimental-header-box
    height: 95px
    display: flex
    box-sizing: border-box
    padding: 0 32px 0 15px
    justify-content: space-between
    align-items: center
    position: relative
    .regimental-name
      font-size: 15px
      line-height: 1
    .regimental-header
      border-radius: 50%
      background: $color-background
      width: 65px
      height: @width
    .way
      col-center()
      right: 14.5px
      width: 7.5px
      height: 12.5px

  .chang-box
    box-sizing: border-box
    padding: 0 15px

    .regimental-item
      font-size: 15px
      height: 55px
      display: flex
      align-items: center
      font-family: $font-family-regular
      border-bottom-1px($color-line)

    .regimental-text-box
      padding-top: 20px
      font-size: 15px
      display: flex

    .regimental-name
      white-space: nowrap
      min-width: 60px

    .regimental-input
      color: $color-text-main
      margin-left: 25px

    .regimental-text
      padding-top: 0
      color: $color-text-main
      margin-left: 25px
      margin-top: 3px
    .regimental-text-ios
      margin-left: 19px
      margin-top: -8px

    .text-color
      font-family: $font-family-regular
      color: #979797

  .btn
    position: fixed
    bottom: 19px
    width: 92vw
    left: 4vw
    background: $color-main
    text-align: center
    height: 45px
    font-size: $font-size-16
    font-family: $font-family-medium
    line-height: 45px
    border-radius: 22.5px
    color: $color-white
    transition: all 0.2s
    &:active
      background: #9DD44C
      color: #E1F2C9

  .btn-disable
    background: #D5ECB3 !important
    color: $color-white !important
</style>
