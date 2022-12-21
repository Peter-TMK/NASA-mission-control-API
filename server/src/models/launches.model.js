const launchesDb = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NMUBER = 100;
// const launches = new Map();

// let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Tunde Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('September 24, 2030'),
    target: 'Kepler-62 f',
    customers: ['Tunde', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

// launches.set(launch.flightNumber, launch);
// launches.get(100);

async function existsLaunchWithId(launchId){
    return await launchesDb.findOne({
        flightNumber: launchId,
    });
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDb
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NMUBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(){
    return await launchesDb
    .find({}, { '_id':0, '__v':0 });
    // return Array.from(launches.values());
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet) {
        throw new Error('No matching planet found!')
    }

    await launchesDb.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Tunde', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//         success: true,
//         upcoming: true,
//         customers: ['Tunde', 'NASA'],
//         flightNumber: latestFlightNumber,
//         })
//     );
// }

async function abortLaunchById(launchId){
    const aborted = await launchesDb.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });
    
    return aborted.acknowledged === true && aborted.modifiedCount === 1;
    
    // return aborted;
    // return aborted.ok === 1 && aborted.nModified === 1;
    // launches.delete(launchId);
    // const aborted =  launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
 }

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}