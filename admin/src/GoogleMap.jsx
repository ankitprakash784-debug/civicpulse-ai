import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  v: "weekly",
});

function GoogleMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      const { Map, InfoWindow } = await importLibrary("maps");
      const { AdvancedMarkerElement } = await importLibrary("marker");

      const map = new Map(mapRef.current, {
        center: {
          lat: 28.6139,
          lng: 77.2090,
        },
        zoom: 12,
        mapId: "DEMO_MAP_ID",
      });

      const issues = [
        {
          title: "Pothole",
          icon: "🕳️",
          location: "Main Road",
          priority: 92,
          status: "Critical",
          lat: 28.6139,
          lng: 77.2090,
        },
        {
          title: "Garbage",
          icon: "🗑️",
          location: "Sector 15",
          priority: 67,
          status: "In Progress",
          lat: 28.6200,
          lng: 77.2150,
        },
        {
          title: "Streetlight",
          icon: "💡",
          location: "Market Road",
          priority: 54,
          status: "Resolved",
          lat: 28.6050,
          lng: 77.2250,
        },
        {
          title: "Water Leakage",
          icon: "💧",
          location: "Sector 12",
          priority: 81,
          status: "Pending",
          lat: 28.6250,
          lng: 77.1950,
        },
      ];

      const infoWindow = new InfoWindow();

      issues.forEach((issue) => {
        const markerElement = document.createElement("div");

        markerElement.innerHTML = `
          <div style="
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: ${
              issue.priority >= 80
                ? "#ef4444"
                : issue.priority >= 50
                ? "#f59e0b"
                : "#22c55e"
            };
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 21px;
            cursor: pointer;
          ">
            ${issue.icon}
          </div>
        `;

        const marker = new AdvancedMarkerElement({
          map,
          position: {
            lat: issue.lat,
            lng: issue.lng,
          },
          content: markerElement,
          title: issue.title,
        });

        markerElement.addEventListener("click", () => {
          infoWindow.setContent(`
            <div style="
              padding: 10px;
              min-width: 210px;
              font-family: Arial, sans-serif;
            ">
              <h3 style="margin: 0 0 10px; font-size: 18px;">
                ${issue.icon} ${issue.title}
              </h3>

              <p style="margin: 6px 0;">
                📍 <strong>Location:</strong> ${issue.location}
              </p>

              <p style="margin: 6px 0;">
                📊 <strong>Priority:</strong> ${issue.priority}
              </p>

              <p style="margin: 6px 0;">
                📌 <strong>Status:</strong> ${issue.status}
              </p>
            </div>
          `);

          infoWindow.open({
            map,
            anchor: marker,
          });
        });
      });
    };

    initMap();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
}

export default GoogleMap;