/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach((v) => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

export function previewFile(fileName, filePath) {
  let link
  if (
    filePath.includes('pdf') ||
    filePath.includes('png') ||
    filePath.includes('jpg') ||
    filePath.includes('jpeg')
  ) {
    link = document.createElement('a')
    link.href = `${filePath}`
    link.target = '_blank'
    link.setAttribute('download', fileName)
    link.click()
    URL.revokeObjectURL(filePath)
  } else {
    link = document.createElement('iframe')
    link.style.display = 'none'
    link.src = `${filePath}`
  }
  document.body.appendChild(link)
  setTimeout(() => {
    document.body.removeChild(link)
  }, 500)
}

export function downloadFileStream(fileName, data) {
  const aLink = document.createElement('a')
  // const blob = new Blob([data], { type: 'image/jpeg' })
  const blob = new Blob([data])
  // 创建一个当前文件的内存URL
  const _href = URL.createObjectURL(blob)
  aLink.style.display = 'none'
  aLink.href = _href
  document.body.appendChild(aLink)
  aLink.setAttribute('download', fileName)
  aLink.click()
  document.body.removeChild(aLink)
  // 手动释放创建的URL对象所占内存
  URL.revokeObjectURL(_href)
}

export function downloadFileUrl(fileName, url) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const aLink = document.createElement('a')
      // 创建一个当前文件的内存URL
      const _href = URL.createObjectURL(blob)
      aLink.style.display = 'none'
      aLink.href = _href
      document.body.appendChild(aLink)
      aLink.setAttribute('download', fileName)
      aLink.click()
      document.body.removeChild(aLink)
      // 手动释放创建的URL对象所占内存
      URL.revokeObjectURL(_href)
    })
}

export function baseName(url) {
  return String(url).substring(url.lastIndexOf('/') + 1)
}

/**
 * 将传入的字符串中间部分替换为 "*"，以达到隐藏信息的目的
 * @param { string } originString 需要处理的字符串
 * @param { number } startRetain 开头保留不更改的字符数量
 * @param { number } endRetain 结尾保留不更改的字符数量
 * @param { string } subString 代替字符，用于替换需要被隐藏的字符
 * @return { string } 返回处理好的字符串，如果传入值不符合要求或者其他问题，则返回空字符串
 */
export function replaceToHidden(
  originString,
  startRetain = 1,
  endRetain = 1,
  subString = '*'
) {
  // 类型检测
  if (
    !originString ||
    typeof originString !== 'string' ||
    typeof startRetain !== 'number' ||
    typeof endRetain !== 'number' ||
    typeof subString !== 'string'
  ) {
    console.error('请检查传入的参数是否正确 !')
    return ''
  }

  const len = originString.length - startRetain - endRetain
  let midStr = ''
  for (let i = 0; i < len; i++) {
    midStr += subString
  }
  const leftStr = originString.substring(0, startRetain)
  const rightStr = originString.substring(originString.length - endRetain)
  return leftStr + midStr + rightStr
}

export function copyText(text) {
  try {
    if (navigator.clipboard) {
      // clipboard api 复制
      navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('input')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
