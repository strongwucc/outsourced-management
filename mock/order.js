const Mock = require('mockjs')

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

const TaskList = []

for (let i = 0; i < 20; i++) {
  TaskList.push(
    Mock.mock({
      task_id: 'WJ@id',
      task_name: '角色@word',
      task_image: "@image('100x100')",
      category_id: 1,
      category_name: function() {
        return '2D角色'
      },
      deliver_date: '@date',
      work_unit: '人日',
      work_num: 10,
      work_price: 1000,
      work_amount: 10000,
      'status|1': [0, 1, 2, 3, 4, 5, 6],
      dowanload_url: '@url'
    })
  )
}

const OrderList = []

for (let i = 0; i < 20; i++) {
  OrderList.push(
    Mock.mock({
      order_id: 'DD@id',
      project_id: 'XM@id',
      project_name: '守望先锋手游' + i,
      demand_id: 'XQ@id',
      demand_name: '守望角色绘制' + i,
      provider_name: '上海角色设计有限公司' + i,
      manager: 'admin',
      task_num: 3,
      work_total: 10,
      work_amount: 15000,
      'stay_time|1-10': 1,
      current_manager: '心动网络' + i,
      'status|1': [0, 1, 2, 3, 4, 5, 6],
      category: function() {
        return {
          category_id: 14,
          category_name: '品类名称14',
          property_array: [{ id: 7788, extend_name: '品类名称7788', extend_tag: 1, extend_value: '单价,颜色' }],
          property_json: [7788, 7815]
        }
      },
      tasks: function() {
        const order_id = this.order_id
        const tasks = [
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)]
        ]
        return tasks.map((task) => {
          task.order_id = order_id
          return task
        })
      }
    })
  )
}

const ModifyOrderList = []

for (let i = 0; i < 20; i++) {
  ModifyOrderList.push(
    Mock.mock({
      modify_id: 'BG@id',
      project_id: 'XM@id',
      project_name: '守望先锋手游' + i,
      provider_name: '上海角色设计有限公司' + i,
      'initiator|1': [0, 1],
      'type|1': [0, 1],
      task_num: 3,
      'status|1': [0, 1, 2],
      tasks: function() {
        const modify_id = this.modify_id
        const tasks = [
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)]
        ]
        return tasks.map((task) => {
          task.modify_id = modify_id
          task.modify_deliver_date = '2022-06-01'
          task.modify_work_num = 20
          task.modify_work_amount = 20000
          return task
        })
      }
    })
  )
}

const CheckOrderList = []

for (let i = 0; i < 20; i++) {
  CheckOrderList.push(
    Mock.mock({
      check_id: 'YS@id',
      order_id: 'DD@id',
      project_id: 'XM@id',
      project_name: '守望先锋手游' + i,
      demand_id: 'XQ@id',
      demand_name: '守望角色绘制' + i,
      provider_name: '上海角色设计有限公司' + i,
      manager: 'admin',
      task_num: 3,
      work_total: 10,
      work_amount: 15000,
      'stay_time|1-10': 1,
      current_manager: '心动网络' + i,
      'status|1': [0, 1, 2, 3, 4, 5, 6],
      tasks: function() {
        const order_id = this.order_id
        const tasks = [
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)]
        ]
        return tasks.map((task) => {
          task.order_id = order_id
          return task
        })
      }
    })
  )
}

const ReconcileOrderList = []

for (let i = 0; i < 20; i++) {
  ReconcileOrderList.push(
    Mock.mock({
      reconcile_id: 'DZ@id',
      order_id: 'DD@id',
      project_id: 'XM@id',
      project_name: '守望先锋手游' + i,
      demand_id: 'XQ@id',
      demand_name: '守望角色绘制' + i,
      provider_name: '上海角色设计有限公司' + i,
      manager: 'admin',
      task_num: 3,
      work_total: 10,
      work_amount: 15000,
      'stay_time|1-10': 1,
      current_manager: '心动网络' + i,
      'status|1': [0, 1, 2, 3, 4, 5, 6],
      tasks: function() {
        const order_id = this.order_id
        const tasks = [
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)],
          TaskList[getRandomIntInclusive(0, TaskList.length - 1)]
        ]
        return tasks.map((task) => {
          task.order_id = order_id
          return task
        })
      }
    })
  )
}

module.exports = [
  {
    url: '/vue-admin-template/order/list',
    type: 'post',
    response: (config) => {
      const {
        order_id,
        project_name,
        provider_name,
        page = 1,
        page_num = 20,
        sort
      } = config.query

      let mockList = OrderList.filter((item) => {
        if (order_id && item.order_id.indexOf(order_id) < 0) {
          return false
        }
        if (project_name && item.project_name.indexOf(project_name) < 0) {
          return false
        }
        if (provider_name && item.provider_name.indexOf(provider_name) < 0) {
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
    url: '/vue-admin-template/order/modify/list',
    type: 'post',
    response: (config) => {
      const {
        modify_id,
        project_name,
        provider_name,
        initiator,
        type,
        status,
        page = 1,
        page_num = 20,
        sort
      } = config.query

      let mockList = ModifyOrderList.filter((item) => {
        if (modify_id && item.modify_id.indexOf(modify_id) < 0) {
          return false
        }
        if (project_name && item.project_name.indexOf(project_name) < 0) {
          return false
        }
        if (provider_name && item.provider_name.indexOf(provider_name) < 0) {
          return false
        }
        if (initiator !== '' && parseInt(initiator) !== item.initiator) {
          return false
        }
        if (type !== '' && parseInt(type) !== item.type) {
          return false
        }
        if (status !== '' && parseInt(status) !== item.status) {
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
    url: '/vue-admin-template/order/check/list',
    type: 'post',
    response: (config) => {
      const {
        check_id,
        project_name,
        provider_name,
        order_id,
        page = 1,
        page_num = 20,
        sort
      } = config.query

      let mockList = OrderList.filter((item) => {
        if (check_id && item.check_id.indexOf(check_id) < 0) {
          return false
        }
        if (project_name && item.project_name.indexOf(project_name) < 0) {
          return false
        }
        if (provider_name && item.provider_name.indexOf(provider_name) < 0) {
          return false
        }
        if (order_id && item.order_id.indexOf(order_id) < 0) {
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
    url: '/vue-admin-template/order/reconcile/list',
    type: 'post',
    response: (config) => {
      const {
        reconcile_id,
        project_name,
        provider_name,
        order_id,
        page = 1,
        page_num = 20,
        sort
      } = config.query

      let mockList = OrderList.filter((item) => {
        if (reconcile_id && item.reconcile_id.indexOf(reconcile_id) < 0) {
          return false
        }
        if (project_name && item.project_name.indexOf(project_name) < 0) {
          return false
        }
        if (provider_name && item.provider_name.indexOf(provider_name) < 0) {
          return false
        }
        if (order_id && item.order_id.indexOf(order_id) < 0) {
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
  }
]
