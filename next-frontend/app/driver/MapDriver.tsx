"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../hooks/useMap";
import { socket } from "../../utils/socket-io";

export type MapDriverProps = {
  routeIdElementId: string;
};

export function MapDriver(props: MapDriverProps) {
  const { routeIdElementId } = props;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !routeIdElementId) {
      return;
    }

    const selectElement = document.querySelector(
      `#${routeIdElementId}`
    )!;

    socket.connect();

    const setupSocket = (routeId: string) => {
      if (!routeId) {
        return;
      }
      console.log('Setting up socket for route:', routeId);
      socket.offAny();
      socket.on(
        `server:new-points/${routeId}:list`,
        async (data: { route_id: string; lat: number; lng: number }) => {
          console.log("Socket message received:", data);
          if (!map.hasRoute(data.route_id)) {
            console.log("Fetching route details for:", data.route_id);
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_NEST_API_URL}/routes/${data.route_id}`
            );
            const route = await response.json();
            if (!map.hasRoute(data.route_id)) {
              map.addRouteWithIcons({
                routeId: data.route_id,
                startMarkerOptions: {
                  position: route.directions.routes[0].legs[0].start_location,
                },
                endMarkerOptions: {
                  position: route.directions.routes[0].legs[0].end_location,
                },
                carMarkerOptions: {
                  position: route.directions.routes[0].legs[0].start_location,
                },
              });
            }
          }
          map.moveCar(data.route_id, { lat: data.lat, lng: data.lng });
        }
      );
    }

    setupSocket((selectElement as HTMLSelectElement).value);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (event: any) => {
      setupSocket(event.target!.value);
    }

    selectElement.addEventListener("change", handler);

    return () => {
      selectElement.removeEventListener("change", handler);
      socket.disconnect();
    };
  }, [routeIdElementId, map]);

  return <div className="w-full h-full" ref={mapContainerRef} />;
}
