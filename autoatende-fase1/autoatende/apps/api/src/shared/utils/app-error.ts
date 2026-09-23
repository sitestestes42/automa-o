/**
 * Erro de aplicação com status HTTP semântico.
 * Módulos de negócio devem lançar AppError em vez de Error genérico,
 * assim o handler global consegue responder com o status correto.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }

  static notFound(message = "Recurso não encontrado") {
    return new AppError(message, 404);
  }

  static unauthorized(message = "Não autorizado") {
    return new AppError(message, 401);
  }

  static forbidden(message = "Acesso negado") {
    return new AppError(message, 403);
  }

  static conflict(message = "Conflito de dados") {
    return new AppError(message, 409);
  }
}
