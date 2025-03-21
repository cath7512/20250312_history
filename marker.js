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
        positions.forEach((troop) => {
          const contentNode = generateTroopContent(troop); // Generate a Node instead of a string

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: troop.location.lat, lng: troop.location.lng },
            content: contentNode, // Pass the Node here
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

function generateTroopContent(troop) {
  // 주력군 아이콘 생성
  const troopContainer = getTroopIcon(troop);

  // 전체 요소를 포함할 wrapper 생성
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute"; // 절대 위치 사용
  wrapper.style.left = "50px"; // 왼쪽에서 50px 이동 (기존 위치에서 오른쪽으로 이동)
  wrapper.style.top = "20px"; // 원래 높이 유지
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "flex-start";
  wrapper.appendChild(troopContainer); // 주력군 먼저 배치

  // 육군과 해군 정보를 담을 컨테이너
  const forcesContainer = document.createElement("div");
  forcesContainer.style.display = "flex";
  forcesContainer.style.flexDirection = "column"; // 세로 배치 (육군 위, 해군 아래)
  forcesContainer.style.marginLeft = "10px"; // 주력군과의 간격

  // 육군 정보 추가
  if (troop.forces?.army) {
    const armyElement = document.createElement("div");
    armyElement.style.display = "flex";
    armyElement.style.alignItems = "center";
    armyElement.innerHTML = `
      <img src="${troop.forces.army.icon}" alt="Army Icon" style="width:20px; height:20px; margin-right:5px;">
      <span>${troop.forces.army.count}</span>
    `;
    forcesContainer.appendChild(armyElement);
  }

  // 해군 정보 추가
  if (troop.forces?.naval) {
    const navyElement = document.createElement("div");
    navyElement.style.display = "flex";
    navyElement.style.alignItems = "center";
    navyElement.style.marginTop = troop.forces?.army ? "5px" : "0"; // 육군이 있으면 간격 추가
    navyElement.innerHTML = `
      <img src="${
        troop.forces.naval.icon
      }" alt="Navy Icon" style="width:20px; height:20px; margin-right:5px;">
      <span>${troop.forces.naval.count} (Ships: ${
      troop.forces.naval.ships || 0
    })</span>
    `;
    forcesContainer.appendChild(navyElement);
  }

  // 육군이나 해군 정보가 있을 경우에만 forcesContainer를 wrapper에 추가
  if (troop.forces?.army || troop.forces?.naval) {
    wrapper.appendChild(forcesContainer);
  }

  return wrapper;
}

function getTroopIcon(troop) {
  // 주력군 세부 정보를 포함할 컨테이너 생성
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";

  // 사령관 이름 추가
  const commander = document.createElement("div");
  commander.textContent = troop.commander;
  commander.style.fontSize = "10px";
  commander.style.color = "black";
  commander.style.marginBottom = "5px";
  container.appendChild(commander);

  // 주력군 마커 컨테이너
  const markerContainer = document.createElement("div");
  markerContainer.style.display = "flex";
  markerContainer.style.alignItems = "center";

  // 병사 이미지 추가
  const img = document.createElement("img");
  img.src = troop.icon;
  img.alt = troop.type;
  img.style.width = "20px";
  img.style.height = "20px";
  img.style.marginRight = "5px";
  markerContainer.appendChild(img);

  // 부대 수 표시 텍스트 추가
  const text = document.createElement("div");
  let totalCount = 0;
  for (let key in troop.forces) {
    totalCount += troop.forces[key].count;
  }
  text.textContent = totalCount.toLocaleString();
  markerContainer.appendChild(text);

  // 마커 컨테이너를 메인 컨테이너에 추가
  container.appendChild(markerContainer);

  return container;
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
