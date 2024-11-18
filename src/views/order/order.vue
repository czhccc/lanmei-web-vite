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
              <div class="search-item-label">生成类型：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.generation_type" placeholder="请选择" clearable>
                  <el-option label="客户下单" value="auto" />
                  <el-option label="手动添加" value="manual" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单类型：</div>
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
              <div class="search-item-label">商品：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.goods_id" placeholder="请选择" clearable>
                  <el-option v-for="(item, index) in goodsList" :key="index" :label="item.goods_name" :value="item.id" />
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
              <div class="search-item-label">下单客户：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.user"></el-input>
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
        <el-table-column prop="order_no" label="订单号" align="center" />
        <el-table-column prop="generationTypeText" label="生成类型" align="center" />
        <el-table-column prop="batchTypeText" label="订单类型" align="center" />
        <el-table-column prop="snapshot_goodsName" label="商品" align="center" >
          <template #default="scope">
            <el-tooltip :content="'商品编号：'+scope.row.goods_id">
              <div style="cursor: pointer;" @click="goGoodsDetail(scope.row.goods_id)">{{ scope.row.snapshot_goodsName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量" align="center" >
          <template #default="scope">
            <div>{{ scope.row.num }} {{ scope.row.snapshot_goodsUnit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="finalPrice" label="预订/实付 总金额" align="center" >
          <template #default="scope">
            <el-tooltip v-if="scope.row.batch_type === 'preorder'" :content="'商品金额：'+scope.row.total_minPrice+'~'+scope.row.total_maxPrice+' 元' + ' ' + '邮费：'+scope.row.postage+' 元'">
              <div style="display: flex;flex-direction: column;align-items: center;">
                <div>{{ scope.row.finalPrice }} 元</div>
              </div>
            </el-tooltip>
            <el-tooltip v-if="scope.row.batch_type === 'stock'" :content="'商品金额：'+scope.row.total_price+' 元' + ' ' + '邮费：'+scope.row.postage+' 元'">
              <div style="display: flex;flex-direction: column;align-items: center;">
                <div>{{ scope.row.finalPrice }} 元</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="user" label="下单客户" align="center" />
        <el-table-column prop="createTime" label="下单时间" width="170" align="center" />
        <el-table-column prop="endTime" label="完结时间" width="170" align="center" />
        <el-table-column prop="statusText" label="订单状态" align="center" />
        <el-table-column prop="remark_customer" label="客户备注" align="center" />
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
  
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router'

import dayjs from 'dayjs'

import { 
  _getOrderList, 
} from '@/network/order'
import { 
  _getGoodsList, 
} from '@/network/goods'

const $router = useRouter()

let loadingInstance = null

// Table
let searchParams = reactive({
  order_no: '',
  generation_type: '',
  batch_type: '',
  status: '',
  goods_id: '',
  batch_no: '',
  user: '',
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
    generation_type: '',
    batch_type: '',
    status: '',
    goods_id: '',
    batch_no: '',
    user: '',
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
  // console.log(record.date)
  $router.push({
    path: '/orderDetail',
    query: {
      flag: 'add'
    }
  })
}
function tableDetail(record) {
  // console.log(record.date)
  $router.push({
    path: '/orderDetail',
    query: {
      id: '123321',
      flag: 'detail'
    }
  })
}
function tableEdit(record) {
  // console.log(record.date)
  $router.push({
    path: '/orderDetail',
    query: {
      id: '123321',
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
    params.endTime = `${searchParams.orderCreateTime[0]} 23:59:59`
  }
  _getOrderList(params).then(res => {
    tableData.value = res.data.records.map(item => {
      let statusText = ''
      switch (item.status) {
        case 'reserved': statusText='已预订'; break;
        case 'paid': statusText='已付款'; break;
        case 'unpaid': statusText='未付款'; break;
        case 'completed': statusText='已完成'; break;
        case 'canceled': statusText='已取消'; break;
        case 'refunded': statusText='已退款'; break;
        default: break;
      }

      let finalPrice = ''
      if (item.batch_type==='preorder') {
        let minPrice = (Number(item.total_minPrice) + Number(item.postage) - Number(item.discount_amount)).toFixed(2)
        let maxPrice = (Number(item.total_maxPrice) + Number(item.postage) - Number(item.discount_amount)).toFixed(2)
        finalPrice = `${minPrice} ~ ${maxPrice}`
      } else {
        finalPrice = (Number(item.total_price) + Number(item.postage) - Number(item.discount_amount)).toFixed(2)
      }

      return {
        ...item,
        batchTypeText: item.batch_type === 'preorder' ? '预订' : '现货',
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: item.endTime ? dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') : null,
        statusText,
        finalPrice,
        generationTypeText: item.generation_type === 'auto' ? '客户下单' : '手动生成'
      }
    })
    pagination.total = res.data.total
  }).finally(() => {
    loadingInstance.close()
  })
}

onMounted(() => {
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
      {label: '已完成', value: 'completed'},
      {label: '已取消', value: 'canceled'},
    ]
  } else {
    searchStatusList.value = [
      {label: '已付款', value: 'paid'},
      {label: '已完成', value: 'completed'},
      {label: '已取消', value: 'refunded'},
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
