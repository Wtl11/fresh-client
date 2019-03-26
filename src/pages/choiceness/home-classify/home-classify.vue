<template>
  <div class="home-classify">
    <scroll-view
      class="scroll-view2"
      :style="{top: statusBarHeight + 44 + 'px'}"
      v-if="tabList1.length"
      id="scrollView"
      :scroll-into-view="viewToItem" scroll-x
    >
      <div
        v-for="(item, index) in tabList1"
        :class="tabIndex === index ? 'item-active'  : ''"
        :key="index"
        class="item"
        :id="'item'+index"
        @click="_changeTab(index, item.id, $event)"
      >
        {{item.name}}
        <div class="item-under-line">
          <div class="line" :class="'corp-' + corpName + '-bg'"></div>
        </div>
      </div>
    </scroll-view>
    <nav class="classify-wrapper">
      <block v-for="(item, index) in classifyArray" :key="index">
        <classify-item :item="item"></classify-item>
      </block>
    </nav>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import ClassifyItem from './home-classify-item/home-classify-item'

  const COMPONENT_NAME = 'HOME_CLASSIFY'

  export default {
    name: COMPONENT_NAME,
    components: {
      ClassifyItem
    },
    data() {
      return {
        tabList: [],
        tabList1: [],
        width: 0,
        move: 0,
        tabIndex: 0,
        viewToItem: 'item0',
        statusBarHeight: 20,
        classifyId: null,
        classifyList: [],
        classifyPage: 1,
        classifyMore: false,
        boxTransition: '',
        classifyArray: []
      }
    },
    onLoad(options) {
      let res = this.$wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.classifyId = options.id || 88
      this.getCategoryData(true)
    },
    onReachBottom() {
      // this.getMoreCategoryList(this.classifyId, this.tabIndex)
    },
    methods: {
      getCategoryData(isLoad = false) {
        API.Choiceness.getClassifyCategory().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.tabList1 = res.data
          let length = res.data.length
          for (var i = 0; i < length; i++) {
            this.classifyList.push([])
          }
          res.data.forEach((item, index) => {
            if (item.id * 1 === this.classifyId * 1) {
              this.tabIndex = index
              if (isLoad) {
                setTimeout(() => {
                  this.boxTransition = 'all .3s'
                }, 50)
              }
              if (index > 3) {
                this.viewToItem = `item${index}`
              } else {
                this.viewToItem = `item0`
              }
            }
          })
          this.getCategoryList(this.classifyId, this.tabIndex)
        })
      },
      getCategoryList(id, index) {
        this.classifyPage = 1
        this.classifyMore = false
        API.Choiceness.getClassifyList({goods_category_id: id, limit: 10, page: this.classifyPage}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.classifyList[index] = res.data
          this.classifyArray = res.data
          console.log(res.data)
          this._isUpList(res)
        })
      },
      _isUpList(res) {
        this.classifyPage++
        if (this.classifyList[this.tabIndex].length >= res.meta.total * 1) {
          this.classifyMore = true
        }
      },
      async _changeTab(index, id, e) {
        if (this.tabIndex * 1 === index * 1) return
        let number = index * 1 === 0 ? 1 : index
        if (this.tabIndex > index) {
          if (index <= 3) {
            number = 0
          } else {
            number = index
          }
        } else if (this.tabIndex < index) {
          if (index <= 3) {
            number = 0
          } else {
            number = index
          }
        }
        this.viewToItem = `item${number}`
        this.tabIndex = index
        this.move = e.target.offsetLeft
        this.classifyId = id
        this.getCategoryList(this.classifyId, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .home-classify
    width: 100%
    background :#fff

  .scroll-view2
    display: block
    height: 40px
    width: 100vw
    background: $color-white
    box-shadow: 0 1px 8px 0 rgba(55, 75, 99, 0.04)
    white-space: nowrap
    box-sizing: border-box
    transform: translateX(0)
    transition: all 0.3s
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      height: 100%
      line-height: 40px
      white-space: nowrap
      padding: 0 12.5px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
      /*transition: all 0.3s*/
      min-width: 66px
      box-sizing: border-box
      transform-origin: 50%
    .item-active
      font-family: $font-family-medium
      font-size: $font-size-16
      .item-under-line
        position: absolute
        width: 100%
        height: 3px
        left: 0
        bottom: 0
        .line
          width: 30px
          height: 3px
          margin: 0 auto
          border-radius: 3px

  .classify-wrapper
    height :100vh
</style>
