/**
 * Fonte única de verdade para a URL base da API.
 *
 * Por que centralizar aqui em vez de ler process.env.NEXT_PUBLIC_API_URL
 * direto em cada componente: evita barras duplicadas/faltantes (ex:
 * "https://api.com/" + "/health" = "https://api.com//health") e garante
 * que, se essa variável não estiver definida, todo o app caia no mesmo
 * fallback local (http://localhost:3333) em vez de cada arquivo inventar
 * o seu próprio.
 */
export function getApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
  // remove barra(s) finais para evitar "//" ao concatenar um path depois
  return raw.trim().replace(/\/+$/, "");
}

/**
 * Monta uma URL completa da API a partir de um path relativo,
 * sempre com exatamente uma barra entre a base e o path.
 *
 * getApiEndpoint("/health") -> "https://api.exemplo.com/health"
 * getApiEndpoint("health")  -> "https://api.exemplo.com/health"
 */
export function getApiEndpoint(path: string): string {
  const base = getApiUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
