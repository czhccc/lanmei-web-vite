<template>
  <div class="home">
    <div class="tabs-wrapper">
      <el-tabs type="card" v-model="tabValue" @tab-click="tabsClick">
        <el-tab-pane label="商品批次数据" name="batch"></el-tab-pane>
        <el-tab-pane label="商品数据总览" name="goods"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="cascaderWrapper">
      <div class="cascaderSearch">
        <el-input v-model="cascaderSearchParam" placeholder="请输入" style="width: 300px;" clearable></el-input>
        <el-button type="primary" style="margin-left: 20px;">查询</el-button>
      </div>
      <div class="cascaderContent-wrapper">
        <div class="cascaderContent-title">
          <span>商品</span>
          <span v-if="cascaderCurrentGoods.name">：{{ cascaderCurrentGoods.name }}</span>
        </div>
        <div class="cascaderContent">
          <div class="cascaderContent-container">
            <div class="goods" v-for="(item, index) in cascaderGoods" :key="index"
              :style="{backgroundColor: cascaderCurrentGoods===item?'rgba(25,137,250,0.2)':'white'}"
              @click="cascaderGoodsClick(item)"
            >
              {{ item }}
            </div>
          </div>
          <div class="cascaderContent-container">
            <div class="batch" v-for="(item, index) in cascaderBatches" :key="index"
              :style="{backgroundColor: cascaderCurrentBatch===item?'rgba(25,137,250,0.2)':'white'}"
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

    <div class="search-wrapper">
      <div class="search-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="saerch-item">
              <div class="search-item-label">批次编号：</div>
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

    <div class="charts-wrapper">
      <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue';

import * as echarts from 'echarts';


// tabs 
let tabValue = ref('batch')
function tabsClick(tab, event) {
  console.log(tab.paneName, event)
  tabValue.value = tab.paneName
}


// cascader
let cascaderSearchParam = ref('')
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
  id: '123',
  name: '蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果'
})
let cascaderCurrentBatch = ref('20240708165425')
function cascaderGoodsClick(item) {
  console.log(item)
}
function cascaderBatchClick(item) {
  console.log(item)
  cascaderCurrentBatch.value = item
}

// Search
let searchParams = reactive({
  goodsNo: '',
  goodsName: '',
  purchaseDate: [],
  status: null,
  isSelling: null,
})
function search() {

}
function searchReset() {
  Object.assign(searchParams, {
    goodsNo: '',
    goodsName: '',
    purchaseDate: [],
    status: null,
    isSelling: null,
  })
  pagination.pageNo = 1
}


// charts
const chartContainer = ref(null);

// 模拟数据：第一天有大批量采购，接下来只会间隔很多天后再有大批量采购，其余日期偶尔有小数量采购
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
  // 可以继续添加数据...
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
});


</script>

<style lang="less" scoped>
.home {
  .tabs-wrapper {
    margin-bottom: 20px;
  }

  .cascaderWrapper {
    .cascaderSearch {
      display: flex;
      align-items: center;
    }
    .cascaderContent-wrapper {
      border: 1px solid rgb(228,231,237);
      box-sizing: border-box;
      padding: 20px;
      .cascaderContent-title {

      }
      .cascaderContent {
        .cascaderContent-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 10px;
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

  .search-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px;
    padding-bottom: 0;
    box-sizing: border-box;
    border: 1px solid rgb(228,231,237);
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
</style>
