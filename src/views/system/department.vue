<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.department"
          placeholder="部门名称"
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
          新增部门
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="list-container"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>

      <el-table-column label="部门名称" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="tag === 2"
        label="预算"
        align="center"
        min-width="150"
      >
        <template slot-scope="{ row }">
          <div v-if="row.budget > 0" class="budget-cost-box">
            <div class="text">{{ row.budget_used || 0 }}/{{ row.budget }}</div>
            <div class="progress">
              <el-progress
                :text-inside="true"
                :stroke-width="18"
                :percentage="Math.round((row.budget_used / row.budget) * 100)"
                :status="
                  row.budget_used > row.budget_warn ? 'warning' : 'success'
                "
              />
            </div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            style="margin-left: 10px"
            title="确定删除吗？"
            @confirm="handleDelete(row, $index)"
          >
            <el-button slot="reference" size="mini" type="danger" plain>
              删除
            </el-button>
          </el-popconfirm>

          <el-button
            v-if="tag === 2"
            style="margin-left: 10px"
            size="mini"
            type="primary"
            plain
            @click="handleManage(row, $index)"
          >
            预算管理
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item v-if="dialogStatus === 'manage'" label="部门名称:">
          {{ temp.name }}
        </el-form-item>
        <el-form-item v-else label="部门名称:" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          v-if="tag === 2 || dialogStatus === 'manage'"
          label="预算经费:"
          prop="name"
        >
          <el-input v-model="temp.budget" />
        </el-form-item>
        <el-form-item
          v-if="tag === 2 || dialogStatus === 'manage'"
          label="预警阈值:"
          prop="name"
        >
          <el-input v-model="temp.budget_warn" />
        </el-form-item>
        <el-form-item
          v-if="tag === 2 && dialogStatus !== 'manage'"
          label="阙值提醒邮箱:"
          prop="name"
        >
          <el-input v-model="temp.email" />
        </el-form-item>
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
  </div>
</template>

<script>
import {
  fetchList,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '@/api/system/department'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      tag: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_num: 10,
        name: undefined,
        tag: 0,
        sort: '+id'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        tag: 0,
        budget: '',
        budget_used: '',
        budget_warn: '',
        email: ''
      },
      textMap: {
        update: '修改部门',
        create: '新增部门',
        manage: '调整预算'
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created() {
    const path = this.$route.path
    let tag = 0
    if (path.endsWith('initiate')) {
      tag = 0
    }
    if (path.endsWith('accounting')) {
      tag = 1
    }
    if (path.endsWith('use')) {
      tag = 2
    }
    this.tag = tag
    this.listQuery = Object.assign({}, this.listQuery, { tag })
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        tag: this.tag,
        budget: '',
        budget_used: '',
        budget_warn: '',
        email: ''
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
          createDepartment(this.temp).then((response) => {
            this.temp.id = response.data.id
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp, { tag: this.tag })
          updateDepartment(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
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
    handleManage(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'manage'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      deleteDepartment({ id: row.id }).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
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
      @extend %flex-center;
      .text {
        white-space: nowrap;
      }
      .progress {
        margin-left: 10px;
        width: 150px;
      }
    }
  }
}
</style>
