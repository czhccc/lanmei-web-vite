<template>
  <div class="goodsDetail">
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="formRules" 
      label-width="auto"
    >
      <div class="item">
        <div class="title">基础信息</div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8" v-if="$route.query.flag==='edit'">
              <el-form-item label="商品编号："> {{ form.goodsId }} </el-form-item>
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
              <el-form-item label="商品分类：" prop="goodsCategoryId">
                <el-select v-model="form.goodsCategoryId" style="width: 100%;" placeholder="请选择" :disabled="Boolean(form.batchNo)">
                  <el-option-group v-for="parent in categoryList" :key="parent.id" :label="parent.name" >
                    <el-option v-for="category in parent.children" :key="category.id" :label="category.name" :value="category.id" />
                  </el-option-group>
                </el-select>
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
      <div class="item introduction" v-if="$route.query.flag==='edit'">
        <div class="title">商品介绍</div>
        <div class="content introduction-content">
          <div class="introduction-item">
            <div class="introduction-title">封面图</div>
            <div class="introduction-item-content">
              <el-button type="primary" @click="triggerFileInput('goods_coverImage')" class="custom-button" v-if="!Boolean(form.batchNo)">上传封面图</el-button>
              <input 
                type="file" 
                ref="coverImageFileInput" 
                @change="e => handleFileChange(e, 'goods_coverImage')"
                accept="image/*" 
                style="display: none"
              />
              <div class="coverImage-preview-wrapper" v-if="coverImageUrl">
                <el-image
                  fit="scale-down"
                  :src="coverImageUrl"
                  :preview-src-list="[coverImageUrl]"
                  hide-on-click-modal
                  class="coverImage-preview-image"
                />
              </div>
            </div>
          </div>

          <div class="introduction-item" style="margin-top: 30px;">
            <div class="introduction-title">轮播图</div>
            <div class="introduction-item-content">
              <el-button type="primary" @click="triggerFileInput('goods_swiper')" class="custom-button" v-if="!Boolean(form.batchNo)">上传轮播图</el-button>
              <input 
                type="file" 
                ref="swiperFileInput" 
                @change="e => handleFileChange(e, 'goods_swiper')"
                accept="image/*,video/*" 
                style="display: none"
              />

              <div class="swiperList-preview-wrapper" ref="fileSortableList">
                <div v-for="(file, index) in swiperList" :key="index" class="swiperList-preview-item">
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
      <div class="item">
        <div class="title">
          当前批次
          <div>
            <el-button class="title-btn" :type="isStartingNewCurrentBatch?'warning':'success'" @click="startNewBatch" v-if="!form.batchNo">{{ isStartingNewCurrentBatch ? '取消新批次' : '开启新批次' }}</el-button>

            <div v-if="form.batchNo">
              <el-button class="title-btn" type="primary" v-if="form.batchType==='preorder'&&!form.batchPreorderFinalPrice&&currentBatchTotalInfo.totalOrdersCount>0" @click="showPreorderBatchIsReadyToSellDialog">开始售卖</el-button>

              <el-popconfirm title="确认删除当前批次？" confirm-button-text="确定" cancel-button-text="取消" v-if="currentBatchTotalInfo.totalOrdersCount>0&&(form.batchPreorderFinalPrice||(form.batchType==='stock'))" @confirm="endCurrentBatch">
                <template #reference>
                  <el-button class="title-btn" type="warning">结束当前批次</el-button>
                </template>
              </el-popconfirm>

              <el-button class="title-btn" type="danger" @click="cancelCurrentBatchAllOrder" v-if="form.batchType==='preorder'&&!form.batchPreorderFinalPrice&&currentBatchTotalInfo.totalOrdersCount>0">取消所有预订</el-button>

              <el-popconfirm title="确认删除当前批次？" confirm-button-text="确定" cancel-button-text="取消" v-if="currentBatchTotalInfo.totalOrdersCount===0" @confirm="deleteCurrentBatch">
                <template #reference>
                  <el-button class="title-btn" type="danger">删除当前批次</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>

        </div>
        <div class="content" v-if="form.batchNo || isStartingNewCurrentBatch">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="批次编号：">{{ form.batchNo || '自动生成' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次类型：" prop="batchType">
                <el-radio-group v-model="form.batchType" :disabled="Boolean(form.batchNo)">
                  <el-radio value="preorder">预订</el-radio>
                  <el-radio value="stock">现货</el-radio>
                </el-radio-group>
                <span v-if="form.batchType==='preorder'" style="margin-left: 30px;color: #666;">{{ form.batchType==='preorder'&&form.batchPreorderFinalPrice ? '售卖阶段' : '预订阶段' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="最少购买量：" prop="batchMinQuantity">
                <div style="display: flex;align-items: center;width: 100%;">
                  <el-input-number v-model="form.batchMinQuantity" :disabled="Boolean(form.batchNo)"
                    :precision="1" placeholder="请输入" :min="0.01" :max="999999" :controls="false" 
                    style="flex: 1;"
                  />
                  <div style="word-break: keep-all;margin-left: 10px;">{{ form.goodsUnit }}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batchType==='preorder'">
              <el-form-item label="价格区间：" required>
                <div style="display: flex;align-items: center;">
                  <el-form-item prop="batchMinPrice" style="flex: 1;">
                    <el-input-number v-model="form.batchMinPrice" :precision="2" placeholder="最低单价" :disabled="Boolean(form.batchNo)"
                    :min="0.01" :max="999999" :controls="false" style="flex: 1;" />
                  </el-form-item>
                  <div style="margin-left: 10px;">元</div>
                  <div style="margin: 0 10px;">~</div>
                  <el-form-item prop="batchMaxPrice" style="flex: 1;">
                    <el-input-number v-model="form.batchMaxPrice" :precision="2" placeholder="最高单价" :disabled="Boolean(form.batchNo)"
                     :min="0.01" :max="999999" :controls="false" style="flex: 1;" />
                  </el-form-item>
                  <div style="margin-left: 10px;">元</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batchType==='stock'">
              <el-form-item label="单价：" prop="batchUnitPrice">
                <div style="display: flex;align-items: center;width: 100%;">
                  <el-input-number v-model="form.batchUnitPrice" :precision="2" placeholder="请输入" :disabled="Boolean(form.batchNo)"
                    :min="0.01" :max="999999" :controls="false" style="flex: 1;" />
                  <div style="word-break: keep-all;margin-left: 10px;"> 元 / {{ form.goodsUnit }}</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col :span="8">
              <el-form-item label="满减优惠：">
                <div v-for="(item, index) in batchDiscounts" :key="index" style="display: flex;align-items: center;">
                  <div style="margin-right: 10px;">满</div>
                  <el-input-number v-model="item.quantity" :precision="1" placeholder="数量" :disabled="Boolean(form.batchNo)"
                  :min="0.1" :max="999999" :controls="false" style="width: 100%;" />
                  <div style="word-break: keep-all;margin-left: 10px;">{{ form.goodsUnit }}</div>
                  <div style="margin: 10px;">减</div>
                  <el-input-number v-model="item.discount" :precision="2" placeholder="优惠金额" :disabled="Boolean(form.batchNo)"
                   :min="0.01" :max="999999" :controls="false" style="width: 100%;" />
                  <div style="margin-left: 10px;">元</div>
                  <el-button type="danger" size="small" style="margin-left: 10px;" @click="deleteDiscountItem(index)" v-if="!Boolean(form.batchNo)">删除</el-button>
                </div>
                <div v-if="batchDiscounts.length === 0">无</div>
                <el-button style="width: 100%;" v-if="!Boolean(form.batchNo)" @click="addDiscountItem">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col :span="8">
              <el-form-item label="批次备注：" prop="batchRemark">
                <el-input type="textarea" autosize v-model="form.batchRemark" :disabled="Boolean(form.batchNo)" maxlength="200" show-word-limit placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;" v-if="form.batchType==='stock'">
            <el-col :span="8">
              <el-form-item label="总量：" prop="batchStockTotalAmount">
                <div style="display: flex;align-items: center;width: 100%;">
                  <el-input-number v-model="form.batchStockTotalAmount" :disabled="Boolean(form.batchNo)"
                    :precision="1" placeholder="请输入" :min="0" :max="999999" :controls="false" 
                    style="flex: 1;"
                  />
                  <div style="word-break: keep-all;margin-left: 10px;">{{ form.goodsUnit }}</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;" v-if="form.batchNo">
            <el-col :span="8">
              <el-form-item label="开始时间：">
                <div style="display: flex;align-items: center;width: 100%;">
                  <div style="margin-left: 10px;">{{ form.batchStartTime }}</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="batch-postage" v-if="postageRules&&postageRules.length>0">
            <el-divider content-position="left">
              <div style="font-weight: 700;display: flex;align-items: center;">
                <el-icon><i-ep-Van /></el-icon>
                <span>配置邮费</span>
              </div>
            </el-divider>
            <div v-if="!Boolean(form.batchNo)">
              <el-button type="primary" size="small" @click="getShipProvincesOfLastBatch">继承上一批次邮费配置</el-button>
            </div>
            <div v-if="!Boolean(form.batchNo)&&unusableButChoosedProvince.length>0" style="color: red;margin-top: 10px;font-size: 14px;">
              {{ unusableButChoosedProvince.join('、') }} 已被禁用，请确认
            </div>
            <div class="batch-postage-content">
              <div class="batch-postage-content-item" v-for="(item, index) in postageRules" :key="index">
                <div>
                  <el-checkbox v-model="item.isChoosed" :label="item.name" size="large" :disabled="Boolean(form.batchNo)" />
                </div>
                <div class="batch-postage-content-item-inputs" v-if="item.isChoosed">
                  <div>
                    <el-input-number class="batch-postage-content-item-input" placeholder="首重最大数量" v-model="item.baseNum" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batchNo)"></el-input-number>
                    <el-input-number class="batch-postage-content-item-input" placeholder="首重邮费" v-model="item.basePostage" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batchNo)"></el-input-number>
                  </div>
                  <div>
                    <el-input-number class="batch-postage-content-item-input" placeholder="每续重几件" v-model="item.extraNum" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batchNo)"></el-input-number>
                    <el-input-number class="batch-postage-content-item-input" placeholder="续重单位邮费" v-model="item.extraPostage" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batchNo)"></el-input-number>
                  </div>
                  <div>
                    <el-input-number class="batch-postage-content-item-input" placeholder="包邮数量" v-model="item.freeShippingNum" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batchNo)"></el-input-number>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="batch-total" v-if="form.batchNo">
            <el-divider content-position="left">
              <div style="font-weight: 700;display: flex;align-items: center;">
                <el-icon><i-ep-TrendCharts /></el-icon>
                <span>批次总览</span>
              </div>
            </el-divider>

            <div class="batchTotal">
              <div class="batchTotal-row">
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">全部订单数：</div>
                  <div class="batchTotal-item-content">
                    <span>{{ currentBatchTotalInfo.totalOrdersCount || 0 }}</span>
                    <el-button type="primary"  style="margin-left: 30px;" v-if="currentBatchTotalInfo.totalOrdersCount>0" @click="seeOrdersByBatchNo">查看订单</el-button>
                  </div>
                </div>
                <div class="batchTotal-item" v-if="form.batchType==='stock'">
                  <div class="batchTotal-item-title">剩余量：</div>
                  <div class="batchTotal-item-content">
                    <span>{{ form.batchStockRemainingAmount }} {{form.goodsUnit}}</span>
                  </div>
                </div>
              </div>

              <div class="batchTotal-row batchTotal-row2" v-if="form.batchType==='preorder'">
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已预订</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.reservedOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-amount">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.reservedAmount || 0 }} {{ form.goodsUnit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已取消</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.canceledOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-amount">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.canceledAmount || 0 }} {{ form.goodsUnit }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="batchTotal-row batchTotal-row2" v-if="form.batchPreorderFinalPrice||form.batchType==='stock'">
                <div class="batchTotal-item" v-if="form.batchType==='preorder'">
                  <div class="batchTotal-item-title">未付款</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.unpaidOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-amount">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.unpaidAmount || 0 }} {{ form.goodsUnit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已付款</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.paidOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-amount">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.paidAmount || 0 }} {{ form.goodsUnit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已完成</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.canceledOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-amount">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.completedAmount || 0 }} {{ form.goodsUnit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已退款</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.refundedOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-amount">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ currentBatchTotalInfo.refundedAmount || 0 }} {{ form.goodsUnit }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              <el-col :span="6">
                <div class="historyBatchSearch-item">
                  <div class="historyBatchSearch-item-label">批次状态：</div>
                  <el-select v-model="historyBatchSearchParams.status" style="width: 100%;" placeholder="请选择">
                    <el-option label="已完成" value="completed" />
                    <el-option label="已取消" value="canceled" />
                    <el-option label="已删除" value="deleted" />
                  </el-select>
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
            <template #default="scope">
              <div m="4" style="font-size: 16px;">
                <div m="t-0 b-2" style="margin-bottom: 10px;">最小购买量：{{ scope.row.batchMinQuantity }} {{ scope.row.batchUnit }}</div>
                <div m="t-0 b-2" style="margin-bottom: 10px;" v-if="scope.row.batchType==='preorder'">价格：{{ scope.row.batchMinPrice }}元 ~ {{ scope.row.batchMaxPrice }} 元</div>
                <div m="t-0 b-2" style="margin-bottom: 10px;" v-if="scope.row.batchType==='stock'">价格:：{{ scope.row.batchUnitPrice }} 元</div>
                <div m="t-0 b-2" style="margin-bottom: 10px; display: flex;">
                  <div>优惠策略：</div>
                  <div>
                    <div v-for="(item, index) in scope.row.batchDiscounts" :key="index">
                      满 {{ item.quantity }} {{ scope.row.batchUnit }} 减 {{ item.discount }} 元
                    </div>
                  </div>
                </div>
                <div m="t-0 b-2" style="margin-bottom: 10px;">批次备注：{{ scope.row.batchRemark }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="batchNo" label="批次" align="center" />
          <el-table-column property="batchTypeText" label="批次类型" align="center" />
          <el-table-column property="time" label="持续时间" align="center" width="280">
            <template #default="scope">
              <div>{{ scope.row.batchStartTime }} ~ {{ scope.row.batchEndTime }}</div>
            </template>
          </el-table-column>
          <el-table-column property="totalDates" label="持续时间" align="center">
            <template #default="scope">
              <div>{{ scope.row.batchTotalDates }}</div>
            </template>
          </el-table-column>
          <el-table-column property="totalOrdersCount" label="总订单数" align="center" >
            <template #default="scope">
              <div>{{ scope.row.totalOrdersCount || 0 }}</div>
            </template>
          </el-table-column>
          <el-table-column property="totalAmount" label="总量" align="center" >
            <template #default="scope">
              <div>{{ scope.row.totalAmount || 0.00 }} {{ scope.row.batchUnit }}</div>
            </template>
          </el-table-column>
          <el-table-column property="statusText" label="批次状态" align="center" >
            <template #default="scope">
              <div>{{ scope.row.statusText }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="110" align="center" >
            <template #default="scope">
              <el-button link type="primary" @click="seeHistoryBatchStatistic(scope.row)">查看统计</el-button>
            </template>
          </el-table-column> -->
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
    
    <el-switch
      class="changeIsSelling"
      :disabled="!Boolean(form.batchNo)"
      v-model="form.goodsIsSelling"
      active-text="上架"
      inactive-text="下架"
      inline-prompt
      size="large"
      :before-change="clickGoodsIsSelling"
      @change="changeGoodsIsSelling"
    />

    <div class="btns">
      <el-button type="primary" class="submitBtn" :loading=isFormSubmiting @click="toSubmit">提 交</el-button>

      <el-button type="primary" class="submitBtn" :loading=isFormSubmiting @click="linshi" style="bottom: 100px;">临时1111</el-button>
    </div>

    <!-- 开始售卖 填写售卖定价 -->
    <el-dialog
      v-model="isShowPreorderBatchIsReadyToSellDialog"
      title="确定开始售卖？"
      width="400"
      align-center
    >
      <div class="cancelAllOrdersDialog">
        最终定价：
        <el-input-number
          v-model="preorderFinalPrice"
          :min="1"
          :max="999999"
          :precision="2"
          :controls="false"
          placeholder="请输入最终定价"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowPreorderBatchIsReadyToSellDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmPreorderBatchIsReadyToSell">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 取消所有预订弹出框 -->
    <el-dialog
      v-model="isShowCancelAllOrdersDialog"
      title="确定取消当前批次所有预订？"
      width="600"
      align-center
    >
      <div class="cancelAllOrdersDialog">
        <el-input
          v-model="cancelAllOrdersReason"
          autosize
          type="textarea"
          placeholder="请输入取消原因（将展示给客户）"
          clearable
          maxlength="100"
          show-word-limit
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowCancelAllOrdersDialog = false">取消</el-button>
          <el-button type="primary" @click="cancelAllOrdersDialogConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import Sortable from 'sortablejs';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';

import dayjs from 'dayjs'
import calculateDateDurationByMinutes from '@/utils/calculateDateDurationByMinutes'


import {
  _createOrUpdateGoods,
  _getGoodsDetailById,
  _endCurrentBatch,
  _changeGoodsIsSelling,
  _getHistoryBatchesList,
  _getBatchTotalInfo,
  _deleteCurrentBatch,
  _cancelAllOrdersInCurrentBatch,
  _preorderBatchIsReadyToSell,
} from '@/network/goods'
import {
  _getCategory
} from '@/network/category'
import {
  _uploadFile
} from '@/network/upload'
import {
  _getAll,
  _getShipProvincesOfLastBatch,
} from '@/network/ship'

const fileSortableList = ref(null);
let fileSortableInstance = null;

const $route = useRoute()
const $router = useRouter()

let formRef = ref(null)
let form = reactive({
  goodsId: null,
  goodsName: null,
  goodsUnit: null,
  goodsCategoryId: null,
  goodsIsSelling: false,
  goodsRemark: null,

  batchNo: '',
  batchType: null,
  batchStartTime: null,
  batchMinQuantity: 1.0,
  batchMinPrice: 0.01,
  batchMaxPrice: 0.01,
  batchUnitPrice: 0.01,
  batchRemark: '',
  batchStockTotalAmount: 0,
})
const formRules = reactive({
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' },],
  goodsUnit: [{ required: true, message: '请输入商品单位', trigger: 'blur' },],
  goodsCategoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' },],
  goodsIsSelling: [{ required: true, message: '请选择是否上架', trigger: 'blur' },],
  goodsRemark: [{ required: false, message: '请输入商品备注', trigger: 'blur' },],
  batchStockTotalAmount: [{ required: true, message: '请输入总量', trigger: 'blur' },],
  

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

let coverImageUrl = ref(null)
let swiperList = ref([])

const coverImageFileInput = ref(null);  // 封面图文件上传Input
const swiperFileInput = ref(null);  // 轮播图文件上传Input

function triggerFileInput(flag) { // 手动触发文件输入框的点击事件
  if (flag === 'goods_coverImage') {
    coverImageFileInput.value.click();
  }
  if (flag === 'goods_swiper') {
    swiperFileInput.value.click();
  }
};
function handleFileChange(event, flag) {
  const file = event.target.files[0];
  
  if (file && flag==='goods_coverImage') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('flag', `${flag}-${$route.query.id}`);

    _uploadFile(formData).then(res => {
      coverImageUrl.value = `${import.meta.env.VITE_BASE_URL}/${res.data.fileKey}`
    })
  }

  if (file && flag==='goods_swiper') {
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
    formData.append('flag', `${flag}-${$route.query.id}`);

    _uploadFile(formData).then(res => {
      swiperList.value.push({
        type: fileType,
        url: `${import.meta.env.VITE_BASE_URL}/${res.data.fileKey}`
      })
    })
  }
}

function fileRemove(index) {
  swiperList.value.splice(index, 1)
}

const fileSortableEnd = (evt) => {
  const { oldIndex, newIndex } = evt;

  if (oldIndex !== newIndex) {
    let tempFileList = JSON.parse(JSON.stringify(swiperList.value))
    
    const movedItem = tempFileList.splice(oldIndex, 1)[0];
    tempFileList.splice(newIndex, 0, movedItem);
    
    swiperList.value = []
    Object.assign(swiperList.value, tempFileList)
  }
};


// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const richTextEditorRef = shallowRef()

// 内容 HTML
const richTextEditorMode = 'default' // default or simple
const goodsRichText = ref('<p>暂无更多介绍</p>')
const richTextEditorToolbarConfig = reactive({
  readOnly: Boolean(form.batchNo)
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
        formData.append('flag', `goods_richText-${$route.query.id}`);
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


// 当前批次
let isStartingNewCurrentBatch = ref(false)

function startNewBatch() {
  isStartingNewCurrentBatch.value = !isStartingNewCurrentBatch.value
}

function endCurrentBatch() {
  _endCurrentBatch({
    goodsId: form.goodsId
  }).then(res => {
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
    })

    getGoodsDetailById()
    richTextEditorRef.value.enable()
    isStartingNewCurrentBatch.value = false
  })
}

// 开始售卖
let isShowPreorderBatchIsReadyToSellDialog = ref(false)
let preorderFinalPrice = ref(null)
function showPreorderBatchIsReadyToSellDialog() {
  preorderFinalPrice.value = null
  isShowPreorderBatchIsReadyToSellDialog.value = true
}
function confirmPreorderBatchIsReadyToSell() {
  if (!preorderFinalPrice.value) {
    ElMessage({
      message: '请输入最终定价',
      type: 'warning',
      plain: true,
    })
    return;
  }

  _preorderBatchIsReadyToSell({ goodsId: form.goodsId, finalPrice: preorderFinalPrice.value }).then(res => {
    if (res.code === 200) {
      ElMessage({
        message: '操作成功',
        type: 'success',
        plain: true,
      })

      isShowPreorderBatchIsReadyToSellDialog.value = false

      getGoodsDetailById()
    }
  })
}


let isShowCancelAllOrdersDialog = ref(false)
let cancelAllOrdersReason = ref('')
function cancelCurrentBatchAllOrder() {
  cancelAllOrdersReason.value = ''
  isShowCancelAllOrdersDialog.value = true
}
function cancelAllOrdersDialogConfirm() {
  if (!cancelAllOrdersReason.value.trim()) {
    ElMessage({
      message: '请输入取消原因',
      type: 'warning',
      plain: true,
    })
    return;
  }
  _cancelAllOrdersInCurrentBatch({
    id: form.goodsId,
    cancelReason: cancelAllOrdersReason.value
  }).then(res => {
    if (res.code === 200) {
      ElMessage({
        message: '操作成功',
        type: 'success',
        plain: true,
      })
      isShowCancelAllOrdersDialog.value = false
      getGoodsDetailById()
    }
  })
}
function deleteCurrentBatch() { // 删除当前批次
  _deleteCurrentBatch({id: $route.query.id}).then(res => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      plain: true,
    })

    getGoodsDetailById()
    richTextEditorRef.value.enable()
    isStartingNewCurrentBatch.value = false
  })
}

let batchDiscounts = ref([])
function deleteDiscountItem(index) {
  batchDiscounts.value.splice(index, 1)
}
function addDiscountItem() {
  batchDiscounts.value.push({quantity: null, discount: null})
}

// 邮费 postage
let postageRules = ref([])
let unusableButChoosedProvince = ref([])
function getUsableProvince() {
  postageRules.value = []
  unusableButChoosedProvince.value = []
  _getAll({ level: 'province' }).then(res => {
    if (res.code === 200) {
      // 所有 -> 选中rules -> 去除不可用     顺序不能乱，不然选中的rules显示不全
      postageRules.value = res.data.map(item => {
        if (form.batchShipProvinces) {
          let itemOfRules = form.batchShipProvinces.find(el => el.code === item.code);
          if (itemOfRules) {
            if (!item.usable) {
              unusableButChoosedProvince.value.push(item.name)
            }
            return { ...itemOfRules, isChoosed: true };
          }
        }
        if (item.usable) {
          return {
            code: item.code,
            name: item.name,
            isChoosed: false,
            baseNum: null,
            basePostage: null,
            extraNum: null,
            extraPostage: null,
            freeShippingNum: null,
          };
        }
        return null; // 显式返回 null 以避免 undefined
      }).filter(Boolean); // 过滤掉 null/undefined
    }
  })
}
function getShipProvincesOfLastBatch() {
  _getShipProvincesOfLastBatch({ goodsId: $route.query.id }).then(res => {
    if (res.code === 200) {
      if (res.data) {
        console.log(res.data);
        postageRules.value = res.data.finalResult
        unusableButChoosedProvince = res.data.unusableButChoosedProvince
      } else {
        ElMessage({ message: res.message, type: 'warning', plain: true })
      }
    }
  })
}

// 历史批次
let historyBatchSearchParams = reactive({
  batchNo: '',
  time: [],
  status: null,
})
let historyBatchPagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})
function historyBatchSearch() {
  getHistoryBatchesList()
}
function historyBatchSearchReset() {
  Object.assign(historyBatchSearchParams, {
    batchNo: '',
    time: [],
    status: null,
  })
  historyBatchPagination.pageNo = 1
  getHistoryBatchesList()
}
let historyBatchTableData = ref([])

function historyBatchPageSizeChange(newPageSize) {
  historyBatchPagination.pageSize = newPageSize
  getHistoryBatchesList()
}
function historyBatchPageNoChange(newPageNo) {
  historyBatchPagination.pageNo = newPageNo
  getHistoryBatchesList()
}

function getHistoryBatchesList() {
  _getHistoryBatchesList({
    id: $route.query.id,
    pageNo: historyBatchPagination.pageNo,
    pageSize: historyBatchPagination.pageSize,
    batchNo: historyBatchSearchParams.batchNo,
    startTime: historyBatchSearchParams.time[0],
    endTime: historyBatchSearchParams.time[1],
    status: historyBatchSearchParams.status,
  }).then(res => {
    historyBatchPagination.total = res.data.total

    historyBatchTableData.value = res.data.records.map(item => {
      let statusText = ''
      switch (item.status) {
        case 'completed': statusText='已完成';break;
        case 'canceled': statusText='已取消';break;
        case 'deleted': statusText='已删除';break;
        default: break;
      }
      return {
        batchNo: item.no,
        batchType: item.type,
        batchTypeText: item.type==='preorder'?'预订':'现货',
        batchStartTime: dayjs(item.startTime).format('YYYY-MM-DD HH:mm'),
        batchEndTime: dayjs(item.endTime).format('YYYY-MM-DD HH:mm'),
        batchTotalDates: calculateDateDurationByMinutes(item.startTime, item.endTime),
        batchUnitPrice: item.unitPrice,
        batchMinPrice: item.minPrice,
        batchMaxPrice: item.maxPrice,
        batchMinQuantity: item.minQuantity,
        batchDiscounts: JSON.parse(item.discounts),
        batchRemark: item.remark,
        batchUnit: item.snapshot_goodsUnit,
        totalOrdersCount: item.totalOrdersCount,
        totalAmount: item.totalAmount,
        statusText,
      }
    })
  })
}

let isFormSubmiting = ref(false)
function toSubmit() {
  if ($route.query.flag==='edit' && !coverImageUrl.value) {
    ElMessage({
      message: '请上传封面图',
      type: 'warning',
      plain: true,
    });
    return;
  }

  if (isStartingNewCurrentBatch.value || form.batchNo) {
    if (form.batchType==='preorder' && form.batchMinPrice===form.batchMaxPrice) {
      ElMessage({
        message: '当前批次价格区间相同',
        type: 'warning',
        plain: true,
      })
      return;
    }

    for (const item of batchDiscounts.value) { // 检查优惠策略
      if (!item.quantity || !item.discount) {
        ElMessage({
          message: '优惠策略未填写完整',
          type: 'warning',
          plain: true,
        })
        return;
      }
    }

    if (form.batchType==='stock' && form.batchStockTotalAmount===0) {
      ElMessage({
        message: '请填写总量',
        type: 'warning',
        plain: true,
      })
      return;
    }

    let postageChoosedNum = 0
    for (const item of postageRules.value) {
      if (item.isChoosed) {
        if (item.freeShippingNum === 1) { // 1个就包邮
          // 其他就可以不填写
        } else {
          if (item.baseNum > item.freeShippingNum) {
            ElMessage({ message: `包邮数量须大于等于首重最大数量`, type: 'warning', plain: true })
            return;
          } else {
            if (!item.baseNum) {
              ElMessage({ message: `${item.name} 首重最大数量 未填写`, type: 'warning', plain: true })
              return;
            }
            if (!item.basePostage) {
              ElMessage({ message: `${item.name} 首重邮费 未填写`, type: 'warning', plain: true })
              return;
            }
            if (!item.extraNum) {
              ElMessage({ message: `${item.name} 每续重几件 未填写`, type: 'warning', plain: true })
              return;
            }
            if (!item.extraPostage) {
              ElMessage({ message: `${item.name} 续重单位邮费 未填写`, type: 'warning', plain: true })
              return;
            }
            if (!item.freeShippingNum) {
              ElMessage({ message: `${item.name} 包邮数量 未填写`, type: 'warning', plain: true })
              return;
            }
          }
        }
        postageChoosedNum += 1
      }
    }
    if (postageChoosedNum === 0) {
      ElMessage({ message: `请配置邮费`, type: 'warning', plain: true })
      return;
    }
  }


  formRef.value.validate((valid, fields) => {
    if (valid) {
      ElMessageBox.confirm(
        '确定提交保存?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        isFormSubmiting.value = true

        let params = {
          // 商品基础信息
          goodsId: form.goodsId,
          goodsName: form.goodsName,
          goodsUnit: form.goodsUnit,
          goodsCategoryId: form.goodsCategoryId,
          goodsIsSelling: form.goodsIsSelling ? 1 : 0,
          goodsRemark: form.goodsRemark,

          // 富文本
          goodsRichText: goodsRichText.value,
        }

        if (coverImageUrl.value) {
          params.coverImageUrl = coverImageUrl.value
        }

        if (swiperList.value.length > 0) {
          params.swiperList = swiperList.value
        }

        if ($route.query.flag==='edit' && (form.batchNo || isStartingNewCurrentBatch.value)) {
          let batchParams = {
            batchNo: form.batchNo,
            batchType: form.batchType,
            batchStartTime: form.batchStartTime,
            batchMinQuantity: form.batchMinQuantity,
            batchRemark: form.batchRemark,
            batchStockTotalAmount: form.batchStockTotalAmount,
            batchDiscounts: batchDiscounts.value,
            batchShipProvinces: postageRules.value.filter(item => item.isChoosed).map(({ isChoosed, ...rest }) => rest),
          }
          if (form.batchType === 'preorder') { // 预订
            batchParams.batchPreorderFinalPrice = form.batchPreorderFinalPrice
            batchParams.batchMinPrice = form.batchMinPrice
            batchParams.batchMaxPrice = form.batchMaxPrice
          } else if (form.batchType === 'stock') { // 现货
            batchParams.batchUnitPrice = form.batchUnitPrice
          }

          params = {
            ...params,
            ...batchParams
          }
        }

        _createOrUpdateGoods(params).then(res => {
          ElMessage({
            message: res.message,
            type: 'success',
            plain: true,
          })

          if (!$route.query.id) { // 新增
            setTimeout(() => {
              window.location.href = `${window.location.href.split('?')[0]}?flag=edit&id=${res.data.goodsId}`;
            }, 1500)
          } else { // 编辑
            getGoodsDetailById()
          }
        }).finally(() => {
          isFormSubmiting.value = false
        })
      })
    }
  })
}

function resetForm() {
  batchDiscounts.value = []
  
  Object.assign(form, {
    goodsId: null,
    goodsName: null,
    goodsUnit: null,
    goodsCategoryId: null,
    goodsIsSelling: false,
    goodsRemark: null,
    
    batchNo: '',
    batchType: null,
    batchPreorderFinalPrice: null,
    batchStartTime: null,
    batchMinQuantity: 1.0,
    batchMinPrice: 0.01,
    batchMaxPrice: 0.01,
    batchUnitPrice: 0.01,
    batchShipProvinces: [],
    batchRemark: '',
    batchStockTotalAmount: 0,
  })
}
function getGoodsDetailById() { // 获取详情
  _getGoodsDetailById({ id: $route.query.id }).then(res => {
    resetForm()

    let currentBatch = {}
    if (res.data.batch_no) {
      currentBatch = {
        batchNo: res.data.batch_no,
        batchType: res.data.batch_type,
        batchPreorderFinalPrice: res.data.batch_preorder_finalPrice,
        batchStartTime: dayjs(res.data.batch_startTime).format('YYYY-MM-DD HH:mm:ss'),
        batchUnitPrice: Number(res.data.batch_unitPrice),
        batchMinPrice: Number(res.data.batch_minPrice),
        batchMaxPrice: Number(res.data.batch_maxPrice),
        batchMinQuantity: Number(res.data.batch_minQuantity),
        batchShipProvinces: res.data.batch_shipProvinces,
        batchRemark: res.data.batch_remark,
        batchStockTotalAmount: Number(res.data.batch_stock_totalAmount),
        batchStockRemainingAmount: Number(res.data.batch_stock_remainingAmount),
      }

      batchDiscounts.value.push(...JSON.parse(res.data.batch_discounts))

      getBatchTotalInfo({id: $route.query.id}) // 获取当前批次总计

      // 其他的禁止编辑
      setTimeout(() => {
        richTextEditorRef.value.disable() // 禁用富文本编辑器

        fileSortableInstance.option("disabled", true);  // 禁用轮播图拖动排序
      }, 500)
    }

    Object.assign(form, {}) // 结束当前批次时清空
    Object.assign(form, {
      goodsId: res.data.id,
      goodsName: res.data.goods_name,
      goodsUnit: res.data.goods_unit,
      goodsCategoryId: res.data.goods_categoryId,
      goodsIsSelling: res.data.goods_isSelling===1 ? true : false,
      goodsRemark: res.data.goods_remark,
      ...currentBatch,
    })
    goodsRichText.value = res.data.goods_richText
    coverImageUrl.value = res.data.goods_coverImage || null
    swiperList.value = res.data.swiperList.map(item => {
      return {
        url: item.url,
        type: item.fileType,
      }
    }) || []

    getHistoryBatchesList()
    getUsableProvince()
  })
}

let categoryList = ref([])
function getCategoryList() {
  _getCategory().then(res => {
    categoryList.value = res.data
  })
}

let currentBatchTotalInfo = ref({})
function getBatchTotalInfo(params) {
  _getBatchTotalInfo(params).then(res => {
    currentBatchTotalInfo.value = res.data
  })
}

onMounted(() => {
  getCategoryList()

  if ($route.query.flag==='edit') {
    fileSortableInstance = new Sortable(fileSortableList.value, {
      onEnd: fileSortableEnd,
    });

    getGoodsDetailById() // 获取详情信息
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

function clickGoodsIsSelling() {
  if (!form.goodsIsSelling && !form.batchNo) {
    ElMessage({ message: '无当前批次', type: 'warning', plain: true, })
    return false;
  }
  if (form.batchType==='stock' && form.batchStockRemainingAmount<=0) {
    ElMessage({ message: '剩余量为0，无法上架', type: 'warning', plain: true, })
    return false;
  }
  return true
}
function changeGoodsIsSelling(e) {
  _changeGoodsIsSelling({
    id: form.goodsId,
    value: e ? 1 : 0
  }).then(res => {
    ElMessage({
      message: e ? '已上架' : '已下架',
      type: 'success',
      plain: true,
    })
  })
}
function seeOrdersByBatchNo() {
  console.log(form.batchNo)
  const url = `${window.location.origin}${$router.resolve({
    path: '/orderList',
    query: {
      batchNo: form.batchNo,
    }
  }).href}`
  window.open(url, '_blank')
}


function linshi() {
  console.log(Boolean(form.batchNo));
}

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
          .coverImage-preview-wrapper {
            margin-top: 20px;
            .coverImage-preview-image {
              width: 200px;
              height: 200px;
              border: 1px solid #ccc;
              border-radius: 6px;
            }
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

  .changeIsSelling {
    display: flex;
    align-items: center;
    position: fixed;
    top: 60px;
    right: 30px;
    z-index: 999;
  }
  .btns {
    .submitBtn {
      position: fixed;
      bottom: 20px;
      right: 30px;
      z-index: 999;
    }
  }

  .batchTotal {
    padding: 0 100px;
    .batchTotal-row {
      display: flex;
      // justify-content: space-between;
      justify-content: flex-start;
      .batchTotal-item {
        display: flex;
        align-items: center;
        width: 25%;
        .batchTotal-item-title {
          text-align: right;
          color: #606266;
          font-size: 14px;
        }
        .batchTotal-item-content {
          color: black;
          font-size: 14px;
        }
      }
    }
    .batchTotal-row2 {
      margin-top: 30px;
      .batchTotal-item {
        display: flex;
        align-items: center;
        .batchTotal-item-title {
          margin-right: 6px;
        }
        .batchTotal-item-content {
          .batchTotal-item-content-order {

          }
          .batchTotal-item-content-amount {
            margin-top: 10px;
          }
          .batchTotal-item-content-label {
            color: #606266;
          }
          .batchTotal-item-content-value {
            color: black;
          }
        }
      }
    }
  }
  .batch-postage {
    .batch-postage-content {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .batch-postage-content-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-right: 20px;
        .batch-postage-content-item-inputs {
          margin-left: 6px;
          .batch-postage-content-item-input {
            width: 100px;
            margin-bottom: 2px;
            margin-right: 2px;
            :deep(.el-input__wrapper) {
              padding: 0;
            }
          }
        }
      }
    }
  }
  .batch-total {

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
