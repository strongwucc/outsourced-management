<template>
  <div class="navbar">
    <div class="left-box" :style="{ width: listWidth }">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb class="breadcrumb-container" />
    </div>

    <div v-if="isPending" class="search-box">
      <el-popover v-model="searchVisible" trigger="manual" width="300">
        <div class="hidden-info">
          <el-input
            v-model="listQuery.project_name"
            placeholder="输入项目名称"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />
          <el-input
            v-model="listQuery.name"
            placeholder="输入需求名称"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />
          <el-input
            v-model="listQuery.demand_id"
            placeholder="输入需求单号"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />
          <el-input
            v-if="[1].indexOf(queryType) >= 0"
            v-model="listQuery.category_name"
            placeholder="输入需求品类"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />
          <el-select
            v-if="[1].indexOf(queryType) >= 0"
            v-model="listQuery.tag"
            placeholder="需求属性"
            clearable
            class="filter-item"
            style="width: 200px; margin-bottom: 20px"
            size="mini"
          >
            <el-option
              v-for="item in tagList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-input
            v-if="[2, 3, 4, 5].indexOf(queryType) >= 0"
            v-model="listQuery.supplier_name"
            placeholder="输入供应商名称"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />
          <el-input
            v-if="[2].indexOf(queryType) >= 0"
            v-model="listQuery.order_id"
            placeholder="输入订单号"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />
          <el-input
            v-if="[3].indexOf(queryType) >= 0"
            v-model="listQuery.change_id"
            placeholder="输入变更单号"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />
          <el-input
            v-if="[4].indexOf(queryType) >= 0"
            v-model="listQuery.receipt_id"
            placeholder="输入验收单号"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />
          <el-input
            v-if="[5].indexOf(queryType) >= 0"
            v-model="listQuery.statement_id"
            placeholder="输入结算单号"
            style="width: 200px; margin-bottom: 20px"
            class="filter-item"
            size="mini"
          />

          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="navSearch(true)"
          >
            搜索
          </el-button>
        </div>
        <div slot="reference">
          <el-input
            v-model="listQuery.keyword"
            placeholder="请输入搜索内容"
            style="width: 300px"
            class="show-input"
            size="mini"
          >
            <el-button
              slot="append"
              icon="el-icon-s-unfold"
              style="font-size: 16px; color: #000000"
              @click.stop="searchMore"
            />
          </el-input>
        </div>
      </el-popover>
      <el-button
        class="show-btn"
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click.stop="navSearch(false)"
      >
        搜索
      </el-button>
    </div>

    <div class="right-menu">
      <!-- <div class="avatar-box"> -->
      <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
      <!-- <img src="@/icons/logo.jpg" class="user-avatar"> -->
      <!-- </div> -->
      <el-dropdown class="wrapper-container" trigger="click">
        <div class="name-box">
          <span>{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="handleEditPass">
            <span style="display: block">密码修改</span>
          </el-dropdown-item>
          <el-dropdown-item v-permission="[0]" @click.native="handleEditUserInfo">
            <span style="display: block">账户设置</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
    >
      <el-form
        ref="dataForm"
        class="dialog-form"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left: 50px"
      >
        <template v-if="dialogStatus === 'password'">
          <el-form-item label="原密码:" prop="password">
            <el-input v-model="temp.password" class="dialog-form-item" show-password />
          </el-form-item>
          <el-form-item label="新密码:" prop="new_pass">
            <el-input v-model="temp.new_pass" class="dialog-form-item" show-password />
          </el-form-item>
          <el-form-item label="确认新密码:" prop="confirm_pass">
            <el-input v-model="temp.confirm_pass" class="dialog-form-item" show-password />
          </el-form-item>
        </template>
        <template v-if="dialogStatus === 'userinfo'">
          <el-form-item label="抄送邮件:" prop="mail_cc">
            <el-input v-model="temp.mail_cc" class="dialog-form-item" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="confirmUpdateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { updateSelfData } from '@/api/system/member'
import { queryInfoByUserId as fetchProviderInfo } from '@/api/provider/index'

export default {
  directives: { permission },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name']),
    isPending() {
      return this.$route.path.startsWith('/pending')
    },
    queryType() {
      const path = this.$route.path
      if (
        [
          '/pending/gys/demand/quote',
          '/pending/xmz/demand/draft',
          '/pending/xmz/demand/review',
          '/pending/xmzfzr/demand/check',
          '/pending/xmzfzr/demand/review',
          '/pending/gg/demand/draft',
          '/pending/gg/assign/vendor',
          '/pending/gg/order/prepare',
          '/pending/ggfzr/order/approval'
        ].indexOf(path) >= 0
      ) {
        return 1
      }

      if (
        [
          '/pending/gys/order/deliver'
        ].indexOf(path) >= 0
      ) {
        return 2
      }

      if (
        [
          '/pending/ggfzr/modify/approval',
          '/pending/gys/order/modify',
          '/pending/xmz/order/modify',
          '/pending/gg/order/modify'
        ].indexOf(path) >= 0
      ) {
        return 3
      }

      if (
        [
          '/pending/gys/order/check',
          '/pending/xmz/accept/confirm',
          '/pending/xmzfzr/accept/confirm'
        ].indexOf(path) >= 0
      ) {
        return 4
      }

      if (
        [
          '/pending/gys/order/reconcile',
          '/pending/gg/reconcile/confirm'
        ].indexOf(path) >= 0
      ) {
        return 5
      }

      return 0
    },
    rules() {
      if (this.dialogStatus === 'password') {
        return {
          password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
          new_pass: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
          confirm_pass: [{ required: true, message: '请确认新密码', trigger: 'blur' }]
        }
      } else if (this.dialogStatus === 'userinfo') {
        return {
          mail_cc: [{ required: true, message: '请输入抄送邮件', trigger: 'blur' }]
        }
      }
      return {}
    }
  },
  data() {
    return {
      tagList: [
        { id: 0, name: '正式包' },
        { id: 1, name: '测试包' },
        { id: 2, name: '外派' },
        { id: 3, name: '动态团队' }
      ],
      searchVisible: false,
      listQuery: {
        keyword: '',
        project_name: '',
        name: '',
        demand_id: '',
        category_name: '',
        tag: '',
        supplier_name: '',
        order_id: '',
        change_id: '',
        receipt_id: '',
        statement_id: ''
      },
      listWidth: '350px',
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        password: '',
        new_pass: '',
        confirm_pass: '',
        mail_cc: ''
      },
      textMap: {
        password: '密码修改',
        userinfo: '账户设置'
      }
    }
  },
  mounted() {
    this.$bus.$on('leftListResize', (listWidth) => {
      this.listWidth = `${listWidth}px`
    })
    this.$bus.$on('appMainChange', () => {
      this.searchVisible = false
      this.resetQuery()
    })
  },
  methods: {
    resetQuery() {
      Object.keys(this.listQuery).forEach((key) => {
        this.$set(this.listQuery, key, '')
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    navSearch(multi) {
      if (multi) {
        this.listQuery = Object.assign({}, this.listQuery, { keyword: '' })
      } else {
        this.listQuery = Object.assign({}, this.listQuery, {
          name: '',
          demand_id: '',
          category_name: '',
          tag: ''
        })
      }
      this.$bus.$emit('navSearch', this.listQuery)
      this.searchVisible = false
    },
    searchMore() {
      this.searchVisible = !this.searchVisible
    },
    handleEditPass() {
      this.dialogStatus = 'password'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleEditUserInfo() {
      const providerData = await fetchProviderInfo().catch(_error => {})
      this.temp = Object.assign({}, this.temp, { mail_cc: providerData.data.mail_cc })

      this.dialogStatus = 'userinfo'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    confirmUpdateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let temp
          if (this.dialogStatus === 'password') {
            temp = { password: this.temp.password, new_pass: this.temp.new_pass }
          } else if (this.dialogStatus === 'userinfo') {
            temp = { mail_cc: this.temp.mail_cc }
          }
          updateSelfData(temp)
            .then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch((_error) => {})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 61px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  .left-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: none;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
  }
  .search-box {
    flex: auto;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    background: #ffffff;
    .show-btn {
      margin-left: 10px;
    }
  }
  .right-menu {
    flex: none;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 15px;
    &:focus {
      outline: none;
    }

    .avatar-box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      .user-avatar {
        cursor: pointer;
        // width: 22px;
        height: 22px;
        border-radius: 10px;
      }
    }

    .wrapper-container {
      .name-box {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
