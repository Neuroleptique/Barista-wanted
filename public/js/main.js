const changeStatusBtn = document.querySelectorAll('.inactiveShift')
const deleteShiftBtn = document.querySelectorAll('.deleteShift')
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
  try {
    // Throw error message if user click save address button without selecting a location
    if (!address.geometry){

        const addressAlert = document.getElementById('addressAlert')
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
        const newAddressInput = document.getElementById('addressArea').appendChild(document.createElement('input'))
        newAddressInput.value = address.formatted_address
        newAddressInput.classList.add("input", "input-bordered")
        newAddressInput.setAttribute('disabled', "")
      }
      // document.getElementById('address').value = address.formatted_address

    }
  } catch(err) {
    console.log(err)
  }
  
}

async function updateProfileCafe() { 
  try{
    const cafeName = document.getElementById('cafeName').value
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const phone = document.getElementById('phone').value
    const address = addressInfo 
    const ig = document.getElementById('ig').value
    const more = document.getElementById('more').value

    const response = await fetch('/profile_cafe', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        cafeName: cafeName,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        ig: ig,
        more: more
      })
    })
    
  }catch(err){
    console.log(err)
  }
}