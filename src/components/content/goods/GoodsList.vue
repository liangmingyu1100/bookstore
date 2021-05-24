<template>
  <div class="goods">
    <goods-list-item
      v-for="(item, index) in goods"
      :goodsItem="item"
      :key="index"
    />
  </div>
</template>
<script>
import { computed, inject } from "vue";
import GoodsListItem from "./GoodsListItem";
export default {
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  components: {
    GoodsListItem,
  },
};
</script>
<style scoped>
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>
