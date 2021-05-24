<template>
  <div class="swiper">
    <van-swipe :autoplay="3000" indicator-color="#42bBaa">
      <van-swipe-item v-for="(slide, index) in banner" :key="index">
        <img v-lazy="slide.img_url" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  props: {
    banner: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup() {},
};
</script>
<style lang="scss" scoped>
.swiper {
  margin-top: 44px;
  text-align: center;
}
img {
  width: 100%;
}
img[lazy="loading"] {
  width: 30px;
  height: 30px;
  line-height: 160px;
}
</style>