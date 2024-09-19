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
          <div style="display: flex;justify-content: space-between;">
            基础信息
            <el-button 
              class="title-btn"
              type="danger"
              :loading="isDeleting"
              @click="toDelete" 
              v-if="$route.query.flag==='edit'&&form.orderTypeText==='手动添加'"
            >删 除</el-button>
          </div>
        </div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8" v-if="$route.query.flag!=='add'">
              <el-form-item label="商品编号：">
                {{ form.goodsNo }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称：" prop="goodsName">
                <el-input v-model="form.goodsName" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品单位：" prop="goodsUnit">
                <el-input v-model="form.goodsUnit" placeholder="请输入" maxlength="50" clearable />
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
              <el-form-item label="备注：" prop="goodsRemark">
                <el-input type="textarea" autosize v-model="form.goodsRemark" maxlength="200" show-word-limit placeholder="请输入" clearable />
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
              <!-- <el-upload
                class="uploader"
                :http-request="customSwiperUpload"
                v-model:file-list="fileList"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :show-file-list="false"
                accept="image/*, video/*"
              >
                <el-icon><i-ep-Plus /></el-icon>
              </el-upload> -->

              <el-button type="primary" @click="triggerFileInput" class="custom-button">选择文件</el-button>
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileChange"
                accept="image/*,video/*" 
                style="display: none"
              />

              <div class="fileList-preview-wrapper" ref="fileSortableList">
                <div 
                  v-for="(file, index) in fileList" :key="index"
                  class="fileList-preview-item">
                  <div class="fileList-preview-image-wrapper" v-if="file.type==='image'">
                    <el-image
                      fit="scale-down"
                      :src="file.url"
                      :preview-src-list="[file.url]"
                      hide-on-click-modal
                      class="fileList-preview-image"
                    />
                    <div class="fileList-preview-options">
                      <span @click="fileRemove(index)" >
                        <el-icon><i-ep-Delete /></el-icon>
                      </span>
                    </div>
                  </div>
                  <div class="fileList-preview-video" v-if="file.type==='video'">
                    <video :src="file.url" controls width="200" height="200"></video>
                    <div class="fileList-preview-options">
                      <span @click="fileRemove(index)" >
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

      <div class="item" v-if="$route.query.flag==='edit'">
        <div class="title">
          当前批次
          <div>
            <el-button class="title-btn" type="success" @click="startNewBatch">开启新批次</el-button>
            <el-button class="title-btn" type="warning" @click="endCurrentBatch">结束当前批次</el-button>
            <el-button class="title-btn" type="danger" @click="cancelCurrentBatchAllOrder">取消所有订单</el-button>
          </div>
        </div>
        <div class="content">
          <el-table :data="currentBatchTableData">
            <el-table-column property="batch" label="当前批次" align="center" />
            <el-table-column property="batchType" label="批次类型" align="center">
              <template #default="scope">
                <div>{{ scope.row.batchType==='pre-order' ? '预订' : '售卖' }}</div>
              </template>
            </el-table-column>
            <el-table-column property="startTime" label="开始时间" align="center" />
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

          <div class="content">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="价格区间：" required>
                  <div style="display: flex;align-items: center;">
                    <el-form-item prop="lowestUnitPrice" style="flex: 1;">
                      <el-input-number v-model="form.lowestUnitPrice" :precision="2" placeholder="最低单价" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
                    </el-form-item>
                    <div style="margin-left: 10px;">元</div>
                    <div style="margin: 0 10px;">~</div>
                    <el-form-item prop="highestUnitPrice" style="flex: 1;">
                      <el-input-number v-model="form.highestUnitPrice" :precision="2" placeholder="最高单价" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
                    </el-form-item>
                    <div style="margin-left: 10px;">元</div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单价：" prop="unitPrice">
                  <el-input-number v-model="form.unitPrice" :precision="2" placeholder="请输入" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 10px;">
              <el-col :span="8">
                <el-form-item label="优惠策略：">
                  <div v-for="(item, index) in discounts" :key="index" style="display: flex;align-items: center;">
                    <div style="margin-right: 10px;">满</div>
                    <el-input-number v-model="item.quantity" :precision="1" placeholder="数量" :min="0.1" :max="999999" :controls="false" style="width: 100%;" />
                    <div style="margin: 10px;">{{ form.unit }}</div>
                    <div style="margin: 10px;">减</div>
                    <el-input-number v-model="item.discount" :precision="2" placeholder="优惠金额" :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
                    <div style="margin-left: 10px;">元</div>
                    <el-button type="danger" link style="margin-left: 10px;" @click="deleteDiscountItem(index)">删除</el-button>
                  </div>
                  <el-button style="width: 100%;" @click="addDiscountItem">新增</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>

    
    <div class="item" v-if="$route.query.flag==='edit'">
      <div class="title">
        历史批次
      </div>
      <div class="content">
        <div class="historyBatchSearch-wrapper">
          <div class="historyBatchSearch-content">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="historyBatchSearch-item">
                  <div class="historyBatchSearch-item-label">批次：</div>
                  <div class="historyBatchSearch-item-input">
                    <el-input placeholder="请输入" clearable v-model="historyBatchSearchParams.batch"></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="historyBatchSearch-item">
                  <div class="historyBatchSearch-item-label">下单日期：</div>
                  <div class="historyBatchSearch-item-input">
                    <el-date-picker 
                      type="daterange"
                      format="YYYY/MM/DD" value-format="YYYY-MM-DD" 
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


    <!-- 图片预览 -->
    <el-dialog v-model="isShowFilePreview">
      <el-image
        :src="filePreviewUrl"
        :preview-src-list="[filePreviewUrl]"
      />
    </el-dialog>

    <!-- 开启新批次 -->
    <el-dialog v-model="isShowNewBatchDialog" title="开启新批次" align-center width="400">
      <div style="display: flex;align-items: center;">
        <div>新批次类型：</div>
        <el-radio-group v-model="newBatchType" :disabled="isNewBatchDialogSubmiting">
          <el-radio value="1" size="large">预订</el-radio>
          <el-radio value="2" size="large">现货</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowNewBatchDialog = false">取消</el-button>
          <el-button type="primary" @click="newBatchDialogConfirm" :loading="isNewBatchDialogSubmiting">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

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
let isFormSubmiting = ref(false)
let isDeleting = ref(false)

let form = reactive({
  goodsNo: null,
  goodsName: null,
  goodsUnit: null,
  goodsIsSelling: false,
  goodsRemark: null,

  orderNo: '',
  orderType: '',
  orderTypeText: '',
  orderCreateTime: '',
  orderCreateBy: '',
  goodsNo: '',
  goodsName: '',
  goodsQuantity: 0,
  goodsUnit: '',
  goodsPrice: 0.00,
  goodsPostage: 0.00,
  customerPhone: '',
  orderCreateTime: '',
  orderStatus: '',
  orderStatusText: '',
  orderCancelReason: '',
  selfRemark: '',
})
const formRules = reactive({
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' },],
  goodsUnit: [{ required: true, message: '请输入商品单位', trigger: 'blur' },],
  goodsIsSelling: [{ required: true, message: '请选择是否上架', trigger: 'blur' },],
  goodsRemark: [{ required: false, message: '请输入商品备注', trigger: 'blur' },],
  

  lowestUnitPrice: [
    { required: true, message: '请输入最低单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入最低单价', trigger: 'blur' },
  ],
  highestUnitPrice: [
    { required: true, message: '请输入最高单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入最高单价', trigger: 'blur' },
  ],
  unitPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入单价', trigger: 'blur' },
  ],

  orderStatus: [{ required: true, message: '请选择订单状态', trigger: 'blur' },],
  orderCancelReason: [{ required: true, message: '请输入取消原因', trigger: 'blur' },],
  selfRemark: [{ required: false, message: '请输入己方备注', trigger: 'blur' },],

  goodsNo: [{ required: true, message: '请选择商品', trigger: 'blur' },],
  goodsName: [{ required: true, message: '请选择商品', trigger: 'blur' },],
  goodsQuantity: [
    { required: true, message: '请输入商品数量', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 999999, message: '请输入总数量', trigger: 'blur' },
  ],
  goodsPrice: [
    { required: true, message: '请输入商品金额', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入总数量', trigger: 'blur' },
  ],
  goodsPostage: [
    { required: true, message: '请输入邮费', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入总数量', trigger: 'blur' },
  ],

  customerPhone: [{ required: true, message: '请输入客户联系方式', trigger: 'blur' },],
  recipientPhone: [{ required: true, message: '请输入客户联系方式', trigger: 'blur' },],
  recipientRegion: [{ required: true, message: '请选择省市区', trigger: 'blur' },],
  recipientAddressDetail: [{ required: true, message: '请输入收货地址详情', trigger: 'blur' },],
  customerRemark: [{ required: false, message: '请输入客户备注', trigger: 'blur' },],
})

let fileList = reactive([
  {
    name: '1',
    type: 'image',
    url: 'https://pic2.zhimg.com/v2-934ad72f31d359ee5aa4401920580ec9_r.jpg',
  },
  {
    name: '2',
    type: 'image',
    url: 'https://pic.rmb.bdstatic.com/8f0bf441ad93e14407c86105e1526e5d.jpeg',
  },
  {
    name: '3',
    type: 'image',
    url: 'https://dcoco.net/image/catalog/Yaerbeide/05.jpg',
  },
  {
    name: '4',
    type: 'image',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: '5',
    type: 'video',
    url: 'https://vdept3.bdstatic.com/mda-pi1c6afrc82uiiyx/cae_h264/1693708525397288864/mda-pi1c6afrc82uiiyx.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1720073874-0-0-ceddfd6f96d65ccfb6ec370b36f1568c&bcevod_channel=searchbox_feed&pd=1&cr=0&cd=0&pt=3&logid=1073948971&vid=4849312402729774176&klogid=1073948971&abtest=',
  },
])
const isShowFilePreview = ref(false)
const filePreviewUrl = ref('')

const fileInput = ref(null);  // 引用文件输入框
// 手动触发文件输入框的点击事件
function triggerFileInput() {
  fileInput.value.click();
};
// 当用户选择文件时调用此方法
function handleFileChange(event) {
  const file = event.target.files[0];  // 获取选中的文件
  if (file) {
    // 检查文件大小是否超过限制，例如限制为 10MB
    // const maxSize = 10 * 1024 * 1024;  // 10MB
    // if (file.size > maxSize) {
    //   alert('File size exceeds 10MB limit');
    //   return;
    // }

    const formData = new FormData();
    formData.append('file', file);

    _uploadFile(formData).then(res => {
      console.log(res);
    })
  }
}

function fileRemove(uploadFile, uploadFiles) {
  console.log(uploadFile, uploadFiles)
}

function handlePictureCardPreview(uploadFile) {
  filePreviewUrl.value = uploadFile.url
  isShowFilePreview.value = true
}
const fileSortableEnd = (evt) => {
  const { oldIndex, newIndex } = evt;

  if (oldIndex !== newIndex) {
    let tempFileList = JSON.parse(JSON.stringify(fileList))
    
    const movedItem = tempFileList.splice(oldIndex, 1)[0];
    tempFileList.splice(newIndex, 0, movedItem);
    
    fileList = []
    Object.assign(fileList, tempFileList)
  }
};


// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const richTextEditorRef = shallowRef()

// 内容 HTML
const richTextEditorMode = 'default' // default or simple
const goodsRichText = ref('')
const richTextEditorToolbarConfig = {}
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


function toSubmit() {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', form)

      // for (const item of discounts.value) { // 检查优惠策略
      //   if (!item.quantity || !item.discount) {
      //     ElMessage({
      //       message: '请完善优惠策略',
      //       type: 'warning',
      //       plain: true,
      //     })
      //     return;
      //   }
      // }

      ElMessageBox.confirm(
        '确定提交保存?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        isFormSubmiting.value = true

        _createOrUpdateGoods({
          // 商品基础信息
          goodsName: form.goodsName,
          goodsUnit: form.goodsUnit,
          goodsIsSelling: form.goodsIsSelling ? 1 : 0,
          goodsRemark: form.goodsRemark,

          // 商品富文本
          goodsRichText: goodsRichText.value
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
function toDelete() {
  ElMessageBox.confirm(
    '确定删除?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    isDeleting.value = true
  }).catch(() => {
    
  })
}


// 关于当前批次
let isShowNewBatchDialog = ref(false)
let newBatchType = ref('1')
let isNewBatchDialogSubmiting = ref(false)
let currentBatchTableData = reactive([
  {batch: '20240707110459', batchType: 'pre-order', startTime: '2024-07-07 11:04:59', totalOrderQuantity: 368,}
])

function startNewBatch() {
  isShowNewBatchDialog.value = true
}
function newBatchDialogConfirm() {
  isNewBatchDialogSubmiting.value = true
  setTimeout(() => {
    isNewBatchDialogSubmiting.value = false
    isShowNewBatchDialog.value = false
  }, 1000)
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

let discounts = ref([
  {quantity: 2, discount: 10.00},
  {quantity: 3, discount: 20.00},
])
function deleteDiscountItem(index) {
  discounts.value.splice(index, 1)
}
function addDiscountItem() {
  discounts.value.push({quantity: null, discount: null})
}


let historyBatchSearchParams = ref({
  batch: '',
  time: [],
})
function historyBatchSearch() {

}
function historyBatchSearchReset() {
  Object.assign(historyBatchSearchParams, {
    batch: '',
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



function getGoodsDetailById() { // 获取详情
  _getGoodsDetailById({ id: 2 }).then(res => {
    console.log('id', res)
    Object.assign(form, {
      goodsNo: res.data.id,
      goodsName: res.data.goods_name,
      goodsUnit: res.data.goods_unit,
      goodsIsSelling: res.data.goods_isSelling===1 ? true : false,
      goodsRemark: res.data.goods_remark,
    })
    goodsRichText.value = res.data.goods_richText
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
          .fileList-preview-wrapper {
            display: flex;
            align-items: center;
            margin-top: 20px;
            .fileList-preview-item {
              margin-right: 20px;
              .fileList-preview-options {
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
            .fileList-preview-image-wrapper {
              .fileList-preview-image {
                width: 200px;
                height: 200px;
                border: 1px solid #ccc;
                border-radius: 6px;
              }
            }
            .fileList-preview-video-wrapper {
              .fileList-preview-video {
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
