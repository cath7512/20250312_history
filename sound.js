let isSoundEnabled = true;
let utterance = null;
let speechSynthesis = window.speechSynthesis;
let voices = [];

function initSound() {
    const soundToggleBtn = document.getElementById('sound-toggle');
    const soundIcon = soundToggleBtn.querySelector('i');
    
    soundToggleBtn.addEventListener('click', () => {
        toggleSound();
        updateSoundIcon();
    });
    
    // Initialize the icon to match the initial sound state
    updateSoundIcon();
    
    // Initialize speech synthesis voices
    initSpeechSynthesis();
    
    // Test sound to verify it's working
    console.log('Sound system initialized');
}

// Initialize speech synthesis and load available voices
function initSpeechSynthesis() {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported in this browser');
        return;
    }
    
    // Load available voices
    voices = speechSynthesis.getVoices();
    speechSynthesis.addEventListener('voiceschanged', () => {
        voices = speechSynthesis.getVoices();
    });
    
    // Make sure speech synthesis is not paused
    speechSynthesis.cancel();
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    if (!isSoundEnabled && utterance) {
        speechSynthesis.cancel();
    }
    
    // Log the current sound state to debug
    console.log('Sound enabled:', isSoundEnabled);
    
    // If sound was just enabled, play a test sound
    if (isSoundEnabled) {
        // Play a short test sound to verify audio is working
        const testAudio = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABMSVNUHAAAAElORk9JQ09QWVJJR0hU1AAAAABJTkZPSVNGVDIAAABMYXZmNTguMjkuMTAw');
        testAudio.volume = 0.1;
        testAudio.play().catch(e => console.log('Test audio failed:', e));
    }
}

function updateSoundIcon() {
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = soundToggle.querySelector('i');
    
    // Update the button class for color
    soundToggle.classList.toggle('muted', !isSoundEnabled);
    
    // Clear existing classes and set the correct icon
    soundIcon.className = '';
    soundIcon.classList.add('fas');
    soundIcon.classList.add(isSoundEnabled ? 'fa-volume-up' : 'fa-volume-mute');
}

function playSound(soundUrl) {
    if (!isSoundEnabled) return;
    
    const audio = new Audio(soundUrl);
    audio.volume = 0.1; // Set volume to 50%
    audio.play().catch(error => {
        console.log('Audio playback failed:', error);
    });
}

function stopSound() {
    if (utterance) {
        speechSynthesis.cancel();
    }
}

function narrateEvent(text) {
    if (!isSoundEnabled) return Promise.resolve();
    
    return new Promise((resolve) => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        let sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
        let index = 0;
        
        function speakNextSentence() {
            if (index < sentences.length) {
                utterance = new SpeechSynthesisUtterance(sentences[index]);
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                // Select an appropriate English voice
                const englishVoice = voices.find(voice => 
                    voice.lang === 'en-US' || voice.lang === 'en-GB'
                );

                if (englishVoice) {
                    utterance.voice = englishVoice;
                } else {
                    console.warn('No suitable English voice found.');
                }

                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event);
                    resolve();
                };

                utterance.onend = () => {
                    console.log('Narration completed');
                    index++;
                    speakNextSentence();
                };

                speechSynthesis.speak(utterance);
            } else {
                resolve();
            }
        }

        speakNextSentence();
    });
}

// Add cleanup function
function cleanup() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
}

// Add cleanup on page unload
window.addEventListener('unload', cleanup);

// Initialize sound when the window loads
window.addEventListener('load', initSound);
