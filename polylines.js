// Create movement lines between locations
function createMovementLines(event) {
  if (!event.movements || !event.movements.length) return;

  // Process each movement
  for (const movement of event.movements) {
    // Ensure movement data is valid
    if (!movement.from || !movement.to || !movement.troops) {
      console.warn("Invalid movement data:", movement);
      continue;
    }

    // Define start, end, and curve point
    const startPoint = movement.from;
    const endPoint = movement.to;
    const curvePoint = calculateCurvePoint(startPoint, endPoint, 0.02); // Adjust offsetFactor for more/less curve

    // Create the path with a curve
    const path = [startPoint, curvePoint, endPoint];

    // Determine color based on troop type
    const lineColor = determineLineColor(movement.troops);

    // Add shadow effect
    createShadowPolyline(path);

    // Create the main polyline
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: lineColor,
      strokeOpacity: 0.8,
      strokeWeight: 3,
      icons: [
        {
          icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
          offset: "50%",
        },
      ],
      map: map,
    });

    // Add animation to the polyline
    animatePolyline(polyline);

    // Store polyline for future clearing
    polylines.push(polyline);
  }
}

// Helper: Calculate a curve point for a slight curvature
function calculateCurvePoint(start, end, offsetFactor) {
  const midLat = (start.lat + end.lat) / 2;
  const midLng = (start.lng + end.lng) / 2;

  // Apply offset to create a curve (offsetFactor controls curvature intensity)
  const curveLat = midLat + offsetFactor * (end.lng - start.lng);
  const curveLng = midLng - offsetFactor * (end.lat - start.lat);

  return { lat: curveLat, lng: curveLng };
}

// Helper: Determine line color based on troop type
function determineLineColor(troops) {
  if (troops.japanese) return "#ff4444";
  if (troops.korean) return "#4444ff";
  if (troops.chinese) return "#44aa44";
  return "#888888"; // Default color for undefined troop type
}

// Helper: Create shadow polyline for a 3D-like effect
function createShadowPolyline(path) {
  new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: "#000000", // Shadow color
    strokeOpacity: 0.3, // Slightly transparent
    strokeWeight: 5, // Thicker than the main line
    map: map,
  });
}

// Helper: Animate polyline movement
function animatePolyline(polyline) {
  let count = 0;
  const icons = polyline.get("icons");

  const animation = () => {
    count = (count + 1) % 200;
    icons[0].offset = count / 2 + "%";
    polyline.set("icons", icons);
    requestAnimationFrame(animation); // Smooth animation using requestAnimationFrame
  };

  animation();
}

// Clear all movement lines
function clearMovementLines() {
  polylines.forEach((polyline) => polyline.setMap(null));
  polylines = [];
}
