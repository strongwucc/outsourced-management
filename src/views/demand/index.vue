<template>
  <div class="app-container">
    <!--筛选-->
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.name"
          placeholder="输入需求名称"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.demand_id"
          placeholder="输入需求单号"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.category_name"
          placeholder="输入需求品类"
          style="width: 200px"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.tag"
          placeholder="需求属性"
          clearable
          class="filter-item"
          style="width: 200px"
          size="mini"
        >
          <el-option
            v-for="item in tagOptions"
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
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >
          新建需求
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleResolve"
        >
          确认
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleReject"
        >
          驳回
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleCreateOrder"
        >
          生成订单
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="handleFinish"
        >
          终止
        </el-button>
      </div>
    </div>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      class="list-container"
      :data="list"
      element-loading-text="加载中"
      fit
      highlight-current-row
    >
      >
      <el-table-column width="50" align="center">
        <div slot="header" slot-scope="scope">
          <el-checkbox
            v-model="globelCheckedAll"
            :checked="globelCheckedAll"
            :indeterminate="isIndeterminateAll"
            @change="clickCheckAll(scope)"
          />
        </div>
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checked"
            :checked="scope.row.checked"
            :indeterminate="scope.row.isIndeterminate"
            @change="handleSelectionChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column type="expand" width="20">
        <template slot-scope="{ row }">
          <el-table class="task-list" border :data="row.tasks" fit stripe>
            <el-table-column label="" width="50" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checked"
                  :checked="scope.row.checked"
                  @change="clickCheckItemFn(row, scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="task_id" label="物件单号" width="200" align="center" />
            <el-table-column prop="task_image" label="缩略图" align="center">
              <template slot-scope="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.task_image"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="task_name" label="物件名称" align="center" />
            <el-table-column
              prop="category_name"
              label="物件品类"
              align="center"
            />
            <el-table-column
              prop="deliver_date"
              label="交付日期"
              width="200"
              align="center"
            />
            <el-table-column prop="work_unit" label="工作单位" align="center" />
            <el-table-column prop="work_num" label="数量" align="center" />
            <el-table-column prop="work_price" label="单价" align="center" />
            <el-table-column prop="work_amount" label="总价" align="center" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="需求订单号" align="left" width="200">
        <template slot-scope="{ row }">
          {{ row.demand_id }}
        </template>
      </el-table-column>

      <el-table-column label="需求名称" align="center" width="150">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="需求品类" align="center" width="150">
        <template slot-scope="{ row }">
          {{ row.category_name }}
        </template>
      </el-table-column>

      <el-table-column label="停留时间" align="center" width="100">
        <template slot-scope="{ row }"> {{ row.stay_time }}小时 </template>
      </el-table-column>

      <el-table-column label="当前处理人" align="center" width="100">
        <template slot-scope="{ row }">
          {{ row.handler }}
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{ row }">
          <span>
            {{ row.status | statusText }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleDetail(row)"
          >
            详情
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
          <el-button type="primary" size="mini" plain> 提交审核 </el-button>
          <el-button type="primary" size="mini" plain @click="showReason('')">
            驳回原因
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleProvider(row)"
          >
            分配供应商
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

    <!--新增修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        class="dialog-form"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="选择项目流程:" prop="process_id">
          <el-select
            v-model="temp.process_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchProcessList"
            :loading="processLoading"
            class="dialog-form-item"
            @focus="fetchProcessList('')"
          >
            <el-option
              v-for="item in process"
              :key="item.id"
              :label="item.flow_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="需求名称:" prop="name">
          <el-input
            v-model="temp.name"
            placeholder="输入需求名称，30字符以内"
          />
        </el-form-item>

        <el-form-item label="需求标记:" prop="tag">
          <el-radio-group v-model="temp.tag">
            <el-radio
              v-for="(tag, tagIndex) in tagOptions"
              :key="tagIndex"
              :label="tag.id"
            >{{ tag.name }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="需求说明:" prop="introduce">
          <el-input
            v-model="temp.introduce"
            type="textarea"
            placeholder="请输入说明"
          />
        </el-form-item>

        <el-form-item label="审核人:" prop="verify_id">
          <el-select
            v-model="temp.verify_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchMemberList"
            :loading="memberLoading"
            class="dialog-form-item"
            @focus="fetchMemberList('')"
          >
            <el-option
              v-for="item in members"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="需求品类:" prop="category_id">
          <el-cascader
            ref="categoryCascader"
            v-model="temp.category_id"
            :options="categorys"
            :props="{ emitPath: false }"
            collapse-tags
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="需求附件" prop="file">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAddFileSucc"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="意向供应商:" prop="supplier_id">
          <div class="has-secret-notice">
            <el-select
              v-model="temp.supplier_id"
              filterable
              remote
              placeholder="请输入关键词"
              :remote-method="fetchProviderList"
              :loading="providerLoading"
              class="dialog-form-item"
              @focus="fetchProviderList('')"
            >
              <el-option
                v-for="item in providers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <div class="secret-notice">仅内部可见</div>
          </div>
        </el-form-item>

        <el-form-item label="备注说明:" prop="remark">
          <div class="has-secret-notice">
            <el-input
              v-model="temp.remark"
              type="textarea"
              placeholder="请输入说明"
              class="dialog-form-item"
            />
            <div class="secret-notice">仅内部可见</div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="dialogStatus === 'create'">
          <el-button @click="createData(0)"> 保存为模板 </el-button>
          <el-button type="primary" @click="createData(1)">
            提报需求
          </el-button>
        </template>
      </div>
    </el-dialog>

    <!--驳回原因-->
    <el-dialog
      title="驳回原因"
      :visible.sync="dialogReasonVisible"
      width="600px"
    >
      <div class="reason-box">
        <div class="content">
          品类改为3D品类改为3D品类改为3D品类改为3D品类改为3D
        </div>
        <div class="user-info">
          <div>驳回人：tom</div>
          <div>驳回时间：2022-05-05 12:00:00</div>
        </div>
      </div>
    </el-dialog>

    <!--详情-->
    <el-dialog title="需求详情" :visible.sync="dialogDetailVisible">
      <el-tabs>
        <el-tab-pane label="详情">详情开发中</el-tab-pane>
        <el-tab-pane label="记录">记录开发中</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData(1)"> 提报需求 </el-button>
      </div>
    </el-dialog>

    <!--审批驳回-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVerifyVisible"
    >
      <el-form
        ref="verifyDataForm"
        class="dialog-form"
        :model="tempVerify"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item
          v-if="dialogStatus === 'resolve'"
          label="通过原因:"
          prop="reason"
        >
          <el-input
            v-model="tempVerify.reason"
            type="textarea"
            placeholder="请输入通过原因"
            class="dialog-form-item"
          />
        </el-form-item>
        <el-form-item
          v-else-if="dialogStatus === 'reject'"
          label="驳回原因:"
          prop="reason"
        >
          <el-input
            v-model="tempVerify.reason"
            type="textarea"
            placeholder="请输入驳回原因"
            class="dialog-form-item"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVerifyVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmVerify"> 确认 </el-button>
      </div>
    </el-dialog>

    <!--分配供应商-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogProviderVisible"
    >
      <el-form
        ref="providerDataForm"
        class="dialog-form"
        :rules="providerRules"
        :model="tempProvider"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="供应商:" prop="id">
          <el-select
            v-model="tempProvider.id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchProviderList"
            :loading="providerLoading"
            class="dialog-form-item"
            @focus="fetchProviderList('')"
          >
            <el-option
              v-for="item in providers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上传附件" prop="file">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAddFileSucc"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProviderVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmProvider"> 确认 </el-button>
      </div>
    </el-dialog>

    <!--终止-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFinishVisible"
    >
      <el-form
        ref="finishDataForm"
        class="dialog-form"
        :rules="finishRules"
        :model="tempFinish"
        label-position="left"
        label-width="150px"
        style="margin: 0 50px"
      >
        <el-form-item label="终止原因:" prop="reason">
          <el-input
            v-model="tempFinish.reason"
            type="textarea"
            placeholder="请输入终止原因"
            class="dialog-form-item"
          />
        </el-form-item>

        <el-form-item label="上传附件" prop="file">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handleAddFileSucc"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFinishVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmFinish"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createDemand, updateDemand } from '@/api/demand/index'
import { fetchAllProcess } from '@/api/project/process'
import { fetchAllMember } from '@/api/system/member'
import { fetchAllProvider } from '@/api/provider/index'
import { fetchAllCategory } from '@/api/system/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusColor(status) {
      const statusMap = {
        0: '#67c23a',
        1: '#67c23a',
        2: '#67c23a',
        3: '#67c23a',
        4: '#67c23a',
        5: '#67c23a',
        6: '#67c23a',
        7: '#67c23a',
        8: '#67c23a',
        9: '#67c23a',
        10: '#67c23a'
      }
      return statusMap[status]
    },
    statusText(status) {
      const statusMap = {
        0: '待提报',
        1: '审核未通过',
        2: '审核中',
        3: '待分配供应商',
        4: '待填写物件',
        5: '物件审核中',
        6: '物件审核未通过',
        7: '待生成订单',
        8: '订单待审核',
        9: '订单审核未通过',
        10: '已生成订单'
      }
      return statusMap[status]
    }
  },
  data() {
    // const validateMobile = (rule, value, callback) => {
    //   if (value) {
    //     const reg = /^1\d{10}$/

    //     if (reg.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('手机号填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    const tagList = [
      { id: 0, name: '正式包' },
      { id: 1, name: '测试包' },
      { id: 2, name: '外派' },
      { id: 3, name: '动态团队' }
    ]
    return {
      globelCheckedAll: false,
      isIndeterminateAll: false,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        demand_id: '',
        category_name: '',
        tag: '',
        page: 1,
        page_num: 10
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        process_id: '',
        name: '',
        tag: 0,
        introduce: '',
        verify_id: '',
        cat_id: '',
        file: '',
        supplier_id: '',
        remark: '',
        status: 0
      },
      tagOptions: tagList,
      textMap: {
        update: '修改需求',
        create: '新增需求',
        resolve: '审批',
        reject: '驳回',
        provider: '选择供应商'
      },
      rules: {
        process_id: [
          { required: true, message: '请选择项目流程', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入需求名称', trigger: 'blur' }],
        verify_id: [
          { required: true, message: '请选择项审核人', trigger: 'change' }
        ],
        category_id: [
          { required: true, message: '请选择需求品类', trigger: 'change' }
        ]
      },
      processLoading: false,
      process: [],
      memberLoading: false,
      members: [],
      providerLoading: false,
      providers: [],
      categorys: [],
      fileList: [],
      dialogReasonVisible: false,
      dialogDetailVisible: false,
      multipleSelection: [],
      dialogVerifyVisible: false,
      tempVerify: {
        reason: ''
      },
      verifyReason: '',
      dialogProviderVisible: false,
      providerRules: {
        id: [{ required: true, message: '请选择供应商', trigger: 'change' }]
      },
      tempProvider: {
        id: '',
        file: ''
      },
      dialogFinishVisible: false,
      finishRules: {
        reason: [
          { required: true, message: '请输入终止原因', trigger: 'blur' }
        ]
      },
      tempFinish: {
        reason: '',
        file: ''
      }
    }
  },
  created() {
    this.fetchCategorys()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      fetchList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.items
        this.updateCheckedAllBtnStatus(false)

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
        process_id: '',
        name: '',
        tag: 0,
        introduce: '',
        verify_id: '',
        cat_id: '',
        file: '',
        supplier_id: '',
        remark: '',
        status: 0
      }
    },
    fetchProcessList(query) {
      this.processLoading = true
      fetchAllProcess({ name: query }).then((response) => {
        this.processLoading = false
        this.process = response.data.items
      })
    },
    fetchMemberList(query) {
      this.memberLoading = true
      fetchAllMember({ keyword: query }).then((response) => {
        this.memberLoading = false
        this.members = response.data.items
      })
    },
    fetchProviderList(query) {
      this.providerLoading = true
      fetchAllProvider({ name: query }).then((response) => {
        this.providerLoading = false
        this.providers = response.data.items
      })
    },
    fetchCategorys() {
      fetchAllCategory().then((response) => {
        this.categorys = response.data.items.map((first) => {
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
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(status = 0) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = Object.assign({}, this.temp)
          temp.demand_id = parseInt(Math.random() * 100) + 1024
          temp.status = status
          createDemand(temp).then(() => {
            const checkedNodes = this.$refs.categoryCascader.getCheckedNodes()
            if (checkedNodes.length > 0) {
              temp.category_name = checkedNodes[0].pathLabels[2]
            } else {
              temp.category_name = ''
            }
            temp.handler = '当前处理人'
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
          updateDemand(tempData).then(() => {
            const index = this.list.findIndex(
              (v) => v.demand_id === tempData.demand_id
            )
            const checkedNodes = this.$refs.categoryCascader.getCheckedNodes()
            if (checkedNodes.length > 0) {
              tempData.category_name = checkedNodes[0].pathLabels[2]
            } else {
              tempData.category_name = ''
            }
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
    },
    handleAddFileSucc(response, file, fileList) {
      const files = fileList
        .map((fileItem) => {
          return fileItem.name
        })
        .join(',')
      this.temp = Object.assign({}, this.temp, { file: files })
    },
    showReason() {
      this.dialogReasonVisible = true
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row)
      this.dialogDetailVisible = true
    },
    handleResolve() {
      this.dialogStatus = 'resolve'
      this.dialogVerifyVisible = true
    },
    handleReject() {
      this.dialogStatus = 'reject'
      this.dialogVerifyVisible = true
    },
    confirmVerify() {
      this.dialogVerifyVisible = false
    },
    handleProvider() {
      this.tempProvider = Object.assign({}, this.tempProvider, {
        id: '',
        file: ''
      })
      this.dialogProviderVisible = true
    },
    confirmProvider() {
      this.dialogProviderVisible = false
    },
    /**
     * 全选所有
     */
    clickCheckAll(item) {
      this.list = this.list.map((val) => {
        val.checked = this.globelCheckedAll
        val.tasks = val.tasks.map((i) => {
          i.checked = this.globelCheckedAll
          return i
        })
        return val
      })
      this.updateCheckedAllBtnStatus(this.globelCheckedAll)
    },
    /**
     * 手动更改全选按钮的状态
     */
    updateCheckedAllBtnStatus(value) {
      // 如果是选了勾选
      if (value) {
        // 检查是否所有数据都手动勾选了
        const isAllChecked = this.list.every((v) => v.checked)
        if (isAllChecked) {
          this.globelCheckedAll = true
          this.isIndeterminateAll = false
        } else {
          this.isIndeterminateAll = true
        }
      } else {
        // 检查是否所有数据取消勾选了
        const isAllCancelChecked = this.list.every((v) => v.checked === false)
        if (isAllCancelChecked) {
          this.globelCheckedAll = false
          this.isIndeterminateAll = false
        } else {
          this.isIndeterminateAll = true
        }
      }
    },
    /**
     * 每行选择事件
     */
    handleSelectionChange(val) {
      val.tasks = val.tasks.map((i) => {
        i.checked = val.checked
        return i
      })
      val.isIndeterminate = false
      this.updateCheckedAllBtnStatus(val.checked)
    },
    /**
     * 每个小项选择事件-单选
     */
    clickCheckItemFn(row, item) {
      // 如果是选了勾选
      if (item.checked) {
        this.isIndeterminateAll = true
        // 检查是否所有数据都手动勾选了
        const isAllChecked = row.tasks.every((v) => v.checked)
        if (isAllChecked) {
          row.checked = true
          row.isIndeterminate = false
        } else {
          row.isIndeterminate = true
        }
      } else {
        // 检查是否所有数据取消勾选了
        const isAllCancelChecked = row.tasks.every((v) => v.checked === false)
        if (isAllCancelChecked) {
          row.checked = false
          row.isIndeterminate = false
          this.isIndeterminateAll = false
        } else {
          row.isIndeterminate = true
        }
      }
    },
    handleCreateOrder() {
      this.$notify({
        title: '成功',
        message: '订单生成成功',
        type: 'success',
        duration: 2000
      })
    },
    handleFinish() {
      this.tempFinish = Object.assign({}, this.tempFinish, {
        reason: '',
        file: ''
      })
      this.dialogFinishVisible = true
    },
    confirmFinish() {
      this.$refs['finishDataForm'].validate((valid) => {
        if (valid) {
          this.$notify({
            title: '成功',
            message: '终止成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFinishVisible = false
        }
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
  }
}
.dialog-form {
  .has-secret-notice {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .dialog-form-item {
      flex: auto;
    }
    .secret-notice {
      margin-left: 10px;
      flex: none;
    }
  }
}
.reason-box {
  .content {
    font-size: 16px;
    text-align: left;
  }
  .user-info {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
