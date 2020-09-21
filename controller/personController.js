var Person = require("../models/userModel.js");

exports.getAllPersons = function(req, res) {
    Person.getAllPersons(function(err, persons) {
        if(err) {
            res.send(err);
        }

        res.send(persons)
    });
}

exports.getNewPersons = function(req, res) {
    console.log(req.query);

    let lastId = req.query.lastId;

    Person.getNewPersons(lastId, function(err, persons) {
        if(err) {
            res.send(err);
        }

        res.send(persons)
    });
}