# Barista Wanted #
A simple job posting app that uses MVC Architecture, it comes with account creation and user authentication.

## How does this app work?
This app will allows:
- coffee shop users to post their barista wanted request 
- barista users will get notified through email if opt in to receive notification
- barista users can put themself available for specific shift
- shop owner will then see all available brista for the shift(s) posted and their contact info

**Link to project:** (work in progress)

## How It's Made:
**Tech used:** HTML, CSS, JavaScript, Node, Express, MongoDB 

## Packages/Dependencies used 
bcrypt, cloudinary, connect-mongo, dotenv, ejs, express, express-flash, express-session, express-flash, mongodb, mongoose, morgan, multer, nodemailer, nodemon, passport, passport-local, validator

## Install all the dependencies or node packages used for development via Terminal
`npm install` 

## Things to add
- Create a `.env` file in the config folder and add the following as `key: value` 
  - PORT = 3000 
  - DB_STRING = `your MongoDB database URI`
  - CLOUD_NAME = `your cloud_name from cloudinary`
  - API_KEY = `your API_KEY from cloudinary`
  - API_SECRET = `your API_SECRET from cloudinary`
  - MAIL_USER = `your GMAIL ACCOUNT`
  - MAIL_PWD = `your GMAIL APP PASSWORD`

## Lessons Learned:
Mongoose Schema, Date object manipulation, email sending from server
