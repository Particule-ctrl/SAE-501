var db = require('../sql-database.js');
db.sequelize.sync().then(() => {
    // Vérifier si la table Handicap est vide et insérer des valeurs par défaut si nécessaire
    return db.Handicap.count().then(count => {
        if (count === 0) {
            // Si la table est vide, insérer des valeurs par défaut
            console.log('Table Handicap vide, insertion des valeurs par défaut');
            return db.Handicap.bulkCreate([
                { code: 'BLND', createdAt: new Date(), updatedAt: new Date() },
                { code: 'DEAF', createdAt: new Date(), updatedAt: new Date() },
                { code: 'DPNA', createdAt: new Date(), updatedAt: new Date() },
                { code: 'WCHR', createdAt: new Date(), updatedAt: new Date() },
                { code: 'WCHS', createdAt: new Date(), updatedAt: new Date() },
                { code: 'WCHC', createdAt: new Date(), updatedAt: new Date() },
                { code: 'MAAS', createdAt: new Date(), updatedAt: new Date() }
            ]);
        } else {
            console.log('Table Handicap déjà remplie');
        }
    });
})
.then(() => {
    console.log('Base de données synchronisée et remplie avec les valeurs par défaut');
})
.catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données : ', error);
});