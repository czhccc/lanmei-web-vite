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
              <el-form-item label="商品编号："> {{ form.goods_id }} </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称：" prop="goods_name">
                <el-input v-model="form.goods_name" placeholder="请输入" maxlength="50" clearable :disabled="Boolean(form.batch_no)" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品单位：" prop="goods_unit">
                <el-input v-model="form.goods_unit" placeholder="请输入" maxlength="50" clearable :disabled="Boolean(form.batch_no)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商品分类：" prop="goods_categoryId">
                <el-select v-model="form.goods_categoryId" style="width: 100%;" placeholder="请选择" :disabled="Boolean(form.batch_no)">
                  <el-option-group v-for="parent in categoryList" :key="parent.id" :label="parent.name" >
                    <el-option v-for="category in parent.children" :key="category.id" :label="category.name" :value="category.id" />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品备注：" prop="goods_remark">
                <el-input type="textarea" autosize v-model="form.goods_remark" maxlength="200" show-word-limit placeholder="请输入" clearable :disabled="Boolean(form.batch_no)" />
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
              <el-button type="primary" @click="triggerFileInput('goods_coverImage')" class="custom-button" v-if="!Boolean(form.batch_no)">上传封面图</el-button>
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
              <el-image :src="coverImageUrl" />
            </div>
          </div>

          <div class="introduction-item" style="margin-top: 30px;">
            <div class="introduction-title">轮播图</div>
            <div class="introduction-item-content">
              <el-button type="primary" @click="triggerFileInput('goods_swiper')" class="custom-button" v-if="!Boolean(form.batch_no)">上传轮播图</el-button>
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
                      <span @click="fileRemove(index)" v-if="!Boolean(form.batch_no)">
                        <el-icon><i-ep-Delete /></el-icon>
                      </span>
                    </div>
                  </div>
                  <div class="swiperList-preview-video" v-if="file.type==='video'">
                    <video :src="file.url" controls width="200" height="200"></video>
                    <div class="swiperList-preview-options">
                      <span @click="fileRemove(index)" v-if="!Boolean(form.batch_no)">
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
                <div class="richText-editor">
                  <Toolbar
                    :editor="richTextEditorRef"
                    :defaultConfig="richTextEditorToolbarConfig"
                    :mode="richTextEditorMode"
                  />
                  <Editor
                    style="height: 500px; overflow-y: hidden;"
                    v-model="goods_richText"
                    :defaultConfig="richTextEditorConfig"
                    :mode="richTextEditorMode"
                    @onCreated="richTextEditorHandleCreated"
                  />
                </div>
                <div class="richText-preview" v-html="goods_richText"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前批次 -->
      <div class="item" v-if="$route.query.flag==='edit'">
        <div class="title">
          批次
          <div>
            <el-button class="title-btn" :type="isStartingNewCurrentBatch?'warning':'success'" @click="startNewBatch" v-if="!form.batch_no">{{ isStartingNewCurrentBatch ? '取消新批次' : '开启新批次' }}</el-button>

            <div v-if="form.batch_no">
              <el-button class="title-btn" type="primary" v-if="form.batch_type==='preorder'&&!form.batch_preorder_FinalPrice&&batchOrdersStatistic.totalOrdersCount>0" @click="showPreorderBatchIsReadyToSellDialog">开始售卖</el-button>

              <el-popconfirm title="确认结束当前批次？" confirm-button-text="确定" cancel-button-text="取消" v-if="batchOrdersStatistic.totalOrdersCount>0&&(form.batch_preorder_FinalPrice||(form.batch_type==='stock'))" @confirm="endCurrentBatch">
                <template #reference>
                  <el-button class="title-btn" type="warning">结束当前批次</el-button>
                </template>
              </el-popconfirm>

              <el-button class="title-btn" type="danger" @click="cancelCurrentBatchAllOrder" v-if="form.batch_type==='preorder'&&!form.batch_preorder_FinalPrice&&batchOrdersStatistic.totalOrdersCount>0">取消所有预订</el-button>

              <el-popconfirm title="确认删除当前批次？" confirm-button-text="确定" cancel-button-text="取消" v-if="batchOrdersStatistic.totalOrdersCount===0" @confirm="deleteCurrentBatch">
                <template #reference>
                  <el-button class="title-btn" type="danger">删除当前批次</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
          <div style="position: absolute;right: 10px;">
            <el-button type="primary" size="small" @click="seeHistoryBatches">历史批次</el-button>
          </div>

        </div>
        <div class="content" v-if="form.batch_no || isStartingNewCurrentBatch">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="批次编号：">{{ form.batch_no || '自动生成' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次类型：" prop="batch_type">
                <el-radio-group v-model="form.batch_type" :disabled="Boolean(form.batch_no)">
                  <el-radio value="preorder">预订</el-radio>
                  <el-radio value="stock">现货</el-radio>
                </el-radio-group>
                <span v-if="form.batch_type==='preorder'" style="margin-left: 30px;color: #666;">{{ form.batch_type==='preorder'&&form.batch_preorder_FinalPrice ? '售卖阶段' : '预购阶段' }}</span>
                <span v-if="form.batchPreorderStartSellingTime" style="color: #666;">售卖开始时间：{{ form.batchPreorderStartSellingTime }} 操作人：{{ form.batchPreorderStartSellingBy }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="最少购买量：" prop="batch_minQuantity">
                <div style="display: flex;align-items: center;width: 100%;">
                  <el-input-number v-model="form.batch_minQuantity" :disabled="Boolean(form.batch_no)"
                    :precision="1" placeholder="请输入" :min="0.01" :max="999999" :controls="false" 
                    style="flex: 1;"
                  />
                  <div style="word-break: keep-all;margin-left: 10px;">{{ form.goods_unit }}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batch_type==='preorder'">
              <el-form-item label="价格区间：" required>
                <div style="display: flex;align-items: center;">
                  <el-form-item prop="batch_preorder_minPrice" style="flex: 1;">
                    <el-input-number v-model="form.batch_preorder_minPrice" :precision="2" placeholder="最低单价" :disabled="Boolean(form.batch_no)"
                    :min="0.01" :max="999999" :controls="false" style="flex: 1;" />
                  </el-form-item>
                  <div style="margin-left: 10px;">元</div>
                  <div style="margin: 0 10px;">~</div>
                  <el-form-item prop="batch_preorder_maxPrice" style="flex: 1;">
                    <el-input-number v-model="form.batch_preorder_maxPrice" :precision="2" placeholder="最高单价" :disabled="Boolean(form.batch_no)"
                     :min="0.01" :max="999999" :controls="false" style="flex: 1;" />
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batch_type==='stock'">
              <el-form-item label="单价：" prop="batch_stock_unitPrice">
                <div style="display: flex;align-items: center;width: 100%;">
                  <el-input-number v-model="form.batch_stock_unitPrice" :precision="2" placeholder="请输入" :disabled="Boolean(form.batch_no)"
                    :min="0.01" :max="999999" :controls="false" style="flex: 1;" />
                  <div style="word-break: keep-all;margin-left: 10px;"> 元 / {{ form.goods_unit }}</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col :span="8">
              <el-form-item label="满减优惠：">
                <div v-for="(item, index) in discountsPromotion" :key="index" style="display: flex;align-items: center;margin-bottom: 10px;">
                  <div style="margin-right: 10px;">满</div>
                  <el-input-number v-model="item.quantity" :precision="1" placeholder="数量" :disabled="Boolean(form.batch_no)"
                  :min="0.1" :max="999999" :controls="false" style="width: 100%;" >
                    <template #suffix>
                      <span>{{ form.goods_unit }}</span>
                    </template>
                  </el-input-number>
                  <div style="margin: 0 10px;">减</div>
                  <el-input-number v-model="item.discount" :precision="2" placeholder="优惠金额" :disabled="Boolean(form.batch_no)"
                   :min="0.01" :max="999999" :controls="false" style="width: 100%;" >
                    <template #prefix>
                      <span>￥</span>
                    </template>
                  </el-input-number>
                  <el-button type="danger" size="small" style="margin-left: 10px;" @click="deleteDiscountItem(index)" v-if="!Boolean(form.batch_no)">删除</el-button>
                </div>
                <div v-if="discountsPromotion.length === 0">无</div>
                <el-button style="width: 100%;" v-if="!Boolean(form.batch_no)" @click="addDiscountItem">新增</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="额外选项：">
                <div v-for="(item, index) in extraOptions" :key="index" style="width: 100%;display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;">
                  <el-input v-model="item.content" placeholder="选项内容" maxlength="20" :disabled="Boolean(form.batch_no)" style="flex: 1;" />
                  <el-input-number v-model="item.amount" :precision="2" placeholder="费用" :disabled="Boolean(form.batch_no)"
                   :min="0.01" :max="999999" :controls="false" style="width: 130px;margin-left: 10px;" >
                    <template #prefix>
                      <span>￥</span>
                    </template>
                  </el-input-number>
                  <el-button type="danger" size="small" style="margin-left: 10px;" @click="deleteExtraOptionItem(index)" v-if="!Boolean(form.batch_no)">删除</el-button>
                </div>
                <div v-if="extraOptions.length === 0">无</div>
                <el-button style="width: 100%;" v-if="!Boolean(form.batch_no)" @click="addExtraOptionItem">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col :span="8">
              <el-form-item label="批次备注：" prop="batch_remark">
                <el-input type="textarea" autosize v-model="form.batch_remark" :disabled="Boolean(form.batch_no)" maxlength="200" show-word-limit placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;" v-if="form.batch_type==='stock'">
            <el-col :span="8">
              <el-form-item label="总量：" prop="batch_stock_totalQuantity">
                <div style="display: flex;align-items: center;width: 100%;">
                  <el-input-number v-model="form.batch_stock_totalQuantity" :disabled="Boolean(form.batch_no)"
                    :precision="1" placeholder="请输入" :min="0" :max="999999" :controls="false" 
                    style="flex: 1;"
                  />
                  <div style="word-break: keep-all;margin-left: 10px;">{{ form.goods_unit }}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.batch_type==='stock'">
              <el-form-item label="剩余库存：">
                <div>{{ stockRemainingQuantity }} {{ form.goods_unit }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;" v-if="form.batch_no">
            <el-col :span="8">
              <el-form-item label="开始时间：">
                <div style="display: flex;align-items: center;width: 100%;">
                  <div style="margin-left: 10px;">{{ form.batch_startTime }}</div>
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
            <div v-if="!Boolean(form.batch_no)">
              <el-button type="primary" size="small" @click="getShipProvincesOfLastBatch">继承上一批次邮费配置</el-button>
            </div>
            <div v-if="!Boolean(form.batch_no)&&unusableButChoosedProvince.length>0" style="color: red;margin-top: 10px;font-size: 14px;">
              {{ unusableButChoosedProvince.join('、') }} 已被禁用，请确认
            </div>
            <div class="batch-postage-content">
              <div class="batch-postage-content-item" v-for="(item, index) in postageRules" :key="index">
                <div>
                  <el-checkbox v-model="item.isChoosed" :label="item.name" size="large" :disabled="Boolean(form.batch_no)" />
                </div>
                <div class="batch-postage-content-item-inputs" v-if="item.isChoosed">
                  <div>
                    <el-input-number class="batch-postage-content-item-input" placeholder="首重最大数量" v-model="item.baseQuantity" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batch_no)"></el-input-number>
                    <el-input-number class="batch-postage-content-item-input" placeholder="首重邮费" v-model="item.basePostage" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batch_no)"></el-input-number>
                  </div>
                  <div>
                    <el-input-number class="batch-postage-content-item-input" placeholder="每续重几件" v-model="item.extraQuantity" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batch_no)"></el-input-number>
                    <el-input-number class="batch-postage-content-item-input" placeholder="续重单位邮费" v-model="item.extraPostage" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batch_no)"></el-input-number>
                  </div>
                  <div>
                    <el-input-number class="batch-postage-content-item-input" placeholder="包邮数量" v-model="item.freeShippingQuantity" :min="0.1" :max="99999" :precision="1" :controls="false" :disabled="Boolean(form.batch_no)"></el-input-number>
                  </div>
                </div>
              </div>
            </div>
            <div class="canHomeDelivery">
              <span class="canHomeDelivery-text">嵊州市内可送货上门：</span>
              <el-switch
                v-model="canHomeDelivery"
                :disabled="Boolean(form.batch_no)"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </div>
          </div>

          <div class="batch-total" v-if="form.batch_no">
            <el-divider content-position="left">
              <div style="font-weight: 700;display: flex;align-items: center;">
                <el-icon><i-ep-TrendCharts /></el-icon>
                <span>订单统计</span>
              </div>
            </el-divider>

            <div class="batchTotal">
              <div class="batchTotal-row">
                <div class="batchTotal-item">
                  <el-button @click="seeOrdersByBatchNo">查看订单</el-button>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">统计时间：</div>
                  <div class="batchTotal-item-content">
                    <span>{{ batchOrdersStatistic.startTime }}</span>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">过期时间：</div>
                  <div class="batchTotal-item-content">
                    <span>{{ batchOrdersStatistic.endTime }}</span>
                  </div>
                </div>
              </div>

              <div class="batchTotal-row batchTotal-row2">
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">批次总订单数：</div>
                  <div class="batchTotal-item-content">
                    <span>{{ batchOrdersStatistic.totalOrdersCount }}</span>
                  </div>
                </div>
              </div>

              <div class="batchTotal-row batchTotal-row2" v-if="form.batch_type==='preorder'">
                <div class="batchTotal-item" v-if="!form.batch_preorder_FinalPrice">
                  <div class="batchTotal-item-title">已预订</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.reservedOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-quantity">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.reservedQuantity || 0 }} {{ form.goods_unit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item" v-if="!form.batch_preorder_FinalPrice">
                  <div class="batchTotal-item-title">已取消</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.canceledOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-quantity">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.canceledQuantity || 0 }} {{ form.goods_unit }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="batchTotal-row batchTotal-row2" v-if="form.batch_preorder_FinalPrice||form.batch_type==='stock'">
                <div class="batchTotal-item" v-if="form.batch_type==='preorder'">
                  <div class="batchTotal-item-title">未付款</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.unpaidOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-quantity">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.unpaidQuantity || 0 }} {{ form.goods_unit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item" v-if="form.batch_type==='preorder'">
                  <div class="batchTotal-item-title">已关闭</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.closedOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-quantity">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.closedQuantity || 0 }} {{ form.goods_unit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已付款</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.paidOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-quantity">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.paidQuantity || 0 }} {{ form.goods_unit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已发货</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.shippedOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-quantity">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.shippedQuantity || 0 }} {{ form.goods_unit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已完结</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.completedOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-quantity">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.completedQuantity || 0 }} {{ form.goods_unit }}</span>
                    </div>
                  </div>
                </div>
                <div class="batchTotal-item">
                  <div class="batchTotal-item-title">已退款</div>
                  <div class="batchTotal-item-content">
                    <div class="batchTotal-item-content-order">
                      <span class="batchTotal-item-content-label">订单数：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.refundedOrdersCount || 0 }}</span>
                    </div>
                    <div class="batchTotal-item-content-quantity">
                      <span class="batchTotal-item-content-label">总量：</span>
                      <span class="batchTotal-item-content-value">{{ batchOrdersStatistic.refundedQuantity || 0 }} {{ form.goods_unit }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </el-form>
    
    <el-switch
      class="changeIsSelling"
      :disabled="!Boolean(form.batch_no)"
      v-model="form.goods_isSelling"
      active-text="上架"
      inactive-text="下架"
      inline-prompt
      size="large"
      :before-change="clickGoodsIsSelling"
      @change="changeGoodsIsSelling"
    />

    <div class="btns">
      <el-button type="primary" class="submitBtn" :loading=isFormSubmiting @click="toSubmit">提 交</el-button>
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
import '@wangeditor/editor/dist/css/style.css'

import Sortable from 'sortablejs';

import PlainMessage from '../../utils/plainMessage'

import dayjs from 'dayjs'

import {
  _createOrUpdateGoods,
  _getGoodsDetailById,
  _endCurrentBatch,
  _changeGoodsIsSelling,
  _getHistoryBatchesList,
  _getBatchOrdersStatistic,
  _deleteCurrentBatch,
  _cancelAllOrdersInCurrentBatch,
  _preorderBatchIsReadyToSell,
  _getGoodsStockRemainingQuantityFromRedis,
} from '@/network/goods'
import {
  _getCategory
} from '@/network/category'
import {
  _uploadFile,
  _handleCOSUrl
} from '@/network/upload'
import {
  _getAll,
  _getShipProvincesOfLastBatch,
} from '@/network/ship'

import formatNumber from '../../utils/formatNumber'

import uploadToCOS from '../../utils/uploadToCOS'


const fileSortableList = ref(null);
let fileSortableInstance = null;

const $route = useRoute()
const $router = useRouter()

let formRef = ref(null)
let form = reactive({
  goods_id: null,
  goods_name: null,
  goods_unit: null,
  goods_categoryId: null,
  goods_isSelling: false,
  goods_remark: null,

  batch_no: '',
  batch_type: null,
  batch_startTime: null,
  batch_minQuantity: 1.0,
  batch_preorder_minPrice: 0.01,
  batch_preorder_maxPrice: 0.01,
  batch_stock_unitPrice: 0.01,
  batch_remark: '',
  batch_stock_totalQuantity: 0,
})
const formRules = reactive({
  goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' },],
  goods_unit: [{ required: true, message: '请输入商品单位', trigger: 'blur' },],
  goods_categoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' },],
  goods_remark: [{ required: false, message: '请输入商品备注', trigger: 'blur' },],
  batch_stock_totalQuantity: [{ required: true, message: '请输入总量', trigger: 'blur' },],
  

  batch_type: [{ required: true, message: '请选择批次类型', trigger: 'blur' },],
  batch_minQuantity: [{ required: true, message: '请输入最少购买量', trigger: 'blur' },],
  batch_preorder_minPrice: [
    { required: true, message: '请输入最低单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入最低单价', trigger: 'blur' },
  ],
  batch_preorder_maxPrice: [
    { required: true, message: '请输入最高单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入最高单价', trigger: 'blur' },
  ],
  batch_stock_unitPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0.01, max: 999999, message: '请输入单价', trigger: 'blur' },
  ],
  batch_remark: [{ required: false, message: '请输入批次备注', trigger: 'blur' },],
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
    uploadToCOS(file, 'goods/goods_coverImage/', `goodsId-${$route.query.id}`).then(res => {

      const encodedUrl = encodeURIComponent(res);
      _handleCOSUrl({
        url: encodedUrl
      }).then(res2 => {
        let theUrl = URL.createObjectURL(res2)
        coverImageUrl.value = theUrl
      })


      // coverImageUrl.value = res
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

    uploadToCOS(file, 'goods/goods_swiper/', `goodsId-${$route.query.id}`).then(res => {
      swiperList.value.push({
        type: fileType,
        url: res
      })
    })
  }
}
// function handleFileChange(event, flag) {
//   const file = event.target.files[0];
  
//   if (file && flag==='goods_coverImage') {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('flag', `${flag}-${$route.query.id}`);

//     _uploadFile(formData).then(res => {
//       coverImageUrl.value = `${import.meta.env.VITE_BASE_URL}/${res.data.fileKey}`
//     })
//   }

//   if (file && flag==='goods_swiper') {
//     let fileType = ''
//     if (file.type.includes('image')) {
//       fileType = 'image'
//     } else if (file.type.includes('video')) {
//       fileType = 'video'
//     } else {
//       alert('未知文件类型')
//       return;
//     }

//     // 检查文件大小是否超过限制，例如限制为 10MB
//     // const maxSize = 10 * 1024 * 1024;  // 10MB
//     // if (file.size > maxSize) {
//     //   alert('File size exceeds 10MB limit');
//     //   return;
//     // }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('flag', `${flag}-${$route.query.id}`);

//     _uploadFile(formData).then(res => {
//       swiperList.value.push({
//         type: fileType,
//         url: `${import.meta.env.VITE_BASE_URL}/${res.data.fileKey}`
//       })
//     })
//   }
// }

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
const goods_richText = ref('<p>暂无更多介绍</p>')
const richTextEditorToolbarConfig = reactive({
  readOnly: Boolean(form.batch_no)
})
const richTextEditorConfig = { 
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 配置上传图片的服务器地址
      // server: 'http://localhost:8800/api/upload',

      // 上传图片时的自定义参数，例如 token
      // fieldName: 'file',
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg'], // 允许上传的文件类型

      async customUpload(file, insertFn) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('flag', `goods_richText-${$route.query.id}`);
        _uploadFile(formData).then(res => {
          insertFn(`${import.meta.env.VITE_BASE_URL}/${res.data.fileKey}`)
        })

        // uploadToCOS(file, 'goods/goods_richText/', `goodsId-${$route.query.id}`).then(res => {
        //   insertFn(res)
        // })
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
    goodsId: form.goods_id
  }).then(res => {
    PlainMessage.success(res.message)

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
    PlainMessage.success('请输入最终定价')
    return;
  }

  _preorderBatchIsReadyToSell({ goodsId: form.goods_id, finalPrice: preorderFinalPrice.value }).then(res => {
    PlainMessage.success('操作成功')

    isShowPreorderBatchIsReadyToSellDialog.value = false

    getGoodsDetailById()
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
    PlainMessage.success('请输入取消原因')
    return;
  }
  _cancelAllOrdersInCurrentBatch({
    id: form.goods_id,
    cancelReason: cancelAllOrdersReason.value
  }).then(res => {
    PlainMessage.success('操作成功')
    isShowCancelAllOrdersDialog.value = false
    getGoodsDetailById()
  })
}
function deleteCurrentBatch() { // 删除当前批次
  _deleteCurrentBatch({id: $route.query.id}).then(res => {
    PlainMessage.success('操作成功')

    getGoodsDetailById()
    richTextEditorRef.value.enable()
    isStartingNewCurrentBatch.value = false
  })
}

let discountsPromotion = ref([])
function deleteDiscountItem(index) {
  discountsPromotion.value.splice(index, 1)
}
function addDiscountItem() {
  discountsPromotion.value.push({quantity: null, discount: null})
}

let extraOptions = ref([])
function deleteExtraOptionItem(index) {
  extraOptions.value.splice(index, 1)
}
function addExtraOptionItem() {
  extraOptions.value.push({content: null, amount: null})
}

// 邮费 postage
let postageRules = ref([])
let unusableButChoosedProvince = ref([])
function getUsableProvince() {
  postageRules.value = []
  unusableButChoosedProvince.value = []
  _getAll({ level: 'province' }).then(res => {
    // 所有 -> 选中rules -> 去除不可用     顺序不能乱，不然选中的rules显示不全
    postageRules.value = res.data.map(item => {
      if (form.batch_ship_provinces) {
        let itemOfRules = form.batch_ship_provinces.find(el => el.code === item.code);
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
          baseQuantity: null,
          basePostage: null,
          extraQuantity: null,
          extraPostage: null,
          freeShippingQuantity: null,
        };
      }
      return null; // 显式返回 null 以避免 undefined
    }).filter(Boolean); // 过滤掉 null/undefined
  })
}
function getShipProvincesOfLastBatch() {
  _getShipProvincesOfLastBatch({ goodsId: $route.query.id }).then(res => {
    if (res.data) {
      console.log(res.data);
      postageRules.value = res.data.finalResult
      unusableButChoosedProvince = res.data.unusableButChoosedProvince
    } else {
      PlainMessage.success(res.message)
    }
  })
}

let canHomeDelivery = ref(false)


let isFormSubmiting = ref(false)
function toSubmit() {
  if ($route.query.flag==='edit' && !coverImageUrl.value) {
    PlainMessage.success('请上传封面图')
    return;
  }

  if (isStartingNewCurrentBatch.value || form.batch_no) {
    if (form.batch_type==='preorder' && form.batch_preorder_minPrice===form.batch_preorder_maxPrice) {
      PlainMessage.success('当前批次价格区间相同')
      return;
    }

    if (discountsPromotion?.length > 0) {
      const quantitySet = new Set();

      for (const item of discountsPromotion.value) {
        if (item.quantity===null || item.quantity===undefined) {
          PlainMessage.success('优惠策略 数量 未填写完整')
          return;
        }
        if (item.quantity < 0) {
          PlainMessage.success('优惠策略 优惠金额 须大于等于 0')
          return;
        }
        if (item.discount===null || item.discount===undefined) {
          PlainMessage.success('优惠策略 优惠金额 未填写完整')
          return;
        }
        if (item.discount <= 0) {
          PlainMessage.success('优惠策略 优惠金额 须大于 0')
          return;
        }

        if (quantitySet.has(item.quantity)) {
          PlainMessage.success(`优惠策略 数量 "${item.quantity}" 重复`)
          return;
        }

        quantitySet.add(item.quantity);
      }
    }

    if (extraOptions?.length > 0) { 
      const contentSet = new Set();

      for (const item of extraOptions.value) {
        if (item.content===null || item.content===undefined || item.content.trim()==='') {
          PlainMessage.success('额外选项 内容 未填写完整')
          return;
        }
        if (item.amount===null || item.amount===undefined) {
          PlainMessage.success('额外选项 金额 未填写完整')
          return;
        }
        if (item.amount < 0) {
          PlainMessage.success('额外选项 金额 须大于等于 0')
          return;
        }

        if (contentSet.has(item.content)) {
          PlainMessage.success(`额外选项 选项内容 "${item.content}" 重复`)
          return;
        }
    
        contentSet.add(item.content);
      }
    }

    if (form.batch_type==='stock' && form.batch_stock_totalQuantity===0) {
      PlainMessage.success('请填写总量')
      return;
    }

    let postageChoosedQuantity = 0
    for (const item of postageRules.value) {
      if (item.isChoosed) {
        if (item.freeShippingQuantity === 1) continue; // 1个就包邮

        if (item.baseQuantity > item.freeShippingQuantity) {
          PlainMessage.success('包邮数量须大于等于首重最大数量')
          return;
        }

        const validations = [
          { field: 'baseQuantity', content: '首重最大数量' },
          { field: 'basePostage', content: '首重邮费' },
          { field: 'extraQuantity', content: '每续重几件' },
          { field: 'extraPostage', content: '续重单位邮费' },
          { field: 'freeShippingQuantity', content: '包邮数量' }
        ];
        for (const { field, content } of validations) {
          const value = item[field];
          if (value===undefined || value===null) {
            PlainMessage.success(`${item.name} ${content} 未填写`)
            return;
          }
          if (value === 0) {
            PlainMessage.success(`${item.name} ${content} 不能为0`)
            return;
          }
        }
        postageChoosedQuantity += 1
      }
    }
    if (postageChoosedQuantity === 0) {
      PlainMessage.success(`请配置邮费`)
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
          goodsId: form.goods_id,
          goodsName: form.goods_name,
          goodsUnit: form.goods_unit,
          goodsCategoryId: form.goods_categoryId,
          goodsIsSelling: form.goods_isSelling ? 1 : 0,
          goodsRemark: form.goods_remark,
          goodsRichText: goods_richText.value,
        }

        if (coverImageUrl.value) {
          params.coverImageUrl = coverImageUrl.value
        }

        if (swiperList.value.length > 0) {
          params.swiperList = swiperList.value
        }

        if ($route.query.flag==='edit' && (form.batch_no || isStartingNewCurrentBatch.value)) {
          let batchParams = {
            batchNo: form.batch_no,
            batchType: form.batch_type,
            batchStartTime: form.batch_startTime,
            batchMinQuantity: form.batch_minQuantity,
            batchRemark: form.batch_remark,
            batchStockTotalQuantity: form.batch_stock_totalQuantity,
            batchDiscountsPromotion: discountsPromotion.value,
            batchExtraOptions: extraOptions.value,
            batchShipProvinces: postageRules.value.filter(item => item.isChoosed).map(({ isChoosed, ...rest }) => rest),
            batchShipCanHomeDelivery: canHomeDelivery.value ? 1 : 0,
          }
          if (form.batch_type === 'preorder') { // 预订
            batchParams.batchPreorderFinalPrice = form.batch_preorder_FinalPrice
            batchParams.batchPreorderMinPrice = form.batch_preorder_minPrice
            batchParams.batchPreorderMaxPrice = form.batch_preorder_maxPrice
          } else if (form.batch_type === 'stock') { // 现货
            batchParams.batchStockUnitPrice = form.batch_stock_unitPrice
          }

          params = {
            ...params,
            ...batchParams
          }
        }

        _createOrUpdateGoods(params).then(res => {
          PlainMessage.success(res.message)

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
  discountsPromotion.value = []
  extraOptions.value = []
  
  Object.assign(form, {
    goods_id: null,
    goods_name: null,
    goods_unit: null,
    goods_categoryId: null,
    goods_isSelling: false,
    goods_remark: null,
    
    batch_no: '',
    batch_type: null,
    batch_preorder_FinalPrice: null,
    batch_startTime: null,
    batch_minQuantity: 1.0,
    batch_preorder_minPrice: 0.01,
    batch_preorder_maxPrice: 0.01,
    batch_stock_unitPrice: 0.01,
    batch_ship_provinces: [],
    batch_remark: '',
    batch_stock_totalQuantity: 0,
  })
}
function getGoodsDetailById() { // 获取详情
  _getGoodsDetailById({ id: $route.query.id }).then(res => {
    resetForm()

    let currentBatch = {}
    if (res.data.batch_no) {
      currentBatch = {
        batch_no: res.data.batch_no,
        batch_type: res.data.batch_type,
        batch_startTime: dayjs(res.data.batch_startTime).format('YYYY-MM-DD HH:mm:ss'),
        batch_minQuantity: Number(res.data.batch_minQuantity),
        batch_preorder_minPrice: Number(res.data.batch_preorder_minPrice),
        batch_preorder_maxPrice: Number(res.data.batch_preorder_maxPrice),
        batchPreorderStartSellingTime: res.data.batch_preorder_startSelling_time && dayjs(res.data.batch_preorder_startSelling_time).format('YYYY-MM-DD HH:mm:ss'),
        batchPreorderStartSellingBy: res.data.batch_preorder_startSelling_by,
        batch_preorder_FinalPrice: res.data.batch_preorder_finalPrice,
        batch_stock_unitPrice: Number(res.data.batch_stock_unitPrice),
        batch_stock_totalQuantity: Number(res.data.batch_stock_totalQuantity),
        batchStockRemainingQuantity: Number(res.data.batch_stock_remainingQuantity),
        batch_ship_provinces: res.data.batch_ship_provinces,
        batch_ship_canHomeDelivery: res.data.canHomeDelivery===1 ? true : false,
        batch_remark: res.data.batch_remark,
      }

      discountsPromotion.value = res.data.batch_discounts_promotion

      extraOptions.value = res.data.batch_extraOptions || []

      getBatchOrdersStatistic({ id: $route.query.id }) // 获取当前批次总计
      if (res.data.batch_type) {
        getGoodsStockRemainingQuantityFromRedis({ id: $route.query.id })
      }

      // 其他的禁止编辑
      setTimeout(() => {
        richTextEditorRef.value.disable() // 禁用富文本编辑器

        fileSortableInstance.option("disabled", true);  // 禁用轮播图拖动排序
      }, 500)
    }

    Object.assign(form, {}) // 结束当前批次时清空
    Object.assign(form, {
      goods_id: res.data.id,
      goods_name: res.data.goods_name,
      goods_unit: res.data.goods_unit,
      goods_categoryId: res.data.goods_categoryId,
      goods_isSelling: res.data.goods_isSelling===1 ? true : false,
      goods_remark: res.data.goods_remark,
      ...currentBatch,
    })
    goods_richText.value = res.data.goods_richText
    coverImageUrl.value = res.data.goods_coverImage || null
    swiperList.value = res.data.swiperList.map(item => {
      return {
        url: item.url,
      }
    }) || []

    getUsableProvince()
  })
}

let categoryList = ref([])
function getCategoryList() {
  _getCategory().then(res => {
    categoryList.value = res.data
  })
}

let batchOrdersStatistic = ref({})
function getBatchOrdersStatistic(params) {
  _getBatchOrdersStatistic(params).then(res => {
    batchOrdersStatistic.value = res.data
  })
}

let stockRemainingQuantity = ref(0)
function getGoodsStockRemainingQuantityFromRedis(params) {
  _getGoodsStockRemainingQuantityFromRedis(params).then(res => {
    stockRemainingQuantity.value = res.data.remainingQuantity
  })
}

onMounted(() => {
  getCategoryList()

  if ($route.query.flag==='edit') {
    fileSortableInstance = new Sortable(fileSortableList.value, {
      onEnd: fileSortableEnd,
    });

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

function clickGoodsIsSelling() {
  if (!form.goods_isSelling && !form.batch_no) {
    PlainMessage.warning(`无当前批次`)
    return false;
  }
  if (form.batch_type==='stock' && form.batchStockRemainingQuantity<=0) {
    PlainMessage.warning(`剩余量为0，无法上架`)
    return false;
  }
  return true
}
function changeGoodsIsSelling(newValue) {
  _changeGoodsIsSelling({
    id: form.goods_id,
    value: newValue ? 1 : 0
  }).then(res => {
    PlainMessage.success(newValue ? '已上架' : '已下架')
  }).catch(error => {
    PlainMessage.error(`操作失败`)
    form.goods_isSelling = !newValue
  })
}
function seeOrdersByBatchNo() {
  const url = `${window.location.origin}${$router.resolve({
    path: '/orderList',
    query: {
      batchNo: form.batch_no,
    }
  }).href}`
  window.open(url, '_blank')
}
function seeHistoryBatches() {
  const url = `${window.location.origin}${$router.resolve({
    path: '/historyBatches',
    query: {
      goodsId: $route.query.id,
    }
  }).href}`
  window.open(url, '_blank')
}





function getProxiedUrl(originalUrl) {
  console.log('getProxiedUrl getProxiedUrl getProxiedUrl', originalUrl);
  if (originalUrl) {
    // 对原始URL编码后拼接到代理路由
    const encodedUrl = encodeURIComponent(originalUrl);
    // return `${this.$apiBaseURL}/api/cos-proxy?url=${encodedUrl}`;
    _handleCOSUrl({
      url: encodedUrl
    }).then(res => {
      console.log(res)
      return res.data.url
    })
  }
  
}


const getProxyUrl = (originalUrl) => {
  if (originalUrl) {
    // 提取COS路径部分
    const url = new URL(originalUrl)
    const path = url.pathname
    
    return `/cos-proxy${path}`
  }
}

</script>

<style lang="less" scoped>
.goodsDetail {
  padding-bottom: 60px;
  padding-right: 80px;
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
      position: relative;
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
        }
        .richText-wrapper {
          display: flex;
          align-items: flex-start;
          .richText-editor {
            width: 65%;
            border: 1px solid gray;
          }
          .richText-preview {
            margin-left: 100px;
            flex: 1;
            border: 1px solid gray;
            box-sizing: border-box;
            padding: 10px;
          }
          ::v-deep(.richText-preview img) {
            max-width: 100%;
            height: auto;
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
          .batchTotal-item-content-quantity {
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
    .canHomeDelivery {
      .canHomeDelivery-text {
        font-size: 14px;
      }
    }
  }
  .batch-total {

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
