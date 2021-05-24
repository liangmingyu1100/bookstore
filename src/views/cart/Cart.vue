<template>
  <div class="cart">
    <nav-bar class="nav-bar" @click="goBack">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt=""
      /></template>
      <template v-slot:center>购物车</template>
    </nav-bar>
    <div class="empty" v-if="list.length == 0">
      <img src="~assets/image/empty-cart.png" alt="" />
      <p class="description">购物车空空如也，快去选购吧~</p>
      <div class="go-shop">
        <van-button type="danger" round size="normal" @click="goShopping"
          >前去抢购</van-button
        >
      </div>
    </div>
    <scroll class="cart-list" v-else>
      <van-checkbox-group
        v-model="result"
        ref="checkboxGroup"
        @change="changeCheck"
      >
        <van-swipe-cell
          class="swipe-cell"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="cart-item">
            <van-checkbox
              :name="item.id"
              checked-color="#ee0a24"
              class="checkbox"
            ></van-checkbox>
            <div class="goods-img">
              <img :src="item.goods.cover_url" alt="" />
            </div>
            <div class="goods-info">
              <div class="desc">{{ item.goods.description }}</div>
              <div class="price">
                <small>￥</small>{{ item.goods.price }}.00
              </div>
            </div>
            <div class="goods-num">
              <div class="num">{{ "x" + item.num }}</div>
              <van-stepper
                v-model="item.num"
                theme="round"
                button-size="20"
                disable-input
                :max="item.goods.stock"
                class="num-stepper"
                :name="item.id"
                async-change
                @change="changeCount"
              />
            </div>
          </div>
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
              @click="removeGoods(item.id)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </scroll>

    <van-submit-bar
      :price="totalPrice * 100"
      :button-text="'结算(' + result.length + ')'"
      @submit="onSubmit"
      class="submit-bar"
    >
      <van-checkbox
        @click="checkAll"
        v-model="isCheckedAll"
        checked-color="#ee0a24"
        >全选</van-checkbox
      >
    </van-submit-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import Scroll from "components/common/scroll/Scroll.vue";

import { useRouter } from "vue-router";
import { reactive, ref, computed, toRefs, onMounted, onActivated } from "vue";
import {
  getCartList,
  modifyCartCount,
  checkedCart,
  removeCart,
} from "network/cart.js";
import { Toast } from "vant";
import { useStore } from "vuex";

export default {
  components: {
    NavBar,
    Scroll,
  },

  setup() {
    // 购物车状态
    const state = reactive({
      list: [],
      result: [],
      isCheckedAll: false,
    });
    // 初始化获取购物车数据
    const init = () => {
      Toast.loading("加载中...", { forbidClick: true });

      getCartList("include=goods").then((res) => {
        console.log(res);
        // 获取购物车列表
        state.list = res.data;
        // 筛选选中的商品
        state.result = res.data
          .filter((item) => item.is_checked)
          .map((item) => {
            return item.id;
          });
        // console.log(state.list.length);
        // console.log(state.result.length);
        //对全选按钮进行刷新
        if (state.list.length == state.result.length && state.result.length) {
          state.isCheckedAll = true;
        }
        // console.log(state.list.length);
        // console.log(state.result.length);
        if (state.result.length == 0 && state.isCheckedAll) {
          state.isCheckedAll = false;
        }
      });
    };
    onMounted(() => {
      // 初始化购物车数据
      init();
    });

    // 修改商品的选中状态
    const changeCheck = (result) => {
      if (state.list.length == 0) {
        state.isCheckedAll = false;
        return;
      }
      if (result.length == state.list.length) {
        state.isCheckedAll = true;
      } else {
        state.isCheckedAll = false;
      }
      // 发送请求给数据库修改数据库中的商品选中状态
      checkedCart({ cart_ids: result });

      // 改变页面state中的选中状态
      state.list.forEach((item) => {
        item.is_checked = result.includes(item.id) ? true : false;
      });
    };

    //全选按钮功能实现
    const checkAll = () => {
      if (state.isCheckedAll) {
        state.isCheckedAll = false;
        state.result = state.list.map((value) => value.id);
      } else {
        state.isCheckedAll = true;
        state.result = [];
      }
    };

    // 选中商品的总价
    const totalPrice = computed(() => {
      return state.list
        .filter((item) => item.is_checked)
        .reduce((pre, cur) => {
          return (pre = pre + cur.goods.price * cur.num);
        }, 0);
    });

    // 每次选中时 初始化购物车 解决加入购物车后 跳转到购物车页面观察不到变化的问题
    onActivated(() => {
      init();
      // 更新vuex中cartCount的值
      store.dispatch("updateCart");
    });

    const value = ref(0);
    // 使用路由对象
    const router = useRouter();
    // 使用状态管理对象
    const store = useStore();

    // 导航返回上一次路由
    const goBack = function () {
      // 返回到上一次路由
      router.go(-1);
    };

    // 前往选购
    const goShopping = () => {
      router.push({ path: "/home" });
    };

    //前往结算页面
    const onSubmit = () => {
      // console.log(state.result.length);
      if (!state.result.length) {
        Toast.fail("请选择所要结算的商品");
        return;
      }
      router.push({ path: "/order/preview" });
    };
    //改变商品的选中状态
    const changeCount = (value, detail) => {
      // 这里弹出轻提示 防止连续修改商品数据 在修改完成后消息
      Toast.loading("修改中...", { forbidClick: true });
      // 请求接口去修改数据库的商品数量
      modifyCartCount(detail.name, value).then((res) => {
        // 判断响应是否正确
        if (res.status == 204) {
          // 移除轻提示
          Toast.clear();
          state.list.forEach((item) => {
            if (item.id == detail.name) {
              item.num = value;
            }
          });
        }
      });
    };

    // 删除商品
    const removeGoods = (id) => {
      // 用法和修改商品数量同理
      Toast.loading("删除商品中", { forbidClick: true });
      removeCart(id).then((res) => {
        // Toast.clear();
        // 删除list中的对应的商品 -> 利用响应式原理动态删除的效果
        state.list.some((item, index) => {
          if (item.id == id) {
            state.list.splice(index, 1);
            return true;
          }
        });
        // 更新vuex中cartCount的值
        store.dispatch("updateCart");

        // 更新全选按钮的选中状态
        if (state.list.length == 0) state.isCheckedAll = false;
      });
    };

    return {
      goBack,
      checkAll,
      value,
      onSubmit,
      ...toRefs(state),
      changeCount,
      changeCheck,
      removeGoods,
      totalPrice,
      goShopping,
    };
  },
};
</script>
<style lang='scss' scoped>
.cart {
  height: 100vh;
  position: relative;
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    img {
      width: 25px;
      margin-top: 9px;
    }
  }
  .empty {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 99px;
    text-align: center;
    font-size: 14px;
    img {
      width: 150px;
      padding-top: 80px;
    }
    p {
      margin: 10px 0;
    }
    .go-shop {
      width: 100%;
      height: 40px;
    }
  }
  .cart-list {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 99px;
    overflow: hidden;
  }
  .cart-item {
    height: 100px;
    display: flex;
    width: 100vw;
    .checkbox {
      padding: 20px 10px;
    }
    .goods-img {
      width: 80px;
      height: 100px;
      align-self: center;
      img {
        width: 100%;
        margin-top: 10px;
      }
    }
    .goods-info {
      flex: 1;
      padding-left: 15px;
      margin-top: 0; //解决加入购物车后跳转到购物车页面自动设置值为45px的问题
      .desc {
        margin-top: 25px;
        font-size: 14px;
        margin-bottom: 15px;
        text-align: left;
      }
      .price {
        color: rgb(187, 6, 6);
        font-size: 14px;
        text-align: left;
      }
    }
    .goods-num {
      width: 120px;
      padding-left: 10px;
      .num {
        text-align: center;
        margin-top: 25px;
        margin-bottom: 10px;
        font-size: 14px;
      }
    }
  }
  .van-button {
    height: 100%;
  }
  .van-submit-bar {
    bottom: 60px;
  }
}
</style>