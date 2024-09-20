<template>
  <div class="goodsDetail">

    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="formRules" 
      label-width="auto"
    >
      <div class="item">
        <div class="title">
          <div>基础信息</div>
        </div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8" v-if="$route.query.flag!=='add'">
              <el-form-item label="商品编号：">
                {{ form.goodsId }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称：" prop="goodsName">
                <el-input v-model="form.goodsName" placeholder="请输入" maxlength="50" clearable :disabled="Boolean(form.batchNo)" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品单位：" prop="goodsUnit">
                <el-input v-model="form.goodsUnit" placeholder="请输入" maxlength="50" clearable :disabled="Boolean(form.batchNo)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="是否上架：" prop="goodsIsSelling">
                <el-switch
                  v-model="form.goodsIsSelling"
                  active-text="上架"
                  inactive-text="下架"
                  inline-prompt
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品备注：" prop="goodsRemark">
                <el-input type="textarea" autosize v-model="form.goodsRemark" maxlength="200" show-word-limit placeholder="请输入" clearable :disabled="Boolean(form.batchNo)" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="item introduction">
        <div class="title">商品介绍</div>
        <div class="content introduction-content">
          <div class="introduction-item">
            <div class="introduction-title">轮播图</div>
            <div class="introduction-item-content">
              <el-button type="primary" @click="triggerFileInput" class="custom-button" v-if="!Boolean(form.batchNo)">选择文件</el-button>
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileChange"
                accept="image/*,video/*" 
                style="display: none"
              />

              <div class="swiperList-preview-wrapper" ref="fileSortableList">
                <div 
                  v-for="(file, index) in swiperList" :key="index" class="swiperList-preview-item">
                  <div class="swiperList-preview-image-wrapper" v-if="file.type==='image'">
                    <el-image
                      fit="scale-down"
                      :src="file.url"
                      :preview-src-list="[file.url]"
                      hide-on-click-modal
                      class="swiperList-preview-image"
                    />
                    <div class="swiperList-preview-options">
                      <span @click="fileRemove(index)" v-if="!Boolean(form.batchNo)">
                        <el-icon><i-ep-Delete /></el-icon>
                      </span>
                    </div>
                  </div>
                  <div class="swiperList-preview-video" v-if="file.type==='video'">
                    <video :src="file.url" controls width="200" height="200"></video>
                    <div class="swiperList-preview-options">
                      <span @click="fileRemove(index)" v-if="!Boolean(form.batchNo)">
                        <el-icon><i-ep-Delete /></el-icon>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="introduction-item" style="margin-top: 30px;">
            <div class="introduction-title">商品详情</div>
            <div class="introduction-item-content">
              <div class="richText-wrapper">
                <Toolbar
                  :editor="richTextEditorRef"
                  :defaultConfig="richTextEditorToolbarConfig"
                  :mode="richTextEditorMode"
                />
                <Editor
                  style="height: 500px; overflow-y: hidden;"
                  v-model="goodsRichText"
                  :defaultConfig="richTextEditorConfig"
                  :mode="richTextEditorMode"
                  @onCreated="richTextEditorHandleCreated"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前批次 -->
      <div class="item" v-if="$route.query.flag==='edit'">
        <div class="title">
          当前批次
          <div>
            <el-button class="title-btn" type="success" @click="startNewBatch">{{ isStartingNewCurrentBatch ? '取消新批次' : '开启新批次' }}</el-button>
            <el-button class="title-btn" type="warning" @click="endCurrentBatch" v-if="form.batchNo">结束当前批次</el-button>
            <el-button class="title-btn" type="danger" @click="cancelCurrentBatchAllOrder" v-if="form.batchNo&&form.batchType===0">取消所有订单</el-button>
            还需新增判断订单为0的时候可以修改
          </div>
        </div>
        <div class="content" v-if="isStartingNewCurrentBatch">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="批次编号：">{{ form.batchNo || '自动生成' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次类型：" prop="batchType">
                <el-radio-group v-model="form.batchType" :disabled="Boolean(form.batchNo)">
                  <el-radio :value="0">预订</el-radio>
                  <el-radio :value="1">现卖</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="最少购买量：" prop="batchMinQuantity">
                <div style="display: flex;align-items: center;width: 100%;">
                  <el-input-number v-model="form.batchMinQuantity" 
                    :precision="1" placeholder="请输入" :min="0.01" :max="999999" :controls="false" 
                    style="flex: 1;" :disabled="Boolean(form.batchNo)" 
                  />
                  <div style="word-break: keep-all;margin-left: 10px;">{{ form.goodsUnit }}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batchType===0">
              <el-form-item label="价格区间：" required>
                <div style="display: flex;align-items: center;">
                  <el-form-item prop="batchMinPrice" style="flex: 1;">
                    <el-input-number v-model="form.batchMinPrice" :precision="2" placeholder="最低单价" 
                    :min="0.01" :max="999999" :controls="false" style="flex: 1;" :disabled="Boolean(form.batchNo)" />
                  </el-form-item>
                  <div style="margin-left: 10px;">元</div>
                  <div style="margin: 0 10px;">~</div>
                  <el-form-item prop="batchMaxPrice" style="flex: 1;">
                    <el-input-number v-model="form.batchMaxPrice" :precision="2" placeholder="最高单价" 
                     :min="0.01" :max="999999" :controls="false" style="flex: 1;" :disabled="Boolean(form.batchNo)" />
                  </el-form-item>
                  <div style="margin-left: 10px;">元</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batchType===1">
              <el-form-item label="单价：" prop="batchUnitPrice">
                <div style="display: flex;align-items: center;width: 100%;">
                  <el-input-number v-model="form.batchUnitPrice" :precision="2" placeholder="请输入" 
                  :min="0.01" :max="999999" :controls="false" style="flex: 1;" :disabled="Boolean(form.batchNo)" />
                  <div style="word-break: keep-all;margin-left: 10px;"> 元 / {{ form.goodsUnit }}</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col :span="8">
              <el-form-item label="优惠策略：">
                <div v-for="(item, index) in batchDiscounts" :key="index" style="display: flex;align-items: center;">
                  <div style="margin-right: 10px;">满</div>
                  <el-input-number v-model="item.quantity" :precision="1" placeholder="数量" 
                  :min="0.1" :max="999999" :controls="false" style="width: 100%;" :disabled="Boolean(form.batchNo)" />
                  <div style="word-break: keep-all;margin-left: 10px;">{{ form.goodsUnit }}</div>
                  <div style="margin: 10px;">减</div>
                  <el-input-number v-model="item.discount" :precision="2" placeholder="优惠金额"
                   :min="0.01" :max="999999" :controls="false" style="width: 100%;" :disabled="Boolean(form.batchNo)" />
                  <div style="margin-left: 10px;">元</div>
                  <el-button type="danger" size="small" style="margin-left: 10px;" @click="deleteDiscountItem(index)" v-if="!Boolean(form.batchNo)">删除</el-button>
                </div>
                <el-button style="width: 100%;" @click="addDiscountItem" v-if="!Boolean(form.batchNo)">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col :span="8">
              <el-form-item label="批次备注：" prop="batchRemark">
                <el-input type="textarea" autosize v-model="form.batchRemark" maxlength="200" show-word-limit placeholder="请输入" clearable :disabled="Boolean(form.batchNo)" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>

    <!-- 历史批次 -->
    <div class="item history-batch" v-if="$route.query.flag==='edit'">
      <div class="title">
        历史批次
      </div>
      <div class="content">
        <div class="historyBatchSearch-wrapper">
          <div class="historyBatchSearch-content">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="historyBatchSearch-item">
                  <div class="historyBatchSearch-item-label">批次编号：</div>
                  <div class="historyBatchSearch-item-input">
                    <el-input placeholder="请输入" clearable v-model="historyBatchSearchParams.batchNo"></el-input>
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
            </el-row>
          </div>
          <div class="historyBatchSearch-btns">
            <el-button type="primary" @click="historyBatchSearch">查询</el-button>
            <el-button @click="historyBatchSearchReset">重置</el-button>
          </div>
        </div>

        <el-table :data="historyBatchTableData">
          <el-table-column type="expand">
            <template #default="props">
              <div m="4">
                展开内容：
                <!-- <p m="t-0 b-2">价格区间: {{ props.row.state }}</p> -->
                <p m="t-0 b-2">价格区间: 111</p>
                <p m="t-0 b-2">价格: 222</p>
                <p m="t-0 b-2">优惠策略: 333</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="batch" label="批次" align="center" />
          <el-table-column property="batchType" label="批次类型" align="center">
            <template #default="scope">
              <div>{{ scope.row.batchType==='pre-order' ? '预订' : '售卖' }}</div>
            </template>
          </el-table-column>
          <el-table-column property="time" label="持续时间" align="center" >
            <template #default="scope">
              <div>{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</div>
            </template>
          </el-table-column>
          <el-table-column property="totalDates" label="总天数" align="center" >
            <template #default="scope">
              <div>{{ scope.row.totalDates }} 天</div>
            </template>
          </el-table-column>
          <el-table-column property="totalOrderQuantity" label="总订单数" align="center" >
            <template #default="scope">
              <div>{{ scope.row.totalOrderQuantity }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="110" align="center" >
            <template #default="scope">
              <el-button link type="primary" @click="seeHistoryBatchStatistic(scope.row)">查看统计</el-button>
            </template>
          </el-table-column>
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
    
    <div class="btns">
      <el-button type="primary" class="submitBtn" :loading=isFormSubmiting @click="toSubmit">提 交</el-button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import Sortable from 'sortablejs';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';


import {
  _createOrUpdateGoods,
  _getGoodsDetailById
} from '@/network/goods'
import {
  _uploadFile
} from '@/network/upload'

const fileSortableList = ref(null);
let fileSortableInstance = null;

const $route = useRoute()
const $router = useRouter()

let formRef = ref(null)
let form = reactive({
  goodsId: null,
  goodsName: null,
  goodsUnit: null,
  goodsIsSelling: false,
  goodsRemark: null,

  batchNo: '',
  batchType: null,
  batchMinQuantity: 1.0,
  batchMinPrice: 0.01,
  batchMaxPrice: 0.01,
  batchUnitPrice: 0.01,
  batchRemark: '',
})
const formRules = reactive({
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' },],
  goodsUnit: [{ required: true, message: '请输入商品单位', trigger: 'blur' },],
  goodsIsSelling: [{ required: true, message: '请选择是否上架', trigger: 'blur' },],
  goodsRemark: [{ required: false, message: '请输入商品备注', trigger: 'blur' },],

  batchType: [{ required: true, message: '请选择批次类型', trigger: 'blur' },],
  batchMinQuantity: [{ required: true, message: '请输入最少购买量', trigger: 'blur' },],
  batchMinPrice: [
    { required: true, message: '请输入最低单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入最低单价', trigger: 'blur' },
  ],
  batchMaxPrice: [
    { required: true, message: '请输入最高单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入最高单价', trigger: 'blur' },
  ],
  batchUnitPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入单价', trigger: 'blur' },
  ],
  batchRemark: [{ required: false, message: '请输入批次备注', trigger: 'blur' },],
})

let swiperList = reactive([])

const fileInput = ref(null);  // 引用文件输入框

function triggerFileInput() { // 手动触发文件输入框的点击事件
  fileInput.value.click();
};
function handleFileChange(event) {
  const file = event.target.files[0];
  
  if (file) {
    let fileType = ''
    if (file.type.includes('image')) {
      fileType = 'image'
    } else if (file.type.includes('video')) {
      fileType = 'video'
    } else {
      alert('未知文件类型')
      return;
    }

    // 检查文件大小是否超过限制，例如限制为 10MB
    // const maxSize = 10 * 1024 * 1024;  // 10MB
    // if (file.size > maxSize) {
    //   alert('File size exceeds 10MB limit');
    //   return;
    // }

    const formData = new FormData();
    formData.append('file', file);

    _uploadFile(formData).then(res => {
      swiperList.push({
        type: fileType,
        url: res.data.url
      })
    })
  }
}

function fileRemove(index) {
  swiperList.splice(index, 1)
}

const fileSortableEnd = (evt) => {
  const { oldIndex, newIndex } = evt;

  if (oldIndex !== newIndex) {
    let tempFileList = JSON.parse(JSON.stringify(swiperList))
    
    const movedItem = tempFileList.splice(oldIndex, 1)[0];
    tempFileList.splice(newIndex, 0, movedItem);
    
    swiperList = []
    Object.assign(swiperList, tempFileList)
  }
};


// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const richTextEditorRef = shallowRef()

// 内容 HTML
const richTextEditorMode = 'default' // default or simple
const goodsRichText = ref('<p>暂无更多介绍</p>')
const richTextEditorToolbarConfig = {
  readOnly: Boolean(form.batchNo)
}
const richTextEditorConfig = { 
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 配置上传图片的服务器地址
      server: 'http://localhost:8888/api/upload',

      // 上传图片时的自定义参数，例如 token
      fieldName: 'file',
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg'], // 允许上传的文件类型

      async customUpload(file, insertFn) {
        const formData = new FormData()
        formData.append('file', file)
        _uploadFile(formData).then(res => {
          // 最后插入图片
          insertFn(res.data.url)
        })
      },
    },
  },
}

const richTextEditorHandleCreated = (editor) => {
  richTextEditorRef.value = editor // 记录 editor 实例，重要！
}


// 当前批次
let isStartingNewCurrentBatch = ref(false)

function startNewBatch() {
  isStartingNewCurrentBatch.value = !isStartingNewCurrentBatch.value
}

function endCurrentBatch() {
  ElMessageBox.confirm(
    '确定结束当前批次?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    
  }).catch(() => {
    
  })
}
function cancelCurrentBatchAllOrder() {
  ElMessageBox.confirm(
    '确定取消当前批次所有订单?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    
  }).catch(() => {
    
  })
}

let batchDiscounts = reactive([])
function deleteDiscountItem(index) {
  batchDiscounts.splice(index, 1)
}
function addDiscountItem() {
  batchDiscounts.push({quantity: null, discount: null})
}


let historyBatchSearchParams = ref({
  batchNo: '',
  time: [],
})
function historyBatchSearch() {

}
function historyBatchSearchReset() {
  Object.assign(historyBatchSearchParams, {
    batchNo: '',
    time: [],
  })
  pagination.pageNo = 1
}
let historyBatchTableData = reactive([
  {batch: '20240707110459', batchType: 'pre-order', startTime: '2024-07-07 11:04:59', endTime: '2024-07-08 12:05:48', totalDates: 20, totalOrderQuantity: 368,},
  {batch: '20240707110459', batchType: 'pre-order', startTime: '2024-07-07 11:04:59', endTime: '2024-07-08 12:05:48', totalDates: 20, totalOrderQuantity: 368,},
  {batch: '20240707110459', batchType: 'pre-order', startTime: '2024-07-07 11:04:59', endTime: '2024-07-08 12:05:48', totalDates: 20, totalOrderQuantity: 368,},
])
let historyBatchPagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})
function historyBatchPageSizeChange(newPageSize) {
  console.log(newPageSize)
}
function historyBatchPageNoChange(newPageNo) {
  console.log(newPageNo)
}
function seeHistoryBatchStatistic() { // 查看历史批次统计数据

}

let isFormSubmiting = ref(false)
function toSubmit() {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', form)

      for (const item of batchDiscounts) { // 检查优惠策略
        if (!item.quantity || !item.discount) {
          ElMessage({
            message: '优惠策略未填写完整',
            type: 'warning',
            plain: true,
          })
          return;
        }
      }

      ElMessageBox.confirm(
        '确定提交保存?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        isFormSubmiting.value = true

        let batchParams = {
          goodsId: Number($route.query.id),
          batchType: form.batchType,
          batchStatus: 1,
          batchMinQuantity: form.batchMinQuantity,
          batchRemark: form.batchRemark,
          batchDiscounts: JSON.stringify(batchDiscounts),

          snapshot_goodsName: form.goodsName,
          snapshot_goodsUnit: form.goodsUnit,
          snapshot_goodsRemark: form.goodsRemark,
          snapshot_goodsName: form.goodsName,
          snapshot_goodsRichText: goodsRichText.value

        }
        if (form.batchType === 0) { // 预订
          batchParams.batchMinPrice = form.batchMinPrice
          batchParams.batchMaxPrice = form.batchMaxPrice
        } else if (form.batchType === 1) { // 现卖
          batchParams.batchUnitPrice = form.batchUnitPrice
        }

        _createOrUpdateGoods({
          // 商品基础信息
          goodsName: form.goodsName,
          goodsUnit: form.goodsUnit,
          goodsIsSelling: form.goodsIsSelling ? 1 : 0,
          goodsRemark: form.goodsRemark,

          // 轮播图
          swiperList: swiperList,

          // 商品富文本
          goodsRichText: goodsRichText.value,

          // 当前批次
          ...batchParams

        }).then(res => {
          ElMessage({
            message: res.message,
            type: 'success',
            plain: true,
          })

          $router.back()
        }).finally(() => {
          isFormSubmiting.value = false
        })
      })
    }
  })
}


function getGoodsDetailById() { // 获取详情
  _getGoodsDetailById({ id: $route.query.id }).then(res => {
    let currentBatch = {}
    if (res.data.currentBatch) {
      currentBatch = {
        batchNo: res.data.currentBatch.batch_no,
        batchType: res.data.currentBatch.batch_type,
        batchRemark: res.data.currentBatch.batch_remark,
      }
      if (res.data.currentBatch.batch_type === 0) { // 预订
        currentBatch.batchMinPrice = Number(res.data.currentBatch.batch_minPrice)
        currentBatch.batchMaxPrice = Number(res.data.currentBatch.batch_maxPrice)
      } else if (form.batchType === 1) { // 现卖
        currentBatch.batchUnitPrice = Number(res.data.currentBatch.batch_unitPrice)
      }

      batchDiscounts.push(...JSON.parse(JSON.parse(res.data.currentBatch.batch_discounts)))

      isStartingNewCurrentBatch.value = true

      // 其他的禁止编辑
      setTimeout(() => {
        richTextEditorRef.value.disable() // 禁用富文本编辑器

        fileSortableInstance.option("disabled", true);  // 禁用轮播图拖动排序
      }, 500)
    }

    Object.assign(form, {
      goodsId: res.data.goodsId,
      goodsName: res.data.goodsName,
      goodsUnit: res.data.goodsUnit,
      goodsIsSelling: res.data.goodsIsSelling===1 ? true : false,
      goodsRemark: res.data.goodsRemark,
      ...currentBatch,
    })
    goodsRichText.value = res.data.goodsRichText
    swiperList = res.data.swiperList
  })
}

onMounted(() => {
  fileSortableInstance = new Sortable(fileSortableList.value, {
    onEnd: fileSortableEnd,
  });

  if ($route.query.flag !== 'add') {
    getGoodsDetailById()
  }  
})

onBeforeUnmount(() => {
  // 组件销毁时，也及时销毁编辑器
  const editor = richTextEditorRef.value
  if (editor == null) return;
  editor.destroy()

  if (fileSortableInstance) {
    fileSortableInstance.destroy();
  }
})

</script>

<style lang="less" scoped>
.goodsDetail {
  padding-bottom: 60px;
  .item {
    .title {
      height: 60px;
      line-height: 60px;
      font-size: 30px;
      font-weight: 700;
      background: linear-gradient(to right, rgba(25, 137, 250, 0.1), rgba(25, 137, 250, 0));
      padding: 10px;
      box-sizing: border-box;
      border-radius: 6px;
      display: flex;
      align-items: center;
      .title-btn {
        margin-left: 10px;
      }
    }
    .content {
      padding: 20px 40px;
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

  .introduction {
    .introduction-content {
      .introduction-item {
        .introduction-title {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
        } 
        .introduction-item-content {
          .uploader {

          }
          .swiperList-preview-wrapper {
            display: flex;
            align-items: center;
            margin-top: 20px;
            .swiperList-preview-item {
              margin-right: 20px;
              .swiperList-preview-options {
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-top: 4px;
                span {
                  cursor: pointer;
                  font-size: 24px;
                }
              }
            }
            .swiperList-preview-image-wrapper {
              .swiperList-preview-image {
                width: 200px;
                height: 200px;
                border: 1px solid #ccc;
                border-radius: 6px;
              }
            }
            .swiperList-preview-video-wrapper {
              .swiperList-preview-video {
                border: 1px solid #ccc;
                border-radius: 6px;
              }
            }
          }
          .richText-wrapper {
            border: 1px solid gray;
          }
        }
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
