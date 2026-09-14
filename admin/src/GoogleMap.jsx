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
          title: "🕳️ Pothole",
          location: "Main Road",
          priority: 92,
          lat: 28.6139,
          lng: 77.2090,
        },
        {
          title: "🗑️ Garbage",
          location: "Sector 15",
          priority: 67,
          lat: 28.6200,
          lng: 77.2150,
        },
        {
          title: "💡 Streetlight",
          location: "Market Road",
          priority: 54,
          lat: 28.6050,
          lng: 77.2250,
        },
        {
          title: "💧 Water Leakage",
          location: "Sector 12",
          priority: 81,
          lat: 28.6250,
          lng: 77.1950,
        },
      ];

      const infoWindow = new InfoWindow();

      issues.forEach((issue) => {
        const marker = new AdvancedMarkerElement({
          map,
          position: {
            lat: issue.lat,
            lng: issue.lng,
          },
          title: issue.title,
        });

        marker.addListener("click", () => {
          infoWindow.setContent(`
            <div style="padding: 8px; min-width: 180px;">
              <h3 style="margin: 0 0 8px;">
                ${issue.title}
              </h3>

              <p style="margin: 4px 0;">
                📍 <strong>Location:</strong> ${issue.location}
              </p>

              <p style="margin: 4px 0;">
                📊 <strong>Priority:</strong> ${issue.priority}
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