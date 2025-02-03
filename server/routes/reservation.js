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

router.get('/:id', async function (req, res) {
  try {
      const reservation = await no_sql_db.DataModel.findOne({ idDossier: req.params.id });

      if (reservation.length === 0) {
          return res.status(404).json({ error: "No reservations found for the given idDossier." });
      }
      console.log(reservation);
      const updatedReservations = await data_manip.getDataFromAPIs(reservation._doc);

      res.status(200).json(updatedReservations);
  } catch (err) {
      console.error('Error in GET /:id:', err.message);
      res.status(500).json({ error: err.message });
  }
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

router.get('/byuserid/:id', async function (req, res) {
  try {
      const reservations = await no_sql_db.DataModel.find({ idPMR: req.params.id });
      const reservationsData = reservations.map(doc => doc._doc);
      const updatedReservations = await Promise.all(
          reservationsData.map(async (reservation) => {
              return await data_manip.getDataFromAPIs(reservation);
          })
      );

      res.status(200).json(updatedReservations);
  } catch (err) {
      console.error('Error in GET /byuserid/:id:', err.message);
      res.status(500).json({ error: err.message });
  }
});

router.get('/bygoogleid/:id', async function (req, res) {
  try {
      const reservations = await no_sql_db.DataModel.find({ googleId: req.params.id });
      const reservationsData = reservations.map(doc => doc._doc);
      const updatedReservations = await Promise.all(
        reservationsData.map(async (reservation) => {
              return await data_manip.getDataFromAPIs(reservation);
          })
      );

      res.status(200).json(updatedReservations);
  } catch (err) {
      console.error('Error in GET /bygoogleid/:id:', err.message);
      res.status(500).json({ error: err.message });
  }
});

router.get('/:dossier/:trajet', async function(req, res){
  try{
    const trajet = await no_sql_db.DataModel.findOne({idDossier:req.params.dossier, "sousTrajets.numDossier":req.params.trajet},
      {
        "sousTrajets.$": 1
      });
    console.log(trajet);
    const updatedTrajet = await data_manip.getTrajetFromAPIs(trajet.sousTrajets[0]);

    res.status(200).json(updatedTrajet)
  } catch (err) {
    console.error('Error in GET /:dossier/:trajet', err.message);
    res.status(500).json({ error: err.message });
  }
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
 *         departure:
 *           type: string
 *           description: Departure location
 *         arrival:
 *           type: string
 *           description: Arrival location
 *         departureTime:
 *           type: string
 *           format: date-time
 *           description: Departure time
 *         arrivalTime:
 *           type: string
 *           format: date-time
 *           description: Arrival time
 *     Bagage:
 *       type: object
 *       properties:
 *         bagagesList:
 *           type: array
 *           items:
 *             type: integer
 *           description: List of baggage IDs
 *         specialBagage:
 *           type: string
 *           description: Special baggage type (e.g., oversized baggage)
 *     SpecialAssistance:
 *       type: object
 *       properties:
 *         wheelchair:
 *           type: boolean
 *           description: Whether wheelchair assistance is required
 *         visualAssistance:
 *           type: boolean
 *           description: Whether visual assistance is required
 *         hearingAssistance:
 *           type: boolean
 *           description: Whether hearing assistance is required
 *         otherAssistance:
 *           type: string
 *           description: Other types of assistance required
 *     Security:
 *       type: object
 *       properties:
 *         validDocuments:
 *           type: boolean
 *           description: Whether the documents are valid
 *         documentsExpiry:
 *           type: string
 *           description: Expiry date of documents
 *         dangerousItems:
 *           type: array
 *           items:
 *             type: string
 *           description: List of dangerous items
 *         liquidVolume:
 *           type: string
 *           description: Volume of liquid items
 *         medicalEquipment:
 *           type: string
 *           description: Medical equipment carried
 *         securityQuestions:
 *           type: object
 *           properties:
 *             packedOwn:
 *               type: boolean
 *               description: Whether the passenger packed their own luggage
 *             leftUnattended:
 *               type: boolean
 *               description: Whether luggage was left unattended
 *             acceptedItems:
 *               type: boolean
 *               description: Whether all accepted items were included
 *             receivedItems:
 *               type: boolean
 *               description: Whether received items match the original list
 *             dangerousGoods:
 *               type: boolean
 *               description: Whether dangerous goods are declared
 *         declarations:
 *           type: object
 *           properties:
 *             weaponsFirearms:
 *               type: boolean
 *               description: Whether weapons or firearms are declared
 *             explosives:
 *               type: boolean
 *               description: Whether explosives are declared
 *             flammableMaterials:
 *               type: boolean
 *               description: Whether flammable materials are declared
 *             radioactiveMaterials:
 *               type: boolean
 *               description: Whether radioactive materials are declared
 *             toxicSubstances:
 *               type: boolean
 *               description: Whether toxic substances are declared
 *             compressedGases:
 *               type: boolean
 *               description: Whether compressed gases are declared
 *             illegalDrugs:
 *               type: boolean
 *               description: Whether illegal drugs are declared
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
 *           type: boolean
 *           description: Registration status
 *         Assistance:
 *           type: integer
 *           description: Assistance required status
 *         sousTrajets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SousTrajet'
 *         bagage:
 *           $ref: '#/components/schemas/Bagage'
 *         specialAssistance:
 *           $ref: '#/components/schemas/SpecialAssistance'
 *         security:
 *           $ref: '#/components/schemas/Security'
 *         additionalInfo:
 *           type: object
 *           properties:
 *             emergencyContact:
 *               type: string
 *               description: Emergency contact information
 *             medicalInfo:
 *               type: string
 *               description: Medical information for the passenger
 *             dietaryRestrictions:
 *               type: string
 *               description: Dietary restrictions for the passenger
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