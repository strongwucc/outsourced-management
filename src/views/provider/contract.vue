<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.supplier_name"
          placeholder="供应商名称"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.subject_name"
          placeholder="签约主体"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.bn"
          placeholder="合同编号"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.area"
          placeholder="区域"
          clearable
          class="filter-item"
          style="width: 200px"
          size="mini"
        >
          <el-option
            v-for="item in areas"
            :key="item.area_id"
            :label="item.area_name"
            :value="item.area_name"
          />
        </el-select>
        <el-select
          v-model="listQuery.status"
          placeholder="合作状态"
          clearable
          class="filter-item"
          style="width: 200px"
          size="mini"
        >
          <el-option
            v-for="item in statList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
          新增合同
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
          {{ row.pact_id }}
        </template>
      </el-table-column>
      <el-table-column label="合同名称" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.pact_name }}
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.supplier_name }}
        </template>
      </el-table-column>
      <el-table-column label="签约主体" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.sub_name }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="区域" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.area }}
        </template>
      </el-table-column> -->
      <el-table-column label="合同号" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.bn }}
        </template>
      </el-table-column>
      <el-table-column label="合同开始时间" align="center" min-width="160px">
        <template slot-scope="{ row }">
          {{ row.period_start | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="合同结束时间" align="center" min-width="160px">
        <template slot-scope="{ row }">
          {{ row.period_end | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="合同签署日期" align="center" min-width="160px">
        <template slot-scope="{ row }">
          {{ row.sign_date | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="登记类型" align="center" min-width="150px">
        <template slot-scope="{ row }">
          {{ row.pact_type | typeText }}
        </template>
      </el-table-column>
      <el-table-column label="合同状态" align="center" min-width="100px">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusText }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button size="mini" plain @click="handleDetail(row)">
            查看
          </el-button>
          <el-button
            v-permission="[3, 4]"
            type="primary"
            size="mini"
            plain
            :loading="row.editLoading"
            @click="handleUpdate(row, $index)"
          >
            编辑
          </el-button>
          <el-popconfirm
            v-if="row.status === 2"
            v-permission="[3, 4]"
            style="margin-left: 10px"
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确认恢复合作吗？"
            @confirm="handleChangeContractStatus(row, $index, 1)"
          >
            <el-button slot="reference" size="mini" plain type="success">
              恢复合作
            </el-button>
          </el-popconfirm>

          <el-popconfirm
            v-else-if="row.status === 1"
            v-permission="[3, 4]"
            style="margin-left: 10px"
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确认暂停合作吗？"
            @confirm="handleChangeContractStatus(row, $index, 2)"
          >
            <el-button slot="reference" size="mini" plain type="danger">
              暂停合作
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

    <!--新增合同弹窗-->
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
        label-width="100px"
        style="width: 500px; margin-left: 50px"
        class="dialog-form"
      >
        <el-form-item label="供应商" prop="supplier_id">
          <el-select
            v-model="temp.supplier_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchProviderList"
            :loading="providerLoading"
            class="dialog-form-item"
          >
            <el-option
              v-for="item in providers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="签约主体" prop="sub_id">
          <el-select
            v-model="temp.sub_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchSubjectList"
            :loading="subjectLoading"
            class="dialog-form-item"
          >
            <el-option
              v-for="item in subjects"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="合同编号" prop="bn">
          <el-input v-model="temp.bn" class="dialog-form-item" />
        </el-form-item>
        <el-form-item label="合同名称" prop="pact_name">
          <el-input v-model="temp.pact_name" class="dialog-form-item" />
        </el-form-item>
        <el-form-item label="登记类型" prop="pact_type">
          <el-select
            v-model="temp.pact_type"
            placeholder="请选择合同类型"
            class="dialog-form-item"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同有效期" prop="period_date">
          <el-date-picker
            v-model="temp.period_date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="dialog-form-item"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="上传合同附件" prop="file">
          <el-upload
            class="upload-demo"
            :action="`${$baseUrl}/api/tools/upfile`"
            :on-success="handleAddFileSucc"
            :on-remove="handleFileChange"
            :file-list="fileList"
          >
            <el-button size="mini" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="合同签署日期" prop="sign_date">
          <el-date-picker
            v-model="temp.sign_date"
            type="date"
            class="dialog-form-item"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择合同签署日期"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="temp.remark"
            type="textarea"
            class="dialog-form-item"
          />
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

    <!--查看合同详情弹窗-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogDetailVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataDetail"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="width: 500px; margin-left: 100px"
        class="dialog-form"
      >
        <el-form-item label="供应商:">
          <div>{{ temp.supplier_name }}</div>
        </el-form-item>
        <el-form-item label="签约主体:">
          <div>{{ temp.sub_name }}</div>
        </el-form-item>
        <el-form-item label="合同号:">
          <div>{{ temp.bn }}</div>
        </el-form-item>
        <el-form-item label="合同名称:">
          <div>{{ temp.pact_name }}</div>
        </el-form-item>
        <el-form-item label="登记类型">
          <div>{{ temp.pact_type | typeText }}</div>
        </el-form-item>
        <el-form-item label="合同有效时间:">
          <div>{{ temp.period_start | dateFormat }}至{{ temp.period_end | dateFormat }}</div>
        </el-form-item>
        <el-form-item label="合同附件">
          <div class="file-box">
            <div
              v-for="(file, fileIndex) in temp.files"
              :key="fileIndex"
              class="file-item"
            >
              <div class="file-name">{{ file.name }}</div>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="downLoadContract(file.name, file.url)"
              >下载</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="合同签署日期:">
          <div>{{ temp.sign_date | dateFormat }}</div>
        </el-form-item>
        <el-form-item label="备注">
          <div>{{ temp.remark }}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogDetailVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createContract,
  updateContract,
  changeContractStatus
} from '@/api/provider/contract'
import {
  fetchList as fetchProviders,
  fetchAllProvider,
  fetchSubject,
  fetchRegion
} from '@/api/provider/index'
import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import { previewFile } from '@/utils/index'
import { downloadFile } from '@/api/system/file'
import { downloadFileStream, baseName } from '@/utils/index'

const statList = [
  { id: 0, name: '未生效' },
  { id: 1, name: '正常' },
  { id: 2, name: '已停用' },
  { id: 3, name: '已过期' }
]

const typeList = [
  { id: 0, name: '关联合同' },
  { id: 1, name: '单一主体合同' }
]

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      return statusMap[status]
    },
    statusText(status) {
      let statusText = ''
      statList.some((stat) => {
        if (status === stat.id) {
          statusText = stat.name
          return true
        }
        return false
      })
      return statusText
    },
    typeText(type) {
      let typeText = ''
      typeList.some((item) => {
        if (type === item.id) {
          typeText = item.name
          return true
        }
        return false
      })
      return typeText
    },
    dateFormat(time) {
      const data = time.split(' ')
      return data[0] || time
    }
  },
  data() {
    const validatePeriod = (rule, value, callback) => {
      if (!value[0] || !value[1]) {
        callback(new Error('请选择合同有效时间'))
      } else {
        callback()
      }
    }
    return {
      areas: [],
      statList: statList,
      typeList: typeList,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        supplier_name: '',
        subject_name: '',
        bn: '',
        area: '',
        status: '',
        page: 1,
        page_num: 10,
        sort: '+id'
      },
      providers: [],
      providerLoading: false,
      subjects: [],
      subjectLoading: false,
      dialogStatus: '',
      dialogFormVisible: false,
      dialogDetailVisible: false,
      temp: {
        pact_id: undefined,
        supplier_id: '',
        sub_id: '',
        bn: '',
        pact_name: '',
        pact_type: 0,
        period_date: '',
        period_start: '',
        period_end: '',
        sign_date: '',
        file: '',
        remark: ''
      },
      textMap: {
        update: '修改',
        create: '新增',
        detail: '查看'
      },
      rules: {
        supplier_id: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        sub_id: [
          { required: true, message: '请选择签约主体', trigger: 'change' }
        ],
        bn: [{ required: true, message: '请输入合同号', trigger: 'blur' }],
        pact_name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        pact_type: [
          { required: true, message: '请选择等级类型', trigger: 'change' }
        ],
        period_date: [
          {
            required: true,
            validator: validatePeriod,
            message: '请选择合同有效时间',
            trigger: 'blur'
          }
        ],
        sign_date: [
          { required: true, message: '请选择签署日期', trigger: 'change' }
        ],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  created() {
    this.getList()
    console.log()
  },
  methods: {
    async getList() {
      this.listLoading = true
      if (this.areas.length === 0) {
        const areaData = await fetchRegion()
        this.areas = areaData.data
      }
      fetchList(this.listQuery)
        .then((response) => {
          this.listLoading = false
          this.list = response.data.list.map((item) => {
            const newItem = Object.assign({}, item)
            newItem.pact_id = item.id
            newItem.period_date = [item.period_start, item.period_end]
            newItem.sub_name = item.sub && item.sub.name ? item.sub.name : ''
            newItem.supplier_name =
              item.supplier && item.supplier.name ? item.supplier.name : ''
            newItem.area =
              item.supplier && item.supplier.area ? item.supplier.area : ''
            return newItem
          })
          this.total = response.data.total
        })
        .catch((error) => {
          console.log(error)
          this.listLoading = false
        })
    },
    fetchProviderList(query) {
      if (query !== '') {
        this.providerLoading = true
        fetchProviders({ name: query, page_num: 1000 }).then((response) => {
          this.providerLoading = false
          this.providers = response.data.list
        })
      } else {
        this.providers = []
      }
    },
    fetchSubjectList(query) {
      if (query !== '') {
        this.subjectLoading = true
        fetchSubject({ company_name: query }).then((response) => {
          this.subjectLoading = false
          this.subjects = response.data.list
        })
      } else {
        this.subjects = []
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        pact_id: undefined,
        supplier_id: '',
        sub_id: '',
        bn: '',
        pact_name: '',
        pact_type: 0,
        period_date: '',
        period_start: '',
        period_end: '',
        sign_date: '',
        file: '',
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.fileList = []
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
          // temp.pact_id = parseInt(Math.random() * 100) + 1024
          temp.period_start = this.temp.period_date[0] || ''
          temp.period_end = this.temp.period_date[1] || ''
          this.providers.some((provider) => {
            if (provider.id === temp.supplier_id) {
              temp.supplier_name = provider.name
              temp.area = provider.area
              return true
            }
            return false
          })
          this.subjects.some((subject) => {
            if (subject.id === temp.sub_id) {
              temp.sub_name = subject.name
              return true
            }
            return false
          })

          const postTemp = JSON.parse(JSON.stringify(temp))
          delete postTemp.supplier_name
          delete postTemp.subject_name
          delete postTemp.period_date

          createContract(postTemp).then((response) => {
            temp.pact_id = response.data.id
            temp.status = response.data.status
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
    handleDetail(row) {
      this.temp = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'detail'
      this.dialogDetailVisible = true
    },
    async handleUpdate(row, index) {
      this.temp = JSON.parse(JSON.stringify(row))
      this.$set(this.list[index], 'editLoading', true)
      const providerData = await fetchProviders({ page_num: 1000 }).catch((_error) => {})
      this.providers = providerData.data.list
      const subData = await fetchSubject().catch((_error) => {})
      this.subjects = subData.data.list

      this.fileList = this.temp.files.map((file) => {
        return {
          name: file.name,
          url: file.url,
          response: {
            data: {
              file_id: file.file_id
            }
          }
        }
      })

      this.$set(this.list[index], 'editLoading', false)
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
          temp.period_start = this.temp.period_date[0] || ''
          temp.period_end = this.temp.period_date[1] || ''

          this.providers.some((provider) => {
            if (provider.id === temp.supplier_id) {
              temp.supplier_name = provider.name
              temp.area = provider.area
              return true
            }
            return false
          })
          this.subjects.some((subject) => {
            if (subject.id === temp.sub_id) {
              temp.subject_name = subject.name
              return true
            }
            return false
          })

          const postTemp = JSON.parse(JSON.stringify(temp))
          delete postTemp.supplier_name
          delete postTemp.subject_name
          delete postTemp.period_date

          updateContract(postTemp).then((response) => {
            temp.status = response.data.status
            const index = this.list.findIndex(
              (v) => v.pact_id === temp.pact_id
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
    handleChangeContractStatus(row, index, status) {
      const temp = JSON.parse(JSON.stringify(row))
      temp.status = status
      const postTemp = { pact_id: temp.pact_id, status: temp.status }
      changeContractStatus(postTemp).then(() => {
        this.list.splice(index, 1, temp)
        // const statusIndex = statList.findIndex((stat) => stat.id === status)
        // const statusTxt = statList[statusIndex] ? statList[statusIndex].name : ''
        this.$notify({
          title: '成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleAddFileSucc(response, file, fileList) {
      this.handleFileChange(file, fileList)
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList
      const fileStr = fileList
        .map((fileItem) => {
          return fileItem.response.data.file_id
        })
        .join(',')
      const fileArr = fileList.map((fileItem) => {
        return {
          name: fileItem.name,
          url: fileItem.url,
          response: {
            data: {
              file_id: fileItem.response.data.file_id
            }
          }
        }
      })
      this.temp = Object.assign({}, this.temp, {
        file: fileStr,
        files: fileArr
      })
    },
    downLoadContract(fileName, filePath) {
      // previewFile(fileName, filePath)
      downloadFile({ url: filePath })
        .then((response) => {
          downloadFileStream(fileName, response)
        })
        .catch((_error) => {})
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
    .add-file-btn {
      color: $themeColor;
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
    .file-box {
      .file-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .file-name {
          flex: auto;
          width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .el-button {
          flex: none;
          margin-left: 10px;
          height: 30px;
        }
      }
    }
  }
}
</style>
