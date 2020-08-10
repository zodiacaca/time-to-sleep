
const fs = require('fs')

module.exports = function readConfig(dir) {
  const raw = fs.readFileSync(dir)
  const washed = JSON.parse(raw).configuration

  const fArray = washed.from.split('.')
  const tArray = washed.to.split('.')

  return {
    subnet: washed.network,
    netmask: washed.netmask,
    start: parseInt(fArray[fArray.length - 1]),
    end: parseInt(tArray[tArray.length - 1]),
    ports: washed.ports,
    timeout: washed['timeout(ms)'],
    interval: washed['interval(m)'],
    startup: washed.startup_script,
    wakeUp: washed.wake_up_script,
    patient: washed['patient(intervals)'],
    tz: washed.time_zone,
    hosts: washed.buddies,
  }
}
