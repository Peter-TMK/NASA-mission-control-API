const express = require('express');
// const { httpAbortLaunch } = require('../../../../client/src/hooks/requests');
const launchesRouter = express.Router();
// const planetsController = require('./planets.controller')
const {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
} = require('./launches.controller')

// planetsRouter.get('/planets', planetsController.getAllPlanets)
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;