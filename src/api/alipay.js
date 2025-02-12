import http from './http'; 

// 支付接口
export const pay = async (alipayData) => {
  try {
    // 构建查询字符串
    const queryString = new URLSearchParams(alipayData).toString();
    // 构建完整的请求 URL
    const url = `/alipay/pay?${queryString}`;
    // 发送 POST 请求
    const data = await http.get(url);
    return data; // 返回支付页面的 HTML 内容
  } catch (error) {
    console.error('发起支付失败:', error);
    throw error; // 继续抛出错误
  }
};


// 支付宝支付回调接口
export const handlePayNotify = async (notifyData) => {
  try {
    const data = await http.post('/alipay/notify', notifyData);
    return data; // 返回成功的通知响应
  } catch (error) {
    console.error('处理支付回调失败:', error);
    throw error;
  }
};

export const checkPaymentResult = async (id) => {
  try {
    const data = await http.get(`/alipay/order/status/${id}`);
    return data; // 直接返回数据
  } catch (error) {
    console.error('获取产品详情失败:', error);
    throw error; // 继续抛出错误
  }
};

