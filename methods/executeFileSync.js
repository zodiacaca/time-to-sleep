
const execFileSync = require('child_process').execFileSync

const executeFileSync = (file, delay = 0) => {
  return new Promise(resolve => {
    console.log(`Execute after ${delay} second(s)...`)
    let buffer
    let resolveTimeout
    setTimeout(() => {
      try {
        buffer = execFileSync(file)
      }
      catch(error) {
        clearTimeout(resolveTimeout)

        resolve(error)
      }
    }, 1000 * delay)

    resolveTimeout = setTimeout(() => {
      if (buffer) {
        resolve(buffer)
      }
    }, 1000 * (delay + 5))
  })
}

module.exports = executeFileSync
