<template>
  <div class="category">
    <div class="tree">
      <div class="tree-level1" v-for="(item, index) in treeData" :key="index">
        <div class="input-wrapper">
          <input class="level1Input" v-model="item.name" type="text" maxlength="10" placeholder="请填写一级分类名称">
          <div class="btns">
            <el-button type="primary" round class="addBtn" @click="addNode(index)">新增</el-button>
            <el-button type="danger" round class="deleteBtn" v-if="item.children.length===0" @click="deleteNode(index, null)">删除</el-button>
          </div>
        </div>
        <div class="tree-level2" v-for="(iten, indey) in item.children" :key="indey">
          <div class="input-wrapper">
            <input class="level2Input" v-model="iten.name" type="text" maxlength="10" placeholder="请填写二级分类名称">
            <div>{{ iten.goodsCount }}</div>
            <div class="btns">
              <el-button type="danger" round class="deleteBtn" v-if="iten.goodsCount===0" @click="deleteNode(index, indey)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-button type="primary" style="margin-top: 40px;" @click="addNode(null)">新增</el-button>

    <div class="submitBtn-wrapper">
      <el-button type="primary" :loading="isSubmiting" size="large" class="submitBtn" @click="submit">提 交</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted, onBeforeUnmount } from 'vue'

import {
  _updateCategory,
  _getCategory
} from '@/network/category'

let isSubmiting = ref(false)

let treeData = ref([])

function addNode(index) {
  if (index === null) {
    treeData.value.push({
      name: '',
      children: []
    })
  } else {
    treeData.value[index].children.push({
      name: '',
    })
  }
}
function deleteNode(index, indey) {
  console.log(indey);
  if (indey === null) { // 一级
    treeData.value.splice(index, 1)
  } else { // 二级
    if (treeData.value[index].children[indey].goodsCount > 0) {
      ElMessage({
        message: '',
        type: 'warning',
        plain: true,
      })
    }
    treeData.value[index].children.splice(indey, 1)
  }
}


// 其他
function submit() {
  for (const item of treeData.value) {
    if (!item.name.trim()) {
      ElMessage({
        message: '有一级分类名称为空',
        type: 'warning',
        plain: true,
      })
      return;
    }
    for (const iten of item.children) {
      if (!iten.name.trim()) {
        ElMessage({
          message: '有二级分类名称为空',
          type: 'warning',
          plain: true,
        })
        return;
      }
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
    isSubmiting.value = true

    _updateCategory({
      treeData: treeData.value
    }).then(res => {
      ElMessage({
        message: '提交成功',
        type: 'success',
        plain: true,
      })
    }).finally(() => {
      isSubmiting.value = false
    })
  })
}

function getCategory() {
  _getCategory().then(res => {
    treeData.value = res.data
  })
}

onMounted(() => {
  getCategory()
})

</script>

<style lang="less" scoped>
.category {
  .tree {
    .tree-level1 {
      margin-bottom: 40px;
      box-sizing: border-box;
      max-width: 400px;
    }
    .tree-level2 {
      margin: 20px 0;
      padding-left: 60px;
      box-sizing: border-box;
      max-width: 400px;
    }
    .input-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btns {
        display: flex;
        align-items: center;
        .addBtn {

        }
        .deleteBtn {
          margin-left: 10px;
        }
      }
    }
    input {
      border: none;
      padding: 10px;
      box-sizing: border-box;
      width: 220px;
    }
    .level1Input {
      border-bottom: 1px solid red;
    }
    .level2Input {
      border-bottom: 1px solid rgb(0, 128, 255);
    }
  }
  .submitBtn-wrapper {
    position: fixed;
    bottom: 20px;
    right: 30px;
    
    .submitBtn {
      font-size: 22px;
    }
  }
}
</style>
