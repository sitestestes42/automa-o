import "@fastify/jwt";

// Formato do payload que será assinado no JWT a partir da Fase 2 (módulo de auth)
interface JwtPayload {
  sub: string; // id do usuário
  empresasIds: string[]; // empresas que o usuário pode acessar (multi-tenant)
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
