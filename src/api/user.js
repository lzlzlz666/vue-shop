import http from './http'; 

// 注册接口
export const registerUser = async (username, password) => {
  try {
    const data = await http.post('/user/register', {
      username,
      password
    });
    return data; // 返回注册成功的响应数据
  } catch (error) {
    console.error('注册失败:', error);
    throw error; // 继续抛出错误
  }
};

// 登录接口
export const loginUser = async (username, password) => {
  try {
    const data = await http.post('/user/login', {
      username,
      password
    });
    return data; // 返回注册成功的响应数据
  } catch (error) {
    console.error('注册失败:', error);
    throw error; // 继续抛出错误
  }
};

// 用户信息接口
export const getUserInfo = async () => {
  try {
    // 发送 GET 请求获取用户信息
    const data = await http.get('/user');
    return data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error; 
  }
};

// 修改用户信息
export const updateUserInfo = async (userInfo) => {
  try {
    const data = await http.post('/user/userInfo', userInfo);
    return data;
  } catch (error) {
    console.error('修改用户信息失败:', error);
    throw error; 
  }
}

// 更新用户头像接口
export const updateUserAvatar = async (avatarUrl) => {
  try {
    const data = await http.patch(`/user/updateAvatar?avatarUrl=${avatarUrl}`);
    return data; // 返回更新头像的响应
  } catch (error) {
    console.error('更新头像失败:', error);
    throw error;
  }
};

// 根据id获取用户信息
export const fetchUserById = async (id) => {
  try {
    const data = await http.get(`/user/${id}`);
    return data; // 直接返回数据
  } catch (error) {
    console.error('获取用户失败:', error);
    throw error; // 继续抛出错误
  }
};
