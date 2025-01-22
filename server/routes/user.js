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
    firstname: req.body.firstname,
    lastname: req.body.lastname,
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

router.get('/byGoogleID/:uuid', function(req, res){
  db.User.findOne({
    where: { googleUUID: req.params.uuid }
  }).then(user => res.status(201).send(user))
  .catch( err => {
    res.status(500).send(JSON.stringify(err));
  });
})

/* POST Edit User*/
router.post('/:id', function(req, res){
  db.User.update({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
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

router.post('/byGoogleID/:uuid', function(req, res){
  db.User.update({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    tel: req.body.tel,
    password: req.body.password,
    civility: req.body.civility,
    note: req.body.note,
    handicap: req.body.handicap
  },
    {
      where: {
        id: req.params.uuid,
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
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - birthdate
 *         - email
 *         - tel
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the user
 *         firstname:
 *           type: string
 *           description: The firstname of the user
 *         lastname:
 *           type: string
 *           description: The lastname of the user
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The birthdate of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         tel:
 *           type: integer
 *           description: The phone number of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         civility:
 *           type: string
 *           description: Civility of the user (e.g., Mr., Ms.)
 *         note:
 *           type: string
 *           description: Additional notes about the user
 *         handicap:
 *           type: integer
 *           description: Foreign key referencing a handicap
 *         googleUUID:
 *           type: string
 *           description: The Google UUID of the user
 *         Handicap:
 *           type: object
 *           description: Associated handicap details
 *           $ref: '#/components/schemas/Handicap'
 *     Handicap:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the handicap
 *         code:
 *           type: string
 *           description: The code of the handicap
 */

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               tel:
 *                 type: integer
 *               password:
 *                 type: string
 *               civility:
 *                 type: string
 *               note:
 *                 type: string
 *               handicap:
 *                 type: integer
 *               googleUUID:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   post:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               tel:
 *                 type: integer
 *               password:
 *                 type: string
 *               civility:
 *                 type: string
 *               note:
 *                 type: string
 *               handicap:
 *                 type: integer
 *               googleUUID:
 *                 type: string
 *     responses:
 *       201:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/delete/{id}:
 *   get:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/byGoogleID/{uuid}:
 *   get:
 *     summary: Get a user by Google UUID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: Google UUID of the user
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Update a user by Google UUID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: Google UUID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               tel:
 *                 type: integer
 *               password:
 *                 type: string
 *               civility:
 *                 type: string
 *               note:
 *                 type: string
 *               handicap:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
