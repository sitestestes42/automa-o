import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import { env } from "./config/env";
import { registerErrorHandler } from "./shared/plugins/error-handler";
import { registerHealthRoute } from "./shared/plugins/health-route";

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
    origin: [env.WEB_APP_URL],
    credentials: true,
  });

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
