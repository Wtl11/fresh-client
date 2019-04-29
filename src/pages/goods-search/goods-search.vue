<template>
  <div class="goods-search">
    <navigation-bar title="赞播优鲜"></navigation-bar>
    <section class="search-wrapper">
      <div class="input-wrapper">
        <img class="search-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-search@2x.png'">
        <input
          type="text"
          placeholder="请输入商品名称"
          placeholder-class="input-p"
          @focus="handleFocus"
          @blur="handleBlur"
          @confirm="handleConfirm"
          v-model="goodsNameInput"
        >
        <figure v-if="showClearGoodsNameBtn" class="close" @click.stop="handleClearGoodsName">
          <img class="close-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-delsr@2x.png'">
        </figure>
      </div>
      <div class="btn" @click.stop="handleSearch('')">搜索</div>
    </section>
    <section v-if="isShowHistory" class="history-wrapper">
      <div class="title-wrapper">
        <p>历史记录</p>
        <img
          class="delete-img"
          mode="aspectFit"
          v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon_delete@2x.png'"
          @click="handleClearHistoryArr"
        >
      </div>
      <ul class="list-wrapper">
        <li v-for="(item, index) in historyArray" :key="index" class="item-wrapper" @click="handleSearch(item)">{{item}}</li>
      </ul>
    </section>
    <section v-if="!isShowHistory">
      <div class="classify-wrapper">
        <block v-for="(item, index) in classifyArray" :key="index">
          <classify-item :item="item"></classify-item>
        </block>
      </div>
      <is-end v-if="!classifyMore && !classifyShowEmpty"></is-end>
      <loading-more v-else-if="!classifyShowEmpty"></loading-more>
      <div v-if="classifyShowEmpty" class="empty-wrapper">
        <is-active-empty></is-active-empty>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ClassifyItem from './home-classify-item/home-classify-item'
  import IsEnd from '@components/is-end/is-end'
  import isActiveEmpty from '@components/is-active-empty/is-active-empty'
  import LoadingMore from '@components/loading-more/loading-more'
  import API from '@api'

  const PAGE_NAME = 'GOODS_SEARCH'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ClassifyItem,
      IsEnd,
      isActiveEmpty,
      LoadingMore
    },
    data() {
      return {
        isShowHistory: true,
        goodsName: '',
        historyArray: [],
        classifyPage: 1,
        classifyMore: true,
        classifyArray: [],
        classifyShowEmpty: false
      }
    },
    computed: {
      showClearGoodsNameBtn() {
        return this.goodsName
      },
      goodsNameInput: {
        get() {
          return this.goodsName
        },
        set(val) {
          if (!val) {
            this.isShowHistory = true
          }
          this.goodsName = val
          return val
        }
      }
    },
    watch: {
      isShowHistory(val) {
        if (val) {
          this.classifyArray = []
        }
      }
    },
    onLoad() {
      let arr = wx.getStorageSync('historyArray') || []
      this.historyArray = arr
    },
    onReachBottom() {
      if (this.isLoading) return
      this.classifyPage++
      this._getClassifyList(false)
    },
    methods: {
      handleFocus(e) {
        if (!this.goodsName) {
          this.isShowHistory = true
        }
      },
      handleBlur() {
      },
      handleSearch(goodsName) {
        if (goodsName) {
          this.goodsName = goodsName
        }
        if (!this.goodsName) {
          this.$wechat.showToast('商品名称不能为空')
          return
        }
        this.isShowHistory = false
        let arr = this.historyArray
        arr.push(this.goodsName)
        this.historyArray = [...new Set(arr)]
        wx.setStorageSync('historyArray', this.historyArray)
        this.resetReqParams()
        this._getClassifyList()
      },
      handleClearGoodsName() {
        this.goodsName = ''
      },
      handleClearHistoryArr() {
        this.historyArray = []
        wx.removeStorageSync('historyArray')
      },
      handleConfirm() {
        this.handleSearch('')
      },
      // 获取商品分类列表
      async _getClassifyList(loading = true) {
        if (!this.classifyMore) return
        try {
          const data = {
            keyword: this.goodsName,
            page: this.classifyPage
          }
          this.isLoading = true
          let res = await API.GoodsSearch.getList(data, loading)
          if (res.meta.current_page === 1) {
            this.classifyArray = res.data
            this.classifyShowEmpty = res.meta.total === 0
          } else {
            res.data.forEach((item) => {
              this.classifyArray.push(item)
            })
          }
          this.classifyMore = res.meta.current_page < res.meta.last_page
          wx.nextTick(() => {
            this.isLoading = false
          })
        } catch (e) {
          console.warn(e)
          this.isLoading = false
        }
      },
      resetReqParams() {
        this.classifyMore = true
        this.classifyPage = 1
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .input-p
    font-family: $font-family-regular
    font-size: 15px;
    color: #B7B7B7;

  .goods-search
    width: 100%
    .search-wrapper
      font-family :$font-family-regular
      padding :0 12px
      layout(block, block, nowrap)
      align-items :center
      z-index :50
      .input-wrapper
        flex: 1
        height :32px
        display :flex
        align-items :center
        background :#F0F0F0
        padding : 0 13px 0 15px
        border-radius :@height
        position :relative
        .close
          position :absolute
          right :0
          height :32px
          width :@height
          display :flex
          align-items :center
          justify-content :flex-end
          .close-img
            width :13px
            height @width
            padding-right :13px
        .search-img
          width :14px
          height :13.5px
        input
          flex: 1
          height :20px
          padding : 0 15px 0 8px
          font-size :15px
          line-height :@height
      .btn
        font-size :15px
        padding-left :14px
    .history-wrapper
      padding :25px 12px
      font-family: $font-family-regular
      font-size: 13px;
      color: $color-text-main
      line-height: 1
      .title-wrapper
        display :flex
        align-items :center
        justify-content :space-between
        font-family: $font-family-medium
        font-size: 16px
        .delete-img
          width :16px
          height :17.5px
          display :block
      .list-wrapper
        layout(row,block)
        padding :15px 0
        height :210px
        box-sizing :border-box
        overflow :hidden
        .item-wrapper
          margin-bottom :10px
          margin-right :10px
          padding :0 14px
          box-sizing :border-box
          height :30px
          border-1px(#DBDBDB, @height)
          background: #FFFFFF
          line-height :@height
          max-width :120px
          no-wrap()

    .classify-wrapper
      margin-top :15px
      background :#fff
      position :relative
      border-top-1px()

    .empty-wrapper
      padding-top :82px
</style>
