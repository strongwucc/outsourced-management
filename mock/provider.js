const Mock = require('mockjs')

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

const AreaList = []
const AreaCount = 20

for (let i = 0; i < AreaCount; i++) {
  AreaList.push(
    Mock.mock({
      id: '@increment',
      name: '@region'
    })
  )
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

const ProviderList = []
const ProviderCount = 20

for (let i = 0; i < ProviderCount; i++) {
  ProviderList.push(
    Mock.mock({
      id: '@increment',
      sub_id: function() {
        return SubList[getRandomIntInclusive(0, SubList.length - 1)].id
      },
      name: '@word',
      brief: '@sentence',
      login_name: '@first',
      email: '@email',
      user_id: '@id',
      area: '@region',
      cat: [],
      contacts: []
    })
  )
}

module.exports = [
  {
    url: '/vue-admin-template/region/all',
    type: 'post',
    response: (config) => {
      const { name } = config.query

      const mockList = AreaList.filter((item) => {
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
    url: '/vue-admin-template/provider/list',
    type: 'post',
    response: (config) => {
      const { name, page = 1, page_num = 20, sort } = config.query

      let mockList = ProviderList.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false
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
    url: '/vue-element-admin/provider/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/provider/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/provider/all',
    type: 'post',
    response: (config) => {
      return {
        code: 200,
        data: {
          items: ProviderList
        }
      }
    }
  }
]
