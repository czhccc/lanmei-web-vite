<template>
  <div class="news">

    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">标题：</div>
              <div class="search-item-input">
                <el-input placeholder="请输入" clearable v-model="searchParams.title"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">创建日期：</div>
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
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">是否展示：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.showed" placeholder="请选择" clearable>
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">是否置顶：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.pinned" placeholder="请选择" clearable>
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
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
        <el-table-column type="index" width="50" />
        <el-table-column prop="title" label="标题" align="center" />
        <el-table-column prop="isShow" label="是否展示" align="center" >
          <template #default="scope">
            <div>{{ scope.row.isShow ? '✔' : ' ' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="isPin" label="是否置顶" align="center" >
          <template #default="scope">
            <div>{{ scope.row.isPin ? '✔' : ' ' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="updateTime" label="更新时间" align="center" />
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
import { onMounted, reactive, ref, shallowRef } from 'vue';
import { useRouter, useRoute } from 'vue-router'

import { ElMessage } from 'element-plus';

import dayjs from 'dayjs'

import {
  _getNewsList,
} from '../../network/news'

const $route = useRoute()
const $router = useRouter()

let loadingInstance = null

let searchParams = reactive({
  title: '',
  createTime: [],
  showed: null,
  pinned: null,
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
  getNewsList()
}
function searchReset() {
  Object.assign(searchParams, {
    title: '',
    createTime: [],
    showed: null,
    pinned: null,
  })
  pagination.pageNo = 1
  getNewsList()
}
function tablePageSizeChange(newPageSize) {
  pagination.pageSize = newPageSize
  getNewsList()
}
function tablePageNoChange(newPageNo) {
  pagination.pageNo = newPageNo
  getNewsList()
}
function tableAdd(record) {
  $router.push({
    path: '/newsDetail',
    query: {
      id: record.id
    }
  })
}
function tableEdit(record) {
  $router.push({
    path: '/newsDetail',
    query: {
      id: record.id,
    }
  })
}
function getNewsList() {
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
  _getNewsList(params).then(res => {
    tableData.value = res.data.records.map(item => {
      return {
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
        updateTime: item.updateTime&&dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
      }
    })

    pagination.total = res.data.total
  }).finally(() => {
    loadingInstance.close()
  })
}
onMounted(() => {
  getNewsList()
  calculateTableHeight()
})


</script>

<style lang="less" scoped>
.news {
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
