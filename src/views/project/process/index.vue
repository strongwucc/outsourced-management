<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-left">
        <el-input
          v-model="listQuery.project_name"
          placeholder="项目名称"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.flow_name"
          placeholder="流程名称"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.bn"
          placeholder="流程代码"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.demand"
          placeholder="需求方"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.budget_dep_name"
          placeholder="预算使用部门"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.launch_dep_name"
          placeholder="发起部门"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.sub_name"
          placeholder="合同主体"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.account_dep_name"
          placeholder="核算部门"
          class="filter-item"
          size="mini"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-btn"
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
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >
          创建流程
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="list-container"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>

      <el-table-column label="主项目" align="center">
        <template slot-scope="{ row }">
          {{ row.project_name }}
        </template>
      </el-table-column>

      <el-table-column label="流程名称" align="center">
        <template slot-scope="{ row }">
          {{ row.flow_name }}
        </template>
      </el-table-column>

      <el-table-column label="流程代码" align="center">
        <template slot-scope="{ row }">
          {{ row.bn }}
        </template>
      </el-table-column>

      <el-table-column label="需求方" align="center">
        <template slot-scope="{ row }">
          {{ row.demand }}
        </template>
      </el-table-column>

      <el-table-column label="预算使用方" align="center">
        <template slot-scope="{ row }">
          {{ row.budget_dep_name }}
        </template>
      </el-table-column>

      <el-table-column label="发起部门" align="center">
        <template slot-scope="{ row }">
          {{ row.launch_dep_name }}
        </template>
      </el-table-column>

      <el-table-column label="合同主体" align="center">
        <template slot-scope="{ row }">
          {{ row.sub_name }}
        </template>
      </el-table-column>

      <el-table-column label="核算部门" align="center">
        <template slot-scope="{ row }">
          {{ row.account_dep_name }}
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          {{ row.created_at }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleDetail(row)"
          >
            查看
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
      width="70vw"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="250px"
        class="dialog-form"
        style="margin-left: 30px"
      >
        <el-form-item label="主项目:" prop="project_id">
          <el-select
            v-model="temp.project_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="fetchProjectList"
            :loading="projectLoading"
            class="dialog-form-item"
            @focus="fetchProjectList('')"
          >
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.project_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程名称:" prop="flow_name">
          <el-input v-model="temp.flow_name" class="dialog-form-item" />
        </el-form-item>
        <el-form-item label="流程代码:" prop="bn">
          <el-input
            v-model="temp.bn"
            class="dialog-form-item"
            placeholder="六位数字加字母"
          />
        </el-form-item>
        <el-form-item label="需求方:" prop="demand">
          <el-select
            v-model="temp.demand"
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
            v-model="temp.budget_dep_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="(query) => fetchDepartList(query, 2)"
            :loading="departLoading"
            class="dialog-form-item"
            @focus="fetchDepartList('', 2)"
          >
            <el-option
              v-for="item in departs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目管理软件索引码:" prop="soft_code">
          <el-input
            v-model="temp.soft_code"
            class="dialog-form-item"
            placeholder="大写字母或数字，15字符以内"
          />
        </el-form-item>
        <el-form-item label="项目简介:" prop="brief">
          <el-input
            v-model="temp.brief"
            type="textarea"
            class="dialog-form-item"
            placeholder="输入项目简介"
          />
        </el-form-item>
        <el-form-item label="发起部门:" prop="launch_dep_id">
          <el-select
            v-model="temp.launch_dep_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="(query) => fetchDepartList(query, 0)"
            :loading="departLoading"
            class="dialog-form-item"
            @focus="fetchDepartList('', 0)"
          >
            <el-option
              v-for="item in departs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同主体:" prop="sub_id">
          <el-select
            v-model="temp.sub_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="(query) => fetchSubList(query)"
            :loading="subLoading"
            class="dialog-form-item"
            @focus="fetchSubList('')"
          >
            <el-option
              v-for="item in subs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="核算方:" prop="accounting">
          <el-input
            v-model="temp.accounting"
            class="dialog-form-item"
            placeholder="大写字母或数字，15字符以内"
          />
        </el-form-item>
        <el-form-item label="核算部门:" prop="account_dep_id">
          <el-select
            v-model="temp.account_dep_id"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="(query) => fetchDepartList(query, 1)"
            :loading="departLoading"
            class="dialog-form-item"
            @focus="fetchDepartList('', 1)"
          >
            <el-option
              v-for="item in departs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目制作人:" prop="project_producer_json">
          <el-select
            v-model="temp.project_producer_json"
            multiple
            filterable
            remote
            :remote-method="(query) => fetchMemberList(query, 5)"
            :loading="memberLoading"
            class="dialog-form-item"
            @focus="fetchMemberList('', 5)"
          >
            <el-option
              v-for="member in members"
              :key="member.id"
              :label="member.name"
              :value="member.id"
            >
              <span style="float: left">{{ member.name }}</span>
              <span style="float: right">{{ member.mobile }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-divider class="form-divider" content-position="left" />
        <div class="form-title">审核信息配置</div>
        <el-form-item label="创建需求卡:" prop="needs_create_json">
          <div class="needs-create-add" @click="addNeedsCreateItem">
            <i class="el-icon-circle-plus" />
            <span>增加选项</span>
          </div>
          <div class="needs-create-box">
            <div
              v-for="(item, itemIndex) in temp.needs_create_json"
              :key="itemIndex"
              class="needs-create-item"
            >
              <div class="item-member">
                <div class="select-label">用户:</div>
                <div class="select-value">
                  <el-select
                    v-model="item.user_id"
                    clearable
                    filterable
                    remote
                    placeholder="请输入关键词"
                    :remote-method="(query) => fetchMemberList(query)"
                    :loading="memberLoading"
                    @focus="fetchMemberList('')"
                  >
                    <el-option
                      v-for="member in members"
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
              <div class="item-category">
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
        <el-form-item label="需求卡审批:" prop="needs_verify_json">
          <div class="needs-verify-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.needs_verify_json"
              :key="itemIndex"
              class="item-member"
            >
              <!-- <div v-if="itemIndex === 0" class="select-label">一级审批:</div>
              <div v-if="itemIndex === 1" class="select-label">二级审批:</div> -->
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  clearable
                  filterable
                  remote
                  :placeholder="itemIndex === 0 ? '一级审批' : '二级审批'"
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="分配供应商:" prop="assign_supplier_json">
          <div class="assign-supplier-box json-normal-box">
            <el-select
              v-model="temp.assign_supplier_json"
              clearable
              filterable
              remote
              multiple
              placeholder="请输入关键词"
              :remote-method="(query) => fetchMemberList(query)"
              :loading="memberLoading"
              :multiple-limit="2"
              @focus="fetchMemberList('')"
            >
              <el-option
                v-for="member in members"
                :key="member.id"
                :label="member.name"
                :value="member.id"
              >
                <span style="float: left">{{ member.name }}</span>
                <span style="float: right">{{ member.mobile }}</span>
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="物件审核:" prop="wj_verify_json">
          <div class="wj-verify-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.wj_verify_json"
              :key="itemIndex"
              class="item-member"
            >
              <!-- <div v-if="itemIndex === 0" class="select-label">一级审批:</div>
              <div v-if="itemIndex === 1" class="select-label">二级审批:</div> -->
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  :disabled="itemIndex === 0"
                  clearable
                  filterable
                  remote
                  :placeholder="
                    itemIndex === 0 ? '一级审批系统默认' : '二级审批'
                  "
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="拟制订单:" prop="order_create_json">
          <div class="order-create-box json-normal-box">
            <el-select
              v-model="temp.order_create_json"
              clearable
              filterable
              remote
              multiple
              placeholder="请输入关键词"
              :remote-method="(query) => fetchMemberList(query)"
              :loading="memberLoading"
              :multiple-limit="2"
              @focus="fetchMemberList('')"
            >
              <el-option
                v-for="member in members"
                :key="member.id"
                :label="member.name"
                :value="member.id"
              >
                <span style="float: left">{{ member.name }}</span>
                <span style="float: right">{{ member.mobile }}</span>
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="订单审批:" prop="order_verify_json">
          <div class="order-verify-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.order_verify_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  clearable
                  filterable
                  remote
                  :placeholder="itemIndex === 0 ? '一级审批' : '二级审批'"
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="验收资源:" prop="check_json">
          <div class="check-source-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.order_verify_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  :disabled="itemIndex === 0"
                  clearable
                  filterable
                  remote
                  :placeholder="
                    itemIndex === 0 ? '一级审批系统默认' : '二级审批'
                  "
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
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
              v-for="(item, itemIndex) in temp.check_confirm_pro_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  clearable
                  filterable
                  remote
                  :placeholder="itemIndex === 0 ? '一级审批' : '二级审批'"
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="确认验收资源（供管）:"
          prop="check_confirm_supplier_json"
        >
          <div class="check-confirm-supplier-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.check_confirm_supplier_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  clearable
                  filterable
                  remote
                  :placeholder="itemIndex === 0 ? '一级审批' : '二级审批'"
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
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
              ) in temp.check_confirm_supplier_charge_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  clearable
                  filterable
                  remote
                  :placeholder="itemIndex === 0 ? '一级审批' : '二级审批'"
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="推送结算申请:" prop="push_settle_json">
          <div class="push-settle-box json-normal-box">
            <el-select
              v-model="temp.push_settle_json"
              clearable
              filterable
              remote
              multiple
              placeholder="请输入关键词"
              :remote-method="(query) => fetchMemberList(query)"
              :loading="memberLoading"
              :multiple-limit="2"
              @focus="fetchMemberList('')"
            >
              <el-option
                v-for="member in members"
                :key="member.id"
                :label="member.name"
                :value="member.id"
              >
                <span style="float: left">{{ member.name }}</span>
                <span style="float: right">{{ member.mobile }}</span>
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-divider class="form-divider" content-position="left" />
        <div class="form-title">供应商变更审核配置</div>
        <el-form-item label="变更审批:" prop="change_verify_json">
          <div class="change-verify-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.change_verify_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  :disabled="itemIndex === 0"
                  clearable
                  filterable
                  remote
                  :placeholder="
                    itemIndex === 0 ? '一级审批系统默认' : '二级审批'
                  "
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="变更复审:" prop="change_review_json">
          <div class="change-review-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.change_review_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  clearable
                  filterable
                  remote
                  :placeholder="itemIndex === 0 ? '一级审批' : '二级审批'"
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-divider class="form-divider" content-position="left" />
        <div class="form-title">验收变更审核配置</div>
        <el-form-item label="验收变更:" prop="change_check_json">
          <div class="change-check-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.change_check_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  clearable
                  filterable
                  remote
                  :placeholder="itemIndex === 0 ? '一级审批' : '二级审批'"
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="验收变更审核:" prop="change_check_verify_json">
          <div class="change-check-verify-box json-normal-box">
            <div
              v-for="(item, itemIndex) in temp.change_check_verify_json"
              :key="itemIndex"
              class="item-member"
            >
              <div class="select-value">
                <el-select
                  v-model="item.id"
                  clearable
                  filterable
                  remote
                  :placeholder="itemIndex === 0 ? '一级审批' : '二级审批'"
                  :remote-method="(query) => fetchMemberList(query)"
                  :loading="memberLoading"
                  @focus="fetchMemberList('')"
                >
                  <el-option
                    v-for="member in members"
                    :key="member.id"
                    :label="member.name"
                    :value="member.id"
                  >
                    <span style="float: left">{{ member.name }}</span>
                    <span style="float: right">{{ member.mobile }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="createData()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createProcess } from '@/api/project/process'
import { fetchAllProject } from '@/api/project/index'
import { fetchAllDepartment } from '@/api/system/department'
import { fetchAllSub } from '@/api/project/sub'
import { fetchAllCategory } from '@/api/system/category'
import { fetchAllMember } from '@/api/system/member'
import { parseTime } from '@/utils/index'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Type',
  components: { Pagination },
  directives: { waves },
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
            const group_id = this.getMemberGroupId(valueItem.user_id)
            if ([3, 4].indexOf(group_id) < 0 && valueItem.cat_id.length === 0) {
              return true
            }
            return false
          })
        ) {
          callback(new Error('请选择品类'))
        }

        if (
          value.some((valueItem) => {
            const group_id = this.getMemberGroupId(valueItem.user_id)
            console.log('=========', group_id)
            if ([1, 2].indexOf(group_id) >= 0) {
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
      tag: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        project_name: '',
        flow_name: '',
        bn: '',
        demand: '',
        budget_dep_name: '',
        launch_dep_name: '',
        sub_name: '',
        account_dep_name: '',
        page: 1,
        page_num: 10,
        sort: '+id'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
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
        project_producer_json: [],
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
        change_check_json: [{ id: '' }, { id: '' }], // 验收变更
        change_check_verify_json: [{ id: '' }, { id: '' }] // 验收变更审核
      },
      textMap: {
        update: '修改流程',
        create: '创建流程'
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
        project_producer_json: [
          {
            required: true,
            validator: validateJson,
            message: '请选择项目制作人',
            trigger: 'change'
          }
        ],
        needs_create_json: [
          {
            required: true,
            validator: validateNeedsCreate,
            trigger: 'change'
          }
        ],
        // needs_verify_json: [
        //   {
        //     required: true,
        //     validator: validateJsonObj,
        //     message: '请选择需求卡审批人员',
        //     trigger: 'change'
        //   }
        // ],
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
          }
        ],
        check_confirm_supplier_json: [
          {
            required: true,
            validator: validateJsonObj,
            message: '请选择确认验收资源人员',
            trigger: 'change'
          }
        ],
        check_confirm_supplier_charge_json: [
          {
            required: true,
            validator: validateJsonObj,
            message: '请选择确认验收资源人员',
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
          {
            required: true,
            validator: validateJsonObj,
            message: '请选择变更复审人员',
            trigger: 'change'
          }
        ]
        // change_check_json: [
        //   {
        //     required: true,
        //     validator: validateJsonObj,
        //     message: '请选择验收变更人员',
        //     trigger: 'change'
        //   }
        // ],
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
      projects: [],
      projectLoading: false,
      demands: ['研发', '运营', '其它'],
      allDeparts: [],
      departs: [],
      departLoading: false,
      allSubs: [],
      subs: [],
      subLoading: false,
      allMembers: [],
      members: [],
      memberLoading: false,
      categorys: []
    }
  },
  computed: {},
  created() {
    this.getCategory()
    this.getAllDepart()
    this.getAllMember()
    this.getList()
  },
  methods: {
    getMemberGroupId(member_id) {
      let group_id = 0
      this.allMembers.some((member) => {
        if (member.id === member_id) {
          group_id = member.group_id
          return true
        }
        return false
      })
      return group_id
    },
    getCategory() {
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
    getAllDepart() {
      fetchAllDepartment().then((response) => {
        this.allDeparts = response.data.items
      })
    },
    getAllMember() {
      fetchAllMember().then((response) => {
        this.allMembers = response.data.items
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items
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
        project_producer_json: [],
        needs_create_json: [],
        needs_verify_json: [{ id: '' }, { id: '' }],
        assign_supplier_json: [],
        wj_verify_json: [{ id: '' }, { id: '' }],
        order_create_json: [],
        order_verify_json: [{ id: '' }, { id: '' }],
        check_json: [{ id: '' }, { id: '' }],
        check_confirm_pro_json: [{ id: '' }, { id: '' }],
        check_confirm_supplier_json: [{ id: '' }, { id: '' }],
        check_confirm_supplier_charge_json: [{ id: '' }, { id: '' }],
        push_settle_json: [],
        change_verify_json: [{ id: '' }, { id: '' }],
        change_review_json: [{ id: '' }, { id: '' }],
        change_check_json: [{ id: '' }, { id: '' }],
        change_check_verify_json: [{ id: '' }, { id: '' }]
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
          const temp = JSON.parse(JSON.stringify(this.temp))
          temp.id = parseInt(Math.random() * 100) + 1024

          const postTemp = JSON.parse(JSON.stringify(temp))
          postTemp.project_producer_json = JSON.stringify(
            temp.project_producer_json
          )
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
            temp.wj_verify_json.map((item) => {
              return item.id
            })
          )
          postTemp.order_create_json = JSON.stringify(temp.order_create_json)
          postTemp.order_verify_json = JSON.stringify(
            temp.order_verify_json.map((item) => {
              return item.id
            })
          )
          postTemp.check_json = JSON.stringify(
            temp.check_json.map((item) => {
              return item.id
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
            temp.change_verify_json.map((item) => {
              return item.id
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
          postTemp.change_check_verify_json = JSON.stringify(
            temp.change_check_verify_json.map((item) => {
              return item.id
            })
          )

          createProcess(postTemp).then(() => {
            // 获取关联字段名称
            this.allProjects.some((project) => {
              if (project.id === temp.project_id) {
                temp.project_name = project.project_name
                return true
              }
              return false
            })

            this.allDeparts.forEach((dep) => {
              if (dep.id === temp.budget_dep_id) {
                temp.budget_dep_name = dep.name
              }
              if (dep.id === temp.launch_dep_id) {
                temp.launch_dep_name = dep.name
              }
              if (dep.id === temp.account_dep_id) {
                temp.account_dep_name = dep.name
              }
            })

            this.allSubs.some((sub) => {
              if (sub.id === temp.sub_id) {
                temp.sub_name = sub.name
                return true
              }
              return false
            })

            temp.created_at = parseTime(new Date())

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
      this.$router.push(`/project/process/detail/${row.id}`)
    },
    fetchProjectList(query) {
      this.projectLoading = true
      fetchAllProject({ project_name: query }).then((response) => {
        this.projectLoading = false
        this.projects = response.data.items
        if (query === '' && this.allProjects.length === 0) {
          this.allProjects = response.data.items
        }
      })
    },
    fetchDepartList(query, tag = 0) {
      this.departLoading = true
      fetchAllDepartment({ name: query, tag }).then((response) => {
        this.departLoading = false
        this.departs = response.data.items
      })
    },
    fetchSubList(query) {
      this.subLoading = true
      fetchAllSub({ name: query }).then((response) => {
        this.subLoading = false
        this.subs = response.data.items
        if (query === '' && this.allSubs.length === 0) {
          this.allSubs = response.data.items
        }
      })
    },
    fetchMemberList(query, group_id = 0) {
      this.memberLoading = true
      fetchAllMember({ keyword: query, group_id }).then((response) => {
        this.memberLoading = false
        this.members = response.data.items
      })
    },
    addNeedsCreateItem() {
      const newItem = { user_id: '', cat_id: [] }
      const oldArray = JSON.parse(JSON.stringify(this.temp.needs_create_json))
      oldArray.push(newItem)
      this.temp = Object.assign({}, this.temp, { needs_create_json: oldArray })
    },
    removeNeedsCreateItem(index) {
      const oldArray = JSON.parse(JSON.stringify(this.temp.needs_create_json))
      oldArray.splice(index, 1)
      this.temp = Object.assign({}, this.temp, { needs_create_json: oldArray })
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
    margin-bottom: 10px;
    @extend %flex-space-between;
    .filter-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .filter-item {
        width: 15%;
        margin: 0 10px 10px 0;
      }
      .filter-btn {
        margin: 0 10px 10px 0;
      }
    }
  }
  .list-container {
  }
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
        .item-member,
        .item-category {
          @extend %flex-center;
          .select-value {
            margin-left: 10px;
          }
        }
        .item-member {
          flex: none;
        }
        .item-category {
          flex: auto;
          margin-left: 20px;
          justify-content: flex-start;
          .select-label {
            flex: none;
          }
          .select-value {
            flex: auto;
            .el-cascader {
              width: 100%;
            }
          }
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
  }
}
</style>
