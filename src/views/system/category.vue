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
          @click="handleCreate(1, 0)"
        >
          新增需求品类
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
      row-key="cat_id"
      :indent="64"
    >
      >
      <!-- <el-table-column label="ID" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.id }}
        </template>
      </el-table-column> -->

      <el-table-column label="需求品类" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.category_name }}
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
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="row.cat_path === 1 || row.cat_path === 2"
            type="primary"
            size="mini"
            plain
            @click="handleCreate(row.cat_path + 1, row.cat_id)"
          >
            添加子类
          </el-button>
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
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确认要删除吗？"
            @confirm="handleDelete(row, $index)"
          >
            <el-button slot="reference" size="mini" plain type="danger">
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
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--新增品类弹窗-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="60vw"
      :close-on-click-modal="false"
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
        <el-form-item label="父级品类" prop="parent_id">
          <ElSelectTree
            v-model="temp.parent_id"
            class="dialog-form-item"
            :data="parents"
            :popper-append-to-body="false"
            popper-class="select-parent"
            check-strictly
            clearable
            filterable
            @change="(value) => parentChange(value)"
          />
        </el-form-item>

        <el-form-item label="需求品类名称:" prop="category_name">
          <el-input v-model="temp.category_name" class="dialog-form-item" />
        </el-form-item>
        <el-form-item label="品类简称:" prop="short_name" v-if="temp.parent_id === 0">
          <el-input v-model="temp.short_name" class="dialog-form-item" />
        </el-form-item>

        <el-form-item
          v-if="temp.cat_path === 3"
          label="是否需要缩略图:"
          prop="thumbnail"
        >
          <el-switch v-model="temp.thumbnail" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item
          v-if="temp.cat_path === 3"
          label="关联属性:"
          prop="property_json"
        >
          <div class="add-prop-btn" @click="handleCreateProp">新建属性标签</div>
        </el-form-item>
      </el-form>

      <div v-if="temp.cat_path === 3" class="props-container">
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
                plain
                @click="handleUpdateProp(row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                plain
                @click="handleDeleteProp($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

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

    <!--新增属性弹窗-->
    <el-dialog
      :title="propTextMap[propDialogStatus]"
      :visible.sync="propDialogFormVisible"
      width="60vw"
      :close-on-click-modal="false"
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
          v-if="propTemp.extend_tag === 0"
          label="备注:"
          prop="extend_remark"
        >
          <el-input
            v-model="propTemp.extend_remark"
            type="textarea"
            class="dialog-form-item"
          />
        </el-form-item>

        <div v-if="propTemp.extend_tag === 1" class="extend-options">
          <el-form-item
            v-for="(option, optionIndex) in propTemp.extend_options"
            :key="optionIndex"
            :label="`选项${optionIndex + 1}:`"
            :prop="`extend_options.${optionIndex}.text`"
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
        <el-button size="mini" @click="propDialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          size="mini"
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
import {
  fetchList,
  fetchAllCategory,
  updateCategory,
  createCategory,
  deleteCategory,
  updateCategoryProp,
  createCategoryProp
} from '@/api/system/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Category',
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
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        sort: '+id'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      parents: [],
      temp: {
        cat_id: undefined,
        parent_id: '',
        cat_path: '',
        category_name: '',
        short_name: '',
        thumbnail: 0,
        property_json: '[]',
        property_array: []
      },
      textMap: {
        update: '修改需求品类',
        create: '新增需求品类'
      },
      rules: {
        parent_id: [
          { required: true, message: '请选择父级品类', trigger: 'change' }
        ],
        category_name: [
          { required: true, message: '请输入需求品类名称', trigger: 'blur' }
        ],
        short_name: [
          { required: true, message: '请输入品类简称', trigger: 'blur' }
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
    this.getParents()
    this.getList()
  },
  methods: {
    updateListData(listItem) {
      if (listItem.cat_path === 1) {
        let updateIndex = -1
        this.list.some((first, firstIndex) => {
          if (first.cat_id === listItem.cat_id) {
            updateIndex = firstIndex
            return true
          }
          return false
        })
        if (updateIndex >= 0) {
          this.list.splice(updateIndex, 1, listItem)
        } else {
          this.list.unshift(listItem)
        }
        return true
      }
      if (listItem.cat_path === 2) {
        let updateFirstIndex = -1
        let updateSecondIndex = -1
        this.list.some((first, firstIndex) => {
          if (first.cat_id === listItem.parent_id) {
            updateFirstIndex = firstIndex
            first.children.some((second, secondIndex) => {
              if (second.cat_id === listItem.cat_id) {
                updateSecondIndex = secondIndex
                return true
              }
              return false
            })
            return true
          } else {
            return false
          }
        })
        if (updateFirstIndex < 0) {
          return false
        }
        if (updateSecondIndex >= 0) {
          this.list[updateFirstIndex].children.splice(
            updateSecondIndex,
            1,
            listItem
          )
        } else {
          this.list[updateFirstIndex].children.unshift(listItem)
        }
        return true
      }
      if (listItem.cat_path === 3) {
        let updateFirstIndex = -1
        let updateSecondIndex = -1
        let updateThirdIndex = -1
        this.list.some((first, firstIndex) => {
          if (
            first.children.some((second, secondIndex) => {
              if (second.cat_id === listItem.parent_id) {
                updateSecondIndex = secondIndex
                second.children.some((third, thirdIndex) => {
                  if (third.cat_id === listItem.cat_id) {
                    updateThirdIndex = thirdIndex
                    return true
                  }
                  return false
                })
                return true
              } else {
                return false
              }
            })
          ) {
            updateFirstIndex = firstIndex
            return true
          }
          return false
        })

        if (updateFirstIndex < 0 || updateSecondIndex < 0) {
          return false
        }
        if (updateThirdIndex >= 0) {
          this.list[updateFirstIndex].children[
            updateSecondIndex
          ].children.splice(updateThirdIndex, 1, listItem)
        } else {
          this.list[updateFirstIndex].children[
            updateSecondIndex
          ].children.unshift(listItem)
        }
        return true
      }
      return false
    },
    getParentCatPath(parent_id = 0) {
      let cat_path = 1
      if (parent_id > 0) {
        this.parents.some((parent) => {
          if (parent.value === parent_id) {
            cat_path = parent.cat_path + 1
            return true
          }
          return parent.children.some((child) => {
            if (child.value === parent_id) {
              cat_path = child.cat_path + 1
              return true
            }
            return false
          })
        })
      }
      return cat_path
    },
    getParents() {
      fetchAllCategory()
        .then((response) => {
          this.parents = response.data.list.map((parent) => {
            const children = parent.children.map((child) => {
              return {
                label: child.category_name,
                value: child.cat_id,
                cat_path: child.cat_path
              }
            })
            return {
              label: parent.category_name,
              value: parent.cat_id,
              children: children,
              cat_path: parent.cat_path
            }
          })
          this.parents.unshift({
            label: '无',
            value: 0,
            children: [],
            cat_path: 0
          })
        })
        .catch((error) => {})
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.list = response.data.list.map((firstItem) => {
            firstItem.children = firstItem.children.map((secondItem) => {
              secondItem.children = secondItem.children.map((thirdItem) => {
                thirdItem.property_json = JSON.stringify(
                  thirdItem.property_array.map((property) => {
                    return property.property_id
                  })
                )
                thirdItem.property_array = thirdItem.property_array.map(property_item=>{
                  let {id, property_id} = property_item
                  property_item.id = property_id
                  property_item.property_id = id
                  return property_item
                })
                return thirdItem
              })
              secondItem.property_json = JSON.stringify(
                secondItem.property_array.map((property) => {
                  return property.property_id
                })
              )
              secondItem.property_array = secondItem.property_array.map(property_item=>{
                let {id, property_id} = property_item
                property_item.id = property_id
                property_item.property_id = id
                return property_item
              })
              return secondItem
            })
            firstItem.property_json = JSON.stringify(
              firstItem.property_array.map((property) => {
                return property.property_id
              })
            )
            firstItem.property_array = firstItem.property_array.map(property_item=>{
                let {id, property_id} = property_item
                property_item.id = property_id
                property_item.property_id = id
                return property_item
              })
            return firstItem
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
    resetTemp(cat_path = 1, parent_id = 0) {
      this.temp = {
        cat_id: undefined,
        parent_id,
        cat_path,
        category_name: '',
        short_name: '',
        thumbnail: true,
        property_json: '[]',
        property_array: []
      }
    },
    handleCreate(cat_path = 1, parent_id = 0) {
      this.resetTemp(cat_path, parent_id)
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
          if (temp.cat_path === 3 && temp.property_json === '[]') {
            this.$notify({
              title: '失败',
              message: '请选择关联属性',
              type: 'error',
              duration: 2000
            })
            return false
          }
          const postTemp = JSON.parse(JSON.stringify(this.temp))
          delete postTemp.property_array
          createCategory(postTemp)
            .then((response) => {
              temp.cat_id = response.data.cat_id
              temp.children = []
              this.updateListData(temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              if (temp.cat_path < 3) {
                this.getParents()
              }
            })
            .catch((error) => {})
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
          const tempData = Object.assign({}, this.temp)
          delete tempData.children
          delete tempData.created_at
          delete tempData.updated_at
          updateCategory(tempData)
            .then(() => {
              this.updateListData(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch((error) => {})
          if (this.temp.cat_path < 3) {
            this.getParents()
          }
        }
      })
    },
    handleDelete(row, index) {
      deleteCategory({ cat_id: row.cat_id })
        .then((response) => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          if (row.cat_path < 3) {
            this.getParents()
          }
          if (row.cat_path === 1) {
            this.list.splice(index, 1)
            return true
          }
          if (row.cat_path === 2) {
            let updateFirstIndex = -1
            let updateSecondIndex = -1
            this.list.some((first, firstIndex) => {
              if (first.cat_id === row.parent_id) {
                updateFirstIndex = firstIndex
                first.children.some((second, secondIndex) => {
                  if (second.cat_id === row.cat_id) {
                    updateSecondIndex = secondIndex
                    return true
                  }
                  return false
                })
                return true
              } else {
                return false
              }
            })
            if (updateFirstIndex < 0) {
              return false
            }
            this.list[updateFirstIndex].children.splice(updateSecondIndex, 1)
            return true
          }
          if (row.cat_path === 3) {
            let updateFirstIndex = -1
            let updateSecondIndex = -1
            let updateThirdIndex = -1
            this.list.some((first, firstIndex) => {
              if (
                first.children.some((second, secondIndex) => {
                  if (second.cat_id === row.parent_id) {
                    updateSecondIndex = secondIndex
                    second.children.some((third, thirdIndex) => {
                      if (third.cat_id === row.cat_id) {
                        updateThirdIndex = thirdIndex
                        return true
                      }
                      return false
                    })
                    return true
                  } else {
                    return false
                  }
                })
              ) {
                updateFirstIndex = firstIndex
                return true
              }
              return false
            })

            if (updateFirstIndex < 0 || updateSecondIndex < 0) {
              return false
            }
            this.list[updateFirstIndex].children[
              updateSecondIndex
            ].children.splice(updateThirdIndex, 1)
            return true
          }
        })
        .catch((error) => {})
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
          // propTemp.id = parseInt(Math.random() * 100) + 1024
          propTemp.extend_value = propTemp.extend_options
            .map((option) => {
              return option.text
            })
            .join(',')
          delete propTemp.extend_options
          createCategoryProp(propTemp)
            .then((response) => {
              propTemp.id = response.data.id
              const property_json_arr =
                JSON.parse(this.temp.property_json) || []
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
            .catch((error) => {})
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
          updateCategoryProp(updateData)
            .then(() => {
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
            .catch((error) => {})
        }
      })
    },
    parentChange(parent_id) {
      const cat_path = this.getParentCatPath(parent_id)
      this.temp = Object.assign({}, this.temp, { cat_path })
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
