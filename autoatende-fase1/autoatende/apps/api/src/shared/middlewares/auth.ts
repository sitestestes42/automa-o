import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../utils/app-error";

/**
 * Middleware de autenticação. Espera um Bearer token JWT válido
 * (emitido pelo módulo de auth na Fase 2) no header Authorization.
 *
 * Uso em uma rota protegida:
 *   app.get("/rota", { preHandler: [requireAuth] }, handler)
 */
export async function requireAuth(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    throw AppError.unauthorized("Token de autenticação ausente ou inválido.");
  }
}
