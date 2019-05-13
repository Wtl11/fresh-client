<template>
  <div class="choiceness">
    <navigation-bar
      ref="navigationBar"
      :headStyle="headStyle"
      :titleColor="titleColor"
      :title="title"
      :showArrow="false"
      :titleMaxLen="12"
      :translucent="fasle"
    ></navigation-bar>
    <article class="container">
      <img
        v-if="imageUrl"
        :src="imageUrl + '/yx-image/2.3/bg-xzthd.png'"
        class="top-background"
        mode="widthFix"
      >
      <home-position
        :locationStatus="locationStatus"
        :groupInfo="groupInfo"
      ></home-position>
      <block
        v-for="(moduleItem, moduleIndex) in moduleArray"
        :key="moduleIndex"
      >
<!--        轮播图-->
        <section
          v-if="moduleItem.module_name === 'bannar' && moduleItem.is_close === 0"
          class="item-wrapper">
          <article class="home-banner">
            <swiper
              v-if="moduleItem.content_data && moduleItem.content_data.list && moduleItem.content_data.list.length"
              class="banner"
              autoplay
              interval="5000"
              display-multiple-items="1"
              previous-margin="0px"
              next-margin="0px"
              circular
              @change="handleSetBannerIndex">
              <block
                v-for="(item,index) in moduleItem.content_data.list"
                :key="index"
              >
                <swiper-item
                  class="banner-item"
                >
                  <img
                    class="item-img"
                    lazy-load
                    mode="aspectFill"
                    v-if="item.image_url"
                    :src="item.image_url"
                    @click="handleBannerJump(item)"
                  >
                </swiper-item>
              </block>
            </swiper>
            <ul class="dot-wrapper">
              <li class="background">
                <img
                  lazy-load
                  class="img"
                  mode="aspectFill"
                  v-if="imageUrl"
                  :src="imageUrl + '/yx-image/2.3/pic-switch@2x.png'"
                >
              </li>
              <li class="dot">{{bannerIndex}}</li>
              <li class="dot-line">/</li>
              <li class="dot right">{{moduleItem.content_data.list.length || 0}}</li>
            </ul>
          </article>
        </section>
<!--        限时抢购-->
        <section
          v-if="moduleItem.module_name === 'activity_fixed' && moduleItem.is_close === 0 && moduleItem.content_data && moduleItem.content_data.list && moduleItem.content_data.list.length && flashArray.length"
          class="item-wrapper"
        >
          <div style="height: 15px"></div>
          <div
            class="home-flash-sale">
            <section
              class="top-wrapper">
              <img
                lazy-load
                class="title-img"
                mode="aspectFill"
                v-if="imageUrl"
                :src="imageUrl + '/yx-image/2.3/pic-qgtitle@2x.png'"
              >
              <ul
                class="tab-wrapper">
                <li
                  v-if="index < 2"
                  v-for="(item, index) in moduleItem.content_data.list"
                  :key="index"
                  class="tab-item-wrapper"
                  :class="{active: flashTabIndex === index}"
                  @click="handleFlashTabChange(item, index)"
                >
                  <p class="time">{{item.at}}</p>
                  <p class="explain">{{item.at_str}}</p>
                </li>
              </ul>
              <div
                class="more-wrapper"
                @click="handleJumpToFlashList(moduleItem.id)"
              >
                <p class="more-text">更多</p>
                <img
                  lazy-load
                  class="more-img"
                  mode="aspectFill"
                  v-if="imageUrl"
                  :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'"
                >
              </div>
            </section>
            <section class="scroll-wrapper">
              <scroll-view
                class="bottom-wrapper"
                scroll-x
                :scroll-into-view="flashViewToChild"
              >
                <div
                  v-for="(child, idx) in flashArray"
                  class="bottom-item-wrapper"
                  :class="flashArray.length> 4 && idx === flashArray.length -1?'':'item-r-2vw'"
                  :key="idx"
                  :id="'child'+idx"
                >
<!--                  flash-item-->
                  <div class="home-flash-item" @click="handleJumpToGoodsDetail(child)">
                    <figure class="goods-wrapper">
                      <img
                        class="img-goods"
                        lazy-load
                        mode="aspectFill"
                        v-if="child.goods_cover_image"
                        :src="child.goods_cover_image"
                      >
                      <div class="img-label">
                        <img
                          class="img"
                          lazy-load
                          mode="aspectFit"
                          v-if="imageUrl"
                          :src="imageUrl + '/yx-image/2.3/pic-label_qg@2x.png'"
                        >
                      </div>
                    </figure>
                    <form
                      class="bottom-wrapper"
                      report-submit
                      @submit="$getFormId"
                    >
                      <div class="title-wrapper">
                        <p class="title">{{child.name}}</p>
                      </div>
                      <div class="price-wrapper">
                        <div class="price">
                          <p class="number">{{child.trade_price}}</p>
                          <p class="unit">元</p>
                          <p class="origin-price">{{child.original_price}}元</p>
                        </div>
                      </div>
                    </form>
                  </div>
                  <section
                    v-if="flashArray.length> 4 && idx === flashArray.length -1"
                    class="look-more"
                  >
                    <div
                      class="look-wrapper"
                      @click="handleJumpToFlashList(moduleItem.id)"
                    >
                      <div class="text">查看更多</div>
                      <figure
                        class="more-icon"
                      >
                        <img
                          class="img"
                          lazy-load
                          mode="aspectFill"
                          v-if="imageUrl"
                          :src="imageUrl + '/yx-image/2.1/icon-pressed_gd@2x.png'"
                        >
                      </figure>
                    </div>
                  </section>
                </div>
              </scroll-view>
            </section>
          </div>
        </section>
<!--        通知-->
        <article
          v-if="moduleIndex === 0 && notifyInfo.has_notify && notifyInfo.desc"
          class="notice"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl + '/yx-image/notice/pic-notice@2x.png'"
            class="notice-img">
          <div class="notice-msg">
            <div class="notice-content">
              <block v-for="(child, idx) in 2" :key="idx">
                <div
                  v-for="(item, index) in notifyInfo.desc"
                  :key="index"
                  class="notice-msg-item"
                >{{item}}</div>
              </block>
            </div>
          </div>
          <span class="notice-line">|</span>
          <navigator
            url="/pages/notice"
            class="notice-look"
            hover-class="none"
          >查看</navigator>
        </article>
      </block>
      <div style="height: 1500px"></div>
    </article>
<!--    自定义tab-->
    <custom-tab-bar currentType="index"></custom-tab-bar>
<!--    优惠券弹窗-->
    <coupon-modal ref="couponModal"></coupon-modal>
<!--    添加至我的小程序-->
    <new-guidelines ref="guidelines"></new-guidelines>
    <div class="goods-search-wrapper" :style="goodsSearchStyles"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  import API from '@api'
  import {cartMethods, jwtComputed} from '@state/helpers'
  import {resolveQueryScene} from '@utils/common'
  import CouponModal from './coupon-modal/coupon-modal'
  import HomePosition from './home-position/home-position'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import ShareTrick from '@mixins/share-trick'
  import NewGuidelines from './new-guidelines/new-guidelines'

  const ald = getApp()
  const PAGE_NAME = 'CHOICENESS'

  // const MODULE_CONFIG = {
  //   bannar: 'bannerInfo',
  //   activity_fixed: 'flashInfo',
  //   goods_cate: 'classifyInfo'
  // }

  const MODULE_ARR_METHODS = {
    activity_fixed: '_getFlashList'
  }

  let SYSTEM_INFO = {}
  // let flashTabIndex = 0
  // let classifyTabIndex = 0
  // let classifyPage = 1
  // let isLoading = false
  // let classifyTabPosition = 999999
  // let classifyScrollHeight = 9999999
  // let navigationBarHeight = 64
  // let classifyTabScrolling = false
  export default {
    name: PAGE_NAME,
    mixins: [
      ShareHandler,
      ShareTrick
    ],
    components: {
      NavigationBar,
      CustomTabBar,
      CouponModal,
      HomePosition,
      NewGuidelines
    },
    data() {
      return {
        // 头部变色
        title: '赞播优鲜',
        headStyle: `background:#73C200`,
        titleColor: `#ffffff`,
        backgroundHeight: 0,
        backgroundColor: '#73C200',
        navigationBarHeight: 64,
        // 商品搜索样式
        goodsSearchStyles: '',
        // 头部地理位置等
        locationStatus: null,
        groupInfo: {},
        // bannerInfo: {},
        // flashInfo: {},
        // classifyInfo: {},
        // classifyMore: true,
        // classifyArray: [],
        // classifyStyles: '',
        // classifyShowEmpty: false,
        // notifyDesc: [],
        // isShowNotify: false,
        // 当前店铺
        curShopId: '',
        // 模块数组
        moduleArray: [],
        // 轮播图
        bannerIndex: 1,
        // 通知
        notifyInfo: {},
        // 限时抢购
        flashTabIndex: 0,
        flashArray: [],
        flashViewToChild: undefined
      }
    },
    computed: {
      ...jwtComputed,
      socialName() {
        return (this.groupInfo || {}).social_name || ''
      }
      // // banner
      // bannerArray() {
      //   return (this.bannerInfo.content_data && this.bannerInfo.content_data.list) || []
      // },
      // // 是否显示banner
      // bannerIsShow() {
      //   return this.bannerArray.length && !this.bannerInfo.is_close
      // },
      // // 限时抢购tab
      // flashTabArray() {
      //   return (this.flashInfo.content_data && this.flashInfo.content_data.list) || []
      // },
      // // 是否显示限时抢购
      // flashIsShow() {
      //   return this.flashTabArray.length && !this.flashInfo.is_close && this.flashArray.length
      // },
      // // 商品分类tab数组
      // classifyTabArray() {
      //   return (this.classifyInfo.content_data && this.classifyInfo.content_data.list) || []
      // },
      // // 是否显示商品分类
      // classifyIsShow() {
      //   return this.classifyTabArray.length && !this.classifyInfo.is_close
      // }
    },
    watch: {
      userInfo(val = {}) {
        this._getCouponModalList(val.id)
      }
    },
    onLoad(options) {
      // SYSTEM_INFO = {}
      // flashTabIndex = 0
      // classifyTabIndex = 0
      // classifyPage = 1
      // isLoading = false
      // classifyTabPosition = 999999
      // classifyScrollHeight = 9999999
      // navigationBarHeight = 64
      // classifyTabScrolling = false
      SYSTEM_INFO = wx.getSystemInfoSync()
      this.$wechat.showLoading()
      this._initPageParams(options)
      this._initLocation()
    },
    async onReady() {
      // 获取tab高度
      this._initTopStyles()
      await this._getTabPosition()
      this.$refs.guidelines && this.$refs.guidelines.setTop(this.navigationBarHeight)
    },
    onPageScroll(e) {
      const flag = this._changeNavigation(e)
      this._goodsSearchScrollEvent(flag)
      // this._classifyScrollEvent(e)
    },
    async onShow() {
      this._refreshLocation()
      try {
        ald.aldstat.sendEvent('首页')
        let shopId = wx.getStorageSync('shopId')
        if (!shopId) {
          let res = await API.Choiceness.getDefaultShopInfo()
          wx.setStorageSync('shopId', res.data.id)
          shopId = res.data.id
        }
        this._getCouponModalList() // 首页弹窗
        // 获取团的信息
        this._groupInfo(false)
        if (this.curShopId * 1 !== shopId * 1) {
          this.curShopId = shopId
          this._resetBanner()
          this._resetFlash()
        }
        await this._getModuleInfo()
        this._getAllActiveList()
        this._getNotify()
        if (!wx.getStorageSync('token')) return
        this.setCartCount()
      } catch (e) {
        console.error(e)
      } finally {
        this.$wechat.hideLoading()
        this.$sendMsg({
          event_no: 1000
        })
        this.$$shareHandler({event: EVENT_CODE.HOME})
      }
    },
    async onPullDownRefresh() {
      // this._resetGetClassifyListParams()
      this._refreshLocation()
      this._getCouponModalList()
      this._groupInfo(false)
      this._getNotify()
      try {
        await this._getModuleInfo(false)
        this._getAllActiveList()
      } catch (e) {
        console.error(e)
      }
      wx.stopPullDownRefresh()
      if (!wx.getStorageSync('token')) return
      this.setCartCount()
    },
    onReachBottom() {
      // if (isLoading) return
      // classifyPage++
      // this._getClassifyList()
    },
    onShareAppMessage(res) {
      let imgUrl = ''
      switch (this.corpName) {
        case 'platform':
          imgUrl = '/yx-image/choiceness/pic-zbyx@2x.png'
          break
        case 'retuan':
          imgUrl = '/yx-image/retuan/pic-zbyx@2x.png'
          break
        default:
          imgUrl = '/yx-image/choiceness/pic-zbyx@2x.png'
          break
      }
      const flag = Date.now()
      return {
        title: `${this.groupInfo.social_name},次日达、直采直销，点击下单↓`,
        path: `/pages/choiceness?shopId=${this.curShopId}&flag=${flag}`,
        imageUrl: this.imageUrl + imgUrl,
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    },
    methods: {
      ...cartMethods,
      // 页面滚动商品搜索是否显示
      _goodsSearchScrollEvent(flag) {
        if (!flag) {
          this._setGoodsSearchStyles(this.navigationBarHeight, 1)
        } else {
          this._setGoodsSearchStyles(0, 1)
        }
      },
      // 设置分类滚动时的样式
      _setGoodsSearchStyles(y, opacity, time = 300) {
        this.goodsSearchStyles = `
          opacity:${opacity};
          transform:translate3d(0,${y}px,0);
          transition: transform ${time}ms ease-out
        `
      },
      // banner页面跳转
      handleBannerJump(item) {
        let url = ''
        switch (item.type) {
          case 'mini_goods':
            url = `/pages/goods-detail?id=${item.other_id}&activityId=${item.activity_id}`
            break
          case 'goods_cate':
            url = `/pages/classify?id=${item.other_id}`
            break
          case 'mini_link':
            url = `${item.url}`
            break
          default:
            url = `/pages/out-html?url=${item.url}`
            break
        }
        wx.navigateTo({url})
      },
      // 设置banner下标
      handleSetBannerIndex(e) {
        this.bannerIndex = e.target.current + 1
      },
      // 重置banner轮播图
      _resetBanner() {
        this.moduleArray.forEach(item => {
          item.module_name === 'bannar' && (item.content_data.list = [])
        })
        this.bannerIndex = 1
      },
      // 跳转至商品详情页
      handleJumpToGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
      // 跳转至限时抢购列表
      handleJumpToFlashList(id) {
        wx.navigateTo({url: `/pages/flash-sale-list?id=${id}`})
      },
      // 限时抢购tab切换
      handleFlashTabChange(item, index) {
        if (index === this.flashTabIndex) return
        this.flashTabIndex = index
        this.flashViewToChild = 'child0'
        setTimeout(() => {
          this.flashViewToChild = undefined
        }, 100)
        this._getFlashTabList()
      },
      // 重置限时活动
      _resetFlash() {
        this.flashArray = []
        this.flashTabIndex = 0
        this.flashViewToChild = undefined
      },
      // 获取限时活动列表
      async _getFlashList(module, loading) {
        if (!module || !module.content_data) return
        let data = {
          activity_id: module.content_data.list[this.flashTabIndex].id || 0
        }
        try {
          let res = await API.FlashSale.getFlashList(data, loading)
          this.flashArray = res.data
        } catch (e) {
          console.warn(e)
        }
      },
      // 获取flashTab切换
      async _getFlashTabList(loading = false) {
        try {
          let res = await API.FlashSale.getFlashTabList('', loading)
          let index = this.moduleArray.findIndex(val => val.module_name === 'activity_fixed')
          this.moduleArray[index].content_data.list = res.data
          await this._getFlashList(this.moduleArray[index])
        } catch (e) {
          console.error(e)
        }
      },
      // 获取所有活动的列表
      _getAllActiveList() {
        this.moduleArray.forEach((item) => {
          const key = MODULE_ARR_METHODS[item.module_name]
          key && this[key](item)
        })
      },
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
      async addShoppingCart(item) {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        API.Choiceness.addShopCart({goods_sku_id: item.goods_sku_id, activity_id: item.activity_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$sendMsg({
              event_no: 1007,
              goods_id: item.goods_id,
              title: item.name
            })
            this.$wechat.showToast('加入购物车成功', 1000, false)
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      },
      // 获取优惠券列表
      _getCouponModalList(id) {
        if (!wx.getStorageSync('token')) return
        let customerId = id || (wx.getStorageSync('userInfo') || {}).id || 0
        API.Coupon.getModalList({customer_id: customerId}).then(res => {
          this._ref('couponModal', 'show', res.data)
        }).catch(e => {
          console.error(e)
        })
      },
      // 工具-->调用子节点的方法
      _ref(key, fn, params) {
        this.$refs[key] && this.$refs[key][fn] && this.$refs[key][fn](params)
      },
      // 通知
      async _getNotify() {
        try {
          const res = await API.AfterNotice.getNotify()
          // res.data.desc = '啊实打实的看撒谎大江大河的阿萨大' // todo
          // res.data.has_notify = 1 // todo
          this.notifyInfo = res.data
        } catch (e) {
          console.warn(e)
        }
      },
      // 分类滚动
      _classifyScrollEvent(e) {
        // if (classifyTabScrolling) return
        // const currentScrollTop = e.scrollTop + navigationBarHeight
        // const t10 = classifyScrollHeight + classifyTabPosition
        // const t15 = classifyScrollHeight + classifyTabPosition * 1.1
        // const t20 = classifyScrollHeight + classifyTabPosition * 1.5
        // if (currentScrollTop < t10) {
        //   this.classifyStyles = ''
        // }
        // if (currentScrollTop > t10 && currentScrollTop < t15) {
        //   this._setClassifyStyles(0, 1, 0)
        // }
        // if (currentScrollTop >= t15 && currentScrollTop <= t20) {
        //   this._setClassifyStyles(0, 1)
        // }
        // if (currentScrollTop > t20) {
        //   this._setClassifyStyles(classifyTabPosition, 1)
        // }
      },
      // // 设置分类滚动时的样式
      // _setClassifyStyles(y, opacity, time = 300) {
      //   this.classifyStyles = `
      //     opacity:${opacity};
      //     top:${navigationBarHeight - classifyTabPosition}px;
      //     position:fixed;
      //     left:0;
      //     z-index:90;
      //     transform:translate3d(0,${y}px,0);
      //     transition: transform ${time}ms ease-out
      //   `
      // },
      // 获取tab位置信息
      _getTabPosition() {
        const query = wx.createSelectorQuery()
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            query.select('#navigationBar').boundingClientRect()
              // .select('#homePosition').boundingClientRect()
              // .select('#homeBanner').boundingClientRect()
              // .select('#homeFlashSale').boundingClientRect()
              // .select('#homeEmpty').boundingClientRect()
              // .select('#scrollView-relative').boundingClientRect()
              // .select('#notice').boundingClientRect()
              .exec(res => {
                // let height = 0
                res.forEach(item => {
                  if (item && item.height) {
                    item.id === 'navigationBar' && (this.navigationBarHeight = item.height)
                    // if (item.id === 'scrollView-relative') {
                    //   classifyTabPosition = item.height
                    // } else {
                    //   height += item.height
                    // }
                  }
                })
                // if (classifyScrollHeight !== height + 10) {
                //   classifyScrollHeight = height + 10
                // }
                resolve()
              })
          }, 500)
        })
      },
      // 获取商品分类列表
      // async _getClassifyList(loading) {
      //   if (!this.classifyMore) return
      //   let current = this.classifyTabArray[classifyTabIndex] || {}
      //   // current.id = 0 // todo
      //   try {
      //     const data = {
      //       goods_category_id: current.id || 0,
      //       page: classifyPage
      //     }
      //     isLoading = true
      //     let res = await API.FlashSale.getClassifyList(data, loading)
      //     if (res.meta.current_page === 1) {
      //       this.classifyArray = res.data
      //       this.classifyShowEmpty = res.meta.total === 0
      //     } else {
      //       const arr = this.classifyArray
      //       res.data.forEach((item) => {
      //         arr.push(item)
      //       })
      //       this.classifyArray = arr
      //     }
      //     this.classifyMore = res.meta.current_page < res.meta.last_page
      //     wx.nextTick(() => {
      //       isLoading = false
      //     })
      //   } catch (e) {
      //     isLoading = false
      //     console.error(e)
      //   }
      // },
      // // 重置参数
      // _resetGetClassifyListParams() {
      //   classifyPage = 1
      //   this.classifyMore = true
      //   isLoading = false // loading-more
      //   this.$refs.homeBanner && this.$refs.homeBanner._resetIndex()
      // },
      // // tab切换
      // classifyChangeTab(index, id, e) {
      //   if (this.classifyStyles) {
      //     this.classifyStyles = ''
      //     classifyTabScrolling = true
      //     setTimeout(() => {
      //       classifyTabScrolling = false
      //     }, 100)
      //     wx.pageScrollTo({
      //       scrollTop: classifyScrollHeight - navigationBarHeight,
      //       duration: 0
      //     })
      //   }
      //   classifyTabIndex = index
      //   this._resetGetClassifyListParams()
      //   this._getClassifyList(false)
      // },
      // // tab切换
      // flashChangeTab(item, index) {
      //   flashTabIndex = index
      //   this._getFlashTabList(false)
      // },
      // 初始化地理位置
      _initLocation() {
        if (wx.getStorageSync('locationShow') * 1 === 3 || wx.getStorageSync('locationShow') * 1 === 2) {
        } else {
          let that = this
          wx.getLocation({
            async success(res) {
              wx.setStorageSync('locationData', res)
              wx.setStorageSync('locationShow', 1)
              that.locationStatus = 1
              // that.getLocationData()
            },
            fail(res) {
              wx.setStorageSync('locationShow', 3)
              wx.navigateTo({
                url: `/pages/open-location`
              })
            }
          })
        }
      },
      // 更新地理位置
      _refreshLocation() {
        this.locationStatus = wx.getStorageSync('locationShow')
        if (this.locationStatus * 1 === 3) {
          wx.navigateTo({
            url: `/pages/open-location`
          })
        }
      },
      // 获取地理位置
      getLocationData() {
        let data = wx.getStorageSync('locationData')
        API.Choiceness.getLocationDistance({
          longitude: data.longitude || 0,
          latitude: data.latitude || 0
        }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let msgStatus = wx.getStorageSync('msgStatus')
          if (msgStatus !== 4 && res.data.distance > 1000) {
          }
        })
      },
      // 获取团长的信息
      async _groupInfo(loading) {
        let res = await API.Choiceness.getGroupInfo(loading)
        if (loading) {
          this.$wechat.hideLoading()
        }
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
        }
        this.groupInfo = res.data
      },
      // 顶部背景颜色还原
      handleLoadBackground(e) {
        this.backgroundColor = ''
      },
      // 改变navigation状态的样式
      _changeNavigation(e) {
        let flag = e.scrollTop < this.navigationBarHeight
        let title = flag ? '赞播优鲜' : '赞播优鲜·' + this.socialName
        let styles = flag ? `background:#73C200;transition:none` : `background:#fff;transition:none`
        this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle(title)
        this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(styles)
        this.titleColor = flag ? `#ffffff` : `#000000`
        wx.setNavigationBarColor({
          frontColor: this.titleColor,
          backgroundColor: '#ffffff',
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
        return flag
      },
      // 初始化页面配置
      _initPageParams(options = {}) {
        if (options.scene) {
          let {shopId} = resolveQueryScene(options.scene)
          this.shopId = shopId
        } else {
          this.shopId = options.shopId
        }
        this.shopId && wx.setStorageSync('shopId', this.shopId)
      },
      // 初始化头部样式
      _initTopStyles() {
        this.backgroundHeight = 0.453 * SYSTEM_INFO.screenWidth + SYSTEM_INFO.statusBarHeight || 20
        this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(`background:#73C200;transition:none`)
        this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle('赞播优鲜')
        this.titleColor = `#ffffff`
      },
      // 获取模块信息
      async _getModuleInfo(loading) {
        try {
          let res = await API.FlashSale.getModuleInfo({page_name: 'index'}, loading)
          this.moduleArray = res.data.modules || []
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $color-flash-background=#FFE359
  $box-radius=4px
  $flash-width=24vw
  @import "~@designCommon"

  // 商品搜索
  .goods-search-wrapper
    height:50px
    background: red
    position:fixed
    left:0;
    right :0
    top: 0
    z-index:90
    opacity :0
  // 限时抢购-item
  .home-flash-item
    width :$flash-width
    height :100%
    .goods-wrapper
      width :$flash-width
      height :$flash-width
      position :relative
      -webkit-overflow-scrolling: touch
      .img-goods
        width :100%
        height :@width
        display :block
        overflow :auto
        border-radius :3px
      .img-label
        position :absolute
        left :0
        bottom:-1px
        width: 25.5px
        height:15.5px
    .bottom-wrapper
      position :relative
      .title-wrapper
        overflow :hidden
        .title
          padding-top :2px
          font-family: $font-family-regular
          font-size: 13px
          color: #111111
          no-wrap()
      .button-group-wrapper
        position :relative
        z-index :10
      .price-wrapper
        margin-top: -3px
        display :flex
        color: #FF8300
        font-family: $font-family-medium
        position :relative
        .price
          flex:1
          overflow :hidden
          display :flex
          .number
            font-size: 4.533333333333333vw
          .unit
            position :relative
            top:1.8vw
            margin-left :1px
            font-size :2.666666666666667vw
          .origin-price
            padding-left :1.0666666666666667vw
            font-family: $font-family-regular
            font-size: 2.666666666666667vw
            color: $color-text-assist
            line-height: @font-size
            text-decoration :line-through
            position :relative
            top:2.666666666666667vw
        .button
          position :absolute
          bottom :0
          right :1.5199999999999998vw
          width :10.666666666666668vw
          height :@width
          .button-img
            position :absolute
            bottom :0
            right :0
            width :6.14vw
            height :@width
  // 限时抢购
  .img
    width :100%
    height :100%
    display :block
    overflow :auto

  .home-flash-sale
    padding :0 2.666666666666667vw
    background: #fff
    border-bottom :10px solid @background
    position :relative
    .scroll-wrapper
      padding :9px
      background :$color-flash-background
      border-radius :0 0 $box-radius $box-radius
      .bottom-wrapper
        display: block
        width: 100%
        background: $color-white
        white-space: nowrap
        box-sizing: border-box
        transform: translate3d(0,0,0)
        position :relative
        border-radius :$box-radius $box-radius
        &.active
          display :none
        ::-webkit-scrollbar
          width: 0
          height: 0
          color: transparent
        .bottom-item-wrapper
          height :100%
          display: inline-flex
          position: relative
          box-sizing :border-box
          padding-top :8px
          padding-bottom :5px
          padding-left :7px
          .look-more
            padding-left :0
            .look-wrapper
              width :14.666666666666666vw
              height :100%
              layout()
              justify-content :center
              align-items :center
              .text
                font-family :$font-family-regular
                color: $color-text-sub
                font-size :13px
                width :@font-size
                letter-spacing :2px
                white-space :normal
                word-wrap: break-word
                word-break :break-all
              .more-icon
                margin-top :0.9333333333333335vw
                width :13px
                height:@width

    .top-wrapper
      height :45px
      background: #F7F9FA
      border-radius :$box-radius $box-radius 0 0
      padding :0 11.5px 0 10px
      layout(row,block,nowrap)
      align-items :center
      .title-img
        padding-right :3.733333333333334vw
        width :20vw
        height :4.933333333333334vw
      .more-wrapper
        flex: 1
        layout(row,block,nowrap)
        align-items :center
        justify-content :flex-end
        font-family: $font-family-regular
        font-size: 14px;
        color: #111111;
        .more-text
          padding-right :5px
        .more-img
          width:5.5px
          height :10.5px
      .tab-wrapper
        height :100%
        layout(row,block,nowrap)
        .tab-item-wrapper
          width :21.866666666666667vw
          height :100%
          layout(column,block,nowrap)
          justify-content :center
          align-items :center
          font-family: $font-family-medium
          color: #1D2023;
          border-radius :2px 2px 0 0
          transition :all 0.3s
          background :#F7F9FA
          &.active
            background :$color-flash-background
          .time
            font-size:16px
          .explain
            margin-top :-2px
            font-size :10px

  // 通知
  .notice
    height: 44px
    margin: 12px
    border-1px($color-line, 4px)
    display: flex
    padding: 0 10px
    box-sizing: border-box
    align-items: center

  .notice-img
    width: 27px
    height: 14px
    margin-right: 8px

  .notice-msg
    line-height: 1
    overflow: hidden
    white-space: nowrap
    width: 66.7vw
    position: relative
    display: flex
    .notice-content
      display: flex
      animation: move 13s linear infinite normal
    .notice-msg-item
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-14

  .notice-line
    color: #ccc
    margin-left: 6px
    line-height: 1
    font-size: 12px
    transform: translateY(-1px)

  .notice-look
    color: #FA7502
    font-family: $font-family-regular
    font-size: 14px
    white-space: nowrap
    line-height: 1
    margin-left: 3.6vw

  @keyframes move {
    0% {
      transform: translateX(0px)
    }
    100% {
      transform: translateX(-50%)
    }
  }

  // banner轮播图
  .home-banner
    height: 40vw
    box-sizing: border-box
    position: relative
    border-radius: 6px !important
    overflow: hidden !important
    .dot-wrapper
      position :absolute
      right :22px
      bottom :8px
      width :35px
      height :17.5px
      layout(row,block,nowrap)
      font-family: $font-family-regular
      font-size: 10px;
      color: #F1F5EB;
      .background
        fill-box(absolute)
        .img
          width :100%
          height:@width
          display :block
      .dot-line
        position :relative
        transform :scale(0.8)
        top:1px
      .dot
        position :relative
        width :17.5px
        height :@width
        text-align :center
        line-height :@height
    .banner
      width: 100vw
      height: 100%
      border-radius: 4px !important
      transform: translateY(0)
      overflow: hidden !important
      .banner-item
        width: 100%
        height: 100%
        position: relative
        border-radius: 4px !important
        transform: translateY(0)
        overflow: hidden !important
        layout(row)
        align-items: center
        .item-img
          width: 100%
          height: 100%
          display: block
          border-radius: 4px !important
          transform: translateY(0)
          overflow: hidden !important
          margin-left: 12px
          margin-right :12px

  // 页面结构
  .choiceness
    max-width: 100vw
    background: #73C200
    overflow-x: hidden
    position: relative
    .container
      position :relative
      min-height :86vh
      background :#fff
      .item-wrapper
        position :relative
      .top-background
        position: absolute
        left: 0
        top: 0
        width :100vw
        display: block


</style>
