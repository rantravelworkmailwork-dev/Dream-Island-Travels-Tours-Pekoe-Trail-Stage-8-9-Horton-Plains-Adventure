document.addEventListener("DOMContentLoaded", function () {
  // Initialize map container safely
  const mapElement = document.getElementById("sri-lanka-map");
  if (!mapElement) return;

  const map = L.map("sri-lanka-map", {
    scrollWheelZoom: false // Prevents accidental scrolling on mobile
  }).setView([7.0, 80.7], 8);

  // Clean English-Only Map (Esri - Free, No API Key, No Watermarks)
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom'
  }).addTo(map);

  // Route pins matching the 5-day highland itinerary ending in Colombo (without overlapping pickup pin)
  const routeStops = [
    {
      day: "Day 1",
      title: "Kithulgala & Norwood",
      stay: "Tea Queen Bungalow (2 Nights, Half Board)",
      coords: [6.9888, 80.4262],
      desc: "Pickup from Colombo & scenic transfer to Norwood. Optional White Water Rafting in Kithulgala en route."
    },
    {
      day: "Day 2",
      title: "Norwood / Pekoe Trail Stage 8",
      stay: "Tea Queen Bungalow (2 Nights, Half Board)",
      coords: [6.8833, 80.6167],
      desc: "Guided trek along Pekoe Trail Stage 8 through lush green tea estates and local highland villages."
    },
    {
      day: "Day 3",
      title: "Nuwara Eliya",
      stay: "Tranquil Villa (2 Nights, Half Board)",
      coords: [6.9497, 80.7891],
      desc: "Pekoe Trail Stage 9 trek, followed by a scenic drive into Nuwara Eliya ('Little England')."
    },
    {
      day: "Day 4",
      title: "Horton Plains National Park",
      stay: "Tranquil Villa (2 Nights, Half Board)",
      coords: [6.8043, 80.8033],
      desc: "Early morning hike through cloud forests and montane grasslands to World’s End and Baker’s Falls."
    },
    {
      day: "Day 5",
      title: "Colombo (Drop-Off)",
      stay: "Tour Conclusion",
      coords: [6.9271, 79.8612],
      desc: "Morning check-out and private return transfer back to Colombo for your departure."
    }
  ];

  const routeCoords = [];

  // Add Custom Numbered Markers & Popups
  routeStops.forEach((stop, index) => {
    routeCoords.push(stop.coords);

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<span>${index + 1}</span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const popupContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; max-width: 220px;">
        <span style="background:#0284c7; color:white; font-size:11px; font-weight:bold; padding:2px 8px; border-radius:10px;">${stop.day}</span>
        <h6 style="margin: 6px 0 2px 0; font-weight:800; color:#0f172a; font-size: 14px;">${stop.title}</h6>
        <p style="font-size:12px; margin:0; color:#334155;"><strong>Stay:</strong> ${stop.stay}</p>
        <p style="font-size:12px; margin-top:4px; color:#1e293b; line-height: 1.4;">${stop.desc}</p>
      </div>
    `;

    L.marker(stop.coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);
  });

  // Draw Dashed Route Line Connecting the Destinations
  const polyline = L.polyline(routeCoords, {
    color: '#a8843f',
    weight: 4,
    opacity: 0.9,
    dashArray: '6, 8'
  }).addTo(map);

  // Auto Fit Map View to show all Pins cleanly
  const fitMapBounds = () => {
    const isMobile = window.innerWidth < 768;
    const paddingVal = isMobile ? [15, 15] : [35, 35];
    map.fitBounds(polyline.getBounds(), { padding: paddingVal });
  };

  fitMapBounds();

  // Recalculate on screen resize or orientation change
  window.addEventListener('resize', () => {
    map.invalidateSize();
    fitMapBounds();
  });
});
