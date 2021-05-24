<template>
  <div class="home">
    <nav-bar class="nav-bar" ref="navBar">
      <template v-slot:center>图书之城</template>
    </nav-bar>
    <tab-control
      :titles="['畅销', '新书', '精选']"
      @tabClick="tabClick"
      class="tabControl"
      v-show="isTabFiexd"
      ref="tabControlFixed"
    />
    <scroll
      class="content"
      @scroll="contentScroll"
      @loadMore="loadMore"
      ref="scroll"
    >
      <home-swiper :banner="banner" />
      <home-recommed :recommends="recommed" @imageLoad="imageLoad" />
      <tab-control
        :titles="['畅销', '新书', '精选']"
        @tabClick="tabClick"
        class="tabControl"
        ref="tabControl"
      />
      <van-skeleton title avatar :row="3" :loading="loading">
        <goods-list :goods="showGoods" />
      </van-skeleton>
    </scroll>
    <back-top @click.native="backTop" v-show="showBackTop" />
  </div>
</template>

<script>
import { computed, onMounted, provide, reactive, readonly, ref } from "vue";
import { useRouter } from "vue-router";

import { getHomeData, getHomeGoods } from "network/home.js";

import NavBar from "components/common/navbar/NavBar.vue";
import Scroll from "components/common/scroll/Scroll.vue";
import TabControl from "components/content/tabcontrol/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList.vue";

import HomeSwiper from "./childComps/HomeSwiper.vue";
import HomeRecommed from "./childComps/HomeRecommed.vue";
import BackTop from "../../components/content/backtop/BackTop.vue";
export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommed,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  setup() {
    // 存放banner数据的数组
    let banner = ref([]);
    // 存放banner数据的数组
    let recommed = ref([]);
    // 存放商品列表数据模型
    const goods = reactive({
      sales: { page: 0, list: [] },
      new: { page: 1, list: [] },
      recommend: { page: 1, list: [] },
    });
    let currentType = ref("sales");
    // 使用路由对象
    // const router = useRouter();

    // 获取scroll组件对象
    let scroll = ref(null);
    const currentIndex = ref(0);
    // provide("index", readonly(currentIndex));
    const tabClick = function (index) {
      let types = ["sales", "new", "recommend"];
      currentType.value = types[index];
      currentIndex.value = index;
      // 解决导航栏不同步问题
      tabControlFixed.value.currentIndex = index;
      tabControl.value.currentIndex = index;
    };
    const getGoodsData = function (type) {
      let page = goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        goods[type].list.push(...res.goods.data);
        goods[type].page += 1;
        scroll.value && scroll.value.finishPullUp();
      });
    };
    let isTabFiexd = ref(false);
    let tabControlTop = ref(0);
    // 解决BUG better-scroll默认滑动距离44px导致页面刷新时tabControl存在问题
    let tabControl = ref(null);
    let tabControlFixed = ref(null);
    let navBar = ref(null);
    let showBackTop = ref(false);
    const imageLoad = () => {
      // console.log(isTabFiexd.value);
      // 计算出tabControl需要固定定位的值
      // tabControl自身两倍的高度+tabcontrol距离顶部的距离+导航的高度
      tabControlTop.value =
        tabControl.value.$el.offsetTop +
        tabControl.value.$el.offsetHeight * 2 +
        navBar.value.$el.offsetHeight;
      scroll.value.refresh();
    };
    const contentScroll = (position) => {
      if (tabControlTop.value != 0)
        isTabFiexd.value = -position.y >= tabControlTop.value;
      // console.log(scroll.value.finishPullUp);
      showBackTop.value = -position.y >= 500;
    };
    //
    const loadMore = () => {
      getGoodsData(currentType.value);
      // 重新计算scrollerHeight的值
      scroll.value.refresh();
    };
    // 返回顶部
    const backTop = () => {
      scroll.value.scrollTo(0, 0);
    };
    const loading = ref(true);
    onMounted(() => {
      getHomeData()
        .then((res) => {
          banner.value = res.slides;
          recommed.value = res.goods.data;
          categories.value = res.categories;
        })
        .catch((err) => {});
      getGoodsData("sales");
      getGoodsData("new");
      getGoodsData("recommend");
      loading.value = false;
    });

    // 展示的商品数据
    const showGoods = computed(() => {
      return goods[currentType.value].list;
    });

    return {
      // goBack,
      banner,
      recommed,
      tabClick,
      showGoods,
      scroll,
      contentScroll,
      imageLoad,
      isTabFiexd,
      tabControl,
      navBar,
      tabControlFixed,
      loadMore,
      backTop,
      showBackTop,
      loading,
    };
  },
};
</script>
<style lang="sass" scoped>
.home
  height: 100vh
  .nav-bar
    background-color: var(--color-tint)
    color: #fff
    img
      width: 25px
      margin-top: 9px
  .tabControl
    position: sticky
    top: 44px
    z-index: 9
  .content
    position: absolute
    top: 44px
    bottom: 49px
    left: 0
    right: 0
    overflow: hidden
</style>
