let baseApi = ''

if (process.env.NODE_ENV === 'development') {
  baseApi = 'http://pms-test.madainfo.cn'
} else if (process.env.NODE_ENV === 'production') {
  const protocol = window.location.protocol
  const domain = window.location.host
  baseApi = `${protocol}//${domain}`
}

export { baseApi }
