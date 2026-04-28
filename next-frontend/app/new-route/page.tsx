"use client";
import Link from "next/link";
import { MapNewRoute } from "./MapNewRoute";
import { NewRouteForm } from "./NewRouteForm";
import { getNestApiUrl } from "../../utils/api-url";
import { useState } from "react";
import { RouteModel } from "../../utils/models";

export async function searchDirections(source: string, destination: string) {
  console.log(source, destination);
  const apiUrl = getNestApiUrl();
  if (!apiUrl) throw new Error("API URL is not configured");
  const [sourceResponse, destinationResponse] = await Promise.all([
    fetch(`${apiUrl}/places?text=${source}`, {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }),
    fetch(`${apiUrl}/places?text=${destination}`, {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }),
  ]);

  if (!sourceResponse.ok) {
    console.error(await sourceResponse.text());
    throw new Error("Failed to fetch source data");
  }

  if (!destinationResponse.ok) {
    console.error(await destinationResponse.text());
    throw new Error("Failed to fetch destination data");
  }

  const [sourceData, destinationData] = await Promise.all([
    sourceResponse.json(),
    destinationResponse.json(),
  ]);

  const placeSourceId = sourceData.candidates[0].place_id;
  const placeDestinationId = destinationData.candidates[0].place_id;

  const directionsResponse = await fetch(
    `${process.env.NEST_API_URL}/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`,
    {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // },
    }
  );

  if (!directionsResponse.ok) {
    console.error(await directionsResponse.text());
    throw new Error("Failed to fetch directions");
  }

  const directionsData = await directionsResponse.json();

  return {
    directionsData,
    placeSourceId,
    placeDestinationId,
  };
}


export default function NewRoutePageWrapper(props: any) {
  const [route, setRoute] = useState<RouteModel | null>(null);
  const [directionsData, setDirectionsData] = useState<any>(null);
  const [placeSourceId, setPlaceSourceId] = useState<string | null>(null);
  const [placeDestinationId, setPlaceDestinationId] = useState<string | null>(null);

  // Função para buscar rota pelo ID
  async function fetchRouteById(routeId: string) {
    const apiUrl = getNestApiUrl();
    const response = await fetch(`${apiUrl}/routes/${routeId}`);
    if (response.ok) {
      const data = await response.json();
      setRoute(data);
    }
  }

  // Função chamada após criar rota
  async function handleRouteCreated(routeId: string) {
    await fetchRouteById(routeId);
  }

  // Renderização da interface
  return (
    <div className="flex flex-1 w-full h-full min-h-0">
      <div className="w-1/3 p-6 h-full overflow-y-auto bg-card shadow-xl z-10 border-r border-border">
        {/* ...existing code... */}
        {/* Exibe o formulário de criação de rota se nenhuma rota foi criada ainda */}
        {!route && (
          <div>
            <h4 className="text-2xl font-extrabold text-default mb-2">Nova Rota</h4>
            <p className="text-muted text-sm mb-6">Preencha os detalhes para calcular o frete e criar um novo trajeto.</p>
            <NewRouteForm />
          </div>
        )}
        {/* Exibe o resumo da rota criada, incluindo o frete */}
        {route && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-6 bg-card rounded-2xl border border-border space-y-4">
              <div className="flex flex-col space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted font-bold">Resumo da Rota</span>
                <p className="text-sm font-medium text-default leading-relaxed">
                  De: <span className="text-muted font-normal">{route.source.name}</span>
                </p>
                <p className="text-sm font-medium text-default leading-relaxed">
                  Para: <span className="text-muted font-normal">{route.destination.name}</span>
                </p>
              </div>
              <div className="flex space-x-8 pt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted uppercase font-bold">Distância</span>
                  <span className="text-lg font-extrabold text-main">{route.distance} m</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted uppercase font-bold">Duração</span>
                  <span className="text-lg font-extrabold text-main">{route.duration} s</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted uppercase font-bold">Frete</span>
                  <span className="text-lg font-extrabold text-main">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.freight ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ...existing code... */}
      </div>
      <div className="flex-1 h-full min-h-0 container-map">
        <MapNewRoute directionsData={directionsData} />
      </div>
    </div>
  );
}
