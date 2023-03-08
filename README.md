# Barista Wanted #
A job posting app that uses MVC Architecture, it comes with account creation, email confirmation and password reset features.

## How does this app work?
This app allows:
- coffee shop users to post their vacant shift request 
- barista users will get notified through email if they opt-in for notification service
- barista users can put themself available for individual shift
- shop owner will then see all available baristas for the shift(s) posted and their contact info
- users can add and edit their personal information at profile page

**Link to project:** https://baristawanted.cyclic.app/

## How It's Made:
**Tech used:** EJS, CSS, JavaScript, Node, Express, MongoDB, TailwindCSS, Google Maps API, Cloudinary

## Packages/Dependencies used 
bcrypt, concurrently, cloudinary, connect-mongo, daisyui, dotenv, ejs, express, express-flash, express-session, express-flash, hcaptcha, method-override, mongodb, mongoose, morgan, nodemailer, nodemon, passport, passport-local, tailwindcss, validator

## Install all the dependencies or node packages used for development via Terminal
`npm install` 

## Things to add
- Create a `config.env` file in the `config` folder and add the following as `key: value` 
  - PORT = 3000 
  - DB_STRING = `your MongoDB database URI`
  - BCRYPT_SALT = `Salt rounds value for password hashing`
  - MAIL_SERVICE = `gmail`
  - MAIL_USER = `your GMAIL account`
  - MAIL_PWD = `your GMAIL APP password`
  - HCAPTCHA_SECRET = `your hCaptcha secret`
  - GOOGLE_MAP_API_KEY = `your Google Maps Places API key`
  - CLOUD_NAME = `your cloudinary cloud name`
  - CLOUD_API_KEY =  `your cloudinary API key`
  - CLOUD_API_SECRET = `your cloudinary API secret`

## Lessons Learned:
Mongoose, Date object manipulation, email sending from the server, token generation and verification, TailwindCSS, Cloudinary upload and image cropping

## Optimization:
- Could use Google place API to give users the option to define their own display data (in progress)
- Style email content
- Add pagination for shift display area
