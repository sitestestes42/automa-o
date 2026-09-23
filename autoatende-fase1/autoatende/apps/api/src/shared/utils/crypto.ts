import crypto from "node:crypto";
import { env } from "../../config/env";

/**
 * Criptografia simétrica (AES-256-GCM) usada para armazenar no banco
 * qualquer credencial sensível de integrações (n8n, WhatsApp, IA).
 *
 * IMPORTANTE:
 * - A chave vem de CREDENTIALS_ENCRYPTION_KEY (variável de ambiente),
 *   nunca do código-fonte.
 * - Nada é logado em texto puro.
 * - Estas funções ainda não são chamadas na Fase 1 (não há credenciais
 *   reais a proteger ainda), mas ficam prontas para as Fases 7-9.
 */

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  // Deriva uma chave de 32 bytes a partir da variável de ambiente,
  // independentemente do tamanho exato informado.
  return crypto.createHash("sha256").update(env.CREDENTIALS_ENCRYPTION_KEY).digest();
}

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Formato: iv:authTag:conteudoCriptografado (tudo em base64)
  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(
    ":",
  );
}

export function decryptSecret(payload: string): string {
  const [ivB64, authTagB64, dataB64] = payload.split(":");
  if (!ivB64 || !authTagB64 || !dataB64) {
    throw new Error("Formato de credencial criptografada inválido");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(authTagB64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Mascara um token para exibição segura na interface
 * (ex: "sk_live_1234567890" -> "sk_l••••••••7890")
 */
export function maskSecret(value: string): string {
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}${"•".repeat(8)}${value.slice(-4)}`;
}
