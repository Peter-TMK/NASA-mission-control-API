const axios = require('axios');

const launchesDb = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NMUBER = 100;
// const launches = new Map();

// let latestFlightNumber = 100;

const launch = {
    flightNumber: 100, // flight_number
    mission: 'Tunde Exploration X', // name
    rocket: 'Explorer IS1', // corresponds to rocket.name
    launchDate: new Date('September 24, 2030'), // date_local
    target: 'Kepler-62 f', // not applicable
    customers: ['Tunde', 'NASA'], // payload.customers for each payload
    upcoming: true, // upcoming
    success: true, // success
};

saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
    console.log('Downloading launch data...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

if (response.status !== 200){
    console.log('Problem downloading launch data!');
    throw new Error('Launch data download failed!')
}

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`)

        //TODO: populate launches collection...
        await saveLaunch(launch);
    }
}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if(firstLaunch){
        console.log('Launch data already loaded!');
    } else {
        await populateLaunches();
    }
};

async function findLaunch(filter){
    return await launchesDb.findOne(filter);
}

// launches.set(launch.flightNumber, launch);
// launches.get(100);

async function existsLaunchWithId(launchId){
    return await findLaunch({
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
    await launchesDb.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet) {
        throw new Error('No matching planet found!')
    }

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
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}