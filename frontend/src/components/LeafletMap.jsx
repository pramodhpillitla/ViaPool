import React, { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { CarFront, Flag, MapPin, UserRound } from "lucide-react";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import shadowIcon from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: shadowIcon,
});

function buildMarkerIcon(Icon, color, iconColor = "#ffffff") {
  const svg = renderToStaticMarkup(<Icon size={18} strokeWidth={2.2} color={iconColor} />);

  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:${color};border:3px solid #ffffff;box-shadow:0 10px 24px rgba(15,23,42,0.28);">
        ${svg}
        <div style="position:absolute;left:50%;bottom:-10px;transform:translateX(-50%);width:14px;height:14px;background:${color};clip-path:polygon(50% 100%, 0 0, 100% 0);filter:drop-shadow(0 6px 8px rgba(15,23,42,0.12));"></div>
      </div>
    `,
    iconSize: [42, 52],
    iconAnchor: [21, 46],
    popupAnchor: [0, -42],
  });
}

const driverIcon = buildMarkerIcon(CarFront, "#2d6ea3");
const passengerIcon = buildMarkerIcon(UserRound, "#c4622d");
const pickupIcon = buildMarkerIcon(MapPin, "#d98a3a");
const startIcon = buildMarkerIcon(MapPin, "#8a5a2b");
const destinationIcon = buildMarkerIcon(Flag, "#2d4a35");

function FitMapToPoints({ points, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(points.map((point) => [point.lat, point.lng]), {
        padding: [40, 40],
        maxZoom: 15,
      });
      return;
    }

    if (center) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map, points]);

  return null;
}

export default function LeafletMap({
  center,
  markerCoords,
  driverCoords,
  passengerCoords,
  pickupCoords,
  startCoords,
  destinationCoords,
  routePath = [],
  showMarkerLabels = false,
  zoom = 13,
  style = { height: "100%", width: "100%" },
}) {
  const fallbackDriver = driverCoords || markerCoords || null;
  const markersOverlap = useMemo(() => {
    if (!fallbackDriver || !passengerCoords) return false;

    const latDiff = Math.abs(fallbackDriver.lat - passengerCoords.lat);
    const lngDiff = Math.abs(fallbackDriver.lng - passengerCoords.lng);
    return latDiff < 0.0008 && lngDiff < 0.0008;
  }, [fallbackDriver, passengerCoords]);

  const displayDriverCoords = useMemo(() => {
    if (!fallbackDriver) return null;
    if (!markersOverlap) return fallbackDriver;

    return {
      lat: fallbackDriver.lat + 0.00045,
      lng: fallbackDriver.lng - 0.00045,
    };
  }, [fallbackDriver, markersOverlap]);

  const displayPassengerCoords = useMemo(() => {
    if (!passengerCoords) return null;
    if (!markersOverlap) return passengerCoords;

    return {
      lat: passengerCoords.lat - 0.00045,
      lng: passengerCoords.lng + 0.00045,
    };
  }, [passengerCoords, markersOverlap]);

  const connectionPath = useMemo(
    () => (displayDriverCoords && displayPassengerCoords ? [displayDriverCoords, displayPassengerCoords] : []),
    [displayDriverCoords, displayPassengerCoords]
  );
  const points = useMemo(
    () =>
      [
        displayDriverCoords,
        displayPassengerCoords,
        pickupCoords,
        startCoords,
        destinationCoords,
      ].filter(Boolean),
    [displayDriverCoords, displayPassengerCoords, pickupCoords, startCoords, destinationCoords]
  );

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={style}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {connectionPath.length >= 2 && (
        <>
          <Polyline
            positions={connectionPath.map((point) => [point.lat, point.lng])}
            pathOptions={{ color: "#ffffff", weight: 12, opacity: 0.5, lineCap: "round", lineJoin: "round" }}
          />
          <Polyline
            positions={connectionPath.map((point) => [point.lat, point.lng])}
            pathOptions={{ color: "#2d6ea3", weight: 7, opacity: 0.95, lineCap: "round", lineJoin: "round", dashArray: markersOverlap ? null : "12 10" }}
          />
        </>
      )}

      {routePath.length >= 2 && (
        <>
          <Polyline
            positions={routePath.map((point) => [point.lat, point.lng])}
            pathOptions={{ color: "#f5f0e8", weight: 9, opacity: 0.35, lineCap: "round", lineJoin: "round" }}
          />
          <Polyline
            positions={routePath.map((point) => [point.lat, point.lng])}
            pathOptions={{ color: "#c4622d", weight: 5, opacity: 0.95, lineCap: "round", lineJoin: "round" }}
          />
        </>
      )}

      {displayDriverCoords && (
        <>
          <CircleMarker
            center={[displayDriverCoords.lat, displayDriverCoords.lng]}
            radius={18}
            pathOptions={{ color: "#2d6ea3", weight: 2, fillColor: "#2d6ea3", fillOpacity: 0.14 }}
          />
          <Marker position={[displayDriverCoords.lat, displayDriverCoords.lng]} icon={driverIcon} zIndexOffset={1000}>
            {showMarkerLabels && (
              <Tooltip direction="top" offset={[0, -42]} permanent>
                Driver
              </Tooltip>
            )}
          </Marker>
        </>
      )}

      {displayPassengerCoords && (
        <>
          <CircleMarker
            center={[displayPassengerCoords.lat, displayPassengerCoords.lng]}
            radius={16}
            pathOptions={{ color: "#c4622d", weight: 2, fillColor: "#c4622d", fillOpacity: 0.12 }}
          />
          <Marker position={[displayPassengerCoords.lat, displayPassengerCoords.lng]} icon={passengerIcon} zIndexOffset={1100}>
            {showMarkerLabels && (
              <Tooltip direction="top" offset={[0, -42]} permanent>
                Passenger
              </Tooltip>
            )}
          </Marker>
        </>
      )}

      {!displayPassengerCoords && pickupCoords && (
        <>
          <CircleMarker
            center={[pickupCoords.lat, pickupCoords.lng]}
            radius={14}
            pathOptions={{ color: "#d98a3a", weight: 2, fillColor: "#d98a3a", fillOpacity: 0.1 }}
          />
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupIcon} zIndexOffset={1050}>
            {showMarkerLabels && (
              <Tooltip direction="top" offset={[0, -42]} permanent>
                Pickup
              </Tooltip>
            )}
          </Marker>
        </>
      )}

      {startCoords && (
        <Marker position={[startCoords.lat, startCoords.lng]} icon={startIcon} zIndexOffset={850}>
          {showMarkerLabels && (
            <Tooltip direction="top" offset={[0, -42]} permanent>
              Start
            </Tooltip>
          )}
        </Marker>
      )}

      {destinationCoords && (
        <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={destinationIcon} zIndexOffset={900}>
          {showMarkerLabels && (
            <Tooltip direction="top" offset={[0, -42]} permanent>
              Destination
            </Tooltip>
          )}
        </Marker>
      )}

      <FitMapToPoints points={points.length ? points : routePath} center={center} zoom={zoom} />
    </MapContainer>
  );
}
