<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="new-demand-box">
      <el-button v-permission="[1, 3]" type="primary" icon="el-icon-plus" @click="handleCreateDemand">发布需求</el-button>
    </div>
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
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
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
      openeds: ['/project', '/demand', '/order', '/provider', '/system']
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
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
      this.$bus.$emit('createDemandEvent')
    }
  }
}
</script>
