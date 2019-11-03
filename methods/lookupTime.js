
const lookupTime = () => {
  const date = new Date()
  const time = date.toLocaleString({ timeZone: 'Asia/Shanghai' })

  return time
}

module.exports = lookupTime
