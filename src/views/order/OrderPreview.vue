<template>
  <div class="order-preview">
    <nav-bar class="nav-bar">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt="" @click="goBack"
      /></template>
      <template v-slot:center>订单预览</template>
    </nav-bar>
    <scroll class="preview-content">
      <div class="profile-info" @click="changeAddress">
        <div class="user-info">
          <span>{{ defaultAddress.name }}</span>
          <span>{{ defaultAddress.phone }}</span>
        </div>
        <div class="address-info">
          <span>{{ defaultAddress.province }}</span>
          <span>{{ defaultAddress.city }}</span>
          <span>{{ defaultAddress.county }}</span>
          <span>{{ defaultAddress.address }}</span>
        </div>
        <div class="arrow-icon">
          <img src="~assets/image/arrow-right.png" alt="" />
        </div>
      </div>
      <div class="goods-list">
        <div class="goods-item" v-for="(item, index) in goodsList" :key="index">
          <img :src="item.goods.cover_url" alt="" />
          <div class="goods-detail">
            <div class="goods-name">{{ item.goods.title }}</div>
            <div class="price"><small>￥</small>{{ item.goods.price }}.00</div>
            <div class="num">x{{ item.num }}</div>
          </div>
        </div>
      </div>
    </scroll>
    <van-submit-bar
      :price="totalPrice * 100"
      button-text="提交订单"
      @submit="onSubmit"
      class="submit-bar"
    />
    <van-popup
      v-model:show="show"
      round
      closeable
      @click-close-icon="closeClick"
      close-icon="close"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-grid :border="false" :column-num="2">
        <van-grid-item>
          支付宝二维码<br />
          <van-image :src="aliyunImgUrl" width="100" />
        </van-grid-item>
        <van-grid-item>
          支付宝二维码<br />
          <van-image :src="aliyunImgUrl" width="100" />
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import Scroll from "components/common/scroll/Scroll.vue";

import {
  createOrder,
  commitOrder,
  getPayCode,
  queryPayStatus,
} from "network/order.js";

import { computed, onMounted, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Toast, Dialog } from "vant";

export default {
  name: "OrderPreview",
  components: {
    NavBar,
    Scroll,
  },

  setup() {
    const router = useRouter();

    // 地址和商品信息的数据模型
    const state = reactive({
      defaultAddress: {},
      goodsList: [],
      orderNO: 0,
      aliyunImgUrl: "",
      wechatImgUrl: "",
    });

    // 计算订单商品总价
    let totalPrice = computed(() => {
      return state.goodsList.reduce((pre, cur) => {
        return (pre = pre + cur.goods.price * cur.num);
      }, 0);
    });

    onMounted(() => {
      Toast.loading("生成订单中...", { forbidable: true });
      createOrder().then((res) => {
        if (res.carts.length == 0) {
          goBack();
        }
        console.log(res);
        state.defaultAddress = res.address.find((item) => item.is_default);
        state.goodsList = res.carts;
        Toast.clear();
      });
    });

    // 返回上一路由功能
    const goBack = function () {
      // 返回到上一次路由
      router.go(-1);
    };

    // 用户功能换地址功能
    const changeAddress = () => {
      router.push({ path: "/address/list" });
    };

    // 决定弹出层是否出现
    const show = ref(false);

    // 点击弹出层关闭按钮 实现退出或者继续付款的功能
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

    // 提交订单功能
    const onSubmit = () => {
      // if(!state.list) {
      //   Toast.fail('订单无效，请您重试',{forbidable:true});
      //   setTimeout(() => {
      //     Toast.clean();
      //     router.push({path:'/cart'})
      //   }, 2000);
      // }
      commitOrder({ address_id: state.defaultAddress.id }).then((res) => {
        console.log(res);
        // 获取订单id
        state.orderNO = res.id;
        // 显现弹出层进行支付
        show.value = true;
        // 获取支付二维码
        getPayCode(state.orderNO, "aliyun").then((res) => {
          state.aliyunImgUrl = res.qr_code_url;
          console.log(state.aliyunImgUrl);
          console.log(res);
        });
        // 获取微信二维码
        // getPayCode(state.orderNO,'wechat').then(res => {
        //   console.log(res);
        // });

        // 轮询查看
        const timer = setInterval(() => {
          queryPayStatus(state.orderNO).then((res) => {
            if (res == 2) {
              clearInterval(timer);
              router.push({ path: "order/list", query: { id: state.orderNO } });
            }
          });
        }, 2000);
      });
    };

    return {
      router,
      goBack,
      ...toRefs(state),
      totalPrice,
      changeAddress,
      onSubmit,
      show,
      closeClick,
    };
  },
};
</script>

<style lang='scss' scoped>
.order-preview {
  height: 100vh;
  position: relative;
  z-index: 99;
  background-color: #fff;
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    img {
      width: 25px;
      margin-top: 9px;
    }
  }
  .preview-content {
    position: absolute;
    top: 44px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow: hidden;
    .profile-info {
      // margin-top: 44px;
      height: 90px;
      width: 100vw;
      padding: 15px;
      font-size: 14px;
      color: #000;
      position: relative;
      &::after {
        content: "";
        height: 2px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: repeating-linear-gradient(
          -45deg,
          #ff6c6c 0,
          #ff6c6c 20%,
          transparent 0,
          transparent 25%,
          #1989fa 0,
          #1989fa 45%,
          transparent 0,
          transparent 50%
        );
        background-size: 80px;
      }
      .user-info {
        margin: 10px 0;
        span {
          margin-right: 5px;
        }
      }
      .address-info {
        span {
          margin-right: 5px;
        }
      }
      .arrow-icon {
        position: absolute;
        right: 10px;
        top: 25px;
        width: 25px;
        img {
          width: 100%;
        }
      }
    }
    .goods-list {
      background-color: #fff;
      z-index: 99;
      border-bottom: 1px solid #eee;
      overflow: hidden;
      .goods-item {
        height: 120px;
        display: flex;
        padding: 15px;
        // background-color: pink;
        border-bottom: 2px solid #eee;
        img {
          width: 100px;
        }
        .goods-detail {
          padding: 20px 15px;
          flex: 1;
          font-size: 16px;
          position: relative;
          .price {
            margin-top: 15px;
            color: red;
            font-size: 14px;
          }
          .num {
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>>

