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

const ContractList = []
const ContractCount = 20

for (let i = 0; i < ContractCount; i++) {
  ContractList.push(
    Mock.mock({
      pact_id: '@increment',
      supplier_id: function() {
        return ProviderList[getRandomIntInclusive(0, ProviderList.length - 1)]
          .id
      },
      supplier_name: function() {
        let supplier_name = ''
        ProviderList.some((provider) => {
          if (provider.id === this.supplier_id) {
            supplier_name = provider.name
            return true
          }
          return false
        })
        return supplier_name
      },
      sub_id: function() {
        return SubList[getRandomIntInclusive(0, SubList.length - 1)].id
      },
      subject_name: function() {
        let subject_name = ''
        SubList.some((subject) => {
          if (subject.id === this.sub_id) {
            subject_name = subject.name
            return true
          }
          return false
        })
        return subject_name
      },
      bn: '@id',
      area: function() {
        return AreaList[getRandomIntInclusive(0, AreaList.length - 1)].name
      },
      'status|1': [0, 1, 2, 3],
      period_start: '@date',
      period_end: '@date'
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
    url: '/vue-admin-template/subject/all',
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
      const { name } = config.query
      const mockList = ProviderList.filter((item) => {
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
    url: '/vue-admin-template/provider/contract/list',
    type: 'post',
    response: (config) => {
      const {
        supplier_name,
        subject_name,
        bn,
        area,
        status,
        page = 1,
        page_num = 20,
        sort
      } = config.query

      let mockList = ContractList.filter((item) => {
        if (supplier_name && item.supplier_name.indexOf(supplier_name) < 0) {
          return false
        }
        if (subject_name && item.subject_name.indexOf(subject_name) < 0) {
          return false
        }
        if (bn && item.bn.indexOf(bn) < 0) return false
        if (area && item.area !== area) return false
        if (status && item.status !== status) return false
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
    url: '/vue-element-admin/provider/contract/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/provider/contract/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/provider/contract/recover',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/provider/contract/pause',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
