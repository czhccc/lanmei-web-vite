<template>
  <div class="orderDetail">
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="formRules" 
      label-width="auto"
    >
      <div class="item">
        <div class="title">
          商品快照
          <el-button type="primary" v-if="$route.query.flag==='add'" @click="toChooseGoods">选择商品</el-button>
          <el-button type="primary" v-else @click="seeGoods">查看商品当前</el-button>
        </div>
        <div class="content" v-if="form.goods_id">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商品编号：">
                {{ form.goods_id }} 
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称：">
                {{ form.snapshot_goodsName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品批次：">
                {{ form.batch_no }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="封面图：">
                <el-image :src="form.snapshot_coverImage" :preview-src-list="[form.snapshot_coverImage]" style="width: 100px; height: 100px"></el-image>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品备注：">
                {{ form.snapshot_goodsRemark }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商品详情：">
                <div v-html="form.snapshot_goodsRichText"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20" style="margin-top: 10px" v-if="form.batch_type==='preorder'">
            <el-col :span="8">
              <el-form-item label="付款金额：" prop="realPayPrice">
                <div style="width: 100%;display: flex;justify-content: space-between;">
                  <el-input-number v-model="form.realPayPrice" :precision="2" placeholder="" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
                  <span style="margin-left: 10px">元</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>
      </div>
      <div class="item" v-if="form.goods_id">
        <div class="title">
          <div style="display: flex;justify-content: space-between;">
            基础信息
            <el-button 
              type="danger" class="deleteBtn" 
              :loading="isDeleting"
              @click="toDelete" 
              v-if="$route.query.flag==='edit'&&form.generation_type==='offline'"
            >删 除</el-button>
          </div>
        </div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8" v-if="$route.query.flag!=='add'">
              <el-form-item label="订单号：">
                {{ form.order_no }}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="$route.query.flag!=='add'">
              <el-form-item label="生成类型：">
                {{ form.generation_type==='auto'?'自动生成':'手动添加' }}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batch_type">
              <el-form-item label="订单类型：">
                {{ form.batch_type==='preorder'?'预订':'现货' }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="form.generation_type==='auto'?'下单客户：':'创建人：'" v-if="$route.query.flag!=='add'">
                {{ form.user }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单时间：" v-if="$route.query.flag!=='add'">
                {{ form.orderCreateTime }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="数量：" prop="quantity">
                <div style="display: flex;width: 100%;">
                  <div v-if="$route.query.id">{{ form.quantity }}</div>
                  <el-input-number v-else v-model="form.quantity" placeholder="数量" :precision="1" :min="0.1" :max="999999" :controls="false" style="flex: 1;" />
                  <div v-if="form.snapshot_goodsUnit" style="text-align: right;margin-left: 10px;">{{ form.snapshot_goodsUnit || '单位' }}</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="20">
              <el-form-item label="金额：">
                <div style="display: flex;align-items: center;">
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>商品金额</div>
                      <div>￥{{ form.totalPrice }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">—</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>优惠</div>
                      <div>￥{{ form.discount_quantity }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">+</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>邮费</div>
                      <div>￥{{ form.postage }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">=</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>应付总金额</div>
                      <div>￥{{ form.finalPrice }}</div>
                    </div>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="订单状态：" prop="status">
                <el-select v-model="form.status" placeholder="">
                  <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.status==='canceled'">
              <el-form-item label="客户取消原因：" prop="cancel_reason">
                {{ form.cancel_reason }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="己方备注：" prop="remark_self">
                <el-input type="textarea" autosize v-model="form.remark_self" maxlength="200" show-word-limit placeholder="" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="item" v-if="form.goods_id">
        <div class="title">收货信息</div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="收货人姓名：" prop="receive_name">
                <el-input v-model="form.receive_name" placeholder="" maxlength="20" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货人手机号：" prop="receive_phone">
                <el-input v-model="form.receive_phone" placeholder="" maxlength="20" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货方式：" prop="receive_method">
                <el-select v-model="form.receive_method" placeholder="">
                  <el-option label="送货上门" value="delivery" />
                  <el-option label="邮寄" value="post" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="$route.query.flag!=='add'">
              <el-form-item label="收货省市区：" prop="receive_region">
                {{ form.receive_region }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货详细地址：" prop="receive_address">
                <el-input type="textarea" autosize v-model="form.receive_address" maxlength="200" show-word-limit placeholder="" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="$route.query.flag!=='add'">
              <el-form-item label="客户备注：" prop="remark_customer">
                {{ form.remark_customer }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    
    <div class="btns" v-if="$route.query.flag!=='detail'">
      <el-button type="primary" class="submitBtn" :loading=isSubmiting @click="toSubmit">提 交</el-button>
    </div>

    <el-dialog 
      v-model="isShowChooseGoodsDialog" 
      title="选择商品" 
      width="1200"
      align-center
      class="chooseGoods-dialog"
    >
      <div class="chooseGoods-search">
        <div class="chooseGoods-search-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chooseGoods-search-item">
                <div class="chooseGoods-search-item-label">商品编号：</div>
                <el-input placeholder="请输入" clearable v-model="chooseGoodsSearchParams.goodsNo"></el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="chooseGoods-search-item">
                <div class="chooseGoods-search-item-label">商品名称：</div>
                <el-input placeholder="请输入" clearable v-model="chooseGoodsSearchParams.goodsName"></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="chooseGoods-search-btns">
          <el-button type="primary" @click="chooseGoodsSearch">查询</el-button>
          <el-button @click="chooseGoodsSearchReset">重置</el-button>
        </div>
      </div>
      <el-table :data="goodsList" max-height="60vh">
        <el-table-column property="id" label="商品编号" width="120" align="center" />
        <el-table-column property="goods_name" label="商品名称" align="center" />
        <el-table-column fixed="right" label="操作" width="120" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="chooseGoodsConfirm(scope.row)">选择</el-button>
            <el-button link type="primary" @click="chooseGoodsSeeDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import dayjs from 'dayjs'

import { _getGoodsList } from '@/network/goods'
import { _getOrderDetailById, _updateOrder, _createOrder } from '@/network/order' 

const $route = useRoute()
const $router = useRouter()

let formRef = ref(null)
let isSubmiting = ref(false)
let isDeleting = ref(false)

let form = reactive({
  generation_type: 'manual',
  goods_id: null,
  batch_no: null,
  batch_type: null,
  quantity: 1.0,
  status: null,
  remark_self: null,
  receive_method: 'post',
  receive_name: null,
  receive_phone: null,
  receive_region: null,
  receive_address: null,
  remark_customer: null,
  discount_quantity: '0.00',
  postage: '10.00',
  snapshot_coverImage: null,
  snapshot_goodsName: null,
  snapshot_goodsUnit: null,
  snapshot_goodsRemark: null,
  snapshot_goodsRichText: null,
  snapshot_discounts: null,
  total_minPrice: null,
  total_maxPrice: null,
  total_price: null,
  totalPrice: null,
  finalPrice: null,
})
const formRules = reactive({
  status: [{ required: true, message: '请选择订单状态', trigger: 'blur' },],
  cancel_reason: [{ required: false, message: '请输入取消原因', trigger: 'blur' },],
  remark_self: [{ required: false, message: '请输入己方备注', trigger: 'blur' },],

  quantity: [
    { required: true, message: '请输入商品数量', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 999999, message: '请输入总数量', trigger: 'blur' },
  ],
  goodsPrice: [
    { required: true, message: '请输入商品金额', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入总数量', trigger: 'blur' },
  ],
  realPayPrice: [
    { required: true, message: '请输入邮费', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入总数量', trigger: 'blur' },
  ],

  receive_name: [{ required: false, message: '请输入收货人姓名', trigger: 'blur' },],
  receive_phone: [{ required: false, message: '请输入收货人手机号', trigger: 'blur' },],
  receive_method: [{ required: false, message: '请输入收获方式', trigger: 'blur' },],
  receive_region: [{ required: false, message: '请选择收货省市区', trigger: 'blur' },],
  receive_address: [{ required: false, message: '请输入收货详细地址', trigger: 'blur' },],
  remark_customer: [{ required: false, message: '请输入客户备注', trigger: 'blur' },],
})

function toSubmit() {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      isSubmiting.value = true
      
      if ($route.query.id) { // edit

      } else { // add

      }

      ElMessageBox.confirm(
        '确定提交保存?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        if ($route.query.id) {
          _updateOrder({
            id: form.id,
            remark_self: form.remark_self,
            receive_name: form.receive_name,
            receive_phone: form.receive_phone,
            receive_method: form.receive_method,
            receive_address: form.receive_address,
            status: form.status,
          }).then(res => {
            ElMessage({
              message: '更新成功',
              type: 'success',
              plain: true,
            })

            getOrderDetailById()
          }).finally(() => {
            isSubmiting.value = false
          })
        } else {
          _createOrder(form).then(res => {
            ElMessage({
              message: '添加成功',
              type: 'success',
              plain: true,
            })
            setTimeout(() => {
              window.location.href = `${window.location.href.split('?')[0]}?id=${res.data.id}&flag=edit`
            }, 1500)
          }).catch(err => {
            isSubmiting.value = false
          })
        }
      })
    }
  })
}
function toDelete() {
  ElMessageBox.confirm(
    '确定删除?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    isDeleting.value = true
  }).catch(() => {
    
  })
}

function getOrderDetailById(id) {
  _getOrderDetailById({ id: $route.query.id }).then(res => {
    let finalPrice = ''
    if (res.data.batch_type==='preorder') {
      let minPrice = (Number(res.data.total_minPrice) + Number(res.data.postage) - Number(res.data.discount_quantity)).toFixed(2)
      let maxPrice = (Number(res.data.total_maxPrice) + Number(res.data.postage) - Number(res.data.discount_quantity)).toFixed(2)
      finalPrice = `${minPrice} ~ ${maxPrice}`
    } else {
      finalPrice = (Number(res.data.total_price) + Number(res.data.postage) - Number(res.data.discount_quantity)).toFixed(2)
    }
    Object.assign(form, {
      id: res.data.id,
      order_no: res.data.order_no,
      generation_type: res.data.generation_type,
      batch_type: res.data.batch_type,
      user: res.data.user,
      orderCreateTime: res.data.batch_type==='preorder' ? dayjs(res.data.order_time).format('YYYY-MM-DD HH:mm:ss') : dayjs(res.data.pay_time).format('YYYY-MM-DD HH:mm:ss'),
      remark_self: res.data.remark_self || '',
      status: res.data.status,
      cancel_reason: res.data.cancel_reason,
      
      goods_id: res.data.goods_id,
      snapshot_goodsName: res.data.snapshot_goodsName,
      batch_no: res.data.batch_no,
      quantity: res.data.quantity,
      snapshot_goodsUnit: res.data.snapshot_goodsUnit,

      totalPrice: res.data.batch_type==='preorder' ? `${res.data.total_minPrice}~${res.data.total_maxPrice}` : res.data.total_price,
      discount_quantity: res.data.discount_quantity,
      postage: res.data.postage,
      finalPrice,
      
      receive_name: res.data.receive_name,
      receive_phone: res.data.receive_phone,
      receive_method: res.data.receive_method,
      receive_region: res.data.receive_region,
      receive_address: res.data.receive_address,
      remark_customer: res.data.remark_customer,

      snapshot_coverImage: res.data.snapshot_coverImage,
      snapshot_goodsRemark: res.data.snapshot_goodsRemark,
      snapshot_goodsRichText: res.data.snapshot_goodsRichText,
    })

    generateStatusList(res.data.batch_type)
  })
}

onMounted(() => {
  if ($route.query.id) {
    getOrderDetailById()
  } else {
    getGoodsList()
  }
})

// 选择商品弹框
let isShowChooseGoodsDialog = ref(false)
let chooseGoodsSearchParams = reactive({
  goodsNo: '',
  goodsName: '',
})
function toChooseGoods() {
  isShowChooseGoodsDialog.value = true
}
function chooseGoodsSearch() {
  getGoodsList()
}
function chooseGoodsSearchReset() {
  Object.assign(chooseGoodsSearchParams, { // reactive 直接替换对象的引用不会影响原始对象的代理
    goodsNo: '',
    goodsName: '',
  })
  getGoodsList()
}

let choosedGoods = null
function chooseGoodsConfirm(record) {
  choosedGoods = record
  Object.assign(form, {
    generation_type: 'manual',
    goods_id: record.id,
    batch_no: record.batch_no,
    batch_type: record.batch_type,
    quantity: 1.0,
    receive_method: 'post',
    receive_name: null,
    receive_phone: null,
    receive_region: null,
    receive_address: null,
    remark_customer: null,
    discount_quantity: '0.00',
    postage: '10.00',
    snapshot_coverImage: record.goods_coverImage,
    snapshot_goodsName: record.goods_name,
    snapshot_goodsUnit: record.goods_unit,
    snapshot_goodsRemark: record.goods_remark,
    snapshot_goodsRichText: record.goods_richText,
    snapshot_discounts: JSON.stringify(record.batch_discounts),
  })
  // if (record.batch_type === 'preorder') {
  //   Object.assign(form, {
  //     goods_id: record.id,
  //     batch_no: record.batch_no,
  //   })
  // } else {
  //   Object.assign(form, {
  //     goods_id: record.id,
  //     batch_no: record.batch_no,
  //   })
  // }
  isShowChooseGoodsDialog.value = false
  generateStatusList(record.batch_type)
  calculatePrice()
}
function chooseGoodsSeeDetail(record) {
  const url = `${window.location.origin}${$router.resolve({
    path: '/goodsDetail',
    query: {
      id: record.id,
      flag: 'edit'
    }
  }).href}`
  window.open(url, '_blank')
}
let goodsList = ref([])
function getGoodsList() {
  _getGoodsList({
    pageNo: 1,
    pageSize: 999,
    ...chooseGoodsSearchParams,
    goodsIsSelling: 1,
  }).then(res => {
    goodsList.value = res.data.records
  })
}

function seeGoods() {
  $router.push({
    path: '/goodsDetail',
    query: {
      flag: 'edit',
      id: form.goods_id,
    }
  })
}

let statusList = ref([])
function generateStatusList(e) {
  if (e === 'preorder') {
    statusList.value = [
      {label: '已预订', value: 'reserved'},
      {label: '未付款', value: 'unpaid'},
      {label: '已付款', value: 'paid'},
      {label: '已完成', value: 'completed'},
      {label: '已取消', value: 'canceled'},
      {label: '已退款', value: 'refunded'},
    ]
  } else {
    statusList.value = [
      {label: '已付款', value: 'paid'},
      {label: '已完成', value: 'completed'},
      {label: '已退款', value: 'refunded'},
    ]
  }
}

watch(() => form.quantity, (newValue, oldValue) => {
  if ($route.query.flag==='add') {
    calculatePrice()
  }
});
function calculatePrice() {
  // 计算总价格
  if (choosedGoods.batch_type === 'preorder') { // 预订
    form.total_minPrice = form.quantity * Number(choosedGoods.batch_preorder_minPrice)
    form.total_maxPrice = form.quantity * Number(choosedGoods.batch_preorder_maxPrice)

    form.totalPrice = `${form.total_minPrice.toFixed(2)} ~ ${form.total_maxPrice.toFixed(2)}`
  } else { // 现货
    form.totalPrice = (form.quantity * Number(choosedGoods.batch_stock_unitPrice)).toFixed(2)

    form.total_price = (form.quantity * Number(choosedGoods.batch_stock_unitPrice)).toFixed(2)
  }

  // 计算优惠
  let discountQuantity = 0;
  JSON.parse(choosedGoods.batch_discounts).forEach(item => {
    if (form.quantity >= item.quantity) {
      discountQuantity = Math.max(discountQuantity, item.discount);
    }
  })
  form.discount_quantity = discountQuantity

  // 计算最终价格
  if (choosedGoods.batch_type==='preorder'){
    form.finalPrice = `${(form.quantity*Number(choosedGoods.batch_preorder_minPrice)+Number(form.postage)-Number(discountQuantity)).toFixed(2)} ~ ${(form.quantity*Number(choosedGoods.batch_preorder_maxPrice)+Number(form.postage)-Number(discountQuantity)).toFixed(2)}`
  } else {
    form.finalPrice = (Number(form.totalPrice) + Number(form.postage) - Number(discountQuantity)).toFixed(2)
  }
}

</script>

<style lang="less" scoped>
.orderDetail {
  padding-bottom: 60px;
  .item {
    .title {
      font-size: 30px;
      font-weight: 700;
      background: linear-gradient(to right, rgba(25, 137, 250, 0.1), rgba(25, 137, 250, 0));
      padding: 10px;
      box-sizing: border-box;
      border-radius: 6px;
    }
    .content {
      padding: 20px 40px;
      box-sizing: border-box;
      .content-item {
        margin-bottom: 30px;
        .content-left {
          font-weight: 700;
          font-size: 30px;
        }
      }
    }
  }

  .btns {
    .submitBtn {
      position: fixed;
      bottom: 20px;
      right: 30px;
    }
  }

  .chooseGoods-dialog {
    .chooseGoods-search {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .chooseGoods-search-content {
        flex: 1;
        .chooseGoods-search-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .chooseGoods-search-item-label {
            word-break: keep-all;
          }
        }
      }
      .chooseGoods-search-btns {
        width: 200px;
        display: flex;
        justify-content: center;
      }
    }
  }
  // :deep(.el-scrollbar) {
  //   max-height: 60vh;
  //   overflow-y: auto;
  // }
}
.el-input[readonly] .el-input__inner,
.el-input[disabled] .el-input__inner,
.el-select[disabled] .el-select__inner {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
