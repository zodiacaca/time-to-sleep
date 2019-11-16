
const net = require('net')
const Socket = net.Socket

const connect = (host, port, timeout) => {
  const socket = new Socket()
  socket.setTimeout(timeout)

  const statics = 'close'

  // socket.on('close', function() {})

  socket.connect(port, host)

  return new Promise(resolve => {
    // connected
    socket.on('connect', () => {
      // console.log(`Port: ${port} is open.`)
      socket.end()

      resolve(port)
    })

    // timed out
    socket.on('timeout', () => {
      socket.destroy()

      resolve(statics)
    })

    // error
    socket.on('error', () => {
      socket.destroy()

      resolve(statics)
    })
  })
}

module.exports = connect
