<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.name"
          placeholder="输入需求名称"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.demand_id"
          placeholder="输入需求单号"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <!-- <el-input
          v-model="listQuery.task_id"
          placeholder="输入物件单号"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        /> -->
        <el-input
          v-model="listQuery.category_name"
          placeholder="输入需求品类"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.tag"
          placeholder="需求属性"
          clearable
          class="filter-item"
          style="width: 200px"
          size="mini"
        >
          <el-option
            v-for="item in tagOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="listQuery.date_range"
          type="daterange"
          class="filter-item"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        />

        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <el-button
          v-permission="[1, 2, 3, 4, 5]"
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExportOrders"
        >
          导出
        </el-button>
      </div>
      <div class="filter-right">
        <!-- <el-button
          v-permission="[1, 3]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >
          新建需求
        </el-button>
        <el-button
          v-permission="[2]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleResolve(true)"
        >
          确认
        </el-button>
        <el-button
          v-permission="[2]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleResolve(false)"
        >
          驳回
        </el-button>
        <el-button
          v-permission="[1]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleResolveTask(true)"
        >
          确认
        </el-button>
        <el-button
          v-permission="[1]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleResolveTask(false)"
        >
          驳回
        </el-button>
        <el-button
          v-permission="[3]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleGongGuanResolveTask(false)"
        >
          驳回
        </el-button>
        <el-popconfirm
          v-permission="[3]"
          style="margin-left: 10px"
          title="确定生成订单吗？"
          @confirm="handleCreateOrder"
        >
          <el-button slot="reference" size="mini" type="primary">
            生成订单
          </el-button>
        </el-popconfirm>
        <el-button
          v-permission="[3]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleFinish"
        >
          终止
        </el-button>
        <el-button
          v-permission="[0]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleToVerifyTask"
        >
          提交审核
        </el-button>
        <el-button
          v-permission="[4]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleResolveOrder(true)"
        >
          通过
        </el-button>
        <el-button
          v-permission="[4]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleResolveOrder(false)"
        >
          驳回
        </el-button> -->
      </div>
    </div>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(237, 244, 253, 0.8)"
      class="list-container"
      :data="list"
      highlight-current-row
      row-key="demand_id"
      :expand-row-keys="expandRowKeys"
      @expand-change="expandChange"
      @row-click="clickRowHandle"
    >
      >
      <el-table-column width="50" align="center">
        <div slot="header" slot-scope="scope">
          <el-checkbox
            v-model="globelCheckedAll"
            @change="clickCheckAll(scope)"
          />
        </div>
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checked"
            @change="handleSelectionChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column type="expand" width="20">
        <template slot-scope="{ row, $index }">
          <div class="expand-table-box">
            <el-table class="task-list" border :data="row.tasks" stripe>
              <el-table-column
                v-if="$store.getters.roles.indexOf(0) < 0"
                label=""
                width="50"
                align="center"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.checked"
                    :disabled="row.status === 10"
                    @change="clickCheckItemFn(row, scope.row)"
                  />
                </template>
              </el-table-column>
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
                </template>
              </el-table-column>
              <el-table-column
                prop="task_name"
                label="物件名称"
                align="center"
                :show-overflow-tooltip="true"
              />
              <!-- <el-table-column
                prop="category_name"
                label="物件品类"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.category | categoryText }}
                </template>
              </el-table-column> -->
              <el-table-column
                prop="deliver_date"
                label="交付日期"
                width="100"
                align="center"
              />
              <el-table-column
                prop="work_unit"
                label="工作单位"
                align="center"
              />
              <el-table-column prop="work_num" label="数量" align="center" />
              <el-table-column prop="work_price" label="单价" align="center" />
              <el-table-column prop="work_amount" label="总价" align="center" />
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
                label="操作"
                align="center"
                min-width="300"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    :loading="scope.row.detailLoading"
                    @click="handleShowTask(scope.row, scope.$index, $index)"
                  >
                    详情
                  </el-button>
                  <!-- <el-button
                    v-if="[4, 6].indexOf(row.status) >= 0"
                    v-permission="[0]"
                    type="primary"
                    size="mini"
                    plain
                    @click="handleUpdateTask(scope.row, scope.$index, $index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="[4, 6].indexOf(row.status) >= 0"
                    v-permission="[0]"
                    type="primary"
                    size="mini"
                    plain
                    @click="handleCopyTask(scope.row, scope.$index, $index)"
                  >
                    复制
                  </el-button>
                  <el-button
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
                  </el-button>
                  <el-popconfirm
                    v-if="[4, 6].indexOf(row.status) >= 0"
                    v-permission="[0]"
                    style="margin-left: 10px"
                    title="确定删除吗？"
                    @confirm="handleDeleteTask(scope.row, scope.$index, $index)"
                  >
                    <el-button slot="reference" size="mini" type="danger" plain>
                      删除
                    </el-button>
                  </el-popconfirm> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="需求订单号"
        align="left"
        min-width="150"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <div class="pending-box">
            <span class="txt">{{ row.demand_id }}</span>
            <span v-if="row.pending > 0" class="tag" />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="需求名称"
        align="center"
        min-width="150"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column
        label="需求品类"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          {{ row.category | categoryText }}
        </template>
      </el-table-column>

      <el-table-column label="物件数量" align="center" width="80">
        <template slot-scope="{ row }">
          {{ row.nums || 0 }}
        </template>
      </el-table-column>

      <el-table-column label="工作总量" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.work_num || 0 }}
        </template>
      </el-table-column>

      <el-table-column label="总金额" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.work_amount || 0 }}
        </template>
      </el-table-column>

      <el-table-column
        label="停留时间"
        align="center"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.stay_time | stayTimeHours }}小时
        </template>
      </el-table-column>

      <el-table-column
        label="当前处理人"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.current_operator }}
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <span :style="{ color: statusColor(row.status) }">
            {{ row.status | statusText }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="$store.getters.roles.indexOf(0) < 0"
        label="操作"
        align="center"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <!-- <el-button
            v-permission="[1, 3]"
            type="primary"
            size="mini"
            plain
            :loading="row.copyLoading"
            @click.stop="handleCopy(row, $index)"
          >
            复制
          </el-button> -->
          <el-button
            v-permission="[1, 2, 3, 4, 5]"
            type="primary"
            size="mini"
            plain
            :loading="row.detailLoading"
            @click.stop="handleDetail(row, $index)"
          >
            详情
          </el-button>
          <el-button
            v-if="row.files.length > 0"
            v-permission="[1, 2, 3, 4, 5]"
            type="primary"
            size="mini"
            style="margin-left: 10px"
            plain
            :loading="row.downloading"
            @click.stop="handleDownloadFiles(row, $index)"
          >
            下载需求附件
          </el-button>
          <!-- <el-button
            v-if="row.is_creator === 1 && [0, 2].indexOf(row.status) >= 0"
            type="primary"
            size="mini"
            plain
            :loading="row.editLoading"
            @click.stop="handleUpdate(row, $index)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.is_creator === 1 && [2].indexOf(row.status) >= 0"
            type="primary"
            size="mini"
            plain
            @click.stop="showReason(row, $index)"
          >
            驳回原因
          </el-button>
          <el-button
            v-if="[6].indexOf(row.status) >= 0"
            v-permission="[0]"
            type="primary"
            size="mini"
            plain
            @click.stop="showReason(row, $index)"
          >
            驳回原因
          </el-button>
          <el-button
            v-if="[9].indexOf(row.status) >= 0"
            v-permission="[3]"
            type="primary"
            size="mini"
            plain
            @click.stop="showReason(row, $index)"
          >
            驳回原因
          </el-button>
          <el-button
            v-if="row.can_assign_supplier === 1 && [3].indexOf(row.status) >= 0"
            type="primary"
            size="mini"
            plain
            :loading="row.assignLoading"
            @click.stop="handleProvider(row, $index)"
          >
            分配供应商
          </el-button>
          <el-button
            v-if="row.can_add_task === 1"
            type="primary"
            size="mini"
            plain
            @click.stop="handleCreateTask(row)"
          >
            新增物件
          </el-button>
          <el-button
            v-if="row.can_add_task === 1"
            type="primary"
            size="mini"
            plain
            @click.stop="handleImportTask(row)"
          >
            导入物件
          </el-button>
          <el-popconfirm
            v-if="row.is_creator === 1 && [0, 1, 2].indexOf(row.status) >= 0"
            style="margin-left: 10px"
            title="确定删除吗？"
            @confirm="handleDelete(row, $index)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="danger"
              plain
              @click.stop
            >
              删除
            </el-button>
          </el-popconfirm>
          <el-popconfirm
            v-if="row.is_creator === 1 && [0, 2].indexOf(row.status) >= 0"
            style="margin-left: 10px"
            title="确定提交审核吗？"
            @confirm="handleToVerify(row, $index)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="primary"
              plain
              @click.stop
            >
              提交审核
            </el-button>
          </el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_num"
      @pagination="getList"
    />

    <!--新增修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        class="dialog-form"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="150px"
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
          style="margin-bottom: 10px"
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
                {{ selectedProcess.budget_dep.budget_used }}/{{
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
                      (selectedProcess.budget_dep.budget_used /
                        selectedProcess.budget_dep.budget) *
                        100
                    )
                  "
                  :status="
                    selectedProcess.budget_dep.budget_used >
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

        <el-form-item label="意向供应商:" prop="supplier">
          <div class="has-secret-notice">
            <el-select
              v-model="temp.supplier"
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
            <div class="secret-notice">仅内部可见</div>
          </div>
        </el-form-item>

        <el-form-item label="备注说明:" prop="remark">
          <div class="has-secret-notice">
            <el-input
              v-model="temp.remark"
              type="textarea"
              placeholder="请输入说明"
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

    <!--驳回原因-->
    <el-dialog
      title="驳回原因"
      :visible.sync="dialogReasonVisible"
      width="600px"
    >
      <div v-if="temp.reject" class="reason-box">
        <div class="content">{{ temp.reject.reason || "" }}</div>
        <div class="user-info">
          <div>驳回人：{{ temp.reject.user }}</div>
          <div>驳回时间：{{ temp.reject.created_at }}</div>
        </div>
      </div>
    </el-dialog>

    <!--详情-->
    <el-dialog title="需求详情" :visible.sync="dialogDetailVisible">
      <el-tabs>
        <el-tab-pane label="详情">
          <el-descriptions
            class="margin-top"
            :column="4"
            :label-style="{ 'font-weight': 'bold', 'align-items': 'center' }"
          >
            <el-descriptions-item label="项目代码">{{
              tempDetail.project ? tempDetail.project.project_name : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="发起部门">{{
              tempDetail.flow ? tempDetail.flow.launch_dep.name : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="核算部门">{{
              tempDetail.flow ? tempDetail.flow.account_dep.name : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="经费使用">
              {{ tempDetail.project ? tempDetail.project.budget_used : 0 }}/{{
                tempDetail.project ? tempDetail.project.budget_cost : 0
              }}
            </el-descriptions-item>
            <el-descriptions-item label="需求创建人">{{
              tempDetail.creator ? tempDetail.creator.name : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="创建时间" span="3">{{
              tempDetail.created_at
            }}</el-descriptions-item>
            <el-descriptions-item label="需求名称" span="3">
              <span>{{ tempDetail.name }}</span>
              <el-tag size="mini" style="margin-left: 10px">{{
                tempDetail.tag | tagText
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="需求单号">{{
              tempDetail.demand_id
            }}</el-descriptions-item>
            <el-descriptions-item label="需求状态" span="4">{{
              tempDetail.status | statusText
            }}</el-descriptions-item>
            <el-descriptions-item label="需求说明" span="4">{{
              tempDetail.introduce
            }}</el-descriptions-item>
            <el-descriptions-item label="需求品类" span="4">{{
              tempDetail.category | categoryText
            }}</el-descriptions-item>
            <el-descriptions-item label="需求附件" span="6">
              <div class="file-box" style="width: 50%">
                <div
                  v-for="(file, fileIndex) in tempDetail.files"
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
            </el-descriptions-item>
            <el-descriptions-item label="意向供应商" span="4">{{
              tempDetail.supplier ? tempDetail.supplier.name : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="备注说明" span="4">{{
              tempDetail.remark
            }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="记录">
          <el-table
            :data="tempDetail.records"
            height="250"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="operator"
              label="操作人"
              width="180"
              align="center"
            />
            <el-table-column
              prop="content"
              label="内容"
              min-width="300"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="created_at"
              min-width="200"
              label="操作时间"
              align="center"
            />
            <el-table-column prop="time" label="耗时" align="center" width="180" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button
          v-if="
            tempDetail.is_creator === 1 &&
              [0, 2].indexOf(tempDetail.status) >= 0
          "
          type="primary"
          size="mini"
          @click="createData(1)"
        >
          提报需求
        </el-button> -->
      </div>
    </el-dialog>

    <!--审批驳回-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="verifyVisible">
      <el-form
        ref="verifyDataForm"
        class="dialog-form"
        :model="tempVerify"
        :rules="verifyRules"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <!-- <el-form-item
          v-if="dialogStatus === 'resolve'"
          label="通过原因:"
          prop="reason"
        >
          <el-input
            v-model="tempVerify.reason"
            type="textarea"
            placeholder="请输入通过原因"
            class="dialog-form-item"
          />
        </el-form-item> -->
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

    <!--终止-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFinishVisible"
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

    <!--新增物件-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogTaskVisible"
      width="70%"
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

            <el-form-item label="工作单位:" prop="work_unit">
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

            <el-form-item label="预估数量:" prop="work_num">
              <el-input
                v-model.number="tempTask.work_num"
                placeholder="请输入预估数量"
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
                <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件，且不超过2M</div>
              </el-upload>
            </el-form-item>
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

    <!--物件详情-->
    <el-dialog
      title="物件详情"
      :visible.sync="dialogTaskDetailVisible"
      width="65%"
      top="20px"
      class="task-detail-dialog"
    >
      <el-tabs v-if="tempTaskDetail.task_id">
        <el-tab-pane label="详情">
          <el-form
            ref="taskDetailForm"
            class="dialog-form"
            :disabled="!taskDetailEditable"
            :model="tempTaskDetail"
            label-position="left"
            label-width="100px"
            style="margin: 0 50px"
          >
            <el-descriptions
              title="需求信息"
              class="margin-top"
              :column="3"
              :label-style="{ 'font-weight': 'bold' }"
            >
              <el-descriptions-item label="流程名称">{{
                tempTaskDetail.process.flow_name
              }}</el-descriptions-item>
              <el-descriptions-item label="流程代码" span="3">{{
                tempTaskDetail.process.bn
              }}</el-descriptions-item>
              <el-descriptions-item label="需求名称">
                <span>{{ tempTaskDetail.demand.name }}</span>
                <el-tag size="mini" style="margin-left: 10px">{{
                  tempTaskDetail.demand.tag | tagText
                }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="需求单号">
                {{ tempTaskDetail.demand.demand_id }}
              </el-descriptions-item>
              <el-descriptions-item label="发起部门">{{
                tempTaskDetail.process.launch_dep.name
              }}</el-descriptions-item>
              <el-descriptions-item label="核算部门" span="3">{{
                tempTaskDetail.process.account_dep.name
              }}</el-descriptions-item>
              <el-descriptions-item label="需求说明" span="6">{{
                tempTaskDetail.demand.introduce
              }}</el-descriptions-item>
              <el-descriptions-item label="需求品类">{{
                tempTaskDetail.category | categoryText
              }}</el-descriptions-item>
              <el-descriptions-item
                label="需求附件"
                span="4"
                :label-style="{ 'align-items': 'center' }"
              >
                <div class="file-box" style="width: 100%">
                  <div
                    v-for="(file, fileIndex) in tempTaskDetail.demand.files"
                    :key="fileIndex"
                    class="file-item"
                  >
                    <div class="file-name">{{ file.name }}</div>
                    <el-button
                      type="primary"
                      :disabled="false"
                      size="mini"
                      plain
                      @click="downLoadContract(file.name, file.url)"
                    >下载</el-button>
                  </div>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <el-row :gutter="20" style="margin-top: 20px">
              <el-col :span="12">
                <el-descriptions
                  title="基础信息"
                  class="margin-top"
                  :column="1"
                  :label-style="{ 'font-weight': 'bold' }"
                >
                  <el-descriptions-item label="缩略图">
                    <img
                      v-if="tempTaskDetail.task_image_url"
                      :src="tempTaskDetail.task_image_url"
                      style="width: 250px; height: 250px"
                      class="task-image"
                    >
                  </el-descriptions-item>
                  <el-descriptions-item label="物件名称">{{
                    tempTaskDetail.task_name
                  }}</el-descriptions-item>
                  <el-descriptions-item label="物件单号">{{
                    tempTaskDetail.task_id
                  }}</el-descriptions-item>
                  <el-descriptions-item label="物件类别">{{
                    tempTaskDetail.category | categoryText
                  }}</el-descriptions-item>
                </el-descriptions>
              </el-col>
              <el-col :span="12">
                <template v-if="taskDetailEditable">
                  <el-descriptions
                    title="属性"
                    class="margin-top"
                    :column="1"
                    :label-style="{ 'font-weight': 'bold' }"
                  />
                  <div class="prop-edit-box">
                    <el-form-item
                      v-for="(property, propIndex) in tempTaskDetail.extends"
                      :key="propIndex"
                      :label="`${property.name}:`"
                      :prop="`extends.${propIndex}.value`"
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
                    >
                      <el-select
                        v-if="property.type === 1"
                        v-model="property.value"
                        class="dialog-form-item"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="(
                            option, optionIndex
                          ) in property.options.split(',')"
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
                  </div>
                </template>

                <el-descriptions
                  v-else
                  title="属性"
                  class="margin-top"
                  :column="1"
                  :label-style="{ 'font-weight': 'bold' }"
                >
                  <el-descriptions-item
                    v-for="(prop, propIndex) in tempTaskDetail.props"
                    :key="propIndex"
                    :label="prop.extend_name"
                  >
                    {{ prop.extend_value }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
            <el-descriptions
              title="供应商及价格"
              class="margin-top"
              style="margin-top: 20px"
              :column="4"
              :label-style="{ 'font-weight': 'bold' }"
            >
              <el-descriptions-item label="供应商名称">{{
                tempTaskDetail.supplier.name
              }}</el-descriptions-item>
              <el-descriptions-item label="合同号">{{
                tempTaskDetail.supplier.pact.bn
              }}</el-descriptions-item>
            </el-descriptions>

            <el-table :data="tempTaskDetail.supplier.contacts" border>
              <el-table-column
                prop="contact_name"
                label="姓名"
                align="center"
              />
              <el-table-column
                prop="contact_mobile"
                label="电话"
                width="180"
                align="center"
              />
              <el-table-column prop="contact_qq" label="qq" align="center" />
              <el-table-column prop="contact_wx" label="微信" align="center" />
              <el-table-column
                prop="contact_email"
                label="邮箱"
                align="center"
              />
              <el-table-column
                prop="contact_position"
                label="职位"
                align="center"
              />
            </el-table>

            <el-table :data="[tempTaskDetail]" border style="margin-top: 20px">
              <el-table-column
                prop="work_unit"
                label="工作单位"
                align="center"
              />
              <el-table-column
                prop="work_num"
                label="数量"
                width="180"
                align="center"
              />
              <el-table-column prop="work_price" label="单价" align="center" />
              <el-table-column prop="work_amount" label="总价" align="center" />
              <el-table-column
                prop="deliver_date"
                label="交付日期"
                align="center"
              />
              <el-table-column
                prop="created_at"
                label="创建时间"
                align="center"
              />
            </el-table>
            <div class="file-title" style="margin-top: 20px">
              <el-form-item prop="display_area" :disabled="false">
                <span
                  slot="label"
                  style="font-size: 16px; font-weight: 700; color: #599cf7"
                >展示图</span>
                <el-upload
                  v-if="taskDetailEditable"
                  class="upload-demo"
                  :action="`/api/tools/upfile`"
                  :on-success="handleAddTaskDisplayAreaSucc"
                  :show-file-list="false"
                  :file-list="tempTaskDetail.display_area"
                >
                  <el-button size="mini" type="primary">上传</el-button>
                </el-upload>
              </el-form-item>
            </div>
            <div class="file-box display-area">
              <div
                v-for="(image, imageIndex) in tempTaskDetail.display_area"
                :key="imageIndex"
                class="img-item"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="image.url"
                />
                <div class="img-actions">
                  <span
                    class="btn-item"
                    @click="handlePictureCardPreview(image)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    class="btn-item"
                    @click="downLoadContract(image.name, image.url)"
                  >
                    <i class="el-icon-download" />
                  </span>
                  <span
                    v-if="taskDetailEditable"
                    class="btn-item"
                    @click="deleteTaskDisplayArea(imageIndex)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </div>
              </div>
            </div>
            <div class="file-title" style="margin-top: 20px">
              <el-form-item prop="finished_product" :disabled="false">
                <span
                  slot="label"
                  style="font-size: 16px; font-weight: 700; color: #599cf7"
                >作品</span>
                <el-upload
                  v-if="taskDetailEditable"
                  class="upload-demo"
                  :action="`${$baseUrl}/api/tools/upfile`"
                  :on-success="handleAddTaskFinishedProductSucc"
                  :show-file-list="false"
                  :file-list="tempTaskDetail.finished_product"
                >
                  <el-button size="mini" type="primary">上传</el-button>
                </el-upload>
              </el-form-item>
            </div>
            <div class="file-box" style="width: 100%">
              <div
                v-for="(file, fileIndex) in tempTaskDetail.finished_product"
                :key="fileIndex"
                class="file-item"
              >
                <div class="file-name">{{ file.name }}</div>
                <div class="btns">
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="downLoadContract(file.name, file.url)"
                  >下载</el-button>
                  <el-button
                    v-if="taskDetailEditable"
                    type="danger"
                    size="mini"
                    plain
                    @click="deleteTaskFinishedProduct(fileIndex)"
                  >删除</el-button>
                </div>
              </div>
            </div>
            <div
              v-if="taskDetailEditable"
              class="dialog-footer"
              style="
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-top: 20px;
              "
            >
              <el-button size="mini" @click="dialogTaskDetailVisible = false">
                取消
              </el-button>
              <el-button type="primary" size="mini" @click="confirmTaskDetail">
                确认
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="操作记录">
          <el-table
            :data="tempTaskDetail.records"
            height="500"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="operator"
              label="操作人"
              width="180"
              align="center"
            />
            <el-table-column
              prop="content"
              label="内容"
              min-width="300"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="created_at"
              min-width="200"
              label="操作时间"
              align="center"
            />
            <el-table-column prop="time" label="耗时" align="center" width="180" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--终止原因-->
    <el-dialog
      title="终止原因"
      :visible.sync="dialogStopReasonVisible"
      width="600px"
    >
      <el-form
        label-position="left"
        label-width="100px"
        style="margin: 0 50px"
        :rules="finishRules"
      >
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
    <el-dialog :visible.sync="dialogImageVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
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
  batchAddTasks
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
import { fetchAllMember } from '@/api/system/member'
import { fetchAllProvider } from '@/api/provider/index'
import { fetchAllCategory } from '@/api/system/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { downloadFile } from '@/api/system/file'
import { previewFile, downloadFileStream, baseName } from '@/utils/index'
import TaskDetail from '@/components/TaskDetail'
import { exportOrders } from '@/api/system/download'

const tagList = [
  { id: 0, name: '正式包' },
  { id: 1, name: '测试包' },
  { id: 2, name: '外派' },
  { id: 3, name: '动态团队' }
]

export default {
  name: 'DemandList',
  components: { Pagination, TaskDetail },
  directives: { waves, permission },
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
    operatorText(status) {
      const statusMap = {
        0: '项目组',
        1: '项目组负责人',
        2: '项目组',
        3: '供管',
        4: '供应商',
        5: '项目组',
        6: '供应商',
        7: '供管',
        8: '供管负责人',
        9: '供管',
        10: '供应商'
      }
      return statusMap[status]
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
    taskStatusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
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
    stayTimeHours(seconds) {
      const diff = parseInt(seconds)
      if (isNaN(diff)) {
        return 0
      }

      return Math.round(+(diff / 3600) + 'e' + 1) / Math.pow(10, 1)
    }
  },
  data() {
    // const validateMobile = (rule, value, callback) => {
    //   if (value) {
    //     const reg = /^1\d{10}$/

    //     if (reg.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('手机号填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }

    return {
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
      globelCheckedAll: false,
      expandRowKeys: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        demand_id: '',
        task_id: '',
        category_name: '',
        tag: '',
        date_range: [],
        page: 1,
        page_num: 10,
        all: true
      },
      dialogStatus: '',
      dialogFormVisible: false,
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
        import_task: '导入物件'
      },
      rules: {
        process_id: [
          { required: true, message: '请选择需求用途', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入需求名称', trigger: 'blur' }],
        category_id: [
          { required: true, message: '请选择需求品类', trigger: 'change' }
        ]
      },
      posting: false,
      processLoading: false,
      process: [],
      members: [],
      demandVerifyMembers: [],
      providers: [],
      categorys: [],
      fileList: [],
      dialogReasonVisible: false,
      dialogDetailVisible: false,
      tempDetail: {
        demand_id: ''
      },
      dialogVerifyVisible: false,
      dialogVerifyTaskVisible: false,
      dialogVerifyOrderVisible: false,
      tempVerify: {
        reason: ''
      },
      verifyRules: {},
      verifyStatus: false,
      dialogRejectTaskVisible: false,
      dialogProviderVisible: false,
      providerRules: {
        supplier_id: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ]
      },
      tempProvider: {
        demand_id: '',
        supplier_id: '',
        supplier_file: ''
      },
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
      dialogTaskVisible: false,
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
          { required: true, message: '请选择工作单位', trigger: 'change' }
        ],
        work_num: [
          {
            required: true,
            type: 'integer',
            message: '请输入预估数量',
            trigger: 'blur'
          }
        ],
        deliver_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        value: [{ required: true, message: '请设置属性值', trigger: 'blur' }]
      },
      dialogImportTaskVisible: false,
      tempImportTask: {
        demand_id: '',
        tasks: []
      },
      importTaskRules: {},
      tempImportTaskFileName: '',
      dialogTaskDetailVisible: false,
      tempTaskDetail: {
        extends: []
      },
      dialogStopReasonVisible: false,
      demandFileList: [],
      demandSupplierFileList: [],
      dialogImageUrl: '',
      dialogImageVisible: false
    }
  },
  computed: {
    taskDetailEditable: function() {
      if (this.tempTaskDetail.demand) {
        return (
          this.$store.getters.roles.indexOf(0) >= 0 &&
          [4, 6].indexOf(this.tempTaskDetail.demand.status) >= 0
        )
      }
      return false
    },
    verifyVisible: {
      get() {
        return (
          this.dialogVerifyVisible ||
          this.dialogVerifyTaskVisible ||
          this.dialogRejectTaskVisible ||
          this.dialogVerifyOrderVisible
        )
      },
      set(newValue) {
        this.dialogVerifyVisible = newValue
        this.dialogVerifyTaskVisible = newValue
        this.dialogRejectTaskVisible = newValue
        this.dialogVerifyOrderVisible = newValue
      }
    },
    displayAreaList: function() {
      return this.tempTaskDetail.display_area.map((item) => {
        return item.url
      })
    }
  },
  created() {
    // this.fetchCategorys();
    this.getList()
  },
  methods: {
    expandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => {
        return row.demand_id
      })
    },
    clickRowHandle(row, column, event) {
      if (this.expandRowKeys.includes(row.demand_id)) {
        this.expandRowKeys = this.expandRowKeys.filter(
          (val) => val !== row.demand_id
        )
      } else {
        this.expandRowKeys.push(row.demand_id)
      }
    },
    /**
     * 获取需求列表
     */
    getList(needLoading = true) {
      if (needLoading) {
        this.listLoading = true
      }

      fetchList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.total = response.data.total
          let list = response.data.list
          if (this.$store.getters.pendings['/demand/index']) {
            const pendings =
              this.$store.getters.pendings['/demand/index'].children
            list = response.data.list.map((listItem) => {
              listItem.pending = pendings[listItem.demand_id] || 0
              // 是否已选中
              const demandIndex = this.list.findIndex(
                (demandItem) => demandItem.demand_id === listItem.demand_id
              )
              if (demandIndex >= 0) {
                listItem.checked = this.list[demandIndex].checked === true
                listItem.tasks = listItem.tasks.map((child) => {
                  const taskIndex = this.list[demandIndex].tasks.findIndex(
                    (taskItem) => taskItem.task_id === child.task_id
                  )
                  if (taskIndex >= 0) {
                    child.checked =
                      this.list[demandIndex].tasks[taskIndex].checked === true
                  }
                  return child
                })
              }
              return listItem
            })
          }
          this.list = list
          this.updateCheckedAllBtnStatus()
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
      this.getList()
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
        remark: '',
        status: 0
      }
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
        .catch((error) => {})
    },
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
        .catch((error) => {})

      fetchProcessVerifyMember({ process_id: process })
        .then((response) => {
          this.demandVerifyMembers = response.data.list
        })
        .catch((error) => {})

      fetchAllProvider({ process_id: process, status: 1 })
        .then((response) => {
          this.providers = response.data.list
        })
        .catch((error) => {})
    },
    /**
     * 获取属性列表
     */
    fetchCategorys() {
      fetchAllCategory()
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
        .catch((error) => {})
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
    handleAddDemandFileSucc(response, file, fileList) {
      this.handleDemandFileChange(file, fileList)
    },
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
            .then((response) => {
              this.posting = false
              const checkedNodes =
                this.$refs.categoryCascader.getCheckedNodes()
              if (checkedNodes.length > 0) {
                temp.category = `${checkedNodes[0].pathLabels[0]}/${checkedNodes[0].pathLabels[1]}/${checkedNodes[0].pathLabels[2]}`
              } else {
                temp.category = ''
              }

              if (
                this.dialogStatus === 'create' ||
                this.dialogStatus === 'copy'
              ) {
                temp.demand_id = response.data.id
                temp.current_operator = response.data.current_operator
                temp.is_creator = 1
                this.list.unshift(temp)
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              } else if (this.dialogStatus === 'update') {
                const index = this.list.findIndex(
                  (v) => v.demand_id === temp.demand_id
                )
                this.list.splice(index, 1, temp)
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
              } else if (this.dialogStatus === 'detail') {
                const index = this.list.findIndex(
                  (v) => v.demand_id === temp.demand_id
                )
                this.list.splice(index, 1, temp)
                this.dialogDetailVisible = false
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
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
    async handleUpdate(row, index) {
      this.list.splice(index, 1, Object.assign({}, row, { editLoading: true }))
      try {
        const processData = await fetchAllProcess({
          create_needs_permission: 1
        })
        this.process = processData.data.list || []

        const categoryData = await fetchProcessCategory({
          process_id: row.process_id
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
          process_id: row.process_id
        })
        this.demandVerifyMembers = verifyMemberData.data.list

        const providerData = await fetchAllProvider({
          process_id: row.process_id,
          status: 1
        })
        this.providers = providerData.data.list
      } catch (error) {
        console.log(error)
        this.list.splice(
          index,
          1,
          Object.assign({}, row, { editLoading: false })
        )
        this.$notify({
          title: '失败',
          message: '修改失败',
          type: 'error',
          duration: 2000
        })
      }
      this.list.splice(
        index,
        1,
        Object.assign({}, row, { editLoading: false })
      )
      this.temp = Object.assign({}, row, {
        tag: parseInt(row.tag),
        supplier: parseInt(row.supplier)
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
     * 修改需求
     */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateDemand(tempData)
            .then(() => {
              const index = this.list.findIndex(
                (v) => v.demand_id === tempData.demand_id
              )
              const checkedNodes =
                this.$refs.categoryCascader.getCheckedNodes()
              if (checkedNodes.length > 0) {
                tempData.category_name = checkedNodes[0].pathLabels[2]
              } else {
                tempData.category_name = ''
              }
              this.list.splice(index, 1, tempData)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch((error) => {})
        }
      })
    },
    /**
     * 复制需求弹窗
     */
    async handleCopy(row, index) {
      this.list.splice(index, 1, Object.assign({}, row, { copyLoading: true }))
      try {
        const processData = await fetchAllProcess({
          create_needs_permission: 1
        })
        this.process = processData.data.list || []

        const categoryData = await fetchProcessCategory({
          process_id: row.process_id
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
          process_id: row.process_id
        })
        this.demandVerifyMembers = verifyMemberData.data.list

        const providerData = await fetchAllProvider({
          process_id: row.process_id,
          status: 1
        })
        this.providers = providerData.data.list
      } catch (error) {
        console.log(error)
        this.list.splice(
          index,
          1,
          Object.assign({}, row, { copyLoading: false })
        )
        this.$message.error('复制失败')
      }
      this.list.splice(
        index,
        1,
        Object.assign({}, row, { copyLoading: false })
      )
      this.temp = Object.assign(
        {},
        {
          project_id: this.process.length > 0 ? row.project_id : '',
          process_id: this.process.length > 0 ? row.process_id : '',
          name: row.name || '',
          introduce: row.introduce || '',
          cat_id: row.cat_id || '',
          file: row.file || '',
          files: row.files || [],
          remark: row.remark || '',
          tag: parseInt(row.tag) || '',
          supplier: parseInt(row.supplier) || ''
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
      this.dialogStatus = 'copy'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 提交审核
     */
    handleToVerify(row, index) {
      toVerifyDemand({ demand_id: row.demand_id })
        .then(async(response) => {
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            duration: 2000
          })
          // this.$set(this.list[index], 'status', response.data.status)
          // this.$set(
          //   this.list[index],
          //   'current_operator',
          //   response.data.current_operator
          // )
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((error) => {})
    },
    /**
     * 删除需求
     */
    handleDelete(row, index) {
      deleteDemand({ demand_id: row.demand_id })
        .then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
        .catch((error) => {})
    },
    /**
     * 上传文件成功
     */
    handleAddFileSucc(response, file, fileList) {
      const files = fileList
        .map((fileItem) => {
          return fileItem.name
        })
        .join(',')
      this.temp = Object.assign({}, this.temp, { file: files })
    },
    /**
     * 查看驳回原因
     */
    showReason(row, index) {
      if (!row.reject) {
        this.$message.error('对不起，没有驳回原因')
        return false
      }
      this.temp = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.dialogReasonVisible = true
      })
    },
    /**
     * 需求详情弹窗
     */
    async handleDetail(row, index) {
      this.list.splice(
        index,
        1,
        Object.assign({}, row, { detailLoading: true })
      )
      const detailData = await fetchDemandDetail({
        demand_id: row.demand_id
      }).catch((error) => {
        console.log(error)
        this.list.splice(
          index,
          1,
          Object.assign({}, row, { detailLoading: false })
        )
      })

      this.temp = Object.assign({}, row)
      this.tempDetail = Object.assign({}, detailData.data)
      this.dialogStatus = 'detail'
      this.dialogDetailVisible = true
      this.list.splice(
        index,
        1,
        Object.assign({}, row, { detailLoading: false })
      )
    },
    /**
     * 审批弹窗
     */
    handleResolve(ok) {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          if (listItem.checked) {
            if (listItem.status !== 1) {
              const errorName = `[${listItem.name}] 该需求并不是待审核状态，无法审核`
              this.$message.error(errorName)
              return true
            }
            checkeds.push(listItem.demand_id)
            return false
          }
          return false
        })
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
      } else {
        return false
      }

      this.dialogStatus = ok === true ? 'resolve' : 'reject'
      if (ok) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
      } else {
        this.verifyRules = Object.assign({}, this.verifyRules, {
          reason: [
            { required: true, message: '请输入驳回原因', trigger: 'blur' }
          ]
        })
      }
      this.dialogVerifyVisible = true
      this.$nextTick(() => {
        this.$refs['verifyDataForm'].clearValidate()
      })
    },
    /**
     * 审批确认
     */
    confirmVerify() {
      this.$refs['verifyDataForm'].validate((valid) => {
        if (valid) {
          const checkeds = []
          const checkedIndexs = []

          let baseError
          let checkStatus
          let status
          let verifyFunc

          if (this.dialogVerifyVisible === true) {
            baseError = '该需求并不是待审核状态，无法审核'
            checkStatus = [1]
            status = this.dialogStatus === 'resolve' ? 3 : 2
            verifyFunc = verifyDemand
          } else if (this.dialogVerifyTaskVisible === true) {
            baseError = '该需求并不是物件待审核状态，无法审核'
            checkStatus = [5]
            status = this.dialogStatus === 'resolve' ? 7 : 6
            verifyFunc = verifyTask
          } else if (this.dialogRejectTaskVisible === true) {
            baseError = '该需求并不是待生成订单状态，无法驳回'
            checkStatus = [7]
            status = 6
            verifyFunc = rejectDemand
          } else if (this.dialogVerifyOrderVisible === true) {
            baseError = '该需求并不是订单待审核状态，无法审核'
            checkStatus = [8]
            status = this.dialogStatus === 'resolve' ? 10 : 9
            verifyFunc = verifyOrder
          } else {
            this.$message.error('审核失败啦')
            return false
          }

          if (
            !this.list.some((listItem, listIndex) => {
              if (listItem.checked) {
                if (checkStatus.indexOf(listItem.status) < 0) {
                  this.$message.error(`[${listItem.name}] ${baseError}`)
                  return true
                }
                checkeds.push(listItem.demand_id)
                checkedIndexs.push(listIndex)
                return false
              }
              return false
            })
          ) {
            if (checkeds.length <= 0) {
              this.$message.error('请先选择需求')
              return false
            }
          } else {
            return false
          }

          verifyFunc({
            demand_id: checkeds,
            status,
            reason: this.tempVerify.reason
          })
            .then(async(response) => {
              // response.data.list.forEach((statusItem) => {
              //   const index = this.list.findIndex(
              //     (listItem) => listItem.demand_id === statusItem.demand_id
              //   )
              //   if (index >= 0) {
              //     this.$set(this.list[index], 'status', statusItem.status)
              //     this.$set(
              //       this.list[index],
              //       'current_operator',
              //       statusItem.current_operator
              //     )
              //   }
              // })
              this.dialogVerifyVisible = false
              this.dialogVerifyTaskVisible = false
              this.dialogRejectTaskVisible = false
              this.dialogVerifyOrderVisible = false
              this.$message.success('操作成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {})
        }
      })
    },
    /**
     * 物件审核弹窗
     */
    handleResolveTask(ok) {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          if (listItem.checked) {
            if ([5].indexOf(listItem.status) < 0) {
              const errorName = `[${listItem.name}] 该需求状态错误，无法审核`
              this.$message.error(errorName)
              return true
            }
            checkeds.push(listItem.demand_id)
            return false
          }
          return false
        })
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
      } else {
        return false
      }

      this.dialogStatus = ok === true ? 'resolve' : 'reject'
      if (ok) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
      } else {
        this.verifyRules = Object.assign({}, this.verifyRules, {
          reason: [
            { required: true, message: '请输入驳回原因', trigger: 'blur' }
          ]
        })
      }
      this.dialogVerifyTaskVisible = true
      this.$nextTick(() => {
        this.$refs['verifyDataForm'].clearValidate()
      })
    },
    /**
     * 供管驳回待生成订单的需求
     */
    handleGongGuanResolveTask() {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          if (listItem.checked) {
            if (listItem.status !== 7) {
              const errorName = `[${listItem.name}] 该需求并不是待生成订单状态，无法驳回`
              this.$message.error(errorName)
              return true
            }
            checkeds.push(listItem.demand_id)
            return false
          }
          return false
        })
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
      } else {
        return false
      }

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
     * 订单审核弹窗
     */
    handleResolveOrder(ok) {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          if (listItem.checked) {
            if ([8].indexOf(listItem.status) < 0) {
              const errorName = `[${listItem.name}] 该需求状态错误，无法审核`
              this.$message.error(errorName)
              return true
            }
            checkeds.push(listItem.demand_id)
            return false
          }
          return false
        })
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
      } else {
        return false
      }

      this.dialogStatus = ok === true ? 'resolve' : 'reject'
      if (ok) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
      } else {
        this.verifyRules = Object.assign({}, this.verifyRules, {
          reason: [
            { required: true, message: '请输入驳回原因', trigger: 'blur' }
          ]
        })
      }
      this.dialogVerifyOrderVisible = true
      this.$nextTick(() => {
        this.$refs['verifyDataForm'].clearValidate()
      })
    },
    /**
     * 分配供应商弹窗
     */
    async handleProvider(row, index) {
      this.list.splice(
        index,
        1,
        Object.assign({}, row, { assignLoading: true })
      )
      try {
        const providerData = await fetchAllProvider({
          process_id: row.process_id,
          status: 1
        })
        this.providers = providerData.data.list
        this.list.splice(
          index,
          1,
          Object.assign({}, row, { assignLoading: false })
        )
        this.tempProvider = Object.assign({}, this.tempProvider, {
          demand_id: row.demand_id,
          supplier_id: '',
          supplier_file: ''
        })
        this.dialogProviderVisible = true
      } catch (error) {
        console.log(error)
        this.list.splice(
          index,
          1,
          Object.assign({}, row, { assignLoading: false })
        )
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
            .catch((error) => {})
        }
      })
    },
    /**
     * 全选所有
     */
    clickCheckAll(item) {
      this.list = this.list.map((val) => {
        val.checked = this.globelCheckedAll
        val.tasks = val.tasks.map((i) => {
          i.checked = this.globelCheckedAll
          return i
        })
        return val
      })
      this.updateCheckedAllBtnStatus()
    },
    /**
     * 手动更改全选按钮的状态
     */
    updateCheckedAllBtnStatus() {
      this.list = JSON.parse(JSON.stringify(this.list))
    },
    /**
     * 每行选择事件
     */
    handleSelectionChange(val) {
      val.tasks = val.tasks.map((i) => {
        i.checked = val.checked
        return i
      })
      if (val.checked) {
        const globelCheckedAll = this.list.every((v) => v.checked)
        if (globelCheckedAll) {
          this.globelCheckedAll = true
        }
      } else {
        this.globelCheckedAll = false
      }
      this.updateCheckedAllBtnStatus()
    },
    /**
     * 每个小项选择事件-单选
     */
    clickCheckItemFn(row, item) {
      // 如果是选了勾选
      if (item.checked) {
        // 检查是否所有数据都手动勾选了
        const isAllChecked = row.tasks.every((v) => v.checked)
        if (isAllChecked) {
          row.checked = true
          const globelCheckedAll = this.list.every((v) => v.checked)
          if (globelCheckedAll) {
            this.globelCheckedAll = true
          }
        }
      } else {
        row.checked = false
        this.globelCheckedAll = false
      }
      this.updateCheckedAllBtnStatus()
    },
    /**
     * 预制订单弹窗
     */
    handleCreateOrder() {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          if (listItem.checked) {
            if ([7, 9].indexOf(listItem.status) < 0) {
              const errorName = `[${listItem.name}]: 该需求状态错误`
              this.$message.error(errorName)
              return true
            }
            checkeds.push(listItem.demand_id)
            return false
          }
          return false
        })
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
      } else {
        return false
      }

      createOrder({ demand_id: checkeds })
        .then(async(response) => {
          // response.data.list.forEach((statusItem) => {
          //   const index = this.list.findIndex(
          //     (listItem) => listItem.demand_id === statusItem.demand_id
          //   )
          //   if (index >= 0) {
          //     this.$set(this.list[index], 'status', statusItem.status)
          //     this.$set(
          //       this.list[index],
          //       'current_operator',
          //       statusItem.current_operator
          //     )
          //   }
          // })
          this.$message.success('订单生成成功')
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((error) => {})
    },
    /**
     * 终止弹窗
     */
    handleFinish() {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          if (listItem.checked) {
            if (listItem.status !== 7) {
              const errorName = `[${listItem.name}] 该需求并不是待生成订单状态，无法终止`
              this.$message.error(errorName)
              return true
            }
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
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择物件')
          return false
        }
      } else {
        return false
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
              // const finishData = response.data
              // finishData.forEach((finishItem) => {
              //   const { demand_id, task_id, status } = finishItem
              //   const demandIndex = this.list.findIndex(
              //     (demandItem) => demandItem.demand_id === demand_id
              //   )
              //   if (demandIndex >= 0) {
              //     const taskIndex = this.list[demandIndex].tasks.findIndex(
              //       (taskItem) => taskItem.task_id === task_id
              //     )
              //     if (taskIndex >= 0) {
              //       this.$set(
              //         this.list[demandIndex].tasks[taskIndex],
              //         'task_status',
              //         status
              //       )
              //       this.$set(
              //         this.list[demandIndex].tasks[taskIndex],
              //         'stop_file',
              //         temp.files
              //       )
              //     }
              //   }
              // })
              this.$notify({
                title: '成功',
                message: '终止成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFinishVisible = false
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {})
        }
      })
    },
    /**
     * 物件提交审核
     */
    handleToVerifyTask() {
      const checkeds = []
      let hasError = false
      if (
        !this.list.some((listItem) => {
          if (listItem.checked) {
            if ([4, 6].indexOf(listItem.status) < 0) {
              const errorName = `[${listItem.name}]: 该需求状态无法提交审核物件`
              this.$message.error(errorName)
              hasError = true
              return true
            }

            return listItem.tasks.some((taskItem) => {
              if (taskItem.checked) {
                if (taskItem.task_status !== 0) {
                  const errorName = `[${taskItem.task_name}] 该物件不是正常状态，无法提交审核`
                  this.$message.error(errorName)
                  hasError = true
                  return true
                }
                checkeds.push(taskItem.task_id)
                return false
              }
              return false
            })
          }

          return false
        })
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择需求')
          return false
        }
      } else {
        if (hasError === false) {
          this.$message.error('请先选择需要求')
        }
        return false
      }

      toVerifyTask({
        task_id: checkeds
      })
        .then(async(response) => {
          // response.data.list.forEach((statusItem) => {
          //   const index = this.list.findIndex(
          //     (listItem) => listItem.demand_id === statusItem.demand_id
          //   )
          //   if (index >= 0) {
          //     this.$set(this.list[index], 'status', statusItem.status)
          //     this.$set(this.list[index], 'can_add_task', 0)
          //     this.$set(
          //       this.list[index],
          //       'current_operator',
          //       statusItem.current_operator
          //     )
          //   }
          // })
          this.$message.success('操作成功')
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((error) => {})
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
        deliver_date: '',
        remark: '',
        extend: []
      }
    },
    /**
     * 新增物件弹窗
     */
    handleCreateTask(demand) {
      this.tempTaskCategory = demand.category
      this.resetTaskTemp()
      this.tempTask = Object.assign({}, this.tempTask, {
        demand_id: demand.demand_id,
        extend: demand.category.property_array.map((property) => {
          return {
            name: property.extend_name,
            value: '',
            type: property.extend_tag,
            options: property.extend_value
          }
        })
      })
      this.dialogStatus = 'create_task'
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
              // const {
              //   id,
              //   work_price,
              //   work_amount,
              //   props,
              //   demand_nums,
              //   demand_work_num,
              //   demand_work_amount
              // } = response.data
              // temp.task_id = id
              // temp.task_status = 0
              // temp.props = props
              // let demandIndex = -1
              // this.list.some((listItem, listIndex) => {
              //   if (listItem.demand_id === temp.demand_id) {
              //     demandIndex = listIndex
              //     return true
              //   }
              //   return false
              // })

              // if (demandIndex >= 0) {
              //   temp.category = this.tempTaskCategory
              //   temp.work_price = work_price
              //   temp.work_amount = work_amount
              //   this.list[demandIndex].tasks.unshift(temp)
              //   this.$set(this.list[demandIndex], 'nums', demand_nums)
              //   this.$set(this.list[demandIndex], 'work_num', demand_work_num)
              //   this.$set(
              //     this.list[demandIndex],
              //     'work_amount',
              //     demand_work_amount
              //   )
              // }
              this.dialogTaskVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {})
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
              // const {
              //   id,
              //   work_price,
              //   work_amount,
              //   props,
              //   demand_nums,
              //   demand_work_num,
              //   demand_work_amount
              // } = response.data
              // const demandIndex = this.list.findIndex(
              //   (v) => v.demand_id === temp.demand_id
              // )
              // const taskIndex = this.list[demandIndex].tasks.findIndex(
              //   (v) => v.task_id === temp.task_id
              // )
              // temp.work_amount = work_amount

              // this.list[demandIndex].tasks.splice(taskIndex, 1, temp)
              // this.$set(this.list[demandIndex], 'nums', demand_nums)
              // this.$set(this.list[demandIndex], 'work_num', demand_work_num)
              // this.$set(
              //   this.list[demandIndex],
              //   'work_amount',
              //   demand_work_amount
              // )
              this.dialogTaskVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {})
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
     * 导入物件弹窗
     */
    handleImportTask(demand) {
      this.tempImportTask = Object.assign({}, this.tempImportTask, {
        demand_id: demand.demand_id,
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
              // const demandIndex = this.list.findIndex(
              //   (v) => v.demand_id === temp.demand_id
              // )

              // if (demandIndex >= 0) {
              //   this.$set(
              //     this.list[demandIndex],
              //     'tasks',
              //     this.list[demandIndex].tasks.concat(response.data.tasks)
              //   )
              //   this.$set(this.list[demandIndex], 'nums', response.data.nums)
              //   this.$set(
              //     this.list[demandIndex],
              //     'work_num',
              //     response.data.work_num
              //   )
              //   this.$set(
              //     this.list[demandIndex],
              //     'work_amount',
              //     response.data.work_amount
              //   )
              // }

              this.dialogImportTaskVisible = false
              this.$message.success('导入成功')
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {})
        }
      })
    },
    /**
     * 物件详情弹窗
     */
    async handleShowTask(task, taskIndex, demandIndex) {
      this.$set(this.list[demandIndex].tasks[taskIndex], 'detailLoading', true)
      try {
        const detailData = await fetchTaskDetail({ task_id: task.task_id })

        const news = { extends: [] }
        const category = detailData.data.category || []
        if (category.property_array.length > 0) {
          news.extends = category.property_array.map((property) => {
            let value = ''
            if (detailData.data.props.length > 0) {
              const propIndex = detailData.data.props.findIndex(
                (prop) => prop.extend_name === property.extend_name
              )
              if (propIndex >= 0) {
                value = detailData.data.props[propIndex].extend_value
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

        this.tempTaskDetail = Object.assign({}, detailData.data, news)
        this.dialogTaskDetailVisible = true
        this.$set(
          this.list[demandIndex].tasks[taskIndex],
          'detailLoading',
          false
        )
      } catch (error) {
        this.$set(
          this.list[demandIndex].tasks[taskIndex],
          'detailLoading',
          false
        )
        this.$message.error(detailData.message || '哎呀，出错啦')
      }
    },
    /**
     * 上传物件展示图成功
     */
    handleAddTaskDisplayAreaSucc(response, file, fileList) {
      this.$set(
        this.tempTaskDetail,
        'display_area',
        fileList.map((file) => {
          let { file_id, name, url, response } = file
          if (response) {
            file_id = response.data.file_id
            url = response.data.url
          }
          return { file_id, name, url }
        })
      )
    },
    /**
     * 删除物件展示图
     */
    deleteTaskDisplayArea(fileIndex) {
      this.tempTaskDetail.display_area.splice(fileIndex, 1)
    },
    /**
     * 删除物件作品
     */
    deleteTaskFinishedProduct(fileIndex) {
      this.tempTaskDetail.finished_product.splice(fileIndex, 1)
    },
    /**
     * 物件详情弹窗确认
     */
    confirmTaskDetail() {
      const temp = JSON.parse(JSON.stringify(this.tempTaskDetail))
      const task_id = temp.task_id
      const demand_id = temp.demand_id
      const extend = temp.extends.map((extend) => {
        return { name: extend.name, value: extend.value }
      })
      const display_area = temp.display_area
        .map((display_area_item) => {
          return display_area_item.file_id
        })
        .join(',')
      const finished_product = temp.finished_product
        .map((finished_product_item) => {
          return finished_product_item.file_id
        })
        .join(',')
      updateTask({ demand_id, task_id, extend, display_area, finished_product })
        .then(() => {
          const demandIndex = this.list.findIndex(
            (v) => v.demand_id === temp.demand_id
          )
          const taskIndex = this.list[demandIndex].tasks.findIndex(
            (v) => v.task_id === temp.task_id
          )

          this.list[demandIndex].tasks.splice(taskIndex, 1, temp)
          this.dialogTaskVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch((error) => {})
    },
    /**
     * 上传物件作品成功
     */
    handleAddTaskFinishedProductSucc(response, file, fileList) {
      this.$set(
        this.tempTaskDetail,
        'finished_product',
        fileList.map((file) => {
          let { file_id, name, url, response } = file
          if (response) {
            file_id = response.data.file_id
            url = response.data.url
          }
          return { file_id, name, url }
        })
      )
    },
    /**
     * 修改物件弹窗
     */
    handleUpdateTask(task, taskIndex, demandIndex) {
      const demand = this.list[demandIndex]
      if (demand) {
        let extend
        const category = demand.category
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

        this.tempTaskCategory = demand.category
        this.tempTask = Object.assign({}, task, {
          extend
        })
        this.dialogStatus = 'update_task'
        this.dialogTaskVisible = true
        this.$nextTick(() => {
          this.$refs['taskDataForm'].clearValidate()
        })
      }
    },
    /**
     * 删除物件弹窗
     */
    handleDeleteTask(task, taskIndex, demandIndex) {
      deleteTask({ task_id: task.task_id })
        .then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list[demandIndex].tasks.splice(taskIndex, 1)
        })
        .catch((error) => {})
    },
    /**
     * 复制物件弹窗
     */
    handleCopyTask(task, taskIndex, demandIndex) {
      const demand = this.list[demandIndex]
      if (demand) {
        let extend
        const category = demand.category
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

        this.tempTaskCategory = demand.category
        this.tempTask = Object.assign({}, task, {
          extend
        })
        this.dialogStatus = 'create_task'
        this.dialogTaskVisible = true
        this.$nextTick(() => {
          this.$refs['taskDataForm'].clearValidate()
        })
      }
    },
    /**
     * 终止物件原因弹窗
     */
    handleStopTaskReason(task, taskIndex, demandIndex) {
      this.tempTask = JSON.parse(JSON.stringify(task))
      this.dialogStopReasonVisible = true
    },
    downLoadContract(fileName, filePath) {
      downloadFile({ url: filePath })
        .then((response) => {
          downloadFileStream(baseName(filePath), response)
        })
        .catch((error) => {})
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    /**
     * 导出
     */
    handleExportOrders() {
      const { name, demand_id, category_name, tag, date_range } = this.listQuery
      let filter = {
        name,
        demand_id,
        category_name,
        tag,
        date_range,
        class_name: 'demand'
      }

      const checked = []
      this.list.forEach(item => {
        if (item.checked) {
          checked.push(item.demand_id)
        }
      })

      if (checked.length > 0) {
        filter = Object.assign({}, filter, { demand_id: checked })
      }

      exportOrders(filter)
        .then((response) => {
          const fileName = `需求单-${this.$moment().format('YYYYMMD')}.xlsx`
          downloadFileStream(fileName, response)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 下载需求文件
     */
    handleDownloadFiles(row, index) {
      this.$set(this.list[index], 'downloading', true)
      const actions = row.files.map((fileItem) => {
        return downloadFile({ url: fileItem.url })
      })
      const results = Promise.all(actions)
      results
        .then((data) => {
          data.forEach((file, fileIndex) => {
            downloadFileStream(
              baseName(row.files[fileIndex].url),
              file
            )
          })
          this.$set(this.list[index], 'downloading', false)
        })
        .catch((error) => {
          this.$set(this.list[index], 'downloading', false)
          this.$message.error(error || '哎呀，下载失败啦')
        })
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
  .filter-container {
    margin-bottom: 20px;
    @extend %flex-space-between;
    .filter-left {
      .filter-item {
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
  }
  .list-container {
    .expand {
      width: calc(100vw - 100px);
      padding: 20px;
      background: #fff; //盖住fixed产生的阴影
    }

    .pending-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .tag {
        margin-left: 10px;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background-color: #f56c6c;
      }
    }
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
.task-detail-dialog {
  .task-detail-title {
    margin-top: 20px;
  }
  .plan-box,
  .file-box {
    .plan-item,
    .file-item {
      width: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
    &.display-area {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .img-item {
        margin: 0 10px 10px 0;
        position: relative;
        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
        width: 100px;
        height: 100px;
        .img-actions {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: default;
          text-align: center;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          transition: opacity 0.3s;
          &:hover {
            opacity: 1;
          }
          .btn-item {
            cursor: pointer;
            &:not(:last-child) {
              margin-right: 5px;
            }
          }
        }
      }
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
.file-box {
  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
