var express = require('express');
var router = express.Router();
const db = require('../sql-database');
const path = require('path');
const { stringify } = require('querystring');

router.use(express.json());

/* GET all User*/
router.get("/all",function(req,res){
  db.User.findAll()
    .then( users => {
      res.status(200).send(JSON.stringify(users));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

/* GET User by ID. */
router.get('/:id', function(req, res) {
  db.User.findByPk(req.params.id)
    .then( user => {
      res.status(200).send(JSON.stringify(user));
    })
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

/* POST new User*/
router.post('/', function(req, res){
  db.User.create({
    name: req.body.name,
    birthdate: req.body.birthdate,
    email: req.body.email,
    tel: req.body.tel,
    password: req.body.password,
    civility: req.body.civility,
    note: req.body.note,
    handicap: req.body.handicap,
    googleUUID: req.body.googleUUID
  })
  .then(user => res.status(201).send(user))
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

/* POST Edit User*/
router.post('/:id', function(req, res){
  db.User.update({
    name: req.body.name,
    email: req.body.email,
    tel: req.body.tel,
    password: req.body.password,
    civility: req.body.civility,
    note: req.body.note,
    handicap: req.body.handicap
  },
    {
      where: {
        id: req.params.id,
      },
    },
  )
  .then(user => res.status(201).send(user))
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});


/* DELETE User*/
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