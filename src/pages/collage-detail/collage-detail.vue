<template>
  <div class="collage-detail">
    <navigation-bar title="拼团详情"></navigation-bar>
    <!--<picker style="margin-top: 10px; border: 1px solid #eee" mode="selector" @change="changePicker" :value="status" :range="[0,1,2,3,4,5,6,7,8,9,10,11]">
      <div class="picker">当前选择：{{status}}</div>
    </picker>-->
    <p v-if="topText1" class="top-text">该活动仅支持： {{data.shop.social_name || '国际单位社区'}}</p>
    <p v-if="topText2" class="top-text">当前社区不支持拼团活动: {{data.shop.social_name || '国际单位社区'}}</p>
    <div class="top-msg">
      <!--商品信息-->
      <div v-if="goodsBox" class="goods-box" @click="toDetail">
        <div class="goods-detail">
          <img :src="data.goods.goods_cover_image" alt="" class="goods-img">
          <div class="right-content">
            <p class="title">{{data.goods.name || '超值特惠 4斤新鲜柠檬是是三三首饰所所死侍死侍'}}</p>
            <p class="context">{{data.goods.describe || '脆嫩爽口，酸甜多汁，口感脆嫩，新鲜美味'}}</p>
            <div class="marks">
              <span class="total">{{data.goods.spell_count || 200}}人已拼</span>
              <span class="count">{{data.groupon_person_limit || 2}}人团</span>
            </div>
            <p class="price">
              <span class="money">{{data.goods.trade_price || '10'}}</span>
              <span class="unit">元</span>
            </p>
          </div>
        </div>
      </div>

      <p v-if="statusText" class="status-text" :class="{'orange': orangeStatus}"><img :src="imageUrl + '/yx-image/collage/'+ msg[statusNum].icon +'@2x.png'" alt="" class="icon">{{msg[statusNum].statusText}}</p>
      <p v-if="statusTip1" class="status-tip">还差<span class="mark">{{data.surplus_number}}</span>人，快喊邻居一起来拼团吧</p>
      <p v-if="statusTip2" class="status-tip status-tip2">仅剩<span class="mark">{{data.surplus_number}}</span>个名额</p>
      <p v-if="runTime" class="run-time">剩余 <span class="time-num">{{timeArr[0]}}</span>:<span class="time-num">{{timeArr[1]}}</span>:<span class="time-num">{{timeArr[2]}}</span></p>

      <!--头像-->
      <div v-if="headShow" class="heads">
        <div v-for="(item, index) in data.groupon_people" :key="index" class="head-box" :class="[{'small-head': data.groupon_people.length > 4}, {'has-border': item.is_payed}]">

          <img :src="item.avatar" alt="" class="logo">

          <span v-if="item.is_main" class="tag">拼主</span>
        </div>
      </div>

      <!--<button class="btn" open-type="share">{{data.btn}}</button>-->
      <div v-if="btnShow === 1"  class="btn" @click="clickBtn">邀请邻居参团</div>
      <div v-if="btnShow === 2" class="btn" @click="clickBtn">查看我的订单</div>
      <div v-if="btnShow === 3" class="btn" @click="clickBtn">返回商城首页</div>
      <div v-if="btnShow === 4" class="btn" @click="clickBtn">一键参团</div>
      <div v-if="btnShow === 5" class="btn" @click="clickBtn">我来开团</div>
      <p v-if="btnShow === 1" class="bot-tip">分享邻居越多，成团越快</p>
    </div>
    <!--<div class="btn" @click="_initLocation">获取位置信息</div>-->

    <div v-if="goods || time" class="line"></div>
    <div v-if="goods" class="goods" @click="toDetail">
      <span class="label">拼团商品</span>
      <p class="text">{{data.goods.name}}<img :src="imageUrl + '/yx-image/collage/icon-pressed@2x.png'" class="icon"></p>
    </div>
    <div v-if="time" class="time">
      <span class="label">拼团时间</span>
      <span class="text">{{data.start_groupon_at}}</span>
    </div>

    <!--进度-->
    <div v-if="progressShow" class="progress-handle">
      <div class="progress-bg">
        <span class="progress" :style="{width: (19 + 33.333*(step-1)) + '%'}"></span>
        <span v-for="(item, index) in progress" :key="index" :style="{left: -2 + (index * 33.333) + '%'}" class="step" :class="{'active': (step-1) >= index}">{{item}}</span>
        <span v-for="(item, index) in text" :key="index" :style="{left: -8.5 + (index * 33.333) + '%'}" class="progress-text" :class="{'activity': (step-1) >= index}">{{item}}</span>
      </div>
    </div>

    <!--分享-->
    <share-pop ref="sharePop"></share-pop>

    <!--猜你喜欢-->
    <div v-if="recommend" class="recommend">
      <p class="title">
        <img src="https://img.jkweixin.net/defaults/yx-image/2.3/icon-ulike@2x.png" alt="" class="icon">
        <span class="text">猜你喜欢</span>
      </p>
      <div class="recommend-list">
        <div v-for="(item, index) in recommendList" :key="index" class="list-item">
          <goods-item :item="item" @_getShopCart="_getShopCart"></goods-item>
        </div>
        <loading-more v-if="hasMore"></loading-more>
        <div class="foot-ties" v-if="!hasMore">
          <div class="center">— 再拉也没有了 —</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ClearWatch from '@mixins/clear-watch'
  import GoodsItem from './goods-item/goods-item'
  import SharePop from './share-pop/share-pop'
  import {ACTIVE_TYPE} from '@utils/contants'
  import { formatNumber } from '@utils/common'
  import {orderMethods} from '@state/helpers'
  import LoadingMore from '@components/loading-more/loading-more'
  import API from '@api'
  const PAGE_NAME = 'COLLAGE_DETAIL'

  // 3开团成功 7参团成功 9不在范围 为自定义状态。
  const STATUS_ARR = [
    {
      status: 0,
      statusText: '待成团',
      btn: '邀请邻居参团',
      icon: 'icon-success'
    },
    {
      status: 1,
      statusText: '拼团成功',
      btn: '查看我的订单',
      icon: 'icon-success'
    },
    {
      status: 2,
      statusText: '拼团失败',
      btn: '返回商城首页',
      icon: 'icon-failure'
    },
    {
      status: 3,
      statusText: '开团成功',
      btn: '邀请邻居参团',
      icon: 'icon-success'
    },
    {
      status: 4,
      statusText: '参团成功',
      btn: '查看我的订单',
      icon: 'icon-success'
    },
    // 未参与
    {
      status: 5,
      statusText: '不在范围',
      btn: '返回商城首页',
      icon: 'icon-failure'
    },
    {
      status: 6,
      statusText: '该团已满',
      btn: '我来开团',
      icon: 'icon-end'
    },
    {
      status: 7,
      statusText: '该团已结束',
      btn: '返回商城首页',
      icon: 'icon-end'
    },
    {
      status: 8,
      statusText: '',
      btn: '一键参团',
      icon: ''
    }
  ]

  export default {
    page: PAGE_NAME,
    mixins: [ClearWatch],
    data() {
      return {
        statusArr: STATUS_ARR,
        progress: [1, 2, 3, 4],
        text: ['开团', '邀请邻居', '拼团成功', '拼团返券'],
        timer: '',
        timeArr: [],
        recommendList: [],
        msg: STATUS_ARR,
        page: 1,
        hasMore: true,
        activeType: ACTIVE_TYPE,
        orderId: 1,
        id: 1,
        status: 0,
        isGroup: 1,
        isMain: 1,
        distance: true, // true范围内
        step: 1,
        statusNum: 1,
        isActivityEnd: 1,
        data: {
          id: 1,
          groupon_id: 46,
          groupon_status: 1,
          groupon_step: 2,
          groupon_person_limit: 2,
          start_groupon_at: '2019-05-17 15:53:38',
          spell_groupon_at: '2019-05-17 15:55:02',
          surplus_seconds: 10000,
          surplus_number: 0,
          is_spell_group: 1,
          is_group_main: 1,
          groupon_people: [
            {
              avatar: 'https://wx.qlogo.cn/mmopen/vi_32/nWbmOQibT41icqJ3JeDKlUH38CoYEOEQXTeCmvr2lY3ibTgnu8HKLl9Js4FCMfpNsysiaj7wD4fo9HXkfy1jgTyxaw/132',
              nickname: 'Lemonice',
              is_main: 1,
              is_payed: 1
            },
            {
              avatar: 'https://wx.qlogo.cn/mmopen/vi_32/fcOwTyiac1SwZKCpSMVDGjWHSVGAs6wqHDGvItiaVBXWP8yricFq8vqAfglCRHCOMdEKKkkNT7pwbvxIbGR5WHnNw/132',
              nickname: 'TING-紫',
              is_main: 0,
              is_payed: 1
            }
          ],
          goods: {
            goods_id: 2,
            goods_sku_id: 2,
            name: '青芒果',
            describe: '5',
            goods_units: '斤',
            trade_price: '158.00',
            original_price: '200.00',
            goods_cover_image: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/18/154510444727561.png',
            total_stock: 100,
            usable_stock: 100,
            sale_count: 100
          },
          shop: {
            shop_id: 1,
            social_name: '白云国际单位',
            name: '白云测试',
            notice: '大家10:00-10:30或16:00-16:30可取货。',
            province: '天津市',
            city: '天津市',
            district: '河西区',
            address: '黄园路 国际单位 A5'
          }
        }
      }
    },
    computed: {
      topText1() { // 开团成功
        return this.orderId && this.isMain
      },
      topText2() { // 不在范围
        return !this.isGroup && !this.distance
      },
      goodsBox() {
        // 参团非拼主、未参团一键参团
        if (this.orderId) return false
        if (!this.isGroup && (+this.status === 1 || this.isActivityEnd)) { // todo
          return false
        }
        return true
      },
      statusText() {
        // 一键参团、不在范围
        if (!this.isGroup && +this.status === 0 && this.distance) {
          return false
        } else if (!this.distance) {
          return false
        }
        return true
      },
      statusTip1() {
        // 拼主开团成功、拼主待成团、拼主拼团失败
        // 参团者参团成功、参团者待成团
        if (this.isMain) {
          if (this.orderId || +this.status === 0 || +this.status === 2) {
            return true
          }
        } else if (!this.isMain && this.isGroup) {
          if (+this.status === 0) {
            return true
          }
        }
        return false
      },
      statusTip2() {
        // 一键参团
        if (!this.isGroup && this.distance && +this.status === 0) {
          return true
        }
        return false
      },
      runTime() {
        // 拼主开团成功、拼主待成团、拼主拼团失败
        // 参团者参团成功、参团者待成团
        // 未参团者一键参团
        if (this.isMain) {
          if (this.orderId || +this.status === 0 || +this.status === 2) {
            return true
          }
        } else if (!this.isMain && this.isGroup) {
          if (+this.status === 0) {
            return true
          }
        } else if (!this.isGroup && +this.status === 0) {
          return true
        }
        return false
      },
      headShow() {
        // 未参团且活动已结束
        if (!this.isGroup && +this.data.surplus_seconds === 0) {
          return false
        }
        return true
      },
      btnShow() {
        if (this.isGroup && +this.status === 0) {
          return 1
        }
        if (this.isGroup && +this.status === 1) {
          return 2
        }
        if (!this.isGroup && this.distance && +this.status === 0 && !this.isActivityEnd) {
          return 4
        }
        if (!this.isGroup && this.distance && +this.status === 1 && !this.isActivityEnd) {
          return 5
        }
        if ((this.isGroup && +this.status === 2) || (!this.isGroup && !this.distance) || (!this.isGroup && this.distance && this.isActivityEnd)) {
          return 3
        }
        return 0
      },
      botTip() {
        // 拼主没有拼团失败、未参团者看到拼团没结束、未参团者看到拼团没满
        if (!this.isMain && !this.isGroup && +this.status === 1) {
          return false
        }
        return true
      },
      goods() {
        // 开团成功、参团成功
        if (this.orderId) {
          return true
        }
        return false
      },
      time() {
        // 不是未参团看到人满、不是未参团看到结束
        if (!this.isGroup && +this.status !== 0) {
          return false
        }
        return true
      },
      progressShow() {
        // 不是未参团看到人满、不是未参团看到结束
        if (!this.isGroup && +this.status !== 0) {
          return false
        }
        return true
      },
      recommend() {
        // 未参团 看到人满或结束
        if (!this.isGroup) {
          if (+this.status === 1) {
            return true
          }
        }
        return false
      },
      orangeStatus() {
        // 拼团失败、未参团看到拼团成功了的团
        if (+this.status === 2) {
          return true
        } else if (+this.status === 1 && !this.isGroup) {
          return true
        }
        return false
      }
    },
    components: {
      NavigationBar,
      GoodsItem,
      SharePop,
      LoadingMore
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('shopId')
      const flag = Date.now()
      console.log(`/pages/collage-detail?id=${this.id}&shopId=${shopId}`)
      return {
        title: `【${this.data.goods.name}】`,
        path: `/pages/collage-detail?id=${this.id}&shopId=${shopId}&flag=${flag}`,
        // imageUrl: `${this.imageUrl}/yx-image/order/pic-share_order@2x.png`,
        imageUrl: `${this.data.goods.goods_cover_image}`,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    onReachBottom() {
      if (!this.isGroup && +this.status === 1) {
        if (!this.hasMore) return
        this.page++
        this.getCarRecommend()
      }
    },
    onUnload() {
      clearInterval(this.timer)
    },
    onHide() {
      clearInterval(this.timer)
    },
    onLoad(options) {
      // this._initLocation()
      this.orderId = (options && options.orderId) || ''
      this.id = (options && options.id) || ''
      if (options.shopId) {
        wx.setStorage('shopId', options.shopId)
      }
    },
    async onShow() {
      this.timeHandle()
      this.getGrouponDetail()
      // this._refreshLocation()
      if (!this.isGroup && +this.status === 1) {
        this.getCarRecommend()
      }
      // await this.getCarRecommend()
      // if (this.status < 3) {
      //   this.statusNum = this.status
      // }
      // if (this.orderId && this.isMain) {
      //   this.statusNum = 3
      // } else if (this.orderId && !this.isMain) {
      //   this.statusNum = 4
      // } else if (!this.isGroup && +this.data.surplus_seconds === 0) {
      //   this.statusNum = 7
      // } else if (!this.isGroup && +this.status === 1) {
      //   this.statusNum = 6
      // } else if (!this.isGroup && +this.status === 0) {
      //   this.statusNum = 8
      // }
      // if (!this.isGroup && this.distence) {
      //   this.statusNum = 5
      // }
      // dfgdg
    },
    methods: {
      ...orderMethods,
      // 拼团详情
      getGrouponDetail() {
        API.Groupon.getGrouponDetail({id: this.id, order_id: this.orderId})
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.data = res.data
            this.id = res.data.groupon_id
            this.isMain = res.data.is_group_main
            this.isGroup = res.data.is_spell_group
            this.status = res.data.groupon_status
            this.isActivityEnd = res.data.isActivityEnd
            this.step = res.data.step
            if (!this.isGroup) {
              this._initLocation()
            }
            if (!this.isGroup && +this.status === 1) {
              this.getCarRecommend()
            }
            if (this.status < 3) {
              this.statusNum = this.status
            }
            if (this.orderId && this.isMain) {
              this.statusNum = 3
            } else if (this.orderId && !this.isMain) {
              this.statusNum = 4
            } else if (!this.isGroup && +this.data.surplus_seconds === 0) {
              this.statusNum = 7
            } else if (!this.isGroup && +this.status === 1) {
              this.statusNum = 6
            } else if (!this.isGroup && +this.status === 0) {
              this.statusNum = 8
            }
            // if (!this.isGroup && !this.distence) {
            //   this.statusNum = 5
            // }
          })
      },
      // 参团时判断是否符合参团标准
      checkGroupon() {
        API.Groupon.checkGroupon({
          activity_id: this.data.activity.activity_id,
          goods_sku_id: this.data.goods.goods_sku_id,
          groupon_id: this.data.goods.groupon_id,
          longitude: this.longitude,
          latitude: this.latitude
        })
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return false
            }
            return true
          })
      },
      changePicker(e) {
        this.status = e.target.value
      },
      async clickBtn() {
        let status = +this.status
        if (this.btnShow === 1) {
          console.log(1)
          // -----------------
          // 参团了拼团进行中可分享
          this.showShare()
        } else if (this.btnShow === 2) {
          console.log(2)
          // -----------------
          // 参团成功或者拼主拼团成功跳转去我的订单
          wx.navigateTo({url: `/pages/order-list?id=&index=0`})
        } else if (this.btnShow === 3) {
          console.log(3)
          // -----------------
          // 返回首页
          wx.switchTab({url: '/pages/choiceness'})
        } else if (!this.isGroup && status === 0) {
          console.log(4)
          // -----------------
          // 一键参团
          let goodsList = this.data.goods
          goodsList.sku_id = goodsList.goods_sku_id
          goodsList.num = 1
          let price = goodsList.trade_price
          let flag = await this.checkGroupon()
          console.log(flag, 'flag')
          if (!flag) return
          goodsList.url = `/pages/collage-detail`
          goodsList.source = 'c_groupon'
          goodsList.groupon_id = this.data.groupon_id
          goodsList.latitude = this.latitude
          goodsList.longitude = this.longitude
          const total = (price * goodsList.num).toFixed(2)
          goodsList.activity = this.data.activity
          let orderInfo = {
            goodsList: new Array(goodsList),
            total: total
          }
          this.setOrderInfo(orderInfo)
          wx.navigateTo({url: `/pages/submit-order`})
        } else if (!this.isGroup && status === 1) {
          console.log(5)
          // -----------------
          // 我来开团
          wx.navigateTo({url: `/pages/goods-detail?id=${this.data.goods.goods_id}&activityId=${this.data.activity.activity_id}&activityType=${this.activeType}`})
        } else {
          console.log(6)
        }
      },
      showShare() {
        this.$refs.sharePop.show(this.data.surplus_number, this.data.shop.social_name, this.data.groupon_person_limit)
      },
      toDetail() {
        wx.navigateTo({url: `/pages/goods-detail?id=${this.data.goods.goods_id}&activityId=${this.data.activity.activity_id}&activityType=${this.activeType}`})
      },
      timeHandle() {
        clearInterval(this.timer)
        let timeDef = this.data.surplus_seconds
        this.timer = setInterval(() => {
          timeDef -= 1
          if (+timeDef === 0) {
            clearInterval(this.timer)
            this.getGrouponDetail()
          }
          let hours = formatNumber(Math.floor(timeDef / 60 / 60 % 60))
          let minutes = formatNumber(Math.floor(timeDef / 60 % 60))
          let seconds = formatNumber(Math.floor(timeDef % 60))
          this.timeArr = [hours, minutes, seconds]
        }, 1000)
      },
      async getCarRecommend() {
        let res = await API.Cart.getCarRecommend({page: this.page, limit: 10})
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        if (this.page === 1) {
          this.recommendList = res.data
        } else {
          let arr = this.recommendList.concat(res.data)
          this.recommendList = arr
        }
        if (this.page === 5) {
          this.hasMore = false
        }
      },
      // 初始化地理位置
      _initLocation() {
        // if (wx.getStorageSync('locationShow') * 1 === 3 || wx.getStorageSync('locationShow') * 1 === 2) {
        // } else {
        let that = this
        wx.getLocation({
          async success(res) {
            wx.setStorageSync('locationData', res)
            wx.setStorageSync('locationShow', 1)
            this.latitude = res.latitude
            this.longitude = res.longitude
            that.locationStatus = 1
            that.getLocationData()
          },
          fail(res) {
            wx.setStorageSync('locationShow', 3)
            // wx.setStorageSync('lastPage', 'collage-detail')
            wx.navigateTo({
              url: `/pages/open-location`
            })
          }
        })
        // }
      },
      // 更新地理位置
      _refreshLocation() {
        this.locationStatus = wx.getStorageSync('locationShow')
        if (this.locationStatus * 1 === 3) {
          // wx.setStorageSync('lastPage', 'collage-detail')
          wx.navigateTo({
            url: `/pages/open-location`
          })
        }
      },
      // 根据地理位置判断范围
      getLocationData() {
        let data = wx.getStorageSync('locationData')
        API.Choiceness.getLocationDistance({
          longitude: data.longitude || 0,
          latitude: data.latitude || 0
        }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          if (res.data.distance > 1000) {
            this.distance = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .top-msg
    padding-bottom: 13px
  .goods-box
    background: #F7F7F7
    padding-bottom: 12px
    margin-bottom: 7px
  .goods-detail
    padding: 15px 13px
    display: flex
    align-items: center
    background: #FFF
    .goods-img
      width: 105px
      height: 105px
      background: #eee
      border-radius: 2px
    .right-content
      height: 105px
      margin-left: 10px
      flex: 1
      overflow: hidden
    .title
      font-family: $font-family-medium
      font-size: $font-size-16
      line-height: 20px
      color: #111
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    .context
      font-family: $font-family-regular
      font-size: $font-size-14
      line-height: 14px
      color: #808080
      margin-top: 6px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    .marks
      margin-top: 8px
      display: flex
      align-items: center
      color: #fa7500
      font-size: $font-size-12
      font-family: $font-family-regular
      .total
        padding: 2px 7px
        background: rgba(255,133,6,0.15)
        border-radius: 2px
      .count
        padding: 2px 7px
        border-radius: 2px
        margin-left: 5px
        border-1px(rgba(250,117,0,0.20))
    .price
      color: #FA7500
      margin-top: 10px
      .money
        font-family: $font-family-medium
        font-size: 25px
        line-height: 25px
      .unit
        font-family: $font-family-regular
        font-size: $font-size-14
        margin-top: -2px
  .top-text
    height: 40px
    font-size: 15px
    font-family: $font-family-regular
    color: #FF8300
    padding: 0 12px
    line-height: 40px
    background: #FFEBD6
  .status-text
    font-family: $font-family-medium
    color: $color-main
    font-size: 22px
    display: flex
    align-items: center
    margin: 22px 0 31px
    justify-content: center
    .icon
      width: 35px
      height: 35px
      border-radius: 50%
      margin-right: 4px
      background: #ccc
  .orange
    color: #FF8506
  .status-tip
    font-size: $font-size-14
    font-family: $font-family-medium
    text-align: center
    .mark
      color: #FA7500
  .status-tip2
    margin-top: 30px
  .run-time
    font-family: $font-family-regular
    font-size: $font-size-14
    color: #3F454B
    line-height: 20px
    margin-top: 14px
    display: flex
    align-items: center
    justify-content: center
    .time-num
      display: inline-block
      width: 20px
      height: 20px
      text-align: center
      line-height: 20px
      border-radius: 4px
      margin-left: 3px
      margin-right: 3px
      background: #3F454B
      font-size: $font-size-14
      font-family: $font-family-din-bold
      color: #FFF
      &:first-child
        margin-left: 6px
  .heads
    padding: 0 12px
    margin-top: 28px
    margin-bottom: 25px
    display: flex
    align-items: center
    justify-content: center
    .head-box
      flex: 0 0 1
      height: 50px
      margin: 0 4%
      border-radius: 50%
      position: relative
    .small-head
      margin: 0 2%
    .has-border
      border: 1px solid #E0E0E0
    .logo
      width: 50px
      height: 50px
      border-radius: 50%
    .tag
      width: 34px
      height: 14px
      border-radius: 15px
      background: #FFD14F
      row-center()
      bottom: -7px
      text-align: center
      line-height: 14px
      color: #A03918
      font-size: 10px
      font-family: $font-family-medium
  .btn
    margin: 0 auto
    width: 72%
    height: 45px
    line-height: 45px
    text-align: center
    color: #FFF
    font-size: $font-size-16
    font-family: $font-family-medium
    border-radius: 50px
    background: $color-main
    margin-bottom: 12px
  .bot-tip
    color: $color-text-assist
    font-size: 13px
    font-family: $font-family-regular
    text-align: center
    margin-bottom: 7px
  .line
    height: 10px
    background: #F7F7F7

  .goods,.time
    height: 50px
    margin: 0 12px
    display: flex
    align-items: center
    justify-content: space-between
    font-size: $font-size-14
    border-bottom-1px(#E6E6E6)
    .label
      width: 180px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      color: #808080
    .text
      color: #111
      display: flex
      align-items: center
    .icon
      width: 6px
      height: 12px
      margin-left: 4px

  .progress-handle
    padding: 30px 12px 60px
    .progress-bg
      width: 275px
      height: 5px
      background: #CBCAD3
      position: relative
      margin: 0 auto
    .progress
      width: 0
      height: 5px
      background: linear-gradient(90deg, #73C200, #ABE300)
      border-radius: 5px
      position: absolute
      left: 0
      top: 0
    .step
      width: 14px
      height: 14px
      border-radius: 50%
      background: #FFF
      border: 1px solid #E5E5E5
      text-align: center
      line-height: 14px
      font-family: $font-family-medium
      color: #808080
      font-size: $font-size-10
      position: absolute
      top: -5px
      transition: all 0.3s
    .active
      background: $color-main
      color: #FFF
      border: 1px solid transparent
    .progress-text
      font-size: $font-size-12
      font-family: $font-family-regular
      color: #808080
      width: 50px
      text-align: center
      position: absolute
      top: 20px
      left: 0
    .activity
      color: $color-main
  .recommend
    .title
      height: 60px
      padding-top: 12px
      box-sizing: border-box
      background: #F7F7F7
      display: flex
      align-items: center
      justify-content: center
      .icon
        width: 17px
        height: 17px
        margin-right: 4px
      .text
        font-family: $font-family-medium
        font-size: $font-size-16
        color: #1D2023
    .recommend-list
      width: 100vw
      layout(row)
      align-items: center
      padding: 0 6px
      box-sizing: border-box
      .list-item
        width: 50%
        box-sizing: border-box
        margin-bottom: 5px
        &:nth-of-type(odd)
          padding-right: 2.5px
        &:nth-of-type(even)
          padding-left: 2.5px
  .foot-ties
    flex: 1
    layout(row)
    justify-content: center
    align-items: center
    height: 60px
    box-sizing: border-box
    padding: 20px 0

    .lines
      width: 10px
      height: 1px
      background: rgba(124, 132, 156, 0.20)
      margin: 0 5px

    .center
      font-family: $font-family-regular
      font-size: $font-size-14
      color: rgba(152, 152, 159, 0.30)
      text-align: justify
      line-height: 1
</style>
