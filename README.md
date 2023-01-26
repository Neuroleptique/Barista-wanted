# Barista Wanted #
A job posting app that uses MVC Architecture, it comes with account creation, email confirmation and password reset features.

## How does this app work?
This app allows:
- coffee shop users to post their vacant shift request 
- barista users will get notified through email if they opt-in for notification service
- barista users can put themself available for individual shift
- shop owner will then see all available baristas for the shift(s) posted and their contact info

**Link to project:** (work in progress)

## How It's Made:
**Tech used:** HTML, CSS, JavaScript, Node, Express, MongoDB, TailwindCSS, Google Maps API

## Packages/Dependencies used 
bcrypt, concurrently, connect-mongo, daisyui, dotenv, ejs, express, express-flash, express-session, express-flash, hcaptcha, method-override, mongodb, mongoose, morgan, nodemailer, nodemon, passport, passport-local, tailwindcss, validator

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

- Create a `config.ejs` file in the `views/partials` folder and add the following line of code:
  `<script
    src="https://maps.googleapis.com/maps/api/js?key=<%- GOOGLE_MAP_API_KEY %> &libraries=places&callback=initAutocomplete" async defer>
  </script>`
  *This ONLY prevents your Google Maps API key from being pushed to repo and triggering security alert. Please still follow [API security best practices](https://developers.google.com/maps/api-security-best-practices) to protect your API key from miseusage. Also, by putting this script tag as a separated partials components, we can call `<%- include('partials/config') -%>` at the end of individual ejs file whenever we need to use google maps service*

## Lessons Learned:
Mongoose Schema, Date object manipulation, email sending from server, token generation and verification, TailwindCSS

## Optimization:
- Could use Google place API to give users the option to define their own display data (in progress)
- Style email content
- Add pagination for shift display area