const Mock = require('mockjs')

const TypeList = []
const TypeCount = 20

for (let i = 0; i < TypeCount; i++) {
  TypeList.push(
    Mock.mock({
      id: '@increment',
      type_name: '类型名称@id'
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
const CategoryCount = 100

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

for (let i = 0; i < CategoryCount; i++) {
  CategoryList.push(
    Mock.mock({
      id: '@increment',
      type_id: function() {
        return TypeList[getRandomIntInclusive(0, TypeList.length - 1)].id
      },
      category_name: '品类名称@id',
      property_json: function() {
        return [
          PropList[getRandomIntInclusive(0, PropList.length - 1)].id,
          PropList[getRandomIntInclusive(0, PropList.length - 1)].id
        ]
      },
      property_array: function() {
        return PropList.filter(prop => {
          return this.property_json.indexOf(prop.id) !== -1
        })
      }
    })
  )
}

module.exports = [
  {
    url: '/vue-admin-template/system/type/list',
    type: 'post',
    response: (config) => {
      const { type_name, page = 1, limit = 20, sort } = config.query

      let mockList = TypeList.filter((item) => {
        if (type_name && item.type_name.indexOf(type_name) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
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
    url: '/vue-element-admin/system/type/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/system/type/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/system/type/all',
    type: 'post',
    response: (config) => {
      return {
        code: 200,
        data: {
          items: TypeList
        }
      }
    }
  },

  {
    url: '/vue-admin-template/system/category/list',
    type: 'post',
    response: (config) => {
      const {
        category_name,
        type_id,
        page = 1,
        limit = 20,
        sort
      } = config.query

      let mockList = CategoryList.filter((item) => {
        if (category_name && item.category_name.indexOf(category_name) < 0) {
          return false
        }
        if (type_id && item.type_id !== type_id) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
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
    url: '/vue-element-admin/system/category/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/system/category/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/system/category/prop/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/system/category/prop/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
