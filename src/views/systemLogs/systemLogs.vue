<template>
  <div class="systemLogs">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">level：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.level" placeholder="请选择" clearable>
                  <el-option label="INFO" value="INFO" />
                  <el-option label="WARN" value="WARN" />
                  <el-option label="ERROR" value="ERROR" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">moduleType：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.moduleType"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">日期：</div>
              <div class="search-item-input">
                <el-date-picker 
                  type="daterange"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" 
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable 
                  v-model="searchParams.time" 
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
      <el-popconfirm
        title="确定批量删除"
        placement="top"
        @confirm="toDelete"
      >
        <template #reference>
          <el-button type="danger">批量删除</el-button>
        </template>
      </el-popconfirm>
      
      <el-button type="danger" @click="toDeleteByTimeRange">按时间范围删除</el-button>
    </div>

    <div class="table-wrapper">
      <el-table 
        :height="tableHeight" 
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" align="center" width="120" />
        <el-table-column prop="level" label="level" align="center" width="120" />
        <el-table-column prop="moduleType" label="moduleType" align="center" width="180" />
        <el-table-column prop="timestamp" label="timestamp" align="center" width="180" />
        <el-table-column prop="message" label="message" align="center" width="500" />
        <el-table-column label="detail message" align="center">
          <template #default="{ row }">
            {{ row.detail?.message || row.detail?.error?.message || '/' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template #default="{ row }">
            <el-button link type="primary" @click="showDetail(row.detail)">详情</el-button>
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
      v-model="detailDialogVisible" 
      title="详细信息" 
      width="1400px"
      align-center
    >
      <pre style="white-space: pre-wrap; word-break: break-all;">{{ JSON.stringify(currentDetail, null, 4) }}</pre>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="deleteDialogVisible" 
      title="按时间范围删除" 
      width="500px"
      align-center
    >
      <div style="padding: 0 40px;">
        <el-date-picker
          v-model="deleteTimeRange"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%;"
        />
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteDialogConfirm">确定删除</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';

import dayjs from 'dayjs';

import {
  _getSystemLogsList,
  _deleteSystemLogs,
  _deleteSystemLogsByTime
} from '@/network/systemLogs'

import { PlainMessage } from '../../utils/message'

// Table
let searchParams = reactive({
  level: '',
  moduleType: '',
  time: [],
})
let tableData = ref([])
let tableHeight = ref(0)
let pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

const calculateTableHeight = () => {
  const viewportHeight = window.innerHeight;
  const searchWrapperHeight = document.querySelector('.search-wrapper')?.offsetHeight || 0;
  const optionsWrapperHeight = document.querySelector('.options')?.offsetHeight || 0;
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper')?.offsetHeight || 0;
  tableHeight.value = viewportHeight - searchWrapperHeight - optionsWrapperHeight - paginationWrapperHeight - 120;
};
function search() {
  getList()
}
function searchReset() {
  Object.assign(searchParams, {
    level: '',
    moduleType: '',
    time: [],
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
let selectedRows = ref([])
function handleSelectionChange(val) {
  selectedRows.value = val
}

function getList() {
  let params = {
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    ...searchParams,
  }
  if (searchParams.time.length > 0) {
    params.startTime = `${searchParams.time[0]} 00:00:00`
    params.endTime = `${searchParams.time[1]} 23:59:59`
    delete params.time
  }

  _getSystemLogsList(params).then(res => {
    tableData.value = res.data.records.map(item => {
      return {
        ...item,
        timestamp: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      }
    })
    pagination.total = res.data.total
  })
}
onMounted(() => {
  calculateTableHeight()

  getList()
})


let detailDialogVisible = ref(false)
let currentDetail = ref({})

function showDetail(detail) {
  currentDetail.value = detail
  detailDialogVisible.value = true
}


function toDelete() {
  if (selectedRows.value.length === 0) {
    PlainMessage.success('请选择记录')
    return
  }

  _deleteSystemLogs({ 
    ids: selectedRows.value.map(item => item.id),
  }).then(res => {
    PlainMessage.success(res.message)
    getList()
  })
}

let deleteDialogVisible = ref(false)
let deleteTimeRange = ref([])
function toDeleteByTimeRange() {
  deleteTimeRange.value = []
  deleteDialogVisible.value = true
}
function deleteDialogConfirm() {
  if (!deleteTimeRange.value || deleteTimeRange.value.length !== 2) {
    PlainMessage.success('请选择时间范围')
    return
  }

  let params = {
    startTime: `${deleteTimeRange.value[0]} 00:00:00`,
    endTime: `${deleteTimeRange.value[1]} 23:59:59`,
  }
  _deleteSystemLogsByTime(params).then(res => {
    PlainMessage.success(res.message)
    deleteDialogVisible.value = false
    getList()
  })
}

</script>

<style lang="less" scoped>
.systemLogs {
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
}
.el-input[readonly] .el-input__inner,
.el-input[disabled] .el-input__inner,
.el-select[disabled] .el-select__inner {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
