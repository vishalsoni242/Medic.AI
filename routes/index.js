const express = require('express');
var getJSON = require('get-json');
var sortJsonArray = require('sort-json-array');
var geolocation = require('geolocation');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const router = express.Router();
const Detail = require('../models/Detail');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('index'));
router.get('/demo', (req, res) => res.sendFile('index.html'));

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/healthbot', ensureAuthenticated, (req, res) => {
    res.render('healthbot')
});

router.get('/adddetails', ensureAuthenticated, (req, res) => {
    res.render('adddetails', {user: req.user});
});

router.post('/adddetails', ensureAuthenticated, (req, res) => {
    console.log(req.body);
    const { doctorname, doctoremail,  disease, diagnosis, useremail} = req.body;
    const id = String(req.user.email);
    console.log(id);
    const det = new Detail({
        doctorname,
        doctoremail,
        disease,
        diagnosis,
        useremail
    });
    det
        .save()
        .then(det => {
            req.flash(
              'success_msg',
              'Details Successfully added!'
            );
            res.redirect('/adddetails');
        })
        .catch(err => console.log(err));
});

router.get('/fetchdetails', ensureAuthenticated, (req, res) => {
    var email = req.user.email;
    (async ((reqt, rest) => {
      var proj = {
          _id: false,
          symbol: false
      };
      await (Detail.find({useremail: email}, proj, (err,pro) => {
          res.render('fetchdetails', {
              prev: pro
          })
      }));
    }))();
});

router.get('/map', (req, res) => {
    getJSON('https://places.cit.api.here.com/places/v1/discover/search?q=hospitals&Geolocation=geo%3A21.16%2C72.78&app_id=bFMMgi801IGuJnfUzjxb&app_code=FrPQGhVOUUkINKpcke3iTA', function(error, response){
        //console.log(response);
        var items = response.results.items;
        console.log(items[0].position);
        res.render('map', {
          markers: items,

        })
    })

});

router.get('/medicines', ensureAuthenticated, (req, res) => {
    console.log("name : " + req.query.med);
    var name = req.query.med;
    getJSON('http://www.truemd.in/api/v2/medicines.json?key=7f556015a882f1e1b70779e35723b182&search=' + name, function(error, response){
        //console.log(response);
        //res.send(response);
        //var Tres = JSON.parse(response);
        //console.log(response.suggestions[0].name);
        var len = response.suggestions.length;
        var result = [];
        for(var i = 0; i < len; i++) {
            result.push({
                name: response.suggestions[i].name,
                manufacturer: response.suggestions[i].manufacturer,
                pForm: response.suggestions[i].pForm,
                packSize: response.suggestions[i].packSize,
                mrp: Number(response.suggestions[i].mrp)
            });
        }
        //console.log(len);
        const jsonAsArray = Object.keys(result).map(function (key) {
          return result[key];
        })
        .sort(function (itemA, itemB) {
          return itemA.mrp > itemB.mrp;
        });
        //console.log(jsonAsArray);
        res.render('medicines', {
          name: name,
          medicines: jsonAsArray
        })
    })
});


module.exports = router;
