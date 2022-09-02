<template>
  <div class="app-container">
    <div class="lucien-row">
      <div class="lucien-col col-left">
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
        v-loading="detailLoading"
        class="lucien-col col-right"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(237, 244, 253, 0.8)"
      >
        <div v-if="detailLoaded" class="grid-content detail-container">
          <div v-if="detail.demand" class="info-content">
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
                <el-descriptions-item label="项目代码">{{
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
                <el-descriptions-item label="需求名称" span="3">
                  <span>{{ detail.demand.name }}</span>
                  <el-tag size="mini" style="margin-left: 10px">{{
                    detail.demand.tag | tagText
                  }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="需求单号">{{
                  detail.demand.demand_id
                }}</el-descriptions-item>
                <el-descriptions-item label="需求状态" span="4">{{
                  detail.demand.status | statusText
                }}</el-descriptions-item>
                <el-descriptions-item label="需求说明" span="4">{{
                  detail.demand.introduce
                }}</el-descriptions-item>
                <el-descriptions-item label="需求品类" span="4">{{
                  detail.demand.category | categoryText
                }}</el-descriptions-item>
                <el-descriptions-item label="意向供应商" span="4">{{
                  detail.supplier ? detail.supplier.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="备注说明" span="4">{{
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
              <el-table-column label="审核状态" align="center" width="120">
                <template slot-scope="{ row }">
                  {{ row.change_status | statusTxt }}
                </template>
              </el-table-column>
            </el-table>
            <div class="actions">
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
                width="200"
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
              <el-table-column
                prop="task_name"
                label="物件名称"
                align="center"
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
                  <div class="modify-color">
                    <span>{{ scope.row.deliver_old_date }}</span>
                    <i class="el-icon-right" />
                    <span>{{ scope.row.deliver_new_date }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center">
                <template slot-scope="scope">
                  <div class="modify-color">
                    <span>{{ scope.row.old_nums }}</span>
                    <i class="el-icon-right" />
                    <span>{{ scope.row.new_nums }}</span>
                  </div>
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
                  <div
                    v-if="scope.row.new_amount !== scope.row.old_amount"
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
            <div class="actions">
              <el-button
                v-if="detail.change_status === 0"
                v-permission="[1, 2, 3, 4, 0]"
                icon="el-icon-check"
                type="primary"
                size="mini"
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
                @click="handleVerify(false, false)"
              >
                驳回
              </el-button>
            </div>
          </div>
          <div
            v-if="detail.demand && detail.demand.supplier_files.length > 0"
            class="download-content"
          >
            <div class="title">
              <i class="el-icon-s-management" />
              <span>下载附件</span>
            </div>
            <div class="files">
              <div
                v-for="(file, fileIndex) in detail.demand.supplier_files"
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
          </div>
        </div>
      </div>
    </div>
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
  changeVerify
} from '@/api/order/index'

import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import TaskDetail from '@/components/TaskDetail'
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
  components: { Pagination, TaskDetail },
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
    this.$bus.$on('navSearch', (keyword) => {
      this.listQuery = Object.assign({}, this.listQuery, { keyword })
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
            this.$refs.listTable.setCurrentRow(this.list[this.detailIndex])
            this.handleDetail()
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
      const detailData = await fetchChangeDetail({
        change_id: this.list[this.detailIndex].change_id
      }).catch((_error) => {})

      this.detailLoading = false
      this.detailLoaded = true
      this.detail = Object.assign({}, this.detail, detailData.data)
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
          downloadFileStream(baseName(filePath), response)
        })
        .catch((_error) => {})
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
  height: calc(100vh - 50px);
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
        overflow: auto;
      }
      &.col-right {
        flex: auto;
        width: 500px;
      }
    }
  }
  .list-container {
    height: 100%;
    background: #eef1f6;
    .item-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
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
    padding: 0 20px;
    box-sizing: border-box;
    .title {
      span {
        margin-left: 10px;
      }
    }
    .info-content {
      .description {
        margin-top: 10px;
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
    background: #eef1f6;
    .el-table__header th.el-table__cell.is-leaf {
      height: 60px;
      border-bottom: 1px solid rgb(221, 221, 221);
    }
    .el-table__body .el-table__row {
      background: #eef1f6;
      &:hover > td {
        background-color: #ffffff !important;
      }
      &.cuttent-row > td {
        background-color: #ffffff !important;
      }
      td.el-table__cell {
        border-bottom: 1px solid rgb(221, 221, 221);
      }
    }
    tr.current-row > td.el-table__cell {
      background-color: #ffffff;
    }
  }
  ::v-deep .detail-container .el-table.table-info th {
    background: #409eff !important;
    color: #ffffff;
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
</style>