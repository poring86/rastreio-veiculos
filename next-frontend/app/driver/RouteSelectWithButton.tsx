"use client";

import { RouteModel } from "../../utils/models";

export function RouteSelectWithButton({ routes }: { routes: RouteModel[] }) {
  return (
    <>
      <div className="relative mb-6">
        <label htmlFor="route_id" className="block text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-1">
          Rota Disponível
        </label>
        <select
          id="route_id"
          name="route_id"
          required
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-main text-white py-4 rounded-xl text-lg font-bold shadow-glow hover:bg-accent transition-all active:scale-95 flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        <span>VAMOS LÁ</span>
      </button>
    </>
  );
}
