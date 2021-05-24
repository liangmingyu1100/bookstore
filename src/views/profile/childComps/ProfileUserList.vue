<template>
  <div class="user-list">
    <ul>
      <li class="list-item">
        <van-cell center title="我的收藏" is-link :to="{ path: '/collect' }" />
      </li>
      <li class="list-item">
        <van-cell
          center
          title="我的订单"
          is-link
          :to="{ path: '/order/list' }"
        />
      </li>
      <li class="list-item">
        <van-cell center title="账号管理" is-link :to="{ path: '/account' }" />
      </li>
      <li class="list-item">
        <van-cell
          center
          title="地址管理"
          is-link
          :to="{ path: '/address/list' }"
        />
      </li>
      <li class="list-item">
        <van-cell center title="关于我们" is-link :to="{ path: '/about' }" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang='scss' scoped>
.user-list {
  margin-top: 25px;
  .list-item {
    height: 60px;
    border-bottom: 1px solid #eee;
    div {
      height: 100%;
    }
  }
}
</style>