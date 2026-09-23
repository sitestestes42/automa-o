import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/prisma";

/**
 * GET /health
 * Usado para checar se a API está no ar e se a conexão com o
 * PostgreSQL está funcionando. Útil para desenvolvimento e,
 * futuramente, para health checks de infraestrutura em produção.
 */
export function registerHealthRoute(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => {
    let databaseStatus: "ok" | "erro" = "ok";

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      databaseStatus = "erro";
    }

    const statusCode = databaseStatus === "ok" ? 200 : 503;

    return reply.status(statusCode).send({
      status: databaseStatus === "ok" ? "ok" : "degradado",
      database: databaseStatus,
      timestamp: new Date().toISOString(),
    });
  });
}
