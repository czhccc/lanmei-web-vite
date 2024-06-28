<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次名称：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次名称：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次名称：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次名称：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次名称：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次名称：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btns">
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </div>
    </div>

    <div class="options">
      <el-button type="primary" @click="tableAdd">新增</el-button>
    </div>

    <div class="table-wrapper">
      <el-table :height="tableHeight" :data="tableData">
        <el-table-column prop="date" label="批次" align="center" />
        <el-table-column prop="name" label="产品" align="center" />
        <el-table-column prop="address" label="数量" align="center" />
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
    >
      <div class="form-content">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto">
          <el-form-item label="批次1111" prop="name">
            <el-input v-model="form.name" placeholder="自动生成" readonly />
          </el-form-item>
          <el-form-item label="选择" prop="desc">
            <el-select v-model="form.desc" placeholder="请选择">
              <el-option label="Zone No.1" value="shanghai" />
              <el-option label="Zone No.2" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="form-btns">
          <el-button @click="formCancel">取消</el-button>
          <el-button type="primary" @click="formSubmit(formRef)">提交</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

// Table
let tableData = ref([])
let tableHeight = ref(0)
let pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})
const calculateTableHeight = () => {
  const viewportHeight = window.innerHeight;
  const searchWrapperHeight = document.querySelector('.search-wrapper').offsetHeight;
  const optionsWrapperHeight = document.querySelector('.options').offsetHeight;
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper').offsetHeight;
  tableHeight.value = viewportHeight - searchWrapperHeight - optionsWrapperHeight - paginationWrapperHeight - 130;
};
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
}
function tableDetail(record) {
  // console.log(record.date)
  formTitle.value = '详情'
  isShowForm.value = true
}
function tableEdit(record) {
  // console.log(record.date)
  formTitle.value = '编辑'
  isShowForm.value = true
}


// 表单
let isShowForm = ref(false)
let formTitle = ref('')
let formRef = ref(null)
let form = reactive({
  name: '',
  desc: '',
})
const formRules = reactive({
  name: [{ required: true, message: 'Please input activity form', trigger: 'blur' },],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' },],
  // example: [
  //   { required: true, message: 'Please input Activity name', trigger: 'blur' },
  //   { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  // ],
})

function formCancel() {
  isShowForm.value = false
}
function formSubmit(formEl) {
  console.log(formEl)
  // const formEl = formRef.value;
  formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}



onMounted(() => {
  for (let i = 0; i < 100; i++) {
    tableData.value.push({
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
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
  }
  .form-btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
