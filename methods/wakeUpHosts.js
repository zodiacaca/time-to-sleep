
const wol = require('wakeonlan')

const wakeUpHosts = (hosts) => {
  hosts.forEach(function(host) {
    try {
      wol(host).then(() => {
        console.log('WoL sent.')
      })
    }
    catch(error) {
      console.log(error)
    }
  })
}

module.exports = wakeUpHosts
