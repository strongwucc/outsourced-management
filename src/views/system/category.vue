<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.category_name"
          placeholder="品类名称"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.type_id"
          placeholder="需求类型"
          clearable
          class="filter-item"
          style="width: 200px"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.type_name"
            :value="item.id"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
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
          @click="handleCreate"
        >
          新增需求品类
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
          {{ row.id }}
        </template>
      </el-table-column>

      <el-table-column label="需求品类" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.category_name }}
        </template>
      </el-table-column>

      <el-table-column label="需求类型" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.type_name }}
        </template>
      </el-table-column>

      <el-table-column label="关联属性" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.property_array | relatedProps }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
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
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--新增品类弹窗-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="60vw"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
        class="dialog-form"
      >
        <el-form-item label="需求类型:" prop="type_id">
          <el-select
            v-model="temp.type_id"
            class="dialog-form-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="需求品类名称:" prop="category_name">
          <el-input v-model="temp.category_name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item label="关联属性:" prop="property_json">
          <div class="add-prop-btn" @click="handleCreateProp">新建属性标签</div>
        </el-form-item>
      </el-form>

      <div class="props-container">
        <el-table
          class="props-table"
          :data="temp.property_array"
          border
          highlight-current-row
        >
          <el-table-column label="标签名称" align="center" width="100">
            <template slot-scope="{ row }">
              {{ row.extend_name }}
            </template>
          </el-table-column>

          <el-table-column label="属性类型" align="center" min-width="150px">
            <template slot-scope="{ row }">
              {{ row.extend_tag | propTag }}
            </template>
          </el-table-column>

          <el-table-column label="选项" align="center" min-width="150px">
            <template slot-scope="{ row }">
              {{ row.extend_value || "-" }}
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
                @click="handleUpdateProp(row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="handleDeleteProp($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--新增属性弹窗-->
    <el-dialog
      :title="propTextMap[propDialogStatus]"
      :visible.sync="propDialogFormVisible"
      width="60vw"
    >
      <el-form
        ref="propDataForm"
        :rules="propRules"
        :model="propTemp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left: 50px"
        class="dialog-form"
      >
        <el-form-item label="属性名称:" prop="extend_name">
          <el-input v-model="propTemp.extend_name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item label="属性类型:" prop="extend_tag">
          <el-select
            v-model="propTemp.extend_tag"
            class="dialog-form-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in propTypeOptions"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="propTemp.extend_tag === 0"
          label="备注:"
          prop="extend_remark"
        >
          <el-input
            v-model="propTemp.extend_remark"
            type="textarea"
            class="dialog-form-item"
          />
        </el-form-item>

        <div v-show="propTemp.extend_tag === 1" class="extend-options">
          <el-form-item
            v-for="(option, optionIndex) in propTemp.extend_options"
            :key="optionIndex"
            :label="`选项${optionIndex + 1}:`"
            :rules="propRules.text"
          >
            <div class="option-item-box">
              <el-input v-model="option.text" class="prop-form-item" />
              <div
                class="delete-opt-btn"
                @click="deletePropOption(optionIndex)"
              >
                删除
              </div>
            </div>
          </el-form-item>
          <div class="add-opt-btn" @click="addPropOption">+增加选项</div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="propDialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="
            propDialogStatus === 'create' ? createPropData() : updatePropData()
          "
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchAllType } from '@/api/system/type'
import {
  fetchList,
  updateCategory,
  createCategory,
  updateCategoryProp,
  createCategoryProp
} from '@/api/system/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves },
  filters: {
    propTag(tag) {
      const tagMap = {
        0: '文本',
        1: '单选'
      }
      return tagMap[tag]
    },
    relatedProps(propArray) {
      return propArray
        .map((prop) => {
          return prop.extend_name
        })
        .join(',')
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        sort: '+id'
      },
      typeOptions: [],
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        type_id: '',
        category_name: '',
        property_json: '[]',
        property_array: []
      },
      textMap: {
        update: '修改需求品类',
        create: '新增需求品类'
      },
      rules: {
        type_id: [
          { required: true, message: '请选择需求类型', trigger: 'change' }
        ],
        category_name: [
          { required: true, message: '请输入需求品类名称', trigger: 'blur' }
        ],
        property_json: [
          { required: true, message: '请添加关联属性', trigger: 'blur' }
        ]
      },

      propDialogStatus: '',
      propDialogFormVisible: false,
      propTemp: {
        id: undefined,
        extend_name: '',
        extend_tag: 0,
        extend_value: '',
        extend_remark: '',
        extend_options: [{ text: '' }]
      },
      propTextMap: {
        update: '修改属性',
        create: '新增属性'
      },
      propRules: {
        extend_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ],
        extend_tag: [
          { required: true, message: '请选择属性类型', trigger: 'change' }
        ],
        text: [{ required: true, message: '请输入选项值', trigger: 'blur' }]
      },
      propTypeOptions: [
        { id: 0, type_name: '文本' },
        { id: 1, type_name: '单选' }
      ],
      props: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      if (this.typeOptions.length === 0) {
        const typeData = await fetchAllType()
        this.typeOptions = typeData.data.items
      }
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items.map((item) => {
          const newItem = Object.assign({}, item, { type_name: '' })

          this.typeOptions.some((typeItem) => {
            if (typeItem.id === item.type_id) {
              newItem.type_name = typeItem.type_name
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
        type_id: '',
        category_name: '',
        property_json: '[]',
        property_array: []
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
          createCategory(temp).then(() => {
            this.typeOptions.some((typeItem) => {
              if (typeItem.id === temp.type_id) {
                temp.type_name = typeItem.type_name
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
          updateCategory(tempData).then(() => {
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
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    resetPropTemp() {
      this.propTemp = {
        id: undefined,
        extend_name: '',
        extend_tag: 0,
        extend_value: '',
        extend_remark: '',
        extend_options: [{ text: '' }]
      }
    },
    handleCreateProp() {
      this.resetPropTemp()
      this.propDialogStatus = 'create'
      this.propDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['propDataForm'].clearValidate()
      })
    },
    createPropData() {
      this.$refs['propDataForm'].validate((valid) => {
        if (valid) {
          const propTemp = Object.assign({}, this.propTemp)
          propTemp.id = parseInt(Math.random() * 100) + 1024
          propTemp.extend_value = propTemp.extend_options
            .map((option) => {
              return option.text
            })
            .join(',')
          delete propTemp.extend_options
          createCategoryProp(propTemp).then(() => {
            const property_json_arr = JSON.parse(this.temp.property_json) || []
            property_json_arr.push(propTemp.id)
            const property_json = JSON.stringify(property_json_arr)
            const property_array = this.temp.property_array
            property_array.push(propTemp)
            this.temp = Object.assign({}, this.temp, {
              property_json,
              property_array
            })
            this.propDialogFormVisible = false
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
    handleUpdateProp(row) {
      const extend_value = row.extend_value.split(',')
      row.extend_options = extend_value.map((option) => {
        return { text: option }
      })
      this.propTemp = Object.assign({}, row)
      this.propDialogStatus = 'update'
      this.propDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['propDataForm'].clearValidate()
      })
    },
    updatePropData() {
      this.$refs['propDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.propTemp)
          const updateData = Object.assign({}, tempData)
          // 组合更新参数 extend_value
          updateData.extend_value = tempData.extend_options
            .map((option) => {
              return option.text
            })
            .join(',')
          // 更新参数不需要 extend_options
          delete updateData.extend_options
          // 更新修改属性参数中的 extend_value
          tempData.extend_value = updateData.extend_value
          updateCategoryProp(updateData).then(() => {
            this.propTemp = Object.assign({}, this.propTemp, tempData)
            const index = this.temp.property_array.findIndex(
              (v) => v.id === this.propTemp.id
            )
            const property_array = this.temp.property_array
            property_array.splice(index, 1, this.propTemp)
            const property_json = JSON.stringify(
              property_array.map((property_item) => {
                return property_item.id
              })
            )
            this.temp = Object.assign({}, this.temp, {
              property_array,
              property_json
            })
            this.propDialogFormVisible = false
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
    handleDeleteProp(index) {
      const property_array = this.temp.property_array
      property_array.splice(index, 1)
      const property_json = JSON.stringify(
        property_array.map((property_item) => {
          return property_item.id
        })
      )
      this.temp = Object.assign({}, this.temp, {
        property_array,
        property_json
      })
    },
    addPropOption() {
      const options = this.propTemp.extend_options
      options.push({ text: '' })
      this.propTemp = Object.assign({}, this.propTemp, {
        extend_options: options
      })
    },
    deletePropOption(index) {
      const options = this.propTemp.extend_options
      options.splice(index, 1)
      this.propTemp = Object.assign({}, this.propTemp, {
        extend_options: options
      })
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
  .props-container {
    margin-left: 40px;
  }
  .dialog-form {
    .dialog-form-item {
      width: 100%;
    }
    .add-prop-btn,
    .add-opt-btn,
    .delete-opt-btn {
      color: $themeColor;
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
    .extend-options {
      .option-item-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .prop-form-item {
          width: 80%;
          // flex: auto;
        }
        .delete-opt-btn {
          // flex: none;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
