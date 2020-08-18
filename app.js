
const readConfig = require('./methods/readConfig')

const connect = require('./methods/connect')
const ping = require('./methods/ping')
const executeFileSync = require('./methods/executeFileSync')
const lookupTime = require('./methods/lookupTime')
const getElapsedTime = require('./methods/getElapsedTime')
const wakeUpHosts = require('./methods/wakeUpHosts')

const dashboard = {
  hosts: [],
  elapsed: 0,
  sleepy: 1,
  daytime: 0,
}


const toSleep = (config) => {
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

    console.log(`Sleep after ${delay} second(s)...`)
    setTimeout(async () => {
      if (true) {
        const sleep = await executeFileSync(__dirname + batch)
        resolve(sleep)
      } else {

      }
    }, 1000 * delay)
  })
}

const afterWakeUp = (config) => {
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

  const config = await readConfig(__dirname + '/config_folder/config.json')

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
      const subnet = config.subnet.split('.').slice(0, 3).join('.')
      for (let i = config.start; i <= config.end; i++) {
        const host = subnet + '.' + i
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
      dashboard.elapsed = getElapsedTime(t0, Date.now() + dashboard.daytime)
      console.log(dashboard)

      // determine and statistic
      switch (true) {
        case (dashboard.hosts.length === 0 && dashboard.sleepy >= config.patient):
          dashboard.daytime += Date.now() - t0

          const sleepBuffer = await toSleep(config)
          if (dashboard.env) {
            console.log(sleepBuffer.toString())
          }
          const wakeUpBuffer = await afterWakeUp(config)
          console.log('Wake up stdout:', wakeUpBuffer.toString())
          try {
            wakeUpHosts(config)
          } catch(e) {
            console.error(e)
          }

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
