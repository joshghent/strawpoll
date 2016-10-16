var mongo = require('mongodb').MongoClient;

module.exports = function (app) {
    mongo.connect(String(process.env.MONGOHQ_URL), function (err, db) {
        
    })
}