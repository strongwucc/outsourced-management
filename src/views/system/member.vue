<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.keyword"
          placeholder="输入用户名、手机号查找"
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
          添加用户
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

      <el-table-column label="姓名" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="用户名" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.login_name }}
        </template>
      </el-table-column>

      <el-table-column label="用户分组" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.group_name }}
        </template>
      </el-table-column>

      <el-table-column label="部门" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.dep_name }}
        </template>
      </el-table-column>

      <el-table-column label="手机号" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.mobile }}
        </template>
      </el-table-column>

      <el-table-column label="邮箱" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.email }}
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" min-width="150px">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusText }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="230"
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
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            plain
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="用户分组:" prop="group_id">
          <el-select
            v-model="temp.group_id"
            class="dialog-form-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="部门:" prop="dep_id">
          <el-select
            v-model="temp.dep_id"
            class="dialog-form-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="登录用户名:" prop="login_name">
          <el-input v-model="temp.login_name" />
        </el-form-item>

        <el-form-item label="密码:" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>

        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>

        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <el-form-item label="状态:" prop="status">
          <el-radio v-model="temp.status" :label="1">启用</el-radio>
          <el-radio v-model="temp.status" :label="0">停用</el-radio>
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
import { fetchList, createMember, updateMember } from '@/api/system/member'
import { fetchAllDepartment } from '@/api/system/department'
import { fetchAllRole } from '@/api/system/role'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success'
      }
      return statusMap[status]
    },
    statusText(status) {
      const statusMap = {
        0: '禁用',
        1: '启用'
      }
      return statusMap[status]
    }
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value) {
        const reg = /^1\d{10}$/

        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('手机号填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      list: null,
      total: 0,
      listLoading: true,
      departments: [],
      roles: [],
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        sort: '+id'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        group_id: '',
        dep_id: '',
        login_name: '',
        password: '',
        mobile: '',
        email: '',
        status: 1
      },
      textMap: {
        update: '修改用户',
        create: '添加用户'
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        group_id: [
          { required: true, message: '请选择用户分组', trigger: 'change' }
        ],
        login_name: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      if (this.departments.length === 0) {
        const departData = await fetchAllDepartment()
        this.departments = departData.data.items
      }
      if (this.roles.length === 0) {
        const roleData = await fetchAllRole()
        this.roles = roleData.data.items
      }
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items.map((item) => {
          const newItem = Object.assign({}, item, {
            group_name: '',
            dep_name: ''
          })

          this.departments.some((departItem) => {
            if (departItem.id === item.dep_id) {
              newItem.dep_name = departItem.name
              return true
            }
            return false
          })

          this.roles.some((roleItem) => {
            if (roleItem.id === item.group_id) {
              newItem.group_name = roleItem.name
              return true
            }
            return false
          })

          return newItem
        })

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
        type_name: ''
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
          const temp = Object.assign({}, this.temp)
          temp.id = parseInt(Math.random() * 100) + 1024
          createMember(temp).then(() => {
            this.roles.some((roleItem) => {
              if (roleItem.id === temp.group_id) {
                temp.group_name = roleItem.name
                return true
              }
              return false
            })
            this.departments.some((departItem) => {
              if (departItem.id === temp.dep_id) {
                temp.dep_name = departItem.name
                return true
              }
              return false
            })
            this.list.unshift(temp)
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
          const tempData = Object.assign({}, this.temp)
          updateMember(tempData).then(() => {
            this.roles.some((roleItem) => {
              if (roleItem.id === tempData.group_id) {
                tempData.group_name = roleItem.name
                return true
              }
              return false
            })
            this.departments.some((departItem) => {
              if (departItem.id === tempData.dep_id) {
                tempData.dep_name = departItem.name
                return true
              }
              return false
            })
            const index = this.list.findIndex((v) => v.id === tempData.id)
            this.list.splice(index, 1, tempData)
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
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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
</style>
