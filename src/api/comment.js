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

// 获取评论信息
export const getComments = async (productId) => {
  try {
    const data = await http.get(`/comment/allComments?productId=${productId}`);  // 使用查询参数
    return data;
  } catch (error) {
    console.error('获取评论信息:', error);
    throw error; 
  }
}

// 获取未登录状态评论信息
export const getTwoComments = async (productId) => {
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

// 根据likeState状态，点赞或者取消点赞（0为取消点赞， 1为点赞）
export const fetchThumbUp = async (commentId, likeState) => {
  try {
    const data = await http.post(`/comment/like?commentId=${commentId}&likeState=${likeState}`);
    return data; // 返回响应的数据
  } catch (error) {
    console.error('点赞失败:', error);
    throw error; // 抛出错误以便后续处理
  }
};

