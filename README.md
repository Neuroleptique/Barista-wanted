# Barista Wanted #
A job posting app that uses MVC Architecture, it comes with account creation and user authentication.

## How does this app work?
This app will allows:
- coffee shop users to post their vacant shift request 
- barista users will get notified through email if they opt in to receive notification
- barista users can put themself available for individual shift
- shop owner will then see all available baristas for the shift(s) posted and their contact info

**Link to project:** (work in progress)

## How It's Made:
**Tech used:** HTML, CSS, JavaScript, Node, Express, MongoDB, TailwindCss 

## Packages/Dependencies used 
bcrypt, cloudinary, connect-mongo, daisyui, dotenv, ejs, express, express-flash, express-session, express-flash, mongodb, mongoose, morgan, multer, nodemailer, nodemon, passport, passport-local, tailwindcss, validator

## Install all the dependencies or node packages used for development via Terminal
`npm install` 

## Things to add
- Create a `.env` file in the config folder and add the following as `key: value` 
  - PORT = 3000 
  - DB_STRING = `your MongoDB database URI`
  - CLOUD_NAME = `your cloud_name from cloudinary`
  - API_KEY = `your API_KEY from cloudinary`
  - API_SECRET = `your API_SECRET from cloudinary`
  - MAIL_USER = `your GMAIL account`
  - MAIL_PWD = `your GMAIL APP password`

## Lessons Learned:
Mongoose Schema, Date object manipulation, email sending from server, TailwindCss

## Optimization:
Could use Google place API to give users the option of defining their own display shift data