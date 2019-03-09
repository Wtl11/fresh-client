<template>
  <div class="recommend">
    <navigation-bar title="活动标题"></navigation-bar>
    <div class="content">
      <header class="header">
        <img class="img" mode="aspectFill" v-if="logoUrl" :src="logoUrl" alt="">
      </header>
      <section class="banner">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/active/pic-shop@2x.png'" class="img">
      </section>
      <section class="panel logo">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-logo@2x.png'" class="logo-img">
        <circle-link></circle-link>
      </section>
      <ul class="active-wrapper">
        <li v-for="(item, index) in dataArray" :key="index" class="panel goods-wrapper">
          <circle-link v-if="index !== dataArray.length - 1"></circle-link>
          <figure class="goods-img">
            <div class="wrapper">
              <img class="img" mode="aspectFill" v-if="logoUrl" :src="logoUrl" alt="">
            </div>
          </figure>
          <article class="goods-info">
            <p class="title">沙瓢的番茄，更适合炒蛋</p>
            <div class="button-group">
              <section class="price-wrapper">
                <p class="number">5.9</p>
                <p class="unit">元</p>
                <p class="origin">20.0元</p>
              </section>
              <section class="button-wrapper">
                <div class="b-left">{{btnLeftText}}</div>
                <div class="b-right"><p class="tri"><span class="tri-empty"></span></p><p class="trr"></p> 立即购买</div>
              </section>
            </div>
          </article>
        </li>
      </ul>
    </div>
    <!--<img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-logo@2x.png'" class="arrow-right">-->
    <!--<img v-if="imageUrl" :src="imageUrl + '/yx-image/active/pic-shop@2x.png'" class="arrow-right">-->
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CircleLink from './circle-link/circle-link'

  const PAGE_NAME = 'RECOMMEND'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        logoUrl: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/07/155196034883157.png',
        dataArray: new Array(9).fill(1)
      }
    },
    computed: {
      btnLeftText() {
        let number = this.dataArray.length
        return number > 1 ? `${number}选1` : '优惠'
      }
    },
    components: {
      NavigationBar,
      CircleLink
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $color-card-background = #F6FAF1
  $color-money-main = #FF8506
  @import "~@designCommon"
  .img
    width :100%
    height :100%
    font-size :0
    line-height :0
  .panel
    background: $color-card-background
    border-radius: 2.1333333333333333vw
    position :relative
    margin :0 5.333333333333334vw 2.666666666666667vw

  .recommend
    background-image: linear-gradient(180deg, #D1EB92 0%, #A6C829 12%)
    padding-bottom :2vw
    .content
      position :relative
      .header
        height :73.33333333333333vw
      .banner
        position :absolute
        top:63.6vw
        right :0
        left : 0
        height :15.733333333333333vw
        z-index :10
      .logo
        height :29.733333333333334vw
        display :flex
        align-items :center
        justify-content :center
        position :relative
        top:-1.3333333333333335vw
        .logo-img
          width :45.94666666666667vw
          height :15.893333333333334vw
      .active-wrapper
        .goods-wrapper
          height :113.33333333333333vw
          .goods-img
            width :100%
            height :0
            padding-top :100%
            position :relative
            .wrapper
              fill-box(absolute)
              background :$color-white
              border-radius :2.1333333333333333vw 2.1333333333333333vw 0 0
              overflow :hidden
              font-size :0
              line-height :0
          .goods-info
            padding : 0 4vw 0.5333333333333333vw 5.333333333333334vw
            .title
              padding :3.3333333333333335vw 0
              font-family: $font-family-medium
              font-size: 4.8vw
              line-height :4.266666666666667vw
              color: #343434
              no-wrap()
            .button-group
              display :flex
              align-items :center
              .price-wrapper
                flex: 1
                layout(row,block,nowrap)
                align-items :center
                height :6.666666666666667vw
                line-height :1
                .number
                  position :relative
                  font-family: DINAlternate-Bold
                  font-size: 8.266666666666666vw
                  color: $color-money-main
                .unit
                  position :relative
                  top: 1.6vw
                  margin-left :0.5333333333333333vw
                  font-family: $font-family-medium
                  font-size: 3.4666666666666663vw
                  color: $color-money-main
                .origin
                  position :relative
                  top: 1.866666666666667vw
                  text-decoration :line-through
                  margin-left :1.3333333333333335vw
                  opacity: 0.8
                  font-family: $font-family-regular
                  font-size: 3.733333333333334vw
                  color: #A0A0A0
              .button-wrapper
                box-sizing :border-box
                height :8vw
                width :38vw
                border: 1px solid $color-money-main
                border-radius: @height
                font-family: $font-family-medium
                font-size: 4.266666666666667vw
                position :relative
                layout(row,block,nowrap)
                line-height :7.733333333333333vw
                text-align :right
                .b-left
                  flex: 1
                  color: $color-money-main
                .b-right
                  width 24.266666666666666vw
                  background-color :$color-money-main
                  color:#fff
                  box-sizing :border-box
                  border-radius: 0 8vw 8vw 0
                  position :relative
                  padding-right :4vw
                  .tri
                    position absolute
                    top:0
                    left:0
                    bottom :1px
                    width :1.6vw
                    background :$color-card-background
                    transform :skew(-15deg)
                    .tri-empty
                      position absolute
                      height :1px
                      width :1.6vw
                      background :$color-card-background
                      transform :skew(-15deg)
                      bottom :0
                      right :0
                  .trr
                    position :absolute
                    top:0
                    left :0
                    height :50%
                    width :1.6vw
                    background :$color-card-background

</style>
