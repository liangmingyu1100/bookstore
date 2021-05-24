<template>
  <div id="tab-bar">
    <div
      class="tab-bar-item"
      v-for="(item, index) in tabbar"
      :key="index"
      @click="tabItemClick(item.path)"
      :class="{ active: item.path === $route.path }"
    >
      <van-badge
        :content="$store.state.cartCount"
        v-if="item.iconClass == 'icon-gouwuche'"
      >
        <i class="iconfont icon" :class="item.iconClass"></i>
      </van-badge>
      <i class="iconfont icon" v-else :class="item.iconClass"></i>
      <div>{{ item.text }}</div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// import { useStore } from "vuex";
export default defineComponent({
  name: "TabBar",
  setup() {
    const router = useRouter();
    const store = useStore();
    const tabbar = ref([
      {
        path: "/home",
        iconClass: "icon-shouye",
        text: "首页",
      },
      {
        path: "/category",
        iconClass: "icon-fenlei",
        text: "分类",
      },
      {
        path: "/cart",
        iconClass: "icon-gouwuche",
        text: "购物车",
      },
      {
        path: "/profile",
        iconClass: "icon-wode",
        text: "我的",
      },
    ]);
    const tabItemClick = function (path) {
      // router.push是异步方法 结果返回一个Promise
      router.push({ path: path });
    };
    onMounted(() => {
      store.dispatch("updateCart");
    });
    return {
      tabbar,
      tabItemClick,
    };
  },
});
</script>

<style scoped>
#tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 10px 0 hsl(0deg 6% 58% / 60%);
  z-index: 9;
  background-color: #fff;
}
.tab-bar-item {
  flex: 1;
  text-align: center;
  font-size: var(--font-size);
  margin: 8px 0 4px;
}
.active {
  color: var(--color-tint);
}
.icon {
  font-size: 23px;
}
</style>