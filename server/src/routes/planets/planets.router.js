const express = require('express')
const planetsRouter = express.Router();
// const planetsController = require('./planets.controller')
const { getAllPlanets } = require('./planets.controller')

// planetsRouter.get('/planets', planetsController.getAllPlanets)
planetsRouter.get('/planets', getAllPlanets)

module.exports = planetsRouter;