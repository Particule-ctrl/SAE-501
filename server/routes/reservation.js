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

router.get('/bygoogleid/:id',function(req,res){
  no_sql_db.DataModel.find({googleId: req.params.id})
  .then( reservations => {
    res.status(200).send(JSON.stringify(reservations));
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

router.get('/setDone/:dossier/:trajet', function(req,res){
  no_sql_db.DataModel.updateOne({idDossier:req.params.dossier, "sousTrajets.numDossier":req.params.trajet}, { $set: {"sousTrajets.$.statusValue":2}})
  .then( reservation => {
    res.status(200).send(JSON.stringify(reservation));
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

router.get('/setOngoing/:dossier/:trajet', function(req,res){
  no_sql_db.DataModel.updateOne({idDossier:req.params.dossier, "sousTrajets.numDossier":req.params.trajet}, { $set: {"sousTrajets.$.statusValue":1}})
  .then( reservation => {
    res.status(200).send(JSON.stringify(reservation));
  })
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API for managing reservations and sousTrajets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SousTrajet:
 *       type: object
 *       properties:
 *         BD:
 *           type: string
 *           description: The type of booking or transport (e.g., AF, SNCF)
 *         numDossier:
 *           type: integer
 *           description: Sub-reservation dossier number
 *         statusValue:
 *           type: integer
 *           description: Status of the sousTrajet (0 = pending, 1 = ongoing, 2 = done)
 *     Reservation:
 *       type: object
 *       properties:
 *         idDossier:
 *           type: integer
 *           description: Reservation dossier ID
 *         idPMR:
 *           type: integer
 *           description: PMR (Person with Reduced Mobility) ID
 *         googleId:
 *           type: string
 *           description: Google UUID associated with the reservation
 *         enregistre:
 *           type: integer
 *           description: Registration status
 *         Assistance:
 *           type: integer
 *           description: Assistance required status
 *         sousTrajets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SousTrajet'
 *         bagage:
 *           type: array
 *           items:
 *             type: integer
 *           description: List of baggage IDs
 */

/**
 * @swagger
 * /api/reservation/all:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/{id}:
 *   get:
 *     summary: Get a reservation by dossier ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The dossier ID of the reservation
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid data format
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/byuserid/{id}:
 *   get:
 *     summary: Get reservations by PMR ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The PMR ID to filter reservations
 *     responses:
 *       200:
 *         description: List of reservations for the given PMR ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/bygoogleid/{id}:
 *   get:
 *     summary: Get reservations by Google ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Google UUID to filter reservations
 *     responses:
 *       200:
 *         description: List of reservations for the given Google ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/setDone/{dossier}/{trajet}:
 *   get:
 *     summary: Set a sousTrajet status to "done"
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: dossier
 *         required: true
 *         schema:
 *           type: integer
 *         description: The dossier ID
 *       - in: path
 *         name: trajet
 *         required: true
 *         schema:
 *           type: integer
 *         description: The trajet ID to update
 *     responses:
 *       200:
 *         description: SousTrajet status updated to "done"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reservation/setOngoing/{dossier}/{trajet}:
 *   get:
 *     summary: Set a sousTrajet status to "ongoing"
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: dossier
 *         required: true
 *         schema:
 *           type: integer
 *         description: The dossier ID
 *       - in: path
 *         name: trajet
 *         required: true
 *         schema:
 *           type: integer
 *         description: The trajet ID to update
 *     responses:
 *       200:
 *         description: SousTrajet status updated to "ongoing"
 *       500:
 *         description: Internal server error
 */
