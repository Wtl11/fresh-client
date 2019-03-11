<template>
  <article class="circle-link">
    <div class="link">
      <em class="circle top"></em>
      <em class="circle bottom"></em>
      <p class="line"></p>
    </div>
    <div class="link">
      <em class="circle top"></em>
      <em class="circle bottom"></em>
      <p class="line"></p>
    </div>
  </article>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'CIRCLE_LINK'

  export default {
    name: COMPONENT_NAME
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .circle-link
    position :absolute
    right :0
    left :0
    bottom :-4.333333333333334vw
    padding :0 14.666666666666666vw
    display :flex
    justify-content :space-between
    align-items :center
    .link
      height :6.266666666666667vw
      width :1.3333333333333335vw
      z-index :3
      display :flex
      flex-direction :column
      justify-content :space-between
      position :relative
      .circle
        row-center()
        width :1.866666666666667vw
        height :@width
        border-radius :100%
        background :#A6C829
        &.top
          top:0
          margin-top :-0.8vw
        &.bottom
          bottom :0
          margin-bottom :-0.8vw
      .line
        fill-box(absolute)
        background-image: linear-gradient(-180deg, #DDDDDD 3%, #EEEEEE 53%, #D8D8D8 100%);
        border-radius: 1.4666666666666668vw
        z-index :2
</style>
