const changeStatusBtn = document.querySelectorAll('.inactiveShift')
const deleteShiftBtn = document.querySelectorAll('.deleteShift')
const availableToWorkBtn = document.querySelectorAll('.available')
const shiftDateField = document.getElementById('datefield')

// Limit shift start date input to accept value no earlier than the current date
shiftDateField.addEventListener('focus', minDate)

function minDate() {
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1
  let yyyy = today.getFullYear()
  let hh = today.getHours()
  let min = today.getMinutes()

  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < '10') {
    mm = '0' + mm
  }
  today = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min
  shiftDateField.setAttribute('min', today)
}

// Change shift activeStatus to false
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

// Delete shift
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

// Put themself (barista) available for the shift
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

