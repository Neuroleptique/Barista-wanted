const changeStatusBtn = document.querySelectorAll('.inactiveShift')
const deleteShiftBtn = document.querySelectorAll('.deleteShift')
const availableToWorkBtn = document.querySelectorAll('.available')
const notAvailableBtn = document.querySelectorAll('.not-available')
const shiftDateField = document.querySelectorAll('.date-input')

// Cafe: Restrict shift starting date input to only accept value no earlier than the current date
Array.from(shiftDateField).forEach(input => {
  input.addEventListener('focus', minDate)
})

function minDate() {
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1
  let yyyy = today.getFullYear()
  let hh = today.getHours()
  let min = today.getMinutes()

  if (dd < '10') {
    dd = '0' + dd
  }
  if (mm < '10') {
    mm = '0' + mm
  }
  if (hh < '10') {
    hh = '0' + hh
  }
  if (min < '10') {
    min = '0' + min
  }
  today = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min
  console.log(today)
  document.getElementById('datefield').setAttribute('min', today)
}

// Cafe: Make shift inavtive
Array.from(changeStatusBtn).forEach(btn => {
  btn.addEventListener('click', changeStatusFalse)
})

async function changeStatusFalse() {
  console.log('click')
  const shiftID = this.parentNode.parentNode.dataset.id
  try{
    const response = await fetch('cafe/inactiveShift', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        shiftID: shiftID
      }),
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  }catch(err){
    console.log(err)
  }
}

// Cafe: Delete shift
Array.from(deleteShiftBtn).forEach(btn => {
  btn.addEventListener('click', deleteShift)
})

async function deleteShift() {
  const shiftID = this.parentNode.parentNode.dataset.id
  try {
    const response = await fetch('cafe/deleteShift', {
      method: 'delete',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        shiftID: shiftID
      }),
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch (err) {
    console.log(err)
  }
}

// Barista: Put themself (barista) available for the shift
Array.from(availableToWorkBtn).forEach(btn => {
  btn.addEventListener('click', availableToWork)
})

async function availableToWork() {
  const shiftID = this.parentNode.parentNode.dataset.id
  try {
    const response = await fetch('barista/putAvailable', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        shiftID: shiftID
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch(err) {
    console.log(err)
  }
}

// Barista: Remove themself from being available for the shift
Array.from(notAvailableBtn).forEach(btn => {
  btn.addEventListener('click', notAvailableToWork)
})

async function notAvailableToWork() {
  const shiftID = this.parentNode.parentNode.dataset.id
  try {
    const response = await fetch('barista/removeAvailable', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        shiftID: shiftID
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch(err) {
    console.log(err)
  }
}

