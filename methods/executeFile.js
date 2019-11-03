
const execFile = require('child_process').execFile

const executeFile = (file) => {
  return new Promise(resolve => {
    execFile(file, (error, stdout, stderr) => {
      if (error) {
        throw error
      }

      resolve(this)
    })
  })
}

module.exports = executeFile
