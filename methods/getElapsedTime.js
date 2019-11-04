
const getElapsedTime = (t, t0) => {
  const date = new Date(t - t0)

  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = getElapsedTime
