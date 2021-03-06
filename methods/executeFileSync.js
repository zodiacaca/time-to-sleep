
const execFileSync = require('child_process').execFileSync

const executeFileSync = (file, delay = 0) => {
  return new Promise(resolve => {
    console.log(`Execute ${file} after ${delay} second(s)...`)
    let buffer
    let resolveInterval

    try {
      buffer = execFileSync(file)
    }
    catch(error) {
      clearTimeout(resolveInterval)

      resolve(error)
    }

    resolveInterval = setInterval(() => {
      if (buffer) {
        clearInterval(resolveInterval)

        resolve(buffer)
      }
    }, 5)
  })
}

module.exports = executeFileSync
