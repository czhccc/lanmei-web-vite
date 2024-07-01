<template>
  <div class="configureSeller">
    <div class="item address">
      <div class="title">线下地址</div>
      <div class="content">
        <div class="content-item" v-for="(item, index) in offlineAddressList" :key="index">
          <div class="content-left">#{{ index+1 }}</div>
          <div class="content-right">
            <div class="content-right-item">
              <div class="input-label">地址：</div>
              <el-input 
                type="textarea"
                autosize
                class="addressInput" 
                v-model="item.address" 
                placeholder="请输入详细地址"
              />
            </div>
            <div class="content-right-item" style="margin-top: 10px;">
              <div>
                <div class="input-wrapper">
                  <div class="input-label">经度：</div>
                  <el-input class="input" v-model="item.lon" placeholder="请输入经度" @change="e => lonChange(e, index)" />
                  <div class="error" v-if="item.isShowLonError">经度格式错误</div>
                </div>
                <div class="input-wrapper" style="margin-top: 10px;">
                  <div class="input-label">纬度：</div>
                  <el-input class="input" v-model="item.lat" placeholder="请输入纬度" @change="e => latChange(e, index)" />
                  <div class="error" v-if="item.isShowLatError">纬度格式错误</div>
                </div>
              </div>
            </div>
          </div>
          <div class="delete-wrapper">
            <el-popconfirm title="确认删除?" @confirm="addressDelete(item)">
              <template #reference>
                <el-icon class="delete-icon"><i-ep-Delete class="loginOut" /></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </div>
        <el-button type="primary" @click="addressAddNew">新增</el-button>
      </div>
    </div>
    <div class="item contact">
      <div class="title">联系方式</div>
      <div class="content">
        <div class="content-item" v-for="(item, index) in contactList" :key="index">
          <div class="content-left">#{{ index+1 }}</div>
          <div class="content-right">
            <div class="content-right-item">
              <el-input class="type-input" placeholder="请输入类型" v-model="item.type" />
              <el-input class="value-input" placeholder="请输入联系方式" v-model="item.value" />
            </div>
          </div>
          <div class="delete-wrapper">
            <el-popconfirm title="确认删除?" @confirm="contactDelete(item)">
              <template #reference>
                <el-icon class="delete-icon"><i-ep-Delete class="loginOut" /></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </div>
        <el-button type="primary" @click="contactAddNew">新增</el-button>
      </div>
    </div>
    <div class="item aboutUs">
      <div class="title">关于我们</div>
      <div class="content">
        <div class="content-item">
          
        </div>
      </div>
    </div>

    <div class="btns">
      <el-button type="primary" size="large" class="submitBtn" @click="submit">提 交</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

// 线下地址
let offlineAddressList = reactive([
  {
    address: '浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省',
    lon: '',
    lat: '',
    isShowLonError: false,
    isShowLatError: false,
  },
  {
    address: '浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省',
    lon: '',
    lat: '',
    isShowLonError: false,
    isShowLatError: false,
  },
])
function lonChange(e, index) {
  if (e) {
    const regex = /^-?(((\d|[1-9]\d|1[0-7]\d|0)\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/i;
    offlineAddressList[index].isShowLonError = !regex.test(e)
  } else {
    offlineAddressList[index].isShowLonError = false
  }
}
function latChange(e, index) {
  if (e) {
    const regex = /^-?([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/i;
    offlineAddressList[index].isShowLatError = !regex.test(e)
  } else {
    offlineAddressList[index].isShowLatError = false
  }
}
function addressDelete(item) {
  console.log(item)
}
function addressAddNew() {
  offlineAddressList.push({
    address: '',
    lon: '',
    lat: '',
    isShowLonError: false,
    isShowLatError: false,
  })
}

// 联系方式
let contactList = reactive([
  {
    type: '手机号',
    value: '13999999999',
  },
  {
    type: '微信号',
    value: 'wx123456789',
  },
])
function contactDelete(item) {
  console.log(item)
}
function contactAddNew() {
  contactList.push({
    type: '',
    value: ''
  })
}

// 关于我们


// 其他
function submit() {
  ElMessageBox.confirm(
    '确定提交保存?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    
  }).catch(() => {
    
  })
}

</script>

<style lang="less" scoped>
.configureSeller {
  .item {
    .title {
      font-size: 48px;
      font-weight: 700;
    }
    .content {
      padding: 20px 0;
      box-sizing: border-box;
      .content-item {
        margin-bottom: 30px;
        .content-left {
          font-weight: 700;
          font-size: 30px;
        }
      }
    }
  }
  .address {
    .content {
      .content-item {
        display: flex;
        align-items: center;
        .content-right {
          margin-left: 20px;
          width: 50%;
          .content-right-item {
            display: flex;
            align-items: center;
            .input-label {
              word-break: keep-all;
              text-align: right;
              min-width: 60px;
            }
            .addressInput {

            }
            .input-wrapper {
              display: flex;
              align-items: center;
              .input {
                width: 300px;
              }
              .error {
                color: red;
                margin-left: 10px;

              }
            }
          }
        }
        .delete-wrapper {
          .delete-icon {
            cursor: pointer;
            color: red;
            font-size: 40px;
            margin-left: 100px;
          }
        }
      }
    }
  }
  .contact {
    .content {
      .content-item {
        display: flex;
        align-items: center;
        .content-right {
          margin-left: 20px;
          width: 50%;
          .content-right-item {
            display: flex;
            align-items: center;
            .type-input {
              width: 200px;
            }
            .value-input {
              margin-left: 20px;
            }
          }
        }
        .delete-wrapper {
          .delete-icon {
            cursor: pointer;
            color: red;
            font-size: 40px;
            margin-left: 100px;
          }
        }
      }
    }
  }
  .aboutUs {

  }
  .btns {
    position: fixed;
    bottom: 20px;
    right: 30px;
    
    .submitBtn {
      font-size: 22px;
    }
  }
}
</style>
