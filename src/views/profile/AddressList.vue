<template>
  <div class="address-list">
    <nav-bar class="nav-bar">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt="" @click="goBack"
      /></template>
      <template v-slot:center>地址管理</template>
    </nav-bar>
    <van-address-list
      v-model="chosenAddressId"
      :list="addressList"
      default-tag-text="默认地址"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    />
  </div>
</template>

<script>
import { computed, onActivated, onMounted, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";

import NavBar from "components/common/navbar/NavBar.vue";

import { getAddressList, setDefaultAddress } from "network/address.js";

export default {
  setup() {
    const router = useRouter();
    const state = reactive({
      addressList: [],
    });

    // 选中的默认地址地址
    let chosenAddressId = ref(0);

    //
    const init = () => {
      Toast.loading("加载中...", { forbidClick: true });

      getAddressList().then((res) => {
        console.log(res.data);
        res.data.forEach((item, index) => {
          let addressListItem = {};
          addressListItem.id = item.id;
          addressListItem.name = item.name;
          addressListItem.tel = item.phone;
          addressListItem.address = item.address;
          addressListItem.isDefault = Boolean(item.is_default);
          state.addressList[index] = addressListItem;
        });
        chosenAddressId.value =
          state.addressList.find((item) => item.isDefault) &&
          state.addressList.find((item) => item.isDefault).id;
        Toast.clear();
      });
    };
    onMounted(() => {
      init();
    });
    onActivated(() => {
      state.addressList = [];
      init();
    });
    const onAdd = () => {
      router.push({ path: "/address/edit" });
    };

    const onSelect = (res) => {
      // chosenAddressId.value = state.addressList.find(
      //   (item) => item.isDefault
      // ).id;
      // chosenAddressId.value = res.id;
      // console.log(temp);
      // console.log(res.id);
      if (res.id == chosenAddressId.value) return;
      Toast.loading("加载中...", { forbidClick: true });
      setDefaultAddress(res.id).then(() => init());
    };

    const onEdit = (item, index) => {
      console.log(item);
      router.push({ path: "/address/edit", query: { address_id: item.id } });
    };

    const goBack = function () {
      // 返回到上一次路由
      router.go(-1);
    };

    return {
      onAdd,
      onEdit,
      goBack,
      onSelect,
      ...toRefs(state),
      chosenAddressId,
    };
  },
  components: {
    NavBar,
  },
};
</script>

<style lang='scss' scoped>
.address-list {
  height: 100vh;
  position: relative;
  top: 44px;
  z-index: 1000;
  background-color: #fff;
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    img {
      width: 25px;
      margin-top: 9px;
    }
  }
}
</style>