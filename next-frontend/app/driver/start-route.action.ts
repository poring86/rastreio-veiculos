"use server";

import { getNestApiUrl } from "../../utils/api-url";

type StartRouteResult = { success: true } | { error: string };

export async function startRouteAction(formData: FormData | Record<string, any>): Promise<StartRouteResult> {
  let route_id: string | undefined;
  if (formData instanceof FormData) {
    const entry = Object.fromEntries(formData.entries()).route_id;
    route_id = typeof entry === "string" ? entry : undefined;
  } else if (typeof formData === "object" && formData !== null) {
    route_id = formData.route_id;
  }
  if (!route_id) return { error: "Route ID is required." };

  const apiUrl = getNestApiUrl();
  if (!apiUrl) return { error: "API URL is not configured." };

  const url = `${apiUrl}/routes/${route_id}/start`;
  try {
    const response = await fetch(url, { method: "POST" });
    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Failed to start route: ${response.status} - ${errorText}` };
    }
    return { success: true };
  } catch {
    return { error: "Failed to connect to API." };
  }
}
