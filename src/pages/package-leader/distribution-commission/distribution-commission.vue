<template>
  <div class="delivery-order">
    <navigation-bar title="分销佣金"></navigation-bar>
   <scroll-view v-if="list.length" :style="{height:scrollHeight + 'px'}" :lower-threshold="50" @scrolltolower="addMore" scroll-y class="scroll">
    <ul class="table-header">
      <div class="table-row">
        <li v-for="item in listHeader" :key="item.key" :class="item.class">{{item.name}}</li>
      </div>
    </ul>
     <ul class="table-body">
       <li v-for="(row,index) in list" :key="index" class="table-row">
         <div v-for="(item,idx) in listHeader" :key="idx" :class="item.class">{{row[item.key]}}{{item.after || ''}}</div>
       </li>
     </ul>
   </scroll-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'DISTRIBUTION_COMMISSION'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        listHeader: [{
          name: '团长名字',
          key: 'name',
          class: 'name row-item'
        }, {
          name: '待结算金额',
          key: 'not_settlement_money',
          class: 'money row-item',
          after: '元'
        }, {
          name: '已结算金额',
          key: 'settlement_money',
          class: 'money row-item',
          after: '元'

        }],
        list: [],
        scrollHeight: 500,
        params: {
          page: 1,
          limit: 1
        },
        last_page: 1
      }
    },
    async onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.scrollHeight = res.screenHeight - res.statusBarHeight - 44
    },
    onShow() {
      this._getList()
      console.log(99)
    },
    methods: {
      addMore() {
        if (this.params.page >= this.last_page || this.loading) return false
        this.params.page++
        this._getList()
      },
      _getList() {
        this.loading = true
        API.Leader.getDistributionCommissionList(this.params).then(res => {
          this.$wechat.hideLoading()
          if (this.params.page === 1) this.list = []
          this.list = [...this.list, ...res.data]
          this.last_page = res.meta.last_page
          this.loading = false
        })
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"
  .scroll
     height: 93px
     width: 100vw
     z-index: 99
     display: block
     white-space: nowrap
     box-sizing: border-box
     background: $color-white
    .table-header
      background:#FAFAFA
      color:#808080
      font-size:$font-size-14
      height:45px
      line-height:45px
      padding:0px 12px
      border-top-1px()
      border-bottom-1px()
    .table-body
      padding:0px 12px
      .table-row
         font-size: $font-size-15
         color: #1D2023
         line-height: 54px
         height:54px
         border-bottom-1px( #E6E6E6)
 .table-row
      display flex
      padding:0px 12px
      .row-item
        flex:1
</style>
