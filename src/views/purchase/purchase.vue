<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">采购编号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.no"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">商品编号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.goodsNo"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">商品名称：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.goodsName"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">采购日期：</div>
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
        <el-table-column prop="no" label="采购编号" align="center" />
        <el-table-column prop="name" label="商品名称" align="center" />
        <el-table-column prop="realQuantity" label="实际售卖量" align="center" >
          <template #default="scope">
            {{ scope.row.totalCost }} {{ scope.row.unit }}
          </template>
        </el-table-column>
        <el-table-column prop="totalCost" label="总成本" align="center" >
          <template #default="scope">
            {{ scope.row.totalCost }} 元
          </template>
        </el-table-column>
        <el-table-column prop="date" label="采购日期" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column fixed="right" label="操作" width="160" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="tableDetail(scope.row)">详情</el-button>
            <el-button link type="primary" @click="tableEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="tableDelete(scope.row)">删除</el-button>
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
          <el-form-item label="采购编号" prop="no">
            <el-input v-model="form.no" placeholder="自动生成" readonly />
          </el-form-item>
          <el-form-item label="商品编号" prop="goodsNo">
            <div style="width: 100%;display: flex;align-items: center;">
              <el-input :value="form.goodsNo" placeholder="请关联商品" readonly />
              <el-button type="primary" link style="margin-left: 20px;" @click="toRelateGoods">关联商品</el-button>
            </div>
          </el-form-item>
          <el-form-item label="商品名称" required>
            <el-input :value="form.goodsName" readonly />
          </el-form-item>
          <el-form-item label="单位" required>
            <el-input :value="form.goodsUnit" readonly />
          </el-form-item>
          <el-form-item label="数量" required>
            <div style="display: flex;align-items: center;justify-content: space-between;">
              <el-form-item prop="totalQuantity" style="flex: 1;">
                <el-input-number v-model="form.totalQuantity" placeholder="总量" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: center;margin: 0 10px;">-</div>
              <el-form-item prop="lossQuantity" style="flex: 1;">
                <el-input-number v-model="form.lossQuantity" placeholder="损耗量" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: center;margin: 0 10px;">=</div>
              <el-form-item prop="realQuantity" style="flex: 1;">
                <el-input-number v-model="form.realQuantity" placeholder="实际售卖量" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: right;margin-left: 10px;">{{ form.unit || '单位' }}</div>
            </div>
          </el-form-item>
          <el-form-item label="成本" required>
            <div style="display: flex;align-items: center;justify-content: space-between;">
              <el-form-item prop="goodsCost" style="flex: 1;">
                <el-input-number v-model="form.goodsCost" placeholder="商品成本" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: center;margin: 0 10px;">+</div>
              <el-form-item prop="otherCost" style="flex: 1;">
                <el-input-number v-model="form.otherCost" placeholder="其他成本" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: center;margin: 0 10px;">=</div>
              <el-form-item prop="totalCost" style="flex: 1;">
                <el-input-number v-model="form.totalCost" placeholder="总成本" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
              </el-form-item>
              <div style="text-align: right;margin-left: 10px;">元</div>
            </div>
          </el-form-item>
          <el-form-item label="采购日期" prop="date">
            <el-date-picker type="date" format="YYYY/MM/DD" value-format="YYYY-MM-DD" v-model="form.date" placeholder="请选择" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="采购来源" prop="source">
            <el-input v-model="form.source" placeholder="请输入" maxlength="50" clearable />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" autosize v-model="form.remark" maxlength="200" show-word-limit placeholder="请输入" clearable />
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

    <!-- 关联商品 -->
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
        <el-table-column property="goodsUnit" label="商品单位" align="center" />
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
import { onMounted, reactive, ref, nextTick } from 'vue';

import { useRoute, useRouter } from 'vue-router'

const $route = useRoute()
const $router = useRouter()

let loadingInstance = null

// Table
let searchParams = reactive({
  no: '',
  goodsNo: '',
  goodsName: '',
  date: [],
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
  no: '',
  name: '',
  unit: '',
  totalQuantity: null,
  lossQuantity: null,
  realQuantity: null,
  goodsCost: null,
  otherCost: null,
  totalCost: null,
  date: null,
  source: '',
  remark: '',
})
const formRules = reactive({
  no: [{ required: true, message: '请输入采购编号', trigger: 'blur' },],
  goodsNo: [{ required: true, message: '请关联商品', trigger: 'blur' },],
  totalQuantity: [
    { required: true, message: '请输入总数量', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 999999, message: '请输入总数量', trigger: 'blur' },
  ],
  lossQuantity: [
    { required: true, message: '请输入损耗量', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 999999, message: '请输入损耗量', trigger: 'blur' },
  ],
  realQuantity: [
    { required: true, message: '请输入实际售卖量', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 999999, message: '请输入实际售卖量', trigger: 'blur' },
  ],
  goodsCost: [
    { required: true, message: '请输入商品成本', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入商品成本', trigger: 'blur' },
  ],
  otherCost: [
    { required: true, message: '请输入其他成本', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入其他成本', trigger: 'blur' },
  ],
  totalCost: [
    { required: true, message: '请输入总成本', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入总成本', trigger: 'blur' },
  ],
  date: [{ required: true, message: '请选择采购日期', trigger: 'blur' },],
  source: [{ required: false, message: '请输入采购来源', trigger: 'blur' },],
  remark: [{ required: false, message: '请输入备注', trigger: 'blur' },],
})

const calculateTableHeight = () => {
  const viewportHeight = window.innerHeight;
  const searchWrapperHeight = document.querySelector('.search-wrapper')?.offsetHeight || 0;
  const optionsWrapperHeight = document.querySelector('.options')?.offsetHeight || 0;
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper')?.offsetHeight || 0;
  tableHeight.value = viewportHeight - searchWrapperHeight - optionsWrapperHeight - paginationWrapperHeight - 120;
};
function search() {

}
function searchReset() {
  Object.assign(searchParams, {
    no: '',
    goodsNo: '',
    goodsName: '',
    date: [],
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
    form.no = `${year}${month}${day}${hours}${minutes}${seconds}`;
  })
  
}
function tableDetail(record) {
  // console.log(record.date)
  formTitle.value = '详情'
  isShowForm.value = true
  nextTick(() => {
    formRef.value.resetFields()
    Object.assign(form, { // reactive 直接替换对象的引用不会影响原始对象的代理
      no: '112233',
      name: '蓝莓大果',
      unit: '斤',
      totalQuantity: 150,
      lossQuantity: 50,
      realQuantity: 100,
      goodsCost: 100,
      otherCost: 100,
      totalCost: 150,
      date: '2024-06-19',
      source: '我是采购来源',
      remark: '我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
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
      no: '112233',
      name: '蓝莓大果',
      unit: '斤',
      totalQuantity: 150,
      lossQuantity: 50,
      realQuantity: 100,
      goodsCost: 100,
      otherCost: 100,
      totalCost: 150,
      date: '2024-06-19',
      source: '我是采购来源',
      remark: '我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
    })
  })
}
function toRelateGoods(record) { // 关联商品
  isShowChooseGoodsDialog.value = true
}
function tableDelete(record) {
  ElMessageBox.confirm(
    '确定删除?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    
  }).catch(() => {
    
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


// 关联商品弹框
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
  {goodsNo: '111', goodsName: '蓝莓大大', goodsUnit: '斤'},
  {goodsNo: '222', goodsName: '蓝莓小小', goodsUnit: '斤'},
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
  for (let i = 0; i < 100; i++) {
    tableData.value.push({
      no: '112233',
      name: '蓝莓大果',
      unit: '斤',
      totalQuantity: 150,
      lossQuantity: 50,
      realQuantity: 100,
      goodsCost: 100,
      otherCost: 100,
      totalCost: 150,
      date: '2024-06-19',
      remark: '我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
    })
  }
  pagination.total = tableData.value.length

  calculateTableHeight()

  loadingInstance = ElLoading.service({text: '加载中...'})
  setTimeout(() => {
    loadingInstance.close()
  }, 500)
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
