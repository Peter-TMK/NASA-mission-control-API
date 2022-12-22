const {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model')

const { getPagination, } = require('../../services/query');

async function httpGetAllLaunches(req, res){
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches); // launches.values() coz launches is not a json. Array.from to convert the values into an array
};

async function httpAddNewLaunch(req, res){
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    // if (launch.launchDate.toString() == 'Invalid Date'){ same as the next code below
    if (isNaN(launch.launchDate)){
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }
    await scheduleNewLaunch(launch);
    console.log(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);

    // if launch doesn't exist
    const existsLaunch = await existsLaunchWithId(launchId);
    if (!existsLaunch){
        return res.status(404).json({
            error: 'Launch not found',
        });
    }

    // if launch exists
    const aborted = await abortLaunchById(launchId);
    if (!aborted){
        return res.status(400).json({
            error: 'Launch not aborted!',
        });
    }
    return res.status(200).json({
        ok: true,
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}