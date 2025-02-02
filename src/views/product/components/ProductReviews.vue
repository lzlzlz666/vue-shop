<template>
  <div>
    <!-- 提交评论 -->
    <div class="comment-input" ref="commentInput">
      <div class="head">
        <el-avatar
          :src="loginUser.userPic ? loginUser.userPic : defaultUserPic"
          :style="{ width: '50px', height: '50px'}" 
        ></el-avatar>
        <el-input
          class="input"
          :class="{ inputAddition: showFoot }"
          v-model="newComment.content"
          placeholder="你猜我的评论区在等待谁"
          rows="2"
          type="textarea"
          @focus="showFoot = true"
        />
      </div>
      <div class="foot" v-show="showFoot">
        <!-- 使用 vue3-emoji-picker 选择表情 -->
        <vue3-emoji-picker
          v-if="showEmojiPicker"
          @select="onEmojiSelected"
          class="emoji-picker"
        />
        <div class="expression" @click="showEmojiPicker = !showEmojiPicker">
          <img src="@/assets/expression.png" alt="表情" />
        </div>
        <div class="toSomeBody">
          <img src="@/assets/to-somebody.png" alt="@某人" />
        </div>
        <div class="uploadImage">
          <img src="@/assets/upload-image.png" alt="上传图片" />
        </div>
        <el-button class="button" type="primary" @click="submitComment">发布</el-button>
      </div>
    </div>

    <div class="comments-header">
      评论列表
    </div>

    <div class="comments-list">
      <div v-if="comments.length === 0" class="empty-comments">
        <div class="empty-text">💖期待您的评论哦💖</div>
        <img src="@/assets/empty-comments.png" alt="评论为空" />
      </div>
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

        <!-- 评论内容 -->
        <div class="comment-content">
          <div class="main-comment-item">
            <div class="head">
              <div class="username">{{ item.username }}</div>
              <img class="floorHost" src="@/assets/floor-host.png" alt="楼主">
            </div>
            <div class="content">{{ item.content }}</div>
            <div class="timeLine">
              <div class="createTime">{{ formatDate(item.createTime) }}</div>
              <!-- 点赞部分 -->
              <div class="like-container">
                <img 
                  :src="getThumbUpSrc(item)"  
                  alt="点赞" 
                  class="like-icon"
                  @click="clickToLogin; thumbUpOrNot(item)"
                  @mouseover="isHovered = true; hoveredCommentId = item.commentId" 
                  @mouseleave="isHovered = false; hoveredCommentId = null" /> 
                <div class="like-count">{{ item.like }}</div>
              </div>
              <div class="reply" @click="reply(item.commentId)"> 回复 </div>
            </div>
          </div>

          <!-- 子评论 -->
          <div v-if="item.listComments && item.listComments.length > 0">
            <div class="sub-comments">
              <div
                v-for="subItem in item.listComments.slice(0, item.showMore ? item.listComments.length : 2)"
                :key="subItem.commentId"
                class="sub-comment-item"
              >
                <div class="sub-comment-avatar">
                  <el-avatar
                    :src="subItem.userPic ? subItem.userPic : defaultUserPic"
                    :style="{ width: '24px', height: '24px' }"
                  ></el-avatar>
                </div>
                <div class="sub-comment-content">
                  <div class="sub-username">{{ subItem.username }}</div>
                  <div class="sub-content">
                    <div>
                      <span style="font-size : 14px;">回复&nbsp;</span>
                      <span style="color: rgb(0, 162, 255);">@{{ subItem.target }} &nbsp;</span> 
                      {{ subItem.content }}
                    </div>
                  </div>
                  <div class="sub-timeLine">
                    <div class="sub-createTime">{{ formatDate(subItem.createTime) }}</div>
                    <div class="sub-like-container">
                      <img 
                        :src="getThumbUpSrc(subItem)" 
                        alt="点赞" 
                        class="sub-like-icon"
                        @click="thumbUpOrNot(subItem)"
                        @mouseover="isHovered = true; hoveredCommentId = subItem.commentId" 
                        @mouseleave="isHovered = false; hoveredCommentId = null" /> 
                      <div class="sub-like-count">{{ subItem.like }}</div>
                    </div>
                    <div class="sub-reply" @click="reply(subItem.commentId)"> 回复 </div>
                  </div>
                </div>
              </div>
              <div v-if="item.listComments.length > 2 && item.showMore === false" class="show-more" @click="toggleShowMore(item)">
                共 {{ item.listComments.length }} 条评论，点击展开
              </div>
            </div>
          </div>

          <div 
            v-if="replyComment.replyCommentId !== item.commentId && 
                  !(item.listComments && item.listComments.some(subItem => subItem.commentId === replyComment.replyCommentId))"
            class="underline"
          ></div>

          <!-- 回复框 -->
          <div 
            v-if="replyComment.replyCommentId === item.commentId || 
                  (item.listComments && item.listComments.some(subItem => subItem.commentId === replyComment.replyCommentId))"
            class="reply-input"
          >
            <div class="head">
              <div class="avatar">
                <el-avatar
                    :src="loginUser.userPic ? loginUser.userPic : defaultUserPic"
                    :style="{ width: '50px', height: '50px'}" 
                  ></el-avatar>
                </div>
                <el-input
                  class="input"
                  rows="2"
                  v-model="subNewComment.content"
                  :placeholder="'回复 @' + replyComment.replyName" 
                  type="textarea"
                />
            </div>
            <div class="foot">
              <!-- 使用 vue3-emoji-picker 选择表情 -->
              <vue3-emoji-picker
                v-if="showSubEmojiPicker"
                @select="onSubEmojiSelected"
                class="emoji-picker"
              />
              <div class="expression" @click="showSubEmojiPicker = ! showSubEmojiPicker">
                <img src="@/assets/expression.png" alt="表情" />
              </div>
              <div class="toSomeBody">
                <img src="@/assets/to-somebody.png" alt="@某人" />
              </div>
              <el-button 
                class="button" type="primary" 
                @click="submitReply(replyComment.replyCommentId, item.commentId)">
                发布
              </el-button>
            </div>

            <div class="underline"></div>
          </div>

        </div>
      </div>
      <div>
        <div class="buttonArea" v-if="loginShow">
          <el-button @click="login" class="loginButton">
            点击登录 ,  查看或发表所有的评论
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElInput, ElButton, ElMessage, ElNotification, ElAvatar } from 'element-plus';
import Vue3EmojiPicker from 'vue3-emoji-picker';
import { useRouter, useRoute } from 'vue-router';
import { useTokenStore } from '@/stores/token';
import { getUserInfo, fetchUserById } from '@/api/user';
import { sendComment, getComments, getTwoComments, fetchCommentById, fetchThumbUp } from '@/api/comment';

import defaultUserPic from '@/assets/default-user.png'; // 默认头像路径
import noThumbUp from '@/assets/no-thumb-up.png'
import thumbUpHover from '@/assets/thumb-up-hover.png';
import thumbUp from '@/assets/thumb-up.png'

// 获取当前路由
const tokenStore = useTokenStore();
const route = useRoute();
const router = useRouter();

const productId = route.params.id;

const loginShow = ref(false); // 初始为登录，显示false,登录的话不展示
const comments = ref([]);
const loginUser = ref({});  // 登录的用户

const showFoot = ref(false); // 总评论是否显示foot区域
const isHovered = ref(false); // 鼠标是否悬浮在点赞图标或者点赞的数量上
const hoveredCommentId = ref(null);  // 用来存储当前悬浮的评论ID

const showEmojiPicker = ref(false); // 是否显示表情框
const showSubEmojiPicker = ref(false);

const replyComment = ref({
  replyCommentId: '',
  replyName: ''
});

// 定义 newComment 变量
const newComment = ref({
  productId: route.params.id || null, // 从路由参数中获取 productId
  content: '',
  like: 0,
  pid: null,
  targetUserId: null,
});

// 定义 subNewComment 变量
const subNewComment = ref({
  productId: route.params.id || null, // 从路由参数中获取 productId
  content: '',
  like: 0,
  pid: null,
  targetUserId: null,
});

// 处理表情选择
const onEmojiSelected = (emoji) => {
  console.log(emoji)
  newComment.value.content += emoji.i; // 插入选择的表情到消息框
  showEmojiPicker.value = false; // 隐藏表情选择框
};

const onSubEmojiSelected = (emoji) => {
  console.log(emoji)
  subNewComment.value.content += emoji.i; // 插入选择的表情到消息框
  showSubEmojiPicker.value = false; // 隐藏表情选择框
};

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
  
  // 格式化日期为中文标准格式
  let formattedDate = date.toLocaleString('zh-CN', options);

  // 替换日期部分的 / 为 -（例如：2024/01/01 -> 2024-01-01）
  formattedDate = formattedDate.replace(/\//g, '-');

  return formattedDate;
};

const getThumbUpSrc = (item) => {
  if(item.isLike === 1) {
    return thumbUp;
  }
  return isHovered.value && hoveredCommentId.value === item.commentId ? thumbUpHover : noThumbUp;
};

const thumbUpOrNot = async (item) => {
  console.log(item);
  if(item.isLike === 0) {
    const data = await fetchThumbUp(item.commentId, 1);
    ElMessage.success('点赞成功！');
  } else if (item.isLike === 1) {
    const data = await fetchThumbUp(item.commentId, 0);
    ElMessage.success('取消点赞成功！');
  }
  const data = await fetchComments();
}

const fetchUserInfo = async () => {
  const data = await getUserInfo();
  loginUser.value = data;
}

const fetchComments = async () => {
  if (!tokenStore.token) {
    // 未登录
    const data = await getTwoComments(productId);
    comments.value = data;
    loginShow.value = true;
  } else {
    try {
      const data = await getComments(productId);
      comments.value = data.map(item => ({
        ...item,
        showMore: false, // 为每个评论项添加 showMore 属性
      }));
    } catch (error) {
      ElMessage.error('获取评论失败，请稍后重试');
    }
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

const reply = (commentId) => {
  if (replyComment.value.replyCommentId !== commentId) {
    replyComment.value.replyCommentId = commentId; // 设置当前回复的评论ID

    // 遍历主评论
    for (let i = 0; i < comments.value.length; i++) {
      if (comments.value[i].commentId === commentId) {
        // 如果主评论匹配
        replyComment.value.replyName = comments.value[i].username;
        return;
      }
      // 遍历子评论
      if (comments.value[i].listComments) {
        for (let j = 0; j < comments.value[i].listComments.length; j++) {
          if (comments.value[i].listComments[j].commentId === commentId) {
            // 如果子评论匹配
            replyComment.value.replyName = comments.value[i].listComments[j].username;
            return;
          }
        }
      }
    }
  } else {
    replyComment.value.replyCommentId = '';
    replyComment.value.replyName = ''; // 清空回复的用户名
  }
};

// 获取 comment-input 的 DOM 元素
const commentInput = ref(null);
const emojiPicker = ref(null);

// 监听点击事件
const handleClickOutside = (event) => {
  // 如果点击的元素不在 commentInput 内部，则隐藏 showFoot
  if (!commentInput.value.contains(event.target)) {
    showFoot.value = false;
    showEmojiPicker.value = false;
  }
};

const login = () => {
  router.push('/login');
}

// 发布子评论
const submitReply = async (commentId, pid) => {
  const data = await fetchCommentById(commentId);
  subNewComment.value.pid = pid;

  const user = await fetchUserById(data.userId);

  subNewComment.value.target = data.username;
  subNewComment.value.targetUserId = data.userId;
  const data2 = await sendComment(subNewComment.value);
  ElMessage.success('发送评论成功！');
  replyComment.value.replyCommentId = '';
  replyComment.value.replyName = ''; // 清空回复的用户名
  subNewComment.value.content = '';
  fetchComments();
};

const toggleShowMore = (item) => {
  item.showMore = !item.showMore;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchComments();
  if (tokenStore.token) fetchUserInfo();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.comment-input {
  margin-top: 20px;
  margin-bottom: 20px;

  .head {
    position: relative;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;

    .avatar {
      width: 50px;
      margin-left: 10px;
      margin-top: 30px;
    }

    .input {
      position: absolute;
      left: 80px;
      bottom: 0px;
      width: 990px; 
      align-items: center; 

      :deep(.el-textarea__inner) {
        background-color: #f0f0f0; /* 设置为灰色 */
      }

      /* 鼠标悬停时修改 el-textarea__inner 的背景色 */
      &:hover :deep(.el-textarea__inner) {
        background-color: white; /* 悬停时的背景色 */
      }
    }

    .inputAddition {
      :deep(.el-textarea__inner) {
        background-color: white; /* 悬停时的背景色 */
      }
    }

  }

  .foot {
    position: relative;
    margin-top: 10px;
    margin-left: 80px;
    display: flex; /* 使用 flexbox 布局 */
    align-items: center; /* 垂直居中对齐 */
    gap: 10px; /* 元素之间的间距，可以根据需要调整 */

    .emoji-picker {
      position: absolute; /* 绝对定位 */
      top: 30px; /* 设置表情选择器距离底部的距离 */
      left: 10px; /* 将表情选择器水平居中 */
      z-index: 100; /* 确保表情选择器显示在其他元素上面 */
    }
  
    .expression, .toSomeBody, .uploadImage {
      width: 32px;
      height: 26px;
      display: flex;
      justify-content: center; /* 水平居中对齐图片 */
      align-items: center; /* 垂直居中对齐图片 */
      border: 0.3px solid #ccc; /* 添加灰色边框 */
      border-radius: 5px; /* 可选，设置圆角 */
      cursor: pointer;
    }
  
    .expression img, .toSomeBody img, .uploadImage img {
      width: 14px; 
      height: 14px; 
    }

    .button {
      position: relative;
      left: 804px;
    }
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
  position: relative;

  .empty-comments {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
    height: 320px; /* 根据需要调整高度 */
    text-align: center; /* 文本居中 */
  }
  
  .empty-text {
    font-size: 20px;
    color: #787575;
    margin-bottom: 20px; /* 文字与图片之间的间距 */
  }
  
  .empty-comments img {
    width: 180px; /* 图片宽度 */
    height: auto; /* 图片高度自适应 */
  }

  .buttonArea {
    position: absolute;
    width: 100%;
    height: 400px;
    bottom: 60px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)); /* 从上到下透明度从 0 到 1 */
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: flex-end; /* 垂直沉底 */


    .loginButton {
      position: absolute;
      width: 1000px;
      height: 50px;
      bottom: -30px;
      background-color: rgb(181, 222, 247);
      color: rgb(60, 123, 231);
    }
  }

}

.comment-item {
  position: relative;
  padding: 10px 0;
  display: flex;
}

.avatar {
  width: 50px;
  margin-left: 20px;
}

.comment-content {
  flex: 1;
  margin-top: 8px;
  margin-left: 10px;

  .main-comment-item {
    .head {
      display: flex;
      gap: 10px;

      .username {
        margin-top: 2px;
        font-size: 14px;
        color: #787575;
      }

      .floorHost {
        margin-top: 1px;
        width: 38px;
        height: 22px;
      }
    }

    .content {
      margin-top: 10px;
      font-size: 15px;
      color: #302d2d;
      line-height: 1.5;
    }

    .timeLine {
      position: relative;
      display: flex;
      align-items: center; /* 垂直居中对齐 */
      gap: 10px; /* 给时间和回复之间留点间距 */

      .createTime {
        margin-top: 10px;
        font-size: 13px;
        color: #787575;
      }

      .like-container {
        display: flex;
        align-items: center;
        gap: 5px; /* 图标和数字之间的间隔 */
        margin-top: 6px;

        .like-icon {
          width: 18px; 
          height: 18px;
          cursor: pointer;
        }
        
        .like-count {
          margin-top: 2px;
          font-size: 14px;
          color: #787575; /* 点赞数颜色 */
        }
      }
      
      .reply {
        position: absolute;
        left: 190px;
        top: 6px;
        font-size: 13px;
        color: #787575; 
        cursor: pointer;
        transition: color 0.3s ease;
      }  

      .reply:hover {
        color: rgb(0, 162, 255); /* 悬浮时变为蓝色 */
      }
    }
  }

  .sub-comments {
    margin-top: 20px;
  }

  .sub-comment-item {
    display: flex; /* 使用 flex 布局 */
    align-items: flex-start; /* 垂直对齐方式 */
    margin-top: 10px;
  
    .sub-comment-avatar {
      margin-right: 10px; /* 头像与评论内容之间的间距 */
    }
  
    .sub-comment-content {
      flex: 1; /* 占据剩余空间 */
      .sub-username {
        margin-top: 2px;
        font-size: 14px;
        color: #787575;
      }
  
      .sub-content {
        margin-top: 8px;
        font-size: 15px;
        color: #302d2d;
        line-height: 1.5;
      }
  
      .sub-timeLine {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
  
        .sub-createTime {
          font-size: 13px;
          color: #787575;
        }
  
        .sub-like-container {
          display: flex;
          align-items: center;
          gap: 5px;
  
          .sub-like-icon {
            width: 18px;
            height: 18px;
            cursor: pointer;
          }
  
          .sub-like-count {
            font-size: 14px;
            color: #787575;
          }
        }
  
        .sub-reply {
          margin-top: -1px;
          margin-left: 20px;
          font-size: 13px;
          color: #787575;
          cursor: pointer;
          transition: color 0.3s ease;
        }
  
        .sub-reply:hover {
          color: rgb(0, 162, 255);
        }
      }
    }
  }

  .show-more {
    margin-top: 12px;
    cursor: pointer;
    color: #787575;
    font-size: 13px;
    text-align: left;
    transition: color 0.3s ease;
  }

  .show-more:hover {
    color: rgb(0, 162, 255);
  }

  .underline {
    margin-top: 20px;
    border-bottom: 1px solid #ccc;
    width: 100%;
  }

  .reply-input {
    margin-top: 10px;

    .head {
      position: relative;
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;

      .avatar {
        width: 50px;
        margin-left: 10px;
        margin-top: 30px;
      }
  
      .input {
        position: absolute;
        left: 80px;
        bottom: -10px;
        width: 900px; 
      }
    }

    .foot {
      position: relative;
      margin-top: 30px;
      margin-left: 80px;
      display: flex; /* 使用 flexbox 布局 */
      align-items: center; /* 垂直居中对齐 */
      gap: 10px; /* 元素之间的间距，可以根据需要调整 */

      .emoji-picker {
        position: absolute; /* 绝对定位 */
        top: 30px; /* 设置表情选择器距离底部的距离 */
        left: 10px; /* 将表情选择器水平居中 */
        z-index: 100; /* 确保表情选择器显示在其他元素上面 */
      }
    
      .expression, .toSomeBody {
        width: 32px;
        height: 26px;
        display: flex;
        justify-content: center; /* 水平居中对齐图片 */
        align-items: center; /* 垂直居中对齐图片 */
        border: 0.3px solid #ccc; /* 添加灰色边框 */
        border-radius: 5px; /* 可选，设置圆角 */
        cursor: pointer;
      }
    
      .expression img, .toSomeBody img {
        width: 14px; 
        height: 14px; 
      }

      .button {
        position: relative;
        left: 760px;
      }
    }    

  }
}

</style>