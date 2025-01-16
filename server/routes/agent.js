var express = require('express');
var router = express.Router();
const {db, sequelize} = require('../sql-database');
const path = require('path');
const { stringify } = require('querystring');

router.use(express.json());

/* GET all Agent*/
router.get("/all",function(req,res){
  db.Agent.findAll()
    .then( agents => {
      res.status(200).send(JSON.stringify(agents));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

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
    email: req.body.email,
    password: req.body.password,
    entreprise: req.body.entreprise
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