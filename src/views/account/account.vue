<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">手机号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.phone"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">姓名：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.name"></el-input>
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
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="roleText" label="角色" align="center" />
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
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入" maxlength="20" clearable />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入" maxlength="20" clearable />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入" maxlength="20" clearable />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择" clearable>
              <el-option label="管理员" :value="1" />
              <el-option label="超级管理员" :value="2" />
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

import {
  _getAdminList,
  _createOrUpdateAdmin,
  _deleteAdmin
} from '@/network/account'

// Table
let searchParams = reactive({
  phone: '',
  name: '',
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
  phone: '',
  password: '',
  name: '',
  role: '',
})
const formRules = reactive({
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' },],
  password: [{ required: false, message: '请输入密码', trigger: 'blur' },],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
  role: [{ required: true, message: '请选择角色', trigger: 'blur' },],
})

const calculateTableHeight = () => {
  const viewportHeight = window.innerHeight;
  const searchWrapperHeight = document.querySelector('.search-wrapper').offsetHeight;
  const optionsWrapperHeight = document.querySelector('.options').offsetHeight;
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper').offsetHeight;
  tableHeight.value = viewportHeight - searchWrapperHeight - optionsWrapperHeight - paginationWrapperHeight - 120;
};
function search() {
  getList()
}
function searchReset() {
  Object.assign(searchParams, {
    phone: '',
    name: '',
  })
  pagination.pageNo = 1
  getList()
}
function tablePageSizeChange(newPageSize) {
  pagination.pageSize = newPageSize
  getList()
}
function tablePageNoChange(newPageNo) {
  pagination.pageNo = newPageNo
  getList()
}
function tableAdd() {
  formTitle.value = '新增'
  isShowForm.value = true
  nextTick(() => {
    formRef.value.resetFields()
    Object.assign(form, {
      phone: '',
      password: '',
      name: '',
      role: 1,
    })
  })
  
}
function tableEdit(record) {
  formTitle.value = '编辑'
  isShowForm.value = true
  nextTick(() => {
    formRef.value.resetFields()
    Object.assign(form, {
      ...record
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
    _deleteAdmin({
      phone: record.phone
    }).then(res => {
      ElMessage({
        message: res.message,
        type: 'success',
        plain: true,
      })
      getList()
    })
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

      _createOrUpdateAdmin(form).then(res => {
        ElMessage({
          message: res.message,
          type: 'success',
          plain: true,
        })

        isShowForm.value = false
        getList()
      }).finally(() => {
        isFormSubmiting.value = false
      })
    }
  })
}


const getList = () => {
  _getAdminList({
    ...searchParams,
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
  }).then(res => {
    tableData.value = res.data.records.map(item => {
      return {
        ...item,
        roleText: item.role===1?'管理员':'超级管理员'
      }
    })
    pagination.total = res.data.total
  })
}


onMounted(() => {
  calculateTableHeight()

  getList()
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
