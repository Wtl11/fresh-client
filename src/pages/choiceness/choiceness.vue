<template>
  <div class="choiceness">
    <div class="choiceness-top">
      <div class="group-info">
        <div class="info-box">
          <div class="info-box-top">11</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'CHOICENESS'

  export default {
    name: PAGE_NAME,
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .choiceness-top
    position: relative
    padding-top: 17vw
    .group-info
      padding: 0 3.2vw
      box-sizing: border-box
      .info-box
        layout(row)
        align-items: center
        justify-content: center
        height: 96px
        background: #fff
        border-radius: 6px
        box-shadow: 0 3px 10px 0 rgba(17,17,17,0.06)
        .info-box-top
          layout(row)
          align-items: center
  .choiceness
    width: 100%
</style>
