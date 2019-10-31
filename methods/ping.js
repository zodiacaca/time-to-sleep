
const ping = (host) => {
  const exec = require('child_process').exec
  console.log(`@${host}`)

  return new Promise(resolve => {
    exec(`ping ${host}`, (error, stdout, stderr) => resolve(stdout))
  })
}

module.exports = ping
