const express = require('express');
var getJSON = require('get-json');
var sortJsonArray = require('sort-json-array');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('index'));
router.get('/demo', (req, res) => res.sendFile('index.html'));

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/med', (req, res) => {
    console.log(req.query.med);
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
