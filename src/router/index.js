import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/project/index',
    name: '项目管理',
    meta: { title: '项目管理', icon: 'el-icon-folder' },
    children: [
      {
        path: 'project/index',
        name: '项目列表',
        component: () => import('@/views/project/index'),
        meta: { title: '项目列表' }
      },
      {
        path: 'project/process',
        name: '流程列表',
        component: () => import('@/views/project/process/index'),
        meta: { title: '流程列表' }
      },
      {
        path: 'project/process/detail/:id(\\d+)',
        component: () => import('@/views/project/process/detail'),
        name: '流程详情',
        meta: {
          title: '流程详情',
          noCache: true,
          activeMenu: '/project/process'
        },
        hidden: true
      },
      {
        path: 'project/subject',
        name: '项目主体管理',
        component: () => import('@/views/project/subject'),
        meta: { title: '项目主体' }
      }
    ]
  },

  {
    path: '/demand',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: '需求管理',
    meta: { title: '需求管理', icon: 'el-icon-s-opportunity' },
    children: [
      {
        path: 'index',
        name: '需求列表',
        component: () => import('@/views/demand/index'),
        meta: { title: '需求列表' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: '订单管理',
    meta: { title: '订单管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: '订单列表',
        meta: { title: '订单列表' }
      },
      {
        path: 'modify',
        component: () => import('@/views/order/modify'),
        name: '申请变更单',
        meta: { title: '申请变更单' }
      },
      {
        path: 'check',
        component: () => import('@/views/order/check'),
        name: '验收单',
        meta: { title: '验收单' }
      },
      {
        path: 'reconcile',
        component: () => import('@/views/order/reconcile'),
        name: '对账单',
        meta: { title: '对账单' }
      }
    ]
  },

  {
    path: '/acceptance',
    component: Layout,
    redirect: 'noRedirect',
    name: '验收对账管理',
    meta: { title: '验收对账管理', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/acceptance/index'),
        name: '验收单列表',
        meta: { title: '验收单列表' }
      },
      {
        path: 'alteration',
        component: () => import('@/views/acceptance/alteration'),
        name: '变更申请单',
        meta: { title: '变更申请单' }
      },
      {
        path: 'statement',
        component: () => import('@/views/acceptance/statement'),
        name: '对账单',
        meta: { title: '对账单' }
      }
    ]
  },

  {
    path: '/provider',
    component: Layout,
    redirect: 'noRedirect',
    name: '供应商管理',
    meta: { title: '供应商管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'index',
        name: '供应商列表',
        component: () => import('@/views/provider/index'),
        meta: { title: '供应商列表' }
      },
      {
        path: 'contract',
        name: '供应商合同管理',
        component: () => import('@/views/provider/contract'),
        meta: { title: '供应商合同' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: '系统配置',
    meta: { title: '系统配置', icon: 'el-icon-setting' },
    children: [
      {
        path: 'category',
        name: '需求品类',
        component: () => import('@/views/system/category'),
        meta: { title: '需求品类' }
      },
      {
        path: 'department/initiate',
        name: '发起部门配置',
        component: () => import('@/views/system/department'),
        meta: { title: '发起部门配置' }
      },
      {
        path: 'department/accounting',
        name: '核算部门配置',
        component: () => import('@/views/system/department'),
        meta: { title: '核算部门配置' }
      },
      {
        path: 'department/use',
        name: '预算使用部门配置',
        component: () => import('@/views/system/department'),
        meta: { title: '预算使用部门配置' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理' }
      },
      {
        path: 'member',
        name: '成员管理',
        component: () => import('@/views/system/member'),
        meta: { title: '成员管理' }
      },
      {
        path: 'email',
        name: '合同过期提醒',
        component: () => import('@/views/system/email'),
        meta: { title: '合同过期提醒' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
