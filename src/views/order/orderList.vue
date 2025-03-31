<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.order_no"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单状态：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.status" placeholder="请选择" clearable>
                  <el-option label="已预订" value="reserved" />
                  <el-option label="已取消" value="canceled" />
                  <el-option label="未付款" value="unpaid" />
                  <el-option label="已付款" value="paid" />
                  <el-option label="已发货" value="shipped" />
                  <el-option label="已完结" value="completed" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次编号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.batch_no"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次类型：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.batch_type" placeholder="请选择" clearable @change="searchBatchTypeChange">
                  <el-option label="预订" value="preorder" />
                  <el-option label="现货" value="stock" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6" v-if="searchParams.batch_type">
            <div class="saerch-item">
              <div class="search-item-label">订单状态：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.status" placeholder="请选择" clearable>
                  <el-option v-for="(item, index) in searchStatusList" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">下单人：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.create_by"></el-input>
              </div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">下单日期：</div>
              <div class="search-item-input">
                <el-date-picker 
                  type="daterange"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" 
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable 
                  v-model="searchParams.orderCreateTime" 
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
        <el-table-column type="index" width="50" />
        <el-table-column prop="order_no" label="订单号" align="center" />
        <el-table-column prop="snapshot_goodsName" label="商品" align="center" width="200" >
          <template #default="scope">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <el-image
                style="width: 60px; height: 60px;"
                :src="scope.row.snapshot_coverImage"
                :preview-src-list="[scope.row.snapshot_coverImage]"
                fit="cover"
              />
              <div style="word-break: keep-all;">{{ scope.row.batch_type==='preorder' ? '预订' : '现货' }}</div>
            </div>
            <div>{{ scope.row.snapshot_goodsName }}</div>
            <div>{{ scope.row.batch_no }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" align="center" >
          <template #default="scope">
            <div>{{ scope.row.quantity }} {{ scope.row.snapshot_goodsUnit }}</div>
            <div>￥{{ scope.row.theTotalPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="create_by" label="下单人" align="center" />
        <el-table-column prop="createTime" label="下单时间" align="center" width="170" />
        <el-table-column prop="quantity" label="收货省市区" align="center" >
          <template #default="scope">
            <el-tooltip :content="scope.row.receive_address +' '+ scope.row.receive_phone +' '+scope.row.receive_name ">
              <div>
                <div>{{ scope.row.receive_province }}</div>
                <div>{{ scope.row.receive_city }}</div>
                <div>{{ scope.row.receive_district }}</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="statusText" label="订单状态" align="center" width="170" >
          <template #default="scope">
            <div>{{ scope.row.statusText }}</div>
            <div v-if="scope.row.status === 'reserved'">{{ dayjs(scope.row.preorder_time).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div v-if="scope.row.status === 'canceled'">{{ dayjs(scope.row.cancel_time).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div v-if="scope.row.status === 'unpaid'"><div>批次开售时间：</div>{{ dayjs(scope.row.batch_preorder_startSelling_time).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div v-if="scope.row.status === 'paid'">{{ dayjs(scope.row.pay_time).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div v-if="scope.row.status === 'shipped'">{{ dayjs(scope.row.ship_time).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div v-if="scope.row.status === 'completed'">{{ dayjs(scope.row.complete_time).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="remark_self" label="己方备注" align="center" />
        <el-table-column fixed="right" label="操作" width="120" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="tableEdit(scope.row)">查看</el-button>
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
import { useRouter, useRoute } from 'vue-router'

import dayjs from 'dayjs'

import { 
  _getOrderList, 
} from '@/network/order'
import { 
  _getGoodsList, 
} from '@/network/goods'

const $route = useRoute()
const $router = useRouter()

let loadingInstance = null

// Table
let searchParams = reactive({
  order_no: '',
  batch_type: '',
  status: '',
  goods_id: '',
  batch_no: '',
  create_by: '',
  orderCreateTime: [],
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
  const searchWrapperHeight = document.querySelector('.search-wrapper').offsetHeight;
  const optionsWrapperHeight = document.querySelector('.options').offsetHeight;
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper').offsetHeight;
  tableHeight.value = viewportHeight - searchWrapperHeight - optionsWrapperHeight - paginationWrapperHeight - 120;
};
function search() {
  getOrderList()
}
function searchReset() {
  Object.assign(searchParams, {
    order_no: '',
    batch_type: '',
    status: '',
    goods_id: '',
    batch_no: '',
    create_by: '',
    orderCreateTime: [],
  })
  pagination.pageNo = 1
  getOrderList()
}
function tablePageSizeChange(newPageSize) {
  pagination.pageSize = newPageSize
  getOrderList()
}
function tablePageNoChange(newPageNo) {
  pagination.pageNo = newPageNo
  getOrderList()
}
function tableAdd(record) {
  $router.push({
    path: '/orderDetail',
    query: {
      flag: 'add'
    }
  })
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

function getOrderList() {
  loadingInstance = ElLoading.service({text: '加载中...'})
  let params = {
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    ...searchParams,
  }
  if (searchParams.orderCreateTime.length > 0) {
    params.startTime = `${searchParams.orderCreateTime[0]} 00:00:00`
    params.endTime = `${searchParams.orderCreateTime[1]} 23:59:59`
  }
  _getOrderList(params).then(res => {
    tableData.value = res.data.records.map(item => {
      let statusText = ''
      switch (item.status) {
        case 'reserved': statusText='已预订'; break;
        case 'canceled': statusText='已取消'; break;
        case 'unpaid': statusText='未付款'; break;
        case 'paid': statusText='已付款'; break;
        case 'shipped': statusText='已发货'; break;
        case 'completed': statusText='已完结'; break;
        case 'refunded': statusText='已退款'; break;
        default: break;
      }

      let theTotalPrice = 0;
      if (item.batch_type === 'preorder') {
        if (item.pay_finalAmount) {
          theTotalPrice = item.pay_finalAmount
        } else if (item.preorder_finalPrice) {
          theTotalPrice = (Number(item.preorder_finalPrice)*Number(item.quantity) + Number(item.postage) - Number(item.discountAmount_promotion)).toFixed(2)
        } else if (!item.preorder_finalPrice) {
          let finalMinPrice = (Number(item.preorder_minPrice)*Number(item.quantity) + Number(item.postage) - Number(item.discountAmount_promotion)).toFixed(2)
          let finalMaxPrice = (Number(item.preorder_maxPrice)*Number(item.quantity) + Number(item.postage) - Number(item.discountAmount_promotion)).toFixed(2)
          theTotalPrice = `${finalMinPrice} ~ ${finalMaxPrice}`
        }
      } else if (item.batch_type === 'stock') {
        theTotalPrice = item.pay_finalAmount
      }

      return {
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
        statusText,
        theTotalPrice,
      }
    })

    pagination.total = res.data.total
  }).finally(() => {
    loadingInstance.close()
  })
}

onMounted(() => {
  searchParams.batch_no = $route.query.batchNo
  getOrderList()
  getGoodsList()
  calculateTableHeight()
})

function goGoodsDetail(goodsId) {
  $router.push({
    path: '/goodsDetail',
    query: {
      flag: 'edit',
      id: goodsId,
    }
  })
}

let goodsList = ref([])
function getGoodsList() {
  _getGoodsList({
    pageNo: 1,
    pageSize: 999
  }).then(res => {
    goodsList.value = res.data.records
  })
}

let searchStatusList = ref([])
function searchBatchTypeChange(e) {
  if (e === 'preorder') {
    searchStatusList.value = [
      {label: '已预订', value: 'reserved'},
      {label: '未付款', value: 'unpaid'},
      {label: '已付款', value: 'paid'},
      {label: '已完结', value: 'completed'},
      {label: '已取消', value: 'canceled'},
      {label: '已退款', value: 'refunded'},
    ]
  } else {
    searchStatusList.value = [
      {label: '已付款', value: 'paid'},
      {label: '已完结', value: 'completed'},
      {label: '已退款', value: 'refunded'},
    ]
  }
}
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
}
.el-input[readonly] .el-input__inner,
.el-input[disabled] .el-input__inner,
.el-select[disabled] .el-select__inner {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
