<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
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
              <div class="search-item-label">进货日期：</div>
              <div class="search-item-input">
                <el-date-picker 
                  type="daterange"
                  format="YYYY/MM/DD" value-format="YYYY-MM-DD" 
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable 
                  v-model="searchParams.purchaseDate" 
                  style="width: 100%;" 
                />
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">商品状态：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.status" placeholder="请选择" clearable>
                  <el-option label="预订中" value="ydz" />
                  <el-option label="采购中" value="dfk" />
                  <el-option label="售卖中" value="yfk" />
                  <el-option label="已下架" value="ywj" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">是否上架：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.isSelling" placeholder="请选择" clearable>
                  <el-option label="上架中" value="ydz" />
                  <el-option label="未上架" value="dfk" />
                </el-select>
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
        <el-table-column prop="no" label="商品编号" align="center" />
        <el-table-column prop="name" label="商品名称" align="center" />
        <el-table-column prop="statusText" label="当前状态" align="center" />
        <el-table-column prop="totalpreOrderQuantity" label="总预订量" align="center" >
          <template #default="scope">
            <div>{{ scope.row.totalPreorderQuantity }} {{ scope.row.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="totalSaleQuantity" label="售卖进度" align="center" >
          <template #default="scope">
            <div>{{ scope.row.totalSaleQuantity-scope.row.remainingQuantity }}/{{ scope.row.totalSaleQuantity }} {{ scope.row.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="totalpreOrderQuantity" label="剩余量" align="center" >
          <template #default="scope">
            <div>{{ scope.row.remainingQuantity }} {{ scope.row.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
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

// Table
let searchParams = reactive({
  goodsNo: '',
  goodsName: '',
  purchaseDate: [],
  status: '',
  isSelling: null,
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
    batch: '',
    name: '',
    date: null,
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
    path: '/goodsDetail',
    query: {
      flag: 'add'
    }
  })
}
function tableDetail(record) {
  // console.log(record.date)
  $router.push({
    path: '/goodsDetail',
    query: {
      id: '123321',
      flag: 'detail'
    }
  })
}
function tableEdit(record) {
  // console.log(record.date)
  $router.push({
    path: '/goodsDetail',
    query: {
      id: '123321',
      flag: 'edit'
    }
  })
}

onMounted(() => {
  for (let i = 0; i < 100; i++) {
    tableData.value.push({
      no: '202407022236526936',
      name: '蓝莓大果',
      totalSaleQuantity: 150,
      unit: '斤',
      status: '1',
      statusText: '预定中',
      totalPreorderQuantity: 100,
      remainingQuantity: 80,


      price: 200.00,
      originalPrice: 150.00,

      remark: '我是备注我是备注我是备注2222222222222222222222222222222我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
      
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
