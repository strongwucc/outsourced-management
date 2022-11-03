<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="detail"
      label-position="left"
      label-width="250px"
      class="dialog-form"
      style="margin-left: 30px"
    >
      <el-form-item label="主项目:" prop="project_id">
        <el-select
          v-model="detail.project_id"
          filterable
          placeholder="请输入关键词"
          class="dialog-form-item"
        >
          <el-option
            v-for="item in allProjects"
            :key="item.project_id"
            :label="item.project_name"
            :value="item.project_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="流程名称:" prop="flow_name">
        <el-input v-model="detail.flow_name" class="dialog-form-item" />
      </el-form-item>
      <el-form-item label="流程代码:" prop="bn">
        <el-input
          v-model="detail.bn"
          class="dialog-form-item"
          placeholder="六位数字加字母"
        />
      </el-form-item>
      <el-form-item label="需求方:" prop="demand">
        <el-select
          v-model="detail.demand"
          class="dialog-form-item"
          placeholder="请选择"
        >
          <el-option
            v-for="item in demands"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预算使用方:" prop="budget_dep_id">
        <el-select
          v-model="detail.budget_dep_id"
          filterable
          :filter-method="(val) => departFilter(val, 2)"
          placeholder="请输入关键词"
          class="dialog-form-item"
          @focus="departFilter('', 2)"
        >
          <el-option
            v-for="item in budgetDeps"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目管理软件索引码:" prop="soft_code">
        <el-input
          v-model="detail.soft_code"
          class="dialog-form-item"
          placeholder="大写字母或数字，15字符以内"
        />
      </el-form-item>
      <el-form-item label="项目简介:" prop="brief">
        <el-input
          v-model="detail.brief"
          type="textarea"
          class="dialog-form-item"
          placeholder="输入项目简介"
        />
      </el-form-item>
      <el-form-item label="发起部门:" prop="launch_dep_id">
        <el-select
          v-model="detail.launch_dep_id"
          filterable
          :filter-method="(val) => departFilter(val, 0)"
          placeholder="请输入关键词"
          class="dialog-form-item"
          @focus="departFilter('', 0)"
        >
          <el-option
            v-for="item in launchDeps"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="合同主体:" prop="sub_id">
        <el-select
          v-model="detail.sub_id"
          filterable
          placeholder="请输入关键词"
          class="dialog-form-item"
        >
          <el-option
            v-for="item in allSubs"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核算方:" prop="accounting">
        <el-input
          v-model="detail.accounting"
          class="dialog-form-item"
          placeholder="大写字母或数字，15字符以内"
        />
      </el-form-item>
      <el-form-item label="核算部门:" prop="account_dep_id">
        <el-select
          v-model="detail.account_dep_id"
          filterable
          :filter-method="(val) => departFilter(val, 1)"
          placeholder="请输入关键词"
          class="dialog-form-item"
          @focus="departFilter('', 1)"
        >
          <el-option
            v-for="item in accountDeps"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目制作人:" prop="project_producer">
        <el-select
          v-model="detail.project_producer"
          multiple
          filterable
          collapse-tags
          class="dialog-form-item"
        >
          <el-option
            v-for="member in projectProducerList"
            :key="member.id"
            :label="member.name"
            :value="member.id"
          >
            <span style="float: left">{{ member.name }}</span>
            <span style="float: right">{{ member.mobile }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮件抄送人:" prop="email_cc">
        <el-input
          v-model="detail.email_cc"
          class="dialog-form-item"
          placeholder="请输入邮件抄送人，多个用“,”隔开"
        />
      </el-form-item>
      <el-form-item label="法务收件人:" prop="legal_email">
        <el-input
          v-model="detail.legal_email"
          class="dialog-form-item"
          placeholder="请输入法务收件人"
        />
      </el-form-item>
      <el-divider class="form-divider" content-position="left" />
      <el-form-item label="创建需求卡:" prop="needs_create_json">
        <div class="needs-create-add" @click="addNeedsCreateItem">
          <i class="el-icon-circle-plus" />
          <span>增加选项</span>
        </div>
        <div class="needs-create-box">
          <div
            v-for="(item, itemIndex) in detail.needs_create_json"
            :key="itemIndex"
            class="needs-create-item"
          >
            <div class="needs-create-item-member">
              <div class="select-label">用户:</div>
              <div class="select-value">
                <el-select
                  v-model="item.user_id"
                  clearable
                  filterable
                  placeholder="请输入关键词"
                >
                  <el-option
                    v-for="member in filterNeedsCreate"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{
                      member.group.group_name
                    }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="needs-create-item-category">
              <div class="select-label">品类:</div>
              <div class="select-value">
                <el-cascader
                  v-model="item.cat_id"
                  :options="categorys"
                  :props="{ multiple: true, emitPath: false }"
                  collapse-tags
                  clearable
                />
              </div>
            </div>
            <div class="item-btn" @click="removeNeedsCreateItem(itemIndex)">
              <i class="el-icon-remove" /><span>删除</span>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-divider class="form-divider" content-position="left" />
      <div class="form-title">审核信息配置</div>
      <el-form-item
        label="需求卡审批（项目组负责人）:"
        prop="needs_verify_json"
      >
        <div class="needs-verify-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.needs_verify_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterNeedsVerify"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="分配供应商（供管）:" prop="assign_supplier_json">
        <div class="assign-supplier-box json-normal-box item-member">
          <el-select
            v-model="detail.assign_supplier_json"
            clearable
            filterable
            multiple
            collapse-tags
            placeholder="请输入关键词"
            :multiple-limit="2"
          >
            <el-option
              v-for="member in filterAssignSupplier"
              :key="member.id"
              :label="member.name"
              :value="member.id"
            >
              <span style="float: left">{{ member.name }}</span>
              <span style="float: right">{{ member.group_name }}</span>
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="物件审核（项目组）:" prop="wj_verify_json">
        <div class="wj-verify-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.wj_verify_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                :disabled="itemIndex === 0"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批系统默认' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterWjVerify"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="拟制订单（供管）:" prop="order_create_json">
        <div class="order-create-box json-normal-box item-member">
          <el-select
            v-model="detail.order_create_json"
            clearable
            filterable
            multiple
            collapse-tags
            placeholder="请输入关键词"
            :multiple-limit="2"
          >
            <el-option
              v-for="member in filterOrderCreate"
              :key="member.id"
              :label="member.name"
              :value="member.id"
            >
              <span style="float: left">{{ member.name }}</span>
              <span style="float: right">{{ member.group_name }}</span>
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="订单审批（供管负责人）:" prop="order_verify_json">
        <div class="order-verify-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.order_verify_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterOrderVerify"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="验收资源（项目组）:" prop="check_json">
        <div class="check-source-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.check_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                :disabled="itemIndex === 0"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批系统默认' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterWjVerify"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item
        label="确认验收资源（项目负责人）:"
        prop="check_confirm_pro_json"
      >
        <div class="check-confirm-pro-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.check_confirm_pro_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterNeedsVerify"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>

      <!-- <el-form-item
        label="确认验收资源（供管）:"
        prop="check_confirm_supplier_json"
      >
        <div class="check-confirm-supplier-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.check_confirm_supplier_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterOrderCreate"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item
        label="确认验收资源（供管负责人）:"
        prop="check_confirm_supplier_charge_json"
      >
        <div class="check-confirm-supplier-charge-box json-normal-box">
          <div
            v-for="(
              item, itemIndex
            ) in detail.check_confirm_supplier_charge_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterOrderVerify"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item> -->

      <el-form-item label="推送结算申请（供管）:" prop="push_settle_json">
        <div class="push-settle-box json-normal-box item-member">
          <el-select
            v-model="detail.push_settle_json"
            clearable
            filterable
            multiple
            collapse-tags
            placeholder="请输入关键词"
            :multiple-limit="2"
          >
            <el-option
              v-for="member in filterOrderCreate"
              :key="member.id"
              :label="member.name"
              :value="member.id"
            >
              <span style="float: left">{{ member.name }}</span>
              <span style="float: right">{{ member.group_name }}</span>
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-divider class="form-divider" content-position="left" />
      <div class="form-title">供应商变更审核配置</div>
      <el-form-item
        label="变更审批（项目组/项目组负责人）:"
        prop="change_verify_json"
      >
        <div class="change-verify-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.change_verify_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                :disabled="itemIndex === 0"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批系统默认' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterWjVerify"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item
        label="变更复审（供管/供管负责人）:"
        prop="change_review_json"
      >
        <div class="change-review-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.change_review_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterOrderCreate.concat(filterOrderVerify)"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-divider class="form-divider" content-position="left" />
      <div class="form-title">验收变更审核配置</div>
      <el-form-item label="验收变更（项目组负责人）:" prop="change_check_json">
        <div class="change-check-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.change_check_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                clearable
                filterable
                :placeholder="
                  itemIndex === 0 ? '一级审批' : '二级审批（非必选）'
                "
              >
                <el-option
                  v-for="member in filterNeedsVerify"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>
      <!--
      <el-form-item label="验收变更审核:" prop="change_check_verify_json">
        <div class="change-check-verify-box json-normal-box">
          <div
            v-for="(item, itemIndex) in detail.change_check_verify_json"
            :key="itemIndex"
            class="item-member"
          >
            <div class="select-value">
              <el-select
                v-model="item.id"
                clearable
                filterable
                :placeholder="itemIndex === 0 ? '一级审批' : '二级审批（非必选）'"
              >
                <el-option
                  v-for="member in allMembers"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <span style="float: left">{{ member.name }}</span>
                  <span style="float: right">{{ member.group_name }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>-->
    </el-form>
    <div class="save-btn">
      <el-button type="primary" @click="updateData()"> 保存 </el-button>
    </div>
  </div>
</template>

<script>
import { fetchDetail, createProcess } from '@/api/project/process'
import { fetchAllProject } from '@/api/project/index'
import { fetchAllDepartment } from '@/api/system/department'
import { fetchAllSub } from '@/api/project/sub'
import { fetchAllCategory } from '@/api/system/category'
import { fetchAllMember } from '@/api/system/member'
import { Loading } from 'element-ui'

export default {
  name: 'Type',
  components: {},
  directives: {},
  filters: {},
  data() {
    // 表单验证函数
    const validateJson = (rule, value, callback) => {
      if (typeof value === 'object' && value[0]) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }

    const validateJsonRepeat = (rule, value, callback) => {
      if (typeof value === 'object' && value[0].id && value[1].id) {
        if (value[0].id === value[1].id) {
          callback(new Error('一二级审批人不能重复'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    const validateJsonObj = (rule, value, callback) => {
      if (typeof value === 'object' && value[0]) {
        if (
          value.every((valueItem) => {
            return valueItem.id <= 0
          })
        ) {
          callback(new Error(rule.message))
        }
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }

    const validateNeedsCreate = (rule, value, callback) => {
      if (typeof value === 'object' && value[0]) {
        // 判断有没有选人
        if (
          value.some((valueItem) => {
            if (valueItem.user_id <= 0) {
              return true
            }
            return false
          })
        ) {
          callback(new Error('请选择人员'))
        }

        // 判断有没有品类
        if (
          value.some((valueItem) => {
            const group_type = this.getMemberGroupType(valueItem.user_id)
            if (
              [1, 3].indexOf(group_type) < 0 &&
              valueItem.cat_id.length === 0
            ) {
              return true
            }
            return false
          })
        ) {
          callback(new Error('请选择品类'))
        }

        if (
          value.some((valueItem) => {
            const group_type = this.getMemberGroupType(valueItem.user_id)
            console.log(valueItem.user_id, '========', group_type)
            if ([1].indexOf(group_type) >= 0) {
              return true
            }
            return false
          })
        ) {
          callback()
        } else {
          callback(new Error('请至少选择一个项目组人员'))
        }
      } else {
        callback(new Error('请选择创建需求卡的人员'))
      }
    }
    return {
      loaded: false,
      detail: {
        process_id: '',
        project_id: '',
        flow_name: '',
        bn: '',
        demand: '',
        budget_dep_id: '',
        soft_code: '',
        brief: '',
        launch_dep_id: '',
        sub_id: '',
        accounting: '',
        account_dep_id: '',
        project_producer: [],
        email_cc: '',
        legal_email: '',
        needs_create_json: [], // 创建需求卡
        needs_verify_json: [{ id: '' }, { id: '' }], // 需求卡审批
        assign_supplier_json: [], // 分配供应商
        wj_verify_json: [{ id: '' }, { id: '' }], // 物件审核
        order_create_json: [], // 拟制订单
        order_verify_json: [{ id: '' }, { id: '' }], // 订单审批
        check_json: [{ id: '' }, { id: '' }], // 验收资源
        check_confirm_pro_json: [{ id: '' }, { id: '' }], // 确认验收资源（项目负责人）
        check_confirm_supplier_json: [{ id: '' }, { id: '' }], // 确认验收资源（供管）
        check_confirm_supplier_charge_json: [{ id: '' }, { id: '' }], // 确认验收资源（供管负责人）
        push_settle_json: [], // 推送申请
        change_verify_json: [{ id: '' }, { id: '' }], // 变更审批
        change_review_json: [{ id: '' }, { id: '' }], // 变更复审
        change_check_json: [{ id: '' }, { id: '' }] // 验收变更
        // change_check_verify_json: [{ id: '' }, { id: '' }] // 验收变更审核
      },
      rules: {
        project_id: [
          { required: true, message: '请选择主项目', trigger: 'change' }
        ],
        flow_name: [
          { required: true, message: '请输入流程名称', trigger: 'blur' }
        ],
        bn: [
          { required: true, message: '请输入流程代码', trigger: 'blur' },
          { pattern: /^[0-9]{6}[A-Za-z]+$/, message: '请输入六位数字加字母' }
        ],
        demand: [
          { required: true, message: '请选择需求方', trigger: 'change' }
        ],
        budget_dep_id: [
          { required: true, message: '请选择预算使用方', trigger: 'change' }
        ],
        soft_code: [
          {
            pattern: /^[A-Z0-9]{1,16}$/,
            message: '请输入大写字母或数字，15字符以内'
          }
        ],
        launch_dep_id: [
          { required: true, message: '请选择发起部门', trigger: 'change' }
        ],
        sub_id: [
          { required: true, message: '请选择合同主体', trigger: 'change' }
        ],
        accounting: [
          {
            pattern: /^[A-Z0-9]{1,16}$/,
            message: '请输入大写字母或数字，15字符以内'
          }
        ],
        account_dep_id: [
          { required: true, message: '请选择核算部门', trigger: 'change' }
        ],
        project_producer: [
          {
            required: true,
            validator: validateJson,
            message: '请选择项目制作人',
            trigger: 'change'
          }
        ],
        legal_email: [
          { required: true, message: '请输入法务收件人', trigger: 'blur' }
        ],
        needs_create_json: [
          {
            required: true,
            validator: validateNeedsCreate,
            trigger: 'change'
          }
        ],
        needs_verify_json: [
          {
            validator: validateJsonRepeat,
            trigger: 'change'
          }
        ],
        assign_supplier_json: [
          {
            required: true,
            validator: validateJson,
            message: '请选择分配供应商人员',
            trigger: 'change'
          }
        ],
        // wj_verify_json: [
        //   {
        //     required: true,
        //     validator: validateJsonObj,
        //     message: '请选择物件审核人员',
        //     trigger: 'change'
        //   }
        // ],
        order_create_json: [
          {
            required: true,
            validator: validateJson,
            message: '请选择拟制订单人员',
            trigger: 'change'
          }
        ],
        order_verify_json: [
          {
            required: true,
            validator: validateJsonObj,
            message: '请选择订单审核人员',
            trigger: 'change'
          },
          {
            validator: validateJsonRepeat,
            trigger: 'change'
          }
        ],
        // check_json: [
        //   {
        //     required: true,
        //     validator: validateJsonObj,
        //     message: '请选择验收资源人员',
        //     trigger: 'change'
        //   }
        // ],
        check_confirm_pro_json: [
          {
            required: true,
            validator: validateJsonObj,
            message: '请选择确认验收资源人员',
            trigger: 'change'
          },
          {
            validator: validateJsonRepeat,
            trigger: 'change'
          }
        ],
        check_confirm_supplier_json: [
          {
            required: true,
            validator: validateJsonObj,
            message: '请选择确认验收资源人员',
            trigger: 'change'
          },
          {
            validator: validateJsonRepeat,
            trigger: 'change'
          }
        ],
        check_confirm_supplier_charge_json: [
          {
            required: true,
            validator: validateJsonObj,
            message: '请选择确认验收资源人员',
            trigger: 'change'
          },
          {
            validator: validateJsonRepeat,
            trigger: 'change'
          }
        ],
        push_settle_json: [
          {
            required: true,
            validator: validateJson,
            message: '请选择推送申请人员',
            trigger: 'change'
          }
        ],
        // change_verify_json: [
        //   {
        //     required: true,
        //     validator: validateJsonObj,
        //     message: '请选择变更审核人员',
        //     trigger: 'change'
        //   }
        // ],
        change_review_json: [
          // {
          //   required: true,
          //   validator: validateJsonObj,
          //   message: '请选择变更复审人员',
          //   trigger: 'change'
          // },
          {
            validator: validateJsonRepeat,
            trigger: 'change'
          }
        ],
        change_check_json: [
          {
            validator: validateJsonRepeat,
            trigger: 'change'
          }
        ]
        // change_check_verify_json: [
        //   {
        //     required: true,
        //     validator: validateJsonObj,
        //     message: '请选择验收变更审核人员',
        //     trigger: 'change'
        //   }
        // ]
      },
      allProjects: [],
      demands: ['研发', '运营', '其它'],
      launchDeps: [],
      accountDeps: [],
      budgetDeps: [],
      filterDeparts: [],
      allSubs: [],
      allMembers: [],
      filterMembers: [],
      categorys: [],
      projectProducerList: [],
      filterProjectProducer: [],
      filterNeedsCreate: [],
      filterNeedsVerify: [],
      filterAssignSupplier: [],
      filterWjVerify: [],
      filterOrderCreate: [],
      filterOrderVerify: [],
      loadingInstance: null
    }
  },
  created() {},
  mounted() {
    const { id } = this.$route.params
    if (id) {
      this.initDetail(id)
    }
  },
  methods: {
    async initDetail(id) {
      this.loadingInstance = Loading.service({
        target: document.querySelector('.dialog-form'),
        fullscreen: true,
        customClass: 'detail-loading',
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      })
      const projectData = await fetchAllProject().catch((error) => {})
      this.allProjects = projectData.data.list
      const categoryData = await fetchAllCategory().catch((error) => {})
      this.categorys = categoryData.data.list.map((first) => {
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
      const departData = await fetchAllDepartment().catch((error) => {})
      departData.data.list.forEach((depart) => {
        if (depart.tag === 0) {
          this.launchDeps.push(depart)
        } else if (depart.tag === 1) {
          this.accountDeps.push(depart)
        } else if (depart.tag === 2) {
          this.budgetDeps.push(depart)
        }
      })

      const memberData = await fetchAllMember().catch((error) => {})
      memberData.data.list.forEach((member) => {
        if (member.group && member.group.type === 5) {
          this.projectProducerList.push(member)
        }
        if (member.group && [1, 3].indexOf(member.group.type) >= 0) {
          this.filterNeedsCreate.push(member)
        }
        if (member.group && member.group.type === 2) {
          this.filterNeedsVerify.push(member)
        }
        if (member.group && [3].indexOf(member.group.type) >= 0) {
          this.filterAssignSupplier.push(member)
        }
        if (member.group && member.group.type === 1) {
          this.filterWjVerify.push(member)
        }
        if (member.group && member.group.type === 3) {
          this.filterOrderCreate.push(member)
        }
        if (member.group && member.group.type === 4) {
          this.filterOrderVerify.push(member)
        }
      })

      const subData = await fetchAllSub().catch((error) => {})
      this.allSubs = subData.data.list

      this.getDetail(id)
    },
    getMemberGroupType(member_id) {
      let group_type = ''
      this.filterNeedsCreate.some((member) => {
        if (member.id === member_id) {
          group_type =
            member.group && member.group.type >= 0 ? member.group.type : ''
          return true
        }
        return false
      })
      return group_type
    },
    fetchMemberList(query, group_id = 0) {
      this.memberLoading = true
      fetchAllMember({ keyword: query, group_id })
        .then((response) => {
          this.memberLoading = false
          this.members = response.data.list
        })
        .catch((error) => {})
    },
    getDetail(id) {
      fetchDetail({ process_id: id })
        .then((response) => {
          this.loadingInstance.close()
          this.loaded = true
          this.detail = Object.assign({}, this.detail, response.data)
          this.$nextTick(() => {})
        })
        .catch((error) => {
          this.loadingInstance.close()
        })
    },
    addNeedsCreateItem() {
      const newItem = { user_id: '', cat_id: [] }
      const oldArray = JSON.parse(
        JSON.stringify(this.detail.needs_create_json)
      )
      oldArray.push(newItem)
      this.detail = Object.assign({}, this.detail, {
        needs_create_json: oldArray
      })
    },
    removeNeedsCreateItem(index) {
      const oldArray = JSON.parse(
        JSON.stringify(this.detail.needs_create_json)
      )
      oldArray.splice(index, 1)
      this.detail = Object.assign({}, this.detail, {
        needs_create_json: oldArray
      })
    },
    producerFilter(val) {
      if (val) {
        this.filterProjectProducer = this.projectProducerList.filter(
          (member) => {
            return member.name.indexOf(val) >= 0
          }
        )
      } else {
        this.filterProjectProducer = this.projectProducerList
      }
    },
    departFilter(val, tag) {
      let filterDeparts = []
      if (tag === 0) {
        filterDeparts = this.launchDeps
      } else if (tag === 1) {
        filterDeparts = this.accountDeps
      } else if (tag === 2) {
        filterDeparts = this.budgetDeps
      }

      if (val) {
        this.filterDeparts = filterDeparts.filter((depart) => {
          return depart.name.indexOf(val) >= 0
        })
      } else {
        this.filterDeparts = filterDeparts
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = JSON.parse(JSON.stringify(this.detail))

          const postTemp = JSON.parse(JSON.stringify(temp))
          postTemp.project_producer = JSON.stringify(temp.project_producer)
          postTemp.needs_create_json = JSON.stringify(temp.needs_create_json)
          postTemp.needs_verify_json = JSON.stringify(
            temp.needs_verify_json.map((item) => {
              return item.id
            })
          )
          postTemp.assign_supplier_json = JSON.stringify(
            temp.assign_supplier_json
          )
          postTemp.wj_verify_json = JSON.stringify(
            temp.wj_verify_json.map((item, itemIndex) => {
              return itemIndex === 0 ? 'default' : item.id
            })
          )
          postTemp.order_create_json = JSON.stringify(temp.order_create_json)
          postTemp.order_verify_json = JSON.stringify(
            temp.order_verify_json.map((item) => {
              return item.id
            })
          )
          postTemp.check_json = JSON.stringify(
            temp.check_json.map((item, itemIndex) => {
              return itemIndex === 0 ? 'default' : item.id
            })
          )
          postTemp.check_confirm_pro_json = JSON.stringify(
            temp.check_confirm_pro_json.map((item) => {
              return item.id
            })
          )
          postTemp.check_confirm_supplier_json = JSON.stringify(
            temp.check_confirm_supplier_json.map((item) => {
              return item.id
            })
          )
          postTemp.check_confirm_supplier_charge_json = JSON.stringify(
            temp.check_confirm_supplier_charge_json.map((item) => {
              return item.id
            })
          )
          postTemp.push_settle_json = JSON.stringify(temp.push_settle_json)
          postTemp.change_verify_json = JSON.stringify(
            temp.change_verify_json.map((item, itemIndex) => {
              return itemIndex === 0 ? 'default' : item.id
            })
          )
          postTemp.change_review_json = JSON.stringify(
            temp.change_review_json.map((item) => {
              return item.id
            })
          )
          postTemp.change_check_json = JSON.stringify(
            temp.change_check_json.map((item) => {
              return item.id
            })
          )
          // postTemp.change_check_verify_json = JSON.stringify(
          //   temp.change_check_verify_json.map((item) => {
          //     return item.id
          //   })
          // )

          createProcess(postTemp)
            .then(() => {
              this.dialogFormVisible = false
              this.$message.success('保存成功')
              setTimeout(() => {
                this.$router.push({ path: '/project/process' })
              }, 1000)
            })
            .catch((error) => {})
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
  .dialog-form {
    .dialog-form-item {
      width: 400px;
    }
    .form-divider {
      margin-top: 40px;
    }
    .form-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 40px;
    }
    .needs-create-add,
    .item-btn {
      @extend %flex-center;
      justify-content: flex-start;
      font-size: 15px;
      span {
        margin-left: 5px;
      }
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
    .needs-create-add {
      width: 100px;
    }
    .needs-create-box {
      margin: 10px 140px 0 0;
      .needs-create-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .needs-create-item-member,
        .needs-create-item-category {
          @extend %flex-center;
          .select-value {
            margin-left: 10px;
          }
          justify-content: flex-start;
          .select-label {
            flex: none;
          }
          .select-value {
            flex: auto;
            .el-cascader,
            .el-select {
              width: 100%;
            }
          }
        }
        .needs-create-item-member {
          flex: none;
          width: 300px;
        }
        .needs-create-item-category {
          flex: auto;
          margin-left: 20px;
        }
        .item-btn {
          flex: none;
          margin-left: 20px;
        }
        &:not(:last-child) {
          margin-bottom: 20px;
        }
      }
    }
    .json-normal-box {
      margin: 0 150px 0 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .item-member {
        @extend %flex-center;
        .select-value {
          // margin-left: 10px;
        }
        &:last-child {
          margin-left: 20px;
        }
      }
    }
    .item-member {
      .el-select {
        width: 300px;
      }
    }
  }
  .save-btn {
    position: fixed;
    bottom: 10px;
    right: 50px;
  }

  .dialog-form ::v-deep .detail-loading {
    .el-loading-spinner {
      top: 300px;
    }
  }
}
</style>
