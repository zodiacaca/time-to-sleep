
const os = require('os')
const net = require('net')
const dgram = require('dgram')

const createWoLPacket = (mac) => {
  mac = mac.replace(/:/g, '')

  return Buffer.from('ff'.repeat(6) + mac.repeat(16), 'hex')
}

const getBroadcastAddr = (ip, netmask) => {
  const ipArray = ip.split('.').map(s => parseInt(s, 10))
  const maskArray = netmask.split('.').map(s => parseInt(s, 10))
  const addr = []
  for (let i = 0; i < 4; i++) {
    addr.push(ipArray[i] | maskArray[i] ^ 255)
  }

  return addr.join('.')
}

const getInterfaceInfo = (cfg) => {
  let count = 20
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const ifaces = os.networkInterfaces()
      for (let n in ifaces) {
        ifaces[n].forEach(iface => {
          if (iface.internal || !net.isIPv4(iface.address)) return

          const ipBroadcastAddr = getBroadcastAddr(iface.address, iface.netmask)
          const cfgBroadcastAddr = getBroadcastAddr(cfg.subnet, cfg.netmask)

          if (ipBroadcastAddr == cfgBroadcastAddr) {
            iface.broadcastAddr = ipBroadcastAddr

            resolve(iface)
            clearInterval(interval)
          }
        })
      }
      if (!interval._destroyed) {
        console.log('Network not ready.')
      }
      if (--count == 0) {
        reject('Reached maximum attempts.')
        clearInterval(interval)
      }
    }, 1000)
  })
}

const wakeUpHosts = (config) => {
  return new Promise(async (resolve, reject) => {
    const info = {}
    try {
      Object.assign(info, await getInterfaceInfo(config))
    } catch(e) {
      console.error(e)
    }
    config.hosts.forEach(function(host) {
      try {
        const from = info.address
        const broadcastAddr = info.broadcastAddr
        const packet = createWoLPacket(host)
        const socket = dgram.createSocket(net.isIPv6(broadcastAddr) ? 'udp6' : 'udp4')
        // socket.unref()

        socket.bind(0, from, () => {
          socket.setBroadcast(true)
          socket.once('error', (err) => reject(err))
          socket.send(packet, 0, packet.length, 9, broadcastAddr, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }

            socket.close()
          })
        })
      } catch(error) {
        console.error(error)
      }
    })
  })
}

module.exports = wakeUpHosts
