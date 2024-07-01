<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">账号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.account"></el-input>
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
        <el-table-column prop="account" label="账号" align="center" />
        <el-table-column prop="password" label="密码" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="role" label="角色" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column prop="usable" label="状态" align="center" >
          <template #default="scope">
            <el-switch v-model="scope.row.usable" active-text="启用" inactive-text="冻结" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160" align="center" >
          <template #default="scope">
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
          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入" maxlength="20" clearable />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入" maxlength="20" clearable />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入" maxlength="20" clearable />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择" clearable>
              <el-option label="管理员" value="admin" />
              <el-option label="超级管理员" value="superadmin" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" autosize v-model="form.remark" maxlength="200" show-word-limit placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="usable">
            <el-switch v-model="form.usable" active-text="启用" inactive-text="冻结" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer v-if="formTitle!=='详情'">
        <div class="form-btns">
          <el-button @click="formCancel">取消</el-button>
          <el-button type="primary" @click="formSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue';

// Table
let searchParams = reactive({
  account: '',
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
  account: '',
  password: '',
  name: '',
  role: '',
  remark: '',
  usable: true
})
const formRules = reactive({
  account: [{ required: true, message: '请输入账号', trigger: 'blur' },],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' },],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
  role: [{ required: true, message: '请选择角色', trigger: 'blur' },],
  usable: [{ required: true, message: '请选择状态', trigger: 'blur' },],
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
    account: '',
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
      account: '112233',
      password: '123456',
      name: '雅儿贝德',
      role: 'superadmin',
      remark: '我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
      usable: true
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
      account: '112233',
      password: '123456',
      name: '雅儿贝德',
      role: 'superadmin',
      remark: '我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
      usable: true
    })
  })
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
      account: '112233',
      password: '123456',
      name: '雅儿贝德',
      role: 'superadmin',
      remark: '我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
      usable: true
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
