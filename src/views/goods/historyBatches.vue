<template>
  <div class="historyBatches">
    <div class="item history-batch">
      <div class="content">
        <div class="historyBatchSearch-wrapper">
          <div class="historyBatchSearch-content">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="historyBatchSearch-item">
                  <div class="historyBatchSearch-item-label">批次编号：</div>
                  <div class="historyBatchSearch-item-input">
                    <el-input placeholder="请输入" clearable v-model="historyBatchSearchParams.no"></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="historyBatchSearch-item">
                  <div class="historyBatchSearch-item-label">批次日期：</div>
                  <div class="historyBatchSearch-item-input">
                    <el-date-picker 
                      type="daterange"
                      format="YYYY-MM-DD" value-format="YYYY-MM-DD" 
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      clearable 
                      v-model="historyBatchSearchParams.time" 
                      style="width: 100%;"
                    />
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="historyBatchSearch-item">
                  <div class="historyBatchSearch-item-label">批次状态：</div>
                  <el-select v-model="historyBatchSearchParams.status" style="width: 100%;" placeholder="请选择">
                    <el-option label="已完结" value="completed" />
                    <el-option label="已取消" value="canceled" />
                    <el-option label="已删除" value="deleted" />
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="historyBatchSearch-btns">
            <el-button type="primary" @click="historyBatchSearch">查询</el-button>
            <el-button @click="historyBatchSearchReset">重置</el-button>
          </div>
        </div>

        <el-table :data="historyBatchTableData">
          <el-table-column type="expand">
            <template #default="scope">
              <div m="4" class="detail" style="font-size: 16px;">
                <div m="t-0 b-2" class="detail-item" v-if="scope.row.type==='preorder'&&scope.row.cancel_reason">批次取消原因：{{ scope.row.cancel_reason }} </div>
                <div m="t-0 b-2" class="detail-item" v-if="scope.row.type==='preorder'">价格区间：￥{{ scope.row.preorder_minPrice }} ~ {{ scope.row.preorder_maxPrice }} </div>
                <div m="t-0 b-2" class="detail-item" v-if="scope.row.type==='preorder'&&scope.row.preorder_finalPrice">最终单价：￥{{ scope.row.preorder_finalPrice }}</div>
                <div m="t-0 b-2" class="detail-item" v-if="scope.row.type==='stock'">现货总量:{{ scope.row.stock_totalQuantity }} {{ scope.row.snapshot_goodsUnit }}</div>
                <div m="t-0 b-2" class="detail-item" v-if="scope.row.type==='stock'">单价:￥{{ scope.row.stock_unitPrice }} / {{ scope.row.snapshot_goodsUnit }}</div>
                <div m="t-0 b-2" class="detail-item">最小购买量：{{ scope.row.minQuantity }} {{ scope.row.snapshot_goodsUnit }}</div>
                <div m="t-0 b-2" class="detail-item discounts">
                  <div>优惠策略：</div>
                  <div v-if="scope.row.discounts_promotion.length > 0">
                    <div v-for="(item, index) in scope.row.discounts_promotion" :key="index">
                      满 {{ item.quantity }} {{ scope.row.batchUnit }} 减 {{ item.discount }} 元
                    </div>
                  </div>
                  <div v-else>无</div>
                </div>
                <div m="t-0 b-2" class="detail-item postage">
                  <div>邮费：</div>
                  <div class="postage-content">
                    <div class="postage-item" v-for="(item, index) in scope.row.shipProvinces" :key="index">
                      <div>{{ index+1 }}、</div>
                      <div style="display: flex;">
                        <div>{{ item.name }}：</div>
                        <div>
                          <div>首重最大数量：{{ item.baseQuantity }} ，首重邮费：￥{{ item.basePostage }}</div>
                          <div>每续重数量：{{ item.extraQuantity }}，额外邮费：￥{{ item.extraPostage }}</div>
                          <div>包邮数量：{{ item.freeShippingQuantity }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div m="t-0 b-2" class="detail-item">批次备注：{{ scope.row.remark }}</div>
                <div m="t-0 b-2" class="detail-item snapshot">
                  <div>快照：</div>
                  <div class="snapshot-content">
                    <div class="snapshot-item">商品名称：{{ scope.row.snapshot_goodsName }}</div>
                    <div class="snapshot-item">商品单位：{{ scope.row.snapshot_goodsUnit }}</div>
                    <div class="snapshot-item">商品备注：{{ scope.row.snapshot_goodsRemark }}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="no" label="批次" align="center"  width="200" />
          <el-table-column property="typeText" label="批次类型" align="center" width="80" />
          <el-table-column property="start_by" label="开始人" align="center" width="120" />
          <el-table-column property="time" label="持续时间" align="center" width="280">
            <template #default="scope">
              <div>{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</div>
            </template>
          </el-table-column>
          <el-table-column property="duration" label="持续时间" align="center" width="150">
            <template #default="scope">
              <div>{{ scope.row.duration }}</div>
            </template>
          </el-table-column>
          <el-table-column property="totalOrdersCount" label="总订单数" align="center" >
            <template #default="scope">
              <div>{{ scope.row.totalOrdersCount || 0 }}</div>
            </template>
          </el-table-column>
          <el-table-column property="totalSoldQuantity" label="总售出量" align="center" >
            <template #default="scope">
              <div>{{ scope.row.totalSoldQuantity || 0.00 }} {{ scope.row.snapshot_goodsUnit }}</div>
            </template>
          </el-table-column>
          <el-table-column property="totalRevenue" label="总收入" align="center" >
            <template #default="scope">
              <div>￥{{ scope.row.totalRevenue || 0.00 }}</div>
            </template>
          </el-table-column>
          <el-table-column property="batchStatusText" label="批次状态" align="center" >
            <template #default="scope">
              <div>{{ scope.row.batchStatusText }}</div>
            </template>
          </el-table-column>
          <el-table-column property="complete_by" label="操作人" align="center" width="120" >
            <template #default="scope">
              <div v-if="scope.row.status==='completed'">{{ scope.row.complete_by }}</div>
              <div v-if="scope.row.status==='canceled'">{{ scope.row.cancel_by }}</div>
            </template>
          </el-table-column>
          <el-table-column property="remark" label="备注" align="center" >
            <template #default="scope">
              <div>{{ scope.row.remark }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="110" align="center" >
            <template #default="scope">
              <el-button link type="primary" @click="seeHistoryBatchStatistic(scope.row)">查看统计</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            class="pagination"
            v-model:current-page="historyBatchPagination.pageNo"
            v-model:page-size="historyBatchPagination.pageSize"
            :page-sizes="[10, 20, 40, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="historyBatchPagination.total"
            @size-change="historyBatchPageSizeChange"
            @current-change="historyBatchPageNoChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  _getHistoryBatchesList,
} from '@/network/goods'

import dayjs from 'dayjs'
import calculateDateDurationByMinutes from '@/utils/calculateDateDurationByMinutes'

const $route = useRoute()
const $router = useRouter()

let historyBatchSearchParams = reactive({
  no: '',
  time: [],
  status: null,
})
let historyBatchPagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})
function historyBatchSearch() {
  getHistoryBatchesList()
}
function historyBatchSearchReset() {
  Object.assign(historyBatchSearchParams, {
    no: '',
    time: [],
    status: null,
  })
  historyBatchPagination.pageNo = 1
  getHistoryBatchesList()
}
let historyBatchTableData = ref([])

function historyBatchPageSizeChange(newPageSize) {
  historyBatchPagination.pageSize = newPageSize
  getHistoryBatchesList()
}
function historyBatchPageNoChange(newPageNo) {
  historyBatchPagination.pageNo = newPageNo
  getHistoryBatchesList()
}

function getHistoryBatchesList() {
  _getHistoryBatchesList({
    id: $route.query.goodsId,
    pageNo: historyBatchPagination.pageNo,
    pageSize: historyBatchPagination.pageSize,
    no: historyBatchSearchParams.no,
    startTime: historyBatchSearchParams.time[0],
    endTime: historyBatchSearchParams.time[1],
    status: historyBatchSearchParams.status,
  }).then(res => {
    historyBatchPagination.total = res.data.total

    historyBatchTableData.value = res.data.records.map(item => {
      let statusText = ''
      switch (item.status) {
        case 'completed': statusText='完结';break;
        case 'canceled': statusText='取消';break;
        case 'deleted': statusText='删除';break;
        default: break;
      }
      return {
        ...item,
        typeText: item.type==='preorder'?'预订':'现货',
        startTime: dayjs(item.startTime).format('YYYY-MM-DD HH:mm'),
        endTime: dayjs(item.endTime).format('YYYY-MM-DD HH:mm'),
        duration: calculateDateDurationByMinutes(item.startTime, item.endTime),
        batchStatusText: statusText,
      }
    })
  })
}

onMounted(() => {
  getHistoryBatchesList()
})
</script>

<style scoped lang="less">
.historyBatches {
  .history-batch {
    margin-top: 32px;
    .historyBatchSearch-wrapper {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .historyBatchSearch-content {
        flex: 1;
        .historyBatchSearch-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .historyBatchSearch-item-label {
            word-break: keep-all;
          }
          .historyBatchSearch-item-input {
            flex: 1;
            :deep(div) {
              box-sizing: border-box !important;
            }
          }
        }
      }
      .historyBatchSearch-btns {
        width: 200px;
        display: flex;
        justify-content: center;
      }
    }
  }
  .detail {
    .detail-item {
      margin-bottom: 10px;
    }
    .discounts {
      display: flex;
    }
    .postage {
      display: flex;
      .postage-content {
        display: flex;
        .postage-item {
          margin-right: 30px;
          border: 2px solid #909090;
          padding: 10px;
          border-radius: 6px;
        }
      }
    }
    .snapshot {
      display: flex;
      .snapshot-content {
        margin-right: 30px;
        border: 2px solid #909090;
        padding: 10px;
        border-radius: 6px;
        .snapshot-item {
          margin-bottom: 10px;
        }
        .snapshot-item:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
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