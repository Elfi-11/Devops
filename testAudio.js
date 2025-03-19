import { AudioService } from './audioService.js';
import readline from 'readline';

// Fonction pour attendre un certain temps
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Interface de ligne de commande pour l'interaction utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction pour poser une question et attendre la réponse
const question = (query) => new Promise(resolve => rl.question(query, resolve));

// Fonction de test asynchrone
async function testAudio() {
    console.log('====== TEST AUDIO ======');
    console.log('Ce script teste les fonctionnalités audio du jeu\n');
    
    try {
        // Menu principal
        console.log('OPTIONS:');
        console.log('1. Tester la lecture audio avec sound-play');
        console.log('2. Tester la lecture audio simulée');
        console.log('3. Ouvrir manuellement les fichiers audio (ouvre des fenêtres)');
        console.log('4. Quitter');
        
        const choice = await question('\nVotre choix (1-4): ');
        
        switch (choice) {
            case '1':
                // Assurer que l'audio est activé
                AudioService.setAudioEnabled(true);
                await testRealAudio();
                break;
            case '2':
                // Désactiver l'audio pour simuler
                AudioService.setAudioEnabled(false);
                await testSimulation();
                break;
            case '3':
                await testManualPlay();
                break;
            case '4':
                console.log('Au revoir!');
                break;
            default:
                console.log('Choix non valide. Au revoir!');
        }
    } catch (error) {
        console.error('Erreur lors des tests:', error);
    } finally {
        rl.close();
    }
}

// Test de l'audio réel avec sound-play
async function testRealAudio() {
    console.log('\n=== TEST DE SOUND-PLAY AUDIO ===');
    console.log('Audio activé - Vous devriez entendre le son\n');
    
    // Test 1: Lecture de la musique de combat
    console.log('\n> Test 1: Lecture de battle.wav');
    AudioService.play('battle.wav');
    
    // Attendre 5 secondes
    console.log('Attente de 5 secondes...');
    await sleep(5000);
    
    // Test 2: Lecture de la musique de victoire
    console.log('\n> Test 2: Lecture de victory.wav');
    AudioService.play('victory.wav');
    
    // Attendre 5 secondes
    console.log('Attente de 5 secondes...');
    await sleep(5000);
    
    console.log('\nTests audio réels terminés.');
}

// Test de la simulation audio
async function testSimulation() {
    console.log('\n=== TEST DE SIMULATION AUDIO ===');
    console.log('Audio désactivé - Vous ne devriez PAS entendre de son\n');
    
    // Test 1: Lecture de la musique de combat
    console.log('\n> Test 1: Simulation de lecture de battle.wav');
    AudioService.play('battle.wav');
    
    // Attendre 3 secondes
    console.log('Attente de 3 secondes...');
    await sleep(3000);
    
    // Test 2: Arrêt de la musique
    console.log('\n> Test 2: Simulation d\'arrêt de l\'audio');
    AudioService.stop();
    
    // Attendre 2 secondes
    console.log('Attente de 2 secondes...');
    await sleep(2000);
    
    // Test 3: Lecture de la musique de victoire
    console.log('\n> Test 3: Simulation de lecture de victory.wav');
    AudioService.play('victory.wav');
    
    // Attendre 3 secondes
    console.log('Attente de 3 secondes...');
    await sleep(3000);
    
    console.log('\nTests de simulation terminés.');
}

// Test de l'ouverture manuelle des fichiers
async function testManualPlay() {
    console.log('\n=== TEST D\'OUVERTURE MANUELLE DE FICHIERS ===');
    console.log('ATTENTION: Cette option ouvre des fenêtres externes\n');
    
    try {
        // Ouvrir battle.wav
        console.log('Ouverture de battle.wav (appuyez sur Entrée pour continuer)...');
        await question('');
        AudioService.openAudioFile('battle.wav');
        
        // Attendre l'interaction utilisateur
        await question('Appuyez sur Entrée après avoir écouté et fermé le fichier...');
        
        // Ouvrir victory.wav
        console.log('Ouverture de victory.wav (appuyez sur Entrée pour continuer)...');
        await question('');
        AudioService.openAudioFile('victory.wav');
        
        // Attendre l'interaction utilisateur
        await question('Appuyez sur Entrée après avoir écouté et fermé le fichier...');
        
        console.log('\nTests d\'ouverture manuelle terminés.');
    } catch (error) {
        console.error('Erreur lors de l\'ouverture des fichiers:', error);
    }
}

// Exécuter les tests
testAudio().then(() => {
    console.log('\nProgramme de test terminé.');
}); 