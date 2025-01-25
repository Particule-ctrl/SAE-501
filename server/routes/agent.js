var express = require('express');
var router = express.Router();
const db = require('../sql-database');
const path = require('path');
const { stringify } = require('querystring');
const data_manip = require('../service/data-manipulation');


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
    entreprise: req.body.entreprise,
    googleUUID: req.body.googleUUID,
    tel: req.body.tel
  })
  .then( agent => 
    res.status(200).send(JSON.stringify(agent))
  )
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

router.get('/getTrajetsFromAgent/:id',async function(req,res){
  try{
    const agent = await db.Agent.findByPk(req.params.id);
    const voyages = await data_manip.getTrajetsForPlace(agent);
    res.status(200).json(voyages)
  } catch (err) {
    console.error('Error in GET /getTrajetsFromAgent/:id', err.message);
    res.status(500).json({ error: err.message });
  }
})

router.get('/getTrajetsFromUuid/:uuid',async function(req,res){
  try{
    const agent = await db.Agent.findOne({
      where: { googleUUID: req.params.uuid }
    })
    const voyages = await data_manip.getTrajetsForPlace(agent);
    res.status(200).json(voyages)
  } catch (err) {
    console.error('Error in GET /getTrajetsFromUuid/:uuid', err.message);
    res.status(500).json({ error: err.message });
  }
  
})


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Agent management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - entreprise
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the agent
 *         email:
 *           type: string
 *           description: The email of the agent
 *         password:
 *           type: string
 *           description: The password of the agent
 *         entreprise:
 *           type: string
 *           description: The enterprise associated with the agent
 */

/**
 * @swagger
 * /api/agent/all:
 *   get:
 *     summary: Get all agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: List of all agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/agent/{id}:
 *   get:
 *     summary: Get an agent by ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the agent
 *     responses:
 *       200:
 *         description: Agent details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/agent/:
 *   post:
 *     summary: Create a new agent
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the agent
 *                 example: agent@example.com
 *               password:
 *                 type: string
 *                 description: The password of the agent
 *                 example: securepassword
 *               entreprise:
 *                 type: string
 *                 description: The enterprise associated with the agent
 *                 example: TechCorp
 *     responses:
 *       201:
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/agent/delete/{id}:
 *   get:
 *     summary: Delete an agent by ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the agent to delete
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Internal server error
 */
