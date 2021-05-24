<template>
  <div class="recommend">
    <div
      class="recommend-item"
      v-for="(item, index) in recommends.slice(0, 4)"
      :key="index"
    >
      <a href="" @click.prevent="goDetail(item.id)">
        <img :src="item.cover_url" alt="" @load="imageLoad" />
        {{ item.title }}
      </a>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const isLoad = ref(false);
    const imageLoad = () => {
      if (!isLoad.value) {
        emit("imageLoad");
        isLoad.value = true;
      }
    };
    const goDetail = function (id) {
      router.push({ path: "/detail", query: { id } });
    };

    return {
      goDetail,
      imageLoad,
    };
  },
};
</script>
<style scoped>
.recommend {
  display: flex;
  width: 100vw;
  padding: 10px 0 20px;
  border-bottom: 10px solid #eee;
}
.recommend-item {
  flex: 1;
  text-align: center;
  font-size: 14px;
}
.recommend-item img {
  width: 70px;
  height: 80px;
}
</style>