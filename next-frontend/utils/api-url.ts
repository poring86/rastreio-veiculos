// Centraliza a escolha da URL da API para SSR e browser
export function getNestApiUrl() {
  const isServer = typeof window === "undefined";
  return isServer
    ? process.env.NEST_API_URL
    : process.env.NEXT_PUBLIC_NEST_API_URL;
}
