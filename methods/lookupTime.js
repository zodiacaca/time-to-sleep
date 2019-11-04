
const lookupTime = (tz) => {
  const date = new Date()
  const time = date.toLocaleString({ timeZone: tz })

  return time
}

module.exports = lookupTime
