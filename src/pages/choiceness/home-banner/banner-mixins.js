export default {
  data() {
    return {
      praiseIndex: undefined,
      bannerInfo: undefined,
      bannerIsShow: undefined
    }
  },
  methods: {
    bannerChangeHandle(index) {
      this.praiseIndex = index
    }
  }
}
