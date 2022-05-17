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
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleModify"
        >
          申请变更
        </el-button>
        <el-popconfirm
          title="这是一段内容确定删除吗？"
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
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      row-key="order_id"
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
                label="操作"
                align="center"
                min-width="100"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    multiple
                    @on-success="handleUploadWorkSuccess"
                    @on-error="handleUploadWorkError"
                  >
                    <el-button
                      size="mini"
                      type="primary"
                      plain
                    >上传作品</el-button>
                  </el-upload>
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="handleDownloadWork(scope.row, scope.$index, $index)"
                  >
                    下载作品
                  </el-button>
                  <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    multiple
                    @on-success="handleUploadPlanImageSuccess"
                    @on-error="handleUploadPlanImageError"
                  >
                    <el-button type="primary" size="mini" plain>
                      上传展示图
                    </el-button>
                  </el-upload>

                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="
                      handleRejectTaskReason(scope.row, scope.$index, $index)
                    "
                  >
                    驳回原因
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
      <el-table-column label="订单号" align="left" width="200">
        <template slot-scope="{ row }">
          {{ row.order_id }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" width="200">
        <template slot-scope="{ row }">
          {{ row.project_name }}
        </template>
      </el-table-column>
      <el-table-column label="需求名称" align="center" width="200">
        <template slot-scope="{ row }">
          {{ row.demand_name }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="200">
        <template slot-scope="{ row }">
          {{ row.provider_name }}
        </template>
      </el-table-column>
      <el-table-column label="供管" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.manager }}
        </template>
      </el-table-column>
      <el-table-column label="物件数量" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.task_num }}
        </template>
      </el-table-column>
      <el-table-column label="工作总量" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.work_total }}
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.work_amount }}
        </template>
      </el-table-column>
      <el-table-column label="停留时间" align="center" width="100">
        <template slot-scope="{ row }"> {{ row.stay_time }}小时 </template>
      </el-table-column>
      <el-table-column label="当前处理人" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.current_manager }}
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" width="100">
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
            @click="handleCreateTask(row)"
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
      @pagination="getList"
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
                  v-if="tempTask.task_image"
                  :src="tempTask.task_image"
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

    <!--驳回原因-->
    <el-dialog
      title="驳回原因"
      :visible.sync="dialogRejectReasonVisible"
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
import { fetchOrderList } from '@/api/order/index'
import { createTask } from '@/api/demand/task'

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
        order_id: '',
        project_name: '',
        provider_name: '',
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
        work_unit: '',
        work_num: '',
        deliver_date: '',
        remark: '',
        extend: []
      },
      taskRules: {},
      dialogModifyVisible: false,
      tempModify: {
        work_num: '',
        work_price: '',
        work_amount: '',
        deliver_date: '',
        reason: ''
      },
      modifyRules: {},
      dialogRejectReasonVisible: false,
      dialogStopReasonVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    expandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map((row) => {
        return row.order_id
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

      fetchOrderList(this.listQuery).then((response) => {
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
     * 交付验收
     */
    handleDeliver() {
      this.$notify({
        title: '成功',
        message: '交付成功',
        type: 'success',
        duration: 2000
      })
    },
    /**
     * 上传作品
     */
    handleUploadWork(task, taskIndex, demandIndex) {},
    handleUploadWorkSuccess(response, file, fileList) {
      console.log('上传成功', response, file, fileList)
      this.$notify({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
    },
    handleUploadWorkError(err, file, fileList) {
      console.log('上传失败', err, file, fileList)
      this.$notify({
        title: '失败',
        message: '上传失败',
        type: 'error',
        duration: 2000
      })
    },
    /**
     * 下载作品
     */
    handleDownloadWork(task, taskIndex, demandIndex) {},
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
      this.dialogRejectReasonVisible = true
    },
    /**
     * 终止原因
     */
    handleStopTaskReason(task, taskIndex, demandIndex) {
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
          temp.task_id = parseInt(Math.random() * 100) + 1024
          createTask(temp).then(() => {
            const orderIndex = this.list.findIndex(
              (v) => v.order_id === temp.order_id
            )

            if (orderIndex >= 0) {
              temp.category_id = this.tempTaskCategory.category_id
              temp.category_name = this.tempTaskCategory.category_name
              temp.work_price = 10
              temp.work_amount = 10 * temp.work_num
              this.list[orderIndex].tasks.unshift(temp)
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
