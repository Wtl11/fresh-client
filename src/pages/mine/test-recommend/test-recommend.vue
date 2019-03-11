<template>
  <div v-if="!isHide" class="test-recommend">
    <ul>
      <li v-for="(item, index) in dataArray" :key="index" @click="navHandle(item)" style="padding:10px 0">
        <span>marketId:{{item.marketId}}</span><span>shopId:{{item.shopId}}</span>
      </li>
      <li>
        <div>
          自定义marketId:<input type="number" v-model="marketId" placeholder="自定义活动id">
        </div>
        <div>
          自定义shopId:<input type="number" v-model="shopId" placeholder="自定团长id">
        </div>
        <div @click="navHandle(null)">确定</div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  // import API from '@api'
  const COMPONENT_NAME = 'TEST_RECOMMEND'
  const isHide = process.env === 'production'
  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        isHide,
        marketId: 77,
        shopId: 7,
        dataArray: [
          {
            marketId: 72,
            shopId: 7
          },
          {
            marketId: 73,
            shopId: 7
          },
          {
            marketId: 74,
            shopId: 7
          }
        ]
      }
    },
    onLoad(options) {
      // API.Market.testShare().then((res) => {
      //   if (res.error !== this.$ERR_OK) {
      //     return
      //   }
      //   console.log(res)
      // })
    },
    methods: {
      navHandle(item) {
        item = item || this
        let {marketId, shopId} = item
        wx.navigateTo({url: `/pages/recommend?marketId=${marketId}&shopId=${shopId}`})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .test-recommend
    width: 100%
    padding-bottom :80px
</style>
