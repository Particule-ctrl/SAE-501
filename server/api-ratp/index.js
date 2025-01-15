const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
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
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    departure: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    arrival: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departureTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    arrivalTime: {
        type: DataTypes.DATE,
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
    const reservation = await Reservations.findByPk(id);

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

    const item = await Reservations.findByPk(id);

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    await item.destroy();
    res.json({ success: true, deletedItem: item });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
