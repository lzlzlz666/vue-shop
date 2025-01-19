<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo区域 -->
      <div class="logo">
        <router-link to="/">
          <h1>LZ🥳 商城</h1>
        </router-link>
      </div>

      <!-- 登录表单 -->
      <el-card class="login-form">
        <template #header>
          <div class="form-header">
            <span class="title">{{ isLogin ? '账号登录' : '注册账号' }}</span>
            <el-button link type="primary" @click="switchMode">
              {{ isLogin ? '去注册' : '去登录' }}
            </el-button>
          </div>
        </template>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-position="top"
        >
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="formData.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
            />
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="formData.password"
              type="password"
              :prefix-icon="Lock"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>

          <!-- 确认密码（仅注册时显示） -->
          <el-form-item 
            v-if="!isLogin"
            label="确认密码" 
            prop="confirmPassword"
          >
            <el-input 
              v-model="formData.confirmPassword"
              type="password"
              :prefix-icon="Lock"
              placeholder="请再次输入密码"
              show-password
            />
          </el-form-item>

          <!-- 记住密码（仅登录时显示） -->
          <el-form-item v-if="isLogin">
            <div class="remember-forgot">
              <el-checkbox v-model="formData.remember">记住密码</el-checkbox>
              <el-button link type="primary">忘记密码？</el-button>
            </div>
          </el-form-item>

          <!-- 提交按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              class="submit-btn"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ isLogin ? '登录' : '注册' }}
            </el-button>
          </el-form-item>

          <!-- 其他登录方式 -->
          <div class="other-login" v-if="isLogin">
            <div class="divider">
              <span>其他登录方式</span>
            </div>
            <div class="social-login">
              <el-button circle>
                <el-icon><User /></el-icon>
              </el-button>
              <el-button circle>
                <el-icon><Message /></el-icon>
              </el-button>
            </div>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { registerUser, loginUser } from '@/api/user.js' // 导入封装好的注册接口

const router = useRouter()
const formRef = ref(null)
const isLogin = ref(true)
const loading = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  remember: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { 
      required: true, 
      message: '请再次输入密码', 
      trigger: 'blur' 
    },
    { 
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur'
    }
  ]
}

// 切换登录/注册模式
const switchMode = () => {
  isLogin.value = !isLogin.value
  formRef.value?.resetFields()
}

import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();
// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    loading.value = true;
    
    let response;

    // 根据 isLogin 的值选择调用登录或注册接口
    if (isLogin.value) {
      // 调用登录接口
      response = await loginUser(formData.username, formData.password);
      tokenStore.setToken(response);
      ElMessage.success('登录成功');
    } else {
      // 调用注册接口
      response = await registerUser(formData.username, formData.password);
      ElMessage.success('注册成功');
    }

    router.push('/'); // 登录或注册成功后跳转到首页
  } catch (error) {
    console.error('表单验证失败:', error);
    ElMessage.error('操作失败，请重试');
  } finally {
    loading.value = false;
  }
}


</script>


  <style scoped>
  .login-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .login-container {
    width: 100%;
    max-width: 420px;
    padding: 20px;
  }
  
  .logo {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .logo h1 {
    color: #409EFF;
    font-size: 28px;
    margin: 0;
  }
  
  .logo a {
    text-decoration: none;
  }
  
  .login-form {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
  }
  
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .form-header .title {
    font-size: 20px;
    font-weight: bold;
  }
  
  .remember-forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .submit-btn {
    width: 100%;
    padding: 12px 0;
  }
  
  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    color: #999;
  }
  
  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }
  
  .divider span {
    padding: 0 10px;
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .social-login .el-button {
    font-size: 20px;
  }
  
  :deep(.el-form-item__label) {
    padding-bottom: 4px;
  }
  
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
  }
  
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #c0c4cc inset;
  }
  
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #409eff inset;
  }
  </style>