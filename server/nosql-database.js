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
        googleId: String,
        enregistre: Boolean,
        sousTrajets: [
            {
                BD: String,
                numDossier: Number,
                statusValue: Number,
            }
        ],
        bagage: {
            bagagesList: [Number],
            specialBagage: String
        },
        specialAssistance:{
            wheelchair: Boolean,
            visualAssistance: Boolean,
            hearingAssistance: Boolean,
            otherAssistance: String
        },
        security: {
            validDocuments: Boolean,
            documentsExpiry: String,
            dangerousItems: [String],
            liquidVolume: String,
            medicalEquipment: String,
            securityQuestions: {
                packedOwn: Boolean,
                leftUnattended: Boolean,
                acceptedItems: Boolean,
                receivedItems: Boolean,
                dangerousGoods: Boolean,
            },
            declarations: {
                weaponsFirearms: Boolean,
                explosives: Boolean,
                flammableMaterials: Boolean,
                radioactiveMaterials: Boolean,
                toxicSubstances: Boolean,
                compressedGases: Boolean,
                illegalDrugs: Boolean,
            },
        },
        additionalInfo: {
            emergencyContact: String,
            medicalInfo: String,
            dietaryRestrictions: String,
        }
    });

    const DataModel = mongoose.model('Data', DataSchema);
    return { DataModel };
};




no_sql_db = {
    mongoose: mongoose,
    DataModel: setupModels().DataModel,
}
module.exports = no_sql_db