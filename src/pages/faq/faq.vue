<template>
  <div class="faq">
    <navigation-bar title="常见问题"></navigation-bar>
    <ul class="wrapper">
      <li v-for="(item,index) in dataArray" :key="index" class="item-wrapper" @click="handleChoose(item, index)">
        <div class="question">
          <p class="ques">{{item.question}}</p>
<!--          <img class="icon" :class="{'rotate': show(index)}" src="./icon-pressed_down@2x.png" alt="">-->
          <img class="icon" :class="{'rotate': item.isChecked}" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-pressed_down@2x.png'">
        </div>
        <p v-if="item.isChecked" class="answer">{{item.answer}}</p>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'FAQ'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        dataArray: [
          {
            question: `Q1：什么时候能提货？`,
            answer: `当天下午23:00前下单，当天发货次日配送至团长处；当天下午23:00后下单，次日发货，具体到货时间以群内团长通知为准`,
            isChecked: false
          },
          {
            question: `Q2：赞播优鲜售后处理原则？`,
            answer: `允许无理由退货，直接联系与团长沟通具体问题，由团长发起售后处理`,
            isChecked: false
          },
          {
            question: `Q3：收货后，发现商品问题如何处理？`,
            answer: `如果你已提货，将商品送回团长处，与团长沟通具体问题，由团长发起售后处理`,
            isChecked: false
          },
          {
            question: `Q4：怎么申请售后？`,
            answer: `如果你购买的商品有任何问题，请联系团长进行退款退货`,
            isChecked: false
          },
          {
            question: `Q5：如何找到在线客服？`,
            answer: `通过社区微信群添加赞播优鲜客服的微信号`,
            isChecked: false
          },
          {
            question: `Q6：申请售后，多久可以收到退款？`,
            answer: `直接联系团长沟通具体问题，由团长现场发微信红包退款`,
            isChecked: false
          },
          {
            question: `Q7：未收到货怎么办？`,
            answer: `请联系团长核实未到货原因，如果缺货原因导致，需要跟团长核实是否可补货，如无法补货，由团长发起售后，现场发微信红包退款`,
            isChecked: false
          },
          {
            question: `Q8：我想做团长/供应商，有什么要求？`,
            answer: `你可以通过小程序点击“我的”——“团长招募/供应商招募/加盟商招募”的链接进行申请，填写相关信息后提交申请，我们会及时与你取得联系，请耐心等待。`,
            isChecked: false
          }
        ]
        // showArray: []
      }
    },
    methods: {
      handleChoose(item, index) {
        // this.showIndex = this.showIndex === index ? -1 : index
        // const idx = this.showArray.findIndex(val => val === index)
        // if (idx === -1) {
        //   this.showArray.push(index)
        // } else {
        //   this.showArray.splice(idx, 1)
        // }
        item.isChecked = !item.isChecked
      }
      // show(index) {
      //   return this.showArray.some(val => val === index)
      // }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .faq
    background :#f5f5f5
    min-height :100vh
    .wrapper
      padding :12px 12px 17px
      .item-wrapper
        background: #FFFFFF;
        box-shadow: 0 4px 30px 0 rgba(17,17,17,0.06);
        border-radius: 8px;
        margin-bottom :10px
        padding :0 15px
        .question
          font-family: PingFangSC-Medium;
          font-size: 15px;
          color: #111111;
          letter-spacing: 0;
          line-height: 1.6
          layout(row,block,nowrap)
          align-items :center
          .ques
            flex: 1
            padding :20px 0
          .icon
            margin-left :10px
            width :12px
            height :6.5px
            transform-origin :center center
            transform :rotate(0deg)
            transition :transform 0.3s
            &.rotate
              transform :rotate(180deg)
        .answer
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #808080
          line-height: 1.6
          padding-bottom :20px
</style>
