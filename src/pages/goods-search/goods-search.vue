<template>
  <div class="goods-search">
    <navigation-bar title="赞播优鲜"></navigation-bar>
    <section class="search-wrapper">
      <div class="input-wrapper">
        <input type="text" @focus="handleFocus" @blur="handleBlur" v-model="goodsName">
      </div>
      <div class="btn" @click="handleSearch">搜索</div>
    </section>
    <div v-if="isShowHistory" class="history-wrapper" @click="handleSearch">历史记录</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'GOODS_SEARCH'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        isShowHistory: true,
        isFirstSearch: true,
        isFocus: false,
        goodsName: ''
      }
    },
    watch: {
      goodsName(pre, current) {
        if (this.isFirstSearch) return
        console.log(current.length)
        if (current.length > pre.length) {
          this.isShowHistory = current.length <= 1
        }
      }
    },
    methods: {
      handleFocus(e) {
        this.isFocus = true
      },
      handleBlur() {
        this.isShowHistory = !this.goodsName
      },
      handleSearch() {
        this.isShowHistory = false
        this.isFirstSearch = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .goods-search
    width: 100%
    .search-wrapper
      layout(block, block, nowrap)
      .input-wrapper
        flex: 1
        display :flex
        padding :0 20px
        align-items :center
        input
          background :#ccc
          height :20px
          width :90%
      .btn
        font-family :$font-family-regular
        font-size :12px
        width :30px
        height :60px
        line-height :@height
        text-align :center
</style>
