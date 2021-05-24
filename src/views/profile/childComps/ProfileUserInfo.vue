<template>
  <div class="user-info">
    <div class="user-avatar"><img :src="userInfo.avatar_url" alt="" /></div>
    <div class="user-content">
      <div class="username">昵称：{{ userInfo.name }}</div>
      <div class="email">登录名：{{ userInfo.email }}</div>
      <div class="signture">座右铭：一分耕耘一分收获</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang='scss' scoped>
.user-info {
  position: relative;
  top: 20px;
  left: 3%;
  width: 94%;
  margin-top: 44px;
  height: 120px;
  background: linear-gradient(90deg, #31c7a7, #a1c7c7);
  display: flex;
  padding: 10px 15px;
  border-radius: 15px;
  .user-avatar {
    img {
      width: 60px;
      margin-top: 20px;
      margin-right: 15px;
    }
  }
  .user-content {
    margin-top: 18px;
    div {
      margin-bottom: 7px;
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>