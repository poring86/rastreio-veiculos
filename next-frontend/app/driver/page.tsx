import Link from "next/link";
import { RouteModel } from "../../utils/models";
import { MapDriver } from "./MapDriver";
import { StartRouteForm } from "./StartRouteForm";

export async function getRoutes() {
  const response = await fetch(`${process.env.NEST_API_URL}/routes`, {
    cache: "force-cache",
    next: {
      tags: ["routes"],
    },
  });
  //revalidate por demanda
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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
        </div>
        
        <div className="flex flex-col">
          <StartRouteForm>
            <div className="relative mb-6">
              <label htmlFor="route_id" className="block text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-1">
                Rota Disponível
              </label>
              <select
                id="route_id"
                name="route_id"
                className="w-full p-4 bg-background border border-border rounded-xl text-default font-medium focus:border-main focus:ring-1 focus:ring-main outline-none appearance-none transition-all cursor-pointer h-14"
              >
                <option key="0" value="">
                  Clique para selecionar...
                </option>
                {routes.map((route: RouteModel) => (
                  <option key={route.id} value={route.id}>
                    {route.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.freight ?? 0)}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-[3rem] pointer-events-none text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            
            <button
              className="w-full bg-main text-white py-4 rounded-xl text-lg font-bold shadow-glow hover:bg-accent transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              <span>VAMOS LÁ</span>
            </button>
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
