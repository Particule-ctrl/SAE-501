const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const { extractInfoFromText } = require('./textUtils');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Aucune image fournie' });
        }

        const imagePath = path.join(__dirname, '../', req.file.path);

        // Configuration optimisée pour les cartes d'identité françaises
        const result = await Tesseract.recognize(imagePath, 'fra', {
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇàâäéèêëîïôöùûüÿç0123456789:/.,()- ',
            tessedit_pageseg_mode: '3',
            preserve_interword_spaces: '1'
        });

        const extractedInfo = extractInfoFromText(result.data.text);

        fs.unlink(imagePath, err => {
            if (err) console.error('Erreur lors de la suppression:', err);
        });

        if (!extractedInfo.found) {
            return res.status(404).json({
                error: 'Informations non trouvées',
                debug: { rawText: result.data.text }
            });
        }

        res.status(200).json({
            success: true,
            data: extractedInfo
        });

    } catch (error) {
        console.error('Erreur:', error);
        if (req.file) {
            fs.unlink(path.join(__dirname, '../', req.file.path), () => {});
        }
        res.status(500).json({ error: 'Erreur lors du traitement' });
    }
});

module.exports = router;