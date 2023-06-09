<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.project_name"
          placeholder="项目名称"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.bn"
          placeholder="项目代码"
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
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >
          创建项目
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(237, 244, 253, 0.8)"
      class="list-container"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="{ row }">
          {{ row.project_id }}
        </template>
      </el-table-column>

      <el-table-column label="项目名称" align="center">
        <template slot-scope="{ row }">
          {{ row.project_name }}
        </template>
      </el-table-column>
      <el-table-column label="项目代码" align="center">
        <template slot-scope="{ row }">
          {{ row.bn }}
        </template>
      </el-table-column>
      <el-table-column label="项目预算" align="center" min-width="120">
        <template slot-scope="{ row }">
          <div class="budget-cost-box">
            <div class="text">{{ row.budget_used }}/{{ row.budget_cost }}</div>
            <div class="progress">
              <el-progress
                :text-inside="true"
                :stroke-width="18"
                :percentage="
                  Math.round((row.budget_used / row.budget_cost) * 100)
                "
                :status="
                  row.budget_used > row.warning_cost ? 'warning' : 'success'
                "
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="预算阙值" align="center">
        <template slot-scope="{ row }">
          {{ row.warning_cost }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          {{ row.created_at }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleCostManage(row)"
          >
            项目预算管理
          </el-button>
          <el-button type="primary" size="mini" plain @click="handleEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_num"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="width: 500px; margin-left: 50px"
      >
        <el-form-item label="项目名称" prop="project_name">
          <el-input v-model="temp.project_name" />
        </el-form-item>

        <el-form-item label="项目代码" prop="bn">
          <el-input v-model="temp.bn" />
        </el-form-item>

        <template v-if="dialogStatus === 'create'">
          <el-form-item label="项目简介" prop="brief">
            <el-input v-model="temp.brief" type="textarea" />
          </el-form-item>

          <el-form-item label="预算：(元)" prop="budget_cost">
            <el-input v-model="temp.budget_cost" />
          </el-form-item>

          <el-form-item label="预算阙值" prop="warning_cost">
            <el-input v-model="temp.warning_cost" />
          </el-form-item>

          <el-form-item label="阙值提醒邮箱" prop="warning_email">
            <el-input v-model="temp.warning_email" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="调整预算"
      :visible.sync="dialogCostVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="costDataForm"
        :rules="rules"
        :model="costTemp"
        label-position="left"
        label-width="150px"
        style="width: 500px; margin-left: 50px"
        class="cost-form"
      >
        <el-form-item label="项目名称">
          <div>{{ costTemp.project_name }}</div>
        </el-form-item>

        <el-form-item label="预算经费：" prop="budget_cost">
          <div class="budget-cost-box">
            <el-input v-model="costTemp.budget_cost" class="form-item-input" />
            <div class="used-notice">已使用：{{ costTemp.budget_used }}</div>
          </div>
        </el-form-item>

        <el-form-item label="预警阈值：" prop="warning_cost">
          <el-input v-model="costTemp.warning_cost" class="form-item-input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogCostVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="updateCost()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createProject, updateProject } from '@/api/project/index'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_num: 10,
        project_name: undefined,
        bn: '',
        sort: '+id'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        project_id: undefined,
        project_name: '',
        bn: '',
        brief: '',
        budget_cost: '',
        warning_cost: '',
        warning_email: ''
      },
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        bn: [{ required: true, message: '请输入项目代码', trigger: 'blur' }],
        budget_cost: [
          { required: true, message: '请输入预算', trigger: 'blur' }
        ],
        warning_cost: [
          { required: true, message: '请输入预算阙值', trigger: 'blur' }
        ],
        warning_email: [
          { required: true, message: '请输入阙值提醒邮箱', trigger: 'blur' }
        ]
      },
      dialogCostVisible: false,
      costTemp: {
        id: undefined,
        project_name: '',
        budget_cost: '',
        warning_cost: '',
        budget_used: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.list = response.data.list
          this.total = response.data.total
        })
        .catch((error) => {
          console.log(error)
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        project_id: undefined,
        project_name: '',
        bn: '',
        brief: '',
        budget_cost: '',
        warning_cost: '',
        warning_email: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024
          createProject(this.temp).then((response) => {
            this.temp.project_id = response.data.id
            this.temp.created_at = parseTime(new Date())
            this.temp.budget_used = 0
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024
          const temp = {
            project_id: this.temp.project_id,
            project_name: this.temp.project_name,
            bn: this.temp.bn
          }
          updateProject(temp).then((response) => {
            const index = this.list.findIndex(
              (item) => item.project_id === this.temp.project_id
            )
            if (index >= 0) {
              this.$set(this.list[index], 'project_name', temp.project_name)
              this.$set(this.list[index], 'bn', temp.bn)
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleCostManage(row) {
      this.costTemp = Object.assign(
        {},
        {
          project_id: row.project_id,
          project_name: row.project_name,
          budget_cost: row.budget_cost,
          warning_cost: row.warning_cost,
          budget_used: row.budget_used
        }
      )
      this.dialogCostVisible = true
      this.$nextTick(() => {
        this.$refs['costDataForm'].clearValidate()
      })
    },
    updateCost() {
      this.$refs['costDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.costTemp)
          delete tempData.project_name
          delete tempData.budget_used
          updateProject(tempData).then(() => {
            const index = this.list.findIndex(
              (v) => v.project_id === tempData.project_id
            )
            const newItem = Object.assign({}, this.list[index], {
              budget_cost: tempData.budget_cost,
              warning_cost: tempData.warning_cost
            })
            this.list.splice(index, 1, newItem)
            this.dialogCostVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleEdit(row, index) {
      this.temp = Object.assign({}, this.temp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    .budget-cost-box {
      width: 100%;
      @extend %flex-space-between;
      .text {
        white-space: nowrap;
      }
      .progress {
        padding: 2px;
        box-sizing: border-box;
        margin-left: 10px;
        width: 150px;
        border-radius: 100px;
        background-color: #ebeef5;
        overflow: hidden;
        position: relative;
        vertical-align: middle;
      }
    }
  }
  .cost-form {
    .budget-cost-box {
      @extend %flex-space-between;
      justify-content: flex-start;
      .used-notice {
        margin-left: 20px;
        color: red;
      }
    }
    .form-item-input {
      width: 200px;
    }
  }
}
</style>
