<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.batch"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">商品编号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.batch"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">客户手机号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.name"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单状态：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.haveResponsed" placeholder="请选择" clearable>
                  <el-option label="预订中" value="ydz" />
                  <el-option label="待付款" value="dfk" />
                  <el-option label="已付款" value="yfk" />
                  <el-option label="已完结" value="ywj" />
                  <el-option label="已取消" value="yqx" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">下单日期：</div>
              <div class="search-item-input">
                <el-date-picker 
                  type="daterange"
                  format="YYYY/MM/DD" value-format="YYYY-MM-DD" 
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable 
                  v-model="searchParams.date" 
                  style="width: 100%;"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btns">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="searchReset">重置</el-button>
      </div>
    </div>

    <div class="options">
      <el-button type="primary" @click="tableAdd">新增</el-button>
    </div>

    <div class="table-wrapper">
      <el-table :height="tableHeight" :data="tableData">
        <el-table-column prop="orderNo" label="订单号" align="center" />
        <el-table-column prop="orderTypeText" label="订单类型" align="center" />
        <el-table-column prop="goodsNo" label="商品" align="center" >
          <template #default="scope">
            <el-tooltip :content="'商品编号：'+scope.row.goodsNo">
              <div>{{ scope.row.goodsName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="goodsQuantity" label="数量" align="center" >
          <template #default="scope">
            <div>{{ scope.row.goodsQuantity }} {{ scope.row.goodsUnit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="payAmount" label="实付金额" align="center" >
          <template #default="scope">
            <el-tooltip :content="'总金额：'+(scope.row.goodsPrice+scope.row.goodsPostage)+' 元'">
              <div>{{ scope.row.goodsPrice }} + {{ scope.row.goodsPostage }} 元</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="客户手机号" align="center" />
        <el-table-column prop="orderCreateTime" label="下单时间" width="170" align="center" />
        <el-table-column prop="orderStatus" label="订单状态" align="center">
          <template #default="scope">
            <el-tooltip :content="'取消原因：'+scope.row.orderCancelReason">
              <div>{{ scope.row.orderStatusText }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="selfRemark" label="己方备注" align="center" />
        <el-table-column fixed="right" label="操作" width="120" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="tableDetail(scope.row)">详情</el-button>
            <el-button link type="primary" @click="tableEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          class="pagination"
          v-model:current-page="pagination.pageNo"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 40, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="tablePageSizeChange"
          @current-change="tablePageNoChange"
        />
      </div>
    </div>

    <el-dialog 
      class="form"
      v-model="isShowForm" 
      :title="formTitle" 
      width="600" 
      center 
      align-center
    >
      <div class="form-content">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto" :disabled="formTitle==='详情'">
          <el-form-item label="订单号" prop="orderNo" v-if="formTitle!=='新增'">
            <el-input v-model="form.orderNo" placeholder="自动生成" readonly />
          </el-form-item>
          <el-form-item label="订单类型">
            手动添加
          </el-form-item>
          <el-form-item label="商品编号" prop="goodsNo">
            <div style="width: 100%;display: flex;justify-content: space-between">
              <el-form-item prop="goodsNo" style="flex: 1;">
                <el-input v-model="form.goodsNo" placeholder="请选择商品" maxlength="20" clearable readonly />
              </el-form-item>
              <el-button type="primary" link v-if="formTitle!=='详情'" style="margin-left: 10px;">选择商品</el-button>
            </div>
          </el-form-item>
          <el-form-item label="商品名称" prop="unit">
            <el-input v-model="form.goodsName" placeholder="请选择商品" maxlength="10" clearable readonly />
          </el-form-item>
          <el-form-item label="数量" required>
            <div style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
              <el-form-item prop="totalQuantity" style="flex: 1;">
                <el-input-number v-model="form.totalQuantity" placeholder="总量" maxlength="20" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: right;margin-left: 10px;">{{ form.unit || '单位' }}</div>
            </div>
          </el-form-item>
          <el-form-item label="成本" required>
            <div style="display: flex;align-items: center;justify-content: space-between;">
              <el-form-item prop="goodsCost" style="flex: 1;">
                <el-input-number v-model="form.goodsPrice" placeholder="商品金额" :min="0.01" :max="999999" :precision="2" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: center;margin: 0 10px;">+</div>
              <el-form-item prop="otherCost" style="flex: 1;">
                <el-input-number v-model="form.goodsPostage" placeholder="邮费" :min="0.01" :max="999999" :precision="2" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: center;margin: 0 10px;">=</div>
              <el-form-item prop="totalCost">
                {{ (form.goodsPrice + form.goodsPostage).toFixed(2) || 0.00 }}
              </el-form-item>
              <div style="text-align: right;margin-left: 10px;">元</div>
            </div>
          </el-form-item>
          <el-form-item label="进货日期" prop="date">
            <el-date-picker type="date" format="YYYY/MM/DD" value-format="YYYY-MM-DD" v-model="form.date" placeholder="请选择" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="进货来源" prop="source">
            <el-input v-model="form.source" placeholder="请输入" maxlength="50" clearable />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" autosize v-model="form.remark" maxlength="200" show-word-limit placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择" clearable>
              <el-option label="状态1" value="状态1" />
              <el-option label="状态2" value="状态2" />
              <el-option label="状态3" value="状态3" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer v-if="formTitle!=='详情'">
        <div class="form-btns">
          <el-button @click="formCancel">取消</el-button>
          <el-button type="primary" :loading="isFormSubmiting" @click="formSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue';

// Table
let searchParams = reactive({
  batch: '',
  name: '',
  date: null,
})
let tableData = ref([])
let tableHeight = ref(0)
let pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

let isShowForm = ref(false)
let formTitle = ref('')
let formRef = ref(null)
let form = reactive({
  orderNo: '',
  orderType: '',
  orderTypeText: '',
  goodsNo: '',
  goodsName: '',
  goodsQuantity: 0,
  goodsUnit: '',
  goodsPrice: 0.00,
  goodsPostage: 0.00,
  customerPhone: '',
  orderCreateTime: '',
  orderStatus: '',
  selfRemark: '',
})
const formRules = reactive({
  batch: [{ required: true, message: '请输入批次', trigger: 'blur' },],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' },],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' },],
  totalQuantity: [
    { required: true, message: '请输入总数量', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入总数量', trigger: 'blur' },
  ],
  lossQuantity: [
    { required: true, message: '请输入损耗量', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入损耗量', trigger: 'blur' },
  ],
  realQuantity: [
    { required: true, message: '请输入实际售卖量', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入实际售卖量', trigger: 'blur' },
  ],
  goodsCost: [
    { required: true, message: '请输入商品成本', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入商品成本', trigger: 'blur' },
  ],
  otherCost: [
    { required: true, message: '请输入其他成本', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入其他成本', trigger: 'blur' },
  ],
  totalCost: [
    { required: true, message: '请输入总成本', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入总成本', trigger: 'blur' },
  ],
  date: [{ required: true, message: '请选择进货日期', trigger: 'blur' },],
  source: [{ required: false, message: '请输入进货来源', trigger: 'blur' },],
  remark: [{ required: false, message: '请输入备注', trigger: 'blur' },],
  status: [{ required: false, message: '请选择', trigger: 'blur' },],
})

const calculateTableHeight = () => {
  const viewportHeight = window.innerHeight;
  const searchWrapperHeight = document.querySelector('.search-wrapper').offsetHeight;
  const optionsWrapperHeight = document.querySelector('.options').offsetHeight;
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper').offsetHeight;
  tableHeight.value = viewportHeight - searchWrapperHeight - optionsWrapperHeight - paginationWrapperHeight - 120;
};
function search() {

}
function searchReset() {
  Object.assign(searchParams, {
    batch: '',
    name: '',
    date: null,
  })
  pagination.pageNo = 1
}
function tablePageSizeChange(newPageSize) {
  console.log(newPageSize)
}
function tablePageNoChange(newPageNo) {
  console.log(newPageNo)
}
function tableAdd(record) {
  // console.log(record.date)
  formTitle.value = '新增'
  isShowForm.value = true
  nextTick(() => {
    formRef.value.resetFields()

    const date = new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    form.batch = `${year}${month}${day}${hours}${minutes}${seconds}`;
  })
  
}
function tableDetail(record) {
  // console.log(record.date)
  formTitle.value = '详情'
  isShowForm.value = true
  nextTick(() => {
    formRef.value.resetFields()
    Object.assign(form, { // reactive 直接替换对象的引用不会影响原始对象的代理
      orderNo: '202407022236526936',
      goodsNo: '202407022236526936',
      goodsName: '蓝莓大果',
      goodsQuantity: 200,
      goodsUnit: '斤',
      goodsPrice: 150.00,
      goodsPostage: 10.00,
      customerPhone: '13989562356',
      orderCreateTime: '2024-07-02 22:42:26',
      orderStatus: 'yqx',
      orderStatusText: '已取消',
      orderCancelReason: '就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消',
      selfRemark: '我是备注我是备注我是备注2222222222222222222222222222222我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
    })
  })
}
function tableEdit(record) {
  // console.log(record.date)
  formTitle.value = '编辑'
  isShowForm.value = true
  nextTick(() => {
    formRef.value.resetFields()
    Object.assign(form, { // reactive 直接替换对象的引用不会影响原始对象的代理
      orderNo: '202407022236526936',
      goodsNo: '202407022236526936',
      orderType: '',
      orderTypeText: '手动添加',
      goodsName: '蓝莓大果',
      goodsQuantity: 200,
      goodsUnit: '斤',
      goodsPrice: 150.00,
      goodsPostage: 10.00,
      customerPhone: '13989562356',
      orderCreateTime: '2024-07-02 22:42:26',
      orderStatus: 'yqx',
      orderStatusText: '已取消',
      orderCancelReason: '就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消',
      selfRemark: '我是备注我是备注我是备注2222222222222222222222222222222我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
    })
  })
}

let isFormSubmiting = ref(false)
function formCancel() {
  isShowForm.value = false
}
function formSubmit() {
  console.log(111);
  formRef.value.validate((valid, fields) => {
    if (valid) {
      isFormSubmiting.value = true
      console.log('submit!', form)
    }
  })
}



onMounted(() => {
  for (let i = 0; i < 100; i++) {
    tableData.value.push({
      orderNo: '202407022236526936',
      orderType: '',
      orderTypeText: '手动添加',
      goodsNo: '202407022236526936',
      goodsName: '蓝莓大果',
      goodsQuantity: 200,
      goodsUnit: '斤',
      goodsPrice: 150.00,
      goodsPostage: 10.00,
      customerPhone: '13989562356',
      orderCreateTime: '2024-07-02 22:42:26',
      orderStatus: 'yqx',
      orderStatusText: '已取消',
      orderCancelReason: '就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消',
      selfRemark: '我是备注我是备注我是备注2222222222222222222222222222222我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
    })
  }
  pagination.total = tableData.value.length

  calculateTableHeight()
})



</script>

<style lang="less" scoped>
.purchase {
  .search-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .search-content{
      flex: 1;
      .saerch-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .saerch-item-label {
          word-break: keep-all;
        }
        .search-item-input {
          flex: 1;
          :deep(div) {
            box-sizing: border-box !important;
          }
        }
      }
    }
    .search-btns {
      width: 200px;
      display: flex;
      justify-content: center;
    }
  }
  .options {
    height: 50px;
    display: flex;
    align-items: center;
  }
  .table-wrapper {
    .pagination-wrapper {
      height: 50px;
      .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .form-content {
    padding: 10px;
    box-sizing: border-box;
    .form-item-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .form-btns {
    display: flex;
    justify-content: flex-end;
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
