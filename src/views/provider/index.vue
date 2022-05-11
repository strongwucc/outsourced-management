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
      class="list-container"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.supplier_id }}
        </template>
      </el-table-column>

      <el-table-column label="供应商名称" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.supplier_name }}
        </template>
      </el-table-column>

      <el-table-column label="登录账户" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.login_name }}
        </template>
      </el-table-column>

      <el-table-column label="抄送邮件" align="center" min-width="150px">
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
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button size="mini" @click="handleShow(row)"> 查看 </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
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

    <!--新增供应商弹窗-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="70vw"
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
        <el-form-item label="供应商名称:" prop="supplier_name">
          <el-input v-model="temp.supplier_name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item label="简介:" prop="brief">
          <el-input
            v-model="temp.brief"
            type="textarea"
            class="dialog-form-item"
          />
        </el-form-item>

        <el-form-item label="供应商登录账户:" prop="login_name">
          <el-input v-model="temp.login_name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item label="密码:" prop="pass_word">
          <el-input
            v-model="temp.pass_word"
            type="password"
            class="dialog-form-item"
          />
        </el-form-item>

        <el-form-item label="抄送邮件:" prop="email">
          <el-input
            v-model="temp.email"
            class="dialog-form-item"
            placeholder="可多个，分号隔开"
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
              :key="item.id"
              :label="item.name"
              :value="item.name"
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
            :data="temp.cat_array"
            border
            highlight-current-row
          >
            <el-table-column label="需求类型" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`cat_array.${scope.$index}.type_id`"
                  :rules="rules.type_id"
                >
                  <el-select
                    v-model="scope.row.type_id"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :label="item.type_name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="需求品类" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`cat_array.${scope.$index}.cat_id`"
                  :rules="rules.cat_id"
                >
                  <el-select
                    v-model="scope.row.cat_id"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in categories"
                      :key="item.id"
                      :label="item.category_name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="单价" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`cat_array.${scope.$index}.price`"
                  :rules="rules.price"
                >
                  <el-input
                    v-model="scope.row.price"
                    placeholder="请输入单价"
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
            :data="temp.contact_array"
            border
            highlight-current-row
          >
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contact_array.${scope.$index}.name`"
                  :rules="rules.name"
                >
                  <el-input v-model="scope.row.name" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="电话" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contact_array.${scope.$index}.mobile`"
                  :rules="rules.mobile"
                >
                  <el-input v-model="scope.row.mobile" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="qq" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contact_array.${scope.$index}.qq`"
                >
                  <el-input v-model="scope.row.qq" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="微信" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contact_array.${scope.$index}.wx`"
                >
                  <el-input v-model="scope.row.wx" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="职位" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="`contact_array.${scope.$index}.position`"
                >
                  <el-input v-model="scope.row.position" />
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
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
      </div>
      <div v-else slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
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
  createProvider,
  updateProvider,
  fetchRegion
} from '@/api/provider/index'
import { fetchAllType } from '@/api/system/type'
import { fetchAllCategory } from '@/api/system/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

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
  directives: { waves },
  filters: {},
  data() {
    return {
      areas: [],
      types: [],
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
        supplier_id: undefined,
        supplier_name: '',
        brief: '',
        login_name: '',
        pass_word: '',
        email: '',
        area: '',
        cat_json: '[]',
        cat_array: [],
        contacts: '[]',
        contact_array: []
      },
      textMap: {
        update: '修改供应商',
        create: '添加供应商',
        view: '供应商详情'
      }
    }
  },
  computed: {
    rules: function() {
      if (this.dialogFormDisabled === true) {
        return Object.assign({})
      }
      return {
        supplier_name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入供应商简介', trigger: 'blur' }
        ],
        type_id: [
          { required: true, message: '请选择需求类型', trigger: 'change' }
        ],
        cat_id: [
          { required: true, message: '请选择需求品类', trigger: 'change' }
        ],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [
          {
            required: true,
            validator: validateMobile,
            message: '请输入电话',
            trigger: 'blur'
          }
        ]
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
        this.areas = areaData.data.items
      }
      if (this.types.length === 0) {
        const typeData = await fetchAllType()
        this.types = typeData.data.items
      }
      if (this.categories.length === 0) {
        const categoryData = await fetchAllCategory()
        this.categories = categoryData.data.items
      }
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items.map((item) => {
          const newItem = Object.assign({}, item)
          newItem.cat_json = JSON.stringify(item.cat)
          newItem.cat_array = item.cat
          newItem.contact_array = item.contacts
          newItem.contacts = JSON.stringify(item.contacts)
          newItem.supplier_id = item.id
          newItem.supplier_name = item.name
          delete newItem.cat
          delete newItem.id
          delete newItem.name
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
        supplier_id: undefined,
        supplier_name: '',
        brief: '',
        login_name: '',
        pass_word: '',
        email: '',
        area: '',
        cat_json: '[]',
        cat_array: [],
        contacts: '[]',
        contact_array: []
      }
    },
    handleShow(row) {
      this.temp = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.dialogFormDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
          temp.supplier_id = parseInt(Math.random() * 100) + 1024
          temp.cat_json = JSON.stringify(temp.cat_array)
          temp.contacts = JSON.stringify(temp.contact_array)

          const postTemp = Object.assign({}, temp)
          delete postTemp.cat_array
          delete postTemp.contact_array
          createProvider(postTemp).then(() => {
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
      this.temp = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.temp))
          temp.cat_json = JSON.stringify(temp.cat_array)
          temp.contacts = JSON.stringify(temp.contact_array)

          const postTemp = JSON.parse(JSON.stringify(temp))
          delete postTemp.cat_array
          delete postTemp.contact_array
          updateProvider(postTemp).then(() => {
            const index = this.list.findIndex(
              (v) => v.supplier_id === temp.supplier_id
            )
            this.list.splice(index, 1, temp)
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
    },
    handleCreateCategory() {
      const newCategory = { type_id: '', cat_id: '', price: '' }
      const categoryArray = this.temp.cat_array
      categoryArray.push(newCategory)
      this.temp = Object.assign({}, this.temp, { cat_array: categoryArray })
    },
    handleCreateContact() {
      const newContact = { name: '', mobile: '', qq: '', wx: '', position: '' }
      const contactArray = this.temp.contact_array
      contactArray.push(newContact)
      this.temp = Object.assign({}, this.temp, { contact_array: contactArray })
    },
    handleDeleteCategory(index) {
      const categoryArray = this.temp.cat_array
      categoryArray.splice(index, 1)
      this.temp = Object.assign({}, this.temp, { cat_array: categoryArray })
    },
    handleDeleteContact(index) {
      const contactArray = this.temp.contact_array
      contactArray.splice(index, 1)
      this.temp = Object.assign({}, this.temp, { contact_array: contactArray })
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
}
</style>
