<template>
  <div class="profile">
    <nav-bar class="nav-bar" @click="goBack">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt=""
      /></template>
      <template v-slot:center>个人中心</template>
    </nav-bar>
    <profile-user-info :userInfo="userInfo" />
    <profile-user-list />
    <div class="logout">
      <van-button
        style="margin-top: 16px"
        size="large"
        round
        @click="toLogout"
        type="success"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import ProfileUserInfo from "./childComps/ProfileUserInfo.vue";
import ProfileUserList from "./childComps/ProfileUserList.vue";

import { useRouter } from "vue-router";
import { Toast, Dialog } from "vant";
import { logout, getUserInfo } from "network/user.js";
import { useStore } from "vuex";
import { onMounted, reactive } from "vue";

export default {
  components: {
    NavBar,
    ProfileUserInfo,
    ProfileUserList,
  },
  setup() {
    // 使用路由对象
    const router = useRouter();
    // 使用状态管理对象
    const store = useStore();

    // 返回到上一次路由
    const goBack = function () {
      router.go(-1);
    };

    // 异步关闭弹窗
    const beforeClose = (action) =>
      new Promise((resolve) => {
        if (action === "confirm") {
          logout().then((res) => {
            if (res.status == 204) {
              // 清除token
              window.localStorage.setItem("token", "");
              // 改变登录状态为false
              store.dispatch("setIsLogin", false);
              // 提示退出成功
              Toast.success("退出成功");
              setTimeout(() => {
                router.push({ path: "/login" });
                resolve(true);
              }, 500);
            }
          });
        } else {
          // 拦截取消操作
          resolve(false);
          // 关闭对话框
          Dialog.close();
        }
      });
    // 用户退出功能
    const toLogout = () => {
      Dialog.confirm({
        title: "用户操作",
        message: "是否退出登录",
        beforeClose,
      });
    };

    // 用户数据模型
    const userInfo = reactive({
      name: "",
      email: "",
      avatar_url: "",
    });

    onMounted(() => {
      getUserInfo().then((res) => {
        console.log(res);
        userInfo.name = res.name;
        userInfo.email = res.email;
        userInfo.avatar_url = res.avatar_url;
      });
    });

    return {
      goBack,
      toLogout,
      userInfo,
    };
  },
};
</script>
<style lang='sass' scoped>
.profile
  width: 100vw
  .nav-bar
    background-color: var(--color-tint)
    color: #fff
  img
    width: 25px
    margin-top: 9px
  .logout
    padding: 0 10px
</style>