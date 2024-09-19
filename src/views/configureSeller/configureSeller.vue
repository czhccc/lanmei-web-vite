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
                maxlength="100" 
                show-word-limit
              />
            </div>
            <div class="content-right-item" style="margin-top: 10px;">
              <div>
                <div class="input-wrapper">
                  <div class="input-label">经度：</div>
                  <el-input class="input" v-model="item.lon" placeholder="请输入经度" @change="e => lonChange(e, index)" />
                </div>
                <div class="input-wrapper" style="margin-top: 10px;">
                  <div class="input-label">纬度：</div>
                  <el-input class="input" v-model="item.lat" placeholder="请输入纬度" @change="e => latChange(e, index)" />
                </div>
              </div>
            </div>
          </div>
          <div class="delete-wrapper">
            <el-icon class="delete-icon"><i-ep-Delete class="loginOut" @click="addressDelete(index)" /></el-icon>
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
              <el-input class="value-input" placeholder="请输入联系方式" v-model="item.contact" />
            </div>
          </div>
          <div class="delete-wrapper">
            <el-icon class="delete-icon"><i-ep-Delete class="loginOut" @click="contactDelete(index)" /></el-icon>
          </div>
        </div>
        <el-button type="primary" @click="contactAddNew">新增</el-button>
      </div>
    </div>
    <div class="item aboutUs">
      <div class="title">关于我们</div>
      <!-- <div class="isShowAboutUs-wrapper">
        是否展示：
        <el-switch v-model="isShowAboutUs" size="large" active-text="展示" inactive-text="隐藏" />
      </div> -->
      <div class="richText-wrapper">
        <Toolbar
          :editor="richTextEditorRef"
          :defaultConfig="richTextEditorToolbarConfig"
          :mode="richTextEditorMode"
        />
        <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="aboutUsRichText"
          :defaultConfig="richTextEditorConfig"
          :mode="richTextEditorMode"
          @onCreated="richTextEditorHandleCreated"
        />
      </div>
    </div>

    <div class="btns">
      <el-button type="primary" size="large" class="submitBtn" @click="submit">提 交</el-button>
    </div>
  </div>
</template>

<script setup>


import { ref, reactive, shallowRef, onMounted, onBeforeUnmount } from 'vue'
import Cookies from 'js-cookie';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {
  _getAboutUs,
  _updateAboutUs
} from '@/network/aboutUs'
import {
  _uploadFile
} from '@/network/upload'

// 线下地址
let offlineAddressList = reactive([
  // {
  //   address: '嵊州市美汐蓝莓专业合作社',
  //   lon: '120.686843',
  //   lat: '29.505098',
  // },
  // {
  //   address: '萧山国际机场T4航站楼',
  //   lon: '120.432993',
  //   lat: '30.236717',
  // },
])

function addressDelete(index) {
  offlineAddressList.splice(index, 1)
}
function addressAddNew() {
  offlineAddressList.push({
    address: '',
    lon: '',
    lat: '',
  })
}

// 联系方式
let contactList = reactive([])
function contactDelete(index) {
  contactList.splice(index, 1)
}
function contactAddNew() {
  contactList.push({
    type: '',
    value: ''
  })
}

// 关于我们
// let isShowAboutUs = ref(false)

// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const richTextEditorRef = shallowRef()

// 内容 HTML
const richTextEditorMode = 'default' // default or simple
const aboutUsRichText = ref('')
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

onBeforeUnmount(() => {
  // 组件销毁时，也及时销毁编辑器
  const editor = richTextEditorRef.value
  if (editor == null) return;
  editor.destroy()
})


// 其他
function submit() {
  for (const item of offlineAddressList) {
    if (!item.address || !item.lon || !item.lat) {
      ElMessage({
        message: '请检查线下地址项',
        type: 'warning',
        plain: true,
      })
      return;
    }
  }

  for (const item of contactList) {
    if (!item.type || !item.contact) {
      ElMessage({
        message: '请检查联系方式项',
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
    _updateAboutUs({
      address: offlineAddressList,
      contact: contactList,
      aboutUs: aboutUsRichText.value,
    }).then(res => {
      ElMessage({
        message: '修改成功',
        type: 'success',
        plain: true,
      })
    })
  })
}

onMounted(() => {
  _getAboutUs().then(res => {
    offlineAddressList.push(...res.data[0].address) 
    contactList.push(...res.data[0].contact)
    aboutUsRichText.value = res.data[0].aboutUs
  })
})

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
    box-sizing: border-box;
    padding-bottom: 60px;
    .isShowAboutUs-wrapper {
      margin-top: 10px;
      font-size: 24px;
    }
    .richText-wrapper {
      margin-top: 10px;
      border: 1px solid gray;
    }
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
