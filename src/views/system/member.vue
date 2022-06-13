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
          {{ row.group | groupText }}
        </template>
      </el-table-column>

      <el-table-column label="部门" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.dep_array | depText }}
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
          <el-popconfirm
            style="margin-left: 10px"
            title="确定删除吗？"
            @confirm="handleDelete(row, $index)"
          >
            <el-button slot="reference" size="mini" type="danger" plain>
              删除
            </el-button>
          </el-popconfirm>
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
        class="dialog-form"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left: 50px"
      >
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="temp.name" class="dialog-form-item" />
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
              :label="item.group_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="部门:" prop="dep_json">
          <el-select
            v-model="temp.dep_json"
            class="dialog-form-item"
            multiple
            collapse-tags
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
          <el-input v-model="temp.login_name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item label="密码:" prop="password">
          <el-input
            v-model="temp.password"
            type="password"
            class="dialog-form-item"
          />
        </el-form-item>

        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="temp.mobile" class="dialog-form-item" />
        </el-form-item>

        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="temp.email" class="dialog-form-item" />
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
import { fetchList, createMember, updateMember, deleteMember } from '@/api/system/member'
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
    },
    depText(depArray) {
      if (depArray.length === 0) {
        return '-'
      }
      return depArray.map(depItem => {
        return depItem.name
      }).join(',')
    },
    groupText(group) {
      if (!group) {
        return '-'
      }
      return group.group_name
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
        page_num: 10,
        keyword: undefined,
        sort: '+id'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        group_id: '',
        dep_json: [],
        dep_array: [],
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
        this.departments = departData.data.list
      }
      if (this.roles.length === 0) {
        const roleData = await fetchAllRole()
        this.roles = roleData.data.list.filter(listItem => {
          return listItem.type !== 0
        })
      }
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false
        this.list = response.data.list.map((item) => {
          const newItem = Object.assign({}, item, {
            group_name: '',
            dep_name: ''
          })

          newItem.dep_json = newItem.dep_array.map(depItem => {
            return depItem.id
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
      }).catch(error => {
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
        id: undefined,
        name: '',
        group_id: '',
        dep_json: [],
        dep_array: [],
        login_name: '',
        password: '',
        mobile: '',
        email: '',
        status: 1
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
          const temp = JSON.parse(JSON.stringify(this.temp))
          const postTemp = JSON.parse(JSON.stringify(this.temp))
          postTemp.dep_json = JSON.stringify(temp.dep_json)
          // temp.id = parseInt(Math.random() * 100) + 1024
          createMember(postTemp).then((response) => {
            temp.id = response.data.id
            this.roles.some((roleItem) => {
              if (roleItem.id === temp.group_id) {
                temp.group = roleItem
                return true
              }
              return false
            })
            temp.dep_array = temp.dep_json.map((dep_item_id) => {
              const depIndex = this.departments.findIndex(
                (dep) => dep.id === dep_item_id
              )
              return this.departments[depIndex] || null
            })

            this.list.unshift(temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(error => {})
        }
      })
    },
    handleUpdate(row) {
      this.temp = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.temp))
          const postTemp = JSON.parse(JSON.stringify(this.temp))
          postTemp.dep_json = JSON.stringify(temp.dep_json)
          updateMember(postTemp).then(() => {
            this.roles.some((roleItem) => {
              if (roleItem.id === temp.group_id) {
                temp.group_name = roleItem.name
                return true
              }
              return false
            })
            temp.dep_array = temp.dep_json.map((dep_item_id) => {
              const depIndex = this.departments.findIndex(
                (dep) => dep.id === dep_item_id
              )
              return this.departments[depIndex] || null
            })
            const index = this.list.findIndex((v) => v.id === temp.id)
            this.list.splice(index, 1, temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }).catch(error => {})
        }
      })
    },
    handleDelete(row, index) {
      deleteMember({ id: row.id }).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      }).catch(error => {})
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
  .dialog-form {
    .dialog-form-item {
      width: 400px;
    }
  }
}
</style>
