const express = require('express');
const router = express.Router(); //HTTP requests
const MongoClient = require('mongodb').MongoClient; //MongoClient object.  No need to setup models for mongoose.
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect(process.env.DATABASE_CREDENTIALS, (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};


//HTTP GET
// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                //response.data = users;
                res.json(users);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get user by Id
router.get('/users/id', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find({"name": req.query.name, "location": req.query.location})
            .toArray()
            .then((users) => {
                res.send(users);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

//HTTP POST
// Create users
router.post('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .save({name: req.body.name, location: req.body.location}, {w: "majority", wtimeout: 20000})
            .then((wresult) => {
                res.send(wresult);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
    console.log(req.body + 'successfully added to db');
});

// Delete users
router.delete('/users/:_id', (req, res) => {
    console.log(req.params._id);
    var id = JSON.stringify(req.params);
    var query = {_id: "ObjectID("+req.params._id+")"}
    var mongodb = require('mongodb');
    console.log(query);
    connection((db) => {
        db.collection('users')
            .remove({_id: new mongodb.ObjectID(req.params._id)})
            .then((wresult) => {
                res.send(wresult);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;

