<template>
  <div v-if="isShow" class="home-classify">
    <section class="tab-wrapper">
      <div v-if="tabList.length" class="place-holder"></div>
      <classify-tab
        id="scrollView-relative"
        :styles="styles"
        :tabList="tabList"
        :viewToItem="viewToItem"
        :tabIndex="tabIndex"
        @changeTab="changeTabHandle"
      ></classify-tab>
    </section>
    <div class="classify-wrapper">
      <block v-for="(item, index) in classifyArray" :key="index">
        <classify-item :item="item"></classify-item>
      </block>
    </div>
    <!--<classify-tab-->
      <!--v-if="styles"-->
      <!--:styles="styles"-->
      <!--id="scrollView-fixed"-->
      <!--:tabList="tabList"-->
      <!--:viewToItem="viewToItem"-->
      <!--:tabIndex="tabIndex"-->
      <!--@changeTab="changeTabHandle"-->
    <!--&gt;</classify-tab>-->
    <is-end v-if="!hasMore && !isShowEmpty"></is-end>
    <is-active-empty v-if="isShowEmpty"></is-active-empty>
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
      isShowTab: {
        type: Boolean,
        default: false
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
        default: ''
      },
      styles: {
        type: String,
        default: ''
      },
      tabIndex: {
        type: Number,
        default: 0
      },
      hasMore: {
        type: Boolean,
        default: true
      },
      isShowEmpty: {
        type: Boolean,
        default: false
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
    .tab-wrapper
      position :relative
      .place-holder
        height :86px
</style>
