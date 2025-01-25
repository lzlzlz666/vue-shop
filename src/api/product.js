import http from './http'; // 导入封装的 http 实例

// 获取商品列表，支持分页和筛选条件
export const fetchProductList = async (pageNum, pageSize, categoryId,
                                      productName = '', minPrice = null, maxPrice = null) => {
  try {
    // 拼接查询参数
    const params = {
      pageNum, // 当前页
      pageSize, // 每页显示数量
      categoryId,
      productName, // 商品名称
      minPrice, // 最小价格
      maxPrice, // 最大价格
    };

    // 请求商品列表数据
    const data = await http.get('/product/list', { params });
    return data; // 返回商品数据
  } catch (error) {
    console.error('获取商品列表失败:', error);
    throw error; // 抛出错误
  }
};

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

export const fetchLikeProducts = async (limit) => {
  try {
    const data = await http.get(`/product/like?limit=${limit}`);
    return data; // 直接返回数据
  } catch (error) {
    console.error('获取产品详情失败:', error);
    throw error; // 继续抛出错误
  }
};

