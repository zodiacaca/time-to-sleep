
const readConfig = require('./methods/readConfig')
const config = readConfig(__dirname + '/config_folder/config.json')

const connect = require('./methods/connect')
const ping = require('./methods/ping')
const executeFileSync = require('./methods/executeFileSync')
const lookupTime = require('./methods/lookupTime')
const getElapsedTime = require('./methods/getElapsedTime')

const dashboard = {
  hosts: [],
  elapsed: 0,
  sleepy: 1,
  daytime: 0,
}


const toSleep = () => {
  // message
  console.log('No host, time to sleep.')
  console.log(lookupTime(config.tz))

  // reset
  dashboard.hosts = []
  dashboard.sleepy = 1

  // execute
  return new Promise(async (resolve) => {
    let delay, batch
    if (dashboard.env) {
      delay = 1
      batch = '/t.bat'
    } else {
      delay = 45
      batch = '/sleep.bat'
    }

    setTimeout(() => {
      if (true) {
        const sleep = await executeFileSync(__dirname + batch)
        resolve(sleep)
      } else {

      }
    }, 1000 * delay)
  })
}

const afterWakeUp = () => {
  return new Promise(async (resolve) => {
    const wake = await executeFileSync(__dirname + config.wakeUp)
    resolve(wake)
  })
}

;(async () => {
  // 0: time speed multiply
  const args = process.argv.slice(2)
  if (args[0] === undefined) {
    args[0] = 1
  } else {
    dashboard.env = 'test'
  }

  // startup script
  const startupBuffer = await executeFileSync(__dirname + config.startup)
  console.log('Startup stdout:', startupBuffer.toString())
  console.log(`First scan will be ${config.interval} minute(s) later...`)

  // time stuff
  let t0 = Date.now()

  let busy = false
  // scan loop
  const interval = setInterval(async () => {
    if (!busy) {
      busy = true
      // scan subnet
      dashboard.hosts = []
      for (let i = config.start; i <= config.end; i++) {
        const host = config.subnet + i
        let stat = false
        for (let ii = 0; ii <= config.ports.length; ii++) {
          for (let iii = 1; iii <= 3; iii++) {
            const status = await connect(host, config.ports[ii], config.timeout * iii)
            if (typeof(status) === "number") {
              stat = true
              break
            }
          }

          if (stat) {
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
      dashboard.elapsed = getElapsedTime(t0, Date.now() + dashboard.daytime, config.tzo)
      console.log(dashboard)

      // determine and statistic
      switch (true) {
        case (dashboard.hosts.length === 0 && dashboard.sleepy >= config.patient):
          dashboard.daytime += Date.now() - t0

          const sleepBuffer = await toSleep()
          if (dashboard.env) {
            console.log(sleepBuffer.toString())
          }
          const wakeUpBuffer = await afterWakeUp()
          console.log('Wake up stdout:', wakeUpBuffer.toString())

          t0 = Date.now()

          busy = false

          break
        default:
          dashboard.sleepy++

          busy = false
      }
    } else {
      console.log('Skip this loop...')
    }
  }, 1000 * 60 * config.interval / args[0])
})()
