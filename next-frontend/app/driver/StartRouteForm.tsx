"use client";

import { PropsWithChildren, useActionState } from "react";
import { startRouteAction } from "./start-route.action";

export function StartRouteForm(props: PropsWithChildren) {
  // Wrapper para adaptar a assinatura esperada pelo useActionState
  const actionStateWrapper = async (_state: any, formData: FormData) => {
    return await startRouteAction(formData);
  };

  const [state, formAction] = useActionState<
    {
      error?: string;
      success?: boolean;
    } | null,
    FormData
  >(actionStateWrapper, null);

  return (
    <form action={formAction} className="flex flex-col space-y-4" noValidate>
      {state?.error && (
        <div className="p-4 border rounded text-contrast bg-error">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-4 border rounded text-contrast bg-success">
          Rota iniciada com sucesso!
        </div>
      )}
      {props.children}
    </form>
  );
}
