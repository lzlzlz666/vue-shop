import http from './http'; 

// 提交评论信息
export const sendComment = async (comment) => {
  try {
    const data = await http.post('/comment', comment);
    return data;
  } catch (error) {
    console.error('提交评论信息:', error);
    throw error; 
  }
}

// 提交评论信息
export const getComments = async (productId) => {
  try {
    const data = await http.get(`/comment?productId=${productId}`);  // 使用查询参数
    return data;
  } catch (error) {
    console.error('获取评论信息:', error);
    throw error; 
  }
}
