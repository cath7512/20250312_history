let isSoundEnabled = true;
let utterance = null;
let speechSynthesis = window.speechSynthesis;
let voices = [];
let currentAudio = null;

function initSound() {
  const soundToggleBtn = document.getElementById("sound-toggle");
  const soundIcon = soundToggleBtn.querySelector("i");

  soundToggleBtn.addEventListener("click", () => {
    toggleSound();
    updateSoundIcon();
  });

  // Initialize the icon to match the initial sound state
  updateSoundIcon();

  // Initialize speech synthesis voices
  initSpeechSynthesis();

  // Test sound to verify it's working
  console.log("Sound system initialized");
}

// Initialize speech synthesis and load available voices
function initSpeechSynthesis() {
  // Check if speech synthesis is supported
  if (!("speechSynthesis" in window)) {
    console.error("Speech synthesis not supported in this browser");
    return;
  }

  // Make sure speech synthesis is not paused
  speechSynthesis.cancel();

  // Fix for Chrome issue where voices aren't loaded immediately
  function loadVoices() {
    voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      console.log(`Loaded ${voices.length} speech synthesis voices`);
    }
  }

  // Load available voices
  if (speechSynthesis.onvoiceschanged !== undefined) {
    // Chrome and newer browsers
    speechSynthesis.onvoiceschanged = loadVoices;
  } else {
    // Firefox and Safari
    loadVoices();
  }

  // Fix for Chrome bug where speech synthesis gets stuck
  setInterval(() => {
    if (speechSynthesis.speaking && !document.hidden) {
      speechSynthesis.pause();
      speechSynthesis.resume();
    }
  }, 10000);
}

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  if (!isSoundEnabled && utterance) {
    speechSynthesis.cancel();
  }

  // Log the current sound state to debug
  console.log("Sound enabled:", isSoundEnabled);

  // If sound was just enabled, play a test sound
  if (isSoundEnabled) {
    // Play a short test sound to verify audio is working
    const testAudio = new Audio(
      "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABMSVNUHAAAAElORk9JQ09QWVJJR0hU1AAAAABJTkZPSVNGVDIAAABMYXZmNTguMjkuMTAw"
    );
    testAudio.volume = 0.1;
    testAudio.play().catch((e) => console.log("Test audio failed:", e));
  }
}

function updateSoundIcon() {
  const soundToggle = document.getElementById("sound-toggle");
  const soundIcon = soundToggle.querySelector("i");

  // Update the button class for color
  soundToggle.classList.toggle("muted", !isSoundEnabled);

  // Clear existing classes and set the correct icon
  soundIcon.className = "";
  soundIcon.classList.add("fas");
  soundIcon.classList.add(isSoundEnabled ? "fa-volume-up" : "fa-volume-mute");
}

function playSound(soundPath) {
  if (currentAudio) {
    currentAudio.pause();
  }

  currentAudio = new Audio(soundPath);
  currentAudio.play().catch((error) => {
    console.warn("Sound playback failed:", error);
  });
}

function stopSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (utterance) {
    speechSynthesis.cancel();
  }
}

// 나레이션
function narrateEvent(text) {
  if (!isSoundEnabled) return Promise.resolve();

  return new Promise((resolve) => {
    // Cancel any ongoing speech
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      // Small delay to ensure cancellation completes
      setTimeout(() => processSpeech(text, resolve), 100);
    } else {
      processSpeech(text, resolve);
    }
  });
}

function processSpeech(text, resolve) {
  if (!text || text.trim() === "") {
    resolve();
    return;
  }

  // Ensure voices are loaded
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      processSpeech(text, resolve);
    };
    return;
  }

  // Select a native English voice
  const englishVoice = voices.find(
    (voice) => voice.lang === "en-US" || voice.lang === "en-GB"
  );

  if (!englishVoice) {
    console.warn("No suitable English voice found.");
  }

  // Split text into sentences
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];

  // Delegate to the wrapper function
  speakNextSentenceWrapper(sentences, englishVoice, resolve);
}

function speakNextSentenceWrapper(sentences, englishVoice, resolve) {
  let index = 0;

  const MAX_SPEECH_TIME = 15000; // 15 seconds max per sentence
  let speechTimeout;

  function speakNext() {
    speakNextSentence({
      sentences,
      index,
      englishVoice,
      MAX_SPEECH_TIME,
      speechTimeout,
      onComplete: () => resolve(),
      onNext: (newIndex) => {
        index = newIndex;
        setTimeout(speakNext, 300); // Add a pause
      },
    });
  }

  speakNext();
}

function speakNextSentence({
  sentences,
  index,
  englishVoice,
  MAX_SPEECH_TIME,
  speechTimeout,
  onNext,
  onComplete,
}) {
  if (index < sentences.length) {
    try {
      // Clear any existing timeout
      if (speechTimeout) {
        clearTimeout(speechTimeout);
      }

      const utterance = new SpeechSynthesisUtterance(sentences[index]);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Assign the selected native English voice
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        clearTimeout(speechTimeout);

        // Continue to the next sentence on error
        onNext(index + 1);
      };

      utterance.onend = () => {
        clearTimeout(speechTimeout);
        onNext(index + 1);
      };

      // Set a timeout to move to the next sentence if this one takes too long
      speechTimeout = setTimeout(() => {
        console.warn("Speech synthesis timeout - moving to next sentence");
        speechSynthesis.cancel();
        onNext(index + 1);
      }, MAX_SPEECH_TIME);

      speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Error in speech synthesis:", e);
      clearTimeout(speechTimeout);
      onComplete();
    }
  } else {
    onComplete();
  }
}

// Add cleanup function
function cleanup() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
}

// Add cleanup on page unload
window.addEventListener("unload", cleanup);

// Initialize sound when the window loads
window.addEventListener("load", initSound);
