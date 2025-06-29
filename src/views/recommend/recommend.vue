<template>
  <div class="recommend">

    <div class="list">
      <template v-for="(item, index) in choosedGoods" :key="index">
        <div class="item">
          <div class="index">{{ index + 1 }}、</div>
          <div class="itemBtns">
            <div>
              <el-button class="upBtn" v-if="index>0" @click="upBtnClick(item.id)">↑</el-button>
            </div>
            <div>
              <el-button class="downBtn" v-if="index<choosedGoods.length-1" @click="downBtnClick(item.id)">↓</el-button>
            </div>
          </div>
          <div class="item-content">
            <div class="goodsInfo">
              <el-image
                class="coverImage"
                :src="item.goods_coverImage"
                :preview-src-list="[item.goods_coverImage]"
              />
              <div class="name">{{ item.goods_name }}</div>
            </div>
            <div class="theChoose">
              <el-switch
                size="large"
                v-model="item.useCustomImage"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #E6A23C"
                inline-prompt
                active-text="使用自定义图片"
                inactive-text="使用商品缩略图"
                @change="(e) => typeChange(e, item.id)"
              />
              <el-button type="primary" size="small" @click="(e) => triggerFileInput(e, item.id)" class="uploadBtn" v-if="item.useCustomImage">上传自定义图片</el-button>
              <el-image
                class="customImage"
                v-if="item.useCustomImage && item.customImageUrl"
                :src="item.customImageUrl"
                :preview-src-list="[item.customImageUrl]"
                fit="contain"
              />
            </div>
          </div>
          <el-button type="danger" class="deleteBtn" @click="deleteBtnClick(item.id)">删除</el-button>
        </div>
      </template>
    </div>

    <input 
      type="file" 
      ref="customImageFileInput" 
      @change="e => customFileInputChange(e)"
      accept="image/*" 
      style="display: none"
    />

    <el-select
      v-if="canChoosedGoods.length > 0"
      size="large"
      placeholder="请选择商品"
      @change="selectChange"
    >
      <el-option
        v-for="(item, index) in canChoosedGoods"
        :key="index"
        :label="item.goods_name + ' ~ ' + item.goods_unit"
        :value="item.id"
      />
    </el-select>

    <div class="btns">
      <el-button type="primary" class="submitBtn" :loading=isSubmiting @click="toSubmit">提 交</el-button>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import {
  _uploadFile
} from '@/network/upload'
import {
  _getGoodsList,
} from '@/network/goods'
import {
  _getRecommendList,
  _editRecommendList,
} from '@/network/recommend'

import PlainMessage from '../../utils/plainMessage'

let canChoosedGoods = ref([])
let choosedGoods = ref([])
async function getSellingGoodsList() {
  const [goodsListRes, recommendListRes] = await Promise.all([
    _getGoodsList({
      pageNo: 1,
      pageSize: 9999,
      goodsIsSelling: 1,
    }),
    _getRecommendList()
  ])
  
  goodsListRes.data.records.forEach(item => {
    let hasChoosedItem = recommendListRes.data.find(recommendItem => recommendItem.goods_id === item.id)

    if (hasChoosedItem) {
      choosedGoods.value.push({
        ...item,
        useCustomImage: hasChoosedItem.customImageUrl ? true : false,
        customImageUrl: hasChoosedItem.customImageUrl,
        sort: hasChoosedItem.sort,
      })
    } else {
      canChoosedGoods.value.push({
        ...item,
        useCustomImage: false,
        customImageUrl: '',
      })
    }
  })

  choosedGoods.value.sort((a, b) => a.sort - b.sort);
}
onMounted(() => {
  getSellingGoodsList()
})


function selectChange(value) {
  const index = canChoosedGoods.value.findIndex(item => item.id === value);
  const [choosedItem] = canChoosedGoods.value.splice(index, 1);
  choosedGoods.value.push(choosedItem);
}

let isSubmiting = ref(false)
function toSubmit() {

  ElMessageBox.confirm(
    '确定提交保存?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    isSubmiting.value = true

    _editRecommendList({
      list: choosedGoods.value.map((item, index) => {
        return {
          goodsId: item.id,
          coverImageUrl: item.goods_coverImage,
          customImageUrl: item.customImageUrl,
          sort: index+1,
        }
      })
    }).then(res => {
      canChoosedGoods.value = []
      choosedGoods.value = []
      getSellingGoodsList()

      PlainMessage.success('操作成功')
    }).finally(() => {
      isSubmiting.value = false
    })
  })
}

let currentGoodsId = ref(null);
function typeChange(e, goodsId) {
  currentGoodsId.value = goodsId;
  let item = choosedGoods.value.find(item => item.id === goodsId)
  if (e) {
    item.useCustomImage = true
  } else {
    item.useCustomImage = false
    item.customImageUrl = ''
  }
}
const customImageFileInput = ref(null);  // 封面图文件上传Input
function triggerFileInput(e, goodsId) { // 手动触发文件输入框的点击事件
  currentGoodsId.value = goodsId;
  customImageFileInput.value.click()
}
function customFileInputChange(event, flag) {
  const file = event.target.files[0];
  
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('flag', `recommend-${currentGoodsId.value}`);

    _uploadFile(formData).then(res => {
      let item = choosedGoods.value.find(item => item.id === currentGoodsId.value)
      item.customImageUrl = `${import.meta.env.VITE_BASE_URL}/${res.data.fileKey}`
    })
  }
}

function upBtnClick(goodsId) {
  const index = choosedGoods.value.findIndex(item => item.id === goodsId)
  if (index > 0) {
    const temp = choosedGoods.value[index]
    choosedGoods.value[index] = choosedGoods.value[index - 1]
    choosedGoods.value[index - 1] = temp
  }
}
function downBtnClick(goodsId) {
  const index = choosedGoods.value.findIndex(item => item.id === goodsId)
  if (index < choosedGoods.value.length - 1) {
    const temp = choosedGoods.value[index]
    choosedGoods.value[index] = choosedGoods.value[index + 1]
    choosedGoods.value[index + 1] = temp
  }
}
function deleteBtnClick(value) {
  const index = choosedGoods.value.findIndex(item => item.id === value);
  const [choosedItem] = choosedGoods.value.splice(index, 1);
  canChoosedGoods.value.push(choosedItem);
}

</script>

<style lang="less" scoped>
.recommend {
  .list {
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      .index {
        font-size: 26px;
      }
      .itemBtns {
        margin-right: 20px;
        .upBtn {
          margin-bottom: 10px;
        }
        .downBtn {
          
        }
      }
      .item-content {
        .goodsInfo {
          display: flex;
          align-items: center;
          font-size: 20px;
          .coverImage {
            width: 100px;
            height: 100px;
            margin-right: 20px;
          }
          .name {

          }
        }
        .theChoose {
          .uploadBtn {
            margin-left: 10px;
          }
          .customImage {
            width: 230px;
            height: 230px;
            margin-left: 20px;
          }
        }
      }
      .deleteBtn {
        margin-left: 20px;
      }
    }
  }
  .btns {
    .submitBtn {
      position: fixed;
      bottom: 20px;
      right: 30px;
      z-index: 999;
    }
  }
}
</style>
