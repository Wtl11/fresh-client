<template>
  <div class="new-guidelines">
    <section v-if="top" class="top-tip" :style="{top: top + 'px'}">添加「我的小程序」团购更方便<p class="triangle"></p></section>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'NEW_GUIDELINES'

  export default {
    name: COMPONENT_NAME,
    props: {
      navigationBar: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        top: 0
      }
    },
    watch: {
      navigationBar(val) {
        console.log(val)
        if (val) {
          this.top = val + 3
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .new-guidelines

  .top-tip
    position :fixed
    width :210px
    height :29px
    right :7px
    background: #FFFFFF;
    border-radius: 30px
    z-index :555
    font-family: $font-family-regular
    font-size: 13px;
    color: #3F454B;
    line-height :@height
    text-align: center;
    .triangle
      col-center()
      width: 0
      height: 0
      border: 5px solid #FFFFFF;
      border-left: 5px solid transparent
      border-bottom: 5px solid transparent
      border-right: 5px solid transparent
      right: -9.8px
      z-index :3
</style>
