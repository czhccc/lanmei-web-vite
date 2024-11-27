<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单id：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.order_id"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单编号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.order_no"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">操作人：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.operator"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">操作日期：</div>
              <div class="search-item-input">
                <el-date-picker 
                  type="daterange"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" 
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable 
                  v-model="searchParams.createTime" 
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

    <div class="table-wrapper">
      <el-table :height="tableHeight" :data="tableData">
        <el-table-column prop="id" label="日志id" width="120" align="center" />
        <el-table-column prop="order_id" label="订单" align="center" >
          <template #default="scope">
            <div>
              <div>订单id：{{ scope.row.order_id }}</div>
              <div>订单号：{{ scope.row.order_no }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="order_id" label="内容" align="center" >
          <template #default="scope">
            <div v-for="(item, index) in scope.row.changes" :key="index">
              <div>{{ item.key }}：{{ item.before }} → {{ item.after }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" align="center" />
        <el-table-column prop="createTime" label="操作时间" width="170" align="center" />
        <el-table-column fixed="right" label="操作" width="120" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="getTooltipRenderMode(scope.row)">查看订单</el-button>
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
  
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router'

import dayjs from 'dayjs'

import { 
  _getOrderLogsList, 
} from '@/network/order'

const $router = useRouter()

let loadingInstance = null

let searchParams = reactive({
  order_id: '',
  order_no: '',
  operator: '',
  createTime: [],
})
let tableData = ref([])
let tableHeight = ref(0)
let pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

function search() {
  getOrderLogsList()
}
function searchReset() {
  Object.assign(searchParams, {
    order_id: '',
    order_no: '',
    operator: '',
    createTime: [],
  })
  pagination.pageNo = 1
  getOrderLogsList()
}
function tablePageSizeChange(newPageSize) {
  pagination.pageSize = newPageSize
  getOrderLogsList()
}
function tablePageNoChange(newPageNo) {
  pagination.pageNo = newPageNo
  getOrderLogsList()
}
function tableEdit(record) {
  $router.push({
    path: '/orderDetail',
    query: {
      id: record.id,
      flag: 'edit'
    }
  })
}

function getOrderLogsList() {
  loadingInstance = ElLoading.service({text: '加载中...'})
  let params = {
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    ...searchParams,
  }
  if (searchParams.createTime.length > 0) {
    params.startTime = `${searchParams.createTime[0]} 00:00:00`
    params.endTime = `${searchParams.createTime[1]} 23:59:59`
  }
  _getOrderLogsList(params).then(res => {
    tableData.value = res.data.records.map(item => {
      let changes = {}
      Object.keys(item.changes).forEach(key => {
        changes[key] = {
          key,
          ...item.changes[key]
        }
      })
      return {
        ...item,
        changes,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
      }
    })
    pagination.total = res.data.total
  }).finally(() => {
    loadingInstance.close()
  })
}

function getTooltipRenderMode(record) {
  $router.push({
    path: '/orderDetail',
    query: {
      id: record.order_id,
      flag: 'edit'
    }
  })
}

onMounted(() => {
  getOrderLogsList()
  calculateTableHeight()
})

const calculateTableHeight = () => {
  const viewportHeight = window.innerHeight;
  const searchWrapperHeight = document.querySelector('.search-wrapper').offsetHeight;
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper').offsetHeight;
  tableHeight.value = viewportHeight - searchWrapperHeight - paginationWrapperHeight - 120;
};
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
