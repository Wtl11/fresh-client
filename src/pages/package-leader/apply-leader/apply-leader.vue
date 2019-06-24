<template>
  <div class="leader-invite">
    <navigation-bar title="团长招募"></navigation-bar>
    <scroll-view :style="{height:scrollHeight + 'px'}" :scroll-with-animation="true" :scroll-into-view="currentShowEle" scroll-y class="scroll" @scroll="scroll">
      <div>
        <div  class="inviter-wrap">
          <div class="head-photo-wrap">
            <img :src="leaderDetail.head_image_url" alt="" class="head-photo">
          </div>
          <div class="inviter-name"><span class="name">{{leaderDetail.nickname}}</span>邀请您</div>
          <div class="text">成为赞播优鲜社区合伙人</div>
        </div>
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzmbyq_01.jpg'" mode="widthFix" class="img">
      </div>
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_03.jpg'" mode="widthFix" class="img">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_04.jpg'" mode="widthFix" class="img">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_05.jpg'" mode="widthFix" class="img">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_06.jpg'" mode="widthFix" class="img">
      <div id="form-box" class="input-wrap">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzmbyq_t1@2x.png'" mode="widthFix"  class="img">
        <div :style="{'background-image':imageUrl && 'url(' + imageUrl + '/yx-image/leader/pic-tzzmbyq_t2@2x.png)'}" class="form-body">
          <FormModel :hasMargin="false" ref="inviteForm"></FormModel>
        </div>
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzmbyq_t3@2x.png'" mode="widthFix"  class="img">
      </div>
      <div>
        <div class="operate-btn">
          <button :class="['operate-btn open-share-btn',{show:!isInsert}]" @click="goInvitePage">立即申请成为团长</button>
          <button :class="['operate-btn apply-btn',{show:isInsert}]" class="operate-btn apply-btn" @click="inviteBtn">提交申请</button>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import FormModel from './form-model/form-model.vue'
  import GetOptions from '@mixins/get-options'
  const PAGE_NAME = 'LEADER_INVITE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      FormModel
    },
    mixins: [GetOptions],
    data() {
      return {
        percent: 4,
        invite_money: 50,
        TopHeight: 64,
        scrollHeight: 500,
        leaderDetail: {
          nickname: '',
          head_image_url: ''
        },
        isInsert: false,
        currentShowEle: ''
      }
    },
    async onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.TopHeight = res.statusBarHeight + 44
      this.scrollHeight = res.screenHeight - this.TopHeight
    },
    async onShow() {
      await this._getLeaderStatus()
      // 被邀请者
      let options = this._$$initOptions()
      console.log(options, 'options')
      let leaderId = options.leaderId
      leaderId && wx.setStorageSync('shopId', leaderId)
      this._getLeaderDetail({shop_id: leaderId})
      this.listenShow()
    },
    methods: {
      // 申请表格 是否在 滚动视图
      listenShow() {
        const query = wx.createIntersectionObserver()
        console.log(query, 'query')
        query.relativeToViewport({bottom: 0}).observe('#form-box', res => {
          console.log(res, 999)
          this.isInsert = res.intersectionRatio > 0 ? 1 : false
          this.currentShowEle = ''
          console.log(this.isInsert)
        })
      },
      // 获取团长信息
      async _getLeaderDetail(params) {
        let res = await API.Leader.getLeaderDetail(params)
        console.log(res, '_getLeaderDetail')
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return false
        }
        this.leaderDetail = res.data
        return true
      },
      // 获取邀请状态
      async _getLeaderStatus() {
        let res = await API.Leader.getLeaderStatus()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        console.log(res, 'getLeaderStatus')
        if (res.data.status) {
          this.invite_money = Math.floor(res.data.invite_money)
          this.percent = Math.floor(res.data.percent)
        } else {
          wx.redirectTo({url: this.$routes.main.GOODS_END})
        }
      },
      goInvitePage() {
        this.currentShowEle = 'form-box'
        // wx.navigateTo({url: this.$routes.leader.APPLY_LEADER})
      },
      inviteBtn() {
        this.$refs.inviteForm.submit()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .scroll
    position:relative
    .inviter-wrap
      position:absolute
      top:px-change-vh(26)
      left:0
      right:0
      color:$color-white
      text-align center
      font-size: $font-size-18
      font-family :$font-family-medium
      .head-photo-wrap
        position:absolute
        top:0
        left:50%
        transform translateX(-50%)
        width:52px
        height:52px
        border-1px(#FFFFFF, 26px, solid, 1.5px)
        .head-photo
          width: 100%
          height: 100%
          border-radius 50%
      .inviter-name
        font-size: $font-size-16
        font-family :$font-family-regular
        display flex
        justify-content center
        max-width :px-change-vw(256)
        margin-top:px-change-vh(8)
        margin-right:auto
        margin-left:auto
        white-space nowrap

        .name
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
          margin-right:5px
  .inviteForm
  .form-body
    background-size 100% 100%
    padding-top:25px
  .input-wrap
    background-color : #00ba65
  .leader-invite
    width: 100%
    .img
      display block
      font-size 0
      width:100vw
    .operate-btn
      width: 100%
      height:0
      text-align: center
      transition  all 0.5s
      &.show
        height:50px
        line-height: 50px
      &.open-share-btn
        position:fixed
        bottom:0
        left:0
        right:0
        z-index:300
        font-size: $font-size-18
        font-family :$font-family-medium
        color: #161315
        background: #FFE100
      &.apply-btn
        background: #FFE100
</style>
