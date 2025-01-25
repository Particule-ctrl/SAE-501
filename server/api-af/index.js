const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const app = express();
const port = 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration Sequelize pour MySQL
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
});

// Définition du modèle Item
const Reservations = sequelize.define('Reservation', {
    numDossier: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    departure: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    arrival: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    departureTime: {
        type: Sequelize.DATE,
        allowNull: false
    },
    arrivalTime: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

const Agent = sequelize.define('Agent',{
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tel: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lieu: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Synchroniser le modèle avec la base de données
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully.');

        await sequelize.sync({ force: true }); // Réinitialise la base à chaque lancement
        console.log('Database synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// GET all - Récupérer tous les éléments
app.get('/reservations', async (req, res) => {
    const reservations = await Reservations.findAll();
    res.json(reservations);
});

// GET - Récupérer un élément par son ID
app.get('/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const reservation = await Reservations.findOne(
        {
            where: { numDossier: req.params.id }
          }
    );

    if (!reservation) {
        return res.status(404).json({ error: 'Item not found' });
    }

    res.json(reservation);
});

// POST - Ajouter un nouvel élément
app.post('/reservations', (req, res) => {
    Reservations.create({
        numDossier: req.body.numDossier,
        departure: req.body.departure,
        arrival: req.body.arrival,
        departureTime: req.body.departureTime,
        arrivalTime: req.body.arrivalTime
    })
    .then(resa => res.status(201).send(resa))
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

// DELETE (via POST) - Supprimer un élément par ID
app.post('/reservations/delete', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    const item = await Reservations.findOne(
        {
            where: { numDossier: req.params.id }
          }
    );

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    await item.destroy();
    res.json({ success: true, deletedItem: item });
});

app.get('/agent', async (req, res) =>{
    try{
        const agentEmail = req.query.email.toLowerCase();
        const agent = await Agent.findOne(
            {
                where: { email: agentEmail }
              }
        );

        if (!agent) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(agent);
    }
    catch (err){
        console.error('Error in GET /agent', err.message);
        res.status(500).json({ error: err.message });
    }
})
app.get('/reservations/fromLieu/:lieu', async (req, res) => {
    try {
      const lieu = req.params.lieu;
  
      const reservations = await Reservations.findAll({
        where: {
          [Op.or]: [
            { departure: lieu },
            { arrival: lieu }
          ]
        }
      });
  
      return res.status(200).json(reservations);
    } catch (err) {
      console.error('Error in GET /reservations/fromLieu/:lieu:', err.message);
      return res.status(500).json({ error: err.message });
    }
  });
  

app.post('/agent', (req, res) => {
    Agent.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        lieu: req.body.lieu,
        tel: req.body.tel
    })
    .then(agent => res.status(201).send(agent))
    .catch( err => {
      res.status(500).send(JSON.stringify(err));
    });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
