const Mock = require('mockjs')

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

module.exports = [
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
      return {
        code: 200,
        data: {
          items: SubList
        }
      }
    }
  }
]
