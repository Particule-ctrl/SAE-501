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

const transformData = (incomingData) => {
    return {
        idDossier: incomingData["id-dossier"],
        idPMR: incomingData.idPMR,
        enregistre: incomingData.enregistre,
        Assistance: incomingData.Assistance,
        sousTrajets: incomingData.sousTrajets.map(st => ({
            BD: st.BD,
            numDossier: st.numDossier
        })),
        bagage: incomingData.bagage
    };
};


no_sql_db = {
    mongoose: mongoose,
    DataModel: setupModels().DataModel,
    transformData: transformData
}
module.exports = no_sql_db