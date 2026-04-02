"use server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function startRouteAction(state: any, formData: FormData) {
  const { route_id } = Object.fromEntries(formData);

  if(!route_id){
    return { error: "Route ID is required" };
  }

  const url = `${process.env.NEST_API_URL}/routes/${route_id}/start`;
  console.log('Fetching:', url);
  const response = await fetch(
    url,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Response Error:', response.status, errorText);
    return { error: `Failed to start route: ${response.status}` };
  }

  return { success: true };
}
