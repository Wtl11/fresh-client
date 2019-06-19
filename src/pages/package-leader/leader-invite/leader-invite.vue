<template>
  <div class="leader-invite">
    <navigation-bar title="团长招募"></navigation-bar>
    <scroll-view :style="{height:scrollHeight + 'px'}" scroll-y class="scroll" @scroll="scroll">
      <div v-if="isInvitee">
        <div  class="inviter-wrap">
          <div class="head-photo-wrap">
            <img :src="leaderDetail.head_image_url" alt="" class="head-photo">
          </div>
          <div class="inviter-name"><span class="name">{{leaderDetail.nickname}}</span>邀请您</div>
          <div class="text">成为赞播优鲜社区合伙人</div>
        </div>
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzmbyq_01.jpg'" mode="widthFix" class="img">
      </div>
      <template v-else>
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_01.jpg'" mode="widthFix" class="img">
        <div class="percent-wrap">
          <div class="li-item first">
            <div class="">
              <h6 class="text-h6">每成功邀请一位朋友成为团长</h6>
              <h5 class="text-h5">即可获得{{invite_money}}元现金奖励</h5>
            </div>
            <div class="right-box">
              <span class="money">{{invite_money}}</span>元
            </div>
          </div>
          <div class="li-item second">
            <div>
              <h6 class="text-h6">被邀请者的社区用户下单</h6>
              <h5 class="text-h5">您将获得{{percent}}%的佣金奖励</h5>
            </div>
            <div class="right-box">
              <div class="percent-num">
                {{percent}}%
              </div>
              <div class="text-12">
                <div class="text-yj">佣金</div>
              </div>
            </div>
          </div>
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_02.jpg'" mode="widthFix"  class="img">
        </div>
      </template>
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_03.jpg'" mode="widthFix" :lazy-load="true" class="img">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_04.jpg'" mode="widthFix" :lazy-load="true"  class="img">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_05.jpg'" mode="widthFix" :lazy-load="true"  class="img">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzm_06.jpg'" mode="widthFix"  :lazy-load="true" class="img">
      <div v-if="isInvitee" id="form-box" class="input-wrap">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzmbyq_t1@2x.png'" mode="widthFix"  class="img">
        <div :style="{'background-image':imageUrl && 'url(' + imageUrl + '/yx-image/leader/pic-tzzmbyq_t2@2x.png)'}" class="form-body">
          <FormModel :hasMargin="false" ref="inviteForm"></FormModel>
        </div>
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-tzzmbyq_t3@2x.png'" mode="widthFix"  class="img">
      </div>
      <div>
        <div class="operate-btn">
          <button v-if="!isInvitee" open-type="share" class="operate-btn open-share-btn">立即邀请朋友成为团长</button>
          <button v-if="isInvitee && !isInsert"  class="operate-btn open-share-btn" @click="goInvitePage">立即申请成为团长</button>
          <button v-if="isInvitee && isInsert" class="operate-btn apply-btn" @click="inviteBtn">提交申请</button>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import FormModel from '../apply-leader/form-model/form-model.vue'
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
        inviter: {
          inviter: '',
          id: ''
        },
        percent: 4,
        invite_money: 50,
        TopHeight: 64,
        scrollHeight: 500,
        isInvitee: true,
        leaderDetail: {
          nickname: '',
          head_image_url: ''
        },
        isInsert: false
      }
    },
    async onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.TopHeight = res.statusBarHeight + 44
      this.scrollHeight = res.screenHeight - this.TopHeight
    },
    async onShow() {
      this.isInvitee = true
      await this._getLeaderStatus()
      // 被邀请者
      let options = this._$$initOptions()
      console.log(options, 'options')
      let leaderId
      if (options && options.leaderId) {
        leaderId = options.leaderId
      } else {
        leaderId = wx.getStorageSync('leaderId') // 获取团长id
        this.isInvitee = false
      }
      this.isInvitee && this.listenShow()
      await this._getLeaderDetail({shop_id: leaderId})
    },
    onShareAppMessage() {
      const flag = Date.now()
      let url = this.$routes.leader.LEADER_INVITE + `?leaderId=${this.leaderDetail.shop_id}&flag=${flag}`
      console.warn(url)
      console.log(this.imageUrl + '/yx-image/leader/pic-yqtz_wechat@2x.png')
      console.log(this.leaderDetail)
      return {
        title: this.leaderDetail.nickname + '邀你成为团长合伙人',
        path: url, // 商品详情
        imageUrl: this.imageUrl + '/yx-image/leader/pic-yqtz_wechat@2x.png',
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    methods: {
      // 申请表格 是否在 滚动视图
      listenShow() {
        const query = wx.createIntersectionObserver()
        query.relativeToViewport({bottom: 0}).observe('#form-box', res => {
          this.isInsert = res.intersectionRect.top > 0 ? 1 : false
          console.log(this.isInsert)
        })
      },
      // 获取团长信息
      async _getLeaderDetail(params) {
        let res = await API.Leader.getLeaderDetail(params)
        console.log(res, '_getLeaderDetail')
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.leaderDetail = res.data
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
        wx.navigateTo({url: this.$routes.leader.APPLY_LEADER})
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
        margin-top:px-change-vh(8)
        .name
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
      width:100vw
    .percent-wrap
      position: relative
      .li-item
        position:absolute
        width:100vw
        box-sizing border-box
        padding:0 px-change-vw(41) 0 px-change-vw(91)
        display flex
        justify-content space-between
        align-items center
        right:0
        height:px-change-vw(86)
        &.first
          top:px-change-vw(108)
        &.second
          bottom:px-change-vw(62)
        .right-box
          text-align:center
          width:px-change-vw(65)
          font-size :$font-size-13
        .money, .percent-num
          font-family:'DINAlternate-Bold'
          text-align center
        .money
          font-size: 28px
        .percent-num
          font-size: 30px
        .text-yj
          letter-spacing 4px
        .percent-item
          justify-content center
          align-items  center
          .text-12
            font-size: $font-size-12
            font-family $font-family-regular

        .text-h6
          color: #333333
          font-size: $font-size-13
        .text-h5
          color: #333333
          font-size:$font-size-14
          font-family: $font-family-bold
        .percent-item
          display flex
    .operate-btn
      width: 100%
      height:50px
      line-height: 50px
      text-align: center
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
