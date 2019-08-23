require('./check-versions')()

process.env.NODE_ENV = 'production'
process.env.PLATFORM = process.argv[2] || 'wx'
var getParams = require('./build.utils')

let params = getParams(process.argv)
process.env.BUILD_ENV = params.environments
process.env.VERSION = params.versions
process.env.APPLICATION = params.applications
console.log(Object.assign(params, {platform: process.env.PLATFORM}))

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var utils = require('./utils')

var spinner = ora(`building for ${process.env.BUILD_ENV}...`)
spinner.start()

// build构建时检查分支
checkBuildBranch()

rm(path.join(config.build.assetsRoot, '*'), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    if (process.env.PLATFORM === 'swan') {
      utils.writeFrameworkinfo()
    }
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})


function checkBuildBranch() {
  const isBuild = process.env.BUILD_ENV === '\'production\''
  if (!isBuild) return
  const fs = require('fs')
  const currentBranch = fs.readFileSync(path.join(__dirname, '../.git/HEAD'), 'utf-8').trim().replace('ref: refs/heads/', '')
  const allowBuildBranch = /(release)/g.test(currentBranch)
  if (!allowBuildBranch) {
    console.log(chalk.cyan('\n请在release分支上传正式站代码，记得push origin；\n由管理员进行整合master和release分支！！！'))
    spinner.stop()
    process.exit(1)
  }
}