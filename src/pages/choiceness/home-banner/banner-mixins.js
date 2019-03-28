export default {
  data() {
    return {
      praiseIndex: 0,
      bannerInfo: {}
    }
  },
  methods: {
    bannerChangeHandle(index) {
      this.praiseIndex = index
    }
  }
}
