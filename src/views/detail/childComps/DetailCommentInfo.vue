<template>
  <div v-if="commentInfo.length !== 0" class="comment-info">
    <div class="info-header">
      <div class="header-title">用户评价</div>
      <div class="header-more">
        更多
        <i class="arrow-right"></i>
      </div>
    </div>
    <div v-for="(item, index) in commentInfo" :key="index">
      <div class="info-user">
        <img :src="item.user.avatar_url" alt="" />
        <span>{{ item.user.name }}</span>
      </div>
      <div class="info-detail">
        <p>{{ item.content }}</p>
        <div class="info-other">
          <span class="date">{{ item["created_at"] }}</span>
          <span>{{ item.style }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="placeholder">
    <img src="~assets/image/no-comment.png" alt="" />
    <p>暂无评论~做第一个评论的人吧</p>
  </div>
</template>

<script>
export default {
  props: {
    commentInfo: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.comment-info {
  padding: 5px 12px;
  color: #333;
  border-bottom: 5px solid #f2f5f8;
  text-align: left;
}
.placeholder {
  height: 200px;
  width: 100vw;
  font-size: 14px;
}
.placeholder img {
  height: 150px;
}
.info-header {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.header-title {
  float: left;
  font-size: 15px;
}
.header-more {
  float: right;
  margin-right: 10px;
  font-size: 13px;
}
.info-user {
  padding: 15px 0;
}
.info-user img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}
.info-user span {
  position: relative;
  font-size: 15px;
  top: -15px;
  margin-left: 10px;
}
.info-detail {
  padding: 0 5px;
}
.info-detail p {
  font-size: 14px;
  color: #777;
  line-height: 1.5;
}
.info-detail .info-other {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}
.info-other .date {
  margin-right: 8px;
}
.info-imgs {
  margin-top: 10px;
}
.info-imgs img {
  width: 70px;
  height: 70px;
  margin-right: 5px;
}
</style>
