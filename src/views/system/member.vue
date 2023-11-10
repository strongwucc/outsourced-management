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
      element-loading-background="rgba(237, 244, 253, 0.8)"
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

      <el-table-column label="部门" align="center" width="150px">
        <template slot-scope="{ row }">
          {{ row.dep_array | depText }}
        </template>
      </el-table-column>

      <el-table-column label="手机号" align="center" width="120px">
        <template slot-scope="{ row }">
          {{ row.mobile }}
        </template>
      </el-table-column>

      <el-table-column label="邮箱" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.email }}
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="80px">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusText }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="230"
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
            style="margin-left: 10px"
            v-if="row.group_id === 5"
            type="primary"
            size="mini"
            plain
            @click="handleShowPermissions(row)"
          >
            可见权限
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
        class="dialog-form"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="110px"
        style="margin-left: 50px"
      >
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="temp.name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus === 'update'"
          label="用户分组:"
          prop="group_id"
        >
          <el-select
            v-model="temp.group_id"
            :disabled="true"
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
        <el-form-item v-else label="用户分组:" prop="group_id">
          <el-select
            v-model="temp.group_id"
            class="dialog-form-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roles.filter((role) => role.type !== 0)"
              :key="item.id"
              :label="item.group_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="负责需求品类:" prop="cat_id" v-if="[1, 3].indexOf(temp.group_id) >= 0">
          <el-select
            v-model="temp.cat_id"
            class="dialog-form-item"
            placeholder="请选择"
            multiple
          >
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="部门:" prop="dep_json">
          <el-select
            v-model="temp.dep_json"
            :disabled="dialogStatus === 'update'"
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
            >
              <span style="float: left">{{ item.name }}</span>
              <span v-if="item.tag === 0" style="float: right">发起部门</span>
              <span v-else-if="item.tag === 1" style="float: right">核算部门</span>
              <span v-else-if="item.tag === 2" style="float: right">预算使用部门</span>
            </el-option>
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataPermissionForm"
        class="dialog-form"
        :rules="rulesPermission"
        :model="tempPermission"
        label-position="left"
        label-width="110px"
        style="margin-left: 50px"
      >
      <el-table
        :data="tempPermission.project_producer"
        border
        style="width: 100%">
        <!-- <el-table-column
          prop="project.project_name"
          label="主项目"
          width="180">
        </el-table-column> -->
        <el-table-column
          align="center"
          prop="flow_name"
          label="流程名称"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="bn"
          label="流程代码">
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="是否可见" width="80px">
          <template slot-scope="{ row }">
            <el-checkbox v-model="row.selected"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogPermissionVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="updatePermissionData()"
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
  createMember,
  updateMember,
  deleteMember
} from '@/api/system/member'
import { fetchAllDepartment } from '@/api/system/department'
import { fetchAllRole } from '@/api/system/role'
import {
  fetchAllProcess,
} from '@/api/project/process'
import { fetchAllCategory } from '@/api/system/category'
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
      return depArray
        .map((depItem) => {
          return depItem.name
        })
        .join(',')
    },
    groupText(group) {
      if (!group) {
        return '系统管理员'
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
      categories: [],
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
        cat_id: '',
        dep_json: [],
        dep_array: [],
        login_name: '',
        password: '',
        mobile: '',
        email: '',
        status: 1,
      },
      textMap: {
        update: '修改用户',
        create: '添加用户',
        permission: '可见权限',
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        group_id: [
          { required: true, message: '请选择用户分组', trigger: 'change' }
        ],
        cat_id: [
          { required: true, message: '请选择品类', trigger: 'change' }
        ],
        login_name: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      },
      dialogPermissionVisible: false,
      tempPermission: {
        id: undefined,
        project_producer: []
      },
      rulesPermission: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList(loading=true) {
      if (loading === true) {
        this.listLoading = true
      }
      if (this.departments.length === 0) {
        const departData = await fetchAllDepartment()
        this.departments = departData.data.list
      }
      if (this.roles.length === 0) {
        const roleData = await fetchAllRole()
        this.roles = roleData.data.list
        this.roles.push({ id: 0, type: '', nums: 0, group_name: '系统管理员' })
      }
      if (this.categories.length === 0) {
        const categoryData = await fetchAllCategory()
        this.categories = categoryData.data.list.map((first) => {
          return {
            label: first.category_name,
            value: first.cat_id,
          }
        })
      }
      fetchList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.list = response.data.list.map((item) => {
            const newItem = Object.assign({}, item, {
              group_name: '',
              dep_name: ''
            })

            newItem.dep_json = newItem.dep_array.map((depItem) => {
              return depItem.id
            })

            newItem.cat_id = newItem.cat_id.split(",").map(Number)

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
        id: undefined,
        name: '',
        group_id: '',
        cat_id: '',
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
      this.$set(this.rules.password[0], 'required', true)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.temp))
          // temp.id = parseInt(Math.random() * 100) + 1024
          temp.cat_id = temp.cat_id.length > 0 ? temp.cat_id.join(',') : ''
          createMember(temp)
            .then((response) => {
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
              temp.process = []

              this.list.unshift(temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch((error) => {})
        }
      })
    },
    handleUpdate(row) {
      this.temp = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.$set(this.rules.password[0], 'required', false)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.temp))
          temp.cat_id = temp.cat_id.length > 0 ? temp.cat_id.join(',') : ''
          updateMember(temp)
            .then(() => {
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
            })
            .catch((error) => {})
        }
      })
    },
    handleDelete(row, index) {
      deleteMember({ id: row.id })
        .then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
        .catch((error) => {})
    },
    async handleShowPermissions(row) {

      const processData = await fetchAllProcess().catch(error=>{})
      if (!processData.data || !processData.data.list) {
        return false
      }

      const projectProducer = processData.data.list.map(item=>{
        let existIndex = row.process.findIndex(oldItem=>oldItem.process_id === item.process_id)
        if (existIndex >= 0) {
          item = Object.assign({}, item, {selected: true})
        } else {
          item = Object.assign({}, item, {selected: false})
        }
        return item
      })

      this.tempPermission = Object.assign({}, this.tempPermission, {id: row.id, project_producer: projectProducer})
      this.dialogStatus = 'permission'
      this.dialogPermissionVisible = true
      this.$nextTick(() => {
        this.$refs['dataPermissionForm'].clearValidate()
      })
    },
    updatePermissionData() {
      this.$refs['dataPermissionForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.tempPermission))
          temp.project_producer = temp.project_producer.filter(item=>item.selected === true).map(item=>item.process_id).join(',')
          updateMember(temp)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '设置成功',
                type: 'success',
                duration: 2000
              })
              this.dialogPermissionVisible = false
              this.getList(false)
            })
            .catch((error) => {})
        }
      })
    },
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
