const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const extractInfoFromText = (text) => {
    console.log("=== DÉBUT ANALYSE TEXTE ===");
    console.log(text);
    
    const result = {
        lastName: '',
        firstName: '',
        birthdate: '',
        civility: '',
        found: false
    };

    // Normalisation du texte
    const lines = text
        .replace(/\r/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // Patterns plus précis et spécifiques
    const patterns = {
        // Cherche spécifiquement après "nom :" en ignorant la casse
        nom: /nom\s*:\s*([A-ZÀ-Ÿ\s-]+)/i,
        
        // Cherche spécifiquement après "prénom(s) :" et prend le premier prénom
        prenom: /pr[ée]nom\(?s?\)?\s*:\s*([A-ZÀ-Ÿa-zà-ÿ]+)[,\s]?/i,
        
        // Cherche spécifiquement le format "Sexe : X"
        sexe: /sexe\s*:\s*([MF])\b/i,
        
        // Cherche spécifiquement le format de date après "Né(e) le :"
        date: /[Nn][ée](?:\(e\))?\s*le\s*:\s*(\d{2}[\s./-]\d{2}[\s./-]\d{4})/
    };

    lines.forEach(line => {
        console.log("Analyse ligne:", line);

        // Recherche du nom
        const nomMatch = line.match(patterns.nom);
        if (nomMatch && !result.lastName) {
            result.lastName = nomMatch[1].trim().toUpperCase();
            console.log("Nom trouvé:", result.lastName);
        }

        // Recherche du prénom (prend seulement le premier prénom)
        const prenomMatch = line.match(patterns.prenom);
        if (prenomMatch && !result.firstName) {
            result.firstName = prenomMatch[1].split(/[,\s]/)[0].trim();
            console.log("Prénom trouvé:", result.firstName);
        }

        // Recherche du sexe
        const sexeMatch = line.match(patterns.sexe);
        if (sexeMatch && !result.civility) {
            result.civility = sexeMatch[1].toUpperCase() === 'M' ? 'Mr' : 'Mme';
            console.log("Civilité trouvée:", result.civility);
        }

        // Recherche de la date de naissance
        const dateMatch = line.match(patterns.date);
        if (dateMatch && !result.birthdate) {
            result.birthdate = dateMatch[1].replace(/[\s./-]/g, '/');
            console.log("Date de naissance trouvée:", result.birthdate);
        }
    });

    // Dans le cas où le format standard n'est pas trouvé, chercher des alternatives
    if (!result.birthdate) {
        lines.forEach(line => {
            // Cherche une date au format JJ/MM/AAAA ou JJ.MM.AAAA
            const altDateMatch = line.match(/\b(\d{2}[\s./-]\d{2}[\s./-]\d{4})\b/);
            if (altDateMatch) {
                result.birthdate = altDateMatch[1].replace(/[\s./-]/g, '/');
                console.log("Date alternative trouvée:", result.birthdate);
            }
        });
    }

    if (!result.sexe) {
        // Cherche simplement "M" ou "F" isolé sur une ligne
        lines.forEach(line => {
            if (/^[MF]$/.test(line.trim())) {
                result.civility = line.trim() === 'M' ? 'Mr' : 'Mme';
                console.log("Civilité alternative trouvée:", result.civility);
            }
        });
    }

    // Vérifie qu'au moins une information a été trouvée
    result.found = !!(result.lastName || result.firstName || result.birthdate || result.civility);

    console.log("=== RÉSULTAT FINAL ===");
    console.log(result);
    return result;
};

module.exports = { extractInfoFromText };

router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Aucune image fournie' });
        }

        const imagePath = path.join(__dirname, '../', req.file.path);

        // Configuration avancée de Tesseract
        const result = await Tesseract.recognize(imagePath, 'fra', {
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇàâäéèêëîïôöùûüÿç0123456789:/.,()-',
            tessedit_pageseg_mode: '3', // Mode de segmentation plus précis
            preserve_interword_spaces: '1',
            tessjs_create_pdf: '0',
            tessjs_create_hocr: '0',
            tessjs_create_tsv: '0',
            tessjs_config_params: {
                textord_min_linesize: '1.5',
            }
        });

        console.log('Texte brut reconnu:', result.data.text);

        const extractedInfo = extractInfoFromText(result.data.text);

        // Nettoyage du fichier
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Erreur lors de la suppression du fichier:', err);
        });

        if (!extractedInfo.found) {
            return res.status(404).json({
                error: 'Aucune information n\'a pu être extraite de l\'image',
                debug: { rawText: result.data.text }
            });
        }

        res.status(200).json({
            success: true,
            data: extractedInfo
        });

    } catch (error) {
        console.error('Erreur lors de la reconnaissance du texte:', error);
        if (req.file) {
            fs.unlink(path.join(__dirname, '../', req.file.path), () => {});
        }
        res.status(500).json({
            error: 'Erreur lors du traitement de l\'image',
            details: error.message
        });
    }
});

// Route de debug pour voir le texte brut
router.post('/debug', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });
        
        const imagePath = path.join(__dirname, '../', req.file.path);
        const result = await Tesseract.recognize(imagePath, 'fra', {
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇàâäéèêëîïôöùûüÿç0123456789:/.,()-',
            tessedit_pageseg_mode: '3'
        });
        
        res.status(200).json({
            rawText: result.data.text,
            words: result.data.words
        });
        
        fs.unlink(imagePath, () => {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;