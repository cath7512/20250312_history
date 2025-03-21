// Global variables
let map;
let currentEvent = null;
let playbackInterval = null;
let currentDate = { year: 1592, month: 5 };
let playbackSpeed = 5; // Default speed (1-10)
let timelineMonths = []; // Array to store all months in the timeline
let currentMonthIndex = 0; // Current position in the timeline
let isPlaybackStarted = false; // Add this at the top with other global variables
let isNarrating = false;

// 마커와 폴리라인
let markers = [];
let polylines = [];

// Initialize the map
window.initializeMap = function () {
  // Create the map centered on Korea
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 36.5, lng: 127.5 },
    zoom: 7,
    mapId: "f8e3316f1c09977d",
    mapTypeId: "terrain",
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: false,
  });

  // Initialize the UI controls
  initControls();
  // Load initial Wikipedia content
  loadWikipediaContent("imjin-war");
};

// Add a global error handler to suppress source map errors
window.addEventListener(
  "error",
  function (event) {
    // Check if the error is related to source maps or UNC paths
    if (
      event.message &&
      (event.message.includes("source map") ||
        event.message.includes("\\w\\") ||
        event.message.includes("file:////w/") ||
        event.message.includes("mediawiki.Uri") ||
        event.message.includes("cross-origin frame"))
    ) {
      // Prevent the error from appearing in the console
      event.preventDefault();
      return true;
    }
  },
  true
);

window.addEventListener("message", (event) => {
  if (event.data.type === "extract-text") {
    // Extract text content from the iframe page
    const elements = document.querySelectorAll("p, h1, h2, h3, h4");
    const textArray = Array.from(elements).map((el) => el.textContent.trim());
    window.parent.postMessage(
      {
        type: "text-extracted",
        text: textArray,
      },
      "*"
    );
  }

  if (event.data.type === "highlight-content") {
    // Highlight the best matching text
    const textToHighlight = event.data.text;
    const highlightStyle = event.data.highlightStyle;

    const elements = document.querySelectorAll("p, h1, h2, h3, h4");
    elements.forEach((el) => {
      if (el.textContent.includes(textToHighlight)) {
        el.style.backgroundColor = highlightStyle.backgroundColor;
        el.style.color = highlightStyle.color;
      }
    });
  }
});

// Initialize UI controls
function initControls() {
  // Event selector dropdown
  const eventSelector = document.getElementById("event-selector");
  eventSelector.addEventListener("change", function () {
    const selectedEvent = this.value;
    initializeTimeline(selectedEvent);
    updateMapForDate(currentDate);
    loadWikipediaContent(selectedEvent);
  });

  // Initialize timeline for the default event
  initializeTimeline("imjin-war");

  // Playback controls
  const backwardBtn = document.getElementById("backward-btn");
  const playBtn = document.getElementById("play-btn");
  const stopBtn = document.getElementById("stop-btn");
  const forwardBtn = document.getElementById("forward-btn");

  backwardBtn.addEventListener("click", function () {
    if (!isPlaybackStarted) return;
    moveBackward();
  });

  playBtn.addEventListener("click", function () {
    if (!isPlaybackStarted) isPlaybackStarted = true;
    togglePlayback();
  });

  stopBtn.addEventListener("click", function () {
    if (!isPlaybackStarted) return;
    stopPlayback();
  });

  forwardBtn.addEventListener("click", function () {
    if (!isPlaybackStarted) return;
    moveForward();
  });
}

// Initialize timeline for the selected event
function initializeTimeline(eventId) {
  const eventData = warData[eventId];
  const startDate = eventData.startDate;
  const endDate = eventData.endDate;
  const timelineDates = eventData.timeline.map((entry) => entry.date); // Extract timeline dates

  // Generate timeline months
  timelineMonths = [];
  let currentYear = startDate.year;
  let currentMonth = startDate.month;

  while (
    currentYear < endDate.year ||
    (currentYear === endDate.year && currentMonth <= endDate.month)
  ) {
    timelineMonths.push({ year: currentYear, month: currentMonth });
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  // Create timeline labels
  const labelsContainer = document.getElementById("timeline-labels");
  labelsContainer.innerHTML = ""; // Clear existing labels

  let lastYear = null;
  timelineMonths.forEach((date, index) => {
    // Add year label if it's a new year
    if (lastYear !== date.year) {
      const yearLabel = document.createElement("div");
      yearLabel.className = "timeline-label year-start";
      yearLabel.textContent = date.year;
      labelsContainer.appendChild(yearLabel);
      lastYear = date.year;
    }

    // Add month label
    const monthLabel = document.createElement("div");
    monthLabel.className = "timeline-label";
    monthLabel.textContent = String(date.month);
    monthLabel.dataset.index = index;

    // Highlight months that have events
    if (
      timelineDates.some((d) => d.year === date.year && d.month === date.month)
    ) {
      monthLabel.classList.add("has-event");
    }

    // Add click handler
    monthLabel.addEventListener("click", () => {
      if (!isPlaybackStarted) return;
      currentMonthIndex = index;
      currentDate = { ...timelineMonths[index] };
      updateActiveLabel();
      updateMapForDate(currentDate);
    });

    labelsContainer.appendChild(monthLabel);
  });

  // Set initial active label
  updateActiveLabel();
}

function updateActiveLabel() {
  // Remove active class from all labels
  const labels = document.querySelectorAll(".timeline-label");
  labels.forEach((label) => label.classList.remove("active"));

  // Add active class to current month
  const activeLabel = document.querySelector(
    `.timeline-label[data-index="${currentMonthIndex}"]`
  );
  if (activeLabel) {
    activeLabel.classList.add("active");
  }
}

// Move to previous month
function moveBackward() {
  if (currentMonthIndex > 0) {
    currentMonthIndex--;
    currentDate = { ...timelineMonths[currentMonthIndex] };
    updateActiveLabel();
    updateMapForDate(currentDate);
  }
}

// Move to next month
async function moveForward() {
  if (isNarrating || currentMonthIndex >= timelineMonths.length - 1) return;

  currentMonthIndex++;
  currentDate = { ...timelineMonths[currentMonthIndex] };
  updateActiveLabel();
  await updateMapForDate(currentDate);
}

// Toggle playback
function togglePlayback() {
  if (playbackInterval) {
    stopPlayback();
  } else {
    startPlayback();
  }
}

// Start playback
async function startPlayback() {
  const playBtn = document.getElementById("play-btn");
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';

  if (!isNarrating) {
    currentDate = { ...timelineMonths[currentMonthIndex] };
    updateActiveLabel();
    await updateMapForDate(currentDate);
  }
}

// Stop playback
function stopPlayback() {
  if (playbackInterval) {
    clearInterval(playbackInterval);
    playbackInterval = null;

    const playBtn = document.getElementById("play-btn");
    playBtn.innerHTML = '<i class="fas fa-play"></i>';

    // Stop any ongoing narration
    stopSound();

    // 나레이션 중지
    isNarrating = false;

    // Stop all sounds
    const sounds = document.getElementsByTagName("audio");
    Array.from(sounds).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });

    // Stop all polyline animations
    polylines.forEach((polyline) => {
      if (polyline.animation) {
        polyline.animation.stop();
      }
    });

    // Clear any existing movement lines
    clearMovementLines();
  }
}

// Update map for the current date
async function updateMapForDate(date) {
  if (!isPlaybackStarted) return;

  // Clear existing markers and polylines
  clearMap();
  clearInfoWindows();

  // Format date string for lookup
  const dateStr = `${date.year}-${
    date.month < 10 ? "0" + date.month : date.month
  }`;

  // Get current event
  const selectedEvent = document.getElementById("event-selector").value;
  const eventData = warData[selectedEvent];

  // Find events for the current date
  let timelineEvent = null;

  for (const event of eventData.timeline) {
    if (event.date.year === date.year && event.date.month === date.month) {
      timelineEvent = event;
      break;
    }
  }

  // Process the timeline event
  processTimelineEvent(timelineEvent);

  // Sync with Wikipedia content
  syncWikipedia(dateStr, selectedEvent);

  // Narrate the event if narration exists and we're not already narrating
  if (timelineEvent.narration && !isNarrating) {
    isNarrating = true;
    await narrateEvent(timelineEvent.narration);
    isNarrating = false;
  }

  // Force a map refresh to ensure markers are visible
  google.maps.event.trigger(map, "resize");
}

// Process timeline event data and visualize on the map
function processTimelineEvent(timelineEvent) {
  // Store current event for reference
  currentEvent = timelineEvent;

  // Process each event in the timeline
  for (const event of timelineEvent.events) {
    if (event.soundEffect) {
      playSound(event.soundEffect);
    }

    switch (event.type) {
      case "battle":
      case "naval_battle":
        let battleMarker = createBattleMarker(event);
        createTroopMarkers(event);
        showBattleInfo(event, battleMarker);
        break;
      case "movement":
      case "invasion":
        createMovementLines(event);
        createTroopMarkers(event);
        break;
      case "withdrawal":
        createMovementLines(event);
        createTroopMarkers(event);
        break;
      case "capture":
      case "peace":
      case "death":
        let eventMarker = createEventMarker(event);
        showBattleInfo(event, eventMarker);
        break;
      default:
        console.log(`Unknown event type: ${event.type}`);
        break;
    }
  }
}

function clearMap() {
  markers.forEach((marker) => (marker.map = null));
  markers = [];

  polylines.forEach((polyline) => polyline.setMap(null));
  polylines = [];

  if (utterance) {
    speechSynthesis.cancel();
  }
}
function clearInfoWindows() {
  if (window.currentInfoWindow) {
    window.currentInfoWindow.close();
    window.currentInfoWindow = null;
  }
}

let currentEventIndex = 0;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 36.5, lng: 127.5 },
    zoom: 7,
  });

  displayEvent(warData["imjin-war"].timeline[0]);
}

function displayEvent(event) {
  clearMap();

  // Create troop markers
  const markers = createTroopMarkers(event);
  markers.forEach((markerData) => {
    const marker = new google.maps.Marker({
      position: markerData.position,
      map: map,
      icon: markerData.icon,
      title: markerData.title,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: markerData.info,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });

  // Create movement lines
  const lines = createMovementLines(event);
  lines.forEach((line) => {
    new google.maps.Polyline({
      path: line.path,
      map: map,
      ...line.options,
    });
  });

  // Play sound effects if available
  if (event.soundEffect) {
    playSound(event.soundEffect);
  }

  // Update Wikipedia content
  updateWikiContent(event);
}
