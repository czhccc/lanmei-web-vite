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
              type="danger" class="deleteBtn" 
              :loading="isDeleting"
              @click="toDelete" 
              v-if="$route.query.flag==='edit'&&form.orderTypeText==='手动添加'"
            >删 除</el-button>
          </div>
        </div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商品编号：" v-if="$route.query.flag!=='add'">
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
                <el-input v-model="form.name" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="订单状态：" prop="orderStatus">
                <el-select v-model="form.orderStatus" placeholder="请选择">
                  <el-option label="预订中" value="ydz" />
                  <el-option label="待付款" value="dfk" />
                  <el-option label="已付款" value="yfk" />
                  <el-option label="已完结" value="ywj" />
                  <el-option label="已取消" value="yqx" />
                </el-select>
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
                :on-remove="handleRemove"
                :show-file-list="false"
              >
                <el-icon><i-ep-Plus /></el-icon>
              </el-upload>

              <div class="fileList-preview-wrapper">
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
                    <div class="fileList-preview-btns">
                      <span @click="handleDownload(file)" >
                        <el-icon><i-ep-Download /></el-icon>
                      </span>
                      <el-input placeholder="排序"></el-input>
                      <span @click="handleRemove(file)" >
                        <el-icon><i-ep-Delete /></el-icon>
                      </span>
                    </div>
                  </div>
                  <div class="fileList-preview-video" v-if="file.type==='video'">
                    <video :src="file.url" controls width="200" height="200"></video>
                    <div class="fileList-preview-btns">
                      <span @click="handleDownload(file)" >
                        <el-icon><i-ep-Download /></el-icon>
                      </span>
                      <el-input placeholder="排序"></el-input>
                      <span @click="handleRemove(file)" >
                        <el-icon><i-ep-Delete /></el-icon>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="introduction-item" style="margin-top: 30px;">
            <div class="introduction-title" style="font-size: 26px;font-weight: 700;margin-bottom: 20px;">详情介绍</div>
            <div class="introduction-item-content">
              <div class="richText-wrapper" style="border: 1px solid gray;">
                <Toolbar
                  :editor="richTextEditorRef"
                  :defaultConfig="richTextEditorToolbarConfig"
                  :mode="richTextEditorMode"
                />
                <Editor
                  style="height: 500px; overflow-y: hidden;"
                  v-model="richTextValue"
                  :defaultConfig="richTextEditorConfig"
                  :mode="richTextEditorMode"
                  @onCreated="richTextEditorHandleCreated"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">不同批次</div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="客户手机号：" prop="customerPhone">
                <el-input v-model="form.customerPhone" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货人手机号：" prop="recipientPhone">
                <el-input v-model="form.recipientPhone" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="省市区：" prop="recipientRegion">
                <el-input v-model="form.recipientRegion" placeholder="请输入" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货地址详情：" prop="recipientAddressDetail">
                <el-input type="textarea" autosize v-model="form.recipientAddressDetail" maxlength="200" show-word-limit placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户备注：" prop="customerRemark">
                <el-input type="textarea" autosize v-model="form.customerRemark" maxlength="200" show-word-limit placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    
    <div class="btns" v-if="$route.query.flag!=='detail'">
      <el-button type="primary" class="submitBtn" :loading=isSubmiting @click="toSubmit">提 交</el-button>
    </div>

    <el-dialog 
      v-model="isShowChooseGoodsDialog" 
      title="选择商品" 
      width="800"
      align-center
      class="chooseGoods-dialog"
    >
      <div class="chooseGoods-search">
        <div class="chooseGoods-search-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chooseGoods-search-item">
                <div class="chooseGoods-search-item-label">商品编号：</div>
                <div>
                  <el-input placeholder="请输入" clearable v-model="chooseGoodsSearchParams.goodsNo"></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="chooseGoods-search-item">
                <div class="chooseGoods-search-item-label">商品名称：</div>
                <div class="chooseGoods-search-item-input">
                  <el-input placeholder="请输入" clearable v-model="chooseGoodsSearchParams.goodsName"></el-input>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="chooseGoods-search-btns">
          <el-button type="primary" @click="chooseGoodsSearch">查询</el-button>
          <el-button @click="chooseGoodsSearchReset">重置</el-button>
        </div>
      </div>
      <el-table :data="chooseGoodsDialogTableData">
        <el-table-column property="goodsNo" label="商品编号" align="center" />
        <el-table-column property="goodsName" label="商品名称" align="center" />
        <el-table-column fixed="right" label="操作" width="110" align="center" >
          <template #default="scope">
            <el-button link type="primary" @click="chooseGoodsConfirm(scope.row)">选择</el-button>
            <el-button link type="primary" @click="chooseGoodsSeeDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
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

const fileList = reactive([
  {
    name: 'food.jpeg',
    type: 'image',
    url: 'https://pic2.zhimg.com/v2-934ad72f31d359ee5aa4401920580ec9_r.jpg',
  },
  {
    name: 'food.jpeg',
    type: 'image',
    url: 'https://pic.rmb.bdstatic.com/8f0bf441ad93e14407c86105e1526e5d.jpeg',
  },
  {
    name: 'food.jpeg',
    type: 'image',
    url: 'https://dcoco.net/image/catalog/Yaerbeide/05.jpg',
  },
  {
    name: 'food.jpeg',
    type: 'image',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food.jpeg',
    type: 'video',
    url: 'https://vdept3.bdstatic.com/mda-pi1c6afrc82uiiyx/cae_h264/1693708525397288864/mda-pi1c6afrc82uiiyx.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1720073874-0-0-ceddfd6f96d65ccfb6ec370b36f1568c&bcevod_channel=searchbox_feed&pd=1&cr=0&cd=0&pt=3&logid=1073948971&vid=4849312402729774176&klogid=1073948971&abtest=',
  },
])
const isShowFilePreview = ref(false)
const filePreviewUrl = ref('')

function handleRemove(uploadFile, uploadFiles) {
  console.log(uploadFile, uploadFiles)
}

function handlePictureCardPreview(uploadFile) {
  filePreviewUrl.value = uploadFile.url
  isShowFilePreview.value = true
}


// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const richTextEditorRef = shallowRef()

// 内容 HTML
const richTextEditorMode = 'default' // default or simple
const richTextValue = ref('<p>hello</p>')
const richTextEditorToolbarConfig = {}
const richTextEditorConfig = { placeholder: '请输入内容...' }

const richTextEditorHandleCreated = (editor) => {
  richTextEditorRef.value = editor // 记录 editor 实例，重要！
}

onBeforeUnmount(() => {
  // 组件销毁时，也及时销毁编辑器
  const editor = richTextEditorRef.value
  if (editor == null) return;
  editor.destroy()
})


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
let isShowChooseGoodsDialog = ref(false)
let chooseGoodsSearchParams = reactive({
  goodsNo: '',
  goodsName: '',
})
function toChooseGoods() {
  isShowChooseGoodsDialog.value = true
}
let chooseGoodsDialogTableData = reactive([
  {goodsNo: '111', goodsName: '蓝莓大大'},
  {goodsNo: '222', goodsName: '蓝莓小小'},
])
function chooseGoodsSearch() {

}
function chooseGoodsSearchReset() {
  Object.assign(chooseGoodsSearchParams, { // reactive 直接替换对象的引用不会影响原始对象的代理
    goodsNo: '',
    goodsName: '',
  })
}
function chooseGoodsConfirm(record) {
  console.log(record)
}
function chooseGoodsSeeDetail(record) {
  console.log(record)
  const url = `${window.location.origin}${$router.resolve({
    path: '/goodsDetail',
    query: {
      id: '123321',
      flag: 'detail'
    }
  }).href}`
  window.open(url, '_blank')
}

onMounted(() => {
  Object.assign(form, { // reactive 直接替换对象的引用不会影响原始对象的代理
    orderNo: '202407022236526936',
    orderType: '1',
    orderTypeText: '手动添加',
    orderCreateTime: '2024-07-02 22:36:52',
    orderCreateBy: 'czh',
    goodsNo: '202407022236526936',
    goodsName: '蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果蓝莓大果',
    goodsQuantity: 200,
    goodsUnit: '斤',
    goodsPrice: 150.00,
    goodsPostage: 10.00,
    customerPhone: '13989562356',
    orderCreateTime: '2024-07-02 22:42:26',
    orderStatus: 'yqx',
    orderStatusText: '已取消',
    orderCancelReason: '就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消就是要取消',
    selfRemark: '我是备注我是备注我是备注2222222222222222222222222222222我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
  })
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
              .fileList-preview-btns {
                display: flex;
                justify-content: space-around;
                span {
                  cursor: pointer;
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
        }
      }
    }
  }

  .btns {
    .submitBtn {
      position: fixed;
      bottom: 20px;
      right: 30px;
    }
  }

  .chooseGoods-dialog {
    .chooseGoods-search {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .chooseGoods-search-content {
        flex: 1;
        .chooseGoods-search-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .chooseGoods-search-item-label {
            word-break: keep-all;
          }
          .chooseGoods-search-item-input {
            width: 200px;
          }
        }
      }
      .chooseGoods-search-btns {
        width: 200px;
        display: flex;
        justify-content: center;
      }
    }
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
