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

const CategoryList = []

for (let i = 0; i < 20; i++) {
  CategoryList.push(
    Mock.mock({
      cat_id: i + 1,
      category_name: '品类名称@cat_id'
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
      'stay_time|1-10': 1,
      handler: function() {
        return MemberList[getRandomIntInclusive(0, MemberList.length - 1)]
          .name
      },
      'status|1': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      tasks: function() {
        return [
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)]
        ]
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
  }
]
