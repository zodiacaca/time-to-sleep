
const readConfig = require('./methods/readConfig')
const config = readConfig(__dirname + '/config.json')

const connect = require('./methods/connect')
const ping = require('./methods/ping')


;(() => {
  const interval = setInterval(async () => {
    let hosts = []

    for (let i = config.start; i <= config.end; i++) {
      const host = config.subnet + i
      let stat = false
      for (let ii = 0; ii <= config.ports.length; ii++) {
        const statics = await connect(host, config.ports[ii])
        if (typeof(statics) === "number") {
          stat = true
          break
        }
      }
      // const result = await ping(host)
      // console.log(result)

      if (stat) {
        hosts.push(host)
        // console.log(`${host} is online.`)
      } else {
        // console.log(`${host} is offline.`)
      }
    }

    console.log('Scan finished.')

    if (hosts.length === 0) {
      console.log('No host, time to sleep.')
    } else {
      console.log('Hosts: ', hosts)
    }

    hosts = []
  }, 1000 * config.interval)
})()
