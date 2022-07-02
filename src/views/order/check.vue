<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.receipt_id"
          placeholder="输入验收单号"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.order_id"
          placeholder="输入订单号"
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
          v-permission="[0]"
          title="确定生成对账单吗？"
          @confirm="handleReconcile"
        ><el-button
          slot="reference"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
        >
          生成对账单
        </el-button></el-popconfirm>
        <el-popconfirm
          v-permission="[1]"
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
        <el-button
          slot="reference"
          v-permission="[1, 2, 3, 4]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleVerify(true)"
        >
          验收通过
        </el-button>
        <el-button
          slot="reference"
          v-permission="[1, 2, 3, 4]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleVerify(false)"
        >
          驳回
        </el-button>
        <el-button
          v-permission="[1, 2, 3, 4]"
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
      :data="list"
      fit
      highlight-current-row
      row-key="receipt_id"
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
            <el-table class="task-list" border :data="row.items" fit stripe>
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
              <el-table-column
                prop="work_unit"
                label="工作单位"
                align="center"
              />
              <el-table-column prop="work_num" label="数量" align="center" />
              <el-table-column prop="work_price" label="单价" align="center" />
              <el-table-column prop="work_amount" label="总价" align="center" />
              <el-table-column label="停留时间" align="center">
                <template slot-scope="scope">
                  {{ scope.row.stay_time }}小时
                </template>
              </el-table-column>
              <el-table-column label="当前处理人" align="center" min-width="120">
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
      <el-table-column label="验收单号" align="left" width="200">
        <template slot-scope="{ row }">
          <div class="pending-box">
            <span class="txt">{{ row.receipt_id }}</span>
            <!-- <span v-if="row.items.length > 0" class="tag">{{ row.items.length }}</span> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" width="200">
        <template slot-scope="{ row }">
          {{ row.project_name }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="200">
        <template slot-scope="{ row }">
          {{ row.supplier_name }}
        </template>
      </el-table-column>
      <el-table-column label="物件数量" align="center">
        <template slot-scope="{ row }">
          {{ row.nums }}
        </template>
      </el-table-column>
      <el-table-column label="工作总量" align="center">
        <template slot-scope="{ row }">
          {{ row.work_num }}
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center">
        <template slot-scope="{ row }">
          {{ row.work_amount }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="{ row }">
          {{ row.receipts_status | statusText }}
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
  </div>
</template>

<script>
import {
  fetchCheckOrderList,
  modifyCheckOrder,
  verifyCheckOrder,
  finishCheckOrderTask,
  generateStatement
} from '@/api/order/index'
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
      }
      if (category.parent.parent) {
        name = `${category.parent.parent.category_name}/${name}`
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
      globelCheckedAll: false,
      expandRowKeys: [],
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        receipt_id: '',
        order_id: '',
        project_name: '',
        supplier_name: '',
        tag: '',
        page: 1,
        page_num: 10
      },
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
      verifyRules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    expandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => {
        return row.receipt_id
      })
    },
    /**
     * 全选所有
     */
    clickCheckAll(item) {
      this.list = this.list.map((val) => {
        val.checked = this.globelCheckedAll
        val.items = val.items.map((i) => {
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
      val.items = val.items.map((i) => {
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
        const isAllChecked = row.items.every((v) => v.checked)
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

      fetchCheckOrderList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.total = response.data.total
          if (this.$store.getters.pendings['/order/check']) {
            const pendings = this.$store.getters.pendings['/order/check'].children
            this.list = response.data.list.map(listItem => {
              let pending = 0
              pendings.some(pendingItem => {
                if (pendingItem[listItem.receipt_id]) {
                  pending = pendingItem[listItem.receipt_id]
                  return true
                }
                return false
              })
              listItem.pending = pending
              return listItem
            })
          } else {
            this.list = response.data.list
          }
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
            if (this.expandRowKeys.indexOf(listItem.receipt_id) < 0) {
              this.expandRowKeys.push(listItem.receipt_id)
            }
          }
        })
      } else {
        this.list.forEach((listItem) => {
          if (listItem.checked) {
            const keyIndex = this.expandRowKeys.indexOf(listItem.receipt_id)
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
          return orderItem.items.some((taskItem, taskIndex) => {
            if (taskItem.checked) {
              if ([0].indexOf(taskItem.task_status) < 0) {
                const errorName = `[${taskItem.task_id}]: 该物件状态无法申请变更`
                this.$message.error(errorName)
                return true
              }
              if (orderCheckeds.indexOf(taskItem.receipt_id) < 0) {
                orderCheckeds.push(taskItem.receipt_id)
              }
              if (orderCheckeds.length > 1) {
                const errorName = `只能选择单个验收单下的物件`
                this.$message.error(errorName)
                return true
              }
              taskCheckeds.push(taskItem.task_id)
              price = taskItem.work_price
              amount = taskItem.work_amount
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
        receipt_id: orderCheckeds[0],
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
      this.$refs['modifyDataForm'].validate((valid) => {
        if (valid) {
          const tempData = JSON.parse(JSON.stringify(this.tempModify))
          modifyCheckOrder(tempData)
            .then((response) => {
              // const orderIndex = this.list.findIndex(
              //   (listItem) => listItem.receipt_id === tempData.receipt_id
              // )
              // if (orderIndex >= 0) {
              //   // this.$set(this.list[orderIndex], "order_status", 1);
              //   tempData.task_id.forEach((task_id) => {
              //     const taskIndex = this.list[orderIndex].items.findIndex(
              //       (taskItem) => taskItem.task_id === task_id
              //     )
              //     if (taskIndex >= 0) {
              //       this.$set(
              //         this.list[orderIndex].items[taskIndex],
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
              this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {})
        }
      })
    },
    /**
     * 生成对账单
     */
    handleReconcile() {
      const taskCheckeds = []
      if (
        !this.list.some((orderItem, orderIndex) => {
          return orderItem.items.some((taskItem, taskIndex) => {
            if (taskItem.checked) {
              if ([2].indexOf(taskItem.task_status) < 0) {
                const errorName = `[${taskItem.task_id}]: 该物件状态无法生成对账单`
                this.$message.error(errorName)
                return true
              }
              taskCheckeds.push(taskItem.task_id)
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

      generateStatement({ tasks: taskCheckeds })
        .then((response) => {
          // taskCheckeds.forEach((checkedTaskId) => {
          //   let checkedOrderIndex, checkedTaskIndex
          //   this.list.some((orderItem, orderIndex) => {
          //     return orderItem.items.some((taskItem, taskIndex) => {
          //       if (taskItem.task_id === checkedTaskId) {
          //         checkedOrderIndex = orderIndex
          //         checkedTaskIndex = taskIndex
          //         return true
          //       }
          //       return false
          //     })
          //   })
          //   this.$set(
          //     this.list[checkedOrderIndex].items[checkedTaskIndex],
          //     'task_status',
          //     5
          //   )
          // })

          this.$message.success('生成对账单成功')
          this.$store.dispatch('user/getPending')
          this.getList(false)
        })
        .catch((error) => {})
    },
    /**
     * 通过驳回弹窗
     */
    handleVerify(pass) {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          return listItem.items.some((taskItem) => {
            if (taskItem.checked) {
              if ([0].indexOf(taskItem.task_status) < 0) {
                const errorName = `[${taskItem.task_id}] 该物件不在审核中，无法审核`
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

      this.dialogStatus = pass === true ? 'resolve' : 'reject'
      this.tempVerify.status = pass ? 1 : 0
      this.tempVerify.task_id = checkeds
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
          const tempData = JSON.parse(JSON.stringify(this.tempVerify))
          verifyCheckOrder(tempData)
            .then((response) => {
              // const statusData = response.data
              // statusData.forEach((statusItem) => {
              //   this.list.some((listItem, listIndex) => {
              //     return listItem.items.some((taskItem, taskIndex) => {
              //       if (taskItem.id === statusItem.id) {
              //         this.$set(
              //           this.list[listIndex].items[taskIndex],
              //           'task_status',
              //           statusItem.task_status
              //         )
              //         this.$set(
              //           this.list[listIndex].items[taskIndex],
              //           'dealing',
              //           statusItem.dealing
              //         )
              //         return true
              //       }
              //       return false
              //     })
              //   })
              // })
              this.$notify({
                title: '成功',
                message: '处理成功',
                type: 'success',
                duration: 2000
              })
              this.dialogVerifyVisible = false
              this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {})
        }
      })
    },
    /**
     * 终止弹窗
     */
    handleFinish() {
      const checkeds = []
      if (
        !this.list.some((listItem) => {
          return listItem.items.some((taskItem) => {
            if (taskItem.checked) {
              if ([0].indexOf(taskItem.task_status) < 0) {
                const errorName = `[${taskItem.task_id}] 该物件不在审核中，无法审核`
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

          finishCheckOrderTask(temp)
            .then((response) => {
              // temp.task_id.forEach((checkedTaskId) => {
              //   this.list.some((listItem, listIndex) => {
              //     return this.list[listIndex].items.some(
              //       (taskItem, taskIndex) => {
              //         if (taskItem.task_id === checkedTaskId) {
              //           this.$set(
              //             this.list[listIndex].items[taskIndex],
              //             'task_status',
              //             3
              //           )
              //           return true
              //         }
              //         return false
              //       }
              //     )
              //   })
              // })

              this.$notify({
                title: '成功',
                message: '终止成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFinishVisible = false
              this.$store.dispatch('user/getPending')
              this.getList(false)
            })
            .catch((error) => {})
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
        font-size: 10px;
        height: 16px;
        line-height: 16px;
        padding: 0 5px;
        box-sizing: border-box;
        border-radius: 50%;
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
