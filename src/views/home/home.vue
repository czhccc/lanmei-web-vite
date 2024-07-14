<template>
  <div class="home">
    <div class="tabs-wrapper">
      <el-tabs type="card" v-model="tabValue" @tab-click="tabsClick">
        <el-tab-pane label="商品数据" name="goods"></el-tab-pane>
        <el-tab-pane label="数据总览" name="overview"></el-tab-pane>
      </el-tabs>
    </div>
    
    <div class="goods" v-if="tabValue==='goods'">
      <div class="choosedGoods" v-if="choosedGoods&&choosedGoods.name">
        <div class="choosedGoods-goodsName">
          <span class="choosedGoods-goodsName-value">{{ choosedGoods.no }}</span>
          <span class="choosedGoods-goodsName-label"> ~ </span>
          <span class="choosedGoods-goodsName-value">{{ choosedGoods.name }}</span>
          <span class="choosedGoods-goodsName-label"> ~ </span>
          <span class="choosedGoods-goodsName-value">{{ choosedGoods.unit }}</span>
          <span class="choosedGoods-goodsName-label" v-if="choosedBatch"> ~ </span>
          <span class="choosedGoods-goodsName-value" v-if="choosedBatch">{{ choosedBatch }}</span>
        </div>
      </div>

      <div class="goodsContent-wrapper">
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
              @current-change="tableItemClick"
            >
              <el-table-column prop="no" label="商品编号" align="center" />
              <el-table-column prop="name" label="商品名称" align="center" />
              <el-table-column prop="unit" label="商品单位" align="center" />
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

        <!-- 商品信息 -->
        <div class="goodsInfo-wrapper" v-if="choosedGoods">
          <div class="goodsInfo-bigTitle">商品信息</div>
          <div class="goodsInfo-title">成本</div>
          <div class="goodsInfo-content">
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">总采购次数：</div>
              <div class="goodsInfo-item-value">53次</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">总采购成本：</div>
              <div class="goodsInfo-item-value">530846元</div>
            </div>
          </div>
          <div class="goodsInfo-title">订单</div>
          <div class="goodsInfo-content">
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">线上订单数：</div>
              <div class="goodsInfo-item-value">866</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">线上售卖量：</div>
              <div class="goodsInfo-item-value">1086斤</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">线上销售额：</div>
              <div class="goodsInfo-item-value">475213元</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">线下订单数：</div>
              <div class="goodsInfo-item-value">8623</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">线下售卖量：</div>
              <div class="goodsInfo-item-value">684斤</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">线下销售额：</div>
              <div class="goodsInfo-item-value">246834元</div>
            </div>
          </div>
          <div class="goodsInfo-title">利润</div>
          <div class="goodsInfo-content">
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">总订单数：</div>
              <div class="goodsInfo-item-value">8623</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">总销量：</div>
              <div class="goodsInfo-item-value">1975斤</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">总销售额：</div>
              <div class="goodsInfo-item-value">894235元</div>
            </div>
            <div class="goodsInfo-item">
              <div class="goodsInfo-item-label">总利润：</div>
              <div class="goodsInfo-item-value">674589元</div>
            </div>
          </div>
        </div>

        <!-- 选择批次 -->
        <div class="batchChoose-wrapper" v-if="choosedGoods">
          <div class="batchChoose-bigTitle">选择批次</div>
          <div class="batchChooseContent-wrapper">
            <div class="batchChooseContent">
              <div class="batchChooseContent-container">
                <div class="batchChoose-item" v-for="(item, index) in batches" :key="index"
                  :style="{backgroundColor: choosedBatch===item?'rgba(64,158,255)':'white',
                          color: choosedBatch===item?'white':'black'}"
                  @click="chooseBatch(item)"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 批次信息 -->
        <div class="batchInfo-wrapper" v-if="choosedBatch">
          <div class="batchInfo-bigTitle">批次信息</div>
          <div class="batchInfo-title">时间</div>
          <div class="batchInfo-content">
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">日期范围：</div>
              <div class="batchInfo-item-value">2024-06-02 ~ 2024-07-11</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">持续周数：</div>
              <div class="batchInfo-item-value">8周</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">持续天数：</div>
              <div class="batchInfo-item-value">53天</div>
            </div>
          </div>
          <div class="batchInfo-title">采购</div>
          <div class="batchInfo-content">
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">采购总次数：</div>
              <div class="batchInfo-item-value">28次</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">采购总成本：</div>
              <div class="batchInfo-item-value">196425元</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">其他总成本：</div>
              <div class="batchInfo-item-value">14623元</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">总成本：</div>
              <div class="batchInfo-item-value">218469元</div>
            </div>
          </div>
          <div class="batchInfo-title">订单</div>
          <div class="batchInfo-content">
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">线上订单数量：</div>
              <div class="batchInfo-item-value">246</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">线下订单数量：</div>
              <div class="batchInfo-item-value">246</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">订单总数量：</div>
              <div class="batchInfo-item-value">246</div>
            </div>
          </div>
          <div class="batchInfo-title">利润</div>
          <div class="batchInfo-content">
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">线上销售额：</div>
              <div class="batchInfo-item-value">298567元</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">线下销售额：</div>
              <div class="batchInfo-item-value">37586元</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">总销售额：</div>
              <div class="batchInfo-item-value">359762元</div>
            </div>
            <div class="batchInfo-item">
              <div class="batchInfo-item-label">总利润：</div>
              <div class="batchInfo-item-value">245683元</div>
            </div>
          </div>

          <!-- 批次图表 -->
          <div class="batchChart-wrapper" v-if="choosedBatch">
            <div class="batchChartContainer" ref="batchChartContainer"></div>
          </div>
        </div>
        
      </div>
    </div>

    <div class="overview" v-if="tabValue==='overview'">
      <div class="overviewContent-wrapper">
        <div class="chooseDateSpan">
          <el-date-picker
            v-model="overviewDateSpan"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="large"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, nextTick } from 'vue';

import * as echarts from 'echarts';

import { useRouter } from 'vue-router'

const $router = useRouter()


// tabs 
let tabValue = ref('goods')
function tabsClick(tab, event) {
  console.log(tab.paneName, event)
  tabValue.value = tab.paneName
  if (tab.paneName === 'goods') {

  } else if (tab.paneName === 'overview') {
    choosedGoods.value = null
    choosedBatch.value = ''
  }
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
function tableItemClick(item) {
  console.log(item)
  choosedGoods.value = item
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
  console.log(newPageSize);
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


// goods
let choosedGoods = ref(null)


// batch
let batches = reactive([
  '20240708165401',
  '20240708165402',
  '20240708165403',
  '20240708165404',
  '20240708165405',
  '20240708165406',
  '20240708165407',
  '20240708165408',
  '20240708165409',
  '20240708165410',
  '20240708165411',
  '20240708165412',
  '20240708165413',
  '20240708165414',
  '20240708165415',
  '20240708165416',
  '20240708165417',
  '20240708165418',
  '20240708165419',
  '20240708165420',
  '20240708165421',
  '20240708165422',
  '20240708165423',
  '20240708165424',
  '20240708165425',
  '20240708165426',
  '20240708165427',
  '20240708165428',
  '20240708165429',
])

let choosedBatch = ref('')
function chooseBatch(item) {
  console.log(item)
  choosedBatch.value = item
  
  nextTick(() => {
    initBatchChart();
  })
  
}



// batchChart
const batchChartContainer = ref(null);
const chartsData = [
  { date: '2024-07-01', realTotalPurchase: 100, soldOnline: 7, soldOffline: 3, remaining: 90 },
  { date: '2024-07-02', realTotalPurchase: 5, soldOnline: 10, soldOffline: 5, remaining: 80 },
  { date: '2024-07-03', realTotalPurchase: 0, soldOnline: 3, soldOffline: 2, remaining: 75 },
  { date: '2024-07-04', realTotalPurchase: 10, soldOnline: 7, soldOffline: 8, remaining: 70 },
  { date: '2024-07-05', realTotalPurchase: 0, soldOnline: 7, soldOffline: 3, remaining: 60 },
  { date: '2024-07-06', realTotalPurchase: 0, soldOnline: 2, soldOffline: 3, remaining: 55 },
  { date: '2024-07-07', realTotalPurchase: 5, soldOnline: 7, soldOffline: 3, remaining: 50 },
  { date: '2024-07-08', realTotalPurchase: 0, soldOnline: 2, soldOffline: 3, remaining: 45 },
  { date: '2024-07-09', realTotalPurchase: 0, soldOnline: 3, soldOffline: 2, remaining: 40 },
  { date: '2024-07-10', realTotalPurchase: 0, soldOnline: 4, soldOffline: 1, remaining: 35 },
  { date: '2024-07-11', realTotalPurchase: 0, soldOnline: 4, soldOffline: 1, remaining: 30 },
  { date: '2024-07-12', realTotalPurchase: 20, soldOnline: 20, soldOffline: 5, remaining: 25 },
  { date: '2024-07-13', realTotalPurchase: 0, soldOnline: 3, soldOffline: 2, remaining: 20 },
  { date: '2024-07-14', realTotalPurchase: 0, soldOnline: 3, soldOffline: 2, remaining: 15 },
  { date: '2024-07-15', realTotalPurchase: 0, soldOnline: 4, soldOffline: 1, remaining: 10 },
  { date: '2024-07-16', realTotalPurchase: 0, soldOnline: 4, soldOffline: 1, remaining: 5 },
  { date: '2024-07-17', realTotalPurchase: 50, soldOnline: 9, soldOffline: 6, remaining: 40 },
  { date: '2024-07-18', realTotalPurchase: 0, soldOnline: 1, soldOffline: 4, remaining: 35 },
  { date: '2024-07-19', realTotalPurchase: 0, soldOnline: 7, soldOffline: 3, remaining: 25 },
  { date: '2024-07-20', realTotalPurchase: 10, soldOnline: 10, soldOffline: 10, remaining: 15 }
]

const dates = chartsData.map(item => item.date);
const purchaseAmounts = chartsData.map(item => item.realTotalPurchase);
const soldOnlineAmounts = chartsData.map(item => item.soldOnline);
const soldOfflineAmounts = chartsData.map(item => item.soldOffline);
const remainingAmounts = chartsData.map(item => item.remaining);

// 计算每日的总量
let totalAmounts = []
chartsData.forEach((item, index) => {
  const total = index === 0 ? item.realTotalPurchase : chartsData[index-1].remaining+item.realTotalPurchase
  totalAmounts.push(total);
});


let batchChart = null
function batchChartResize() {
  if (batchChart) {
    batchChart.resize()
  }
}
function initBatchChart() {
  if (!batchChart) {
    batchChart = echarts.init(batchChartContainer.value);
  }

  const unit = choosedGoods.value.unit || '' 

  const batchChartOption = {
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
        const realTotalPurchase = purchaseAmounts[params[0].dataIndex];
        const soldOnline = soldOnlineAmounts[params[0].dataIndex];
        const soldOffline = soldOfflineAmounts[params[0].dataIndex];
        const remaining = remainingAmounts[params[0].dataIndex];

        const colorTotal = params.find(p => p.seriesName === '总量').color;
        const colorRealTotalPurchase = params.find(p => p.seriesName === '采购量').color;
        const colorSoldOnline = params.find(p => p.seriesName === '线上售卖量').color;
        const colorSoldOffline = params.find(p => p.seriesName === '线下售卖量').color;
        const colorRemaining = params.find(p => p.seriesName === '剩余量').color;
        
        return `
          <div>
            <div>${date}</div>
            <br />
            <div><span style="color:${colorTotal};">●</span> 总量：${total}${unit}</div>
            <div><span style="color:${colorRealTotalPurchase};">●</span> 采购量：${realTotalPurchase}${unit}</div>
            <div><span style="color:${colorSoldOnline};">●</span> 线上售卖量：${soldOnline}${unit}</div>
            <div><span style="color:${colorSoldOffline};">●</span> 线下售卖量：${soldOffline}${unit}</div>
            <div><span style="color: #FF0000;">●</span> 总售卖量：${soldOnline+soldOffline}${unit}</div>
            <div><span style="color:${colorRemaining};">●</span> 剩余量：${remaining}${unit}</div>
          </div>
        `;
      }
    },
    legend: {
      data: ['总量', '采购量', '线上售卖量', '线下售卖量', '剩余量'],
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
          color: '#5A2BE2'
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
        name: '线下售卖量',
        type: 'bar',
        data: soldOfflineAmounts,
        stack: '售卖量', // 设置 stack 属性
        itemStyle: {
          color: '#AEEEEE'
        },
      },
      {
        name: '线上售卖量',
        type: 'bar',
        data: soldOnlineAmounts,
        stack: '售卖量', // 设置 stack 属性
        itemStyle: {
          color: '#EE3B3B'
        },
      },
      {
        name: '剩余量',
        type: 'line',
        data: remainingAmounts,
        itemStyle: {
          color: '#FF00FF'
        },
      },
    ],
  };

  batchChart.setOption(batchChartOption);
  window.addEventListener('resize', batchChartResize);
}



// overview
let overviewDateSpan = ref([])



onMounted(() => {
  
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

onUnmounted(() => {
  window.removeEventListener('resize', batchChartResize);
  if (batchChart) {
    batchChart.dispose();
  }
});


</script>

<style lang="less" scoped>
.home {
  .tabs-wrapper {
    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }
  }

  .goods {
    .choosedGoods {
      position: fixed;
      top: 0;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: white;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      .choosedGoods-goodsName {
        .choosedGoods-goodsName-label {

        }
        .choosedGoods-goodsName-value {
          font-weight: 700;
        }
      }
    }

    .goodsContent-wrapper {
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

      .goodsInfo-wrapper {
        border: 1px solid rgb(228,231,237);
        box-sizing: border-box;
        padding: 20px;
        margin-top: 20px;
        .goodsInfo-bigTitle {
          font-size: 28px;
          font-weight: 700;
        }
        .goodsInfo-title {
          font-weight: 700;
          margin-top: 20px;
        }
        .goodsInfo-title:first-child {
          margin-top: 0;
        }
        .goodsInfo-content {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-top: 6px;
          .goodsInfo-item {
            min-width: 33%;
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
            .goodsInfo-item-label {
              word-break: break-all;
            }
            .goodsInfo-item-value {
              
            }
          }
        }
      }

      .batchChoose-wrapper {
        border: 1px solid rgb(228,231,237);
        box-sizing: border-box;
        padding: 20px;
        margin-top: 20px;
        .batchChoose-bigTitle {
          font-size: 28px;
          font-weight: 700;
        }
        .batchChooseContent-wrapper {
          .batchChooseContent {
            .batchChooseContent-container {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 20px;
              margin-top: 20px;
              .batchChoose-item {
                border: 1px solid #ccc;
                padding: 6px 10px;
                box-sizing: border-box;
                text-align: center;
                cursor: pointer;
              }
            }
          }
        }
      }

      .batchInfo-wrapper {
        border: 1px solid rgb(228,231,237);
        box-sizing: border-box;
        padding: 20px;
        margin-top: 20px;
        .batchInfo-bigTitle {
          font-size: 28px;
          font-weight: 700;
        }
        .batchInfo-title {
          font-weight: 700;
          margin-top: 20px;
        }
        .batchInfo-title:first-child {
          margin-top: 0;
        }
        .batchInfo-content {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-top: 6px;
          .batchInfo-item {
            min-width: 33%;
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
            .batchInfo-item-label {
              word-break: break-all;
            }
            .batchInfo-item-value {
              
            }
          }
        }
        .batchChart-wrapper {
          padding: 20px;
          box-sizing: border-box;
          .batchChartContainer {
            width: 100%;
            height: 80vh;
          }
        }
      }
    }
  }

  .overview {
    .overviewContent-wrapper {
      border: 1px solid rgb(228,231,237);
      box-sizing: border-box;
      padding: 20px;
      .chooseDateSpan {

      }
    }
  }
}
</style>
