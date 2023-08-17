<template>
  <div class="app-container">
    <resize-box>
      <div
        slot="left"
        v-loading="listLoading"
        v-resize
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(237, 244, 253, 0.8)"
        class="lucien-col col-left"
      >
        <div class="resize-bar" />
        <div class="resize-line" />
        <div class="grid-content list-container">
          <el-table
            ref="listTable"
            :data="list"
            style="width: 100%"
            height="100%"
            class="list-table"
            highlight-current-row
            row-key="demand_id"
            :show-header="showHeader"
            @selection-change="handleSelectionChange"
            @row-click="handleCurrentChange"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column>
              <template slot="header">
                <el-button
                  v-permission="[1]"
                  type="primary"
                  size="mini"
                  @click="handleResolveTask(true, true)"
                >通过</el-button>
                <el-button
                  v-permission="[1]"
                  type="primary"
                  size="mini"
                  @click="handleResolveTask(false, true)"
                >驳回</el-button>
                <el-button
                  v-if="$route.path === '/pending/xmzfzr/demand/review'"
                  v-permission="[2]"
                  type="primary"
                  size="mini"
                  @click="handleResolveTask(true, true)"
                >通过</el-button>
                <el-button
                  v-if="$route.path === '/pending/xmzfzr/demand/review'"
                  v-permission="[2]"
                  type="primary"
                  size="mini"
                  @click="handleResolveTask(false, true)"
                >驳回</el-button>
                <el-button
                  v-if="$route.path === '/pending/xmzfzr/demand/check'"
                  v-permission="[2]"
                  type="primary"
                  size="mini"
                  @click="handleResolve(true)"
                >
                  通过
                </el-button>
                <el-button
                  v-if="$route.path === '/pending/xmzfzr/demand/check'"
                  v-permission="[2]"
                  type="primary"
                  size="mini"
                  @click="handleResolve(false)"
                >
                  驳回
                </el-button>
                <el-button
                  v-permission="[0]"
                  type="primary"
                  size="mini"
                  waves
                  @click="handleToVerifyTask(true)"
                >
                  提交审核
                </el-button>
                <el-button
                  v-permission="[3]"
                  type="primary"
                  size="mini"
                  @click="handleGongGuanResolveTask(true)"
                >
                  驳回
                </el-button>
                <!-- <el-button
                  v-permission="[3]"
                  :loading="orderCreating"
                  size="mini"
                  type="primary"
                  @click="handleCreateOrder(true)"
                >
                  生成订单
                </el-button> -->
                <!-- <el-button
                  v-permission="[3]"
                  type="primary"
                  size="mini"
                  @click="handleFinish(true)"
                >
                  终止
                </el-button> -->
                <el-button
                  v-permission="[4]"
                  type="primary"
                  size="mini"
                  @click="handleResolveOrder(true, true)"
                >
                  通过
                </el-button>
                <el-button
                  v-permission="[4]"
                  type="primary"
                  size="mini"
                  @click="handleResolveOrder(false, true)"
                >
                  驳回
                </el-button>
              </template>
              <template slot-scope="scope">
                <div class="item-box" :class="{'box-red': filterStatus === 3 && scope.row.status === 3 && scope.row.refuse === 1}">
                  <span class="item-no">{{ scope.row.demand_id }}</span>
                  <span class="item-name">{{ scope.row.name }}</span>
                  <span v-if="scope.row.provider" class="item-supplier">{{
                    scope.row.provider.name
                  }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
        slot="right"
        v-loading="detailLoading"
        class="lucien-col col-right"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(237, 244, 253, 0.8)"
      >
        <div
          v-if="detailLoaded && detail.demand_id"
          class="grid-content detail-container"
        >
          <div class="info-content">
            <div class="title">
              <i class="el-icon-s-management" />
              <span>需求状态预览</span>
            </div>
            <el-divider />
            <div class="description">
              <el-descriptions
                class="margin-top"
                :column="4"
                :label-style="{
                  'font-weight': 'bold',
                  'align-items': 'center',
                }"
              >
                <el-descriptions-item label="需求名称">
                  <span>{{ detail.name }}</span>
                  <el-tag size="mini" style="margin-left: 10px">{{
                    detail.tag | tagText
                  }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="需求品类">{{
                  detail.category | categoryText
                }}</el-descriptions-item>
                <el-descriptions-item label="需求单号">{{
                  detail.demand_id
                }}</el-descriptions-item>
                <el-descriptions-item label="需求状态">{{
                  detail.status | statusText
                }}</el-descriptions-item>

                <el-descriptions-item
                  label="需求说明"
                  span="4"
                  :label-style="{
                    'margin-bottom': '20px',
                    'font-weight': 'bold',
                  }"
                >
                  <span v-line-break="detail.introduce" />
                </el-descriptions-item>

                <el-descriptions-item label="项目名称">{{
                  detail.project ? detail.project.project_name : ""
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="发起部门"
                >{{
                  detail.flow ? detail.flow.launch_dep.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="核算部门"
                >{{
                  detail.flow ? detail.flow.account_dep.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="经费使用"
                >
                  {{
                    [
                      detail.flow && detail.flow.budget_dep
                        ? detail.flow.budget_dep.employ_budget
                        : 0,
                      detail.flow && detail.flow.budget_dep
                        ? detail.flow.budget_dep.budget
                        : 0,
                    ] | percentage
                  }}（{{
                    detail.flow && detail.flow.budget_dep
                      ? detail.flow.budget_dep.employ_budget
                      : 0
                  }}/{{
                    detail.flow && detail.flow.budget_dep
                      ? detail.flow.budget_dep.budget
                      : 0,
                  }}）
                </el-descriptions-item>

                <el-descriptions-item label="需求创建人">{{
                  detail.creator ? detail.creator.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{
                  detail.created_at
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="意向供应商"
                >{{
                  detail.intent_supplier ? detail.intent_supplier.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="分配理由"
                >{{ detail.supplier_reason || "" }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="备注说明"
                  span="4"
                >{{ detail.remark }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <el-table :data="[detail]" class="table-info" width="100%" border>
              <el-table-column
                label="需求单号"
                align="center"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.demand_id }}
                </template>
              </el-table-column>
              <el-table-column
                label="需求名称"
                min-width="200"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="150" align="center">
                <template slot-scope="scope">
                  <span :style="{ color: statusColor(scope.row.status) }">
                    {{ scope.row.status | statusText }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="需求品类"
                min-width="200"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.category | categoryText }}
                </template>
              </el-table-column>
              <el-table-column label="物件数量" align="center" width="80">
                <template slot-scope="scope">
                  <template v-if="scope.row.nums > 0">
                    {{ scope.row.nums }}
                  </template>
                  <template v-else> -- </template>
                </template>
              </el-table-column>
              <el-table-column label="工作总量" align="center" width="80">
                <template slot-scope="scope">
                  <template v-if="scope.row.work_num > 0">
                    {{ scope.row.work_num }}
                  </template>
                  <template v-else> -- </template>
                </template>
              </el-table-column>
              <el-table-column label="总金额" align="center" width="80">
                <template slot-scope="scope">
                  <template v-if="scope.row.work_amount > 0">
                    {{ scope.row.work_amount }}
                  </template>
                  <template v-else> -- </template>
                </template>
              </el-table-column>
              <el-table-column label="停留时间" align="center" width="100">
                <template slot-scope="scope">
                  {{ scope.row.stay_time }}
                </template>
              </el-table-column>
              <el-table-column
                label="当前处理人"
                min-width="150"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.current_operator }}
                </template>
              </el-table-column>
            </el-table>
            <div class="actions">
              <el-button
                v-if="detail.status === 1"
                v-permission="[2]"
                type="primary"
                size="mini"
                @click="detailHandleResolve(true)"
              >
                通过
              </el-button>
              <el-button
                v-if="detail.status === 5"
                v-permission="[1, 2]"
                icon="el-icon-check"
                type="primary"
                size="mini"
                plain
                @click="handleResolveTask(true, false)"
              >通过</el-button>
              <el-button
                v-if="detail.status === 1"
                v-permission="[2]"
                type="primary"
                size="mini"
                style="margin-right: 80px"
                @click="detailHandleResolve(false)"
              >
                驳回
              </el-button>
              <el-button
                v-if="detail.status === 5"
                v-permission="[1, 2]"
                icon="el-icon-jinzhi"
                type="primary"
                size="mini"
                plain
                style="margin-right: 80px"
                @click="handleResolveTask(false, false)"
              >驳回</el-button>
              <el-button
                v-permission="[1, 3]"
                type="primary"
                icon="el-icon-document-copy"
                size="mini"
                plain
                :loading="detail.copyLoading"
                @click.stop="handleCopy()"
              >复制</el-button>
              <el-button
                v-if="
                  detail.is_creator === 1 && [0, 2].indexOf(detail.status) >= 0
                "
                type="primary"
                icon="el-icon-edit"
                size="mini"
                plain
                :loading="detail.editLoading"
                @click.stop="handleUpdate()"
              >编辑</el-button>
              <el-button
                v-if="
                  detail.is_creator === 1 &&
                    [0, 1, 2].indexOf(detail.status) >= 0
                "
                icon="el-icon-delete"
                size="mini"
                type="danger"
                :loading="detail.deleteLoading"
                plain
                @click.stop="handleDelete()"
              >
                删除
              </el-button>
              <el-button
                v-if="
                  detail.is_creator === 1 && [0, 2].indexOf(detail.status) >= 0
                "
                type="primary"
                icon="el-icon-circle-check"
                size="mini"
                plain
                :loading="detail.verifyLoading"
                @click.stop="handleToVerify()"
              >提交</el-button>
              <el-button
                v-if="detail.status === 3"
                v-permission="[3]"
                type="primary"
                icon="el-icon-fenpei"
                size="mini"
                plain
                :loading="detail.assignLoading"
                @click.stop="handleProvider()"
              >
                分配供应商
              </el-button>
              <el-button
                v-if="detail.status === 5"
                v-permission="[1]"
                icon="el-icon-download"
                type="primary"
                size="mini"
                plain
                :loading="detail.taskDownloading"
                @click="handleDownloadTask()"
              >下载明细</el-button>
              <el-button
                v-if="[7, 9].indexOf(detail.status) >= 0"
                v-permission="[3]"
                icon="el-icon-download"
                type="primary"
                size="mini"
                plain
                :loading="detail.taskDownloading"
                @click="handleDownloadTask()"
              >下载明细</el-button>
              <el-button
                v-if="detail.can_add_task === 1"
                icon="el-icon-document-add"
                type="primary"
                size="mini"
                plain
                :loading="addTaskLoading"
                @click.stop="handleCreateTask()"
              >
                新增物件
              </el-button>
              <el-button
                v-if="detail.can_add_task === 1"
                icon="el-icon-download"
                type="primary"
                size="mini"
                plain
                @click.stop="handleImportTask()"
              >
                导入物件
              </el-button>
              <el-button
                v-if="[0, 1, 2].indexOf(detail.status) < 0"
                v-permission="[3]"
                icon="el-icon-remove"
                type="primary"
                size="mini"
                plain
                :loading="detail.finishLoading"
                @click="handleFinishDemand()"
              >
                终止
              </el-button>
              <!-- <el-button type="primary" icon="el-icon-jinzhi" size="mini" plain>
                驳回
              </el-button> -->
              <el-upload
                v-if="[4, 6].indexOf(detail.status) >= 0"
                v-permission="[0]"
                class="upload-box"
                :action="`${$baseUrl}/api/tools/upfile`"
                :file-list="detail.supplier_files"
                :show-file-list="false"
                multiple
                :on-success="
                  (response, file, fileList) =>
                    handleUploadWorkSuccess(response, file, fileList)
                "
                :on-error="handleUploadWorkError"
              >
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-paperclip"
                  style="margin: 0 10px"
                  plain
                >上传附件</el-button>
              </el-upload>
              <el-button
                v-if="[4, 6].indexOf(detail.status) >= 0"
                v-permission="[0]"
                icon="el-icon-remove"
                type="primary"
                size="mini"
                plain
                :loading="detail.finishLoading"
                @click="handleRefuseDemand()"
              >
                拒绝
              </el-button>
              <el-button
                v-if="[7, 9].indexOf(detail.status) >= 0"
                v-permission="[3]"
                icon="el-icon-jinzhi"
                type="primary"
                size="mini"
                plain
                @click="handleGongGuanResolveTask(false)"
              >
                驳回
              </el-button>
              <el-button
                v-if="[7, 9].indexOf(detail.status) >= 0"
                v-permission="[3]"
                :loading="orderCreating"
                icon="el-icon-box"
                size="mini"
                type="primary"
                plain
                @click="handleCreateOrder(false)"
              >
                生成订单
              </el-button>
              <!-- <el-button
                v-if="[7, 9].indexOf(detail.status) >= 0"
                v-permission="[3]"
                icon="el-icon-remove"
                type="primary"
                size="mini"
                plain
                @click="handleFinish(false)"
              >
                终止
              </el-button> -->
              <el-button
                v-if="detail.status === 8"
                v-permission="[4]"
                icon="el-icon-check"
                type="primary"
                size="mini"
                plain
                @click="handleResolveOrder(true, false)"
              >
                通过
              </el-button>
              <el-button
                v-if="detail.status === 8"
                v-permission="[4]"
                type="primary"
                icon="el-icon-jinzhi"
                size="mini"
                plain
                @click="handleResolveOrder(false, false)"
              >
                驳回
              </el-button>
              <el-button
                v-if="[9].indexOf(detail.status) >= 0"
                v-permission="[3]"
                type="danger"
                icon="el-icon-warning-outline"
                size="mini"
                plain
                @click.stop="handleRejectReason()"
              >
                驳回原因
              </el-button>
              <el-button
                v-if="[6].indexOf(detail.status) >= 0"
                v-permission="[0]"
                type="danger"
                icon="el-icon-warning-outline"
                size="mini"
                plain
                @click.stop="handleRejectReason()"
              >
                驳回原因
              </el-button>
              <el-button
                v-if="
                  detail.is_creator === 1 && [2].indexOf(detail.status) >= 0
                "
                type="danger"
                icon="el-icon-warning-outline"
                size="mini"
                plain
                @click.stop="handleRejectReason()"
              >
                驳回原因
              </el-button>
            </div>
          </div>
          <el-divider />
          <div
            v-if="
              (detail.tasks && detail.tasks.length > 0) || detail.status >= 4
            "
            class="task-content"
          >
            <div class="title">
              <i class="el-icon-s-management" />
              <span>物件明细</span>
            </div>
            <el-descriptions
              v-if="detail.supplier_info"
              class="supplier-box"
              :column="4"
              :label-style="{
                'font-weight': 'bold',
                'align-items': 'center',
              }"
            >
              <el-descriptions-item label="供应商">{{
                detail.supplier_info ? detail.supplier_info.name : ""
              }}</el-descriptions-item>
            </el-descriptions>
            <el-table
              :data="detail.tasks"
              class="task-table"
              width="100%"
              border
              row-key="task_id"
              @selection-change="handleTaskSelectionChange"
            >
              <el-table-column
                v-if="showTaskCheckRow"
                type="selection"
                width="50"
              />
              <el-table-column
                prop="task_id"
                label="物件单号"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <task-detail :task-id="scope.row.task_id" />
                </template>
              </el-table-column>
              <el-table-column prop="task_image" label="缩略图" align="center">
                <template slot-scope="scope">
                  <el-image
                    v-if="scope.row.task_image_url"
                    style="width: 50px; height: 50px"
                    :src="scope.row.task_image_url"
                  >
                    <div slot="error" class="image-slot">
                      <i
                        class="el-icon-picture-outline"
                        style="font-size: 50px"
                      />
                    </div>
                  </el-image>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="task_name"
                label="物件名称"
                align="center"
                width="205"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="deliver_date"
                label="交付日期"
                width="100"
                align="center"
              />
              <el-table-column prop="work_num" label="数量" align="center" />
              <el-table-column prop="work_unit" label="单位" align="center" />
              <el-table-column prop="work_price" label="单价" align="center" />
              <el-table-column label="总价" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.pay_amount > 0">
                    {{ scope.row.currency }} {{ scope.row.pay_amount }}
                  </span>
                  <span v-else>{{ scope.row.work_amount }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物件状态" align="center">
                <template slot-scope="scope">
                  <span
                    :style="{
                      color:
                        scope.row.task_status === 0 ? '#67C23A' : '#F56C6C',
                    }"
                  >
                    {{ scope.row.task_status | taskStatusText }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showTaskActionRow"
                label="操作"
                align="center"
                min-width="300"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <!-- <el-button
                    type="primary"
                    size="mini"
                    plain
                    :loading="scope.row.detailLoading"
                    @click="handleShowTask(scope.row, scope.$index, $index)"
                  >
                    详情
                  </el-button> -->
                  <el-button
                    v-permission="[0]"
                    icon="el-icon-edit"
                    type="primary"
                    size="mini"
                    plain
                    @click="handleUpdateTask(scope.row, scope.$index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-permission="[0]"
                    icon="el-icon-document-copy"
                    type="primary"
                    size="mini"
                    plain
                    @click="handleCopyTask(scope.row, scope.$index)"
                  >
                    复制
                  </el-button>
                  <!-- <el-button
                    v-if="scope.row.task_status === 1"
                    v-permission="[0]"
                    type="primary"
                    size="mini"
                    plain
                    @click="
                      handleStopTaskReason(scope.row, scope.$index, $index)
                    "
                  >
                    终止原因
                  </el-button> -->
                  <el-popconfirm
                    v-permission="[0]"
                    style="margin-left: 10px"
                    title="确定删除吗？"
                    @confirm="handleDeleteTask(scope.row, scope.$index, $index)"
                  >
                    <el-button
                      slot="reference"
                      icon="el-icon-delete"
                      size="mini"
                      type="primary"
                      plain
                    >
                      删除
                    </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="detail.status === 5" v-permission="[1]" class="tongji">
              <div class="tongji-item">
                <div class="label">总价：</div>
                <div class="value">{{ tongji.totalAmount }}</div>
              </div>
              <div class="tongji-item">
                <div class="label">最晚交付日期：</div>
                <div class="value">{{ tongji.deliverDate }}</div>
              </div>
            </div>
            <div class="actions">
              <!-- <el-button
                type="primary"
                icon="el-icon-document-copy"
                size="mini"
                plain
              >复制</el-button>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                plain
              >编辑</el-button>
              <el-button
                type="primary"
                icon="el-icon-delete"
                size="mini"
                plain
              >删除</el-button>
              <el-button
                type="primary"
                icon="el-icon-circle-check"
                size="mini"
                plain
              >提交</el-button>
              <el-button type="primary" icon="el-icon-box" size="mini" plain>
                生成订单
              </el-button> -->
              <el-button
                v-if="[4, 6].indexOf(detail.status) >= 0"
                v-permission="[0]"
                icon="el-icon-circle-check"
                type="primary"
                size="mini"
                plain
                @click="handleToVerifyTask(false)"
              >
                提交审核
              </el-button>
              <!-- <el-button
                type="primary"
                icon="el-icon-zhihuan"
                size="mini"
                plain
              >
                申请用印
              </el-button>
              <el-button type="primary" icon="el-icon-search" size="mini" plain>
                查看发票
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-document"
                size="mini"
                plain
              >
                上传结算单
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-document"
                size="mini"
                plain
              >
                申请结算
              </el-button>
              <el-button type="primary" icon="el-icon-remove" size="mini" plain>
                终止
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-editor2b"
                size="mini"
                plain
              >
                申请变更
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-xiangmujiaofuziliucheng__xianxing__-01-01"
                size="mini"
                plain
              >
                交付验收
              </el-button> -->
            </div>
          </div>
          <div
            v-if="detail.files.length > 0 || detail.supplier_files.length"
            class="download-content"
          >
            <div class="title">
              <i class="el-icon-s-management" />
              <span>下载附件</span>
            </div>
            <div class="files">
              <div
                v-for="(file, _fileIndex) in detail.files"
                :key="file.file_id"
                class="file-item"
              >
                <div class="file-name">{{ file.name }}</div>
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="downLoadContract(file.name, file.url)"
                >下载</el-button>
              </div>
              <div
                v-for="(file, _fileIndex) in detail.supplier_files"
                :key="file.file_id"
                class="file-item"
              >
                <div class="file-name">{{ file.name }}</div>
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="downLoadContract(file.name, file.url)"
                >下载</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </resize-box>

    <!--新增修改-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        class="dialog-form"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin: 0 50px"
      >
        <el-form-item label="需求用途:" prop="process_id">
          <el-select
            v-model="temp.process_id"
            style="width: 260px"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchProcessList"
            :loading="processLoading"
            class="dialog-form-item"
            @focus="fetchProcessList('')"
            @change="demandProcessChange"
          >
            <el-option
              v-for="item in process"
              :key="item.process_id"
              :label="item.flow_name"
              :value="item.process_id"
            />
          </el-select>
        </el-form-item>

        <div
          v-if="temp.process_id > 0 && selectedProcess"
          class="process-info-box"
          style="margin: 0 0 10px 47px"
        >
          <el-descriptions
            :column="2"
            title=""
            :label-style="{
              'font-weight': 'bold',
              'align-items': 'center',
              width: '138px',
            }"
          >
            <el-descriptions-item label="流程代码">{{
              selectedProcess.bn
            }}</el-descriptions-item>
            <el-descriptions-item
              v-if="selectedProcess.budget_dep.budget > 0"
              label="部门经费"
              :content-style="{ 'align-items': 'center' }"
            >
              <div class="text-box" style="flex: none">
                {{ selectedProcess.budget_dep.employ_budget }}/{{
                  selectedProcess.budget_dep.budget
                }}
              </div>
              <div
                class="process-box"
                style="
                  flex: auto;
                  margin-left: 10px;
                  padding: 2px;
                  box-sizing: border-box;
                  border-radius: 100px;
                  background-color: #ebeef5;
                  overflow: hidden;
                  position: relative;
                  vertical-align: middle;
                "
              >
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    Math.round(
                      (selectedProcess.budget_dep.employ_budget /
                        selectedProcess.budget_dep.budget) *
                        100
                    )
                  "
                  :status="
                    selectedProcess.budget_dep.employ_budget >
                      selectedProcess.budget_dep.budget_warn
                      ? 'warning'
                      : 'success'
                  "
                />
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="发起部门">{{
              selectedProcess.launch_dep.name
            }}</el-descriptions-item>
            <el-descriptions-item label="核算部门">{{
              selectedProcess.account_dep.name
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <el-form-item label="需求名称:" prop="name">
          <el-input
            v-model="temp.name"
            placeholder="输入需求名称，30字符以内"
          />
        </el-form-item>

        <el-form-item label="需求标记:" prop="tag">
          <el-radio-group v-model="temp.tag">
            <el-radio
              v-for="(tag, tagIndex) in tagOptions"
              :key="tagIndex"
              :label="tag.id"
            >{{ tag.name }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="需求说明:" prop="introduce">
          <el-input
            v-model="temp.introduce"
            type="textarea"
            placeholder="请输入说明"
          />
        </el-form-item>

        <el-form-item v-permission="[3]" label="审核人:" prop="verify_id">
          <el-select
            v-model="temp.verify_id"
            clearable
            class="dialog-form-item"
          >
            <el-option
              v-for="item in demandVerifyMembers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="需求品类:" prop="cat_id">
          <el-cascader
            ref="categoryCascader"
            v-model="temp.cat_id"
            :options="categorys"
            :props="{ emitPath: false }"
            collapse-tags
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="需求附件" prop="file">
          <el-upload
            class="upload-demo"
            :action="`${$baseUrl}/api/tools/upfile`"
            :on-success="handleAddDemandFileSucc"
            :on-remove="handleDemandFileChange"
            :file-list="demandFileList"
          >
            <el-button size="mini" type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item
          label="意向供应商:"
          prop="supplier"
          class="custom-unrequired"
        >
          <div class="has-secret-notice">
            <el-select
              v-model="temp.supplier"
              filterable
              clearable
              placeholder="非必填"
              class="dialog-form-item"
              @change="intentProviderChange"
            >
              <el-option
                v-for="item in providers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <div class="secret-notice">仅内部可见</div>
          </div>
        </el-form-item>

        <el-form-item
          v-show="temp.supplier !== ''"
          label="选择理由:"
          prop="supplier_reason"
          class="custom-unrequired"
        >
          <div class="has-secret-notice">
            <el-select
              v-model="temp.supplier_reason"
              clearable
              placeholder="请选择理由"
              class="dialog-form-item"
            >
              <el-option
                v-for="item in intentProviderReasons"
                :key="item.id"
                :label="item.content"
                :value="item.content"
              />
            </el-select>
            <div class="secret-notice">仅内部可见</div>
          </div>
        </el-form-item>

        <el-form-item label="备注说明:" prop="remark" class="custom-unrequired">
          <div class="has-secret-notice">
            <el-input
              v-model="temp.remark"
              type="textarea"
              placeholder="非必填"
              class="dialog-form-item"
            />
            <div class="secret-notice">仅内部可见</div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="dialogStatus === 'create' || dialogStatus === 'copy'">
          <el-button size="mini" @click="createData(0)"> 保存为模板 </el-button>
          <el-button type="primary" size="mini" @click="createData(1)">
            提报需求
          </el-button>
        </template>
        <template v-if="dialogStatus === 'update'">
          <el-button
            size="mini"
            type="primary"
            @click="createData(temp.status)"
          >
            确认
          </el-button>
        </template>
      </div>
    </el-dialog>

    <!--审批驳回-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="verifyVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="verifyDataForm"
        class="dialog-form"
        :model="tempVerify"
        :rules="verifyRules"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <div v-if="dialogStatus === 'resolve'" class="resolve-notice">
          是否确认审核通过？
        </div>
        <el-form-item
          v-else-if="dialogStatus === 'reject'"
          label="驳回原因:"
          prop="reason"
        >
          <el-input
            v-model="tempVerify.reason"
            type="textarea"
            placeholder="请输入驳回原因"
            class="dialog-form-item"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="
            dialogVerifyVisible = false;
            dialogVerifyTaskVisible = false;
            dialogRejectTaskVisible = false;
            dialogVerifyOrderVisible = false;
          "
        >
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmVerify">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--分配供应商-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogProviderVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="providerDataForm"
        class="dialog-form"
        :rules="providerRules"
        :model="tempProvider"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="供应商:" prop="supplier_id">
          <el-select
            v-model="tempProvider.supplier_id"
            style="width: 300px"
            filterable
            clearable
            placeholder="请输入关键词"
            class="dialog-form-item"
          >
            <el-option
              v-for="item in providers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上传附件" prop="supplier_file">
          <el-upload
            class="upload-demo"
            :action="`${$baseUrl}/api/tools/upfile`"
            :on-success="handleAddDemandSupplierFileSucc"
            :on-remove="handleDemandSupplierFileChange"
            :file-list="demandSupplierFileList"
          >
            <el-button size="mini" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="选择供应商理由:" prop="supplier_reason">
          <el-select
            v-model="tempProvider.supplier_reason"
            style="width: 300px"
            clearable
            placeholder="请选择理由"
            class="dialog-form-item"
          >
            <el-option
              v-for="item in providerReasons"
              :key="item.id"
              :label="item.content"
              :value="item.content"
            />
          </el-select>
        </el-form-item>
        <div class="notice" style="color: red">
          备注：仅可选择配置了有效合同的供应商
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogProviderVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmProvider">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--生成订单-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogCreateOrderVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createOrderDataForm"
        class="dialog-form"
        :rules="createOrderRules"
        :model="tempCreateOrder"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="供应商合同:" prop="pact_id">
          <el-select
            v-model="tempCreateOrder.pact_id"
            style="width: 400px"
            filterable
            clearable
            placeholder="请输入合同名称"
            class="dialog-form-item"
            popper-class="pact-select"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in pacts"
              :key="item.id"
              :label="item.pact_name"
              :value="item.id"
            >
              <div class="pact-box">
                <div class="name">{{ item.pact_name }}</div>
                <div class="time">
                  {{ item.period_start | dateFormat }} -
                  {{ item.period_end | dateFormat }}
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogCreateOrderVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmCreateOrder">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--新增物件-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogTaskVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="taskDataForm"
        class="dialog-form"
        :rules="taskRules"
        :model="tempTask"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-row :gutter="100">
          <el-col :span="16">
            <el-form-item>
              <div slot="label" class="form-title">基础信息</div>
            </el-form-item>
            <el-form-item label="物件名称:" prop="task_name">
              <el-input
                v-model="tempTask.task_name"
                class="dialog-form-item"
                placeholder="请输入物件名称"
              />
            </el-form-item>

            <el-form-item label="物件类别:">
              <span>{{ tempTaskCategory | categoryText }}</span>
            </el-form-item>

            <el-form-item label="单位:" prop="work_unit">
              <el-select
                v-model="tempTask.work_unit"
                class="dialog-form-item"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, itemIndex) in [
                    '人天',
                    '套',
                    '件',
                    '小时',
                    '分钟',
                    '秒 ',
                    '字',
                    '百字',
                    '千字',
                  ]"
                  :key="itemIndex"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="单位数量:" prop="work_num">
              <el-input
                v-model="tempTask.work_num"
                placeholder="请输入单位数量"
                class="dialog-form-item"
              />
            </el-form-item>

            <el-form-item label="单价:" prop="price">
              <el-input
                v-model="tempTask.price"
                :placeholder="`请输入单价${
                  supplierCategoryPrice > 0
                    ? '，不能超过' + supplierCategoryPrice
                    : ''
                }`"
                class="dialog-form-item"
              />
            </el-form-item>

            <el-form-item label="支付货币:" prop="currency">
              <el-select
                v-model="tempTask.currency"
                class="dialog-form-item"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, itemIndex) in [
                    '人民币',
                    '美元',
                    '英镑',
                    '澳元',
                    '日元',
                    '欧元 ',
                    '加元',
                    '新元',
                    '纽元',
                    '瑞郎',
                  ]"
                  :key="itemIndex"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="tempTask.currency !== '人民币'"
              label="实际支付外币金额:"
              prop="pay_amount"
            >
              <el-input
                v-model="tempTask.pay_amount"
                placeholder="请输入实际支付外币金额"
                class="dialog-form-item"
              />
            </el-form-item>

            <el-form-item label="完成日期:" prop="deliver_date">
              <el-date-picker
                v-model="tempTask.deliver_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                class="dialog-form-item"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="备注信息:" prop="remark">
              <el-input
                v-model="tempTask.remark"
                type="textarea"
                placeholder="请输入说明"
                class="dialog-form-item"
              />
            </el-form-item>
            <el-form-item>
              <div slot="label" class="form-title">属性</div>
            </el-form-item>
            <el-form-item
              v-for="(property, propIndex) in tempTask.extend"
              :key="propIndex"
              :label="property.name"
              :rules="
                property.type === 1
                  ? [
                    {
                      required: false,
                      message: `请选择${property.name}`,
                      trigger: 'change',
                    },
                  ]
                  : [
                    {
                      required: false,
                      message: `请输入${property.name}`,
                      trigger: 'blur',
                    },
                  ]
              "
              :prop="`extend.${propIndex}.value`"
            >
              <el-select
                v-if="property.type === 1"
                v-model="property.value"
                class="dialog-form-item"
                style="width: 100%"
              >
                <el-option
                  v-for="(option, optionIndex) in property.options.split(',')"
                  :key="optionIndex"
                  :label="option"
                  :value="option"
                />
              </el-select>
              <el-input
                v-else
                v-model="property.value"
                :placeholder="`请输入${property.name}`"
                class="dialog-form-item"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <template v-if="tempTaskCategory.thumbnail === 1">
              <el-form-item>
                <div slot="label" class="form-title is-required">缩略图</div>
              </el-form-item>
              <el-form-item prop="task_image" label-width="0">
                <el-upload
                  class="task-image-uploader"
                  :action="`${$baseUrl}/api/tools/upfile`"
                  :show-file-list="false"
                  :on-success="handleTaskImageSuccess"
                  :on-change="handleTaskImageChange"
                >
                  <img
                    v-if="tempTask.task_image_url"
                    :src="tempTask.task_image_url"
                    class="task-image"
                  >
                  <i v-else class="el-icon-plus task-image-uploader-icon" />
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png/jpeg文件，且不超过2M
                  </div>
                </el-upload>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogTaskVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="
            dialogStatus === 'create_task' ? createTaskData() : updateTaskData()
          "
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--导入物件-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogImportTaskVisible"
      width="600px"
    >
      <el-form
        ref="importTaskDataForm"
        class="dialog-form"
        :rules="importTaskRules"
        :model="tempImportTask"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="物件模板">
          <el-button size="mini" @click="downloadTaskTpl">下载</el-button>
        </el-form-item>

        <el-form-item label="导入物件">
          <el-upload
            class="upload-demo"
            :action="`${$baseUrl}/api/needs/importTaskTpl`"
            :headers="{ Authorization: $store.getters.token }"
            :on-success="handleAddTaskTplSucc"
            :show-file-list="false"
          >
            <el-button size="mini" type="primary">导入</el-button>
            <span class="file-name" style="margin-left: 10px">{{
              tempImportTaskFileName
            }}</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogImportTaskVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmImportTask">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--终止-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFinishVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="finishDataForm"
        class="dialog-form"
        :rules="finishRules"
        :model="tempFinish"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="终止原因:" prop="reason">
          <el-input
            v-model="tempFinish.reason"
            type="textarea"
            placeholder="请输入终止原因"
            class="dialog-form-item"
          />
        </el-form-item>

        <el-form-item label="上传附件" prop="file">
          <el-upload
            class="upload-demo"
            :action="`${$baseUrl}/api/tools/upfile`"
            :on-success="handleAddStopFileSucc"
            :on-remove="handleStopFileChange"
            :file-list="stopFileList"
          >
            <el-button size="mini" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFinishVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmFinish">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--驳回原因-->
    <el-dialog
      title="驳回原因"
      :visible.sync="dialogRejectReasonVisible"
      width="600px"
    >
      <div v-if="detail.reject" class="reason-box">
        <div class="content">{{ detail.reject.reason || "" }}</div>
        <div class="user-info">
          <div>驳回人：{{ detail.reject.user }}</div>
          <div>驳回时间：{{ detail.reject.created_at }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createDemand,
  updateDemand,
  fetchDemandDetail,
  toVerifyDemand,
  deleteDemand,
  verifyDemand,
  assignSupplier,
  rejectDemand,
  toVerifyTask,
  createOrder,
  verifyOrder,
  exportTaskTpl,
  batchAddTasks,
  uploadDemandPaperclip,
  toFinishDemand,
  toRefuseDemand,
  exportTask
} from '@/api/demand/index'
import {
  createTask,
  updateTask,
  fetchTaskDetail,
  verifyTask,
  finishTask,
  deleteTask
} from '@/api/demand/task'
import {
  fetchAllProcess,
  fetchProcessCategory,
  fetchProcessVerifyMember
} from '@/api/project/process'
import { fetchReasonList, fetchIntentReasonList } from '@/api/system/reason'
import { fetchAllPact } from '@/api/provider/contract'
import permission from '@/directive/permission/index.js' // 权限判断指令
import TaskDetail from '@/components/TaskDetail'
import ResizeBox from '@/components/ResizeBox'
import { downloadFile } from '@/api/system/file'
import { baseName, downloadFileStream } from '@/utils/index'
import { fetchAllProvider, queryCategoryPrice } from '@/api/provider/index'
import waves from '@/directive/waves'
const tagList = [
  { id: 0, name: '正式包' },
  { id: 1, name: '测试包' },
  { id: 2, name: '外派' },
  { id: 3, name: '动态团队' }
]
export default {
  name: 'Demand',
  components: { TaskDetail, ResizeBox },
  directives: { permission, waves },
  filters: {
    categoryText(category) {
      if (!category) {
        return '-'
      }
      if (typeof category === 'string') {
        return category
      }
      let name = category.category_name
      if (category.parent) {
        name = `${category.parent.category_name}/${name}`
        if (category.parent.parent) {
          name = `${category.parent.parent.category_name}/${name}`
        }
      }
      return name
    },
    tagText(tag) {
      let text = tag
      tagList.some((tagItem) => {
        if (tagItem.id === parseInt(tag)) {
          text = tagItem.name
          return true
        }
        return false
      })
      return text
    },
    statusText(status) {
      const statusMap = {
        0: '待提报',
        1: '审核中',
        2: '审核未通过',
        3: '待分配供应商',
        4: '待填写物件',
        5: '物件审核中',
        6: '物件审核未通过',
        7: '待生成订单',
        8: '订单待审核',
        9: '订单审核未通过',
        10: '已生成订单'
      }
      return statusMap[status]
    },
    taskStatusText(status) {
      const statusMap = {
        0: '正常',
        1: '终止'
      }
      return statusMap[status]
    },
    dateFormat(time) {
      const data = time.split(' ')
      return data[0] || time
    }
  },
  data() {
    const validateReason = (rule, value, callback) => {
      if (this.temp.supplier !== '' && !value) {
        callback(new Error('请选择理由'))
      } else {
        callback()
      }
    }
    return {
      listQuery: {
        page: 1,
        page_num: 9999999,
        keyword: '',
        status: undefined
      },
      listLoading: false,
      list: [],
      total: 0,
      multipleSelection: [],
      dialogStatus: '',
      dialogFormVisible: false,
      intentProviderReasons: [],
      temp: {
        id: undefined,
        process_id: '',
        name: '',
        tag: 0,
        introduce: '',
        verify_id: '',
        cat_id: '',
        file: '',
        supplier: '',
        supplier_reason: '',
        remark: '',
        status: 0
      },
      selectedProcess: undefined,
      tagOptions: tagList,
      textMap: {
        update: '修改需求',
        copy: '复制需求',
        create: '新增需求',
        resolve: '审批',
        reject: '驳回',
        provider: '选择供应商',
        create_task: '填写物件',
        update_task: '修改物件',
        import_task: '导入物件',
        create_order: '生成订单'
      },
      rules: {
        process_id: [
          { required: true, message: '请选择需求用途', trigger: 'change' }
        ],
        tag: [{ required: true, message: '请选择需求标记', trigger: 'blur' }],
        name: [{ required: true, message: '请输入需求名称', trigger: 'blur' }],
        cat_id: [
          { required: true, message: '请选择需求品类', trigger: 'change' }
        ],
        supplier_reason: [{ validator: validateReason, trigger: 'change', required: false }]
      },
      posting: false,
      processLoading: false,
      process: [],
      members: [],
      demandVerifyMembers: [],
      providerReasons: [],
      providers: [],
      categorys: [],
      fileList: [],
      detail: {},
      detailIndex: 0,
      multipleTaskSelection: [],
      detailLoading: false,
      detailLoaded: false,
      dialogStatus: '',
      dialogVerifyVisible: false,
      confirmVerifyVisible: false,
      dialogVerifyTaskVisible: false,
      dialogVerifyOrderVisible: false,
      tempVerify: {
        reason: ''
      },
      verifyRules: {},
      verifyStatus: false,
      dialogRejectTaskVisible: false,
      dialogTaskVisible: false,
      addTaskLoading: false,
      supplierCategoryPrice: 0,
      tempTaskCategory: {
        category_id: '',
        category_name: '',
        property_json: '[]',
        property_array: []
      },
      tempTask: {
        demand_id: '',
        task_name: '',
        task_image: '',
        task_image_url: '',
        work_unit: '',
        work_num: '',
        price: '',
        currency: '人民币',
        pay_amount: '',
        deliver_date: '',
        remark: '',
        extend: []
      },
      taskRules: {
        task_name: [
          { required: true, message: '请输入物件名称', trigger: 'blur' }
        ],
        task_image: [
          { required: true, message: '请添加缩略图', trigger: 'blur' }
        ],
        work_unit: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        work_num: [
          {
            required: true,
            message: '请输入单位数量',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value > 0) {
                callback()
              } else {
                callback(new Error('单位数量必须大于零'))
              }
            },
            trigger: 'blur'
          }
        ],
        price: [
          { required: true, message: '请输入单价', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value > 0) {
                callback()
              } else {
                callback(new Error('单价必须大于零'))
              }
            },
            trigger: 'blur'
          }
        ],
        pay_amount: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback()
              } else {
                if (value > 0) {
                  callback()
                } else {
                  callback(new Error('请输入正确的金额'))
                }
              }
            },
            trigger: 'blur'
          }
        ],
        deliver_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        value: [{ required: true, message: '请设置属性值', trigger: 'blur' }]
      },
      dialogProviderVisible: false,
      providerRules: {
        supplier_id: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        supplier_reason: [
          { required: true, message: '请选择理由', trigger: 'change' }
        ]
      },
      tempProvider: {
        demand_id: '',
        supplier_id: '',
        supplier_file: '',
        supplier_reason: ''
      },
      demandFileList: [],
      demandSupplierFileList: [],
      dialogImageUrl: '',
      dialogImageVisible: false,
      dialogFinishVisible: false,
      finishRules: {
        reason: [
          { required: true, message: '请输入终止原因', trigger: 'blur' }
        ]
      },
      tempFinish: {
        task_id: [],
        reason: '',
        file: ''
      },
      stopFileList: [],
      dialogRejectReasonVisible: false,
      dialogImportTaskVisible: false,
      tempImportTask: {
        demand_id: '',
        tasks: []
      },
      importTaskRules: {},
      tempImportTaskFileName: '',
      pacts: [],
      dialogCreateOrderVisible: false,
      orderCreating: false,
      tempCreateOrder: {
        demand_id: [],
        pact_id: ''
      },
      createOrderRules: {
        pact_id: [
          { required: true, message: '请选择供应商合同', trigger: 'change' }
        ]
      },
      taskDownloading: false
    }
  },
  computed: {
    path: function() {
      return this.$route.path.replace('/pending/', '')
    },
    verifyVisible: {
      get() {
        return (
          (this.dialogVerifyVisible ||
            this.dialogVerifyTaskVisible ||
            this.dialogRejectTaskVisible ||
            this.dialogVerifyOrderVisible) &&
          this.dialogStatus === 'reject'
        )
      },
      set(newValue) {
        this.dialogVerifyVisible = newValue
        this.dialogVerifyTaskVisible = newValue
        this.dialogRejectTaskVisible = newValue
        this.dialogVerifyOrderVisible = newValue
      }
    },
    showHeader: function() {
      const hiddenPaths = [
        '/pending/gg/assign/vendor',
        '/pending/xmz/demand/draft',
        '/pending/gg/demand/draft'
      ]
      return hiddenPaths.indexOf(this.$route.path) < 0
    },
    showTaskCheckRow: function() {
      const hiddenTaskCheckRowPaths = [
        '/pending/gys/demand/quote',
        '/pending/xmz/demand/review',
        '/pending/xmzfzr/demand/review',
        // '/pending/gg/order/prepare',
        '/pending/ggfzr/order/approval'
      ]
      return hiddenTaskCheckRowPaths.indexOf(this.$route.path) < 0
    },
    showTaskActionRow: function() {
      const hiddenTaskActionRowPaths = [
        '/pending/xmz/demand/review',
        '/pending/xmzfzr/demand/review',
        '/pending/gg/order/prepare',
        '/pending/ggfzr/order/approval',
        '/pending/xmzfzr/demand/draft'
      ]
      return hiddenTaskActionRowPaths.indexOf(this.$route.path) < 0
    },
    filterStatus: function() {
      const statusMap = {
        '/pending/xmz/demand/draft': 0,
        '/pending/gg/demand/draft': 0,
        '/pending/xmzfzr/demand/check': 1,
        '/pending/gg/assign/vendor': 3,
        '/pending/gys/demand/quote': 4,
        '/pending/xmz/demand/review': 5,
        '/pending/xmzfzr/demand/review': 5,
        '/pending/gg/order/prepare': 7,
        '/pending/ggfzr/order/approval': 8
      }
      if (statusMap.hasOwnProperty(this.$route.path)) {
        return statusMap[this.$route.path]
      }
      return undefined
    },
    tongji: function() {
      const tasks = this.detail.tasks
      let totalAmount = 0
      let deliverDate = ''
      tasks.forEach((task) => {
        totalAmount += parseFloat(task.work_amount)
        if (
          deliverDate === '' ||
          (deliverDate && new Date(deliverDate) < new Date(task.deliver_date))
        ) {
          deliverDate = task.deliver_date
        }
      })
      return { totalAmount, deliverDate }
    }
  },
  created() {
    if (this.$route.query.hasOwnProperty('createDemand')) {
      this.handleCreate()
    }
    this.getList(true)
  },
  mounted() {
    this.$bus.$on('createDemandEvent', () => {
      this.handleCreate()
    })
    this.$bus.$on('navSearch', (listQuery) => {
      this.listQuery = Object.assign({}, this.listQuery, listQuery)
      this.getList(false)
    })
    // this.$nextTick(() => {
    //   const ro = new ResizeObserver((entries, observer) => {
    //     // console.log('Elements resized:', entries.length)
    //     entries.forEach((entry, index) => {
    //       const { inlineSize: width } =
    //         entry.contentBoxSize[0]
    //       this.$bus.$emit('leftListResize', width)
    //       // console.log(`Element ${index + 1}:`, `${width}x${height}`)
    //     })
    //   })
    //   const resizeableElement = this.$refs.resizeableElement
    //   ro.observe(resizeableElement)
    // })
  },
  beforeDestroy() {
    this.$bus.$off('createDemandEvent')
    this.$bus.$off('navSearch')
  },
  methods: {
    statusColor(status) {
      const statusMap = {
        0: '#606266;',
        1: '#606266',
        2: '#606266',
        3: '#606266',
        4: '#606266',
        5: '#606266',
        6: '#606266',
        7: '#606266',
        8: '#606266',
        9: '#606266',
        10: '#cccccc'
      }
      return statusMap[status]
    },
    /**
     * 获取需求列表
     */
    getList(loading = true) {
      if (loading) {
        this.listLoading = true
      }
      this.listQuery = Object.assign({}, this.listQuery, {
        status: this.filterStatus
      })
      fetchList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          const { total, list } = response.data
          this.total = total
          this.list = list
          this.$nextTick(() => {
            if (list.length > 0) {
              if (!list[this.detailIndex]) {
                this.detailIndex = 0
              }
              this.$refs.listTable.setCurrentRow(list[this.detailIndex])
              this.handleDetail()
            } else {
              this.detail = {}
            }
          })
        })
        .catch((_error) => {
          this.listLoading = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleTaskSelectionChange(val) {
      this.multipleTaskSelection = val
    },
    /**
     * 获取流程列表
     */
    fetchProcessList(query) {
      this.processLoading = true
      fetchAllProcess({ flow_name: query, create_needs_permission: 1 })
        .then((response) => {
          this.processLoading = false
          this.process = response.data.list
        })
        .catch((_error) => {})
    },
    /**
     * 获取
     */
    /**
     * 流程变化
     * @param {*} process
     */
    demandProcessChange(process) {
      if (!process) {
        this.categorys = []
        this.demandVerifyMembers = []
        return false
      }

      const processIndex = this.process.findIndex(
        (item) => item.process_id === process
      )
      if (processIndex >= 0) {
        this.selectedProcess = this.process[processIndex]
      }

      fetchProcessCategory({ process_id: process })
        .then((response) => {
          this.categorys = response.data.list.map((first) => {
            const seconds = first.children.map((second) => {
              const thirds = second.children.map((third) => {
                return {
                  label: third.category_name,
                  value: third.cat_id
                }
              })
              return {
                label: second.category_name,
                value: second.cat_id,
                children: thirds
              }
            })
            return {
              label: first.category_name,
              value: first.cat_id,
              children: seconds
            }
          })
        })
        .catch((_error) => {})

      fetchProcessVerifyMember({ process_id: process })
        .then((response) => {
          this.demandVerifyMembers = response.data.list
        })
        .catch((_error) => {})

      fetchAllProvider({ process_id: process, status: 1 })
        .then((response) => {
          this.providers = response.data.list
        })
        .catch((_error) => {})
    },
    /**
     * 文件上传成功回调
     * @param {*} response
     * @param {*} file
     * @param {*} fileList
     */
    handleAddDemandFileSucc(response, file, fileList) {
      this.handleDemandFileChange(file, fileList)
    },
    /**
     * 文件上传变化
     * @param {*} file
     * @param {*} fileList
     */
    handleDemandFileChange(file, fileList) {
      this.demandFileList = fileList
      const fileStr = fileList
        .map((fileItem) => {
          return fileItem.response.data.file_id
        })
        .join(',')
      const fileArr = fileList.map((fileItem) => {
        return {
          name: fileItem.name,
          url: fileItem.url,
          response: {
            data: {
              file_id: fileItem.response.data.file_id
            }
          }
        }
      })
      this.temp = Object.assign({}, this.temp, {
        file: fileStr,
        files: fileArr
      })
    },
    /**
     * 重置需求数据
     */
    resetTemp() {
      this.demandFileList = []
      this.temp = {
        id: undefined,
        process_id: '',
        name: '',
        tag: 0,
        introduce: '',
        verify_id: '',
        cat_id: '',
        file: '',
        supplier: '',
        supplier_reason: '',
        remark: '',
        status: 0
      }
    },
    /**
     * 增加需求弹窗
     */
    handleCreate() {
      this.resetTemp()
      if (this.$store.getters.roles.indexOf(3) >= 0) {
        this.rules = Object.assign({}, this.rules, {
          verify_id: [
            { required: true, message: '请选择审核人', trigger: 'change' }
          ]
        })
      } else {
        if (this.rules.verify_id) {
          delete this.rules.verify_id
        }
      }
      this.providers = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 增加需求
     */
    createData(status = 0) {
      if (this.posting) {
        return false
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = Object.assign({}, this.temp)
          const postTemp = Object.assign({}, this.temp)
          postTemp.status = status
          // temp.demand_id = parseInt(Math.random() * 100) + 1024
          temp.status = status
          this.posting = true
          createDemand(postTemp)
            .then(async(response) => {
              this.posting = false
              this.detailIndex = 0

              await this.$store.dispatch('user/getPending')
              this.getList(false)
              this.dialogFormVisible = false

              if (
                this.dialogStatus === 'create' ||
                this.dialogStatus === 'copy'
              ) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
              } else if (this.dialogStatus === 'update') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              }
            })
            .catch((error) => {
              console.log(error)
              this.posting = false
            })
        }
      })
    },
    /**
     * 修改需求弹窗
     */
    async handleUpdate() {
      this.detail = Object.assign({}, this.detail, { editLoading: true })
      try {
        const processData = await fetchAllProcess({
          create_needs_permission: 1
        })
        this.process = processData.data.list || []

        const categoryData = await fetchProcessCategory({
          process_id: this.detail.process_id
        })
        this.categorys = categoryData.data.list.map((first) => {
          const seconds = first.children.map((second) => {
            const thirds = second.children.map((third) => {
              return {
                label: third.category_name,
                value: third.cat_id
              }
            })
            return {
              label: second.category_name,
              value: second.cat_id,
              children: thirds
            }
          })
          return {
            label: first.category_name,
            value: first.cat_id,
            children: seconds
          }
        })

        const verifyMemberData = await fetchProcessVerifyMember({
          process_id: this.detail.process_id
        })
        this.demandVerifyMembers = verifyMemberData.data.list

        const providerData = await fetchAllProvider({
          process_id: this.detail.process_id,
          status: 1
        })
        this.providers = providerData.data.list
      } catch (error) {
        console.log(error)
        this.detail = Object.assign({}, this.detail, { editLoading: false })
        this.$message.error('修改失败')
      }
      this.detail = Object.assign({}, this.detail, { editLoading: false })
      this.temp = Object.assign({}, this.detail, {
        tag: parseInt(this.detail.tag),
        supplier: this.detail.supplier ? parseInt(this.detail.supplier.id) : ''
      })
      this.demandFileList = this.temp.files.map((file) => {
        return {
          name: file.name,
          url: file.url,
          response: {
            data: {
              file_id: file.file_id
            }
          }
        }
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 复制需求弹窗
     */
    async handleCopy() {
      this.detail = Object.assign({}, this.detail, { copyLoading: true })
      try {
        const processData = await fetchAllProcess({
          create_needs_permission: 1
        })
        this.process = processData.data.list || []

        const categoryData = await fetchProcessCategory({
          process_id: this.detail.process_id
        })
        this.categorys = categoryData.data.list.map((first) => {
          const seconds = first.children.map((second) => {
            const thirds = second.children.map((third) => {
              return {
                label: third.category_name,
                value: third.cat_id
              }
            })
            return {
              label: second.category_name,
              value: second.cat_id,
              children: thirds
            }
          })
          return {
            label: first.category_name,
            value: first.cat_id,
            children: seconds
          }
        })

        const verifyMemberData = await fetchProcessVerifyMember({
          process_id: this.detail.process_id
        })
        this.demandVerifyMembers = verifyMemberData.data.list

        const providerData = await fetchAllProvider({
          process_id: this.detail.process_id,
          status: 1
        })
        this.providers = providerData.data.list
      } catch (error) {
        this.detail = Object.assign({}, this.detail, { copyLoading: false })
        this.$message.error('复制失败')
      }
      this.detail = Object.assign({}, this.detail, { copyLoading: false })
      let supplier = ''
      if (this.detail.supplier) {
        const supplierIndex = this.providers.findIndex(
          (provider) => provider.id === this.detail.supplier.id
        )
        if (supplierIndex >= 0) {
          supplier = this.providers[supplierIndex].id
        }
      }

      this.temp = Object.assign(
        {},
        {
          project_id: this.process.length > 0 ? this.detail.project_id : '',
          process_id: this.process.length > 0 ? this.detail.process_id : '',
          name: this.detail.name || '',
          introduce: this.detail.introduce || '',
          cat_id: this.detail.cat_id || '',
          file: this.detail.file || '',
          files: this.detail.files || [],
          remark: this.detail.remark || '',
          tag: parseInt(this.detail.tag) || 0,
          supplier: '',
          copy_demand_id: this.detail.demand_id
        }
      )
      this.demandFileList = this.temp.files.map((file) => {
        return {
          name: file.name,
          url: file.url,
          response: {
            data: {
              file_id: file.file_id
            }
          }
        }
      })

      if (this.$store.getters.roles.indexOf(3) >= 0) {
        this.rules = Object.assign({}, this.rules, {
          verify_id: [
            { required: true, message: '请选择审核人', trigger: 'change' }
          ]
        })
      } else {
        if (this.rules.verify_id) {
          delete this.rules.verify_id
        }
      }

      this.dialogStatus = 'copy'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 删除需求
     */
    handleDelete() {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.detail = Object.assign({}, this.detail, { deleteLoading: true })
          deleteDemand({ demand_id: this.detail.demand_id })
            .then(() => {
              this.detail = Object.assign({}, this.detail, {
                deleteLoading: false
              })
              this.$message.success('删除成功')
              this.getList(false)
            })
            .catch((_error) => {
              this.detail = Object.assign({}, this.detail, {
                deleteLoading: false
              })
            })
        })
        .catch(() => {})
    },
    /**
     * 提交审核
     */
    handleToVerify() {
      this.$confirm('确定提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.detail = Object.assign({}, this.detail, { verifyLoading: true })
          toVerifyDemand({ demand_id: this.detail.demand_id })
            .then(async() => {
              this.detail = Object.assign({}, this.detail, {
                verifyLoading: false
              })
              this.$message.success('提交成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {
              this.detail = Object.assign({}, this.detail, {
                verifyLoading: false
              })
            })
        })
        .catch(() => {})
    },
    /**
     * 审批弹窗
     */
    handleResolve(ok) {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请先选择需求')
        return false
      }

      const checkeds = []

      this.multipleSelection.some((listItem) => {
        if (listItem.status !== 1) {
          const errorName = `[${listItem.name}] 该需求并不是待审核状态，无法审核`
          this.$message.error(errorName)
          return true
        }
        checkeds.push(listItem.demand_id)
        return false
      })

      if (checkeds.length <= 0) {
        return false
      }

      this.dialogStatus = ok === true ? 'resolve' : 'reject'
      this.tempVerify.checkeds = checkeds
      if (ok) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
        this.$confirm('确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dialogVerifyVisible = true
            this.baseConfirmVerify()
          })
          .catch(() => {})
      } else {
        this.tempVerify.reason = ''
        this.verifyRules = Object.assign({}, this.verifyRules, {
          reason: [
            { required: true, message: '请输入驳回原因', trigger: 'blur' }
          ]
        })
        this.dialogVerifyVisible = true
        this.$nextTick(() => {
          this.$refs['verifyDataForm'].clearValidate()
        })
      }
    },
    /**
     * 审批弹窗
     */
    detailHandleResolve(ok) {
      if (this.detail.status !== 1) {
        const errorName = `[${this.detail.name}] 该需求并不是待审核状态，无法审核`
        this.$message.error(errorName)
        return false
      }

      this.dialogStatus = ok === true ? 'resolve' : 'reject'
      this.tempVerify.checkeds = [this.detail.demand_id]
      if (ok) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
        this.$confirm('确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dialogVerifyVisible = true
            this.baseConfirmVerify()
          })
          .catch(() => {})
      } else {
        this.tempVerify.reason = ''
        this.verifyRules = Object.assign({}, this.verifyRules, {
          reason: [
            { required: true, message: '请输入驳回原因', trigger: 'blur' }
          ]
        })
        this.dialogVerifyVisible = true
        this.$nextTick(() => {
          this.$refs['verifyDataForm'].clearValidate()
        })
      }
    },
    /**
     * 物件审核弹窗
     */
    handleResolveTask(ok, multi = true) {
      const checkeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
        this.multipleSelection.some((listItem) => {
          if ([5].indexOf(listItem.status) < 0) {
            const errorName = `[${listItem.name}] 该需求状态错误，无法审核`
            this.$message.error(errorName)
            return true
          }
          checkeds.push(listItem.demand_id)
          return false
        })
      } else {
        if ([5].indexOf(this.detail.status) < 0) {
          const errorName = `[${this.detail.name}] 该需求状态错误，无法审核`
          this.$message.error(errorName)
          return false
        }
        checkeds.push(this.detail.demand_id)
      }

      if (checkeds.length <= 0) {
        return false
      }

      this.dialogStatus = ok === true ? 'resolve' : 'reject'
      this.tempVerify.checkeds = checkeds
      if (ok) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
        this.$confirm('确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dialogVerifyTaskVisible = true
            this.baseConfirmVerify()
          })
          .catch(() => {})
      } else {
        this.tempVerify.reason = ''
        this.verifyRules = Object.assign({}, this.verifyRules, {
          reason: [
            { required: true, message: '请输入驳回原因', trigger: 'blur' }
          ]
        })
        this.dialogVerifyTaskVisible = true
        this.$nextTick(() => {
          this.$refs['verifyDataForm'].clearValidate()
        })
      }
    },
    /**
     * 审批确认
     */
    confirmVerify() {
      this.$refs['verifyDataForm'].validate((valid) => {
        if (valid) {
          this.baseConfirmVerify()
        }
      })
    },
    baseConfirmVerify() {
      // const checkeds = [];

      // let baseError;
      // let checkStatus;
      let status
      let verifyFunc

      if (this.dialogVerifyVisible === true) {
        // baseError = "该需求并不是待审核状态，无法审核";
        // checkStatus = [1];
        status = this.dialogStatus === 'resolve' ? 3 : 2
        verifyFunc = verifyDemand
      } else if (this.dialogVerifyTaskVisible === true) {
        // baseError = "该需求并不是物件待审核状态，无法审核";
        // checkStatus = [5];
        status = this.dialogStatus === 'resolve' ? 7 : 6
        verifyFunc = verifyTask
      } else if (this.dialogRejectTaskVisible === true) {
        // baseError = "该需求并不是待生成订单状态，无法驳回";
        // checkStatus = [7];
        status = 6
        verifyFunc = rejectDemand
      } else if (this.dialogVerifyOrderVisible === true) {
        // baseError = "该需求并不是订单待审核状态，无法审核";
        // checkStatus = [8];
        status = this.dialogStatus === 'resolve' ? 10 : 9
        verifyFunc = verifyOrder
      } else {
        this.$message.error('审核失败啦')
        return false
      }

      // this.multipleSelection.some((listItem) => {
      //   if (checkStatus.indexOf(listItem.status) < 0) {
      //     this.$message.error(`[${listItem.name}] ${baseError}`);
      //     return true;
      //   }
      //   checkeds.push(listItem.demand_id);
      //   return false;
      // });

      // if (checkeds.length <= 0) {
      //   checkeds.push(this.detail.demand_id);
      // }

      verifyFunc({
        demand_id: this.tempVerify.checkeds,
        status,
        reason: this.tempVerify.reason
      })
        .then(async(response) => {
          this.dialogVerifyVisible = false
          this.dialogVerifyTaskVisible = false
          this.dialogRejectTaskVisible = false
          this.dialogVerifyOrderVisible = false
          this.$message.success('操作成功')
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((_error) => {})
    },
    /**
     * 需求详情
     */
    async handleDetail() {
      if (!this.list[this.detailIndex]) {
        this.detailLoading = false
        this.detailLoaded = true
        this.detail = {}
        return false
      }
      this.detailLoading = true
      this.detailLoaded = false
      const detailData = await fetchDemandDetail({
        demand_id: this.list[this.detailIndex].demand_id
      }).catch((_error) => {})

      this.detailLoading = false
      this.detailLoaded = true
      this.detail = Object.assign({}, this.detail, detailData.data)
      this.multipleTaskSelection = []
      this.pacts = []
    },
    /**
     * 重置物件数据
     */
    resetTaskTemp() {
      this.tempTask = {
        demand_id: '',
        task_name: '',
        task_image: '',
        task_image_url: '',
        work_unit: '',
        work_num: '',
        price: '',
        currency: '人民币',
        pay_amount: '',
        deliver_date: '',
        remark: '',
        extend: []
      }
    },
    /**
     * 新增物件弹窗
     */
    async handleCreateTask() {
      this.addTaskLoading = true
      const supplier_id = this.detail.supplier_id || 0
      const cat_id = this.detail.category.cat_id
      const priceData = await queryCategoryPrice({ supplier_id, cat_id }).catch(
        (_error) => {}
      )
      if (priceData) {
        this.supplierCategoryPrice = parseFloat(priceData.data.max_price)
      }
      this.tempTaskCategory = this.detail.category
      this.resetTaskTemp()
      this.tempTask = Object.assign({}, this.tempTask, {
        demand_id: this.detail.demand_id,
        extend: this.detail.category.property_array.map((property) => {
          return {
            name: property.extend_name,
            value: '',
            type: property.extend_tag,
            options: property.extend_value
          }
        })
      })
      this.dialogStatus = 'create_task'
      this.addTaskLoading = false
      this.dialogTaskVisible = true
      this.$nextTick(() => {
        this.$refs['taskDataForm'].clearValidate()
      })
    },
    /**
     * 新增物件
     */
    createTaskData() {
      this.$refs['taskDataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.tempTask))
          // temp.task_id = parseInt(Math.random() * 100) + 1024
          if (temp.task_id) {
            delete temp.task_id
          }
          createTask(temp)
            .then(async(response) => {
              this.dialogTaskVisible = false
              this.$message.success('创建成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {})
        }
      })
    },
    /**
     * 导入物件弹窗
     */
    async handleImportTask() {
      const supplier_id = this.detail.supplier_id || 0
      const cat_id = this.detail.category.cat_id
      const priceData = await queryCategoryPrice({ supplier_id, cat_id }).catch(
        (_error) => {}
      )
      if (priceData) {
        this.supplierCategoryPrice = parseFloat(priceData.data.max_price)
      }
      this.tempImportTask = Object.assign({}, this.tempImportTask, {
        demand_id: this.detail.demand_id,
        tasks: []
      })
      this.dialogStatus = 'import_task'
      this.dialogImportTaskVisible = true
      this.tempImportTaskFileName = ''
      this.$nextTick(() => {
        this.$refs['importTaskDataForm'].clearValidate()
      })
    },
    /**
     * 导出物件模板
     */
    downloadTaskTpl() {
      if (this.tempImportTask.demand_id) {
        exportTaskTpl(this.tempImportTask.demand_id)
          .then((response) => {
            downloadFileStream('物件模板.xlsx', response)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    /**
     * 导入模板成功
     */
    handleAddTaskTplSucc(response, file, fileList) {
      if (
        response.some((task) => {
          return task.work_price > this.supplierCategoryPrice
        })
      ) {
        this.$message.error(
          '导入物件单价不能大于' + this.supplierCategoryPrice
        )
        return false
      }
      this.tempImportTaskFileName = file.name
      this.tempImportTask = Object.assign({}, this.tempImportTask, {
        tasks: response
      })
    },
    /**
     * 确认导入物件
     */
    confirmImportTask() {
      this.$refs['importTaskDataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.tempImportTask))
          batchAddTasks(temp)
            .then(async(response) => {
              this.dialogImportTaskVisible = false
              this.$message.success('导入成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {})
        }
      })
    },
    /**
     * 修改物件
     */
    updateTaskData() {
      this.$refs['taskDataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.tempTask))
          updateTask(temp)
            .then(async(response) => {
              this.dialogTaskVisible = false
              this.$message.success('修改成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {})
        }
      })
    },
    /**
     * 上传物件图片成功回调
     */
    handleTaskImageSuccess(response, file) {
      this.handleTaskImageChange(file)
    },
    /**
     * 上传物件图片变化回调
     */
    handleTaskImageChange(file) {
      if (file.response) {
        this.tempTask = Object.assign({}, this.tempTask, {
          task_image: file.response.data.file_id,
          task_image_url: URL.createObjectURL(file.raw)
        })
      }
    },
    /**
     * 修改物件弹窗
     */
    handleUpdateTask(task, taskIndex) {
      let extend
      const category = this.detail.category
      const props = task.props || []
      if (category.property_array.length > 0) {
        extend = category.property_array.map((property) => {
          let value = ''
          if (props.length > 0) {
            const propIndex = props.findIndex(
              (prop) => prop.extend_name === property.extend_name
            )
            if (propIndex >= 0) {
              value = props[propIndex].extend_value
            }
          }
          return {
            name: property.extend_name,
            value: value,
            type: property.extend_tag,
            options: property.extend_value
          }
        })
      }

      this.tempTaskCategory = this.detail.category
      this.tempTask = Object.assign({}, task, {
        extend,
        price: task.work_price
      })
      this.dialogStatus = 'update_task'
      this.dialogTaskVisible = true
      this.$nextTick(() => {
        this.$refs['taskDataForm'].clearValidate()
      })
    },
    /**
     * 复制物件弹窗
     */
    handleCopyTask(task, taskIndex) {
      let extend
      const category = this.detail.category
      const props = task.props || []
      if (category.property_array.length > 0) {
        extend = category.property_array.map((property) => {
          let value = ''
          if (props.length > 0) {
            const propIndex = props.findIndex(
              (prop) => prop.extend_name === property.extend_name
            )
            if (propIndex >= 0) {
              value = props[propIndex].extend_value
            }
          }
          return {
            name: property.extend_name,
            value: value,
            type: property.extend_tag,
            options: property.extend_value
          }
        })
      }

      this.tempTaskCategory = this.detail.category
      this.tempTask = Object.assign({}, task, {
        extend,
        price: task.work_price
      })
      this.dialogStatus = 'create_task'
      this.dialogTaskVisible = true
      this.$nextTick(() => {
        this.$refs['taskDataForm'].clearValidate()
      })
    },
    /**
     * 删除物件弹窗
     */
    handleDeleteTask(task, taskIndex) {
      deleteTask({ task_id: task.task_id })
        .then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.detail.tasks.splice(taskIndex, 1)
        })
        .catch((_error) => {})
    },
    downLoadContract(fileName, filePath) {
      downloadFile({ url: filePath })
        .then((response) => {
          downloadFileStream(fileName, response)
        })
        .catch((_error) => {})
    },
    handleCurrentChange(row, column, event) {
      const index = this.list.findIndex(
        (item) => item.demand_id === row.demand_id
      )
      if (index >= 0) {
        this.detailIndex = index
        this.handleDetail()
      }
    },
    /**
     * 分配供应商弹窗
     */
    async handleProvider() {
      this.detail = Object.assign({}, this.detail, { assignLoading: true })
      this.demandSupplierFileList = []
      try {
        const reasonData = await fetchReasonList({ page_num: 10000 })
        this.providerReasons = reasonData.data.list

        const providerData = await fetchAllProvider({
          process_id: this.detail.process_id,
          status: 1
        })
        this.providers = providerData.data.list
        this.detail = Object.assign({}, this.detail, { assignLoading: false })
        this.tempProvider = Object.assign({}, this.tempProvider, {
          demand_id: this.detail.demand_id,
          supplier_id: '',
          supplier_file: '',
          supplier_reason: ''
        })
        this.$nextTick(() => {
          this.dialogProviderVisible = true
        })
      } catch (error) {
        console.log(error)
        this.detail = Object.assign({}, this.detail, { assignLoading: false })
        this.$notify({
          title: '失败',
          message: '分配供应商失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    handleAddDemandSupplierFileSucc(response, file, fileList) {
      this.handleDemandSupplierFileChange(file, fileList)
    },
    handleDemandSupplierFileChange(file, fileList) {
      this.demandSupplierFileList = fileList
      const fileStr = fileList
        .map((fileItem) => {
          return fileItem.response.data.file_id
        })
        .join(',')
      const fileArr = fileList.map((fileItem) => {
        return {
          name: fileItem.name,
          url: fileItem.url,
          response: {
            data: {
              file_id: fileItem.response.data.file_id
            }
          }
        }
      })
      this.tempProvider = Object.assign({}, this.tempProvider, {
        supplier_file: fileStr,
        files: fileArr
      })
    },
    /**
     * 确认供应商
     */
    confirmProvider() {
      this.$refs['providerDataForm'].validate((valid) => {
        if (valid) {
          const temp = Object.assign({}, this.tempProvider)

          assignSupplier(temp)
            .then(async(response) => {
              // const index = this.list.findIndex(
              //   (listItem) => listItem.demand_id === this.tempProvider.demand_id
              // )
              // if (index >= 0) {
              //   const { status, current_operator } = response.data
              //   this.$set(this.list[index], 'status', status)
              //   this.$set(
              //     this.list[index],
              //     'current_operator',
              //     current_operator
              //   )
              // }
              this.dialogProviderVisible = false
              this.$message.success('分配成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {})
        }
      })
    },
    /**
     * 物件提交审核
     */
    handleToVerifyTask(multi = true) {
      const checkeds = []

      // 列表选择
      if (multi) {
        if (this.multipleSelection.length < 0) {
          this.$message.error('请先选择需求')
          return false
        }

        const result = this.multipleSelection.some((listItem) => {
          if ([4, 6].indexOf(listItem.status) < 0) {
            const errorName = `[${listItem.name}]: 该需求状态无法提交审核物件`
            this.$message.error(errorName)
            return true
          }

          return listItem.tasks.some((taskItem) => {
            if (taskItem.task_status !== 0) {
              const errorName = `[${taskItem.task_name}] 该物件不是正常状态，无法提交审核`
              this.$message.error(errorName)
              return true
            }
            checkeds.push(taskItem.task_id)
            return false
          })
        })
        if (result) {
          return false
        }
      } else {
        if ([4, 6].indexOf(this.detail.status) < 0) {
          const errorName = `[${this.detail.name}]: 该需求状态无法提交审核物件`
          this.$message.error(errorName)
          return true
        }

        if (this.detail.tasks.length <= 0) {
          this.$message.error('请先新增物件')
          return false
        }

        const result = this.detail.tasks.some((taskItem) => {
          if (taskItem.task_status !== 0) {
            const errorName = `[${taskItem.task_name}] 该物件不是正常状态，无法提交审核`
            this.$message.error(errorName)
            return true
          }
          checkeds.push(taskItem.task_id)
          return false
        })
        if (result) {
          return false
        }
      }

      toVerifyTask({
        task_id: checkeds
      })
        .then(async(response) => {
          this.$message.success('操作成功')
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((_error) => {})
    },
    /**
     * 供管驳回待生成订单的需求
     */
    handleGongGuanResolveTask(multi) {
      const checkeds = []

      if (multi) {
        this.multipleSelection.some((listItem) => {
          if ([7, 9].indexOf(listItem.status) < 0) {
            const errorName = `[${listItem.name}] 该需求并不是待生成订单状态，无法驳回`
            this.$message.error(errorName)
            return true
          }
          checkeds.push(listItem.demand_id)
          return false
        })
      } else {
        if ([7, 9].indexOf(this.detail.status) < 0) {
          const errorName = `[${this.detail.name}] 该需求并不是待生成订单状态，无法驳回`
          this.$message.error(errorName)
          return false
        }
        checkeds.push(this.detail.demand_id)
      }

      if (checkeds.length <= 0) {
        this.$message.error('请先选择需求')
        return false
      }
      this.tempVerify.checkeds = checkeds
      this.tempVerify.reason = ''
      this.verifyRules = Object.assign({}, this.verifyRules, {
        reason: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' }
        ]
      })
      this.dialogStatus = 'reject'
      this.dialogRejectTaskVisible = true
      this.$nextTick(() => {
        this.$refs['verifyDataForm'].clearValidate()
      })
    },
    /**
     * 预制订单弹窗
     */
    async handleCreateOrder(multi) {
      const checkeds = []

      if (multi) {
        this.multipleSelection.some((listItem) => {
          if ([7, 9].indexOf(listItem.status) < 0) {
            const errorName = `[${listItem.name}]: 该需求状态错误`
            this.$message.error(errorName)
            return true
          }
          checkeds.push(listItem.demand_id)
          return false
        })
      } else {
        if ([7, 9].indexOf(this.detail.status) < 0) {
          const errorName = `[${this.detail.name}]: 该需求状态错误`
          this.$message.error(errorName)
          return false
        }
        checkeds.push(this.detail.demand_id)
      }

      if (checkeds.length <= 0) {
        this.$message.error('请先选择需求')
        return false
      }

      if (this.pacts.length <= 0) {
        this.orderCreating = true
        const sub_id = this.detail.flow ? this.detail.flow.sub_id : 0
        const supplier_id = this.detail.supplier_id || 0
        const pactData = await fetchAllPact({
          status: 1,
          sub_id,
          supplier_id
        }).catch((_error) => {})
        this.pacts = pactData.data || []
        this.orderCreating = false
      }

      this.tempCreateOrder = Object.assign({}, this.tempCreateOrder, {
        demand_id: checkeds,
        pact_id: ''
      })
      this.dialogStatus = 'create_order'
      this.dialogCreateOrderVisible = true
      this.$nextTick(() => {
        this.$refs['createOrderDataForm'].clearValidate()
      })
    },
    confirmCreateOrder() {
      this.$refs['createOrderDataForm'].validate((valid) => {
        if (valid) {
          const temp = Object.assign({}, this.tempCreateOrder)

          createOrder(temp)
            .then(async(response) => {
              this.$message.success('订单生成成功')
              this.dialogCreateOrderVisible = false
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {})
        }
      })
    },
    /**
     * 终止弹窗
     */
    handleFinish(multi = true) {
      const checkeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
        const result = this.multipleSelection.some((listItem) => {
          if ([7, 9].indexOf(listItem.status) < 0) {
            const errorName = `[${listItem.name}] 该需求并不是待生成订单状态，无法终止`
            this.$message.error(errorName)
            return true
          }
          return listItem.tasks.some((taskItem) => {
            if (taskItem.checked) {
              if (taskItem.task_status !== 0) {
                const errorName = `[${taskItem.task_name}] 该物件不是正常状态，无法终止`
                this.$message.error(errorName)
                return true
              }
              checkeds.push(taskItem.task_id)
              return false
            }
            return false
          })
        })
        if (result) {
          return false
        }
      } else {
        if ([7, 9].indexOf(this.detail.status) < 0) {
          const errorName = `[${this.detail.name}] 该需求并不是待生成订单状态，无法终止`
          this.$message.error(errorName)
          return false
        }
        if (this.multipleTaskSelection.length <= 0) {
          this.$message.error('请先选择终止物件')
          return false
        }
        const result = this.multipleTaskSelection.some((taskItem) => {
          if (taskItem.task_status !== 0) {
            const errorName = `[${taskItem.task_name}] 该物件不是正常状态，无法终止`
            this.$message.error(errorName)
            return true
          }
          checkeds.push(taskItem.task_id)
          return false
        })
        if (result) {
          return false
        }
      }

      this.tempFinish = Object.assign({}, this.tempFinish, {
        task_id: checkeds,
        reason: '',
        file: ''
      })
      this.dialogFinishVisible = true
    },
    handleAddStopFileSucc(response, file, fileList) {
      this.handleStopFileChange(file, fileList)
    },
    handleStopFileChange(file, fileList) {
      this.stopFileList = fileList
      const fileStr = fileList
        .map((fileItem) => {
          return fileItem.response.data.file_id
        })
        .join(',')
      const fileArr = fileList.map((fileItem) => {
        return {
          name: fileItem.name,
          url: fileItem.url,
          response: {
            data: {
              file_id: fileItem.response.data.file_id
            }
          }
        }
      })
      this.tempFinish = Object.assign({}, this.tempFinish, {
        file: fileStr,
        files: fileArr
      })
    },
    /**
     * 确认终止
     */
    confirmFinish() {
      this.$refs['finishDataForm'].validate((valid) => {
        if (valid) {
          const temp = Object.assign({}, this.tempFinish)

          finishTask(temp)
            .then(async(response) => {
              this.$message.success('终止成功')
              this.dialogFinishVisible = false
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {})
        }
      })
    },
    /**
     * 终止需求
     */
    handleFinishDemand() {
      this.$confirm('确定终止需求?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.detail = Object.assign({}, this.detail, { finishLoading: true })
          toFinishDemand({ demand_id: this.detail.demand_id })
            .then(async() => {
              this.detail = Object.assign({}, this.detail, {
                finishLoading: false
              })
              this.$message.success('终止成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {
              this.detail = Object.assign({}, this.detail, {
                finishLoading: false
              })
            })
        })
        .catch(() => {})
    },
    /**
     * 拒绝需求
     */
    handleRefuseDemand() {
      this.$confirm('确定拒绝需求?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.detail = Object.assign({}, this.detail, { refuseLoading: true })
          toRefuseDemand({ demand_id: this.detail.demand_id })
            .then(async() => {
              this.detail = Object.assign({}, this.detail, {
                refuseLoading: false
              })
              this.$message.success('拒绝成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {
              this.detail = Object.assign({}, this.detail, {
                refuseLoading: false
              })
            })
        })
        .catch(() => {})
    },
    /**
     * 订单审核弹窗
     */
    handleResolveOrder(ok, multi = true) {
      const checkeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
        this.multipleSelection.some((listItem) => {
          if ([8].indexOf(listItem.status) < 0) {
            const errorName = `[${listItem.name}] 该需求状态错误，无法审核`
            this.$message.error(errorName)
            return true
          }
          checkeds.push(listItem.demand_id)
          return false
        })
      } else {
        if ([8].indexOf(this.detail.status) < 0) {
          const errorName = `[${this.detail.name}] 该需求状态错误，无法审核`
          this.$message.error(errorName)
          return false
        }
        checkeds.push(this.detail.demand_id)
      }

      if (checkeds.length <= 0) {
        return false
      }

      this.dialogStatus = ok === true ? 'resolve' : 'reject'
      this.tempVerify.checkeds = checkeds
      if (ok) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
        this.$confirm('确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dialogVerifyOrderVisible = true
            this.baseConfirmVerify()
          })
          .catch(() => {})
      } else {
        this.tempVerify.reason = ''
        this.verifyRules = Object.assign({}, this.verifyRules, {
          reason: [
            { required: true, message: '请输入驳回原因', trigger: 'blur' }
          ]
        })
        this.dialogVerifyOrderVisible = true
        this.$nextTick(() => {
          this.$refs['verifyDataForm'].clearValidate()
        })
      }
    },
    handleUploadWorkSuccess(response, file, fileList) {
      const fileArr = fileList.map((fileItem) => {
        return {
          name: fileItem.name,
          url: fileItem.response
            ? fileItem.response.data.url
            : fileItem.url || '',
          file_id: fileItem.response
            ? fileItem.response.data.file_id
            : fileItem.file_id || ''
        }
      })
      const fileStr = fileArr
        .map((fileItem) => {
          return fileItem.file_id
        })
        .join(',')

      uploadDemandPaperclip({
        demand_id: this.detail.demand_id,
        file_id: fileStr
      })
        .then((response) => {
          this.$set(this.detail, 'supplier_files', fileArr)
          this.$message.success('上传成功')
        })
        .catch((_error) => {})
    },
    handleUploadWorkError(err, file, fileList) {
      console.log('上传失败', err, file, fileList)
      this.$message.error('上传失败')
    },
    /**
     * 驳回原因
     */
    handleRejectReason() {
      if (!this.detail.reject) {
        this.$message.error('对不起，没有驳回原因')
        return false
      }
      this.$nextTick(() => {
        this.dialogRejectReasonVisible = true
      })
    },
    /**
     * 下载物件
     */
    handleDownloadTask() {
      if (this.detail.demand_id) {
        this.detail = Object.assign({}, this.detail, { taskDownloading: true })
        exportTask(this.detail.demand_id)
          .then((response) => {
            downloadFileStream(
              `${this.detail.name}-${this.detail.demand_id}.xlsx`,
              response
            )
            this.detail = Object.assign({}, this.detail, {
              taskDownloading: false
            })
          })
          .catch((error) => {
            console.log(error)
            this.detail = Object.assign({}, this.detail, {
              taskDownloading: false
            })
          })
      }
    },
    /**
     * 意向供应商选择
     * @param {*} supplier
     */
    intentProviderChange(supplier) {
      if (supplier) {
        if (this.intentProviderReasons.length <= 0) {
          fetchIntentReasonList({ page_num: 10000 })
            .then((response) => {
              this.intentProviderReasons = response.data.list
            })
            .catch((_error) => {})
        }
        this.$set(this.rules.supplier_reason[0], 'required', true)
      } else {
        this.$set(this.rules.supplier_reason[0], 'required', false)
        this.$set(this.temp, 'supplier_reason', '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
%flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.app-container {
  padding: 0;
  .list-container {
    .item-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      font-size: 12px;
      color: #848484;
      .item-no,
      .item-name {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .box-red {
      color: #F56C6C;
    }
  }
  .detail-container {
    height: 100%;
    overflow-y: scroll;
    padding: 20px;
    box-sizing: border-box;
    .title {
      span {
        margin-left: 10px;
      }
    }
    .info-content {
      .description {
        margin-top: 10px;
        .el-descriptions {
          font-size: 12px;
        }
      }
      .actions {
        margin-top: 20px;
      }
    }
    .task-content {
      margin-top: 50px;
      .task-table {
        margin-top: 20px;
      }
      .actions {
        margin-top: 20px;
      }
      .supplier-box {
        margin-top: 20px;
        font-size: 12px;
      }
    }
    .download-content {
      margin-top: 50px;
      .files {
        margin: 20px 0;
        .file-item {
          width: 50%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:not(:last-child) {
            margin-bottom: 10px;
          }
          .file-name {
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }
  ::v-deep .list-container .el-table-column--selection .cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .list-table {
    background: #f3f3f3;
    .el-table__header th {
      background: #f3f3f3 !important;
    }
    .el-table__header th.el-table__cell.is-leaf {
      height: 60px;
      border-bottom: 1px solid #e7e7e7;
    }
    .el-table__body .el-table__row {
      background: #f3f3f3;
      &:hover > td {
        background-color: #f9f9f9 !important;
      }
      &.cuttent-row > td {
        background-color: #ffffff !important;
      }
      td.el-table__cell {
        border-bottom: 1px solid #e7e7e7;
      }
    }
    tr.current-row > td.el-table__cell {
      background-color: #ffffff;
    }
  }
  ::v-deep .detail-container .el-table {
    font-size: 12px !important;
  }
  ::v-deep .detail-container .el-table.table-info th {
    background: #409eff !important;
    color: #fcfcfc;
    border-right: 0;
  }
  ::v-deep .el-icon-my-prohibit {
    background: url("../../assets/icon/prohibit.png") center no-repeat;
    font-size: 10px;
    background-size: 10px;
  }
  ::v-deep .el-icon-my-prohibit:before {
    content: "替";
    font-size: 10px;
    visibility: hidden;
  }
  ::v-deep .pact-select .el-select-dropdown__item {
    height: unset;
  }
}
.dialog-form {
  .has-secret-notice {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .dialog-form-item {
      flex: auto;
    }
    .secret-notice {
      margin-left: 10px;
      flex: none;
    }
  }

  .form-title {
    font-size: 16px;
    color: #000000;
    &.is-required::before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .task-image-uploader {
    .el-upload {
      .task-image-uploader-icon {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
    }
    .task-image {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  ::v-deep .custom-unrequired .el-form-item__label {
    opacity: 0.6;
  }
}
.reason-box {
  .content {
    font-size: 16px;
    text-align: left;
  }
  .user-info {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.upload-box {
  display: inline-block;
}
.pact-box {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  .name {
    max-width: 390px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-line;
    // overflow: hidden;
  }
  .time {
    margin-left: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.tongji {
  margin-top: 20px;
  font-size: 12px;
  color: #606266;
  font-weight: bold;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .tongji-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>
