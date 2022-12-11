const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Tunde Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('September 24, 2030'),
    target: 'Tunde-442 b',
    customer: ['Tunde', 'NASA'],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);
// launches.get(100);

function existsLaunchWithId(launchId){
    return launches.has(launchId);
}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Tunde', 'NASA'],
        flightNumber: latestFlightNumber,
        })
    );
}

function abortLaunchById(launchId){
    // launches.delete(launchId);
    const aborted =  launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
 }

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}