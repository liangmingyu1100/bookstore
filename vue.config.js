// 引入path模块
const path = require('path')
function resolve(dir) {
  // path.join(__dirname)设置绝对路径
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack: config => {
    // 起别名 便于读取文件的路径
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('assets', resolve('./src/assets'))
      .set('components', resolve('./src/components'))
      .set('router', resolve('./src/router'))
      .set('views', resolve('./src/views'))
      .set('network', resolve('./src/network'))
      .set('common', resolve('./src/common'))
  },

}
