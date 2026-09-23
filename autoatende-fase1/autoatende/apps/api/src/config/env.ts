import "dotenv/config";
import { z } from "zod";

/**
 * Todas as variáveis de ambiente da API são validadas aqui.
 * Se algo obrigatório estiver ausente ou inválido, a aplicação
 * falha imediatamente na inicialização (fail fast) em vez de
 * quebrar silenciosamente em runtime.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  HOST: z.string().default("0.0.0.0"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),

  JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter pelo menos 16 caracteres"),
  JWT_EXPIRES_IN: z.string().default("1d"),

  WEB_APP_URL: z.string().url().default("http://localhost:3000"),

  WHATSAPP_MODE: z.enum(["demo", "production"]).default("demo"),

  CREDENTIALS_ENCRYPTION_KEY: z
    .string()
    .min(32, "CREDENTIALS_ENCRYPTION_KEY deve ter pelo menos 32 caracteres"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Variáveis de ambiente inválidas:");
  // eslint-disable-next-line no-console
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
