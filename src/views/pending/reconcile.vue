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
            row-key="statement_id"
            :show-header="showHeader"
            @selection-change="handleSelectionChange"
            @row-click="handleCurrentChange"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column>
              <template slot="header">
                <!-- <el-button
                  v-permission="[0]"
                  type="primary"
                  size="mini"
                  @click.stop="handleUploadBill(true)"
                >
                  申请结算
                </el-button> -->
                <el-button
                  v-permission="[3]"
                  type="primary"
                  size="mini"
                  @click="handleVerify(true, true)"
                >
                  提交
                </el-button>
                <el-button
                  v-permission="[3]"
                  type="primary"
                  size="mini"
                  @click="handleVerify(false, true)"
                >
                  驳回
                </el-button>
              </template>
              <template slot-scope="scope">
                <div class="item-box">
                  <span class="item-no">{{ scope.row.statement_id }}</span>
                  <!-- <span class="item-name">{{ scope.row.name }}</span> -->
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
          v-if="detailLoaded && detail.project"
          class="grid-content detail-container"
        >
          <div class="info-content">
            <div class="title">
              <i class="el-icon-s-management" />
              <span>结算单状态预览</span>
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
                <el-descriptions-item label="项目代码">{{
                  detail.project ? detail.project.bn : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="经费使用">
                  {{ detail.project ? detail.project.budget_used : 0 }}/{{
                    detail.project ? detail.project.budget_cost : 0
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="项目创建时间">{{
                  detail.project ? detail.project.created_at : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="流程名称">{{
                  detail.process ? detail.process.flow_name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="流程代码">{{
                  detail.process ? detail.process.bn : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="流程代码">{{
                  detail.process ? detail.process.bn : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="需求方">{{
                  detail.process ? detail.process.demand : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="供应商">{{
                  detail.supplier ? detail.supplier.name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="合同备注名">{{
                  detail.pact ? detail.pact.pact_name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="银行及开户行">{{
                  detail.supplier ? detail.supplier.bank_name : ""
                }}</el-descriptions-item>
                <el-descriptions-item label="银行账号">{{
                  detail.supplier ? detail.supplier.bank_account : ""
                }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <el-table :data="[detail]" class="table-info" width="100%" border>
              <el-table-column
                label="结算单号"
                align="left"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  <div class="pending-box">
                    <span class="txt">{{ row.statement_id }}</span>
                  </div>
                </template>
              </el-table-column>
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
              <el-table-column label="订单状态" align="center" width="100">
                <template slot-scope="{ row }">
                  {{ row.statement_status | statusText }}
                </template>
              </el-table-column>
              <el-table-column
                label="供应商"
                align="center"
                min-width="250"
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
                <template slot-scope="{ row }">
                  {{ row.stay_time }}小时
                </template>
              </el-table-column>
              <el-table-column
                label="当前处理人"
                align="center"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  {{ row.current_operator }}
                </template>
              </el-table-column>
            </el-table>
            <div class="actions">
              <el-button
                v-if="[1].indexOf(detail.statement_status) >= 0"
                v-permission="[3]"
                type="primary"
                icon="el-icon-zhihuan"
                size="mini"
                plain
                @click.stop="handleApplySeal()"
              >
                申请用印
              </el-button>
              <!-- <el-button
                v-if="detail.invoice_file"
                v-permission="[3]"
                type="primary"
                icon="el-icon-search"
                size="mini"
                plain
                @click.stop="handleShowBill()"
              >
                查看发票
              </el-button> -->
              <el-button
                v-if="[2].indexOf(detail.statement_status) >= 0"
                v-permission="[3]"
                type="primary"
                icon="el-icon-document"
                size="mini"
                plain
                @click.stop="handleUploadReconcile()"
              >
                上传结算单
              </el-button>
              <el-button
                v-if="[4].indexOf(detail.statement_status) >= 0"
                v-permission="[3]"
                type="primary"
                icon="el-icon-date"
                size="mini"
                plain
                @click.stop="handlePayRegister()"
              >
                支付登记
              </el-button>
              <el-button
                v-if="[0, 3].indexOf(detail.statement_status) >= 0"
                v-permission="[0]"
                type="primary"
                icon="el-icon-document"
                size="mini"
                @click.stop="handleUploadBill(false)"
              >
                申请结算
              </el-button>
              <el-button
                v-if="[0, 3].indexOf(detail.statement_status) >= 0"
                v-permission="[0]"
                type="primary"
                icon="el-icon-download"
                size="mini"
                @click.stop="handleDownloadBillDoc(false)"
              >
                开票文档下载
              </el-button>
              <el-button
                v-if="[3].indexOf(detail.statement_status) >= 0"
                v-permission="[0]"
                type="primary"
                icon="el-icon-warning-outline"
                size="mini"
                @click.stop="handleRejectReason()"
              >
                驳回原因
              </el-button>
              <el-button
                v-if="detail.invoice_file"
                v-permission="[3]"
                type="primary"
                icon="el-icon-box"
                size="mini"
                plain
                :loading="zipPacking"
                @click.stop="handlePackZip()"
              >
                打包所有文件
              </el-button>
              <el-button
                v-if="detail.invoice_file"
                v-permission="[3]"
                style="margin-left: 120px"
                type="primary"
                icon="el-icon-download"
                size="mini"
                plain
                :loading="excelCreating"
                @click.stop="handleDownloadReconcile()"
              >
                下载结算单
              </el-button>
              <el-button
                v-if="detail.invoice_file"
                v-permission="[3]"
                type="primary"
                icon="el-icon-tickets"
                size="mini"
                plain
                @click.stop="handlePackZip()"
              >
                查看合同
              </el-button>
              <el-button
                v-permission="[3]"
                type="primary"
                icon="el-icon-jinzhi"
                size="mini"
                plain
                @click.stop="handleVerify(false, false)"
              >
                驳回结算单
              </el-button>
            </div>
          </div>
          <el-divider />
          <div
            v-if="detail.invoice_file"
            v-permission="[3]"
            class="info-content"
          >
            <div class="title">
              <i class="el-icon-s-management" />
              <span>发票信息</span>
            </div>
            <el-divider />
            <div class="description">
              <el-descriptions
                class="margin-top"
                :column="4"
                :label-style="{
                  'font-weight': 'bold',
                  'align-items': 'flex-start',
                  width: '100px',
                }"
              >
                <el-descriptions-item
                  v-if="tempBill.invoice_detail"
                  label="发票明细"
                  span="4"
                >
                  {{ tempBill.invoice_detail }}
                </el-descriptions-item>
                <el-descriptions-item label="发票图片" span="4">
                  <el-image
                    v-if="tempBill.invoice_file_url"
                    style="height: 100px"
                    :src="tempBill.invoice_file_url"
                    :preview-src-list="[tempBill.invoice_file_url]"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="序号">{{
                  tempBill.invoice_serial
                }}</el-descriptions-item>
                <el-descriptions-item label="发票类型" span="3">
                  <template
                    v-if="tempBill.invoice_type === 1"
                  >增值税发票</template>
                  <template
                    v-else-if="tempBill.invoice_type === 0"
                  >普通发票</template>
                </el-descriptions-item>
                <el-descriptions-item label="开票日期">{{
                  tempBill.invoice_date
                }}</el-descriptions-item>
                <el-descriptions-item label="发票代码" span="3">{{
                  tempBill.invoice_code
                }}</el-descriptions-item>
                <el-descriptions-item label="发票号码">{{
                  tempBill.invoice_number
                }}</el-descriptions-item>
                <el-descriptions-item label="价格合计" span="3">{{
                  tempBill.invoice_amount
                }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <el-divider />
          </div>
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
            <el-table
              :data="detail.tasks"
              class="task-table"
              width="100%"
              border
              row-key="task_id"
              @selection-change="handleTaskSelectionChange"
            >
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
                prop="receipt_id"
                label="验收单号"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="order_id"
                label="订单号"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column prop="task_image" label="缩略图" align="center">
                <template slot-scope="scope">
                  <el-image
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
              <el-table-column prop="work_num" label="数量" align="center" />
              <el-table-column prop="work_unit" label="单位" align="center" />
              <el-table-column prop="work_price" label="单价" align="center" />
              <el-table-column prop="work_amount" label="总价" align="center" />
              <el-table-column
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
                    :loading="scope.row.downloading"
                    @click="handleDownloadWork(scope.row, scope.$index)"
                  >
                    下载
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="actions" />
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
                v-for="file in detail.files"
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
                v-for="file in detail.supplier_files"
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

    <!--上传结算单-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogReconcileVisible"
      :close-on-click-modal="false"
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogBillVisible"
      :close-on-click-modal="false"
    >
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
                { label: '普通发票', value: 0 },
                { label: '增值税发票', value: 1 },
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
        <el-form-item label="发票明细:" prop="invoice_detail">
          <el-input
            v-model="tempBill.invoice_detail"
            type="textarea"
            placeholder="请输入发票明细"
            class="dialog-form-item"
          />
        </el-form-item>
        <div class="notice" style="color: red">
          注：实体发票请在结算确认通过后再寄出
        </div>
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

    <!--支付登记-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogPayRegVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        ref="payRegDataForm"
        class="dialog-form"
        :rules="payRegRules"
        :model="tempPayReg"
        label-position="left"
        label-width="100px"
        style="margin: 0 50px"
      >
        <el-form-item label="支付日期:" prop="pay_date">
          <el-date-picker
            v-model="tempPayReg.pay_date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            class="dialog-form-item"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogPayRegVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="doPayRegister">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchReconcileOrderList,
  fetchReconcileDetail,
  uploadBillData,
  uploadInvoiceData,
  submitStatement,
  rejectStatement,
  applySeal,
  packZip,
  createExcel,
  fillPayDate
} from '@/api/order/index'
import { downloadFile } from '@/api/system/file'
import { previewFile, downloadFileStream, baseName } from '@/utils/index'

import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import TaskDetail from '@/components/TaskDetail'
import ResizeBox from '@/components/ResizeBox'
const tagList = [
  { id: 0, name: '正式包' },
  { id: 1, name: '测试包' },
  { id: 2, name: '外派' },
  { id: 3, name: '动态团队' }
]
const statusMap = {
  0: '待上传发票',
  1: '待申请用印',
  2: '待上传结算单',
  3: '待提交结算申请',
  4: '待支付登记',
  5: '已付款'
}
export default {
  components: { TaskDetail, ResizeBox },
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
      return statusMap[status]
    }
  },
  data() {
    return {
      globelCheckedAll: false,
      expandRowKeys: [],
      total: 0,
      list: [],
      invoiceDoc: '',
      multipleSelection: [],
      listLoading: true,
      listQuery: {
        statement_id: '',
        task_id: '',
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
        resolve: '通过',
        reject: '驳回',
        reconcile: '上传结算单',
        bill: '结算申请',
        bill_show: '查看发票',
        pay_register: '支付登记'
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
        invoice_amount: '',
        invoice_detail: ''
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
      zipPacking: false,
      excelCreating: false,
      dialogPayRegVisible: false,
      tempPayReg: {
        statement_id: '',
        pay_date: ''
      },
      payRegRules: {
        pay_date: [
          { required: true, message: '请选择支付日期', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showHeader: function() {
      const hiddenPaths = [
        '/pending/xmz/assign/vendor',
        '/pending/xmz/demand/draft',
        '/pending/gg/demand/draft',
        '/pending/gys/order/reconcile'
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

      fetchReconcileOrderList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.total = response.data.total
          const list = response.data.list
          this.list = list
          this.invoiceDoc = response.data.invoice_doc
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
        (item) => item.statement_id === row.statement_id
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
      const detailData = await fetchReconcileDetail({
        statement_id: this.list[this.detailIndex].statement_id
      }).catch((_error) => {})

      this.detailLoading = false
      this.detailLoaded = true
      this.detail = Object.assign({}, this.detail, detailData.data)
      this.multipleTaskSelection = []

      this.handleShowBill()
    },
    /**
     * 通过驳回弹窗
     */
    handleVerify(pass, multi = true) {
      const checkeds = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择结算单')
          return false
        }
        const result = this.multipleSelection.some((listItem) => {
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
        })
        if (result) {
          return false
        }
      } else {
        if ([1].indexOf(this.detail.statement_status) < 0) {
          const errorName =
            pass === true
              ? `[${this.detail.statement_id}] 该结算单的状态，无法提交`
              : `[${this.detail.statement_id}] 该结算单的状态，无法驳回`
          this.$message.error(errorName)
          return false
        }
        checkeds.push(this.detail.statement_id)
      }

      this.dialogStatus = pass === true ? 'resolve' : 'reject'
      this.tempVerify.status = pass
      this.tempVerify.statement_id = checkeds
      this.tempVerify.reason = ''
      if (pass) {
        if (this.verifyRules.reason) {
          delete this.verifyRules.reason
        }
        this.$confirm('确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.doVerify()
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
          this.doVerify()
        }
      })
    },
    doVerify() {
      const tempData = JSON.parse(JSON.stringify(this.tempVerify))
      const func = tempData.status ? submitStatement : rejectStatement
      func({ statement_id: tempData.statement_id, reason: tempData.reason })
        .then(async(response) => {
          this.$message.success('处理成功')
          this.dialogVerifyVisible = false
          await this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((_error) => {})
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
     * 上传结算单弹窗
     */
    handleUploadReconcile() {
      this.tempReconcile = Object.assign({}, this.tempReconcile, {
        statement_id: this.detail.statement_id,
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
            this.$message.success('上传成功')
          })
        }
      })
    },
    /**
     * 上传发票弹窗
     */
    handleUploadBill(multi = true) {
      const statement_id = []

      if (multi) {
        if (this.multipleSelection.length <= 0) {
          this.$message.error('请先选择结算单')
          return false
        }

        const result = this.multipleSelection.some((listItem) => {
          if ([0, 3].indexOf(listItem.statement_status) < 0) {
            const errorName = `[${listItem.statement_id}] 该结算单的状态，无法申请`
            this.$message.error(errorName)
            return true
          }
          statement_id.push(listItem.statement_id)
          return false
        })
        if (result) {
          return false
        }
      } else {
        if ([0, 3].indexOf(this.detail.statement_status) < 0) {
          const errorName = `[${this.detail.statement_id}] 该结算单的状态，无法申请`
          this.$message.error(errorName)
          return false
        }
        statement_id.push(this.detail.statement_id)
      }

      this.tempBill = Object.assign({}, this.tempBill, {
        statement_id: statement_id,
        invoice_file: '',
        invoice_file_url: '',
        invoice_serial: '',
        invoice_type: '',
        invoice_date: '',
        invoice_code: '',
        invoice_number: '',
        invoice_amount: '',
        invoice_detail: ''
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
            this.dialogBillVisible = false
            this.$message.success('上传成功')
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
        work_amount: 10000,
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
          this.$message.success('申请成功')
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
    handleShowBill() {
      this.tempBill = Object.assign({}, this.tempBill, {
        statement_id: this.detail.statement_id,
        invoice_file_url: this.detail.invoice_file || '',
        invoice_serial: this.detail.invoice_serial || '',
        invoice_type: this.detail.invoice_type || 0,
        invoice_date: this.detail.invoice_date || '',
        invoice_code: this.detail.invoice_code || '',
        invoice_number: this.detail.invoice_number || '',
        invoice_amount: this.detail.invoice_amount || '',
        invoice_detail: this.detail.invoice_detail || ''
      })
      // this.dialogStatus = 'bill_show'
      // this.dialogBillVisible = true
    },
    downLoadContract(fileName, filePath) {
      downloadFile({ url: filePath })
        .then((response) => {
          downloadFileStream(baseName(filePath), response)
        })
        .catch((_error) => {})
    },
    /**
     * 申请用印
     */
    handleApplySeal() {
      applySeal({ statement_id: this.detail.statement_id })
        .then(() => {
          this.$set(this.detail, 'apply_seal', 1)
          this.$message.success('申请成功')
        })
        .catch((_error) => {})
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
     * 打包所有文件
     */
    handlePackZip() {
      this.zipPacking = true
      packZip({ statement_id: this.detail.statement_id })
        .then((resp) => {
          downloadFile({ url: resp.url })
            .then((response) => {
              downloadFileStream(baseName(resp.url), response)
            })
            .catch((_error) => {})
        })
        .catch((_error) => {
          // this.$message.error('哎呀，打包出错啦')
          this.zipPacking = false
        })
    },
    /**
     * 开票文档下载
     */
    handleDownloadBillDoc() {
      if (this.invoiceDoc) {
        downloadFile({ url: this.invoiceDoc })
          .then((response) => {
            downloadFileStream(baseName(this.invoiceDoc), response)
          })
          .catch((_error) => {})
      } else {
        this.$message.error('开票信息文档不存在')
      }
    },
    /**
     * 下载结算单
     */
    handleDownloadReconcile() {
      this.excelCreating = true
      createExcel({ statement_id: this.detail.statement_id })
        .then((resp) => {
          downloadFile({ url: resp.url })
            .then((response) => {
              downloadFileStream(baseName(resp.url), response)
            })
            .catch((_error) => {})
        })
        .catch((_error) => {
          // this.$message.error('哎呀，下载结算单出错啦')
          this.excelCreating = false
        })
    },
    /**
     * 支付登记
     */
    handlePayRegister() {
      this.tempPayReg = Object.assign({}, this.tempPayReg, {
        statement_id: this.detail.statement_id,
        pay_date: ''
      })
      this.dialogPayRegVisible = true
    },
    /**
     * 上传发票
     */
    doPayRegister() {
      this.$refs['payRegDataForm'].validate((valid) => {
        if (valid) {
          fillPayDate(this.tempPayReg).then(async(response) => {
            this.dialogPayRegVisible = false
            this.$message.success('登记成功')
            await this.$store.dispatch('user/getPending')
            this.getList(false)
          })
        }
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
