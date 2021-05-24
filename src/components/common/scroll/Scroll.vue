<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
// 导入插件
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
import ObserveDOM from "@better-scroll/observe-dom";
import ObserveImage from "@better-scroll/observe-image";
import MouseWheel from "@better-scroll/mouse-wheel";
import { nextTick, onMounted, reactive } from "vue";

// 安装插件
BScroll.use(Pullup);
BScroll.use(ObserveDOM);
BScroll.use(ObserveImage);
BScroll.use(MouseWheel);

export default {
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    let scroll = reactive({});
    onMounted(() => {
      nextTick(() => {
        scroll = new BScroll(document.querySelector(".wrapper"), {
          observeDOM: true,
          mouseWheel: true,
          probeType: props.probeType,
          click: true,
          pullUpLoad: props.pullUpLoad,
        });
        scroll.on("scroll", (position) => {
          emit("scroll", position);
        });
        scroll.on("pullingUp", () => {
          emit("loadMore");
        });
      });
    });
    const scrollTo = (x, y, time = 300) => {
      scroll && scroll.scrollTo(x, y, time);
    };
    // 实现重新计算wrapper的高度scrollerHight
    const refresh = () => {
      scroll && scroll.refresh();
    };
    const finishPullUp = () => {
      scroll && scroll.finishPullUp();
    };
    const getScrollY = () => {
      return scroll.y;
    };
    return {
      refresh,
      finishPullUp,
      getScrollY,
      scrollTo,
    };
  },
};
</script>
<style scoped>
</style>
