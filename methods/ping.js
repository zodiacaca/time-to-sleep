
const ping = (host) => {
  const exec = require('child_process').exec

  return new Promise(resolve => {
    exec(`ping ${host}`, (error, stdout, stderr) => resolve(stdout))
  })
}

module.exports = ping
