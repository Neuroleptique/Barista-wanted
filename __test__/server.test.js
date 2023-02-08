const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const mainRoutes = require('../routes/main');

const app = new express()

app.use('/', mainRoutes)

module.exports = {
  mongoose,
  connect: () => {
    mongoose.Promise = Promise;
    mongoose.connect(config.database[process.env.DB_STRING]);
  },
  disconnect: done => {
    mongoose.disconnect(done);
  }
};

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200);
    
  });
});