const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://localhost:27017/Space_API'

mongoose.connection.once('open', ()=> {
    console.log('MongoDb connected successfully!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect(){
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
        useUnifiedTopology: true,
    });
}

async function mongoDisconnect(){
    await mongoose.disconnect();
};

module.exports = {
    mongoConnect,
    mongoDisconnect,
}