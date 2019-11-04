
const getElapsedTime = (t0, t) => {
  const date = new Date(t - t0)

  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = getElapsedTime
