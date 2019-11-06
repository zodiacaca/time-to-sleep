
const getElapsedTime = (t0, t, tzOffset) => {
  const date = new Date(t - t0)

  return `${date.getHours() - tzOffset}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = getElapsedTime
