<template>
  <div class="category">
    <nav-bar class="nav-bar">
      <template v-slot:center>商品分类</template>
    </nav-bar>

    <div class="category-content">
      <div class="category-nav">
        <div class="placeholder">
          <van-search v-model="value" placeholder="搜索" shape="round" />
        </div>
        <div class="order-tab">
          <van-tabs @click="orderClick">
            <van-tab
              :title="item"
              v-for="(item, index) in orders"
              :key="index"
            ></van-tab>
          </van-tabs>
        </div>
      </div>

      <div class="main-content">
        <scroll class="sidebar">
          <van-sidebar v-model="activeKey" class="van-sidebar">
            <van-collapse
              v-model="activeName"
              accordion
              v-for="(item, index) in categories"
              :key="index"
              class="collapse-item"
            >
              <van-collapse-item
                :title="item.name"
                :name="index"
                class="collapse-item"
              >
                <van-sidebar-item
                  :title="sub.name"
                  v-for="sub in item.children"
                  :key="sub.id"
                  @click="sidebarClick(sub.id)"
                />
              </van-collapse-item>
            </van-collapse>
          </van-sidebar>
        </scroll>

        <div class="goods-wrapper">
          <div class="goods-list" v-if="showGoods.length">
            <van-card
              v-for="(item, index) in showGoods"
              :key="index"
              :tag="item.collects_count > 0 ? '爆款' : '特卖'"
              :price="item.price"
              desc="271个应用实例+212集高清微视频+61个实践练习+2个项目案例+海量开发资源库，丛书累计销量250多万册"
              :title="item.title"
              :thumb="item.cover_url"
              :origin-price="item.price * 2"
              @click="itemClick(item.id)"
            />
          </div>
          <div class="nothing" v-else>
            <img src="~assets/image/no-thing.png" alt="" />
            <p>抱歉~暂无该类型商品</p>
          </div>
        </div>
      </div>
    </div>
    <back-top @click="backTopClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import Scroll from "components/common/scroll/Scroll.vue";
import BackTop from "components/content/backtop/BackTop.vue";

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { getCategorysData, getCategorysGoods } from "network/category.js";

// // 导入插件
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
import ObserveDOM from "@better-scroll/observe-dom";
import ObserveImage from "@better-scroll/observe-image";
import MouseWheel from "@better-scroll/mouse-wheel";

// 安装插件
BScroll.use(Pullup);
BScroll.use(ObserveDOM);
BScroll.use(ObserveImage);
BScroll.use(MouseWheel);

export default {
  components: {
    NavBar,
    Scroll,
    BackTop,
  },

  setup() {
    let activeKey = ref(0);
    let activeName = ref("1");
    let value = ref("");
    let categories = ref([]);
    let orders = ref(["销量排序", "价格排序", "评论排序"]);
    let currentType = ref("sales");
    let currentCid = ref(2);
    let isNewGoods = ref(true);
    const router = useRouter();
    const sidebarClick = (cid) => {
      if (currentCid.value == cid) return;
      currentCid.value = cid;
      // getGoodsData(currentType.value, currentCid.value.value);
      isNewGoods.value = true;
      init();
      // console.log(currentCid.value);
      // console.log(currentType.value);
    };
    const orderClick = (index) => {
      let types = ["sales", "price", "comments_count"];
      currentType.value = types[index];
      // console.log(currentCid.value);
      // console.log(currentType.value);
    };
    const backTopClick = () => {
      scroll.scrollTo(0, 0, 300);
    };
    let isFinishedPulingUp = ref(false);
    // 分类商品数据模型
    const goods = reactive({
      sales: { page: 0, list: [] },
      price: { page: 0, list: [] },
      comments_count: { page: 0, list: [] },
    });
    const getGoodsData = (type, cid) => {
      let page = goods[type].page + 1;
      getCategorysGoods(type, cid, page).then((res) => {
        if (isFinishedPulingUp.value && !isNewGoods.value) {
          goods[type].list.push(...res.goods.data);
          goods[type].page += 1;
          scroll.finishPullUp();
          scroll.refresh();
        } else {
          goods[type].list = res.goods.data;
          goods[type].page += 1;
        }
      });
    };
    const init = () => {
      getGoodsData("sales", currentCid.value);
      getGoodsData("price", currentCid.value);
      getGoodsData("comments_count", currentCid.value);
    };
    let showGoods = computed(() => {
      return goods[currentType.value].list;
    });
    let scroll = reactive({});
    let isShowBackTop = ref(false);
    const loadMore = () => {
      isFinishedPulingUp.value = true;
      isNewGoods.value = false;
      getGoodsData(currentType.value, currentCid.value);
    };
    const itemClick = (id) => {
      router.push({ path: "/detail", query: { id } });
    };
    onMounted(() => {
      getCategorysData().then((res) => {
        categories.value = res.categories;
      });
      init();
      nextTick(() => {
        scroll = new BScroll(document.querySelector(".goods-wrapper"), {
          observeDOM: true,
          mouseWheel: true,
          probeType: 3,
          click: true,
          pullUpLoad: true,
        });
        scroll.on("scroll", (position) => {
          isShowBackTop.value = -position.y > 300;
        });
        scroll.on("pullingUp", () => {
          loadMore();
        });
      });
    });

    return {
      activeKey,
      activeName,
      value,
      categories, //分类商品的信息
      orders, //标题导航
      orderClick,
      sidebarClick,
      backTopClick,
      showGoods,
      isShowBackTop,
      itemClick,
    };
  },
};
</script>
<style lang='scss' scoped>
.category {
  position: relative;
  height: 100vh;
  width: 100vw;
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    img {
      width: 25px;
      margin-top: 9px;
    }
  }
  .category-content {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 58px;
    .category-nav {
      display: flex;
      .order-tab {
        flex: 1;
        height: 50px;
      }
      .placeholder {
        width: 120px;
      }
    }
    .main-content {
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0;
      left: 0;
      right: 0;
      .sidebar {
        width: 127px;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        overflow: hidden;
        .van-sidebar {
          width: 100%;
        }
      }
      .goods-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 120px;
        right: 0;
        overflow: hidden;
        .nothing {
          width: 100%;
          text-align: center;
          img {
            width: 200px;
            margin-top: 50px;
          }
          p {
            height: 100px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>