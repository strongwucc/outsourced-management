<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.order_id"
          placeholder="输入订单号"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.task_id"
          placeholder="输入物件单号"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.project_name"
          placeholder="输入项目名称"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.supplier_name"
          placeholder="输入供应商名称"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
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
      </div>
      <div class="filter-right">
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleExpand(true)"
        >
          展开
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleExpand(false)"
        >
          收起
        </el-button>
        <el-popconfirm
          v-permission="[0]"
          title="确定申请变更吗？"
          @confirm="handleModify"
        >
          <el-button
            slot="reference"
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            size="mini"
          >
            申请变更
          </el-button>
        </el-popconfirm>

        <el-popconfirm
          v-permission="[0]"
          title="确定交付验收吗？"
          @confirm="handleDeliver"
        ><el-button
          slot="reference"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
        >
          交付验收
        </el-button></el-popconfirm>
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
      fit
      highlight-current-row
      row-key="order_id"
      :expand-row-keys="expandRowKeys"
      @expand-change="expandChange"
      @row-click="clickRowHandle"
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
            <el-table class="task-list" border :data="row.tasks" fit stripe>
              <el-table-column label="" width="50" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.checked"
                    :disabled="[0, 4].indexOf(scope.row.task_status) < 0"
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
              <el-table-column
                prop="task_image"
                label="缩略图"
                align="center"
                width="80"
              >
                <template slot-scope="scope">
                  <el-image
                    style="width: 50px; height: 50px"
                    :src="scope.row.image_url"
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
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                label="物件品类"
                align="center"
                width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.category | categoryText }}
                </template>
              </el-table-column>
              <el-table-column
                prop="deliver_date"
                label="交付日期"
                width="180"
                align="center"
              />
              <el-table-column
                prop="unit"
                label="工作单位"
                width="80"
                align="center"
              />
              <el-table-column
                prop="nums"
                label="数量"
                width="80"
                align="center"
              />
              <el-table-column
                prop="price"
                label="单价"
                width="80"
                align="center"
              />
              <el-table-column
                prop="amount"
                label="总价"
                width="80"
                align="center"
              />
              <el-table-column label="停留时间" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.stay_time }}小时
                </template>
              </el-table-column>
              <el-table-column label="当前处理人" align="center" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.dealing }}
                </template>
              </el-table-column>
              <el-table-column
                prop="task_status"
                label="物件状态"
                width="100"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.task_status | statusText }}
                </template>
              </el-table-column>
              <!-- <el-table-column label="作品" align="center" width="80">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleDownloadWork(scope.row, scope.$index, $index)"
                >
                  下载
                </el-button>
              </el-table-column> -->
              <el-table-column
                label="操作"
                align="center"
                min-width="300"
                class-name="small-padding fixed-width need-flex"
              >
                <template slot-scope="scope">
                  <el-upload
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
                          $index,
                          scope.$index,
                          'finished_product'
                        )
                    "
                    :on-error="handleUploadWorkError"
                  >
                    <el-button
                      size="mini"
                      type="primary"
                      style="margin-left: 10px"
                      plain
                    >上传作品</el-button>
                  </el-upload>
                  <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 10px"
                    plain
                    @click="handleDownloadWork(scope.row, scope.$index, $index)"
                  >
                    下载作品
                  </el-button>
                  <el-upload
                    v-if="[0, 4].indexOf(scope.row.task_status) >= 0"
                    v-permission="[0]"
                    class="upload-box"
                    :action="`/api/tools/upfile`"
                    :show-file-list="false"
                    style="margin-left: 10px"
                    :file-list="scope.row.display_area"
                    :on-success="
                      (response, file, fileList) =>
                        handleUploadWorkSuccess(
                          response,
                          file,
                          fileList,
                          $index,
                          scope.$index,
                          'display_area'
                        )
                    "
                    :on-error="handleUploadWorkError"
                  >
                    <el-button type="primary" size="mini" plain>
                      上传展示图
                    </el-button>
                  </el-upload>

                  <el-button
                    v-if="[4].indexOf(scope.row.task_status) >= 0"
                    type="primary"
                    size="mini"
                    style="margin-left: 10px"
                    plain
                    @click="
                      handleRejectTaskReason(scope.row, scope.$index, $index)
                    "
                  >
                    驳回原因
                  </el-button>
                  <el-button
                    v-if="[5].indexOf(scope.row.task_status) >= 0"
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
      <el-table-column label="订单号" align="left" width="200">
        <template slot-scope="{ row }">
          <div class="pending-box">
            <span class="txt">{{ row.order_id }}</span>
            <span v-if="row.pending > 0" class="tag">{{
              row.pending
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="项目名称"
        align="center"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.project.project_name }}
        </template>
      </el-table-column>
      <el-table-column
        label="需求名称"
        align="center"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.demand_name }}
        </template>
      </el-table-column>
      <el-table-column
        label="供应商"
        align="center"
        width="200"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.supplier.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="供管"
        align="center"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.supplier_management }}
        </template>
      </el-table-column>
      <el-table-column label="物件数量" align="center" width="80">
        <template slot-scope="{ row }">
          {{ row.nums }}
        </template>
      </el-table-column>
      <el-table-column label="工作总量" align="center" width="80">
        <template slot-scope="{ row }">
          {{ row.work_num }}
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center" width="80">
        <template slot-scope="{ row }">
          {{ row.work_amount }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="停留时间" align="center" width="80">
        <template slot-scope="{ row }">
          {{ row.stay_time | stayTimeHours }}小时
        </template>
      </el-table-column>
      <el-table-column
        label="当前处理人"
        align="center"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.dealing || "-" }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="单据状态" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.order_status | statusText }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        min-width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            v-permission="[0]"
            type="primary"
            size="mini"
            plain
            @click.stop="handleCreateTask(row)"
          >
            新增物件
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
      @pagination="getList(true)"
    />

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
                  v-for="(item, itemIndex) in [
                    '人日',
                    '套',
                    '件',
                    '分钟',
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
            placeholder="请输入变更数量"
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
  modifyOrder,
  addTask,
  toCheckOrder,
  uploadWorkImage
} from '@/api/order/index'
import { createTask } from '@/api/demand/task'
import { downloadFile } from '@/api/system/file'
import { downloadFileStream, baseName } from '@/utils/index'

import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import TaskDetail from '@/components/TaskDetail'

export default {
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
      listLoading: true,
      listQuery: {
        order_id: '',
        task_id: '',
        project_name: '',
        supplier_name: '',
        tag: '',
        page: 1,
        page_num: 10
      },
      textMap: {
        modify: '申请变更',
        create_task: '新增物件'
      },
      dialogStatus: '',
      dialogTaskVisible: false,
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
          { required: true, message: '请选择工作单位', trigger: 'change' }
        ],
        work_num: [
          { required: true, type: 'integer', message: '请输入预估数量', trigger: 'blur' }
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
      dialogRejectReasonVisible: false,
      dialogStopReasonVisible: false,
      fileList: [],
      posting: false
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    expandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => {
        return row.order_id
      })
    },
    clickRowHandle(row, column, event) {
      if (this.expandRowKeys.includes(row.order_id)) {
        this.expandRowKeys = this.expandRowKeys.filter(val => val !== row.order_id)
      } else {
        this.expandRowKeys.push(row.order_id)
      }
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
     * 获取需求列表
     */
    getList(needLoading = true) {
      if (needLoading) {
        this.listLoading = true
      }

      fetchOrderList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.total = response.data.total
          let list = response.data.list
          if (this.$store.getters.pendings['/order/index']) {
            const pendings = this.$store.getters.pendings['/order/index'].children
            list = response.data.list.map(listItem => {
              listItem.pending = pendings[listItem.order_id] || 0
              // 是否已选中
              const orderIndex = this.list.findIndex(orderItem => orderItem.order_id === listItem.order_id)
              if (orderIndex >= 0) {
                listItem.checked = this.list[orderIndex].checked === true
                listItem.tasks = listItem.tasks.map((child) => {
                  const taskIndex = this.list[orderIndex].tasks.findIndex(
                    (taskItem) => taskItem.task_id === child.task_id
                  )
                  if (taskIndex >= 0) {
                    child.checked =
                      this.list[orderIndex].tasks[taskIndex].checked === true
                  }
                  return child
                })
              }
              return listItem
            })
          }
          this.list = list
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
    /**
     * 展开
     */
    handleExpand(isExpand) {
      if (isExpand) {
        this.list.forEach((listItem) => {
          if (listItem.checked) {
            if (this.expandRowKeys.indexOf(listItem.order_id) < 0) {
              this.expandRowKeys.push(listItem.order_id)
            }
          }
        })
      } else {
        this.list.forEach((listItem) => {
          if (listItem.checked) {
            const keyIndex = this.expandRowKeys.indexOf(listItem.order_id)
            if (keyIndex >= 0) {
              this.expandRowKeys.splice(keyIndex, 1)
            }
          }
        })
      }
    },
    /**
     * 申请变更
     */
    handleModify() {
      const orderCheckeds = []
      const taskCheckeds = []

      let price, amount

      if (
        !this.list.some((orderItem, orderIndex) => {
          return orderItem.tasks.some((taskItem, taskIndex) => {
            if (taskItem.checked) {
              if ([0].indexOf(taskItem.task_status) < 0) {
                const errorName = `[${taskItem.task_id}]: 该物件状态无法申请变更`
                this.$message.error(errorName)
                return true
              }
              if (orderCheckeds.indexOf(taskItem.order_id) < 0) {
                orderCheckeds.push(taskItem.order_id)
              }
              if (orderCheckeds.length > 1) {
                const errorName = `只能选择单个订单下的物件`
                this.$message.error(errorName)
                return true
              }
              taskCheckeds.push(taskItem.task_id)
              price = taskItem.price
              amount = taskItem.amount
              return false
            }
            return false
          })
        })
      ) {
        if (taskCheckeds.length <= 0) {
          this.$message.error('请先选择物件')
          return false
        }
      } else {
        return false
      }

      this.tempModify = Object.assign({}, this.tempModify, {
        order_id: orderCheckeds[0],
        task_id: taskCheckeds,
        work_price: price,
        work_amount: amount
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
              // const orderIndex = this.list.findIndex(
              //   (listItem) => listItem.order_id === tempData.order_id
              // )
              // if (orderIndex >= 0) {
              //   tempData.task_id.forEach((task_id) => {
              //     const taskIndex = this.list[orderIndex].tasks.findIndex(
              //       (taskItem) => taskItem.task_id === task_id
              //     )
              //     if (taskIndex >= 0) {
              //       this.$set(
              //         this.list[orderIndex].tasks[taskIndex],
              //         'task_status',
              //         1
              //       )
              //     }
              //   })
              // }
              this.$notify({
                title: '成功',
                message: '申请成功',
                type: 'success',
                duration: 2000
              })
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
    handleDeliver() {
      const taskCheckeds = []
      if (
        !this.list.some((orderItem, orderIndex) => {
          return orderItem.tasks.some((taskItem, taskIndex) => {
            if (taskItem.checked) {
              if ([0, 4].indexOf(taskItem.task_status) < 0) {
                const errorName = `[${taskItem.task_id}]: 该物件状态无法交付验收`
                this.$message.error(errorName)
                return true
              }
              if (taskItem.finished_product.length <= 0) {
                const errorName = `[${taskItem.task_id}]: 请上传该物件的作品`
                this.$message.error(errorName)
                return true
              }
              taskCheckeds.push({
                task_id: taskItem.task_id,
                file: taskItem.finished_product
                  .map((product) => {
                    return product.file_id
                  })
                  .join(',')
              })
              return false
            }
            return false
          })
        })
      ) {
        if (taskCheckeds.length <= 0) {
          this.$message.error('请先选择物件')
          return false
        }
      } else {
        return false
      }

      toCheckOrder({ tasks: taskCheckeds })
        .then(async(response) => {
          // taskCheckeds.forEach((checkedTaskItem) => {
          //   let checkedOrderIndex, checkedTaskIndex
          //   this.list.some((orderItem, orderIndex) => {
          //     return orderItem.tasks.some((taskItem, taskIndex) => {
          //       if (taskItem.task_id === checkedTaskItem.task_id) {
          //         checkedOrderIndex = orderIndex
          //         checkedTaskIndex = taskIndex
          //         return true
          //       }
          //       return false
          //     })
          //   })
          //   this.$set(
          //     this.list[checkedOrderIndex].tasks[checkedTaskIndex],
          //     'task_status',
          //     2
          //   )
          // })

          this.$message.success('交付验收成功')
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((error) => {})
    },
    /**
     * 上传作品
     */
    handleUploadWork(task, taskIndex, demandIndex) {},
    handleUploadWorkSuccess(
      response,
      file,
      fileList,
      orderIndex,
      taskIndex,
      keyName
    ) {
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

      const task = this.list[orderIndex].tasks[taskIndex]
      const upType = keyName === 'display_area' ? 1 : 0

      uploadWorkImage({
        task_id: task.task_id,
        up_type: upType,
        file_id: fileStr
      })
        .then((response) => {
          this.$set(this.list[orderIndex].tasks[taskIndex], keyName, fileArr)
          this.$message.success('上传成功')
        })
        .catch((error) => {})
    },
    handleUploadWorkError(err, file, fileList) {
      console.log('上传失败', err, file, fileList)
      this.$message.error('上传失败')
    },
    /**
     * 下载作品
     */
    handleDownloadWork(task, taskIndex, demandIndex) {
      if (task.finished_product.length > 0) {
        task.finished_product.forEach((product) => {
          downloadFile({ url: product.url })
            .then((response) => {
              downloadFileStream(baseName(product.url), response)
            })
            .catch((error) => {})
        })
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
    handleRejectTaskReason(task, taskIndex, demandIndex) {
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
    handleStopTaskReason(task, taskIndex, demandIndex) {
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
    handleCreateTask(order) {
      this.tempTaskCategory = order.category
      this.resetTaskTemp()
      this.tempTask = Object.assign({}, this.tempTask, {
        order_id: order.order_id,
        demand_id: order.demand_id,
        extend: order.category.property_array.map((property) => {
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
          addTask(temp).then(async(response) => {
            // const task = response.data
            // let orderIndex = -1
            // this.list.some((listItem, listIndex) => {
            //   if (listItem.order_id === task.order_id) {
            //     orderIndex = listIndex
            //     return true
            //   }
            //   return false
            // })

            // if (orderIndex >= 0) {
            //   this.$set(this.list[orderIndex], 'order_status', 1)
            //   this.$set(
            //     this.list[orderIndex],
            //     'nums',
            //     parseInt(this.list[orderIndex].nums) + 1
            //   )
            //   this.$set(
            //     this.list[orderIndex],
            //     'work_num',
            //     parseInt(this.list[orderIndex].work_num) + parseInt(task.nums)
            //   )
            //   this.$set(
            //     this.list[orderIndex],
            //     'work_amount',
            //     parseFloat(this.list[orderIndex].work_amount) +
            //       parseFloat(task.amount)
            //   )
            //   this.list[orderIndex].tasks.unshift(task)
            // }
            this.dialogTaskVisible = false
            this.$notify({
              title: '成功',
              message: '新增物件成功',
              type: 'success',
              duration: 2000
            })
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
        .catch((error) => {})
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
    .upload-box {
      display: inline-block;
    }
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
