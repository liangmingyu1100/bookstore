<template>
  <div class="address-edit">
    <nav-bar class="nav-bar">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt="" @click="goBack"
      /></template>
      <template v-slot:center>地址编辑</template>
    </nav-bar>
    <van-address-edit
      :area-list="areaList"
      :show-delete="Object.keys($route.query).length ? true : false"
      show-set-default
      show-search-result
      :address-info="addressInfo"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
      value="110101"
    />
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";

import { Toast } from "vant";
import { areaList } from "@vant/area-data";

import {
  addAddress,
  getAddressDetail,
  modifyAddress,
  removeAddress,
} from "network/address.js";

import NavBar from "components/common/navbar/NavBar.vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "AddressEdit",
  setup() {
    const searchResult = ref([]);

    // 创建路由对象
    const router = useRouter();
    const route = useRoute();
    // 路由参数
    const address_id = ref(0);

    // 数据模型
    const state = reactive({
      addressInfo: {
        name: "",
        addressDetail: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        isDefault: false,
        areaCode: "",
      },
    });

    const saveData = (res) => {
      state.addressInfo.name = res.name;
      state.addressInfo.addressDetail = res.addressDetail
        ? res.addressDetail
        : res.address;
      state.addressInfo.tel = res.tel ? res.tel : res.phone;
      state.addressInfo.province = res.province;
      state.addressInfo.city = res.city;
      state.addressInfo.county = res.county;
      state.addressInfo.isDefault = res.isDefault
        ? res.isDefault
        : Boolean(res.is_default);
    };

    //获取表单数据进行赋值 实现添加地址功能 和 修改地址功能
    const onSave = (res) => {
      saveData(res);
      if (address_id.value) {
        modifyAddress(address_id.value, state.addressInfo).then((result) => {
          router.push({ path: "/address/list" });
        });
      } else {
        console.log(res);
        console.log(state.addressInfo);
        addAddress(state.addressInfo).then((res) => {
          console.log(res);
          router.push({ path: "/address/list" });
        });
      }
    };

    // 获取地区编码
    const getAreaCode = (county) => {
      return Object.keys(areaList.county_list).find(
        (key) => areaList.county_list[key] === county
      );
    };

    onMounted(() => {
      address_id.value = route.query.address_id;
      if (address_id.value) {
        Toast.loading("加载中...", { forbidClick: true });
        getAddressDetail(address_id.value).then((res) => {
          console.log(res);
          //获取地区编码
          state.addressInfo.areaCode = getAreaCode(res.county);
          console.log(state.addressInfo.areaCode);
          // 将获取的地址详情信息赋值到addressInfo中
          saveData(res);

          Toast.clear();
          console.log(state.addressInfo);
        });
      }
    });

    //删除地址功能实现
    const onDelete = () => {
      Toast.loading("删除中...", { forbidClick: true });
      removeAddress(address_id.value).then((res) => {
        console.log(res);
        Toast.clear();
        router.push({ path: "/address/list" });
      });
    };

    const goBack = function () {
      // 返回到上一次路由
      router.go(-1);
    };

    return {
      goBack,
      onSave,
      onDelete,
      areaList,
      onChangeDetail,
      ...toRefs(state),
    };
  },
  components: {
    NavBar,
  },
};
</script>

<style lang='scss' scoped>
.address-edit {
  padding-top: 54px;
  height: 100vh;
  position: relative;
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