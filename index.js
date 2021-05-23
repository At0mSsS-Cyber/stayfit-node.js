const express = require('express');
const mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
const fs = require('fs');

let app = express();
let db;
let user = {};

let connectUrl = `mongodb+srv://sample-user:ap7kNj4znYRQmJkS@cluster0.pgv6a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
MongoClient.connect(connectUrl, { useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
    if (err) throw err;
    db = client.db();
    app.listen(8000);
    console.log(`Listening to port: 8000`);
});

/**
 * Express to consider all request with json as middleware
 */
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res, next)=>{
    fs.readFile('home.html', (err, data) => {
        if (err) throw err;
        res.write(data);
        res.end();
    });
});
app.get('/api/profile', (req, res, next)=>{
    fs.readFile('details.html', (err, data) => {
        if (err) throw err;
        res.write(data);
        res.end();
    });
});
app.get('/api/user/profile', (req, res, next)=>{      
        fs.readFile('profile.html', (err, data) => {
        if (err) throw err;
        res.write(data);
        res.end();
        });
});
app.get('/api/user/profile/workout', (req, res, next)=>{
      fs.readFile('workout.html', (err, data) => {
        if (err) throw err;
        res.write(data);
        res.end();
        });
});
app.get('/api/user/profile/weightFlow', (req, res, next)=>{
    fs.readFile('weight_flow.html', (err, data) => {
      if (err) throw err;
      res.write(data);
      res.end();
      });
});
app.get('/api/user/profile/calorie_sheet', (req, res, next)=>{
    fs.readFile('calorie_sheet.html', (err, data) => {
      if (err) throw err;
      res.write(data);
      res.end();
      });
});
app.get('/temp', (req, res, next)=>{
    fs.readFile('temp.html', (err, data) => {
        if (err) throw err;
        res.write(data);
        res.end();
    });
});
app.post('/api/register', (req, res, next) => {
    db.collection('users')
        .insertOne(req.body, (err, item) => {
            res.json(item.ops[0]);
        })
});
app.post('/api/logout', (req, res, next) => {
    user = {};
});
app.post('/api/login', (req, res, next) => {
    db.collection('users')
        .findOne({ username: req.body.username, password: req.body.password }, (err, item) => {
            if (err) throw err;
            if (item == null) {
                res.send("Cannot find user");
                res.end();
            }
            else
                user= item;
                res.send(item);

        })
});
app.post('/api/valid', (req, res, next) => {
    db.collection('users')
        .findOne({ username: req.body.username, password: req.body.password }, (err, item) => {
            if (err) throw err;
            if (item.flag == false) {
                user= item;
                res.send("No details");
                res.end();
            }
            else
            {
                user= item;
                res.send("Yeah there is");
                res.end();
            }
        })
});
app.post('/api/user/details', (req, res, next) => {
    db.collection('users')
        .findOneAndUpdate(
            {username: user.username, password:user.password},
            { $set:  req.body },
            (err, data) => {
                res.send({
                    "result": "success"
                });
            }
        )
});
app.get('/api/user/profile1', (req, res, next) => {
    db.collection('users')
        .findOne({ username: user.username, password:user.password }, ( err, items) => {
            if (err) throw err;
            res.send(items);
        })
});
app.get('/api/home', (req, res, next) => {
    db.collection('users')
        .findOne({ username: user.username, password:user.password }, ( err, items) => {
            if (err) throw err;
            if (items == null)
                res.send({
                    "message": "login plz",

                });
            else
                res.send(items);
        })
});
app.get('/api/user/profile/workout1', (req, res, next) => {
    db.collection('users')
        .findOne({ username: user.username, password:user.password }, ( err, items) => {
            if (err) throw err;
            res.send(items);
        })
});
app.put('/api/user/profile/workout', (req, res, next) => {
    db.collection('users')
        .findOneAndUpdate(
            {_id: new mongodb.ObjectID(user._id)},
            { $set:  {weight : req.body.weight, calender : req.body.cal, last_update : req.body.last} },
            (err, data) => {
                res.send({
                    "result": "success"
                });
            }
        )
});