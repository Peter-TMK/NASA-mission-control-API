const express = require('express')
const launchesRouter = express.Router();
// const planetsController = require('./planets.controller')
const { getAllLaunches } = require('./launches.controller')

// planetsRouter.get('/planets', planetsController.getAllPlanets)
launchesRouter.get('/launches', getAllLaunches);

module.exports = launchesRouter;