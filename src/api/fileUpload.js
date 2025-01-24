import http from './http'; 

// 上传图片接口
export const uploadImage = async (formData) => {
  try {
    const data = await http.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return data; // 返回上传后的图片 URL
  } catch (error) {
    console.error('图片上传失败:', error);
    throw error;
  }
};

