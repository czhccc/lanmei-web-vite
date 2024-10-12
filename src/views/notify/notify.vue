<template>
  <div class="purchase">
    <div class="search-wrapper">
    </div>

    <div class="options">
      <el-button type="primary" @click="notifyNew">发布新通知</el-button>
    </div>

    <div class="table-wrapper">
      <el-table :height="tableHeight" :data="tableData">
        <el-table-column prop="id" label="id" align="center" />
        <el-table-column prop="content" label="内容" align="center" />
        <el-table-column prop="createBy" label="操作人" align="center" />
        <el-table-column prop="createTime" label="操作时间" align="center" />
        <!-- <el-table-column fixed="right" label="操作" width="160" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="tableDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column> -->
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
      class="notifyModal"
      v-model="isShowNotifyModal" 
      title="发布新通知" 
      width="40%" 
      center 
      align-center
    >
      <div class="notifyModal-content">
        <el-input 
          style="margin-top: 10px;"
          type="textarea"
          v-model="notifyInputValue" 
          autosize 
          maxlength="200" 
          show-word-limit
          placeholder="请输入" 
          clearable
        />
        <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
          <el-button type="primary" :loading="isFormSubmiting" :disabled="!notifyInputValue || notifyInputValue.length>200" @click="notifyConfirm">提交</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref, nextTick } from 'vue';

import dayjs from 'dayjs'

import {
  _getNotificationList,
  _notify
} from '@/network/notify'

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
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper').offsetHeight;
  tableHeight.value = viewportHeight - searchWrapperHeight - paginationWrapperHeight - 120;
};
function tablePageSizeChange(newPageSize) {
  pagination.pageSize = newPageSize
  getList()
}
function tablePageNoChange(newPageNo) {
  pagination.pageNo = newPageNo
  getList()
}

let isShowNotifyModal = ref(false)
let notifyInputValue = ref('')

function notifyNew() {
  isShowNotifyModal.value = true
}

let isFormSubmiting = ref(false)

function notifyConfirm() {
  ElMessageBox.confirm(
    '确定发布?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    isFormSubmiting.value = true

    _notify({
      content: notifyInputValue.value,
    }).then(res => {
      ElMessage({
        message: res.message,
        type: 'success',
        plain: true,
      })

      getList()
      isShowNotifyModal.value = false
      notifyInputValue.value = null
    }).finally(() => {
      isFormSubmiting.value = false
    })
  })
}

function getList() {
  _getNotificationList({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
  }).then(res => {
    tableData.value = res.data.records.map(item => {
      return {
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
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
  .notifyModal-content {
    padding-right: 10px;
    max-height: 60vh;
    overflow-y: auto;
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
