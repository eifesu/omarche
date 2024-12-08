import React from "react";
import { LatLng, MapMarker, Polyline } from "react-native-maps";

const MapMarkers = ({ destination}: { destination?: LatLng }) => {

  if(!destination) return
  return (
    <>
    <MapMarker
      coordinate={destination}
    />
    </>
  );
}

export default MapMarkers;
