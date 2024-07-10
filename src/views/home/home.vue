<template>
  <div class="home">
    <div class="tabs-wrapper">
      <el-tabs type="card" v-model="tabValue" @tab-click="tabsClick">
        <el-tab-pane label="商品数据" name="batch" @click="seeBatchStatistics"></el-tab-pane>
        <el-tab-pane label="数据总览" name="goods" @click="seeOverviewStatistics"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="content-wrapper">
      <div class="goodsTable-wrapper">
        <div class="search-wrapper">
          <div class="search-content">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="saerch-item">
                  <div class="search-item-label">商品编号：</div>
                  <div class="search-item-input">
                    <el-input placeholder="请输入" clearable v-model="searchParams.goodsId"></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="saerch-item">
                  <div class="search-item-label">商品名称：</div>
                  <div class="search-item-input">
                    <el-input placeholder="请输入" clearable v-model="searchParams.name"></el-input>
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
          <el-button type="primary">新增</el-button>
        </div>

        <div class="table-wrapper">
          <el-table 
            :data="tableData" 
            highlight-current-row
            @current-change="tableCurrentChange"
          >
            <el-table-column prop="no" label="商品编号" align="center" />
            <el-table-column prop="name" label="商品名称" align="center" />
            <el-table-column prop="remark" label="备注" align="center" />
            <el-table-column fixed="right" label="操作" width="80" align="center" >
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
      </div>

    
      <div class="cascaderWrapper">
        <!-- <div class="cascaderSearch">
          <el-input v-model="cascaderSearchParam" placeholder="请输入" style="width: 300px;" clearable></el-input>
          <el-button type="primary" style="margin-left: 20px;">查询</el-button>
        </div> -->
        <div class="cascaderContent-wrapper">
          <div class="cascaderContent-title">
            <div v-if="cascaderCurrentGoods&&cascaderCurrentGoods.id">
              <div>商品编号：<span style="font-weight: 700;">{{ cascaderCurrentGoods.id }}</span></div>
              <div>商品名称：<span style="font-weight: 700;">{{ cascaderCurrentGoods.name }}</span></div>
            </div>
          </div>
          <div class="cascaderContent">
            <div class="cascaderContent-allBatches" 
                :style="{backgroundColor: cascaderCurrentBatch==='allBatches'?'rgba(64,158,255)':'white', 
                        color: cascaderCurrentBatch==='allBatches'?'white':'black'}"
                @click="cascaderBatchClick('allBatches')">
                所有批次总览
            </div>
            <div class="cascaderContent-container">
              <div class="batch" v-for="(item, index) in cascaderBatches" :key="index"
                :style="{backgroundColor: cascaderCurrentBatch===item?'rgba(64,158,255)':'white',
                        color: cascaderCurrentBatch===item?'white':'black'}"
                @click="cascaderBatchClick(item)"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <!-- <el-cascader-panel 
          :options="cascaderData" 
          style="width: 800px;"
        /> -->
      </div>


      <div class="charts-wrapper">
        <div ref="chartContainer" style="width: 100%; height: 700px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue';

import * as echarts from 'echarts';

import { useRouter } from 'vue-router'

const $router = useRouter()


// tabs 
let tabValue = ref('batch')
function tabsClick(tab, event) {
  console.log(tab.paneName, event)
  tabValue.value = tab.paneName
}
function seeBatchStatistics() {

}
function seeOverviewStatistics() {

}


// table
let searchParams = reactive({
  goodsId: '',
  name: '',
  date: null,
})
let tableData = ref([

])
let pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})
function tableCurrentChange(record) {
  console.log(record)
}

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


// cascader
// let cascaderSearchParam = ref('')
let cascaderBatches = reactive([
  '20240708165426',
  '20240708165426',
  '20240708165425',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
  '20240708165426',
])
let cascaderCurrentGoods = ref({
  id: '1231233211',
  name: '蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果'
})
let cascaderCurrentBatch = ref('20240708165425')
function cascaderGoodsClick(item) {
  console.log(item)
}
function cascaderBatchClick(item) {
  console.log(item)
  cascaderCurrentBatch.value = item
  if (item==='allBatches') { // 所有批次总览

  } else { // 某个批次

  }
}



// charts
const chartContainer = ref(null);
const chartsData = [
  { date: '2024-07-01', purchase: 100, sold: 10, remaining: 90 },
  { date: '2024-07-02', purchase: 5, sold: 15, remaining: 80 },
  { date: '2024-07-03', purchase: 0, sold: 5, remaining: 75 },
  { date: '2024-07-04', purchase: 10, sold: 15, remaining: 70 },
  { date: '2024-07-05', purchase: 0, sold: 10, remaining: 60 },
  { date: '2024-07-06', purchase: 0, sold: 5, remaining: 55 },
  { date: '2024-07-07', purchase: 5, sold: 10, remaining: 50 },
  { date: '2024-07-08', purchase: 0, sold: 5, remaining: 45 },
  { date: '2024-07-09', purchase: 0, sold: 5, remaining: 40 },
  { date: '2024-07-10', purchase: 0, sold: 5, remaining: 35 },
  { date: '2024-07-11', purchase: 0, sold: 5, remaining: 30 },
  { date: '2024-07-12', purchase: 20, sold: 25, remaining: 25 },
  { date: '2024-07-13', purchase: 0, sold: 5, remaining: 20 },
  { date: '2024-07-14', purchase: 0, sold: 5, remaining: 15 },
  { date: '2024-07-15', purchase: 0, sold: 5, remaining: 10 },
  { date: '2024-07-16', purchase: 0, sold: 5, remaining: 5 },
  { date: '2024-07-17', purchase: 50, sold: 15, remaining: 40 },
  { date: '2024-07-18', purchase: 0, sold: 5, remaining: 35 },
  { date: '2024-07-19', purchase: 0, sold: 10, remaining: 25 },
  { date: '2024-07-20', purchase: 10, sold: 20, remaining: 15 }
]

const dates = chartsData.map(item => item.date);
const purchaseAmounts = chartsData.map(item => item.purchase);
const soldAmounts = chartsData.map(item => item.sold);
const remainingAmounts = chartsData.map(item => item.remaining);

// 计算每日的总量
let totalAmounts = []
chartsData.forEach((item, index) => {
  const total = index === 0 ? item.purchase : chartsData[index-1].remaining+item.purchase
  totalAmounts.push(total);
});

function initChart() {
  const chart = echarts.init(chartContainer.value);

  const option = {
    grid: {
        left: '1%',
        right: '1%',
        top: '10%',
        bottom: '1%',
        containLabel: true
      },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        const date = params[0].axisValue;
        const total = totalAmounts[params[0].dataIndex];
        const purchase = purchaseAmounts[params[0].dataIndex];
        const sold = soldAmounts[params[0].dataIndex];
        const remaining = remainingAmounts[params[0].dataIndex];

        const colorTotal = params.find(p => p.seriesName === '总量').color;
        const colorPurchase = params.find(p => p.seriesName === '采购量').color;
        const colorSold = params.find(p => p.seriesName === '售卖量').color;
        const colorRemaining = params.find(p => p.seriesName === '剩余量').color;
        

        return `
          <div>
            <div>${date}</div>
            <div><span style="color:${colorTotal};">●</span> 总量：${total}</div>
            <div><span style="color:${colorPurchase};">●</span> 采购量：${purchase}</div>
            <div><span style="color:${colorSold};">●</span> 售卖量：${sold}</div>
            <div><span style="color:${colorRemaining};">●</span> 剩余量：${remaining}</div>
          </div>
        `;
      }
    },
    legend: {
      data: ['总量', '采购量', '售卖量', '剩余量'],
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '总量',
        type: 'line',
        data: totalAmounts,
        itemStyle: {
          color: '#5470C6'
        },
      },
      {
        name: '采购量',
        type: 'bar',
        data: purchaseAmounts,
        itemStyle: {
          color: '#91CC75'
        },
      },
      {
        name: '售卖量',
        type: 'bar',
        data: soldAmounts,
        itemStyle: {
          color: '#FF0000'
        },
      },
      {
        name: '剩余量',
        type: 'line',
        data: remainingAmounts,
        itemStyle: {
          color: '#FFA500'
        },
      },
    ],
  };

  chart.setOption(option);
}


onMounted(() => {
  initChart();

  for (let i = 0; i < 10; i++) {
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
      isSelling: true,
    })
  }
  pagination.total = tableData.value.length
});



</script>

<style lang="less" scoped>
.home {
  .tabs-wrapper {
    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }
  }

  .content-wrapper {
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid rgb(228,231,237);
    border-top: none;
    .goodsTable-wrapper {
      padding: 20px;
      box-sizing: border-box;
      border: 1px solid rgb(228,231,237);
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
    }

    .cascaderWrapper {
      margin-top: 20px;
      // .cascaderSearch {
      //   display: flex;
      //   align-items: center;
      // }
      .cascaderContent-wrapper {
        border: 1px solid rgb(228,231,237);
        box-sizing: border-box;
        padding: 20px;
        .cascaderContent-title {
          
        }
        .cascaderContent {
          .cascaderContent-allBatches {
            border: 1px solid #ccc;
            padding: 10px 10px;
            box-sizing: border-box;
            text-align: center;
            cursor: pointer;
            margin-top: 20px;
          }
          .cascaderContent-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .goods {
            border: 1px solid #ccc;
            padding: 6px 10px;
            box-sizing: border-box;
            text-align: center;
            cursor: pointer;
          }
          .batch {
            border: 1px solid #ccc;
            padding: 6px 10px;
            box-sizing: border-box;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }

    .charts-wrapper {
      padding: 20px;
      box-sizing: border-box;
    }

    :deep(.el-cascader-panel__wrap) {
      display: flex;
      flex-wrap: wrap;
    }
    :deep(.el-cascader-panel__list) {
      width: auto;
      flex: 1;
      min-width: 200px; /* 控制每列的最小宽度 */
      margin-right: 20px; /* 控制列间距 */
    }
    :deep(.el-cascader-panel__list:last-child) {
      margin-right: 0;
    }
  }

  
}
</style>
