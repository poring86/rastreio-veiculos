"use server";

import { revalidateTag } from "next/cache";
import { getNestApiUrl } from "../../utils/api-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRouteAction(state: any, formData: FormData) {
  const { source, destination } = Object.fromEntries(formData);
  const apiUrl = getNestApiUrl();

  // Buscar place_id da origem
  const sourceRes = await fetch(`${apiUrl}/places?text=${encodeURIComponent(source as string)}`);
  if (!sourceRes.ok) {
    console.error(await sourceRes.text());
    return { error: "Falha ao buscar place_id da origem" };
  }
  const sourceData = await sourceRes.json();
  const placeSourceId = sourceData.candidates[0]?.place_id;
  if (!placeSourceId) return { error: "Endereço de origem não encontrado" };

  // Buscar place_id do destino
  const destRes = await fetch(`${apiUrl}/places?text=${encodeURIComponent(destination as string)}`);
  if (!destRes.ok) {
    console.error(await destRes.text());
    return { error: "Falha ao buscar place_id do destino" };
  }
  const destData = await destRes.json();
  const placeDestinationId = destData.candidates[0]?.place_id;
  if (!placeDestinationId) return { error: "Endereço de destino não encontrado" };

  // Buscar direções
  const directionsResponse = await fetch(
    `${apiUrl}/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`,
  );
  if (!directionsResponse.ok) {
    console.error(await directionsResponse.text());
    return { error: "Failed to fetch directions" };
  }
  const directionsData = await directionsResponse.json();
  const startAddress = directionsData.routes[0].legs[0].start_address;
  const endAddress = directionsData.routes[0].legs[0].end_address;

  // Criar rota
  const response = await fetch(`${apiUrl}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${startAddress} - ${endAddress}`,
      source_id: placeSourceId,
      destination_id: placeDestinationId,
    }),
  });
  if (!response.ok) {
    console.error(await response.text());
    return { error: "Failed to create route" };
  }

  revalidateTag("routes");
  return { success: true };
}
