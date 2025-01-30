<template>
  <div>
    <!-- 提交评论 -->
    <div class="comment-input">
      <el-input
        v-model="newComment.content"
        placeholder="请输入评论内容"
        rows="4"
        type="textarea"
      />
      <el-button type="primary" @click="submitComment">提交评论</el-button>
    </div>

    <div class="comments-header">
      评论列表
    </div>

    <div class="comments-list">
      <div
        class="comment-item"
        v-for="item in comments"
        :key="item.commentId"
      >
        <div class="avatar">
          <el-avatar
            :src="item.userPic ? item.userPic : defaultUserPic"
            :style="{ width: '40px', height: '40px' }" 
          ></el-avatar>
        </div>
        <div class="comment-content">
          <div class="username">{{ item.username }}</div>
          <div class="content">{{ item.content }}</div>
          <div class="createTime">{{ formatDate(item.createTime) }}</div>
        </div>

      </div>
      <div style="background:linear-gradient(to left,#FFFFFF,#067859,#FFFFFF);height:1px;"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElInput, ElButton, ElMessage, ElNotification, ElAvatar } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { useTokenStore } from '@/stores/token';
import { sendComment, getComments } from '@/api/comment';
import defaultUserPic from '@/assets/default-user.png'; // 默认头像路径

// 获取当前路由
const tokenStore = useTokenStore();
const route = useRoute();
const router = useRouter();

const productId = route.params.id;

const comments = ref([]);

// 定义 newComment 变量
const newComment = ref({
  productId: route.params.id || null, // 从路由参数中获取 productId
  content: '',
  like: 0,
  pid: null,
  targetUserId: null,
  target: ''
});

// 格式化时间的方法
const formatDate = (dateString) => {
  const date = new Date(dateString); // 创建 Date 对象
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24小时制
  };
  return date.toLocaleString('zh-CN', options); // 格式化日期为中文标准格式
};

const fetchComments = async () => {
  try {
    const data = await getComments(productId);
    comments.value = data;
  } catch (error) {
    ElMessage.error('获取评论失败，请稍后重试');
  }
};

// 提交评论的方法
const submitComment = async () => {
  if (!newComment.value.content.trim()) {
    ElMessage.warning('评论内容不能为空');
    return;
  }

  if (!tokenStore.token) {
    ElNotification({
      title: '温馨提醒：',
      message: '请先登录！',
      type: 'error',
    });
    router.push('/login');
  } else {
    try {
      const data = await sendComment(newComment.value);
      ElMessage.success('发送评论成功！');
      fetchComments(); // 刷新评论列表
      newComment.value.content = ''; // 清空输入框
    } catch (error) {
      ElMessage.error('评论提交失败，请稍后重试');
    }
  }
};

onMounted(async () => {
  fetchComments();
});
</script>

<style scoped lang="scss">
.comment-input {
  margin-top: 20px;
  margin-bottom: 20px;

  .el-input {
    width: 100%;
  }

  .el-button {
    margin-top: 10px;
    width: 100%;
  }
}

.comments-header {
  margin: 20px 0;
  font-size: 24px;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  text-align: left;
}

.comments-list {
  margin: 20px 0;
  text-align: left;
}

.comment-item {
  padding: 10px 0;
  display: flex;
  align-items: flex-start;
}

.avatar {
  width: 50px;
  margin-left: 20px;
}

.comment-content {
  flex: 1;
  margin-top: 8px;
  margin-left: 10px;

  .username {
    font-size: 16px;
    color: #787575;
  }

  .content {
    margin-top: 5px;
    font-size: 15px;
    color: #302d2d;
    line-height: 1.5;
  }

  .createTime {
    margin-top: 5px;
    font-size: 14px;
    color: #787575;
  }
}

</style>