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
                ${
                  battle.troops.chinese
                    ? `<p><strong>Chinese Forces:</strong> ${battle.troops.chinese.toLocaleString()}</p>`
                    : ""
                }
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
            ${
              event.troops
                ? `<p><strong>Forces:</strong> ${
                    event.troops.japanese
                      ? "Japanese: " + event.troops.japanese.toLocaleString()
                      : ""
                  }
                          ${
                            event.troops.korean
                              ? "Korean: " +
                                event.troops.korean.toLocaleString()
                              : ""
                          }</p>`
                : ""
            }
        </div>
    `;
}

function createTroopInfo(faction, position) {
  return `
        <div class="troop-info">
            <h3>${
              faction.charAt(0).toUpperCase() + faction.slice(1)
            } Forces</h3>
            <p>Troop count: ${position.count}</p>
            <p>Location: ${position.lat.toFixed(4)}, ${position.lng.toFixed(
    4
  )}</p>
        </div>
    `;
}

function showBattleInfo(event) {
  let content = `<div class="battle-info"><h2>${event.name || event.type}</h2>`;

  if (event.troops) {
    content += "<h3>Troop Deployment:</h3>";
    event.troops.forEach((troopGroup) => {
      Object.entries(troopGroup).forEach(([faction, positions]) => {
        positions.forEach((pos) => {
          content += `<p>${faction}: ${pos.count} troops</p>`;
        });
      });
    });
  }

  content += `<p>${event.description}</p></div>`;
  return content;
}
