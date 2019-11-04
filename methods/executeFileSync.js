
const execFileSync = require('child_process').execFileSync

const executeFileSync = (file, delay = 0) => {
  setTimeout(() => {
    const buffer = execFileSync(file)
  }, 1000 * delay)

  return new Promise(resolve => {
    setTimeout(() => {
      if (buffer) {
        resolve(buffer)
      }
    }, 1000 * (delay + 5))
  })
}

module.exports = executeFileSync
