
const execFileSync = require('child_process').execFileSync

const executeFileSync = (file) => {
  setTimeout(() => {
    const buffer = execFileSync(file)
  }, 1000 * 45)

  return new Promise(resolve => {
    setTimeout(() => {
      if (buffer) {
        resolve(buffer)
      }
    }, 1000 * 50)
  })
}

module.exports = executeFileSync
