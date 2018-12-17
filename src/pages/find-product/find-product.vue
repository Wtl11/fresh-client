<template>
  <div class="find-product">
    <navigation-bar :title="title"></navigation-bar>
    <div class="product-box">
      <order-item :isShowExamine="false" :orderList="productList" @dealOrder="_showDialog"></order-item>
    </div>
    <div class="noting" v-if="showMore">
      <div class="noting-img"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
      <div class="txt">空空如也</div>
    </div>
    <div class="bulk-pickup">
      <p class="bulk-pickup-text">共3笔订单，3件商品</p>
      <p class="bulk-pickup-btn" @click="_showDialog">批量提货</p>
    </div>
    <dialog-model ref="dialog" @confirm="_confirmDelivery"></dialog-model>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import OrderItem from '@components/order-item/order-item'
  import API from '../../api'
  import DialogModel from '@components/dialog-model/dialog-model'

  const PAGE_NAME = 'FIND_PRODUCT'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        title: '',
        id: null,
        productList: [],
        showMore: false,
        idsAll: [],
        ids: []
      }
    },
    async onLoad(option) {
      this.id = option.id || null
      await this._getProduct()
    },
    methods: {
      // 获取产品列表
      async _getProduct(loading = true) {
        let res = await API.Leader.deliveryOrder({customer_id: this.id}, loading)
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.showMore = true
          this.productList = []
          this.title = ''
          this.idsAll = []
          return
        }
        this.showMore = !res.data.length
        this.productList = this._infoList(res.data)
        this.title = this.productList[0].nickname
        this.idsAll = res.ids
      },
      _infoList(arr) {
        arr = arr.map((item) => {
          item.btn_text = item.delivery_status === 0 ? '确认提货' : '已提货'
          item.disable = item.delivery_status
          item.isShowBtn = true
          return item
        })
        return arr
      },
      // 确认提货
      async _confirmDelivery() {
        let res = await API.Leader.delivery({ids: this.ids})
        this.$wechat.showToast(res.message)
        if (res.error === this.$ERR_OK) {
          setTimeout(async () => {
            await this._getProduct(false)
          }, 500)
        }
      },
      _showDialog(index, item) {
        this.ids = []
        this.$refs.dialog.show({msg: '确定已经提货？'})
        if (typeof index !== 'number') {
          this.ids = this.ids.concat(this.idsAll)
          return
        }
        this.ids = [item.id]
      }
    },
    components: {
      NavigationBar,
      OrderItem,
      DialogModel
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .find-product
    padding-bottom: 55px
    background: $color-background
    box-sizing: border-box
    min-height: 100vh

  .product-box
    box-sizing: border-box
    background: $color-background
    padding-top: 10px

  .bulk-pickup
    position: fixed
    bottom: 0
    left: 0
    width: 100vw
    display: flex
    align-items: center
    font-size: $font-size-14
    color: $color-text-main
    font-family: $font-family-regular
    box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.03)
    height: 55px
    justify-content: flex-end
    background: $color-white
    box-sizing: border-box
    padding: 0 12px
    .bulk-pickup-btn
      border-radius: 15px
      background: $color-main
      margin-left: 10px
      padding: 0 12px
      line-height: 30px
      color: $color-white
      height: 30px
      font-size: $font-size-14
      &:active
        color: #E1F2C9
        background: #9DD44C

  .noting
    text-align: center
    padding-top: 106px
    .noting-img
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
