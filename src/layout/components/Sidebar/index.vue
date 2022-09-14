<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div v-permission="[1, 3]" class="new-demand-box">
      <el-button
        type="primary"
        icon="el-icon-edit-outline"
        @click="handleCreateDemand"
      >发布需求</el-button>
    </div>
    <div v-permission="[0, 2, 4, 5, 'administrator']" class="for-padding" style="height: 25px" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :default-openeds="openeds"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { SidebarItem, Logo },
  directives: { permission },
  data() {
    return {
      openeds: ['/project', '/demand', '/order', '/provider', '/system'],
      emitPath: ['/pending/xmz/demand/draft', '/pending/gg/demand/draft']
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      // return this.$router.options.routes
      return this.$store.getters.permission_routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    /**
     * 触发创建需求
     */
    handleCreateDemand() {
      if (this.emitPath.indexOf(this.$route.path) >= 0) {
        this.$bus.$emit('createDemandEvent')
      } else {
        if (this.$store.getters.roles.indexOf(1) >= 0) {
          this.$router.push(`/pending/xmz/demand/draft?createDemand=true`)
        } else if (this.$store.getters.roles.indexOf(3) >= 0) {
          this.$router.push(`/pending/gg/demand/draft?createDemand=true`)
        }
      }
    }
  }
}
</script>
