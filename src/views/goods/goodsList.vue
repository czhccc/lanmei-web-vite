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
              <div class="search-item-label">商品分类：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.goodsCategoryId" style="width: 100%;" placeholder="请选择">
                  <el-option-group v-for="parent in categoryList" :key="parent.id" :label="parent.name" >
                    <el-option v-for="category in parent.children" :key="category.id" :label="category.name" :value="category.id" />
                  </el-option-group>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">当前批次类型：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.batchType" placeholder="请选择" clearable>
                  <el-option label="预订" value="preorder" />
                  <el-option label="现货" value="stock" />
                  <el-option label="无当前批次" value="null" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">是否上架：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.goodsIsSelling" placeholder="请选择" clearable>
                  <el-option label="上架" :value="1" />
                  <el-option label="下架" :value="0" />
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
        <el-table-column prop="id" label="商品编号" align="center" width="80" />
        <el-table-column prop="goods_name" label="商品名称" align="center" />
        <el-table-column prop="goods_categoryId" label="分类~单位" align="center" width="200" >
          <template #default="scope">
            <div>{{ translateCategoryId(scope.row.goods_categoryId) }} ~ {{ scope.row.goods_unit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goods_coverImage" label="封面图" align="center" width="140" >
          <template #default="scope">
            <el-image
              v-if="scope.row.goods_coverImage"
              fit="scale-down"
              :src="scope.row.goods_coverImage"
              :preview-src-list="[scope.row.goods_coverImage]"
              hide-on-click-modal
              class="listCoverImg"
              preview-teleported
              style="width: 100px; height: 100px;"
            />
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column prop="batchTypeText" label="批次类型" align="center" width="120"/>
        <el-table-column prop="totalOrdersCount" label="有效订单数" align="center" width="130">
          <template #default="scope">
            <div v-if="scope.row.batch_type==='preorder'">{{ scope.row.totalOrdersCount }}</div>
            <div v-if="scope.row.batch_type==='stock'">{{ scope.row.totalOrdersCount }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="batch_preorder_reservedQuantity" label="进度" align="center" >
          <template #default="scope">
            <div v-if="scope.row.batch_type==='preorder'">
              <div v-if="!scope.row.batch_preorder_finalPrice">
                <div>总预订数量：{{ formatNumber(scope.row.batch_preorder_reservedQuantity) }} {{ scope.row.goods_unit }}</div>
                <div>总预订订单数：{{ scope.row.batch_preorder_reservedOrdersCount }}</div>
              </div>
              <div v-if="scope.row.batch_preorder_finalPrice">
                <div>已完成数量：{{ formatNumber(scope.row.batch_preorder_finishedQuantity) }} / {{ scope.row.batch_preorder_totalReservedQuantity }} {{ scope.row.goods_unit }}</div>
                <div>已完成订单数：{{ formatNumber(scope.row.batch_preorder_finishedOrdersCount) }} / {{ formatNumber(scope.row.batch_preorder_totalReservedOrdersCount) }}</div>
              </div>
            </div>
            <div v-if="scope.row.batch_type==='stock'">
              <div>剩余库存：{{ scope.row.batch_stock_remainingQuantity }} {{ scope.row.goods_unit }}</div>
              <div>已完成数量：{{ formatNumber(scope.row.batch_stock_finishedQuantity) }} / {{ formatNumber(scope.row.batch_stock_totalQuantity) }} {{ scope.row.goods_unit }}</div>
              <div>已完成订单数：{{ formatNumber(scope.row.batch_stock_finishedOrdersCount) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goods_remark" label="备注" align="center" />
        <el-table-column prop="goodsIsSelling" label="是否上架" align="center" width="80" >
          <template #default="scope">
            <el-switch
              disabled
              v-model="scope.row.goodsIsSelling"
              active-text="上架"
              inactive-text="下架"
              inline-prompt
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="120" >
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
import { useRouter } from 'vue-router'

import {
  _getGoodsList,
} from '@/network/goods'
import {
  _getCategory
} from '@/network/category'

import formatNumber from '../../utils/formatNumber'

const $router = useRouter()

// Table
let searchParams = reactive({
  goodsNo: null,
  goodsName: null,
  goodsCategoryId: null,
  batchType: null,
  goodsIsSelling: null,
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
    goodsNo: null,
    goodsName: null,
    goodsCategoryId: null,
    batchType: null,
    goodsIsSelling: null,
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
function tableAdd(record) {
  $router.push({
    path: '/goodsDetail',
    query: {
      flag: 'add'
    }
  })
}
function tableEdit(record) {
  $router.push({
    path: '/goodsDetail',
    query: {
      flag: 'edit',
      id: record.id,
    }
  })
}


function getList() {
  _getGoodsList({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    ...searchParams
  }).then(res => {
    pagination.total = res.data.total

    tableData.value = res.data.records.map(item => {
      let batchTypeText = ''

      let stockSoldQuantity = null
      if (item.batch_type && item.batch_type==='preorder') {
        batchTypeText = item.batch_preorder_finalPrice ? '预订 - 售卖' : '预订 - 预购'
      } else if (item.batch_type && item.batch_type === 'stock') {
        batchTypeText = '现货'

        stockSoldQuantity = item.batch_stock_totalQuantity&&item.batch_stock_remainingQuantity ? (Number(item.batch_stock_totalQuantity) - Number(item.batch_stock_remainingQuantity)) : '?'
      }
      console.log('stockSoldQuantity', stockSoldQuantity);

      return {
        ...item,
        goodsIsSelling: item.goods_isSelling===1 ? true : false,
        batchTypeText,
        stockSoldQuantity
      }
    })
  })
}

let categoryList = ref([])
function getCategoryList() {
  _getCategory().then(res => {
    categoryList.value = res.data
  })
}
function translateCategoryId(id) {
  const category = categoryList.value.flatMap(item => item.children).find(iten => iten.id === id);
  return category ? category.name : null; // 返回找到的名称或 null
}

onMounted(() => {
  calculateTableHeight()

  getCategoryList()
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
    .listCoverImg {
      z-index: 999;
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
