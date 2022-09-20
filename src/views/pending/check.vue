<template>
  <div class="app-container">
    <div class="lucien-row">
      <div
        v-resize
        v-loading="listLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(237, 244, 253, 0.8)"
        class="lucien-col col-left"
      >
        <div class="grid-content list-container">
          <el-table
            ref="listTable"
            :data="list"
            style="width: 100%"
            height="100%"
            class="list-table"
            highlight-current-row
            row-key="receipt_id"
            :show-header="showHeader"
            @selection-change="handleSelectionChange"
            @row-click="handleCurrentChange"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column>
              <template slot="header">
                <el-button
                  v-permission="[1, 2, 3, 4]"
                  type="primary"
                  size="mini"
                  @click="handleVerify(true, true)"
                >
                  验收通过
                </el-button>
                <el-button
                  v-permission="[1, 2, 3, 4]"
                  type="primary"
                  size="mini"
                  @click="handleVerify(false, true)"
                >
                  驳回
                </el-button>
                <el-button
                  v-permission="[0]"
                  type="primary"
                  size="mini"
                  @click="handleReconcile(true)"
                >
                  生成对账单
                </el-button>
              </template>
              <template slot-scope="scope">
                <div class="item-box">
                  <span class="item-no">{{ scope.row.receipt_id }}</span>
                  <!-- <span class="item-name">{{ scope.row.name }}</span> -->
                  <span class="item-supplier">{{
                    scope.row.supplier_name
                  }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
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
                <el-descriptions-item label="项目名称">{{
                  detail.project ? detail.project.project_name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="发起部门">{{
                  detail.demand.flow ? detail.demand.flow.launch_dep.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="核算部门">{{
                  detail.demand.flow ? detail.demand.flow.account_dep.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="经费使用">
                  {{ detail.project ? detail.project.budget_used : 0 }}/{{
                    detail.project ? detail.project.budget_cost : 0
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="需求创建人">{{
                  detail.demand.creator ? detail.demand.creator.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="创建时间" span="3">{{
                  detail.demand.created_at
                }}</el-descriptions-item>
                <el-descriptions-item label="需求名称">
                  <span>{{ detail.demand.name }}</span>
                  <el-tag size="mini" style="margin-left: 10px">{{
                    detail.demand.tag | demandTagText
                  }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="需求单号">{{
                  detail.demand.demand_id
                }}</el-descriptions-item>
                <el-descriptions-item label="需求状态" span="4">{{
                  detail.demand.status | demandStatusText
                }}</el-descriptions-item>
                <el-descriptions-item label="需求说明" span="4">{{
                  detail.demand.introduce
                }}</el-descriptions-item>
                <el-descriptions-item label="需求品类" span="4">{{
                  detail.demand.category | categoryText
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
                <el-descriptions-item label="供应商" span="4">{{
                  detail.supplier ? detail.supplier.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="备注说明" span="4">{{
                  detail.remark
                }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <el-table :data="[detail]" class="table-info" width="100%" border>
              <el-table-column
                label="验收单号"
                align="left"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  <div class="pending-box">
                    <span class="txt">{{ row.receipt_id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="项目名称"
                align="center"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  {{ row.project.project_name }}
                </template>
              </el-table-column>
              <el-table-column
                label="供应商"
                align="center"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  {{ row.supplier.name }}
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
              <el-table-column label="订单状态" align="center" width="150">
                <template slot-scope="{ row }">
                  <!-- {{ row.receipts_status | statusText }} -->
                  <span :style="{ color: statusColor(row.receipts_status) }">
                    {{ row.receipts_status | statusText }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div class="actions" />
          </div>
          <el-divider />
          <div
            v-if="detail.items && detail.items.length > 0"
            class="task-content"
          >
            <div class="title">
              <i class="el-icon-s-management" />
              <span>物件明细</span>
            </div>
            <el-table
              :data="detail.items"
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
                width="200"
                align="center"
              />
              <el-table-column prop="work_unit" label="单位" align="center" />
              <el-table-column prop="work_num" label="数量" align="center" />
              <el-table-column prop="work_price" label="单价" align="center" />
              <el-table-column prop="work_amount" label="总价" align="center" />
              <el-table-column
                label="停留时间"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.stay_time }}小时
                </template>
              </el-table-column>
              <el-table-column
                label="当前处理人"
                align="center"
                min-width="120"
                show-overflow-tooltip
              >
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
                  {{ scope.row.task_status | taskStatusText }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                min-width="200"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    :loading="scope.row.downloading"
                    @click="handleDownloadWork(scope.row, scope.$index)"
                  >
                    下载
                  </el-button>
                  <el-button
                    v-if="[3].indexOf(scope.row.task_status) >= 0"
                    type="primary"
                    size="mini"
                    style="margin-left: 10px"
                    plain
                    @click="handleRejectTaskReason(scope.row, scope.$index)"
                  >
                    驳回原因
                  </el-button>
                  <el-button
                    v-if="scope.row.reject"
                    v-permission="[1, 3]"
                    type="primary"
                    size="mini"
                    style="margin-left: 10px"
                    plain
                    @click="handleRejectTaskReason(scope.row, scope.$index)"
                  >
                    驳回原因
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="actions">
              <el-button
                v-permission="[1, 2, 3, 4]"
                icon="el-icon-check"
                type="primary"
                size="mini"
                plain
                @click="handleVerify(true, false)"
              >通过</el-button>
              <el-button
                v-permission="[1, 2, 3, 4]"
                icon="el-icon-jinzhi"
                type="primary"
                size="mini"
                plain
                @click="handleVerify(false, false)"
              >驳回</el-button>
              <el-button
                v-permission="[3]"
                type="primary"
                icon="el-icon-remove"
                size="mini"
                plain
                @click="handleFinish(false)"
              >
                终止
              </el-button>
              <el-button
                v-permission="[1]"
                type="primary"
                icon="el-icon-editor2b"
                size="mini"
                plain
                @click="handleModify()"
              >
                申请变更
              </el-button>
              <el-button
                v-permission="[0]"
                icon="el-icon-document"
                type="primary"
                size="mini"
                plain
                @click="handleReconcile(false)"
              >
                生成对账单
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
    </div>
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
        <el-form-item label="数量:" prop="work_num">
          <el-input
            v-model="tempModify.work_num"
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

    <!--审批驳回-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVerifyVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="verifyDataForm"
        class="dialog-form"
        :model="tempVerify"
        :rules="verifyRules"
        label-position="left"
        label-width="100px"
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
        <el-button size="mini" @click="dialogVerifyVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmVerify">
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
      <div v-if="tempTask.reject" class="reason-box">
        <div class="content">{{ tempTask.reject.reason || "" }}</div>
        <div class="user-info">
          <div>驳回人：{{ tempTask.reject.user }}</div>
          <div>驳回时间：{{ tempTask.reject.created_at }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchCheckOrderList,
  fetchCheckDetail,
  modifyCheckOrder,
  verifyCheckOrder,
  generateStatement
} from '@/api/order/index'
import { finishTask } from '@/api/demand/task'
import { downloadFile } from '@/api/system/file'
import { downloadFileStream, baseName } from '@/utils/index'

import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import TaskDetail from '@/components/TaskDetail'
const tagList = [
  { id: 0, name: '正式包' },
  { id: 1, name: '测试包' },
  { id: 2, name: '外派' },
  { id: 3, name: '动态团队' }
]
export default {
  components: { Pagination, TaskDetail },
  directives: { waves, permission },
  filters: {
    demandTagText(tag) {
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
    demandStatusText(status) {
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
    taskStatusText(status) {
      const statusMap = {
        0: '资源审核中',
        1: '变更中',
        2: '资源已验收',
        3: '验收不通过',
        4: '物件已终止',
        5: '已生成对帐单'
      }
      return statusMap[status]
    },
    statusText(status) {
      const statusMap = {
        0: '资源审核中',
        1: '资源已验收',
        2: '验收不通过',
        3: '物件已终止',
        4: '已生成对帐单'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      statusColor(status) {
        const statusMap = {
          0: '#606266;',
          1: '#606266',
          2: '#606266',
          3: '#606266',
          4: '#cccccc'
        }
        return statusMap[status]
      },
      globelCheckedAll: false,
      expandRowKeys: [],
      total: 0,
      list: [],
      multipleSelection: [],
      listLoading: true,
      listQuery: {
        receipt_id: '',
        task_id: '',
        order_id: '',
        project_name: '',
        supplier_name: '',
        tag: '',
        page: 1,
        page_num: 10,
        keyword: ''
      },
      detail: {},
      detailIndex: 0,
      multipleTaskSelection: [],
      detailLoading: false,
      detailLoaded: false,
      textMap: {
        modify: '申请变更',
        resolve: '通过',
        reject: '驳回'
      },
      dialogStatus: '',
      dialogModifyVisible: false,
      tempModify: {
        receipt_id: '',
        task_id: [],
        work_num: '',
        work_price: '',
        work_amount: '',
        deliver_date: '',
        reason: ''
      },
      modifyRules: {},
      dialogRejectReasonVisible: false,
      dialogStopReasonVisible: false,
      dialogFinishVisible: false,
      finishRules: {
        reason: [
          { required: true, message: '请输入终止原因', trigger: 'blur' }
        ]
      },
      fileList: [],
      tempFinish: {
        task_id: [],
        reason: '',
        file: ''
      },
      stopFileList: [],
      dialogVerifyVisible: false,
      tempVerify: {
        task_id: [],
        status: '',
        reason: ''
      },
      verifyRules: {},
      tempTask: {
        receipt_id: '',
        task_id: '',
        task_name: ''
      },
      dialogRejectReasonVisible: false
    }
  },
  computed: {
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
    }
  },
  created() {
    this.getList()
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleTaskSelectionChange(val) {
      this.multipleTaskSelection = val
    },
    /**
     * 获取需求列表
     */
    getList(needLoading = true) {
      if (needLoading) {
        this.listLoading = true
      }

      fetchCheckOrderList(this.listQuery)
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
      this.getList()
    },
    handleCurrentChange(row, column, event) {
      const index = this.list.findIndex(
        (item) => item.receipt_id === row.receipt_id
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
      const detailData = await fetchCheckDetail({
        receipt_id: this.list[this.detailIndex].receipt_id
      }).catch((_error) => {})

      this.detailLoading = false
      this.detailLoaded = true
      this.detail = Object.assign({}, this.detail, detailData.data)
      this.multipleTaskSelection = []
    },
    /**
     * 申请变更
     */
    handleModify() {
      const taskCheckeds = []

      let price, amount

      if (this.multipleTaskSelection.length <= 0) {
        this.$message.error('请先选择物件')
        return false
      }
      const result = this.multipleTaskSelection.some((taskItem) => {
        if ([0].indexOf(taskItem.task_status) < 0) {
          const errorName = `[${taskItem.task_id}] 该物件不在审核中，无法审核`
          this.$message.error(errorName)
          return true
        }
        taskCheckeds.push(taskItem.task_id)
        price = taskItem.work_price
        amount = taskItem.work_amount
        return false
      })
      if (result) {
        return false
      }

      this.tempModify = Object.assign({}, this.tempModify, {
        receipt_id: this.detail.receipt_id,
        task_id: taskCheckeds,
        work_price: price,
        work_amount: amount,
        work_num: '',
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
      this.$refs['modifyDataForm'].validate((valid) => {
        if (valid) {
          const tempData = JSON.parse(JSON.stringify(this.tempModify))
          modifyCheckOrder(tempData)
            .then(async(response) => {
              this.$message.success('申请成功')
              this.dialogModifyVisible = false
              await this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((_error) => {})
        }
      })
    },
    /**
     * 生成对账单
     */
    handleReconcile(multi = true) {
      const taskCheckeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择验收单')
          return false
        }
        const result = this.multipleSelection.some((listItem) => {
          return listItem.items.some((taskItem) => {
            if ([2].indexOf(taskItem.task_status) < 0) {
              const errorName = `[${taskItem.task_id}] 该物件状态无法生成对账单`
              this.$message.error(errorName)
              return true
            }
            taskCheckeds.push(taskItem.task_id)
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
        const result = this.multipleTaskSelection.some((taskItem) => {
          if ([2].indexOf(taskItem.task_status) < 0) {
            const errorName = `[${taskItem.task_id}] 该物件状态无法生成对账单`
            this.$message.error(errorName)
            return true
          }
          taskCheckeds.push(taskItem.task_id)
          return false
        })
        if (result) {
          return false
        }
      }

      generateStatement({ tasks: taskCheckeds })
        .then(async(response) => {
          this.$message.success('生成对账单成功')
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((_error) => {})
    },
    /**
     * 通过驳回弹窗
     */
    handleVerify(pass, multi = true) {
      const checkeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择验收单')
          return false
        }
        const result = this.multipleSelection.some((listItem) => {
          return listItem.items.some((taskItem) => {
            if ([0].indexOf(taskItem.task_status) < 0) {
              const errorName = `[${taskItem.task_id}] 该物件不在审核中，无法审核`
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
        if (this.multipleTaskSelection.length <= 0) {
          this.$message.error('请先选择物件')
          return false
        }
        const result = this.multipleTaskSelection.some((taskItem) => {
          if ([0].indexOf(taskItem.task_status) < 0) {
            const errorName = `[${taskItem.task_id}] 该物件不在审核中，无法审核`
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

      this.dialogStatus = pass === true ? 'resolve' : 'reject'
      this.tempVerify.status = pass ? 1 : 0
      this.tempVerify.task_id = checkeds
      this.tempVerify.reason = ''
      if (pass) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
        this.$confirm('确定通过验收?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.baseConfirmVerify()
          })
          .catch(() => {})
      } else {
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
     * 通过申请弹窗
     */
    confirmVerify() {
      this.$refs['verifyDataForm'].validate((valid) => {
        if (valid) {
          this.baseConfirmVerify()
        }
      })
    },
    baseConfirmVerify() {
      const tempData = JSON.parse(JSON.stringify(this.tempVerify))
      verifyCheckOrder(tempData)
        .then(async(response) => {
          this.$message.success('处理成功')
          this.dialogVerifyVisible = false
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((_error) => {})
    },
    /**
     * 终止弹窗
     */
    handleFinish(multi = true) {
      const checkeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择验收单')
          return false
        }
        const result = this.multipleSelection.some((listItem) => {
          return listItem.items.some((taskItem) => {
            if ([0].indexOf(taskItem.task_status) < 0) {
              const errorName = `[${taskItem.task_id}] 该物件不在审核中，无法审核`
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
        if (this.multipleTaskSelection.length <= 0) {
          this.$message.error('请先选择物件')
          return false
        }
        const result = this.multipleTaskSelection.some((taskItem) => {
          if ([0].indexOf(taskItem.task_status) < 0) {
            const errorName = `[${taskItem.task_id}] 该物件不在审核中，无法审核`
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
     * 上传文件成功
     */
    handleAddFileSucc(response, file, fileList) {
      const files = fileList
        .map((fileItem) => {
          return fileItem.name
        })
        .join(',')
      this.tempFinish = Object.assign({}, this.tempFinish, { file: files })
    },
    /**
     * 下载作品
     */
    handleDownloadWork(task, taskIndex) {
      if (task.finished_product.length > 0) {
        this.$set(this.detail.items[taskIndex], 'downloading', true)
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
            this.$set(this.detail.items[taskIndex], 'downloading', false)
          })
          .catch((error) => {
            this.$set(this.detail.items[taskIndex], 'downloading', false)
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
    downLoadContract(fileName, filePath) {
      downloadFile({ url: filePath })
        .then((response) => {
          downloadFileStream(baseName(filePath), response)
        })
        .catch((_error) => {})
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
  height: calc(100vh - 61px);
  padding: 0;
  .lucien-row {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .lucien-col {
      height: 100%;
      &.col-left {
        min-width: 300px;
        width: 350px;
        flex: none;
        resize: horizontal;
        overflow: hidden;
      }
      &.col-right {
        flex: auto;
        width: 500px;
      }
    }
  }
  .list-container {
    height: 100%;
    background: #f3f3f3;
    // margin-top: 3px;
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
      }
      .actions {
        margin-top: 20px;
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
</style>
