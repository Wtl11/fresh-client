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
        <li class="panel goods-wrapper">
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
                <div class="b-left">3选1</div>
                <div class="b-right">立即购买</div>
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
        logoUrl: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/07/155196034883157.png'
      }
    },
    components: {
      NavigationBar,
      CircleLink
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .img
    width :100%
    height :100%
  .panel
    background: #F6FAF1;
    border-radius: 8px;
    position :relative
    margin :0 20px 10px

  .recommend
    background-image: linear-gradient(-180deg, #D1EB92 0%, #A6C829 6%);
    padding-bottom :7.5px
    .content
      position :relative
      .header
        height :270px
      .banner
        position :absolute
        top:231px
        right :0
        left : 0
        height :59px
        z-index :10
      .logo
        height :111.5px
        display :flex
        align-items :center
        justify-content :center
        position :relative
        top:-5px
        .logo-img
          width :172.3px
          height :59.6px
      .active-wrapper
        .goods-wrapper
          height :425px
          .goods-img
            width :100%
            height :0
            padding-top :100%
            position :relative
            .wrapper
              fill-box(absolute)
              background :$color-white
              border-radius :8px 8px 0 0
              overflow :hidden
          .goods-info
            padding :0 15px 0 20px
            .title
              padding :14.5px 0 12.5px
              font-family: $font-family-medium
              font-size: 18px;
              line-height :16px
              color: #343434;
              no-wrap()
            .button-group
              padding-bottom :17px
              display :flex
              align-items :center
              .price-wrapper
                flex: 1
                overflow :hidden
                layout(row,block,nowrap)
                align-items :center
                .number
                  font-family: $font-family-bold
                  font-size: 31px;
                  color: #FF8506;
                .unit
                  position :relative
                  top: 5px
                  margin-left :2px
                  font-family: $font-family-medium
                  font-size: 13px;
                  color: #FF8506;
                .origin
                  position :relative
                  top:6px
                  text-decoration :line-through
                  margin-left :5px
                  opacity: 0.8;
                  font-family: $font-family-regular
                  font-size: 14px;
                  color: #A0A0A0;
              .button-wrapper
                box-sizing :border-box
                height :30px
                width :133px
                border: 1px solid #FF8506;
                border-radius: 30px
                font-family: $font-family-medium
                font-size: 16px;
                position :relative
                .b-left
                  color: #FF8506;
                  display :flex
                  align-items :center
                  justify-content :center
                  width :61px
                .b-right
                  position:absolute
                  right :0
                  top:0
                  background-color :#FF8506
                  color:#fff
                  width :91px
                  height :30px
                  border-radius: 0px 30px 30px 0px;
</style>
