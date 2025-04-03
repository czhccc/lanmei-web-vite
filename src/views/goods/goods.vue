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
        <el-table-column prop="goodsNo" label="商品编号" align="center" />
        <el-table-column prop="goodsName" label="商品名称" align="center" />
        <el-table-column prop="goodsUnit" label="商品单位" align="center" />
        <el-table-column prop="goodsCategoryId" label="商品分类" align="center" >
          <template #default="scope">
            <div>{{ translateCategoryId(scope.row.goodsCategoryId) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsCategoryId" label="封面图" align="center" >
          <template #default="scope">
            <el-image
              v-if="scope.row.goodsCoverImg"
              fit="scale-down"
              :src="scope.row.goodsCoverImg"
              :preview-src-list="[scope.row.goodsCoverImg]"
              hide-on-click-modal
              class="listCoverImg"
              preview-teleported
            />
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column prop="batchTypeText" label="当前批次类型" align="center" />
        <el-table-column prop="totalpreOrderQuantity" label="总预订量" align="center" >
          <template #default="scope">
            <div>{{ scope.row.totalPreorderQuantity }} {{ scope.row.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="totalSaleQuantity" label="售卖进度" align="center" >
          <template #default="scope">
            <div>{{ 111 }} {{ scope.row.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="totalpreOrderQuantity" label="剩余量" align="center" >
          <template #default="scope">
            <div>{{ 111 }} {{ scope.row.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsRemark" label="备注" align="center" />
        <el-table-column prop="goodsIsSelling" label="是否上架" align="center" >
          <template #default="scope">
            <el-switch
              disabled
              v-model="scope.row.goodsIsSelling"
              active-text="上架"
              inactive-text="下架"
              inline-prompt
              size="large"
            />
          </template>
        </el-table-column>
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
import { useRouter } from 'vue-router'

import {
  _getGoodsList,
} from '@/network/goods'
import {
  _getCategory
} from '@/network/category'

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
      id: record.goodsNo,
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
      return {
        goodsNo: item.id,
        goodsName: item.goods_name,
        goodsUnit: item.goods_unit,
        goodsCategoryId: item.goods_categoryId,
        goodsCoverImg: item.goods_coverImage,
        goodsRemark: item.goods_remark,
        goodsIsSelling: item.goods_isSelling===1 ? true : false,
        batchType: item.batch_type,
        batchTypeText: item.batch_type ? (item.batch_type==='stock'?'现货':'预订') : ''
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
