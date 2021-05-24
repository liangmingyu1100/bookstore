<template>
  <div>
    <router-view v-slot="{ Component }">
      <keep-alive
        :exclude="['Detail', 'AddressEdit', 'OrderPreview', 'OrderDetail']"
      >
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <tab-bar />
  </div>
</template>
<script>
import TabBar from "./components/content/tabbar/TabBar.vue";

export default {
  components: {
    TabBar,
  },
  setup() {},
};
</script>

<style lang="scss">
@import url("assets/css/base.css");
</style>
