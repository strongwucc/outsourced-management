const Mock = require('mockjs')

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

const SubList = []
const SubCount = 20

for (let i = 0; i < SubCount; i++) {
  SubList.push(
    Mock.mock({
      id: '@increment',
      name: '主体名称@id',
      bn: '@id'
    })
  )
}

const ProjectList = []
const ProjectCount = 20

for (let i = 0; i < ProjectCount; i++) {
  ProjectList.push(
    Mock.mock({
      id: '@increment',
      project_name: '项目名称@id',
      bn: '@id',
      brief: '@sentence',
      'budget_cost|20000-50000': 20000,
      warning_cost: function() {
        return this.budget_cost - 2000
      },
      used_cost: function() {
        return Math.round(Math.random() * this.budget_cost)
      },
      warning_email: '@email',
      created_at: '@datetime'
    })
  )
}

const DepartList = []
const DepartCount = 20

for (let i = 0; i < DepartCount; i++) {
  DepartList.push(
    Mock.mock({
      id: '@increment',
      name: '部门名称@id',
      'tag|1': [0, 1, 2],
      'budget|20000-50000': 20000,
      budget_warn: function() {
        return this.budget - 2000
      },
      budget_used: function() {
        return Math.round(Math.random() * this.budget)
      },
      email: '@email'
    })
  )
}

const RoleList = []
const RoleCount = 20

for (let i = 0; i < RoleCount; i++) {
  RoleList.push(
    Mock.mock({
      id: '@increment',
      name: '分组名称@id',
      'nums|1-10': 1
    })
  )
}

const MemberList = []
const MemberCount = 20

for (let i = 0; i < MemberCount; i++) {
  MemberList.push(
    Mock.mock({
      id: '@increment',
      name: '@cname',
      role_id: function() {
        return RoleList[getRandomIntInclusive(0, RoleList.length - 1)].id
      },
      department_id: function() {
        return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
      },
      login_name: '@first',
      mobile: '@phone',
      email: '@email',
      'status|1': [0, 1]
    })
  )
}

const ProcessList = []
const ProcessCount = 20

for (let i = 0; i < ProcessCount; i++) {
  ProcessList.push(
    Mock.mock({
      id: i + 1,
      project_id: function() {
        return ProjectList[getRandomIntInclusive(0, ProjectList.length - 1)].id
      },
      project_name: function() {
        let project_name = ''
        ProjectList.some((project) => {
          if (project.id === this.project_id) {
            project_name = project.project_name
            return true
          }
          return false
        })
        return project_name
      },
      flow_name: '流程名称' + (i + 1),
      bn: '@word(6)',
      'demand|1': ['研发', '运营', '其他'],
      budget_dep_id: function() {
        return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
      },
      budget_dep_name: function() {
        let dep_name = ''
        DepartList.some((dep) => {
          if (dep.id === this.budget_dep_id) {
            dep_name = dep.name
            return true
          }
          return false
        })
        return dep_name
      },
      soft_code: '@word',
      brief: '@sentence',
      launch_dep_id: function() {
        return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
      },
      launch_dep_name: function() {
        let dep_name = ''
        DepartList.some((dep) => {
          if (dep.id === this.launch_dep_id) {
            dep_name = dep.name
            return true
          }
          return false
        })
        return dep_name
      },
      sub_id: function() {
        return SubList[getRandomIntInclusive(0, SubList.length - 1)].id
      },
      sub_name: function() {
        let sub_name = ''
        SubList.some((sub) => {
          if (sub.id === this.sub_id) {
            sub_name = sub.name
            return true
          }
          return false
        })
        return sub_name
      },
      accounting: '@word(1, 15)',
      account_dep_id: function() {
        return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
      },
      account_dep_name: function() {
        let dep_name = ''
        DepartList.some((dep) => {
          if (dep.id === this.account_dep_id) {
            dep_name = dep.name
            return true
          }
          return false
        })
        return dep_name
      },
      created_at: '@datetime'
    })
  )
}

module.exports = [
  {
    url: '/vue-admin-template/project/list',
    type: 'post',
    response: (config) => {
      const { project_name, page = 1, page_num = 20, sort } = config.query

      let mockList = ProjectList.filter((item) => {
        if (project_name && item.project_name.indexOf(project_name) < 0) {
          return false
        }
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter(
        (item, index) =>
          index < page_num * page && index >= page_num * (page - 1)
      )

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-admin-template/project/all',
    type: 'post',
    response: (config) => {
      const { project_name } = config.query

      const mockList = ProjectList.filter((item) => {
        if (project_name && item.project_name.indexOf(project_name) < 0) {
          return false
        }
        return true
      })

      const pageList = mockList

      return {
        code: 200,
        data: {
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/project/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/project/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/project/sub/list',
    type: 'post',
    response: (config) => {
      const { company_name, page = 1, page_num = 20, sort } = config.query

      let mockList = SubList.filter((item) => {
        if (company_name && item.name.indexOf(company_name) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter(
        (item, index) =>
          index < page_num * page && index >= page_num * (page - 1)
      )

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/project/sub/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/project/sub/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/project/sub/all',
    type: 'post',
    response: (config) => {
      const { name } = config.query
      const mockList = SubList.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false
        return true
      })
      return {
        code: 200,
        data: {
          items: mockList
        }
      }
    }
  },

  {
    url: '/vue-admin-template/project/process/list',
    type: 'post',
    response: (config) => {
      const {
        project_name,
        flow_name,
        bn,
        demand,
        budget_dep_name,
        launch_dep_name,
        sub_name,
        account_dep_name,
        page = 1,
        page_num = 20,
        sort
      } = config.query

      let mockList = ProcessList.filter((item) => {
        if (project_name && item.project_name.indexOf(project_name) < 0) {
          return false
        }
        if (flow_name && item.flow_name.indexOf(flow_name) < 0) {
          return false
        }
        if (bn && item.bn.indexOf(bn) < 0) {
          return false
        }
        if (demand && item.demand.indexOf(demand) < 0) {
          return false
        }
        if (
          budget_dep_name &&
          item.budget_dep_name.indexOf(budget_dep_name) < 0
        ) {
          return false
        }
        if (
          launch_dep_name &&
          item.launch_dep_name.indexOf(launch_dep_name) < 0
        ) {
          return false
        }
        if (sub_name && item.sub_name.indexOf(sub_name) < 0) {
          return false
        }
        if (
          account_dep_name &&
          item.account_dep_name.indexOf(account_dep_name) < 0
        ) {
          return false
        }
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter(
        (item, index) =>
          index < page_num * page && index >= page_num * (page - 1)
      )

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/project/process/detail',
    type: 'post',
    response: (config) => {
      const { process_id } = config.query

      const detail = Mock.mock({
        process_id: process_id,
        project_id: function() {
          return ProjectList[getRandomIntInclusive(0, ProjectList.length - 1)]
            .id
        },
        project: function() {
          let project = {}
          ProjectList.some((projectItem) => {
            if (projectItem.id === this.project_id) {
              project = Object.assign({}, project, projectItem)
              return true
            }
            return false
          })
          return project
        },
        flow_name: '流程名称' + process_id,
        bn: '@word(6)',
        'demand|1': ['研发', '运营', '其他'],
        budget_dep_id: function() {
          return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
        },
        budget_dep_name: function() {
          let dep_name = ''
          DepartList.some((dep) => {
            if (dep.id === this.budget_dep_id) {
              dep_name = dep.name
              return true
            }
            return false
          })
          return dep_name
        },
        soft_code: '@word',
        brief: '@sentence',
        launch_dep_id: function() {
          return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
        },
        launch_dep_name: function() {
          let dep_name = ''
          DepartList.some((dep) => {
            if (dep.id === this.launch_dep_id) {
              dep_name = dep.name
              return true
            }
            return false
          })
          return dep_name
        },
        sub_id: function() {
          return SubList[getRandomIntInclusive(0, SubList.length - 1)].id
        },
        sub_name: function() {
          let sub_name = ''
          SubList.some((sub) => {
            if (sub.id === this.sub_id) {
              sub_name = sub.name
              return true
            }
            return false
          })
          return sub_name
        },
        accounting: '@word(1, 15)',
        account_dep_id: function() {
          return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
        },
        account_dep_name: function() {
          let dep_name = ''
          DepartList.some((dep) => {
            if (dep.id === this.account_dep_id) {
              dep_name = dep.name
              return true
            }
            return false
          })
          return dep_name
        },
        create_user_id: 1,
        node_list: function() {
          return {
            needs_create_array: ['超管', '老王'],
            needs_verify_array: ['超管', '老王'],
            assign_supplier_array: ['超管', '老王'],
            wj_verify_array: ['超管', '老王'],
            order_create_array: ['超管', '老王'],
            order_verify_array: ['超管', '老王'],
            check_array: ['超管', '老王'],
            check_confirm_pro_array: ['超管', '老王'],
            check_confirm_supplier_array: ['超管', '老王'],
            check_confirm_supplier_charge_array: ['超管', '老王'],
            push_settle_array: ['超管', '老王'],
            change_verify_array: ['超管', '老王'],
            change_review_array: ['超管', '老王'],
            change_check_array: ['超管', '老王'],
            change_check_verify_array: ['超管', '老王']
          }
        },
        created_at: '@datetime',
        updated_at: '@datetime',
        task_total: 0,
        task_finish: 0,
        task_going: 0
      })

      return {
        code: 200,
        data: detail
      }
    }
  },
  {
    url: '/vue-element-admin/project/process/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/project/process/all',
    type: 'post',
    response: (config) => {
      const {
        name
      } = config.query

      const mockList = ProcessList.filter((item) => {
        if (name && item.flow_name.indexOf(name) < 0) {
          return false
        }
        return true
      })

      return {
        code: 200,
        data: {
          items: mockList
        }
      }
    }
  }
]
