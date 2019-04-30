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
    },
    _checkBannerIsEmpty() {
      const content = ((this.bannerInfo) || {}).content_data || {}
      const list = content.list || []
      if (list.length === 0) {
        this.bannerIsShow = false
      }
      if (!list.every(val => val.image_url)) {
        this.bannerIsShow = false
      }
    }
  }
}
