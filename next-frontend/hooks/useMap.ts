
import { useEffect, useState } from "react";
import { Map } from "../utils/map";
import { getCurrentPosition } from "./geolocation";

export function useMap(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    (async () => {
      const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");
      
      setOptions({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        v: "weekly" // recommended when using importLibrary
      });

      const [, , , , position] = await Promise.all([
        importLibrary("routes"),
        importLibrary("geometry"),
        importLibrary("marker"),
        importLibrary("maps"),
        getCurrentPosition({ enableHighAccuracy: true }).catch(() => ({
          lat: -23.55052,
          lng: -46.633308,
        })),
      ]);
      const map = new Map(containerRef.current!, {
        mapId: "8e0a97af9386fef", //theme
        zoom: 15,
        center: position,
      });
      setMap(map);
    })();
  }, [containerRef]);

  return map;
}
