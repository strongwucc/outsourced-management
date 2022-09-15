<template>
  <div class="navbar">
    <div class="left-box">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />

      <breadcrumb class="breadcrumb-container" />
      <div v-if="isPending" class="search-box">
        <el-popover v-model="searchVisible" width="300">
          <div class="hidden-info">
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
              v-model="listQuery.category_name"
              placeholder="输入需求品类"
              style="width: 200px; margin-bottom: 20px"
              class="filter-item"
              size="mini"
            />
            <el-select
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

            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="navSearch"
            >
              搜索
            </el-button>
          </div>
          <div slot="reference">
            <el-input
              v-model="keyword"
              placeholder="请输入搜索内容"
              style="width: 300px"
              class="show-input"
              size="mini"
              :disabled="true"
            />
          </div>
        </el-popover>
        <el-button
          class="show-btn"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click.stop="searchVisible = !searchVisible"
        >
          搜索
        </el-button>
      </div>
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
      keyword: '',
      searchVisible: false,
      listQuery: {
        name: '',
        demand_id: '',
        category_name: '',
        tag: ''
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    navSearch() {
      this.$bus.$emit('navSearch', this.listQuery)
      this.searchVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .search-box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 190px;
      .show-btn {
        margin-left: 10px;
      }
    }
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
  .right-menu {
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
