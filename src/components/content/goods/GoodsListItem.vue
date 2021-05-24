<template>
  <div class="goods-item" @click="goodsItemClick">
    <img :src="goodsItem.cover_url" alt="" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ showPrice }}</span>
      <span class="collect">{{ goodsItem.collects_count }}</span>
    </div>
  </div>
</template>
<script>
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const router = useRouter();
    const goodsItemClick = function () {
      router.push({ path: "detail", query: { id: props.goodsItem.id } });
    };
    const showPrice = computed(() => {
      return "￥" + props.goodsItem.price.toFixed(2);
    });
    return {
      goodsItemClick,
      showPrice,
    };
  },
});
</script>
<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}
.goods-info {
  width: 100%;
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: red;
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/image/collect.png") 0 0/14px 14px;
}
</style>
