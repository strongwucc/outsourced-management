<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.reconcile_id"
          placeholder="输入对账单号"
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
          v-model="listQuery.provider_name"
          placeholder="输入供应商名称"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
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
          title="确定提交吗？"
          @confirm="handleCommit"
        ><el-button
          slot="reference"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
        >
          提交
        </el-button></el-popconfirm>
        <el-button
          slot="reference"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleVerify(false)"
        >
          驳回
        </el-button>
      </div>
    </div>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      row-key="reconcile_id"
      :expand-row-keys="expandRowKeys"
      @expand-change="expandChange"
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
              <el-table-column prop="status" label="物件状态" align="center" />
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
                    @click="handleDownloadWork(scope.row, scope.$index, $index)"
                  >
                    下载
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="对账单号" align="left" width="200">
        <template slot-scope="{ row }">
          {{ row.reconcile_id }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" width="200">
        <template slot-scope="{ row }">
          {{ row.project_name }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="200">
        <template slot-scope="{ row }">
          {{ row.provider_name }}
        </template>
      </el-table-column>
      <el-table-column label="物件数量" align="center">
        <template slot-scope="{ row }">
          {{ row.task_num }}
        </template>
      </el-table-column>
      <el-table-column label="工作总量" align="center">
        <template slot-scope="{ row }">
          {{ row.work_total }}
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center">
        <template slot-scope="{ row }">
          {{ row.work_amount }}
        </template>
      </el-table-column>
      <el-table-column label="停留时间" align="center">
        <template slot-scope="{ row }"> {{ row.stay_time }}小时 </template>
      </el-table-column>
      <el-table-column label="当前处理人" align="center">
        <template slot-scope="{ row }">
          {{ row.current_manager }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="{ row }">
          {{ row.status }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleUploadReconcile(row)"
          >
            上传对账单
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleUploadBill(row)"
          >
            上传发票
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleShowReconcile(row)"
          >
            查看对账单
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleShowBill(row)"
          >
            查看发票
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
        label-position="left"
        label-width="100px"
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
        <el-button size="mini" @click="dialogVerifyVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmVerify">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!--上传对账单-->
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
        <el-form-item label="对账单" prop="file">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogReconcileVisible = false"> 取消 </el-button>
        <el-button type="primary" size="mini" @click="uploadReconcile"> 确认 </el-button>
      </div>
    </el-dialog>

    <!--上传发票-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogBillVisible">
      <el-form
        ref="billDataForm"
        class="dialog-form"
        :rules="billRules"
        :model="tempBill"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="发票图片" prop="file">
          <el-upload
            class="task-image-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleTaskImageSuccess"
            :before-upload="beforeTaskImageUpload"
          >
            <img v-if="tempBill.file" :src="tempBill.file" class="task-image">
            <i v-else class="el-icon-plus task-image-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="序号:" prop="invoice_bn">
          <el-input
            v-model="tempBill.invoice_bn"
            placeholder="请输入发票序号"
            class="dialog-form-item"
          />
        </el-form-item>
        <el-form-item label="发票类型:" prop="invoice_type">
          <el-input
            v-model="tempBill.invoice_type"
            placeholder="请输入发票类型"
            class="dialog-form-item"
          />
        </el-form-item>
        <el-form-item label="开票日期:" prop="billing_date">
          <el-date-picker
            v-model="tempBill.billing_date"
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
        <el-form-item label="价格合计:" prop="invoice_total">
          <el-input
            v-model="tempBill.invoice_total"
            placeholder="请输入价格合计"
            class="dialog-form-item"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogBillVisible = false"> 取消 </el-button>
        <el-button type="primary" size="mini" @click="uploadBill"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchReconcileOrderList, uploadBillData } from '@/api/order/index'

import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      globelCheckedAll: false,
      expandRowKeys: [],
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        reconcile_id: '',
        project_name: '',
        provider_name: '',
        tag: '',
        page: 1,
        page_num: 10
      },
      textMap: {
        resolve: '通过',
        reject: '驳回',
        reconcile: '上传对账单',
        bill: '上传发票'
      },
      dialogStatus: '',
      dialogRejectReasonVisible: false,
      dialogStopReasonVisible: false,
      dialogVerifyVisible: false,
      tempVerify: {
        reason: ''
      },
      dialogReconcileVisible: false,
      reconcileRules: {},
      tempReconcile: {
        file: ''
      },
      dialogBillVisible: false,
      billRules: {},
      tempBill: {
        file: '',
        invoice_bn: '',
        invoice_type: '',
        billing_date: '',
        invoice_code: '',
        invoice_number: '',
        invoice_total: ''
      },
      dialogModifyVisible: false,
      tempModify: {
        work_num: '',
        work_price: '',
        work_amount: '',
        deliver_date: '',
        reason: ''
      },
      modifyRules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    expandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => {
        return row.reconcile_id
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
    getList() {
      this.listLoading = true

      fetchReconcileOrderList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.items

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
     * 展开
     */
    handleExpand(isExpand) {
      if (isExpand) {
        this.list.forEach((listItem) => {
          if (listItem.checked) {
            if (this.expandRowKeys.indexOf(listItem.reconcile_id) < 0) {
              this.expandRowKeys.push(listItem.reconcile_id)
            }
          }
        })
      } else {
        this.list.forEach((listItem) => {
          if (listItem.checked) {
            const keyIndex = this.expandRowKeys.indexOf(listItem.reconcile_id)
            if (keyIndex >= 0) {
              this.expandRowKeys.splice(keyIndex, 1)
            }
          }
        })
      }
    },
    /**
     * 提交
     */
    handleCommit() {
      this.$notify({
        title: '成功',
        message: '交付成功',
        type: 'success',
        duration: 2000
      })
    },
    /**
     * 通过驳回弹窗
     */
    handleVerify(pass) {
      this.dialogStatus = pass ? 'resolve' : 'reject'
      this.dialogVerifyVisible = true
    },
    /**
     * 通过申请弹窗
     */
    confirmVerify() {
      this.$notify({
        title: '成功',
        message: '处理成功',
        type: 'success',
        duration: 2000
      })
      this.dialogVerifyVisible = false
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
    handleDownloadWork(task, taskIndex, demandIndex) {},
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
     * 上传对账单弹窗
     */
    handleUploadReconcile(reconcile) {
      this.dialogStatus = 'reconcile'
      this.dialogReconcileVisible = true
      this.$nextTick(() => {
        this.$refs['reconcileDataForm'].clearValidate()
      })
    },
    /**
     * 上传对账单
     */
    uploadReconcile() {
      this.dialogReconcileVisible = false
      this.$notify({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
    },
    /**
     * 上传发票弹窗
     */
    handleUploadBill(reconcile) {
      this.tempBill = Object.assign({}, this.tempBill, {
        reconcile_id: reconcile.reconcile_id,
        file: '',
        invoice_bn: '',
        invoice_type: '',
        billing_date: '',
        invoice_code: '',
        invoice_number: '',
        invoice_total: ''
      })
      this.dialogStatus = 'bill'
      this.dialogBillVisible = true
      this.$nextTick(() => {
        this.$refs['billDataForm'].clearValidate()
      })
    },
    /**
     * 上传发票
     */
    uploadBill() {
      this.$refs['billDataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.tempBill))
          uploadBillData(temp).then(() => {
            this.dialogBillVisible = false
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
     * 查看对账单
     */
    handleShowReconcile(row) {},
    /**
     * 查看发票
     */
    handleShowBill(row) {}
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
