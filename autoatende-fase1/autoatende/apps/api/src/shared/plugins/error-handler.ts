import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";

/**
 * Handler global de erros. Garante que:
 * - erros de validação (Zod) retornem 400 com detalhes úteis
 * - erros de negócio (AppError) retornem o status correto
 * - erros inesperados nunca vazem stack trace/detalhes internos ao cliente
 * - tudo é logado no servidor, nada sensível é logado
 */
export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      request.log.warn({ err: error }, "Erro de validação");
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Dados inválidos na requisição.",
        details: error.flatten(),
      });
    }

    if (error instanceof AppError) {
      request.log.warn({ err: error }, error.message);
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
        details: error.details,
      });
    }

    // Erro não tratado: loga completo no servidor, resposta genérica ao cliente
    request.log.error({ err: error }, "Erro não tratado");
    return reply.status(500).send({
      error: "INTERNAL_SERVER_ERROR",
      message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
    });
  });

  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: "NOT_FOUND",
      message: `Rota ${request.method} ${request.url} não encontrada.`,
    });
  });
}
