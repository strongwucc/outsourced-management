<template>
  <div class="task-detail-container">
    <span class="task-id" @click.stop="handleShowTask">{{ taskId }}</span>
    <!--物件详情-->
    <el-dialog
      title="物件详情"
      :visible.sync="dialogTaskDetailVisible"
      width="65%"
      class="task-detail-dialog"
      append-to-body
    >
      <el-tabs v-if="tempTaskDetail.task_id">
        <el-tab-pane label="详情">
          <el-form
            ref="taskDetailForm"
            class="dialog-form"
            :disabled="!taskDetailEditable"
            :model="tempTaskDetail"
            label-position="left"
            label-width="100px"
            style="margin: 0 50px"
          >
            <el-descriptions
              title="需求信息"
              class="margin-top"
              :column="3"
              :label-style="{ 'font-weight': 'bold' }"
            >
              <el-descriptions-item label="流程名称">{{
                tempTaskDetail.process.flow_name
              }}</el-descriptions-item>
              <el-descriptions-item label="流程代码" span="3">{{
                tempTaskDetail.process.bn
              }}</el-descriptions-item>
              <el-descriptions-item label="需求名称">
                <span>{{ tempTaskDetail.demand.name }}</span>
                <el-tag size="mini" style="margin-left: 10px">{{
                  tempTaskDetail.demand.tag | tagText
                }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="需求单号">
                {{ tempTaskDetail.demand.demand_id }}
              </el-descriptions-item>
              <el-descriptions-item label="发起部门">{{
                tempTaskDetail.process.launch_dep.name
              }}</el-descriptions-item>
              <el-descriptions-item label="核算部门" span="3">{{
                tempTaskDetail.process.account_dep.name
              }}</el-descriptions-item>
              <el-descriptions-item label="需求说明" span="6">{{
                tempTaskDetail.demand.introduce
              }}</el-descriptions-item>
              <el-descriptions-item label="需求品类">{{
                tempTaskDetail.category | categoryText
              }}</el-descriptions-item>
              <el-descriptions-item
                label="需求附件"
                span="4"
                :label-style="{ 'align-items': 'center' }"
              >
                <div class="file-box" style="width: 100%">
                  <div
                    v-for="(file, fileIndex) in tempTaskDetail.demand.files"
                    :key="fileIndex"
                    class="file-item"
                    style="
                      width: 50%;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      &:not(:last-child) {
                        margin-bottom: 10px;
                      }
                    "
                  >
                    <div class="file-name">{{ file.name }}</div>
                    <el-button
                      type="primary"
                      :disabled="false"
                      size="mini"
                      plain
                      @click="downLoadContract(file.name, file.url)"
                    >下载</el-button>
                  </div>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <el-row :gutter="20" style="margin-top: 20px">
              <el-col :span="12">
                <el-descriptions
                  title="基础信息"
                  class="margin-top"
                  :column="1"
                  :label-style="{ 'font-weight': 'bold' }"
                >
                  <el-descriptions-item label="缩略图">
                    <img
                      v-if="tempTaskDetail.task_image_url"
                      :src="tempTaskDetail.task_image_url"
                      style="width: 250px; height: 250px"
                      class="task-image"
                    >
                  </el-descriptions-item>
                  <el-descriptions-item label="物件名称">{{
                    tempTaskDetail.task_name
                  }}</el-descriptions-item>
                  <el-descriptions-item label="物件单号">{{
                    tempTaskDetail.task_id
                  }}</el-descriptions-item>
                  <el-descriptions-item label="物件类别">{{
                    tempTaskDetail.category | categoryText
                  }}</el-descriptions-item>
                </el-descriptions>
              </el-col>
              <el-col :span="12">
                <template v-if="taskDetailEditable">
                  <el-descriptions
                    title="属性"
                    class="margin-top"
                    :column="1"
                    :label-style="{ 'font-weight': 'bold' }"
                  />
                  <div class="prop-edit-box">
                    <el-form-item
                      v-for="(property, propIndex) in tempTaskDetail.extends"
                      :key="propIndex"
                      :label="`${property.name}:`"
                      :prop="`extends.${propIndex}.value`"
                      :rules="
                        property.type === 1
                          ? [
                            {
                              required: true,
                              message: `请选择${property.name}`,
                              trigger: 'change',
                            },
                          ]
                          : [
                            {
                              required: true,
                              message: `请输入${property.name}`,
                              trigger: 'blur',
                            },
                          ]
                      "
                    >
                      <el-select
                        v-if="property.type === 1"
                        v-model="property.value"
                        class="dialog-form-item"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="(
                            option, optionIndex
                          ) in property.options.split(',')"
                          :key="optionIndex"
                          :label="option"
                          :value="option"
                        />
                      </el-select>
                      <el-input
                        v-else
                        v-model="property.value"
                        :placeholder="`请输入${property.name}`"
                        class="dialog-form-item"
                      />
                    </el-form-item>
                  </div>
                </template>

                <el-descriptions
                  v-else
                  title="属性"
                  class="margin-top"
                  :column="1"
                  :label-style="{ 'font-weight': 'bold' }"
                >
                  <el-descriptions-item
                    v-for="(prop, propIndex) in tempTaskDetail.props"
                    :key="propIndex"
                    :label="prop.extend_name"
                  >
                    {{ prop.extend_value }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
            <el-descriptions
              title="供应商及价格"
              class="margin-top"
              style="margin-top: 20px"
              :column="4"
              :label-style="{ 'font-weight': 'bold' }"
            >
              <el-descriptions-item label="供应商名称">{{
                tempTaskDetail.supplier.name
              }}</el-descriptions-item>
              <el-descriptions-item label="合同号">{{
                tempTaskDetail.supplier.pact.bn
              }}</el-descriptions-item>
            </el-descriptions>

            <el-table :data="tempTaskDetail.supplier.contacts" border>
              <el-table-column
                prop="contact_name"
                label="姓名"
                align="center"
              />
              <el-table-column
                prop="contact_mobile"
                label="电话"
                width="180"
                align="center"
              />
              <el-table-column prop="contact_qq" label="qq" align="center" />
              <el-table-column prop="contact_wx" label="微信" align="center" />
              <el-table-column
                prop="contact_email"
                label="邮箱"
                align="center"
              />
              <el-table-column
                prop="contact_position"
                label="职位"
                align="center"
              />
            </el-table>

            <el-table :data="[tempTaskDetail]" border style="margin-top: 20px">
              <el-table-column
                prop="work_unit"
                label="工作单位"
                align="center"
              />
              <el-table-column
                prop="work_num"
                label="数量"
                width="180"
                align="center"
              />
              <el-table-column prop="work_price" label="单价" align="center" />
              <el-table-column prop="work_amount" label="总价" align="center" />
              <el-table-column
                prop="deliver_date"
                label="交付日期"
                align="center"
              />
              <el-table-column
                prop="created_at"
                label="创建时间"
                align="center"
              />
            </el-table>
            <div class="file-title" style="margin-top: 20px">
              <el-form-item prop="display_area" :disabled="false">
                <span
                  slot="label"
                  style="font-size: 16px; font-weight: 700"
                >展示图</span>
                <el-upload
                  v-if="taskDetailEditable"
                  class="upload-demo"
                  :action="`${$baseUrl}/api/tools/upfile`"
                  :on-success="handleAddTaskDisplayAreaSucc"
                  :show-file-list="false"
                  :file-list="tempTaskDetail.display_area"
                >
                  <el-button size="mini" type="primary">上传</el-button>
                </el-upload>
              </el-form-item>
            </div>
            <div class="file-box" style="width: 100%">
              <div
                v-for="(file, fileIndex) in tempTaskDetail.display_area"
                :key="fileIndex"
                class="file-item"
                style="
                  width: 50%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                "
              >
                <div class="file-name">{{ file.name }}</div>
                <div class="btns">
                  <el-button
                    type="primary"
                    :disabled="false"
                    size="mini"
                    plain
                    @click="downLoadContract(file.name, file.url)"
                  >下载</el-button>
                  <el-button
                    v-if="taskDetailEditable"
                    type="danger"
                    size="mini"
                    plain
                    @click="deleteTaskDisplayArea(fileIndex)"
                  >删除</el-button>
                </div>
              </div>
            </div>
            <div class="file-title" style="margin-top: 20px">
              <el-form-item prop="finished_product" :disabled="false">
                <span
                  slot="label"
                  style="font-size: 16px; font-weight: 700"
                >作品</span>
                <el-upload
                  v-if="taskDetailEditable"
                  class="upload-demo"
                  :action="`${$baseUrl}/api/tools/upfile`"
                  :on-success="handleAddTaskFinishedProductSucc"
                  :show-file-list="false"
                  :file-list="tempTaskDetail.finished_product"
                >
                  <el-button size="mini" type="primary">上传</el-button>
                </el-upload>
              </el-form-item>
            </div>
            <div class="file-box" style="width: 100%">
              <div
                v-for="(file, fileIndex) in tempTaskDetail.finished_product"
                :key="fileIndex"
                class="file-item"
                style="
                  width: 50%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                "
              >
                <div class="file-name">{{ file.name }}</div>
                <div class="btns">
                  <el-button
                    type="primary"
                    :disabled="false"
                    size="mini"
                    plain
                    @click="downLoadContract(file.name, file.url)"
                  >下载</el-button>
                  <el-button
                    v-if="taskDetailEditable"
                    type="danger"
                    size="mini"
                    plain
                    @click="deleteTaskFinishedProduct(fileIndex)"
                  >删除</el-button>
                </div>
              </div>
            </div>
            <div
              v-if="taskDetailEditable"
              class="dialog-footer"
              style="
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-top: 20px;
              "
            >
              <el-button size="mini" @click="dialogTaskDetailVisible = false">
                取消
              </el-button>
              <el-button type="primary" size="mini" @click="confirmTaskDetail">
                确认
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="操作记录">
          <el-table
            :data="tempTaskDetail.records"
            height="250"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="operator"
              label="操作人"
              width="180"
              align="center"
            />
            <el-table-column
              prop="content"
              label="内容"
              width="180"
              align="center"
            />
            <el-table-column prop="created_at" label="操作时间" align="center" />
            <el-table-column prop="time" label="耗时" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTaskDetail } from '@/api/demand/task'
import { downloadFile } from '@/api/system/file'
import { downloadFileStream, baseName } from '@/utils/index'
const tagList = [
  { id: 0, name: '正式包' },
  { id: 1, name: '测试包' },
  { id: 2, name: '外派' },
  { id: 3, name: '动态团队' }
]
export default {
  name: 'Pagination',
  filters: {
    tagText(tag) {
      let text = tag
      tagList.some((tagItem) => {
        if (tagItem.id === parseInt(tag)) {
          text = tagItem.name
          return true
        }
        return false
      })
      return text
    },
    categoryText(category) {
      if (!category) {
        return '-'
      }
      if (typeof category === 'string') {
        return category
      }
      let name = category.category_name
      if (category.parent) {
        name = `${category.parent.category_name}/${name}`
      }
      if (category.parent && category.parent.parent) {
        name = `${category.parent.parent.category_name}/${name}`
      }
      return name
    }
  },
  props: {
    taskId: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      dialogTaskDetailVisible: false,
      tempTaskDetail: {
        extends: []
      }
    }
  },
  computed: {
    taskDetailEditable: function() {
      if (this.tempTaskDetail.demand) {
        return (
          this.$store.getters.roles.indexOf(0) >= 0 &&
          [4, 6].indexOf(this.tempTaskDetail.demand.status) >= 0
        )
      }
      return false
    }
  },
  methods: {
    /**
     * 物件详情弹窗
     */
    async handleShowTask() {
      const loading = this.$loading({
        target: 'task-id',
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const detailData = await fetchTaskDetail({ task_id: this.taskId })

        const news = { extends: [] }
        const category = detailData.data.category || []
        if (category.property_array.length > 0) {
          news.extends = category.property_array.map((property) => {
            let value = ''
            if (detailData.data.props.length > 0) {
              const propIndex = detailData.data.props.findIndex(
                (prop) => prop.extend_name === property.extend_name
              )
              if (propIndex >= 0) {
                value = detailData.data.props[propIndex].extend_value
              }
            }
            return {
              name: property.extend_name,
              value: value,
              type: property.extend_tag,
              options: property.extend_value
            }
          })
        }

        this.tempTaskDetail = Object.assign({}, detailData.data, news)
        loading.close()
        this.dialogTaskDetailVisible = true
      } catch (error) {
        loading.close()
        // this.$message.error('哎呀，出错啦')
      }
    },
    downLoadContract(fileName, filePath) {
      downloadFile({ url: filePath })
        .then((response) => {
          downloadFileStream(baseName(filePath), response)
        })
        .catch((error) => {})
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";
.task-detail-container {
  .task-id {
    color: $themeColor;
    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }

  .task-detail-dialog {
    .task-detail-title {
      margin-top: 20px;
    }
    .plan-box,
    .file-box {
      .plan-item,
      .file-item {
        width: 50%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
