const Mock = require('mockjs')

// 拓展mockjs
Mock.Random.extend({
  phone: function() {
    var phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) // Number()
  }
})

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
const CategoryCount = 20

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

for (let i = 0; i < CategoryCount; i++) {
  const first = Mock.mock({
    cat_id: i + 1,
    parent_id: 0,
    cat_path: 1,
    category_name: '品类名称@cat_id',
    children: [],
    property_json: [],
    property_array: []
  })

  const seconds = []
  for (let j = 0; j < 10; j++) {
    const second = Mock.mock({
      cat_id: first.cat_id * 100 + j,
      parent_id: first.cat_id,
      cat_path: 2,
      category_name: '品类名称@cat_id',
      children: [],
      property_json: [],
      property_array: []
    })

    const thirds = []
    for (let z = 0; z < 5; z++) {
      const third = Mock.mock({
        cat_id: second.cat_id * 100 + z,
        parent_id: second.cat_id,
        cat_path: 3,
        category_name: '品类名称@cat_id',
        children: [],
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

      thirds.push(third)
    }

    second.children = thirds

    seconds.push(second)
  }

  first.children = seconds

  CategoryList.push(first)
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

const RoleList = [
  { id: 1, name: '项目组', nums: 6 },
  { id: 2, name: '项目组负责人', nums: 6 },
  { id: 3, name: '供管', nums: 6 },
  { id: 4, name: '供管负责人', nums: 6 },
  { id: 5, name: '项目制作人', nums: 6 }
]

const MemberList = []
const MemberCount = 20

for (let i = 0; i < MemberCount; i++) {
  MemberList.push(
    Mock.mock({
      id: '@increment',
      name: '@cname',
      group_id: function() {
        return RoleList[getRandomIntInclusive(0, RoleList.length - 1)].id
      },
      group_name: function() {
        let group_name = ''
        RoleList.some((role) => {
          if (role.id === this.group_id) {
            group_name = role.name
            return true
          }
          return false
        })
        return group_name
      },
      dep_id: function() {
        return DepartList[getRandomIntInclusive(0, DepartList.length - 1)].id
      },
      dep: function() {
        let dep_name = ''
        DepartList.some((dep) => {
          if (dep.id === this.dep_id) {
            dep_name = dep.name
            return true
          }
          return false
        })
        return dep_name
      },
      login_name: '@first',
      mobile: '@phone',
      email: '@email',
      'status|1': [0, 1]
    })
  )
}

const EmailList = []
const EmailCount = 20

for (let i = 0; i < EmailCount; i++) {
  EmailList.push(
    Mock.mock({
      id: i + 1,
      email: '@email',
      remark: '@sentence'
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
      const { category_name, page = 1, limit = 20, sort } = config.query

      let mockList = CategoryList.filter((item) => {
        if (category_name && item.category_name.indexOf(category_name) < 0) {
          return false
        }
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
    url: '/vue-admin-template/system/category/all',
    type: 'post',
    response: (config) => {
      return {
        code: 200,
        data: {
          items: CategoryList
        }
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
  },

  {
    url: '/vue-admin-template/system/department/list',
    type: 'post',
    response: (config) => {
      const { department, tag = 0, page = 1, limit = 20, sort } = config.query

      let mockList = DepartList.filter((item) => {
        if (tag >= 0 && item.tag !== parseInt(tag)) return false
        if (department && item.name.indexOf(department) < 0) return false
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
    url: '/vue-element-admin/system/department/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/system/department/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/system/department/all',
    type: 'post',
    response: (config) => {
      const { name, tag } = config.query
      const mockList = DepartList.filter((item) => {
        if (tag && item.tag !== parseInt(tag)) return false
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
    url: '/vue-admin-template/system/role/list',
    type: 'post',
    response: (config) => {
      const { name, page = 1, limit = 20, sort } = config.query

      let mockList = RoleList.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false
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
    url: '/vue-element-admin/system/role/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/system/role/all',
    type: 'post',
    response: (config) => {
      return {
        code: 200,
        data: {
          items: RoleList
        }
      }
    }
  },

  {
    url: '/vue-admin-template/system/member/list',
    type: 'post',
    response: (config) => {
      const { keyword, page = 1, limit = 20, sort } = config.query

      let mockList = MemberList.filter((item) => {
        if (
          keyword &&
          item.login_name.indexOf(keyword) < 0 &&
          item.mobile.indexOf(keyword) < 0
        ) {
          return false
        }
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
    url: '/vue-element-admin/system/member/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/system/member/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/system/member/all',
    type: 'post',
    response: (config) => {
      const { keyword, group_id } = config.query

      const mockList = MemberList.filter((item) => {
        if (
          keyword &&
          item.login_name.indexOf(keyword) < 0 &&
          item.mobile.indexOf(keyword) < 0
        ) {
          return false
        }
        if (
          group_id > 0 &&
          item.group_id !== parseInt(group_id)
        ) {
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
  },

  {
    url: '/vue-admin-template/system/email/list',
    type: 'post',
    response: (config) => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = EmailList

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
    url: '/vue-element-admin/system/email/create',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/system/email/update',
    type: 'post',
    response: (_) => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
