
const readConfig = require('./methods/readConfig')
const config = readConfig(__dirname + '/config_folder/config.json')

const connect = require('./methods/connect')
const ping = require('./methods/ping')
const executeFile = require('./methods/executeFile')
const lookupTime = require('./methods/lookupTime')
const getElapsedTime = require('./methods/getElapsedTime')

const dashboard = {
  hosts: [],
  elapsed: 0,
  sleepy: 0,
  daytime: 0,
}


const toSleep = () => {
  // message
  console.log('No host, time to sleep.')
  console.log(lookupTime(config.timeZone))

  // reset
  dashboard.hosts = []
  dashboard.sleepy = 0

  // execute
  return new Promise(async (resolve) => {
    const sleep = await executeFile(__dirname + '/sleep.bat')
    resolve(sleep)
  })
}

const afterWakeUp = () => {
  return new Promise(async (resolve) => {
    const wake = await executeFile(__dirname + config.wakeUp)
    resolve(wake)
  })
}

;(async () => {
  // 0: time speed multiply
  const args = process.argv.slice(2)
  if (args[0] === undefined) {
    args[0] = 1
  }

  // time stuff
  let t0 = Date.now()

  // startup script
  await executeFile(__dirname + config.startup)

  // scan loop
  const interval = setInterval(async () => {
    // scan subnet
    dashboard.hosts = []
    for (let i = config.start; i <= config.end; i++) {
      const host = config.subnet + i
      let stat = false
      for (let ii = 0; ii <= config.ports.length; ii++) {
        const status = await connect(host, config.ports[ii], config.timeout)
        if (typeof(status) === "number") {
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

    // print context
    dashboard.elapsed = getElapsedTime(t0, Date.now() + dashboard.daytime)
    console.log(dashboard)

    // determine and statistic
    switch (true) {
      case (dashboard.hosts.length === 0 && dashboard.sleepy >= config.patient):
        try {
          dashboard.daytime += Date.now() - t0

          await toSleep()
          await afterWakeUp()

          t0 = Date.now()
        }
        catch(error) {
          console.error(error)
        }

        break
      default:
        dashboard.sleepy++
    }
  }, 1000 * 60 * config.interval / args[0])
})()
