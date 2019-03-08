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
    name: COMPONENT_NAME,
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .circle-link
    position :absolute
    right :0
    left :0
    bottom :-20px
    padding :0 55px
    display :flex
    justify-content :space-between
    align-items :center
    .link
      height :23.5px
      width :5px
      z-index :3
      display :flex
      flex-direction :column
      justify-content :space-between
      position :relative
      .circle
        row-center()
        width :7px
        height :@width
        border-radius :100%
        background :#97B923
        &.top
          top:0
          margin-top :-3px
        &.bottom
          bottom :0
          margin-bottom :-3px
      .line
        fill-box(absolute)
        background-image: linear-gradient(-180deg, #DDDDDD 3%, #EEEEEE 53%, #D8D8D8 100%);
        border-radius: 5.5px;
        z-index :2
</style>
