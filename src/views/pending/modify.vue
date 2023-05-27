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
            row-key="change_id"
            :show-header="showHeader"
            @selection-change="handleSelectionChange"
            @row-click="handleCurrentChange"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column>
              <template slot="header">
                <el-button
                  v-permission="[1, 2, 3, 4, 0]"
                  type="primary"
                  size="mini"
                  @click="handleVerify(true, true)"
                >通过</el-button>
                <el-button
                  v-permission="[1, 2, 3, 4, 0]"
                  type="primary"
                  size="mini"
                  @click="handleVerify(false, true)"
                >驳回</el-button>
              </template>
              <template slot-scope="scope">
                <div class="item-box">
                  <span class="item-no">{{ scope.row.change_id }}</span>
                  <span class="item-supplier">{{
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
                  label="需求说明"
                  span="4"
                  :label-style="{
                    'margin-bottom': '20px',
                    'font-weight': 'bold',
                  }"
                >{{
                  detail.demand.introduce
                }}</el-descriptions-item>

                <el-descriptions-item label="项目名称">{{
                  detail.project ? detail.project.project_name : ""
                }}</el-descriptions-item>
                <el-descriptions-item v-if="$store.getters.roles.indexOf(0) < 0" label="发起部门">{{
                  detail.demand.flow ? detail.demand.flow.launch_dep.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item v-if="$store.getters.roles.indexOf(0) < 0" label="核算部门">{{
                  detail.demand.flow ? detail.demand.flow.account_dep.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item v-if="$store.getters.roles.indexOf(0) < 0" label="经费使用">
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
                <el-descriptions-item v-if="$store.getters.roles.indexOf(0) < 0" label="意向供应商" span="2">{{
                  detail.supplier ? detail.supplier.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item v-if="$store.getters.roles.indexOf(0) < 0" label="备注说明" span="4">{{
                  detail.demand.remark
                }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <el-table :data="[detail]" class="table-info" width="100%" border>
              <el-table-column
                prop="change_id"
                label="申请单号"
                align="left"
                min-width="200"
                show-overflow-tooltip
              />
              <el-table-column
                label="项目名称"
                align="center"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  {{ row.project.project_name }}
                </template>
              </el-table-column>
              <el-table-column label="审核状态" align="center" width="120">
                <template slot-scope="{ row }">
                  {{ row.change_status | statusTxt }}
                </template>
              </el-table-column>
              <el-table-column
                label="供应商"
                align="center"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  {{ row.supplier.name }}
                </template>
              </el-table-column>
              <el-table-column label="物件数量" align="center" width="120">
                <template slot-scope="{ row }">
                  {{ row.tasks.length }}
                </template>
              </el-table-column>
              <el-table-column label="发起方" align="center" width="120">
                <template slot-scope="{ row }">
                  {{ row.sponsor | initiatorTxt }}
                </template>
              </el-table-column>
              <el-table-column label="变更类型" align="center" width="120">
                <template slot-scope="{ row }">
                  <div class="modify-color">
                    {{ row.change_type | typeTxt }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="当前操作人"
                align="center"
                width="120"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  {{ row.current_operator || "-" }}
                </template>
              </el-table-column>
            </el-table>
            <div class="actions">
              <el-button
                v-if="detail.change_status === 0"
                v-permission="[1, 2, 3, 4, 0]"
                icon="el-icon-check"
                type="primary"
                size="mini"
                plain
                @click="handleVerify(true, false)"
              >
                通过
              </el-button>
              <el-button
                v-if="detail.change_status === 0"
                v-permission="[1, 2, 3, 4, 0]"
                type="primary"
                icon="el-icon-jinzhi"
                size="mini"
                plain
                @click="handleVerify(false, false)"
              >
                驳回
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-warning-outline"
                size="mini"
                plain
                @click.stop="handleModifyReason()"
              >
                变更原因
              </el-button>
              <el-button
                v-if="[3].indexOf(detail.change_status) >= 0"
                type="primary"
                icon="el-icon-warning-outline"
                size="mini"
                plain
                @click.stop="handleRejectReason()"
              >
                驳回原因
              </el-button>
              <el-button
                v-permission="[1, 3]"
                icon="el-icon-download"
                type="primary"
                size="mini"
                plain
                @click="handleDownloadTask()"
              >下载明细</el-button>
            </div>
          </div>
          <el-divider />
          <div
            v-if="detail.tasks && detail.tasks.length > 0"
            class="task-content"
          >
            <div class="title">
              <i class="el-icon-s-management" />
              <span>物件明细</span>
            </div>
            <el-descriptions
              v-if="detail.supplier"
              class="supplier-box"
              :column="4"
              :label-style="{
                'font-weight': 'bold',
                'align-items': 'center',
              }"
            >
              <el-descriptions-item label="供应商">{{
                detail.supplier ? detail.supplier.name : ""
              }}</el-descriptions-item>
            </el-descriptions>
            <el-table
              class="task-table"
              border
              :data="detail.tasks"
              row-key="task_id"
              @selection-change="handleTaskSelectionChange"
            >
              <el-table-column
                prop="task_id"
                label="物件单号"
                width="150"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <task-detail :task-id="scope.row.task_id" />
                </template>
              </el-table-column>
              <el-table-column
                prop="order_id"
                label="订单号"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column prop="task_image" label="缩略图" align="center">
                <template slot-scope="scope">
                  <el-image
                    v-if="scope.row.image_url"
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
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="task_name"
                label="物件名称"
                align="center"
                width="205"
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
              <el-table-column label="交付日期" width="200" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.deliver_old_date !== scope.row.deliver_new_date" class="modify-color">
                    <span>{{ scope.row.deliver_old_date }}</span>
                    <i class="el-icon-right" />
                    <span>{{ scope.row.deliver_new_date }}</span>
                  </div>
                  <div v-else class="modify-color">
                    <span>{{ scope.row.deliver_new_date }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.old_nums !== scope.row.new_nums" class="modify-color">
                    <span>{{ scope.row.old_nums }}</span>
                    <i class="el-icon-right" />
                    <span>{{ scope.row.new_nums }}</span>
                  </div>
                  <div v-else class="modify-color">{{ scope.row.new_nums }}</div>
                </template>
              </el-table-column>
              <el-table-column label="单位" align="center">
                <template slot-scope="scope">
                  {{ scope.row.work_unit || "-" }}
                </template>
              </el-table-column>
              <el-table-column prop="price" label="单价" align="center" />
              <el-table-column label="总价" align="center" min-width="200">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.pay_amount > 0"
                  >
                    {{ scope.row.pay_amount }} {{ scope.row.currency }}
                  </span>
                  <div
                    v-else-if="scope.row.new_amount !== scope.row.old_amount"
                    class="modify-color"
                  >
                    <span>{{ scope.row.old_amount }}</span>
                    <i class="el-icon-right" />
                    <span>{{ scope.row.new_amount }}</span>
                  </div>
                  <span v-else>{{ scope.row.old_amount }}</span>
                </template>
              </el-table-column>

            </el-table>
            <div v-permission="[1]" class="tongji">
              <div class="tongji-item">
                <div class="label">总价：</div>
                <div class="value">{{ tongji.totalAmount }}</div>
              </div>
              <div class="tongji-item">
                <div class="label">最晚交付日期：</div>
                <div class="value">{{ tongji.deliverDate }}</div>
              </div>
            </div>
            <div class="actions" />
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

    <!--驳回原因-->
    <el-dialog
      title="驳回原因"
      :visible.sync="dialogRejectReasonVisible"
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

    <!--变更原因-->
    <el-dialog
      title="变更原因"
      :visible.sync="dialogModifyReasonVisible"
      width="600px"
    >
      <div class="reason-box">
        <div class="content">
          {{ tempModify.change_reason }}
        </div>
        <div v-if="tempModify.initiator" class="user-info">
          <div>申请人：{{ tempModify.initiator.name }}</div>
          <div>申请时间：{{ tempModify.created_at }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchModifyOrderList,
  fetchChangeDetail,
  changeVerify,
  exportChangeTask
} from '@/api/order/index'

import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import TaskDetail from '@/components/TaskDetail'
import ResizeBox from '@/components/ResizeBox'
import { downloadFile } from '@/api/system/file'
import { baseName, downloadFileStream } from '@/utils/index'
const tagList = [
  { id: 0, name: '正式包' },
  { id: 1, name: '测试包' },
  { id: 2, name: '外派' },
  { id: 3, name: '动态团队' }
]
const initiatorMap = [
  { label: '供应商', value: 0 },
  { label: '项目组', value: 1 }
]
const typeMap = [
  { label: '数量变更', value: 0 },
  { label: '新增物件', value: 1 }
]
const statusMap = [
  { label: '待审核', value: 0 },
  { label: '审核中', value: 1 },
  { label: '已审核', value: 2 },
  { label: '审核不通过', value: 3 },
  { label: '待供应商确认', value: 4 }
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
    initiatorTxt(initiator) {
      const index = initiatorMap.findIndex((v) => v.value === initiator)
      if (index >= 0) {
        return initiatorMap[index].label
      }
      return initiator
    },
    typeTxt(type) {
      const index = typeMap.findIndex((v) => v.value === type)
      if (index >= 0) {
        return typeMap[index].label
      }
      return type
    },
    statusTxt(status) {
      const index = statusMap.findIndex((v) => v.value === status)
      if (index >= 0) {
        return statusMap[index].label
      }
      return status
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
      initiatorMap: initiatorMap,
      typeMap: typeMap,
      statusMap: statusMap,
      listQuery: {
        change_id: '',
        task_id: '',
        project_name: '',
        supplier_name: '',
        sponsor: '',
        change_type: '',
        change_status: '',
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
        create_task: '新增物件',
        resolve: '通过',
        reject: '驳回'
      },
      dialogStatus: '',
      dialogVerifyVisible: false,
      tempVerify: {
        change_id: '',
        status: '',
        reason: ''
      },
      verifyRules: {},
      temp: {},
      dialogRejectReasonVisible: false,
      dialogModifyReasonVisible: false,
      tempModify: {
        change_reason: '',
        initiator: undefined,
        created_at: ''
      }
    }
  },
  computed: {
    showHeader: function() {
      const hiddenPaths = [
        '/pending/xmz/assign/vendor',
        '/pending/xmz/demand/draft',
        '/pending/gg/demand/draft',
        '/pending/xmz/order/modify'
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
    tongji: function() {
      const tasks = this.detail.tasks
      let totalAmount = 0
      let deliverDate = ''
      tasks.forEach((task) => {
        totalAmount += parseFloat(task.new_amount)
        if (
          deliverDate === '' ||
          (deliverDate && new Date(deliverDate) < new Date(task.deliver_new_date))
        ) {
          deliverDate = task.deliver_new_date
        }
      })
      return { totalAmount, deliverDate }
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

      fetchModifyOrderList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.total = response.data.total
          this.list = response.data.list
          this.$nextTick(() => {
            if (this.list.length > 0) {
              if (!this.list[this.detailIndex]) {
                this.detailIndex = 0
              }
              this.$refs.listTable.setCurrentRow(this.list[this.detailIndex])
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
        (item) => item.change_id === row.change_id
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
      const detailData = await fetchChangeDetail({
        change_id: this.list[this.detailIndex].change_id
      }).catch((_error) => {})

      this.detailLoading = false
      this.detailLoaded = true
      this.detail = Object.assign({}, this.detail, detailData.data)
      this.multipleTaskSelection = []
    },
    /**
     * 通过驳回弹窗
     */
    handleVerify(pass, multi = true) {
      const checkeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择变更单')
          return false
        }
        const result = this.multipleSelection.some((listItem) => {
          if (checkeds.length >= 1) {
            const errorName = `每次只能对单个变更单进行审核`
            this.$message.error(errorName)
            return true
          }
          if ([0, 1, 4].indexOf(listItem.change_status) < 0) {
            const errorName = `[${listItem.change_id}] 该申请单不是待审核状态，无法审核`
            this.$message.error(errorName)
            return true
          }
          checkeds.push(listItem.change_id)
          return false
        })
        if (result) {
          return false
        }
      } else {
        checkeds.push(this.detail.change_id)
      }

      if (checkeds.length <= 0) {
        return false
      }

      this.dialogStatus = pass === true ? 'resolve' : 'reject'
      this.tempVerify.change_id = checkeds[0]
      this.tempVerify.status = pass ? 1 : 0
      if (pass) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
        this.$confirm('确定通过变更?', '提示', {
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
      changeVerify(tempData)
        .then(async(response) => {
          this.$message.success('处理成功')
          this.dialogVerifyVisible = false
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((error) => {})
    },
    /**
     * 驳回原因
     */
    handleRejectReason() {
      if (!this.detail.reject) {
        this.$message.error('对不起，没有驳回原因')
        return false
      }
      this.temp = JSON.parse(JSON.stringify(this.detail))
      this.$nextTick(() => {
        this.dialogRejectReasonVisible = true
      })
    },
    /**
     * 变更原因
     */
    handleModifyReason() {
      this.tempModify = Object.assign({}, this.tempModify, {
        change_reason: this.detail.change_reason,
        initiator: this.detail.initiator,
        created_at: this.detail.created_at
      })
      this.dialogModifyReasonVisible = true
    },
    downLoadContract(fileName, filePath) {
      downloadFile({ url: filePath })
        .then((response) => {
          downloadFileStream(fileName, response)
        })
        .catch((_error) => {})
    },
    /**
     * 下载物件
     */
    handleDownloadTask() {
      if (this.detail.change_id) {
        exportChangeTask(this.detail.change_id)
          .then((response) => {
            downloadFileStream(`${this.detail.demand.name}-${this.detail.demand.demand_id}.xlsx`, response)
          })
          .catch((error) => {
            console.log(error)
          })
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
    .modify-color {
      color: #f56c6c;
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
