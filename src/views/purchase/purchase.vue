<template>
  <div class="purchase">
    <div class="search-wrapper">
      <div class="search-items">
        <div class="saerch-item">
          <div class="search-item-label">批次号：</div>
          <div class="search-item-input">
            <el-input placeholder="请输入"></el-input>
          </div>
        </div>
        <div class="saerch-item" v-for="item in 10" :key="index">
          <div class="search-item-label">批次名称：</div>
          <div class="search-item-input">
            <el-input placeholder="请输入"></el-input>
          </div>
        </div>
      </div>
      <div class="search-btns">
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </div>
    </div>

    <div class="table-wrapper">
      <el-table :data="tableData">
        <el-table-column prop="date" label="Date" align="center" />
        <el-table-column prop="name" label="Name" align="center" />
        <el-table-column prop="address" label="Address" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style lang="less" scoped>
.purchase {
  .search-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .search-items {
      display: flex;
      flex-wrap: wrap;
      .saerch-item {
        display: flex;
        align-items: center;
        .saerch-item-label {
          word-break: keep-all;
        }
        .search-item-input {
          width: 200px;
        }
      }
    }
    .search-btns {
      min-width: 200px;
    }
  }
  .table-wrapper {
    margin-top: 20px;
  }
}
</style>
