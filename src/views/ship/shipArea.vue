<template>
  <div class="shipArea">

    <div>
      <el-tree
        ref="treeRef"
        :data="allData"
        highlight-current
      >
        <template #default="{ data }">
          <div class="custom-tree-node" style="display: flex;align-items: center;">
            <div style="width: 200px;">{{ data.name }} {{ data.code }}</div>
            <el-switch
              v-if="data.level==='province'"
              v-model="data.usable"
              style="margin-left: 30px;"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              @click.stop
              @change="value => changeUsable(value, data.code)"
            />
          </div>
        </template>
      </el-tree>
    </div>

  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

import {
  _getAll,
  _changeUsable,
} from '@/network/ship'

import { PlainMessage } from '../../utils/plainMessage'

let allData = ref(null)

onMounted(() => {
  _getAll().then(res => {
    const map = {};
    const tree = [];

    res.data.forEach(item => {
      map[item.code] = { 
        ...item,
        theLevel: item.level,
        usable: item.usable===1?true:false,
        children: [] 
      };
    });

    res.data.forEach(item => {
      const parent = map[item.parent_code];
      if (parent) {
        parent.children.push(map[item.code]);
      } else {
        tree.push(map[item.code]); // 根节点
      }
    });

    allData.value = tree
  })
})

function changeUsable(value, code) {
  console.log(value, code);
  _changeUsable({
    code,
    value: value?1:0
  }).then(res => {
    PlainMessage.success('操作成功')
  })
}

</script>

<style lang="less" scoped>
.shipArea {

}
</style>
