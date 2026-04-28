import Link from "next/link";
import { MapDriver } from "./MapDriver";
import { StartRouteForm } from "./StartRouteForm";
import { getNestApiUrl } from "../../utils/api-url";
import { RouteSelectWithButton } from "./RouteSelectWithButton";

export async function getRoutes() {
  const apiUrl = getNestApiUrl();
  console.log("[DEBUG] apiUrl:", apiUrl);
  if (!apiUrl) throw new Error("API URL is not configured");
  const response = await fetch(`${apiUrl}/routes`, {
    cache: "force-cache",
    next: {
      tags: ["routes"],
    },
  });
  return response.json();
}

export async function DriverPage() {
  const routes = await getRoutes();

  return (
    <div className="flex flex-1 w-full h-full min-h-0">
      <div className="w-1/3 p-6 h-full overflow-y-auto bg-card shadow-xl z-10 border-r border-border">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h4 className="text-2xl font-extrabold text-default mb-2">Painel do Motorista</h4>
            <p className="text-muted text-sm">Selecione uma rota abaixo para iniciar o rastreio em tempo real.</p>
          </div>
          <Link href="/" className="mt-1 p-2 rounded-lg bg-background border border-border text-muted hover:text-main hover:border-main transition-all shadow-sm group" title="Voltar para o Início">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
          </Link>
        </div>

        <div className="flex flex-col">
          <StartRouteForm>
            <RouteSelectWithButton routes={routes} />
          </StartRouteForm>
        </div>

        <div className="mt-12 p-6 bg-card rounded-2xl border border-dashed border-border">
          <h5 className="text-sm font-bold text-muted uppercase mb-4 text-center">Instruções de Uso</h5>
          <ul className="text-xs text-muted/60 space-y-3 font-medium">
            <li className="flex items-start space-x-2">
              <span className="text-main">•</span>
              <span>Selecione a rota desejada na lista acima e confira o valor do frete.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-main">•</span>
              <span>Clique em "VAMOS LÁ" para iniciar o rastreamento em tempo real pelo mapa.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-main">•</span>
              <span>Sua localização será compartilhada automaticamente com a central durante todo o trajeto.</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 h-full min-h-0 container-map">
        <MapDriver routeIdElementId={"route_id"} />
      </div>
    </div>
  );
}

export default DriverPage;
