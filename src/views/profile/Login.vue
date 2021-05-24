<template>
  <div class="register">
    <nav-bar class="nav-var">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt="" @click="goBack"
      /></template>
      <template v-slot:center>用户登录</template>
    </nav-bar>
    <img src="~assets/image/logo-tux.png" alt="" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="state.email"
        clearable
        name="邮箱"
        label="邮箱"
        placeholder="请输入您的邮箱"
        :rules="[{ required: true, message: '邮箱不能为空' }]"
      />
      <van-field
        v-model="state.password"
        clearable
        type="password"
        name="密码"
        label="密码"
        placeholder="请输入您的密码"
        :rules="[{ required: true, message: '密码不能为空' }]"
      />
      <div style="margin: 16px">
        <div class="link-register" @click="linkClick">没有账号，去注册</div>
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          class="submit"
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive } from "vue";
import { login } from "network/user.js";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import NavBar from "components/common/navbar/NavBar.vue";
export default {
  components: { NavBar },
  setup() {
    const router = useRouter();
    // name liangsi email 12321@qq.com password 123321
    const state = reactive({
      email: "",
      password: "",
    });
    // 创建状态管理对象
    const store = useStore();
    const onSubmit = () => {
      login(state).then((res) => {
        // 利用本地存储（window.localStorage setItem getItem方法）
        window.localStorage.setItem("token", res.access_token);
        store.dispatch("setIsLogin", true);
        // 弹出登录成功轻提示
        Toast.success("登录成功");
        setTimeout(() => {
          // 后退一步
          router.go(-1);
        }, 500);
      });
      state.email = "";
      state.password = "";
    };
    const goBack = () => {
      // 返回到上一次路由
      router.go(-1);
    };
    const linkClick = () => {
      router.push({ path: "/register" });
    };
    return {
      state,
      onSubmit,
      goBack,
      linkClick,
    };
  },
};
</script>

<style lang='scss' scoped>
.register {
  width: 100vw;
  height: 100vh;
  text-align: center;
  .nav-var {
    background-color: var(--color-tint);
    color: #fff;
    img {
      width: 25px;
      margin-top: 9px;
      padding: 0;
      margin-bottom: 0;
    }
  }
  img {
    width: 120px;
    padding-top: 84px;
    margin-bottom: 35px;
  }
  .link-register {
    font-size: 14px;
    color: rgb(8, 172, 21);
    text-align: left;
  }
  .submit {
    margin-top: 15px;
    background-color: var(--color-tint);
  }
}
</style>>
