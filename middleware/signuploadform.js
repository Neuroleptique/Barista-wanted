const cloudinary = require("../middleware/cloudinary");
const apiSecret = cloudinary.config().api_secret;

// Server-side function used to sign an upload with a couple of
// example eager transformations included in the request.
const signuploadform = () => {
  const timestamp = Math.round((new Date).getTime()/1000);

  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    eager: 'c_thumb,h_150,w_150,g_face',
    folder: 'profile_photos',
    allowed_formats: 'jpg,jpeg,png,bmp,gif'
    }, apiSecret);

  return { timestamp, signature }
}

module.exports = {
  signuploadform
}