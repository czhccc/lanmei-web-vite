<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">是否已回复：</div>
              <div class="search-item-input">
                <el-select v-model="searchParams.hasResponsed" placeholder="请选择" clearable>
                  <el-option label="未回复" :value="false" />
                  <el-option label="已回复" :value="true" />
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

    <div class="table-wrapper">
      <el-table :height="tableHeight" :data="tableData">
        <el-table-column prop="comment" label="留言内容" align="center" />
        <el-table-column prop="commentAuthor" label="留言人" align="center" />
        <el-table-column prop="commentTime" label="留言时间" width="170" align="center" />
        <el-table-column prop="response" label="回复内容" align="center" />
        <el-table-column prop="responseAuthor" label="回复人" align="center" />
        <el-table-column prop="responseTime" label="回复时间" width="170" align="center" />
        <el-table-column fixed="right" label="操作" width="160" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="tableDetail(scope.row)">详情</el-button>
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
      class="responseDetail"
      v-model="isShowResponseDetail" 
      title="回复详情" 
      width="50%" 
      center 
      align-center
    >
      <div class="responseDetail-content">
        <el-timeline>
          <el-timeline-item timestamp="留言" placement="top">
            <el-card>
              <div class="responseDetail-title">
                <span>{{ commentDetail.commentAuthor }}</span>
                <span>{{ commentDetail.commentTime }}</span>
              </div>
              <div class="responseDetail-value">{{ commentDetail.comment }}</div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item :timestamp="'历史回复'+(index+1)" placement="top" v-for="(response, index) in commentDetail.responses" :key="index">
            <el-card>
              <div class="responseDetail-title">
                <span>{{ response.responseAuthor }}</span>
                <span>{{ response.responseTime }}</span>
              </div>
              <div class="responseDetail-value">{{ response.response }}</div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="回复" placement="top">
            <el-card>
              <el-input 
                style="margin-top: 10px;"
                type="textarea"
                v-model="responseInputValue" 
                autosize 
                maxlength="200" 
                show-word-limit
                placeholder="请输入" 
                clearable
              />
              <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
                <el-button type="primary" :loading="isFormSubmiting" :disabled="!responseInputValue || responseInputValue.length>200" @click="submitResponse">提交</el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref, nextTick } from 'vue';

import dayjs from 'dayjs'

import {
  _getCommentList,
  _getCommentDetailById,
  _response
} from '@/network/comment'

// Table
let searchParams = reactive({
  hasResponsed: null,
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
  tableHeight.value = viewportHeight - searchWrapperHeight - paginationWrapperHeight - 120;
};
function search() {
  getList()
}
function searchReset() {
  Object.assign(searchParams, {
    hasResponsed: null,
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

let isShowResponseDetail = ref(false)
let commentDetail = reactive({})
let responseInputValue = ref('')
let commentId = null

function getCommentDetailById() {
  _getCommentDetailById({ commentId: commentId }).then(res => {
    let result = res.data
    result.commentTime = dayjs(result.commentTime).format('YYYY-MM-DD HH:mm')
    result.responses = result.responses.map(item => {
      return {
        ...item,
        responseTime: dayjs(item.responseTime).format('YYYY-MM-DD HH:mm')
      }
    })

    commentDetail = Object.assign(commentDetail, result)
    responseInputValue.value = ''

    isShowResponseDetail.value = true
  })
}
function tableDetail(record) {
  commentId = record.commentId

  getCommentDetailById()
}


let isFormSubmiting = ref(false)

function submitResponse() {
  ElMessageBox.confirm(
    '确定提交回复?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    isFormSubmiting.value = true

    _response({
      commentId: commentId,
      response: responseInputValue.value,
    }).then(res => {
      ElMessage({
        message: res.message,
        type: 'success',
        plain: true,
      })

      getCommentDetailById()
      getList()
    }).finally(() => {
      isFormSubmiting.value = false
    })
  })
}

function getList() {
  _getCommentList({
    ...searchParams,
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
  }).then(res => {
    tableData.value = res.data.records.map(item => {
      return {
        ...item,
        commentTime: item.commentTime&&dayjs(item.commentTime).format('YYYY-MM-DD HH:mm') || null,
        responseTime: item.responseTime&&dayjs(item.responseTime).format('YYYY-MM-DD HH:mm') || null,
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
  .responseDetail-content {
    padding-right: 10px;
    max-height: 60vh;
    overflow-y: auto;
    .responseDetail-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
    }
    .responseDetail-value {
      margin-top: 10px;
    }
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
