<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单类型：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.orderType" placeholder="请选择" clearable>
                  <el-option label="线上订单" value="onlineOrder" />
                  <el-option label="线下订单" value="offlineOrder" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.orderNo"></el-input>
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
              <div class="search-item-label">批次编号：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.batch"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">客户联系方式：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.customerPhone"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">订单状态：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.orderStatus" placeholder="请选择" clearable>
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
        <el-table-column prop="payAmount" label="实付总金额" align="center" >
          <template #default="scope">
            <el-tooltip :content="'商品金额：'+scope.row.goodsPrice.toFixed(2)+'元' + ' ' + '邮费：'+scope.row.goodsPostage.toFixed(2)+' 元'">
              <div style="display: flex;flex-direction: column;align-items: center  ;">
                <div>{{ scope.row.goodsTotalPrice.toFixed(2) }} 元</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="客户联系方式" align="center" />
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
  
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router'

const $router = useRouter()

let loadingInstance = null

// Table
let searchParams = reactive({
  orderType: '',
  orderNo: '',
  goodsNo: '',
  goodsName: '',
  batch: '',
  customerPhone: '',
  orderStatus: '',
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

}
function searchReset() {
  Object.assign(searchParams, {
    orderType: '',
    orderNo: '',
    goodsNo: '',
    goodsName: '',
    batch: '',
    customerPhone: '',
    orderStatus: '',
    orderCreateTime: [],
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

onMounted(() => {
  for (let i = 0; i < 100; i++) {
    tableData.value.push({
      orderNo: '202407022236526936',
      orderType: 'onlineOrder',
      orderTypeText: '线上订单',
      goodsNo: '202407022236526936',
      goodsName: '蓝莓大果',
      goodsQuantity: 200,
      goodsUnit: '斤',
      goodsPrice: 150.00,
      goodsPostage: 10.00,
      goodsTotalPrice: 160.00,
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
