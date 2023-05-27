<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.statement_id"
          placeholder="输入结算单号"
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
          class="filter-btn"
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
          class="filter-btn"
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExportOrders"
        >
          导出
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
        <!-- <el-popconfirm
          v-permission="[3]"
          title="确定提交吗？"
          @confirm="handleVerify(true)"
        ><el-button
          slot="reference"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
        >
          提交
        </el-button></el-popconfirm>
        <el-popconfirm
          v-permission="[3]"
          title="确定驳回吗？"
          @confirm="handleVerify(false)"
        ><el-button
          slot="reference"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
        >
          驳回
        </el-button></el-popconfirm> -->
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
      row-key="statement_id"
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
              <!-- <el-table-column label="" width="50" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.checked"
                    @change="clickCheckItemFn(row, scope.row)"
                  />
                </template>
              </el-table-column> -->
              <el-table-column
                prop="task_id"
                label="物件单号"
                min-width="200"
                align="center"
              >
                <template slot-scope="scope">
                  <task-detail :task-id="scope.row.task_id" />
                </template>
              </el-table-column>
              <el-table-column
                prop="order_id"
                min-width="200"
                label="订单号"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column prop="task_image" label="缩略图" align="center">
                <template slot-scope="scope">
                  <el-image
                    v-if="scope.row.image"
                    style="width: 50px; height: 50px"
                    :src="scope.row.image"
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
              />
              <el-table-column
                label="物件品类"
                align="center"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.category | categoryText }}
                </template>
              </el-table-column>
              <el-table-column
                prop="deliver_date"
                label="交付日期"
                min-width="200"
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
              <!-- <el-table-column
                label="作品"
                align="center"
                min-width="100"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="handleDownloadWork(scope.row, scope.$index, $index)"
                  >
                    下载
                  </el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结算单号" align="left" min-width="150">
        <template slot-scope="{ row }">
          <div class="pending-box">
            <span class="txt">{{ row.statement_id }}</span>
            <span v-if="row.pending > 0" class="tag" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" min-width="150">
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
      <el-table-column label="物件数量" align="center" min-width="100">
        <template slot-scope="{ row }">
          {{ row.nums }}
        </template>
      </el-table-column>
      <el-table-column label="工作总量" align="center" min-width="100">
        <template slot-scope="{ row }">
          {{ row.work_num }}
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center" min-width="100">
        <template slot-scope="{ row }">
          {{ row.work_amount }}
        </template>
      </el-table-column>
      <el-table-column label="停留时间" align="center" min-width="100">
        <template slot-scope="{ row }"> {{ row.stay_time }}小时 </template>
      </el-table-column>
      <el-table-column
        label="当前处理人"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.current_operator }}
        </template>
      </el-table-column>
      <el-table-column label="结算状态" align="center" min-width="120">
        <template slot-scope="{ row }">
          {{ row.statement_status | statusText }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="380"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="row.invoice_file"
            v-permission="[3]"
            style="margin-left: 80px"
            type="primary"
            size="mini"
            :loading="row.excelCreating"
            @click.stop="handleDownloadReconcile(row, $index)"
          >
            下载结算单
          </el-button>
          <el-button
            v-if="[4, 5].indexOf(row.statement_status) >= 0"
            v-permission="[3]"
            type="primary"
            size="mini"
            :loading="row.zipPacking"
            @click.stop="handlePackZip(row, $index)"
          >
            下载结算材料
          </el-button>
          <el-button
            v-if="row.invoice_file"
            v-permission="[3]"
            type="primary"
            size="mini"
            @click.stop="handleShowPack(row, $index)"
          >
            查看合同
          </el-button>
          <!-- <el-button
            v-if="[0, 1, 3].indexOf(row.statement_status) >= 0"
            v-permission="[3]"
            type="primary"
            size="mini"
            plain
            @click.stop="handleUploadReconcile(row)"
          >
            上传结算单
          </el-button>
          <el-button
            v-if="[0].indexOf(row.statement_status) >= 0"
            v-permission="[0]"
            type="primary"
            size="mini"
            plain
            @click.stop="handleUploadBill(row)"
          >
            申请结算
          </el-button>
          <el-button
            v-if="row.bill_file"
            v-permission="[3]"
            type="primary"
            size="mini"
            plain
            @click.stop="handleShowReconcile(row)"
          >
            查看结算单
          </el-button>
          <el-button
            v-if="row.invoice_file"
            v-permission="[3]"
            type="primary"
            size="mini"
            plain
            @click.stop="handleShowBill(row)"
          >
            查看发票
          </el-button> -->
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
        <el-form-item label="数量:" prop="work_num">
          <el-input
            v-model="tempModify.work_num"
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
            placeholder="请输入终止原因"
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

    <!--上传结算单-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogReconcileVisible"
    >
      <el-form
        ref="reconcileDataForm"
        class="dialog-form"
        :rules="reconcileRules"
        :model="tempReconcile"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="结算单" prop="bill_file">
          <el-upload
            :action="`${$baseUrl}/api/tools/upfile`"
            :on-success="handleAddReconcileFileSucc"
            :on-remove="handleReconcileFileChange"
            :file-list="reconcileFileList"
            :multiple="false"
            :limit="1"
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogReconcileVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="uploadReconcile">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--上传发票-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogBillVisible">
      <el-form
        ref="billDataForm"
        class="dialog-form"
        :disabled="dialogStatus === 'bill_show'"
        :rules="billRules"
        :model="tempBill"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="发票图片" prop="invoice_file">
          <el-upload
            class="bill-image-uploader"
            :action="`${$baseUrl}/api/tools/upfile`"
            :show-file-list="false"
            :on-success="handleInvoiceImageSuccess"
            :on-change="handleInvoiceImageChange"
          >
            <img
              v-if="tempBill.invoice_file_url"
              :src="tempBill.invoice_file_url"
              class="bill-image"
            >
            <i v-else class="el-icon-plus bill-image-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="序号:" prop="invoice_serial">
          <el-input
            v-model="tempBill.invoice_serial"
            placeholder="请输入发票序号"
            class="dialog-form-item"
          />
        </el-form-item>
        <el-form-item label="发票类型:" prop="invoice_type">
          <el-select
            v-model="tempBill.invoice_type"
            class="dialog-form-item"
            style="width: 100%"
          >
            <el-option
              v-for="(item, itemIndex) in [
                { label: '增值税专用发票', value: 1 },
                { label: '增值税普通发票', value: 0 },
              ]"
              :key="itemIndex"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开票日期:" prop="invoice_date">
          <el-date-picker
            v-model="tempBill.invoice_date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            class="dialog-form-item"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="发票代码:" prop="invoice_code">
          <el-input
            v-model="tempBill.invoice_code"
            placeholder="请输入发票代码"
            class="dialog-form-item"
          />
        </el-form-item>
        <el-form-item label="发票号码:" prop="invoice_number">
          <el-input
            v-model="tempBill.invoice_number"
            placeholder="请输入发票号码"
            class="dialog-form-item"
          />
        </el-form-item>
        <el-form-item label="价格合计:" prop="invoice_amount">
          <el-input
            v-model="tempBill.invoice_amount"
            placeholder="请输入价格合计"
            class="dialog-form-item"
          />
        </el-form-item>
      </el-form>
      <div v-if="dialogStatus === 'bill'" slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogBillVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="uploadBill">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--查看合同详情弹窗-->
    <el-dialog
      title="合同详情"
      :visible.sync="dialogPactVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataDetail"
        :model="pact"
        label-position="left"
        label-width="150px"
        style="width: 500px; margin-left: 100px"
        class="dialog-pact"
      >
        <el-form-item label="供应商:">
          <div v-if="pact.supplier && pact.supplier.name">
            {{ pact.supplier.name }}
          </div>
        </el-form-item>
        <el-form-item label="签约主体:">
          <div v-if="pact.sub">{{ pact.sub.name }}</div>
        </el-form-item>
        <el-form-item label="合同号:">
          <div>{{ pact.bn }}</div>
        </el-form-item>
        <el-form-item label="合同名称:">
          <div>{{ pact.pact_name }}</div>
        </el-form-item>
        <el-form-item label="登记类型">
          <div>{{ pact.pact_type | typeText }}</div>
        </el-form-item>
        <el-form-item label="合同有效时间:">
          <div v-if="pact.period_start">
            {{ pact.period_start | dateFormat }}至{{
              pact.period_end | dateFormat
            }}
          </div>
        </el-form-item>
        <el-form-item label="合同附件">
          <div class="file-box">
            <div
              v-for="(file, fileIndex) in pact.file_url"
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
        <el-form-item label="合同签署日期:">
          <div v-if="pact.sign_date">{{ pact.sign_date | dateFormat }}</div>
        </el-form-item>
        <el-form-item label="备注">
          <div>{{ pact.remark }}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogPactVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchReconcileOrderList,
  uploadBillData,
  uploadInvoiceData,
  submitStatement,
  rejectStatement,
  createExcel,
  downloadStatementdMaterial
} from '@/api/order/index'
import { fetchPactDetail } from '@/api/provider/contract'
import { downloadFile } from '@/api/system/file'
import { previewFile, downloadFileStream, baseName } from '@/utils/index'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import TaskDetail from '@/components/TaskDetail'
import { exportOrders } from '@/api/system/download'

const typeList = [
  { id: 0, name: '关联合同' },
  { id: 1, name: '单一主体合同' }
]

export default {
  components: { Pagination, ElImageViewer, TaskDetail },
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
        0: '待上传发票',
        1: '待申请用印',
        2: '待上传结算单',
        3: '待提交结算申请',
        4: '待支付登记',
        5: '已付款',
        6: '终止'
      }
      return statusMap[status]
    },
    typeText(type) {
      let typeText = ''
      typeList.some((item) => {
        if (type === item.id) {
          typeText = item.name
          return true
        }
        return false
      })
      return typeText
    },
    dateFormat(time) {
      const data = time.split(' ')
      return data[0] || time
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
        statement_id: '',
        task_id: '',
        project_name: '',
        supplier_name: '',
        tag: '',
        date_range: [],
        page: 1,
        page_num: 10,
        all: true
      },
      textMap: {
        resolve: '通过',
        reject: '驳回',
        reconcile: '上传结算单',
        bill: '结算申请',
        bill_show: '查看发票'
      },
      dialogStatus: '',
      dialogRejectReasonVisible: false,
      dialogStopReasonVisible: false,
      dialogVerifyVisible: false,
      tempVerify: {
        statement_id: [],
        status: false,
        reason: ''
      },
      verifyRules: {},
      dialogReconcileVisible: false,
      reconcileRules: {
        bill_file: [
          { required: true, message: '请选择结算单文件', trigger: 'blur' }
        ]
      },
      tempReconcile: {
        bill_file: ''
      },
      reconcileFileList: [],
      dialogBillVisible: false,
      billRules: {
        invoice_file: [
          { required: true, message: '请添加发票图片', trigger: 'blur' }
        ],
        invoice_serial: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ],
        invoice_type: [
          { required: true, message: '请输入发票类型', trigger: 'blur' }
        ],
        invoice_date: [
          { required: true, message: '请选择开票日期', trigger: 'blur' }
        ],
        invoice_code: [
          { required: true, message: '请输入发票代码', trigger: 'blur' }
        ],
        invoice_number: [
          { required: true, message: '请输入发票号码', trigger: 'blur' }
        ],
        invoice_amount: [
          { required: true, message: '请输入价格合计', trigger: 'blur' }
        ]
      },
      tempBill: {
        invoice_file: '',
        invoice_serial: '',
        invoice_type: '',
        invoice_date: '',
        invoice_code: '',
        invoice_number: '',
        invoice_amount: ''
      },
      dialogModifyVisible: false,
      tempModify: {
        work_num: '',
        work_price: '',
        work_amount: '',
        deliver_date: '',
        reason: ''
      },
      modifyRules: {},
      pact: {},
      dialogPactVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    expandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => {
        return row.statement_id
      })
    },
    clickRowHandle(row, column, event) {
      if (this.expandRowKeys.includes(row.statement_id)) {
        this.expandRowKeys = this.expandRowKeys.filter(
          (val) => val !== row.statement_id
        )
      } else {
        this.expandRowKeys.push(row.statement_id)
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

      fetchReconcileOrderList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.total = response.data.total
          let list = response.data.list
          if (this.$store.getters.pendings['/order/reconcile']) {
            const pendings =
              this.$store.getters.pendings['/order/reconcile'].children
            list = response.data.list.map((listItem) => {
              listItem.pending = pendings[listItem.statement_id] || 0
              // 是否已选中
              const orderIndex = this.list.findIndex(
                (orderItem) => orderItem.statement_id === listItem.statement_id
              )
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
      this.getList()
    },
    /**
     * 展开
     */
    handleExpand(isExpand) {
      if (isExpand) {
        this.list.forEach((listItem) => {
          if (listItem.checked) {
            if (this.expandRowKeys.indexOf(listItem.statement_id) < 0) {
              this.expandRowKeys.push(listItem.statement_id)
            }
          }
        })
      } else {
        this.list.forEach((listItem) => {
          if (listItem.checked) {
            const keyIndex = this.expandRowKeys.indexOf(listItem.statement_id)
            if (keyIndex >= 0) {
              this.expandRowKeys.splice(keyIndex, 1)
            }
          }
        })
      }
    },
    /**
     * 通过驳回弹窗
     */
    handleVerify(pass) {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          if (listItem.checked) {
            if ([1].indexOf(listItem.statement_status) < 0) {
              const errorName =
                pass === true
                  ? `[${listItem.statement_id}] 该结算单的状态，无法提交`
                  : `[${listItem.statement_id}] 该结算单的状态，无法驳回`
              this.$message.error(errorName)
              return true
            }
            checkeds.push(listItem.statement_id)
            return false
          }
          return false
        })
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择结算单')
          return false
        }
      } else {
        return false
      }

      this.dialogStatus = pass === true ? 'resolve' : 'reject'
      this.tempVerify.status = pass
      this.tempVerify.statement_id = checkeds
      if (pass) {
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

      if (pass === true) {
        this.doVerify()
        return true
      }

      this.dialogVerifyVisible = true
      this.$nextTick(() => {
        this.$refs['verifyDataForm'].clearValidate()
      })
    },
    /**
     * 通过申请弹窗
     */
    confirmVerify() {
      this.$refs['verifyDataForm'].validate((valid) => {
        if (valid) {
          this.doVerify()
        }
      })
    },
    doVerify() {
      const tempData = JSON.parse(JSON.stringify(this.tempVerify))
      const func = tempData.status ? submitStatement : rejectStatement
      func({ statement_id: tempData.statement_id, reason: tempData.reason })
        .then(async(response) => {
          // tempData.statement_id.forEach(checkedStatementId => {
          //   const listIndex = this.list.findIndex(listItem => listItem.statement_id === checkedStatementId)
          //   const dataIndex = response.data.findIndex(dataItem => dataItem.statement_id === checkedStatementId)
          //   if (listIndex >= 0 && dataIndex >= 0) {
          //     this.$set(this.list[listIndex], 'statement_status', response.data[dataIndex].statement_status)
          //     this.$set(this.list[listIndex], 'current_operator', response.data[dataIndex].current_operator)
          //   }
          // })
          this.$notify({
            title: '成功',
            message: '处理成功',
            type: 'success',
            duration: 2000
          })
          this.dialogVerifyVisible = false
          await this.$store.dispatch('user/getPending')
          this.getList(false)
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
      this.tempFinish = Object.assign({}, this.tempFinish, { file: files })
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
     * 上传结算单弹窗
     */
    handleUploadReconcile(reconcile) {
      this.tempReconcile = Object.assign({}, this.tempReconcile, {
        statement_id: reconcile.statement_id,
        file: ''
      })
      this.dialogStatus = 'reconcile'
      this.dialogReconcileVisible = true
      this.$nextTick(() => {
        this.$refs['reconcileDataForm'].clearValidate()
      })
    },
    handleAddReconcileFileSucc(response, file, fileList) {
      this.handleReconcileFileChange(file, fileList)
    },
    handleReconcileFileChange(file, fileList) {
      if (fileList.length === 0) {
        this.tempReconcile = Object.assign({}, this.tempReconcile, {
          bill_file: '',
          bill_file_url: ''
        })
      } else if (file.response) {
        this.tempReconcile = Object.assign({}, this.tempReconcile, {
          bill_file: file.response.data.file_id,
          bill_file_url: file.response.data.url
        })
      }
    },
    /**
     * 上传结算单
     */
    uploadReconcile() {
      this.$refs['reconcileDataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.tempReconcile))
          uploadBillData(temp).then(() => {
            const index = this.list.findIndex(
              (listItem) => listItem.statement_id === temp.statement_id
            )
            if (index >= 0) {
              this.$set(this.list[index], 'bill_file', temp.bill_file_url)
            }
            this.dialogReconcileVisible = false
            this.$notify({
              title: '成功',
              message: '上传成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    /**
     * 上传发票弹窗
     */
    handleUploadBill(reconcile) {
      this.tempBill = Object.assign({}, this.tempBill, {
        statement_id: reconcile.statement_id,
        invoice_file: '',
        invoice_serial: '',
        invoice_type: '',
        invoice_date: '',
        invoice_code: '',
        invoice_number: '',
        invoice_amount: ''
      })
      this.dialogStatus = 'bill'
      this.dialogBillVisible = true
      this.$nextTick(() => {
        this.$refs['billDataForm'].clearValidate()
      })
    },
    /**
     * 上传发票图片成功回调
     */
    handleInvoiceImageSuccess(response, file) {
      this.handleInvoiceImageChange(file)
    },
    /**
     * 上传发票图片变化回调
     */
    handleInvoiceImageChange(file) {
      if (file.response) {
        this.tempBill = Object.assign({}, this.tempBill, {
          invoice_file: file.response.data.file_id,
          invoice_file_url: file.response.data.url
        })
      }
    },
    /**
     * 上传发票
     */
    uploadBill() {
      this.$refs['billDataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.tempBill))
          uploadInvoiceData(temp).then(async(response) => {
            // const index = this.list.findIndex(listItem => listItem.statement_id === temp.statement_id)
            // if (index >= 0) {
            //   const { statement_status, current_operator } = response.data
            //   this.$set(this.list[index], 'statement_status', statement_status)
            //   this.$set(this.list[index], 'current_operator', current_operator)
            //   this.$set(this.list[index], 'invoice_file', temp.invoice_file_url)
            // }
            this.dialogBillVisible = false
            this.$notify({
              title: '成功',
              message: '上传成功',
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
     * 申请变更
     */
    handleModify() {
      this.tempModify = Object.assign({}, this.tempModify, {
        work_price: 10,
        work_amount: 10000
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
          this.$notify({
            title: '成功',
            message: '申请成功',
            type: 'success',
            duration: 2000
          })
          this.dialogModifyVisible = false
        }
      })
    },
    /**
     * 查看结算单
     */
    handleShowReconcile(row) {
      if (!row.bill_file) {
        this.$message.error('还未上传结算单')
        return false
      }
      previewFile('结算单', row.bill_file)
    },
    /**
     * 查看发票
     */
    handleShowBill(row) {
      // this.$set(this.list[index], 'showViewer', true)
      // if (!row.invoice_file) {
      //   this.$message.error('还未上传发票')
      //   return false
      // }
      // previewFile('发票', row.invoice_file)
      this.tempBill = Object.assign({}, this.tempBill, {
        statement_id: row.statement_id,
        invoice_file_url: row.invoice_file || '',
        invoice_serial: row.invoice_serial || '',
        invoice_type: row.invoice_type || 0,
        invoice_date: row.invoice_date || '',
        invoice_code: row.invoice_code || '',
        invoice_number: row.invoice_number || '',
        invoice_amount: row.invoice_amount || ''
      })
      this.dialogStatus = 'bill_show'
      this.dialogBillVisible = true
    },
    // closeViewer(index) {
    //   this.$set(this.list[index], 'showViewer', false)
    // }
    /**
     * 导出
     */
    handleExportOrders() {
      const { statement_id, task_id, project_name, supplier_name, date_range } = this.listQuery
      let filter = {
        statement_id,
        task_id,
        project_name,
        supplier_name,
        date_range,
        class_name: 'statement'
      }

      const checked = []
      this.list.forEach(item => {
        if (item.checked) {
          checked.push(item.statement_id)
        }
      })

      if (checked.length > 0) {
        filter = Object.assign({}, filter, { statement_id: checked })
      }

      exportOrders(filter)
        .then((response) => {
          const fileName = `结算单-${this.$moment().format('YYYYMMD')}.xlsx`
          downloadFileStream(fileName, response)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 下载结算单
     */
    handleDownloadReconcile(row, index) {
      this.$set(this.list[index], 'excelCreating', true)
      createExcel({ statement_id: row.statement_id })
        .then((resp) => {
          downloadFile({ url: resp.url })
            .then((response) => {
              this.$set(this.list[index], 'excelCreating', false)
              downloadFileStream(baseName(resp.url), response)
            })
            .catch((_error) => {
              this.$set(this.list[index], 'excelCreating', false)
            })
        })
        .catch((_error) => {
          // this.$message.error('哎呀，下载结算单出错啦')
          this.$set(this.list[index], 'excelCreating', false)
        })
    },
    handleShowPack(row, index) {
      if (row.pact_id > 0) {
        this.pactDetailLoading = true
        this.$set(this.list[index], 'pactDetailLoading', true)
        fetchPactDetail({ pact_id: row.pact_id })
          .then((response) => {
            this.$set(this.list[index], 'pactDetailLoading', false)
            this.pact = Object.assign({}, this.pact, response.data)
            this.$nextTick(() => {
              this.dialogPactVisible = true
            })
          })
          .catch((_error) => {
            this.$set(this.list[index], 'pactDetailLoading', false)
          })
      }
    },
    downLoadContract(fileName, filePath) {
      downloadFile({ url: filePath })
        .then((response) => {
          downloadFileStream(fileName, response)
        })
        .catch((_error) => {})
    },
    /**
     * 打包所有文件
     */
    handlePackZip(row, index) {
      this.$set(this.list[index], 'zipPacking', true)
      downloadStatementdMaterial({ statement_id: row.statement_id })
        .then((resp) => {
          downloadFile({ url: resp.url })
            .then(async(response) => {
              downloadFileStream(baseName(resp.url), response)
              this.$set(this.list[index], 'zipPacking', false)
            })
            .catch((_error) => {})
        })
        .catch((_error) => {
          // this.$message.error('哎呀，打包出错啦')
          this.$set(this.list[index], 'zipPacking', false)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
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
    margin-bottom: 10px;
    @extend %flex-space-between;
    align-items: flex-end;
    .filter-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .filter-item {
        width: 15%;
        margin: 0 10px 10px 0;
      }
      .filter-btn {
        margin: 0 10px 10px 0;
      }
    }
    .filter-right {
      display: flex;
      flex-wrap: nowrap;
    }
  }
  .list-container {
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
  }

  .bill-image-uploader {
    .el-upload {
      .bill-image-uploader-icon {
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
    .bill-image {
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
.dialog-pact {
  .dialog-form-item {
    width: 400px;
  }
  .add-file-btn {
    color: $themeColor;
    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }
  .file-box {
    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .file-name {
        flex: auto;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-button {
        flex: none;
        margin-left: 10px;
        height: 30px;
      }
    }
  }
}
</style>
