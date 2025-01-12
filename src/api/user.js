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

