<template>
  <div class="home-classify">
    <classify-tab
      id="scrollView-relative"
      :tabList="tabList"
      :viewToItem="viewToItem"
      :tabIndex="tabIndex"
      @changeTab="changeTabHandle"
    ></classify-tab>
    <div class="classify-wrapper">
      <block v-for="(item, index) in classifyArray" :key="index">
        <classify-item :item="item"></classify-item>
      </block>
    </div>
    <classify-tab
      v-if="isShow"
      :styles="styles"
      id="scrollView-fixed"
      :tabList="tabList"
      :viewToItem="viewToItem"
      :tabIndex="tabIndex"
      @changeTab="changeTabHandle"
    ></classify-tab>
    <is-end></is-end>
    <is-active-empty></is-active-empty>
  </div>
</template>

<script type="text/ecmascript-6">
  // import API from '@api'
  import ClassifyItem from './home-classify-item/home-classify-item'
  import ClassifyTab from './home-classify-tab/home-classify-tab'
  import IsEnd from '@components/is-end/is-end'
  import isActiveEmpty from '@components/is-active-empty/is-active-empty'

  const COMPONENT_NAME = 'HOME_CLASSIFY'

  export default {
    name: COMPONENT_NAME,
    components: {
      ClassifyItem,
      ClassifyTab,
      IsEnd,
      isActiveEmpty
    },
    props: {
      isShow: {
        type: Boolean,
        default: true
      },
      tabList: {
        type: Array,
        default: () => []
      },
      classifyArray: {
        type: Array,
        default: () => []
      },
      viewToItem: {
        type: String,
        default: 'item0'
      },
      styles: {
        type: String,
        default: ''
      },
      tabIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      changeTabHandle(index, id, e) {
        this.$emit('changeTab', index, id, e)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .home-classify
    width: 100%
    background :#fff

</style>
