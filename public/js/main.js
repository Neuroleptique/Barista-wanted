const changeStatusBtn = document.querySelectorAll('.inactiveShift')
const removeShiftBtn = document.querySelectorAll('.removeShift')
const availableToWorkBtn = document.querySelectorAll('.available')
const notAvailableBtn = document.querySelectorAll('.not-available')
const shiftDateField = document.querySelectorAll('.date-input')


// Dashboard_cafe: Restrict shift starting date input to only accept value no earlier than the current date
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

// Cafe: remove shift from being displayed on cafe dashboard
Array.from(removeShiftBtn).forEach(btn => {
  btn.addEventListener('click', removeShiftDisplay )
})

async function removeShiftDisplay() {
  const shiftID = this.parentNode.parentNode.dataset.id
  try {
    const response = await fetch('cafe/putCafeDisplayFalse', {
      method: 'put',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        shiftID: shiftID
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch (error) {
    console.error(error)    
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


// Google Maps API
let autocomplete
let addressInfo = new Object()
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'), {
      types: ['establishment'],
      componentRestrictions: { 'country': ['CA'] },
      fields: ['place_id', 'geometry', 'formatted_address']
    });

  autocomplete.addListener('place_changed', onPlaceChanged)
}

function onPlaceChanged() {
  let place = autocomplete.getPlace()

  if (!place.geometry) {
    document.getElementById('autocomplete').placeholder = 'Enter your coffee shop name'
  } else {
    addressInfo.geometry = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    }
    addressInfo.place_id = place.place_id
    addressInfo.formatted_address = place.formatted_address
    console.log(addressInfo)
    document.getElementById('placeDetails').innerHTML = place.formatted_address
  }
}

async function updateAddress() {
  const address = addressInfo
  const addressAlert = document.getElementById('addressAlert')
  try {
    // Throw error message if user click save address button without selecting a location
    if (!address.geometry){        
        addressAlert.classList.add('alert-error')
        addressAlert.innerHTML = 'You have not select a location'

    } else {
    
      const response = await fetch('cafe/putAddressCafe', {
        method: 'put',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          place: address
        })
      })
      
      const data = await response.json()
      console.log(data)
      if(data == 'Address added') {
        // Temporarily show the new address at address area as page reload is not needed
        const newAddressInput = document.getElementById('addressArea').appendChild(document.createElement('input'))
        newAddressInput.value = address.formatted_address
        newAddressInput.classList.add("input", "input-bordered")
        newAddressInput.setAttribute('disabled', "")

        addressAlert.classList.add('alert-success')
        addressAlert.innerHTML = data
      }else if (data == 'Address already exists') {
        addressAlert.classList.add('alert-error')
        addressAlert.innerHTML = data
      }
    }
  } catch(err) {
    console.log(err)
  }
  
}
