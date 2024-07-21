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
                  <el-option label="已回复" value="状态1" />
                  <el-option label="未回复" value="状态2" />
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
        <el-table-column prop="commentPerson" label="留言人" align="center" />
        <el-table-column prop="commentTime" label="留言时间" width="170" align="center" />
        <el-table-column prop="response" label="回复内容" align="center" />
        <el-table-column prop="responsePerson" label="回复人" align="center" />
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
                <span>留言人XXX</span>
                <span>2024-07-01 20:23:51</span>
              </div>
              <div class="responseDetail-value">11111111111111111111111111111111111我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注11111111111111111111111111111111111我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注</div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="回复" placement="top">
            <el-card>
              <div class="responseDetail-title">
                <span>回复人XXX</span>
                <span>2024-07-01 20:23:51</span>
              </div>
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

let loadingInstance = null

// Table
let searchParams = reactive({
  hasResponsed: '',
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
  const paginationWrapperHeight = document.querySelector('.pagination-wrapper').offsetHeight;
  tableHeight.value = viewportHeight - searchWrapperHeight - paginationWrapperHeight - 120;
};
function search() {

}
function searchReset() {
  Object.assign(searchParams, {
    hasResponsed: '',
  })
  pagination.pageNo = 1
}
function tablePageSizeChange(newPageSize) {
  console.log(newPageSize)
}
function tablePageNoChange(newPageNo) {
  console.log(newPageNo)
}

let isShowResponseDetail = ref(false)
let responseInputValue = ref('')

function tableDetail(record) {
  responseInputValue.value = '11111111111111111111111111111111111我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注11111111111111111111111111111111111我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注'
  isShowResponseDetail.value = true
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
  }).catch(() => {
    
  })
}



onMounted(() => {
  for (let i = 0; i < 100; i++) {
    tableData.value.push({
      comment: '11111111111111111111111111111111111我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注11111111111111111111111111111111111我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
      commentPerson: '123456',
      commentTime: '2024-07-01 20:23:51',
      response: '我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注11111111111111111111111111111111111我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
      responsePerson: 'czhhhh',
      responseTime: '2024-07-01 20:23:51',
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
