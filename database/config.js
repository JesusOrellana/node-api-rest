const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        mongoose.connect( process.env.MONGODB_CNN ,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Base de datos Operativa');
    } catch (error) {
        console.log('Base de datos no Operativa');
    }
}

module.exports = dbConnection;