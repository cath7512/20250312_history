// 전투 마커, 부대 마커 생성
function createBattleMarker(battle) {
  const element = document.createElement("div");
  element.className = "battle-marker";
  element.textContent = "⚔️"; // Use a Unicode character for the battle icon

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: battle.location,
    map,
    title: battle.name,
    content: element,
  });

  markers.push(marker);
  marker.addListener("click", () => {
    showBattleInfo(battle, marker);
  });

  return marker;
}

function createTroopMarkers(event) {
  if (event.troops) {
    event.troops.forEach((troopGroup) => {
      Object.entries(troopGroup).forEach(([faction, positions]) => {
        let troopIcon = null;
        positions.forEach((troop) => {
          troopIcon = getTroopIcon(troop);

          if (troop.type === "reinforcements") {
            troopIcon = getReinforcementIcon(troopIcon);
          }

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: troop.location.lat, lng: troop.location.lng },
            content: troopIcon,
            title: `${faction}: ${troop.commander}`,
            map: map, // Ensure the marker is added to the map
          });
          marker.addEventListener("gmp-click", () => {
            createTroopInfo(marker);
          });
          markers.push(marker);
        });
      });
    });
  }
}

function getTroopIcon(troop) {
  // Add the soldier image
  const img = document.createElement("img");
  img.src = troop.forces.army.icon;
  img.alt = troop.type;
  img.style.width = "20px";
  img.style.height = "20px";
  img.style.marginRight = "5px";

  // Create the container
  const container = document.createElement("div");
  container.classList.add("troop-container"); // CSS styles for the container
  container.style.setProperty("--troop-color", troop.color); // Apply dynamic background color
  container.style.width = `${parseInt(container.style.width)}px`; // Reduce width slightly
  container.style.position = "absolute";
  container.style.top = "-10px"; // Use `top` instead of `margin-top`
  container.style.left = "10px";

  // Add text for troop count
  const text = document.createElement("div");
  let totalCount = 0;
  for (let key in troop.forces) {
    totalCount += troop.forces[key].count;
  }
  text.textContent = totalCount.toLocaleString();

  // Add the commander's name
  const commander = document.createElement("div");
  commander.textContent = troop.commander; // Set commander's name
  commander.style.fontSize = "10px"; // Smaller font size for commander
  commander.style.color = "black"; // White text
  commander.style.textAlign = "left"; // Center alignment
  commander.style.position = "absolute"; // Absolute positioning
  commander.style.bottom = "calc(100% + 10px)"; // Position commander above the marker with spacing
  commander.style.left = "15px"; // Align with the marker's left edge
  commander.style.width = "100px"; // Match the width of the marker

  // Add content to the container
  container.appendChild(img);
  container.appendChild(text);

  // Wrap commander and marker in a wrapper
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative"; // Ensure proper positioning for the commander and marker
  wrapper.style.display = "inline-block"; // Stack elements properly without squishing
  wrapper.appendChild(commander);
  wrapper.appendChild(container);

  return wrapper; // Return the wrapper containing commander and marker
}

function getReinforcementIcon(container) {
  // Select all div elements inside the container
  const divElements = container.querySelectorAll("div");

  divElements.forEach((div) => {
    // Modify only text content, avoid interfering with the image
    if (div.textContent && !div.querySelector("img")) {
      div.textContent = "+" + div.textContent; // Add "+" to the text
    }
  });

  // Add the rise-in animation class for the fade-in effect
  container.classList.add("rise-in");

  return container;
}

function createTroopMarker(troop, movement) {
  let color = "#ff4444";

  const element = document.createElement("div");
  element.className = "troop-marker";
  element.innerHTML = `
        <img src="resources/img/soldier.png" class="troop-icon" style="filter: ${getColorFilter(
          color
        )}" />
        <div class="troop-count" style="color: ${color}">${
    troop.type
  } ${troop.count.toLocaleString()}</div>
    `;

  const position = {
    lat: movement.from,
    lng: movement.to,
  };

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position,
    map,
    content: element,
  });

  markers.push(marker);
}

function getColorFilter(hexColor) {
  // Convert hex color to RGB to create color filter
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `brightness(0) saturate(100%) invert(${r / 255}) sepia(${
    g / 255
  }) saturate(${b / 255})`;
}
// Create a general event marker
function createEventMarker(event) {
  // Create event marker element based on event type
  const element = document.createElement("div");
  element.className = "event-marker";

  let iconClass;
  switch (event.type) {
    case "capture":
      iconClass = "fa-flag";
      element.style.color = "#ff8800";
      break;
    case "peace":
      iconClass = "fa-dove";
      element.style.color = "#44cc44";
      break;
    case "death":
      iconClass = "fa-skull";
      element.style.color = "#000000";
      break;
    default:
      iconClass = "fa-info-circle";
      element.style.color = "#888888";
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
    content: element,
  });

  // Add to markers array
  markers.push(marker);

  // Add click listener for info window
  marker.addListener("click", () => {
    showBattleInfo(event, marker);
  });

  // If this is a capture event with troops, add a troop marker
  if (event.type === "capture" && event.troops) {
    if (event.troops.japanese) {
      createTroopMarker(
        event.location,
        event.troops.japanese,
        { lat: 0.05, lng: -0.05 },
        "#ff4444"
      );
    }
  }

  return marker;
}
