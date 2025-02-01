import http from './http'; 

// 提交评论信息
export const sendComment = async (comment) => {
  try {
    const data = await http.post('/comment/send', comment);
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

// 根据id获取评论信息
export const fetchCommentById = async (id) => {
  try {
    const data = await http.get(`/comment/${id}`);
    return data; // 直接返回数据
  } catch (error) {
    console.error('获取评论失败:', error);
    throw error; // 继续抛出错误
  }
};
