var express = require('express');
var router = express.Router();
const db = require('../sql-database');
const no_sql_db = require('../nosql-database');
const data_manip = require('../service/data-manipulation');
const path = require('path');
const { stringify } = require('querystring');

router.use(express.json());

router.get('/all',function(req,res){
  no_sql_db.DataModel.find()
  .then( reservations => {
    res.status(200).send(JSON.stringify(reservations));
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

router.get('/:id',function(req,res){
  no_sql_db.DataModel.find({idDossier: req.params.id})
  .then( reservations => {
    res.status(200).send(JSON.stringify(reservations));
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

router.post('/',function(req,res){
  const data = req.body;

  if (!data || !data.idPMR || !data.sousTrajets || !data.bagage) {
    return res.status(400).json({ error: 'Invalid data format.' });
  }

  console.log('Received data:', data);
  data_manip.sendDataToAPIs(data);
  transformedData = data_manip.transformData(data);

  new no_sql_db.DataModel(data).save()
  .then( reservations => {
    res.status(200).send(JSON.stringify(reservations));
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

router.get('/byuserid/:id',function(req,res){
  no_sql_db.DataModel.find({idPMR: req.params.id})
  .then( reservations => {
    res.status(200).send(JSON.stringify(reservations));
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

module.exports = router;