<template>
  <div class="goodsDetail">
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="formRules" 
      label-width="auto"
      :disabled="$route.query.flag==='detail'"
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
                {{ form.no }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称：">
                <el-input v-model="form.name" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位：">
                <el-input v-model="form.unit" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="是否上架：" prop="isSelling">
                <el-switch
                  v-model="form.isSelling"
                  active-text="上架"
                  inactive-text="下架"
                  inline-prompt
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" autosize v-model="form.remark" maxlength="200" show-word-limit placeholder="请输入" clearable />
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
              <el-upload
                class="uploader"
                v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="fileRemove"
                :show-file-list="false"
              >
                <el-icon><i-ep-Plus /></el-icon>
              </el-upload>

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
                      <span @click="fileRemove(file)" >
                        <el-icon><i-ep-Delete /></el-icon>
                      </span>
                    </div>
                  </div>
                  <div class="fileList-preview-video" v-if="file.type==='video'">
                    <video :src="file.url" controls width="200" height="200"></video>
                    <div class="fileList-preview-options">
                      <span @click="fileRemove(file)" >
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
                  v-model="goodsDetailRichText"
                  :defaultConfig="richTextEditorConfig"
                  :mode="richTextEditorMode"
                  @onCreated="richTextEditorHandleCreated"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>

    <div class="item">
      <div class="title">
        当前批次
        <el-button class="title-btn" type="primary" @click="endCurrentBatch">结束当前批次</el-button>
      </div>
      <div class="content">
        <el-table :data="currentBatchTableData">
          <el-table-column property="batch" label="批次" align="center" />
          <el-table-column property="startTime" label="开始时间" align="center" />
          <el-table-column fixed="right" label="操作" width="110" align="center" >
            <template #default="scope">
              <el-button link type="primary" @click="seeHistoryBatchStatistic(scope.row)">查看统计</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="item">
      <div class="title">
        历史批次
        <el-button class="title-btn" type="primary" @click="relateNewBatch">关联采购记录</el-button>
      </div>
      <div class="content">
        <el-table :data="historyBatchTableData">
          <el-table-column property="batch" label="批次" align="center" />
          <el-table-column property="time" label="时间" align="center" >
            <template #default="scope">
              <div>{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</div>
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
    
    <div class="btns" v-if="$route.query.flag!=='detail'">
      <el-button type="primary" class="submitBtn" :loading=isSubmiting @click="toSubmit">提 交</el-button>
    </div>


    <el-dialog 
      v-model="isShowChoosePurchaseDialog" 
      title="关联采购记录" 
      width="800"
      align-center
      class="choosePurchase-dialog"
    >
      <div class="choosePurchase-search">
        <div class="choosePurchase-search-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="choosePurchase-search-item">
                <div class="choosePurchase-search-item-label">商品编号：</div>
                <div>
                  <el-input placeholder="请输入" clearable v-model="choosePurchaseSearchParams.goodsNo"></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="choosePurchase-search-item">
                <div class="choosePurchase-search-item-label">商品名称：</div>
                <div class="choosePurchase-search-item-input">
                  <el-input placeholder="请输入" clearable v-model="choosePurchaseSearchParams.goodsName"></el-input>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="choosePurchase-search-btns">
          <el-button type="primary" @click="choosePurchaseSearch">查询</el-button>
          <el-button @click="choosePurchaseSearchReset">重置</el-button>
        </div>
      </div>
      <el-table :data="choosePurchaseDialogTableData" height="60vh">
        <el-table-column property="goodsNo" label="采购编号" align="center" />
        <el-table-column property="goodsName" label="时间" align="center" />
        <el-table-column fixed="right" label="操作" width="110" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="choosePurchaseConfirm(scope.row)">选择</el-button>
            <el-button link type="primary" @click="choosePurchaseSeeDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          class="pagination"
          v-model:current-page="choosePurchasePagination.pageNo"
          v-model:page-size="choosePurchasePagination.pageSize"
          :page-sizes="[10, 20, 40, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="choosePurchasePagination.total"
          @size-change="choosePurchasePageSizeChange"
          @current-change="choosePurchasePageNoChange"
        />
      </div>
    </el-dialog>

    <el-dialog v-model="isShowFilePreview">
      <el-image
        :src="filePreviewUrl"
        :preview-src-list="[filePreviewUrl]"
      />
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import Sortable from 'sortablejs';
const fileSortableList = ref(null);
let fileSortableInstance = null;

const $route = useRoute()
const $router = useRouter()
console.log($route.query.flag)

let formRef = ref(null)
let isSubmiting = ref(false)
let isDeleting = ref(false)

let form = reactive({
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
  orderStatus: [{ required: true, message: '请选择订单状态', trigger: 'blur' },],
  orderCancelReason: [{ required: true, message: '请输入取消原因', trigger: 'blur' },],
  selfRemark: [{ required: false, message: '请输入己方备注', trigger: 'blur' },],

  goodsNo: [{ required: true, message: '请选择商品', trigger: 'blur' },],
  goodsName: [{ required: true, message: '请选择商品', trigger: 'blur' },],
  goodsQuantity: [
    { required: true, message: '请输入商品数量', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入总数量', trigger: 'blur' },
  ],
  goodsPrice: [
    { required: true, message: '请输入商品金额', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入总数量', trigger: 'blur' },
  ],
  goodsPostage: [
    { required: true, message: '请输入邮费', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 99999999, message: '请输入总数量', trigger: 'blur' },
  ],

  customerPhone: [{ required: true, message: '请输入客户手机号', trigger: 'blur' },],
  recipientPhone: [{ required: true, message: '请输入客户手机号', trigger: 'blur' },],
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
const goodsDetailRichText = ref('<p>hello</p>')
const richTextEditorToolbarConfig = {
  readOnly: $route.query.flag==='detail'
}
const richTextEditorConfig = { 
  placeholder: '请输入内容...',
  readOnly: $route.query.flag==='detail'
}

const richTextEditorHandleCreated = (editor) => {
  richTextEditorRef.value = editor // 记录 editor 实例，重要！
}


function toSubmit() {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      isSubmiting.value = true
      console.log('submit!', form)

      ElMessageBox.confirm(
        '确定提交保存?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        $router.replace({
          path: '/order'
        })
      }).catch(() => {
        
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

// 选择商品弹框
let isShowChoosePurchaseDialog = ref(false)
let choosePurchaseSearchParams = reactive({
  goodsNo: '',
  goodsName: '',
})
function tochoosePurchase() {
  isShowChoosePurchaseDialog.value = true
}
let choosePurchaseDialogTableData = reactive([
  {goodsNo: '111', goodsName: '蓝莓大大'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
])
function choosePurchaseSearch() {

}
function choosePurchaseSearchReset() {
  Object.assign(choosePurchaseSearchParams, { // reactive 直接替换对象的引用不会影响原始对象的代理
    goodsNo: '',
    goodsName: '',
  })
}
function choosePurchaseConfirm(record) {
  console.log(record)
}
function choosePurchaseSeeDetail(record) {
  console.log(record)
  const url = `${window.location.origin}${$router.resolve({
    path: '/purchase',
    query: {
      id: '123321',
      flag: 'detail'
    }
  }).href}`
  window.open(url, '_blank')
}
let choosePurchasePagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})
function choosePurchasePageSizeChange(newPageSize) {
  console.log(newPageSize)
}
function choosePurchasePageNoChange(newPageNo) {
  console.log(newPageNo)
}


let currentBatchTableData = reactive([
  {batch: '20240707110459', startTime: '2024-07-07 11:04:59',}
])
function endCurrentBatch() {
  ElMessageBox.confirm(
    '确定结束当前采购编号?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    
  }).catch(() => {
    
  })
}


let historyBatchTableData = reactive([
  {batch: '20240707110459', startTime: '2024-07-07 11:04:59', endTime: '2024-07-08 12:05:48',},
  {batch: '20240707110459', startTime: '2024-07-07 11:04:59', endTime: '2024-07-08 12:05:48',},
  {batch: '20240707110459', startTime: '2024-07-07 11:04:59', endTime: '2024-07-08 12:05:48',},
])
function relateNewBatch() { // 关联采购记录
  isShowChoosePurchaseDialog.value = true
}
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



onMounted(() => {
  fileSortableInstance = new Sortable(fileSortableList.value, {
    onEnd: fileSortableEnd,
  });

  Object.assign(form, { // reactive 直接替换对象的引用不会影响原始对象的代理
    no: '202407022236526936',
    name: '蓝莓大果',
    unit: '斤',
    isSelling: true,
    remark: '我是备注我是备注我是备注2222222222222222222222222222222我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
  })
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

  .choosePurchase-dialog {
    .choosePurchase-search {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .choosePurchase-search-content {
        flex: 1;
        .choosePurchase-search-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .choosePurchase-search-item-label {
            word-break: keep-all;
          }
          .choosePurchase-search-item-input {
            width: 200px;
          }
        }
      }
      .choosePurchase-search-btns {
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
