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
      </div>
      <div class="filter-right">
        <el-button
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
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleResolve"
        >
          确认
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleReject"
        >
          驳回
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleCreateOrder"
        >
          生成订单
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleFinish"
        >
          终止
        </el-button>
      </div>
    </div>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="list-container"
      :data="list"
      fit
      highlight-current-row
      row-key="demand_id"
      :expand-row-keys="expandRowKeys"
      @expand-change="expandChange"
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
          <div class="expand-table-box" style="padding-left: 50px">
            <el-table class="task-list" border :data="row.tasks" fit stripe>
              <el-table-column label="" width="50" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.checked"
                    @change="clickCheckItemFn(row, scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="task_id"
                label="物件单号"
                width="200"
                align="center"
              />
              <el-table-column prop="task_image" label="缩略图" align="center">
                <template slot-scope="scope">
                  <el-image
                    style="width: 50px; height: 50px"
                    :src="scope.row.task_image"
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
              />
              <el-table-column
                prop="category_name"
                label="物件品类"
                align="center"
              />
              <el-table-column
                prop="deliver_date"
                label="交付日期"
                width="200"
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
              <el-table-column
                label="操作"
                align="center"
                min-width="100"
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
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="handleUpdateTask(scope.row, scope.$index, $index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click="handleDeleteTask(scope.row, scope.$index, $index)"
                  >
                    删除
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="handleCopyTask(scope.row, scope.$index, $index)"
                  >
                    复制
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="
                      handleStopTaskReason(scope.row, scope.$index, $index)
                    "
                  >
                    终止原因
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="需求订单号" align="left" width="200">
        <template slot-scope="{ row }">
          {{ row.demand_id }}
        </template>
      </el-table-column>

      <el-table-column label="需求名称" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="需求品类" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.category_name }}
        </template>
      </el-table-column>

      <el-table-column label="停留时间" align="center" width="80">
        <template slot-scope="{ row }"> {{ row.stay_time }}小时 </template>
      </el-table-column>

      <el-table-column label="当前处理人" align="center" width="90">
        <template slot-scope="{ row }">
          {{ row.handler }}
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{ row }">
          <span>
            {{ row.status | statusText }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            plain
            :loading="row.detailLoading"
            @click="handleDetail(row, $index)"
          >
            详情
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
          <el-button type="primary" size="mini" plain> 提交审核 </el-button>
          <el-button type="primary" size="mini" plain @click="showReason('')">
            驳回原因
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleProvider(row)"
          >
            分配供应商
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleCreateTask(row)"
          >
            新增物件
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleImportTask(row)"
          >
            导入物件
          </el-button>
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
        <el-form-item label="选择项目流程:" prop="process_id">
          <el-select
            v-model="temp.process_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchProcessList"
            :loading="processLoading"
            class="dialog-form-item"
            @focus="fetchProcessList('')"
          >
            <el-option
              v-for="item in process"
              :key="item.id"
              :label="item.flow_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

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

        <el-form-item label="审核人:" prop="verify_id">
          <el-select
            v-model="temp.verify_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchMemberList"
            :loading="memberLoading"
            class="dialog-form-item"
            @focus="fetchMemberList('')"
          >
            <el-option
              v-for="item in members"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="需求品类:" prop="category_id">
          <el-cascader
            ref="categoryCascader"
            v-model="temp.category_id"
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
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAddFileSucc"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="意向供应商:" prop="supplier_id">
          <div class="has-secret-notice">
            <el-select
              v-model="temp.supplier_id"
              filterable
              remote
              placeholder="请输入关键词"
              :remote-method="fetchProviderList"
              :loading="providerLoading"
              class="dialog-form-item"
              @focus="fetchProviderList('')"
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
        <template v-if="dialogStatus === 'create'">
          <el-button @click="createData(0)"> 保存为模板 </el-button>
          <el-button type="primary" @click="createData(1)">
            提报需求
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
      <div class="reason-box">
        <div class="content">
          品类改为3D品类改为3D品类改为3D品类改为3D品类改为3D
        </div>
        <div class="user-info">
          <div>驳回人：tom</div>
          <div>驳回时间：2022-05-05 12:00:00</div>
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
            :label-style="{ 'font-weight': 'bold' }"
          >
            <el-descriptions-item label="项目代码">{{
              tempDetail.project_bn
            }}</el-descriptions-item>
            <el-descriptions-item label="发起部门">{{
              tempDetail.launch_dep_name
            }}</el-descriptions-item>
            <el-descriptions-item label="核算部门">{{
              tempDetail.account_dep_name
            }}</el-descriptions-item>
            <el-descriptions-item label="经费使用">
              {{ tempDetail.budget_used }}/{{ tempDetail.budget }}
            </el-descriptions-item>
            <el-descriptions-item label="需求创建人">{{
              tempDetail.create_user_name
            }}</el-descriptions-item>
            <el-descriptions-item label="创建时间" span="3">{{
              tempDetail.create_at
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
              tempDetail.category_name
            }}</el-descriptions-item>
            <el-descriptions-item label="需求附件" span="4">{{
              tempDetail.file
            }}</el-descriptions-item>
            <el-descriptions-item label="意向供应商" span="4">{{
              tempDetail.supplier_name
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
              prop="title"
              label="内容"
              width="180"
              align="center"
            />
            <el-table-column prop="datetime" label="操作时间" align="center" />
            <el-table-column prop="stay_time" label="耗时" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="createData(1)">
          提报需求
        </el-button>
      </div>
    </el-dialog>

    <!--审批驳回-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVerifyVisible"
    >
      <el-form
        ref="verifyDataForm"
        class="dialog-form"
        :model="tempVerify"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item
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
        </el-form-item>
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
        <el-button @click="dialogVerifyVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmVerify"> 确认 </el-button>
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
        <el-form-item label="供应商:" prop="id">
          <el-select
            v-model="tempProvider.id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchProviderList"
            :loading="providerLoading"
            class="dialog-form-item"
            @focus="fetchProviderList('')"
          >
            <el-option
              v-for="item in providers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上传附件" prop="file">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAddFileSucc"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProviderVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmProvider"> 确认 </el-button>
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
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAddFileSucc"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFinishVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmFinish"> 确认 </el-button>
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
              <span>{{ tempTaskCategory.category_name }}</span>
            </el-form-item>

            <el-form-item label="工作单位:" prop="work_unit">
              <el-select
                v-model="tempTask.work_unit"
                class="dialog-form-item"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, itemIndex) in ['人日']"
                  :key="itemIndex"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="预估数量:" prop="work_num">
              <el-input
                v-model="tempTask.work_num"
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
                type="textarea"
                :placeholder="`请输入${property.name}`"
                class="dialog-form-item"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <div slot="label" class="form-title">缩略图</div>
            </el-form-item>
            <el-form-item prop="task_image" label-width="0">
              <el-upload
                class="task-image-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleTaskImageSuccess"
                :before-upload="beforeTaskImageUpload"
              >
                <img
                  v-if="tempDetail.task_image"
                  :src="tempDetail.task_image"
                  class="task-image"
                >
                <i v-else class="el-icon-plus task-image-uploader-icon" />
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
          <el-button size="mini">下载</el-button>
        </el-form-item>

        <el-form-item label="导入物件" prop="file">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAddFileSucc"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">导入</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportTaskVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmImportTask"> 确认 </el-button>
      </div>
    </el-dialog>

    <!--物件详情-->
    <el-dialog
      title="物件详情"
      :visible.sync="dialogTaskDetailVisible"
      width="65%"
      class="task-detail-dialog"
    >
      <el-tabs v-if="tempTaskDetail.task_id">
        <el-tab-pane label="详情">
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
              tempTaskDetail.launch_dep_name
            }}</el-descriptions-item>
            <el-descriptions-item label="核算部门" span="3">{{
              tempTaskDetail.account_dep_name
            }}</el-descriptions-item>
            <el-descriptions-item label="需求说明" span="6">{{
              tempTaskDetail.demand.introduce
            }}</el-descriptions-item>
            <el-descriptions-item label="需求品类">{{
              tempTaskDetail.demand.category.category_name
            }}</el-descriptions-item>
            <el-descriptions-item label="需求附件" span="4">{{
              tempTaskDetail.demand.file
            }}</el-descriptions-item>
          </el-descriptions>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-descriptions
                title="基础信息"
                class="margin-top"
                :column="1"
                :label-style="{ 'font-weight': 'bold' }"
              >
                <el-descriptions-item label="缩略图">
                  <img
                    v-if="tempTaskDetail.task_image"
                    :src="tempTaskDetail.task_image"
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
                  tempTaskDetail.category_name
                }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="12">
              <el-descriptions
                title="属性"
                class="margin-top"
                :column="1"
                :label-style="{ 'font-weight': 'bold' }"
              >
                <el-descriptions-item
                  v-for="(prop, propIndex) in tempTaskDetail.props"
                  :key="propIndex"
                  :label="prop.name"
                >
                  {{ prop.value }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
          <el-descriptions
            title="供应商及价格"
            class="margin-top"
            :column="4"
            :label-style="{ 'font-weight': 'bold' }"
          >
            <el-descriptions-item label="供应商名称">{{
              tempTaskDetail.provider.name
            }}</el-descriptions-item>
            <el-descriptions-item
              label="商务"
              span="3"
            >(电话：{{ tempTaskDetail.provider.contact.phone }} QQ：{{
              tempTaskDetail.provider.contact.qq
            }}
              微信：{{
                tempTaskDetail.provider.contact.wx
              }})</el-descriptions-item>
            <el-descriptions-item label="合同号">{{
              tempTaskDetail.provider.bn
            }}</el-descriptions-item>
          </el-descriptions>
          <el-table
            :data="tempTaskDetail.provider.tasks"
            border
            style="width: 100%"
          >
            <el-table-column prop="work_unit" label="工作单位" align="center" />
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
            <el-table-column prop="create_at" label="创建时间" align="center" />
          </el-table>
          <el-descriptions
            title="展示图"
            class="margin-top task-detail-title"
            :label-style="{ 'font-weight': 'bold' }"
          />
          <div class="plan-box">
            <div
              v-for="(planImage, planIndex) in tempTaskDetail.plan_images"
              :key="planIndex"
              class="plan-item"
            >
              <span>{{ planImage }}</span><el-button size="mini">下载</el-button>
            </div>
          </div>
          <el-descriptions
            title="作品"
            class="margin-top task-detail-title"
            :label-style="{ 'font-weight': 'bold' }"
          />
          <div class="file-box">
            <div
              v-for="(file, fileIndex) in tempTaskDetail.files"
              :key="fileIndex"
              class="file-item"
            >
              <span>{{ file }}</span><el-button size="mini">下载</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作记录">
          <el-table
            :data="tempTaskDetail.records"
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
              prop="title"
              label="内容"
              width="180"
              align="center"
            />
            <el-table-column prop="datetime" label="操作时间" align="center" />
            <el-table-column prop="stay_time" label="耗时" align="center" />
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
      <el-form label-position="left" label-width="100px" style="margin: 0 50px">
        <el-form-item label="终止原因:">
          <span>终止原因终止原因终止原因终止原因终止原因终止原因终止原因终止原因终止原因终止原因</span>
        </el-form-item>

        <el-form-item label="附件:">
          <div
            class="file-box"
            style="display: flex; justify-content: flex-start"
          >
            <span>附件.doc</span><el-button size="mini" style="margin-left: 20px">下载</el-button>
          </div>
        </el-form-item>
      </el-form></el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createDemand,
  updateDemand,
  fetchDemandDetail
} from '@/api/demand/index'
import { createTask, updateTask, fetchTaskDetail } from '@/api/demand/task'
import { fetchAllProcess } from '@/api/project/process'
import { fetchAllMember } from '@/api/system/member'
import { fetchAllProvider } from '@/api/provider/index'
import { fetchAllCategory } from '@/api/system/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const tagList = [
  { id: 0, name: '正式包' },
  { id: 1, name: '测试包' },
  { id: 2, name: '外派' },
  { id: 3, name: '动态团队' }
]

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusColor(status) {
      const statusMap = {
        0: '#67c23a',
        1: '#67c23a',
        2: '#67c23a',
        3: '#67c23a',
        4: '#67c23a',
        5: '#67c23a',
        6: '#67c23a',
        7: '#67c23a',
        8: '#67c23a',
        9: '#67c23a',
        10: '#67c23a'
      }
      return statusMap[status]
    },
    statusText(status) {
      const statusMap = {
        0: '待提报',
        1: '审核未通过',
        2: '审核中',
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
    tagText(tag) {
      let text = tag
      tagList.some((tagItem) => {
        if (tagItem.id === tag) {
          text = tagItem.name
          return true
        }
        return false
      })
      return text
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
      globelCheckedAll: false,
      expandRowKeys: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        demand_id: '',
        category_name: '',
        tag: '',
        page: 1,
        page_num: 10
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
        supplier_id: '',
        remark: '',
        status: 0
      },
      tagOptions: tagList,
      textMap: {
        update: '修改需求',
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
          { required: true, message: '请选择项目流程', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入需求名称', trigger: 'blur' }],
        verify_id: [
          { required: true, message: '请选择项审核人', trigger: 'change' }
        ],
        category_id: [
          { required: true, message: '请选择需求品类', trigger: 'change' }
        ]
      },
      processLoading: false,
      process: [],
      memberLoading: false,
      members: [],
      providerLoading: false,
      providers: [],
      categorys: [],
      fileList: [],
      dialogReasonVisible: false,
      dialogDetailVisible: false,
      tempDetail: {
        demand_id: ''
      },
      dialogVerifyVisible: false,
      tempVerify: {
        reason: ''
      },
      verifyReason: '',
      dialogProviderVisible: false,
      providerRules: {
        id: [{ required: true, message: '请选择供应商', trigger: 'change' }]
      },
      tempProvider: {
        id: '',
        file: ''
      },
      dialogFinishVisible: false,
      finishRules: {
        reason: [
          { required: true, message: '请输入终止原因', trigger: 'blur' }
        ]
      },
      tempFinish: {
        reason: '',
        file: ''
      },
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
        work_unit: '',
        work_num: '',
        deliver_date: '',
        remark: '',
        extend: []
      },
      taskRules: {},
      dialogImportTaskVisible: false,
      tempImportTask: {
        file: ''
      },
      importTaskRules: {},
      dialogTaskDetailVisible: false,
      tempTaskDetail: {},
      dialogStopReasonVisible: false
    }
  },
  created() {
    this.fetchCategorys()
    this.getList()
  },
  methods: {
    expandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => {
        return row.demand_id
      })
    },
    /**
     * 获取需求列表
     */
    getList() {
      this.listLoading = true

      fetchList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.items
        this.updateCheckedAllBtnStatus(false)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
      this.temp = {
        id: undefined,
        process_id: '',
        name: '',
        tag: 0,
        introduce: '',
        verify_id: '',
        cat_id: '',
        file: '',
        supplier_id: '',
        remark: '',
        status: 0
      }
    },
    /**
     * 获取流程列表
     */
    fetchProcessList(query) {
      this.processLoading = true
      fetchAllProcess({ name: query }).then((response) => {
        this.processLoading = false
        this.process = response.data.items
      })
    },
    /**
     * 获取会员列表
     */
    fetchMemberList(query) {
      this.memberLoading = true
      fetchAllMember({ keyword: query }).then((response) => {
        this.memberLoading = false
        this.members = response.data.items
      })
    },
    /**
     * 获取供应商列表
     */
    fetchProviderList(query) {
      this.providerLoading = true
      fetchAllProvider({ name: query }).then((response) => {
        this.providerLoading = false
        this.providers = response.data.items
      })
    },
    /**
     * 获取属性列表
     */
    fetchCategorys() {
      fetchAllCategory().then((response) => {
        this.categorys = response.data.items.map((first) => {
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
    },
    /**
     * 增加需求弹窗
     */
    handleCreate() {
      this.resetTemp()
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = Object.assign({}, this.temp)
          temp.demand_id = parseInt(Math.random() * 100) + 1024
          temp.status = status
          createDemand(temp).then(() => {
            const checkedNodes = this.$refs.categoryCascader.getCheckedNodes()
            if (checkedNodes.length > 0) {
              temp.category_name = checkedNodes[0].pathLabels[2]
            } else {
              temp.category_name = ''
            }
            temp.handler = '当前处理人'
            this.list.unshift(temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    /**
     * 修改需求弹窗
     */
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
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
          updateDemand(tempData).then(() => {
            const index = this.list.findIndex(
              (v) => v.demand_id === tempData.demand_id
            )
            const checkedNodes = this.$refs.categoryCascader.getCheckedNodes()
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
        }
      })
    },
    /**
     * 删除需求
     */
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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
    showReason() {
      this.dialogReasonVisible = true
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
      const detailData = await fetchDemandDetail({ demand_id: row.demand_id })
      if (detailData.code === 200) {
        this.temp = Object.assign({}, row)
        this.tempDetail = Object.assign({}, detailData.data)
        this.dialogDetailVisible = true
        this.list.splice(
          index,
          1,
          Object.assign({}, row, { detailLoading: false })
        )
      } else {
        this.list.splice(
          index,
          1,
          Object.assign({}, row, { detailLoading: false })
        )

        this.$message.error(detailData.message || '哎呀，出错啦')
      }
    },
    /**
     * 审批通过弹窗
     */
    handleResolve() {
      this.dialogStatus = 'resolve'
      this.dialogVerifyVisible = true
    },
    /**
     * 审批驳回弹窗
     */
    handleReject() {
      this.dialogStatus = 'reject'
      this.dialogVerifyVisible = true
    },
    /**
     * 审批确认
     */
    confirmVerify() {
      this.dialogVerifyVisible = false
    },
    /**
     * 分配供应商弹窗
     */
    handleProvider() {
      this.tempProvider = Object.assign({}, this.tempProvider, {
        id: '',
        file: ''
      })
      this.dialogProviderVisible = true
    },
    /**
     * 确认供应商
     */
    confirmProvider() {
      this.dialogProviderVisible = false
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
    updateCheckedAllBtnStatus(value) {
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
      this.$notify({
        title: '成功',
        message: '订单生成成功',
        type: 'success',
        duration: 2000
      })
    },
    /**
     * 终止弹窗
     */
    handleFinish() {
      this.tempFinish = Object.assign({}, this.tempFinish, {
        reason: '',
        file: ''
      })
      this.dialogFinishVisible = true
    },
    /**
     * 确认终止
     */
    confirmFinish() {
      this.$refs['finishDataForm'].validate((valid) => {
        if (valid) {
          this.$notify({
            title: '成功',
            message: '终止成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFinishVisible = false
        }
      })
    },
    /**
     * 重置物件数据
     */
    resetTaskTemp() {
      this.tempTask = {
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
          temp.task_id = parseInt(Math.random() * 100) + 1024
          createTask(temp).then(() => {
            let demandIndex = -1
            this.list.some((listItem, listIndex) => {
              if (listItem.demand_id === temp.demand_id) {
                demandIndex = listIndex
                return true
              }
              return false
            })

            if (demandIndex >= 0) {
              temp.category_id = this.tempTaskCategory.category_id
              temp.category_name = this.tempTaskCategory.category_name
              temp.work_price = 10
              temp.work_amount = 10 * temp.work_num
              this.list[demandIndex].tasks.unshift(temp)
            }
            this.dialogTaskVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
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
          updateTask(temp).then(() => {
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
        }
      })
    },
    /**
     * 上传物件图片成功回调
     */
    handleTaskImageSuccess(res, file) {
      console.log(11111, res, file)
    },
    /**
     * 上传物件图片前回调
     */
    beforeTaskImageUpload(file) {
      console.log(22222, file)
    },
    /**
     * 导入物件弹窗
     */
    handleImportTask(demand) {
      this.tempTaskCategory = demand.category
      this.resetTaskTemp()
      this.dialogStatus = 'import_task'
      this.dialogImportTaskVisible = true
      this.$nextTick(() => {
        this.$refs['importTaskDataForm'].clearValidate()
      })
    },
    /**
     * 确认导入物件
     */
    confirmImportTask() {},
    /**
     * 物件详情弹窗
     */
    async handleShowTask(task, taskIndex, demandIndex) {
      this.$set(this.list[demandIndex].tasks[taskIndex], 'detailLoading', true)
      const detailData = await fetchTaskDetail({ task_id: task.task_id })
      if (detailData.code === 200) {
        this.tempTaskDetail = Object.assign({}, detailData.data)
        this.dialogTaskDetailVisible = true
        this.$set(
          this.list[demandIndex].tasks[taskIndex],
          'detailLoading',
          false
        )
      } else {
        this.$set(
          this.list[demandIndex].tasks[taskIndex],
          'detailLoading',
          false
        )
        this.$message.error(detailData.message || '哎呀，出错啦')
      }
    },
    /**
     * 修改物件弹窗
     */
    handleUpdateTask(task, taskIndex, demandIndex) {
      const demand = this.list[demandIndex]
      if (demand) {
        this.tempTaskCategory = demand.category
        this.tempTask = Object.assign({}, task, {
          extend: demand.category.property_array.map((property) => {
            return {
              name: property.extend_name,
              value: '',
              type: property.extend_tag,
              options: property.extend_value
            }
          })
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
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list[demandIndex].tasks.splice(taskIndex, 1)
    },
    /**
     * 复制物件弹窗
     */
    handleCopyTask(task, taskIndex, demandIndex) {
      const demand = this.list[demandIndex]
      if (demand) {
        this.tempTaskCategory = demand.category
        this.tempTask = Object.assign({}, task, {
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
      }
    },
    /**
     * 驳回物件原因弹窗
     */
    handleStopTaskReason(task, taskIndex, demandIndex) {
      this.dialogStopReasonVisible = true
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
</style>
