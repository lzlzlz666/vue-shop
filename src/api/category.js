import http from './http'; // 导入封装的 http 实例

export const fetchCategories = async () => {
  try {
    const data = await http.get('/category'); // 使用封装的 http 实例
    return data; // 直接返回数据
  } catch (error) {
    console.error('获取分类数据失败:', error);
    throw error; // 继续抛出错误
  }
};