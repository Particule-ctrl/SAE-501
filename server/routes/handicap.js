var express = require('express');
var router = express.Router();
const db = require('../sql-database');
const path = require('path');
const { stringify } = require('querystring');

router.use(express.json());

/* GET all Handicap*/
router.get("/all",function(req,res){
  db.Handicap.findAll()
    .then( handicaps => {
      res.status(200).send(JSON.stringify(handicaps));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

/* GET Handicap by ID. */
router.get('/:id', function(req, res) {
  db.Handicap.findByPk(req.params.id)
    .then( handicap => {
      res.status(200).send(JSON.stringify(handicap));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

module.exports = router;