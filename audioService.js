import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createRequire } from 'module';

// Configuration pour obtenir le chemin absolu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer un require pour utiliser les modules CommonJS
const require = createRequire(import.meta.url);

// Importer sound-play une seule fois
let soundPlay;
try {
    soundPlay = require('sound-play');
} catch (error) {
    // Ignorer si non disponible
}

export const AudioService = {
    play: (filename) => {
        try {
            const audioPath = path.join(__dirname, 'audio', filename);
            if (fs.existsSync(audioPath) && soundPlay) {
                soundPlay.play(audioPath, 0.5);
            }
        } catch (error) {
            // Silent error handling
        }
    }
}; 