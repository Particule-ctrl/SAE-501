var express = require('express');
var router = express.Router();
const {db, sequelize} = require('../sql-database');
const path = require('path');
const { stringify } = require('querystring');


/* GET Accompagnateur by ID. */
router.get('/:id', function(req, res) {
  db.Accompagnateur.findByPk(req.params.id)
    .then( pmr => {
      res.status(200).send(JSON.stringify(pmr));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

/* POST new Accompagnateur*/
router.post('/', function(req, res){
  db.Accompagnateur.create({
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

/* DELETE Accompagnateur*/
router.get("/delete/:id", function(req, res){
  db.Accompagnateur.destroy({
    where: {
      id: req.params.id
    }
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

module.exports = router;