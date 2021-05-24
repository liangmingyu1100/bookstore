<template>
  <div class="goods-info">
    <div class="info-img">
      <van-image
        width="200"
        height="200"
        :src="goodsInfo.cover_url"
        fit="contain"
        lazy-load
        @click="imgClick"
      />
    </div>
    <div class="info-card">
      <van-card
        :price="goodsInfo.price + '.00'"
        :desc="goodsInfo.description"
        :title="goodsInfo.title"
        style="
          text-align: left;
          background-color: #ffffff;
          border-bottom: 10px solid #eee;
        "
        ><template #tags>
          <van-tag plain :type="goodsInfo.stock > 500 ? 'success' : 'danger'">{{
            goodsInfo.stock > 500
              ? "库存充足"
              : "仅剩" + goodsInfo.stock + "件商品"
          }}</van-tag>
          <van-tag
            plain
            :type="goodsInfo.is_recommend > 0 ? 'success' : 'danger'"
            >{{ goodsInfo.is_recommend > 0 ? "多人推荐" : "特卖商品" }}</van-tag
          >
        </template>
        <template #footer>
          <van-button icon="goods-collect" size="small" type="warning"
            >收藏</van-button
          >
          <van-button icon="weapp-nav" size="small" type="primary"
            >分享</van-button
          >
        </template>
      </van-card>
    </div>
    <div class="info-content">
      <van-tabs v-model="active">
        <van-tab title="概述">
          <div v-html="goodsInfo.details" class="detail-content"></div>
        </van-tab>
        <van-tab title="热评">
          <detail-comment-info :comment-info="goodsInfo.comments" />
        </van-tab>
        <van-tab title="相关图书">
          <goods-list :goods="recommendGoods" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import { computed, ref } from "vue";
import DetailCommentInfo from "./DetailCommentInfo.vue";
import GoodsList from "components/content/goods/GoodsList.vue";

export default {
  components: {
    DetailCommentInfo,
    GoodsList,
  },
  props: {
    goodsInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    recommend: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props) {
    const imgPreview = ref([]);
    const active = ref(0);
    const recommendGoods = computed(() => {
      return props.recommend;
    });
    console.log(props.recommend);
    const imgClick = () => {
      imgPreview.value.push(props.goodsInfo.cover_url);
      ImagePreview({
        images: imgPreview.value,
        closeable: true,
      });
    };
    return {
      imgClick,
      active,
      recommendGoods,
    };
  },
};
</script>

<style lang='scss'>
.goods-info {
  margin-top: 44px;
  width: 100vw;
  text-align: center;
  position: relative;
  z-index: 999;
  background-color: #fff;
  .detail-content {
    img {
      // width: 200px;
      // padding: 0 20px;
      // padding-right: 10px;
      width: 300px;
      height: 300px;
    }
  }
}
</style>