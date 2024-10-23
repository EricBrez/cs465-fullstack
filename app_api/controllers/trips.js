const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register Model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async(req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();

        // Uncomment the following line to show results of query
        // on the console
        //console.log(q);

    if (!q) {
         // Database returned no data
         return res
                .status(404)
                .json(err);
    }
    else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

// GET: /trips/:tripCode = lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async(req, res) => {
    const q = await Model
        .find({'code': req.params.tripCode}) // Return single record
        .exec();

        // Uncomment the following line to show results of query
        // on the console
        //console.log(q);

    if (!q) {
         // Database returned no data
         return res
                .status(404)
                .json(err);
    }
    else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

// POST: /trips - Adds a new Trip
//Regardless of outcome, response must include HTML status code
//and JSON message to the requesting client
const tripsAddTrip = async(req, res)=> {
    getUser(req, res,
        (req, res) => {
            Trip
                .create({
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                (err, trip) =>{
                    if (err) {
                        return res
                            .status(400)
                            .json(err);
                    }
                    else {
                        return res
                            .status(201)
                            .json(trip);
                    }
                });
        }
    );
}

//PUT: /trips/:tripCode - Adds a new Trip
//Regardless of outcome, response must include HTML status code
//and JSON message to the requesting client
const tripsUpdateTrip = async(req, res) => {
    getUser(req, res,
        (req, res) => {
            Trip
            .findOneAndUpdate(
                {'code':req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                }, {new: true})
                .then(trip => {
                    if (!trip) {
                        return res
                            .status(404)
                            .send({
                                message: "Trip not found with code" + req.params.tripCode
                            });
                    }
                    res.send(trip);
                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res
                            .status(404)
                            .send({
                                message: "Trip not found with code" + req.params.tripCode
                            });
                    }
                    return res
                        .status(500)
                        .json(err);
                });
        }
    );
}

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};