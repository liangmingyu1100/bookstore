<template>
  <div class="register">
    <nav-bar class="nav-var">
      <template v-slot:left
        ><img src="~assets/image/arrow-back.png" alt="" @click="goBack"
      /></template>
      <template v-slot:center>注册中心</template>
    </nav-bar>
    <img src="~assets/image/logo-tux.png" alt="" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="state.name"
        clearable
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="state.email"
        clearable
        name="邮箱"
        label="邮箱"
        placeholder="邮箱"
        :rules="[
          { required: true, message: '请填写邮箱' },
          { emailPattern, message: '邮箱格式错误，请重试' },
        ]"
      />
      <van-field
        v-model="state.password"
        clearable
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="state.password_confirmation"
        clearable
        type="password"
        name="确认密码"
        label="确认密码"
        placeholder="请确认密码"
        :rules="[{ required: true, message: '请填写确认密码' }]"
      />
      <div style="margin: 16px">
        <div class="link-login" @click.prevent="linkClick">
          已有账号，去登录
        </div>
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          class="submit"
        >
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive } from "vue";
import { register } from "network/user.js";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import NavBar from "components/common/navbar/NavBar.vue";
export default {
  components: { NavBar },
  setup() {
    const router = useRouter();
    // name liangsi email 12321@qq.com password 123321
    const state = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    const emailPattern = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    const onSubmit = () => {
      if (state.password != state.password_confirmation) {
        Toast.fail("两次密码输入不一致");
      } else {
        register(state).then((res) => {
          console.log(res);
          if (res.status === 201) {
            Toast.success("注册成功");
            setTimeout(() => {
              router.push({ path: "/login" });
            }, 1000);
          }
        });
      }
      state.password = "";
      state.password_confirmation = "";
    };
    const goBack = () => {
      // 返回到上一次路由
      router.go(-1);
    };
    const linkClick = () => {
      router.push({ path: "/login" });
    };
    return {
      state,
      emailPattern,
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
  .link-login {
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
