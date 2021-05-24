<template>
  <div class="order-list">
    <nav-bar class="nav-bar">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt="" @click="goBack"
      /></template>
      <template v-slot:center>订单列表</template>
    </nav-bar>
    <div class="order-content">
      <div class="order-tab">
        <van-tabs @click="tabClick" sticky offset-top="44px">
          <van-tab
            v-for="(item, index) in orderStatus"
            :title="item"
            :key="index"
          >
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                v-show="orderList.length > 0 ? true : false"
              >
                <div
                  class="order-item"
                  v-for="(item, index) in orderList"
                  :key="index"
                >
                  <div class="order-header">
                    <span>订单号：{{ item.order_no }}</span>
                    <span>创建时间：{{ item.created_at }}</span>
                  </div>
                  <div class="order-goods-list">
                    <div
                      class="goods-item"
                      v-for="(sub, index) in item.orderDetails.data"
                      :key="index"
                      @click="goToDetail(item.id)"
                    >
                      <van-card
                        :num="sub.num"
                        :price="sub.price + '.00'"
                        :desc="item.goods.data[index].description"
                        :title="item.goods.data[index].title"
                        :thumb="item.goods.data[index].cover_url"
                      />
                    </div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <van-empty
      class="custom-image"
      image="https://iconfont.alicdn.com/t/030dcd96-0eba-4bb1-a961-3e65f8349628.png"
      description="您还没有相关的订单"
    />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import Scroll from "components/common/scroll/Scroll.vue";
import { useRouter } from "vue-router";
import { onMounted, reactive, ref, toRefs } from "vue";
import { getOrderList } from "network/order.js";
import { Toast } from "vant";
export default {
  components: {
    NavBar,
    Scroll,
  },

  setup() {
    const router = useRouter();

    const state = reactive({
      orderList: [],
      finished: false,
      refreshing: false,
      loading: false,
      status: 0,
      page: 1,
      total_pages: 0,
    });

    // 初始化加载数据
    const loadData = () => {
      Toast.loading("加载中...", { forbidable: true });
      getOrderList(state.page, state.status).then((res) => {
        console.log(res);
        // 获取订单列表
        state.orderList = state.orderList.concat(res.data);
        // 获取订单总页数
        state.total_pages = res.meta.pagination.total_pages;
        // 加载完成
        state.loading = false;
        if (state.page == state.total_pages) {
          state.finished = true;
        }
        Toast.clear();
      });
    };

    const onLoad = () => {
      // 如果当前页小于总页数
      if (!state.refreshing && state.page < state.total_pages) {
        // 加载页面时 当前页等于当前页+1
        state.page += 1;
      }

      //如果是在刷新状态下
      if (state.refreshing) {
        // 将list清空
        state.orderList = [];
        // 加载状态为假
        state.refreshing = false;
      }

      loadData();
    };

    const goToDetail = (id) => {
      router.push({ path: "/order/detail", query: { id } });
    };

    onMounted(() => {
      onRefresh();
    });

    // 返回上一路由功能
    const goBack = function () {
      // 返回到上一次路由
      router.go(-1);
    };
    const orderStatus = ref([
      "全部",
      "待支付",
      "待发货",
      "收货",
      "待评价",
      "过期",
    ]);

    const tabClick = (index) => {
      // 通过索引修改状态
      state.status = index;
      // 重新加载
      onRefresh();
    };

    // 初始化数据
    const onRefresh = () => {
      // 刷新状态为真
      state.refreshing = true;
      // 没完全加载
      state.finished = false;
      // 处于加载状态
      state.loading = true;
      // 页面初始化
      state.page = 1;

      onLoad();
    };
    return {
      goBack,
      ...toRefs(state),
      orderStatus,
      onRefresh,
      tabClick,
      onLoad,
      goToDetail,
    };
  },
};
</script>

<style lang='scss' scoped>
.order-list {
  position: relative;
  height: 100vh;
  background-color: #fff;
  z-index: 100;
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    img {
      width: 25px;
      margin-top: 9px;
    }
  }
  .order-content {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    background-color: #eee;
    .order-tab {
      .order-item {
        padding: 15px;
        background-color: #fff;
        margin: 10px 5px;
        border-radius: 10px;
        .order-header {
          height: 40px;
          display: flex;
          flex-direction: column;
          font-size: 16px;
        }
      }
    }
  }
  .custom-image {
    padding-top: 100px;
  }
}
</style>