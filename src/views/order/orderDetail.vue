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
          <el-button type="primary" v-else @click="seeGoods">查看商品</el-button>
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
                <div class="goodsRichText" v-html="form.snapshot_goodsRichText"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="批次编号：">
                {{ form.batch_no }}
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
          <div>
            基础信息
          </div>
        </div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8" v-if="$route.query.flag!=='add'">
              <el-form-item label="订单号：">
                {{ form.order_no }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单类型：">
                {{ form.batch_type==='preorder'?'预订':'现货' }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="下单人：" v-if="$route.query.flag!=='add'">
                {{ form.create_by }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单时间：" v-if="$route.query.flag!=='add'">
                {{ dayjs(form.createTime).format('YYYY-MM-DD HH:mm:ss') }}
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
            <el-col :span="8" v-if="form.batch_type==='preorder'">
              <el-form-item label="单价区间：">
                ￥{{ form.preorder_minPrice }} ~ {{ form.preorder_maxPrice }}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batch_type==='preorder'">
              <el-form-item label="最终单价：">
                {{ form.preorder_finalPrice ? `￥${form.preorder_finalPrice}` : '' }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单价：" v-if="form.batch_type==='stock'">
                ￥{{ form.stock_unitPrice }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="20">
              <el-form-item label="金额：">
                <div style="display: flex;align-items: center;">
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>商品总价</div>
                      <div>￥{{ form.theGoodsTotalPrice }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">+</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>邮费</div>
                      <div>￥{{ form.postage }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">—</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>优惠</div>
                      <div>￥{{ form.discountAmount_promotion }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">=</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>最终金额</div>
                      <div>￥{{ form.theFinalAmount }}</div>
                    </div>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="订单历史：" prop="status">
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in orderHistories"
                    :key="index"
                    :color="item.color"
                    :timestamp="item.time"
                     placement="top"
                  >
                    <div style="padding: 10px;border: 1px solid #e4e7ed;box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08);border-radius: 4px;">
                      <div style="font-weight: 700;">{{ item.statusText }}</div>
                      <div v-if="item.content" style="word-break: break-all;">{{ item.content }}</div>
                      <div v-if="item.by">操作人：{{ item.by }}</div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.status!=='canceled'&&form.status!=='completed'&&form.status!=='refunded'">
              <el-form-item label="订单操作：" prop="status">
                <div>
                  <div style="margin-bottom: 10px;" v-if="form.batch_type==='preorder'&&form.status==='reserved'">
                    <el-button type="primary" @click="cancelOrder">取消预订</el-button>
                  </div>
                  <div style="margin-bottom: 10px;" v-if="form.batch_type==='preorder'&&form.status==='unpaid'">
                    <el-button type="primary" @click="closeOrder">关闭订单</el-button>
                  </div>
                  <div style="margin-bottom: 10px;" v-if="form.status==='paid'">
                    <el-button type="primary" @click="shipOrder">发货</el-button>
                  </div>
                  <div style="margin-bottom: 10px;" v-if="form.status==='shipped'||form.status==='paid'">
                    <el-popconfirm title="确定完结订单？" @confirm="completeOrder">
                      <template #reference>
                        <el-button type="warning">完结订单</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
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
                <el-input v-model="form.receive_name" placeholder="" maxlength="20" clearable :disabled="!isCanEdit" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货人手机号：" prop="receive_phone">
                <el-input v-model="form.receive_phone" placeholder="" maxlength="20" clearable :disabled="!isCanEdit" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送货上门：" prop="receive_method">
                <el-switch v-model="form.receive_isHomeDelivery" active-text="是" inactive-text="否" @change="isHomeDeliveryChange" :disabled="!isCanEdit" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="省：" prop="receive_provinceCode">
                <el-select v-model="form.receive_provinceCode" placeholder="" @change="e => areaChange(e, 'province')" :disabled="!isCanEdit">
                  <el-option v-for="(item, index) in provinces" :key="index" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="市：" prop="receive_cityCode">
                <el-select v-model="form.receive_cityCode" placeholder="" @change="e => areaChange(e, 'city')" :disabled="!isCanEdit">
                  <el-option v-for="(item, index) in cities" :key="index" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="区：" prop="receive_districtCode">
                <el-select v-model="form.receive_districtCode" placeholder="" @change="e => areaChange(e, 'district')" :disabled="!isCanEdit">
                  <el-option v-for="(item, index) in districts" :key="index" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址：" prop="receive_address">
                <el-input type="textarea" autosize v-model="form.receive_address" maxlength="50" show-word-limit placeholder="" clearable :disabled="!isCanEdit" />
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

    <!-- 关闭订单弹出框 -->
    <el-dialog
      v-model="isShowCloseOrderDialog"
      title="确定关闭订单？"
      width="600"
      align-center
    >
      <div class="closeOrderDialog">
        <el-input
          v-model="closeOrderReason"
          autosize
          type="textarea"
          placeholder="请输入关闭订单原因"
          clearable
          maxlength="100"
          show-word-limit
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowCloseOrderDialog = false">取消</el-button>
          <el-button type="primary" @click="closeOrderDialogConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 取消预订弹出框 -->
    <el-dialog
      v-model="isShowCancelOrderDialog"
      title="确定取消预订？"
      width="600"
      align-center
    >
      <div class="cancelOrderDialog">
        <el-input
          v-model="cancelOrderReason"
          autosize
          type="textarea"
          placeholder="请输入取消原因（将展示给客户）"
          clearable
          maxlength="100"
          show-word-limit
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowCancelOrderDialog = false">取消</el-button>
          <el-button type="primary" @click="cancelOrderDialogConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 发货订单弹出框 -->
    <el-dialog
      v-model="isShowShipOrderDialog"
      title="发货"
      width="600"
      align-center
    >
      <div class="shipOrderOrderDialog">
        <div v-if="form.receive_isHomeDelivery">
          已送货上门？
        </div>
        <div v-else>
          <el-input
            v-model="shipOrderTrackingNumber"
            placeholder="请输入快递单号"
            clearable
            maxlength="30"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowShipOrderDialog = false">取消</el-button>
          <el-button type="primary" @click="shipOrderDialogConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

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
import { 
  _getOrderDetailById, 
  _updateOrder, 
  _createOrder, 
  _cancelOrder,
  _shipOrder,
  _completeOrder,
} from '@/network/order' 
import { _getAll } from '@/network/ship' 

const $route = useRoute()
const $router = useRouter()

let formRef = ref(null)
let isSubmiting = ref(false)
let isCanEdit = ref(true)

let form = reactive({
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
            receive_provinceCode: form.receive_provinceCode, 
            receive_cityCode: form.receive_cityCode, 
            receive_districtCode: form.receive_districtCode,
            receive_address: form.receive_address,
            receive_isHomeDelivery: form.receive_isHomeDelivery ? 1 : 0,
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

const orderHistories = ref([])
function getOrderDetailById() {
  _getOrderDetailById({ id: $route.query.id }).then(res => {
    let theGoodsTotalPrice = null
    if (res.data.batch_type==='preorder') {
      let goodsMinPrice = (Number(res.data.preorder_minPrice) * Number(res.data.quantity)).toFixed(2)
      let goodsMaxPrice = (Number(res.data.preorder_maxPrice) * Number(res.data.quantity)).toFixed(2)
      theGoodsTotalPrice = `${goodsMinPrice} ~ ${goodsMaxPrice}`
    } else {
      theGoodsTotalPrice = (Number(res.data.stock_unitPrice) * Number(res.data.quantity)).toFixed(2)
    }

    let theFinalAmount = null
    if (res.data.status==='reserved' || res.data.status==='canceled') {
      let finalMinPrice = (Number(res.data.preorder_minPrice) * Number(res.data.quantity) + Number(res.data.postage) - Number(res.data.discountAmount_promotion)).toFixed(2)
      let finalMaxPrice = (Number(res.data.preorder_maxPrice) * Number(res.data.quantity) + Number(res.data.postage) - Number(res.data.discountAmount_promotion)).toFixed(2)
      theFinalAmount = `${finalMinPrice} ~ ${finalMaxPrice}`
    } else {
      theFinalAmount = res.data.pay_finalAmount
    }
    
    Object.assign(form, {
      ...res.data,
      receive_isHomeDelivery: res.data.receive_isHomeDelivery===1 ? true : false,
      theGoodsTotalPrice,
      theFinalAmount,
    })

    // 能否编辑
    if (res.data.status === 'canceled' || res.data.status === 'closed' || res.data.status === 'completed' || res.data.status === 'refunded') {
      isCanEdit.value = false     
    } else {
      isCanEdit.value = true
    }

    let historyArr = []
    if (res.data.batch_type === 'preorder') {
      historyArr.push({
        statusText: '已预订',
        by: res.data.create_by,
        time: dayjs(res.data.preorder_time).format('YYYY-MM-DD HH:mm:ss'),
        color: '#0bbd87',
      })
      if (res.data.status === 'canceled') {
        historyArr.push({
          statusText: '已取消',
          content: `取消原因：${res.data.cancel_reason}`,
          by: res.data.cancel_by,
          time: dayjs(res.data.cancel_time).format('YYYY-MM-DD HH:mm:ss'),
          color: '#F62603',
        })
      }
      if (res.data.preorder_startSelling_time) {
        historyArr.push({
          statusText: '未付款',
          content: `批次开始售卖`,
          by: res.data.preorder_startSelling_by,
          time: dayjs(res.data.preorder_startSelling_time).format('YYYY-MM-DD HH:mm:ss'),
          color: '#f19304',
        })
        if (res.data.close_time) {
          historyArr.push({
            statusText: '已关闭',
            content: `关闭原因：${res.data.close_reason}`,
            by: res.data.close_by,
            time: dayjs(res.data.close_time).format('YYYY-MM-DD HH:mm:ss'),
            color: '#F62603',
          })
        }
        if (res.data.pay_time) {
          historyArr.push({
            statusText: `已付款`,
            content: `￥${res.data.pay_finalAmount} / ${res.data.receive_isHomeDelivery ? '待送货上门' : '待邮寄'}`,
            time: dayjs(res.data.pay_time).format('YYYY-MM-DD HH:mm:ss'),
            color: '#0bbd87',
          })
          if (res.data.ship_time) {
            historyArr.push({
              statusText: '已发货',
              content: res.data.receive_isHomeDelivery ? `已送货上门` : `快递单号：${res.data.ship_trackingNumber}`,
              by: res.data.ship_by,
              time: dayjs(res.data.ship_time).format('YYYY-MM-DD HH:mm:ss'),
              color: '#0bbd87',
            })
          }
          if (res.data.complete_time) {
            historyArr.push({
              statusText: '已完结',
              time: dayjs(res.data.complete_time).format('YYYY-MM-DD HH:mm:ss'),
              by: res.data.complete_by,
              color: '#0bbd87',
            })
          }
        }
      }
    } else if (res.data.batch_type === 'stock') {
      historyArr.push({
        statusText: '已付款',
        content: `￥${res.data.pay_finalAmount} / ${res.data.receive_isHomeDelivery ? '待送货上门' : '待邮寄'}`,
        time: dayjs(res.data.pay_time).format('YYYY-MM-DD HH:mm:ss'),
        color: '#0bbd87',
      })
      if (res.data.status === 'shipped') {
        historyArr.push({
          statusText: '已发货',
          content: res.data.receive_isHomeDelivery ? `已送货上门` : `快递单号：${res.data.ship_trackingNumber}`,
          by: res.data.ship_by,
          time: dayjs(res.data.ship_time).format('YYYY-MM-DD HH:mm:ss'),
          color: '#0bbd87',
        })
      }
      if (res.data.status === 'completed') {
        historyArr.push({
          statusText: '已完结',
          time: dayjs(res.data.complete_time).format('YYYY-MM-DD HH:mm:ss'),
          by: res.data.complete_by,
          color: '#0bbd87',
        })
      }
    }

    orderHistories.value = historyArr
    

    getAllProvinces()
    getAllCities(res.data.receive_provinceCode)
    getAllDistricts(res.data.receive_cityCode)
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
    snapshot_discounts: JSON.stringify(record.batch_discounts_promotion),
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

let provinces = ref([])
let cities = ref([])
let districts = ref([])
function getAllProvinces() {
  _getAll({
    level: 'province',
  }).then(res => {
    provinces.value = res.data
  })
}
function getAllCities(code) {
  _getAll({
    level: 'city',
    code
  }).then(res => {
    cities.value = res.data
  })
}
function getAllDistricts(code) {
  _getAll({
    level: 'district',
    code
  }).then(res => {
    districts.value = res.data
  })
}

// 关闭订单
let isShowCloseOrderDialog = ref(false)
let closeOrderReason = ref('')
function closeOrder() {
  cancelOrderReason.value = ''
  isShowCloseOrderDialog.value = true
}
function closeOrderDialogConfirm() {
  _closeOrder({
    orderId: form.id,
    cancelOrderReason: closeOrderReason.value,
  }).then(res => {
    if (res.code === 200) {
      isShowCloseOrderDialog.value = false
      ElMessage({
        message: '操作成功',
        type: 'success',
        plain: true,
      })
      getOrderDetailById()
    }
  })
}

// 取消订单
let isShowCancelOrderDialog = ref(false)
let cancelOrderReason = ref('')
function cancelOrder() {
  cancelOrderReason.value = ''
  isShowCancelOrderDialog.value = true
}
function cancelOrderDialogConfirm() {
  _cancelOrder({
    orderId: form.id,
    cancelOrderReason: cancelOrderReason.value,
  }).then(res => {
    if (res.code === 200) {
      isShowCancelOrderDialog.value = false
      ElMessage({
        message: '操作成功',
        type: 'success',
        plain: true,
      })
      getOrderDetailById()
    }
  })
}

// 发货
let isShowShipOrderDialog = ref(false)
let shipOrderTrackingNumber = ref('')
function shipOrder() {
  shipOrderTrackingNumber.value = ''
  isShowShipOrderDialog.value = true
}
function shipOrderDialogConfirm() {
  if (!form.receive_isHomeDelivery && !shipOrderTrackingNumber.value) {
    ElMessage({
      message: '请输入快递单号',
      type: 'warning',
      plain: true,
    })
    return
  }

  let params = {
    orderId: form.id,
  }
  if (!form.receive_isHomeDelivery) {
    params.shipTrackingNumber = shipOrderTrackingNumber.value
  }

  _shipOrder(params).then(res => {
    if (res.code === 200) {
      isShowShipOrderDialog.value = false
      ElMessage({
        message: '发货成功',
        type: 'success',
        plain: true,
      })
      getOrderDetailById()
    }
  })
}


function completeOrder() {
  _completeOrder({
    orderId: form.id
  }).then(res => {
    if (res.code === 200) {
      ElMessage({
        message: '操作成功',
        type: 'success',
        plain: true,
      })
      getOrderDetailById()
    }
  })
}

function areaChange(code, level) {
  if (level === 'province') {
    form.receive_cityCode = null
    form.receive_districtCode = null
    getAllCities(code)
  } else if (level === 'city') {
    form.receive_districtCode = null
    getAllDistricts(code)
  } else if (level === 'district') {
    let name = districts.value.find(item => item.code === code).name
    if (name !== '嵊州市') {
      form.receive_isHomeDelivery = false
    }
  }
}
function isHomeDeliveryChange(e) {
  if (e===true) {
    let name = districts.value.find(item => item.code === form.receive_districtCode).name
    if (name !== '嵊州市') {
      ElMessage({
        message: '仅嵊州市支持送货上门',
        type: 'warning',
        plain: true,
      })
      form.receive_isHomeDelivery = false
    }
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
      ::v-deep(.goodsRichText img) {
        max-width: 100%;
        height: auto;
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
