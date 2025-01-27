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

/**
 * @swagger
 * tags:
 *   name: Handicap
 *   description: API for managing Handicap data
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Handicap:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique ID of the handicap entry
 *         code:
 *           type: string
 *           description: Code representing the type or category of handicap
 */

/**
 * @swagger
 * /api/handicap/all:
 *   get:
 *     summary: Get all Handicap records
 *     tags: [Handicap]
 *     responses:
 *       200:
 *         description: List of all handicap records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Handicap'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/handicap/{id}:
 *   get:
 *     summary: Get a specific Handicap record by ID
 *     tags: [Handicap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the Handicap record
 *     responses:
 *       200:
 *         description: Handicap details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Handicap'
 *       500:
 *         description: Internal server error
 */
