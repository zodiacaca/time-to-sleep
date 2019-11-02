
const readConfig = require('./methods/readConfig')
const config = readConfig(__dirname + '/config_folder/config.json')

const execFile = require('child_process').execFile

const connect = require('./methods/connect')
const ping = require('./methods/ping')

const dashboard = {
  switcher: false,
  hosts: []
}


;(() => {
  execFile(config.startup)

  const interval = setInterval(async () => {
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
        dashboard.hosts.push(host)
      } else {
      }
    }

    console.log(dashboard)

    if (dashboard.hosts.length === 0) {
      if (dashboard.switcher) {
        console.log('No host, time to sleep.')
        const date = new Date()
        const str = date.toLocaleString({ timeZone: 'Asia/Shanghai' })
        console.log(str)

        dashboard.switcher = false

        execFile('sleep.bat')
      }
    } else {
      dashboard.switcher = true
    }

    dashboard.hosts = []
  }, 1000 * 60 * config.interval)
})()
