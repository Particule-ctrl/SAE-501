const express = require('express');
const router = express.Router();
const multer = require('multer');
const faceapi = require('face-api.js');
const { Canvas, Image } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuration de face-api.js
faceapi.env.monkeyPatch({ Canvas, Image });

// Chargement des modèles
const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('models');
};

loadModels();

// Configuration du stockage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route pour la vérification faciale
router.post('/verify', upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'idPhoto', maxCount: 1 },
]), async (req, res) => {
  try {
    if (!req.files['selfie'] || !req.files['idPhoto']) {
      return res.status(400).json({ error: 'Les deux images sont requises' });
    }

    const selfiePath = req.files['selfie'][0].path;
    const idPhotoPath = req.files['idPhoto'][0].path;

    // Chargement des images
    const selfieImage = await Canvas.loadImage(selfiePath);
    const idImage = await Canvas.loadImage(idPhotoPath);

    // Détection des visages
    const selfieDetections = await faceapi.detectSingleFace(selfieImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const idDetections = await faceapi.detectSingleFace(idImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!selfieDetections || !idDetections) {
      return res.status(400).json({
        error: 'Impossible de détecter un visage dans une ou les deux images',
      });
    }

    // Comparaison des visages
    const distance = faceapi.euclideanDistance(
      selfieDetections.descriptor,
      idDetections.descriptor
    );

    // Seuil de similarité (à ajuster selon vos besoins)
    const SIMILARITY_THRESHOLD = 0.6;
    const isMatch = distance < SIMILARITY_THRESHOLD;

    // Nettoyage des fichiers
    fs.unlinkSync(selfiePath);
    fs.unlinkSync(idPhotoPath);

    res.json({
      verified: isMatch,
      similarity: 1 - distance,
      threshold: SIMILARITY_THRESHOLD,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification faciale:', error);
    // Nettoyage en cas d'erreur
    if (req.files['selfie']) fs.unlinkSync(req.files['selfie'][0].path);
    if (req.files['idPhoto']) fs.unlinkSync(req.files['idPhoto'][0].path);

    res.status(500).json({
      error: 'Erreur lors de la vérification faciale',
      details: error.message,
    });
  }
});

module.exports = router;