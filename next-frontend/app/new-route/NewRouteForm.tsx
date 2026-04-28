"use client";

import { PropsWithChildren, useActionState } from "react";
import { createRouteAction } from "./create-route.action";

export function NewRouteForm(props: PropsWithChildren) {
  const [state, formAction] = useActionState<
    {
      error?: string;
      success?: boolean;
    } | null,
    FormData
  >(createRouteAction, null);
  return (
    <form action={formAction} className="flex flex-col space-y-6">
      {state?.error && (
        <div className="p-4 border rounded text-contrast bg-error">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-4 border rounded text-contrast bg-success">
          Rota criada com sucesso!
        </div>
      )}
      <div className="flex flex-col space-y-2">
        <label htmlFor="source" className="text-muted text-sm font-bold mb-1">Origem (endereço)</label>
        <input
          id="source"
          name="source"
          type="text"
          placeholder="Digite o endereço de origem"
          className="block rounded-xl px-4 py-3 w-full text-sm text-default bg-background border border-border focus:border-main focus:ring-1 focus:ring-main outline-none"
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="destination" className="text-muted text-sm font-bold mb-1">Destino (endereço)</label>
        <input
          id="destination"
          name="destination"
          type="text"
          placeholder="Digite o endereço de destino"
          className="block rounded-xl px-4 py-3 w-full text-sm text-default bg-background border border-border focus:border-main focus:ring-1 focus:ring-main outline-none"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-main text-white py-3 rounded-xl text-lg font-bold shadow-glow hover:bg-accent transition-all active:scale-95"
      >
        Criar Rota
      </button>
    </form>
  );
}
