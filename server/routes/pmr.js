var express = require('express');
var router = express.Router();
const {db, sequelize} = require('../sql-database');
const path = require('path');
const { title } = require('process');
const { password } = require('pg/lib/defaults');
const { stringify } = require('querystring');


/* GET PMM by ID. */
router.get('/:id', function(req, res) {
  db.PMR.findByPk(req.params.id)
    .then( pmr => {
      res.status(200).send(JSON.stringify(pmr));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

/* POST new PMR*/
router.post('/', function(req, res){
  db.PMR.create({
    name: req.body.name,
    birthdate: req.body.birthdate,
    email: req.body.email,
    tel: req.body.tel,
    password: req.body.password
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

/* DELETE PMR*/
router.get("/delete/:id", function(req, res){
  db.PMR.destroy({
    where: {
      id: req.params.id
    }
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

module.exports = router;