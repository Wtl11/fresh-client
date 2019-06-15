const fs = require('fs')
const path = require('path')
// const filePath = path.join(__dirname, '../src/pages/main/')
// const filePath = path.join(__dirname, '../src/pages/package-leader/')
const filePath = path.join(__dirname, '../src/pages/unuse-page/')

fs.readdir(filePath, (err, files) => {
  if (err) {
    console.log(err)
    return
  }
  // console.log(files)
  files.forEach((item, index) => {
    const pagePath = path.join(filePath, `./${item}`)
    const configPath = path.join(pagePath, `./config.js`)
    // if (index !== 0) {
    //   return
    // }
    try {
      const context = fs.readFileSync(configPath, {encoding: 'utf-8'})
      if (!/export default /.test(context)) return
      fs.writeFileSync(pagePath + '/test.js', 'module.exports = ' + context.split('export default ')[1])
      const f = require(pagePath + '/test.js')
      let json = (JSON.stringify(f.config)).replace(/'/g, '"')
      fs.writeFileSync(pagePath + `/${item}.json`, json)
      fs.unlinkSync(pagePath + '/test.js')
    } catch (e) {
      console.log(index, item)
      console.error(e)
    }
  })
})