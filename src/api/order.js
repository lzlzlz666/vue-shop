import http from './http'; // 导入封装的 http 实例

export const fetchUserAddressList = async () => {
  try {
    const data = await http.get('/order'); // 使用封装的 http 实例
    return data; // 直接返回数据
  } catch (error) {
    console.error('获取订单地址信息失败:', error);
    throw error; // 继续抛出错误
  }
};

// 切换默认地址
export const updateDefaultAddress = async (selectedAddressId) => {
  try {
    const data = await http.post(`/order/updateDefaultAddress?userAddressId=${selectedAddressId}`);
    return data; // 返回成功的消息
  } catch (error) {
    console.error('更新默认地址失败:', error);
    throw error; // 继续抛出错误
  }
};

// 新增地址
export const addUserAddress = async (newAddress) => {
  try {
    const data = await http.post('/order/addUserAddress', newAddress);
    return data;
  } catch (error) {
    console.error('添加地址失败:', error);
    throw error;
  }
};

// 创建订单
export const createOrder = async (orderData) => {
  try {
    const data = await http.post('/order/generateOrder', orderData);
    return data; // 返回订单生成结果
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error; // 继续抛出错误
  }
};

// 更新订单状态（支付成功）
export const updateOrderStatus = async (orderList) => {
  try {
    const data = await http.post('/order/purchaseOrder', orderList);
    return data; // 返回更新结果
  } catch (error) {
    console.error('更新订单状态失败:', error);
    throw error; // 继续抛出错误
  }
};