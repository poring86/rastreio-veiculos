
import { useEffect, useState, RefObject } from "react";
import { Map } from "../utils/map";
import { getCurrentPosition } from "./geolocation";

export function useMap(containerRef: RefObject<HTMLDivElement | null>) {
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    (async () => {
      const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");
      
      setOptions({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      });

      const [, , , , position] = await Promise.all([
        importLibrary("routes"),
        importLibrary("geometry"),
        importLibrary("marker"),
        importLibrary("maps"),
        Promise.race([
          getCurrentPosition({ enableHighAccuracy: true }),
          new Promise<{ lat: number; lng: number }>((resolve) =>
            setTimeout(
              () => resolve({ lat: -23.55052, lng: -46.633308 }),
              2000
            )
          ), // Default: Sao Paulo after 2s
        ])
          .then((position) => position)
          .catch((e) => {
            console.error(e);
            return { lat: -23.55052, lng: -46.633308 };
          }),
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