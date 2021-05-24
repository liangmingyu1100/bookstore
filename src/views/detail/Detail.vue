<template>
  <div class="detail">
    <nav-bar class="nav-bar">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt="" @click="goBack"
      /></template>
      <template v-slot:center>商品详情</template>
    </nav-bar>
    <scroll class="content">
      <detail-goods-info :goods-info="showDetail" :recommend="showGoods" />
    </scroll>
    <div class="bottom-bar">
      <van-action-bar>
        <van-action-bar-icon icon="chat-o" text="客服" />
        <van-action-bar-icon
          icon="cart-o"
          text="购物车"
          :badge="$store.state.cartCount"
          @click="skipToCart"
        />
        <van-action-bar-icon icon="shop-o" text="店铺" />
        <van-action-bar-button
          type="warning"
          text="加入购物车"
          @click="addToCart"
        />
        <van-action-bar-button type="danger" text="立即购买" 
        @click="skipToCart"/>
      </van-action-bar>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";

import Scroll from "components/common/scroll/Scroll.vue";
import NavBar from "components/common/navbar/NavBar.vue";

import { addCart } from "network/cart.js";
import { getDetailData } from "network/detail.js";
import { Toast } from "vant";
import { useStore } from "vuex";
export default {
  name: "Detail",
  components: {
    NavBar,
    DetailGoodsInfo,
    Scroll,
  },
  setup() {
    // 使用路由对象
    const router = useRouter();
    const route = useRoute();
    // 获取商品id
    const goodsId = ref(0);
    const book = reactive({
      detail: {}, //存放书籍的详细信息
      like_goods: [], //存放相似书籍的商品信息
    });

    onMounted(() => {
      goodsId.value = route.query.id;
      getDetailData(goodsId.value).then((res) => {
        book.detail = res.goods;
        book.like_goods = res.like_goods;
        // console.log(book.detail);
        // console.log(book.like_goods);
      });
    });
    const goBack = function () {
      // 返回到上一次路由
      router.go(-1);
    };
    const showGoods = computed(() => {
      return book.like_goods;
    });
    const showDetail = computed(() => {
      return book.detail;
    });
    const store = useStore();
    const addToCart = () => {
      addCart(goodsId.value).then((res) => {
        if ((res.status == 204) | (res.status == 201)) {
          Toast.success("成功加入购物车");
          store.dispatch("updateCart");
        }
      });
    };

    // 点击购物车图标 跳转购物车页面
    const skipToCart = () => {
      router.push({ path: "cart" });
    };

    return {
      goBack,
      goodsId,
      book,
      showGoods,
      showDetail,
      addToCart,
      skipToCart,
    };
  },
};
</script>
<style lang='sass' scoped>
.detail
  height: 100vh
  width: 100vw
  position: relative
  z-index: 999
  background-color: #fff
  .nav-bar
    background-color: var(--color-tint)
    color: #fff
    img
      width: 25px
      margin-top: 9px
  .content
    position: absolute
    top: 44px
    bottom: 49px
    left: 0
    right: 0
    overflow: hidden
  .bottom-bar
    position: absolute
    bottom: 0
    left: 0
    right: 0
    z-index: 1000
    height: 50px
</style>