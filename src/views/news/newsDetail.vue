<template>
  <div class="news">

    <div class="main">
      <div class="title">
        <span>标题：</span>
        <el-input 
          class="titleInput"
          v-model="title" 
          placeholder="请输入标题" 
          clearable 
          show-word-limit
          maxlength="50"
        ></el-input>
      </div>

      <div class="richText-wrapper">
        <Toolbar
          :editor="richTextEditorRef"
          :defaultConfig="richTextEditorToolbarConfig"
          :mode="richTextEditorMode"
        />
        <Editor
          class="richText-editor"
          style="height: 700px; overflow-y: hidden;"
          v-model="richTextContent"
          :defaultConfig="richTextEditorConfig"
          :mode="richTextEditorMode"
          @onCreated="richTextEditorHandleCreated"
        />
      </div>
    </div>
    
    <div class="preview-wrapper">
      <div class="preview-pla">预览：</div>
      <div class="preview-content">
        <div class="preview-title">{{ title }}</div>
        <div class="preview-richText" v-html="richTextContent"></div>
      </div>
    </div>

    <div class="btns">
      <el-button type="primary" class="submitBtn" :loading=isSubmiting @click="toSubmit">提 交</el-button>
      <!-- <el-button type="danger" class="deleteBtn" :loading=isSubmiting @click="toDelete" v-if="$route.query.id">删 除</el-button> -->
      <el-button type="danger" class="deleteBtn" :loading=isSubmiting @click="toDelete">删 除</el-button>
      <el-switch 
        v-if="$route.query.id"
        class="showBtn" 
        size="large" 
        v-model="isShow" 
        @change="toChangeShow" 
        active-text="展示"
        inactive-text="不展示"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
      <el-switch 
        v-if="$route.query.id"
        class="pinBtn" 
        size="large" 
        v-model="isPin" 
        @change="toChangePin" 
        active-text="置顶"
        inactive-text="不置顶"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
    </div>

  </div>
</template>

<script setup>
import { onMounted, reactive, ref, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router'

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

import {
  _uploadFile
} from '@/network/upload'
import {
  _getNewsDetail,
  _addNews,
  _editNews,
  _deleteNews,
  _showNews,
  _pinNews,
} from '../../network/news'

import { PlainMessage } from '../../utils/plainMessage'

const $route = useRoute()
const $router = useRouter()

let title = ref('')

// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const richTextEditorRef = shallowRef()

// 内容 HTML
const richTextEditorMode = 'default' // default or simple
const richTextContent = ref('')
const richTextEditorToolbarConfig = reactive({
  // readOnly: Boolean(form.batchNo)
})
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
        formData.append('flag', `news`);
        _uploadFile(formData).then(res => {
          // 最后插入图片
          console.log(`${import.meta.env.VITE_BASE_URL}/${res.data.fileKey}`)
          insertFn(`${import.meta.env.VITE_BASE_URL}/${res.data.fileKey}`)
        })
      },
    },
  },
}

const richTextEditorHandleCreated = (editor) => {
  richTextEditorRef.value = editor // 记录 editor 实例，重要！
}

function getNewsDetail() {
  _getNewsDetail({id: $route.query.id}).then(res => {
    title.value = res.data.title
    richTextContent.value = res.data.content
    isShow.value = res.data.isShow === 1
    isPin.value = res.data.isPin === 1
  })
}
onMounted(() => {
  if ($route.query.id) {
    getNewsDetail()
  }
})

let isSubmiting = ref(false)
function toSubmit() {
  if (!title.value) {
    PlainMessage.warning('请输入标题')
    return
  }

  ElMessageBox.confirm(
    '确定提交保存?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    isSubmiting.value = true

    if ($route.query.id) { // 编辑
      _editNews({
        id: $route.query.id,
        title: title.value,
        content: richTextContent.value,
      }).then(res => {
        getNewsDetail()

        PlainMessage.success('编辑成功')
      }).finally(() => {
        isSubmiting.value = false
      })
    } else { // 新增
      _addNews({
        title: title.value,
        content: richTextContent.value,
      }).then(res => {
        PlainMessage.success('新增成功')

        setTimeout(() => {
          window.location.href = `${window.location.href.split('?')[0]}?id=${res.data.insertId}`;

          isSubmiting.value = false
        }, 1000)
      }).finally(() => {
        isSubmiting.value = false
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
    isSubmiting.value = true

    _deleteNews({
      id: $route.query.id,
    }).then(res => {
      PlainMessage.success('删除成功')
      $router.push('/newsList')
    }).finally(() => {
      isSubmiting.value = false
    })
  })
}

let isShow = ref(false)
function toChangeShow(value) {
  isSubmiting.value = true
  _showNews({
    id: $route.query.id,
    value: value ? 1 : 0,
  }).then(res => {
    PlainMessage.success('操作成功')
  }).catch(err => {
    isShow.value = !value
  }).finally(() => {
    isSubmiting.value = false
  })
}

let isPin = ref(false)
function toChangePin(value) {
  isSubmiting.value = true
  _pinNews({
    id: $route.query.id,
    value: value ? 1 : 0,
  }).then(res => {
    PlainMessage.success('操作成功')
  }).catch(err => {
    isPin.value = !value
  }).finally(() => {
    isSubmiting.value = false
  })
}

</script>

<style lang="less" scoped>
.news {
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding-right: 100px;
  .main {
    width: 65%;
    height: 100%;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span {
        margin-right: 10px;
      }
      .titleInput {
        width: 800px;
      }
    }
    .richText-wrapper {
      border: 1px solid gray;
      margin-top: 20px;
    }
  }
  .preview-wrapper {
    margin-left: 100px;
    flex: 1;
    display: flex;
    align-items: flex-start;
    .preview-pla {
      font-size: 20px;
      margin-right: 10px;
    }
    .preview-content {
      flex: 1;
      border: 1px solid gray;
      box-sizing: border-box;
      padding: 10px;
      .preview-title {
        font-size: 30px;
        font-weight: 700;
      }
      ::v-deep(.preview-richText img) {
        max-width: 100%;
        height: auto;
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
    .deleteBtn {
      position: fixed;
      top: 70px;
      right: 30px;
      z-index: 999;
    }
    .showBtn {
      position: fixed;
      bottom: 50px;
      right: 30px;
      z-index: 999;
    }
    .pinBtn {
      position: fixed;
      bottom: 80px;
      right: 30px;
      z-index: 999;
    }
  }
}
</style>
