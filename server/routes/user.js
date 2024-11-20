var express = require('express');
var router = express.Router();
const db = require('../sql-database');
const path = require('path');
const { stringify } = require('querystring');

router.get("/all",function(req,res){
  db.User.findAll()
    .then( users => {
      res.status(200).send(JSON.stringify(users));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

/* GET PMM by ID. */
router.get('/:id', function(req, res) {
  db.User.findByPk(req.params.id)
    .then( user => {
      res.status(200).send(JSON.stringify(user));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

/* POST new PMR*/
router.post('/', function(req, res){
  db.User.create({
    name: req.body.name,
    birthdate: req.body.birthdate,
    email: req.body.email,
    tel: req.body.tel,
    password: req.body.password,
    civility: req.body.civility,
    note: req.body.note,
    googleUUID: req.body.googleUUID
  })
  .then(user => res.status(201).send(user))
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

/* DELETE PMR*/
router.get("/delete/:id", function(req, res){
  db.User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(() => res.status(200).send({ message: 'User deleted successfully' }))
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

module.exports = router;