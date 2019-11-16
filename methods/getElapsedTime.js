
const getHour = (t) => {
  return Math.floor(t / (1000 * 60 * 60))
}
const getMinute = (t) => {
  const m = t % (1000 * 60 * 60)

  return Math.floor(m / (1000 * 60))
}
const getSecond = (t) => {
  const s = t % (1000 * 60)

  return Math.floor(s / 1000)
}

const getElapsedTime = (t0, t) => {
  t = t - t0

  return `${getHour(t)}:${getMinute(t)}:${getSecond(t)}`
}

module.exports = getElapsedTime
