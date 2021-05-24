<template>
  <div class="tab-control">
    <div
      v-for="(item, index) in titles"
      :key="index"
      class="tab-control-item"
      @click="tabClick(index)"
      :class="{ active: index === currentIndex }"
    >
      <span>{{ item }}</span>
    </div>
  </div>
</template>
<script>
import { inject, ref } from "vue";
export default {
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const currentIndex = ref(0);
    // const cindex = inject("index");
    const tabClick = function (index) {
      currentIndex.value = index;
      emit("tabClick", index);
      // if (cindex.value != currentIndex.value) currentIndex.value = cindex.value;
    };

    return {
      currentIndex,
      tabClick,
    };
  },
};
</script>
<style scoped>
.tab-control {
  display: flex;
  position: relative;
  top: -1px;
  text-align: center;
  background-color: #fff;
  height: 40px;
  line-height: 40px;
}
.tab-control-item {
  flex: 1;
}
.tab-control-item span {
  padding: 2px 5px 2px;
  font-size: 14px;
}
.active span {
  color: var(--color-tint);
  border-bottom: 3px solid var(--color-tint);
}
</style>
