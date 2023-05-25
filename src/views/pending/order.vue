<template>
  <div class="app-container">
    <resize-box>
      <div
        slot="left"
        v-resize
        v-loading="listLoading"
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
            row-key="order_id"
            :show-header="showHeader"
            @selection-change="handleSelectionChange"
            @row-click="handleCurrentChange"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column>
              <template slot="header">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleDeliver(true)"
                >
                  交付验收
                </el-button>
              </template>
              <template slot-scope="scope">
                <div class="item-box">
                  <span class="item-no">{{ scope.row.order_id }}</span>
                  <span class="item-name">{{ scope.row.demand.name }}</span>
                  <span v-if="scope.row.supplier" class="item-supplier">{{
                    scope.row.supplier.name
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
          v-if="detailLoaded && detail.demand"
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
                  <span>{{ detail.demand.name }}</span>
                  <el-tag size="mini" style="margin-left: 10px">{{
                    detail.demand.tag | tagText
                  }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="需求品类">{{
                  detail.demand.category | categoryText
                }}</el-descriptions-item>
                <el-descriptions-item label="需求单号">{{
                  detail.demand.demand_id
                }}</el-descriptions-item>
                <el-descriptions-item label="需求状态">{{
                  detail.demand.status | statusText
                }}</el-descriptions-item>

                <el-descriptions-item
                  slot-scope=""
                  label="需求说明"
                  span="4"
                  :label-style="{
                    'margin-bottom': '20px',
                    'font-weight': 'bold',
                  }"
                >{{ detail.demand.introduce }}</el-descriptions-item>

                <el-descriptions-item label="项目名称">{{
                  detail.demand.project
                    ? detail.demand.project.project_name
                    : ""
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="发起部门"
                >{{
                  detail.demand.flow ? detail.demand.flow.launch_dep.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="核算部门"
                >{{
                  detail.demand.flow
                    ? detail.demand.flow.account_dep.name
                    : ""
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="经费使用"
                >
                  {{
                    detail.demand.flow && detail.demand.flow.budget_dep
                      ? detail.demand.flow.budget_dep.employ_budget
                      : 0
                  }}/{{
                    detail.demand.flow && detail.demand.flow.budget_dep
                      ? detail.demand.flow.budget_dep.budget
                      : 0
                  }}
                </el-descriptions-item>

                <el-descriptions-item label="需求创建人">{{
                  detail.demand.creator ? detail.demand.creator.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{
                  detail.demand.created_at
                }}</el-descriptions-item>

                <!-- <el-descriptions-item label="需求附件" span="6">
                  <div class="file-box" style="width: 50%">
                    <div
                      v-for="(file, fileIndex) in detail.files"
                      :key="fileIndex"
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
                </el-descriptions-item> -->
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="意向供应商"
                  span="2"
                >{{
                  detail.demand.supplier ? detail.demand.supplier.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item
                  v-if="$store.getters.roles.indexOf(0) < 0"
                  label="备注说明"
                  span="4"
                >{{ detail.demand.remark }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <el-table :data="[detail]" class="table-info" width="100%" border>
              <el-table-column label="订单号" align="center" min-width="150">
                <template slot-scope="scope">
                  {{ scope.row.order_id }}
                </template>
              </el-table-column>
              <el-table-column
                label="项目名称"
                align="center"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.demand.project.project_name }}
                </template>
              </el-table-column>
              <el-table-column
                label="需求名称"
                align="center"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.demand.name }}
                </template>
              </el-table-column>
              <el-table-column
                label="供应商"
                align="center"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.demand.provider.name }}
                </template>
              </el-table-column>
              <el-table-column
                label="供管"
                align="center"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.supplier_management }}
                </template>
              </el-table-column>
              <el-table-column label="物件数量" align="center" width="120">
                <template slot-scope="scope">
                  {{ scope.row.nums }}
                </template>
              </el-table-column>
              <el-table-column label="工作总量" align="center" width="120">
                <template slot-scope="scope">
                  {{ scope.row.work_num }}
                </template>
              </el-table-column>
              <el-table-column label="总金额" align="center" width="120">
                <template slot-scope="scope">
                  {{ scope.row.work_amount }}
                </template>
              </el-table-column>
            </el-table>
            <div class="actions">
              <el-button
                v-permission="[0]"
                type="primary"
                icon="el-icon-document-add"
                size="mini"
                plain
                :loading="addTaskLoading"
                @click.stop="handleCreateTask()"
              >
                新增物件
              </el-button>
              <!-- <el-upload
                v-permission="[0]"
                class="upload-box"
                style="margin-left: 10px"
                :action="`${$baseUrl}/api/tools/upfile`"
                :show-file-list="false"
                multiple
                :file-list="detail.work_file"
                :on-success="
                  (response, file, fileList) =>
                    handleUploadWorkFileSuccess(
                      response,
                      file,
                      fileList,
                    )
                "
                :on-error="handleUploadWorkError"
              >
                <el-button
                  v-if="detail.work_file.length === 0"
                  ref="uploadWorkFileElement"
                  icon="el-icon-upload2"
                  type="primary"
                  size="mini"
                  plain
                >
                  上传作品截图集
                </el-button>
                <el-button
                  v-else
                  ref="uploadWorkFileElement"
                  icon="el-icon-upload2"
                  type="primary"
                  size="mini"
                  plain
                >
                  已上传作品截图集
                </el-button>
              </el-upload> -->
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
              v-if="detail.demand.supplier"
              class="supplier-box"
              :column="4"
              :label-style="{
                'font-weight': 'bold',
                'align-items': 'center',
              }"
            >
              <el-descriptions-item label="供应商">{{
                detail.demand.supplier ? detail.demand.supplier.name : ""
              }}</el-descriptions-item>
            </el-descriptions>
            <el-table
              :data="detail.tasks"
              class="task-table"
              width="100%"
              border
              row-key="task_id"
              :row-class-name="tableRowClassName"
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
                  <task-detail
                    :task-id="scope.row.task_id"
                    :file-editable="
                      [0, 4].indexOf(scope.row.task_status) >= 0 &&
                        $store.getters.roles.indexOf(0) >= 0
                    "
                    @updateFile="updateTaskFile"
                  />
                </template>
              </el-table-column>
              <el-table-column label="缩略图" align="center">
                <template slot-scope="scope">
                  <el-image
                    style="width: 50px; height: 50px"
                    :src="
                      scope.row.display_area.length > 0
                        ? scope.row.display_area[0].url
                        : scope.row.image_url
                    "
                  >
                    <div slot="error" class="image-slot">
                      <i
                        class="el-icon-picture-outline"
                        style="font-size: 50px"
                      />
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column
                prop="task_name"
                label="物件名称"
                width="205"
                align="center"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="deliver_date"
                label="交付日期"
                width="100"
                align="center"
              />
              <el-table-column prop="nums" label="数量" align="center" />
              <el-table-column prop="unit" label="单位" align="center" />
              <el-table-column prop="price" label="单价" align="center" />
              <el-table-column prop="amount" label="总价" align="center" />
              <el-table-column
                prop="stay_time"
                label="停留时间"
                align="center"
              />
              <el-table-column
                prop="dealing"
                label="当前处理"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column label="物件状态" align="center" min-width="100">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.task_status | taskStatusText }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showTaskActionRow"
                label="操作"
                align="center"
                :min-width="taskActionColumnWidth"
                class-name="small-padding fixed-width need-flex"
              >
                <template slot-scope="scope">
                  <!-- <el-upload
                    v-if="[0, 4].indexOf(scope.row.task_status) >= 0"
                    v-permission="[0]"
                    class="upload-box"
                    :action="`${$baseUrl}/api/tools/upfile`"
                    :show-file-list="false"
                    multiple
                    :file-list="scope.row.finished_product"
                    :on-success="
                      (response, file, fileList) =>
                        handleUploadWorkSuccess(
                          response,
                          file,
                          fileList,
                          scope.$index,
                          'finished_product'
                        )
                    "
                    :on-error="handleUploadWorkError"
                  >
                    <el-button
                      v-if="scope.row.finished_product.length > 0"
                      size="mini"
                      type="primary"
                      style="margin-left: 10px"
                      plain
                    >已上传作品</el-button>
                    <el-button
                      v-else
                      size="mini"
                      type="primary"
                      style="margin-left: 10px"
                      plain
                    >交付作品</el-button>
                  </el-upload>
                  <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 10px"
                    plain
                    :loading="scope.row.downloading"
                    @click="handleDownloadWork(scope.row, scope.$index)"
                  >
                    下载作品
                  </el-button> -->
                  <el-upload
                    v-if="[0, 4].indexOf(scope.row.task_status) >= 0"
                    v-permission="[0]"
                    class="upload-box"
                    :action="`${$baseUrl}/api/tools/upfile`"
                    :show-file-list="false"
                    style="margin-left: 10px"
                    :file-list="scope.row.display_area"
                    :on-success="
                      (response, file, fileList) =>
                        handleUploadWorkSuccess(
                          response,
                          file,
                          fileList,
                          scope.$index,
                          'display_area'
                        )
                    "
                    :on-error="handleUploadWorkError"
                  >
                    <el-button
                      v-if="scope.row.display_area.length > 0"
                      type="primary"
                      size="mini"
                      plain
                    >
                      已上传展示图
                    </el-button>
                    <el-button v-else type="primary" size="mini" plain>
                      上传展示图
                    </el-button>
                  </el-upload>

                  <el-button
                    v-if="[4].indexOf(scope.row.task_status) >= 0"
                    type="danger"
                    size="mini"
                    style="margin-left: 10px"
                    plain
                    @click="handleRejectTaskReason(scope.row, scope.$index)"
                  >
                    驳回原因
                  </el-button>
                  <el-button
                    v-if="[5].indexOf(scope.row.task_status) >= 0"
                    type="primary"
                    size="mini"
                    plain
                    @click="handleStopTaskReason(scope.row, scope.$index)"
                  >
                    终止原因
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="actions">
              <el-button
                type="primary"
                icon="el-icon-editor2b"
                size="mini"
                plain
                @click="handleModify"
              >
                申请变更
              </el-button>
              <el-button
                style="margin-left: 10px"
                icon="el-icon-xiangmujiaofuziliucheng__xianxing__-01-01"
                type="primary"
                size="mini"
                plain
                @click="handleDeliver(false)"
              >
                申请验收
              </el-button>
            </div>
          </div>
          <div
            v-if="
              detail.demand &&
                (detail.demand.files.length > 0 ||
                  detail.demand.supplier_files.length)
            "
            class="download-content"
          >
            <div class="title">
              <i class="el-icon-s-management" />
              <span>下载附件</span>
            </div>
            <div class="files">
              <div
                v-for="(file, _fileIndex) in detail.demand.files"
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
                v-for="(file, _fileIndex) in detail.demand.supplier_files"
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
              <span>{{ tempTaskCategory.category_name }}</span>
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
                :placeholder="`请输入单价${supplierCategoryPrice > 0 ? '，不能超过'+supplierCategoryPrice : ''}`"
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
                      required: true,
                      message: `请选择${property.name}`,
                      trigger: 'change',
                    },
                  ]
                  : [
                    {
                      required: true,
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
            <el-form-item>
              <div slot="label" class="form-title is-required">
                新增物件原因
              </div>
            </el-form-item>
            <el-form-item label-width="0" prop="reason">
              <el-input
                v-model="tempTask.reason"
                type="textarea"
                placeholder="请输入新增物件原因"
                class="dialog-form-item"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogTaskVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="createTaskData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--申请变更-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogModifyVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="modifyDataForm"
        class="dialog-form"
        :rules="modifyRules"
        :model="tempModify"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="交付日期:" prop="deliver_date">
          <el-date-picker
            v-model="tempModify.deliver_date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            class="dialog-form-item"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="数量:" prop="nums">
          <el-input
            v-model="tempModify.nums"
            placeholder="请输入变更后的数量"
            class="dialog-form-item"
          />
        </el-form-item>
        <el-form-item label="单价:">
          <span>{{ tempModify.work_price }}</span>
        </el-form-item>
        <el-form-item label="总价:">
          <span>{{ tempModify.work_amount }}</span>
        </el-form-item>

        <el-form-item label="变更原因:" prop="reason">
          <el-input
            v-model="tempModify.reason"
            type="textarea"
            placeholder="请输入变更原因"
            class="dialog-form-item"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogModifyVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmModify">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--交付验收-->
    <el-dialog
      title="交付验收"
      :visible.sync="dialogDeliverVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="closeDeliverDialog"
    >
      <el-form
        ref="deliverDataForm"
        class="dialog-form"
        :rules="deliverRules"
        :model="tempDeliver"
        label-position="left"
        label-width="100px"
        style="margin: 0 20px"
      >
        <p style="color: red">
          如无特殊情况，请完成整个需求卡中的任务后再申请验收
        </p>
        <p>特殊情况请联系供应商管理部对接人</p>
        <el-form-item label="作品附件" prop="work_file">
          <el-upload
            ref="deliverUploader"
            class="upload-demo"
            :action="`${$baseUrl}/api/tools/upfile`"
            :on-success="handleUploadWorkFileSuccess"
            :on-remove="handleUploadWorkFileChange"
            :on-error="handleUploadWorkError"
          >
            <el-button size="mini" type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogDeliverVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmDeliver">
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
      <div v-if="tempTask.reject" class="reason-box">
        <div class="content">{{ tempTask.reject.reason || "" }}</div>
        <div class="user-info">
          <div>驳回人：{{ tempTask.reject.user }}</div>
          <div>驳回时间：{{ tempTask.reject.created_at }}</div>
        </div>
      </div>
    </el-dialog>

    <!--终止原因-->
    <el-dialog
      title="终止原因"
      :visible.sync="dialogStopReasonVisible"
      width="600px"
    >
      <el-form label-position="left" label-width="100px" style="margin: 0 50px">
        <el-form-item label="终止原因:">
          <span>{{ tempTask.task_reason }}</span>
        </el-form-item>

        <el-form-item label="附件:">
          <div class="file-box">
            <div
              v-for="(file, fileIndex) in tempTask.stop_file"
              :key="fileIndex"
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
        </el-form-item>
      </el-form></el-dialog>
  </div>
</template>

<script>
import {
  fetchOrderList,
  fetchOrderDetail,
  modifyOrder,
  addTask,
  toCheckOrder,
  uploadWorkImage,
  uploadWorkFile
} from '@/api/order/index'
import { createTask } from '@/api/demand/task'
import { downloadFile } from '@/api/system/file'
import { queryCategoryPrice } from '@/api/provider/index'
import { downloadFileStream, baseName } from '@/utils/index'

import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import TaskDetail from '@/components/TaskDetail'
import ResizeBox from '@/components/ResizeBox'
const tagList = [
  { id: 0, name: '正式包' },
  { id: 1, name: '测试包' },
  { id: 2, name: '外派' },
  { id: 3, name: '动态团队' }
]
export default {
  components: { Pagination, TaskDetail, ResizeBox },
  directives: { waves, permission },
  filters: {
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
    taskStatusText(status) {
      const statusMap = {
        0: '待交付验收',
        1: '变更中',
        2: '资源审核中',
        3: '资源已验收',
        4: '验收未通过',
        5: '物件已终止',
        6: '验收通过'
      }
      return statusMap[status]
    },
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
    stayTimeHours(seconds) {
      const diff = parseInt(seconds)
      if (isNaN(diff)) {
        return 0
      }

      return Math.round(+(diff / 3600) + 'e' + 1) / Math.pow(10, 1)
    }
  },
  data() {
    return {
      globelCheckedAll: false,
      expandRowKeys: [],
      total: 0,
      list: [],
      multipleSelection: [],
      listLoading: true,
      listQuery: {
        order_id: '',
        task_id: '',
        project_name: '',
        supplier_name: '',
        tag: '',
        page: 1,
        page_num: 9999999,
        keyword: ''
      },
      detail: {},
      detailIndex: 0,
      multipleTaskSelection: [],
      detailLoading: false,
      detailLoaded: false,
      textMap: {
        modify: '申请变更',
        create_task: '新增物件'
      },
      dialogStatus: '',
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
        order_id: '',
        demand_id: '',
        task_name: '',
        task_image: '',
        task_image_url: '',
        work_unit: '',
        work_num: '',
        price: '',
        deliver_date: '',
        remark: '',
        extend: [],
        reason: ''
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
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        deliver_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        value: [{ required: true, message: '请设置属性值', trigger: 'blur' }],
        reason: [
          { required: true, message: '请输入新增物件原因', trigger: 'blur' }
        ]
      },
      dialogModifyVisible: false,
      tempModify: {
        order_id: '',
        task_id: [],
        nums: '',
        work_price: '',
        work_amount: '',
        deliver_date: '',
        reason: ''
      },
      modifyRules: {},
      dialogDeliverVisible: false,
      tempDeliver: {
        order_id: '',
        tasks: [],
        work_file: ''
      },
      deliverRules: {
        work_file: [
          { required: true, message: '请添加作品集', trigger: 'blur' }
        ]
      },
      dialogRejectReasonVisible: false,
      dialogStopReasonVisible: false,
      fileList: [],
      posting: false,
      deliverWorkFile: []
    }
  },
  computed: {
    showHeader: function() {
      const hiddenPaths = [
        '/pending/xmz/assign/vendor',
        '/pending/xmz/demand/draft',
        '/pending/gg/demand/draft',
        '/pending/gys/order/deliver'
      ]
      return hiddenPaths.indexOf(this.$route.path) < 0
    },
    showTaskCheckRow: function() {
      const hiddenTaskCheckRowPaths = [
        '/pending/gys/demand/quote',
        '/pending/xmz/demand/review',
        '/pending/gg/order/prepare',
        '/pending/ggfzr/order/approval'
      ]
      return hiddenTaskCheckRowPaths.indexOf(this.$route.path) < 0
    },
    showTaskActionRow: function() {
      const hiddenTaskActionRowPaths = [
        '/pending/xmz/demand/review',
        '/pending/gg/order/prepare',
        '/pending/ggfzr/order/approval'
      ]
      return hiddenTaskActionRowPaths.indexOf(this.$route.path) < 0
    },
    taskActionColumnWidth: function() {
      let width = 100
      const status = this.detail.tasks.map((task) => task.task_status)
      if (status.indexOf(4) >= 0) {
        width = 240
      } else if (status.indexOf(0) >= 0) {
        width = 140
      } else if (status.indexOf(5) >= 0) {
        width = 140
      }
      return width
    }
  },
  created() {
    this.getList(true)
  },
  mounted() {
    this.$bus.$on('navSearch', (listQuery) => {
      this.listQuery = Object.assign({}, this.listQuery, listQuery)
      this.getList(false)
    })
  },
  beforeDestroy() {
    this.$bus.$off('navSearch')
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.task_status === 4) {
        return 'danger-row'
      }
      return ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleTaskSelectionChange(val) {
      this.multipleTaskSelection = val
    },
    /**
     * 获取订单列表
     */
    getList(needLoading = true) {
      if (needLoading) {
        this.listLoading = true
      }

      fetchOrderList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.total = response.data.total
          const list = response.data.list
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
        .catch((error) => {
          console.log(error)
          this.listLoading = false
        })
    },
    /**
     * 查询过滤
     */
    handleFilter() {
      this.listQuery.page = 1
      this.getList(true)
    },
    handleCurrentChange(row, column, event) {
      const index = this.list.findIndex(
        (item) => item.order_id === row.order_id
      )
      if (index >= 0) {
        this.detailIndex = index
        this.handleDetail()
      }
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
      const detailData = await fetchOrderDetail({
        order_id: this.list[this.detailIndex].order_id
      }).catch((_error) => {})

      const { data } = detailData
      data.tasks = data.tasks.filter(
        (task) => [0, 4].indexOf(task.task_status) >= 0
      )

      this.detailLoading = false
      this.detailLoaded = true
      this.detail = Object.assign({}, this.detail, data)
      this.multipleTaskSelection = []
    },
    /**
     * 申请变更
     */
    handleModify() {
      if (this.multipleTaskSelection.length <= 0) {
        this.$message.error('请先选择物件')
        return false
      }

      const taskCheckeds = []

      let price, amount

      this.multipleTaskSelection.some((taskItem, taskIndex) => {
        if ([0].indexOf(taskItem.task_status) < 0) {
          const errorName = `[${taskItem.task_id}]: 该物件状态无法申请变更`
          this.$message.error(errorName)
          return true
        }
        taskCheckeds.push(taskItem.task_id)
        price = taskItem.price
        amount = taskItem.amount
        return false
      })

      if (taskCheckeds.length <= 0) {
        return false
      }

      this.tempModify = Object.assign({}, this.tempModify, {
        order_id: this.detail.order_id,
        task_id: taskCheckeds,
        work_price: price,
        work_amount: amount,
        nums: '',
        deliver_date: '',
        reason: ''
      })
      this.dialogStatus = 'modify'
      this.dialogModifyVisible = true
      this.$nextTick(() => {
        this.$refs['modifyDataForm'].clearValidate()
      })
    },
    /**
     * 确认变更
     */
    confirmModify() {
      if (this.posting) {
        return false
      }
      this.$refs['modifyDataForm'].validate((valid) => {
        if (valid) {
          const tempData = JSON.parse(JSON.stringify(this.tempModify))
          this.posting = true
          modifyOrder(tempData)
            .then(async(response) => {
              this.posting = false
              this.$message.success('申请成功')
              this.dialogModifyVisible = false
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {
              console.log(error)
              this.posting = false
            })
        }
      })
    },
    /**
     * 交付验收
     */
    handleDeliver(multi = true) {
      const taskCheckeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择订单')
          return false
        }
        if (this.multipleSelection.length > 1) {
          this.$message.error('只能选择单个交付验收')
          return false
        }

        // const order = this.multipleSelection[0]
        // if (order.work_file.length === 0) {
        //   this.$confirm("<p style='color: red'>请上传作品截图集</p>", '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     dangerouslyUseHTMLString: true
        //   })
        //     .then(() => {
        //       this.$refs.uploadWorkFileElement.$el.click()
        //     })
        //     .catch(() => {})
        //   return false
        // }

        const result = this.multipleSelection.some((orderItem) => {
          return orderItem.tasks.some((taskItem) => {
            if ([0, 4].indexOf(taskItem.task_status) < 0) {
              const errorName = `[${taskItem.task_id}]: 该物件状态无法交付验收`
              this.$message.error(errorName)
              return true
            }
            if (taskItem.display_area.length <= 0) {
              const errorName = `[${taskItem.task_id}]: 请上传该物件的展示图`
              this.$message.error(errorName)
              return true
            }
            taskCheckeds.push({
              task_id: taskItem.task_id,
              file: taskItem.display_area
                .map((product) => {
                  return product.file_id
                })
                .join(',')
            })
            return false
          })
        })
        if (result) {
          return false
        }
      } else {
        if (this.multipleTaskSelection.length <= 0) {
          this.$message.error('请先选择物件')
          return false
        }

        // if (this.detail.work_file.length === 0) {
        //   this.$confirm("<p style='color: red'>请上传作品截图集</p>", '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     dangerouslyUseHTMLString: true
        //   })
        //     .then(() => {
        //       this.$refs.uploadWorkFileElement.$el.click()
        //     })
        //     .catch(() => {})
        //   return false
        // }

        const result = this.multipleTaskSelection.some((taskItem) => {
          // const result = this.detail.tasks.some((taskItem) => {
          if ([0, 4].indexOf(taskItem.task_status) < 0) {
            const errorName = `[${taskItem.task_id}]: 该物件状态无法交付验收`
            this.$message.error(errorName)
            return true
          }
          if (taskItem.display_area.length <= 0) {
            const errorName = `[${taskItem.task_id}]: 请上传该物件的展示图`
            this.$message.error(errorName)
            return true
          }
          taskCheckeds.push({
            task_id: taskItem.task_id,
            file: taskItem.display_area
              .map((product) => {
                return product.file_id
              })
              .join(',')
          })
        })
        if (result) {
          return false
        }
      }

      if (taskCheckeds.length <= 0) {
        return false
      }

      // const workFile = this.detail.work_file
      //   .map((fileItem) => {
      //     return fileItem.file_id
      //   })
      //   .join(',')

      this.tempDeliver = Object.assign({}, this.tempDeliver, {
        order_id: this.detail.order_id,
        tasks: taskCheckeds,
        work_file: ''
      })

      this.dialogDeliverVisible = true
      this.$nextTick(() => {
        this.$refs['deliverDataForm'].clearValidate()
      })

      // this.$confirm(
      //   "<p style='color: red'>如无特殊情况，请完成整个需求卡中的任务后再申请验收</p><p>特殊情况请联系供应商管理部对接人</p>",
      //   '提示',
      //   {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     dangerouslyUseHTMLString: true
      //   }
      // )
      //   .then(() => {
      //     toCheckOrder({ order_id: this.detail.order_id })
      //       .then(async(response) => {
      //         this.$message.success('交付验收成功')
      //         await this.$store.dispatch('user/getPending')
      //         this.getList(false)
      //       })
      //       .catch((_error) => {})
      //   })
      //   .catch(() => {})
    },
    closeDeliverDialog() {
      this.$refs.deliverUploader && this.$refs.deliverUploader.clearFiles()
    },
    /**
     * 确认变更
     */
    confirmDeliver() {
      if (this.posting) {
        return false
      }
      this.$refs['deliverDataForm'].validate((valid) => {
        if (valid) {
          const tempData = JSON.parse(JSON.stringify(this.tempDeliver))
          this.posting = true
          toCheckOrder(tempData)
            .then(async(response) => {
              this.posting = false
              this.$message.success('交付验收成功')
              this.dialogDeliverVisible = false
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {
              this.posting = false
            })
        }
      })
    },
    /**
     * 上传作品
     */
    handleUploadWork(task, taskIndex, demandIndex) {},
    handleUploadWorkSuccess(response, file, fileList, taskIndex, keyName) {
      if (!response.data) {
        this.$message.error(response.message || '哎呀，出错啦')
        return false
      }
      const fileArr =
        keyName === 'display_area'
          ? [
            {
              name: file.name,
              url: file.response ? file.response.data.url : file.url || '',
              file_id: file.response
                ? file.response.data.file_id
                : file.file_id || ''
            }
          ]
          : fileList.map((fileItem) => {
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

      const task = this.detail.tasks[taskIndex]
      const upType = keyName === 'display_area' ? 1 : 0

      uploadWorkImage({
        task_id: task.task_id,
        up_type: upType,
        file_id: fileStr
      })
        .then((response) => {
          this.$set(this.detail.tasks[taskIndex], keyName, fileArr)
          this.$set(
            this.list[this.detailIndex].tasks[taskIndex],
            keyName,
            fileArr
          )
          this.$message.success('上传成功')
        })
        .catch((_error) => {})
    },
    handleUploadWorkError(err, file, fileList) {
      console.log('上传失败', err, file, fileList)
      this.$message.error('上传失败')
    },
    /**
     * 下载作品
     */
    handleDownloadWork(task, taskIndex) {
      if (task.finished_product.length > 0) {
        this.$set(this.detail.tasks[taskIndex], 'downloading', true)
        const actions = task.finished_product.map((product) => {
          return downloadFile({ url: product.url })
        })
        const results = Promise.all(actions)
        results
          .then((data) => {
            data.forEach((file, fileIndex) => {
              downloadFileStream(
                baseName(task.finished_product[fileIndex].url),
                file
              )
            })
            this.$set(this.detail.tasks[taskIndex], 'downloading', false)
          })
          .catch((error) => {
            this.$set(this.detail.tasks[taskIndex], 'downloading', false)
            this.$message.error(error || '哎呀，下载失败啦')
          })
        // task.finished_product.forEach((product) => {
        //   downloadFile({ url: product.url })
        //     .then((response) => {
        //       downloadFileStream(baseName(product.url), response);
        //     })
        //     .catch((_error) => {});
        // });
      }
    },
    /**
     * 上传展示图
     */
    handleUploadPlanImage(task, taskIndex, demandIndex) {},
    handleUploadPlanImageSuccess(response, file, fileList) {
      console.log('上传成功', response, file, fileList)
      this.$notify({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
    },
    handleUploadPlanImageError(err, file, fileList) {
      console.log('上传失败', err, file, fileList)
      this.$notify({
        title: '失败',
        message: '上传失败',
        type: 'error',
        duration: 2000
      })
    },
    /**
     * 驳回原因
     */
    handleRejectTaskReason(task, taskIndex) {
      if (!task.reject) {
        this.$message.error('对不起，没有驳回原因')
        return false
      }
      this.tempTask = JSON.parse(JSON.stringify(task))
      this.$nextTick(() => {
        this.dialogRejectReasonVisible = true
      })
    },
    /**
     * 终止原因
     */
    handleStopTaskReason(task, taskIndex) {
      this.tempTask = JSON.parse(JSON.stringify(task))
      this.dialogStopReasonVisible = true
    },
    /**
     * 重置物件数据
     */
    resetTaskTemp() {
      this.tempTask = {
        order_id: '',
        demand_id: '',
        task_name: '',
        task_image: '',
        work_unit: '',
        work_num: '',
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
      const cat_id = this.detail.demand.cat_id
      const priceData = await queryCategoryPrice({ supplier_id, cat_id }).catch(_error => {})
      if (priceData) {
        this.supplierCategoryPrice = parseFloat(priceData.data.max_price)
      }
      this.tempTaskCategory = this.detail.demand.category
      this.resetTaskTemp()
      this.tempTask = Object.assign({}, this.tempTask, {
        order_id: this.detail.order_id,
        demand_id: this.detail.demand_id,
        extend: this.detail.demand.category.property_array.map((property) => {
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
          addTask(temp).then(async(response) => {
            this.dialogTaskVisible = false
            this.$message.success('新增物件成功')
            await this.$store.dispatch('user/getPending')
            this.getList(false)
          })
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
    downLoadContract(fileName, fileUrl) {
      downloadFile({ url: fileUrl, name: fileName })
        .then((response) => {
          downloadFileStream(fileName, response)
        })
        .catch((_error) => {})
    },
    updateTaskFile(data) {
      this.$set(this.detail.tasks[data.index], data.key, data.value)
    },
    handleUploadWorkFileSuccess(response, file, fileList) {
      if (!response.data) {
        this.$message.error(response.message || '哎呀，出错啦')
        return false
      }
      this.handleUploadWorkFileChange(file, fileList)
    },
    handleUploadWorkFileChange(file, fileList) {
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

      this.tempDeliver = Object.assign({}, this.tempDeliver, {
        work_file: fileStr
      })

      // uploadWorkFile({
      //   order_id: this.detail.order_id,
      //   file_id: fileStr
      // })
      //   .then((response) => {
      //     this.$set(this.detail, 'work_file', fileArr)
      //     this.$set(this.list[this.detailIndex], 'work_file', fileArr)
      //     this.$message.success('上传成功')
      //   })
      //   .catch((_error) => {})
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
        .pending-box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .tag {
            margin-left: 10px;
            font-size: 10px;
            height: 16px;
            line-height: 16px;
            padding: 0 5px;
            box-sizing: border-box;
            border-radius: 6px;
            background-color: #f56c6c;
            border-color: #f56c6c;
            color: #fff;
          }
        }
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
    border-right: 0 !important;
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
  ::v-deep .el-table__body .danger-row {
    color: #f56c6c;
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
</style>
