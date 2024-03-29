<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.name"
          placeholder="供应商名称"
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
          v-permission="[3, 4]"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >
          添加供应商
        </el-button>
      </div>
    </div>

    <!--表格列表-->
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

      <el-table-column label="供应商名称" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="是否为短名单" align="center" width="120px">
        <template slot-scope="{ row }">
          <el-tag v-if="row.is_short_roster === 1" type="success"> 是 </el-tag>
          <el-tag v-else type="danger"> 否 </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="登录账户" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.login_name }}
        </template>
      </el-table-column>

      <el-table-column label="收件人邮箱" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.email }}
        </template>
      </el-table-column>

      <el-table-column label="区域" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.area }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="350"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button size="mini" plain @click="handleShow(row)">
            查看
          </el-button>
          <el-button
            v-permission="[3, 4]"
            type="primary"
            size="mini"
            plain
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="[3, 4]"
            type="primary"
            size="mini"
            plain
            @click="resetPassword(row)"
          >
            重置登录密码
          </el-button>
          <el-popconfirm
            v-permission="[3, 4]"
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

    <!--分页-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_num"
      @pagination="getList"
    />

    <!--新增供应商弹窗-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="70vw"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :disabled="dialogFormDisabled"
        label-position="left"
        label-width="120px"
        style="margin: 0 50px"
        class="dialog-form"
      >
        <el-form-item label="供应商名称:" prop="name">
          <el-input v-model="temp.name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item label="是否为短名单:" prop="is_short_roster">
          <el-radio v-model="temp.is_short_roster" :label="1">是</el-radio>
          <el-radio v-model="temp.is_short_roster" :label="0">否</el-radio>
        </el-form-item>

        <el-form-item label="简介:" prop="brief">
          <el-input
            v-model="temp.brief"
            type="textarea"
            class="dialog-form-item"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus === 'create'"
          label="供应商登录账户:"
          prop="login_name"
        >
          <el-input v-model="temp.login_name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus === 'create'"
          label="密码:"
          prop="pass_word"
        >
          <el-input
            v-model="temp.pass_word"
            type="password"
            class="dialog-form-item"
          />
        </el-form-item>

        <el-form-item label="手机号:" prop="contact_phone">
          <el-input v-model="temp.contact_phone" class="dialog-form-item" />
        </el-form-item>

        <el-form-item label="收件人邮箱:" prop="email">
          <el-input
            v-model="temp.email"
            class="dialog-form-item"
            placeholder="可多个，分号隔开"
          />
        </el-form-item>
        <el-form-item label="抄送人邮箱:" prop="mail_cc">
          <el-input
            v-model="temp.mail_cc"
            class="dialog-form-item"
            placeholder="可多个，分号隔开"
          />
        </el-form-item>
        <el-form-item label="银行账号:" prop="bank_account">
          <el-input
            v-model="temp.bank_account"
            class="dialog-form-item"
            placeholder="请输入银行账号"
          />
        </el-form-item>
        <el-form-item label="银行及开户行:" prop="bank_name">
          <el-input
            v-model="temp.bank_name"
            class="dialog-form-item"
            placeholder="请输入银行及开户行"
          />
        </el-form-item>

        <el-form-item label="区域:" prop="area">
          <el-select
            v-model="temp.area"
            class="dialog-form-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in areas"
              :key="item.area_id"
              :label="item.area_name"
              :value="item.area_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogFormDisabled === true" label="品类单价配置" />
        <el-form-item v-else label="品类单价配置:" prop="cat_json">
          <div class="add-category-btn" @click="handleCreateCategory">添加</div>
        </el-form-item>

        <div class="category-container">
          <el-table
            class="category-table"
            :data="temp.prices"
            border
            highlight-current-row
          >
            <el-table-column label="需求品类" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`prices.${scope.$index}.cat_id`"
                  :rules="rules.cat_id"
                >
                  <el-cascader
                    ref="categoryCascader"
                    v-model="scope.row.cat_id"
                    :options="categories"
                    :props="{ emitPath: false }"
                    collapse-tags
                    clearable
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="单价最大值" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`prices.${scope.$index}.price`"
                  :rules="rules.price"
                >
                  <el-input
                    v-model="scope.row.price"
                    placeholder="请输入单价最大值"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row, $index }">
                <el-button
                  v-if="row.status != 'deleted'"
                  size="mini"
                  type="danger"
                  @click="handleDeleteCategory($index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-form-item v-if="dialogFormDisabled === true" label="联系人配置" />
        <el-form-item v-else label="联系人配置:" prop="contacts">
          <div class="add-contact-btn" @click="handleCreateContact">添加</div>
        </el-form-item>

        <div class="contact-container">
          <el-table
            class="contact-table"
            :data="temp.contacts"
            border
            highlight-current-row
          >
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contacts.${scope.$index}.contact_name`"
                  :rules="rules.contact_name"
                >
                  <el-input v-model="scope.row.contact_name" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="电话" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contacts.${scope.$index}.contact_mobile`"
                  :rules="rules.contact_mobile"
                >
                  <el-input v-model="scope.row.contact_mobile" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="qq" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contacts.${scope.$index}.contact_qq`"
                >
                  <el-input v-model="scope.row.contact_qq" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="微信" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contacts.${scope.$index}.contact_wx`"
                >
                  <el-input v-model="scope.row.contact_wx" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="邮箱" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contacts.${scope.$index}.contact_email`"
                >
                  <el-input v-model="scope.row.contact_email" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="职位" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contacts.${scope.$index}.contact_position`"
                >
                  <el-input v-model="scope.row.contact_position" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row, $index }">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteContact($index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <div
        v-if="dialogFormDisabled === true"
        slot="footer"
        class="dialog-view-footer"
      >
        <el-button size="mini" @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
      <div v-else slot="footer" class="dialog-footer">
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

    <!--供应商详情-->
    <el-dialog
      title="供应商详情"
      :visible.sync="dialogDetailVisible"
      width="65%"
      class="detail-dialog"
      :close-on-click-modal="false"
    >
      <el-descriptions
        title="基本信息"
        class="margin-top"
        :column="1"
        :label-style="{ 'font-weight': 'bold', width: '150px' }"
      >
        <el-descriptions-item label="供应商名称">{{
          temp.name
        }}</el-descriptions-item>
        <el-descriptions-item label="简介">{{
          temp.brief
        }}</el-descriptions-item>
        <el-descriptions-item label="登录账户">
          {{ temp.login_name }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ temp.contact_phone }}
        </el-descriptions-item>
        <el-descriptions-item label="收件人邮箱">
          {{ temp.email }}
        </el-descriptions-item>
        <el-descriptions-item label="抄送人邮箱">
          {{ temp.email_cc }}
        </el-descriptions-item>
        <el-descriptions-item label="区域">{{
          temp.area
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        title="需求品类单价"
        class="margin-top detail-title"
        :column="1"
        :label-style="{ 'font-weight': 'bold', width: '150px' }"
      >
        <el-descriptions-item
          v-for="(category, categoryIndex) in temp.prices"
          :key="categoryIndex"
          :label="category.category | categoryPath"
        >{{ category.price }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        title="联系人列表"
        class="margin-top detail-title"
        :label-style="{ 'font-weight': 'bold' }"
      />
      <el-table :data="temp.contacts" border style="width: 100%">
        <el-table-column prop="contact_name" label="姓名" align="center" />
        <el-table-column prop="contact_mobile" label="电话" align="center" />
        <el-table-column prop="contact_email" label="邮箱" align="center" />
        <el-table-column prop="contact_qq" label="qq" align="center" />
        <el-table-column prop="contact_wx" label="微信" align="center" />
        <el-table-column prop="contact_position" label="职位" align="center" />
      </el-table>
    </el-dialog>

    <!--密码修改-->
    <el-dialog
      title="登录密码重置"
      :visible.sync="dialogPasswordVisible"
      :close-on-click-modal="false"
      append-to-body
      width="500px"
    >
      <el-form
        ref="passwordForm"
        class="password-form"
        :rules="passwordRules"
        :model="tempPassword"
        label-position="left"
        label-width="100px"
        style="margin-left: 10px"
      >
        <el-form-item label="新密码:" prop="new_pass">
          <el-input
            v-model="tempPassword.new_pass"
            class="dialog-form-item"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认新密码:" prop="confirm_pass">
          <el-input
            v-model="tempPassword.confirm_pass"
            class="dialog-form-item"
            show-password
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogPasswordVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmResetPassword()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createProvider,
  updateProvider,
  fetchRegion,
  deleteProvider
} from '@/api/provider/index'
import {
  updateMember
} from '@/api/system/member'
import { fetchAllCategory } from '@/api/system/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令

const validateMobile = (rule, value, callback) => {
  if (value) {
    const reg = /^1\d{10}$/

    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('手机号填写不正确'))
    }
  } else {
    callback(new Error('请输入手机号'))
  }
}

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    categoryPath: function(category) {
      if (!category) {
        return ''
      }
      const path = []
      if (category.category_name) {
        path.unshift(category.category_name)
        if (category.parent && category.parent.category_name) {
          path.unshift(category.parent.category_name)
          if (category.parent.parent && category.parent.parent.category_name) {
            path.unshift(category.parent.parent.category_name)
          }
        }
      }
      return path.join('/')
    }
  },
  data() {
    return {
      areas: [],
      categories: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_num: 10,
        name: undefined,
        sort: '+id'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogFormDisabled: false,
      price: '',
      temp: {
        id: undefined,
        name: '',
        is_short_roster: 0,
        brief: '',
        login_name: '',
        pass_word: '',
        contact_phone: '',
        email: '',
        mail_cc: '',
        bank_name: '',
        bank_account: '',
        area: '',
        prices: [],
        contacts: []
      },
      textMap: {
        update: '修改供应商',
        create: '添加供应商',
        view: '供应商详情'
      },
      dialogDetailVisible: false,
      dialogPasswordVisible: false,
      tempPassword: {
        id: '',
        new_pass: '',
        confirm_pass: ''
      },
      passwordRules: {
        new_pass: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirm_pass: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    rules: function() {
      if (this.dialogFormDisabled === true) {
        return Object.assign({})
      }
      return {
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        // is_short_roster: [
        //   { required: true, message: '请选择是否为短名单', trigger: 'blur' }
        // ],
        // brief: [
        //   { required: true, message: '请输入供应商简介', trigger: 'blur' }
        // ],
        contact_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入收件人邮箱', trigger: 'blur' }
        ],
        bank_name: [
          { required: true, message: '请输入银行及开户行', trigger: 'blur' }
        ],
        bank_account: [
          { required: true, message: '请输入银行账户', trigger: 'blur' }
        ],
        cat_id: [
          { required: true, message: '请选择需求品类', trigger: 'change' }
        ],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
        // contact_name: [
        //   { required: true, message: '请输入姓名', trigger: 'blur' }
        // ],
        // contact_mobile: [
        //   {
        //     validator: validateMobile,
        //     trigger: 'blur'
        //   }
        // ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      if (this.areas.length === 0) {
        const areaData = await fetchRegion()
        this.areas = areaData.data
      }
      if (this.categories.length === 0) {
        const categoryData = await fetchAllCategory()
        this.categories = categoryData.data.list.map((first) => {
          const seconds = first.children.map((second) => {
            const thirds = second.children.map((third) => {
              return {
                label: third.category_name,
                value: third.cat_id
              }
            })
            return {
              label: second.category_name,
              value: second.cat_id,
              children: thirds
            }
          })
          return {
            label: first.category_name,
            value: first.cat_id,
            children: seconds
          }
        })
      }
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
        id: undefined,
        name: '',
        is_short_roster: 0,
        brief: '',
        login_name: '',
        pass_word: '',
        contact_phone: '',
        email: '',
        email_cc: '',
        bank_name: '',
        bank_account: '',
        area: '',
        prices: [],
        contacts: []
      }
    },
    handleShow(row) {
      this.temp = JSON.parse(JSON.stringify(row))
      this.dialogDetailVisible = true
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.temp))
          createProvider(temp)
            .then((response) => {
              temp.id = response.data.id
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
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetPassword(row) {
      this.tempPassword = Object.assign({}, this.tempPassword, { id: row.user_id, new_pass: '', confirm_pass: '' })
      this.dialogPasswordVisible = true
      this.$nextTick(() => {
        this.$refs['passwordForm'].clearValidate()
      })
    },
    confirmResetPassword() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          if (this.tempPassword.new_pass !== this.tempPassword.confirm_pass) {
            this.$message.error('两次密码输入不一致')
            return false
          }
          updateMember({ id: this.tempPassword.id, password: this.tempPassword.new_pass })
            .then(() => {
              this.dialogPasswordVisible = false
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.temp))
          updateProvider(temp)
            .then(() => {
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
      deleteProvider({ id: row.id })
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
    handleCreateCategory() {
      const newCategory = { cat_id: '', price: '' }
      const categoryArray = this.temp.prices
      categoryArray.push(newCategory)
      this.temp = Object.assign({}, this.temp, { prices: categoryArray })
    },
    handleCreateContact() {
      const newContact = {
        contact_name: '',
        contact_mobile: '',
        contact_email: '',
        contact_qq: '',
        contact_wx: '',
        contact_position: ''
      }
      const contactArray = this.temp.contacts
      contactArray.push(newContact)
      this.temp = Object.assign({}, this.temp, { contacts: contactArray })
    },
    handleDeleteCategory(index) {
      const categoryArray = this.temp.prices
      categoryArray.splice(index, 1)
      this.temp = Object.assign({}, this.temp, { prices: categoryArray })
    },
    handleDeleteContact(index) {
      const contactArray = this.temp.contacts
      contactArray.splice(index, 1)
      this.temp = Object.assign({}, this.temp, { contacts: contactArray })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
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
    .add-category-btn,
    .add-contact-btn {
      color: $themeColor;
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
  }
  .detail-dialog {
    .detail-title {
      margin-top: 20px;
    }
  }
}
</style>
