const express = require('express');
const router = express.Router();
const multer = require('multer');
const qrcodeReader = require('qrcode-reader');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

// Configuration de Multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fonction pour lire un QR code
const decodeQRCode = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        Jimp.read(imageBuffer)
            .then(image => {
                const qr = new qrcodeReader();
                qr.callback = (err, value) => {
                    if (err) {
                        return reject('Erreur lors de la lecture du QR code');
                    }
                    resolve(value.result);
                };
                qr.decode(image.bitmap);
            })
            .catch(err => reject('Erreur lors de l\'ouverture de l\'image: ' + err));
    });
};

// Route pour analyser le QR code
router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Aucune image fournie' });
        }

        const imageBuffer = req.file.buffer;

        // Lire et décoder le QR code
        const qrData = await decodeQRCode(imageBuffer);

        // Nettoyage du fichier en mémoire
        req.file.buffer = null;

        if (!qrData) {
            return res.status(404).json({
                error: 'Aucune donnée trouvée dans le QR code',
            });
        }

        res.status(200).json({
            success: true,
            data: qrData,
        });

    } catch (error) {
        console.error('Erreur lors de la reconnaissance du QR code:', error);
        res.status(500).json({
            error: 'Erreur lors du traitement de l\'image',
            details: error.message,
        });
    }
});

// Route de debug pour voir le texte brut du QR code
router.post('/debug', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });

        const imageBuffer = req.file.buffer;

        // Lire et décoder le QR code
        const qrData = await decodeQRCode(imageBuffer);

        res.status(200).json({
            rawData: qrData
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
