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

// Initialize the map
window.initializeMap = function() {
  // Create the map centered on Korea
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 36.5, lng: 127.5 },
    zoom: 7,
    mapId: 'f8e3316f1c09977d',
    mapTypeId: 'terrain',
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: false
  });

  // Initialize the UI controls
  initControls();
  // Load initial Wikipedia content
  loadWikipediaContent('imjin-war');  
}

// Initialize UI controls
function initControls() {
  // Event selector dropdown
  const eventSelector = document.getElementById('event-selector');
  eventSelector.addEventListener('change', function() {
    const selectedEvent = this.value;
    initializeTimeline(selectedEvent);
    updateMapForDate(currentDate);
    loadWikipediaContent(selectedEvent);
  });

  // Initialize timeline for the default event
  initializeTimeline('imjin-war');

  // Playback controls
  const backwardBtn = document.getElementById('backward-btn');
  const playBtn = document.getElementById('play-btn');
  const stopBtn = document.getElementById('stop-btn');
  const forwardBtn = document.getElementById('forward-btn');
  
  backwardBtn.addEventListener('click', function() {
    if (!isPlaybackStarted) return;
    moveBackward();
  });
  
  playBtn.addEventListener('click', function() {
    if (!isPlaybackStarted) {
      isPlaybackStarted = true;
      updateMapForDate(currentDate); // Initial update after pressing play
    }
    togglePlayback();
  });
  
  stopBtn.addEventListener('click', function() {
    if (!isPlaybackStarted) return;
    stopPlayback();
  });
  
  forwardBtn.addEventListener('click', function() {
    if (!isPlaybackStarted) return;
    moveForward();
  });
}

// Initialize timeline for the selected event
function initializeTimeline(eventId) {
  const eventData = warData[eventId];
  const startDate = eventData.startDate;
  const endDate = eventData.endDate;
  
  // Generate timeline months
  timelineMonths = [];
  let currentYear = startDate.year;
  let currentMonth = startDate.month;
  
  while (currentYear < endDate.year || (currentYear === endDate.year && currentMonth <= endDate.month)) {
    timelineMonths.push({ year: currentYear, month: currentMonth });
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }
  
  // Create timeline labels
  const labelsContainer = document.getElementById('timeline-labels');
  labelsContainer.innerHTML = ''; // Clear existing labels
  
  let lastYear = null;
  timelineMonths.forEach((date, index) => {
    // Add year label if it's a new year
    if (lastYear !== date.year) {
      const yearLabel = document.createElement('div');
      yearLabel.className = 'timeline-label year-start';
      yearLabel.textContent = date.year;
      labelsContainer.appendChild(yearLabel);
      lastYear = date.year;
    }
    
    // Add month label
    const monthLabel = document.createElement('div');
    monthLabel.className = 'timeline-label';
    monthLabel.textContent = String(date.month);
    monthLabel.dataset.index = index;
    
    // Add click handler
    monthLabel.addEventListener('click', () => {
      if (!isPlaybackStarted) return;
      
      // Update current month index and date
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
  const labels = document.querySelectorAll('.timeline-label');
  labels.forEach(label => label.classList.remove('active'));
  
  // Add active class to current month
  const activeLabel = document.querySelector(`.timeline-label[data-index="${currentMonthIndex}"]`);
  if (activeLabel) {
    activeLabel.classList.add('active');
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
  
  clearInfoWindows();
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
function startPlayback() {
  const playBtn = document.getElementById('play-btn');
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  
  playbackInterval = setInterval(async () => {
    if (!isNarrating) {
      await moveForward();
    }
  }, 100);
}

// Stop playback
function stopPlayback() {
  if (playbackInterval) {
    clearInterval(playbackInterval);
    playbackInterval = null;
    
    const playBtn = document.getElementById('play-btn');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Stop any ongoing narration
    stopSound();
  }
}

// Update map for the current date
async function updateMapForDate(date) {
  if (!isPlaybackStarted) return;
  
  // Clear existing markers and polylines
  clearMap();
  clearInfoWindows();
  
  // Format date string for lookup
  const dateStr = `${date.year}-${date.month < 10 ? '0' + date.month : date.month}`;
  
  // Get current event
  const selectedEvent = document.getElementById('event-selector').value;
  const eventData = warData[selectedEvent];
  
  // Find events for the current date
  let timelineEvent = null;
  
  for (const event of eventData.timeline) {
    if (event.date.year === date.year && event.date.month === date.month) {
      timelineEvent = event;
      break;
    }
  }
  
  // If no event found for the exact date, display message
  if (!timelineEvent) {
    console.log(`No recorded events for ${dateStr}`);
    return;
  }
  
  // Process the timeline event
  processTimelineEvent(timelineEvent);
  
  // Sync with Wikipedia content
  syncWikipedia(dateStr, selectedEvent);

  if (timelineEvent && timelineEvent.narration) {
    isNarrating = true;
    await narrateEvent(timelineEvent.narration);
    isNarrating = false;
  }
}

// Process timeline event data and visualize on the map
function processTimelineEvent(timelineEvent) {
  // Store current event for reference
  currentEvent = timelineEvent;
  
  // Process each event in the timeline
  for (const event of timelineEvent.events) {
    switch (event.type) {
      case 'battle':
      case 'naval_battle':
        let battleMarker = createBattleMarker(event);
        showBattleInfo(event, battleMarker);
        break;
      case 'movement':
      case 'invasion':
      case 'withdrawal':
        createMovementLines(event);
        break;
      case 'capture':
      case 'peace':
      case 'death':
        let eventMarker = createEventMarker(event);
        showBattleInfo(event, eventMarker);
        break;
      default:
        console.log(`Unknown event type: ${event.type}`);
        break;
    }
  }
  
  // Narrate the event if sound is enabled
  if (timelineEvent.narration) {
    narrateEvent(timelineEvent.narration);
  }
}

// Create movement lines between locations
function createMovementLines(event) {
  if (!event.movements) return;
  
  // Process each movement
  for (const movement of event.movements) {
    // Calculate a slight curve for the line to avoid directly overlapping with markers
    const midLat = (movement.from.lat + movement.to.lat) / 2;
    const midLng = (movement.from.lng + movement.to.lng) / 2;
    const offset = 0.05; // Offset for the curve
    
    // Determine if this is horizontal or vertical movement and adjust curve accordingly
    const isMoreHorizontal = Math.abs(movement.to.lng - movement.from.lng) > Math.abs(movement.to.lat - movement.from.lat);
    const curvePoint = isMoreHorizontal ? 
      { lat: midLat + offset, lng: midLng } : 
      { lat: midLat, lng: midLng + offset };
    
    // Create a polyline path with the curve
    const path = [
      movement.from,
      curvePoint,
      movement.to
    ];
    
    // Determine color based on troop type
    const lineColor = movement.troops.japanese ? '#ff4444' : 
                      movement.troops.korean ? '#4444ff' : 
                      '#44aa44'; // Chinese
    
    // Create the polyline
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: lineColor,
      strokeOpacity: 0.8,
      strokeWeight: 3,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        },
        offset: '50%'
      }],
      map: map
    });
    
    // Add to polylines array
    polylines.push(polyline);
    
    // Animate the polyline
    animatePolyline(polyline);
    
    // Add troop markers at the destination with gap from polyline end
    if (movement.troops.japanese) {
      // Calculate a position with slight offset from the end of the polyline
      const direction = {
        lat: movement.to.lat - curvePoint.lat,
        lng: movement.to.lng - curvePoint.lng
      };
      const norm = Math.sqrt(direction.lat * direction.lat + direction.lng * direction.lng);
      const normalizedDirection = {
        lat: direction.lat / norm,
        lng: direction.lng / norm
      };
      
      // Place the marker slightly before the end point
      const markerPosition = {
        lat: movement.to.lat - normalizedDirection.lat * 0.03,
        lng: movement.to.lng - normalizedDirection.lng * 0.03
      };
      
      // Create troop marker element
      const element = document.createElement('div');
      element.className = 'troop-marker';
      element.innerHTML = `
        <div class="marker-count" style="border-color: #ff4444">
          ${movement.troops.japanese.toLocaleString()}
        </div>
      `;
      
      // Create advanced marker
      const troopMarker = new google.maps.marker.AdvancedMarkerElement({
        position: markerPosition,
        map,
        content: element
      });
      
      markers.push(troopMarker);
    }
  }
  
  // Play march sound if this is a troop movement and sound is enabled
  playSound('./resources/sound/naval_battle.mp3');
}

// Animate polyline movement
function animatePolyline(polyline) {
  let count = 0;
  const icons = polyline.get('icons');
  
  setInterval(() => {
    count = (count + 1) % 200;
    
    icons[0].offset = (count / 2) + '%';
    polyline.set('icons', icons);
  }, 20);
}

function clearInfoWindows() {
  if (window.currentInfoWindow) {
    window.currentInfoWindow.close();
    window.currentInfoWindow = null;
  }
}


