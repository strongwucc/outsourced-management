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
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
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
      listWidth: '350px'
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
