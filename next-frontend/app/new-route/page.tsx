import Link from "next/link";
import { MapNewRoute } from "./MapNewRoute";
import { NewRouteForm } from "./NewRouteForm";

export async function searchDirections(source: string, destination: string) {
  console.log(source, destination);
  const [sourceResponse, destinationResponse] = await Promise.all([
    fetch(`${process.env.NEST_API_URL}/places?text=${source}`, {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }),
    fetch(`${process.env.NEST_API_URL}/places?text=${destination}`, {
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

export async function NewRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ source: string; destination: string }>;
}) {
  const { source, destination } = await searchParams;

  const result =
    source && destination ? await searchDirections(source, destination) : null;
  let directionsData = null;
  let placeSourceId = null;
  let placeDestinationId = null;

  if (result) {
    directionsData = result.directionsData;
    placeSourceId = result.placeSourceId;
    placeDestinationId = result.placeDestinationId;
  }

  return (
    <div className="flex flex-1 w-full h-full min-h-0">
      <div className="w-1/3 p-6 h-full overflow-y-auto bg-card shadow-xl z-10 border-r border-border">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h4 className="text-2xl font-extrabold text-default mb-2">Nova Rota</h4>
            <p className="text-muted text-sm">Preencha os detalhes para calcular o frete e criar um novo trajeto.</p>
          </div>
          <Link href="/" className="mt-1 p-2 rounded-lg bg-background border border-border text-muted hover:text-main hover:border-main transition-all shadow-sm group" title="Voltar para o Início">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
        </div>
        
        <form className="flex flex-col space-y-6" method="get">
          <div className="relative group">
            <input
              id="source"
              name="source"
              type="search"
              placeholder=""
              defaultValue={source}
              className="block rounded-xl px-4 pb-2.5 pt-6 w-full text-sm text-default bg-background border border-border focus:border-main focus:ring-1 focus:ring-main outline-none transition-all peer h-14"
            />
            <label
              htmlFor="source"
              className="absolute text-muted duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-main peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Origem
            </label>
          </div>
          <div className="relative group">
            <input
              id="destination"
              name="destination"
              type="search"
              placeholder=""
              defaultValue={destination}
              className="block rounded-xl px-4 pb-2.5 pt-6 w-full text-sm text-default bg-background border border-border focus:border-main focus:ring-1 focus:ring-main outline-none transition-all peer h-14"
            />
            <label
              htmlFor="destination"
              className="absolute text-muted duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-main peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Destino
            </label>
          </div>
          <button
            type="submit"
            className="bg-main text-white py-3 rounded-xl text-lg font-bold shadow-glow hover:bg-accent transition-all active:scale-95"
          >
            Pesquisar Trajeto
          </button>
        </form>
        
        {directionsData && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="p-6 bg-card rounded-2xl border border-border space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs uppercase tracking-wider text-muted font-bold">Resumo da Rota</span>
                  <p className="text-sm font-medium text-default leading-relaxed">
                    De: <span className="text-muted font-normal">{directionsData.routes[0].legs[0].start_address}</span>
                  </p>
                  <p className="text-sm font-medium text-default leading-relaxed">
                    Para: <span className="text-muted font-normal">{directionsData.routes[0].legs[0].end_address}</span>
                  </p>
                </div>
                
                <div className="flex space-x-8 pt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted uppercase font-bold">Distância</span>
                    <span className="text-lg font-extrabold text-main">{directionsData.routes[0].legs[0].distance.text}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted uppercase font-bold">Duração</span>
                    <span className="text-lg font-extrabold text-main">{directionsData.routes[0].legs[0].duration.text}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted uppercase font-bold">Frete</span>
                    <span className="text-lg font-extrabold text-main">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            Math.floor((directionsData.routes[0].legs[0].distance.value * 0.15 + 0.3) * 100) / 100
                        )}
                    </span>
                  </div>
                </div>

                <NewRouteForm>
                  {placeSourceId && (
                    <input
                      type="hidden"
                      name="sourceId"
                      defaultValue={placeSourceId}
                    />
                  )}
                  {placeDestinationId && (
                    <input
                      type="hidden"
                      name="destinationId"
                      defaultValue={placeDestinationId}
                    />
                  )}
                  <button
                    type="submit"
                    className="w-full bg-default text-white font-bold py-3 rounded-xl mt-4 hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                  >
                    Confirmar e Salvar Rota
                  </button>
                </NewRouteForm>
             </div>
          </div>
        )}
      </div>
      <div className="flex-1 h-full min-h-0 container-map">
        <MapNewRoute directionsData={directionsData} />
      </div>
    </div>
  );
}

export default NewRoutePage;
