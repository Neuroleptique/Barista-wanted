const profileUpdate = document.getElementById('updateProfile')




// update BARISTA profile
profileUpdate.addEventListener('click', updateProfile)

async function updateProfile() {
  const firstName = document.getElementById('firstName').value
  const lastName = document.getElementById('lastName').value
  const email = document.getElementById('email').value
  const phone = document.getElementById('phone').value
  const ig = document.getElementById('ig').value
  const exp = document.getElementById('exp').value
  const more = document.getElementById('more').value
  const notification = document.getElementById('notification').value
  const userID = document.getElementById('userID').value

  console.log(userID)
  try {
    const response = await fetch('profile_barista', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        ig: ig,
        exp: exp,
        more: more,
        notification: notification,
        userID: userID,
      }),
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch (err) {
    console.log(err)
  }

}