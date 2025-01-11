const mongoose = require('mongoose')

mongoose.connect("mongodb://root:root@mongo:27017/",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connecté à MongoDB');
}).catch(err => {
    console.error('Erreur de connexion à MongoDB :', err);
});

const setupModels = () => {
    const DataSchema = new mongoose.Schema({
        idDossier: Number,
        idPMR: Number,
        enregistre: Number,
        Assistance: Number,
        sousTrajets: [
            {
                BD: String,
                numDossier: Number,
            }
        ],
        bagage: [Number]
    });

    const DataModel = mongoose.model('Data', DataSchema);
    return { DataModel };
};




no_sql_db = {
    mongoose: mongoose,
    DataModel: setupModels().DataModel,
}
module.exports = no_sql_db