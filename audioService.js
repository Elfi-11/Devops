import soundPlay from 'sound-play';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { exec } from 'child_process';

// Configuration pour obtenir le chemin absolu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// État de la lecture audio
let isAudioEnabled = true; // Option pour activer/désactiver l'audio

export const AudioService = {
    // Activer/désactiver l'audio
    setAudioEnabled: (enabled) => {
        isAudioEnabled = enabled;
        if (!enabled) {
            console.log('[AUDIO] Son désactivé');
        } else {
            console.log('[AUDIO] Son activé');
        }
    },
    
    // Jouer un son
    play: (filename) => {
        try {
            // Si le son est désactivé, simuler seulement
            if (!isAudioEnabled) {
                console.log(`[AUDIO SIMULÉ] Lecture de: ${filename}`);
                return;
            }
            
            // Chemins des fichiers audio
            const audioPath = path.join(__dirname, 'audio', filename);
            
            // Vérifier si le fichier existe
            if (!fs.existsSync(audioPath)) {
                console.error(`Le fichier audio ${audioPath} n'existe pas!`);
                return;
            }
            
            console.log(`[AUDIO] Lecture du fichier: ${filename}`);
            
            // Utiliser sound-play pour jouer le fichier
            // Nous utilisons un volume plus bas (0.2) pour éviter que ce soit trop fort
            soundPlay.play(audioPath, 0.2).catch(error => {
                console.error('Erreur lors de la lecture audio:', error);
            });
            
            // Note: sound-play ne prend pas en charge la lecture en boucle,
            // donc pour battle.wav en combat, on pourrait le relancer quand il se termine
            // dans une implémentation future
        } catch (error) {
            console.error('Erreur dans le service audio:', error);
        }
    },
    
    // Arrêter le son en cours
    // Note: sound-play ne fournit pas de méthode d'arrêt, cette fonction est conservée pour compatibilité
    stop: () => {
        try {
            if (!isAudioEnabled) {
                console.log('[AUDIO SIMULÉ] Arrêt audio');
                return;
            }
            
            console.log('[AUDIO] Arrêt audio (non supporté par sound-play)');
            // sound-play ne prend pas en charge l'arrêt des sons en cours de lecture
            // cette fonction est conservée pour compatibilité avec le code existant
        } catch (error) {
            console.error('Erreur lors de l\'arrêt de l\'audio:', error);
        }
    },
    
    // Fonction pour ouvrir le fichier audio manuellement (hors du flux de jeu)
    // Attention: ouvre une fenêtre externe, à utiliser uniquement pour test
    openAudioFile: (filename) => {
        try {
            const audioPath = path.join(__dirname, 'audio', filename);
            
            if (!fs.existsSync(audioPath)) {
                console.error(`Le fichier audio ${audioPath} n'existe pas!`);
                return;
            }
            
            // Sur Windows, ouvre le fichier avec le lecteur par défaut
            console.log(`Ouverture du fichier audio: ${audioPath}`);
            exec(`start "" "${audioPath}"`, (error) => {
                if (error) {
                    console.error('Erreur lors de l\'ouverture du fichier:', error);
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du fichier:', error);
        }
    }
}; 