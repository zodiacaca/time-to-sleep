
const readConfig = require('./methods/readConfig')
const config = readConfig(__dirname + '/config_folder/config.json')

const connect = require('./methods/connect')
const ping = require('./methods/ping')
const executeFile = require('./methods/executeFile')

const dashboard = {
  switcher: false,
  hosts: [],
  elapsed: 0,
  patient: config.patient,
}


const sleep = () => {
  console.log('No host, time to sleep.')
  console.log(lookupTime())

  dashboard.switcher = false
  dashboard.patient = config.patient

  executeFile(__dirname + '/sleep.bat')
}

;(async () => {
  const time0 = Date.now()
  const lookupTime = require('./methods/lookupTime')

  await executeFile(__dirname + config.startup)

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

    dashboard.elapsed = Date.now() - time0
    console.log(dashboard)

    if (dashboard.hosts.length === 0) {
      dashboard.patient -= 1

      if (dashboard.switcher) {
        sleep()
      }
    } else if (dashboard.patient === 0) {
      sleep()
    } else if (dashboard.hosts.length >= 1) {
      dashboard.switcher = true
      dashboard.patient = config.patient
    }

    dashboard.hosts = []
  }, 1000 * 60 * config.interval)
})()
