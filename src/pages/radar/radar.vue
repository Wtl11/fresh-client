<template>
  <div class="action-record">
    <navigation-bar ref="navigationBar" title="智能雷达" :showArrow="true"></navigation-bar>
    <div class="msg-list">
      <view class="msg-item" v-for="(item, index) in recordList" :key="index">
        <view class="item-time" v-if="item.is_showtime">{{item.time}}</view>
        <view class="msg-item-content">
          <img v-if="item.image_url" :src="item.image_url" class="msgs-left">
          <img v-else :src="imageUrl+'/yx-image/order/icon-colonel_head@2x.png'" class="msgs-left">
          <view class="msgs-right">
            <view class="msgs-container">
              <view class="msgs-p" v-if="item.event_no * 1 === 1000">
                <text>{{item.nickname}}</text>
                <text v-if="item.count_sum * 1 > 0">第{{item.count_sum}}次</text>
                <text class="green" :class="'corp-' + corpName + '-text'">查看</text>
                <text>了你的</text>
                <text class="green" :class="'corp-' + corpName + '-text'">小店</text>
              </view>
              <view class="msgs-p" v-if="item.event_no * 1 === 1001">
                <text>{{item.nickname}}通过扫描他人分享的海报</text>
                <text class="green" :class="'corp-' + corpName + '-text'">查看</text>
                <text>了你的</text>
                <text class="green" :class="'corp-' + corpName + '-text'">{{item.title}}</text>
              </view>
              <view class="msgs-p" v-if="item.event_no * 1 === 1002">
                <text>{{item.nickname}}通过他人分享的链接</text>
                <text class="green" :class="'corp-' + corpName + '-text'">查看</text>
                <text>了你的</text>
                <text class="green" :class="'corp-' + corpName + '-text'">{{item.title}}</text>
              </view>
              <view class="msgs-p" v-if="item.event_no * 1 === 1003">
                <text>{{item.nickname}}</text>
                <text  v-if="item.count_sum * 1 > 0">第{{item.count_sum}}次</text>
                <text class="green" :class="'corp-' + corpName + '-text'">查看</text>
                <text>了你的</text>
                <text class="green" :class="'corp-' + corpName + '-text'">{{item.title}}</text>
                <text>，请把握商机</text>
              </view>
              <view class="msgs-p" v-if="item.event_no * 1 === 1004">
                <text>{{item.nickname}}</text>
                <text class="green" :class="'corp-' + corpName + '-text'">转发</text>
                <text>了你的</text>
                <text class="green" :class="'corp-' + corpName + '-text'">{{item.title}}</text>
                <text>，你的商品正在裂变</text>
              </view>
              <view class="msgs-p" v-if="item.event_no * 1 === 1005">
                <text>{{item.nickname}}</text>
                <text class="green" :class="'corp-' + corpName + '-text'">保存</text>
                <text>了你的</text>
                <text class="green" :class="'corp-' + corpName + '-text'">{{item.title}}海报</text>
              </view>
              <view class="msgs-p" v-if="item.event_no * 1 === 1006">
                <text>{{item.nickname}}</text>
                <text class="green" :class="'corp-' + corpName + '-text'">提交</text>
                <text>了</text>
                <text class="green" :class="'corp-' + corpName + '-text'">订单</text>
                <text>，金额为{{item.total}}元，并支付成功</text>
              </view>
              <view class="msgs-p" v-if="item.event_no * 1 === 1007">
                <text>{{item.nickname}}把{{item.title}}商品</text>
                <text class="green" :class="'corp-' + corpName + '-text'">加入</text>
                <text>了</text>
                <text class="green" :class="'corp-' + corpName + '-text'">购物车</text>
              </view>
            </view>
            <!--<img :src="imageUrl + '/ws-image/goods/icon-presed@2x.png'" v-if="imageUrl && false" class="msgs-rt">-->
          </view>
        </view>
      </view>
      <div class="noting" v-if="recordList.length === 0 && noMore">
        <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
        <div class="txt">空空如也</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import {actionTimeFormat} from '@utils/common'
  import API from '@api'

  const PAGE_NAME = 'RADAR'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        recordList: [],
        arr: [
          {
            is_showtime: true,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1000
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1001
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1002
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1003
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1004
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1005
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1006
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1007
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1000
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1000
          },
          {
            is_showtime: true,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1000
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1000
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1000
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1000
          },
          {
            is_showtime: false,
            time: '2019/03/04 12:00:00',
            count_sum: 2,
            nickname: 'kok',
            title: '苹果',
            event_no: 1000
          }
        ],
        page: 1,
        noMore: false,
        shopId: null
      }
    },
    async onLoad(options) {
      this.getList(1)
    },
    onShow() {
    },
    onUnload() {
      this.list = []
    },
    async onPullDownRefresh() {
      this.getList(1)
      wx.stopPullDownRefresh()
    },
    onReachBottom() {
      this.getList(this.page)
    },
    methods: {
      getList(page) {
        if (this.noMore) return
        let data = {
          page,
          limit: 20
        }
        API.Radar.getRadarList(data, true).then((res) => {
          this.$wechat.hideLoading()
          if (res.error === this.$ERR_OK) {
            let msg = res.data.map((item) => {
              item.time = actionTimeFormat(item.created_at).time
              return item
            })
            this.recordList = this.recordList.concat(msg)
            this.page++
            if (res.data.length < 20) {
              this.noMore = true
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .action-record
    width: 100%
    min-height: 100vh
    background: $color-background
    box-sizing: border-box
    overflow-x: hidden
  .msg-list
    padding: 10px 15px 15px
    .msg-item
      margin-bottom: 12px
      .item-time
        font-family: PingFangSC-Medium
        font-size: $font-size-16
        color: #111
        padding: 10px 0 15px
      .msg-item-content
        width: 100%
        height: 70px
        background: #FFF
        box-shadow: 0 2px 6px 0 rgba(43, 43, 145, 0.07)
        border-radius: 4px
        display: flex
        justify-content: space-between
        align-items: center
      .msgs-left
        margin: 0 10px 0 15px
        width: 40px
        height: 40px
        border-radius: 50%
        display: block
        background: #FFF
        border: 0.5px solid rgba(32,32,46,0.1)
      .msgs-right
        flex: 1
        overflow: hidden
        margin-right: 13.5px
        height: 100%
        display: flex
        justify-content: space-between
        align-items: center
        .msgs-container
          flex: 1
          overflow: hidden
          height: 100%
          display: flex
          align-items: center
          .msgs-p
            line-height: 20px
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #111
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
            .green
              color: $color-main
        .msgs-rt
          width: 7.5px
          height: 11.5px
          margin-left: 33px

    .msgs-item:last-child
      margin-bottom: 0

  .noting
    text-align: center
    margin-top: 106px
    .notingimg
      width: 116px
      height: 110px
      margin: 0 auto 15px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub

</style>
