var express = require('express');
var router = express.Router();
const {db, sequelize} = require('../sql-database');
const path = require('path');
const { stringify } = require('querystring');


/* GET Agent by ID. */
router.get('/:id', function(req, res) {
  db.Agent.findByPk(req.params.id)
    .then( agent => {
      res.status(200).send(JSON.stringify(agent));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

/* POST new Agent*/
router.post('/', function(req, res){
  db.Agent.create({
    name: req.body.name,
    email: req.body.email,
    tel: req.body.tel,
    site: req.body.site,
    password: req.body.password
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

/* DELETE Agent*/
router.get("/delete/:id", function(req, res){
  db.Agent.destroy({
    where: {
      id: req.params.id
    }
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

module.exports = router;