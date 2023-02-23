<template>
  <div class="task-detail-container">
    <span class="task-id" @click.stop="handleShowTask">{{ taskId }}</span>
    <!--物件详情-->
    <el-dialog
      title="物件详情"
      :visible.sync="dialogTaskDetailVisible"
      width="65%"
      top="20px"
      class="task-detail-dialog"
      append-to-body
    >
      <el-tabs v-if="tempTaskDetail.task_id">
        <el-tab-pane label="详情">
          <el-form
            ref="taskDetailForm"
            class="dialog-form"
            :disabled="!taskDetailEditable && !fileEditable"
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
              <el-descriptions-item v-if="$store.getters.roles.indexOf(0) < 0" label="发起部门">{{
                tempTaskDetail.process.launch_dep.name
              }}</el-descriptions-item>
              <el-descriptions-item v-if="$store.getters.roles.indexOf(0) < 0" label="核算部门">{{
                tempTaskDetail.process.account_dep.name
              }}</el-descriptions-item>
              <el-descriptions-item label="需求品类" span="3">{{
                tempTaskDetail.category | categoryText
              }}</el-descriptions-item>
              <el-descriptions-item label="需求说明" span="6">{{
                tempTaskDetail.demand.introduce
              }}</el-descriptions-item>
              <el-descriptions-item label="需求附件" span="4">
                <div class="file-box" style="width: 100%">
                  <div
                    v-for="(file, fileIndex) in tempTaskDetail.demand.files"
                    :key="file.file_id"
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
                  <div
                    v-for="(file, fileIndex) in tempTaskDetail.demand
                      .supplier_files"
                    :key="file.file_id"
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
              <el-descriptions-item v-if="tempTaskDetail.supplier" label="供应商名称">{{
                tempTaskDetail.supplier.name
              }}</el-descriptions-item>
              <el-descriptions-item v-if="tempTaskDetail.supplier && tempTaskDetail.supplier.pact" label="合同号">{{
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
                  style="font-size: 16px; font-weight: 700; color: #599cf7"
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
            <div class="file-box display-area">
              <div
                v-for="(image, imageIndex) in tempTaskDetail.display_area"
                :key="imageIndex"
                class="img-item"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="image.url"
                />
                <div class="img-actions">
                  <span
                    class="btn-item"
                    @click="handlePictureCardPreview(image)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    class="btn-item"
                    @click="downLoadContract(image.name, image.url)"
                  >
                    <i class="el-icon-download" />
                  </span>
                  <span
                    v-if="taskDetailEditable || fileEditable"
                    class="btn-item"
                    @click="deleteTaskDisplayArea(imageIndex)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </div>
              </div>
            </div>
            <div class="file-title" style="margin-top: 20px">
              <el-form-item prop="finished_product" :disabled="false">
                <span
                  slot="label"
                  style="font-size: 16px; font-weight: 700; color: #599cf7"
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
                    v-if="taskDetailEditable || fileEditable"
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
            height="500"
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
              min-width="300"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="created_at"
              min-width="200"
              label="操作时间"
              align="center"
            />
            <el-table-column prop="time" label="耗时" align="center" width="180" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { fetchTaskDetail, updateTask } from '@/api/demand/task'
import { uploadWorkImage } from '@/api/order/index'
import { downloadFile } from '@/api/system/file'
import { downloadFileStream, baseName } from '@/utils/index'
import { boolean } from 'yargs'
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
    },
    fileEditable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogTaskDetailVisible: false,
      tempTaskDetail: {
        extends: []
      },
      dialogImageUrl: '',
      dialogImageVisible: false
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
    },
    displayAreaList: function() {
      return this.tempTaskDetail.display_area.map((item) => {
        return item.url
      })
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
    },
    /**
     * 上传物件展示图成功
     */
    handleAddTaskDisplayAreaSucc(response, file, fileList) {
      this.$set(
        this.tempTaskDetail,
        'display_area',
        fileList.map((file) => {
          let { file_id, name, url, response } = file
          if (response) {
            file_id = response.data.file_id
            url = response.data.url
          }
          return { file_id, name, url }
        })
      )
    },
    /**
     * 上传物件作品成功
     */
    handleAddTaskFinishedProductSucc(response, file, fileList) {
      this.$set(
        this.tempTaskDetail,
        'finished_product',
        fileList.map((file) => {
          let { file_id, name, url, response } = file
          if (response) {
            file_id = response.data.file_id
            url = response.data.url
          }
          return { file_id, name, url }
        })
      )
    },
    /**
     * 物件详情弹窗确认
     */
    confirmTaskDetail() {
      const temp = JSON.parse(JSON.stringify(this.tempTaskDetail))
      const task_id = temp.task_id
      const demand_id = temp.demand_id
      const extend = temp.extends.map((extend) => {
        return { name: extend.name, value: extend.value }
      })
      const display_area = temp.display_area
        .map((display_area_item) => {
          return display_area_item.file_id
        })
        .join(',')
      const finished_product = temp.finished_product
        .map((finished_product_item) => {
          return finished_product_item.file_id
        })
        .join(',')
      updateTask({ demand_id, task_id, extend, display_area, finished_product })
        .then(() => {
          this.dialogTaskDetailVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch((_error) => {})
    },
    /**
     * 删除物件展示图
     */
    deleteTaskDisplayArea(fileIndex) {
      const displayArea = JSON.parse(
        JSON.stringify(this.tempTaskDetail.display_area)
      )
      displayArea.splice(fileIndex, 1)
      if (!this.taskDetailEditable) {
        uploadWorkImage({
          task_id: this.tempTaskDetail.task_id,
          up_type: 1,
          file_id: displayArea.map((file) => file.file_id).join(',')
        })
          .then((response) => {
            this.$set(this.tempTaskDetail, 'display_area', displayArea)
            this.$message.success('删除成功')
            this.$emit('updateFile', {
              index: fileIndex,
              key: 'display_area',
              value: displayArea
            })
          })
          .catch((_error) => {})
      } else {
        this.$set(this.tempTaskDetail, 'display_area', displayArea)
      }
    },
    /**
     * 删除物件作品
     */
    deleteTaskFinishedProduct(fileIndex) {
      const finishedProduct = JSON.parse(
        JSON.stringify(this.tempTaskDetail.finished_product)
      )
      finishedProduct.splice(fileIndex, 1)
      if (!this.taskDetailEditable) {
        uploadWorkImage({
          task_id: this.tempTaskDetail.task_id,
          up_type: 0,
          file_id: finishedProduct.map((file) => file.file_id).join(',')
        })
          .then((response) => {
            this.$set(this.tempTaskDetail, 'finished_product', finishedProduct)
            this.$message.success('删除成功')
            this.$emit('updateFile', {
              index: fileIndex,
              key: 'finished_product',
              value: finishedProduct
            })
          })
          .catch((_error) => {})
      } else {
        this.$set(this.tempTaskDetail, 'finished_product', finishedProduct)
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
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
    &.display-area {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .img-item {
        margin: 0 10px 10px 0;
        position: relative;
        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
        width: 100px;
        height: 100px;
        .img-actions {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: default;
          text-align: center;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          transition: opacity 0.3s;
          &:hover {
            opacity: 1;
          }
          .btn-item {
            cursor: pointer;
            &:not(:last-child) {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
