<template>
  <div class="orderDetail">
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="formRules" 
      label-width="auto"
      :disabled="$route.query.flag==='detail'"
    >
      <div class="item">
        <div class="title">
          <div style="display: flex;justify-content: space-between;">
            订单信息
            <el-button 
              type="danger" class="deleteBtn" 
              :loading="isDeleting"
              @click="toDelete" 
              v-if="$route.query.flag==='edit'&&form.orderType==='offline'"
            >删 除</el-button>
          </div>
        </div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="订单号：" v-if="$route.query.flag!=='add'">
                {{ form.orderNo }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单类型：" v-if="$route.query.flag!=='add'">
                {{ form.orderTypeText }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人：" v-if="$route.query.flag!=='add'">
                {{ form.orderCreateBy }}
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
              <el-form-item label="订单状态：" prop="orderStatus">
                <el-select v-model="form.orderStatus" placeholder="请选择">
                  <el-option label="预订中" value="ydz" />
                  <el-option label="待付款" value="dfk" />
                  <el-option label="已付款" value="yfk" />
                  <el-option label="已完结" value="ywj" />
                  <el-option label="已取消" value="yqx" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.orderStatus==='yqx'">
              <el-form-item label="取消原因：" prop="orderCancelReason">
                <el-input type="textarea" autosize v-model="form.orderCancelReason" maxlength="200" show-word-limit placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="己方备注：" prop="selfRemark">
                <el-input type="textarea" autosize v-model="form.selfRemark" maxlength="200" show-word-limit placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="item">
        <div class="title">
          商品信息
          <el-button type="primary" v-if="$route.query.flag!=='detail'" @click="toChooseGoods">选择商品</el-button>
        </div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商品编号：">
                {{ form.goodsNo }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称：">
                {{ form.goodsName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品批次：">
                {{ form.goodsBatch }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数量：" required>
                <div style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
                  <el-form-item prop="quantity" style="flex: 1;">
                    <el-input-number v-model="form.quantity" placeholder="总量" :precision="1" :min="0.1" :max="999999" :controls="false" style="width: 100%;" />
                  </el-form-item>
                  <div style="text-align: right;margin-left: 10px;">{{ form.goodsUnit || '单位' }}</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="20">
              <el-form-item label="应付金额：">
                <div style="display: flex;align-items: center;">
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>商品金额</div>
                      <div>￥{{ form.goodsPrice.toFixed(2) }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">-</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>优惠</div>
                      <div>￥{{ form.goodsDiscount.toFixed(2) }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">+</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>邮费</div>
                      <div>￥{{ form.goodsPostage.toFixed(2) }}</div>
                    </div>
                  </el-form-item>
                  <div style="text-align: center;margin: 0 30px;">=</div>
                  <el-form-item>
                    <div style="text-align: center;">
                      <div>应付总金额</div>
                      <div>￥{{ (form.goodsPrice - form.goodsDiscount + form.goodsPostage).toFixed(2) || 0.00 }}</div>
                    </div>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="8">
              <el-form-item label="实付金额：" prop="realPayPrice">
                <div style="width: 100%;display: flex;justify-content: space-between;">
                  <el-input-number v-model="form.realPayPrice" :precision="2" placeholder="请输入" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
                  <span style="margin-left: 10px">元</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="item">
        <div class="title">收货信息</div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="客户联系方式：" prop="customerPhone">
                <el-input v-model="form.customerPhone" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货人联系方式：" prop="recipientPhone">
                <el-input v-model="form.recipientPhone" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="省市区：" prop="recipientRegion">
                <el-input v-model="form.recipientRegion" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货地址详情：" prop="recipientAddressDetail">
                <el-input type="textarea" autosize v-model="form.recipientAddressDetail" maxlength="200" show-word-limit placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户备注：" prop="customerRemark">
                <el-input type="textarea" autosize v-model="form.customerRemark" maxlength="200" show-word-limit placeholder="请输入" clearable />
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
      width="800"
      align-center
      class="chooseGoods-dialog"
    >
      <div class="chooseGoods-search">
        <div class="chooseGoods-search-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chooseGoods-search-item">
                <div class="chooseGoods-search-item-label">商品编号：</div>
                <div>
                  <el-input placeholder="请输入" clearable v-model="chooseGoodsSearchParams.goodsNo"></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="chooseGoods-search-item">
                <div class="chooseGoods-search-item-label">商品名称：</div>
                <div class="chooseGoods-search-item-input">
                  <el-input placeholder="请输入" clearable v-model="chooseGoodsSearchParams.goodsName"></el-input>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="chooseGoods-search-btns">
          <el-button type="primary" @click="chooseGoodsSearch">查询</el-button>
          <el-button @click="chooseGoodsSearchReset">重置</el-button>
        </div>
      </div>
      <el-table :data="chooseGoodsDialogTableData">
        <el-table-column property="goodsNo" label="商品编号" align="center" />
        <el-table-column property="goodsName" label="商品名称" align="center" />
        <el-table-column fixed="right" label="操作" width="110" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="chooseGoodsConfirm(scope.row)">选择</el-button>
            <el-button link type="primary" @click="chooseGoodsSeeDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $route = useRoute()
const $router = useRouter()
console.log($route.query.flag)

let formRef = ref(null)
let isSubmiting = ref(false)
let isDeleting = ref(false)

let form = reactive({
  orderNo: '',
  orderType: '',
  orderTypeText: '',
  orderCreateTime: '',
  orderCreateBy: '',
  goodsNo: '',
  goodsName: '',
  quantity: 0,
  goodsUnit: '',
  goodsPrice: 0.00,
  goodsDiscount: 30.00,
  goodsPostage: 0.00,
  realPayPrice: 160.00,
  customerPhone: '',
  orderCreateTime: '',
  orderStatus: '',
  orderStatusText: '',
  orderCancelReason: '',
  selfRemark: '',
})
const formRules = reactive({
  orderStatus: [{ required: true, message: '请选择订单状态', trigger: 'blur' },],
  orderCancelReason: [{ required: true, message: '请输入取消原因', trigger: 'blur' },],
  selfRemark: [{ required: false, message: '请输入己方备注', trigger: 'blur' },],

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

  customerPhone: [{ required: true, message: '请输入客户联系方式', trigger: 'blur' },],
  recipientPhone: [{ required: true, message: '请输入客户联系方式', trigger: 'blur' },],
  recipientRegion: [{ required: true, message: '请选择省市区', trigger: 'blur' },],
  recipientAddressDetail: [{ required: true, message: '请输入收货地址详情', trigger: 'blur' },],
  customerRemark: [{ required: false, message: '请输入客户备注', trigger: 'blur' },],
})

function toSubmit() {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      isSubmiting.value = true
      console.log('submit!', form)

      ElMessageBox.confirm(
        '确定提交保存?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        $router.replace({
          path: '/order'
        })
      }).catch(() => {
        
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

// 选择商品弹框
let isShowChooseGoodsDialog = ref(false)
let chooseGoodsSearchParams = reactive({
  goodsNo: '',
  goodsName: '',
})
function toChooseGoods() {
  isShowChooseGoodsDialog.value = true
}
let chooseGoodsDialogTableData = reactive([
  {goodsNo: '111', goodsName: '蓝莓大大'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
])
function chooseGoodsSearch() {

}
function chooseGoodsSearchReset() {
  Object.assign(chooseGoodsSearchParams, { // reactive 直接替换对象的引用不会影响原始对象的代理
    goodsNo: '',
    goodsName: '',
  })
}
function chooseGoodsConfirm(record) {
  console.log(record)
}
function chooseGoodsSeeDetail(record) {
  console.log(record)
  const url = `${window.location.origin}${$router.resolve({
    path: '/goodsDetail',
    query: {
      id: '123321',
      flag: 'detail'
    }
  }).href}`
  window.open(url, '_blank')
}

onMounted(() => {
  Object.assign(form, { // reactive 直接替换对象的引用不会影响原始对象的代理
    orderNo: '202407022236526936',
    orderType: 'offline',
    orderTypeText: '线下订单',
    orderCreateTime: '2024-07-02 22:36:52',
    orderCreateBy: 'czh',
    goodsBatch: '202420242024',
    goodsNo: '202407022236526936',
    goodsName: '蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果',
    quantity: 200,
    goodsUnit: '斤',
    goodsPrice: 150.00,
    goodsPostage: 10.00,
    realPayPrice: 160.00,
    customerPhone: '13989562356',
    orderCreateTime: '2024-07-02 22:42:26',
    orderStatus: 'yqx',
    orderStatusText: '已取消',
    orderCancelReason: '就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消',
    selfRemark: '我是备注我是备注我是备注2222222222222222222222222222222我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
  })
})

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
          .chooseGoods-search-item-input {
            width: 200px;
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
}
.el-input[readonly] .el-input__inner,
.el-input[disabled] .el-input__inner,
.el-select[disabled] .el-select__inner {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
