// Functions for handling Google Maps info windows

// Create battle info window content
function createBattleInfoContent(battle) {
    return `
        <div class="battle-info">
            <h3>${battle.name}</h3>
            <p>${battle.description}</p>
            <div class="troops-info">
                <p><strong>Japanese Forces:</strong> ${battle.troops.japanese.toLocaleString()}</p>
                <p><strong>Korean Forces:</strong> ${battle.troops.korean.toLocaleString()}</p>
                ${battle.troops.chinese ? `<p><strong>Chinese Forces:</strong> ${battle.troops.chinese.toLocaleString()}</p>` : ''}
            </div>
            <p><strong>Result:</strong> ${battle.result}</p>
        </div>
    `;
}

// Create event info window content
function createEventInfoContent(event) {
    return `
        <div class="event-info">
            <h3>${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</h3>
            <p>${event.description}</p>
            ${event.troops ? `<p><strong>Forces:</strong> ${event.troops.japanese ? 'Japanese: ' + event.troops.japanese.toLocaleString() : ''}
                          ${event.troops.korean ? 'Korean: ' + event.troops.korean.toLocaleString() : ''}</p>` : ''}
        </div>
    `;
}

// Show info window for battle or event
function showBattleInfo(event, marker) {
    clearInfoWindows();
    
    let content = event.name ? 
        createBattleInfoContent(event) : 
        createEventInfoContent(event);

    const infoWindow = new google.maps.InfoWindow({ content });
    window.currentInfoWindow = infoWindow;

    const position = marker.position;
    infoWindow.open(map, null);
    infoWindow.setPosition(position);
}
