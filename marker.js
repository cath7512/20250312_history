let markers = [];
let polylines = [];

// 전투 마커, 부대 마커 생성
function createBattleMarker(battle) {
    const element = document.createElement('div');
    element.className = 'battle-marker';
    element.textContent = '⚔️'; // Use a Unicode character for the battle icon
    
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: battle.location,
        map,
        title: battle.name,
        content: element
    });
    
    markers.push(marker);
    marker.addListener('click', () => {
        showBattleInfo(battle, marker);
    });
        
    return marker;
}

function createTroopMarkers(battle) {
    // Create Japanese troop marker with some offset to avoid overlap
    if (battle.troops.japanese) {
        createTroopMarker(
            battle.location,
            battle.troops.japanese,
            { lat: 0.05, lng: -0.05 },
            '#ff4444'
        );
    }
    
    // Create Korean troop marker with some offset
    if (battle.troops.korean) {
        createTroopMarker(
            battle.location,
            battle.troops.korean,
            { lat: -0.05, lng: 0.05 },
            '#4444ff'
        );
    }
    
    // Create Chinese troop marker if present
    if (battle.troops.chinese) {
        createTroopMarker(
            battle.location,
            battle.troops.chinese,
            { lat: 0, lng: 0.08 },
            '#44aa44'
        );
    }
}

function createTroopMarker(baseLocation, troopCount, offset, color) {
    const element = document.createElement('div');
    element.className = 'troop-marker';
    element.innerHTML = `
        <img src="resources/img/soldier.png" class="troop-icon" style="filter: ${getColorFilter(color)}" />
        <div class="troop-count" style="color: ${color}">${troopCount.toLocaleString()}</div>
    `;

    const position = {
        lat: baseLocation.lat + offset.lat,
        lng: baseLocation.lng + offset.lng
    };

    const marker = new google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        content: element
    });

    markers.push(marker);
}

function getColorFilter(hexColor) {
    // Convert hex color to RGB to create color filter
    const r = parseInt(hexColor.slice(1,3), 16);
    const g = parseInt(hexColor.slice(3,5), 16);
    const b = parseInt(hexColor.slice(5,7), 16);
    return `brightness(0) saturate(100%) invert(${r/255}) sepia(${g/255}) saturate(${b/255})`;
}

function clearMap() {
    markers.forEach(marker => marker.map = null);
    markers = [];
    
    polylines.forEach(polyline => polyline.setMap(null));
    polylines = [];
    
    if (utterance) {
        speechSynthesis.cancel();
    }
}

// Create a general event marker
function createEventMarker(event) {
    // Create event marker element based on event type
    const element = document.createElement('div');
    element.className = 'event-marker';
    
    let iconClass;
    switch(event.type) {
        case 'capture':
            iconClass = 'fa-flag';
            element.style.color = '#ff8800';
            break;
        case 'peace':
            iconClass = 'fa-dove';
            element.style.color = '#44cc44';
            break;
        case 'death':
            iconClass = 'fa-skull';
            element.style.color = '#000000';
            break;
        default:
            iconClass = 'fa-info-circle';
            element.style.color = '#888888';
    }
    
    element.innerHTML = `
        <div class="marker-icon">
            <i class="fas ${iconClass}"></i>
        </div>
    `;
    
    // Create marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: event.location,
        map,
        title: event.description,
        content: element
    });
    
    // Add to markers array
    markers.push(marker);
    
    // Add click listener for info window
    marker.addListener('click', () => {
        showBattleInfo(event, marker);
    });
    
    // If this is a capture event with troops, add a troop marker
    if (event.type === 'capture' && event.troops) {
        if (event.troops.japanese) {
            createTroopMarker(
                event.location,
                event.troops.japanese,
                { lat: 0.05, lng: -0.05 },
                '#ff4444'
            );
        }
    }
    
    return marker;
}