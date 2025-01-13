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
                <el-avatar :size="310" style="margin-left: 100px;" src="https://picsum.photos/200" />
                <el-button type="primary" class="upload-btn" icon="el-icon-upload2">上传头像</el-button>
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
                    <el-input v-model="userInfo.phone" />
                  </el-form-item>

                  <el-form-item label="性别">
                    <el-radio-group v-model="userInfo.gender">
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
import { ref } from 'vue'
import NavHeader from '../../components/Header.vue'
import NavFooter from '../../components/Footer.vue'

const userInfo = ref({
  username: 'LZ商户',
  nickname: '商户昵称',  // 新增昵称字段
  email: 'lzshop@example.com',
  phone: '1234567890',
  gender: '男',
  birthday: '',
  address: '某地某街道'
})

const saveInfo = () => {
  // 保存用户信息的逻辑
  console.log('用户信息已保存:', userInfo.value)
}
</script>

<style lang="scss" scoped>
.profile-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 1200px;
  margin: 20px auto;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.upload-btn {
  height: 50px;
  margin-top: 30px;
  margin-left: 100px;
  font-size: 14px;
  width: 10px;
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
  
  .upload-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .profile-card {
    padding: 15px;
  }
  
  .el-button {
    padding: 10px;
  }
}
</style>
