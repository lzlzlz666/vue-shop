<template>
  <div>
    <el-container>
      <el-header>
        <nav-header />
      </el-header>

      <el-main>
        <div class="profile-container">
          <el-row>
            <!-- 头像区域 -->
            <el-col :span="24" :xs="24" :sm="8" :md="6">
              <div class="avatar">
                <!-- 点击头像即可上传 -->
                <el-avatar
                  :size="350"
                  style="margin-left: 100px; margin-top: 80px; position: relative;" 
                  :src="userInfo.userPic"
                />

                <!-- 更新图片 -->
                <img
                  src="@/assets/update-img.png"
                  alt="更新头像"
                  class="update-img"
                  @click="triggerFileInput"
                />
                
                <!-- 隐藏的文件上传控件 -->
                <input
                  type="file"
                  ref="fileInput"
                  style="display: none"
                  @change="handleFileChange"
                  accept="image/*"
                />
              </div>
            </el-col>

            <!-- 个人信息 -->
            <el-col :span="24" :xs="24" :sm="16" :md="18">
              <el-card class="profile-card">
                <h2>个人信息</h2>
                <el-form :model="userInfo" label-width="80px">
                  <el-form-item label="用户名">
                    <el-input v-model="userInfo.username" readonly />
                  </el-form-item>

                  <el-form-item label="昵称">
                    <el-input v-model="userInfo.nickname" />
                  </el-form-item>

                  <el-form-item label="邮箱">
                    <el-input v-model="userInfo.email" readonly />
                  </el-form-item>

                  <el-form-item label="手机号">
                    <el-input v-model="userInfo.phoneNumber" />
                  </el-form-item>

                  <el-form-item label="性别">
                    <el-radio-group v-model="userInfo.sex">
                      <el-radio label="男">男</el-radio>
                      <el-radio label="女">女</el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item label="生日">
                    <el-date-picker v-model="userInfo.birthday" type="date" placeholder="选择生日" />
                  </el-form-item>

                  <el-form-item label="地址">
                    <el-input v-model="userInfo.address" />
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="saveInfo" class="save-btn">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>

      <el-footer>
        <nav-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import NavHeader from '../../components/Header.vue'
import NavFooter from '../../components/Footer.vue'
import { getUserInfo, updateUserInfo, updateUserAvatar } from '@/api/user'
import { uploadImage } from '@/api/fileUpload'
import { ElMessage, ElNotification  } from 'element-plus'

// 定义 ref 用来获取文件输入框
const fileInput = ref(null);
const userInfo = ref({
  username: '',
  nickname: '',
  email: '',
  phoneNumber: '',
  sex: '',
  birthday: '',
  address: '',
  userPic: ''
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const data = await getUserInfo(); // 调用封装好的获取用户信息的接口
    userInfo.value = {
      ...data, // 使用从接口获取的数据来更新 userInfo
      sex: data.sex === 1 ? '男' : '女' // 将 sex 从 1/0 转换为 '男'/'女'
    };
  } catch (error) {
    console.error('获取用户信息时出错:', error);
  }
};

const saveInfo = async () => {
  try {
    // 转换性别为数字形式
    const updatedUserInfo = {
      ...userInfo.value,
      sex: userInfo.value.sex === '男' ? 1 : 0
    };
    const data = await updateUserInfo(updatedUserInfo);
    // ElMessage.success('用户信息修改成功！');
    ElNotification({
    title: 'Success',
    message: '用户信息修改成功！',
    type: 'success',
  })
  } catch (error) {
    console.error('保存用户信息失败:', error);
  }
};


// 触发文件上传
const triggerFileInput = () => {
  // 通过 ref 获取到隐藏的文件输入框并触发点击事件
  fileInput.value.click();
};

// 处理文件选择
// const handleFileChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       userInfo.value.userPic = e.target.result; // 更新头像
//     };
//     reader.readAsDataURL(file); // 读取文件并将其显示为图片
//   }
// };

// 处理文件选择
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // 上传图片并获取 URL
    try {
      // 调用上传图片接口
      const formData = new FormData();
      formData.append('file', file);
      const data = await uploadImage(formData);
      const avatarUrl = data;  // 假设返回的 URL 是响应数据中的 `data`

      // 调用更新头像接口
      await updateUserAvatar(avatarUrl);  // 传递上传后图片的 URL

      // 更新头像展示
      userInfo.value.userPic = avatarUrl;
      ElNotification({
        title: 'Success',
        message: '头像更新成功！',
        type: 'success',
      });
    } catch (error) {
      console.error('头像上传失败:', error);
      ElNotification({
        title: 'Error',
        message: '头像上传失败！',
        type: 'error',
      });
    }
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style lang="scss" scoped>
.profile-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 1200px;
  margin: 20px auto;
  margin-bottom: 0px;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  position: relative;  /* 设置为 relative 定位 */
}

.update-img {
  position: absolute;
  bottom: -10px;
  right: -90px;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

.profile-card {
  margin-left: 140px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 24px;
  color: #333;
  margin-left: 60px;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-input, .el-date-picker, .el-radio-group {
  width: 100%;
}

.el-button {
  width: 100%;
  padding: 12px;
}

.save-btn {
  font-size: 16px;
  font-weight: bold;
  background-color: #409EFF;
  border-color: #409EFF;
}

.el-row {
  display: flex;
  justify-content: space-between;
}

.el-col {
  padding: 10px;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
  }
  
  .avatar {
    margin-bottom: 15px;
  }
  
  .profile-card {
    padding: 15px;
  }
  
  .el-button {
    padding: 10px;
  }
}
</style>
