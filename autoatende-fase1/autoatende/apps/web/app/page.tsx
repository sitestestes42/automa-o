"use client";

import { useEffect, useState } from "react";

type HealthStatus = {
  status: "ok" | "degradado";
  database: "ok" | "erro";
  timestamp: string;
};

type CheckState =
  | { kind: "loading" }
  | { kind: "success"; data: HealthStatus }
  | { kind: "error"; message: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export default function HomePage() {
  const [check, setCheck] = useState<CheckState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/health`)
      .then(async (res) => {
        const data = (await res.json()) as HealthStatus;
        if (!cancelled) setCheck({ kind: "success", data });
      })
      .catch(() => {
        if (!cancelled) {
          setCheck({
            kind: "error",
            message: "Não foi possível conectar à API. Ela está rodando (npm run dev:api)?",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="mb-10">
        <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          Fase 1 — Arquitetura e infraestrutura
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">AutoAtende</h1>
        <p className="mt-2 text-slate-600">
          Base do monorepo funcionando: frontend (Next.js), backend (Fastify) e banco
          (PostgreSQL/Prisma) conectados. O dashboard real de cadastro de empresas chega na
          Fase 2.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-500">
          Status da API
        </h2>

        {check.kind === "loading" && (
          <p className="text-slate-500">Verificando conexão com a API…</p>
        )}

        {check.kind === "error" && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {check.message}
          </div>
        )}

        {check.kind === "success" && (
          <div className="space-y-2">
            <StatusRow
              label="API"
              ok={check.data.status === "ok"}
              value={check.data.status === "ok" ? "no ar" : "degradada"}
            />
            <StatusRow
              label="Banco de dados"
              ok={check.data.database === "ok"}
              value={check.data.database === "ok" ? "conectado" : "com erro"}
            />
            <p className="pt-2 text-xs text-slate-400">
              Última verificação: {new Date(check.data.timestamp).toLocaleString("pt-BR")}
            </p>
          </div>
        )}
      </div>

      <p className="mt-8 text-sm text-slate-400">
        API base URL: <code className="rounded bg-slate-100 px-1.5 py-0.5">{API_URL}</code>
      </p>
    </main>
  );
}

function StatusRow({ label, ok, value }: { label: string; ok: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`}
        />
        {value}
      </span>
    </div>
  );
}
