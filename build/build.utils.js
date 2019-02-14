var chalk = require('chalk')
var applications = require('./applications') // 应用
var environments = require('./environments') // 环境
var versions = require('./versions') // 版本

module.exports = function (arguments) {
  var res = {
    versions: '\'\'',
    applications: '\'platform\'',
    environments: '\'production\''
  }
  let length = arguments.length
  switch (length) {
  case 1:
    if (environments.includes(arguments[0])) {
      if (arguments[0] !== 'production') {
        res.environments = '\'' + arguments[0] + '\''
      } else {
        handleException('production must have version number')
      }
    } else if (versions.includes(arguments[0])) {
      res.versions = '\'/' + arguments[0] + '\''
    } else {
      handleException('Please enter version number')
    }
    break
  case 2:
    if (environments.includes(arguments[0])) {
      if (arguments[0] !== 'production') {
        if (applications.includes(arguments[1])) {
          res.environments = '\'' + arguments[0] + '\''
          res.applications = '\'' + arguments[1] + '\''
        } else if (versions.includes(arguments[1])) {
          handleException('Informal environments do not require version numbers')
        } else {
          handleException('Please input the correct command')
        }
      } else {
        if (versions.includes(arguments[1])) {
          res.environments = '\'' + arguments[0] + '\''
          res.versions = '\'/' + arguments[1] + '\''
        } else {
          handleException('Please enter version number')
        }
      }
    } else if (applications.includes(arguments[0])) {
      if (versions.includes(arguments[1])) {
        res.applications = '\'' + arguments[0] + '\''
        res.versions = '\'/' + arguments[1] + '\''
      } else if (environments.includes(arguments[1])) {
        if (arguments[1] !== 'production') {
          res.applications = '\'' + arguments[0] + '\''
          res.environments = '\'' + arguments[1] + '\''
        } else {
          handleException('Please enter version number')
        }
      }
    } else if (versions.includes(arguments[0])) {
      if (arguments[1] === 'production') {
        res.versions = '\'/' + arguments[0] + '\''
        res.environments = '\'' + arguments[1] + '\''
      }
    }
    break
  case 3:
    if (arguments.includes('production')) {
      var idx = arguments.findIndex((item) => item === 'production')
      res.environments = '\'' + arguments[idx] + '\''
      res.applications = applications.includes(arguments[0]) ? '\'' + arguments[0] + '\'' : applications.includes(arguments[1]) ? '\'' + arguments[1] + '\'' : '\'' + arguments[2] + '\''
      res.versions = versions.includes(arguments[0]) ? '\'/' + arguments[0] + '\'' : versions.includes(arguments[1]) ? '\'/' + arguments[1] + '\'' : '\'/' + arguments[2] + '\''
    } else {
      handleException('environments must to be production')
    }
    break
  }
  return res
  // if (arguments.length === 1) {
  //   console.log(environments.includes(arguments[0]))
  //
  // }
}

function handleException(message) {
  console.log(chalk.red('' + message + '\n'))
  process.exit(1)
}
