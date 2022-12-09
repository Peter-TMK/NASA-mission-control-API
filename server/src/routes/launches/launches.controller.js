const { launches } = require('../../models/launches.model')

function getAllLaunches(req, res){
    return res.status(200).json(Array.from(launches.values())) // launches.values() coz launches is not a json. Array.from to convert the values into an array
};

module.exports = {
    getAllLaunches,
}