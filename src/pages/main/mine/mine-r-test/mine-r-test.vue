<template>
  <div class="mine-r-test">
    <div class="item">
      <p class="text">员工id</p><input type="number" v-model="employeeId" placeholder="请输入">
    </div>
    <div class="item">
      <p class="text">团长id</p><input type="number" v-model="shopId" placeholder="请输入">
    </div>
    <div class="item">
      <p class="text">活动id</p><input type="number" v-model="marketId" placeholder="请输入">
    </div>
    <div class="item">
      <button class="btn" @click="submit">确定</button>
      <button class="btn" @click="clear">清空</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'MINE_R_TEST'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        employeeId: '',
        shopId: '',
        marketId: ''
      }
    },
    methods: {
      submit() {
        const {employeeId, shopId, marketId} = this
        const url = `${this.$routes.main.RECOMMEND}?employeeId=${employeeId}&shopId=${shopId}&marketId=${marketId}`
        wx.navigateTo({url})
      },
      clear() {
        this.employeeId = ''
        this.shopId = ''
        this.marketId = ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .mine-r-test
    width: 100%
    .item
      display :flex
      align-items :center
      .text
        padding-right :10px
      .btn

        width :60px
        height :30px
        border :1px solid $color-line
        margin :10px
        line-height :@height
        text-align :center
</style>
