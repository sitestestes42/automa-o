import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import { env } from "./config/env";
import { registerErrorHandler } from "./shared/plugins/error-handler";
import { registerHealthRoute } from "./shared/plugins/health-route";

/**
 * Remove barra(s) finais de uma URL, para que "https://x.com/" e
 * "https://x.com" sejam tratados como a mesma origem.
 */
function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/**
 * Cria a função de validação de origem usada pelo @fastify/cors.
 *
 * Por que uma função em vez de uma lista fixa de strings:
 * o valor de WEB_APP_URL (vindo de variável de ambiente) pode ter uma
 * barra final, espaço em branco, ou diferença de maiúsculas/minúsculas
 * em relação ao header `Origin` que o navegador envia — uma comparação
 * de igualdade exata falha nesses casos e o CORS bloqueia a requisição
 * silenciosamente (o navegador nunca entrega a resposta ao JS, então
 * o fetch cai direto no catch, parecendo "API fora do ar").
 *
 * Também aceita múltiplas origens em WEB_APP_URL separadas por vírgula,
 * útil para permitir o domínio de produção e domínios de preview do
 * Vercel ao mesmo tempo, sem abrir CORS para qualquer origem.
 */
function buildCorsOriginChecker(webAppUrl: string) {
  const allowedOrigins = webAppUrl
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  return (
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Requisições sem header Origin (ex: curl, health checks server-to-server)
    // não são chamadas de navegador cross-origin: permitidas.
    if (!requestOrigin) {
      callback(null, true);
      return;
    }

    const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
    const isAllowed = allowedOrigins.includes(normalizedRequestOrigin);

    if (!isAllowed) {
      // eslint-disable-next-line no-console
      console.warn(
        `[CORS] Origem rejeitada: "${normalizedRequestOrigin}". Permitidas: ${allowedOrigins.join(", ")}`,
      );
    }

    callback(null, isAllowed);
  };
}

/**
 * Cria e configura a instância do Fastify.
 * Separado de server.ts para permitir testes de integração
 * (instanciar o app sem subir a porta de rede).
 */
export async function buildApp() {
  const app = Fastify({
    logger:
      env.NODE_ENV === "development"
        ? {
            level: "info",
            transport: {
              target: "pino-pretty",
              options: { translateTime: "HH:MM:ss", ignore: "pid,hostname" },
            },
          }
        : { level: "info" },
  });

  await app.register(sensible);

  await app.register(cors, {
    origin: buildCorsOriginChecker(env.WEB_APP_URL),
    credentials: true,
  });

  // Log de diagnóstico: mostra exatamente qual(is) origem(ns) o CORS
  // está aceitando neste processo, no momento em que ele sobe. Útil para
  // confirmar, direto nos logs do Railway/Vercel, se a variável de
  // ambiente configurada no painel realmente chegou até o processo em
  // execução (evita depender de "achismo" quando o navegador reporta
  // erro de CORS).
  app.log.info(`🔐 CORS habilitado para: ${env.WEB_APP_URL}`);

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_EXPIRES_IN },
  });

  registerErrorHandler(app);
  registerHealthRoute(app);

  // ------------------------------------------------------------
  // A partir daqui, cada módulo registra suas próprias rotas.
  // Nas Fases 2+ isso vira, por exemplo:
  //   await app.register(empresasRoutes, { prefix: "/api/empresas" });
  //   await app.register(authRoutes, { prefix: "/api/auth" });
  // Na Fase 1 os módulos existem apenas como estrutura de pastas
  // (ver src/modules/*), sem rotas ainda.
  // ------------------------------------------------------------

  return app;
}
