const req = require.context('./', false, /\.svg$/)
req.keys().forEach(key => { req(key) }) // 引入所有 svg 文件，生成 sprite
const icons = {}
req.keys().forEach(key => {
  const name = key.replace('./', '').replace('.svg', '')
  icons[name] = req(key).default || req(key)
})
export default icons 