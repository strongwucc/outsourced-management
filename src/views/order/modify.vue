<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.change_id"
          placeholder="输入申请单号"
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

        <el-select
          v-model="listQuery.sponsor"
          placeholder="发起方"
          clearable
          class="filter-item"
          style="width: 200px"
          size="mini"
        >
          <el-option
            v-for="item in initiatorMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.change_type"
          placeholder="变更类型"
          clearable
          class="filter-item"
          style="width: 200px"
          size="mini"
        >
          <el-option
            v-for="item in typeMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.change_status"
          placeholder="单据状态"
          clearable
          class="filter-item"
          style="width: 200px"
          size="mini"
        >
          <el-option
            v-for="item in statusMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

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
        <el-button
          slot="reference"
          v-permission="[1, 2, 3, 4, 0]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleVerify(true)"
        >
          通过
        </el-button>
        <el-button
          slot="reference"
          v-permission="[1, 2, 3, 4, 0]"
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
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="list-container"
      :data="list"
      fit
      highlight-current-row
      row-key="change_id"
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
                  <div
                    v-if="
                      scope.row.deliver_new_date !== scope.row.deliver_old_date
                    "
                    class="modify-color"
                  >
                    <span>{{ scope.row.deliver_old_date }}</span>
                    <i class="el-icon-right" />
                    <span>{{ scope.row.deliver_new_date }}</span>
                  </div>
                  <span v-else>{{ scope.row.deliver_old_date }}</span>
                </template>
              </el-table-column>
              <el-table-column label="工作单位" align="center">
                <template slot-scope="scope">
                  {{ scope.row.work_unit || "-" }}
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.old_nums !== scope.row.new_nums"
                    class="modify-color"
                  >
                    <span>{{ scope.row.old_nums }}</span>
                    <i class="el-icon-right" />
                    <span>{{ scope.row.new_nums }}</span>
                  </div>
                  <span v-else>{{ scope.row.old_nums }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="单价" align="center" />
              <el-table-column label="总价" align="center">
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
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请单号" align="left" width="200">
        <template slot-scope="{ row }">
          {{ row.change_id }}
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
        label="供应商"
        align="center"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.supplier.name }}
        </template>
      </el-table-column>
      <el-table-column label="物件数量" align="center" width="120">
        <template slot-scope="{ row }">
          {{ row.nums }}
        </template>
      </el-table-column>
      <el-table-column label="发起方" align="center" width="120">
        <template slot-scope="{ row }">
          {{ row.sponsor | initiatorTxt }}
        </template>
      </el-table-column>
      <el-table-column label="变更类型" align="center" width="120">
        <template slot-scope="{ row }">
          {{ row.change_type | typeTxt }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" width="120">
        <template slot-scope="{ row }">
          {{ row.change_status | statusTxt }}
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
            @click="handleModifyReason(row)"
          >
            变更原因
          </el-button>
          <el-button
            v-if="[3].indexOf(row.change_status) >= 0"
            type="primary"
            size="mini"
            plain
            @click="handleRejectReason(row)"
          >
            驳回原因
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
import { fetchModifyOrderList, changeVerify } from '@/api/order/index'

import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'

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
  components: { Pagination },
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
      listLoading: true,
      initiatorMap: initiatorMap,
      typeMap: typeMap,
      statusMap: statusMap,
      listQuery: {
        change_id: '',
        project_name: '',
        supplier_name: '',
        sponsor: '',
        change_type: '',
        change_status: '',
        tag: '',
        page: 1,
        page_num: 10
      },
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
  created() {
    this.getList()
  },
  methods: {
    expandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => {
        return row.change_id
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

      fetchModifyOrderList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.total = response.data.total
          this.list = response.data.list
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
            if (this.expandRowKeys.indexOf(listItem.change_id) < 0) {
              this.expandRowKeys.push(listItem.change_id)
            }
          }
        })
      } else {
        this.list.forEach((listItem) => {
          if (listItem.checked) {
            const keyIndex = this.expandRowKeys.indexOf(listItem.change_id)
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
          }
          return false
        })
      ) {
        if (checkeds.length <= 0) {
          this.$message.error('请先选择变更单')
          return false
        }
      } else {
        return false
      }

      this.dialogStatus = pass === true ? 'resolve' : 'reject'
      this.tempVerify.change_id = checkeds[0]
      this.tempVerify.status = pass ? 1 : 0
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
          changeVerify(tempData)
            .then((response) => {
              const { change_id, change_status } = response.data
              const changeIndex = this.list.findIndex(
                (listItem) => listItem.change_id === change_id
              )
              if (changeIndex >= 0) {
                this.$set(this.list[changeIndex], 'change_status', change_status)
              }
              this.$notify({
                title: '成功',
                message: '处理成功',
                type: 'success',
                duration: 2000
              })
              this.dialogVerifyVisible = false
            })
            .catch((error) => {})
        }
      })
    },
    /**
     * 驳回原因
     */
    handleRejectReason(row) {
      if (!row.reject) {
        this.$message.error('对不起，没有驳回原因')
        return false
      }
      this.temp = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.dialogRejectReasonVisible = true
      })
    },
    /**
     * 变更原因
     */
    handleModifyReason(row) {
      this.tempModify = Object.assign({}, this.tempModify, {
        change_reason: row.change_reason,
        initiator: row.initiator,
        created_at: row.created_at
      })
      this.dialogModifyReasonVisible = true
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
  }
  .modify-color {
    color: #f56c6c;
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
