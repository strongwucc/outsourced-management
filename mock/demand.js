const Mock = require('mockjs')

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
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

const PropList = []
const PropCount = 100

for (let i = 0; i < PropCount; i++) {
  PropList.push(
    Mock.mock({
      id: '@increment',
      extend_name: '品类名称@id',
      'extend_tag|1': [0, 1],
      extend_value: function() {
        const maps = ['单价', '颜色', '帧数', '时长']
        const values = [
          maps[getRandomIntInclusive(0, maps.length - 1)],
          maps[getRandomIntInclusive(0, maps.length - 1)]
        ].join(',')
        return values
      }
    })
  )
}

const CategoryList = []

for (let i = 0; i < 20; i++) {
  CategoryList.push(
    Mock.mock({
      cat_id: i + 1,
      category_name: '品类名称@cat_id',
      property_json: function() {
        return [
          PropList[getRandomIntInclusive(0, PropList.length - 1)].id,
          PropList[getRandomIntInclusive(0, PropList.length - 1)].id
        ]
      },
      property_array: function() {
        return PropList.filter((prop) => {
          return this.property_json.indexOf(prop.id) !== -1
        })
      }
    })
  )
}

const MemberList = []

for (let i = 0; i < 20; i++) {
  MemberList.push(
    Mock.mock({
      id: i + 1,
      name: '@cname'
    })
  )
}

const DepartList = []
const DepartCount = 20

for (let i = 0; i < DepartCount; i++) {
  DepartList.push(
    Mock.mock({
      id: i + 1,
      name: '部门名称' + i,
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

const TaskList = []

for (let i = 0; i < 20; i++) {
  TaskList.push(
    Mock.mock({
      task_id: 'T@id',
      demand_id: '',
      task_name: '角色@word',
      task_image: "@image('100x100')",
      category_id: function() {
        return CategoryList[getRandomIntInclusive(0, CategoryList.length - 1)]
          .cat_id
      },
      category_name: function() {
        let category_name = ''
        CategoryList.some((category) => {
          if (category.cat_id === this.category_id) {
            category_name = category.category_name
            return true
          }
          return false
        })
        return category_name
      },
      deliver_date: '@datetime',
      work_unit: '人日',
      work_num: 10,
      work_price: '0.00',
      work_amount: '0.00',
      supplier_id: 0,
      display_area: '',
      finished_product: '',
      remark: '备注随便谢谢'
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

const DemandList = []
const DemandCount = 20

for (let i = 0; i < DemandCount; i++) {
  DemandList.push(
    Mock.mock({
      demand_id: '@id',
      project_id: function() {
        return ProjectList[getRandomIntInclusive(0, ProjectList.length - 1)].id
      },
      name: '需求名称' + i,
      'tag|1': [0, 1, 2, 3],
      introduce: '@sentence',
      file: '123,123',
      category: function() {
        const index = getRandomIntInclusive(0, CategoryList.length - 1)
        return {
          category_id: CategoryList[index].cat_id,
          category_name: CategoryList[index].category_name,
          property_json: CategoryList[index].property_json,
          property_array: CategoryList[index].property_array
        }
      },
      'stay_time|1-10': 1,
      handler: function() {
        return MemberList[getRandomIntInclusive(0, MemberList.length - 1)].name
      },
      'status|1': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      tasks: function() {
        const demand_id = this.demand_id
        const tasks = [
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)]
        ]
        return tasks.map(task => {
          task.demand_id = demand_id
          return task
        })
      }
    })
  )
}

module.exports = [
  {
    url: '/vue-admin-template/demand/list',
    type: 'post',
    response: (config) => {
      const {
        demand_id,
        name,
        category_name,
        tag,
        page = 1,
        page_num = 20,
        sort
      } = config.query

      let mockList = DemandList.filter((item) => {
        if (demand_id && item.demand_id.indexOf(demand_id) < 0) {
          return false
        }
        if (name && item.name.indexOf(name) < 0) {
          return false
        }
        if (category_name && item.category_name.indexOf(category_name) < 0) {
          return false
        }
        if (tag >= 0 && item.tag === parseInt(tag)) {
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
    url: '/vue-admin-template/demand/detail',
    type: 'post',
    response: (config) => {
      const { demand_id } = config.body

      const detail = Mock.mock({
        demand_id: demand_id,
        project_bn: function() {
          return ProjectList[getRandomIntInclusive(0, ProjectList.length - 1)]
            .bn
        },
        launch_dep_id: function() {
          return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
        },
        launch_dep_name: function() {
          let launch_dep_name = ''
          DepartList.some((depart) => {
            if (depart.id === this.launch_dep_id) {
              launch_dep_name = depart.name
              return true
            }
            return false
          })
          return launch_dep_name
        },
        account_dep_id: function() {
          return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
        },
        account_dep_name: function() {
          let account_dep_name = ''
          DepartList.some((depart) => {
            if (depart.id === this.launch_dep_id) {
              account_dep_name = depart.name
              return true
            }
            return false
          })
          return account_dep_name
        },
        budget: 100,
        budget_used: 1000,
        create_user_id: 1,
        create_user_name: '需求创建者',
        created_at: '@datetime',
        name: '守望2D角色概念设计',
        'tag|1': [0, 1, 2, 3],
        status: '@natural(0,10)',
        introduce: '详细介绍看文档',
        category_id: function() {
          return CategoryList[getRandomIntInclusive(0, CategoryList.length - 1)]
            .cat_id
        },
        category_name: function() {
          let category_name = ''
          CategoryList.some((category) => {
            if (category.cat_id === this.category_id) {
              category_name = category.category_name
              return true
            }
            return false
          })
          return category_name
        },
        file: '123,123',
        supplier_name: '王者荣耀供应商',
        remark: '没有备注随便写',
        supplier_id: 0,
        records: function() {
          const list = []
          for (let i = 1; i <= 20; i++) {
            list.push(
              Mock.mock({
                id: i,
                operator: '@cname',
                title: '我干了啥' + i,
                datetime: '@datetime',
                stay_time: 2
              })
            )
          }
          return list
        }
      })

      return {
        code: 200,
        data: detail
      }
    }
  },
  {
    url: '/vue-element-admin/demand/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/demand/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/demand/task/detail',
    type: 'post',
    response: (config) => {
      console.log(111111, config)
      const { task_id } = config.body

      const detail = Mock.mock({
        task_id: task_id,
        process: function() {
          return ProcessList[getRandomIntInclusive(0, ProcessList.length - 1)]
        },
        demand: function() {
          return DemandList[getRandomIntInclusive(0, DemandList.length - 1)]
        },
        launch_dep_id: function() {
          return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
        },
        launch_dep_name: function() {
          let launch_dep_name = ''
          DepartList.some((depart) => {
            if (depart.id === this.launch_dep_id) {
              launch_dep_name = depart.name
              return true
            }
            return false
          })
          return launch_dep_name
        },
        account_dep_id: function() {
          return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
        },
        account_dep_name: function() {
          let account_dep_name = ''
          DepartList.some((depart) => {
            if (depart.id === this.launch_dep_id) {
              account_dep_name = depart.name
              return true
            }
            return false
          })
          return account_dep_name
        },
        task_name: '角色@word',
        task_image: "@image('100x100')",
        category_id: function() {
          return CategoryList[getRandomIntInclusive(0, CategoryList.length - 1)]
            .cat_id
        },
        category_name: function() {
          let category_name = ''
          CategoryList.some((category) => {
            if (category.cat_id === this.category_id) {
              category_name = category.category_name
              return true
            }
            return false
          })
          return category_name
        },
        props: [
          { name: '长度', value: '10公分' },
          { name: '上色方式', value: '上色1' }
        ],
        provider: function() {
          return {
            id: 'G' + this.task_id,
            name: '上海角色设计有限公司',
            contact: {
              phone: '137344333244',
              qq: '1212122121',
              wx: '137344333244'
            },
            bn: 'HT12121212',
            tasks: [
              {
                work_unit: '人日',
                work_num: 10,
                work_price: '1000',
                work_amount: '2000',
                deliver_date: '2020-03-22',
                create_at: '2020-03-22 17:20:32'
              }
            ]
          }
        },
        plan_images: function() {
          return [Mock.Random.image('200x200'), Mock.Random.image('200x200')]
        },
        files: function() {
          return ['file1', 'file2']
        },
        records: function() {
          const list = []
          for (let i = 1; i <= 20; i++) {
            list.push(
              Mock.mock({
                id: i,
                operator: '@cname',
                title: '我干了啥' + i,
                datetime: '@datetime',
                stay_time: 2
              })
            )
          }
          return list
        }
      })

      return {
        code: 200,
        data: detail
      }
    }
  },
  {
    url: '/vue-element-admin/demand/task/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/demand/task/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
