
、history stock_totalQuantity和totalQuantity重复？

、微信小程序订单 显示 商品快照
、discountAmount_custom 是否保留，现在只有预订的未付款状态才有用

、数据库字段 amount 数量和金额冲突

、订单信息从接口获取


、web订单详情 以及 订单操作   web的订单要有人 完结人+

、如果用户在下单或购买的途中 商品被修改了价格或其他信息 ？   批次开启时不能修改， 需要验证用户下单时批次是否被取消了或其他的

、实际支付价格如何修改？直接改价格？还是改优惠金额  其他优惠？
、快递单号录入？
、顺丰包邮？

、微信小程序需要测试 提交的时候按钮再次点击
、代码用AI优化、用AI判断是否会有潜在逻辑问题
、引入redius？

nodejs 版本 v20.15.0






二期：
1、web首页的统计
2、采购



已预订 -> 未付款 -> 已付款 -送货-> 完成
  ↓        ↓           ↘        ↙
 取消    已取消           已退款


已付款 -送货-> 完成
      ↘       ↙
        已退款

线下：
先送货[未付款] -付款-> 已完成
先付钱[已付款] -送货-> 已完成




{
  '浙江省': {
    id: 'zhejiang', // 省份名称
    baseNum: 10, // 数字类型
    basePostage: 10, // 数字类型
    extraNum: 2, // 数字类型
    extraPostage: 2, // 数字类型
    freeShippingNum: 1, // 数字类型
    area: 'huadong', // 分为华东、华南、华北、西南，按现实中的省份划分进行，值为拼音
  }
}


后台配置 可用的省市区、价格
省市区接口，分段插
价格计算接口

小程序选择走本地



