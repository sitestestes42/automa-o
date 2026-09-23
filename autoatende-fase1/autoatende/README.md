# AutoAtende

Plataforma para criar automações de atendimento (WhatsApp) para pequenas empresas sem
precisar programar do zero.

Este é o estado da **Fase 1**: arquitetura, monorepo e infraestrutura básica funcionando
(banco de dados, backend Fastify e frontend Next.js conectados). Nenhuma regra de negócio
(cadastro de empresa, wizard, simulador, WhatsApp, n8n, IA) foi implementada ainda —
isso vem nas próximas fases.

## Estrutura do projeto

```
autoatende/
├── apps/
│   ├── web/          # Frontend (Next.js + TypeScript + Tailwind)
│   └── api/           # Backend (Fastify + TypeScript + Prisma)
├── packages/
│   ├── shared/         # Tipos/DTOs compartilhados entre web e api
│   └── config/          # tsconfig e eslint base compartilhados
└── docker-compose.yml   # PostgreSQL para desenvolvimento local
```

## Pré-requisitos

- Node.js 20 ou superior
- Docker e Docker Compose (para o banco de dados local)

## Como rodar (primeira vez)

### 1. Subir o banco de dados

```bash
docker compose up -d
```

Isso inicia um PostgreSQL em `localhost:5432` com usuário/senha/banco `autoatende`
(veja `docker-compose.yml`). Os dados persistem em um volume Docker entre reinícios.

### 2. Instalar as dependências

Na raiz do monorepo (isso instala tudo — web, api e pacotes compartilhados — de uma vez,
graças aos workspaces do npm):

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Os valores padrão do `.env.example` da API já funcionam com o `docker-compose.yml` acima
para desenvolvimento local. **Antes de qualquer uso além do seu próprio computador**, troque
`JWT_SECRET` e `CREDENTIALS_ENCRYPTION_KEY` por valores fortes (ex: `openssl rand -hex 32`).

### 4. Rodar as migrations do Prisma

```bash
npm run prisma:migrate --workspace=apps/api
```

Isso cria as tabelas no banco a partir de `apps/api/prisma/schema.prisma`. Na primeira vez,
o Prisma vai pedir um nome para a migration (ex: `init`).

(Opcional) Popular o banco com uma empresa de teste, para confirmar que tudo está
funcionando:

```bash
npm run prisma:seed --workspace=apps/api
```

### 5. Rodar a API e o frontend

Em dois terminais separados:

```bash
# Terminal 1 — API (http://localhost:3333)
npm run dev:api

# Terminal 2 — Frontend (http://localhost:3000)
npm run dev:web
```

Abra `http://localhost:3000`. A página deve mostrar "API: no ar" e "Banco de dados:
conectado" — isso confirma que a Fase 1 está funcionando de ponta a ponta.

## Como testar manualmente

- **Health check da API**: `curl http://localhost:3333/health` deve responder
  `{"status":"ok","database":"ok",...}`.
- **Prisma Studio** (explorar o banco visualmente):
  `npm run prisma:studio --workspace=apps/api`, abre em `http://localhost:5555`.

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run dev:api` | Roda a API em modo desenvolvimento (com watch) |
| `npm run dev:web` | Roda o frontend em modo desenvolvimento |
| `npm run build` | Build de produção de api + web |
| `npm run prisma:migrate --workspace=apps/api` | Cria/aplica migrations do banco |
| `npm run prisma:studio --workspace=apps/api` | Abre o Prisma Studio |
| `npm run lint` | Roda o ESLint em api e web |
| `docker compose down` | Para o banco (mantém os dados) |
| `docker compose down -v` | Para o banco e **apaga os dados** |

## Próximas fases

- **Fase 2**: Dashboard + cadastro de empresas
- **Fase 3**: Wizard de configuração (7 etapas)
- **Fase 4**: Motor de automação
- **Fase 5**: Simulador de conversa
- **Fase 6**: Leads e histórico
- **Fase 7**: Integração n8n
- **Fase 8**: Integração WhatsApp Business Platform / Cloud API
- **Fase 9**: IA
- **Fase 10**: Preparação para produção
