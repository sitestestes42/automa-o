import { env } from "./config/env";
import { buildApp } from "./app";
import { prisma } from "./config/prisma";

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`🚀 AutoAtende API rodando em http://${env.HOST}:${env.PORT}`);
    app.log.info(`🩺 Health check: http://localhost:${env.PORT}/health`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }

  const shutdown = async (signal: string) => {
    app.log.info(`Recebido ${signal}, encerrando graciosamente...`);
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main();
