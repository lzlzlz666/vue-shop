import http from './http'; // 导入封装的 http 实例

export const fetchHotProducts = async () => {
  try {
    const data = await http.get('/product/hot'); // 使用封装的 http 实例
    return data; // 直接返回数据
  } catch (error) {
    console.error('获取热销商品失败:', error);
    throw error; // 继续抛出错误
  }
};

export const fetchProductDetail = async (id) => {
  try {
    const data = await http.get(`/product/${id}`);
    return data; // 直接返回数据
  } catch (error) {
    console.error('获取产品详情失败:', error);
    throw error; // 继续抛出错误
  }
};
