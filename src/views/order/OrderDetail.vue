<template>
  <div class="order-detail-box">
    <nav-bar class="nav-bar">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt="" @click="goBack"
      /></template>
      <template v-slot:center>订单详情</template>
    </nav-bar>
    <div class="order-status">
      <div class="status-item">
        <label>订单状态：</label>
        <span>{{ statusString }}</span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{ detail.order_no }}</span>
      </div>
      <div class="status-item">
        <label>下单时间：</label>
        <span>{{ detail.created_at }}</span>
      </div>

      <van-button
        v-if="detail.status == 1"
        @click="showPayFn"
        style="margin-bottom: 10px"
        color="#42b983"
        block
        >去支付</van-button
      >
      <van-button v-if="detail.status == 2" @click="handleConfirmOrder" block
        >确认订单</van-button
      >
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>¥ {{ totalPrice + ".00" }}</span>
      </div>
      <div class="price-item">
        <label>配送方式：</label>
        <span>普通快递</span>
      </div>
    </div>

    <van-card
      v-for="item in detail.orderDetails.data"
      :key="item.id"
      :num="item.num"
      :price="item.price + '.00'"
      desc="全场包邮"
      :title="item.goods.title"
      :thumb="item.goods.cover_url"
    />

    <div style="width: 100%; height: 50px"></div>

    <van-popup
      v-model:show="showPay"
      position="bottom"
      :style="{ height: '40%' }"
      closeable
      @click-close-icon="closeClick"
    >
      <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <van-grid :border="false" :column-num="2">
          <van-grid-item text="支付宝">
            支付宝二维码<br />
            <van-image width="150" height="150" :src="aliyunImgUrl" />
          </van-grid-item>
          <van-grid-item text="微信支付">
            微信二维码<br />
            <van-image width="150" height="150" :src="aliyunImgUrl" />
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>
<script>
import NavBar from "components/common/navbar/NavBar.vue";

import { computed, onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getOrderDetail, getPayCode } from "network/order.js";
import { Dialog, Toast } from "vant";

export default {
  name: "OrderDetail",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      orderId: 0,
      detail: {
        orderDetails: {
          data: [],
        },
      },
      showPay: false,
      statusString: "",
      aliyunImgUrl: "",
      wechatImgUrl: "",
    });
    const init = () => {
      const { id } = route.query;
      state.orderId = id;
      getOrderDetail(id).then((res) => {
        // console.log(res);
        state.detail = res;
        Toast.clear();
      });
    };

    // 计算商品的总价钱
    const totalPrice = computed(() => {
      return state.detail.orderDetails.data.reduce((pre, cur) => {
        return (pre = pre + cur.price);
      }, 0);
    });

    // 计算订单的状态
    state.statusString = computed(() => {
      let status = ["", "未支付", "已支付", "已发货", "确定收货", "已过期"];
      return status[state.detail.status];
    });

    // 支付订单弹出层
    const showPayFn = () => {
      // 显示弹出层
      state.showPay = true;
      // 获取支付宝二维码
      getPayCode(state.orderId, "aliyun").then((res) => {
        state.aliyunImgUrl = res.qr_code_url;
      });
    };

    // 返回上一路由功能
    const goBack = () => {
      // 返回到上一次路由
      router.go(-1);
    };

    // 点击关闭按钮
    const closeClick = () => {
      Dialog.confirm({
        message: "您是否要放弃本次付款？",
      })
        .then(() => {
          router.go(-1);
        })
        .catch(() => {
          show.value = true;
          Dialog.close();
        });
    };

    onMounted(() => {
      Toast.loading("加载中...", { fobidable: true });
      init();
    });
    return {
      goBack,
      ...toRefs(state),
      totalPrice,
      showPayFn,
      closeClick,
    };
  },
  components: {
    NavBar,
  },
};
</script>
<style lang="scss" scoped>
.order-detail-box {
  text-align: left;
  min-height: 100vh;
  background: #f7f7f7;
  position: relative;
  z-index: 999;
  padding-top: 50px;
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    img {
      width: 25px;
      margin-top: 9px;
    }
  }
  .order-status {
    background: #fff;
    padding: 20px;
    font-size: 15px;
    .status-item {
      margin-bottom: 10px;
      label {
        color: #999;
      }
    }
  }
  .order-price {
    background: #fff;
    margin: 20px 0;
    padding: 20px;
    font-size: 15px;
    .price-item {
      margin-bottom: 10px;
      label {
        color: #999;
      }
    }
  }
  .van-card {
    margin-top: 0;
  }
  .van-card__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
