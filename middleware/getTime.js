const getTime = (date) => {
  const hour = String( new Date(date).getHours() ).padStart(2, '0')
  const minutes = String( new Date(date).getMinutes() ).padEnd(2, '0')
  return hour + ":" + minutes
}

module.exports = getTime